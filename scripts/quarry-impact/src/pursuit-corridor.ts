/** A longer pursuit shortcut must be driveable across its full width, not just
 * visible along a center ray. Height discontinuities and world edges reject it. */
export function pursuitTerrainClear(from:{x:number;z:number},to:{x:number;z:number},halfWidth:number,height:(x:number,z:number)=>number,outside:(x:number,y:number,z:number)=>boolean){
 const dx=to.x-from.x,dz=to.z-from.z,length=Math.hypot(dx,dz);if(!Number.isFinite(length)||!Number.isFinite(halfWidth)||halfWidth<0)return false;if(length<.1)return true;
 const steps=Math.max(1,Math.ceil(length/3)),sx=dz/length*(halfWidth+.35),sz=-dx/length*(halfWidth+.35);
 const heights:number[][]=[];
 for(const side of [-1,0,1]){let previous:number|undefined;const row:number[]=[];heights.push(row);
  for(let i=0;i<=steps;i++){const x=from.x+dx*i/steps+sx*side,z=from.z+dz*i/steps+sz*side,y=height(x,z);if(!Number.isFinite(y)||outside(x,y+.8,z)||previous!==undefined&&Math.abs(y-previous)>length/steps*.45)return false;previous=y;row.push(y);}
 }
 for(let i=0;i<=steps;i++)if(Math.max(...heights.map(row=>row[i]))-Math.min(...heights.map(row=>row[i]))>(halfWidth+.35)*2*.45)return false;
 return true;
}
