import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
const output = process.env.QUARRY_BROWSER_QA_OUTPUT ?? 'outputs';
await fs.mkdir(output, { recursive: true });
if (process.env.QUARRY_BROWSER_QA_OUTPUT)
  assert.equal(await fs.access(output + '/browser-qa.json').then(() => true, () => false), false, 'Use a fresh evidence directory');
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: [
    '--autoplay-policy=no-user-gesture-required',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--ignore-gpu-blocklist',
  ],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('response', (r) => {
  if (r.status() >= 400) errors.push(r.url() + ' ' + r.status());
});
const report = {};
try {
  await page.goto(process.env.QUARRY_QA_URL || 'http://127.0.0.1:8795/');
  await page.waitForFunction(() => window.__quarry?.state === 'menu', null, { timeout: 120000 });
  report.buildURL = await page.locator('script[type="module"]').evaluate(node => node.src);
  const buildResponse = await page.request.get(report.buildURL);
  report.buildSha256 = createHash('sha256').update(await buildResponse.body()).digest('hex');
  await page.screenshot({ path: output + '/menu.png' });
  await page.click('#start');
  await page.waitForFunction(() => window.__quarry?.state === 'countdown');
  report.audio = await page.evaluate(() => window.__quarry.stats.audio);
  assert.equal(report.audio, 38);
  report.driving = await page.evaluate(async () => {
    const q = window.__quarry;
    await q.start('playground');
    q.autopilot(false);
    q.setInput({ throttle: 1, steer: 0, brake: 0, handbrake: false });
    q.simulate(2);
    const start = q.cars[0];
    q.setInput({ throttle: 0, steer: 0, brake: 1, handbrake: false });
    q.simulate(2);
    const brake = q.cars[0];
    q.teleport(0, 0, -20, 0);
    q.setInput({ throttle: 1, steer: 0.7, brake: 0, handbrake: false });
    q.simulate(2);
    const turn = q.inspect()[0];
    q.setInput(null);
    q.pause();
    return { start, brake, turn };
  });
  assert.ok(report.driving.start.speed > 5);
  assert.ok(Math.abs(report.driving.brake.speed) < 2);
  assert.ok(report.driving.turn.forward[0] > 0.2);
  report.damage = await page.evaluate(async () => {
    const q = window.__quarry;
    await q.start('playground');
    q.damage(0, 24, 'front');
    q.damage(0, 24, 'left');
    q.damage(0, 24, 'rear');
    const damaged = q.inspect()[0];
    q.pause();
    return damaged;
  });
  assert.equal(report.damage.health, 28);
  assert.ok(report.damage.detached > 0);
  await page.evaluate(() =>
    window.__quarry.captureCamera([5, 2.6, -13], [0, 0.9, -20]),
  );
  await page.screenshot({ path: output + '/damaged.png' });
  report.repair = await page.evaluate(() => {
    const q = window.__quarry;
    q.resume();
    q.recover();
    q.pause();
    return q.inspect()[0];
  });
  assert.equal(report.repair.health, 100);
  assert.equal(report.repair.detached, 0);
  assert.equal(report.repair.glass, 0);
  await page.evaluate(() => window.__quarry.resume());
  await page.keyboard.press('KeyI');
  assert.equal(await page.evaluate(() => window.__quarry.state), 'inspect');
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => window.__quarry.state), 'playing');
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => window.__quarry.state), 'paused');
  await page.click('#resume');
  report.race = await page.evaluate(async () => {
    const q = window.__quarry;
    await q.start('race');
    q.autopilot(true);
    q.simulate(200);
    return { state: q.state, cars: q.cars, result: q.result, stats: q.stats };
  });
  assert.equal(report.race.result, 'FINISH LINE');
  assert.equal(report.race.cars[0].passed, 72);
  assert.ok(report.race.cars[0].health > 0);
  await page.screenshot({ path: output + '/race-results.png' });
  report.timeout = await page.evaluate(async () => {
    const q = window.__quarry;
    await q.start('derby');
    q.simulate(4);
    q.setTime(299.95);
    q.simulate(0.2);
    return { state: q.state, result: q.result };
  });
  assert.equal(report.timeout.result, 'TIME’S UP');
  report.elimination = await page.evaluate(async () => {
    const q = window.__quarry;
    await q.start('derby');
    q.simulate(4);
    q.setHealth(0, 0);
    q.simulate(0.1);
    return q.result;
  });
  assert.equal(report.elimination, 'WRECKED OUT');
  report.winner = await page.evaluate(async () => {
    const q = window.__quarry;
    await q.start('derby');
    q.simulate(4);
    for (let i = 1; i < 8; i++) q.setHealth(i, 0);
    q.simulate(0.1);
    return q.result;
  });
  assert.equal(report.winner, 'LAST CAR STANDING');
  report.restart = await page.evaluate(async () => {
    const q = window.__quarry;
    const samples = [];
    for (let i = 0; i < 6; i++) {
      await q.start('derby');
      q.simulate(10);
      samples.push(q.stats);
      await new Promise((r) => requestAnimationFrame(r));
    }
    q.pause();
    return samples;
  });
  assert.ok(report.restart.every((s) => s.loops === 8));
  report.errors = errors;
  assert.equal(errors.length, 0);
  report.passed = true;
} catch (e) {
  report.passed = false;
  report.failure = e.stack;
  console.error(e);
  await page.screenshot({ path: output + '/qa-failure.png' }).catch(() => {});
  process.exitCode = 1;
} finally {
  await fs.writeFile(
    output + '/browser-qa.json',
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify({
      passed: report.passed,
      failure: report.failure,
      audio: report.audio,
      errors,
    }),
  );
  await browser.close();
}
