import {encodeOnlinePacket,decodeOnlinePacket} from './online-race-codec.js';
import {normalizeWindowControls,neutralWindowControls} from './player-window-protocol.js';
import {readWindowFrame} from './player-window-presentation.js';
export const ONLINE_VERSION=1,ONLINE_BUILD='2.43.0',ONLINE_STUN='stun:stun.cloudflare.com:3478';
export const ONLINE_INPUT_STALE_MS=250,ONLINE_LINK_STALE_MS=3500;
const courses=new Set(['greyhaven','amber','reed','citadel','port','neon','tempest','glacier','practice']);
const token=s=>typeof s==='string'&&/^[a-f0-9]{32}$/.test(s);
export const onlineToken=(crypto=globalThis.crypto)=>[...crypto.getRandomValues(new Uint8Array(16))].map(n=>n.toString(16).padStart(2,'0')).join('');
const plain=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
export function onlineGuestSetup(value){
 if(!plain(value)||!Number.isInteger(value.rider)||value.rider<0||value.rider>3||typeof value.name!=='string'||value.name.length>32||!value.name.trim()||!plain(value.tune))return null;
 const tune={};for(const k of ['engine','grip','handling']){const n=value.tune[k];if(!Number.isFinite(n)||n< -1||n>1||!Number.isInteger(n*4))return null;tune[k]=n;}
 return {rider:value.rider,name:value.name.trim(),tune};
}
export function onlinePlayerInput(value){
 const pair=normalizeWindowControls([neutralWindowControls()[0],value]);return pair?.[1]??null;
}
export function validateOnlineDescriptor(value){
 if(!plain(value)||!courses.has(value.course)||!Number.isInteger(value.difficulty)||value.difficulty<0||value.difficulty>3||
  ![3,4,5,6,9].includes(value.laps)||!['course','surf','calm','chop','storm'].includes(value.seaState)||typeof value.freeRide!=='boolean'||typeof value.swapColours!=='boolean'||
  !Number.isSafeInteger(value.waveSeed)||value.waveSeed<0||value.waveSeed>0xffffffff||!Array.isArray(value.roster)||value.roster.length!==2||value.roster.some(n=>!Number.isInteger(n)||n<0||n>3)||
  !Array.isArray(value.names)||value.names.length!==4||value.names.some(n=>typeof n!=='string'||n.length>64)||!readWindowFrame(value.initialFrame))return null;
 const nativeScene=Object.hasOwn(value,'nativeSceneCourseIndex')||Object.hasOwn(value,'nativeSceneMode');
 if(nativeScene&&(![3,4,5,6].includes(value.nativeSceneCourseIndex)||value.nativeSceneMode!=='race'||value.course!==({3:'citadel',4:'reed',5:'port',6:'neon'})[value.nativeSceneCourseIndex]||value.nativeSceneCourseIndex===6&&value.difficulty===0||value.freeRide||value.seaState!=='course'||!value.initialFrame.nativeCourseWorld))return null;
 if(value.initialFrame.nativeCourseWorld&&!nativeScene)return null;
 return {course:value.course,difficulty:value.difficulty,laps:value.laps,seaState:value.seaState,freeRide:value.freeRide,swapColours:value.swapColours,waveSeed:value.waveSeed,
  ...(nativeScene?{nativeSceneCourseIndex:value.nativeSceneCourseIndex,nativeSceneMode:'race'}:{}),
  roster:[...value.roster],names:[...value.names],initialFrame:value.initialFrame};
}
export function onlineEnvelope(session,type,data={}){if(!token(session))throw new TypeError('Invalid online session');return {v:ONLINE_VERSION,build:ONLINE_BUILD,session,type,...data};}
export function validOnlineEnvelope(value,session){return plain(value)&&value.v===ONLINE_VERSION&&value.build===ONLINE_BUILD&&token(session)&&value.session===session&&typeof value.type==='string';}
function toBase64(bytes){let text='';for(let i=0;i<bytes.length;i+=8192)text+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(text).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');}
function fromBase64(text){if(!/^[A-Za-z0-9_-]+$/.test(text)||text.length>65536)throw new RangeError('Invalid connection code');return Uint8Array.from(atob(text.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));}
export async function encodeOnlineSignal(value){validateSignal(value);return 'ATS1.'+toBase64(await encodeOnlinePacket(value));}
function validateSignal(v,{now=Date.now()}={}){
 if(!plain(v)||v.v!==ONLINE_VERSION||v.build!==ONLINE_BUILD||!token(v.session)||!['offer','answer'].includes(v.type)||typeof v.sdp!=='string'||v.sdp.length<20||v.sdp.length>32768||!v.sdp.startsWith('v=0')||
  !Number.isSafeInteger(v.created)||v.created>now+300000||now-v.created>7200000)throw new TypeError('This connection code is invalid, expired, or from a different game version. Create a fresh invite.');
 return v;
}
export async function decodeOnlineSignal(text,options){
 if(typeof text!=='string'||text.length>70000)throw new RangeError('Connection code is too long');let code=text.trim();
 if(/^https?:\/\//i.test(code)){const url=new URL(code);code=new URLSearchParams(url.hash.slice(1)).get('invite')??'';}
 if(!code.startsWith('ATS1.'))throw new TypeError('Paste an After the Storm invite link or return code.');
 return validateSignal(await decodeOnlinePacket(fromBase64(code.slice(5))),options);
}
