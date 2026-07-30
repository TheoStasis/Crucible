const http = require('http');
const net = require('net');

const PORT = process.env.PORT || 80;
const BACKEND_PORT = 3001;
const WS_PORT = 8080;

const server = http.createServer((req, res) => {
  // Forward HTTP API requests to Express Backend
  const proxyReq = http.request({
    host: 'localhost',
    port: BACKEND_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy Error', message: err.message }));
  });

  req.pipe(proxyReq);
});

// Forward WebSocket connection upgrade requests
server.on('upgrade', (req, socket, head) => {
  const proxySocket = net.connect(WS_PORT, 'localhost', () => {
    // Write headers to start the ws connection
    let rawHeaders = `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`;
    for (const [key, value] of Object.entries(req.headers)) {
      rawHeaders += `${key}: ${value}\r\n`;
    }
    rawHeaders += '\r\n';
    
    proxySocket.write(rawHeaders);
    proxySocket.write(head);
    
    socket.pipe(proxySocket);
    proxySocket.pipe(socket);
  });

  proxySocket.on('error', (err) => {
    console.error('Proxy WS connection error:', err);
    socket.destroy();
  });
});

server.listen(PORT, () => {
  console.log(`Unified Gateway Proxy listening on port ${PORT}`);
  console.log(`- Forwarding HTTP -> http://localhost:${BACKEND_PORT}`);
  console.log(`- Forwarding WebSockets -> ws://localhost:${WS_PORT}`);
});
