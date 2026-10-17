import {vehicleSpecification,type VehicleSpecification} from '../vehicle-physics';
import {vehicleWheelRadius} from '../classic-vehicle-specs';
import type {CarKind} from '../rules';
import {PROTOTYPE_ENGINE} from './drive';
const reference=vehicleSpecification('coupe'),referenceRadius=vehicleWheelRadius('coupe');
/** Translate the existing garage's authored force and gearing into torque and
 * final drive. Short gearing increases wheel torque, never engine torque.
 * This preserves roster/upgrade intent; it is not real-world engine telemetry. */
export function createDriveCalibration(kind:CarKind){
 const stock=vehicleSpecification(kind),radiusScale=vehicleWheelRadius(kind)/referenceRadius;
 const stockFinal=reference.speedLimit/stock.speedLimit*radiusScale;
 return(spec:VehicleSpecification)=>{
  const gearing=stock.gearStep/spec.gearStep,ratioScale=stockFinal*gearing;
  const peakTorque=PROTOTYPE_ENGINE.peakTorque*(spec.force/gearing/reference.force)*radiusScale/stockFinal;
  return{ratioScale,engine:{...PROTOTYPE_ENGINE,peakTorque,clutchTorque:peakTorque*1.25,inertia:PROTOTYPE_ENGINE.inertia*Math.max(.5,peakTorque/PROTOTYPE_ENGINE.peakTorque)}};
 };
}
