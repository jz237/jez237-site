import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 8790);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.mp3':'audio/mpeg','.png':'image/png','.txt':'text/plain; charset=utf-8'};
const url = `http://127.0.0.1:${port}/`;
const server = http.createServer((req, res) => {
  let file;
  try {
    const requestPath = decodeURIComponent(new URL(req.url, url).pathname);
    file = path.resolve(root, '.' + (requestPath === '/' ? '/index.html' : requestPath));
    if (!file.startsWith(root) || !fs.statSync(file).isFile()) throw new Error('Not found');
  } catch { res.writeHead(404); res.end('Not found'); return; }
  const stat = fs.statSync(file);
  res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': stat.size, 'Cache-Control': 'no-cache'});
  fs.createReadStream(file).pipe(res);
});
server.on('error', error => {
  if (error.code === 'EADDRINUSE') console.log(`Port ${port} is already in use. Check ${url}, or set PORT to use another port.`);
  else console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Choplifter 3D is ready: ${url}\nKeep this window open while playing. Ctrl+C stops the server.`);
  if (process.argv.includes('--open') && process.platform === 'win32') execFile('rundll32.exe', ['url.dll,FileProtocolHandler', url], {windowsHide:true}, () => {});
});
