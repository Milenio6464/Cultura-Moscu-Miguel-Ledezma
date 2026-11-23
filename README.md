# Cultura Moscú — Miguel Ledezma

**Город помнит · Москва: непроверенное прошлое** (*The City Remembers · Moscow: The Unverified Past*)

Sitio web interactivo, pasado a código a partir del prototipo de Figma. Es un archivo especulativo situado en el año 2050: ocho imágenes creadas por IA cuentan una historia falsa de Moscú, y en cada una se esconde un punto blanco secreto. Al hacer clic aparece el documento histórico verificado, con imágenes de archivo reales, fechas clave y fuentes.

## Contenido

- **Portada**: «Город помнит».
- **Predicción**: Kaspersky Earth 2050, «3D-реконструкция истории человечества» (Андрей Чемезов, 13 de abril de 2018).
- **Línea del tiempo** con 8 capítulos: 1147, 1380, 1547, 1712, 1812, 1918, 1941 y 1991.
- **Revelación de cada capítulo**: versión de la IA → documento verificado → más evidencias → «en qué se equivocó la imagen» → volver a la versión sintética.
- **Final**: el ojo que se abre al hacer clic y muestra el manifiesto.
- **Fuentes originales**: fuentes visuales e históricas.

Todo el texto visible está en ruso.

## Cómo verlo

Abre `index.html` en el navegador, o activa **GitHub Pages** en *Settings → Pages → Deploy from a branch → `main` / root*.

## Estructura

```
index.html        estructura de la página
css/style.css     estilos (escritorio y móvil)
js/data.js        textos, fechas e imágenes de los 8 capítulos
js/main.js        interacciones: punto secreto, revelación, volver, ojo
img/              imágenes sintéticas generadas con IA (portada, globo y 8 reconstrucciones)
```

## Imágenes

- **Imágenes sintéticas** (`img/`): generadas con IA para este proyecto. Son reconstrucciones falsas a propósito.
- **Imágenes históricas**: se cargan directamente desde Wikimedia Commons, con su autor, fecha y licencia; la mayoría son de dominio público o CC.

Tipografías: Cormorant Garamond / Infant, EB Garamond, Inter y Oswald (Google Fonts).

---

Proyecto de diseño crítico · Diseño gráfico y comunicación · 2026 · Miguel Ledezma
