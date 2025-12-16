require("dotenv").config();
const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const port = normalizePort(process.env.PORT || 2000);

function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

app.set('port', port);

server.on('listening', () => {
    console.log(`Server is listening on ${server.address().address}:${server.address().port} 🤟🤟🤟`);
});

server.on('error', (err) => {
    if (err.syscall !== 'listen') {
        throw err;
    }

    switch (err.code) {
        case 'EACCES':
            console.error('Port requires elevated privileges');
            process.exit(1);
            break;

        case 'EADDRINUSE':
            console.error('Port is already in use');
            process.exit(1);
            break;

        default: throw err;
    }
});

server.listen(port);