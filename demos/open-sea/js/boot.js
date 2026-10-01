import {chooseShip} from './ship-choice.js';
const url=new URL(location),ships=new Set(['schooner','imperial']);
if(!ships.has(url.searchParams.get('ship'))){
  const chosen=await chooseShip('schooner');url.searchParams.set('ship',chosen);history.replaceState(null,'',url);
}
await import('./main.js');
