// Original A6684 checks these ten circles in native XZ coordinates. A68A4
// uses the result to reject proposed dolphin movement. These are numeric
// movement constraints, independent of the high-resolution scenery mesh.
const F=Math.fround;
const regions=[
 [112,5108,1100],[3252,3922,1200],[-3520,-85,1770],
 [179,-2485,1400],[3063,-1319,2200],[1425,3603,1000],
 [1159,4182,1000],[2441,-5018,1000],[32,-4958,1000],[-2511,-4971,1000]
];

/** Complete A6684 predicate and A6628/9D4A8 distance evaluation. Preserve
 * binary32 subtraction, multiplication, sum and square root before the
 * strict comparison: a squared-distance shortcut changes edge decisions. */
export function nativeDolphinPositionBlocked(positionNative){
 const x=F(positionNative?.x),z=F(positionNative?.z);
 if(typeof positionNative?.x!=='number'||typeof positionNative?.z!=='number'||!Number.isFinite(x)||!Number.isFinite(z))
  throw new TypeError('Supply finite native dolphin XZ');
 for(const [cx,cz,radius]of regions){
  const dx=F(x-cx),dz=F(z-cz),distance=F(Math.sqrt(F(F(dx*dx)+F(dz*dz))));
  if(distance<radius)return true;
 }
 return false;
}
