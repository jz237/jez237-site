import type {CarKind} from './rules';
import type {LiveryLayer} from './livery-data';
export type Design={id:string;revision:number;name:string;creator:string;kind:CarKind;paint:number;trim:number;layers:LiveryLayer[];allowRemix:boolean;created:number;updated:number};
