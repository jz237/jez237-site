// Shares the paused native inspection view with the collectible/explosion demos.
window.astraWeaponDemo={
  names:['Laser · level 1','Laser · level 4','Super laser · level 6','Vulcan cannon','Gauss cannon','Spreadfire cannon','Plasma cannon','Fusion cannon','Helix cannon','Phoenix cannon','Omega cannon','Concussion missile','Homing missile','Smart missile','Mega missile','Flash missile','Guided missile','Mercury missile','Earthshaker missile'],
  cycling:true,lastSwitch:0,
  select(index){Module.weaponInspect=(index+this.names.length)%this.names.length;this.lastSwitch=performance.now();$('weaponSelect').value=String(Module.weaponInspect);},
  update(index){
    $('weaponControls').hidden=false;$('previewTitle').textContent='PTMC / LIVE WEAPON RANGE';
    $('previewVariation').textContent=this.names[index];$('previewPhase').textContent='Enhanced firing effects · Select any weapon';
    $('previewTime').textContent=(index+1)+' / '+this.names.length;$('previewProgress').hidden=true;
    $('previewPrevious').hidden=false;$('previewAgain').textContent='Next weapon →';
    $('weaponSelect').value=String(index);
    if(!this.lastSwitch)this.lastSwitch=performance.now();
    if(this.cycling&&performance.now()-this.lastSwitch>5500)this.select(index+1);
  },
  open(){
    this.lastSwitch=performance.now();this.cycling=true;this.sync();
    if(window.Module&&flightActive){Module.pickupInspect=-1;this.select(0);releaseFlightMouse();Module.pyroPreviewCommand=1;}
    else {$('look').value='astra';launch(true,false,false,true,false,false,true);}
  },
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
