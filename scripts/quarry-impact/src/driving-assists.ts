/** Saved driver preferences, independent of upgrades and AI difficulty. */
export type AssistLevel=0|0.5|1;
export type DrivingAssists={traction:AssistLevel;stability:AssistLevel};
export const DEFAULT_ASSISTS:Readonly<DrivingAssists>=Object.freeze({traction:0,stability:1});
export const validAssistLevel=(v:unknown):v is AssistLevel=>v===0||v===.5||v===1;
export function validDrivingAssists(value:unknown):value is DrivingAssists{
 const v=value as DrivingAssists;return !!v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===2&&validAssistLevel(v.traction)&&validAssistLevel(v.stability);
}
/** The raycast tyre model has no independent driven-wheel angular velocity.
 * Limit motor demand using measured contact load and chassis side slip instead
 * of inventing an RPM-derived wheelspin signal. The assist only removes torque;
 * it never adds grip, corrects velocity or resists a deliberate handbrake turn. */
export function limitTractionForce(force:number,level:AssistLevel,contact:boolean,load:number,lateralSpeed:number,surface:'asphalt'|'gravel',grip:number):number{
 if(level===0||force===0)return force;
 const slip=Math.max(0,Math.abs(lateralSpeed)-1.5),reserve=1/(1+slip*.35);
 const capacity=contact?Math.max(0,load)*(surface==='asphalt'?3.2:2.4)*Math.max(0,grip)*reserve:0;
 const limited=Math.sign(force)*Math.min(Math.abs(force),capacity);
 return force+(limited-force)*level;
}
