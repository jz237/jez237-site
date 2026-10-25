/** Lamp bloom (offline, at dusk and in the rain): light far brighter than anything the dim sky lights — lamps, brake
 * lights, fire, lightning — spills a soft glow round itself, as it does in a camera or the eye. Only the scene's HDR light
 * above BLOOM.threshold blooms (paint, even pale paint in a car's own lamplight, stays below it), at BLOOM.strength with
 * BLOOM.radius spread. Not in daylight, where sunlit pale paint would glow too, and not on the medium graphics tier. */
export const BLOOM={threshold:2.2,strength:.6,radius:.45} as const;
export const bloomWanted=(quality:string,online:boolean,lighting:string|null|undefined)=>!online&&quality!=='medium'&&(lighting==='dusk'||lighting==='rain');
