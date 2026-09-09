import { woodlandCrown } from './woodland.js?v=philly-2026090904';

/** A world-aligned lattice keeps trees in the same place across imagery tiles. */
export function canopySites(coverage, projection, sampleElevation, bounds=null) {
  const positions=[], sizes=[];
  const step=bounds ? 20 : 210;
  const west=bounds ? projection.lonToX(bounds.west) : -projection.widthM/2;
  const east=bounds ? projection.lonToX(bounds.east) : projection.widthM/2;
  const north=bounds ? projection.latToZ(bounds.north) : -projection.heightM/2;
  const south=bounds ? projection.latToZ(bounds.south) : projection.heightM/2;
  for (let iz=Math.floor(north/step)-1; iz<=Math.ceil(south/step)+1; iz++) {
    for (let ix=Math.floor(west/step)-1; ix<=Math.ceil(east/step)+1; ix++) {
      let seed=(Math.imul(ix,73856093)^Math.imul(iz,19349663)^237)>>>0;
      const random=() => { seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296; };
      const x=(ix+(random()-.5)*.9)*step, z=(iz+(random()-.5)*.9)*step;
      if (x<west || x>=east || z<north || z>=south) continue;
      const lon=projection.xToLon(x), lat=projection.zToLat(z);
      const radius=bounds ? 3.2+random()*3.8 : 48+random()*55;
      const edge=woodlandCrown(lon,lat,radius,coverage,projection);
      if (!edge) continue;
      const elev=sampleElevation(lon,lat);
      if (elev<1) continue;
      positions.push(x,elev,z); sizes.push(radius*edge);
    }
  }
  return {positions,sizes};
}

export function canopyLevel(cells, pose) {
  const contains=cell => pose.lon>=cell.bounds.west && pose.lon<=cell.bounds.east
    && pose.lat>=cell.bounds.south && pose.lat<=cell.bounds.north;
  if (pose.dist<900 && cells.some(cell => cell.level===0 && contains(cell))) return 0;
  return cells.some(cell => cell.level===1) ? 1 : 0;
}
