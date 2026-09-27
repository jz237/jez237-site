// Records a captioned ~60s tour of the local How AI Works page to video/*.webm (Playwright).
import { chromium } from 'playwright';
const URL = 'http://localhost:8811/how-ai-works/';
const browser = await chromium.launch({ channel: 'chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: 'video', size: { width: 1280, height: 720 } } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: `
  #cap { position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%); z-index: 99999; padding: 12px 22px; border-radius: 14px;
    background: rgba(3,12,26,0.92); border: 1px solid rgba(230,189,103,0.8); color: #fff; font: 700 22px Inter, system-ui, sans-serif;
    box-shadow: 0 10px 40px rgba(0,0,0,0.6); white-space: nowrap; transition: opacity .35s; }
  #cap b { color: #e6bd67; margin-right: 10px; }
  #site-nav { display: none !important; }
  ::-webkit-scrollbar { display: none; }` });
await page.evaluate(() => { const c = document.createElement('div'); c.id = 'cap'; document.body.appendChild(c); document.documentElement.style.scrollBehavior = 'auto'; });
const cap = async (n, text) => page.evaluate(([n, t]) => { const c = document.getElementById('cap'); c.style.opacity = 0; setTimeout(() => { c.innerHTML = (n ? `<b>${n}</b>` : '') + t; c.style.opacity = 1; }, 350); }, [n, text]);
const wait = ms => page.waitForTimeout(ms);
// smooth scroll so `sel` sits `off` px from the top
const scrollTo = async (sel, off = 40) => {
  await page.evaluate(async ([sel, off]) => {
    const el = document.querySelector(sel); const target = el.getBoundingClientRect().top + scrollY - off; const start = scrollY; const t0 = performance.now();
    await new Promise(res => { const step = now => { const k = Math.min(1, (now - t0) / 650), e = k < .5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2; scrollTo(0, start + (target - start) * e); k < 1 ? requestAnimationFrame(step) : res(); }; requestAnimationFrame(step); });
  }, [sel, off]);
};
const click = sel => page.evaluate(s => document.querySelector(s).click(), sel);

await cap('', 'How AI Works · a 60-second tour');
await wait(2600);

await scrollTo('#map .map-figure', 60); await cap('1', 'A request travels through an AI system');
await click('#mapPlay'); await wait(4400); await click('#mapPlay');

await scrollTo('#tokens .lab-card-body', 30); await cap('2', 'It reads numbered chunks, not letters');
await click('[data-token-preset="strawberry"]'); await wait(1700); await click('#tokenIdsToggle'); await wait(2000);

await scrollTo('#ntPrompts', 20); await cap('3', 'Every next token has odds… then the dice roll');
await click('#ntStep'); await wait(2500); await click('#ntStep'); await wait(2400);

await scrollTo('.attn-stage', 120); await cap('4', 'Words look back at earlier words');
await click('[data-adj="small"]'); await wait(1900); await click('[data-adj="big"]'); await wait(1700);

await scrollTo('#genloop', 30); await cap('5', 'Put together: one token at a time, on repeat');
await wait(5000);

await scrollTo('#chatCompare', 30); await cap('6', 'Chat training turns a text-continuer into an assistant');
await click('[data-cc="1"]'); await wait(4000);

await scrollTo('.ctx-controls', 20); await cap('7', 'It only sees what fits in its window');
await click('#ctxMemory'); await click('#ctxAuto'); await wait(3800); await click('#ctxAuto');

await scrollTo('#embQueries', 20); await cap('8', 'Apps find the right notes by meaning');
await click('[data-q="0"]'); await wait(3000);

await scrollTo('#tools .tool-grid', 20); await cap('9', 'Tools check facts, but web pages can carry traps');
await click('[data-tool="trap"]'); await wait(4000);

await scrollTo('#agent-loop .scenario-picker', 20); await cap('10', 'Agents loop until the check really passes');
await click('[data-scenario="recipe"]'); await click('#autoStep'); await wait(5600);

await scrollTo('#hallucination .hal-grid', 20); await cap('11', 'Sounding sure is not the same as being right');
await page.evaluate(() => { const c = document.querySelectorAll('[data-claim]'); c[2].click(); c[4].click(); }); await wait(600);
await click('#halCheck'); await wait(2900);

await scrollTo('.lab-hero', 0); await cap('', 'Try it yourself · jez237.com/how-ai-works');
await wait(3000);
await page.screenshot({ path: 'poster-src.png' });
await ctx.close(); await browser.close();
console.log('done');
