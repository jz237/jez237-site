/* Exercise the real page styles and chart with deterministic hourly test data.
 * Run against the local server; PLAYWRIGHT_MODULE can use an existing install.
 */
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const BASE = process.env.WEATHER_QA_URL || 'http://127.0.0.1:8765/weather/';

async function run() {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const output = path.resolve(__dirname, '../tmp/hurricane-qa');
  await fs.mkdir(output, {recursive:true});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // Only this test substitutes the widget's data. No fixture is published.
    await page.route('**/weather-widget.js*', route => route.fulfill({contentType:'text/javascript',body:''}));
    await page.route('https://mapservices.weather.noaa.gov/**', route => route.fulfill({contentType:'application/json',body:'{"type":"FeatureCollection","features":[]}'}));
    await page.goto(BASE, {waitUntil:'domcontentloaded'});
    await page.evaluate(() => {
      const hours = Array.from({length:24}, (_,i) => ({time:`${i}:00`,fullTime:`Test day ${i}:00`,temp:65+i/2,rain:i*3,amount:i%4 ? 0 : .02}));
      const root = document.querySelector('#philly-weather-widget');
      root.innerHTML = `<div class="weather-dashboard-card">${WeatherDetails.chart(hours)}</div>`;
      WeatherDetails.bindChart(root, hours);
    });
    const geometry = () => page.evaluate(() => {
      const scroll = document.querySelector('.weather-chart-scroll');
      const rect = scroll.getBoundingClientRect();
      const dot = document.querySelector('.chart-cursor circle').getBoundingClientRect();
      return {left:rect.left,right:rect.left+scroll.clientWidth,cursor:dot.left+dot.width/2,scrollLeft:scroll.scrollLeft,overflow:scroll.scrollWidth>scroll.clientWidth,pageY:scrollY};
    });
    for (const width of [320,390,1536]) {
      await page.setViewportSize({width,height:844});
      const slider = page.locator('#weather-chart-hour');
      await slider.scrollIntoViewIfNeeded();
      await slider.focus();
      const before = await geometry();
      assert.equal(await page.locator('.weather-chart-scroll-hint').isVisible(), before.overflow, `Scroll cue must match chart overflow at ${width}px`);
      for (const key of ['End','Home','End','ArrowLeft']) {
        await page.keyboard.press(key);
        const after = await geometry();
        assert.ok(after.cursor >= after.left+15 && after.cursor <= after.right-15, `Selected hour is outside the chart at ${width}px after ${key}: ${JSON.stringify(after)}`);
        assert.equal(after.pageY,before.pageY,'Selecting an hour must not scroll the whole page');
        assert.equal(await slider.getAttribute('aria-valuetext'),await page.locator('#weather-chart-readout').innerText());
        if (key==='End'||key==='Home') assert.equal(await page.evaluate(key => {
          const scroll=document.querySelector('.weather-chart-scroll');
          const svg=scroll.querySelector('svg').getBoundingClientRect();
          const box=scroll.getBoundingClientRect();
          return key==='Home' ? svg.left>=box.left-1 : svg.right<=box.right+1;
        },key),true,'The first and last selections must also reveal their outer axis labels');
      }
      const end = await geometry();
      assert.equal(end.overflow ? end.scrollLeft > 0 : end.scrollLeft === 0,true);
      // Hovering the visible edge of a chart must not fight manual scrolling.
      const edgeHit = await page.locator('[data-chart-hour]').evaluateAll(hits => {
        const edge = document.querySelector('.weather-chart-scroll').getBoundingClientRect().left;
        return hits.find(hit => {const r=hit.getBoundingClientRect();return r.right>edge+5 && r.left<edge+15;})?.dataset.chartHour;
      });
      if (edgeHit) {
        await page.locator(`[data-chart-hour="${edgeHit}"]`).dispatchEvent('pointerenter',{pointerType:'mouse'});
        assert.equal((await geometry()).scrollLeft,end.scrollLeft,'Hover must not pan the chart');
      }
      await page.locator('.weather-chart').screenshot({path:path.join(output,`hourly-chart-${width}.png`)});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Page overflows at ${width}px`);
    }
    await page.setViewportSize({width:390,height:844});
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.locator('#weather-chart-hour').focus();
    await page.keyboard.press('Home');
    await page.keyboard.press('End');
    await page.waitForFunction(() => {
      const chart=document.querySelector('.weather-chart-scroll').getBoundingClientRect();
      const dot=document.querySelector('.chart-cursor circle').getBoundingClientRect();
      return dot.left>=chart.left && dot.right<=chart.right;
    });
    assert.deepEqual(errors,[]);
    console.log('PASS Hourly chart follows keyboard selections without page scrolling, fits phone and desktop widths, preserves pointer scrolling, and supports reduced motion');
  } finally { await browser.close(); }
}
run().catch(error=>{console.error(error);process.exitCode=1;});
