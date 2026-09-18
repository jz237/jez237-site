import * as T from 'three';
/** Individual anatomy, not reliable external sex markers. Applied once at load. */
export function angelfishProfile(p:T.Vector3,individual:number){
 const bump=(value:number,center:number,width:number)=>{const t=Math.abs((value-center)/width);return t>=1?0:(1-t*t)**2;};
 const forehead=bump(p.x,.44,.24)*bump(p.y,.31,.25);
 const belly=bump(p.x,.03,.39)*bump(p.y,-.32,.27);
 p.y+=forehead*(individual===0?.025:-.009)-belly*(individual===1?.035:0);
 if(individual===1)p.z*=1+belly*.08;
 return p;
}
