export const AUDIO_OUTPUTS={speakers:'Stereo speakers',headphones:'Headphones · 3D positioning',mono:'Mono · same mix in both ears'} as const;
export type AudioOutput=keyof typeof AUDIO_OUTPUTS;
export function readAudioOutput(value:unknown):AudioOutput{return typeof value==='string'&&Object.hasOwn(AUDIO_OUTPUTS,value)?value as AudioOutput:'speakers';}
