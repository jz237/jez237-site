import {LIVERY_LIMIT,LIVERY_FACES,LIVERY_SHAPES,normalizeLivery,type LiveryLayer} from './livery-data';
import type {CarKind} from './rules';
import type {OnlineLoadout} from './online-setup';
export const LIVERY_MESSAGE_LIMIT=32768;
export type OnlineSelection=OnlineLoadout&{livery?:LiveryLayer[]};
export type SelectedLivery={kind:CarKind;layers:LiveryLayer[]};
export type LiveryFrame={revision:number;cars:(SelectedLivery&{id:number})[]};
const obj=(v:unknown):v is Record<string,any>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const range=(n:unknown,min:number,max:number)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
export function validOnlineLivery(value:unknown):value is LiveryLayer[]{
 return Array.isArray(value)&&value.length<=LIVERY_LIMIT&&value.every(l=>obj(l)&&LIVERY_FACES.includes(l.face)&&LIVERY_SHAPES.includes(l.shape)&&
  typeof l.name==='string'&&l.name.length<=24&&typeof l.text==='string'&&l.text.length<=16&&
  Number.isInteger(l.color)&&range(l.color,0,0xffffff)&&Number.isInteger(l.seed)&&range(l.seed,0,0xffffffff)&&
  ['x','y'].every(k=>range(l[k],-.5,1.5))&&['width','height'].every(k=>range(l[k],.02,2))&&range(l.rotation,-180,180)&&range(l.opacity,0,1)&&typeof l.flip==='boolean'&&typeof l.hidden==='boolean');
}
export function validSelectedLivery(v:unknown):v is SelectedLivery{return obj(v)&&['coupe','sedan','hatch'].includes(v.kind)&&validOnlineLivery(v.layers);}
export function validLiveryFrame(v:unknown,capacity:number):v is LiveryFrame{return obj(v)&&Number.isSafeInteger(v.revision)&&v.revision>=0&&Array.isArray(v.cars)&&v.cars.length===capacity&&new Set(v.cars.map(c=>c?.id)).size===capacity&&v.cars.every(c=>obj(c)&&Number.isInteger(c.id)&&c.id>=0&&c.id<capacity&&validSelectedLivery(c));}
export const copyOnlineLivery=(layers:readonly LiveryLayer[])=>normalizeLivery(layers);
