import * as T from 'three';
/** Read-only traversal facade for Three's compile(scene,camera,targetScene).
 * Cached inactive venues must not be prepared against the active venue's
 * lighting. Keep hidden descendants inside active content: damage parts and
 * alternate LOD meshes may become visible as soon as the event starts.
 * No objects are cloned/reparented and no scene visibility is changed. */
export function programWarmupView(scene:T.Scene,excludedRoots:ReadonlySet<T.Object3D>){
 const view=new T.Group();view.name='active-program-warmup';
 view.traverse=(visit:(object:T.Object3D)=>void)=>{
  const walk=(object:T.Object3D)=>{if(excludedRoots.has(object))return;visit(object);for(const child of object.children)walk(child);};
  walk(scene);
 };
 // Deliberately no children: compile's separate traverseVisible light pass
 // uses the real targetScene, so lights are not added a second time here.
 return view;
}
