import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

function sign(text:string,color:string,w=512,h=160){const c=document.createElement('canvas');c.width=w;c.height=h;const a=c.getContext('2d')!;a.fillStyle='#101315';a.fillRect(0,0,w,h);a.textAlign='center';a.fillStyle=color;a.font=`bold ${h*.32}px monospace`;text.split('|').forEach((s,i)=>a.fillText(s,w/2,h*.4+i*h*.35));const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}

function roomArtwork(index:number,side=false){
 const c=document.createElement('canvas');c.width=512;c.height=side?1024:384;const a=c.getContext('2d')!;const colors=['#af5446','#698eb2','#b89e58','#7cac92','#9572b5','#b77948'];const ink=colors[index%6];
 a.fillStyle=side?'#171c22':'#030607';a.fillRect(0,0,c.width,c.height);let seed=8191+index;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 if(side){a.strokeStyle=ink;a.lineWidth=11;for(let i=0;i<7;i++){a.beginPath();a.moveTo(0,850-i*29);a.lineTo(230,650-i*29);a.lineTo(512,720-i*50);a.stroke();}a.fillStyle=ink;a.beginPath();a.arc(280,320,135,0,7);a.fill();a.fillStyle='#171c22';a.beginPath();a.arc(320,300,115,0,7);a.fill();for(let i=0;i<90;i++){a.fillStyle='#c5c4aa';a.fillRect(rnd()*512,rnd()*1024,2,2);}for(let i=0;i<1800;i++){a.fillStyle=i%2?'#10151265':'#aa9b7933';a.fillRect(rnd()*512,rnd()*1024,1+rnd()*9,1);}}
 else {a.fillStyle=ink;a.font='18px monospace';a.fillText('HIGH SCORE    '+(12000+index*2450),28,28);for(let i=0;i<70;i++){a.fillStyle=i%4?'#667984':ink;a.fillRect(rnd()*512,45+rnd()*300,2,2);}a.strokeStyle=ink;a.lineWidth=2;
 if(index%3===0){for(let i=0;i<8;i++){a.beginPath();a.ellipse(256,210,45+i*23,30+i*15,0,0,Math.PI*2);a.stroke();}a.fillStyle='#c2d3c6';a.fillRect(249,302,15,5);}
 else if(index%3===1){for(let row=0;row<5;row++)for(let col=0;col<9;col++){a.fillStyle=row%2?ink:'#a9b992';a.fillRect(64+col*42,90+row*29,18,8);a.fillRect(61+col*42,98+row*29,24,4);}a.fillRect(239,320,29,5);}
 else {for(let i=0;i<18;i++){a.beginPath();a.moveTo(256,130);a.lineTo(i*34,345);a.stroke();}for(let i=0;i<7;i++)a.strokeRect(18,170+i*i*4,476,1);}a.fillStyle='#a4a68f';a.font='15px monospace';a.fillText('INSERT COIN',200,371);for(let y=0;y<384;y+=3){a.fillStyle='#0005';a.fillRect(0,y,512,1);}}
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t;
}
export function makeRoom(wood:T.Texture,_marquee:T.Texture,_screen:T.Texture){
 const root=new T.Group();root.name='after_hours_arcade';
 const steel=new T.MeshStandardMaterial({color:'#7b7971',metalness:.8,roughness:.32});
 const black=new T.MeshStandardMaterial({color:'#262923',roughness:.8,map:wood});
 const woodSide=new T.MeshStandardMaterial({color:'#7e7a69',roughness:.7,map:wood});
 const wall=new T.MeshStandardMaterial({color:'#2a2928',roughness:.97});
 const bricks=['#24272a','#292a2a','#2d2c29','#22272a'].map(color=>new T.MeshStandardMaterial({color,roughness:.96}));
 const dark=new T.MeshStandardMaterial({color:'#111515',roughness:.85});
 const rubber=new T.MeshStandardMaterial({color:'#181b18',roughness:.7});
 const mesh=(g:T.Group,geo:T.BufferGeometry,m:T.Material,p:number[],r=[0,0,0])=>{const x=new T.Mesh(geo,m);x.position.set(...p as [number,number,number]);x.rotation.set(...r as [number,number,number]);x.castShadow=true;x.receiveShadow=true;g.add(x);return x};
 const box=(g:T.Group,s:number[],p:number[],m:T.Material,r=.01)=>mesh(g,r?new RoundedBoxGeometry(s[0],s[1],s[2],1,r):new T.BoxGeometry(...s as [number,number,number]),m,p);
 const cyl=(g:T.Group,r:number,h:number,p:number[],m:T.Material,rotation=[0,0,0])=>mesh(g,new T.CylinderGeometry(r,r,h,16),m,p,rotation);
 box(root,[17,5.2,.16],[0,2.6,-5.6],wall);box(root,[.16,5.2,18],[-7,2.6,0],wall);box(root,[.16,5.2,18],[7,2.6,0],wall);
 for(let row=0;row<20;row++)for(let col=0;col<31;col++){const x=-7.7+col*.51+(row%2)*.25;box(root,[.484,.235,.018],[x,row*.252+.12,-5.505],bricks[(row*7+col*11)%4],0);}
 for(const x of [-6.8,-2.2,2.2,6.8])box(root,[.11,4.7,.18],[x,2.35,-5.35],dark);
 box(root,[14,.15,.11],[0,.18,-5.45],dark);box(root,[14,.018,.024],[0,1.15,-5.38],steel);
 const locations=[[-4.7,-.6,.22],[-4.8,-2.6,.15],[-3.45,-4.5,0],[3.3,-4.5,0],[4.8,-2.7,-.2],[5,-.65,-.3]];
 for(let i=0;i<locations.length;i++){
  const [x,z,rot]=locations[i];const g=new T.Group();g.position.set(x,0,z);g.rotation.y=rot;g.scale.setScalar(.9);root.add(g);
  const sideMaterial=new T.MeshStandardMaterial({map:roomArtwork(i,true),roughness:.96,envMapIntensity:.15});const s=new T.Shape();s.moveTo(-.58,.1);s.lineTo(.52,.1);s.lineTo(.65,1.52);s.lineTo(.75,1.62);s.lineTo(.4,1.82);s.lineTo(.28,2.53);s.lineTo(.58,2.86);s.lineTo(.58,3.24);s.lineTo(-.58,3.24);s.closePath();
  for(const side of [-.67,.62]){const geo=new T.ExtrudeGeometry(s,{depth:.05,bevelEnabled:false});geo.rotateY(-Math.PI/2);geo.translate(side+.05,0,0);mesh(g,geo,woodSide,[0,0,0]);mesh(g,new T.PlaneGeometry(.8,2.35),sideMaterial,[side<0?side-.002:side+.052,1.43,-.02],[0,side<0?-Math.PI/2:Math.PI/2,0]);}
  box(g,[1.29,.15,1.1],[0,.15,0],black);box(g,[1.27,1.19,.09],[0,.9,.5],black);box(g,[.55,.66,.045],[0,.95,.57],dark);for(const a of [-.13,.13])box(g,[.12,.1,.012],[a,1.12,.61],new T.MeshStandardMaterial({color:'#814922',emissive:'#894119',emissiveIntensity:.35}));
  box(g,[1.3,.12,.51],[0,1.63,.49],black);box(g,[1.3,.34,.11],[0,3.02,.54],dark);const title=['ORBITAL','STARWARD','LUNAR RUN','METEOR','VECTOR','STARWARD'][i];const tm=sign(title,['#b78c61','#b18466','#6d99a4'][i%3]);const mm=new T.MeshBasicMaterial({map:tm,color:'#77776a'});mesh(g,new T.PlaneGeometry(1.17,.26),mm,[0,3.02,.602]);
  box(g,[1.25,1.04,.12],[0,2.2,.36],black);mesh(g,new T.PlaneGeometry(.94,.7),new T.MeshBasicMaterial({map:roomArtwork(i),color:'#8e9b91'}),[0,2.2,.426]);for(const a of [-.35,.16,.35])cyl(g,.04,.03,[a,1.707,.54],new T.MeshStandardMaterial({color:i%2?'#904335':'#c1a24f',roughness:.5}));cyl(g,.013,.17,[-.37,1.8,.43],steel);mesh(g,new T.SphereGeometry(.051,14,10),rubber,[-.37,1.9,.43]);
 }
 // Stool with a padded seat, welded legs, and a circular foot rail.
 for(const [x,z]of [[-3.8,1.45],[4,1.3]]){const g=new T.Group();g.position.set(x,0,z);root.add(g);cyl(g,.31,.085,[0,1.13,0],rubber);mesh(g,new T.TorusGeometry(.299,.005,5,48),dark,[0,1.166,0],[Math.PI/2,0,0]);for(let j=0;j<20;j++){const a=j*Math.PI/10;cyl(g,.003,.002,[Math.cos(a)*.298,1.17,Math.sin(a)*.298],steel);}cyl(g,.304,.035,[0,1.074,0],steel);for(let i=0;i<4;i++){const a=i*Math.PI/2+.4;const leg=cyl(g,.022,1.04,[Math.cos(a)*.235,.56,Math.sin(a)*.235],steel);leg.rotation.z=Math.cos(a)*.12;leg.rotation.x=-Math.sin(a)*.12;cyl(g,.031,.04,[Math.cos(a)*.29,.035,Math.sin(a)*.29],rubber);}mesh(g,new T.TorusGeometry(.285,.014,6,36),steel,[0,.37,0],[Math.PI/2,0,0]);}
 // Service case, metal edging, latches, and a coiled lead.
 const crate=new T.Group();crate.position.set(3.75,0,.1);crate.rotation.y=-.3;root.add(crate);box(crate,[1.06,.59,.67],[0,.36,0],woodSide);for(const x of [-.51,.51])for(const z of [-.31,.31])box(crate,[.035,.58,.035],[x,.36,z],steel);for(const y of [.085,.64]){box(crate,[1.06,.025,.7],[0,y,0],steel);}for(const x of [-.3,.3])box(crate,[.08,.11,.024],[x,.5,.354],steel);mesh(crate,new T.PlaneGeometry(.7,.17),new T.MeshBasicMaterial({map:sign('SERVICE / 81','#a99878'),color:'#aaa99a'}),[0,.35,.342]);for(let i=0;i<3;i++)mesh(crate,new T.TorusGeometry(.32+i*.025,.013,6,40),rubber,[0,.67+i*.014,0],[Math.PI/2,0,0]);
 // Leads follow the floor and climb to the rear outlets; scattered service paperwork.
 for(const side of [-1,1]){const points=[[side*4.7,.045,.1],[side*4.1,.045,-.4],[side*4.3,.045,-1.1],[side*4.8,.045,-2.3],[side*4.55,.045,-4.9],[side*4.55,.35,-5.35]].map(p=>new T.Vector3(...p as [number,number,number]));mesh(root,new T.TubeGeometry(new T.CatmullRomCurve3(points),64,.012,6,false),rubber,[0,0,0]);box(root,[.13,.19,.03],[side*4.55,.37,-5.38],steel);for(const y of [.33,.40])box(root,[.037,.008,.015],[side*4.55,y,-5.356],dark);}
 const paper=new T.MeshStandardMaterial({map:sign('SERVICE LOG|09 / 81','#afa58b'),roughness:.95});mesh(crate,new T.PlaneGeometry(.24,.33),paper,[.23,.664,.12],[-Math.PI/2,0,.18]);
 // Back-wall signs remain dim practical light sources.
 mesh(root,new T.PlaneGeometry(1.65,.66),new T.MeshBasicMaterial({map:sign('ONE MORE|CREDIT','#bd6278'),color:'#cf829a'}),[-3,3.62,-5.39]);mesh(root,new T.PlaneGeometry(1.1,.43),new T.MeshBasicMaterial({map:sign('EXIT','#8a9b70'),color:'#7b956c'}),[4.9,3.48,-5.39]);
 box(root,[1.35,2.52,.055],[5,1.27,-5.43],dark);box(root,[.055,.1,.045],[5.44,1.14,-5.36],steel);
 for(const x of [-4,0,4]){cyl(root,.008,1,[x,4.69,-2],dark);const lamp=mesh(root,new T.ConeGeometry(.37,.2,32,1,true),steel,[x,4.1,-2],[0,0,0]);mesh(root,new T.CircleGeometry(.335,32),new T.MeshBasicMaterial({color:'#ceac73'}),[x,4,-2],[-Math.PI/2,0,0]);}
 // Merge static room surfaces per material, preserving correct world transforms.
 root.updateMatrixWorld(true);const bins=new Map<T.Material,T.Mesh[]>();root.traverse(o=>{if(o instanceof T.Mesh&&!Array.isArray(o.material)){const b=bins.get(o.material)||[];b.push(o);bins.set(o.material,b);}});const mergedRoot=new T.Group();mergedRoot.name=root.name;
 for(const [material,items]of bins){const geos=items.map(o=>{const g=o.geometry.clone().applyMatrix4(o.matrixWorld);return g.index?g.toNonIndexed():g;});const g=mergeGeometries(geos,false);if(g){const o=new T.Mesh(g,material);o.castShadow=true;o.receiveShadow=true;mergedRoot.add(o);}geos.forEach(g=>g.dispose());items.forEach(o=>o.geometry.dispose());}
 return mergedRoot;
}
