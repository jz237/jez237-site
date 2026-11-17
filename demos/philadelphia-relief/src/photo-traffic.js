// Native Cesium models share the photo tiles' depth buffer. Sample road heights
// with a bounded cache: automatic tile-relative clamping recasts against the
// detailed city mesh for every moving car on every frame.
// Cesium treats the glTF +Z axis as forward; these authored models face +X.
export const photoCarHeading=angle=>Math.PI-angle;

export function createPhotoTraffic(C,viewer,{now=()=>performance.now()}={}){
  const source=new C.CustomDataSource('Simulated street traffic');
  viewer.dataSources.add(source);
  const records=new Map(),heights=new Map(),cartographic=new C.Cartographic();
  // Allow for road-height uncertainty and warm cars before they enter the image.
  const bounds=new C.BoundingSphere(undefined,80);
  const orientation=new C.Quaternion(),heading=new C.HeadingPitchRoll();
  let disposed=false,cursor=0,lastSamples=0,frame=0,nearby=0,nearView=0,groundedCars=0;
  let nextMovingSample=0;
  return {
    stats:()=>({cars:nearby,nearView,grounded:groundedCars,
      heightSamples:lastSamples,cachedHeights:heights.size}),
    show(on){if(!disposed&&source.show!==on){source.show=on;viewer.scene.requestRender();}},
    update(cars,cameraMoving=false){
      if(disposed)return;
      nearby=cars.length;nearView=0;groundedCars=0;lastSamples=0;frame++;
      if(!nearby&&!records.size)return;
      const camera=viewer.camera,time=now();
      const volume=nearby&&camera.frustum.computeCullingVolume(
        camera.positionWC,camera.directionWC,camera.upWC);
      let sampleTime=0,nextCursor=cursor,changed=false;
      source.entities.suspendEvents();
      try {
        for(let i=0;i<cars.length;i++){
          // Rotate priority so the query budget cannot starve later cars.
          const index=(i+cursor)%cars.length,car=cars[index];
          let record=records.get(car.id);
          if(record)record.frame=frame;
          const groundDistance=Number.isFinite(record?.height)
            ? Math.hypot((car.lon-record.groundLon)*85000,(car.lat-record.groundLat)*111000) : Infinity;
          let grounded=groundDistance<16;
          const estimate=grounded?record.height:(car.ground??0);
          C.Cartesian3.fromDegrees(car.lon,car.lat,estimate+.12,C.Ellipsoid.WGS84,bounds.center);
          if(volume.computeVisibility(bounds)===C.Intersect.OUTSIDE){
            if(record?.entity.show){record.entity.show=false;changed=true;}
            continue;
          }
          nearView++;
          if(!record){
            const name=`traffic-${car.van?'van':'car'}-${car.variant}.glb`;
            const uri=new URL(`../models/${name}`,import.meta.url).href;
            record={frame};
            record.entity=source.entities.add({show:false,
              position:new C.ConstantPositionProperty(),orientation:new C.ConstantProperty(),
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
          // Mesh intersections can take several milliseconds on a detailed block.
          // During a gesture keep rolling on recent measured pavement, leaving
          // the next query for a newly visible car or one that has driven on.
          const needsHeight=(!ground||ground.expires<=time)
            &&(!cameraMoving||groundDistance>=8);
          if(needsHeight&&lastSamples<(cameraMoving?1:4)&&sampleTime<2
            &&(!cameraMoving||time>=nextMovingSample)){
            C.Cartographic.fromDegrees(car.lon,car.lat,0,cartographic);
            const started=now();
            const height=viewer.scene.getHeight(cartographic,C.HeightReference.CLAMP_TO_3D_TILE);
            const finished=now(),cost=finished-started;
            sampleTime+=cost;lastSamples++;nextCursor=index+1;
            nextMovingSample=finished+Math.min(64,cost*3);
            ground={height:Number.isFinite(height)?height:ground?.height,
              expires:time+(Number.isFinite(height)?15000:1000)};
            heights.delete(key);heights.set(key,ground);
            if(heights.size>2048)heights.delete(heights.keys().next().value);
          }
          if(Number.isFinite(ground?.height)){
            record.height=ground.height;record.groundLon=car.lon;record.groundLat=car.lat;
            grounded=true;
          }
          if(record.entity.show!==grounded){record.entity.show=grounded;changed=true;}
          if(!grounded)continue;
          groundedCars++;
          if(record.lon===car.lon&&record.lat===car.lat&&record.angle===car.angle
            &&record.drawnHeight===record.height)continue;
          record.lon=car.lon;record.lat=car.lat;record.angle=car.angle;record.drawnHeight=record.height;
          if(estimate!==record.height){
            C.Cartesian3.fromDegrees(car.lon,car.lat,record.height+.12,C.Ellipsoid.WGS84,bounds.center);
          }
          heading.heading=photoCarHeading(car.angle);
          C.Transforms.headingPitchRollQuaternion(bounds.center,heading,
            C.Ellipsoid.WGS84,undefined,orientation);
          record.entity.position.setValue(bounds.center);
          record.entity.orientation.setValue(orientation);
          changed=true;
        }
        cursor=cars.length?nextCursor%cars.length:0;
        for(const [id,record] of records)if(record.frame!==frame){
          source.entities.remove(record.entity);records.delete(id);changed=true;
        }
      } finally {
        source.entities.resumeEvents();
      }
      // The photo viewer uses explicit rendering; motion must wake it even
      // with a stationary camera and completely loaded tiles.
      if(changed)viewer.scene.requestRender();
    },
    dispose(){if(disposed)return;disposed=true;records.clear();heights.clear();
      nearby=nearView=groundedCars=lastSamples=0;
      viewer.dataSources.remove(source,true);},
  };
}
