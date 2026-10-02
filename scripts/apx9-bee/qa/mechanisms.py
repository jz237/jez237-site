"""Real-time kinematics, mode restoration, mobile framing and complete autoplay tour."""
import asyncio, os
from playwright.async_api import async_playwright

async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox','--use-gl=angle','--use-angle=vulkan','--enable-features=Vulkan','--ignore-gpu-blocklist'])
  page=await b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));count=0
  async def check(name,value):
   nonlocal count
   assert value,name
   count+=1;print('PASS',name,flush=True)
  await page.goto(os.environ.get('APX9_URL','http://127.0.0.1:8771/demos/apx9-bee/')+'?qa&q=low&acc=0');await page.locator('.operate-launch').wait_for(timeout=120000)
  await page.get_by_role('button',name='X-ray shells',exact=True).click();await page.wait_for_timeout(300)
  pose='''()=>['flight-motor/gear-train/pinion','flight-motor/crank-linkage/slider','wing-mount-r/servo-gearbox/planets/planet-0'].map(id=>{const n=__apx.bee.get(id).node;return [...n.position.toArray(),...n.quaternion.toArray()]})'''
  before=await page.evaluate(pose);await page.wait_for_timeout(400);after=await page.evaluate(pose)
  await check('gear, slider and planet all move',all(a!=b for a,b in zip(before,after)))
  await page.get_by_role('button',name='Pause mechanisms',exact=True).click();await page.wait_for_timeout(50);before=await page.evaluate(pose);await page.wait_for_timeout(250)
  await check('mechanism pause freezes all poses',before==await page.evaluate(pose))
  await page.get_by_role('button',name='Resume mechanisms',exact=True).click()
  await page.get_by_role('button',name='Wing gearbox',exact=True).click();await page.wait_for_timeout(1350)
  await check('gearbox closeup assembles and isolates',await page.evaluate('__apx.getExplode()===0 && __apx.mechanisms.state.focus.endsWith("servo-gearbox")'))
  await page.set_viewport_size({'width':390,'height':844});await page.wait_for_timeout(1400)
  await check('mobile mechanism stays above controls',await page.evaluate('''()=>{const pts=[];__apx.bee.worldCorners([...__apx.bee.get(__apx.mechanisms.state.focus).walk()],pts);const top=document.querySelector('.xray-mechanisms').getBoundingClientRect().top;return pts.every(p=>{p.project(__apx.stage.camera);return Math.abs(p.x)<1.02&&(1-p.y)*innerHeight/2<top+5})}'''))
  await page.locator('.operate-launch').click();await page.wait_for_timeout(200)
  await check('leaving macro does not override operating mode',await page.evaluate('__apx.operations.state.mode==="power" && !__apx.selection.xray && __apx.mechanisms.state.focus===null && __apx.getExplode()===0'))
  await page.set_viewport_size({'width':1440,'height':1000});await page.get_by_role('button',name='Guided tour',exact=True).click();await page.wait_for_timeout(250)
  await check('tour exits operating mode',await page.evaluate('__apx.operations.state.mode==="inspect" && __apx.ui.state.tour===0'))
  await page.get_by_role('button',name='Pause tour',exact=True).click();await page.wait_for_timeout(50)
  snap='[__apx.ui.state.tourTime,__apx.getExplode(),...__apx.stage.camera.position.toArray()]'
  before=await page.evaluate(snap);await page.wait_for_timeout(300)
  await check('tour pause freezes camera explosion and timeline',before==await page.evaluate(snap))
  await page.get_by_role('button',name='Resume tour',exact=True).click()
  seen=set();xray_seen=False
  for _ in range(200):
   await page.wait_for_timeout(1000)
   step,paused,xray,finite=await page.evaluate('[__apx.ui.state.tour,__apx.ui.state.tourPaused,__apx.selection.xray,__apx.stage.camera.position.toArray().every(Number.isFinite)]')
   assert finite and not paused,'invalid or unexpectedly paused tour'
   if step<0:break
   if step not in seen:print('Tour stop',step+1,flush=True)
   seen.add(step);xray_seen|=xray
  await check('all 17 stops play without Next',seen==set(range(17)) and step==-1)
  await check('tour includes working cutaways',xray_seen)
  await check('tour returns to normal inspection',await page.evaluate('!__apx.selection.xray && !__apx.mechanisms.state.active'))
  await check('no browser errors',not errors)
  print(f'{count} checks passed',flush=True);await b.close()
asyncio.run(main())
