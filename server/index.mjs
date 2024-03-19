import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { google } from 'googleapis';
import multer from 'multer';
import express from 'express';
import path from 'path';
import fs from 'fs';
import jszip from 'jszip';
import xmldom from 'xmldom';


const url = fileURLToPath(import.meta.url);
const dir = dirname(url);
const app = express();

const upload = multer({ dest: 'uploads/' });


class GoogleApi {
    constructor(client_id, client_secret, redirect_uri) {
        // Inicializa el cliente de Google Drive aquí
    }

    // Método para listar los archivos de Google Drive
    async listFiles() {
        // Lógica para listar los archivos
    }

    // Método para subir un archivo a Google Drive
    async uploadFile(file, folderId) {
        // Lógica para subir un archivo a Google Drive
        const drive = google.drive({ version: 'v3', auth: this.auth });
        const response = await drive.files.create({
            requestBody: {
                name: file.originalname,
                parents: [folderId]
            },
            media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path)
            }
        });
        return response.data;
    }
}

// Lee las credenciales del archivo 'claus.json'
const infoJSON = fs.readFileSync('credencials/claus.json');
const credentials = JSON.parse(infoJSON);

// Extrae los datos de las credenciales
const { client_id, client_secret, redirect_uri } = credentials;

// Crea una instancia de GoogleApi y pasa los datos al constructor
const googleApi = new GoogleApi(client_id, client_secret, redirect_uri);

app.get('/', (req, res) => {
    res.sendFile(path.join(dir, '..', 'views', 'index.html'));
});

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Ruta de administración para subir libros
app.post('/admin/upload', upload.single('file'), async (req, res) => {
    try {
        // Obtén el archivo subido
        const file = req.file;

        // Obtén el ID de la carpeta de destino en Google Drive
        const folderId = '1hXJNAaNcugtJKIde0qmh8WFDIvgFXbxF';

        // Sube el archivo a Google Drive
        const response = await googleApi.uploadFile(file, folderId);

        // Envía una respuesta al cliente
        res.json({ message: 'Archivo subido con éxito', fileId: response.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al subir el archivo' });
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