// Player settings, persisted per the fleet convention (<game>_settings_v1).
const KEY='first_light_settings_v1';
export const DEFAULTS={quality:'auto',steadyCamera:false,fov:72,timeRate:4,weather:'calm',polarized:false,touchLeft:false,hint:true};
export function loadSettings(){try{return {...DEFAULTS,...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch{return {...DEFAULTS};}}
export function saveSettings(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch{}}
