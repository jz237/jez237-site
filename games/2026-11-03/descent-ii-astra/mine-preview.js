// A paused tour of the loaded campaign's real architecture and machinery.
window.astraMinePreview={
  names:['Architecture & materials','Rotating fans','Hydraulic machinery','Live terminals','Cables & electrical faults','Doors & locking systems','Reactor assembly','Recharge lattice','Moving ship shadows','Brushed metal & surface wear','Fractured rock & minerals','Storage bay','Cooling chamber','Steam, dust & light','Clean edges in motion'],
  descriptions:[
    'Original Descent II surface designs rebuilt with fine materials, recessed edges and lighting. Pause and compare the same view with the original artwork.',
    'Spinning fan blades behind a fixed protective grille.',
    'Moving pistons, service pipes, joints and coolant conduits.',
    'Inset displays with changing readouts and scanning lights.',
    'Suspended cable bundles and intermittent electrical faults.',
    'Watch the original door open and close with its new tracks, hydraulics and key colors.',
    'Machined housings, pulsing energy cores and rotating containment rings.',
    'Animated charge cells, flowing pulses and electrical arcs in the original recharge field.',
    'A display ship hovers above a real mine wall. Watch its soft shadow change with its position and orientation.',
    'Brushed highlights, chipped coatings, grime and oily patches react differently to light. Pause and compare the new details.',
    'The original rock colors and formations gain fine mineral grain and relief. Rock stays only on original rock surfaces.',
    'Strapped cargo cassettes, recessed racks, registration plates and amber equipment lights.',
    'Ceramic coolant reservoirs, moving level gauges and linked service pipes give these rooms a distinct purpose.',
    'Localized vent steam, drifting illuminated dust and faint light shafts leave the central flight path clear.',
    'Fine grilles and rail edges stay smoother as the camera drifts. Switch the new details off to compare edge smoothing.'
  ],
  active:false,paused:false,touring:true,clock:0,last:0,mask:32767,fresh:false,
  tick(){const now=performance.now();if(this.last&&!this.paused)this.clock+=Math.min(.1,(now-this.last)/1000);this.last=now;return this.clock;},
  select(index){if(!(this.mask&(1<<index)))return;Module.mineInspect=index;this.clock=0;this.last=performance.now();$('mineScene').value=String(index);},
  next(direction){let i=Module.mineInspect;for(let n=0;n<this.names.length;n++){i=(i+direction+this.names.length)%this.names.length;if(this.mask&(1<<i)){this.select(i);break;}}},
  pause(){this.paused=!this.paused;this.last=performance.now();this.sync();},
  sync(){
    $('minePause').textContent=this.paused?'Play':'Pause';$('minePause').setAttribute('aria-pressed',String(this.paused));
    $('mineTour').checked=this.touring;
    $('mineCompare').textContent=(window.Module?.mineRefinement===false?'Original surfaces':'Remastered surfaces');
    $('mineCompare').setAttribute('aria-pressed',String(window.Module?.mineRefinement!==false));
  },
  details(open){$('mineDetails').hidden=!open;$('mineControls').setAttribute('aria-expanded',String(open));},
  open(){
    this.paused=false;this.touring=true;this.clock=0;this.last=0;this.mask=32767;this.fresh=true;$('mineZoom').value='1';this.sync();
    if(window.Module&&flightActive&&Module.astra){
      Module.mineRefinement=true;Module.mineInspect=0;Module.mineInspectZoom=1;Module.pickupInspect=Module.weaponInspect=-1;
      releaseFlightMouse();Module._astra_reset_flight_input?.();Module.pyroPreviewCommand=1;
    }else{$('look').value='astra';launch(true,false,false,true,false,false,false,true);}
  },
  show(active){
    this.active=active;document.body.classList.toggle('mine-preview',active);$('minePanel').hidden=!active;this.details(false);
    if(active){this.last=0;window.astraDeck?.show(false);$('minePause').focus({preventScroll:true});}
  },
  update(index,mask,level,room,clock){
    this.mask=mask;
    if(!(mask&(1<<Module.mineInspect)))Module.mineInspect=index;
    [...$('mineScene').options].forEach((o,i)=>o.disabled=!(mask&(1<<i)));
    $('mineScene').value=String(index);
    $('mineCaption').textContent=this.names[index];
    $('mineLocation').textContent=(Module.campaign==='d2'?'Counterstrike':'Vertigo')+' · '+(level<0?'Secret mine '+(-level):'Mine '+level);
    $('mineDescription').textContent=this.descriptions[index];
    this.state={index,mask,level,room,clock,paused:this.paused};
    if(this.fresh){this.fresh=false;Module.mineRefinement=true;this.select(0);this.sync();return;}
    if(this.touring&&!this.paused&&clock>11)this.next(1);
  },
  unavailable(){$('mineCaption').textContent='No inspection view available in this mine';}
};
const mine=astraMinePreview;
mine.names.forEach((name,i)=>{const o=document.createElement('option');o.value=i;o.textContent=name;$('mineScene').append(o);});
function mineLevels(){
  const old=$('mineLevel').value,d2=$('campaign').value==='d2';$('mineLevel').replaceChildren();
  for(let i=1;i<=(d2?24:20);i++){const o=document.createElement('option');o.value=i;o.textContent=(d2?'Counterstrike':'Vertigo')+' · Mine '+i;$('mineLevel').append(o);}
  for(let i=1;i<=(d2?6:3);i++){const o=document.createElement('option');o.value=-i;o.textContent=(d2?'Counterstrike':'Vertigo')+' · Secret '+i;$('mineLevel').append(o);}
  $('mineLevel').value=[...$('mineLevel').options].some(o=>o.value===old)?old:'1';
}
$('campaign').addEventListener('change',mineLevels);mineLevels();
$('mineStart').onclick=$('mineFlight').onclick=$('autoMine').onclick=()=>mine.open();
$('minePrevious').onclick=()=>mine.next(-1);$('mineNext').onclick=()=>mine.next(1);
$('minePause').onclick=()=>mine.pause();$('mineExit').onclick=()=>astraPreview.close();
$('mineScene').onchange=()=>mine.select(Number($('mineScene').value));
$('mineTour').onchange=()=>{mine.touring=$('mineTour').checked;mine.clock=0;};
$('mineZoom').oninput=()=>{Module.mineInspectZoom=Number($('mineZoom').value);};
$('mineCompare').onclick=()=>{Module.mineRefinement=Module.mineRefinement===false;mine.sync();};
$('mineControls').onclick=()=>mine.details($('mineDetails').hidden);
const previousShow=astraPreview.show.bind(astraPreview);
astraPreview.show=active=>{previousShow(active);mine.show(active&&Module.mineInspect>=0);if(!active)Module.mineInspect=-1;};
const previousExplosion=astraPreview.open.bind(astraPreview);
astraPreview.open=()=>{Module.mineInspect=-1;mine.show(false);previousExplosion();};
const previousWeapon=astraWeaponDemo.open.bind(astraWeaponDemo);
astraWeaponDemo.open=()=>{if(window.Module)Module.mineInspect=-1;mine.show(false);previousWeapon();};

if(location.hash==='#mines')requestAnimationFrame(()=>document.querySelector('[data-tab=showroom]')?.click());
