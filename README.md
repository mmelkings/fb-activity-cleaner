# 🧹 Facebook Activity Cleaner

<p align="center">
  <img src="logo.png" alt="Facebook Activity Cleaner Logo" width="200"/>
</p>

[English version here](README_EN.md)

¿Te da flojera borrar uno por uno tus posts viejos, likes random o etiquetas del pasado en Facebook? Este script lo hace por ti de forma automática, permitiéndote eliminar automáticamente publicaciones, me gusta, etiquetas y otros elementos de tu historial de actividad.

## 🚀 Características

- Elimina automáticamente publicaciones antiguas
- Quita "me gusta" que ya no te representan
- Elimina etiquetas en publicaciones
- Mueve elementos a la papelera
- Funciona con diferentes tipos de actividad y años
- Automatiza todo en un navegador visible (sin magia oscura)

## 📋 ¿Qué necesitas?

- Node.js (versión 14 o superior)
- npm (viene con Node.js)
- Google Chrome instalado
- Una cuenta de Facebook (obvio)

## 🛠️ Instalación

1. Clona este repositorio:
```bash
git clone https://github.com/mmelkings/fb-activity-cleaner
cd fb-cleaner
```

2. Instala las dependencias:
```bash
npm install
```

## 📝 Antes de correrlo

Un par de cosas que debes hacer antes de darle play:

1. Abre Google Chrome y asegúrate de iniciar sesión en Facebook
   - Este paso es crucial ya que el script utilizará tu sesión de Chrome

2. Obtén la URL de la actividad que deseas limpiar:
   - Ve a tu perfil de Facebook
   - Haz clic en "Registro de actividad"
   - Usa los filtros para seleccionar:
     - El año específico que deseas limpiar
     - El tipo de actividad (posts, me gusta, etc.)
   - Copia la URL que aparece en tu navegador, debe verse algo asi: `https://www.facebook.com/{MY_ID}/allactivity?activity_history=false&category_key=YOURACTIVITYPOSTSSCHEMA&manage_mode=false&should_load_landing_page=false&year={YEAR}`

3. Modifica el archivo `src/index.js`:
   - Busca la línea que contiene `page.goto`
   - Reemplaza la URL existente con la que copiaste

## ▶️ Uso

1. Ejecuta el script:
```bash
npm start
```

2. El script hará lo siguiente:
   - Abrirá una ventana de Chrome
   - Comenzará a scrollear automáticamente
   - Encuentra los elementos y los borra uno a uno

## ⚠️ Cosas que debes saber

- **Duración**: El proceso puede tardar bastante tiempo dependiendo de la cantidad de actividad
- **Limitaciones de Facebook**: 
  - Facebook puede limitar temporalmente la capacidad de eliminar elementos después de muchas acciones consecutivas
  - Si esto ocurre, detén el script (Ctrl+C) y espera unos minutos antes de volver a ejecutarlo
  - La próxima vez que lo ejecutes, continuará desde donde se quedó
- **Algunas publicaciones no se pueden borrar**: 
  - En mi caso, hubo posts que ni siquiera manualmente me dejó eliminar Facebook. Si ves que el script no borra algo, intenta hacerlo tú directo en el navegador. Si tampoco se puede, probablemente no es fallo del script, sino una limitación de la plataforma. 

- **Múltiples Usos**: Puedes usar el script para:
  - Diferentes años (cambiando la URL)
  - Diferentes tipos de actividad:
    - Todas las publicaciones
    - Todos los "me gusta"
    - Todas las etiquetas
    - Cualquier otra sección que aparezca en tu registro

## 🔍 Solución de Problemas

- Si el script no funciona:
  1. Asegúrate de estar logueado en Facebook en Chrome
  2. Verifica que la URL sea correcta
  3. Intenta cerrar todas las ventanas de Chrome y volver a ejecutar

- Si Facebook bloquea las acciones:
  1. Detén el script
  2. Espera 15-30 minutos
  3. Vuelve a ejecutar el script

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras un bug o tienes una mejora:
1. Crea un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📜 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## ⚡ Ojo

Este script es una herramienta de automatización. Úsala con responsabilidad y sé consciente de que las acciones son irreversibles. Asegúrate de querer eliminar la actividad seleccionada antes de ejecutar el script. 