const http = require('http');
const net = require('net');

const PORT = process.env.PORT || 80;
const BACKEND_PORT = 3001;
const WS_PORT = 8080;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

const server = http.createServer((req, res) => {
  // Handle HTTP OPTIONS preflight request locally
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // Forward HTTP API requests to Express Backend (using 127.0.0.1 to avoid IPv6 resolution bugs)
  const proxyReq = http.request({
    host: '127.0.0.1',
    port: BACKEND_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers
  }, (proxyRes) => {
    // Merge backend response headers with CORS headers
    res.writeHead(proxyRes.statusCode, {
      ...proxyRes.headers,
      ...CORS_HEADERS
    });
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy HTTP forwarding error:', err);
    res.writeHead(500, { 
      ...CORS_HEADERS,
      'Content-Type': 'application/json' 
    });
    res.end(JSON.stringify({ 
      error: 'Proxy Error', 
      message: err.message, 
      code: err.code 
    }));
  });

  req.pipe(proxyReq);
});

// Forward WebSocket connection upgrade requests
server.on('upgrade', (req, socket, head) => {
  // Connect explicitly to 127.0.0.1 to prevent IPv6 loopback mismatches (e.g. ::1 vs 127.0.0.1)
  const proxySocket = net.connect(WS_PORT, '127.0.0.1', () => {
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
  console.log(`- Forwarding HTTP -> http://127.0.0.1:${BACKEND_PORT}`);
  console.log(`- Forwarding WebSockets -> ws://127.0.0.1:${WS_PORT}`);
});
