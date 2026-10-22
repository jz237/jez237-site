// Native Cesium models share the photo tiles' depth buffer. Sample road heights
// with a bounded cache: automatic tile-relative clamping recasts against the
// detailed city mesh for every moving car on every frame.
// Cesium treats the glTF +Z axis as forward; these authored models face +X.
export const photoCarHeading=angle=>Math.PI-angle;

export function createPhotoTraffic(C,viewer,{now=()=>performance.now()}={}){
  const source=new C.CustomDataSource('Simulated street traffic');
  viewer.dataSources.add(source);
  const records=new Map(),heights=new Map(),cartographic=new C.Cartographic();
  let disposed=false,cursor=0,lastSamples=0;
  return {
    stats:()=>({cars:records.size,grounded:[...records.values()].filter(r=>r.entity.show).length,
      heightSamples:lastSamples,cachedHeights:heights.size}),
    show(on){if(!disposed&&source.show!==on){source.show=on;viewer.scene.requestRender();}},
    update(cars){
      if(disposed)return;
      const seen=new Set(),time=now();
      let budget=4,changed=false;
      source.entities.suspendEvents();
      for(let i=0;i<cars.length;i++){
        // Rotate priority so the query budget cannot starve later cars.
        const car=cars[(i+cursor)%cars.length];
        seen.add(car.id);
        let record=records.get(car.id);
        if(!record){
          const name=`traffic-${car.van?'van':'car'}-${car.variant}.glb`;
          const uri=new URL(`../models/${name}`,import.meta.url).href;
          record={position:new C.Cartesian3(),orientation:new C.Quaternion(),
            heading:new C.HeadingPitchRoll()};
          record.entity=source.entities.add({show:false,
            model:{uri,
              heightReference:C.HeightReference.NONE,
              shadows:C.ShadowMode.DISABLED,runAnimations:false,
              // Actual metre dimensions; no minimum-pixel enlargement through roofs.
              scale:1},
          });
          records.set(car.id,record);
          changed=true;
        }
        // Roughly 3.4 by 4.4 metres here: separate opposite lanes while sharing
        // samples between cars following the same road. Failed queries retry as
        // new tiles arrive; successful samples also refresh after refinement.
        const key=`${Math.floor(car.lon*25000)},${Math.floor(car.lat*25000)}`;
        let ground=heights.get(key);
        if((!ground||ground.expires<=time)&&budget>0){
          budget--;
          C.Cartographic.fromDegrees(car.lon,car.lat,0,cartographic);
          const height=viewer.scene.getHeight(cartographic,C.HeightReference.CLAMP_TO_3D_TILE);
          ground={height:Number.isFinite(height)?height:ground?.height,
            expires:time+(Number.isFinite(height)?15000:1000)};
          heights.delete(key);heights.set(key,ground);
          if(heights.size>2048)heights.delete(heights.keys().next().value);
        }
        if(Number.isFinite(ground?.height)){
          record.height=ground.height;record.groundLon=car.lon;record.groundLat=car.lat;
        }
        const grounded=Number.isFinite(record.height)
          &&Math.hypot((car.lon-record.groundLon)*85000,(car.lat-record.groundLat)*111000)<16;
        if(record.entity.show!==grounded){record.entity.show=grounded;changed=true;}
        if(!grounded)continue;
        if(record.lon===car.lon&&record.lat===car.lat&&record.angle===car.angle
          &&record.drawnHeight===record.height)continue;
        record.lon=car.lon;record.lat=car.lat;record.angle=car.angle;record.drawnHeight=record.height;
        C.Cartesian3.fromDegrees(car.lon,car.lat,record.height+.12,C.Ellipsoid.WGS84,record.position);
        record.heading.heading=photoCarHeading(car.angle);
        C.Transforms.headingPitchRollQuaternion(record.position,record.heading,
          C.Ellipsoid.WGS84,undefined,record.orientation);
        record.entity.position=record.position;
        record.entity.orientation=record.orientation;
        changed=true;
      }
      cursor=cars.length?(cursor+4)%cars.length:0;
      lastSamples=4-budget;
      for(const [id,record] of records)if(!seen.has(id)){
        source.entities.remove(record.entity);records.delete(id);changed=true;
      }
      source.entities.resumeEvents();
      // The photo viewer uses explicit rendering; motion must wake it even
      // with a stationary camera and completely loaded tiles.
      if(changed)viewer.scene.requestRender();
    },
    dispose(){if(disposed)return;disposed=true;records.clear();heights.clear();
      viewer.dataSources.remove(source,true);},
  };
}
