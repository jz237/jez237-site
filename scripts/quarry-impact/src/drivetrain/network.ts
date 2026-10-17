import {readDriveSnapshot,type DriveSnapshot} from './state';
/** Missing model identifies legacy authority. Never silently reset a partial or
 * future angular snapshot: validate every car before a restore mutates physics. */
export function readNetworkDrives(snapshot:{driveModel?:unknown;cars:readonly {drivetrain?:unknown}[]}):DriveSnapshot[]|undefined{
 if(snapshot.driveModel===undefined){
  if(snapshot.cars.some(c=>c.drivetrain!==undefined))throw new TypeError('Drivetrain state without model');
  return undefined;
 }
 if(snapshot.driveModel!=='angular-v1')throw new TypeError('Unsupported drivetrain model');
 return snapshot.cars.map(c=>readDriveSnapshot(c.drivetrain));
}
export function validNetworkDrives(snapshot:{driveModel?:unknown;cars:readonly {drivetrain?:unknown}[]}):boolean{
 try{readNetworkDrives(snapshot);return true;}catch{return false;}
}
