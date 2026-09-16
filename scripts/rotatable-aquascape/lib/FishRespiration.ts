/** Illustrative buccal/opercular rhythm, independent of locomotor strokes.
 * Rates are visual tuning, not measured species-specific ventilation data. */
export class FishRespiration{
 mouth=0;gill=0;private phase:number;private effort=0;private age:number;private rate:number;
 constructor(seed=0,rate=1.15){this.phase=seed*2.13;this.age=seed;this.rate=rate;}
 update(dt:number,effort:number){
  if(!Number.isFinite(dt)||dt<=0)return;
  dt=Math.min(dt,.1);this.age+=dt;
  this.effort+=(Math.max(0,Math.min(1,effort))-this.effort)*(1-Math.exp(-dt*2));
  this.phase+=dt*2*Math.PI*(this.rate+.45*this.effort+.035*Math.sin(this.age*.43));
  this.mouth=Math.pow(.5+.5*Math.sin(this.phase),1.6);
  this.gill=Math.pow(.5+.5*Math.sin(this.phase-Math.PI*.60),1.25);
 }
}
