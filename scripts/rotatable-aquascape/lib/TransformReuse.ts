import {Mesh,type Scene} from 'three';

/** Existing aquarium meshes deform vertices or instance matrices; their own
 * local transforms are authored once. Fish parent groups remain dynamic.
 * Layer lessons explicitly call updateMatrix when moving plants/substrate.
 * Objects created later (food and lesson animations) keep normal updates. */
export function reuseUnchangedTransforms(scene:Scene){
 scene.updateMatrix();scene.matrixAutoUpdate=false;
 scene.traverse(object=>{if(object instanceof Mesh){object.updateMatrix();object.matrixAutoUpdate=false;}});
}
