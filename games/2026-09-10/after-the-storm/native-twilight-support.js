import {nativeAdditionalStuntSupportGeometry} from './native-additional-stunt-support.js';

// Both player counts select the same original companion image and all eight
// floor/shore resource pointers. Mode-specific boxes remain canonical objects.
const shared=nativeAdditionalStuntSupportGeometry({courseIndex:6});
const geometry=Object.freeze({floor:shared.floor,shore:shared.shore});
export function nativeTwilightSupportGeometry({players=1}={}){
 if(![1,2].includes(players))throw new RangeError('Twilight support requires one or two players');
 return geometry;
}
