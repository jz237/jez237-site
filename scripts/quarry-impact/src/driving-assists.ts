/** Saved driver preferences, independent of upgrades and AI difficulty. */
export type AssistLevel=0|0.5|1;
export type DrivingAssists={traction:AssistLevel;stability:AssistLevel;abs?:AssistLevel};
export const DEFAULT_ASSISTS:Readonly<DrivingAssists>=Object.freeze({traction:0,stability:1});
export const validAssistLevel=(v:unknown):v is AssistLevel=>v===0||v===.5||v===1;
export function validDrivingAssists(value:unknown):value is DrivingAssists{
 const v=value as DrivingAssists;return !!v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>k==='traction'||k==='stability'||k==='abs')&&validAssistLevel(v.traction)&&validAssistLevel(v.stability)&&(v.abs===undefined||validAssistLevel(v.abs));
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

/** Brake-pressure assistance for the raycast tyre model: reserve friction for
 * steering instead of treating chassis-derived wheel rotation as wheel slip.
 * Rapier measures brake demand as impulse, with a 0.5 longitudinal factor in
 * its friction ellipse. Previous-step lateral impulse estimates steering use.
 * Low-speed braking and the separate handbrake remain available for stopping. */
export function limitBrakeImpulse(demand:number,level:AssistLevel,contact:boolean,load:number,friction:number,sideImpulse:number,speed:number,dt:number):number{
 if(level===0||demand<=0||Math.abs(speed)<2)return demand;
 const budget=Math.max(0,load)*dt*Math.max(0,friction);
 const side=Math.min(Math.abs(sideImpulse),budget*.98);
 const capacity=contact?2*Math.sqrt(Math.max(0,budget*budget-side*side))*.85:0;
 return demand+(Math.min(demand,capacity)-demand)*level;
}
