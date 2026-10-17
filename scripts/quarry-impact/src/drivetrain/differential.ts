import type {WheelState} from './wheel';
/** Torque-limited axle clutch. Predict wheel speeds under engine torque, then
 * exchange equal/opposite angular impulse. Open (-1) transmits equal engine
 * torque without coupling; +1 has the strongest preload and power lock.
 * No angular momentum is created and coupling cannot add rotational energy. */
export function axleTorques(wheels:readonly WheelState[],torques:readonly number[],inertias:readonly number[],setting:number,dt:number):[number,number]{
 if(wheels.length!==2||torques.length!==2||inertias.length!==2||![setting,dt,...torques,...inertias,...wheels.map(w=>w.omega)].every(Number.isFinite)||dt<=0||inertias.some(v=>v<=0)||setting< -1||setting>1)throw new RangeError('Invalid axle differential');
 const strength=((setting+1)/2)**2;
 const left=wheels[0].omega+torques[0]*dt/inertias[0],right=wheels[1].omega+torques[1]*dt/inertias[1];
 const capacity=strength*(60+.8*Math.abs(torques[0]+torques[1]))*dt;
 const impulse=Math.max(-capacity,Math.min(capacity,(left-right)/(1/inertias[0]+1/inertias[1])));
 return[torques[0]-impulse/dt,torques[1]+impulse/dt];
}
