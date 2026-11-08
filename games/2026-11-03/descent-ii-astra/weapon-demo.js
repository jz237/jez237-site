// Shares the paused native inspection view with the collectible/explosion demos.
window.astraWeaponDemo={
  names:['Laser · level 1','Laser · level 4','Quad super laser · level 6','Vulcan cannon','Gauss cannon','Spreadfire cannon','Plasma cannon','Fusion cannon','Helix cannon','Phoenix cannon','Omega cannon','Concussion missile','Homing missile','Smart missile','Mega missile','Flash missile','Guided missile','Mercury missile','Earthshaker missile','Smart mine · arm and detonate','Proximity mine · deploy and detonate'],
  cycling:true,lastSwitch:0,
  select(index){Module.weaponInspect=(index+this.names.length)%this.names.length;this.lastSwitch=performance.now();Module.previewRestart=true;$('weaponSelect').value=String(Module.weaponInspect);},
  update(index){
    document.body.classList.add('weapon-range');
    $('weaponControls').hidden=false;$('previewTitle').textContent='COCKPIT FIRING RANGE';
    $('rangeControls').hidden=!this.controlsOpen;
    const primaries=[0,0,0,1,6,2,3,4,7,8,9],secondaries=[0,1,3,4,5,6,8,9,7,2];
    window.astraDeck?.show(true);
    window.astraDeck?.update(0,3,100,100,0,index<11?primaries[index]:0,index<11?0:secondaries[index-11],index===1?4:index===2?6:1,20,100,index===2?1024:0,1,100,true,false,0);
    $('previewVariation').textContent=this.names[index];$('previewPhase').textContent=index===19?['Deploying · Classic amber mine','Armed · Scanning for targets','Detonation · Homing energy globules','Targets hit · Replay to watch again'][Module.smartRange?.phase||0]:index===20?['Deploying · Classic red mine','Proximity mine · Ready','Detonation · Blast radius','Replay to watch again'][Module.smartRange?.phase||0]:index===13?'Impact burst · Six homing plasma globules':index===2?'Quad fire · Two barrels on each side':'Cockpit view · Native firing patterns';
    $('previewTime').textContent=(index+1)+' / '+this.names.length;$('previewProgress').hidden=true;
    $('previewPrevious').hidden=false;$('previewAgain').textContent='Next weapon →';
    $('weaponSelect').value=String(index);
    if(!this.lastSwitch)this.lastSwitch=performance.now();
    if(this.cycling&&!Module.previewPaused&&Module.previewSpeed===1&&window.astraPlayback?.age>(index>=19?8:index===13?6.5:5.5))this.select(index+1);
  },
  open(){
    this.lastSwitch=0;this.cycling=true;this.controls(false);this.sync();
    if(window.Module&&flightActive){Module.pickupInspect=-1;this.select(0);releaseFlightMouse();Module.pyroPreviewCommand=1;}
    else {$('look').value='astra';launch(true,false,false,true,false,false,true);}
  },
  controls(open){this.controlsOpen=open;$('rangeToggle').setAttribute('aria-expanded',String(open));$('rangeControls').hidden=!open;},
  sync(){$('weaponCycle').textContent=this.cycling?'Auto-cycle on':'Auto-cycle off';$('weaponCycle').setAttribute('aria-pressed',String(this.cycling));}
};
astraWeaponDemo.names.forEach((name,index)=>{const o=document.createElement('option');o.value=index;o.textContent=name;$('weaponSelect').append(o);});
$('weaponSelect').onchange=()=>astraWeaponDemo.select(Number($('weaponSelect').value));
$('weaponCycle').onclick=()=>{astraWeaponDemo.cycling=!astraWeaponDemo.cycling;astraWeaponDemo.lastSwitch=performance.now();astraWeaponDemo.sync();};
$('weaponsStart').onclick=$('autoWeapons').onclick=()=>astraWeaponDemo.open();
const previousPickup=$('previewPrevious').onclick,nextPickup=$('previewAgain').onclick;
$('previewPrevious').onclick=()=>{if(Module.weaponInspect>=0)astraWeaponDemo.select(Module.weaponInspect-1);else previousPickup();};
$('previewAgain').onclick=()=>{if(Module.weaponInspect>=0)astraWeaponDemo.select(Module.weaponInspect+1);else nextPickup();};
const originalExplosionOpen=astraPreview.open.bind(astraPreview);
astraPreview.open=()=>{Module.weaponInspect=-1;$('weaponControls').hidden=true;originalExplosionOpen();};
const originalCollectionStart=$('collectiblesStart').onclick;
$('collectiblesStart').onclick=()=>{$('weaponControls').hidden=true;originalCollectionStart();};

$('rangeToggle').onclick=()=>astraWeaponDemo.controls(!astraWeaponDemo.controlsOpen);
document.addEventListener('pointerdown',e=>{if(document.body.classList.contains('weapon-range') && !e.target.closest('#rangeControls, #rangeToggle'))astraWeaponDemo.controls(false);},true);
const rangeShow=astraPreview.show.bind(astraPreview);
astraPreview.show=active=>{
  const weapons=active&&Module.weaponInspect>=0;
  document.body.classList.toggle('weapon-range',weapons);
  astraWeaponDemo.controlsOpen=false;$('rangeToggle').setAttribute('aria-expanded','false');
  $('rangeControls').hidden=weapons;
  rangeShow(active);
  if(weapons)$('rangeToggle').focus({preventScroll:true});
};

// The same mine has a framed inventory pickup and a spiked live form.
const minePickupStatus=window.astraCollectibleStatus;
window.astraCollectibleStatus=id=>{
  minePickupStatus(id);
  $('mineState').hidden=id!==17&&id!==42;
  $('mineState').textContent='View armed mine';
};
const mineWeaponStatus=astraWeaponDemo.update.bind(astraWeaponDemo);
astraWeaponDemo.update=index=>{
  mineWeaponStatus(index);
  $('mineState').hidden=index!==19&&index!==20;
  $('mineState').textContent='View inventory pickup';
};
$('mineState').onclick=()=>{
  if(Module.pickupInspect===17||Module.pickupInspect===42){
    const index=Module.pickupInspect===42?19:20;
    Module.pickupInspect=-1;astraWeaponDemo.cycling=false;
    astraWeaponDemo.select(index);astraWeaponDemo.sync();
  }else if(Module.weaponInspect===19||Module.weaponInspect===20){
    Module.pickupInspect=Module.weaponInspect===19?42:17;Module.weaponInspect=-1;
    Module.previewRestart=true;
    $('weaponControls').hidden=true;
    window.astraDeck?.show(false);
  }
  astraPreview.show(true);
};
const minePreviewVisibility=astraPreview.show.bind(astraPreview);
astraPreview.show=active=>{
  $('mineState').hidden=!active||![17,42].includes(Module.pickupInspect)&&![19,20].includes(Module.weaponInspect);
  minePreviewVisibility(active);
};
