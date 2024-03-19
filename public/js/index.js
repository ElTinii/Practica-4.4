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
        })
            .then(response => {
                if (response.ok) {
                    console.log('Archivo subido exitosamente');
                } else {
                    console.error('Error al subir el archivo');
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
            });
    });

    // input.click();
});

btnAfegirLlibre.addEventListener('click', () => {
    
});

