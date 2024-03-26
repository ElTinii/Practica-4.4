import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { google } from 'googleapis';
import multer from 'multer';
import express from 'express';
import path from 'path';
import fs from 'fs';
import jszip from 'jszip';
import xmldom from 'xmldom';
import { books } from 'googleapis/build/src/apis/books';


const url = fileURLToPath(import.meta.url);
const dir = dirname(url);
const app = express();

const upload = multer({ dest: 'uploads/' });

// Función para crear el cliente de Google Drive
function createDriveClient(clientId, clientSecret, redirectUri, refreshToken) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    client.setCredentials({ refresh_token: refreshToken });
    return google.drive({ version: 'v3', auth: client });
}

let gd;
let driveClient;

try {
    gd = JSON.parse(fs.readFileSync("credencials/claus.json", {encoding:"utf8"}));
    driveClient = createDriveClient(gd.clientId, gd.clientSecret, gd.redirectUri, gd.refreshToken);
} catch (error) {
    console.error('Error al leer o parsear el archivo google_drive.json:', error);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(dir, '..', 'views', 'index.html'));
});

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Ruta de administración para subir libros
app.post('/admin/uploads', upload.single('file'), async (req, res) => {
    try {
        // Obtén el archivo subido
        const file = req.file;

        // Obtén el ID de la carpeta de destino en Google Drive
        const folderId = '1tOAYZZqs1eV-tDQEUboCEdHMMXPlbJXm';

        // Sube el archivo a Google Drive
        const response = await driveClient.files.create({
            requestBody: {
                name: file.originalname,
                parents: [folderId]
            },
            media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(file.path)
            }
        });

        // Envía una respuesta al cliente
        res.json({ message: "L'arxiu s'ha carregat correctament !", fileId: response.data.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al carregar l'arxiu" });
    }
});

// Ruta de administración para eliminar libros
app.delete('/admin/delete/:id', (req, res) => {
});

// Ruta pública para obtener la lista de libros
app.get('/libros', async (req, res) => {
    try {
        const response = await driveClient.files.list({
            q: "'1tOAYZZqs1eV-tDQEUboCEdHMMXPlbJXm' in parents and trashed = false",
            fields: 'files(id, name)',
        });
        res.json(response.data.files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los libros" });
    }
});

// Ruta para descargar y descomprimir el libro seleccionado
app.get('/libros/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const dest = fs.createWriteStream(path.join(dir, 'libros', `${id}.zip`));
        res.send(dest)
        const response = await driveClient.files.get(
            { fileId: id, alt: 'media' },
            { responseType: 'stream' }
        );
        
        response.data
            .on('end', async () => {
                console.log('Descarga completada.');

                const zip = await jszip.loadAsync(fs.readFileSync(path.join(dir, 'libros', `${id}.zip`)));
                const contentOPF = zip.file(/^.*?content.opf$/)[0];

                if (contentOPF) {
                    const contentOPFText = await contentOPF.async("text");

                    res.send(contentOPFText);
                    return; // Asegúrate de que la función se detenga aquí
                }

                res.status(200).json({ message: "Libro descargado y listo para procesar." });
            })
            .on('error', err => {
                console.log('Error al descargar el archivo.', err);
                res.status(500).json({ message: "Error al descargar el libro." });
            })
            .pipe(dest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al procesar el libro." });
    }
});


// Ruta para obtener la lista de archivos EPUB
app.get('/api/epub-files', async (req, res) => {
    try {
        // ID de la carpeta que contiene los archivos EPUB
        const folderId = '1tOAYZZqs1eV-tDQEUboCEdHMMXPlbJXm';

        // Obtiene la lista de archivos EPUB en la carpeta
        const response = await driveClient.files.list({
            q: `'${folderId}' in parents and mimeType='application/epub+zip' and trashed = false`,
            fields: 'files(id, name)',
        });

        // Envía la lista de archivos al cliente
        res.json(response.data.files);
    } catch (error) {
        console.error('Error al obtener los archivos EPUB:', error);
        res.status(500).json({ message: 'Error al obtener los archivos EPUB' });
    }
});


app.listen(8080, () => console.log('Server: http://localhost:8080'));