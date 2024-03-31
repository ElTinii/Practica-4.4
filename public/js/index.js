const afegir = document.querySelector('#afegir');
const fileInput = document.querySelector('#file-input');
const btnEliminar = document.querySelector('#eliminar');

afegir.addEventListener('click', async (event) => {
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

        alerts(data.message, 'alert-success');

    } catch (error) {
        // Muestra un mensaje de error
        console.error(error);
    }
});

$('#myTable1').on('click', 'button', async function(event) {
    if(confirm("Segur que vols eliminar el llibre?")){
    event.preventDefault();
    const formData = new FormData();
    const selectedBookId = $(this).data('id');
    const filename = $(this).data('filename');

    try {
        const response = await fetch(`/admin/delete/${selectedBookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            filename: filename, // Pasa el filename en el cuerpo de la solicitud
        
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el archivo');
        }
        const data = await response.json();

        if (data.success) {
            const table1 = $('#myTable1').DataTable();
            const table2 = $('#myTable2').DataTable();

            // Actualiza las tablas
            table1.rows(`[data-id='${selectedBookId}']`).remove().draw();
            table2.rows(`[data-id='${selectedBookId}']`).remove().draw()
            alert('Libro eliminado correctamente');
        } else {
            alert('Error al eliminar el libro');
        }
        alerts(data.message, 'alert-danger');
    } catch (error) {
        console.error(error);
    }
}});

function alerts(message, color){
    const alert = document.getElementById('alert');
        alert.textContent = message;
        alert.classList.add('alert', color, 'mt-3');
        alert.style.display = 'block';
        setTimeout(() => {
            alert.style.display = 'none';
        }, 6000);
}

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

            // Agregar una nueva celda con el ID del libro
            const idCell1 = newRow1.insertCell();
            idCell1.textContent = file.id;
            newRow1.setAttribute('data-id', file.id);
            newRow2.setAttribute('data-id', file.id);
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
                { "data": "id", "visible": false },
                { "data": "title" },
                { "data": "author" },
                { 
                    "data": null,
                    "render": function(data, type, row) {
                        return `<button type='button' class='btn btn-danger w-100' data-id='${row.id}' data-filename='${row.filename}'>Eliminar</button>`;
                    }
                }
            ]
        });
        $('#myTable1').on('click', 'button', function() {
            const table = $('#myTable1').DataTable();
            const data = table.row($(this).parents('tr')).data();
            const fileId = data.id;
        });
        if ($.fn.DataTable.isDataTable('#myTable2')) {
            $('#myTable2').DataTable().destroy();
        }
        $('#myTable2').DataTable();
    } catch (error) {
        console.error('Error al obtener los archivos EPUB:', error);
    }
}

async function llenarSelectConLibros() {
    const select = document.getElementById('selectLlibres');
    const response = await fetch('/libros');
    const libros = await response.json();
    for (const libro of libros) {
        const option = document.createElement('option');
        option.value = libro.id;
        option.text = libro.name;
        select.appendChild(option);
    }
}

let capURLS = [];
let capActual = 0;

document.getElementById('btnLlegir').addEventListener('click', (event) => {
    event.preventDefault();
    const selectedBookId = document.getElementById('selectLlibres').value;

    // Obtén la lista de URLs de los capítulos
    fetch(`/libros/${selectedBookId}`)
        .then(response => response.json())
        .then(urls => {
            capURLS = urls;
            // Carga el primer capítulo
            loadChapter();
        });
});

function loadChapter() {
    // Actualiza el src del iframe
    const iframe = document.getElementById('bookIframe');
    iframe.src = capURLS[capActual];
    iframe.hidden = false; // Mostrar el iframe
}

// Función para ir al siguiente capítulo
function nextChapter() {
    if (capActual < capURLS.length - 1) {
        capActual++;
        loadChapter();
    }
}

// Función para ir al capítulo anterior
function prevChapter() {
    if (capActual > 0) {
        capActual--;
        loadChapter();
    }
}

// Agrega los controladores de eventos a los botones
document.getElementById('nextButton').addEventListener('click', nextChapter);
document.getElementById('prevButton').addEventListener('click', prevChapter);


// Llama a la función cuando se carga la página
window.addEventListener('load', () => {
    obtenirLlibres();
    llenarSelectConLibros();
});