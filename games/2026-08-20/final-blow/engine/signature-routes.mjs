// Preferences, not scripted automatic combos. Reach, meter, confirms and legal
// cancel windows are checked by selectComboContinuation before a route can win.
export const SIGNATURE_ROUTES=Object.freeze({
 jez:[['light','heavy','launcher'],['light','commandSpecial']],
 benny:[['light','commandSpecial','launcher'],['light','heavy','backSpecial']],
 alan:[['light','heavy','launcher'],['light','backSpecial']],
 ali:[['light','special','commandSpecial'],['light','heavy','launcher']],
 commissioner:[['light','heavy','commandSpecial'],['light','special']],
 cyraxx:[['light','special'],['light','heavy','backSpecial']],
 deathblow:[['light','heavy','commandSpecial'],['light','launcher']],
 devil:[['light','heavy','launcher'],['light','commandSpecial']],
 donald:[['light','special'],['light','heavy','launcher']],
 post:[['light','commandSpecial'],['light','heavy','special']],
});
export function signatureNext(id,current,variant=0) {
 const routes=SIGNATURE_ROUTES[id]||SIGNATURE_ROUTES.jez;
 const ordered=[routes[Math.abs(variant)%routes.length],...routes];
 return [...new Set(ordered.flatMap(route=>{const at=route.indexOf(current);return at>=0&&at+1<route.length?[route[at+1]]:[];}))];
}
