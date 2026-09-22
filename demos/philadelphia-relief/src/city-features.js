import { BRIDGE_DEMOS, UNDERGROUND_BOUNDS, UNDERGROUND_ROUTES,
  openingPose, openingCycle, cutawayShader } from './city-features-data.js?v=philly-2026092205';

// Loaded on demand. Uses the existing renderer; no feeds, timers or animation loop.
export function createCityFeatures(THREE, { scene, sky, projection, sampleElevation,
  store, motion, stopOtherModes, invalidate }) {
  const $ = id => document.getElementById(id);
  const panel = $('cityFeaturePanel'), controls = $('cityFeatureControls');
  const group = new THREE.Group(); group.name = 'City discovery models'; scene.add(group);
  const labels = document.createElement('div'); labels.className = 'city-feature-labels';
  document.body.append(labels);
  const inverse = { value: new THREE.Matrix4() }, bounds = { value: new THREE.Vector4() };
  const originals = new Map(), assets = new Set(), markers = [];
  const point = new THREE.Vector3(), dummy = new THREE.Object3D();
  let mode = null, saved = null, cycle = null, amount = 0, moving = [], spec, slider, play;
  let scanAt = 0, labelKey = '', currentBridge = 'tacony', disposed = false;
  const el = (tag, text) => { const n = document.createElement(tag); n.textContent = text; return n; };
  function control(text, action) {
    const b = el('button', text); b.type = 'button'; b.onclick = action; controls.append(b); return b;
  }
  function source(url, text) {
    const a = el('a', text); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    controls.append(a);
  }
  function own(asset) { assets.add(asset); return asset; }
  function material(color) { return own(new THREE.MeshBasicMaterial({ color, vertexColors: true })); }
  function boxGeometry() {
    const g = own(new THREE.BoxGeometry(1, 1, 1)), colors = [];
    for (let i = 0; i < g.attributes.normal.count; i++) {
      const n = g.attributes.normal, light = .68 + .22 * Math.max(0, n.getY(i))
        + .1 * Math.max(0, n.getZ(i));
      colors.push(light, light, light);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); return g;
  }
  function batch(parent, boxes, geometry, mat) {
    if (!boxes.length) return;
    const mesh = new THREE.InstancedMesh(geometry, mat, boxes.length);
    boxes.forEach((b, i) => {
      dummy.position.set(...b.p); dummy.scale.set(...b.s); dummy.rotation.set(0, 0, b.r || 0);
      dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true; parent.add(mesh);
  }
  function beam(list, a, b, width = 1.4) {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    list.push({ p: [(a[0]+b[0])/2, (a[1]+b[1])/2, a[2]],
      s: [Math.hypot(dx,dy),width,width], r: Math.atan2(dy,dx) });
  }
  function clearModels() {
    group.traverse(node => { if (node.isInstancedMesh) node.dispose(); });
    for (const child of [...group.children]) group.remove(child);
    for (const asset of assets) asset.dispose(); assets.clear();
    markers.length = 0; labels.replaceChildren(); labels.hidden=false;
    moving = []; labelKey = ''; group.visible=true;
  }
  function clearClip() {
    for (const [mat, old] of originals) {
      mat.onBeforeCompile = old.before; mat.customProgramCacheKey = old.cache; mat.needsUpdate = true;
    }
    originals.clear();
  }
  function scan() {
    scene.traverse(node => {
      let parent = node;
      while (parent) { if (parent === group) return; parent = parent.parent; }
      if (!node.material || node === sky) return;
      if (mode === 'bridge' && !/^(structures-bridge|roads-|neighborhood-roads|mapped-neighborhood)/
        .test(node.name)) return;
      for (const mat of [node.material].flat()) {
        if (originals.has(mat)) continue;
        const before = mat.onBeforeCompile, cache = mat.customProgramCacheKey;
        originals.set(mat, { before, cache });
        mat.onBeforeCompile = function(shader, renderer) {
          before.call(this, shader, renderer);
          shader.uniforms.cityInverseVP = inverse; shader.uniforms.cityBounds = bounds;
          shader.vertexShader = cutawayShader(shader.vertexShader, true);
          shader.fragmentShader = cutawayShader(shader.fragmentShader, false);
        };
        mat.customProgramCacheKey = function() { return cache.call(this) + ':city-cutaway'; };
        mat.needsUpdate = true;
      }
    });
    scanAt = performance.now();
  }
  function clip(b) {
    bounds.value.set(projection.lonToX(b.west), projection.lonToX(b.east),
      projection.latToZ(b.north), projection.latToZ(b.south)); scan();
  }
  function applyOpening(value) {
    amount = openingPose(spec.type, value, spec.rise).fraction;
    const pose = openingPose(spec.type, amount, spec.rise);
    if (spec.type === 'lift') moving[0].position.y = spec.deck + pose.lift;
    else moving.forEach((leaf,i) => { leaf.rotation.z = i ? -pose.angle : pose.angle; });
    if (slider) slider.value = String(Math.round(amount * 100));
    $('cityFeatureStatus').textContent = `Demonstration · ${Math.round(amount*100)}% open`
      + (cycle !== null ? ' · one opening cycle' : ' · paused');
    invalidate();
  }
  function makeBridge(id) {
    currentBridge = id; spec = BRIDGE_DEMOS[id]; cycle = null;
    clearClip(); clearModels(); controls.replaceChildren();
    $('cityFeatureTitle').textContent = `${spec.name} · working model`;
    $('cityFeatureNote').textContent = spec.note
      + ' Demonstration only; this does not show the bridge’s live position. OSM deck alignment.';
    const select = el('select',''); select.setAttribute('aria-label','Choose a working bridge');
    for (const [key,b] of Object.entries(BRIDGE_DEMOS)) {
      const o = el('option',b.name); o.value = key; select.append(o);
    }
    select.value=id; select.onchange=()=>makeBridge(select.value); controls.append(select);
    const geo=boxGeometry(), steel=material('#92b9a9'), road=material('#515d65');
    const masonry=material('#bcb09a'), paint=material('#e6c980');
    const [a,b]=spec.ends, x1=projection.lonToX(a[0]), z1=projection.latToZ(a[1]);
    const x2=projection.lonToX(b[0]), z2=projection.latToZ(b[1]);
    const length=Math.hypot(x2-x1,z2-z1), half=spec.span/2, width=spec.width;
    const root=new THREE.Group(); root.position.set((x1+x2)/2,0,(z1+z2)/2);
    root.rotation.y=-Math.atan2(z2-z1,x2-x1); group.add(root);
    const fixed=[], piers=[], rail=[], stripes=[];
    for (const sign of [-1,1]) {
      fixed.push({p:[sign*(length/2+half)/2,spec.deck-1.5,0],s:[length/2-half,3,width]});
      for(let x=half; x<length/2; x+=70) {
        piers.push({p:[sign*x,(spec.deck-3)/2,0],s:[5,spec.deck-3,width+2]});
      }
      for (const side of [-1,1]) beam(rail,[sign*half,spec.deck+2,side*width/2],
        [sign*length/2,spec.deck+2,side*width/2]);
    }
    const leaf = (from,to,pivot=0) => {
      const part=new THREE.Group(); part.position.set(pivot,spec.deck,0); root.add(part);
      const beams=[], marks=[], decks=[{p:[(from+to)/2,-1.5,0],s:[to-from,3,width]}];
      for (const side of [-1,1]) {
        beam(beams,[from,2,side*width/2],[to,2,side*width/2],1.2);
        beam(beams,[from,9,side*width/2],[to,9,side*width/2],1.3);
        for(let x=from; x<to-.1; x+=10) {
          const end=Math.min(to,x+10);
          beam(beams,[x,2,side*width/2],[end,9,side*width/2],1);
          beam(beams,[x,9,side*width/2],[end,2,side*width/2],1);
        }
      }
      for(let x=from+3;x<to-2;x+=9) marks.push({p:[x,.05,0],s:[4,.12,.35]});
      batch(part,decks,geo,road); batch(part,beams,geo,steel); batch(part,marks,geo,paint);
      moving.push(part);
    };
    if(spec.type==='bascule') {
      leaf(0,half,-half); leaf(-half,0,half);
      // A tied arch beside the movable span conveys the bridge's distinct construction.
      const archStart=-half-175, archEnd=-half-10;
      for(const side of [-1,1]) for(let i=0;i<20;i++) {
        const x=archStart+(archEnd-archStart)*i/20;
        const nx=archStart+(archEnd-archStart)*(i+1)/20;
        const y=spec.deck+32*Math.sin(Math.PI*i/20);
        const ny=spec.deck+32*Math.sin(Math.PI*(i+1)/20);
        beam(rail,[x,y,side*width/2],[nx,ny,side*width/2],2);
        if(i%2===0) beam(rail,[x,spec.deck,side*width/2],[x,y,side*width/2],.8);
      }
    } else {
      leaf(-half,half);
      for(const x of [-half,half]) {
        for(const side of [-1,1]) {
          piers.push({p:[x,5,side*(width/2+3)],s:[8,10,7]});
          rail.push({p:[x,33,side*(width/2+3)],s:[3,56,3]});
          for(let y=8;y<58;y+=10) beam(rail,[x-2,y,side*(width/2+3)],
            [x+2,y+8,side*(width/2+3)],1);
        }
        rail.push({p:[x,60,0],s:[4,3,width+10]});
      }
    }
    batch(root,fixed,geo,road); batch(root,piers,geo,masonry); batch(root,rail,geo,steel);
    batch(root,stripes,geo,paint);
    clip({west:Math.min(a[0],b[0])-.0007,east:Math.max(a[0],b[0])+.0007,
      south:Math.min(a[1],b[1])-.0007,north:Math.max(a[1],b[1])+.0007});
    const label=el('label','Opening'); slider=el('input',''); slider.type='range';
    slider.min='0';slider.max='100';slider.value='0';
    slider.setAttribute('aria-label','Bridge opening');
    slider.oninput=()=>{cycle=null;play.textContent='Play one opening';applyOpening(+slider.value/100);};
    label.append(slider);controls.append(label);
    play=control('Play one opening',()=>{
      cycle=cycle===null?0:null;
      play.textContent=cycle===null?'Play one opening':'Pause opening';invalidate();
    });
    control('Close bridge',()=>{cycle=null;play.textContent='Play one opening';applyOpening(0);});
    source(spec.source,'Bridge construction source ↗'); applyOpening(0);
    motion.flyTo({lon:(a[0]+b[0])/2,lat:(a[1]+b[1])/2,camDist:globalThis.innerWidth<700?1800:1100,camPitch:50,
      camBearing:spec.type==='lift'?105:35},{label:spec.name});
  }
  function stationLabel(name,lon,lat,y) {
    const n=el('span',name);labels.append(n);
    markers.push({node:n,x:projection.lonToX(lon),z:projection.latToZ(lat),y});
  }
  function makeUnderground() {
    $('cityFeatureTitle').textContent='Beneath Philadelphia';
    $('cityFeatureNote').textContent='Selected underground corridors, not a complete network. '
      + 'Routes are generalized; depth, tunnel width and rock layers are schematic, not measured. '
      + 'Dock Creek shows a historic course, not a mapped present-day sewer.';
    const b=UNDERGROUND_BOUNDS, x0=projection.lonToX(b.west),x1=projection.lonToX(b.east);
    const z0=projection.latToZ(b.north),z1=projection.latToZ(b.south),floorY=-200;
    const floor=new THREE.Mesh(own(new THREE.PlaneGeometry(x1-x0,z1-z0)),
      own(new THREE.MeshBasicMaterial({color:'#16232c',side:THREE.DoubleSide})));
    floor.rotation.x=-Math.PI/2;floor.position.set((x0+x1)/2,floorY,(z0+z1)/2);group.add(floor);
    const corners=[[b.west,b.north],[b.east,b.north],[b.east,b.south],[b.west,b.south]];
    const verts=[];
    for(let side=0;side<4;side++) for(let i=0;i<32;i++) {
      const a=corners[side],c=corners[(side+1)%4];
      const pointAt=t=>{const lon=a[0]+(c[0]-a[0])*t,lat=a[1]+(c[1]-a[1])*t;
        return [projection.lonToX(lon),sampleElevation(lon,lat),projection.latToZ(lat)];};
      const p=pointAt(i/32),q=pointAt((i+1)/32),pb=[p[0],floorY,p[2]],qb=[q[0],floorY,q[2]];
      verts.push(...p,...pb,...q,...q,...pb,...qb);
    }
    const walls=own(new THREE.BufferGeometry());
    walls.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
    group.add(new THREE.Mesh(walls,own(new THREE.ShaderMaterial({side:THREE.DoubleSide,
      vertexShader:`varying float depth;
        void main(){depth=position.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader:`varying float depth;
        void main(){float stripe=.06*sin(depth*.14)+.02*sin(depth*.9);
          gl_FragColor=vec4(vec3(.36,.27,.19)+stripe,1.);}`,
    }))));
    for(const route of UNDERGROUND_ROUTES) {
      const routeGroup=new THREE.Group();group.add(routeGroup);
      const points=route.path.map(([lon,lat])=>new THREE.Vector3(
        projection.lonToX(lon),route.level,projection.latToZ(lat)));
      const curve=new THREE.CurvePath();
      for(let i=1;i<points.length;i++)curve.add(new THREE.LineCurve3(points[i-1],points[i]));
      const tube=own(new THREE.TubeGeometry(curve,Math.max(24,points.length*8),10,6,false));
      const mat=own(new THREE.MeshBasicMaterial({color:route.color}));
      routeGroup.add(new THREE.Mesh(tube,mat));
      const spheres=own(new THREE.SphereGeometry(23,10,6));
      for(const [name,lon,lat] of route.stations) {
        const station=new THREE.Mesh(spheres,mat);station.position.set(
          projection.lonToX(lon),route.level,projection.latToZ(lat));routeGroup.add(station);
        stationLabel(name,lon,lat,route.level+28);
      }
      const label=el('label',''),check=el('input','');check.type='checkbox';check.checked=true;
      const routeMarkers=markers.slice(-route.stations.length);
      check.onchange=()=>{routeGroup.visible=check.checked;routeMarkers.forEach(m=>{
        m.disabled=!check.checked;m.node.hidden=m.disabled;});labelKey='';invalidate();};
      label.style.setProperty('--route-color',route.color);label.append(check,el('span',route.name));
      controls.append(label);source(route.source,'Source map / history ↗');
    }
    control('Frame the cutaway',frameUnderground);
    let surface=false;
    const compare=control('Show city surface',()=>{
      surface=!surface;group.visible=!surface;labels.hidden=surface;
      if(surface)bounds.value.set(0,0,0,0);else clip(b);
      compare.textContent=surface?'Reveal underground again':'Show city surface';
      compare.setAttribute('aria-pressed',String(surface));invalidate();
    });
    compare.setAttribute('aria-pressed','false');
    $('cityFeatureStatus').textContent='Generalized corridors · schematic depths';
    clip(b);frameUnderground();
  }
  function frameUnderground() {
    motion.flyTo({lon:-75.1655,lat:39.9535,camDist:globalThis.innerWidth<700?10600:5700,
      camPitch:57,camBearing:8},
      {label:'Beneath Philadelphia'});
  }
  function leave(restore=true) {
    const previous=saved;saved=null;mode=null;cycle=null;
    clearClip();clearModels();panel.hidden=true;$('cityFeatureBadge').hidden=true;
    panel.dispatchEvent(new Event('map-window-dismiss'));
    if(previous&&restore)store.set(previous,{source:'city-feature'});
    invalidate();
  }
  function open(kind) {
    leave();stopOtherModes();motion.stop();
    const s=store.get();saved={photoMode:s.photoMode,era:s.era,compareMode:s.compareMode,
      exaggeration:s.exaggeration,structureHeight:s.structureHeight,diorama:s.diorama,
      layers:{terrain:s.layers.terrain,structures:s.layers.structures}};
    mode=kind;panel.hidden=false;controls.replaceChildren();
    $('mapControls').open=false;
    if (!document.body.classList.contains('notes-collapsed')) {
      document.querySelector('.notes-toggle')?.click();
    }
    store.set({photoMode:'relief',era:'present',compareMode:'off',exaggeration:1,structureHeight:1,
      diorama:0,layers:{terrain:true,structures:true}},{source:'city-feature'});
    const badge=$('cityFeatureBadge');badge.hidden=false;
    badge.textContent=kind==='bridge'?'BRIDGE DEMONSTRATION · NOT LIVE':'UNDERGROUND · SCHEMATIC DEPTH';
    if(kind==='bridge')makeBridge(currentBridge);else makeUnderground();
    invalidate();
  }
  const key=e=>{if(e.key==='Escape'&&mode&&!e.target.matches('input,select,textarea'))leave();};
  document.addEventListener('keydown',key);
  $('cityFeatureExit').onclick=()=>leave();
  const unsubscribe=store.subscribe((s,changed)=>{
    if(!mode||s.lastChangeSource==='city-feature')return;
    if(changed.has('photoMode')||changed.has('era')||changed.has('compareMode')
      ||changed.has('diorama')||changed.has('exaggeration')||changed.has('structureHeight'))leave(false);
  });
  return {open,close:leave,refresh:()=>{if(mode)scan();},get active(){return !!mode;},
    get animating(){return cycle!==null;},
    stats:()=>({mode,bridge:mode==='bridge'?currentBridge:null,opening:amount,animating:cycle!==null,
      resources:assets.size,clippedMaterials:originals.size}),
    update(camera,dt,width,height) {
      if(!mode||disposed)return;
      camera.updateMatrixWorld();
      inverse.value.multiplyMatrices(camera.matrixWorld,camera.projectionMatrixInverse);
      if(cycle!==null) {
        cycle+=dt;applyOpening(openingCycle(cycle));
        if(cycle>=17){cycle=null;play.textContent='Play one opening';applyOpening(0);}
      }
      if(performance.now()-scanAt>1000)scan();
      const next=width+':'+height+':'+camera.matrixWorld.elements.join(',');
      if(next!==labelKey) {
        labelKey=next;const placed=[];
        for(const m of markers) {
          point.set(m.x,m.y,m.z).project(camera);
          const x=(point.x*.5+.5)*width,y=(-point.y*.5+.5)*height;
          m.node.hidden=m.disabled||point.z>1||point.z< -1||x<12||x>width-12||y<90||y>height-80;
          let top=y-20;const labelWidth=Math.min(210,m.node.textContent.length*6+12);
          for(let attempt=0;attempt<3;attempt++) {
            const overlaps=placed.some(r=>Math.abs(x-r.x)<(labelWidth+r.w)/2+4
              &&Math.abs(top-r.y)<22);
            if(!overlaps)break;top-=22;
          }
          if(!m.node.hidden)placed.push({x,y:top,w:labelWidth});
          m.node.style.transform=`translate(${x}px,${top}px) translateX(-50%)`;
        }
      }
    },
    dispose(){disposed=true;leave(false);unsubscribe();document.removeEventListener('keydown',key);
      scene.remove(group);labels.remove();$('cityFeatureExit').onclick=null;},
  };
}
