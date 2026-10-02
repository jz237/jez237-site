"""Repair autoplay, real part motion, reversible state and mobile playback checks."""
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
  async def seek(t):
   await page.locator('[aria-label="Repair sequence progress"]').fill(str(t*10));await page.wait_for_timeout(150)
  await page.goto(os.environ.get('APX9_URL','http://127.0.0.1:8772/demos/apx9-bee/')+'?qa&q=low&acc=0');await page.locator('.operate-launch').wait_for(timeout=120000)
  await page.evaluate('''()=>{__apx.rig.sweepAnim=null;__apx.setExplode(0,0);window.originals=__apx.bee.parts.map(p=>({id:p.id,pos:p.node.position.toArray(),q:p.node.quaternion.toArray(),m:p.meshes.map(m=>m.material.uuid)}));}''')
  await page.locator('.operate-launch').click();await page.get_by_role('button',name='Repair',exact=True).click();await page.wait_for_timeout(400)
  await check('repair begins without Next',await page.evaluate('__apx.operations.state.repairT>0 && !__apx.operations.state.paused'))
  await page.get_by_role('button',name='Pause motion',exact=True).click();await page.wait_for_timeout(100)
  snap='[__apx.operations.state.repairT,...__apx.stage.camera.position.toArray(),...__apx.bee.get("wing-r").node.quaternion.toArray()]'
  before=await page.evaluate(snap);await page.wait_for_timeout(250)
  await check('pause freezes time camera and wing',before==await page.evaluate(snap))
  await seek(10)
  await check('real thorax cover lifts away',await page.evaluate('__apx.bee.get("thorax-armor").node.position.y > originals.find(p=>p.id==="thorax-armor").pos[1]+7'))
  await seek(16)
  await check('failed actuator physically extracted',await page.evaluate('__apx.bee.get("wing-mount-r/oscillation-servo").node.position.x < -3'))
  await check('separate replacement exists',await page.evaluate('__apx.operations.repair.spare.visible && __apx.operations.repair.spare.children.length>0'))
  await check('service labels are visible',await page.locator('.repair-hud').is_visible())
  distance='''()=>{const r=__apx.operations.repair,servo=__apx.bee.get('wing-mount-r/oscillation-servo');return new __apx.THREE.Vector3().setFromMatrixPosition(r.spare.matrix).distanceTo(servo.node.parent.localToWorld(new __apx.THREE.Vector3()));}'''
  before=await page.evaluate(distance);await seek(22)
  await check('replacement slides into coupling',await page.evaluate(distance)<before)
  await seek(25)
  await check('replacement hands off to restored source assembly',await page.evaluate('!__apx.operations.repair.spare.visible && __apx.bee.get("wing-mount-r/oscillation-servo").node.visible'))
  await page.get_by_role('button',name='Resume motion',exact=True).click()
  gear='__apx.bee.get("wing-mount-r/servo-gearbox/planets/planet-0").node.quaternion.toArray()'
  before=await page.evaluate(gear);await page.wait_for_timeout(350)
  await check('calibration runs modeled gears',before!=await page.evaluate(gear))
  await page.get_by_role('button',name='Pause motion',exact=True).click();await page.wait_for_timeout(100);before=await page.evaluate(gear);await page.wait_for_timeout(200)
  await check('pause freezes calibration gears',before==await page.evaluate(gear))
  await page.get_by_role('button',name='Back to inspection',exact=True).click();await page.wait_for_timeout(200)
  print('Restoration differences',await page.evaluate('''__apx.bee.parts.filter((p,i)=>JSON.stringify(p.node.position.toArray())!==JSON.stringify(originals[i].pos)||JSON.stringify(p.node.quaternion.toArray())!==JSON.stringify(originals[i].q)||!p.meshes.every((m,j)=>m.material.uuid===originals[i].m[j])).map(p=>p.id)'''),flush=True)
  await check('exit restores exact original materials and transforms',await page.evaluate('''__apx.bee.parts.every((p,i)=>JSON.stringify(p.node.position.toArray())===JSON.stringify(originals[i].pos)&&JSON.stringify(p.node.quaternion.toArray())===JSON.stringify(originals[i].q)&&p.meshes.every((m,j)=>m.material.uuid===originals[i].m[j]))'''))
  await check('service overlays and isolation removed',await page.evaluate('!__apx.operations.repair.root.visible&&!__apx.selection.isolate') and not await page.locator('.repair-hud').is_visible())
  await page.locator('.operate-launch').click();await page.get_by_role('button',name='Repair',exact=True).click()
  seen=set();flew=False
  for _ in range(80):
   await page.wait_for_timeout(700)
   step,t,y=await page.evaluate('[__apx.operations.state.repair,__apx.operations.state.repairT,__apx.bee.root.position.y]');flew|=y>3
   if step not in seen:print('Autoplay stage',step,flush=True)
   seen.add(step)
   if t>=44:break
  await check('whole sequence completes hands-free',seen==set(range(8)) and t==44)
  await check('test flight lifts and lands',flew and y==0)
  await check('success is announced','PASS' in await page.locator('.op-status').inner_text())
  await page.set_viewport_size({'width':390,'height':844});await page.wait_for_timeout(400);await seek(21)
  await check('mobile pause remains visible without scrolling',await page.get_by_role('button',name='Resume motion',exact=True).evaluate('e=>{const r=e.getBoundingClientRect(),p=e.closest(".operate-panel").getBoundingClientRect();return r.top>=p.top&&r.bottom<=p.bottom&&r.right<=innerWidth}'))
  await check('mobile replacement fits above panel',await page.evaluate('''()=>{const p=new __apx.THREE.Vector3().setFromMatrixPosition(__apx.operations.repair.spare.matrix).project(__apx.stage.camera);const y=(1-p.y)*innerHeight/2;return Math.abs(p.x)<1&&y>105&&y<document.querySelector('.operate-panel').getBoundingClientRect().top}'''))
  await page.get_by_role('button',name='Back to inspection',exact=True).click();await page.emulate_media(reduced_motion='reduce');await page.locator('.operate-launch').click();await page.get_by_role('button',name='Repair',exact=True).click();await page.wait_for_timeout(200)
  await check('reduced motion starts repair paused',await page.evaluate('__apx.operations.state.paused&&__apx.operations.state.repairT===0'))
  await page.get_by_role('button',name='Resume motion',exact=True).click();await page.wait_for_timeout(200)
  await check('reduced motion can explicitly start playback',await page.evaluate('__apx.operations.state.repairT>0'))
  await check('no browser errors',not errors)
  print(f'{count} checks passed',flush=True);await b.close()
asyncio.run(main())
