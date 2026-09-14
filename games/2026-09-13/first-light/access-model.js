// Accessibility and comfort as numbers and names: the interface zoom for a text-size choice, the
// body classes for a HUD palette, and how simplified controls fill in for the player during a fight.
// Pure and node-tested; main.js applies the classes and calls the helpers.
export const TEXT_SIZES={normal:1,large:1.22,larger:1.45};
export const HUD_MODES=['standard','contrast','colorsafe'];
export function accessClasses(s={}){
 const zoom=TEXT_SIZES[s.textSize]||1;const classes=[];
 if(s.hudMode==='contrast')classes.push('hud-contrast');if(s.hudMode==='colorsafe')classes.push('hud-colorsafe');
 if(s.simple)classes.push('simple-controls');if(s.reduceMotion)classes.push('reduce-motion');
 return {zoom,classes};
}
// simplified controls: the hook sets itself a beat after the take, and the fight controller steps in whenever the player is not pressing anything
export const SIMPLE={hooksetDelay:.4,minCastPower:.7};
export function simpleFightInput(playerKeys,aiInput,fallback){const held=!!(playerKeys&&(playerKeys.reeling||playerKeys.sidePressure||playerKeys.rodUpHeld));return held?fallback:aiInput;}
export function simpleHookDue(phase,biteAt,t){return phase==='bite'&&t-biteAt>=SIMPLE.hooksetDelay;}
