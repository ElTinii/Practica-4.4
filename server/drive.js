class GoogleApi{
    constructor(){
        this.drive = google.drive({version: 'v3', auth: this.oAuth2Client});
    }
    async listFiles() {
        const res = await this.drive.files.list({
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
        });
        const files = res.data.files;
        if (files.length) {
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found');
        }
    }
    async uploadFile() {
        const res = await this.drive.files.create({
            requestBody: {
                name: 'test.jpg',
                mimeType: 'image/jpg'
            },
            media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream('test.jpg')
            }
        });
        console.log(res.data);
    }
    
}
listFiles();