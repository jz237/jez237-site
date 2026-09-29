import {DEFINITIONS,type CarKind} from './rules';
export const unitNoise=(seed:number)=>{let n=Math.imul(Math.floor(seed*0x1000000)^0x6d2b79f5,0x45d9f3b);n=Math.imul(n^(n>>>16),0x45d9f3b);return((n^(n>>>16))>>>0)/4294967296;};
export function fireProfile(kind:CarKind,seed:number){
  const d=DEFINITIONS[kind],n=(offset:number)=>unitNoise(seed+offset);
  const side=n(1)<.5?-1:1;
  return {seed,scale:.78+n(2)*.45,soot:.7+n(3)*.3,pulse:n(4)*6.28,
    sites:[
      {name:'engine-left',zone:'front',x:-d.halfWidth*(.24+n(5)*.22),y:.18+n(6)*.12,z:d.halfLength*(.44+n(7)*.19),base:side<0?1:.42},
      {name:'engine-right',zone:'front',x:d.halfWidth*(.24+n(8)*.22),y:.18+n(9)*.12,z:d.halfLength*(.44+n(10)*.19),base:side>0?1:.42},
      {name:'left-sill',zone:'left',x:-d.halfWidth*.86,y:-.12,z:d.halfLength*(n(11)*.6-.1),base:.05},
      {name:'right-sill',zone:'right',x:d.halfWidth*.86,y:-.12,z:d.halfLength*(n(12)*.6-.1),base:.05},
      {name:'rear-leak',zone:'rear',x:side*d.halfWidth*(.24+n(13)*.35),y:-.14,z:-d.halfLength*(.48+n(14)*.22),base:.05},
    ]};
}
