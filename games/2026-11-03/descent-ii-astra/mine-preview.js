// A paused tour of the loaded campaign's real architecture and machinery.
window.astraMinePreview={
  names:['Architecture & materials','Rotating fans','Hydraulic machinery','Live terminals','Cables & electrical faults','Doors & locking systems','Reactor assembly','Recharge lattice','Moving ship shadows','Brushed metal & surface wear','Fractured rock & minerals','Storage bay','Cooling chamber','Steam, dust & light','Clean edges in motion','Deep ventilation grilles','Light housings & spill','Service conduits','Raised frames & panel variants','Water, wet banks & cascades','Molten lava','Red service lighting','Blue service lighting','Cyan service lighting','Amber service lighting','Warm ventilation & moving fans','Strip-light reflections','Industrial wall construction','Sculpted rock & rounded joins','Fixture light shafts','Room-aware metal reflections','Natural tunnel contours','Continuous mineral surfaces','Lighting by room purpose','Working mine installations','Distinctive chambers','Environmental reactions','Contact shadows & crevices','Steel, stone & wet surfaces','Wear around working equipment','Fracture shelves & contours','Welds, seals & fasteners','Consistent construction scale','Turbine & furnace bay','Illuminated service cabinets','Sealed generator window','Connected coolant manifold','Ore extraction machinery','Sector landmark & maintenance',"Raw excavation district","Ochre clay workings","Pale limestone galleries","Dark fractured basalt","Partly lined construction","Reinforced steel galleries","Weathered service district","Finished ceramic sector"],
  descriptions:[
    'New high-resolution metal, rock, grilles, machinery and lamps throughout both campaigns. Pause and compare the same view with the original artwork.',
    'Spinning fan blades behind a fixed protective grille.',
    'Moving pistons, service pipes, joints and coolant conduits.',
    'Inset displays with changing readouts and scanning lights.',
    'Suspended cable bundles and intermittent electrical faults.',
    'Layered steel jambs, dark gaskets, rounded shoulders and deeper moving slab edges. Carriages, pistons and locking pins follow the original door cycle.',
    'Machined housings, pulsing energy cores and rotating containment rings.',
    'Animated charge cells, flowing pulses and electrical arcs in the original recharge field.',
    'A display ship hovers above a real mine wall. Watch its soft shadow change with its position and orientation.',
    'Brushed highlights, chipped coatings, grime and oily patches react differently to light. Pause and compare the new details.',
    'The original rock colors and formations gain fine mineral grain and relief. Rock stays only on original rock surfaces.',
    'Strapped cargo cassettes, recessed racks, registration plates and amber equipment lights.',
    'Ceramic coolant reservoirs, moving level gauges and linked service pipes give these rooms a distinct purpose.',
    'Localized vent steam, drifting illuminated dust and faint light shafts leave the central flight path clear.',
    'Mipmap filtering, anisotropic textures and distance-softened highlights keep fine detail stable while the camera drifts.',
    'Raised steel slats and pipes behind a recessed grille. A showroom sample is mounted here when this mine has no suitable vent.',
    'Solid protective housings surround the original lamps. Their color spills onto nearby metal inside the room; broken lamps stop contributing.',
    'Physical service pipes, flange joints and retaining collars. A showroom sample is mounted here when this mine has no conduit wall.',
    'Raised frame rails and new reinforced, painted-metal and machinery panel families give different walls their own character.',
    'Irregular foam, wet rock banks and partly submerged stones at natural water edges. Existing slopes gain downhill cascades; the original water route stays intact.',
    'Slow moving basalt crust, hot fissures, pressure blisters and pulsing amber light on nearby walls.',
    ...['Red','Blue','Cyan','Amber'].map(color=>color+' inset diffusers, protective metal ribs and stamped service plates. Colored light falls onto the varied wall panels in this mine room. If the mine lacks this palette, a sample is mounted on an existing safe service wall.'),
    'Slow turning fans behind protective grilles, with warm amber backlighting and a gentle machinery pulse.',
    'Long segmented light channels and colored highlights moving across nearby metal as the inspection camera drifts.',
    'Beveled steel ribs, layered plates, recessed joints and colored lenses. Actual chamfer normals catch moving light. Use Compare to inspect the underlying surfaces.',
    'Sculpted rock now follows folded and sloped walls, with connected contours, rounded lighting transitions, layered fractures and damp edges. The original layout and flight clearance are preserved.',
    'Local beams follow the real colored fixtures. Dust drifts through the light; the volume stays inside its mine room.',
    'Soft reflections sample the six surfaces and lamps in this room. These are cached room reflections, not mirrors of moving ships.',
    'Broader rock bulges, broken ledges and rounded joins follow the original passages. Compare the added contours with the base geometry.',
    'Rock grain is projected in world space across sloped faces. Broad mineral bands reduce repeated tiles, stretching and abrupt texture directions.',
    'Cool service lighting accompanies water and pumping equipment; amber light marks industrial work areas, with red around volcanic hazards and reactors. Original colored lights remain recognizable.',
    'These wall-mounted fans, coolant pumps, gauges, hydraulic rods and cables also appear in the playable mines. Moving parts are fitted to solid walls away from doors and openings.',
    'Inspect the water, volcanic and industrial spaces available in this mine. Their materials, lighting and equipment follow the existing level layout.',
    'Replay water splashes, metal sparks, rock dust or molten droplets on real mine surfaces. These visual reactions also respond to weapon impacts; nearby explosions shake loose small rock clouds.'
    ,'Soft contact shading anchors equipment and supports to the wall, with darker closed crevices. The shading is stored in the existing surface mesh.',
    'Inspect steel, dry rock, wet stone and coated panels. Roughness, mineral deposits and highlights use the existing high-resolution materials.',
    'Rust follows service-line outlets, soot rises above ventilated housings, and damp mineral deposits follow actual water edges.',
    'Asymmetric rock shelves and broader fracture shoulders break up flat faces while keeping the same mesh budget and connected boundaries.',
    'Close up on welded mounting plates, recessed bolt sockets, rubber seals and polished hydraulic rods. These are the same assemblies installed in the mines.',
    'Grille bars, pipe runs, lenses and small fittings keep consistent physical dimensions on differently sized mine walls.',
    'A moving turbine and glowing furnace sit behind protective grilles. Machined rims, cooling pipes and a thermal diagnostic display are the same detailed assembly used during flight.',
    'High-resolution diagnostic glass, equipment drawers, status indicators and clamped cable looms give this wall a working service-bay role.',
    'Look through reflective protective glass at coolant generators and an articulated maintenance robot. The sealed assembly has real layered geometry and parallax; it does not add a navigable room.',
    'Connected coolant pipes, flange joints and turning valve wheels share a live control display. A small pressure outlet occasionally releases steam.',
    'A motor housing drives the rotating helical drill above a moving ore conveyor. Carrier slats and ore travel together, with a detailed extraction warning plate.',
    'A large enamel sector plaque, caution markings and a partly open service cabinet form a recognizable landmark. The cabinet exposes its wiring and retaining hardware.'
,
    "Connected stretches of exposed umber rock have continuous mineral surfaces and restrained structural equipment. The original passages and flight clearance remain intact.",
    "Warm ochre clay, compacted earth, embedded gravel and excavated sediment cover whole groups of connected rooms.",
    "Pale limestone strata, thin flaking layers and mineral seams give these connected passages a distinctly lighter geological character.",
    "Dark blue-grey fractured basalt and slate replace the single brown rock appearance across this district.",
    "Partially installed steel lining, exposed support ribs and unfinished rock occupy the same tunnel. Construction carries across neighboring rooms.",
    "Ribbed alloy lining and reinforced structural frames cover the walls, ceiling and floor of a connected industrial section.",
    "Weathered metal plates and older service finishes identify this connected part of the mine.",
    "Pale ceramic armor and clean reinforced panels mark a more completely built section, while the original lamps, doors and functional signs stay recognizable."
  ],
  active:false,paused:false,touring:true,clock:0,last:0,mask:2147483647,high:33554431,fresh:false,
  has(index){return index<32?!!(this.mask&(1<<index)):!!(this.high&(1<<(index-32)));},
  tick(){const now=performance.now();if(this.last&&!this.paused)this.clock+=Math.min(.1,(now-this.last)/1000);this.last=now;return this.clock;},
  select(index){if(!this.has(index))return;Module.mineInspect=index;this.clock=0;Module.mineReactionCommand=(Module.mineReactionCommand||0)+1;this.last=performance.now();$('mineScene').value=String(index);this.sync();},
  next(direction){let i=Module.mineInspect;for(let n=0;n<this.names.length;n++){i=(i+direction+this.names.length)%this.names.length;if(this.has(i)){this.select(i);break;}}},
  pause(){this.paused=!this.paused;this.last=performance.now();this.sync();},
  sync(){
    $('minePause').textContent=this.paused?'Play':'Pause';$('minePause').setAttribute('aria-pressed',String(this.paused));
    $('mineTour').checked=this.touring;
    $('mineReactionControls').hidden=window.Module?.mineInspect!==36;
    $('mineChamberControls').hidden=window.Module?.mineInspect!==35;
    $('mineMaterialControls').hidden=window.Module?.mineInspect!==38;
    $('mineCompare').textContent=(window.Module?.mineInspect>=27?(Module.mineRefinement===false?'Base surfaces':'New details'):(window.Module?.mineRefinement===false?'Original surfaces':'Remastered surfaces'));
    $('mineCompare').setAttribute('aria-pressed',String(window.Module?.mineRefinement!==false));
  },
  details(open){$('mineDetails').hidden=!open;$('mineControls').setAttribute('aria-expanded',String(open));},
  open(){
    this.paused=false;this.touring=true;this.clock=0;this.last=0;this.mask=2147483647;this.high=33554431;this.fresh=true;$('mineZoom').value='1';this.sync();
    if(window.Module&&flightActive&&Module.astra){
      Module.mineRefinement=true;Module.mineInspect=0;Module.mineInspectZoom=1;Module.pickupInspect=Module.weaponInspect=-1;
      releaseFlightMouse();Module._astra_reset_flight_input?.();Module.pyroPreviewCommand=1;
    }else{$('look').value='astra';launch(true,false,false,true,false,false,false,true);}
  },
  show(active){
    this.active=active;document.body.classList.toggle('mine-preview',active);$('minePanel').hidden=!active;this.details(false);
    if(active){this.last=0;window.astraDeck?.show(false);$('minePause').focus({preventScroll:true});}
  },
  update(index,mask,high,level,room,clock){
    this.mask=mask;this.high=high;
    if(!this.has(Module.mineInspect))Module.mineInspect=index;
    const uiKey=[index,mask,high,level,Module.campaign].join('|');
    if(this.uiKey!==uiKey){
    [...$('mineScene').options].forEach((o,i)=>o.disabled=!this.has(i));
    $('mineScene').value=String(index);
    $('mineCaption').textContent=this.names[index];
    $('mineLocation').textContent=(Module.campaign==='d2'?'Counterstrike':'Vertigo')+' · '+(level<0?'Secret mine '+(-level):'Mine '+level);
    $('mineDescription').textContent=this.descriptions[index];
      [...$('mineMaterial').options].forEach((o,i)=>o.disabled=!(Module.mineMaterialMask&(1<<i)));
      [...$('mineChamber').options].forEach((o,i)=>o.disabled=!this.has([19,20,0][i]));
      [...$('mineReactionKind').options].forEach((o,i)=>o.disabled=!this.has([19,9,32,20][i]));
      for(const [id,key] of [['mineChamber','mineChamber'],['mineReactionKind','mineReactionKind'],['mineMaterial','mineMaterial']]){const el=$(id);if(el.selectedOptions[0]?.disabled){el.value=[...el.options].find(o=>!o.disabled)?.value||'0';Module[key]=Number(el.value);}}
      this.sync();this.uiKey=uiKey;
    }
    this.state={index,mask,high,level,room,clock,paused:this.paused};
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
$('mineMaterial').onchange=()=>{Module.mineMaterial=Number($('mineMaterial').value);mine.clock=0;};
$('mineChamber').onchange=()=>{Module.mineChamber=Number($('mineChamber').value);mine.clock=0;};
$('mineReactionKind').onchange=()=>{Module.mineReactionKind=Number($('mineReactionKind').value);$('mineReaction').click();};
$('mineReaction').onclick=()=>{Module.mineReactionCommand=(Module.mineReactionCommand||0)+1;mine.touring=false;mine.paused=false;mine.clock=0;mine.last=performance.now();mine.sync();};
const previousShow=astraPreview.show.bind(astraPreview);
astraPreview.show=active=>{previousShow(active);mine.show(active&&Module.mineInspect>=0);if(!active)Module.mineInspect=-1;};
const previousExplosion=astraPreview.open.bind(astraPreview);
astraPreview.open=()=>{Module.mineInspect=-1;mine.show(false);previousExplosion();};
const previousWeapon=astraWeaponDemo.open.bind(astraWeaponDemo);
astraWeaponDemo.open=()=>{if(window.Module)Module.mineInspect=-1;mine.show(false);previousWeapon();};

if(location.hash==='#mines')requestAnimationFrame(()=>document.querySelector('[data-tab=showroom]')?.click());
