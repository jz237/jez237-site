import assert from 'node:assert/strict';
import {Vector3} from 'three';
import {ReefTourCamera,reefTourStops} from '../ReefTour.ts';
const position=new Vector3(0,3.25,17.7),target=new Vector3(0,2.67,0),camera=new ReefTourCamera(position,target);
for(const index of [0,1,2,3,4,5,2,0]){
 const before=position.clone();camera.start(index);assert.deepEqual(position.toArray(),before.toArray(),'starting a tour does not teleport');let last=position.clone();
 for(let i=0;i<180;i++){camera.update(1/60);assert.ok(position.toArray().every(Number.isFinite));assert.ok(position.z>=4.399,'all tour routes stay in front of the reef');assert.ok(position.distanceTo(last)<.35,'camera has no frame jump');last.copy(position);}
 assert.ok(!camera.active);assert.ok(position.distanceTo(new Vector3(...reefTourStops[index].position))<1e-9);assert.ok(target.distanceTo(new Vector3(...reefTourStops[index].target))<1e-9);
}
camera.start(4);camera.update(.3);camera.cancel();const stopped=position.clone();camera.update(2);assert.ok(position.equals(stopped),'interaction cancels travel');
camera.start(3,true);assert.ok(!camera.active);assert.ok(position.equals(new Vector3(...reefTourStops[3].position)),'reduced motion jumps to the chosen view');
camera.start(5);camera.update(.2);const interrupted=position.clone();camera.start(1);assert.ok(position.equals(interrupted),'rapid next/back starts at the visible pose');camera.update(3);assert.ok(position.equals(new Vector3(...reefTourStops[1].position)));
console.log('Tour camera continuity, front corridor, cancellation and reduced-motion checks passed.');
