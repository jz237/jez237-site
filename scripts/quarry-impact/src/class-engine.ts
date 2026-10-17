import {selectClassEngine} from './class-engine-physics';
import {ENGINE_RESTRICTIONS} from './engine-packages';
import {normalizeSetup,type Setup} from './garage';
import type {ClassLimit} from './performance-class-id';
import type {CarKind} from './rules';
/** Select a real engine package, never alter tyres/armor/tuning to meet a class.
 * The garage remains untouched. No ceiling means preserve the selected engine.
 * Lower-output factory engines replace upgrade stages rather than stacking. */
export function classEngineSetup(kind:CarKind,input:Setup|undefined,limit?:ClassLimit):Setup{
 const source=normalizeSetup(input,kind);if(!limit)return source;
 return normalizeSetup(selectClassEngine(kind,source,limit),kind);
}

export function classEngineDescription(kind:CarKind,input:Setup|undefined,limit:ClassLimit){
 const setup=classEngineSetup(kind,input,limit),name=classEngineLabel(setup);
 return `Your event engine: ${name}. Each car receives its strongest qualifying engine. Tires, reinforcement, tuning and appearance stay as saved; your garage is unchanged.`;
}

export const classEngineLabel=(setup:Pick<Setup,'engine'|'engineRestriction'>)=>setup.engineRestriction?ENGINE_RESTRICTIONS[setup.engineRestriction].label:['Stock','Club','Sport','Competition'][setup.engine];
