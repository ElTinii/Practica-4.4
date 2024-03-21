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

        // Mostrar los datos en la tabla
        afegirDadesALaTaula('myTable1', data);
        afegirDadesALaTaula('myTable2', data);

        // Actualiza la tabla de libros
        if ($.fn.DataTable.isDataTable('#myTable1')) {
            $('#myTable1').DataTable().destroy();
        }

        // Actualiza la tabla de libros
        if ($.fn.DataTable.isDataTable('#myTable2')) {
            $('#myTable2').DataTable().destroy();
        }

        obtenirLlibres();

        // Limpia el campo de entrada de archivos
        fileInput.value = '';

        // Mostrar un mensaje de éxito con bootstrap que se ocultará después de 3 segundos
        const alert = document.getElementById('alert');
        alert.textContent = data.message;
        alert.classList.add('alert', 'alert-success', 'mt-3');
        alert.style.display = 'block';
        setTimeout(() => {
            alert.style.display = 'none';
        }, 6000);

    } catch (error) {
        // Muestra un mensaje de error
        console.error(error);
    }
});

function afegirDadesALaTaula(tableId, data) {
    let table = document.getElementById(tableId);
    let row = table.insertRow(1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    cell1.innerHTML = data.title;
    cell2.innerHTML = data.author;
}

async function obtenirLlibres() {
    try {
        // Obtén la lista de archivos EPUB
        const response = await fetch('/api/epub-files');
        const files = await response.json();

        const tableBody1 = document.getElementById('myTable1').getElementsByTagName('tbody')[0];
        const tableBody2 = document.getElementById('myTable2').getElementsByTagName('tbody')[0];

        // Limpiar el cuerpo de las tablas
        tableBody1.innerHTML = '';
        tableBody2.innerHTML = '';

        // Agregar una nueva fila para cada archivo
        files.forEach(file => {
            const newRow1 = tableBody1.insertRow();
            const newRow2 = tableBody2.insertRow();

            // Separar el nombre del archivo en título y autor
            const [title, author] = file.name.split(' - ');

            // Agregar una nueva celda con el título del libro
            const titleCell1 = newRow1.insertCell();
            const titleCell2 = newRow2.insertCell();
            titleCell1.textContent = title;
            titleCell2.textContent = title;

            // Agregar una nueva celda con el nombre del autor
            const authorCell1 = newRow1.insertCell();
            const authorCell2 = newRow2.insertCell();
            authorCell1.textContent = author;
            authorCell2.textContent = author;
        });

        // Inicializa las tablas con DataTables después de agregar las filas
        if ($.fn.DataTable.isDataTable('#myTable1')) {
            $('#myTable1').DataTable().destroy();
        }
        $('#myTable1').DataTable({
            "columns": [
                { "data": "title" },
                { "data": "author" },
                { 
                    "data": null,
                    "defaultContent": "<button class='btn btn-danger w-100'>Eliminar</button>"
                }
            ]
        });

        if ($.fn.DataTable.isDataTable('#myTable2')) {
            $('#myTable2').DataTable().destroy();
        }
        $('#myTable2').DataTable();
    } catch (error) {
        console.error('Error al obtener los archivos EPUB:', error);
    }
}

// Llama a la función cuando se carga la página
window.addEventListener('load', obtenirLlibres);