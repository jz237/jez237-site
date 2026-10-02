import type R from '@dimforge/rapier3d-compat';

/** The frozen references predate the rear handbrake/engine-force fix. Apply only
 * that reviewed policy to their controller commands, without rewriting their
 * source/dependency bytes, inputs, brake/grip constants or tyre/damage behavior.
 * Current production callers are never wrapped. Tern already has undriven rear
 * wheels, so retain its original force expression, including reverse signed zero.
 */
export function withHistoricalHandbrakePolicy<T>(controller:R.DynamicRayCastVehicleController,kind:string,handbrake:boolean,step:()=>T):T{
 if(!handbrake||kind==='tern')return step();
 const method=controller.setWheelEngineForce,own=Object.getOwnPropertyDescriptor(controller,'setWheelEngineForce');
 controller.setWheelEngineForce=function(wheel,force){return method.call(this,wheel,wheel>1?0:force);};
 try{return step();}
 finally{if(own)Object.defineProperty(controller,'setWheelEngineForce',own);else Reflect.deleteProperty(controller,'setWheelEngineForce');}
}
