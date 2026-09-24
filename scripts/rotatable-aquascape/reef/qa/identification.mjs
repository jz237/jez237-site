import assert from 'node:assert/strict';
import * as T from 'three';
import {identifyGeometry,mergeIdentified,foodNote,pickNote} from '../ReefIdentification.ts';
import {reefDrawOrderReady,optimizeReefDrawOrder} from '../ReefDrawOrder.ts';
const a={title:'Rock',description:'rock'},b={title:'Polyp',description:'polyp'};
for(const indexed of [true,false]){
 const shape=x=>{let g=new T.SphereGeometry(.4,32,24);g.translate(x,0,0);return indexed?g:g.toNonIndexed();};
 const left=identifyGeometry(shape(-1),a),right=identifyGeometry(shape(1),b),first=mergeIdentified([left,right]);
 const mesh=new T.Mesh(mergeIdentified([first,shape(3)]),new T.MeshBasicMaterial());mesh.userData.note=a;
 await reefDrawOrderReady;optimizeReefDrawOrder(mesh);mesh.updateMatrixWorld();
 const ray=new T.Raycaster();ray.set(new T.Vector3(1,0,3),new T.Vector3(0,0,-1));assert.equal(pickNote(ray,[mesh],[]).title,b.title,'identify a merged patch after triangle reordering');
 const pane=new T.Mesh(new T.PlaneGeometry(10,10),new T.MeshBasicMaterial());pane.position.z=2;pane.userData.note={title:'Glass',description:''};pane.updateMatrixWorld();assert.equal(pickNote(ray,[mesh],[pane]).title,b.title,'glass does not hide the contents');
 const parent=new T.Group();parent.add(mesh);parent.visible=false;assert.equal(pickNote(ray,[mesh],[pane]).title,'Glass','hidden ancestor must not be identified');
}
console.log('Merged indexed/nonindexed labels, triangle reordering, transparent panes and hidden ancestors passed.');

const food=new T.InstancedMesh(new T.SphereGeometry(.1),new T.MeshBasicMaterial(),1);food.userData.note=foodNote;food.count=0;
const ray=new T.Raycaster(new T.Vector3(2,0,3),new T.Vector3(0,0,-1));assert.equal(pickNote(ray,[food],[]),undefined);
food.count=1;food.setMatrixAt(0,new T.Matrix4().makeTranslation(2,0,0));food.updateMatrixWorld();assert.equal(pickNote(ray,[food],[]).title,'Food morsel','new food must remain pickable after an empty instance raycast');
