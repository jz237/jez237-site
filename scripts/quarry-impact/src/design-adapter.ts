import {normalizeSetup,type Setup} from './garage';
import {normalizeDesignSource} from './design-source';
import {validOnlineLivery} from './online-livery';
import type {CarKind} from './rules';
import type {PublishedDesign} from './design-client';
/** Downloads replace cosmetics only; no catalog value may alter performance. */
export function applyGarageDesign(current:Setup,kind:CarKind,design:PublishedDesign):Setup{
 if(design.kind!==kind)throw Error('Choose the matching car in the garage before using this design.');
 const designSource=normalizeDesignSource(design);
 if(!designSource||!validOnlineLivery(design.layers)||!Number.isInteger(design.paint)||design.paint<0||design.paint>0xffffff||!Number.isInteger(design.trim)||design.trim<0||design.trim>0xffffff)throw Error('Invalid downloaded design.');
 return normalizeSetup({...current,paint:design.paint,trim:design.trim,livery:design.layers,designSource},kind);
}
