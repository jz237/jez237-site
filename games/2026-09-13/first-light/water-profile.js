// Linear-light optical constants for Pennsylvania reservoir water: scatter (what the column adds)
// and absorption per metre (what it removes). Season and weather move the lake between presets;
// clarity is a Secchi-style multiplier on the path length.
const profiles={
 lake:{scatter:[.025,.075,.052],absorption:[.28,.15,.23]},          // After the Storm's freshwater preset: silted green
 lakeClear:{scatter:[.014,.052,.060],absorption:[.24,.11,.14]},     // cold, clear fall water
 lakeStained:{scatter:[.030,.062,.032],absorption:[.34,.24,.36]},   // after rain, tannic runoff
 lakeBloom:{scatter:[.040,.095,.040],absorption:[.32,.16,.30]}      // August algae
};
export function waterProfile(name){return profiles[name]||profiles.lake;}
export function lakeOptics({season='summer',rainDays=0,bloom=0}={}){
 const base=season==='fall'||season==='winter'?'lakeClear':bloom>.5?'lakeBloom':rainDays>0?'lakeStained':'lake';
 const p=waterProfile(base);const clarity=base==='lakeClear'?1.4:base==='lakeStained'?.6:base==='lakeBloom'?.7:1;
 return {profile:base,scatter:p.scatter,absorption:p.absorption,clarity};
}
