import test from 'node:test';import assert from 'node:assert/strict';import {ContactScraping} from '../src/contact-scraping';
const contact=(extra={})=>({key:'wall',a:{id:0},impulse:200,speed:12,closing:0,...extra});
test('initial impacts stay silent, sustained rubbing ramps up, separation resets the onset',()=>{
 const s=new ContactScraping();s.sample([contact()],0);assert.equal(s.level(0),0);s.sample([contact()],.03);assert.equal(s.level(0),0);
 for(let i=2;i<=8;i++)s.sample([contact()],i*.03);assert.equal(s.level(0),1);
 s.sample([], .27);assert.equal(s.level(0),0);s.sample([contact()],.31);assert.equal(s.level(0),0);
 s.sample([contact()],0);assert.equal(s.level(0),0);s.clear();assert.equal(s.level(0),0);
});
test('only environmental tangential motion sounds; duplicates and multiple surfaces cannot inflate volume',()=>{
 const s=new ContactScraping();for(let i=0;i<=15;i++)s.sample([contact(),contact({key:'other'}),contact({b:{id:1}}),contact({key:'head-on',a:{id:2},closing:12}),contact({key:'still',a:{id:3},speed:0}),contact({key:'invalid',a:{id:4},impulse:NaN})],i/60);
 assert.equal(s.level(0),1);for(const id of [1,2,3,4])assert.equal(s.level(id),0);
 for(let i=16;i<=35;i++)s.sample([contact({a:undefined,b:{id:5},impulse:100,speed:6})],i/60);assert.equal(s.level(5),.25);assert.equal(s.level(0),0);
 s.sample([],NaN);assert.equal(s.level(5),0);
});

test('real sliding wall contact produces a sustained signal and loses it after separation',async()=>{
 const {default:R}=await import('@dimforge/rapier3d-compat');await R.init();
 const {captureCollisionMotion,collisionPointVelocity}=await import('../src/collision-contact');
 const {vehicleContactManifold}=await import('../src/vehicle-contact');
 const w=new R.World({x:0,y:0,z:0}),events=new R.EventQueue(true),s=new ContactScraping();w.timestep=1/60;
 const body=w.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(0,1,0));
 const car=w.createCollider(R.ColliderDesc.cuboid(1,.5,2).setMass(1000).setFriction(.05).setActiveEvents(R.ActiveEvents.CONTACT_FORCE_EVENTS).setContactForceEventThreshold(0),body);
 w.createCollider(R.ColliderDesc.cuboid(.5,10,100).setTranslation(1.5,1,0).setFriction(.05));body.setLinvel({x:1,y:0,z:10},true);
 let loud=0;
 try{for(let i=0;i<90;i++){
  body.applyImpulse({x:60,y:0,z:0},true);const motion=captureCollisionMotion(w);w.step(events);const contacts:any[]=[];
  events.drainContactForceEvents(e=>{const h1=e.collider1(),h2=e.collider2(),m=vehicleContactManifold(w,h1,h2);if(!m)return;const a=collisionPointVelocity(w,motion,h1,m.point1),b=collisionPointVelocity(w,motion,h2,m.point2),x=b.x-a.x,y=b.y-a.y,z=b.z-a.z;contacts.push({key:'wall',a:h1===car.handle?{id:0}:undefined,b:h2===car.handle?{id:0}:undefined,speed:Math.hypot(x,y,z),closing:Math.abs(x*m.normal.x+y*m.normal.y+z*m.normal.z),impulse:e.totalForceMagnitude()/60});});
  s.sample(contacts,i/60);loud=Math.max(loud,s.level(0));
 }
 assert.ok(loud>.1,`wall scrape peak ${loud}`);body.setTranslation({x:-10,y:1,z:0},true);body.setLinvel({x:0,y:0,z:0},true);w.step(events);s.sample([],2);assert.equal(s.level(0),0);
 }finally{events.free();w.free();}
});

test('actual mixer plays contact on an intact car, removes false damaged-drift scraping, and honors inspection/reset',async()=>{
 const {Sound}=await import('../src/audio'),T=await import('three'),sound=new Sound();
 const parameter=()=>({value:0,setTargetAtTime(v:number){this.value=v;}}),loop={source:{playbackRate:parameter(),stop(){},disconnect(){}},gain:{gain:parameter(),disconnect(){}},pan:{positionX:parameter(),positionY:parameter(),positionZ:parameter(),disconnect(){}}};
 sound.ready=true;sound.ctx={currentTime:0,listener:Object.fromEntries(['positionX','positionY','positionZ','forwardX','forwardY','forwardZ','upX','upY','upZ'].map(k=>[k,parameter()]))}as any;sound.shot=()=>{};sound.loops.set(0,new Map([['scrape',loop]])as any);
 const car={id:0,kind:'coupe',health:100,rpm:1000,current:new T.Vector3(),velocity:new T.Vector3(),input:{throttle:0},speed:10,slip:0,gear:1,surface:'asphalt',scraping:0,controller:{wheelIsInContact:()=>true}};
 const update=(inspect=false)=>sound.update([car]as any,new T.PerspectiveCamera(),1/60,inspect);
 for(let i=0;i<20;i++)sound.contactScraping.sample([contact()],i/60);update();assert.ok(loop.gain.gain.value>0);
 update(true);assert.equal(loop.gain.gain.value,0);sound.contactScraping.sample([],1);car.health=50;car.slip=8;update();assert.equal(loop.gain.gain.value,0);
 car.scraping=.7;update();assert.ok(loop.gain.gain.value>0,'loose bumper contact remains audible');sound.clearCars();assert.equal(sound.contactScraping.level(0),0);
});
