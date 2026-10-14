import * as THREE from 'three';

const noise=(x:number,y:number,z:number)=>Math.sin(x*37+z*19+y*63)*Math.sin(x*71-z*43+y*97);

/** An open-bottom stone arch with an actual chamber, extruded into the enclosure. */
export function archGeometry(width:number,height:number,openingWidth:number,openingHeight:number,depth:number,seed:number) {
  const shape=new THREE.Shape(),half=width/2,inner=openingWidth/2;
  shape.moveTo(-inner,0);shape.lineTo(-half,0);
  for(let i=0;i<=48;i++){const a=Math.PI-i/48*Math.PI,rough=1+.022*Math.sin(a*17+seed)+.012*Math.sin(a*31);shape.lineTo(Math.cos(a)*half*rough,Math.sin(a)*height*rough);}
  shape.lineTo(inner,0);
  for(let i=0;i<=48;i++){const a=i/48*Math.PI;shape.lineTo(Math.cos(a)*inner,Math.sin(a)*openingHeight);}
  const geo=new THREE.ExtrudeGeometry(shape,{depth,steps:12,bevelEnabled:true,bevelThickness:.004,bevelSize:.004,bevelSegments:2});
  const p=geo.attributes.position as THREE.BufferAttribute;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),n=noise(x*2+seed,y*2,z*2)*.009,relief=.004*Math.sin(x*141+y*103+seed);p.setXYZ(i,x+n,y+Math.min(1,y/.02)*n*.55,z+n*.5+relief);}
  geo.computeVertexNormals();return geo;
}

/** A closed rear wall tucked into the arch, rather than an exposed rectangular panel. */
export function caveBackingGeometry(openingWidth: number, openingHeight: number) {
  const shape = new THREE.Shape(), radius = openingWidth / 2 + .015, height = openingHeight + .012;
  shape.moveTo(-radius, 0);
  for (let i = 0; i <= 48; i++) {
    const angle = Math.PI - i / 48 * Math.PI;
    shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * height);
  }
  shape.lineTo(-radius, 0);
  return new THREE.ExtrudeGeometry(shape, {depth: .008, steps: 1, bevelEnabled: false});
}

export {cactus, dryShrub} from './DesertPlants';
export {driftwood} from './Driftwood';
