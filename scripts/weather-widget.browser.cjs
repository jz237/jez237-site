/* Real widget rendering with intercepted provider responses; no fixture is published. */
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const BASE = process.env.WEATHER_QA_URL || 'http://127.0.0.1:8765/weather/';
const now = new Date();
const dateKey = date => new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York'}).format(date);
const dates = [0,1,2].map(day=>dateKey(new Date(now.getTime()+day*86400000)));
const times = Array.from({length:27},(_,i)=>new Date(Math.floor(now.getTime()/3600000)*3600000+i*3600000).toISOString());
const forecast = {properties:{updateTime:now.toISOString(),periods:[{
  number:1,name:'Tonight',startTime:`${dates[0]}T18:00:00-04:00`,endTime:`${dates[1]}T06:00:00-04:00`,isDaytime:false,
  temperature:57,temperatureUnit:'F',probabilityOfPrecipitation:{value:10},shortForecast:'Mostly Cloudy',detailedForecast:'Mostly cloudy, with a low around 57. East wind around 5 mph.'
}]}};

async function run() {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const output = path.resolve(__dirname,'../tmp/hurricane-qa');
  await fs.mkdir(output,{recursive:true});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
    let mode='nws', legacyCache;
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const json=(route,body,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
    await page.route('https://embed.windy.com/**',route=>route.fulfill({contentType:'text/html',body:'Weather map test placeholder'}));
    await page.route('https://mapservices.weather.noaa.gov/**',route=>json(route,{type:'FeatureCollection',features:[]}));
    await page.route('https://api.weather.gov/**',route=>{
      if(mode==='offline') return json(route,{error:true},503);
      const url=route.request().url();
      if(url.includes('/products/')) return json(route,{'@graph':[]});
      if(url.includes('/points/')) return json(route,{properties:{timeZone:'America/New_York',forecast:'https://api.weather.gov/gridpoints/PHI/49,80/forecast',forecastHourly:'https://api.weather.gov/gridpoints/PHI/49,80/forecast/hourly'}});
      if(url.includes('/alerts/')) return json(route,{type:'FeatureCollection',features:[]});
      if(url.endsWith('/hourly')) return json(route,{properties:{periods:times.slice(0,24).map(startTime=>({startTime,temperature:mode==='missing'?null:62,temperatureUnit:'F',windSpeed:mode==='missing'?null:'5 to 10 mph',windDirection:mode==='missing'?null:'E',shortForecast:mode==='missing'?'':'Mostly Cloudy',probabilityOfPrecipitation:{value:mode==='missing'?null:10}}))}});
      return json(route,forecast);
    });
    await page.route('https://air-quality-api.open-meteo.com/**',route=>json(route,{hourly:{time:times,us_aqi:times.map(()=>mode==='zero'?0:null),pm2_5:times.map(()=>null),ozone:times.map(()=>null)}}));
    await page.route('https://api.open-meteo.com/**',route=>{
      if(mode==='nws'||mode==='missing'||mode==='offline') return json(route,{error:true},503);
      const current={time:now.toISOString(),temperature_2m:0,apparent_temperature:0,weather_code:0,wind_speed_10m:0,wind_gusts_10m:0,wind_direction_10m:0,cloud_cover:0,pressure_msl:1012,relative_humidity_2m:0,dew_point_2m:0};
      const hourly={time:times};
      for(const key of ['temperature_2m','apparent_temperature','weather_code','wind_speed_10m','wind_gusts_10m','wind_direction_10m','cloud_cover','rain','showers','precipitation_probability']) hourly[key]=times.map(()=>0);
      hourly.pressure_msl=times.map(()=>1012);
      if(mode==='partial') {
        for(const key of Object.keys(current)) if(key!=='time') current[key]=null;
      }
      if(mode==='partial'||mode==='hour-gaps') {
        // Later hours are still useful; missing first-hour values must not borrow them.
        for(const key of Object.keys(hourly)) if(key!=='time') hourly[key][0]=null;
      }
      return json(route,{timezone:'America/New_York',current,hourly,daily:{time:dates,temperature_2m_max:[77,77,77],temperature_2m_min:[50,50,50],precipitation_probability_max:[0,0,0],weather_code:[0,0,0],rain_sum:[0,0,0],showers_sum:[0,0,0],sunrise:dates.map(day=>`${day}T06:00:00-04:00`),sunset:dates.map(day=>`${day}T18:00:00-04:00`)}});
    });
    const view=()=>page.evaluate(()=>({
      header:document.querySelector('.weather-dashboard-top').innerText,
      condition:document.querySelector('.weather-title-row h2').textContent,
      temperature:document.querySelector('.weather-now-badge strong').textContent,
      primary:document.querySelector('.weather-metric.primary').innerText,
      wind:[...document.querySelectorAll('.weather-metric')].find(el=>el.querySelector('span')?.textContent==='Wind').innerText,
      firstHour:document.querySelector('.fishing-timeline > div').innerText,
      score:document.querySelector('.weather-fishing-score').innerText,
      air:document.querySelector('.weather-air-detail').innerText
    }));
    for(const scenario of ['nws','missing','zero','partial','hour-gaps']) {
      mode=scenario;
      if(scenario!=='nws') await page.evaluate(()=>localStorage.clear());
      await page.goto(BASE,{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>document.querySelector('#weather-refresh')?.disabled===false && document.querySelector('.weather-now-badge'));
      const actual=await view();
      if(scenario==='nws') {
        assert.equal(actual.temperature,'62°');
        assert.match(actual.wind,/10 mph E/);
        assert.match(actual.wind,/Gusts unavailable/);
        assert.match(actual.primary,/TONIGHT\nLow 57°F/);
        assert.match(actual.header,/NWS hourly forecast/);
        assert.doesNotMatch(actual.header,/Today \(Open-Meteo\)/);
        assert.match(actual.score,/Estimate unavailable/);
        legacyCache=await page.evaluate(()=>JSON.parse(localStorage.getItem('jez237-weather-cache-v2:19111')));
      }
      if(scenario==='missing'||scenario==='partial') {
        assert.equal(actual.temperature,'—','Missing current temperature must not become zero or a daily high');
        assert.match(actual.wind,/WIND\nUnknown/);
        assert.match(actual.wind,/Gusts unavailable/);
        assert.match(actual.firstHour,/Wind unavailable/);
        assert.match(actual.score,/Estimate unavailable/);
        assert.doesNotMatch(actual.condition,/Sunny/);
      }
      if(scenario==='zero') {
        assert.equal(actual.temperature,'0°');
        assert.match(actual.wind,/0 mph N/);
        assert.match(actual.wind,/gust 0 mph/);
        assert.match(actual.score,/Fishing estimate \d+\/10/);
        assert.match(actual.air,/0 Good/);
        assert.equal(await page.locator('.weather-aqi-scale').count(),1);
      } else {
        assert.match(actual.air,/Air quality data unavailable/);
        assert.doesNotMatch(actual.air,/0 Good/);
        assert.equal(await page.locator('.weather-aqi-scale').count(),0,'Unknown AQI must not point to the green end of a gauge');
      }
      assert.equal(await page.locator('.weather-uv-scale').count(),0,'Unknown UV must not point to the low end of a gauge');
      if(scenario==='hour-gaps') {
        assert.equal(actual.temperature,'0°');
        assert.match(actual.wind,/0 mph N/);
        assert.match(actual.firstHour,/Wind unavailable/,'An hour with missing wind must not borrow the current value');
        assert.match(actual.score,/Estimate unavailable/);
      }
      assert.doesNotMatch(JSON.stringify(actual),/NaN|undefined|Infinity/);
      for(const width of [320,390]) {
        await page.setViewportSize({width,height:844});
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Forecast layout must fit a phone');
        assert.deepEqual(await page.locator('.weather-metric').evaluateAll(cards=>cards.filter(card=>card.scrollWidth>card.clientWidth+1).map(card=>card.innerText)),[],'Unavailable values must not overflow their cards');
      }
      if(scenario==='nws') await page.locator('.weather-dashboard-grid').screenshot({path:path.join(output,'nws-backup-mobile.png')});
    }
    const recentCache=structuredClone(legacyCache);
    recentCache.fetchedAt=new Date(Date.now()-2*3600000).toISOString();
    recentCache.cachedAt=new Date().toISOString();
    const seedCache=cache=>page.evaluate(value=>{localStorage.clear();localStorage.setItem('jez237-weather-cache-v2:19111',JSON.stringify(value));},cache);
    mode='offline';
    await seedCache(recentCache);
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForSelector('.weather-stale-banner');
    assert.match(await page.locator('.weather-stale-banner').innerText(),new RegExp(new Date(recentCache.fetchedAt).getUTCFullYear()));
    assert.equal(await page.locator('.weather-now-badge strong').innerText(),'62°','A recent saved forecast remains useful during an outage');
    await page.locator('#weather-zip-input').fill('10001');
    await page.evaluate(()=>{
      window.__weatherNow=Date.now;
      const fetchedAt=Date.parse(JSON.parse(localStorage.getItem('jez237-weather-cache-v2:19111')).fetchedAt);
      Date.now=()=>fetchedAt+25*3600000;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForFunction(()=>!document.querySelector('.weather-now-badge'));
    assert.match(await page.locator('#weather-status').innerText(),/more than 24 hours old/);
    assert.equal(await page.locator('#weather-zip-input').inputValue(),'10001','Expiry preserves a location being typed');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'weather-zip-input');
    assert.equal(await page.evaluate(()=>localStorage.getItem('jez237-weather-cache-v2:19111')),null);
    await page.locator('#weather-refresh').click();
    await page.waitForFunction(()=>!document.querySelector('#weather-refresh').disabled);
    assert.equal(await page.locator('.weather-now-badge').count(),0,'A failed refresh must not revive expired values');
    await page.evaluate(()=>{Date.now=window.__weatherNow;delete window.__weatherNow;});
    mode='zero';
    await page.locator('#weather-refresh').click();
    await page.waitForSelector('.weather-now-badge');
    assert.equal(await page.locator('.weather-now-badge strong').innerText(),'0°','Live weather recovers after expired cache');
    mode='offline';
    const expiredCache={...recentCache,fetchedAt:new Date(Date.now()-72*3600000).toISOString()};
    await seedCache(expiredCache);
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('#weather-status')?.textContent.includes('more than 24 hours old'));
    assert.equal(await page.locator('.weather-now-badge').count(),0,'A newer cachedAt cannot disguise old weather on a cold load');
    assert.equal(await page.evaluate(()=>localStorage.getItem('jez237-weather-cache-v2:19111')),null);
    await page.setViewportSize({width:320,height:844});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Unavailable forecast controls must fit a small phone');
    await page.locator('#weather-now').screenshot({path:path.join(output,'local-weather-expired-320.png')});
    // A near-expiry saved forecast also disappears on its own timer.
    await seedCache({...recentCache,fetchedAt:new Date(Date.now()-24*3600000+2000).toISOString()});
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForSelector('.weather-now-badge');
    await page.waitForFunction(()=>!document.querySelector('.weather-now-badge'));
    assert.match(await page.locator('#weather-status').innerText(),/more than 24 hours old/);
    legacyCache.source=legacyCache.weather.source='NWS backup';
    legacyCache.weather.current.cloud_cover=80;
    legacyCache.weather.current.wind_gusts_10m=legacyCache.weather.current.wind_speed_10m;
    await page.evaluate(cache=>{localStorage.clear();localStorage.setItem('jez237-weather-cache-v2:19111',JSON.stringify(cache));},legacyCache);
    mode='offline';
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('#philly-weather-widget').textContent.includes('Weather is temporarily unavailable'));
    assert.equal(await page.locator('.weather-now-badge').count(),0,'Old NWS cache with assumed measurements must not reappear during an outage');
    assert.deepEqual(errors,[]);
    console.log('PASS NWS backup and partial weather preserve missing measurements, keep known zero values, identify forecast sources, and avoid unsupported fishing/AQI claims');
    console.log('PASS saved local forecasts expire on load, timer and visibility checks, preserve usable controls, and recover after an outage');
  } finally { await browser.close(); }
}
run().catch(error=>{console.error(error);process.exitCode=1;});
