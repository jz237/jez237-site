// Finite raised walls: a ski can clear the top or dive below the underside.
// Dimensions are shared with the visible mesh; metres in world coordinates.
export function barrierCollision(barriers,x,y,z,radius=.85,hullHeight=1.1){
 for(const b of barriers||[]){const dx=x-b.x,dz=z-b.z,along=dx*b.tx+dz*b.tz,across=-dx*b.tz+dz*b.tx;
  if(Math.abs(along)<b.length/2+radius&&Math.abs(across)<b.depth/2+radius&&y<b.top&&y+hullHeight>b.bottom)return true;
 }return false;
}
export function barrierCamera(barriers,target,desired){
 let clear={...target};for(let i=1;i<=64;i++){const t=i/64,q={x:target.x+(desired.x-target.x)*t,y:target.y+(desired.y-target.y)*t,z:target.z+(desired.z-target.z)*t};if(barrierCollision(barriers,q.x,q.y,q.z,.25,.25))return clear;clear=q;}return desired;
}
