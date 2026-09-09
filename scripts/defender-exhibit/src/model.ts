import type {Group} from 'three';
/** GLTF's scene wrapper is not the animated cabinet assembly root. */
export function cabinetRoot(loaded:Group):Group {
 const root=loaded.getObjectByName('Arcade_1981');
 if(!root||!root.children.some(x=>x.name==='crt'))throw new Error('Missing cabinet assembly root');
 return root.clone(true) as Group;
}
