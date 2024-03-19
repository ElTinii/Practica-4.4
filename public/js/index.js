const btnCarregarLlibre = document.getElementById('book');
const btnAfegirLlibre = document.getElementById('afegir');

btnCarregarLlibre.addEventListener('click', () => {

    btnAfegirLlibre.addEventListener('click', () => {
        const file = btnCarregarLlibre.files[0];

        const formData = new FormData();
        formData.append('ebook', file);

        fetch('/admin/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                        alert('Archivo subido exitosamente');
                } else {
                    alert('Error al subir el archivo');
                }
            })
            .catch(error => {
                alert('Error en la solicitud:', error);
            });
    });

    // input.click();
});


