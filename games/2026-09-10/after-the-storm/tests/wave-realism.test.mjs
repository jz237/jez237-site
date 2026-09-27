import test from 'node:test';import assert from 'node:assert/strict';
import {WAVES,WIND_SEA,CHOP,windSea,bandLean,bandAmplitude,displacedSurface,sampleSwell,swellGLSL} from '../wave-model.js';
import {SURF_BANDS,surfGLSL} from '../surf-waves.js';
import {crestFoamGLSL} from '../crest-foam.js';
import {waterVertex} from '../water-vertex.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';

test('generated wave shaders never juxtapose a sign with a negative constant',()=>{
 // "a--0.24" parses as a decrement in GLSL and silently removes the water mesh.
 for(const source of [swellGLSL,surfGLSL,crestFoamGLSL,waterVertex])assert.equal(source.match(/--\d|\+\+\d|[-+*\/]\s*-\d/),null);
});

test('Big Surf sets are long-crested: every band within 15 degrees of the dominant heading',()=>{
 const [mx,mz]=SURF_BANDS[0];for(const [x,z] of SURF_BANDS)assert.ok(x*mx+z*mz>Math.cos(15*Math.PI/180));
});

test('venue and Big Surf base bands keep the calibrated forward map exactly',()=>{
 // Course routes, timed crossings and records are tuned to this surface.
 windSea.value=0;
 for(const storm of [.12,.6])for(let x=-90;x<=90;x+=13)for(const t of [2,17]){let px=x,pz=x*.3,y=0;const scale=1+storm*2.3;
  for(let i=0;i<WAVES.length;i++){const [dx,dz,k,a,w,ph]=WAVES[i],f=(x*dx+x*.3*dz)*k-t*w+ph,A=a*scale;y+=(Math.sin(f)+.12*Math.sin(2*f))*A;if(i<6){const d=CHOP*A*Math.cos(f);px+=dx*d;pz+=dz*d;}}
  const p=displacedSurface(x,x*.3,t,storm);assert.ok(Math.abs(p.x-px)<1e-12&&Math.abs(p.z-pz)<1e-12&&Math.abs(p.y-y)<1e-9);}
});

test('Wind chop and Storm swell steepen the metre-scale wind sea; calm water is unchanged',()=>{
 windSea.value=1;
 try{for(let i=0;i<WAVES.length;i++)assert.equal(bandAmplitude(i,0),WAVES[i][3]);
  const steep=(i,storm)=>WAVES[i][2]*bandAmplitude(i,storm);
  for(const i of [4,5,6,7])assert.ok(steep(i,.95)>.06&&steep(i,.95)>1.4*steep(0,.95));
  for(const i of [0,1,2,3])assert.equal(WIND_SEA[i],0);}finally{windSea.value=0;}
 assert.equal(createRace({seaState:'storm'})&&windSea.value,1);assert.equal(createRace({seaState:'chop'})&&windSea.value,1);
 for(const seaState of ['course','surf','calm'])assert.equal(createRace({seaState})&&windSea.value,0);
});

test('wind-sea crests lean forward while the long swell keeps its calibrated profile',()=>{
 // Profile along one band's travel direction: the face ahead of the crest is steeper.
 windSea.value=1;
 try{for(const i of [4,6]){const k=WAVES[i][2],L=2*Math.PI/k,t=3.1,N=900;let crest=-Infinity,cx=0;
  const single=u=>{const f=u*k-t*WAVES[i][4]+WAVES[i][5],s=Math.sin(f),c=Math.cos(f),A=bandAmplitude(i,.95),kap=i<6?0:Math.min(.2,.5*k*A);return (s-kap*(1-2*s*s)-2*bandLean(i)*s*c)*A;};
  for(let j=0;j<N;j++){const u=j/N*L,v=single(u);if(v>crest){crest=v;cx=u;}}
  let front=0,back=0;for(let j=1;j<N/2;j++){const d=j/N*L,e=L/N;front=Math.max(front,(single(cx+d-e)-single(cx+d+e))/(2*e));back=Math.max(back,(single(cx-d+e)-single(cx-d-e))/(2*e));}
  assert.ok(front>back*1.1,`band ${i} front ${front} back ${back}`);}
  for(const i of [0,1,2,3])assert.equal(bandLean(i),-.12);}finally{windSea.value=0;}
});

test('Newton inverse keeps hull heights on the displaced surface in a storm',()=>{
 windSea.value=1;let worst=0;for(const storm of [.45,.95])for(let t=0;t<40;t+=3.7)for(let x=-120;x<=120;x+=17){const p=displacedSurface(x,-x*.7,t,storm);worst=Math.max(worst,Math.abs(sampleSwell(p.x,p.z,t,storm)-p.y));}
 windSea.value=0;assert.ok(worst<1e-4,`worst ${worst}`);
});

test('a ski moving backwards is never driven further astern by drag or braking',()=>{
 // Unsigned drag and braking once accelerated a ski that landed facing backwards
 // (39 m/s after one second of braking). Braking still gives a capped slow reverse.
 const run=(vz,brake,frames)=>{const s=createRace({mode:'time',course:getCourse('greyhaven')}),r=s.racers[0],g=s.course.gates[2];s.phase='running';
  r.x=g.x;r.z=g.z;r.heading=0;r.vx=0;r.vz=vz;for(let i=0;i<frames;i++)stepRace(s,{throttle:0,brake},1/60);return Math.hypot(r.vx,r.vz);};
 assert.ok(run(-12,false,60)<9);assert.ok(run(-12,true,60)<8);assert.ok(run(-3,true,240)<8);
});
