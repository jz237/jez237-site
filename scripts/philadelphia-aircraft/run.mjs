import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRelay } from './relay.mjs';
import { createShipFeed } from './ships.mjs';

const root = process.argv[2];
if (!root) throw new Error('Specify the private relay installation directory');
const config = JSON.parse(readFileSync(join(root, 'config.json'), 'utf8'));
const logPath = join(root, 'relay.log');
// Bounded, operational-only log: never write secrets, upstream bodies, or visitor data.
writeFileSync(logPath, `${new Date().toISOString()} Starting aircraft relay\n`);
let logLines = 0;
function log(message) {
  if (++logLines > 1000) { writeFileSync(logPath, ''); logLines = 0; }
  appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`);
}
let stopping = false, tunnel, restartTimer, registerTimer, currentOrigin, lastUpdate;
const ships = createShipFeed({ key: config.aisKey });
const server = createRelay({ token: config.token, ships, onUpdate: value => {
  lastUpdate = value;
  writeFileSync(join(root, 'status.json'), JSON.stringify({ running: true, ...value }));
} });
server.on('error', error => { log(`Relay listener: ${error.code || 'failed'}`); process.exit(1); });

async function register(origin) {
  if (stopping || currentOrigin !== origin) return;
  try {
    const response = await fetch(`${config.gateway}/register`, { method: 'POST', body: origin,
      headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'text/plain' },
      redirect: 'error', signal: AbortSignal.timeout(12000) });
    await response.body?.cancel();
    if (response.status !== 204) { log(`Tunnel registration HTTP ${response.status}`); throw new Error('Registration unavailable'); }
    log('Tunnel connected and registered; waiting for map requests');
  } catch {
    if (!stopping && currentOrigin === origin) registerTimer = setTimeout(() => { void register(origin); }, 30000);
  }
}

function startTunnel() {
  if (stopping) return;
  currentOrigin = null;
  tunnel = spawn(join(root, 'cloudflared.exe'), ['tunnel', '--no-autoupdate', '--url',
    `http://127.0.0.1:${config.port}`, '--metrics', '127.0.0.1:8938'],
    { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let buffer = '';
  function inspect(chunk) {
    const received = buffer + chunk.toString();
    const match = received.match(/https:\/\/[a-z0-9]+(?:-[a-z0-9]+)*\.trycloudflare\.com/);
    buffer = received.slice(-16384);
    writeFileSync(join(root, 'tunnel.log'), buffer);
    if (match && !currentOrigin) {
      currentOrigin = match[0];
      writeFileSync(join(root, 'tunnel-origin.txt'), currentOrigin);
      log('Tunnel address received; registering with website');
      void register(currentOrigin);
    }
  }
  tunnel.stdout.on('data', inspect); tunnel.stderr.on('data', inspect);
  tunnel.on('error', () => log('Tunnel process could not start'));
  tunnel.on('close', () => {
    clearTimeout(registerTimer); currentOrigin = null;
    if (!stopping) { log('Tunnel disconnected; retrying in 30 seconds'); restartTimer = setTimeout(startTunnel, 30000); }
  });
}
function stop() {
  if (stopping) return; stopping = true;
  clearTimeout(registerTimer); clearTimeout(restartTimer); tunnel?.kill();
  ships.dispose();
  server.close(); server.closeAllConnections();
  writeFileSync(join(root, 'status.json'), JSON.stringify({ running: false, lastUpdate }));
  log('Relay stopped'); process.exit(0);
}
// A local file switch allows the stop shortcut to shut down both processes cleanly.
setInterval(() => { if (existsSync(join(root, 'stop'))) stop(); }, 1000).unref();
process.on('SIGINT', stop); process.on('SIGTERM', stop); process.on('exit', () => tunnel?.kill());
server.listen(config.port, '127.0.0.1', () => {
  writeFileSync(join(root, 'status.json'), JSON.stringify({ running: true, status: 'idle' }));
  startTunnel();
});
