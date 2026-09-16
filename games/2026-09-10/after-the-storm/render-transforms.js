// Refraction, reflection and the main view share one set of object transforms.
// Cameras still update independently. Call again for each split-screen view,
// after its sky/light/rain positions have been assigned.
export function prepareRenderTransforms(scene){
 const automatic=scene.matrixWorldAutoUpdate;
 if(automatic){scene.updateMatrixWorld();scene.matrixWorldAutoUpdate=false;}
 return automatic;
}
export function restoreRenderTransforms(scene,automatic){scene.matrixWorldAutoUpdate=automatic;}
