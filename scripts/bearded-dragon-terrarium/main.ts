import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {Habitat} from './lib/Habitat';
import {Surface, SurfaceKind} from './lib/Surface';
import {Nav} from './lib/Nav';
import {Dish} from './lib/Dish';
import {Insects} from './lib/Insects';
import {LizardModel} from './lib/LizardModel';
import {LizardRig} from './lib/LizardRig';
import {LizardBrain} from './lib/LizardBrain';
import {Post} from './lib/Post';
import {foliageUniforms} from './lib/Foliage';
import {TANK} from './lib/Case';
import {BASK, groundHeight} from './lib/Ground';
import {plantLightStrength} from './lib/DesertPlants';
import type {PlantContact} from './lib/PlantFlex';
import {SimulationClock} from './lib/SimulationClock';
import {PoseInterpolation} from './lib/PoseInterpolation';

const params=new URLSearchParams(location.search);
const $=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
if(params.get('ui')==='0') document.body.classList.add('no-ui');

export class DesertTerrarium {
  readonly scene=new THREE.Scene();
  readonly camera=new THREE.PerspectiveCamera(33,1,.004,30);
  readonly renderer:THREE.WebGLRenderer;
  readonly controls:OrbitControls;
  readonly habitat=new Habitat();
  readonly post:Post;
  readonly ready:Promise<void>;
  surface!:Surface; nav!:Nav; lizard!:LizardModel; rig!:LizardRig; brain!:LizardBrain; insects!:Insects; dish!:Dish;
  hours=Number(params.get('hours')??11.5);time=0;follow=false;dayRunning=false;feeding=false;frames=0;
  private lastTime=0;private nextReadout=0;private toastTimer=0;private home=new THREE.Vector3();private homeTarget=new THREE.Vector3(0,.32,0);private wasNight=false;private lap=0;
  // Keep the validated contact increments, but present their cautious gait at
  // a livelier tempo. Raising root speed alone outruns the planted supports.
  private simulationClock = new SimulationClock(1.5);
  private poseInterpolation?:PoseInterpolation;
  private fill=new THREE.DirectionalLight(0xe3dccf,1.1);
  private ambient=new THREE.HemisphereLight(0xcbdbe9,0x63503c,.95);
  private plantContacts: PlantContact[] = [];
  private plantJointA = new THREE.Vector3(); private plantJointB = new THREE.Vector3(); private plantJointC = new THREE.Vector3();
  constructor() {
    const r=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance',preserveDrawingBuffer:params.has('capture')});
    r.setPixelRatio(Math.min(devicePixelRatio,params.has('lite')?1:1.75));r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.NoToneMapping;r.autoClear=false;r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFShadowMap;r.setClearColor(0x343633);this.renderer=r;
    $('scene').append(r.domElement);r.domElement.id='scene-canvas';
    const pmrem=new THREE.PMREMGenerator(r);this.scene.environment=pmrem.fromScene(new RoomEnvironment(),.02).texture;this.scene.environmentIntensity=.32;pmrem.dispose();
    this.scene.add(this.habitat.group,this.habitat.panes,this.ambient,this.fill);this.fill.position.set(-1,1.6,3);
    const rim=new THREE.DirectionalLight(0xc3d7e7,.7);rim.position.set(1,1,-2);this.scene.add(rim);
    this.controls=new OrbitControls(this.camera,r.domElement);this.controls.enableDamping=true;this.controls.dampingFactor=.08;this.controls.minDistance=.14;this.controls.maxDistance=4.5;this.controls.minPolarAngle=.65;this.controls.maxPolarAngle=1.66;this.controls.minAzimuthAngle=-1.3;this.controls.maxAzimuthAngle=1.3;this.controls.zoomSpeed=.75;this.controls.enablePan=true;
    this.post=new Post(r,this.scene,this.camera,params.has('lite')?0:4);this.post.settings.dof=false;this.post.settings.bloomStrength=.10;this.post.settings.exposure=1.05;
    if(params.has('lite')) this.post.settings.ao=false;
    this.resize(true);new ResizeObserver(()=>this.resize(false)).observe($('scene'));
    r.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();r.setAnimationLoop(null);this.say('The display is paused while graphics recover…');});
    r.domElement.addEventListener('webglcontextrestored',()=>{void this.ready.then(async()=>{
      await r.compileAsync(this.scene,this.camera);this.lastTime=0;this.draw();
      if(!Number(params.get('frames')))this.startAnimation();this.say('Display restored');
    }).catch(e=>{console.error(e);this.fail('The graphics processor could not restore the display. Reload to reopen the terrarium.');});});
    this.ready=this.load();
  }
  private async load() {
    await this.habitat.ready;
    this.dish=new Dish({heightAt:groundHeight},-.58,TANK.d/2-.088,this.habitat.stonePhoto);this.scene.add(this.dish.group);
    this.surface=new Surface(this.habitat.ground,[...this.habitat.hard,{mesh:this.dish.bowl,kind:SurfaceKind.Rock}],.004);
    this.nav=new Nav(this.surface,this.habitat.obstacles);
    this.insects=new Insects(this.surface,this.nav);this.scene.add(this.insects.group);
    this.lizard=await LizardModel.load('./lizard/');this.lizard.setMorph(params.get('morph')??'normal');this.scene.add(this.lizard.root);
    this.rig=new LizardRig(this.lizard,this.surface);this.brain=new LizardBrain(this.rig,this.nav,this.surface,this.insects);this.brain.dish=this.dish;
    this.poseInterpolation=new PoseInterpolation([...this.lizard.bones,this.camera]);
    this.brain.onLap=()=>this.lap=1;
    this.bind();this.applyClimate(0);
    const sim=Number(params.get('sim')??0);for(let t=0;t<sim;t+=1/30)this.simulate(1/30);
    const c=params.get('cam')?.split(',').map(Number),tg=params.get('target')?.split(',').map(Number);
    if(c?.length===3)this.camera.position.set(c[0],c[1],c[2]);if(tg?.length===3)this.controls.target.set(tg[0],tg[1],tg[2]);this.controls.update();
    if(params.get('follow')==='1')this.setFollow(true);
    await this.renderer.compileAsync(this.scene,this.camera);
    this.draw();document.body.classList.add('ready');Object.assign(window,{desertReady:true});
    const count=Number(params.get('frames')??0);
    if(count){for(let i=0;i<count;i++){this.simulate(1/30);this.draw();}return;}
    this.startAnimation();
  }
  private startAnimation(){this.renderer.setAnimationLoop(ms=>{
    if(document.hidden){this.lastTime=0;return;}
    const dt=this.lastTime?(ms-this.lastTime)/1000:1/60;
    this.lastTime=ms;this.simulate(dt);
    this.poseInterpolation!.render(this.simulationClock.alpha,()=>this.draw(),()=>{
      this.lizard.syncAttachments();this.lizard.root.updateMatrixWorld(true);this.camera.updateMatrixWorld();
    });
  });}
  simulate(dt:number) {
    this.simulationClock.advance(dt, step => this.simulationStep(step));
  }
  private simulationStep(dt:number) {
    this.time+=dt;
    if(this.dayRunning)this.hours=(this.hours+dt*.1)%24;
    this.applyClimate(dt);this.insects.update(dt);this.brain.cameraPos.copy(this.camera.position);this.brain.update(dt);this.updatePlants(dt);
    this.lap=Math.max(0,this.lap-dt*.45);this.habitat.ripple(this.lap);
    if(this.follow){const focus=this.rig.spinePoints()[2].clone().lerp(this.rig.snout,.3),before=this.controls.target.clone();this.controls.target.lerp(focus,1-Math.exp(-dt*3));this.camera.position.add(this.controls.target.clone().sub(before));const d=this.camera.position.distanceTo(this.controls.target);if(d>.42)this.camera.position.lerp(this.controls.target,1-Math.exp(-dt*1.2));}
    this.controls.update();this.camera.updateMatrixWorld();foliageUniforms.uKeyDirView.value.copy(this.habitat.warm.position).sub(this.habitat.warm.target.position).normalize().transformDirection(this.camera.matrixWorldInverse);
    foliageUniforms.uKeyColor.value.copy(this.habitat.warm.color);this.lizard.root.updateMatrixWorld(true);
    if(this.time>this.nextReadout){this.nextReadout=this.time+.5;this.updateUI();}
    this.poseInterpolation?.capture();
  }
  updatePlants(dt: number) {
    let index = 0;
    const capsule = (a: THREE.Vector3, b: THREE.Vector3, radius: number, verticalRadius = radius) => {
      const c = this.plantContacts[index] ??= {a: new THREE.Vector3(), b: new THREE.Vector3(), radius};
      c.a.copy(a); c.b.copy(b); c.radius = radius; c.verticalRadius = verticalRadius; index++;
    };
    const spine = this.rig.spinePoints();
    capsule(this.rig.snout, spine[0], .015, .011);
    for (let i = 0; i < spine.length - 1; i++) capsule(spine[i], spine[i + 1], [.019, .022, .030, .036, .031][i], [.011, .013, .016, .018, .018][i]);
    for (let i = 0; i < 10; i++) capsule(i === 0 ? spine[5] : this.rig.tailPoint(i - 1), this.rig.tailPoint(i), .016 * (1 - i / 11));
    for (const limb of this.lizard.data.limbs) {
      this.plantJointA.setFromMatrixPosition(this.lizard.bones[limb.bones.upper].matrix);
      this.plantJointB.setFromMatrixPosition(this.lizard.bones[limb.bones.lower].matrix);
      this.plantJointC.setFromMatrixPosition(this.lizard.bones[limb.bones.hand].matrix);
      capsule(this.plantJointA, this.plantJointB, .010);
      capsule(this.plantJointB, this.plantJointC, .007);
      capsule(this.plantJointC, this.plantJointC, .011, .003);
    }
    this.habitat.bendPlants(dt, this.plantContacts);
  }
  private applyClimate(dt:number) {
    const daylight=THREE.MathUtils.smoothstep(Math.sin((this.hours-6)/12*Math.PI),0,.18),night=daylight<.1;
    this.habitat.warm.intensity=2.4*daylight;this.habitat.daylight.intensity=1.65*daylight;
    plantLightStrength.value=daylight;
    for(const b of this.habitat.bulbs)b.emissiveIntensity=daylight*2.3;
    this.ambient.intensity=.10+.48*daylight;this.fill.intensity=.10+.52*daylight;
    this.brain.night=night;this.brain.heat=daylight;this.brain.storm=0;this.brain.raining=false;this.brain.leavesWet=0;
    const I=this.rig.inputs,shade=this.surface.roofed(I.x,I.z);
    const lamp=(1-THREE.MathUtils.smoothstep(Math.hypot(I.x-BASK.x,I.z-BASK.z),.05,.29))*daylight*(shade?.04:1);
    this.brain.lampOnIt=lamp;this.brain.envTemp=THREE.MathUtils.clamp(.19+.2*daylight+.43*lamp-(shade?.04:0),0,1);
    this.lizard.skin.uWet.value=0;
    if(night&&!this.wasNight){this.brain.restInHide();}this.wasNight=night;void dt;
  }
  private draw(){this.post.render(this.time);this.frames++;}
  private resize(reset:boolean) {
    const atHome=!this.follow&&this.camera.position.distanceTo(this.home)<.025;
    const w=innerWidth,h=innerHeight;this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.post.setSize(w,h,this.renderer.getPixelRatio());
    const z=Math.max(1.9,((TANK.w+.20)/2)/Math.tan(THREE.MathUtils.degToRad(this.camera.fov/2))/this.camera.aspect);
    this.home.set(.015,.64,z+TANK.d/2-.06);if(w<640)this.home.y=.82;
    this.controls.maxDistance=Math.max(4.5,z+1);
    if(reset||atHome){this.camera.position.copy(this.home);this.controls.target.copy(this.homeTarget);this.controls.update();}
  }
  private updateUI(){const day=this.brain.heat,warm=22+19*day,cool=21+3*day,rh=34+(1-day)*3;this.habitat.drawReadout(warm,cool,rh);$('warm').textContent=`${warm.toFixed(0)}°C`;$('cool').textContent=`${cool.toFixed(0)}°C`;$('rh').textContent=`${rh.toFixed(0)}%`;$('behavior').textContent=this.brain.status;const h=Math.floor(this.hours),m=Math.floor((this.hours-h)*60);$('time').textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;($('hours') as HTMLInputElement).value=String(this.hours);}
  setFollow(on:boolean){this.follow=on;$('follow').setAttribute('aria-pressed',String(on));if(on)this.say('Following the dragon · drag to look around · scroll for a closer view');}
  feed(at?:THREE.Vector3|null){const c=this.insects.release();const target=at??new THREE.Vector3(this.rig.snout.x+.09,this.rig.snout.y,this.rig.snout.z+.065);const p=this.nav.nearestWalkable(target.x,target.z,this.nav.mainRegion);if(p){c.pos.x=p[0];c.pos.z=p[1];}this.say('A cricket drops in. Watch the dragon notice, stalk and strike.');return c;}
  private bind(){
    $('follow').onclick=()=>this.setFollow(!this.follow);
    $('reset').onclick=()=>{this.setFollow(false);this.camera.position.copy(this.home);this.controls.target.copy(this.homeTarget);this.controls.update();};
    $('full').onclick=()=>{if(document.fullscreenElement)void document.exitFullscreen();else void document.documentElement.requestFullscreen?.();};
    const hide=()=>{const on=document.body.classList.toggle('no-ui');$('show').hidden=!on;};$('hide').onclick=hide;$('show').onclick=hide;
    const tool=(feeding:boolean)=>{this.feeding=feeding;$('feed').setAttribute('aria-pressed',String(feeding));$('observe').setAttribute('aria-pressed',String(!feeding));$('hint').textContent=feeding?'Tap inside to drop a cricket':'Drag to orbit · scroll to explore';};
    $('feed').onclick=()=>{tool(true);this.feed();};$('observe').onclick=()=>tool(false);
    $('greens').onclick=()=>{this.dish.refill();this.say('Fresh greens in the stone dish. The dragon grazes when it is ready.');};
    const morph=()=>{const order=['normal','red','citrus','hypo'],n=order[(order.indexOf(this.lizard.morph)+1)%order.length];this.lizard.setMorph(n);$('morph').textContent=`Colour · ${n[0].toUpperCase()+n.slice(1)}`;};$('morph').onclick=morph;
    $('hours').oninput=()=>{this.hours=Number(($('hours') as HTMLInputElement).value);this.applyClimate(0);this.updateUI();};
    $('play').onclick=()=>{this.dayRunning=!this.dayRunning;$('play').textContent=this.dayRunning?'Ⅱ':'▶';$('play').setAttribute('aria-pressed',String(this.dayRunning));};
    addEventListener('keydown',e=>{if(e.target instanceof HTMLInputElement)return;const k=e.key.toLowerCase();if(k==='f')this.setFollow(!this.follow);if(k==='m')morph();if(k==='h')hide();if(k==='r')$('reset').click();if(k==='1')tool(false);if(k==='2'){$('feed').click();}});
    let down={x:0,y:0},ray=new THREE.Raycaster();
    const cast=(e:PointerEvent)=>{const b=this.renderer.domElement.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1),this.camera);};
    const canvas=this.renderer.domElement;
    canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};if(this.feeding&&e.button===0){cast(e);const hits=ray.intersectObjects([this.habitat.ground,...this.habitat.hard.map(h=>h.mesh)],false);if(hits[0])this.feed(hits[0].point);e.stopImmediatePropagation();}},{capture:true});
    canvas.addEventListener('pointermove',e=>{cast(e);const hit=ray.intersectObject(this.habitat.ground,false)[0];this.brain.pointer=hit?.point??null;});
    canvas.addEventListener('pointerleave',()=>this.brain.pointer=null);
    canvas.addEventListener('pointerup',e=>{if(this.feeding||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;cast(e);if([this.rig.snout,...this.rig.spinePoints()].some(p=>ray.ray.distanceToPoint(p)<.025)){this.brain.pet();this.say('The dragon closes its eyes.');}});
  }
  say(text:string){$('toast').textContent=text;$('toast').classList.add('on');clearTimeout(this.toastTimer);this.toastTimer=window.setTimeout(()=>$('toast').classList.remove('on'),5200);}
  fail(text:string){$('fatal').hidden=false;$('fatal').textContent=text;$('veil').remove();}
}

try {
  if(!document.createElement('canvas').getContext('webgl2'))throw new Error('This terrarium needs WebGL 2. Open it in a current browser.');
  const app=new DesertTerrarium();if(import.meta.env.DEV)Object.assign(window,{desert:app,THREE});
  app.ready.catch(e=>{console.error(e);app.fail('The terrarium could not finish loading. Reload to try again.');});
}catch(e){console.error(e);$('fatal').hidden=false;$('fatal').textContent=String(e);$('veil').remove();}
