"use strict";
const $ = id => document.getElementById(id);
const astraIndex = {};
let mounted = new Map(), saving = false, launchPending = false;
let shipAssets, hangarStarted=false;
function loadAstraShipAssets(){
  if(!shipAssets)shipAssets=Promise.all([script("skin.js"),script("pyro.js")]).catch(error=>{
    shipAssets=null;throw error;
  });
  return shipAssets;
}
window.ensureAstraHangar=async ()=>{
  if(hangarStarted)return;
  hangarStarted=true;
  try {
    await loadAstraShipAssets();
    if(launchPending&&!document.body.classList.contains("native-open")){hangarStarted=false;return;}
    await script("hangar.js?v=29");
  } catch(error){hangarStarted=false;console.warn("Hangar preview:",error.message);}
};
document.addEventListener("DOMContentLoaded",()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
  if(!launchPending)window.ensureAstraHangar();
})),{once:true});
function decodeAstraBase64(value) {
  if (Uint8Array.fromBase64) return Uint8Array.fromBase64(value);
  const binary=atob(value), bytes=new Uint8Array(binary.length);
  for (let i=0;i<bytes.length;i++) bytes[i]=binary.charCodeAt(i);
  return bytes;
}
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
  window.astraTerminal?.fail();
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
  player.loop=window.Module?.campaign==='elegies'&&track>=4;
  if(player.loop){player.src='music/elegies/'+String((track-4)%4+1).padStart(2,'0')+'.mp3';return;}
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
    window.astraLoad?.progress("download",label,i,files.length);
    if (i+3<files.length) enqueue(i+3);
    const response = await requests.get(i);
    requests.delete(i);
    if (!response.ok || !response.body) throw Error("Could not read "+files[i]);
    const stream=response.body.pipeThrough(new DecompressionStream("gzip"));
    // Copy decompressed chunks directly into their final file buffers. Avoid
    // allocating a second whole decoded parcel and then copying it at once.
    const reader=stream.getReader();
    try {
      for(;;){
        const {value:decoded,done}=await reader.read();if(done)break;
        let offset=0;
        while(offset<decoded.length) {
          if(!target)throw Error("Oversized "+group+" parcel");
          const take=Math.min(target.length-at,decoded.length-offset);
          target.set(decoded.subarray(offset,offset+take),at);
          at+=take;offset+=take;
          if(at===target.length) {
            mounted.set(entries[cursor][0],target);
            cursor++; at=0; target=cursor<entries.length?new Uint8Array(entries[cursor][1]):null;
          }
        }
      }
    } finally {reader.releaseLock();}
    window.astraLoad?.progress("download",label,i+1,files.length);
  }
  if(cursor!==entries.length) throw Error("Incomplete "+group+" parcel");
}
function syncPilot() {
  if(!window.Module?.FS || !Module.saveReady || saving || Module.netSession || Module.checkpointBusy || Module.autopilot) return;
  saving=true;
  Module.FS.syncfs(false,err=>{saving=false;if(err)console.warn("Pilot save",err);});
}
// The flight window owns relative input. Menus and the launcher use the desktop cursor.
const flightView = $("view"), mouseHint = $("mouseHint");
let flightActive = false, capturePending = false, captureClick = false, hasMouse = false;
let lastRelease = -Infinity;
const mouseCaptured = () => document.pointerLockElement === flightView;
function refreshMouseHint() {
  $("flightMenu").hidden=!flightActive || !!window.Module?.autopilot || !!window.astraPreview?.active;
  mouseHint.hidden = !!window.Module?.autopilot || !flightActive || mouseCaptured() || window.astraPreview?.active;
  $("previewFlight").hidden = !!window.Module?.netSession || !flightActive || !window.Module?.astra || window.astraPreview?.active;
}
function releaseFlightMouse() {
  if (mouseCaptured()) document.exitPointerLock();
}
function captureFlightMouse() {
  if (window.Module?.autopilot || capturePending || mouseCaptured() || !flightView.requestPointerLock) return;
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
  if (window.Module?.autopilot || window.astraPreview?.active) { e.preventDefault();e.stopImmediatePropagation();return; }
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
  if (window.astraPreview?.active) {
    e.stopImmediatePropagation();
    if(e.target.closest?.('select,input')&&e.key!=='Escape')return;
    if(window.astraMinePreview?.active&&['ArrowLeft','ArrowRight',' '].includes(e.key)){
      if(e.target.closest?.('button')&&e.key===' '){}else{
        e.preventDefault();if(!e.repeat){if(e.key===' ')astraMinePreview.pause();else astraMinePreview.next(e.key==='ArrowLeft'?-1:1);}return;
      }
    }
    if(e.key==="Tab")return;
    if(e.target.closest?.('button') && ['Enter',' '].includes(e.key)){
      e.preventDefault();if(!e.repeat)e.target.closest('button').click();return;
    }
    e.preventDefault();
    if(e.key==="Escape")window.astraPreview.close();
    return;
  }
  if (e.key === "Escape" && (mouseCaptured() || (flightActive && performance.now()-lastRelease < 120))) {
    e.preventDefault(); e.stopImmediatePropagation(); releaseFlightMouse();
  } else if (e.key === "Escape" && flightActive && !window.astraMenus?.active &&
             !window.astraNet?.menuOpen && !document.querySelector("dialog[open]")) {
    e.preventDefault(); e.stopImmediatePropagation();
    if(!e.repeat){Module._astra_reset_flight_input?.();Module.menuCommand=1;}
  }
}, true);
window.addEventListener("blur", releaseFlightMouse);
document.addEventListener("visibilitychange", () => { if (document.hidden) releaseFlightMouse(); });

function preloadFlightEngine() {
  if(location.protocol!=="http:"&&location.protocol!=="https:")return;
  if(document.getElementById("astraEnginePreload"))return;
  const link=document.createElement("link");link.id="astraEnginePreload";
  link.rel="preload";link.as="script";link.href="engine.js?v=pyre101";
  document.head.append(link);
}
let firstBlastProfile=0;
let openWeaponPriorities=false;
window.astraPreview = {
  active:false,
  show(active) {
    this.active=active;
    $("blastControls").hidden=!(active && Module.mineInspect<0 && Module.weaponInspect<0 && Module.pickupInspect<0);
    document.body.classList.toggle("previewing",active);
    $("previewPanel").hidden=!active;
    setAutoControls(false);
    if(active){releaseFlightMouse();window.astraDeck?.show(false);$("previewAgain").focus();}
    else flightView.focus({preventScroll:true});
    refreshMouseHint();
  },
  update(number,seed,age,length,profile=0) {
    this.state={number,seed,age,length,profile};
    $("blastControls").hidden=false;
    $("blastSelect").value=String(profile);
    $("previewTitle").textContent=profile>=18?"CHAIN EXPLOSIONS / "+String(profile-17).padStart(2,"0"):profile?"COMBAT EXPLOSIONS":"PYRO–GX / DESTRUCTION PREVIEW";
    $("previewVariation").textContent="VARIATION "+String(number).padStart(2,"0");
    $("previewPhase").textContent=age<0?"PYRO–GX · Stand by":age>=length?"Clear · Try another variation":age<length*.16?"Hull breakup":age<length*.65?"Secondary detonations":"Cooling embers";
    if(profile){
      $("previewVariation").textContent=$("blastSelect").selectedOptions[0].textContent;
      $("previewPhase").textContent=age<0?"Armed":age<length?"Detonating":"Clear";
      if(profile>=18){const c=Module.chainPreview;$("previewPhase").textContent=age<0?"Intact hull · Stand by":age>=length?"Clear":c?.breakup?`Hull fragments · ${c.wallHits} wall impacts · ${c.shipHits} ship impacts`:"Sequential detonations";}
      $("previewAgain").textContent="Replay";
      if($("blastLoop").checked && !Module.previewPaused && age>length+.9)Module.pyroPreviewCommand=2;
    }else $("previewAgain").textContent="Play another variation ↻";
    $("previewTime").textContent=Math.max(0,Math.min(age,length)).toFixed(1)+" / "+length.toFixed(1)+" s";
    $("previewProgress").value=Math.max(0,Math.min(1,age/length));
  },
  open() { if(flightActive && Module.astra){Module.blastInspect=0;releaseFlightMouse();Module._astra_reset_flight_input?.();Module.pyroPreviewCommand=1;} },
  close() { if(this.active)Module.pyroPreviewCommand=-1; }
};
$("previewFlight").onclick=()=>window.astraPreview.open();
$("previewAgain").onclick=()=>{Module.pyroPreviewCommand=1;};
$("previewClose").onclick=()=>window.astraPreview.close();

async function launch(quick,demo=false,encounter=false,preview=false,autopilot=false,inspect=false,weapons=false,mine=false) {
  if(launchPending)return;
  launchPending=true;preloadFlightEngine();window.astraBench?.begin();window.astraLoad?.begin();
  const buttons=document.querySelectorAll(".launch");
  buttons.forEach(el=>el.disabled=true);
  try {
    if(quick && !demo && !preview && !autopilot && !window.astraNet?.session)captureFlightMouse();
    const selectedCampaign=$("campaign").value;
    const campaign=(selectedCampaign==='overload'&&(preview||inspect||weapons||mine)||window.astraCampaigns[selectedCampaign]?.arena&&(preview&&!mine||inspect||weapons))?'d2x':selectedCampaign;
    const astra=campaign==='overload'||$("look").value==="astra";
    // Prime the media element in the button gesture before disk I/O.
    const music=player;
    // Unlock the existing Red Book audio element with a short silent WAV.
    const silence="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQIAAAAAAA==";
    music.src=silence; music.volume=.75;
    music.play().then(()=>{if(music.getAttribute("src")===silence){music.pause();music.currentTime=0;}}).catch(()=>{});
    await script("streaming.js?v=80");
    const loadMovie=astraMovieLibrary(async file=>{
      const response=await fetch("payload/"+file);
      if(!response.ok||!response.body)throw Error("Could not load "+file);
      return response.body;
    });
    const districtArt = astra && campaign!=="overload" ? script("district-art.js?v=75").then(()=>window.astraDistrictReady) : Promise.resolve(null);
    const scenery = astra && campaign!=="overload" ? script("scenery-art.js?v=74").then(()=>window.astraSceneryReady) : Promise.resolve(null);
    await readPack("game","Reading game data");
    await readPack("vertigo","Reading the mission");
    if(window.astraCampaigns[campaign]?.arena)await readPack("classics86","Reading classic arenas");
    let assetDepot=null;
    if(astra){
      await script("payload/stream24/index.js?v=69");
      const catalog=window.astraStreamCatalog;
      window.astraMaterialTypes=catalog.types;
      window.astraCollectiblesCatalog=catalog.effects.catalog;
      assetDepot=astraMaterialLibrary(catalog);
      async function effect(file, gzip){
        const response=await fetch("payload/stream24/"+file);
        if(!response.ok||!response.body)throw Error("Could not load "+file);
        const stream=gzip?response.body.pipeThrough(new DecompressionStream("gzip")):response.body;
        return new Uint8Array(await new Response(stream).arrayBuffer());
      }
      await readPack("cockpit","Fitting flight instruments");
      await readPack("fleet","Fitting robot chassis");
      window.astraLoad?.progress("download","Downloading explosion and collectible artwork",0,2);
      const [field,mesh]=await Promise.all([effect(catalog.effects.field,false),effect(catalog.effects.mesh,true)]);
      mounted.set("pyro-field.png",field);
      mounted.set("collectibles.mesh",mesh);
      window.astraLoad?.progress("download","Explosion and collectible artwork ready",2,2);
    }
    if(astra){await script("generated-materials.js?v=93");assetDepot=astraGeneratedLibrary(assetDepot);}
    if(astra)await loadAstraShipAssets();
    const districtMaps=await districtArt;if(districtMaps)for(const [name,bytes] of districtMaps)mounted.set(name,bytes);
    const sceneryBytes=await scenery;if(sceneryBytes)mounted.set("scenery74.png",sceneryBytes);
    if(campaign==="overload"){await script("mission-controller.js?v=77");await script("overload-loader.js?v=78");await astraOverload.install(mounted);}
    window.astraLoad?.progress("effects","Starting flight computer");
    const canvas=$("view");
    const quality=Number($("res").value);
    const height=Math.round(quality*9/16);
    window.Module={
      resumeFlight:!!window.astraResumeLast,comfort:window.astraTools?.comfort,
      resumeCheckpoint:!!window.astraResumeCheckpoint,checkpoints:document.getElementById("checkpoints").checked,
      netSession:window.astraNet?.session||null,arenaDemo:!!window.astraNet?.session?.spectator,
      canvas,quick,demo,encounter,autopilot,openWeaponPriorities,fullWarmup:$("fullWarmup").checked,shadowQuality:Number($("shadowQuality").value),combatInspect:window.astraCombatPending??-1,assetDepot,loadMovie,fastLaunch:true,blastInspect:preview?firstBlastProfile:0,mineInspect:mine?0:-1,mineInspectZoom:1,demoArsenal:autopilot&&!window.astraNet?.session?.spectator&&$("demoArsenal").checked,weaponInspect:weapons?0:-1,difficulty:Number($("difficulty").value),mobileDemo:autopilot&&astraTouch,autoPaused:false,startLevel:mine?Number($("mineLevel").value):autopilot?Number($("demoLevel").value):window.astraCampaigns[campaign]?.arena?Number($("classicLevel").value)||1:1,pickupInspect:inspect?0:-1,pyroPreviewCommand:preview?1:0,campaign,wideHud:$("wideHud").checked,intro:!openWeaponPriorities && !quick && !demo && $("intro").checked,astra, arguments:["-hogdir","/mine","-pilot",autopilot?"watch":"astra","-window","-nostickykeys","-nojoystick",
        "-gl_gettexlevelparam_ok","0","-gl_intensity4_ok","0","-gl_luminance4_alpha4_ok","0","-gl_rgba2_ok","0"],
      print:console.log,printErr:console.warn,onAbort:astraFail,
      onExit:()=>{Module.astraExited=true;window.astraMenus?.hide();window.astraTerminal?.fail();window.astraFlightFocus(false);syncPilot();document.body.classList.remove("flying");$("status").textContent="Flight ended."; $("retry").hidden=false;},
      preRun:[()=>{
        const F=Module.FS, save="/home/web_user/.d2-astra";
        F.mkdirTree("/mine/demos");F.mkdirTree("/mine/missions"); F.mkdirTree(save);
        for(const [name,bytes] of mounted) F.writeFile("/mine/"+name,bytes,{canOwn:true});
        if(astra){
          const hull=window.astraHullBytes || decodeAstraBase64(window.astraHull.data);
          F.writeFile("/mine/astra.hull",hull);

          F.writeFile("/mine/pyro-skin.png",decodeAstraBase64(window.astraSkin));F.writeFile("/mine/pyro.frag",window.astraHull.fragment);
        }
        if(astra && !assetDepot?.hasNativeLibrary) for(const [alias,src] of Object.entries(window.astraAliases||{}))
          F.createDataFile("/mine",alias+".png",mounted.get(src),true,false,true);
        mounted.clear();
        F.mount(Module.IDBFS,{},save);
        Module.addRunDependency("pilot");
        F.syncfs(true,err=>{
          Module.saveReady=!err;window.astraProgress?.mounted();
          if(window.astraResume?.mounted()===false){astraFail("Your last flight is unavailable in browser storage. Return to the title to choose a campaign or a manual save.");return;}
          let cfg="";
          const name=save+"/descent.cfg";
          if(F.analyzePath(name).exists) cfg=F.readFile(name,{encoding:"utf8"});
          const settings={ResolutionX:quality,ResolutionY:height,AspectX:9,AspectY:16,WindowMode:1,
                          TexFilt:astra?3:2,MovieTexFilt:1,MusicType:2,OrigTrackOrder:1,VSync:1};
          if(!cfg) Object.assign(settings,{DigiVolume:8,MusicVolume:6,GammaLevel:3});
          cfg=cfg.split(/\r?\n/).filter(l=>!Object.prototype.hasOwnProperty.call(settings,l.split("=")[0])).join("\n");
          cfg+="\n"+Object.entries(settings).map(([k,v])=>k+"="+v).join("\n")+"\n";
          F.writeFile(name,cfg);
          Module.removeRunDependency("pilot");
        });
      }],
      onRuntimeInitialized:()=>{
        window.astraTerminal?.loading(false);document.body.classList.add("flying"); document.body.classList.toggle("autopilot",autopilot); setAutoControls(false); canvas.focus();
        setInterval(syncPilot,3000);
      }
    };
    await script("engine.js?v=pyre101");
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

window.astraLaunchSquadron=()=>launch(true,false,false,false,!!window.astraNet?.session?.spectator);
$("start").onclick=()=>window.astraResumeLast||window.astraResumeCheckpoint?launch(true):window.astraCampaigns[$("campaign").value]?.arena?window.astraNet.quickArena($("playMode").value==='coop'):$("playMode")?.value==='coop'?window.astraNet.quickCoop():launch(true);
$("classicExplore").onclick=()=>launch(true);
function launchBlastPreview(profile){
  firstBlastProfile=profile;
  $("look").value="astra";
  launch(true,false,false,true);
}
$("previewStart").onclick=()=>launchBlastPreview(0);
$("blastStart").onclick=()=>launchBlastPreview(1);
$("chainStart").onclick=()=>launchBlastPreview(18);
$("blastSelect").onchange=()=>{
  Module.blastInspect=Number($("blastSelect").value);
  Module.pyroPreviewCommand=1;
};
$("encounter").onclick=()=>launch(true,false,true);
function launchCampaignMenu(priorities) {
  if(launchPending)return;
  openWeaponPriorities=priorities;
  launch(false);
}
$("menus").onclick=()=>launchCampaignMenu(false);
$("weaponPriorities").onclick=()=>launchCampaignMenu(true);
$("demo").onclick=()=>launch(false,true);
$("retry").onclick=()=>window.astraNavigation.home(false);
$("view").oncontextmenu=e=>e.preventDefault();
document.addEventListener("visibilitychange",()=>{if(document.hidden)syncPilot();});
window.addEventListener("pagehide",syncPilot);
// Only a fault that passed through the engine ends the flight. An error raised
// by a launcher or HUD script alone is left in the console and the mine keeps running.
function astraEngineFault(e) {
  return e.error instanceof WebAssembly.RuntimeError ||
    /engine\.js/.test(e.filename||"") || /engine\.js/.test(String(e.error?.stack||""));
}
window.addEventListener("error",e=>{if(window.Module && e.message && astraEngineFault(e))astraFail(e.message);});
// SDL renames the tab after the engine build. Keep the game's own title.
const astraTitle=document.title;
new MutationObserver(()=>{if(document.title!==astraTitle)document.title=astraTitle;})
  .observe(document.querySelector("title"),{childList:true,characterData:true,subtree:true});
$("view").addEventListener("webglcontextlost",e=>{e.preventDefault();syncPilot();astraFail("The graphics device reset. Reopen the flight terminal to continue.");});









// Demo controls stay out of the flight view until requested.
function setAutoControls(open, restoreFocus=false){
  const visible=!!window.Module?.autopilot && document.body.classList.contains('flying') && !window.astraPreview?.active;
  $('autoMine').hidden=$('autoWeapons').hidden=!!window.Module?.arenaDemo;
  $('autoNext').textContent=window.Module?.arenaDemo?'Next arena':'Next mine';
  $('autoToggle').hidden=!visible;
  $('autoPanel').hidden=!(open && visible);
  $('autoToggle').setAttribute('aria-expanded',String(open && visible));
  if(restoreFocus && visible)$('autoToggle').focus({preventScroll:true});
}
$('autoToggle').onclick=()=>setAutoControls($('autoPanel').hidden);
$('autoHide').onclick=()=>setAutoControls(false,true);
document.addEventListener('pointerdown',event=>{
  if(!$('autoPanel').hidden && !event.target.closest('#autoPanel, #autoToggle'))setAutoControls(false);
},true);
for(const type of ['keydown','keyup'])window.addEventListener(type,event=>{
  if(type==='keydown' && event.key==='Escape' && !$('autoPanel').hidden){
    event.preventDefault();event.stopImmediatePropagation();setAutoControls(false,true);
    return;
  }
  // SDL consumes document keys. Handle these buttons before it sees them.
  const control=event.target.closest?.('#autoToggle, #autoPanel');
  if(control || (window.Module?.autopilot && event.key==='Tab'))event.stopImmediatePropagation();
  if(control && ['Enter',' '].includes(event.key)){
    event.preventDefault();
    if(!event.repeat && ((event.key==='Enter' && type==='keydown') || (event.key===' ' && type==='keyup')))event.target.closest('button')?.click();
  }
},true);

// Touch-friendly controls for the autonomous pilot and the pickup inspection view.
const astraTouch=matchMedia('(pointer:coarse)').matches;
if(astraTouch)$('res').value='960';
// Decoding artwork inside a flight frame stalls it. By default the engine
// prepares everything a mine can show behind the loading screen instead.
// Phones keep the lighter on-demand loading unless the pilot chooses otherwise.
const warmupKey="astra.fullWarmup",savedWarmup=getSetting(warmupKey);
$('fullWarmup').checked=savedWarmup===null?!astraTouch:savedWarmup==="1";
$('fullWarmup').onchange=()=>saveSetting(warmupKey,$('fullWarmup').checked);
$('full').hidden=!$('stage').requestFullscreen;
$('full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen?.();else await $('stage').requestFullscreen?.();}catch{}};
const demoLevel=$('demoLevel');
function populateDemoLevels(){
  const c=window.astraCampaigns[$('campaign').value],count=c?.levels||20;
  demoLevel.replaceChildren(...Array.from({length:count},(_,i)=>new Option(c?.maps?.[i]?(i+1)+' · '+c.maps[i]:'Level '+(i+1),i+1)));
}
$('campaign').addEventListener('change',populateDemoLevels);populateDemoLevels();
let wakeLock;
async function watchWake(){try{wakeLock=await navigator.wakeLock?.request('screen');}catch{}}
window.astraAutoStatus=(task,rooms,deaths,kills,pickups)=>{
  if(!Module.autopilot)return;
  if(Module.arenaDemo&&task==='Exploring the mine')task='Patrolling for opponents';
  const remote=Module.arenaDemo&&(Module.arenaView|0)>0;
  if(!remote)$('autoTask').textContent=Module.autoPaused?'Paused':task;
  const level=Module.flightState?.level||Module.startLevel;
  if(!remote)$('autoStats').textContent=Module.arenaDemo?`${window.astraCampaigns[Module.campaign].name} · ${window.astraCampaigns[Module.campaign].maps[level-1]} · ${kills} kills · ${deaths} deaths · 4 AI pilots`:`${window.astraCampaigns[Module.campaign]?.name||'Astra'} · L${level} · ${kills} kills · ${pickups} pickups · ${rooms} rooms${Module.demoArsenal?' · Full arsenal':''}`;
  Module.autoStats={task,rooms,deaths,kills,pickups};
};
function pauseDemo(paused){
  Module.autoPaused=paused;$('autoPause').textContent=paused?'Resume':'Pause';
  $('autoPause').setAttribute('aria-pressed',String(paused));
  $('autoToggleLabel').textContent=paused?'Paused · Controls':'Controls';
  $('autoToggle').dataset.paused=String(paused);
  if(paused){astraDisc.audio.pause();$('autoTask').textContent='Paused';}
  else {if(astraDisc.track)astraDisc.audio.play().catch(()=>{});watchWake();}
}
$('watch').onclick=()=>{$('look').value='astra';$('wideHud').checked=true;watchWake();if(window.astraCampaigns[$('campaign').value]?.arena)window.astraNet.watchArena();else launch(true,false,false,false,true);};
$('autoPause').onclick=()=>pauseDemo(!Module.autoPaused);
$('autoStop').onclick=()=>window.astraNavigation.home(false);
$('autoNext').onclick=()=>{
  pauseDemo(false);Module.autoNext=(Module.flightState?.level||Module.startLevel)%(window.astraCampaigns[Module.campaign]?.levels||20)+1;
  $('autoTask').textContent='Loading next mine';
};
window.astraAutoFinished=()=>{Module.autoNext=1;$('autoTask').textContent='Campaign complete · Starting a new tour';};
let autoMuted=false;
$('autoSound').onclick=()=>{
  autoMuted=!autoMuted;
  astraDisc.audio.volume=autoMuted?0:.75;
  const context=window.SDL?.audioContext;
  if(context){if(autoMuted)context.suspend();else context.resume();}
  $('autoSound').textContent=autoMuted?'Sound off':'Sound on';
  $('autoSound').setAttribute('aria-pressed',String(autoMuted));
};
document.addEventListener('visibilitychange',()=>{
  if(document.hidden && window.Module?.autopilot){pauseDemo(true);wakeLock?.release();}
});
window.addEventListener('pagehide',()=>wakeLock?.release());
window.astraCollectibleStatus=id=>{
  const item=window.astraCollectiblesCatalog?.find(x=>x.id===id);
  if(!item)return;
  $('previewTitle').textContent='PTMC / COLLECTIBLE INSPECTION';
  $('previewVariation').textContent=item.name;
  $('previewPhase').textContent=id===17||id===42?(id===17?'Red proximity pickup · Silver carrier frame':'Amber smart-mine pickup · Silver carrier frame'):'Animated 3D model · Branching electrical discharges';
  $('previewTime').textContent=item.triangles.toLocaleString()+' triangles';
  $('previewProgress').hidden=true;
  $('previewAgain').textContent='Next collectible →';
  $('previewPrevious').hidden=false;
};
function nextCollectible(direction){
 const items=astraCollectiblesCatalog.filter(x=>x.active),i=items.findIndex(x=>x.id===Module.pickupInspect);
 Module.pickupInspect=items[(i+direction+items.length)%items.length].id;
}
$('collectiblesStart').onclick=()=>{$('look').value='astra';launch(true,false,false,true,false,true);};
$('previewPrevious').onclick=()=>nextCollectible(-1);
$('previewAgain').onclick=()=>{
 if(Module.pickupInspect>=0)nextCollectible(1);else Module.pyroPreviewCommand=1;
};
function resetExplosionLabels(){
 $('previewTitle').textContent='PYRO–GX / DESTRUCTION PREVIEW';
 $('previewProgress').hidden=false;$('previewPrevious').hidden=true;
 $('previewAgain').textContent='Play another variation ↻';
}
const normalPreviewOpen=astraPreview.open.bind(astraPreview);
astraPreview.open=()=>{Module.pickupInspect=-1;resetExplosionLabels();normalPreviewOpen();};
const normalPreviewClose=astraPreview.close.bind(astraPreview);
astraPreview.close=()=>{normalPreviewClose();};
