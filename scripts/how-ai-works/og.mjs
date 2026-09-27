import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.addInitScript(() => { try { localStorage.setItem('haw-calm', '1'); } catch (e) {} });
await p.goto('http://localhost:8811/how-ai-works/', { waitUntil: 'networkidle' });
await p.addStyleTag({ content: `#site-nav, .lab-rail, .gist { display: none !important; } .lab-shell { grid-template-columns: 1fr !important; } html { zoom: 0.86; }
  #ogbar { position: fixed; top: 0; left: 0; right: 0; z-index: 9999; padding: 16px 30px; display: flex; align-items: baseline; gap: 18px; background: linear-gradient(90deg, rgba(2,8,19,0.97), rgba(2,8,19,0.85)); border-bottom: 1px solid rgba(230,189,103,0.6); }
  #ogbar b { font: 800 44px Georgia, serif; color: #f8ecd8; } #ogbar span { font: 700 20px Inter, system-ui, sans-serif; color: #e6bd67; }` });
await p.evaluate(() => { const d = document.createElement('div'); d.id = 'ogbar'; d.innerHTML = '<b>How AI Works</b><span>an interactive guide with real model data</span>'; document.body.appendChild(d); });
await p.evaluate(() => { document.getElementById('ntTemp').value = 5; document.getElementById('ntTemp').dispatchEvent(new Event('input')); });
for (let i = 0; i < 3; i++) { await p.evaluate(() => document.getElementById('ntStep').click()); await p.waitForTimeout(400); }
await p.evaluate(() => { const el = document.getElementById('ntPrompts'); scrollTo(0, el.getBoundingClientRect().top + scrollY - 95); });
await p.waitForTimeout(600);
await p.screenshot({ path: '../haw/how-ai-works/media/og.jpg', type: 'jpeg', quality: 85 });
await b.close();
