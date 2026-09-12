import {makeUnderwaterScenery} from './underwater-scenery.js';
import {mooredBoatOutline,mooredBoatPose} from './moored-boats.js';
import {barrierPiles} from './course-barriers.js';
import {rampWaterOffset,ringHeight} from './stunts.js';
import {makeCoastalScenery} from './coastal-scenery.js';
import {rockMaterial,barkMaterial} from './land-materials.js';
import {passageOpening,passageWalls} from './course-passages.js';
import * as T from './vendor/three.module.js';
import {makeTerrain,skyColors,shared} from './ocean.js';
import {wave,waterLevel} from './simulation.js';
import {obstaclePosition,floatingPose} from './course-environment.js';
import {routeDistance,insideRoute} from './courses.js';

// Each venue has its own architecture, vegetation, banks, lighting and palette.
export function makeCourseWorld(scene,course,ocean,{freeRide=false}={}){
 const authoredStunts=!!(course.stuntLayout&&(course.stunt||course.freeStunts));
 const root=new T.Group();scene.add(root);let seed=course.id.split('').reduce((s,c)=>s+c.charCodeAt(0),19);const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const materials=[],geometries=[],textures=[],buoys=[],animated=[],lights=[],weedMeshes=[],floatingBarriers=[],mooredMeshes=[];
 const mat=(color,roughness=.8,metalness=0,emissive=0)=>{const m=new T.MeshStandardMaterial({color,roughness,metalness,emissive,emissiveIntensity:emissive?1.1:0});materials.push(m);return m;};
 const sand=mat(0xdacba4),stone=mat(0x838d8c),wood=mat(0x92735a),steel=mat(0x516876,.4,.65),white=mat(0xe1e5d9),black=mat(0x1c313a),green=mat(0x557848),bark=mat(0x6b5546),warm=mat(0xe9c086,.4,.1,0xe3a35d);
 const naturalRock=rockMaterial();materials.push(naturalRock);
 const timber=barkMaterial();materials.push(timber);wood.map=timber.map;wood.normalMap=timber.normalMap;wood.normalScale=timber.normalScale;wood.roughnessMap=timber.roughnessMap;
 const theme=course.theme,night=theme==='city',cold=theme==='ice';
 const palette=cold?{sand:0x94bdc9,rock:0xadc8d5,grass:0xe5f0f0}:theme==='port'||night?{sand:0x737e81,rock:0x899091,grass:0x828b83}:theme==='beach'||theme==='resort'||theme==='island'?{sand:0xd8c99c,rock:0xa7a58a,grass:0x759358}:{};
 const scenery=makeCoastalScenery(root,course);
 const underwater=makeUnderwaterScenery(root,course);
 const renderGround=course.renderGround||course.ground;const terrain=makeTerrain(root,renderGround,palette);materials.push(terrain.material);geometries.push(terrain.geometry);
 const n=256,data=new Uint8Array(n*n*4);for(let z=0;z<n;z++)for(let x=0;x<n;x++){const h=renderGround((x/(n-1)-.5)*920,(z/(n-1)-.5)*920),v=Math.round(T.MathUtils.clamp((h+16)/100,0,1)*65535),i=(z*n+x)*4;data[i]=v>>8;data[i+1]=v&255;data[i+3]=255;}
 const heightMap=new T.DataTexture(data,n,n,T.RGBAFormat);heightMap.minFilter=heightMap.magFilter=T.LinearFilter;heightMap.needsUpdate=true;textures.push(heightMap);ocean.mat.uniforms.terrainMap.value=heightMap;ocean.mat.uniforms.customTerrain.value=1;
 ocean.mat.uniforms.reefs.value.forEach((r,i)=>{const p=course.rocks[i];r.set(p?.x??10000,p?.z??10000,p?.r??0);});
 skyColors.skyNight.value=night?1:0;skyColors.skyHorizon.value.setHex(course.sky[0]);skyColors.skyZenith.value.setHex(course.sky[1]);if(['coast','park','island'].includes(theme)){skyColors.skyHorizon.value.lerp(new T.Color(0xb2dce9),.32);skyColors.skyZenith.value.lerp(new T.Color(0x187fc0),.35);}skyColors.skySun.value.set(theme==='resort'?-.7:-.35,theme==='resort'?.13:night?.45:.32,-.9).normalize();ocean.mat.uniforms.sun.value.copy(skyColors.skySun.value);shared.storm.value=course.storm;
 function add(geo,m,x=0,y=0,z=0,parent=root){geometries.push(geo);const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 const box=(x,y,z,w,h,d,m=stone,parent=root)=>add(new T.BoxGeometry(w,h,d),m,x,y,z,parent);
 const cylinder=(x,y,z,r,h,m=stone,parent=root)=>add(new T.CylinderGeometry(r,r,h,12),m,x,y,z,parent);
 function rod(a,b,r,m=steel,parent=root){const av=new T.Vector3(...a),bv=new T.Vector3(...b),delta=bv.clone().sub(av),o=add(new T.CylinderGeometry(r,r,delta.length(),8),m,0,0,0,parent);o.position.copy(av.add(bv).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());return o;}
 function label(text,x,y,z,w=15,parent=root,color='#f3dab0'){const c=document.createElement('canvas');c.width=1024;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#183c4b';ctx.fillRect(0,0,1024,128);ctx.fillStyle=color;ctx.font='bold 49px sans-serif';ctx.textAlign='center';ctx.fillText(text,512,84);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;textures.push(tex);const m=new T.MeshBasicMaterial({map:tex,side:T.DoubleSide});materials.push(m);return add(new T.PlaneGeometry(w,w/8),m,x,y,z,parent);}
 function buoy(x,z,m,s=1){const g=new T.Group();g.userData.dynamic=true;g.position.set(x,0,z);root.add(g);add(new T.CylinderGeometry(.3*s,.6*s,.7*s,12),m,0,.35*s,0,g);add(new T.CylinderGeometry(.4*s,.5*s,.1*s,12),white,0,.44*s,0,g);cylinder(0,.98*s,0,.025,.7*s,black,g);buoys.push({g,x,z});}
 const red=mat(0xef503e,.35),yellow=mat(0xf5ce46,.35),pink=mat(0xd06aa9,.4);for(const g of freeRide||authoredStunts?[]:course.gates){if(g.side)buoy(g.bx,g.bz,g.side>0?red:yellow,1.25);if(!course.boundary)for(const side of [-1,1])buoy(g.x+g.tz*29*side,g.z-g.tx*29*side,pink,.6);}
 if(course.boundary&&!freeRide)for(let i=0;i<course.boundary.length;i++){const a=course.boundary[i],b=course.boundary[(i+1)%course.boundary.length],count=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/7);for(let j=0;j<count;j++){const x=a[0]+(b[0]-a[0])*j/count,z=a[1]+(b[1]-a[1])*j/count;if(course.ground(x,z)<-.2)buoy(x,z,pink,.6);}}
 // Visible weed leaves occupy the same elliptical patches used by hull drag.
 if(course.resistance?.length){const weedMaterial=mat(0x536b27,.93);weedMaterial.side=T.DoubleSide;const leafShape=new T.Shape();leafShape.moveTo(0,-.35);leafShape.quadraticCurveTo(.18,.03,0,.4);leafShape.quadraticCurveTo(-.15,.04,0,-.35);const leaf=new T.ShapeGeometry(leafShape,5),lp=leaf.attributes.position;for(let i=0;i<lp.count;i++)lp.setZ(i,.07*Math.sin((lp.getY(i)+.35)/.75*Math.PI));leaf.computeVertexNormals();geometries.push(leaf);const dummy=new T.Object3D();
  for(const patch of course.resistance){const mesh=new T.InstancedMesh(leaf,weedMaterial,180);mesh.userData.dynamic=true;mesh.position.set(patch.x,0,patch.z);root.add(mesh);weedMeshes.push({mesh,patch});
   for(let i=0;i<180;i++){const a=random()*Math.PI*2,r=Math.sqrt(random())*.94;dummy.position.set(Math.cos(a)*r*patch.rx,-.10+random()*.13,Math.sin(a)*r*patch.rz);dummy.rotation.set(.5+random()*.7,a,(random()-.5)*.8);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new T.Color().setHSL(.20+random()*.055,.38+random()*.2,.55+random()*.18));}mesh.instanceMatrix.needsUpdate=true;
  }
 }
 if(!freeRide&&!authoredStunts){
 const finish=course.gates[0],finishMin=finish.spanMin??-21,finishMax=finish.spanMax??21,finishCenter=(finishMin+finishMax)/2,finishWidth=finishMax-finishMin,gantry=new T.Group();gantry.position.set(finish.x-finish.tz*finishCenter,0,finish.z+finish.tx*finishCenter);gantry.rotation.y=Math.atan2(finish.tx,finish.tz);root.add(gantry);for(const x of[-finishWidth/2,finishWidth/2]){cylinder(x,3.4,0,.16,7,steel,gantry);box(x,.15,0,2,.5,3,yellow,gantry);}box(0,6.7,0,finishWidth,1.6,.4,black,gantry);label(course.name.toUpperCase()+' / FINISH',0,6.8,.25,34,gantry);label(course.name.toUpperCase()+' / FINISH',0,6.8,-.25,34,gantry).rotation.y=Math.PI;
 }
 function building(x,z,w,d,h,m=stone){const y=course.ground(x,z);if(y<1)return;box(x,y+h/2,z,w,h,d,m);box(x,y+h+.2,z,w+.6,.4,d+.6,steel);return y;}
 function rock(x,z,r=5,ice=false){let y=course.ground(x,z);for(let j=0;j<8;j++){const a=j*Math.PI/4;y=Math.min(y,course.ground(x+Math.cos(a)*r*.55,z+Math.sin(a)*r*.55));}const geo=ice?new T.IcosahedronGeometry(r,2):new T.SphereGeometry(r,24,16),p=geo.attributes.position;for(let i=0;i<p.count;i++){const scale=.93+.11*Math.sin(p.getX(i)*.17+p.getZ(i)*.23)+.045*Math.sin(p.getY(i)*.7+p.getX(i)*.4);p.setXYZ(i,p.getX(i)*scale,p.getY(i)*scale*.65,p.getZ(i)*scale);}geo.computeVertexNormals();return add(geo,ice?iceMat:naturalRock,x,y+r*.15,z);}
 const sheetMat=mat(0xc7e6ee,.18,.08);
 for(const p of course.iceSheets||[]){const shape=new T.Shape();p.outline.forEach(([x,z],i)=>i?shape.lineTo(x,z):shape.moveTo(x,z));shape.closePath();const mesh=add(new T.ExtrudeGeometry(shape,{depth:.7,bevelEnabled:false,steps:1}),sheetMat,0,p.height,0);mesh.rotation.x=Math.PI/2;}
 const iceMat=mat(0x9fd2e2,.22,.15);const glass=mat(night?0x263e59:0x608897,.2,.55);const cityLight=mat(0xa7dced,.4,.15,0x62a6cb);
 for(const obstacle of course.rocks){if(obstacle.type==='ice'){const o=rock(obstacle.x,obstacle.z,obstacle.r,true);animated.push({o,obstacle,offset:.3});}else if(obstacle.type==='post'){cylinder(obstacle.x,.65,obstacle.z,obstacle.r,3.8,wood);cylinder(obstacle.x,1.3,obstacle.z,obstacle.r+.04,.2,white);}else if(obstacle.type==='ball'){const o=new T.Group();o.position.set(obstacle.x,.1,obstacle.z);root.add(o);
  add(new T.SphereGeometry(obstacle.r*(obstacle.spiked ? .48 : 1),16,12),steel,0,0,0,o);
  if(obstacle.spiked)for(const direction of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
   const axis=new T.Vector3(...direction),r=obstacle.r;
   const spike=add(new T.ConeGeometry(r*.22,r*.65,8),steel,axis.x*r*.675,axis.y*r*.675,axis.z*r*.675,o);
   spike.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),axis);
  }
  o.userData.dynamic=true;animated.push({o,obstacle,offset:.1});}else if(obstacle.type==='timber'){const g=new T.Group();g.userData.dynamic=true;root.add(g);box(0,0,0,1.6,.22,.3,wood,g);box(-.35,.12,0,.12,.06,.32,wood,g);animated.push({o:g,obstacle,offset:.06});}else if(obstacle.type==='crate'){const g=new T.Group();g.userData.dynamic=true;root.add(g);box(0,0,0,1.5,1.5,1.5,wood,g);for(const side of [-1,1]){box(side*.64,0,0,.12,1.57,1.57,steel,g);box(0,0,side*.64,1.57,1.57,.12,steel,g);}animated.push({o:g,obstacle,offset:.38});}else buoy(obstacle.x,obstacle.z,yellow,1.0);}
 // Moored launches use the same footprint and wave pose as hull collision.
 for(const boat of course.mooredBoats||[]){const g=new T.Group();g.userData.dynamic=true;root.add(g);const mooring={g,boat,ropes:[]};mooredMeshes.push(mooring);
  const shape=new T.Shape();mooredBoatOutline(boat).forEach(([x,z],i)=>i?shape.lineTo(x,z):shape.moveTo(x,z));shape.closePath();
  const hull=add(new T.ExtrudeGeometry(shape,{depth:1.15,bevelEnabled:true,bevelThickness:.06,bevelSize:.06,bevelSegments:2}),white,0,.75,0,g);hull.rotation.x=Math.PI/2;
  const deck=add(new T.ShapeGeometry(shape),wood,0,.78,0,g);deck.rotation.x=Math.PI/2;deck.material.side=T.DoubleSide;
  box(0,1.05,.9,boat.width*.68,.45,3.3,black,g);box(0,1.15,1.8,boat.width*.61,.25,.7,white,g);
  box(0,1.65,-.7,boat.width*.73,.85,.09,glass,g).rotation.x=-.28;
  box(0,2.25,.8,boat.width*.9,.15,4.2,green,g);
  for(const side of [-1,1]){for(const z of [-1.1,2.7])rod([side*boat.width*.41,.8,z],[side*boat.width*.41,2.2,z],.035,steel,g);
   for(const z of [-2,1,3]){const f=add(new T.CapsuleGeometry(.18,.5,4,8),black,side*boat.width*.5,.45,z,g);f.rotation.z=.12*side;}
  }
  box(0,.15,boat.length*.46,.7,1.05,.5,black,g);
  const pier=course.crossbars[mooredMeshes.length-1],ropeMaterial=new T.LineBasicMaterial({color:0xb2a083});materials.push(ropeMaterial);
  for(const side of [-1,1]){const cleat=new T.Vector3(boat.width*.43,.83,side*2.8),anchor=new T.Vector3(pier.x-pier.length/2+.5,pier.top,pier.z+side*.9),geometry=new T.BufferGeometry().setFromPoints([cleat.clone(),cleat.clone(),anchor]);geometries.push(geometry);const rope=new T.Line(geometry,ropeMaterial);rope.userData.dynamic=true;root.add(rope);mooring.ropes.push({rope,cleat,anchor});box(cleat.x,cleat.y,cleat.z,.12,.08,.4,steel,g);}

  const edge=mooredBoatOutline(boat);for(let i=0;i<edge.length;i++){const a=edge[i],b=edge[(i+1)%edge.length];rod([a[0],.74,a[1]],[b[0],.74,b[1]],.055,black,g);}
 }
 // Floating stunt decks use the same water offset as hull contact.
 const parkDeck=authoredStunts?mat(0xb99562,.87):null,plankSeam=authoredStunts?mat(0x70563b,.95):null;
 const rampMeshes=[],deckMat=mat(0x24535a,.82),ringGlow=mat(0xffca57,.32,.2,0x684012),waterRingMat=mat(0x6de5cf,.34,.12,0x164e45);
 for(const ramp of course.ramps||[]){
  const g=new T.Group();g.userData.dynamic=true;g.position.set(ramp.x,0,ramp.z);g.rotation.y=Math.atan2(ramp.tx,ramp.tz);root.add(g);rampMeshes.push({g,ramp});
  const angle=-Math.atan2(ramp.height,ramp.length),length=Math.hypot(ramp.length,ramp.height),rampMaterial=parkDeck||deckMat;
  box(0,ramp.height/2+.08,0,ramp.width,.24,length,rampMaterial,g).rotation.x=angle;
  if(parkDeck)for(let z=-ramp.length/2+.5;z<ramp.length/2;z+=.55)box(0,.21+(z/ramp.length+.5)*ramp.height,z,ramp.width,.025,.025,plankSeam,g).rotation.x=angle;
  if(ramp.solidBack)box(0,ramp.height/2,ramp.length/2,ramp.width,ramp.height,.16,rampMaterial,g);
  for(const side of [-1,1]){
   const pontoon=add(new T.CylinderGeometry(.65,.65,ramp.length+1,16),black,side*(ramp.width/2-.45),-.2,0,g);pontoon.rotation.x=Math.PI/2;
   box(side*(ramp.width/2-.17),ramp.height/2+.23,0,.32,.08,length,yellow,g).rotation.x=angle;
   rod([side*ramp.width*.45,.15,-ramp.length/2],[side*ramp.width*.45,ramp.height+.08,ramp.length/2],.12,steel,g);
   cylinder(side*ramp.width*.45,ramp.height/2,ramp.length*.42,.13,ramp.height,steel,g);
   cylinder(side*(ramp.width/2+.5),ramp.height+1,ramp.length/2,.06,2.4,yellow,g);
   box(side*(ramp.width/2+.5),ramp.height+1.8,ramp.length/2,.6,.7,.12,ringGlow,g);
  }
  for(let k=0;k<5;k++){const z=-ramp.length*.37+k*ramp.length*.17,y=(z/ramp.length+.5)*ramp.height+.25;for(const side of [-1,1])box(side*.8,y,z,2.2,.035,.23,white,g).rotation.set(angle,side*.5,0);}
  const signWidth=Math.min(10,ramp.width*.83);if(ramp.id!==150&&!authoredStunts)label(ramp.name,ramp.width>18?ramp.width/2-signWidth/2:0,ramp.height+.9,ramp.length/2-.18,signWidth,g).rotation.y=Math.PI;
 }
 const authoredRingMaterial=authoredStunts?mat(0xffffff,.35):null;if(authoredRingMaterial)authoredRingMaterial.vertexColors=true;
 const ringMeshes=[];for(const [i,r] of (course.rings||[]).entries()){
  const ringGeometry=new T.TorusGeometry(r.radius,r.type==='air'?.21:.15,10,48);if(authoredRingMaterial){const colors=[],palette=[white.color,red.color];for(let j=0;j<=10;j++)for(let i=0;i<=48;i++){const color=palette[Math.floor((i%48)/6)%2];colors.push(color.r,color.g,color.b);}ringGeometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));}
  const ring=add(ringGeometry,authoredRingMaterial|| (r.type==='dive'?iceMat:r.type==='air'?ringGlow:waterRingMat),r.x,r.y,r.z);ring.rotation.y=Math.atan2(r.tx,r.tz);ring.userData.dynamic=true;
  add(new T.TorusGeometry(r.radius-.08,.035,5,48),white,0,0,.08,ring);ringMeshes.push({ring,index:i,definition:r});
 }
 for(const cp of course.checkpoints||[]){const g=new T.Group();g.position.set(cp.x,0,cp.z);g.rotation.y=Math.atan2(cp.tx,cp.tz);root.add(g);for(const side of [-1,1]){cylinder(side*cp.width,3.2,0,.15,6.4,steel,g);box(side*cp.width,.1,0,2,.5,3,white,g);}label(authoredStunts&&cp.section===3?'START / FINISH':'CHECKPOINT '+(cp.section+1),0,6.3,0,authoredStunts?18:30,g);label(authoredStunts&&cp.section===3?'START / FINISH':'CHECKPOINT '+(cp.section+1),0,6.3,-.05,authoredStunts?18:30,g).rotation.y=Math.PI;}
 // Small waterfront structures include railings, planks, lamps, mooring posts and ladders.
 function pier(x,z,angle=0,length=16){const y=Math.max(1,course.ground(x,z)),g=new T.Group();g.position.set(x,y,z);g.rotation.y=angle;root.add(g);box(0,0,0,5,.3,length,wood,g);for(let i=0;i<length;i+=1.1)box(0,.18,-length/2+i,5,.025,.05,black,g);for(const side of[-1,1])for(let i=-length/2;i<=length/2;i+=4){cylinder(side*2.2,-1.5,i,.18,4,wood,g);cylinder(side*2.2,.4,i,.10,1,white,g);}return g;}
 if(theme==='beach'||theme==='coast'||theme==='resort'||theme==='island'||theme==='park'){

  for(let i=0;i<20;i++){const a=random()*Math.PI*2,x=Math.sin(a)*185,z=Math.cos(a)*185;if(course.ground(x,z)>0)rock(x,z,3+random()*7);}
  if(theme==='coast'){const x=0,z=-30,y=course.ground(x,z);cylinder(x,y+12,z,4,24,white);for(let j=0;j<8;j++)cylinder(x+Math.sin(j*.785)*4.2,y+25,z+Math.cos(j*.785)*4.2,.12,3,steel);add(new T.ConeGeometry(5.5,3,16),steel,x,y+28,z);cylinder(x,y+24,z,4.7,.6,black);}
  if(theme==='resort'){for(let i=0;i<7;i++){const x=-30+i*14,z=170,y=building(x,z,11,12,5,white);if(y){add(new T.ConeGeometry(9,4,4),wood,x,y+7,z).rotation.y=Math.PI/4;box(x,y+2.8,z-6.1,6,2.5,.1,glass);}}for(let i=0;i<12;i++){const x=110+i%4*10,z=130+Math.floor(i/4)*11,y=course.ground(x,z);if(y>1){cylinder(x,y+2,z,.05,4,steel);add(new T.ConeGeometry(3.2,.7,12),i%2?white:yellow,x,y+4,z);box(x+1,y+.4,z+2,1,.25,3,wood);}}}
  if(theme==='island'){for(let i=0;i<6;i++){const a=i*1.04,x=Math.sin(a)*22,z=Math.cos(a)*24,y=building(x,z,8,7,3,wood);if(y)add(new T.ConeGeometry(6.5,3,5),sand,x,y+5,z);}if(course.ground(0,-10)>2)rock(0,-10,12);}
  if(theme==='park'&&!course.layoutRevision){for(let i=0;i<4;i++)pier(-100+i*16,105,0,15);label('PELICAN PARK / TRAINING WATER',-65,9,118,35);for(let i=0;i<10;i++){const x=-110+i*22,z=145,y=building(x,z,6,7,3,i%2?white:yellow);if(y)box(x,y+4,z,7,.3,8,steel);}}
 }
 if(theme==='lake'){

  // Reed clumps are instanced to keep the shoreline detail inexpensive.
  const reeds=new T.InstancedMesh(new T.CylinderGeometry(.035,.045,1.4,4),green,700),dummy=new T.Object3D();root.add(reeds);geometries.push(reeds.geometry);for(let i=0;i<700;i++){const g=course.gates[i%course.gates.length],side=i%2?1:-1,x=g.x+g.tz*side*(39+random()*5)+(random()-.5)*9,z=g.z-g.tx*side*(39+random()*5)+(random()-.5)*9;dummy.position.set(x,course.ground(x,z)+.6,z);dummy.rotation.z=(random()-.5)*.3;dummy.updateMatrix();reeds.setMatrixAt(i,dummy.matrix);}pier(-125,120,.6,20);building(-155,140,16,12,7,wood);
 }
 if(theme==='fortress'&&!course.fortWalls){
  const y=course.ground(0,0);box(0,y+3,0,85,6,68,stone);for(const x of [-42,42])for(const z of [-34,34]){cylinder(x,y+11,z,8,22,stone);cylinder(x,y+22,z,8.5,1,black);for(let i=0;i<10;i++){const a=i*Math.PI*.2;box(x+Math.sin(a)*7.3,y+23,z+Math.cos(a)*7.3,2,2,2,stone);}}for(let i=-38;i<=38;i+=5)for(const z of [-34,34])box(i,y+7,z,2.6,2,3,stone);building(0,0,30,22,19,stone);for(let i=0;i<25;i++){const a=i/25*Math.PI*2;rock(Math.sin(a)*165,Math.cos(a)*177,4+random()*6);}label('CITADEL SOUND',0,y+10,35,28);
 }
 if(course.fortWalls){
  const path=course.fortWalls;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],distance=Math.hypot(b[0]-a[0],b[1]-a[1]),steps=Math.ceil(distance/5);for(let j=0;j<steps;j++){const t=(j+.5)/steps,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t,y=course.ground(x,z);if(y<1.5)continue;const wall=box(x,y+2,z,2.8,4,distance/steps+.08,stone);wall.rotation.y=Math.atan2(b[0]-a[0],b[1]-a[1]);box(x,y+4.1,z,3.3,.3,3.3,white);}}
  building(-25,60,24,22,11,stone);building(15,75,20,30,7,stone);for(const [x,z] of [[-32,20],[-5,110]]){const y=course.ground(x,z);if(y>2){cylinder(x,y+7,z,4.5,14,stone);cylinder(x,y+14,z,5,.7,white);}}
  label('MARINE FORTRESS',-24,19,47,26);
 }
 function crane(x,z,angle){const y=course.ground(x,z);if(y<1)return;const g=new T.Group();g.position.set(x,y,z);g.rotation.y=angle;root.add(g);for(const side of[-1,1]){box(side*5,12,0,.7,24,.7,yellow,g);rod([side*5,0,0],[side*5,24,-5],.2,steel,g);}box(0,25,-11,13,1,35,yellow,g);box(0,23,1,6,4,5,white,g);rod([0,25,-24],[0,5,-24],.06,steel,g);box(0,4.8,-24,7,.4,2,black,g);}
 if(theme==='port'){
  const cargoMats=[mat(0xa6533d),mat(0x496e83),mat(0xe0b557),mat(0x557567)];for(let i=0;i<45;i++){const x=(i%9-4)*15,z=Math.floor(i/9)*10-20,y=course.ground(x,z);if(y<1||routeDistance(course,x,z)<42)continue;box(x,y+1.7,z,12,3.4,5,cargoMats[i%4]);for(let k=-5;k<6;k++)box(x+k,y+1.7,z-2.55,.08,3.1,.08,steel);if(i%3===0)box(x,y+5.1,z,12,3.4,5,cargoMats[(i+1)%4]);}for(let i=0;i<5;i++)crane(-155,80-i*40,Math.PI/2);for(let i=0;i<4;i++)building(165,-85+i*55,35,38,14,white);if(!course.shipOutline)label('PORT MERIDIAN / 07',165,18,75,40);for(let i=0;i<4;i++)pier(-150,110-i*45,Math.PI/2,18);
 }
 for(const outline of course.quayOutlines||[]){const shape=new T.Shape();outline.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:8,bevelEnabled:false});geo.rotateX(-Math.PI/2);add(geo,stone,0,-2,0);}
 if(course.dockOutline){
  for(const outline of [course.dockOutline,...course.closedAreas||[]]){const shape=new T.Shape();outline.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();
  const quay=new T.ExtrudeGeometry(shape,{depth:8,bevelEnabled:false});quay.rotateX(-Math.PI/2);add(quay,stone,0,-2,0);}
  for(const [mx,mz] of [[309,153],[315,223]])crane((mx-220)*.8,(mz-285)*.8,-Math.PI/2);
  for(let i=0;i<6;i++){const x=(292+i%2*17-220)*.8,z=(141+Math.floor(i/2)*22-285)*.8;box(x,8,z,11,4,6,i%2?steel:yellow);}
 }
 if(course.shipOutline){
  const hullMaterial=mat(0x343e41,.55,.35),deckMaterial=mat(0x616b43,.8,.1),outline=new T.Shape();
  course.shipOutline.forEach(([x,z],i)=>i?outline.lineTo(x,-z):outline.moveTo(x,-z));outline.closePath();
  const hull=new T.ExtrudeGeometry(outline,{depth:9,bevelEnabled:false});hull.rotateX(-Math.PI/2);add(hull,hullMaterial,0,-2,0);
  const deck=new T.ShapeGeometry(outline);deck.rotateX(-Math.PI/2);add(deck,deckMaterial,0,7.02,0);
  // Bridge at the stern, long deck pipework and tank fittings toward the bow.
  const cx=(126-220)*.8;box(cx,11,(155-285)*.8,25,8,28,white);box(cx,16,(157-285)*.8,28,3,17,black);
  for(const side of [-1,1]){rod([cx+side*10,8,-70],[cx+side*10,8,130],.4,steel);for(let z=-50;z<125;z+=23)cylinder(cx+side*7,8.2,z,2,2.2,steel);}
  for(let i=0;i<course.shipOutline.length;i++){const a=course.shipOutline[i],b=course.shipOutline[(i+1)%course.shipOutline.length];rod([a[0],8.2,a[1]],[b[0],8.2,b[1]],.12,white);}
  cylinder(cx,20,-98,1.5,10,black);label('PORT BLUE',cx,16,-85,23);
 }
 if(night){
  for(let i=0;i<90;i++){const a=i*2.3999,r=165+random()*115,x=Math.sin(a)*r,z=Math.cos(a)*r,w=12+random()*16,d=12+random()*16,h=20+random()*80,y=building(x,z,w,d,h,i%3?glass:stone);if(!y)continue;for(let floor=3;floor<h-2;floor+=5)for(let col=-w/2+2;col<w/2;col+=4){if(random()>.2){const glow=random()>.3?warm:cityLight;for(const side of [-1,1])box(x+col,y+floor,z+side*(d/2+.03),1.4,2.2,.05,glow);for(const side of [-1,1])box(x+side*(w/2+.03),y+floor,z+col*d/w,.05,2.2,1.4,glow);}}}
  for(let i=0;i<course.gates.length;i+=2){const p=course.gates[i],x=p.x+p.tz*42,z=p.z-p.tx*42,y=course.ground(x,z);cylinder(x,y+5,z,.12,10,steel);box(x,y+10,z,1.4,.2,1.4,cityLight);if(i%6===0){const l=new T.PointLight(0x99d8ff,45,35,2);l.position.set(x,y+8,z);root.add(l);lights.push(l);}}
  const p=course.gates[5],bridge=new T.Group();bridge.position.set(p.x,8,p.z);bridge.rotation.y=Math.atan2(p.tx,p.tz);root.add(bridge);box(0,0,0,100,1,9,steel,bridge);for(const x of[-40,40])box(x,-4,0,3,8,10,stone,bridge);for(let x=-45;x<46;x+=5)box(x,1.2,-4,.18,2,.18,cityLight,bridge);label(course.quayOutlines?'TWILIGHT CITY':'NEON REACH',0,2,4.6,33,bridge,'#9ceaff');
 }
 if(cold){for(let i=0;i<50;i++){const g=course.gates[i%course.gates.length],side=i%2?1:-1,x=g.x+g.tz*side*(52+random()*35),z=g.z-g.tx*side*(52+random()*35);const radius=9+random()*16;if(Array.from({length:12},(_,j)=>course.ground(x+Math.cos(j*Math.PI/6)*radius,z+Math.sin(j*Math.PI/6)*radius)).every(y=>y>1))rock(x,z,radius,true);}building(-170,125,25,16,8,white);label('ARCTIC RESEARCH / 64',-170,14,134,28);}
 // Navigable masonry/harbour passage; dimensions are shared with collision.
 const passage=course.passage;let gateMesh=null,gateSignal=null;
 if(passage?.continuous){
  const walls=passageWalls(passage),path=passage.structurePath;
  for(const edge of walls)for(let i=1;i<edge.length;i++){const a=edge[i-1],b=edge[i],g=new T.Group();g.position.set((a.x+b.x)/2,0,(a.z+b.z)/2);g.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);root.add(g);box(0,2.5,0,1.1,11,Math.hypot(b.x-a.x,b.z-a.z),steel,g);}
  const shape=new T.Shape(),outline=[...walls[0],...walls[1].slice().reverse()];outline.forEach((q,i)=>i?shape.lineTo(q.x,-q.z):shape.moveTo(q.x,-q.z));shape.closePath();
  const roof=new T.ExtrudeGeometry(shape,{depth:8-passage.clearance,bevelEnabled:false});roof.rotateX(-Math.PI/2);add(roof,steel,0,passage.clearance,0);
  const a=path[0],b=path[1],entrance=new T.Group();entrance.position.set(a.x,0,a.z);entrance.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);root.add(entrance);
  if(!passage.enabled){for(let x=-passage.width;x<=passage.width;x+=.65)box(x,3,0,.12,8,.2,black,entrance);}
  label(passage.enabled?'PORT BLUE / INNER CHANNEL':'INNER CHANNEL CLOSED',0,8.8,0,18,entrance).rotation.y=Math.PI;
 }
 if(passage&&!passage.continuous&&passage.kind!=='jump-dive'){const geometry=passage.structurePath||passage.path,a=geometry[0],b=geometry.at(-1),length=Math.hypot(b.x-a.x,b.z-a.z),g=new T.Group();g.position.set(a.x,0,a.z);g.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);root.add(g);const m=passage.kind==='gate'?stone:steel,w=passage.width;
  for(const side of [-1,1]){box(side*(w+.55),2.5,length*.57,1.1,11,length*.50,m,g);for(let z=length*.34;z<length*.81;z+=6){box(side*(w+.52),6.3,z,1.8,1.2,1.6,stone,g);}}
  box(0,(passage.clearance+8)/2,length*.57,w*2+2.2,8-passage.clearance,length*.50,m,g);
  gateMesh=new T.Group();gateMesh.userData.dynamic=true;gateMesh.position.set(0,-1,length*.36);g.add(gateMesh);
  for(let x=-w;x<=w;x+=.65)box(x,2.75,0,.10,5.5,.18,black,gateMesh);
  for(const y of [.4,2.5,4.9])box(0,y,0,w*2,.16,.22,steel,gateMesh);
  const signal=mat(0xc65a32,.4,.1,0x8e3018);gateSignal=signal;cylinder(-w-.65,passage.clearance+.7,length*.31,.25,.5,signal,g);
  label(passage.kind==='gate'?(passage.enabled?'SLUICE / OPENS LAP 2':'SLUICE CLOSED'):(passage.enabled?'SHORT CHANNEL / LOW ROOF':'SERVICE CHANNEL CLOSED'),0,7.2,length*.32-.08,w*1.8,g).rotation.y=Math.PI;
  label('MAIN CHANNEL →',-w-7,3,length*.29,10,g).rotation.y=Math.PI;for(const side of [-1,1])box(-w-7+side*3.8,-2,length*.29,.12,10,.12,steel,g);
 }
 // Render each stone arch as one continuous profile; contact interpolates the same sampled underside.
 for(const arch of new Set((course.crossbars||[]).filter(b=>b.kind==='stone-arch').map(b=>b.arch))){const parts=course.crossbars.filter(b=>b.kind==='stone-arch'&&b.arch===arch),first=parts[0],last=parts.at(-1),length=Math.hypot(last.x-first.x,last.z-first.z)+first.length,shape=new T.Shape();shape.moveTo(-length/2,first.top);if(arch==='dolphin')for(let i=0;i<parts.length;i++)shape.lineTo(-length/2+length*(i+.5)/parts.length,parts[i].top);shape.lineTo(length/2,last.top);shape.lineTo(length/2,-10);for(let i=parts.length-1;i>=0;i--)shape.lineTo(-length/2+length*(i+.5)/parts.length,parts[i].bottom);shape.lineTo(-length/2,-10);shape.closePath();const mesh=add(new T.ExtrudeGeometry(shape,{depth:first.depth,bevelEnabled:false,steps:1}),arch==='dolphin'?naturalRock:stone,(first.x+last.x)/2,0,(first.z+last.z)/2);mesh.rotation.y=Math.atan2(-first.tz,first.tx);mesh.geometry.translate(0,0,-first.depth/2);}
 for(const b of course.crossbars||[]){if(b.kind==='stone-arch')continue;if(b.outline){const shape=new T.Shape();b.outline.forEach(([x,z],i)=>i?shape.lineTo(x,z):shape.moveTo(x,z));shape.closePath();let parent=root;if(b.floating){parent=new T.Group();parent.userData.dynamic=true;root.add(parent);floatingBarriers.push(parent);}const platform=add(new T.ExtrudeGeometry(shape,{depth:b.top-b.bottom,bevelEnabled:false,steps:1}),b.material==='ship'?white:wood,0,b.top,0,parent);platform.rotation.x=Math.PI/2;if(b.kind==='ship'){const deck=add(new T.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:false,steps:1}),wood,0,b.top+.005,0,parent);deck.rotation.x=Math.PI/2;for(let i=0;i<b.outline.length;i++){const a=b.outline[i],c=b.outline[(i+1)%b.outline.length];rod([a[0],b.top-.12,a[1]],[c[0],b.top-.12,c[1]],.1,black,parent);}}continue;}for(const p of barrierPiles(b)){const floor=Math.max(p.bottom,course.ground(p.x,p.z)-.3);if(floor<p.top)cylinder(p.x,(floor+p.top)/2,p.z,p.radius,p.top-floor,wood);}const g=new T.Group();g.position.set(b.x,0,b.z);g.rotation.y=Math.atan2(b.tx,b.tz);root.add(g);if(b.floating){g.userData.dynamic=true;floatingBarriers.push(g);}box(0,(b.bottom+b.top)/2,0,b.depth,b.top-b.bottom,b.length,b.material==='wood'?wood:b.material==='white'?white:stone,g);
  if(b.kind==='cabin'){box(0,b.top-.65,-b.length/2-.02,b.depth*.75,.8,.05,glass,g);for(const side of [-1,1])box(side*(b.depth/2+.02),b.top-.65,0,.05,.8,b.length*.6,glass,g);box(0,b.top+.05,0,b.depth+.2,.1,b.length+.2,steel,g);}
  if(!b.floating&&b.kind!=='stone-arch')for(let z=-b.length/2+1;z<b.length/2;z+=2.5)box(-b.depth/2-.02,b.top-.12,z,.04,.16,1.2,yellow,g);
 }
 // Merge static scenery by material. Thousands of windows/leaves become a few draw calls.
 terrain.userData.dynamic=true;animated.forEach(a=>a.o.userData.dynamic=true);root.updateMatrixWorld(true);const batches=new Map(),remove=[];const pos=new T.Vector3(),normal=new T.Vector3(),normalMatrix=new T.Matrix3();
 root.traverse(o=>{if(!o.isMesh||o.isInstancedMesh)return;for(let p=o;p&&p!==root;p=p.parent)if(p.userData.dynamic)return;const geo=o.geometry,pa=geo.attributes.position,na=geo.attributes.normal,ua=geo.attributes.uv;if(!pa||!na)return;let batch=batches.get(o.material);if(!batch){batch={p:[],n:[],uv:[],indices:[]};batches.set(o.material,batch);}const offset=batch.p.length/3;normalMatrix.getNormalMatrix(o.matrixWorld);for(let i=0;i<pa.count;i++){pos.fromBufferAttribute(pa,i).applyMatrix4(o.matrixWorld);normal.fromBufferAttribute(na,i).applyMatrix3(normalMatrix).normalize();batch.p.push(pos.x,pos.y,pos.z);batch.n.push(normal.x,normal.y,normal.z);batch.uv.push(ua?ua.getX(i):0,ua?ua.getY(i):0);}if(geo.index)for(let i=0;i<geo.index.count;i++)batch.indices.push(geo.index.getX(i)+offset);else for(let i=0;i<pa.count;i++)batch.indices.push(i+offset);remove.push(o);});
 for(const o of remove)o.removeFromParent();for(const [m,b] of batches){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(b.p,3));geo.setAttribute('normal',new T.Float32BufferAttribute(b.n,3));geo.setAttribute('uv',new T.Float32BufferAttribute(b.uv,2));geo.setIndex(b.indices);add(geo,m);}
 return {root,update(time,storm,stunt=null,openedAt=Infinity,racers=[]){scenery.update(time,storm,ocean.quality);underwater.update(time,storm,ocean.quality,racers);for(const g of floatingBarriers)g.position.y=waterLevel.value;for(const {g,boat,ropes} of mooredMeshes){const p=mooredBoatPose(boat,time,storm);g.position.set(boat.x,p.y,boat.z);g.rotation.set(p.pitch,boat.heading||0,p.roll,'YXZ');g.updateMatrixWorld(true);for(const {rope,cleat,anchor} of ropes){const end=cleat.clone().applyMatrix4(g.matrixWorld),mid=end.clone().add(anchor).multiplyScalar(.5);mid.y-=.3;const a=rope.geometry.attributes.position;a.setXYZ(0,end.x,end.y,end.z);a.setXYZ(1,mid.x,mid.y,mid.z);a.setXYZ(2,anchor.x,anchor.y,anchor.z);a.needsUpdate=true;rope.geometry.computeBoundingSphere();}}for(const {mesh,patch} of weedMeshes)mesh.position.y=wave(patch.x,patch.z,time,storm)*.35;if(gateMesh){const opening=passageOpening(passage,time,openedAt);gateMesh.position.y=-1+opening*(passage.clearance+1.5);gateSignal.color.setHex(opening>.98?0x66b88b:0xc65a32);gateSignal.emissive.setHex(opening>.98?0x2d8052:0x8e3018);}for(const {g,ramp} of rampMeshes)g.position.y=rampWaterOffset(ramp,time,storm);for(const item of ringMeshes){item.ring.position.y=ringHeight(item.definition,course,time,storm);item.ring.visible=!stunt||stunt.ringStatus[item.index]!=='hit';}const surface=(x,z,t)=>wave(x,z,t,storm);for(const b of buoys){const pose=floatingPose(b.x,b.z,time,surface);b.g.position.y=pose.y;b.g.rotation.x=pose.pitch;b.g.rotation.z=pose.roll;}for(const a of animated){const p=obstaclePosition(a.obstacle,time),heading=time*.02+a.obstacle.x,pose=floatingPose(p.x,p.z,time,surface,a.obstacle.r,heading);a.o.position.set(p.x,pose.y+a.offset,p.z);a.o.rotation.set(pose.pitch,heading,pose.roll,'YXZ');}ocean.mat.uniforms.reefs.value.forEach((v,i)=>{const q=course.rocks[i];if(q){const p=obstaclePosition(q,time);v.set(p.x,p.z,q.r);}});},dispose(){underwater.dispose();scenery.dispose();scene.remove(root);for(const g of new Set(geometries))g.dispose();for(const m of new Set(materials))m.dispose();for(const t of textures)t.dispose();}};
}
