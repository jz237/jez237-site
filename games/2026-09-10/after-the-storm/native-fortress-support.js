import {nativeAdditionalStuntSupportGeometry} from './native-additional-stunt-support.js';

// Original71E70 selects identical floor/shore resources for one/two players.
// Box planes belong to mode-specific canonical object startup and movement.
const shared=nativeAdditionalStuntSupportGeometry({courseIndex:3});
const geometry=Object.freeze({floor:shared.floor,shore:shared.shore});
export function nativeFortressSupportGeometry({players=1}={}){
 if(![1,2].includes(players))throw new RangeError('Fortress support requires one or two players');
 return geometry;
}
