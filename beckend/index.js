const cors = require('cors');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

app.use(cors());

const routes = require("./routes/web");
app.use(routes);
console.log(__dirname + '/backend/uploads')
app.use('/uploads', express.static(__dirname + '/uploads')); // Adjusted static file serving path

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('A new client connected');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    // Echo message back to client
    wss.clients.forEach(function each(client) {
        client.send(message);
    });
  });

  ws.send('Connected to WebSocket server');
});

const port = 4000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
