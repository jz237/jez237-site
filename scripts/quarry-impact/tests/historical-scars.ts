import {readLightContactPrevious} from './light-contact-invariants';
import {transform} from 'esbuild';
/** Preserve the old byte-equivalence experiments without requiring today's
 * intentionally redesigned light-contact dents to duplicate their appearance. */
const source=readLightContactPrevious('src/collision-scars.ts').toString();
const compiled=await transform(source.replace(/from '([^']+)'/g,(_all,path)=>`from '${path.startsWith('./')?new URL('../src/'+path.slice(2)+'.ts',import.meta.url).href:import.meta.resolve(path)}'`),{loader:'ts',format:'esm',target:'es2022'});
export const {markCollision}=await import('data:text/javascript;base64,'+Buffer.from(compiled.code).toString('base64')) as typeof import('../src/collision-scars');
