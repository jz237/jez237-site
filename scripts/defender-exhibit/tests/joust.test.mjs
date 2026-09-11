import{test}from'node:test';import assert from'node:assert/strict';import{readFileSync}from'node:fs';import{stripTypeScriptTypes}from'node:module';import{createHash}from'node:crypto';import{buildDetailedCabinet}from'../model-detail.mjs';
const ctx=new Proxy({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)})},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)});globalThis.document={createElement:()=>({width:0,height:0,setAttribute(){},getContext:()=>ctx})};globalThis.localStorage={getItem:()=>null};globalThis.window={devicePixelRatio:1};
let source=readFileSync(new URL('../src/JoustShow.ts',import.meta.url),'utf8');for(const [name,file]of [['game','game.ts'],['joust/engine.js','joust/engine.js'],['joust/data.js','joust/data.js'],['joust/render.js','joust/render.js'],['JoustSound','JoustSound.ts'],['DefenderFont','DefenderFont.ts']])source=source.replaceAll(`'./${name}'`,JSON.stringify(new URL('../src/'+file,import.meta.url).href));const{JoustShow}=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
test('Joust autonomous pilot fights, collects eggs and progresses using the existing engine',()=>{const g=new JoustShow();g.draw=()=>{};let maxWave=0;for(let i=0;i<360*60;i++){g.update(1/60);maxWave=Math.max(maxWave,g.wave);assert(Number.isFinite(g.x)&&Number.isFinite(g.y));}console.log({joustKills:g.kills,eggs:g.eggsCollected,maxWave});assert(g.kills>10);assert(g.eggsCollected>0);assert(maxWave>=2);});
test('Joust pause and power hold engine and pilot clocks',()=>{const g=new JoustShow();g.update(1);const time=g.time,frame=g.engine.animFrame;g.demoPaused=true;g.update(1);assert.equal(g.time,time);assert.equal(g.engine.animFrame,frame);g.demoPaused=false;g.power=false;g.update(1);assert.equal(g.time,time);g.power=true;g.update(.5);assert(g.time>time+.45);});
test('Joust has two movement sticks, two flap buttons and two starts',()=>{const r=buildDetailedCabinet(false,true),names=[];r.traverse(o=>{if(/^button_/.test(o.name))names.push(o.name)});assert.deepEqual(names.sort(),['button_2','button_3','button_5','button_6']);assert(r.getObjectByName('joystick'));assert(r.getObjectByName('joystick_fire'));assert(r.getObjectByName('stick_leaf_joystick_1'));assert(!r.getObjectByName('stick_leaf_joystick_2'));assert(r.getObjectByName('controls_hinge'));});
test('Joust sounds are byte-identical to the original effects already on the games page',()=>{const dir=new URL('../public/joust/audio/',import.meta.url),m=JSON.parse(readFileSync(new URL('manifest.json',dir)));assert.equal(m.samples.length,23);for(const s of m.samples){const b=readFileSync(new URL(s.file,dir));assert.equal(createHash('sha256').update(b).digest('hex'),s.sha256);assert(b.equals(readFileSync(new URL('../../games/2026-07-05/joust/retro/assets/audio/'+s.file,new URL('../',import.meta.url)))));}});
test('Joust pilot flies around shelves using real movement and platform collisions',()=>{
 for(const [name,start,target,side]of [
  ['lower shelf upward',{x:132,y:195},{x:132,y:136},'up'],
  ['lower shelf downward',{x:132,y:140},{x:132,y:204},'down'],
  ['upper shelf upward',{x:124,y:116},{x:124,y:65},'up'],
  ['wrapped edge shelves',{x:8,y:108},{x:280,y:48},'up']]){
  const g=new JoustShow(),e=g.engine,p=e.players[0];g.draw=()=>{};
  Object.assign(p,start,{alive:true,materializing:0,onGround:false,vx:0,vy:0,vxi:0});
  e.enemies=[{...target,alive:true,materializing:0}];e.eggs=[];e.pteros=[];
  let reached=false,travel=0,oldX=p.x;
  for(let i=0;i<1800&&p.alive;i++){const input=g.pilot();e.animFrame++;e.controlPlayer(p,input);e.integrate(p);travel+=Math.abs((p.x-oldX+453)%302-151);oldX=p.x;
   if(Math.abs((p.x-target.x+453)%302-151)<22&&Math.abs(p.y-Math.max(38,target.y-17))<16){reached=true;break;}}
  console.log(name,{reached,x:p.x,y:p.y,travel});assert(reached,name+' should reach the enemy side');assert(travel>20,name+' should detour horizontally');
 }
});
test('Defeat events play the existing three-frame effect and expire during simulation',()=>{
 const g=new JoustShow();g.defeatEffect({type:'enemyDie',x:100,y:80});
 assert.deepEqual(g.renderer.effects[0].frames,['FL1','FL2','FL3']);assert.equal(g.renderer.effects[0].x,100);assert.equal(g.renderer.effects[0].y,72);assert.equal(g.renderer.particles.length,10);
 g.renderer.updateFx(8);assert.equal(g.renderer.effects.length,1);g.renderer.updateFx(40);assert.equal(g.renderer.effects.length,0);assert.equal(g.renderer.particles.length,0);
});
