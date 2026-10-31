import * as T from '../aquaclear-studio/vendor/three.module.js';
export const JOURNEY=[
 {title:'Enter with the dirty water',voice:'Dirty water carries our amber waste marker through the inlet.',text:'Follow the amber marker through the inlet. It represents one enlarged piece of suspended waste, carried into the dirty interior of the drum.',center:[-2.2,1.8,0],radius:2.8,dir:[-4,4,9]},
 {title:'Stay on the inside of the screen',voice:'Water crosses the mesh. The larger particle stays inside.',text:'Water can cross the mesh. This illustrated piece is too large to pass, so it stays on the inner surface. The marker is enlarged for visibility.',center:[-.5,1.8,-.4],radius:2,dir:[4,4,10]},
 {title:'Restriction lowers the clean-side level',voice:'The clean-side level drops. The float triggers washing.',text:'We now load the screen to demonstrate the trigger. In this gravity-fed example, the clean-side level drops. The float calls for a wash when the difference becomes large enough.',center:[1.4,2.3,.5],radius:2.8,dir:[6,4,10]},
 {title:'Lift the retained waste to the wash zone',voice:'The screen lifts the waste.',text:'The controller starts the rinse pump and geared drive. The screen turns; the nozzles and collection trough stay still. Watch the amber marker rise with the screen.',center:[-.25,2.65,0],radius:2.25,dir:[3,6,9]},
 {title:'Rinse inward into the trough',voice:'Jets wash the waste inward.',text:'Jets wash from outside the screen toward its dirty inner face. The loosened waste drops into the stationary trough, above the normal waterline.',center:[-.45,2.95,0],radius:1.85,dir:[3,6.5,8]},
 {title:'Export it through a separate outlet',voice:'Dirty rinse water carries the waste through the separate drain.',text:'The dirty rinse water carries the waste along the trough and out through the waste pipe. It leaves the filtration circuit instead of returning to the clean-water chamber.',center:[-2.4,2.1,0],radius:2.8,dir:[-5,5,9]}
];
const lerp=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t),clamp=x=>Math.max(0,Math.min(1,x));
export function createJourney(){
 let active=false,stage=-1,age=0,completed=false;
 return {
  start(){active=true;stage=0;age=0;completed=false;},
  stop(){active=false;stage=-1;age=0;completed=false;},
  update(dt,h){if(!active||dt<=0)return null;age+=dt;const duration=[6,5,5,0,2.2,7][stage];const advance=stage===3?h.angle>=Math.PI/2:age>=duration;if(!advance)return null;
   if(stage===5){active=false;completed=true;return 'complete';}stage++;age=0;return stage;
  },
  snapshot(h={angle:0}){
   let position=[-.44,1.8,-1.24];
   if(stage===0){const t=clamp(age/6);position=t<.45?lerp([-4.12,1.55,.75],[-1.9,1.55,.75],t/.45):lerp([-1.9,1.55,.75],position,(t-.45)/.55);}
   if(stage===3){const a=-Math.PI/2+Math.min(Math.PI/2,h.angle);position=[-.44,1.8+Math.cos(a)*1.24,Math.sin(a)*1.24];}
   if(stage===4)position=lerp([-.44,3.04,0],[-.44,2.765,0],clamp(age/2.2));
   if(stage===5){const t=clamp(age/7),jet=clamp((t-.9)/.1);position=t<.65?lerp([-.44,2.765,0],[-3.1,2.7,0],t/.65):t<.8?lerp([-3.1,2.7,0],[-4.15,2.45,0],(t-.65)/.15):t<.9?lerp([-4.15,2.45,0],[-4.5,2.05,0],(t-.8)/.1):[-4.5-.58*jet,2.05-.66*jet-.95*jet*jet,0];}
   return {active,stage,age,completed,position};
  }
 };
}
export function journeyMarker(root){
 const g=new T.Group();root.add(g);const core=new T.Mesh(new T.IcosahedronGeometry(.095,2),new T.MeshBasicMaterial({color:'#ffc45e',transparent:true,opacity:1,depthTest:false,depthWrite:false}));core.renderOrder=1000;g.add(core);
 const halo=new T.Mesh(new T.SphereGeometry(.16,20,14),new T.MeshBasicMaterial({color:'#ffc977',transparent:true,opacity:.15,depthTest:false,depthWrite:false}));halo.renderOrder=1001;g.add(halo);g.visible=false;
 return {object:g,update(s){g.visible=!!s.journey?.active;if(g.visible){g.position.set(...s.journey.position);halo.scale.setScalar(1+Math.sin(s.journey.age*3)*.12);}},snapshot:()=>({visible:g.visible,position:g.position.toArray()})};
}
