import * as T from 'three';
import {sampleTrialGhost,type TrialGhost} from './trial-ghost';

/** One translucent silhouette, with independent geometry and no physics body,
 * shadows, audio, damage or input. It cannot obstruct a ray or collide. */
export class TrialGhostView{
  readonly mesh:T.Mesh<T.BufferGeometry,T.MeshBasicMaterial>;
  constructor(scene:T.Scene,source:T.Object3D,readonly ghost:TrialGhost){
    source.updateWorldMatrix(true,true);
    const inverse=source.matrixWorld.clone().invert(),positions:number[]=[],indices:number[]=[];
    const matrix=new T.Matrix4(),point=new T.Vector3();
    source.traverseVisible(object=>{
      if(!(object instanceof T.Mesh))return;
      const attribute=object.geometry.getAttribute('position');if(!attribute)return;
      matrix.multiplyMatrices(inverse,object.matrixWorld);
      const offset=positions.length/3;
      for(let i=0;i<attribute.count;i++){point.fromBufferAttribute(attribute,i).applyMatrix4(matrix);positions.push(point.x,point.y,point.z);}
      const index=object.geometry.index;
      for(let i=0;i<(index?.count??attribute.count);i++)indices.push(offset+(index?index.getX(i):i));
    });
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeBoundingSphere();
    const material=new T.MeshBasicMaterial({color:0x63e9f4,transparent:true,opacity:.23,depthWrite:false,toneMapped:false});
    this.mesh=new T.Mesh(geometry,material);this.mesh.name='time-trial-personal-best-ghost';this.mesh.visible=false;
    this.mesh.raycast=()=>{};scene.add(this.mesh);
  }
  update(time:number,visible:boolean,player:T.Vector3){
    const pose=visible?sampleTrialGhost(this.ghost,time):null;
    this.mesh.visible=!!pose;if(!pose)return;
    this.mesh.position.fromArray(pose.position);this.mesh.quaternion.fromArray(pose.quaternion);
    // A ghost overlapping the player's car must not conceal the road.
    this.mesh.material.opacity=.04+.19*Math.min(1,this.mesh.position.distanceTo(player)/4);
  }
  dispose(){this.mesh.removeFromParent();this.mesh.geometry.dispose();this.mesh.material.dispose();}
}
