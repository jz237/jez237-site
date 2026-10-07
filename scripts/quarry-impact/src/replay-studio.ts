import {replayLibrary,defaultReplayName} from './replay-library';
import * as T from 'three';
import type {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import type {Vehicle} from './vehicle';
import {DEFINITIONS} from './rules';
import {landscapeHeight} from './quarry-layout';
import {replayFile,replayCourseId,type ReplayDocument} from './replay-data';
export function downloadBlob(blob:Blob,name:string){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
const clock=(n:number)=>`${Math.floor(n/60).toString().padStart(2,'0')}:${(n%60).toFixed(2).padStart(5,'0')}`;
export class ReplayStudio {
  time=0;playing=false;speed=1;follow=0;view='orbit';fov=52;exposure=1;roll=0;aspect=0;hidden=false;capturePending=false;seeking=false;
  readonly duration:number;private snap=true;private lastTarget=new T.Vector3();private uiAge=0;
  constructor(private ui:HTMLElement,readonly cars:Vehicle[],readonly doc:ReplayDocument|null,private seekScene:(time:number)=>boolean|void,private exit:()=>void,initialExposure=1,private savedName?:string,private groundHeight:(x:number,z:number)=>number=landscapeHeight){
    if(doc)replayCourseId(doc.meta);
    this.exposure=initialExposure;this.duration=doc?.frames.at(-1)?.time??0;this.time=this.duration;this.render();if(doc)this.requestSeek(this.time);else this.seekScene(this.time);
  }
  private render(){
    this.ui.innerHTML=`<section class="studio" aria-label="${this.doc?'Replay and photo studio':'Photo studio'}"><div class="studio-guide" id="studio-guide"></div><div class="studio-top studio-control"><div><div class="eyebrow">BLACKRIDGE MOTOR CLUB</div><h2>${this.doc?'REPLAY / PHOTO STUDIO':'PHOTO STUDIO'}</h2></div><button id="studio-exit">BACK ↗</button></div><aside class="studio-photo studio-control"><label>Camera<select id="studio-camera"><option value="orbit">Free orbit / pan</option><option value="chase">Chase</option><option value="hood">Hood</option><option value="overview">Overview</option></select></label><label>Follow car<select id="studio-car">${this.cars.map((c,i)=>`<option value="${i}">#${c.id+1} ${DEFINITIONS[c.kind].name}</option>`).join('')}</select></label><details><summary>PHOTO SETTINGS</summary><label>Field of view <output id="studio-fov-value">52°</output><input id="studio-fov" type="range" min="20" max="90" value="52"></label><label>Exposure<input id="studio-exposure" type="range" min="0.3" max="2.5" step="0.05" value="${this.exposure}"></label><label>Roll<input id="studio-roll" type="range" min="-45" max="45" value="0"></label><label>Crop<select id="studio-aspect"><option value="0">Full frame</option><option value="1.7777777778">16:9</option><option value="1.3333333333">4:3</option><option value="1">Square</option><option value="0.6666666667">Portrait 2:3</option></select></label><label class="studio-check"><input id="studio-grid" type="checkbox"> Rule of thirds</label></details><button id="studio-photo">SAVE PNG</button>${this.doc?'<label>Recording name<input id="studio-library-name" maxlength="80"></label><button id="studio-library-save">SAVE TO LIBRARY</button><button id="studio-save">EXPORT REPLAY (.qir)</button>':''}<button id="studio-hide">HIDE CONTROLS · H</button><p id="studio-status" role="status">Drag to orbit, right-drag to pan, scroll to zoom. PNG export excludes controls.</p></aside>${this.doc?`<div class="studio-timeline studio-control"><div class="studio-transport"><button id="studio-play">PLAY ▶</button><button id="studio-prev" aria-label="Previous replay frame">− FRAME</button><button id="studio-next" aria-label="Next replay frame">+ FRAME</button><label>Speed<select id="studio-speed">${[.25,.5,1,2,4].map(n=>`<option value="${n}" ${n===1?'selected':''}>${n}×</option>`).join('')}</select></label><output id="studio-time"></output></div><label class="studio-scrub-label">Replay position<input id="studio-time-slider" type="range" min="0" max="${this.duration}" step="0.05" value="${this.time}"></label><p>${this.doc.limited?'Recording limit reached; this is the retained portion.':'Movement, wheels, damage, repairs and props recorded. Transient particles and audio are not recorded.'}</p></div>`:''}<button id="studio-reveal" class="studio-reveal" hidden>SHOW CONTROLS · H</button></section>`;
    const on=(id:string,fn:()=>void)=>this.ui.querySelector<HTMLButtonElement>('#'+id)!.onclick=fn;
    on('studio-exit',this.exit);on('studio-photo',()=>{if(this.seeking)return;this.playing=false;this.capturePending=true;this.status('Preparing PNG…');});on('studio-hide',()=>this.toggleHud());on('studio-reveal',()=>this.toggleHud());
    this.ui.querySelector<HTMLSelectElement>('#studio-camera')!.onchange=e=>{this.view=(e.target as HTMLSelectElement).value;this.snap=true;};
    this.ui.querySelector<HTMLSelectElement>('#studio-car')!.onchange=e=>{this.follow=+(e.target as HTMLSelectElement).value;this.snap=true;};
    this.ui.querySelector<HTMLInputElement>('#studio-fov')!.oninput=e=>{this.fov=+(e.target as HTMLInputElement).value;this.ui.querySelector('#studio-fov-value')!.textContent=this.fov+'°';};
    this.ui.querySelector<HTMLInputElement>('#studio-exposure')!.oninput=e=>this.exposure=+(e.target as HTMLInputElement).value;
    this.ui.querySelector<HTMLInputElement>('#studio-roll')!.oninput=e=>this.roll=+(e.target as HTMLInputElement).value;
    this.ui.querySelector<HTMLSelectElement>('#studio-aspect')!.onchange=e=>{this.aspect=+(e.target as HTMLSelectElement).value;this.guide();};
    this.ui.querySelector<HTMLInputElement>('#studio-grid')!.onchange=e=>this.ui.querySelector('#studio-guide')!.classList.toggle('thirds',(e.target as HTMLInputElement).checked);
    if(this.doc){this.ui.querySelector<HTMLInputElement>('#studio-library-name')!.value=this.savedName??defaultReplayName(this.doc);on('studio-library-save',()=>{void this.saveToLibrary();});on('studio-play',()=>this.togglePlay());on('studio-prev',()=>this.seek(this.time-.05));on('studio-next',()=>this.seek(this.time+.05));on('studio-save',()=>{void this.save();});
      this.ui.querySelector<HTMLSelectElement>('#studio-speed')!.onchange=e=>this.speed=+(e.target as HTMLSelectElement).value;
      this.ui.querySelector<HTMLInputElement>('#studio-time-slider')!.oninput=e=>this.seek(+(e.target as HTMLInputElement).value);
    }
    this.labels();this.guide();
  }
  private labels(){const slider=this.ui.querySelector<HTMLInputElement>('#studio-time-slider');if(slider)slider.value=String(this.time);const text=this.ui.querySelector('#studio-time');if(text)text.textContent=`${this.seeking?'SEEKING · ':''}${clock(this.time)} / ${clock(this.duration)}`;const play=this.ui.querySelector('#studio-play');if(play)play.textContent=this.playing?'PAUSE Ⅱ':'PLAY ▶';}
  private guide(){const guide=this.ui.querySelector<HTMLElement>('#studio-guide')!;guide.style.width=this.aspect?`min(100%, calc(100vh * ${this.aspect}))`:'100%';guide.style.height=this.aspect?`min(100%, calc(100vw / ${this.aspect}))`:'100%';}
  status(text:string){const node=this.ui.querySelector('#studio-status');if(node)node.textContent=text;}
  private requestSeek(time:number){
    this.time=Math.max(0,Math.min(this.duration,time));this.seeking=true;this.capturePending=false;
    this.ui.querySelector<HTMLButtonElement>('#studio-photo')!.disabled=true;
    this.status('Seeking replay… You can choose another position or go back.');this.labels();
  }
  seek(time:number){this.playing=false;this.requestSeek(time);}
  togglePlay(){if(!this.doc)return;if(this.time>=this.duration)this.requestSeek(0);this.playing=!this.playing;this.labels();}
  toggleHud(){this.hidden=!this.hidden;this.ui.querySelectorAll<HTMLElement>('.studio-control').forEach(e=>e.hidden=this.hidden);this.ui.querySelector<HTMLButtonElement>('#studio-reveal')!.hidden=!this.hidden;}
  update(dt:number){
    if(!this.seeking&&this.playing)this.requestSeek(this.time+dt*this.speed);
    if(this.seeking&&this.seekScene(this.time)!==false){
      this.seeking=false;this.ui.querySelector<HTMLButtonElement>('#studio-photo')!.disabled=false;
      this.status('Drag to orbit, right-drag to pan, scroll to zoom. PNG export excludes controls.');
      if(this.time>=this.duration)this.playing=false;this.labels();
    }
    this.uiAge+=dt;if(this.uiAge>.1){this.uiAge=0;this.labels();}
  }
  updateCamera(camera:T.PerspectiveCamera,orbit:OrbitControls,renderer:T.WebGLRenderer){
    if(this.seeking)return;
    const car=this.cars[this.follow]??this.cars[0],target=car.root.position.clone().add(new T.Vector3(0,.35,0)),f=new T.Vector3(0,0,1).applyQuaternion(car.root.quaternion);f.y=0;f.normalize();
    orbit.maxDistance=300;orbit.minDistance=.5;orbit.enablePan=true;
    if(this.view==='orbit'){
      orbit.enabled=true;if(this.snap){camera.position.copy(target).add(new T.Vector3(6,3,7));orbit.target.copy(target);}else{const delta=target.clone().sub(this.lastTarget);camera.position.add(delta);orbit.target.add(delta);}orbit.update();
    }else{
      orbit.enabled=false;
      if(this.view==='overview'){camera.position.copy(target).add(new T.Vector3(0,120,.1));camera.lookAt(target);}
      else if(this.view==='hood'){camera.position.copy(target).addScaledVector(f,1.3);camera.position.y+=.35;camera.lookAt(target.clone().addScaledVector(f,25));}
      else {camera.position.copy(target).addScaledVector(f,-8);camera.position.y=Math.max(target.y+2.6,this.groundHeight(camera.position.x,camera.position.z)+.65);camera.lookAt(target.clone().addScaledVector(f,3));}
    }
    this.lastTarget.copy(target);this.snap=false;camera.fov=this.fov;camera.rotateZ(T.MathUtils.degToRad(this.roll));camera.updateProjectionMatrix();renderer.toneMappingExposure=this.exposure;
  }
  async saveToLibrary(){
    if(!this.doc)return;const button=this.ui.querySelector<HTMLButtonElement>('#studio-library-save')!;if(button.disabled)return;
    const name=this.ui.querySelector<HTMLInputElement>('#studio-library-name')!.value;button.disabled=true;this.status('Saving recording…');
    try{const saved=await replayLibrary.save(this.doc,name);this.status(`Saved “${saved.name}” in your replay library. Export a .qir copy for backup.`);}catch(error){this.status(error instanceof Error?error.message:'Replay could not be saved.');}finally{button.disabled=false;}
  }
  async save(){if(!this.doc)return;this.status('Compressing replay…');try{downloadBlob(await replayFile(this.doc),'quarry-impact-'+Date.now()+'.qir');this.status('Replay saved. Open it from the main menu to watch again.');}catch{this.status('Replay could not be saved in this browser.');}}
  capture(canvas:HTMLCanvasElement){
    if(!this.capturePending||this.seeking)return;this.capturePending=false;
    const crop=document.createElement('canvas'),ratio=this.aspect||canvas.width/canvas.height;let w=canvas.width,h=canvas.height;if(w/h>ratio)w=Math.round(h*ratio);else h=Math.round(w/ratio);crop.width=w;crop.height=h;
    crop.getContext('2d')!.drawImage(canvas,(canvas.width-w)/2,(canvas.height-h)/2,w,h,0,0,w,h);
    crop.toBlob(blob=>{if(blob){downloadBlob(blob,'quarry-impact-photo-'+Date.now()+'.png');this.status(`PNG saved · ${w} × ${h}`);}else this.status('PNG export failed.');},'image/png');
  }
}
