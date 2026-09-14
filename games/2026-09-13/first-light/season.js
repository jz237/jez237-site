// Seasonal context for the lake (expanded in M3): water temperature and the optical preset.
import {lakeOptics} from './water-profile.js';
export function waterTempF(dayOfYear){return 58+22*Math.cos((dayOfYear-213)/365*Math.PI*2);}
export function seasonName(dayOfYear){return dayOfYear<75||dayOfYear>=340?'winter':dayOfYear<160?'spring':dayOfYear<260?'summer':'fall';}
export function seasonOptics(dayOfYear,rain=0){const s=seasonName(dayOfYear);return lakeOptics({season:s,rainDays:rain>.5?1:0,bloom:s==='summer'&&dayOfYear>200&&dayOfYear<245?.6:0});}
