import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const url=process.env.QUARRY_QA_URL??'http://127.0.0.1:8795/';
const endpoint=process.env.QUARRY_TEST_ENDPOINT??'ws://127.0.0.1:8789';
const output=process.env.QUARRY_QA_OUTPUT??'outputs/multiplayer';
const report={ok:false,url,endpoint,started:new Date().toISOString(),checks:{},errors:[],consoleErrors:[]};
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--disable-renderer-backgrounding','--ignore-gpu-blocklist']});
const contexts=[];
function recordError(error){const value=String(error);if(!report.consoleErrors.includes(value)&&report.consoleErrors.length<12)report.consoleErrors.push(value);}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function check(name,fn){
  console.log('CHECK',name);
  try{report.checks[name]=await fn(); console.log('PASS',name);}
  catch(error){report.errors.push({name,error:String(error),stack:error.stack});console.log('FAIL',name,String(error));throw error;}
}
async function page(){
  const context=await browser.newContext({viewport:{width:1280,height:720},permissions:['clipboard-read','clipboard-write']});contexts.push(context);
  await context.addInitScript(()=>{
    localStorage.setItem('quarry-impact-v1',JSON.stringify({quality:'medium'}));
    window.__qaSockets=[];window.__qaSocketEvents=[];
    const Base=window.WebSocket;
    window.WebSocket=class extends Base{constructor(...args){super(...args);window.__qaSockets.push(this);this.addEventListener('close',e=>window.__qaSocketEvents.push({event:'close',code:e.code,reason:e.reason}));this.addEventListener('open',()=>window.__qaSocketEvents.push({event:'open'}));this.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.type==='welcome'||m.type==='error')window.__qaSocketEvents.push({event:m.type,id:m.id,message:m.message,dents:m.snapshot?.cars.reduce((n,c)=>n+(c.dents?.length??0),0)});});}};
  });
  const p=await context.newPage();
  p.on('pageerror',e=>recordError(e.stack??e));
  p.on('console',m=>{if(m.type()==='error')recordError(m.text());});
  await p.goto(url);await p.waitForFunction(()=>window.__quarry?.state==='menu',null,{timeout:120000});
  return p;
}
async function join(p,name,room=''){
  if(!(await p.locator('#online-form').count()))await p.click('#online');
  await p.fill('#driver-name',name);await p.fill('#room-code',room);
  if(!(await p.locator('#server-url').isVisible()))await p.locator('#online-form details summary').click();
  await p.fill('#server-url',endpoint);
  await p.click('#join-online');
}
const network=p=>p.evaluate(()=>window.__quarry.network);
let a,b,room;
try{
  a=await page(); b=await page();
  await check('invalid-room-feedback',async()=>{
    await join(a,'HOST','BAD');await a.waitForFunction(()=>document.getElementById('online-message')?.textContent?.includes('six'));
    const message=await a.locator('#online-message').innerText();assert.equal(await a.locator('#join-online').isEnabled(),true);return message;
  });
  await check('two-clients-ui-create-join-invite',async()=>{
    await a.fill('#room-code','');await a.click('#join-online');await a.waitForSelector('#invite-url',{timeout:30000});
    room=(await network(a)).room;assert.equal((await network(a)).id,0);
    const invite=await a.locator('#invite-url').inputValue();assert.equal(new URL(invite).searchParams.get('room'),room);
    await a.click('#copy-invite');const copied=await a.evaluate(()=>navigator.clipboard.readText());assert.equal(copied,invite);
    await b.goto(copied);await b.waitForSelector('#online-form',{timeout:120000});assert.equal(await b.locator('#room-code').inputValue(),room);
    await join(b,'GUEST',room);await b.waitForSelector('#invite-url',{timeout:30000});assert.equal((await network(b)).id,1);
    await a.waitForFunction(()=>window.__quarry.network.snapshot.members.filter(m=>m.connected).length===2);
    assert.equal(await b.locator('#start-online').count(),0);
    await a.screenshot({path:output+'/lobby-host.png'});await b.screenshot({path:output+'/lobby-guest.png'});
    return {room,invite,ids:[0,1],clipboard:true};
  });
  await check('host-start-and-both-clients-drive',async()=>{
    await a.selectOption('#online-mode','derby');await a.click('#start-online');
    await Promise.all([a,b].map(p=>p.waitForFunction(()=>window.__quarry.state==='playing',null,{timeout:30000})));
    const before=await Promise.all([a,b].map(async p=>{const n=await network(p);return n.snapshot.cars.find(c=>c.id===n.id);}));
    await a.keyboard.down('ArrowUp');await delay(2000);await a.keyboard.up('ArrowUp');
    await b.keyboard.down('ArrowUp');await delay(2000);await b.keyboard.up('ArrowUp');
    const after=await Promise.all([a,b].map(async p=>{const n=await network(p);return n.snapshot.cars.find(c=>c.id===n.id);}));
    const distances=after.map((c,i)=>Math.hypot(c.p.x-before[i].p.x,c.p.z-before[i].p.z));
    distances.forEach(d=>assert.ok(d>1,'Each client must drive its own car'));
    await a.screenshot({path:output+'/playing-host.png'});await b.screenshot({path:output+'/playing-guest.png'});
    return {distances,ids:after.map(c=>c.id),ticks:[(await network(a)).snapshot.tick,(await network(b)).snapshot.tick],networkStatus:await Promise.all([a,b].map(p=>p.locator('#network-status').innerText()))};
  });
  await check('pause-clears-controls-room-continues',async()=>{
    await a.keyboard.down('ArrowUp');await delay(200);await a.keyboard.press('Escape');
    await a.waitForFunction(()=>window.__quarry.state==='paused');
    const before=(await network(b)).snapshot.tick;await delay(500);
    const n=await network(a),c=n.snapshot.cars.find(c=>c.id===n.id);
    assert.equal(c.input.throttle,0);assert.equal(c.input.brake,1);assert.ok((await network(b)).snapshot.tick>before+10);
    await a.keyboard.up('ArrowUp');await a.click('#resume');return {controls:c.input,continuedTicks:(await network(b)).snapshot.tick-before};
  });
  await check('blur-clears-controls',async()=>{
    await b.keyboard.down('ArrowUp');await delay(200);await b.evaluate(()=>window.dispatchEvent(new Event('blur')));await delay(350);
    const n=await network(b),c=n.snapshot.cars.find(c=>c.id===n.id);assert.equal(c.input.throttle,0);assert.equal(c.input.brake,1);
    await b.keyboard.up('ArrowUp');if(await b.locator('#resume').count())await b.click('#resume');return c.input;
  });
  await check('reconnect-keeps-token-seat-and-damage',async()=>{
    await delay(2000);
    const before=await b.evaluate(()=>({n:window.__quarry.network,token:sessionStorage.getItem('quarry-room-'+window.__quarry.network.room),inspect:window.__quarry.inspect(),stats:window.__quarry.stats,sockets:window.__qaSockets.length}));
    await b.evaluate(()=>window.__qaSockets.at(-1).close(4002,'QA reconnect'));
    await b.waitForFunction(count=>window.__qaSockets.length>count&&window.__quarry.network.connected,before.sockets,{timeout:15000});
    const after=await b.evaluate(()=>({n:window.__quarry.network,token:sessionStorage.getItem('quarry-room-'+window.__quarry.network.room),inspect:window.__quarry.inspect(),stats:window.__quarry.stats}));
    assert.equal(after.n.id,before.n.id);assert.equal(after.token,before.token);assert.ok(after.n.snapshot.tick>=before.n.snapshot.tick);
    assert.equal(after.n.snapshot.members.filter(m=>m.connected).length,2);
    const historicalCount=await b.evaluate(()=>window.__qaSocketEvents.filter(e=>e.event==='welcome').at(-1).dents);
    const lostPanels=after.inspect.reduce((n,c)=>n+c.detached,0);
    // New live effects may happen while AI collide. Reconnect itself must not
    // create historical detached-part bodies; the client reset starts at zero.
    if(historicalCount>0&&after.stats.debris!==undefined)assert.ok(after.stats.debris<=4,'Historical wreck reconstruction must not replay a pile of detached bodies');
    return {id:after.n.id,sameToken:true,historicalCount,lostPanels,debris:after.stats.debris,particles:after.stats.activeParticles};
  });
  await check('host-leave-successor',async()=>{
    await a.keyboard.press('Escape');await a.locator('#main-menu').click();
    await b.waitForFunction(()=>window.__quarry.network.snapshot.members.some(m=>m.id===window.__quarry.network.id&&m.host),null,{timeout:15000});
    const members=(await network(b)).snapshot.members;assert.equal(members.filter(m=>m.connected&&m.host).length,1);return members;
  });
  await check('full-room-ui-feedback',async()=>{
    const formerHostToken=await a.evaluate(room=>sessionStorage.getItem('quarry-room-'+room),room);
    await b.evaluate(async({endpoint,room,formerHostToken})=>{
      window.__qaFillers=[];
      for(let i=0;i<7;i++)await new Promise((resolve,reject)=>{
        const ws=new WebSocket(endpoint+'/rooms/'+room);window.__qaFillers.push(ws);const timer=setTimeout(()=>reject(new Error('Filler timeout')),10000);
        ws.onopen=()=>ws.send(JSON.stringify({type:'hello',protocol:1,name:'QA FILLER '+i,kind:'coupe',...(i===0?{token:formerHostToken}:{})}));
        ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.type==='welcome'){clearTimeout(timer);resolve();}else if(m.type==='error'){clearTimeout(timer);reject(new Error(m.message));}};
      });
    },{endpoint,room,formerHostToken});
    await a.evaluate(room=>sessionStorage.removeItem('quarry-room-'+room),room);
    await join(a,'NINTH DRIVER',room);await a.waitForFunction(()=>document.getElementById('online-message')?.textContent?.toLowerCase().includes('full'),null,{timeout:15000});
    const message=await a.locator('#online-message').innerText();assert.equal((await network(a)).connected,false);
    await a.screenshot({path:output+'/full-room.png'});return message;
  });
  report.ok=report.consoleErrors.length===0;
}catch(error){if(!report.errors.length)report.errors.push({name:'setup',error:String(error),stack:error.stack});
  report.failureState=await Promise.all([a,b].filter(Boolean).map(p=>p.evaluate(()=>({network:window.__quarry?.network,stats:window.__quarry?.stats,sockets:window.__qaSocketEvents,socketStates:window.__qaSockets.map(s=>s.readyState)})).catch(e=>String(e))));
}
finally{
  if(b)await b.evaluate(()=>window.__qaFillers?.forEach(ws=>ws.close())).catch(()=>{});
  for(const c of contexts)await c.close();await browser.close();
  await fs.writeFile(output+'/browser-qa.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
}
if(!report.ok)process.exitCode=1;
