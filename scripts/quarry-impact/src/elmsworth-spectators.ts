import {createVenueCrowd,type SpectatorPlace} from './venue-crowd';
/** Keep the established occupied seats, with articulated spectators facing the track. */
export function createSpeedwaySpectators(){
 const places:SpectatorPlace[]=[];let seed=7381;
 const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 for(const side of [-1,1])for(let row=0;row<8;row++)for(let bench=-99;bench<=99;bench+=3)for(const seat of [-.63,.63]){
  if(random()<.34)continue;
  places.push({x:bench+seat,y:1+row*.65,z:side*(105+row*3),yaw:side===1?Math.PI:0,seated:true});
  // Preserve the former occupancy sequence independently of the new outfit/pose palette.
  for(let i=0;i<5;i++)random();
 }
 const crowd=createVenueCrowd(places);crowd.root.name='elmsworth-spectators';crowd.root.userData.spectators=places.length;
 // Dense distant stands do not need individual spectator shadow maps.
 for(const mesh of crowd.root.children)mesh.castShadow=false;
 return crowd;
}
