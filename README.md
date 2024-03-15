Considerando la petición de no utilizar frameworks ni base de datos para estructurar el proyecto, se puede optar por un enfoque más básico pero funcional. Utilizaremos tecnologías y herramientas estándar para el desarrollo web, como JavaScript puro (vanilla JavaScript) en el lado del cliente, Node.js en el servidor para mantener la posibilidad de utilizar JavaScript en todo el proyecto, y archivos para almacenamiento en lugar de una base de datos.

Estructura del Proyecto
Directorio del Proyecto:

/public - Carpeta para archivos estáticos que serán servidos directamente al cliente.
/css - Para los archivos de estilo.
/js - JavaScript del lado del cliente.
/libros - Donde se almacenarán temporalmente los archivos descomprimidos de los libros para acceso público.
/views - HTML para la interfaz de usuario.
index.html - Página principal con la lista de libros.
leer.html - Plantilla para leer un libro.
/server - Lógica del lado del servidor.
server.js - El servidor principal de la aplicación.
/libros - Carpeta para almacenar los archivos ePub subidos (no accesible públicamente).
/scripts - Scripts que pueden usarse para tareas de mantenimiento o procesamiento inicial.
config.json - Archivo para guardar configuraciones, como la ubicación del directorio de libros.
Tecnologías y Archivos:

Node.js Sin Frameworks:

Uso del módulo HTTP integrado para manejar solicitudes y respuestas.
Módulo fs para manejar el sistema de archivos, necesario para leer y escribir archivos ePub y sus contenidos descomprimidos.
Módulos como jszip para descomprimir archivos ePub y xmldom para manipular los XML internos de ePub.
JavaScript Vanilla en el Cliente:

Para hacer solicitudes al servidor (puede ser mediante XMLHttpRequest o la API fetch que ofrece una forma más moderna y promesas).
Manipular el DOM para actualizar dinámicamente la lista de libros disponibles y mostrar el contenido de los libros.
Almacenamiento de Datos mediante Archivos:

Para evitar bases de datos, la información como la lista de libros disponibles se puede almacenar en un archivo JSON. Este archivo actuaría como una "base de datos" muy básica.
Para recordar el último capítulo leído por un usuario, se podrían usar cookies o localStorage en el navegador del cliente.
Flujo de Trabajo Sugerido
Carga y Gestión de Libros: El administrador sube los archivos ePub a través de una interfaz sencilla. Estos se almacenan en /libros y se descomprimen para acceso público en /public/libros.

Visualización de Libros: Los usuarios acceden a la lista de libros a través de index.html. Al seleccionar uno, se carga leer.html con el contenido del primer capítulo.

Navegación de Capítulos: Usando JavaScript, se habilitan botones o teclas para avanzar o retroceder entre capítulos, almacenando el progreso en el cliente.

Recordar el Último Capítulo Leído: Utiliza localStorage para guardar el último libro y capítulo leído por el usuario, permitiendo retomar la lectura donde la dejó.