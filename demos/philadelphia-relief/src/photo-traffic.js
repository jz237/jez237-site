// Use Cesium's native tile-relative models so roads and buildings participate
// in the same depth buffer. These are simulated cars, not a live traffic feed.
// Cesium treats the glTF +Z axis as forward; these authored models face +X.
export const photoCarHeading=angle=>Math.PI-angle;

export function createPhotoTraffic(C,viewer){
  const source=new C.CustomDataSource('Simulated street traffic');
  viewer.dataSources.add(source);
  const records=new Map();
  let disposed=false;
  return {
    show(on){source.show=on;},
    update(cars){
      if(disposed)return;
      const seen=new Set();
      source.entities.suspendEvents();
      for(const car of cars){
        seen.add(car.id);
        let record=records.get(car.id);
        if(!record){
          const name=`traffic-${car.van?'van':'car'}-${car.variant}.glb`;
          const uri=new URL(`../models/${name}`,import.meta.url).href;
          record={position:new C.Cartesian3(),orientation:new C.Quaternion(),
            heading:new C.HeadingPitchRoll()};
          record.entity=source.entities.add({
            model:{uri,
              heightReference:C.HeightReference.RELATIVE_TO_3D_TILE,
              shadows:C.ShadowMode.DISABLED,runAnimations:false,
              // Actual metre dimensions; no minimum-pixel enlargement through roofs.
              scale:1},
          });
          records.set(car.id,record);
        }
        C.Cartesian3.fromDegrees(car.lon,car.lat,.12,C.Ellipsoid.WGS84,record.position);
        record.heading.heading=photoCarHeading(car.angle);
        C.Transforms.headingPitchRollQuaternion(record.position,record.heading,
          C.Ellipsoid.WGS84,undefined,record.orientation);
        record.entity.position=record.position;
        record.entity.orientation=record.orientation;
      }
      for(const [id,record] of records)if(!seen.has(id)){
        source.entities.remove(record.entity);records.delete(id);
      }
      source.entities.resumeEvents();
      // The photo viewer uses explicit rendering; motion must wake it even
      // with a stationary camera and completely loaded tiles.
      if(cars.length)viewer.scene.requestRender();
    },
    dispose(){if(disposed)return;disposed=true;records.clear();
      viewer.dataSources.remove(source,true);},
  };
}
