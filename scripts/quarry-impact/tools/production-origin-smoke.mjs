import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { forestRuntimeAssetPlan, observeForestRequests, verifyForestRequests } from './forest-runtime-assets.mjs';
import { circuitRuntimeAssetPlan } from './circuit-runtime-assets.mjs';
import { geologyRuntimeAssetPlan } from './geology-runtime-assets.mjs';

// Run only after publication is confirmed. This deliberately does not read
// QUARRY_TEST_ENDPOINT or write the server field: production supplies its URL.
const url='https://jez237.com/games/2026-09-27/quarry-impact/';
const output=process.env.QUARRY_PRODUCTION_QA_OUTPUT??'outputs/multiplayer/production-origin';
const report={ok:false,url,started:new Date().toISOString(),checks:{},errors:[],browserErrors:[],failedRequests:[],httpErrors:[],cspViolations:[]};
const contexts=[];
let browser, forestAssets = [], circuitAssets = [], geologyAssets = [];
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const network=p=>p.evaluate(()=>window.__quarry.network);
function add(array,value){if(array.length<30&&!array.some(x=>JSON.stringify(x)===JSON.stringify(value)))array.push(value);}
async function check(name,fn){console.log('CHECK',name);report.checks[name]=await fn();console.log('PASS',name);}

async function openPage(label,address){
  const context=await browser.newContext({viewport:{width:1280,height:720},permissions:['clipboard-read','clipboard-write']});
  contexts.push(context);
  await context.addInitScript(()=>{
    localStorage.setItem('quarry-impact-v1',JSON.stringify({quality:'medium'}));
    window.__originSmokeCSP=[];
    window.addEventListener('securitypolicyviolation',e=>window.__originSmokeCSP.push({directive:e.effectiveDirective,blocked:e.blockedURI,disposition:e.disposition}));
  });
  const p=await context.newPage(),observed={config:null,webSockets:[],vehicleAssets:[],sceneryAssets:[],forestAssets:[],circuitAssets:[],geologyAssets:[]};
  const forestRequests=await observeForestRequests(p,url,[...forestAssets,...circuitAssets,...geologyAssets]);
  const vehicleResponses=[];
  const configURL=new URL('multiplayer.json',url).href;
  const configResponse=p.waitForResponse(r=>r.url()===configURL,{timeout:120000});
  // Mark the promise handled while goto/asset preparation is still in progress.
  configResponse.catch(()=>{});
  p.on('pageerror',error=>add(report.browserErrors,{client:label,error:error.stack??String(error)}));
  p.on('console',message=>{if(message.type()==='error')add(report.browserErrors,{client:label,error:message.text()});});
  p.on('requestfailed',request=>add(report.failedRequests,{client:label,url:request.url(),error:request.failure()?.errorText}));
  p.on('response',response=>{if(response.status()>=400)add(report.httpErrors,{client:label,url:response.url(),status:response.status()});});
  p.on('response',response=>{
    const file=new URL(response.url()).pathname.split('/').pop();
    if(!['coupe.glb','sedan.glb','hatch.glb','quarry-headwall.glb','quarry-east-bay.glb','arena-floor-mask.rgba.gz'].includes(file))return;
    const record=(async()=>{
      assert.equal(response.status(),200);
      const bytes=await response.body(),local=await fs.readFile('dist/'+(file==='arena-floor-mask.rgba.gz'?'assets/':'models/')+file);
      const hash=data=>createHash('sha256').update(data).digest('hex');
      assert.equal(hash(bytes),hash(local),`${label}: actual loaded ${file} must match the tested asset`);
      const collection=['quarry-headwall.glb','quarry-east-bay.glb','arena-floor-mask.rgba.gz'].includes(file)?observed.sceneryAssets:observed.vehicleAssets;
      collection.push({file,bytes:bytes.length,sha256:hash(bytes),observedApplicationRequest:true});
    })();
    record.catch(()=>{});vehicleResponses.push(record);
  });
  p.on('websocket',socket=>observed.webSockets.push(socket.url()));
  const response=await p.goto(address,{waitUntil:'domcontentloaded',timeout:120000});
  assert.equal(response.status(),200,'Published game document must load');
  assert.equal(new URL(p.url()).origin,new URL(url).origin,'Keep the production origin');
  const configuration=await configResponse;
  assert.equal(configuration.status(),200,'Published multiplayer.json must load');
  observed.config=await configuration.json();
  assert.equal(new URL(observed.config.endpoint).protocol,'wss:');
  const policy=(await response.allHeaders())['content-security-policy']??'';
  const connect=policy.split(';').map(s=>s.trim()).find(s=>s.startsWith('connect-src '))??'';
  const endpointOrigin=new URL(observed.config.endpoint).origin;
  assert.ok(connect.split(/\s+/).includes(endpointOrigin),'Published CSP must allow the configured secure WebSocket origin');
  observed.connectPolicy=connect;
  await p.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
  const verifiedAssets=[];
  await verifyForestRequests(forestRequests,verifiedAssets);
  observed.forestAssets=verifiedAssets.filter(asset=>forestAssets.some(expected=>asset.file===expected.file));
  observed.circuitAssets=verifiedAssets.filter(asset=>circuitAssets.some(expected=>asset.file===expected.file));
  observed.geologyAssets=verifiedAssets.filter(asset=>geologyAssets.some(expected=>asset.file===expected.file));
  assert.equal(observed.geologyAssets.length,3,'Each production browser loads the verified cliff photographs');
  assert.equal(observed.circuitAssets.length,4,'Each production browser loads the verified circuit surface');
  await Promise.all(vehicleResponses);
  assert.equal(observed.vehicleAssets.length,3,'Each production browser loads all three verified cars');
  assert.equal(observed.sceneryAssets.length,3,'Each production browser loads the verified headwall, east bay and arena material mask');
  observed.moduleScripts=await p.locator('script[type="module"]').evaluateAll(nodes=>nodes.map(n=>n.src));
  return {p,observed,label};
}

async function connect(client,name){
  const p=client.p;
  if(!await p.locator('#online-form').count())await p.click('#online');
  assert.equal(await p.locator('#server-url').inputValue(),client.observed.config.endpoint,'UI must use the bundled configuration without override');
  await p.fill('#driver-name',name);
  await p.click('#join-online');
  await p.waitForSelector('#invite-url',{timeout:30000});
  assert.ok((await network(p)).connected);
}

async function drive(client){
  const p=client.p;
  await p.bringToFront();
  const before=await network(p),car=before.snapshot.cars.find(c=>c.id===before.id);
  await p.keyboard.down('ArrowUp');
  try{
    await p.waitForFunction(()=>{const n=window.__quarry.network;return n.snapshot.cars.find(c=>c.id===n.id).input.throttle>.5;},null,{timeout:10000});
    await delay(1800);
  }finally{await p.keyboard.up('ArrowUp');}
  const after=await network(p),moved=after.snapshot.cars.find(c=>c.id===after.id);
  const distance=Math.hypot(moved.p.x-car.p.x,moved.p.z-car.p.z);
  assert.ok(distance>1,client.label+' must move its own car after acknowledged throttle');
  return {id:after.id,distance,networkStatus:await p.locator('#network-status').innerText()};
}

try{
  await fs.mkdir(output,{recursive:true});
  forestAssets=await forestRuntimeAssetPlan();
  circuitAssets=await circuitRuntimeAssetPlan();
  geologyAssets=await geologyRuntimeAssetPlan();
  report.geologyAssetsExpected=geologyAssets;
  report.forestAssetsExpected=forestAssets;
  report.circuitAssetsExpected=circuitAssets;
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--disable-renderer-backgrounding','--ignore-gpu-blocklist']});
  let host,guest,invite;
  await check('published-configuration-csp-and-invite',async()=>{
    host=await openPage('host',url);
    await connect(host,'LIVE HOST');
    assert.equal((await network(host.p)).id,0);
    invite=await host.p.locator('#invite-url').inputValue();
    assert.equal(new URL(invite).origin,new URL(url).origin);
    assert.equal(new URL(invite).pathname,new URL(url).pathname);
    assert.equal(new URL(invite).searchParams.get('room'),(await network(host.p)).room);
    await host.p.click('#copy-invite');
    assert.equal(await host.p.evaluate(()=>navigator.clipboard.readText()),invite);
    guest=await openPage('guest',invite);
    await guest.p.waitForSelector('#online-form');
    assert.equal(await guest.p.locator('#room-code').inputValue(),new URL(invite).searchParams.get('room'));
    await connect(guest,'LIVE GUEST');
    assert.equal((await network(guest.p)).id,1);
    await host.p.waitForFunction(()=>window.__quarry.network.snapshot.members.filter(m=>m.connected).length===2);
    assert.equal(host.observed.config.endpoint,guest.observed.config.endpoint);
    for(const client of [host,guest])assert.ok(client.observed.webSockets.some(address=>address.startsWith(client.observed.config.endpoint+'/rooms/')));
    return {invite,host:host.observed,guest:guest.observed};
  });
  await check('two-production-drivers-move',async()=>{
    await host.p.selectOption('#online-mode','playground');await host.p.click('#start-online');
    await Promise.all([host,guest].map(c=>c.p.waitForFunction(()=>window.__quarry.state==='playing',null,{timeout:30000})));
    const movement=[await drive(host),await drive(guest)];
    for(const client of [host,guest])await client.p.screenshot({path:output+'/'+client.label+'.png'});
    return movement;
  });
  await check('assets-browser-and-csp-clean',async()=>{
    await delay(500);
    for(const client of [host,guest]){
      const violations=await client.p.evaluate(()=>window.__originSmokeCSP);
      for(const violation of violations)add(report.cspViolations,{client:client.label,...violation});
    }
    assert.deepEqual(report.httpErrors,[],'No HTTP asset errors');
    // Chrome can cancel optional Analytics sendBeacon requests after a page
    // transition. Retain those observations, but fail on every game request
    // and every other network error rather than treating telemetry as an asset.
    report.canceledTelemetry=report.failedRequests.filter(request=>{
      const address=new URL(request.url);
      return request.error==='net::ERR_ABORTED' &&
        ['www.google-analytics.com','region1.google-analytics.com','analytics.google.com'].includes(address.hostname) &&
        address.pathname==='/g/collect';
    });
    const failedResources=report.failedRequests.filter(request=>!report.canceledTelemetry.includes(request));
    assert.deepEqual(failedResources,[],'No failed game or other resource requests');
    assert.deepEqual(report.browserErrors,[],'No browser errors');
    assert.deepEqual(report.cspViolations,[],'No CSP violations');
    return {httpErrors:0,failedResources:0,canceledTelemetry:report.canceledTelemetry.length,browserErrors:0,cspViolations:0};
  });
  report.ok=true;
}catch(error){report.errors.push({error:String(error),stack:error.stack});}
finally{
  for(const context of contexts)await context.close().catch(error=>report.errors.push({error:'Context cleanup: '+error}));
  await browser?.close().catch(error=>report.errors.push({error:'Browser cleanup: '+error}));
  if(report.errors.length)report.ok=false;
  await fs.mkdir(output,{recursive:true});
  await fs.writeFile(output+'/report.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
}
if(!report.ok)process.exitCode=1;
