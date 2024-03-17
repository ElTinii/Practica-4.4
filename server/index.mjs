import express from 'express';
import path from 'path';
import fs from 'fs';
import jszip from 'jszip';
import xmldom from 'xmldom';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Ruta de administración para subir libros
app.post('/admin/upload', (req, res) => {
    // Lógica para subir archivos .epub
});

// Ruta de administración para eliminar libros
app.delete('/admin/delete/:id', (req, res) => {
    // Lógica para eliminar archivos .epub
});

// Ruta pública para obtener la lista de libros
app.get('/books', (req, res) => {
    // Lógica para obtener la lista de libros
});

// Ruta para descargar y descomprimir el libro seleccionado
app.get('/books/:id', (req, res) => {
    // Lógica para descargar y descomprimir el libro
});

// Ruta para enviar la lista de URLs de los capítulos al cliente
app.get('/books/:id/chapters', (req, res) => {
    // Lógica para obtener la lista de capítulos
});

app.listen(8080, () => console.log('Server: http://localhost:8080'));