import * as T from '../aquaclear-studio/vendor/three.module.js';
const V=(...a)=>new T.Vector3(...a);

// Contextual loop, not a manufacturer plumbing plan. The mechanical stage
// captures solids; the UV stage acts only on water passing through its chamber.
export function buildCircuit(h){
 const {mesh,box,cyl,ring,pipe,text,mat,glass,flowMat,black,steel,ivory}=h,g=new T.Group(),tank=new T.Group();g.add(tank);
 const tx=-7.4,tz=-1.5;
 box(tank,3.5,.16,2.7,[tx,.3,tz],black);box(tank,3.4,.07,2.6,[tx,.43,tz],mat('#9b9380','rubber'));
 for(const x of [-1.7,1.7])box(tank,.035,3.2,2.6,[tx+x,2.02,tz],glass);
 for(const z of [-1.3,1.3])box(tank,3.4,3.2,.035,[tx,2.02,tz+z],glass);
 for(const x of [-1.71,1.71])for(const z of [-1.31,1.31])box(tank,.055,3.25,.055,[tx+x,2.02,tz+z],black);
 for(const z of [-1.32,1.32])box(tank,3.5,.09,.09,[tx,3.66,tz+z],black);
 for(const x of [-1.72,1.72])box(tank,.09,.09,2.7,[tx+x,3.66,tz],black);
 const surface=mesh(tank,new T.PlaneGeometry(3.34,2.54,20,20),flowMat,[tx,3.05,tz],[-Math.PI/2,0,0]);
 box(tank,3.33,2.56,2.53,[tx,1.75,tz],new T.MeshPhysicalMaterial({color:'#4b909b',transparent:true,opacity:.07,roughness:.1,depthWrite:false}));
 text(tank,'01  AQUARIUM', [tx,.2,tz+1.4],2.6);
 const rocks=mat('#777c70','rubber');for(let i=0;i<8;i++){const rock=mesh(tank,new T.DodecahedronGeometry(.25+(i%3)*.07,1),rocks,[tx-1.2+(i%4)*.7,.55,tz-.7+Math.floor(i/4)*1.2]);rock.scale.y=.6;}
 // Screened pickup and an accessible, separate solids-capture chamber.
 cyl(g,.15,.75,[tx+.8,1.1,tz],black,'y');for(let i=0;i<9;i++)ring(g,.16,.012,[tx+.8,.76+i*.08,tz],steel,'y');
 box(g,1.25,.15,1.25,[-4.9,.3,1.3],black);box(g,1.25,1.5,.08,[-4.9,1.1,.7],black);
 for(const x of [-5.5,-4.3])box(g,.08,1.5,1.2,[x,1.1,1.3],black);
 box(g,1.2,1.5,.04,[-4.9,1.1,1.9],glass);box(g,1.3,.12,1.3,[-4.9,1.88,1.3],black);
 const pleatMat=mat('#c4bfa0','cloth');for(let i=0;i<12;i++){const pleat=box(g,.065,1.2,.82,[-5.36+i*.085,1.1,1.3],pleatMat);pleat.rotation.y=(i%2?1:-1)*.24;}
 text(g,'02  MECHANICAL',[-4.9,.22,2.01],1.7);
 const routes=[
  pipe(g,[[tx+.8,1.48,tz],[tx+.8,3.84,tz],[-5.45,3.85,-.7],[-4.9,2.5,.7],[-4.9,1.93,1.3]],.1,glass),
  pipe(g,[[-4.3,.9,1.3],[-4.1,.8,.85],[-4.13,.7,0],[-4.04,.7,0]],.1,glass),
  pipe(g,[[4.15,.7,-.5],[4.8,1.3,-2.4],[4.7,4.15,-3.05],[0,4.3,-3.05],[-7.7,4.15,-3.05],[-7.7,3.15,-2.45]],.105,glass)
 ];
 text(g,'04  RETURN · RECIRCULATING WATER',[-1.3,4.45,-3.05],4);
 text(g,'03  INLINE UV',[.3,.2,1.9],2.5);
 const arrowGeo=new T.ConeGeometry(.075,.19,8);arrowGeo.translate(0,.03,0);const arrows=new T.InstancedMesh(arrowGeo,new T.MeshBasicMaterial({color:'#bcecf2'}),42);g.add(arrows);const d=new T.Object3D();
 const ripples=[];for(let i=0;i<4;i++){const r=ring(g,.2,.01,[-7.7,3.065,-2.45],new T.MeshBasicMaterial({color:'#c4edf0',transparent:true,opacity:.3,depthWrite:false}),'y');ripples.push(r);}
 let lastTravel=0;
 return {root:g,render(state,s){g.visible=state.study==='circuit';if(!g.visible)return;lastTravel=s.travel;arrows.visible=state.arrows&&s.flow>.01;for(let i=0;i<42;i++){const route=routes[i<12?0:i<18?1:2],t=(i/42+s.travel*(i<18?.12:.05))%1;d.position.copy(route.getPointAt(t));d.quaternion.setFromUnitVectors(V(0,1,0),route.getTangentAt(t));d.scale.setScalar(1);d.updateMatrix();arrows.setMatrixAt(i,d.matrix);}arrows.instanceMatrix.needsUpdate=true;for(let i=0;i<4;i++){const phase=(s.travel*.8+i/4)%1;const scale=.2+phase*2.2;ripples[i].scale.set(scale,scale,scale);ripples[i].material.opacity=(1-phase)*.32;ripples[i].visible=s.flow>.01;}},snapshot:()=>({visible:g.visible,travel:lastTravel,stages:4})};
}
