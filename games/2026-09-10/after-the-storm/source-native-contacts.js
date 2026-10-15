import {volumeContact} from './clipped-volumes.js';
import {collideSourceFixedSpheres} from './source-boundary-spheres.js';

// Source point responses for an already selected course. This module never
// calls a rigid-craft constrain function, infers floating-object motion, fits
// the hull, sweeps the previous position, or substitutes a visual terrain map.
// The adapter owns phase order: shore -> floor -> boxes -> optional dynamicPlanes
// -> racingBuoys -> fixedSpheres -> primarySpheres. The final legacy API name
// denotes generic floating/breakable objects. Missing object phases are deliberate.
//
// Reconstructed triangles retain finite geometric clipping. Public course data
// omit the source grid pointer lists and some original normals/clip vectors;
// the default expanded spatial bins and public row order ARE NOT that grid.
// Exact candidate providers may override each selection/order independently.
// Numeric normals/clip boundaries are double-precision reconstructions, not a
// binary32 replay of the original collision consumer.

const vec=p=>Array.isArray(p)?{x:p[0],y:p[1],z:p[2]}:{x:p.x,y:p.y,z:p.z};
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const cross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
const copy=p=>({...p}),finite=n=>typeof n==='number'&&Number.isFinite(n);
function vector(p,name){
  const v=p&&vec(p);if(!v||![v.x,v.y,v.z].every(finite))throw new TypeError(`${name} must contain finite XYZ`);return v;
}
function normal(p,name){
  const v=vector(p,name);if(Math.abs(Math.hypot(v.x,v.y,v.z)-1)>.001)throw new RangeError(`${name} must have unit length`);
  return Object.freeze(v);
}
function triangle(vertices,metadata,n){
  if(!Array.isArray(vertices)||vertices.length!==3)throw new TypeError('A contact triangle needs three vertices');
  const [a,b,c]=vertices.map(p=>vector(p,'triangle vertex')),u=sub(b,a),v=sub(c,a);
  const uu=dot(u,u),uv=dot(u,v),vv=dot(v,v),det=uu*vv-uv*uv;
  if(!(det>1e-14))throw new RangeError('Degenerate contact triangle');
  if(!n){
    n=cross(u,v);const length=Math.hypot(n.x,n.y,n.z);
    if(Math.abs(n.y)<1e-10)throw new RangeError('A floor needs upward geometry; provide vertical faces as contactWalls');
    const sign=n.y<0?-1:1;n={x:sign*n.x/length,y:sign*n.y/length,z:sign*n.z/length};
  }
  return Object.freeze({...metadata,kind:'triangle',a:Object.freeze(a),u:Object.freeze(u),v:Object.freeze(v),uu,uv,vv,det,
    normal:normal(n,'triangle normal'),vertices:Object.freeze([a,b,c].map(Object.freeze))});
}
function compileFloors(course){
  const result=[];
  for(const [surfaceIndex,surface]of (course.staticSurfaces??course.iceSheets??[]).entries()){
    if(Array.isArray(surface.triangles)){
      surface.triangles.forEach((vertices,triangleIndex)=>result.push(triangle(vertices,{id:surface.id??`floor-${surfaceIndex}`,
        sourceIndex:surface.sourcePlaneIndices?.[triangleIndex]??null,surfaceIndex,triangleIndex,family:'floor',normalOrigin:'derived-upward-triangle'})));
    }else if(Array.isArray(surface.outline)&&surface.outline.length>=3&&finite(surface.height)){
      const outline=surface.outline.map(p=>{if(!Array.isArray(p)||p.length!==2||!p.every(finite))throw new TypeError('Invalid flat floor outline');return Object.freeze([...p]);});
      result.push(Object.freeze({kind:'outline',family:'floor',id:surface.id??`floor-${surfaceIndex}`,sourceIndex:null,surfaceIndex,
        outline:Object.freeze(outline),height:surface.height,normal:Object.freeze({x:0,y:1,z:0}),normalOrigin:'authored-flat-outline'}));
    }else throw new TypeError('A finite floor requires triangles or an explicit flat outline/height');
  }
  const walls=course.contactWalls;
  if(walls){
    if(!Array.isArray(walls.triangles)||typeof walls.query!=='function')throw new TypeError('Expected prepared contactWalls');
    walls.triangles.forEach((vertices,triangleIndex)=>{
      const center=vertices.map(p=>vector(p,'wall vertex')).reduce((a,p)=>({x:a.x+p.x/3,y:a.y+p.y/3,z:a.z+p.z/3}),{x:0,y:0,z:0});
      const face=[...walls.query(center,center)].find(q=>q.vertices===vertices);
      if(!face)throw new Error('A wall triangle has no prepared normal');
      const original=course.orientedContactPlanes?.[triangleIndex];
      result.push(triangle(vertices,{family:'wall',id:original?.id??`wall-${triangleIndex}`,
        sourceIndex:original?.sourceIndex??null,triangleIndex,normalOrigin:original?.normal?'course-numeric-wall-normal':'prepared-wall-normal'},original?.normal??face.normal));
    });
  }
  return result.map((q,candidateIndex)=>Object.freeze({...q,candidateIndex}));
}
function compileShores(course){
  const edges=course.shoreContacts?.edges??[];
  if(!Array.isArray(edges))throw new TypeError('Expected prepared shoreContacts.edges');
  const sourceRows=new Map((course.sourceShores??[]).map(q=>[q.id,q.sourceLineIndices])),withinGroup=new Map();
  return edges.map((edge,candidateIndex)=>{
    if(!Array.isArray(edge.a)||edge.a.length!==2||!edge.a.every(finite)||!finite(edge.length)||edge.length<=0||
      !finite(edge.tx)||!finite(edge.tz))throw new TypeError('Invalid finite shore edge');
    const n=normal(edge.normal,'shore normal');if(Math.abs(n.y)>1e-8)throw new RangeError('A shore normal must be horizontal');
    if(Math.abs(Math.hypot(edge.tx,edge.tz)-1)>.001)throw new RangeError('A shore tangent must have unit length');
    const groupIndex=withinGroup.get(edge.id)??0;withinGroup.set(edge.id,groupIndex+1);
    return Object.freeze({id:edge.id??`shore-${candidateIndex}`,candidateIndex,sourceIndex:edge.sourceIndex??sourceRows.get(edge.id)?.[groupIndex]??null,
      a:Object.freeze([...edge.a]),length:edge.length,tx:edge.tx,tz:edge.tz,normal:n});
  });
}
function compileBoxes(course){
  const rows=Array.isArray(course.contactVolumes)?course.contactVolumes:course.contactVolumes?.volumes??[];
  if(!Array.isArray(rows))throw new TypeError('Expected prepared contactVolumes');
  return rows.map((q,candidateIndex)=>{
    if(q.origin?.length!==3||q.axes?.length!==3||q.spans?.length!==3||!q.origin.every(finite)||
      !q.spans.every(v=>finite(v)&&v>0))throw new TypeError('Invalid finite contact volume');
    const axes=q.axes.map(a=>Object.freeze(Object.values(normal(a,'volume axis'))));
    if(Math.abs(dot(vec(axes[0]),cross(vec(axes[1]),vec(axes[2]))))<1e-8)throw new RangeError('Collapsed volume axes');
    return Object.freeze({id:q.id??`box-${candidateIndex}`,rampId:q.rampId??null,candidateIndex,sourceIndex:q.sourceIndex??null,
      origin:Object.freeze([...q.origin]),axes:Object.freeze(axes),spans:Object.freeze([...q.spans]),flag:!!q.flag});
  });
}
function bounds(record){
  if(record.kind==='triangle')return {xs:record.vertices.map(p=>p.x),zs:record.vertices.map(p=>p.z)};
  if(record.kind==='outline')return {xs:record.outline.map(p=>p[0]),zs:record.outline.map(p=>p[1])};
  return {xs:[record.a[0],record.a[0]+record.tx*record.length],zs:[record.a[1],record.a[1]+record.tz*record.length]};
}
function bins(records,size,pad){
  const cells=new Map();
  for(const q of records){
    const {xs,zs}=bounds(q),minX=Math.floor((Math.min(...xs)-pad)/size),maxX=Math.floor((Math.max(...xs)+pad)/size),
      minZ=Math.floor((Math.min(...zs)-pad)/size),maxZ=Math.floor((Math.max(...zs)+pad)/size);
    if((maxX-minX+1)*(maxZ-minZ+1)>1e6)throw new RangeError('Contact geometry exceeds the bounded reconstruction grid');
    for(let x=minX;x<=maxX;x++)for(let z=minZ;z<=maxZ;z++){
      const key=x+','+z;if(!cells.has(key))cells.set(key,[]);cells.get(key).push(q);
    }
  }
  return point=>cells.get(Math.floor(point.x/size)+','+Math.floor(point.z/size))??[];
}
function insideOutline(outline,x,z){
  let inside=false;
  for(let i=0,j=outline.length-1;i<outline.length;j=i++){
    const [ax,az]=outline[j],[bx,bz]=outline[i],dx=bx-ax,dz=bz-az;
    if((x-ax)*dz===(z-az)*dx&&x>=Math.min(ax,bx)&&x<=Math.max(ax,bx)&&z>=Math.min(az,bz)&&z<=Math.max(az,bz))return true;
    if((az>z)!==(bz>z)&&x<(bx-ax)*(z-az)/(bz-az)+ax)inside=!inside;
  }
  return inside;
}
function floorHit(face,p,band){
  if(face.kind==='outline'){
    const depth=face.height-p.y;
    return depth>=0&&depth<=band&&insideOutline(face.outline,p.x,p.z)?depth:null;
  }
  const d=sub(p,face.a),depth=-dot(d,face.normal);
  if(depth<0||depth>band)return null;
  const du=dot(d,face.u),dv=dot(d,face.v),u=(du*face.vv-dv*face.uv)/face.det,v=(dv*face.uu-du*face.uv)/face.det;
  // The source's third clip is strictly below its anchor value and includes
  // the opposite edge. With reconstructed [anchor,B,C], this is u+v>0.
  return u>=0&&v>=0&&u+v>0&&u+v<=1?depth:null;
}
function candidates(select,all,fallback,input){
  if(!select)return fallback;
  const selected=select({...input,defaultCandidates:fallback,allCandidates:all});
  if(!selected||typeof selected[Symbol.iterator]!=='function')throw new TypeError('Candidate selector must return an iterable of indices or prepared records');
  return Array.from(selected,q=>{
    const row=Number.isInteger(q)?all[q]:q;
    if(!all.includes(row))throw new RangeError('Candidate selector returned an unknown record');return row;
  });
}

/**
 * Optional per-phase hooks for native-race-adapter. Geometry/class/player-count
 * selection must already be applied by the caller. Supply fixedSphereGrid when
 * it lives on the race state (sourceSphereGrid), rather than on the course.
 * A missing geometry family means that phase has no collisions; legacy course
 * scenery is never silently treated as recovered source geometry.
 * Candidate selectors receive {hull,context,pointIndex,point,defaultCandidates,
 * allCandidates}; boxes omit point/pointIndex and receive reverse-volume order.
 * Return records or their candidateIndex values in the intended traversal order.
 * Selector overrides choose candidates only; exact original clip coefficients
 * are not recovered from a visual terrain or synthesized by this factory.
 *
 * Diagnostics are bounded per hull. Fixed-sphere impact maximum is retained for
 * a logical frame, separately from shore/floor/box contact-drive accumulators.
 * The sphere grid owns live datum-following sphere Y; this module never moves
 * its objects or handles primary breakables/dynamic floating objects.
 */
export function createSourceNativeContacts(course,{scale=course?.sourceMetadata?.nativeScale??.025,
  fixedSphereGrid=course?.sourceFixedSphereGrid??course?.sourceSphereGrid??null,candidateSelectors={}}={}){
  if(!course||typeof course!=='object')throw new TypeError('Expected a selected source course');
  if(!finite(scale)||scale<=0||!finite(scale*320))throw new RangeError('scale must be positive and finite');
  if(!candidateSelectors||typeof candidateSelectors!=='object')throw new TypeError('Expected candidateSelectors');
  for(const key of Object.keys(candidateSelectors))if(!['shore','floor','boxes'].includes(key)||typeof candidateSelectors[key]!=='function')throw new TypeError(`Unsupported candidate selector ${key}`);
  if(fixedSphereGrid&&(fixedSphereGrid.scale!==scale||typeof fixedSphereGrid.query!=='function'||!Array.isArray(fixedSphereGrid.spheres)))throw new TypeError('Expected a source fixed sphere grid at the contact scale');
  const shores=Object.freeze(compileShores(course)),floors=Object.freeze(compileFloors(course)),boxes=Object.freeze(compileBoxes(course)),band=16*scale;
  const shoreQuery=bins(shores,320*scale,band),floorQuery=bins(floors,320*scale,band),reverseBoxes=Object.freeze([...boxes].reverse()),states=new WeakMap();
  const geometry=Object.freeze({shore:shores,floor:floors,boxes});
  const provenance=Object.freeze({phaseOrder:Object.freeze(['shore','floor','boxes','dynamicPlanes','racingBuoys','fixedSpheres','primarySpheres']),
    pointOrder:'11 to 0',boxOrder:'last volume to first, then point11 to0',
    defaultCandidateSelection:'reconstructed expanded XZ bins, stable public row order; not the original grid pointer lists',
    candidateOverrides:Object.freeze(Object.fromEntries(['shore','floor','boxes'].map(k=>[k,!!candidateSelectors[k]]))),
    geometryCounts:Object.freeze({shore:shores.length,floor:floors.length,boxes:boxes.length}),
    finitePlaneClipping:'triangle-derived double precision; original normal/clip residuals and source grid admission are not reproduced',
    fixedSpheres:'collideSourceFixedSpheres: source grid/list/probe order and three-point velocity kicks; double precision, not original float32 bits',
    fixedSphereGrid:Object.freeze({provided:!!fixedSphereGrid,entries:fixedSphereGrid?.entries??null,truncated:!!fixedSphereGrid?.truncated}),
    dynamicAndPrimaryObjects:'caller-owned separate hooks',scale});
  function stateFor(hull,context){
    if(hull?.points?.length!==12||hull.scale!==scale)throw new TypeError('Expected a twelve-point hull at the course contact scale');
    if(typeof context?.applyContact!=='function')throw new TypeError('Use native-race-adapter contact context.applyContact');
    const frame=context.logicalFrame??Math.floor(hull.ticks/5);
    let state=states.get(hull);
    if(!state){state={frame:null,tick:null,total:{shore:0,floor:0,boxes:0,fixedSpheres:0},last:[],fixedImpact:{maximum:0,normal:null},fixedUnresolved:[]};states.set(hull,state);}
    if(state.frame!==frame){state.frame=frame;state.fixedImpact={maximum:0,normal:null};}
    if(state.tick!==hull.ticks){state.tick=hull.ticks;state.last=[];state.fixedUnresolved=[];}
    return state;
  }
  function record(state,phase,row,pointIndex,penetration,report){
    if(report===null||report===undefined)return;
    state.total[phase]++;state.last.push({phase,id:row.id,sourceIndex:row.sourceIndex,pointIndex,penetration,report:{...report}});
  }
  const hooks={
    shore(hull,context){
      const state=stateFor(hull,context);
      for(let pointIndex=11;pointIndex>=0;pointIndex--){
        const point=hull.points[pointIndex].position;
        for(const edge of candidates(candidateSelectors.shore,shores,shoreQuery(point),{hull,context,pointIndex,point})){
          const dx=point.x-edge.a[0],dz=point.z-edge.a[1],depth=-(dx*edge.normal.x+dz*edge.normal.z),along=dx*edge.tx+dz*edge.tz;
          if(depth>0&&depth<band&&along>0&&along<edge.length){
            record(state,'shore',edge,pointIndex,depth,context.applyContact({kind:'shore',pointIndex,normal:edge.normal,penetration:depth}));
          }
        }
      }
    },
    floor(hull,context){
      const state=stateFor(hull,context);
      for(let pointIndex=11;pointIndex>=0;pointIndex--){
        const point=hull.points[pointIndex].position;
        for(const face of candidates(candidateSelectors.floor,floors,floorQuery(point),{hull,context,pointIndex,point})){
          const depth=floorHit(face,point,band);
          if(depth!==null)record(state,'floor',face,pointIndex,depth,context.applyContact({kind:'floor',pointIndex,normal:face.normal,penetration:depth}));
        }
      }
    },
    boxes(hull,context){
      const state=stateFor(hull,context);
      for(const volume of candidates(candidateSelectors.boxes,boxes,reverseBoxes,{hull,context}))for(let pointIndex=11;pointIndex>=0;pointIndex--){
        const hit=volumeContact(volume,hull.points[pointIndex].position,pointIndex);
        if(hit)record(state,'boxes',volume,pointIndex,hit.penetration,context.applyContact({kind:'box',pointIndex,
          normal:hit.normal,penetration:hit.penetration,flag:volume.flag}));
      }
    },
    fixedSpheres(hull,context){
      const state=stateFor(hull,context);if(!fixedSphereGrid)return;
      const result=collideSourceFixedSpheres(fixedSphereGrid,hull,{impactState:state.fixedImpact});
      state.total.fixedSpheres+=result.contacts.length;state.fixedUnresolved=result.unresolved.map(q=>({id:q.id,probeIndex:q.probeIndex,status:q.status}));
      for(const q of result.contacts){
        context.recordImpact?.({channel:'fixedSphere',incomingNative:q.normalSpeedNative,normal:q.normal});
        state.last.push({phase:'fixedSpheres',id:q.id,sourceIndex:q.sourceColliderIndex,probeIndex:q.probeIndex,
          penetration:q.penetration,normalSpeedNative:q.normalSpeedNative});
      }
    },
    geometry,provenance,
    diagnostics(hull){
      const s=states.get(hull);return s?{provenance,logicalFrame:s.frame,tick:s.tick,total:{...s.total},last:s.last.map(q=>({...q,report:q.report?{...q.report}:undefined})),
        fixedImpact:{maximum:s.fixedImpact.maximum,normal:s.fixedImpact.normal?copy(s.fixedImpact.normal):null},fixedUnresolved:s.fixedUnresolved.map(copy)}:null;
    }
  };
  return Object.freeze(hooks);
}
