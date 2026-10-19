import {createCountyCourse} from './county-course';
/** Tight paved club lanes: a double-apex eastern loop, an infield chicane and a
 * long northern sweep back to the grid. */
export const ASHCOMBE=createCountyCourse({
 id:'ashcombe-lanes-v1',name:'Ashcombe Lanes',startZ:-118,
 controls:[[-125,-118],[0,-118],[125,-118],[172,-88],[184,-30],[150,14],[170,64],[124,124],[44,100],[-8,138],[-84,114],[-62,44],[-142,22],[-176,-52]],
 height:()=>0,asphalt:()=>true,
});
