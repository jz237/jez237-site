import * as T from 'three';
import {CHASE_VIEW,chaseComposition}from'./quarry-art-direction';
export const CAMERA_DEFAULTS={distance:CHASE_VIEW.distance,height:CHASE_VIEW.height,fov:CHASE_VIEW.fov,shake:1};
export type CameraSettings={distance:number;height:number;fov:number;shake:number};
export const CAMERA_LIMITS={distance:[6,14],height:[1.5,5],fov:[40,80],shake:[0,1]}as const;
export function readCameraSettings(raw:unknown):CameraSettings{
 const v=raw&&typeof raw==='object'?raw as Partial<CameraSettings>:{};
 const out:CameraSettings={...CAMERA_DEFAULTS};for(const key of Object.keys(CAMERA_LIMITS)as(keyof CameraSettings)[]){const n=v[key],limits=CAMERA_LIMITS[key];if(typeof n==='number'&&Number.isFinite(n))out[key]=Math.max(limits[0],Math.min(limits[1],n));}return out;
}
export function validCameraSettings(raw:unknown):raw is CameraSettings{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return false;
 const v=raw as Record<string,unknown>;return Object.keys(v).length===4&&Object.entries(CAMERA_LIMITS).every(([key,[min,max]])=>typeof v[key]==='number'&&Number.isFinite(v[key])&&(v[key]as number)>=min&&(v[key]as number)<=max);
}
/** Player preferences deliberately do not alter the broadcast/demo director. */
export function playerChaseComposition(position:T.Vector3,forward:T.Vector3,speed:number,settings:CameraSettings){
 const view=chaseComposition(position,forward,speed);
 view.position.addScaledVector(forward,CHASE_VIEW.distance-settings.distance);view.position.y+=settings.height-CHASE_VIEW.height;return view;
}
export function mountCameraSettings(parent:HTMLElement,settings:CameraSettings,save:()=>void){
 const panel=document.createElement('fieldset');panel.className='camera-settings';const legend=document.createElement('legend');legend.textContent='DRIVING CAMERA';panel.append(legend);
 const names={distance:'Chase distance',height:'Chase height',fov:'Chase field of view',shake:'Impact camera shake'};
 const fields=new Map<keyof CameraSettings,{input:HTMLInputElement;output:HTMLOutputElement}>();
 const format=(key:keyof CameraSettings)=>key==='shake'?Math.round(settings[key]*100)+'%':key==='fov'?Math.round(settings[key])+'°':settings[key].toFixed(1)+' m';
 for(const key of Object.keys(names)as(keyof CameraSettings)[]){const label=document.createElement('label'),input=document.createElement('input'),output=document.createElement('output');label.textContent=names[key]+' ';input.type='range';input.id='camera-'+key;input.min=String(CAMERA_LIMITS[key][0]);input.max=String(CAMERA_LIMITS[key][1]);input.step=key==='fov'?'1':key==='shake'?'.05':'.1';input.value=String(settings[key]);output.value=format(key);label.append(input,output);panel.append(label);fields.set(key,{input,output});input.oninput=()=>{settings[key]=readCameraSettings({...settings,[key]:Number(input.value)})[key];output.value=format(key);save();};}
 const help=document.createElement('p');help.textContent='C cycles chase, hood and dashboard. Chase adjustments affect your driving view. Impact shake applies to all three driving views; set it to 0% for a steady impact camera. Demo cameras keep their own framing.';panel.append(help);
 const reset=document.createElement('button');reset.type='button';reset.id='camera-reset';reset.className='small-button';reset.textContent='RESET CAMERA';reset.onclick=()=>{Object.assign(settings,CAMERA_DEFAULTS);for(const[key,{input,output}]of fields){input.value=String(settings[key]);output.value=format(key);}save();};panel.append(reset);parent.append(panel);
}
