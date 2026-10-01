import {DEFINITIONS,type CarKind} from './rules';
export const unitNoise=(seed:number)=>{let n=Math.imul(Math.floor(seed*0x1000000)^0x6d2b79f5,0x45d9f3b);n=Math.imul(n^(n>>>16),0x45d9f3b);return((n^(n>>>16))>>>0)/4294967296;};
export function fireProfile(kind:CarKind,seed:number){
  const d=DEFINITIONS[kind],n=(offset:number)=>unitNoise(seed+offset);
  const side=n(1)<.5?-1:1;
  return {seed,scale:.65+n(2)*.40,soot:.65+n(3)*.35,pulse:n(4)*6.28,
    sites:[
      {name:'engine-left',zone:'front',x:-d.halfWidth*(.24+n(5)*.32),y:.12+n(6)*.19,z:d.halfLength*(.40+n(7)*.24),base:side<0?1:.06},
      {name:'engine-right',zone:'front',x:d.halfWidth*(.24+n(8)*.32),y:.12+n(9)*.19,z:d.halfLength*(.40+n(10)*.24),base:side>0?1:.06},
      {name:'left-sill',zone:'left',x:-d.halfWidth*.86,y:-.12,z:d.halfLength*(n(11)*.6-.1),base:0},
      {name:'right-sill',zone:'right',x:d.halfWidth*.86,y:-.12,z:d.halfLength*(n(12)*.6-.1),base:0},
      {name:'rear-leak',zone:'rear',x:side*d.halfWidth*(.24+n(13)*.35),y:-.14,z:-d.halfLength*(.48+n(14)*.22),base:.7},
    ]};
}
