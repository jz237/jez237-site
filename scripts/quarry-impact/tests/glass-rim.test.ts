import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {GLASS_RIM,rimAxes,glassRim} from '../src/glass-rim';
test('the rim is laid out on the pane: its thin side is the normal, upright along it where it can be',()=>{
  // A side window: thin in x, 0.9 m long in z, 0.4 m tall in y.
  const side=rimAxes(new T.Box3(new T.Vector3(.8,1,-.4),new T.Vector3(.82,1.4,.5)));
  assert.ok(side.u.z===1&&side.v.y===1,'along the car and up the pane');assert.deepEqual(side.bounds.toArray(),[-.4,.5,1,1.4]);
  // A roof-light lying flat: thin in y; v the shorter broad axis.
  const flat=rimAxes(new T.Box3(new T.Vector3(-.3,1.5,-.6),new T.Vector3(.3,1.52,.6)));
  assert.ok(flat.v.x===1&&flat.u.z===1);
});
test('a shattered pane leaves its rim on its own shape, cut away inside, deeper along the bottom',()=>{
  const glass=new T.Mesh(new T.BoxGeometry(.02,.4,.9),new T.MeshPhysicalMaterial());glass.name='glass_side_left';glass.position.set(-.8,1.2,.1);glass.rotation.y=.05;
  const rim=glassRim(glass),material=rim.material as T.MeshStandardMaterial;
  assert.ok(rim.geometry===glass.geometry,'the pane shape, dents and all');assert.ok(rim.position.equals(glass.position)&&rim.quaternion.equals(glass.quaternion));
  assert.ok(material.transparent&&material.depthWrite===false&&material.side===T.DoubleSide&&rim.name==='glass_rim');
  const shader={uniforms:{} as Record<string,{value:unknown}>,vertexShader:'#include <common>\n#include <begin_vertex>',fragmentShader:'#include <common>\n#include <color_fragment>'};
  material.onBeforeCompile(shader as never,undefined as never);
  assert.ok(shader.fragmentShader.includes('if(edge>ragged)discard;'),'nothing inside the rim');
  assert.ok(shader.fragmentShader.includes(`${GLASS_RIM.bottom.toFixed(3)}*(1.-smoothstep(0.,.08,rv-rimBounds.z))`),'more held along the bottom');
  assert.ok((shader.uniforms.rimBounds.value as T.Vector4).w>(shader.uniforms.rimBounds.value as T.Vector4).z);
});
test('the car leaves a rim where a side window shatters, offline, and takes them away on repair',()=>{
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes('private leaveGlassRim(glass:T.Mesh){if(!this.extendedDamage||this.glassRims.has(glass)||!glass.parent)return;'),'offline, once each');
  assert.ok(vehicle.includes('{glass.visible=false;this.leaveGlassRim(glass);')&&vehicle.includes('glass.visible=false;this.leaveGlassRim(glass);const c=')&&vehicle.includes('{ glass.visible = false; if (!quiet) this.leaveGlassRim(glass); }'),'at every way a side window shatters');
  assert.ok(vehicle.includes('    this.clearGlassRims();\n    for (const g of this.glass) {\n      repairWreckGeometry(g);'),'repaired');
  assert.ok(vehicle.includes('  dispose() {\n    this.clearGlassRims();'),'disposed');
});
