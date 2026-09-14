// The fleet's customary easter egg: a cat on the dock at first light. Luca, Cosmo or Taco takes the
// morning in turn by the day of the year. A low-poly sitter, tail swinging, head turning now and
// then toward whatever it has decided to watch. The rota is pure and tested; the mesh needs Three.
import * as T from './vendor/three.module.js';
export const CATS=[
 {name:'Luca',coat:0xd08a3c,belly:0xf3e2c8,ears:0xe0a866},
 {name:'Cosmo',coat:0x555a60,belly:0xd8dadc,ears:0x6d7178},
 {name:'Taco',coat:0x2b2b2e,belly:0xf1f1ee,ears:0x3a3a3e}
];
export function catOfTheDay(dayOfYear){return CATS[((Math.floor(dayOfYear)%CATS.length)+CATS.length)%CATS.length];}
export function makeCat(scene,{x=0,y=0,z=0,heading=0,cat=CATS[0]}={}){
 const g=new T.Group();g.position.set(x,y,z);g.rotation.y=heading;
 const coat=new T.MeshStandardMaterial({color:cat.coat,roughness:.95}),belly=new T.MeshStandardMaterial({color:cat.belly,roughness:.95}),earMat=new T.MeshStandardMaterial({color:cat.ears,roughness:.9});
 // a sitting cat: haunches, chest, head, ears, front legs, tail
 const haunch=new T.Mesh(new T.SphereGeometry(.13,12,9),coat);haunch.scale.set(1,.85,1.1);haunch.position.set(0,.11,-.06);g.add(haunch);
 const chest=new T.Mesh(new T.SphereGeometry(.095,12,9),coat);chest.scale.set(.9,1.5,.9);chest.position.set(0,.2,.07);g.add(chest);
 const bib=new T.Mesh(new T.SphereGeometry(.06,10,8),belly);bib.scale.set(.9,1.3,.6);bib.position.set(0,.19,.13);g.add(bib);
 const head=new T.Mesh(new T.SphereGeometry(.075,12,10),coat);head.position.set(0,.36,.11);g.add(head);
 const muzzle=new T.Mesh(new T.SphereGeometry(.035,8,6),belly);muzzle.scale.set(1.2,.8,.9);muzzle.position.set(0,-.02,.065);head.add(muzzle);
 for(const s of [-1,1]){const ear=new T.Mesh(new T.ConeGeometry(.028,.06,5),earMat);ear.position.set(s*.045,.075,-.005);ear.rotation.z=-s*.25;head.add(ear);
  const eye=new T.Mesh(new T.SphereGeometry(.009,6,6),new T.MeshStandardMaterial({color:0x2d6b3a,emissive:0x1a4a26,roughness:.3}));eye.position.set(s*.028,.012,.062);head.add(eye);
  const leg=new T.Mesh(new T.CylinderGeometry(.022,.026,.2,8),coat);leg.position.set(s*.05,.1,.12);g.add(leg);
  const paw=new T.Mesh(new T.SphereGeometry(.026,8,6),coat);paw.scale.set(1,.6,1.3);paw.position.set(s*.05,.014,.14);g.add(paw);}
 const tailCurve=new T.CatmullRomCurve3([new T.Vector3(0,.08,-.16),new T.Vector3(.1,.05,-.24),new T.Vector3(.22,.03,-.2),new T.Vector3(.3,.05,-.1)]);
 const tail=new T.Mesh(new T.TubeGeometry(tailCurve,12,.018,6,false),coat);g.add(tail);
 g.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true;}});scene.add(g);
 let lookAt=0,lookTarget=0,nextLook=3;
 return {group:g,cat,update(t,dt){tail.rotation.y=Math.sin(t*.9)*.35;tail.position.y=Math.sin(t*1.7)*.01;
   if(t>nextLook){lookTarget=(Math.random()-.5)*1.2;nextLook=t+4+Math.random()*7;}lookAt+=(lookTarget-lookAt)*Math.min(1,dt*2);head.rotation.y=lookAt;head.rotation.x=Math.sin(t*.5)*.04;},
  setVisible(v){g.visible=!!v;}};
}
