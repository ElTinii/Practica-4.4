import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import fs from 'fs';
import jszip from 'jszip';
import xmldom from 'xmldom';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const gd = JSON.parse(fs.readFileSync("./private/claus.json", {encoding:"utf8"}));
const driveClient = createDriveClient(gd.clientId, gd.clientSecret, gd.redirectUri, gd.refreshToken);

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Ruta de administración para subir libros
app.post('/admin/upload', (req, res) => {
    function createDriveClient(clientId, clientSecret, redirectUri, refreshToken) {
        const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
        client.setCredentials({ refresh_token: refreshToken });
        return google.drive({ version: 'v3', auth: client });
    }
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