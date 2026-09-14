// The lake's sound bed: four looped beds (dawn chorus, night peepers, wind in the pines, water on
// the hull) crossfaded by the light, the wind and the boat, and one-shots for the geese, the heron
// and splashes. Plain audio elements, two per bed so a loop can crossfade over its own seam;
// silent until a gesture unlocks them; every failure is a silent one.
import {ambienceMix,LAYERS} from './ambience-model.js';
const FILES={chorus:'dawn-chorus.mp3',peepers:'night-peepers.mp3',wind:'wind-trees.mp3',water:'water-lap.mp3'};
const SHOTS={geese:'geese.mp3',heron:'heron.mp3',cast:'cast-splash.mp3',fish:'fish-splash.mp3'};
export function createAmbience({base='./assets/ambient/',volume=.7}={}){
 let master=volume,unlocked=false,failed=0;const beds={},gains={};
 const mk=(file)=>{try{const a=new Audio(base+file);a.preload='auto';a.volume=0;a.onerror=()=>{failed++;};return a;}catch{failed++;return null;}};
 for(const k of LAYERS){beds[k]={a:mk(FILES[k]),b:mk(FILES[k]),active:'a',fade:0,gain:0};gains[k]=0;}
 const shots={};for(const k in SHOTS)shots[k]=mk(SHOTS[k]);
 function play(el){if(!el)return;const p=el.play();if(p&&p.catch)p.catch(()=>{});}
 return {
  // call from the first gesture: start every bed at volume zero so the browser lets them play later
  unlock(){if(unlocked)return true;unlocked=true;for(const k of LAYERS){const l=beds[k];if(!l.a||!l.b)continue;l.a.loop=false;l.b.loop=false;play(l.a);}return true;},
  setVolume(v){master=Math.max(0,Math.min(1,v));},
  tick(dt,{elevation,wind,speed,hour}){const mix=ambienceMix({elevation,wind,speed,hour,master});
   for(const k of LAYERS){const l=beds[k];gains[k]+=(mix[k]-gains[k])*Math.min(1,dt*.8);l.gain=gains[k];if(!l.a||!l.b||!unlocked)continue;
    const cur=l[l.active],oth=l[l.active==='a'?'b':'a'];const dur=cur.duration||0;
    // the seam: 1.6 s before the end start the other element and cross over
    if(dur&&cur.currentTime>dur-1.6&&l.fade===0){oth.currentTime=0;play(oth);l.fade=.001;}
    if(l.fade>0){l.fade=Math.min(1,l.fade+dt/1.6);cur.volume=l.gain*(1-l.fade);oth.volume=l.gain*l.fade;if(l.fade>=1){cur.pause();l.active=l.active==='a'?'b':'a';l.fade=0;}}
    else{cur.volume=l.gain;if(cur.paused&&l.gain>.005)play(cur);}}
   return mix;},
  shot(name,gain=1){const s=shots[name];if(!s||!unlocked||master<=0)return false;try{const a=s.cloneNode();a.volume=Math.max(0,Math.min(1,gain*master));play(a);return true;}catch{return false;}},
  state(){return {unlocked,master,failed,layers:Object.fromEntries(LAYERS.map(k=>[k,{gain:+gains[k].toFixed(3),playing:!!(beds[k][beds[k].active]&&!beds[k][beds[k].active].paused)}]))};}
 };
}
