// Uses independent preview fighters; never advances or rewinds a live match.
const normals = [];
for (const [action,label] of [['light','Light'],['heavy','Heavy']]) {
 for (const [limb,word] of [['punch','punch'],['kick','kick']]) {
  for (const [stance,prefix,context] of [['standing','Standing',{}],['forward','Advancing',{forwardHeld:true}],['crouching','Crouching',{crouching:true}],['air','Air',{airborne:true}]]) {
   normals.push({id:`${stance}-${action}-${limb}`,label:`${prefix} ${label.toLowerCase()} ${word}`,action,context:{...context,limb}});
  }
 }
}
export const VIEWER_MOVES = [...normals,
 ...[['forward','Forward shuffle and stop'],['back','Backward shuffle and stop'],['high','Light high block and recoil'],['high-heavy','Heavy high block and recoil'],['low','Light low block and recoil'],['low-heavy','Heavy low block and recoil'],['landing','Landing and settle']].map(([pose,label])=>({id:`footwork-${pose}`,pose,label})),
 ...[['throw','Throw'],['enhanced','Enhanced special'],['launcher','Rising uppercut / launcher'],['overhead','Overhead'],['special','Signature special'],['commandSpecial','Forward special'],['backSpecial','Back special'],['enhancedLauncher','Enhanced launcher'],['enhancedCommandSpecial','Enhanced forward special'],['enhancedBackSpecial','Enhanced back special'],['super','Super']].map(([action,label])=>({id:action,action,label,context:{}})),
 ...[['head','Head hit'],['body','Body hit'],['heavy','Heavy hit'],['legs','Low leg hit']].map(([reaction,label])=>({id:`reaction-${reaction}`,reaction,label}))];

export function viewerPhase(frame,attack) {
 if (!attack) return frame<30?'REACTION':'READY';
 if (frame === 0) return 'READY';
 if (frame < attack.activeStartFrame) return 'WINDUP';
 if (frame < attack.activeEndFrame) return 'CONTACT';
 if (frame <= attack.totalFrames) return 'RECOVERY';
 return 'READY';
}

export function createMoveViewer({dialog,roster,prepare,move,sample,onOpen,onClose}) {
 const el=id=>dialog.querySelector('#moveViewer'+id);
 const canvas=el('Canvas'),ctx=canvas.getContext('2d'),fighterSelect=el('Fighter'),moveSelect=el('Move');
 let step=1;
 let fighter,attack,selection,frame=0,total=60,playing=false,last=0,carry=0,direction=1,request=0,raf=0,ready=false,poses=[];
 fighterSelect.replaceChildren(...roster.map(f=>new Option(f.name,f.id)));
 fighterSelect.value='jez';
 function controls(){el('Play').textContent=playing?'PAUSE':'PLAY';el('Frame').value=frame;}
 function sampleFrame(tick) {
  fighter.previewTick=tick;fighter.animTime=tick/60;fighter.walkTime=0;fighter.strideTime=0;
  fighter.attackFrame=tick;fighter.attackTime=tick/60;fighter.attacking=attack&&tick>0&&tick<=attack.totalFrames?attack:null;
  fighter.crouch=Boolean(selection.context?.crouching);fighter.grounded=!selection.context?.airborne;
  fighter.hitstunFrames=selection.reaction?Math.max(0,30-tick):0;
  fighter.lastHitRegion=selection.reaction==='heavy'?'head':selection.reaction;
  fighter.lastHitHeavy=selection.reaction==='heavy';fighter.lastHitLevel=selection.reaction==='body'?'low':'mid';
  fighter.lastImpactTick=0;fighter.stun=fighter.hitstunFrames/60;
  fighter.vx=0;fighter.x=0;fighter.block=false;fighter.guarding=false;fighter.blockstunFrames=0;
  if(selection.pose){
   const mode=selection.pose,walking=mode==='forward'||mode==='back';
   fighter.vx=walking&&tick<42?(mode==='forward'?150:-150):0;
   fighter.x=walking?Math.min(tick,42)*(mode==='forward'?2.5:-2.5):0;
   fighter.walkTime=walking?tick/60:0;fighter.strideTime=fighter.walkTime;
   fighter.crouch=mode.startsWith('low');fighter.block=mode.startsWith('high')||mode.startsWith('low');fighter.lastHitHeavy=mode.endsWith('heavy');
   fighter.blockstunFrames=fighter.block&&tick<18?18-tick:0;
   fighter.grounded=mode!=='landing'||tick>=12;
  }
  return sample(fighter);
 }
 function draw() {
  if(!ready||!fighter)return;
  const pose=poses[frame];
  ctx.fillStyle='#202a34';ctx.fillRect(0,0,960,560);
  ctx.strokeStyle='#34424f';ctx.lineWidth=1;
  for(let x=0;x<960;x+=80){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,560);ctx.stroke();}
  for(let y=20;y<560;y+=80){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(960,y);ctx.stroke();}
  ctx.strokeStyle='#93a1b0';ctx.beginPath();ctx.moveTo(0,510);ctx.lineTo(960,510);ctx.stroke();
  ctx.fillStyle='#101720';ctx.beginPath();ctx.ellipse(480,514,125,12,0,0,Math.PI*2);ctx.fill();
  const size=420*pose.scale;
  if(pose.atlas?.complete&&pose.atlas.naturalWidth){
   ctx.save();ctx.translate(480,510+pose.floor*size-(selection.context?.airborne?55:0));ctx.scale(direction*pose.facing,1);
   ctx.drawImage(pose.atlas,(pose.frame%4)*320,Math.floor(pose.frame/4)*320,320,320,-size/2,-size,size,size);ctx.restore();
  }
  const phase=selection.pose?(selection.pose==='landing'?(frame<12?'AIR':frame<18?'LAND':'READY'):selection.pose.startsWith('high')||selection.pose.startsWith('low')?(frame<18?'BLOCK RECOIL':'GUARD'):frame<42?'STEP':'SETTLE'):viewerPhase(frame,attack);
  ctx.fillStyle=phase==='CONTACT'?'#ffd54a':'#d4dfeb';ctx.font='bold 22px sans-serif';ctx.fillText(phase,24,38);
  const start=attack?.activeStartFrame,end=attack?.activeEndFrame;
  if(attack){ctx.fillStyle='#536273';ctx.fillRect(24,542,912,6);ctx.fillStyle='#ffd54a';ctx.fillRect(24+912*start/total,542,912*(end-start)/total,6);ctx.fillStyle='#fff';ctx.fillRect(24+912*frame/total,538,3,14);}
  el('Status').textContent=`${fighter.def.name} · ${selection.label} · Frame ${frame} / ${total} · ${phase}`;
  canvas.dataset.bank=pose.bank;canvas.dataset.cell=pose.frame;canvas.dataset.phase=phase;
  controls();
 }
 async function load() {
  const token=++request;ready=false;playing=false;controls();el('Status').textContent='Loading painted artwork…';
  try{
   const next=await prepare(fighterSelect.value);if(token!==request||!dialog.open)return;
   fighter=next;step=['jez','benny'].includes(fighter.def.id)?.25:1;el('Frame').step=step;
   const previous=moveSelect.value;
   const available=VIEWER_MOVES.filter(row=>row.pose||row.reaction||move(fighter,row.action,row.context));
   moveSelect.replaceChildren(...available.map(row=>new Option(row.label,row.id)));
   if(available.some(row=>row.id===previous))moveSelect.value=previous;
   ready=true;select();
  }catch(error){console.error('Move viewer:',error);ready=false;if(token===request)el('Status').textContent='Artwork could not load. Choose the fighter again to retry.';}
 }
 function select(){
  if(!ready)return;
  selection=VIEWER_MOVES.find(row=>row.id===moveSelect.value);
  attack=selection.pose||selection.reaction?null:move(fighter,selection.action,selection.context);
  frame=0;carry=0;total=attack?attack.totalFrames+12:selection.pose?54:42;
  // New objects reset the companion-frame history when scrubbing backwards.
  fighter={...fighter};poses={};for(let tick=0;tick<=total;tick+=step)poses[tick]=sampleFrame(tick);el('Frame').max=total;draw();
 }
 function seek(value){if(!ready)return;playing=false;carry=0;frame=Math.max(0,Math.min(total,value));fighter={...fighter};draw();}
 function update(now){
  if(!dialog.open)return;
  if(ready&&playing){carry+=Math.min(.1,(now-last)/1000)*60*Number(el('Speed').value);const count=Math.floor(carry/step)*step;if(count){carry-=count;frame=(frame+count)%(total+step);if(frame<count)fighter={...fighter};draw();}}
  last=now;raf=requestAnimationFrame(update);
 }
 fighterSelect.addEventListener('change',load);moveSelect.addEventListener('change',select);
 el('Play').addEventListener('click',()=>{if(ready){playing=!playing;carry=0;controls();}});
 el('Previous').addEventListener('click',()=>seek(frame-step));el('Next').addEventListener('click',()=>seek(frame+step));
 el('Frame').addEventListener('input',event=>seek(Number(event.target.value)));
 el('Flip').addEventListener('click',()=>{direction*=-1;el('Flip').textContent=direction===1?'FACE LEFT':'FACE RIGHT';draw();});
 el('Close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{playing=false;request++;cancelAnimationFrame(raf);onClose?.();});
 // Document capture blocks game shortcuts; use a separate capture handler here.
 document.addEventListener('keydown',event=>{
  if(!dialog.open||['SELECT','INPUT'].includes(event.target.tagName))return;
  if(event.code==='Space'&&event.target.tagName!=='BUTTON'){event.preventDefault();el('Play').click();}
  if(event.code==='ArrowLeft'||event.code==='ArrowRight'){event.preventDefault();seek(frame+(event.code==='ArrowRight'?1:-1));}
 },true);
 return {open(){onOpen?.();dialog.showModal();last=performance.now();load();raf=requestAnimationFrame(update);}};
}
