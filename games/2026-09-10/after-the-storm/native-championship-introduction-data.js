// Numeric i3 overlay data from the supplied original ROM. The loader table at
// 800E4F30 copies data through7020, then clears BSS7020..7030. Bytes after the
// ROM image belong to the next overlay and are never initialization values.
// No texture, instruction or GPU asset is included in these numeric owners.
const panel=Object.freeze([0,0,0,0,0,0,0,0]);
const selection=Object.freeze([0,0,0,71,72,73,74,75,76,77,78,87,0,30,1048576,31,327680,32,4294639616,33,6,6,7,0,1,0,0,757542189,1076702509,0,757542189,1076702509,0,757542189,1076702509,0,0,0,0,0,0,0,0]);

/** Only use when the source actually loads i3. Warm frames keep their owners. */
export function createNativeChampionshipIntroductionStorage(){
 return {championshipIntroPanelWords6f64:[...panel],championshipSelectionWords6f84:[...selection]};
}
