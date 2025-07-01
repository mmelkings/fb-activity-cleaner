const puppeteer = require('puppeteer');
require('dotenv').config();

// Utilidad para crear delays
async function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// Configuración del navegador
async function initializeBrowser() {
  console.log('🚀 Iniciando el proceso de limpieza...');
  return await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    channel: 'chrome',
    userDataDir: './chrome-data',
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  });
}

// Procesar botón de acción encontrado
async function handleActionButton(page, result, counters) {
  switch (result.type) {
    case 'unlike':
      console.log('🎯 Encontrado botón "Ya no me gusta"');
      await result.button.click();
      await delay(300);
      counters.unliked++;
      console.log(`📊 Total de "Ya no me gusta": ${counters.unliked}`);
      break;
      
    case 'untag':
      console.log('🎯 Encontrado botón "Eliminar etiqueta"');
      await result.button.click();
      await delay(300);
      await handleConfirmationButton(page, 'Eliminar');
      counters.untagged++;
      console.log(`📊 Total de etiquetas eliminadas: ${counters.untagged}`);
      break;
      
    case 'delete':
      console.log('🎯 Encontrado botón "Eliminar"');
      await result.button.click();
      await delay(300);
      await handleConfirmationButton(page, 'Eliminar');
      counters.deleted++;
      console.log(`📊 Total de elementos eliminados: ${counters.deleted}`);
      break;

    case 'trash':
      console.log('🎯 Encontrado botón "Mover a la papelera"');
      await result.button.click();
      await delay(300);
      await handleConfirmationButton(page, 'Mover a la papelera');
      counters.trashed++;
      console.log(`📊 Total de elementos movidos a la papelera: ${counters.trashed}`);
      break;
  }
  
  counters.total = counters.unliked + counters.untagged + counters.deleted + counters.trashed;
  console.log(`📊 Total de acciones realizadas: ${counters.total}`);
}

// Manejar botón de confirmación
async function handleConfirmationButton(page, buttonText) {
  const confirmButton = await page.waitForXPath(`//div[@role="button"]//span[contains(text(), "${buttonText}")]`, {
    visible: true,
    timeout: 3000
  });

  if (confirmButton) {
    await confirmButton.click();
    console.log('✅ Elemento eliminado correctamente');
    await delay(500);
  }
}

// Procesar menú de opciones
async function processOptionsMenu(page, menuButton, counters) {
  try {
    await page.evaluate(el => {
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
    }, menuButton);
    await delay(300);

    await menuButton.click();
    await delay(300);

    const buttonPromises = [
      page.waitForXPath('//span[text()="Eliminar"]', {
        visible: true,
        timeout: 3000
      }).then(button => ({ type: 'delete', button })),
      page.waitForXPath('//span[text()="Ya no me gusta"]', {
        visible: true,
        timeout: 3000
      }).then(button => ({ type: 'unlike', button })),
      page.waitForXPath('//span[text()="Eliminar etiqueta"]', {
        visible: true,
        timeout: 3000
      }).then(button => ({ type: 'untag', button })),
      page.waitForXPath('//span[text()="Mover a la papelera"]', {
        visible: true,
        timeout: 3000
      }).then(button => ({ type: 'trash', button }))
    ];

    const result = await Promise.race(buttonPromises);
    await handleActionButton(page, result, counters);

  } catch (e) {
    console.log('⚠️ No se encontró ningún botón de acción');
    await page.keyboard.press('Escape');
    await delay(200);
  }
}

// Función principal de scroll y eliminación
async function scrollAndDelete(page, counters) {
  let lastHeight = await page.evaluate('document.documentElement.scrollHeight');

  while (true) {
    try {
      const menuButtons = await page.$$('div[aria-label="Más opciones"]');
      console.log(`🔍 Encontrados ${menuButtons?.length || 0} botones de menú`);
      await page.evaluate('window.scrollBy(0, 1600)');
      await delay(1000);
      
      for (const menuButton of menuButtons) {
        try {
          await processOptionsMenu(page, menuButton, counters);
        } catch (e) {
          console.log('⚠️ Error al procesar un botón de menú:', e.message);
          try {
            await page.keyboard.press('Escape');
            await delay(200);
          } catch (escError) {}
          continue;
        }
      }

      await page.evaluate('window.scrollBy(0, 1600)');
      await delay(1000);
      console.log(`📜 Scroll hacia abajo`);

      const newHeight = await page.evaluate('document.documentElement.scrollHeight');
      
      if (newHeight !== lastHeight) {
        lastHeight = newHeight;
        console.log('📜 Nuevo contenido cargado, continuando...');
      }
    } catch (error) {
      console.error('❌ Error durante el scroll:', error.message);
    }
  }
}

// Función principal
async function cleanFacebookActivity() {
  let browser;
  try {
    browser = await initializeBrowser();
    
    const pages = await browser.pages();
    const page = pages[0] || await browser.newPage();
    
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(30000);

    console.log('📍 Navegando a la página de actividad...');
    await page.goto('https://www.facebook.com/{FB_ID}/allactivity?activity_history=false&category_key=YOURACTIVITYPOSTSSCHEMA&manage_mode=false&should_load_landing_page=false&year={YEAR}', { 
      waitUntil: 'networkidle0',
      timeout: 60000 
    });
    await delay(1000);

    const counters = {
      unliked: 0,
      untagged: 0,
      deleted: 0,
      trashed: 0,
      total: 0
    };

    await scrollAndDelete(page, counters);
    
  } catch (error) {
    console.error('❌ Error durante el proceso:', error);
  } finally {
    if (browser) {
      console.log('Cerrando el navegador...');
      try {
        await browser.close();
      } catch (e) {
        console.error('Error al cerrar el navegador:', e.message);
      }
    }
  }
}

// Ejecutar el script
cleanFacebookActivity(); 