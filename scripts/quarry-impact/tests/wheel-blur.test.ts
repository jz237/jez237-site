import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {BLUR,WheelBlur,blurOpacity} from '../src/wheel-blur';
/** A wheel at (x,0,z): a tyre round a spoked rim of radius .22 facing out along x, and a brake disc. */
function wheel(x:number,cap=false){
  const w=new T.Group();w.position.set(x,0,0);
  const tyre=new T.Mesh(new T.CylinderGeometry(.33,.33,.2,12).rotateZ(Math.PI/2),new T.MeshStandardMaterial({name:'Tyre rubber'}));
  const rim=new T.Mesh(new T.CylinderGeometry(.22,.22,.12,12).rotateZ(Math.PI/2),new T.MeshStandardMaterial({name:'Rim alloy',color:0xb0b4b8}));rim.name='rim';
  const disc=new T.Mesh(new T.CylinderGeometry(.16,.16,.02,12).rotateZ(Math.PI/2),new T.MeshStandardMaterial({name:'Brake disc',color:0x333333}));
  w.add(tyre,rim,disc);if(cap){const c=new T.Mesh(new T.CircleGeometry(.2),new T.MeshStandardMaterial());c.name='hubcap_fitted';w.add(c);}
  w.updateMatrixWorld(true);return w;
}
test('the blur fades in as the wheel spins up and never covers it whole',()=>{
  assert.equal(blurOpacity(0),0);assert.equal(blurOpacity(BLUR.from),0);assert.equal(blurOpacity(BLUR.full),BLUR.most);assert.equal(blurOpacity(-BLUR.full*3),BLUR.most,'either way, capped');
  const mid=blurOpacity((BLUR.from+BLUR.full)/2);assert.ok(mid>0&&mid<BLUR.most);assert.equal(blurOpacity(NaN),0);assert.ok(BLUR.most<1);
});
test('a ring fitted over each rim’s outboard face, in the rim’s colour darkened by its spoke gaps',()=>{
  const wheels=[wheel(.8),wheel(-.8),undefined,wheel(-.8)],blur=new WheelBlur(wheels,.33);assert.equal(blur.discs.length,3,'one per wheel there');
  const [left,right]=blur.discs;assert.ok(left.disc.position.x>.06&&right.disc.position.x< -.06,'outboard of the rim face, each side');
  const g=left.disc.geometry as T.BufferGeometry;g.computeBoundingBox();const reach=g.boundingBox!.max.y;assert.ok(reach<.22&&reach>.22*.85,'inside the rim lip, not over the tyre');
  assert.ok(Math.abs(g.boundingBox!.max.x-g.boundingBox!.min.x)<1e-6,'flat, facing along the axle');
  assert.ok(left.material.color.equals(new T.Color(0xb0b4b8).multiplyScalar(BLUR.gaps))&&left.material.transparent&&!left.material.depthWrite,'rim colour, see-through');
  assert.equal(blur.discs[2].index,3,'keeps its wheel’s place');
});
test('it follows each wheel’s own spin: wheelspin blurs, a locked wheel shows its spokes, and none on a lost wheel or a hubcap',()=>{
  const blur=new WheelBlur([wheel(.8),wheel(-.8),wheel(.8,true),wheel(-.8)],.33),dt=1/60;
  blur.update([0,0,0,0],dt,[false,false,false,false]);assert.deepEqual(blur.opacities,[0,0,0,0],'first look: no spin yet');
  const spin=BLUR.full*1.2*dt;blur.update([spin,0,spin,spin],dt,[false,false,false,true]);
  assert.equal(blur.opacities[0],BLUR.most,'spinning');assert.equal(blur.opacities[1],0,'locked');assert.equal(blur.opacities[2],0,'a solid hubcap');assert.equal(blur.opacities[3],0,'lost');
  blur.update([spin+Math.PI*2+spin,0,0,0],dt,[false,false,false,false]);assert.equal(blur.opacities[0],BLUR.most,'a full turn between looks wraps, not a spike');
  blur.update([0,0,0,0],dt,[false,false,false,false],1);const m=blur.discs[0].material;assert.ok(m.color.r<new T.Color(0xb0b4b8).r*BLUR.gaps,'brake dust darkens it');
  blur.update([1,1,1,1],NaN,[false,false,false,false]);blur.dispose();assert.equal(blur.discs.length,0);
});
test('main blurs offline cars’ wheels in play from their spin, clears them with the cars, with a QA hook',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('if(car.extendedDamage)wheelBlurs.set(car,new WheelBlur(car.wheels,vehicleWheelRadius(type)));'));
  assert.ok(main.includes("for(const c of cars)wheelBlurs.get(c)?.update([0,1,2,3].map(i=>c.wheelAngle(i)),dt,c.wreckParts.wheelLost,rimDust.get(c)?.value??0);"));
  assert.ok(main.includes('wheelBlurs.get(c)?.dispose();wheelBlurs.delete(c);')&&main.includes('wheelBlur: (id = 0) =>'));
  assert.ok(main.indexOf('fitHubcaps(car.root,car.wheels);')<main.indexOf('new WheelBlur(car.wheels'),'after the hubcaps go on');
});
