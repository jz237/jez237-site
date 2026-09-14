import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {porousCeramic,foamCells} from '../../living-aquascape/lib/aquarium/FilterMaterials.ts';

test('ceramic rings retain an open bore, finite pore normals and varied recessed skin',()=>{
 const geometry=porousCeramic(),p=geometry.getAttribute('position'),normal=geometry.getAttribute('normal');let min=Infinity,max=0;
 for(let i=0;i<p.count;i++){const r=Math.hypot(p.getX(i),p.getZ(i));assert.ok(r>.052&&r<.107);assert.ok(Math.abs(p.getY(i))<.097);assert.ok(Number.isFinite(normal.getX(i)+normal.getY(i)+normal.getZ(i)));if(r>.083&&Math.abs(p.getY(i))<.075){min=Math.min(min,r);max=Math.max(max,r);}}
 assert.ok(max-min>.003,'actual surface indentations');assert.ok(p.count>10000);geometry.dispose();
});

test('foam cells expose gaps between connected struts within the basket',()=>{
 const mesh=foamCells(1.06,.44,.115,new T.MeshStandardMaterial());assert.ok(mesh.count>2000);
 const matrix=new T.Matrix4(),p=new T.Vector3(),q=new T.Quaternion(),scale=new T.Vector3();
 for(let i=0;i<mesh.count;i++){mesh.getMatrixAt(i,matrix);matrix.decompose(p,q,scale);assert.ok(Math.hypot(p.x,p.z)<1.061);assert.ok(Math.abs(p.y)<=.221);assert.ok(scale.y>0&&scale.y<.3);}
 mesh.geometry.dispose();mesh.material.dispose();
});
