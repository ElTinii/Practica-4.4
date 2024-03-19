const btnCarregarLlibre = document.getElementById('book');
const btnAfegirLlibre = document.getElementById('afegir');

btnCarregarLlibre.addEventListener('click', () => {

    btnCarregarLlibre.addEventListener('click', () => {
        const file = btnAfegirLlibre.files[0];

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

    // input.click();
});

btnAfegirLlibre.addEventListener('click', () => {
    
});

