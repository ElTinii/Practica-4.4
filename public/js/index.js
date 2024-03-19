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
    } catch (error) {
        // Muestra un mensaje de error
        console.error(error);
    }
});