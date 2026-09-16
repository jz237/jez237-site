const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),assert=require('assert');
(async()=>{
 const b=await chromium.launch({headless:true,channel:'msedge',args:['--enable-webgl','--ignore-gpu-blocklist']});
 const page=await b.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('ERR_CONNECTION_REFUSED'))errors.push(m.text());});
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await page.route('**/js/main.js*',async route=>{const r=await route.fetch();await route.fulfill({response:r,body:(await r.text()).replace('G, quality, world, startGame,','renderer, scene, foliage, sky, composer, Tank, getHeight, G, quality, world, startGame,')});});
 await page.route('**/js/tank.js?unbatchedQA',async route=>{const r=await route.fetch();await route.fulfill({response:r,body:(await r.text()).replace('  batchRigidParts(root,[hull,turret,pivot,recoilGrp,...spinning.filter(o=>o.isGroup)],moving);','')});});
 await page.goto(process.env.IRON_RIDGE_URL||'http://127.0.0.1:8080/');await page.waitForFunction(()=>window.__IR);
 await page.waitForTimeout(700);
 const result=await page.evaluate(async()=>{
  const ir=__IR,T=await import('three'),report={};ir.startGame();ir.quality.setLock(2);ir.pump(60);
  const foliage=ir.foliage, t=foliage.trees.find(t=>t.alive&&!t.culled&&t.variant===1);
  const mat=new T.Matrix4();
  const check=(ok,msg)=>{if(!ok)throw Error(msg);};
  report.lod=[];
  for(const q of [3,0,1,2,3]){
   ir.quality.setLock(q);foliage.update(.2,t.x,t.z);foliage.update(.6,t.x,t.z);
   const n=foliage.nearSelected.length,rendered=foliage.nearMeshes.reduce((n,p)=>n+p.wood.count,0);
   check(n<=foliage.nearCap&&rendered<=80,'near pool exceeds cap or count mismatches');
   for(const r of foliage.nearSelected){r.mesh.getMatrixAt(r.instanceId,mat);if(r.lodTo===1)check(mat.elements[0]===0&&mat.elements[10]===0,'fully detailed tree doubled');}
   report.lod.push({q,n,cap:foliage.nearCap});
  }
  // Transition timing, interruption, and settled far restoration.
  const lod=await import('./js/tree-lod.js?v=detail3');
  const subject=foliage.nearSelected.find(r=>r.lodTo===1);check(subject,'need inner tree');
  foliage.update(.17,subject.x+100,subject.z+100);
  check(subject.lodTo===0&&subject.nearSlot>=0,'outgoing detail disappeared instantly');
  foliage.update(.22,subject.x+100,subject.z+100);
  const mid=lod.treeBlend(subject,foliage.windU.value);check(mid>0&&mid<1,'transition did not interpolate');
  foliage.update(.6,subject.x+100,subject.z+100);
  check(subject.nearSlot===-1&&lod.treeBlend(subject,foliage.windU.value)===0,'outgoing slot was not released');
  // Camera teleports cannot exhaust the bounded overlap pool or leave holes.
  for(let i=0;i<18;i++) {
    const r=foliage.trees[(i*117)%foliage.trees.length];foliage.update(.17,r.x,r.z);
    check(foliage.nearResidents.length<=80,'transition pool grew without bound');
  }
  foliage.update(.2,t.x,t.z);foliage.update(.6,t.x,t.z);
  report.transitions={mid,capacity:80};
  // GPU proof: complementary dithering covers every pixel exactly once.
  const target=new T.WebGLRenderTarget(32,32),testScene=new T.Scene(),clock={value:0};
  const cam=new T.OrthographicCamera(-1,1,1,-1,.1,10);cam.position.z=2;
  const attrs=[];
  for(const role of [0,1]) {
    const geo=new T.PlaneGeometry(2,2),m=new T.MeshBasicMaterial({color:role?0x00ff00:0xff0000,depthTest:false});
    lod.installTreeFade(m,role,clock,false);const attr=lod.treeLodAttribute(geo,1);attrs.push(attr);
    const mesh=new T.InstancedMesh(geo,m,1);mesh.setMatrixAt(0,new T.Matrix4());testScene.add(mesh);
  }
  const previousTone=ir.renderer.toneMapping;ir.renderer.toneMapping=T.NoToneMapping;
  report.dither=[];
  for(const blend of [0,.5,1]) {
    for(const attr of attrs){attr.setXYZ(0,blend,blend,0);attr.needsUpdate=true;}
    ir.renderer.setRenderTarget(target);ir.renderer.render(testScene,cam);
    const pixels=new Uint8Array(32*32*4);ir.renderer.readRenderTargetPixels(target,0,0,32,32,pixels);
    let green=0;
    for(let i=0;i<pixels.length;i+=4){check(pixels[i]+pixels[i+1]>250,'dither left an uncovered pixel');if(pixels[i+1]>200)green++;}
    if(blend===.5)check(green>400&&green<625,'mid fade coverage is wrong');report.dither.push({blend,green});
  }
  ir.renderer.setRenderTarget(null);ir.renderer.toneMapping=previousTone;target.dispose();
  const rec=foliage.nearSelected.find(r=>r.variant===1)||foliage.nearSelected[0];
  check(rec,'need nearby tree');foliage.topple(rec,1,.2,1);
  const fallen=foliage.falling.at(-1);let disposed=0;
  fallen.mesh.traverse(o=>{if(o.isMesh)o.material.addEventListener('dispose',()=>disposed++);});
  check(fallen.mesh.children.length===2,'near tree lost branches or canopy');
  const nearSource=foliage.nearLeafMaterials[rec.variant];
  check(fallen.mesh.children[0].material.map===nearSource.map,'fallen tree texture mismatch');
  check(fallen.mesh.children[0].material.onBeforeCompile===nearSource.onBeforeCompile,'fallen lighting/fade shader lost');
  foliage.update(.2,rec.x,rec.z);check(!foliage.nearSelected.includes(rec),'destroyed tree selected');
  foliage.update(.2,240,240);foliage.setTreeFraction(.4);foliage.setTreeFraction(1);foliage.update(.2,rec.x,rec.z);
  rec.mesh.getMatrixAt(rec.instanceId,mat);check(mat.elements[0]===0,'destroyed far tree resurrected');
  foliage.update(8,rec.x,rec.z);check(!foliage.falling.includes(fallen)&&disposed===2,'fall cleanup failed');
  report.falling={disposed,restored:false};
  const living=foliage.nearSelected[0];foliage.update(.2,-270,-270);foliage.update(.6,-270,-270);living.mesh.getMatrixAt(living.instanceId,mat);
  check(mat.elements.every((v,i)=>Math.abs(v-living.baseMatrix.elements[i])<.00003),'distant living tree did not restore');
  // Contact marks remain bounded across qualities and follow the local ground.
  report.contacts=[];
  for(const q of [0,1,2,3]) {
    ir.quality.setLock(q);ir.camera.position.set(t.x,t.y+4,t.z);ir.contacts.update(.2,ir.camera,foliage,ir.player(),ir.waves.enemies);
    const mesh=ir.contacts.mesh;check(mesh.count<=ir.contacts.capacity,'contact cap exceeded');
    for(let i=0;i<mesh.count;i++){mesh.getMatrixAt(i,mat);check(Math.abs(mat.elements[13]-ir.getHeight(mat.elements[12],mat.elements[14])-.045)<.001,'contact detached from terrain');}
    report.contacts.push({q,count:mesh.count,cap:ir.contacts.capacity});
  }
  // Smoke opacity declines while its silhouette expands instead of shrinking.
  const smoke=ir.effects.smoke,si=smoke.head;smoke.emit(0,2,2,0,0,0,1,2,.5,.5,.5,{grow:2});
  smoke.update(.2);const early=smoke.alpha[si],earlySize=smoke.sizeAttr[si];smoke.update(.7);
  check(smoke.alpha[si]<early&&smoke.sizeAttr[si]>earlySize,'smoke shrinks instead of fading');
  check(smoke.points.material.uniforms.pointLimit.value<=192,'smoke overdraw cap lost');
  report.smoke={early,late:smoke.alpha[si],earlySize,lateSize:smoke.sizeAttr[si]};
  // Both track strips follow local terrain normals, wrap the original pool,
  // and keep spawn timestamps for the GPU lifetime fade.
  const e=ir.effects,start=e.markHead,time=e.time;
  for(let i=0;i<410;i++){const a=i*.018;e.treadMark(Math.sin(a)*6,Math.cos(a)*6,a);}
  check(e.marks.count===360&&e.markHead===(start+410)%360,'tread pool no longer bounded');
  const index=(e.markHead+359)%360;e.marks.getMatrixAt(index,mat);
  check(Math.abs(e.markBirths.getX(index)-time)<.001,'mark timestamp incorrect');
  check(Math.abs(mat.elements[13]-(ir.getHeight(mat.elements[12],mat.elements[14])+.04))<.002,'mark not on terrain');
  report.treads={count:e.marks.count,head:e.markHead};
  const original=await import('./js/tank.js?unbatchedQA'),current=await import('./js/tank.js?v=detail3');
  const a=original.buildTankMesh('olive').root,b=current.buildTankMesh('olive').root;
  function vertices(root) {
    root.updateMatrixWorld(true);const out=[];
    root.traverse(o=>{
      if(!o.isMesh||o.isInstancedMesh)return;
      const g=o.geometry,p=g.attributes.position,v=new T.Vector3();
      for(let i=0;i<(g.index?g.index.count:p.count);i++) {
        v.fromBufferAttribute(p,g.index?g.index.getX(i):i).applyMatrix4(o.matrixWorld);
        out.push([v.x,v.y,v.z]);
      }
    });
    // Quantized ordering keeps identical coplanar vertices together.
    return out.sort((a,b)=>Math.round(a[0]*10000)-Math.round(b[0]*10000)||Math.round(a[1]*10000)-Math.round(b[1]*10000)||Math.round(a[2]*10000)-Math.round(b[2]*10000));
  }
  const va=vertices(a),vb=vertices(b);check(va.length===vb.length,'batch changed triangle count');
  let maxError=0;for(let i=0;i<va.length;i++)for(let j=0;j<3;j++)maxError=Math.max(maxError,Math.abs(va[i][j]-vb[i][j]));
  check(maxError<.00003,'batch moved armor geometry');report.batching={vertices:va.length,maxError};
  // Animation references must remain attached after rigid batching.
  const p=ir.player(),v=p.visual;
  const attached=o=>{while(o&&o!==v.root)o=o.parent;return o===v.root;};
  for(const o of [...v.spinning,...v.exhausts,v.muzzle,v.coaxMuzzle,v.pivot,v.recoilGrp])check(attached(o),'animation/FX anchor detached');
  const spin=v.spinning[0].rotation.x,off=v.muzzle.getWorldPosition(new T.Vector3()).clone();
  p.body.velocity.set(0,0,8);p.body.angularVelocity.y=.5;p.setAim(new T.Vector3(30,2,30));p.syncVisual(1,.1);
  check(v.spinning[0].rotation.x!==spin,'wheels stopped spinning');
  const turretBefore=v.turret.rotation.y;for(let i=0;i<30;i++)p.syncVisual(1,1/60);
  check(v.turret.rotation.y!==turretBefore,'turret frozen');
  check(v.muzzle.getWorldPosition(new T.Vector3()).distanceTo(off)>.05,'muzzle did not follow aim');
  v.recoilGrp.position.z=-.3;v.root.updateMatrixWorld(true);
  check(attached(v.muzzle)&&v.muzzle.parent===v.recoilGrp,'recoil pivot lost');
  let wheelError=0;
  for(const [mesh,parts] of [[v.wheelInstances[0],v.wheelParts],[v.wheelInstances[1],v.hubParts]]) {
    check(mesh.count===10,'wheel instance count changed');
    for(let i=0;i<parts.length;i++) {
      const part=parts[i];part.pivot.updateMatrix();part.source.updateMatrix();
      const expected=new T.Matrix4().multiplyMatrices(part.pivot.matrix,part.source.matrix);mesh.getMatrixAt(i,mat);
      for(let j=0;j<16;j++)wheelError=Math.max(wheelError,Math.abs(mat.elements[j]-expected.elements[j]));
      check(part.source.visible===false&&attached(part.source),'wheel source lost or doubled');
    }
  }
  check(wheelError<.000003,'instanced wheels do not follow suspension/rotation');report.wheels={instances:20,maxTransformError:wheelError};
  const normalMaps=new Set();v.root.traverse(o=>{if(o.isMesh&&o.material.normalMap)normalMaps.add(o.material.normalMap);});
  check(normalMaps.size===3,'paint, metal and rubber do not have distinct surface maps');
  report.surfaces={normalMaps:normalMaps.size,mountainMaps:ir.sky.distant.children.map(m=>[m.material.map.image.width,m.material.map.image.height])};
  check(ir.sky.distant.children.every(m=>m.material.map.image.width===1024),'mountain texture not bounded');
  report.animation={spinning:v.spinning.length,exhausts:v.exhausts.length,batched:0};v.root.traverse(o=>{if(o.name==='batched-armor')report.animation.batched++;});
  p.body.velocity.set(0,0,0);p.body.angularVelocity.set(0,0,0);
  const zero=new T.Matrix4().makeScale(0,0,0);
  for(let i=0;i<e.marks.count;i++)e.marks.setMatrixAt(i,zero);
  for(let i=0;i<35;i++) {
    const a=i*.07,x=10*Math.sin(a),z=10*(1-Math.cos(a)),yaw=Math.PI/2-a;
    for(const side of [-1,1])e.treadMark(x+Math.cos(yaw)*1.06*side,z-Math.sin(yaw)*1.06*side,yaw);
  }
  ir.quality.setLock(2);ir.camera.position.set(12,13,-7);ir.camera.lookAt(6,0,5);ir.camera.updateMatrixWorld();ir.sky.update(0,ir.camera.position);
  ir.composer.render();return report;
 });
 await page.screenshot({path:'detail3-treads.png'});
 await page.evaluate(()=>{__IR.effects.markTime.value=__IR.effects.time+66;__IR.composer.render();});
 await page.screenshot({path:'detail3-treads-faded.png'});
 assert.deepStrictEqual(errors,[]);console.log(JSON.stringify({result,errors}));
 fs.writeFileSync('detail3-functional.json',JSON.stringify({result,errors},null,2));await b.close();
})();

