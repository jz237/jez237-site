"""Systems-specific motion, resizing and reversible-material checks."""
import asyncio, os
from playwright.async_api import async_playwright

async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ.get('CHROME','/usr/bin/google-chrome'),headless=True,args=['--no-sandbox','--use-gl=angle','--use-angle=vulkan','--enable-features=Vulkan','--ignore-gpu-blocklist'])
  page=await browser.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));count=0
  async def check(name,value):
   nonlocal count
   assert value,name
   count+=1;print('PASS',name,flush=True)
  url=os.environ.get('APX9_URL','http://127.0.0.1:8771/demos/apx9-bee/')
  await page.goto(url+'?qa&q=low&acc=0');await page.locator('.operate-launch').wait_for(timeout=120000)
  await page.evaluate('window.baseMaterials=__apx.bee.parts.flatMap(p=>p.meshes.map(m=>m.material.uuid))')
  await page.locator('.operate-launch').click();await page.get_by_role('button',name='Systems',exact=True).click();await page.wait_for_timeout(250)
  position='__apx.operations.systems.paths[0].particles[0].position.toArray()'
  before=await page.evaluate(position);await page.wait_for_timeout(350)
  await check('energy flows along its path',before!=await page.evaluate(position))
  await page.get_by_role('button',name='Pause motion',exact=True).click();before=await page.evaluate(position);await page.wait_for_timeout(200)
  await check('pause freezes energy pulses',before==await page.evaluate(position))
  await page.get_by_role('button',name='Resume motion',exact=True).click()
  await page.get_by_role('button',name='Sensor signals',exact=True).click()
  await check('signals use packet geometry',await page.evaluate('__apx.operations.systems.paths.length===5 && __apx.operations.systems.paths[0].particles[0].geometry.type==="BoxGeometry"'))
  await page.locator('.system-routes button').nth(3).click();await page.wait_for_timeout(100)
  await check('focused route retains only its endpoint markers',await page.evaluate('__apx.operations.systems.nodes.filter(n=>n.ring.visible).length===2'))
  await page.get_by_role('button',name='Show all routes',exact=True).click();await page.wait_for_timeout(100)
  await check('all routes restores every stream',await page.evaluate('__apx.operations.systems.paths.every(p=>p.particles.every(m=>m.visible))'))
  await page.set_viewport_size({'width':390,'height':844});await page.wait_for_timeout(600)
  await check('mobile resize keeps the bee in its display band',await page.evaluate('''()=>{const points=[];__apx.bee.worldCorners(undefined,points);const c=__apx.stage.camera,bottom=document.querySelector('.operate-panel').getBoundingClientRect().top;return points.every(p=>{p.project(c);const y=(1-p.y)*innerHeight/2;return Math.abs(p.x)<1.02&&y>95&&y<bottom+5})}'''))
  await page.get_by_role('button',name='Energy',exact=True).click()
  await page.keyboard.press('x');await page.wait_for_timeout(200)
  await check('x-ray exits the material overlay safely',await page.evaluate('__apx.operations.state.mode==="inspect" && __apx.selection.xray'))
  await page.keyboard.press('x');await page.wait_for_timeout(100)
  await check('x-ray round trip restores exact source materials',await page.evaluate('JSON.stringify(baseMaterials)===JSON.stringify(__apx.bee.parts.flatMap(p=>p.meshes.map(m=>m.material.uuid)))'))
  await check('systems overlays leave inspection',not await page.locator('.systems-hud').is_visible())
  await check('no JavaScript errors',not errors)
  print(f'{count} checks passed',flush=True);await browser.close()
asyncio.run(main())
