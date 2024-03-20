const form = document.querySelector('#upload-form');
const fileInput = document.querySelector('#file-input');

form.addEventListener('submit', async (event) => {
    // Evita el comportamiento por defecto del formulario
    event.preventDefault();

    // Crea un objeto FormData y añade el archivo
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        // Envía el archivo al servidor
        const response = await fetch('/admin/uploads', {
            method: 'POST',
            body: formData
        });

        // Comprueba si la petición fue exitosa
        if (!response.ok) {
            throw new Error('Error al subir el archivo');
        }

        // Procesa la respuesta
        const data = await response.json();

        // Muestra un mensaje de éxito
        console.log(data.message);

        // Después de subir el archivo, obtén la lista actualizada de archivos EPUB
        const epubResponse = await fetch('/api/epub-files');
        const epubFiles = await epubResponse.json();

        const tableBody = document.getElementById('myTable2').getElementsByTagName('tbody')[0];

        // Limpiar el cuerpo de la tabla
        tableBody.innerHTML = '';

        // Agregar una nueva fila para cada archivo
        epubFiles.forEach(file => {
            const newRow = tableBody.insertRow();

            // Agregar una nueva celda con el nombre del archivo
            const newCell = newRow.insertCell();
            newCell.textContent = file.name;
        });
    } catch (error) {
        // Muestra un mensaje de error
        console.error(error);
    }
});


window.addEventListener('load', async () => {
    try {
        // Obtén la lista de archivos EPUB cuando se carga la página
        const response = await fetch('/api/epub-files');
        const files = await response.json();

        const tableBody = document.getElementById('myTable2').getElementsByTagName('tbody')[0];

        // Limpiar el cuerpo de la tabla
        tableBody.innerHTML = '';

        // Agregar una nueva fila para cada archivo
        files.forEach(file => {
            const newRow = tableBody.insertRow();

            // Agregar una nueva celda con el nombre del archivo
            const newCell = newRow.insertCell();
            newCell.textContent = file.name;
        });

        // Inicializa la tabla con DataTables después de agregar las filas
        $('#myTable2').DataTable();
    } catch (error) {
        console.error('Error al obtener los archivos EPUB:', error);
    }
});