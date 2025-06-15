# El Libro y el Expresso

Bienvenido al proyecto **El Libro y el Expresso**, un café literario donde los amantes del café y la lectura pueden disfrutar de una experiencia única. Este proyecto incluye una página web donde los usuarios pueden pedir diferentes tipos de café, opciones de comida y explorar una selección de libros.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
el-libro-y-el-expresso
├── src
│   ├── index.html          # Página principal de la aplicación
│   ├── styles
│   │   └── main.css       # Estilos CSS para la página
│   ├── scripts
│   │   └── app.js         # Script principal de la aplicación
│   ├── components
│   │   ├── MenuCafe.js    # Componente para el menú de café
│   │   ├── MenuComida.js  # Componente para el menú de comida
│   │   └── SeleccionLibros.js # Componente para la selección de libros
│   └── assets
│       └── fonts          # Fuentes utilizadas en la aplicación
├── package.json            # Configuración de npm
└── README.md               # Documentación del proyecto
```

## Instalación

Para instalar las dependencias del proyecto, asegúrate de tener [Node.js](https://nodejs.org/) instalado y ejecuta el siguiente comando en la raíz del proyecto:

```
npm install
```

## Ejecución

Para ejecutar la aplicación, puedes usar un servidor local. Una opción es utilizar el paquete `live-server`. Si no lo tienes instalado, puedes hacerlo con:

```
npm install -g live-server
```

Luego, ejecuta el siguiente comando en la raíz del proyecto:

```
live-server src
```

Esto abrirá la aplicación en tu navegador predeterminado.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.