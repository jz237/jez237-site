import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.hdr': 'application/octet-stream',
  '.ogg': 'audio/ogg',
  '.ttf': 'font/ttf',
};
const server = http.createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(
      new URL(req.url, 'http://localhost').pathname,
    );
    const file = path.resolve(
      root,
      '.' + (name === '/' ? '/index.html' : name),
    );
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    const info = await stat(file);
    if (!info.isFile()) throw Error('Not a file');
    res.writeHead(200, {
      'Content-Type': mime[path.extname(file)] ?? 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-cache',
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end('Not found');
  }
});
server.listen(8795, '127.0.0.1', () =>
  console.log('Quarry Impact: http://127.0.0.1:8795'),
);
server.on('error', (e) => {
  console.error(e.message);
  process.exitCode = 1;
});
