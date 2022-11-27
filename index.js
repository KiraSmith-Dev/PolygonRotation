const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const reload = require('reload');
const port = 80;

app.use('/', express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
reload(app).then(() => {
    server.listen(port, () => {
        console.log(`App listening at http://127.0.0.1:${port}`);
    });
});
