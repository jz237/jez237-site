import * as THREE from 'three';
import {part,mat,silver,dark,amber,cyan} from './models.mjs';
import {fracturedRock} from './geology.mjs';
import {rockFace,tube,pack} from './artisan.mjs';

export function buildVistas(world,texture=null){
  const group=new THREE.Group(),animated=[],palette={1:'#71827c',2:'#456b66',3:'#535e6a',4:'#74675b',5:'#6a535b'};
  const stone=new THREE.MeshStandardMaterial({color:palette[world],map:texture,bumpMap:texture,bumpScale:1.1,metalness:.06,roughness:.95,vertexColors:true});
  for(let chunk=0;chunk<6;chunk++){
    const g=new THREE.Group();g.position.set(chunk*310,-355,-75);group.add(g);
    if(world===1||world===2||world===5){
      // Sparse talus and occasional weathered infrastructure leave open sightlines.
      if(chunk%3===1){for(let j=0;j<3;j++){
        const m=new THREE.Mesh(fracturedRock(50+j*12,18+j*13,16,world*10+chunk+j),stone);
        m.position.set(70+j*47,14+j*11,-30);m.rotation.z=-.18+j*.07;g.add(m);
      }}
      if(world===2&&chunk%2===0)for(let k=0;k<3;k++)g.add(tube([[k*11,0,0],[k*11+4,18,-2],[k*11-2,29+k*4,0]],.65,mat('#344d43',.03,.92)));
      if(world===1&&chunk===3){part(g,'plate',[18,30,10],dark,[255,15,0]);part(g,'box',[6,1,1],cyan,[255,21,6]);}
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
