/** Two connected helical turns, with separate entry, middle and exit lanes. */
export const DOUBLE_LOOP={x:-130,z:25,radius:16,shift:16,turns:2,halfWidth:4,segments:720} as const;
export function doubleLoopPoint(t:number){const l=DOUBLE_LOOP,a=t*Math.PI*2*l.turns;return{x:l.x+l.shift*l.turns*t,y:l.radius*(1-Math.cos(a)),z:l.z+l.radius*Math.sin(a)};}
export const DOUBLE_LOOP_SPAWN=(()=>{const yaw=Math.atan(DOUBLE_LOOP.shift/(2*Math.PI*DOUBLE_LOOP.radius));return{x:DOUBLE_LOOP.x-150*Math.tan(yaw),z:DOUBLE_LOOP.z-150,yaw,next:1,passed:0};})();
export const DOUBLE_LOOP_SUPPORTS=[{x:-141,y:16.5,z:25,half:[.4,16.5,.4] as const},{x:-87,y:16.5,z:25,half:[.4,16.5,.4] as const},{x:-114,y:33.4,z:25,half:[27.4,.4,.4] as const}];
export function doubleLoopMesh(){
 const positions:number[]=[],indices:number[]=[],uv:number[]=[];
 for(let i=0;i<=DOUBLE_LOOP.segments;i++){const p=doubleLoopPoint(i/DOUBLE_LOOP.segments);for(const side of [-1,1]){positions.push(p.x+side*DOUBLE_LOOP.halfWidth,p.y,p.z);uv.push((side+1)/2,i/12);}}
 for(let i=0;i<DOUBLE_LOOP.segments;i++){const a=i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3);}
 return{positions:Float32Array.from(positions),indices:Uint32Array.from(indices),uv:Float32Array.from(uv)};
}
