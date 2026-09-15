import {createElement} from 'react';
import {createRoot} from 'react-dom/client';
import FilterBreakdown from '../../living-aquascape/components/FilterBreakdown';
/** Downloaded only when someone opens the shared filter exhibit. */
export function mountFilter(host:HTMLElement,part:number,onClose:()=>void){
 const root=createRoot(host);
 root.render(createElement(FilterBreakdown,{initialPart:part,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,onClose}));
 return ()=>root.unmount();
}
