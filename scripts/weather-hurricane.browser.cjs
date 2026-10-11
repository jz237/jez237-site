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
    let releaseRefresh;
    let refreshGate;
    let satelliteMode = 'normal', releaseSatellite, releaseImage;
    const satelliteRequests = [];
    await context.route('https://nowcoast.noaa.gov/**', async route => {
      const url = new URL(route.request().url());
      satelliteRequests.push(url);
      const params = new Map([...url.searchParams].map(([key,value]) => [key.toLowerCase(),value]));
      if (params.get('request')?.toLowerCase() === 'getcapabilities') {
        if (satelliteMode === 'delayed') await new Promise(resolve => { releaseSatellite = resolve; });
        const time = new Date(NOW - (satelliteMode === 'stale' ? 8 * 3600000 : satelliteMode === 'image-error' ? 60000 : satelliteMode === 'image-timeout' ? 120000 : 0)).toISOString();
        const body = satelliteMode === 'malformed' ? '<ServiceExceptionReport>Unavailable</ServiceExceptionReport>' : `<WMS_Capabilities xmlns="http://www.opengis.net/wms"><Capability><Layer><Layer><Name>global_longwave_imagery_mosaic</Name><Dimension name="time" default="${time}">${time}</Dimension></Layer></Layer></Capability></WMS_Capabilities>`;
        return route.fulfill({status:200,contentType:'text/xml',body});
      }
      if (satelliteMode === 'image-error') return route.abort('failed');
      if (satelliteMode === 'image-timeout') await new Promise(resolve => { releaseImage = resolve; });
      // A transparent test tile. Real cloud imagery is never bundled as fixture data.
      return route.fulfill({status:200,contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8AAAAASUVORK5CYII=','base64')});
    });
    await context.route('https://mapservices.weather.noaa.gov/**', async route=>{
      const layer = Number(route.request().url().match(/MapServer\/(\d+)\/query/)?.[1]);
      if (mode==='delayed') await refreshGate;
      if (mode==='offline' || (mode==='partial'&&layer===7)) return route.abort('failed');
      let data = mode==='empty' ? empty : structuredClone(source[layer]||empty);
      if (mode==='stale') for (const f of data.features) {f.properties.idp_filedate=NOW-48*3600000;f.properties.advdate='500 PM EDT Thu Oct 01 2026';}
      if (mode==='malformed'&&layer===5) data={error:{code:500,message:'Fixture service failure'}};
      if (mode==='incomplete'&&layer===5) data.features=data.features.filter(f=>f.properties.tau>0);
      return route.fulfill({status:200,contentType:'application/geo+json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(data)});
    });
    const page = await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(BASE,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('#hurricane-feed-status')?.textContent.includes('NOAA checked'));
    assert.equal(await page.locator('[data-storm]').count(),1);
    assert.match(await page.locator('.hurricane-map-marker').getAttribute('aria-label'),/Test System, Category 3 hurricane/);
    assert.match(await page.locator('#hurricane-forecast-step').getAttribute('aria-valuetext'),/Test System: Advisory position/);
    assert.match(await page.locator('#hurricane-storm-detail').innerText(),/Hurricane warning/);
    await page.locator('[data-storm]').click();
    assert.equal(await page.evaluate(()=>document.activeElement?.hasAttribute('data-storm')),true);
    await page.locator('.hurricane-map-marker').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>document.activeElement?.classList.contains('hurricane-map-marker')),true);
    await page.keyboard.press('Space');
    assert.equal(await page.evaluate(()=>document.activeElement?.classList.contains('hurricane-map-marker')),true);
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

    await page.locator('[data-storm]').click();
    const markerOffset=()=>page.evaluate(()=>{
      const map=document.querySelector('#hurricane-map').getBoundingClientRect();
      const marker=document.querySelector('.hurricane-map-marker').getBoundingClientRect();
      return [marker.x+marker.width/2-map.x-map.width/2,marker.y+marker.height/2-map.y-map.height/2];
    });
    const offsetBefore=await markerOffset();
    const normalMap=await page.locator('#hurricane-map').boundingBox();
    await page.locator('#hurricane-expand').click();
    await page.waitForFunction(()=>document.querySelector('#hurricane-expanded').open);
    assert.equal(await page.locator('#hurricane-expand').getAttribute('aria-expanded'),'true');
    assert.equal(await page.evaluate(()=>document.activeElement?.id),'hurricane-close');
    const expandedMap=await page.locator('#hurricane-map').boundingBox();
    assert.ok(expandedMap.width>normalMap.width+100,'Desktop expanded map is not wider');
    assert.ok(expandedMap.height>normalMap.height,'Expanded map is not taller');
    await page.waitForTimeout(60);
    const offsetAfter=await markerOffset();
    assert.ok(offsetAfter.every((value,index)=>Math.abs(value-offsetBefore[index])<2),'Map center drifts when expanded');
    await page.locator('#hurricane-forecast-table summary').click();
    assert.equal(await page.locator('#hurricane-table-content tbody tr').count(),6);
    await page.locator('[data-forecast="3"]').click();
    assert.match(await page.locator('#hurricane-forecast-readout').innerText(),/\+48 hours/);
    assert.equal(await page.locator('[data-forecast="3"]').getAttribute('aria-current'),'step');
    await page.locator('#hurricane-units').selectOption('mph');
    assert.match(await page.locator('[data-forecast-row="3"]').innerText(),/81 mph/);
    await page.locator('#hurricane-expanded').evaluate(el=>{el.scrollTop=0;});
    await page.locator('#hurricane-expanded').screenshot({path:path.join(output,'expanded-1280.png')});
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('#hurricane-expanded').open && document.activeElement?.id==='hurricane-expand');
    assert.equal(await page.evaluate(()=>document.activeElement?.id),'hurricane-expand');
    assert.equal(await page.locator('#hurricane-forecast-step').inputValue(),'3');
    assert.equal(await page.locator('#hurricane-expand').getAttribute('aria-expanded'),'false');
    assert.equal(await page.locator('#weather-hurricanes').evaluate(el=>el.parentElement.classList.contains('hub-main')),true);
    await page.setViewportSize({width:390,height:844});
    assert.equal(await page.locator('.weather-home-link').isVisible(),true);
    await page.locator('#hurricane-expand').click();
    await page.waitForFunction(()=>document.querySelector('#hurricane-expanded').open);
    assert.ok((await page.locator('#hurricane-map').boundingBox()).height>390);
    assert.equal(await page.locator('#hurricane-expanded').evaluate(el=>el.scrollWidth<=el.clientWidth),true);
    await page.locator('#hurricane-expanded').screenshot({path:path.join(output,'expanded-390.png')});
    await page.locator('#hurricane-close').click();
    await page.waitForFunction(()=>!document.querySelector('#hurricane-expanded').open && document.activeElement?.id==='hurricane-expand');
    assert.equal(await page.evaluate(()=>document.activeElement?.id),'hurricane-expand');
    await page.locator('#hurricane-forecast-table summary').click();
    await page.setViewportSize({width:1280,height:900});
    results.push('Larger desktop/mobile map, Escape and close-button focus restoration, forecast table selection, and mobile home navigation');

    assert.equal(satelliteRequests.length,0,'Satellite uses no network until enabled');
    await page.locator('#hurricane-satellite').check();
    await page.waitForFunction(()=>document.querySelector('#hurricane-satellite-status').textContent.startsWith('Infrared mosaic') && !document.querySelector('#hurricane-satellite-status').textContent.includes('loading'));
    assert.ok(await page.locator('.leaflet-hurricane-satellite-pane img').count()>0);
    const imageRequests = satelliteRequests.filter(url=>url.searchParams.get('request')==='GetMap');
    assert.ok(imageRequests.length>0,'Satellite image requested');
    for (const url of imageRequests) {
      assert.equal(url.searchParams.get('time'),new Date(NOW).toISOString());
      assert.ok(Number(url.searchParams.get('width'))*Number(url.searchParams.get('height'))<=1000000,'Image request exceeds its pixel budget');
    }
    const imageSources = await page.locator('.leaflet-hurricane-satellite-pane img').evaluateAll(images=>images.map(img=>img.src));
    await page.locator('#hurricane-next').click();
    assert.deepEqual(await page.locator('.leaflet-hurricane-satellite-pane img').evaluateAll(images=>images.map(img=>img.src)),imageSources,'Forecast slider must not change the observed satellite image');
    await page.setViewportSize({width:320,height:844});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Satellite controls overflow a small phone');
    await page.setViewportSize({width:1280,height:900});
    await page.locator('#hurricane-satellite').uncheck();
    assert.equal(await page.locator('.leaflet-hurricane-satellite-pane img').count(),0);
    assert.equal(await page.locator('#hurricane-satellite-info').isVisible(),false);
    for (const failure of ['stale','malformed','image-error']) {
      satelliteMode=failure;
      await page.locator('#hurricane-satellite').check();
      await page.waitForFunction(()=>!document.querySelector('#hurricane-satellite-retry').hidden);
      assert.match(await page.locator('#hurricane-satellite-status').innerText(),/unavailable/);
      assert.equal(await page.locator('.leaflet-hurricane-satellite-pane img').count(),0);
      assert.equal(await page.locator('[data-storm]').count(),1,'Imagery failure must preserve the storm forecast');
      await page.locator('#hurricane-satellite').uncheck();
    }
    satelliteMode='image-error';
    await page.locator('#hurricane-satellite').check();
    await page.waitForFunction(()=>!document.querySelector('#hurricane-satellite-retry').hidden);
    satelliteMode='normal';
    await page.locator('#hurricane-satellite-retry').click();
    await page.waitForFunction(()=>document.querySelector('#hurricane-satellite-status').textContent.startsWith('Infrared mosaic') && !document.querySelector('#hurricane-satellite-status').textContent.includes('loading'));
    await page.locator('#hurricane-satellite').uncheck();
    satelliteMode='delayed';
    await page.locator('#hurricane-satellite').check();
    while (!releaseSatellite) await page.waitForTimeout(20);
    await page.locator('#hurricane-satellite').uncheck();
    releaseSatellite();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.leaflet-hurricane-satellite-pane img').count(),0,'Turning satellite off cancels pending activation');
    assert.equal(await page.locator('#hurricane-satellite-info').isVisible(),false);
    satelliteMode='image-timeout';
    await page.locator('#hurricane-satellite').check();
    await page.waitForFunction(()=>!document.querySelector('#hurricane-satellite-retry').hidden,{},{timeout:22000});
    assert.equal(await page.locator('.leaflet-hurricane-satellite-pane img').count(),0,'A stalled image request has a bounded wait');
    assert.equal(await page.locator('[data-storm]').count(),1);
    releaseImage?.();
    await page.locator('#hurricane-satellite').uncheck();
    satelliteMode='normal';
    results.push('Satellite is opt-in, uses exact observation time, stays fixed during forecast playback, fits mobile, and recovers from stale metadata, failed imagery, and image timeouts without losing forecasts');

    mode='delayed';
    refreshGate=new Promise(resolve=>{releaseRefresh=resolve;});
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('#weather-hurricanes').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('#hurricane-feed-status').textContent.includes('Saved data'));
    await page.waitForFunction(()=>document.querySelectorAll('.leaflet-hurricane-land-pane path').length>0);
    assert.equal(await page.locator('#hurricane-notice').isVisible(),false);
    assert.equal(await page.locator('#hurricane-refresh').isDisabled(),true);
    const topBefore=await page.locator('.hurricane-workspace').evaluate(el=>el.getBoundingClientRect().top);
    releaseRefresh();
    await page.waitForFunction(()=>document.querySelector('#hurricane-feed-status').textContent.includes('NOAA checked'));
    const topAfter=await page.locator('.hurricane-workspace').evaluate(el=>el.getBoundingClientRect().top);
    assert.ok(Math.abs(topAfter-topBefore)<1,'Refreshing saved data moves the map');
    mode='normal';
    results.push('Saved data remains steady and shows no false outage while an initial refresh is pending');

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
      if (width===320) {
        await page.locator('#hurricane-forecast-table summary').click();
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Open forecast table overflows a small phone');
        await page.locator('#hurricane-timeline').screenshot({path:path.join(output,'forecast-table-320.png')});
        await page.locator('#hurricane-forecast-table summary').click();
      }
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

    for (const nextMode of ['partial','empty','malformed','incomplete','stale']) {
      mode=nextMode;
      await page.evaluate(()=>localStorage.clear());
      await page.reload({waitUntil:'domcontentloaded'});
      await page.locator('#weather-hurricanes').scrollIntoViewIfNeeded();
      await page.waitForFunction(()=>document.querySelector('#hurricane-feed-status').textContent.includes('NOAA checked'));
      if (mode==='partial') { assert.match(await page.locator('#hurricane-notice').innerText(),/forecast cones/); assert.equal(await page.locator('[data-storm]').count(),1); }
      if (mode==='empty') { assert.equal(await page.locator('[data-storm]').count(),0); assert.match(await page.locator('#hurricane-storm-list').innerText(),/No systems/); assert.equal(await page.locator('#hurricane-notice').isVisible(),false); }
      if (mode==='malformed'||mode==='incomplete') assert.match(await page.locator('#hurricane-storm-list').innerText(),/unavailable/);
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
