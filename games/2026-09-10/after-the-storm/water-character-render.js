import * as T from './vendor/three.module.js';
import {characterField,CHARACTER_SIZE} from './water-character.js';
const texture=new T.DataTexture(characterField.data,CHARACTER_SIZE,CHARACTER_SIZE,T.RGBAFormat,T.FloatType);
texture.minFilter=texture.magFilter=T.NearestFilter;texture.needsUpdate=true;
export const characterUniforms={characterMap:{value:texture},characterActive:{value:0}};
let version=-1;
export function syncWaterCharacter(){characterUniforms.characterActive.value=characterField.active?1:0;if(version!==characterField.version){version=characterField.version;texture.needsUpdate=true;}}
