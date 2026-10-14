import * as THREE from 'three';

const pose = () => ({position:new THREE.Vector3(),rotation:new THREE.Quaternion(),scale:new THREE.Vector3()});

/** Display two completed physics poses without changing the contact solver's state. */
export class PoseInterpolation {
  private frames: {node:THREE.Object3D; matrix:THREE.Matrix4; previous:ReturnType<typeof pose>; current:ReturnType<typeof pose>}[];
  private position=new THREE.Vector3();
  private rotation=new THREE.Quaternion();
  private scale=new THREE.Vector3();
  private ready=false;

  constructor(nodes:THREE.Object3D[]) {
    this.frames=nodes.map(node=>({node,matrix:new THREE.Matrix4(),previous:pose(),current:pose()}));
  }

  capture() {
    for(const f of this.frames){
      if(f.node.matrixAutoUpdate)f.node.updateMatrix();
      f.previous.position.copy(f.current.position);f.previous.rotation.copy(f.current.rotation);f.previous.scale.copy(f.current.scale);
      f.matrix.copy(f.node.matrix).decompose(f.current.position,f.current.rotation,f.current.scale);
      if(!this.ready){f.previous.position.copy(f.current.position);f.previous.rotation.copy(f.current.rotation);f.previous.scale.copy(f.current.scale);}
    }
    this.ready=true;
  }

  render(alpha:number,draw:()=>void,sync:()=>void=()=>{}) {
    if(!this.ready){draw();return;}
    const t=THREE.MathUtils.clamp(alpha,0,1);
    try{
      for(const f of this.frames){
        this.position.lerpVectors(f.previous.position,f.current.position,t);
        this.rotation.slerpQuaternions(f.previous.rotation,f.current.rotation,t);
        this.scale.lerpVectors(f.previous.scale,f.current.scale,t);
        f.node.matrix.compose(this.position,this.rotation,this.scale);
        if(f.node.matrixAutoUpdate){f.node.position.copy(this.position);f.node.quaternion.copy(this.rotation);f.node.scale.copy(this.scale);}
        f.node.matrixWorldNeedsUpdate=true;
      }
      sync();draw();
    }finally{
      for(const f of this.frames){
        f.node.matrix.copy(f.matrix);
        if(f.node.matrixAutoUpdate){f.node.position.copy(f.current.position);f.node.quaternion.copy(f.current.rotation);f.node.scale.copy(f.current.scale);}
        f.node.matrixWorldNeedsUpdate=true;
      }
      sync();
    }
  }
}
