const btnCarregarLlibre = document.getElementById('carregarLlibre');

btnCarregarLlibre.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.epub'; // Solo permitir archivos en formato epub

    input.addEventListener('change', () => {
        const file = input.files[0];

        const formData = new FormData();
        formData.append('ebook', file);

        fetch('/admin/upload', {
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

    input.click();
});

