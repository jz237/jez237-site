import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {footTransfer,transferTiming} from '../lib/FootTransfer';
import {RestTransition} from '../lib/RestTransition';
import {PreyObservation} from '../lib/PreyObservation';
import {AdaptiveQuality} from '../lib/AdaptiveQuality';
import {Surface} from '../lib/Surface';

test('descending steps spend longer lowering and blocked transfers retrace the same path',()=>{
  const high=new THREE.Vector3(0,.04,0),low=new THREE.Vector3(.04,0,.015);
  assert.ok(transferTiming(high.y,low.y,.04).lowerStart<transferTiming(low.y,high.y,.04).lowerStart);
  for(let i=0;i<=100;i++){
    const p=footTransfer(high,low,.04,i/100,.012),q=footTransfer(low,high,.04,1-i/100,.012);
    assert.ok(p.distanceTo(q)<1e-10,'reversal cannot pop an airborne foot');
    assert.ok(p.y>=0&&p.y<=.05200001);
  }
});

test('resting trunk waits for touchdown, then relaxes and wakes without a speed jump',()=>{
  const r=new RestTransition();
  for(let i=0;i<120;i++)assert.equal(r.update(1/60,true,true,0,0).bodyRate,0);
  for(let i=0;i<60;i++)r.update(1/60,true,false,0,0);
  assert.ok(r.settled>.9);assert.ok(r.update(1/60,true,false,0,0).adjust);
  const wake=r.update(1/60,false,false,0,0);assert.ok(wake.advance>.25&&wake.advance<.4);
  for(let i=0;i<30;i++)r.update(1/60,false,false,.1,0);
  assert.equal(r.readiness,1);
});

test('pursuit predicts observed motion, forgets unseen motion and bounds its lead',()=>{
  const o=new PreyObservation();
  for(let i=0;i<60;i++)o.update(1/60,new THREE.Vector3(i/60*.10,0,0),true);
  const lead=o.predict(.4,false,0);assert.ok(lead.x>o.position.x+.01&&lead.x-o.position.x<=.055);
  const last=o.position.clone();
  for(let i=0;i<60;i++)o.update(1/60,new THREE.Vector3(20,20,20),false);
  assert.ok(o.position.equals(last));assert.ok(o.predict(.4,false,0).equals(last));
  o.update(.1,new THREE.Vector3(.2,0,0),true);assert.equal(o.velocity.length(),0,'reacquisition does not invent a huge velocity');
});

test('hardscape visibility cannot see a cricket through wood',()=>{
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(.04,.1,.1),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));mesh.position.y=.15;
  const s=new Surface(new THREE.Mesh(),[{mesh,kind:2}],.04);
  assert.equal(s.visibleFrom(new THREE.Vector3(-.1,.15,0),new THREE.Vector3(.1,.15,0)),false);
  assert.equal(s.visibleFrom(new THREE.Vector3(-.1,.3,0),new THREE.Vector3(.1,.3,0)),true);
});

test('adaptive graphics need sustained slow frames and recover slowly without oscillating',()=>{
  const q=new AdaptiveQuality();let changes=0;
  for(let i=0;i<60*3;i++)changes+=Number(q.record(1/60,3));
  q.record(.18,3);assert.equal(q.level,0,'one hitch cannot lower detail');
  for(let i=0;i<30*15;i++)changes+=Number(q.record(1/30,3));
  assert.ok(q.level>0&&changes<=2);
  const low=q.level;
  for(let i=0;i<60*10;i++)q.record(1/60,3);
  assert.equal(q.level,low,'recovery does not immediately undo the improvement');
  for(let i=0;i<60*35;i++)q.record(1/60,3);
  assert.ok(q.level<low);
  const physics=new AdaptiveQuality();for(let i=0;i<600;i++)physics.record(1/30,28);
  assert.equal(physics.level,0,'graphics changes cannot solve a CPU contact bottleneck');
  const hidden=new AdaptiveQuality();for(let i=0;i<600;i++)hidden.record(1,0,false);
  assert.equal(hidden.level,0,'background suspension is not poor rendering performance');
  const capped=new AdaptiveQuality();let trials=0;for(let i=0;i<30*300;i++)trials+=Number(capped.record(1/30,3));
  assert.equal(capped.level,0,'restore detail when reducing graphics cannot improve a capped display');
  assert.equal(trials,2,'unchanged display throttling cannot repeatedly lower and restore detail');
});
