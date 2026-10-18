// Numeric projection of ovl_i3's592C..5A3C qualification calculation. The
// selection scene computes these before entering the race; result6DCC/6FE0
// reads their retained values. This does not execute the menu initializer,
// reset standings, install graphics, or claim its temporary7020 scratch owner.
const required=[[0,1,2,4,8,12,16,0],[2,4,6,10,14,21,28,0],[2,4,8,12,16,23,30,37]];
const points=[7,4,2,1,0,0];
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid championship ${name}`);return v;}

export function nativeChampionshipQualificationView({profileWordsB330,scene}={}){
 const p=profileWordsB330;
 if(!Array.isArray(p)||![50,52].includes(p.length))throw new RangeError('Championship qualification requires retained profile words');
 const word=i=>integer(p[i],'profile word',0,0xffffffff)|0;
 const primary=integer(scene?.primaryHumanIndex,'primary slot',0,3),course=word(0);
 let bySlot;
 if(course===0)bySlot=[4,4,4,4];
 else{
  const round=integer(word(1),'round',0,7),difficulty=integer(word(2),'difficulty',0,2),threshold=required[difficulty][round];
  bySlot=Array.from({length:4},(_,slot)=>{
   const deficit=(threshold-word(4+slot))|0;
   let place=1;while(place<5&&points[place]>=deficit)place++;
   return place-1;
  });
 }
 return Object.freeze({requiredPlaceBySlot:Object.freeze(bySlot),primaryRequiredPlace:bySlot[primary]});
}
