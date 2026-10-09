import type {CarKind} from './rules';
import {DEFINITIONS} from './rules';
import {isClassicKind,CLASSIC_VEHICLES,vehicleWheelRadius} from './classic-vehicle-specs';

export type ArmorVec={x:number;y:number;z:number};
export type ArmorRegion='front'|'rear'|'left'|'right';
export type ArmorBeam={id:string;region:ArmorRegion;a:ArmorVec;b:ArmorVec;radius:number};
export type ArmorPlate={id:string;region:ArmorRegion;centre:ArmorVec;size:ArmorVec};
export type ArmorLayout={level:number;modelOffset:number;beams:ArmorBeam[];plates:ArmorPlate[]};
type Fit={front:number;rear:number;frontY:number;rearY:number;frontWidth:number;rearWidth:number;sideX:number;sideY:number;rearRise:number};

// Measured exterior mounting heights/end positions in each original model's
// coordinates. The three modern bodies are asymmetric and wider than their
// simple chassis boxes, so nominal halfLength/halfWidth cannot fit their kits.
const fits:Record<CarKind,Fit>={
 trail:{front:2.32,rear:-2.32,frontY:.57,rearY:.57,frontWidth:.98,rearWidth:.98,sideX:1.015,sideY:.54,rearRise:0},
 regent:{front:2.80,rear:-2.80,frontY:.52,rearY:.52,frontWidth:1.00,rearWidth:1.00,sideX:1.045,sideY:.415,rearRise:.14},
 shuttle:{front:3.11,rear:-3.11,frontY:.56,rearY:.56,frontWidth:1.06,rearWidth:1.06,sideX:1.085,sideY:.58,rearRise:0},
 coupe:{front:2.26,rear:-1.97,frontY:.51,rearY:.66,frontWidth:1.015,rearWidth:1.035,sideX:1.11,sideY:.40,rearRise:.15},
 sedan:{front:2.484,rear:-2.157,frontY:.52,rearY:.69,frontWidth:.975,rearWidth:1.00,sideX:1.08,sideY:.43,rearRise:.14},
 hatch:{front:2.05,rear:-1.781,frontY:.51,rearY:.70,frontWidth:.935,rearWidth:.96,sideX:1.04,sideY:.43,rearRise:.14},
 muscle:{front:2.41,rear:-2.44,frontY:.50,rearY:.55,frontWidth:.815,rearWidth:.825,sideX:.94,sideY:.405,rearRise:.14},
 wagon:{front:2.356,rear:-2.467,frontY:.50,rearY:.48,frontWidth:.845,rearWidth:.845,sideX:.955,sideY:.405,rearRise:0},
 utility:{front:2.524,rear:-2.982,frontY:.51,rearY:.53,frontWidth:.82,rearWidth:.855,sideX:.945,sideY:.415,rearRise:0},
 compact:{front:1.858,rear:-1.858,frontY:.485,rearY:.485,frontWidth:.73,rearWidth:.73,sideX:.795,sideY:.375,rearRise:.14},
 van:{front:2.305,rear:-2.305,frontY:.495,rearY:.412,frontWidth:.905,rearWidth:.905,sideX:.97,sideY:.43,rearRise:0},
 tern:{front:1.894,rear:-1.894,frontY:.48,rearY:.485,frontWidth:.77,rearWidth:.77,sideX:.835,sideY:.365,rearRise:0},
 marten:{front:2.084,rear:-2.08,frontY:.435,rearY:.435,frontWidth:.758,rearWidth:.758,sideX:.815,sideY:.37,rearRise:.15},
 buggy:{front:1.778,rear:-1.789,frontY:.47,rearY:.535,frontWidth:.59,rearWidth:.49,sideX:.735,sideY:.49,rearRise:.18},
};
const point=(x:number,y:number,z:number):ArmorVec=>({x,y,z});

/** Shared visual/physical fabrication. Beams are exact flat-ended cylinders;
 * plates are solid mounting pads. Fasteners are the only artwork-only detail. */
export function vehicleArmorLayout(kind:CarKind,input:number):ArmorLayout{
 const level=Number.isFinite(input)?Math.max(0,Math.min(3,Math.round(input))):0;
 const layout:ArmorLayout={level,modelOffset:isClassicKind(kind)?CLASSIC_VEHICLES[kind].modelOffset:kind==='coupe'?1:kind==='sedan'?1.04:1.05,beams:[],plates:[]};
 if(!level)return layout;
 const fit=fits[kind],buggy=kind==='buggy',mainRadius=buggy?(level===3?.037:.029):(level===3?.046:.035);
 const beam=(id:string,region:ArmorRegion,a:ArmorVec,b:ArmorVec,radius=mainRadius)=>layout.beams.push({id,region,a,b,radius});
 const plate=(id:string,region:ArmorRegion,centre:ArmorVec,size:ArmorVec)=>layout.plates.push({id,region,centre,size});
 for(const region of ['front','rear']as const){
  const sign=region==='front'?1:-1,base=region==='front'?fit.front:fit.rear,y=region==='front'?fit.frontY:fit.rearY,width=region==='front'?fit.frontWidth:fit.rearWidth,z=base+sign*(buggy?.042:.050),mountX=width*.54;
  const points=[point(-width,y,z-sign*.135),point(-width*.74,y,z),point(width*.74,y,z),point(width,y,z-sign*.135)];
  for(let i=0;i<points.length-1;i++)beam(region+'-impact-'+i,region,points[i],points[i+1]);
  for(const side of [-1,1]){
   beam(region+'-mount-'+side,region,point(side*mountX,y,base-sign*.125),point(side*mountX,y,z),mainRadius*.70);
   // On the Carrier, the rear mounting pads remain below its barn-door sill.
   const padHeight=kind==='van'&&region==='rear'?.085:.112;
   plate(region+'-pad-'+side,region,point(side*mountX,y,base-sign*.006),point(.125,padHeight,.018));
  }
  if(level===3){
   const rise=region==='front'?(buggy?.17:.19):fit.rearRise,half=Math.min(width*.43,buggy?.27:.355),r=mainRadius*.71;
   if(rise>0){
    const a=point(-half,y,z),b=point(-half*.86,y+rise,z-sign*.015),c=point(half*.86,y+rise,z-sign*.015),d=point(half,y,z);
    beam(region+'-guard-left',region,a,b,r);beam(region+'-guard-top',region,b,c,r);beam(region+'-guard-right',region,c,d,r);
    for(const side of [-1,1])beam(region+'-guard-stay-'+side,region,point(side*half*.86,y+rise,z-sign*.015),point(side*mountX,y,base-sign*.105),r*.78);
   }else{
    // Cargo/tailgate cars get an under-sill V brace, never a bar across the lid.
    const drop=kind==='van'?.035:.055;
    beam(region+'-lower-stay-left',region,point(-mountX,y,base-sign*.11),point(0,y-drop,z-sign*.065),r);
    beam(region+'-lower-stay-right',region,point(mountX,y,base-sign*.11),point(0,y-drop,z-sign*.065),r);
   }
  }
 }
 if(level>=2){
  // Stop each rail before both tyre envelopes, including a little travel margin.
  const end=DEFINITIONS[kind].wheelbase/2-vehicleWheelRadius(kind)-.11;
  for(const side of [-1,1]){
   const region=side<0?'left':'right',x=side*fit.sideX,y=fit.sideY,r=level===3?(buggy?.033:.039):(buggy?.027:.031),mountX=side*(fit.sideX-(buggy?.092:.083));
   beam(region+'-sill',region,point(x,y,-end),point(x,y,end),r);
   for(const z of [-end*.72,end*.72]){
    beam(region+'-outrigger-'+z,region,point(mountX,y,z),point(x,y,z),r*.69);
    plate(region+'-pad-'+z,region,point(mountX,y,z),point(.017,.106,.126));
   }
   if(level===3){
    const top=y+(buggy?.13:.145),X=x+side*.010,span=end*.80;
    beam(region+'-upper',region,point(X,top,-span),point(X,top,span),r*.74);
    for(const z of [-span,span])beam(region+'-end-stay-'+z,region,point(x,y,z),point(X,top,z),r*.65);
    beam(region+'-diagonal',region,point(x,y,-span),point(X,top,span),r*.62);
   }
  }
 }
 return layout;
}

/** Each low fabricated assembly shares one contact envelope. This only closes
 * the small spaces inside its truss; separate regions never bridge the cabin,
 * cargo opening or wheel arches. Ring samples retain the beams' flat ends. */
export function vehicleArmorCollisionHulls(layout:ArmorLayout):{region:ArmorRegion;points:ArmorVec[]}[]{
 const hulls:{region:ArmorRegion;points:ArmorVec[]}[]=[];
 for(const region of ['front','rear','left','right']as const){
  const points:ArmorVec[]=[];
  for(const {a,b,radius} of layout.beams.filter(beam=>beam.region===region)){
   const length=Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z),dx=(b.x-a.x)/length,dy=(b.y-a.y)/length,dz=(b.z-a.z)/length;
   // The same shortest rotation from local +Y used by the visible cylinders.
   // Sixteen samples include all eight artwork vertices without inflating them.
   let qx=dz,qz=-dx,qw=1+dy;
   if(qw<Number.EPSILON){qx=0;qz=1;qw=0;}else{const norm=Math.hypot(qx,qz,qw);qx/=norm;qz/=norm;qw/=norm;}
   for(let i=0;i<16;i++){
    const angle=i*Math.PI/8,x=Math.sin(angle)*radius,z=Math.cos(angle)*radius,ty=2*(qz*x-qx*z);
    const offset=point(x-qz*ty,qw*ty,z+qx*ty);
    for(const end of [a,b])points.push(point(end.x+offset.x,end.y+offset.y,end.z+offset.z));
   }
  }
  for(const {centre,size} of layout.plates.filter(plate=>plate.region===region))for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])points.push(point(centre.x+x*size.x/2,centre.y+y*size.y/2,centre.z+z*size.z/2));
  if(points.length)hulls.push({region,points});
 }
 return hulls;
}
