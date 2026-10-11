/* Run against the local static server; uses installed Playwright, no paid APIs.
 * PLAYWRIGHT_MODULE can point to an existing Playwright package on the host.
 */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const BASE = process.env.WEATHER_QA_URL || 'http://127.0.0.1:8765/weather/';
const output = path.resolve(__dirname, '../tmp/hurricane-qa');
const NOW = Date.now();
const empty = {type:'FeatureCollection',features:[]};
const advisory = new Intl.DateTimeFormat('en-US',{timeZone:'UTC',hour:'numeric',hour12:true}).format(NOW).replace(' ', '00 ')
  + ' UTC ' + new Intl.DateTimeFormat('en-US',{timeZone:'UTC',weekday:'short'}).format(NOW)
  + ' ' + new Intl.DateTimeFormat('en-US',{timeZone:'UTC',month:'short'}).format(NOW)
  + ' ' + new Date(NOW).getUTCDate() + ' ' + new Date(NOW).getUTCFullYear();
const forecast = [0,12,24,48,72,120].map((tau,i)=>{
  const date = new Date(NOW+tau*3600000);
  return {type:'Feature',geometry:{type:'Point',coordinates:[-68+i*2,24+i*2.8]},properties:{
    idp_subset:'al992026',idp_source:'al992026-001_5day_pts',stormname:'Hurricane Test System',
    stormtype:'HU',basin:'AL',advisnum:'1',tau,maxwind:100-i*10,gust:120-i*10,mslp:970,tcdir:315,tcspd:12,
    advdate:advisory, validtime:`${date.getUTCDate()}/${String(date.getUTCHours()).padStart(2,'0')}00`,
    idp_filedate:NOW,binnumber:'AT1'
  }};
});
const source = {
  5:{type:'FeatureCollection',features:forecast},
  7:{type:'FeatureCollection',features:[{type:'Feature',properties:{...forecast[0].properties},geometry:{type:'Polygon',coordinates:[[[-68,24],[-61,40],[-52,44],[-56,33],[-68,24]]]}}]},
  10:{type:'FeatureCollection',features:[{...forecast[0],properties:{...forecast[0].properties,dtg:2026101000},geometry:{type:'Point',coordinates:[-70,21]}},{...forecast[0],properties:{...forecast[0].properties,dtg:2026101006}}]},
  3:{type:'FeatureCollection',features:[{type:'Feature',properties:{basin:'Atlantic',prob2day:'20%',prob7day:'70%',idp_filedate:NOW},geometry:{type:'Polygon',coordinates:[[[-50,10],[-43,12],[-45,18],[-53,14],[-50,10]]]}}]},
  8:{type:'FeatureCollection',features:[{type:'Feature',properties:{...forecast[0].properties,tcww:'HWR'},geometry:{type:'LineString',coordinates:[[-66,18],[-65,18]]}}]}
};

async function run() {
  await fs.mkdir(output,{recursive:true});
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const results=[];
  try {
    const context = await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
    let mode = 'normal';
    await context.route('https://mapservices.weather.noaa.gov/**', async route=>{
      const layer = Number(route.request().url().match(/MapServer\/(\d+)\/query/)?.[1]);
      if (mode==='offline' || (mode==='partial'&&layer===7)) return route.abort('failed');
      let data = mode==='empty' ? empty : structuredClone(source[layer]||empty);
      if (mode==='stale') for (const f of data.features) {f.properties.idp_filedate=NOW-48*3600000;f.properties.advdate='500 PM EDT Thu Oct 01 2026';}
      if (mode==='malformed'&&layer===5) data={error:{code:500,message:'Fixture service failure'}};
      return route.fulfill({status:200,contentType:'application/geo+json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(data)});
    });
    const page = await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(BASE,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('#hurricane-feed-status')?.textContent.includes('NOAA checked'));
    assert.equal(await page.locator('[data-storm]').count(),1);
    assert.match(await page.locator('#hurricane-storm-detail').innerText(),/Hurricane warning/);
    assert.equal(await page.locator('#hurricane-forecast-step').getAttribute('max'),'5');
    await page.locator('#hurricane-next').click();
    assert.match(await page.locator('#hurricane-forecast-readout').innerText(),/\+12 hours/);
    await page.locator('#hurricane-forecast-step').focus();
    await page.keyboard.press('End');
    assert.match(await page.locator('#hurricane-forecast-readout').innerText(),/\+120 hours/);
    assert.equal(await page.locator('#hurricane-next').isDisabled(),true);
    await page.locator('#hurricane-units').selectOption('km/h');
    assert.match(await page.locator('[data-storm]').innerText(),/185/);
    await page.locator('#hurricane-play').click();
    await page.waitForFunction(()=>Number(document.querySelector('#hurricane-forecast-step').value)>0);
    await page.locator('#hurricane-play').click();
    assert.equal(await page.locator('#hurricane-play').getAttribute('aria-pressed'),'false');
    results.push('Storm selection, unit conversion, keyboard timeline, playback and coastal notices');

    await page.locator('[data-basin="pacific"]').click();
    assert.equal(await page.locator('[data-storm]').count(),0);
    assert.equal(await page.locator('#hurricane-timeline').isVisible(),false);
    assert.match(await page.locator('#hurricane-storm-list').innerText(),/No systems/);
    await page.locator('[data-basin="atlantic"]').click();
    await page.locator('[data-layer="outlook"]').uncheck();
    await page.locator('[data-outlook]').click();
    assert.equal(await page.locator('[data-layer="outlook"]').isChecked(),true);
    await page.locator('#hurricane-reset-view').click();
    results.push('Basin filtering, empty basin, development-area focus and layer controls');

    for (const width of [320,390,768,1280,1536]) {
      await page.setViewportSize({width,height:900});
      await page.locator('#weather-hurricanes').scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      const dimensions=await page.evaluate(()=>{
        const root=document.querySelector('#weather-hurricanes');
        const map=document.querySelector('#hurricane-map');
        return {width:innerWidth,pageWidth:document.documentElement.scrollWidth,rootWidth:root.getBoundingClientRect().width,mapWidth:map.getBoundingClientRect().width};
      });
      if (width<=768) assert.ok(dimensions.pageWidth<=width,`Page overflows at ${width}px: ${JSON.stringify(dimensions)}`);
      assert.ok(dimensions.rootWidth<=width,`Tracker overflows at ${width}px`);
      assert.ok(dimensions.mapWidth>=250,`Map collapsed at ${width}px`);
      await page.locator('#weather-hurricanes').screenshot({path:path.join(output,`tracker-${width}.png`)});
    }
    results.push('Responsive layouts at 320, 390, 768, 1280 and 1536 pixels');

    mode='offline';
    await page.locator('#hurricane-refresh').click();
    await page.waitForFunction(()=>document.querySelector('#hurricane-feed-status').textContent.includes('Saved data'));
    assert.equal(await page.locator('[data-storm]').count(),1);
    assert.match(await page.locator('#hurricane-notice').innerText(),/could not be refreshed/);
    results.push('Failed refresh retains the previously loaded advisory with a saved-data warning');

    await context.clearCookies();
    await page.evaluate(()=>localStorage.clear());
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('#weather-hurricanes').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('#weather-hurricanes').dataset.feed==='error');
    assert.match(await page.locator('#hurricane-notice').innerText(),/does not mean there are no storms/);
    assert.match(await page.locator('#hurricane-storm-list').innerText(),/unavailable/);
    results.push('First-visit outage is distinct from a genuine no-storms result');

    for (const nextMode of ['partial','empty','malformed','stale']) {
      mode=nextMode;
      await page.evaluate(()=>localStorage.clear());
      await page.reload({waitUntil:'domcontentloaded'});
      await page.locator('#weather-hurricanes').scrollIntoViewIfNeeded();
      await page.waitForFunction(()=>document.querySelector('#hurricane-feed-status').textContent.includes('NOAA checked'));
      if (mode==='partial') { assert.match(await page.locator('#hurricane-notice').innerText(),/forecast cones/); assert.equal(await page.locator('[data-storm]').count(),1); }
      if (mode==='empty') { assert.equal(await page.locator('[data-storm]').count(),0); assert.match(await page.locator('#hurricane-storm-list').innerText(),/No systems/); assert.equal(await page.locator('#hurricane-notice').isVisible(),false); }
      if (mode==='malformed') assert.match(await page.locator('#hurricane-storm-list').innerText(),/unavailable/);
      if (mode==='stale') { assert.equal(await page.locator('#weather-hurricanes').getAttribute('data-feed'),'stale'); assert.match(await page.locator('#hurricane-notice').innerText(),/12 hours old/); }
    }
    results.push('Partial layer failures, empty successful feeds, malformed responses and stale advisories');
    assert.deepEqual(errors,[]);
    results.push('No uncaught JavaScript errors');
    await fs.writeFile(path.join(output,'browser-results.json'),JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));
    console.log(results.map(r=>'PASS '+r).join('\n'));
  } finally { await browser.close(); }
}
run().catch(error=>{console.error(error);process.exitCode=1;});
