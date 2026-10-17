/** Original lower-output factory engines. Package IDs are persisted in setups.
 * Force represents the available wheel torque; the speed envelope follows the
 * cube-root power/drag approximation. Existing engines omit this field. */
export const ENGINE_RESTRICTIONS={r90:{label:'Road 90',output:.90},r75:{label:'Road 75',output:.75},r60:{label:'Road 60',output:.60},r45:{label:'Road 45',output:.45}} as const;
export type EngineRestriction=keyof typeof ENGINE_RESTRICTIONS;
export const isEngineRestriction=(value:unknown):value is EngineRestriction=>typeof value==='string'&&Object.hasOwn(ENGINE_RESTRICTIONS,value);
export function engineOutput(value:unknown){return isEngineRestriction(value)?ENGINE_RESTRICTIONS[value].output:1;}
