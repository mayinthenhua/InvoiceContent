const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath == './') filePath = './index.html';

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
  }[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile('./404.html', (error, notFound) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(notFound, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});