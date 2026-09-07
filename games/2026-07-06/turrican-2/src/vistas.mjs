import * as THREE from 'three';
import {part,mat,silver,dark,amber,cyan} from './models.mjs';
import {rockFace,tube,pack} from './artisan.mjs';

export function buildVistas(world,texture=null){
  const group=new THREE.Group(),animated=[],palette={1:'#71827c',2:'#456b66',3:'#535e6a',4:'#74675b',5:'#6a535b'};
  const stone=new THREE.MeshStandardMaterial({color:palette[world],map:texture,bumpMap:texture,bumpScale:1.1,metalness:.06,roughness:.95,vertexColors:true});
  for(let chunk=0;chunk<6;chunk++){
    const g=new THREE.Group();g.position.set(chunk*310,-355,-75);group.add(g);
    if(world===1||world===2||world===5){
      // A split arch, with stratified buttresses and a recessed cavern opening.
      for(let side of [-1,1])for(let j=0;j<4;j++){
        const m=new THREE.Mesh(rockFace(18+j*3,31,18,chunk*7+j+side),stone);m.position.set(130+side*(55-j*8),30+j*43,-30-j*4);m.rotation.z=side*.1;g.add(m);
      }
      const bridge=new THREE.Mesh(rockFace(56,12,22,chunk),stone);bridge.position.set(130,173,-50);g.add(bridge);
      if(world===2){
        for(let k=0;k<8;k++)g.add(tube([[k*21,0,5],[k*21+12,35,-2],[k*21-4,75+k*5,4]],1.1,mat('#496e62',.05,.88)));
      }else if(world===5){
        const nest=new THREE.Group();nest.position.set(130,75,-18);g.add(nest);
        for(let k=0;k<7;k++){const a=k*Math.PI*2/7;nest.add(tube([[Math.cos(a)*45,Math.sin(a)*45,0],[Math.cos(a)*25,Math.sin(a)*25,9],[Math.cos(a)*12,Math.sin(a)*12,3]],2.5,mat('#685362',.2,.7)));}
        part(nest,'sphere',[13,20,7],mat('#b4bf70',.1,.5,.22));animated.push({node:nest,type:'breath'});
      }else{
        // Weathered survey station gives the alien landscape a human scale.
        part(g,'plate',[25,42,12],dark,[255,22,0]);part(g,'plate',[17,18,2],silver,[255,31,7]);
        for(let k=0;k<3;k++)part(g,'box',[10,1,1],cyan,[255,27+k*3,9]);
        g.add(tube([[247,17,3],[237,8,8],[219,5,6]],1.2,dark));
      }
    }else{
      // Heavy machinery with layered ribs, conduits and rotating turbine hubs.
      for(let side of [-1,1]){
        part(g,'shell',[35,225,35],mat(palette[world],.65,.55),[130+side*93,112,0]);
        for(let k=0;k<6;k++)part(g,'box',[42,4,40],dark,[130+side*93,20+k*35,0]);
        g.add(tube([[130+side*70,15,12],[130+side*65,160,12],[130,187,12]],3,silver));
      }
      part(g,'box',[160,18,25],dark,[130,180,0]);
      const turbine=new THREE.Group();turbine.position.set(130,104,5);g.add(turbine);
      part(turbine,'torus',[42,5],silver);part(turbine,'cylinder',[12,12,8],dark,[0,0,0],[Math.PI/2,0,0]);
      for(let k=0;k<9;k++){const a=k*Math.PI*2/9;part(turbine,'plate',[28,12,3],silver,[Math.cos(a)*24,Math.sin(a)*24,0],[0,0,a+.45]);}animated.push({node:turbine,type:'turbine'});
      for(let k=0;k<5;k++)part(g,'box',[6,2,1],world===4?amber:cyan,[101+k*14,169,14]);
    }
    // Keep the animated subassemblies intact; batch the static structure.
    pack(g);
  }
  return {group,animated};
}
