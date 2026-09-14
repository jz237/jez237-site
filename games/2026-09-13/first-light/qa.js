// window.__FIRST_LIGHT: the fleet's synchronous verification hook. Occluded tabs throttle rAF to
// zero, so drive step()/render() by hand and read pixelStats() instead of screenshots.
export function installQA(app){
 const api={
  step:dt=>app.step(dt),drive(seconds,dt=1/60){let n=0;while(n*dt<seconds){app.step(dt);n++;}return n;},render:()=>app.render(),
  pixelStats(w=64,h=36){app.render();const gl=app.renderer.getContext();const W=gl.drawingBufferWidth,H=gl.drawingBufferHeight;const px=new Uint8Array(W*H*4);gl.readPixels(0,0,W,H,gl.RGBA,gl.UNSIGNED_BYTE,px);
   let sum=0,nonBlack=0,maxLum=0,r=0,g=0,b=0,n=0;const sx=Math.max(1,Math.floor(W/w)),sy=Math.max(1,Math.floor(H/h));let top=0,bottom=0,topN=0,bottomN=0;
   for(let y=0;y<H;y+=sy)for(let x=0;x<W;x+=sx){const i=(y*W+x)*4;const lum=(px[i]*.2126+px[i+1]*.7152+px[i+2]*.0722)/255;sum+=lum;n++;if(lum>.02)nonBlack++;maxLum=Math.max(maxLum,lum);r+=px[i];g+=px[i+1];b+=px[i+2];if(y>H/2){top+=lum;topN++;}else{bottom+=lum;bottomN++;}}
   return {width:W,height:H,samples:n,avgLum:sum/n,nonBlackFrac:nonBlack/n,maxLum,avgRGB:[r/n,g/n,b/n],skyLum:top/Math.max(1,topN),waterLum:bottom/Math.max(1,bottomN)};},
  stats:()=>app.stats(),quality:q=>app.setQuality(q),setTime:h=>app.setHour(h),setClockRate:r=>app.setRate(r),setWind:(ms,dirDeg)=>app.setWind(ms,dirDeg),setWeather:w=>app.setWeather(w),
  setCamera:name=>app.setCamera(name),addRipple:(x,z,kind='splash')=>app.addRipple(x,z,kind),polarized:v=>app.setPolarized(v),forceSize:(w,h)=>app.forceSize(w,h),
  state:()=>app.state(),start:()=>app.start(),debug:()=>app.debug(),version:app.version,
  cast:(power=.8)=>app.cast(power),setReeling:v=>app.setReeling(v),twitch:()=>app.twitch(),rig:i=>app.rig(i),angling:()=>app.angling(),
  demo:seed=>app.demo(seed),demoStep:(secs,dt)=>app.demoStep(secs,dt),demoReport:()=>app.demoReport(),takeRod:()=>app.takeRod(),gallery:(id,t)=>app.gallery(id,t),forage:()=>app.forage(),forageMesh:()=>app.forageMesh(),forageTo:(i,x,z)=>app.forageTo(i,x,z),journalAdd:c=>app.journalAdd(c),galleryState:()=>app.galleryState(),galleryLake:()=>app.galleryLake(),closeGallery:()=>app.closeGallery(),studio:(len,species)=>app.studio(len,species),studioVisible:v=>app.studioVisible(v),photoFish:app.photoFish,spawnFish:(x,z,len,bold,species)=>app.spawnFish(x,z,len,bold,species),fish:()=>app.fish(),forceStrike:()=>app.forceStrike(),setHook:()=>app.setHook(),fightState:()=>app.fightState(),fightInput:i=>app.fightInput(i),releaseFish:()=>app.releaseFish(),journal:()=>app.journal()
 };
 window.__FIRST_LIGHT=api;return api;
}
