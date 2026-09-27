import WebSocket from 'ws';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
const endpoint = process.env.QUARRY_TEST_ENDPOINT ?? 'ws://127.0.0.1:8789';
const origin = process.env.QUARRY_TEST_ORIGIN ?? 'http://127.0.0.1:8795';
const sockets = [];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const code = () => Array.from(randomBytes(6), n => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[n % 32]).join('');
// A local-only independent network identity avoids rate limits from unrelated local QA.
// Cloudflare overwrites this trusted header at the real edge; never use it for production tests.
const headers = endpoint.startsWith('ws://127.0.0.1:') ? { 'CF-Connecting-IP': '198.51.100.' + (1 + randomBytes(1)[0] % 253) } : {};
function connect(room, hello = false) {
  const ws = new WebSocket(`${endpoint}/rooms/${room}`, { origin, headers }); sockets.push(ws);
  const messages = [];
  const opened = new Promise((resolve, reject) => { ws.once('open', resolve); ws.once('error', reject); });
  const closed = new Promise(resolve => ws.once('close', (code, reason) => resolve({ code, reason: String(reason) })));
  // Verify the actual protocol deadline, independently of Wrangler's local TCP proxy close delay.
  const closeFrame = new Promise(resolve => ws.once('open', () => ws._receiver.once('conclude', (code, reason) => resolve({ code, reason: String(reason), at: Date.now() }))));
  ws.on('message', raw => messages.push(JSON.parse(String(raw))));
  ws.on('open', () => { if (hello) ws.send(JSON.stringify({ type: 'hello', protocol: 1, name: 'LIFETIME TEST', kind: 'coupe' })); });
  return { ws, opened, closed, closeFrame, messages };
}
try {
  const room = code(); const player = connect(room, true); await player.opened;
  for (let i = 0; i < 100 && !player.messages.some(m => m.type === 'welcome'); i++) await pause(50);
  assert.ok(player.messages.some(m => m.type === 'welcome'), 'admitted player should receive welcome');
  const pending = connect(room); await pending.opened; const started = Date.now();
  for (let i = 0; i < 4; i++) { await pause(1800); const churn = connect(room); await churn.opened; churn.ws.close(); await churn.closed; }
  const timedOut = await Promise.race([pending.closeFrame, pause(5000).then(() => ({ code: 0 }))]);
  assert.equal(timedOut.code, 1008); assert.ok(Date.now() - started < 12_500, 'other sockets must not postpone the ten-second deadline');
  let denial;
  for (let i = 0; i < 4; i++) {
    const attempt = connect(code()); await attempt.opened; await pause(100);
    if (attempt.messages.some(m => m.type === 'error')) { denial = attempt; break; }
    attempt.ws.close(); await attempt.closed;
  }
  assert.ok(denial, 'creation budget must reject before allocating unbounded rooms');
  const rejected = await Promise.race([denial.closeFrame, pause(3000).then(() => ({ code: 0 }))]); assert.equal(rejected.code, 4004);
  assert.ok(/rooms|connection/i.test(denial.messages.find(m => m.type === 'error').message));
  console.log(JSON.stringify({ ok: true, pendingTimeoutCloseFrameMs: timedOut.at - started, pendingTCPClosed: pending.ws.readyState === WebSocket.CLOSED, admissionReasonDelivered: true, terminalClose: rejected.code }));
} finally { for (const ws of sockets) { if (ws.readyState === WebSocket.CLOSING) ws.terminate(); else ws.close(); } }
