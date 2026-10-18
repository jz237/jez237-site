import {nativeAdditionalStuntSupportGeometry} from './native-additional-stunt-support.js';

//71E70 selects identical Drake floor/shore pointers for one and two players.
// These resources precede mode-specific object loading; ordinary Drake has
// no box/ramp bodies. Reuse verified geometry without copying its large grids.
const shared=nativeAdditionalStuntSupportGeometry({courseIndex:4});
const geometry=Object.freeze({...shared,boxes:Object.freeze({count0578:0,rows:Object.freeze([])})});
export function nativeDrakeSupportGeometry({players=1}={}){
 if(![1,2].includes(players))throw new RangeError('Drake support requires one or two players');
 return geometry;
}
