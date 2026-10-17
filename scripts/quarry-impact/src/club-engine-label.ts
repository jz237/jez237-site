import {classEngineLabel} from './class-engine';
import {performanceLabel} from './performance-class';
import type {Setup} from './garage';
import type {CarKind} from './rules';
/** Describe the actual running build, rather than recomputing the preview. */
export function clubEngineLabel(policy:'class-v1'|undefined,kind:CarKind,setup:Setup){return policy?`Class-matched engine · ${classEngineLabel(setup)} · ${performanceLabel(kind,setup)} · Stock chassis`:'Factory stock';}
