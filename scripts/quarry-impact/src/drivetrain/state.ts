import type {WheelState} from './wheel';import type {EngineState} from './drive';import type {AutoGearState} from './gearing';
export type DriveState={engine:EngineState;wheels:WheelState[];gearbox:AutoGearState};
export type DriveSnapshot={version:1;engineOmega:number;wheels:WheelState[];gearbox:AutoGearState};
const bounded=(v:unknown,max:number)=>typeof v==='number'&&Number.isFinite(v)&&Math.abs(v)<=max;
/** Strictly versioned, independently owned state. Undefined is a legacy record,
 * not permission to silently reset an already-running drivetrain. */
export function readDriveSnapshot(value:unknown):DriveSnapshot{
 const v=value as DriveSnapshot,g=v?.gearbox;
 if(v?.version!==1||!bounded(v.engineOmega,10000)||!Array.isArray(v.wheels)||v.wheels.length!==4||Array.from(v.wheels).some(w=>!w||!bounded(w.omega,10000)||!bounded(w.angle,1e12))||!g||![-1,1,2,3,4,5].includes(g.gear)||!bounded(g.delay,.18)||g.delay<0||!bounded(g.cooldown,.65)||g.cooldown<0||!(g.pending===null||Number.isInteger(g.pending)&&g.pending>=1&&g.pending<=5&&g.gear>0&&Math.abs(g.pending-g.gear)===1)||g.pending===null&&g.delay!==0)throw new TypeError('Invalid or unsupported drivetrain snapshot');
 return{version:1,engineOmega:v.engineOmega,wheels:v.wheels.map(w=>({omega:w.omega,angle:w.angle})),gearbox:{gear:g.gear,delay:g.delay,cooldown:g.cooldown,pending:g.pending}};
}
export function captureDriveState(d:DriveState):DriveSnapshot{return readDriveSnapshot({version:1,engineOmega:d.engine.omega,wheels:d.wheels,gearbox:d.gearbox});}
export function restoreDriveState(d:DriveState,value:unknown){
 const saved=readDriveSnapshot(value); // Validate everything before changing live state.
 if(d.wheels.length!==4)throw new TypeError('Invalid target drivetrain');
 d.engine.omega=saved.engineOmega;for(let i=0;i<4;i++)Object.assign(d.wheels[i],saved.wheels[i]);Object.assign(d.gearbox,saved.gearbox);
}
