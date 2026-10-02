"""Expanded cutaway motion, linked kinematics, pause, exact restoration and mobile UX."""
import asyncio, os
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--use-gl=angle','--use-angle=vulkan','--enable-features=Vulkan','--ignore-gpu-blocklist'])
  page=await b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));count=0
  async def check(name,good):
   nonlocal count
   assert good,name
   count+=1;print('PASS',name,flush=True)
  await page.goto(os.environ.get('APX9_URL','http://127.0.0.1:8773/demos/apx9-bee/')+'?qa&q=low&acc=0');await page.locator('.operate-launch').wait_for(timeout=120000)
  await page.evaluate('''()=>{__apx.rig.sweepAnim=null;__apx.setExplode(0,0);window.rest=__apx.bee.parts.map(p=>({p:p.node.position.toArray(),q:p.node.quaternion.toArray(),m:p.meshes.map(m=>m.material.uuid)}));}''')
  await page.get_by_role('button',name='X-ray shells',exact=True).click();await page.wait_for_timeout(300)
  snap='__apx.bee.parts.map(p=>[...p.node.position.toArray(),...p.node.quaternion.toArray()])'
  before=await page.evaluate(snap);await page.wait_for_timeout(400);after=await page.evaluate(snap)
  moving=sum(a!=b for a,b in zip(before,after));await check('81 component groups actually change pose',moving==81)
  await page.get_by_role('button',name='Pause mechanisms',exact=True).click();await page.wait_for_timeout(100);before=await page.evaluate(snap);await page.wait_for_timeout(200)
  await check('pause freezes every internal component',before==await page.evaluate(snap))
  await page.get_by_role('button',name='Resume mechanisms',exact=True).click()
  await page.locator('[aria-label="Mechanism playback speed"]').fill('25');await page.wait_for_timeout(50);clock=await page.evaluate('__apx.mechanisms.state.clock');await page.wait_for_timeout(400);slow=await page.evaluate('__apx.mechanisms.state.clock')-clock
  await page.locator('[aria-label="Mechanism playback speed"]').fill('200');await page.wait_for_timeout(50);clock=await page.evaluate('__apx.mechanisms.state.clock');await page.wait_for_timeout(400);fast=await page.evaluate('__apx.mechanisms.state.clock')-clock
  await check('speed control changes mechanical playback rate',fast>slow*4)
  await page.locator('[aria-label="Mechanism playback speed"]').fill('100')
  await page.get_by_role('button',name='Cooling pumps',exact=True).click();await page.wait_for_timeout(1400)
  await check('all six rods stay attached to crank pins',await page.evaluate('''()=>{const a=__apx,T=a.THREE;return Array.from({length:6},(_,i)=>{const b='power-core/coolant-bank/pump-'+i;const pin=a.bee.get(b+'/eccentric').node.localToWorld(new T.Vector3(0,.22,0));const rod=a.bee.get(b+'/conrod').node.localToWorld(new T.Vector3(0,-.36,0));return pin.distanceTo(rod)<1e-6;}).every(Boolean)}'''))
  await check('all six rods stay attached to pistons',await page.evaluate('''()=>{const a=__apx,T=a.THREE;return Array.from({length:6},(_,i)=>{const b='power-core/coolant-bank/pump-'+i;return a.bee.get(b+'/piston').node.getWorldPosition(new T.Vector3()).distanceTo(a.bee.get(b+'/conrod').node.localToWorld(new T.Vector3(0,.36,0)))<1e-6;}).every(Boolean)}'''))
  for name in ['Optical head','Pollen drive','Sampling jaws','Tail probe']:
   await page.get_by_role('button',name=name,exact=True).click();await page.wait_for_timeout(1350)
   await check(name+' closeup stays in frame',await page.evaluate('''()=>{const a=__apx,pts=[];a.bee.worldCorners([...a.bee.get(a.mechanisms.state.focus).walk()],pts);return pts.every(p=>{p.project(a.stage.camera);return Math.abs(p.x)<1.05&&Math.abs(p.y)<1.05&&Math.abs(p.z)<1})}'''))
  await page.set_viewport_size({'width':390,'height':844});await page.get_by_role('button',name='Cooling pumps',exact=True).click();await page.wait_for_timeout(1400)
  await check('mobile pause always visible',await page.get_by_role('button',name='Pause mechanisms',exact=True).evaluate('e=>{const r=e.getBoundingClientRect(),p=e.closest(".xray-mechanisms").getBoundingClientRect();return r.top>=p.top&&r.bottom<=p.bottom&&r.right<=innerWidth}'))
  await check('mobile internals fit above controls',await page.evaluate('''()=>{const a=__apx,pts=[];a.bee.worldCorners([...a.bee.get(a.mechanisms.state.focus).walk()],pts);const top=document.querySelector('.xray-mechanisms').getBoundingClientRect().top;return pts.every(p=>{p.project(a.stage.camera);return Math.abs(p.x)<1.02&&(1-p.y)*innerHeight/2<top+5})}'''))
  await page.get_by_role('button',name='X-ray shells',exact=True).click();await page.wait_for_timeout(200)
  await check('exit restores all source poses and materials exactly',await page.evaluate('''__apx.bee.parts.every((p,i)=>JSON.stringify(p.node.position.toArray())===JSON.stringify(rest[i].p)&&JSON.stringify(p.node.quaternion.toArray())===JSON.stringify(rest[i].q)&&p.meshes.every((m,j)=>m.material.uuid===rest[i].m[j]))'''))
  await check('no browser errors',not errors)
  print(f'{count} checks passed',flush=True);await b.close()
asyncio.run(main())
