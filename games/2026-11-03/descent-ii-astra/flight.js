"use strict";
const $ = id => document.getElementById(id);
const astraIndex = {};
let mounted = new Map(), saving = false;
function script(src) {
  return new Promise((resolve,reject) => {
    const el = document.createElement("script");
    el.onload = () => { el.remove(); resolve(); };
    el.onerror = () => { el.remove(); reject(Error("Could not load "+src)); };
    el.src = src;
    document.head.append(el);
  });
}
function astraFail(message) {
  window.astraFlightFocus(false);
  document.body.classList.remove("flying");
  $("status").textContent = String(message);
  $("retry").hidden = false;
}
// Keep one media element for the game's Red Book controls. Oversize FLACs
// are joined on demand; a later play, pause or stop supersedes a pending play.
const player = new Audio();
let pendingSource = null, ownedUrl = null, playToken = 0;
function discardSource() {
  ++playToken;
  player.pause();
  if (pendingSource) pendingSource.controller.abort();
  pendingSource = null;
  if (ownedUrl) { URL.revokeObjectURL(ownedUrl); ownedUrl = null; }
}
const splitTracks = {"3":[16777216,14290380],"7":[16777216,13559687],"8":[16777216,10501226],"9":[16777216,16777216,569642]};
function setSource(track) {
  discardSource();
  const path = "music/" + String(track).padStart(2,"0") + ".flac";
  if (!splitTracks[track]) { player.src=path; return; }
  const controller=new AbortController(), {signal}=controller;
  const ready=Promise.all(splitTracks[track].map(async (size,i)=>{
    const response=await fetch(path+"."+i,{signal});
    if (!response.ok) throw Error("Music track "+track+" could not be loaded");
    const blob=await response.blob();
    if (blob.size!==size) throw Error("Incomplete music track "+track);
    return blob;
  })).then(parts=>{
    if(signal.aborted) return;
    ownedUrl=URL.createObjectURL(new Blob(parts,{type:"audio/flac"}));
    player.src=ownedUrl;
  });
  pendingSource={controller,ready};
}
const transport = {
  get volume(){return player.volume;}, set volume(v){player.volume=v;},
  get paused(){return pendingSource ? !this.wantsPlay : player.paused;},
  get currentTime(){return player.currentTime;},
  wantsPlay:false,
  pause(){this.wantsPlay=false;++playToken;player.pause();},
  async play(){
    this.wantsPlay=true;
    const token=++playToken;
    if(pendingSource) await pendingSource.ready;
    if(token===playToken) await player.play();
  }
};
const astraDisc = window.astraDisc = {
  audio:transport,track:0,last:0,done:false,
  stop(){transport.wantsPlay=false;discardSource();this.track=0;this.done=false;},
  play(track,last){
    this.track=track;this.last=last;this.done=false;setSource(track);
    transport.play().catch(e=>{if(e.name!=="AbortError")console.warn(e);});
  }
};
player.onended=()=>{
  if(astraDisc.track<astraDisc.last) astraDisc.play(astraDisc.track+1,astraDisc.last);
  else {astraDisc.track=0;astraDisc.done=true;transport.wantsPlay=false;}
};

async function readPack(group,label) {
  await script("payload/"+group+".js");
  const [files,entries]=astraIndex[group];
  let cursor=0, at=0, target=new Uint8Array(entries[0][1]);
  const requests=new Map();
  const enqueue=i=>{
    const request=fetch("payload/"+files[i]);
    request.catch(()=>{}); // The ordered consumer reports the failure.
    requests.set(i,request);
  };
  for(let i=0;i<Math.min(3,files.length);i++) enqueue(i);
  for(let i=0;i<files.length;i++) {
    $("status").textContent=label+" · "+(i+1)+" / "+files.length;
    if (i+3<files.length) enqueue(i+3);
    const response = await requests.get(i);
    requests.delete(i);
    if (!response.ok || !response.body) throw Error("Could not read "+files[i]);
    const stream=response.body.pipeThrough(new DecompressionStream("gzip"));
    const decoded=new Uint8Array(await new Response(stream).arrayBuffer());
    let offset=0;
    while(offset<decoded.length) {
      const take=Math.min(target.length-at,decoded.length-offset);
      target.set(decoded.subarray(offset,offset+take),at);
      at+=take;offset+=take;
      if(at===target.length) {
        mounted.set(entries[cursor][0],target);
        cursor++; at=0; target=cursor<entries.length?new Uint8Array(entries[cursor][1]):null;
      }
    }
  }
  if(cursor!==entries.length) throw Error("Incomplete "+group+" parcel");
}
function syncPilot() {
  if(!window.Module?.FS || !Module.saveReady || saving) return;
  saving=true;
  Module.FS.syncfs(false,err=>{saving=false;if(err)console.warn("Pilot save",err);});
}
// The flight window owns relative input. Menus and the launcher use the desktop cursor.
const flightView = $("view"), mouseHint = $("mouseHint");
let flightActive = false, capturePending = false, captureClick = false, hasMouse = false;
let lastRelease = -Infinity;
const mouseCaptured = () => document.pointerLockElement === flightView;
function refreshMouseHint() {
  mouseHint.hidden = !flightActive || mouseCaptured();
}
function releaseFlightMouse() {
  if (mouseCaptured()) document.exitPointerLock();
}
function captureFlightMouse() {
  if (capturePending || mouseCaptured() || !flightView.requestPointerLock) return;
  capturePending = true;
  try {
    flightView.requestPointerLock()?.catch(captureError);
  } catch { captureError(); }
}
function captureError() {
  capturePending = false;
  mouseHint.textContent = "Click the mine to capture the mouse · Esc releases it";
  refreshMouseHint();
}
window.astraFlightFocus = active => {
  flightActive = active;
  if (!active) { releaseFlightMouse(); window.astraDeck?.show(false); }
  refreshMouseHint();
};
document.addEventListener("pointerlockerror", captureError);
document.addEventListener("pointerlockchange", () => {
  capturePending = false;
  const locked = mouseCaptured();
  if (!locked && hasMouse) {
    lastRelease = performance.now();
    if (flightActive) window.Module?._astra_reset_flight_input?.();
  }
  hasMouse = locked;
  refreshMouseHint();
});
flightView.addEventListener("mousedown", e => {
  if (!flightActive || mouseCaptured() || !flightView.requestPointerLock) return;
  e.preventDefault(); e.stopImmediatePropagation();
  if (e.button === 0) {
    captureClick = true;
    flightView.focus({preventScroll:true});
    captureFlightMouse();
  }
}, true);
flightView.addEventListener("mouseup", e => {
  if (captureClick && e.button === 0) {
    captureClick = false;
    e.preventDefault(); e.stopImmediatePropagation();
  }
}, true);
flightView.addEventListener("mousemove", e => {
  if (flightActive && flightView.requestPointerLock && !mouseCaptured()) e.stopImmediatePropagation();
}, true);
window.addEventListener("keydown", e => {
  if (e.key === "Escape" && (mouseCaptured() || (flightActive && performance.now()-lastRelease < 120))) {
    e.preventDefault(); e.stopImmediatePropagation(); releaseFlightMouse();
  }
}, true);
window.addEventListener("blur", releaseFlightMouse);
document.addEventListener("visibilitychange", () => { if (document.hidden) releaseFlightMouse(); });

async function launch(quick,demo=false,encounter=false) {
  const buttons=document.querySelectorAll(".launch");
  buttons.forEach(el=>el.disabled=true);
  try {
    if(quick && !demo)captureFlightMouse();
    const astra=$("look").value==="astra";
    // Prime the media element in the button gesture before disk I/O.
    const music=player;
    music.src="music/02.flac"; music.volume=0;
    music.play().then(()=>{if(!astraDisc.track){music.pause();music.currentTime=0;music.volume=0.75;}}).catch(()=>{});
    await readPack("game","Reading game data");
    await readPack("vertigo","Reading original Vertigo mission");
    if(astra){await readPack("art","Preparing mine materials");await readPack("cockpit","Fitting flight instruments");await readPack("fleet","Fitting Overload robot chassis");await readPack("forge","Preparing foundry lights and fireballs");}
    await readPack("movies","Reading cinematics");
    $("status").textContent="Starting flight computer";
    const canvas=$("view");
    const quality=Number($("res").value);
    const height=Math.round(quality*9/16);
    window.Module={
      canvas,quick,demo,encounter,campaign:$("campaign").value,wideHud:$("wideHud").checked,intro:!quick && !demo && $("intro").checked,astra, arguments:["-hogdir","/mine","-pilot","astra","-window","-nostickykeys",
        "-gl_gettexlevelparam_ok","0","-gl_intensity4_ok","0","-gl_luminance4_alpha4_ok","0","-gl_rgba2_ok","0"],
      print:console.log,printErr:console.warn,onAbort:astraFail,
      onExit:()=>{window.astraFlightFocus(false);syncPilot();document.body.classList.remove("flying");$("status").textContent="Flight ended."; $("retry").hidden=false;},
      preRun:[()=>{
        const F=Module.FS, save="/home/web_user/.d2-astra";
        F.mkdirTree("/mine/demos");F.mkdirTree("/mine/missions"); F.mkdirTree(save);
        for(const [name,bytes] of mounted) F.writeFile("/mine/"+name,bytes,{canOwn:true});
        if(astra){
          const hull=window.astraHullBytes || Uint8Array.from(atob(window.astraHull.data),c=>c.charCodeAt(0));
          F.writeFile("/mine/astra.hull",hull);
          F.writeFile("/mine/pyro-skin.png",Uint8Array.from(atob(window.astraSkin),c=>c.charCodeAt(0)));F.writeFile("/mine/pyro.frag",window.astraHull.fragment);
        }
        if(astra) for(const [alias,src] of Object.entries(window.astraAliases||{}))
          F.createDataFile("/mine",alias+".png",mounted.get(src),true,false,true);
        mounted.clear();
        F.mount(Module.IDBFS,{},save);
        Module.addRunDependency("pilot");
        F.syncfs(true,err=>{
          Module.saveReady=!err;
          let cfg="";
          const name=save+"/descent.cfg";
          if(F.analyzePath(name).exists) cfg=F.readFile(name,{encoding:"utf8"});
          const settings={ResolutionX:quality,ResolutionY:height,AspectX:9,AspectY:16,WindowMode:1,
                          TexFilt:2,MovieTexFilt:1,MusicType:2,OrigTrackOrder:1,VSync:1};
          if(!cfg) Object.assign(settings,{DigiVolume:8,MusicVolume:6,GammaLevel:3});
          cfg=cfg.split(/\r?\n/).filter(l=>!Object.hasOwn(settings,l.split("=")[0])).join("\n");
          cfg+="\n"+Object.entries(settings).map(([k,v])=>k+"="+v).join("\n")+"\n";
          F.writeFile(name,cfg);
          Module.removeRunDependency("pilot");
        });
      }],
      onRuntimeInitialized:()=>{
        document.body.classList.add("flying"); canvas.focus();
        setInterval(syncPilot,3000);
      }
    };
    await script("engine.js?v=deck4");
  } catch(e) {console.error(e);astraFail(e.message);}
}

const saveSetting=(key,value)=>{try{localStorage.setItem(key,value?"1":"0");}catch{}};
const getSetting=key=>{try{return localStorage.getItem(key);}catch{return null;}};
const flipKey="astra.mouseInvertY",hudKey="astra.wideHud";
const savedFlip=getSetting(flipKey);
window.astraMouseFlip=savedFlip===null?null:savedFlip==="1";
$("wideHud").checked=getSetting(hudKey)!=="0";
$("wideHud").onchange=()=>saveSetting(hudKey,$("wideHud").checked);
window.astraRefreshInput=value=>{
  $("invertMouse").checked=value;
  $("invertFlight").setAttribute("aria-pressed",String(value));
  $("invertFlight").textContent="Invert Y · "+(value?"On":"Off");
  window.astraMouseFlip=value;
};
function chooseFlip(value) {
  if(window.Module?.inputReady)Module._astra_invert_mouse(+value);
  window.astraRefreshInput(value);saveSetting(flipKey,value);
}
window.astraRememberInput=v=>{window.astraRefreshInput(v);saveSetting(flipKey,v);};
if(savedFlip!==null)window.astraRefreshInput(window.astraMouseFlip);
$("invertMouse").onchange=()=>chooseFlip($("invertMouse").checked);
$("invertFlight").onclick=()=>{chooseFlip(!$("invertMouse").checked);$("view").focus();};
window.addEventListener("keydown",e=>{
  if(e.altKey&&e.code==="KeyI"&&document.body.classList.contains("flying")){
    e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)chooseFlip(!$("invertMouse").checked);
  }
},true);

$("start").onclick=()=>launch(true);
$("encounter").onclick=()=>launch(true,false,true);
$("menus").onclick=()=>launch(false);
$("demo").onclick=()=>launch(false,true);
$("retry").onclick=()=>location.reload();
$("full").onclick=()=>document.fullscreenElement?document.exitFullscreen():$("stage").requestFullscreen();
$("view").oncontextmenu=e=>e.preventDefault();
document.addEventListener("visibilitychange",()=>{if(document.hidden)syncPilot();});
window.addEventListener("pagehide",syncPilot);
window.addEventListener("error",e=>{if(window.Module && e.message)astraFail(e.message);});
$("view").addEventListener("webglcontextlost",e=>{e.preventDefault();syncPilot();astraFail("The graphics device reset. Reopen the flight terminal to continue.");});








