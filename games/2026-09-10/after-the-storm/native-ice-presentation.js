// Display-only snapshots. No RNG, collision state or writable pool crosses
// into replay/second-player rendering. Generation identifies reused slots.
const F=Math.fround,keys=['x','y','z'];
function scalar(n){if(!Number.isFinite(n)||Math.abs(n)>1e9)throw new RangeError('Invalid ice display scalar');return n;}
function integer(n,min,max){if(!Number.isInteger(n)||n<min||n>max)throw new RangeError('Invalid ice display integer');return n;}
function point(p){if(!p)throw new TypeError('Expected ice display XYZ');return Object.fromEntries(keys.map(k=>[k,scalar(p[k])]));}
function flag(b){if(typeof b!=='boolean')throw new TypeError('Expected ice display flag');return b;}
function id(v){if(typeof v==='string'&&v.length>0&&v.length<=160||Number.isSafeInteger(v))return v;throw new TypeError('Invalid ice display id');}
export function captureNativeIcePresentation(view){
 if(view===null)return null;
 if(!view||view.version!==1||!Array.isArray(view.objects)||view.objects.length>128||!Array.isArray(view.fragments)||![0,16].includes(view.fragments.length))throw new TypeError('Invalid ice display snapshot');
 const ids=new Set();
 const objects=view.objects.map(o=>{const key=id(o.id);if(ids.has(key))throw new Error('Duplicate ice display id');ids.add(key);return {id:key,visible:flag(o.visible),position:point(o.position)};});
 const fragments=view.fragments.map(f=>({active:flag(f.active),generation:integer(f.generation,0,0xffffffff),variant:integer(f.variant,-1,7),position:point(f.position),axis:point(f.axis),angleDegrees:scalar(f.angleDegrees)}));
 if(fragments.some(f=>f.active&&(f.generation===0||f.variant<0)))throw new Error('Active ice fragment lacks identity');
 return {version:1,objects,fragments};
}
export function nativeIceOwnerPresentation(objects,pool,scale,generations){
 if(!Number.isFinite(scale)||scale<=0)throw new RangeError('Invalid source ice scale');
 return captureNativeIcePresentation({version:1,objects:objects.map(o=>({id:o.id,visible:o.renderKind!==0,position:o.position})),
  fragments:pool?pool.slots.map((s,i)=>({active:s.active,generation:generations[i],variant:s.variant,
   position:Object.fromEntries(keys.map((k,j)=>[k,s.position[j]*scale])),
   // B4ABC passes signed32(-age*8), axis(-vz,0,vx) and source XYZ to EE46C.
   axis:{x:-s.velocity[2],y:0,z:s.velocity[0]},angleDegrees:F(Math.imul(s.age,-8))})):[]});
}
export function sampleNativeIcePresentation(a,b,t){
 if(!Number.isFinite(t)||t<0||t>1)throw new RangeError('Invalid ice display interpolation');
 const first=captureNativeIcePresentation(a??null),last=captureNativeIcePresentation(b??null),chosen=t<1?first:last;
 if(!chosen||!first||!last||t===0||t===1)return chosen;
 if(first.objects.length!==last.objects.length||first.objects.some((o,i)=>o.id!==last.objects[i].id))return chosen;
 const mix=(x,y)=>x+(y-x)*t;
 for(let i=0;i<chosen.fragments.length;i++){
  const p=first.fragments[i],q=last.fragments[i];
  if(!p?.active||!q?.active||p.generation!==q.generation||p.variant!==q.variant)continue;
  chosen.fragments[i]={...p,position:Object.fromEntries(keys.map(k=>[k,mix(p.position[k],q.position[k])])),axis:{...p.axis},angleDegrees:mix(p.angleDegrees,q.angleDegrees)};
 }
 return chosen;
}
// Authored detailed mesh dimensions; source supplies position and rotation.
const shapes=[[.72,.5,.65],[.6,.7,.6],[.65,.6,.65],[.7,.5,.7],[.6,.65,.55],[.55,.5,.7],[.65,.7,.5],[.7,.55,.65]];
export function nativeIceFragmentPose(fragment){
 if(!fragment.active)return null;
 const {x,y,z}=fragment.axis,length=Math.hypot(x,y,z),angle=fragment.angleDegrees*Math.PI/360,s=length>0?Math.sin(angle)/length:0;
 return {position:fragment.position,quaternion:length>0?[x*s,y*s,z*s,Math.cos(angle)]:[0,0,0,1],scale:shapes[fragment.variant]};
}
