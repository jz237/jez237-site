import {createElement} from 'react';
import {createRoot} from 'react-dom/client';
import FilterBreakdown from '../../living-aquascape/components/FilterBreakdown';
import type {Aquarium} from './Aquarium';

/** The photographic and rotatable aquariums share this exact filter exhibit. */
export function installFilterExperience(aquarium:Aquarium){
 let mounted=false;
 aquarium.onFilterRequest=(part=3)=>{
  if(mounted)return;
  mounted=true;
  const previousPause=aquarium.paused,focus=document.activeElement as HTMLElement|null;
  aquarium.paused=true; aquarium.filterOpen=true;
  const host=document.createElement('div');document.querySelector('main')!.append(host);
  const root=createRoot(host);
  root.render(createElement(FilterBreakdown,{initialPart:part,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,onClose:()=>{
   root.unmount();host.remove();mounted=false;aquarium.filterOpen=false;aquarium.paused=previousPause;document.dispatchEvent(new Event('aquascape-filter-closed'));focus?.focus();
  }}));
 };
}
