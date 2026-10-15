import {buildGates,sampleRoute} from '../../courses.js';
// Independent synthetic basin: physics/contact tests must not inherit a live
// venue's finite source shore/floor/object families when replacing its ground.
export function openWaterCourse(overrides={}){
 const anchors=[[40,70],[40,-80],[0,-110],[-40,-80],[-40,80],[0,110]],route=sampleRoute(anchors,384);
 const gates=buildGates(sampleRoute(anchors,24));
 const c={id:'practice',name:'Synthetic open-water basin',theme:'coast',storm:.12,
  sky:[0xa6c2c5,0x397aa7],water:0x277f89,ground:()=>-20,anchors,route,gates,rocks:[],ramps:[],resistance:[],laps:3,
  stuntLayout:{anchors,ramps:[],rocks:[],rings:[],checkpoints:[]}};
 return {...c,...overrides};
}

export function optionalRampCircuit(){
 const anchors=[[40,70],[40,35],[40,-35],[40,-80],[0,-110],[-40,-80],[-40,-35],[-40,35],[-40,80],[0,110]],route=sampleRoute(anchors,384);
 const gates=buildGates(sampleRoute(anchors,24)).map(g=>({...g,side:0,offset:0,bx:g.x,bz:g.z,width:30}));
 return {...openWaterCourse(),id:'optional-ramp-circuit',stuntLayout:undefined,anchors,route,gates,
  ramps:[{id:210,x:40,z:0,tx:0,tz:-1,width:11,length:14,height:3.1,floating:true,optionalRace:true}],
  boundary:[[-140,-160],[140,-160],[140,160],[-140,160]]};
}
