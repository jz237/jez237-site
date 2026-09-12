import fs from 'node:fs';
import {createHash} from 'node:crypto';
export const routeSources=['lib/Corydoras.ts','lib/CoryFloorRoutes.ts','lib/GrazerPlants.ts','lib/BotanicalPlants.ts','lib/ScannedBranch.ts','lib/ScannedRock.ts','lib/AquariumPlumbing.ts','lib/SwordCurrent.ts','tests/cory-habitat-fixture.mjs'];
export function routeSourceHash(file){let source=fs.readFileSync(new URL(file,import.meta.url),'utf8').replace(/\r\n/g,'\n');if(file==='lib/Corydoras.ts')source=source.slice(source.indexOf('export function coryBody'),source.indexOf('const random'))+source.slice(source.indexOf(' private floor('),source.indexOf(' private clear('));if(file==='lib/CoryFloorRoutes.ts')source=source.slice(0,source.indexOf('\n route('));return createHash('sha256').update(source).digest('hex');}
