import {SX,SZ,deckHeight,deckStations} from './vessels.js';
// A passenger walks in ship coordinates; movement never depends on sea drift.
import {sheer,halfBeam} from './yacht-geo.js';
import {clamp} from './math.js';
export const EYE_HEIGHT=1.67,PERSON_RADIUS=.24;

export class DeckNavigator {
  constructor(metadata){this.obstacles=metadata.deck?.obstacles||[];this.surfaces=metadata.deck?.surfaces||[];}
  canStand(x,z){
    if(x< -23.0*SX||x>22.2*SX||Math.abs(z)>halfBeam(x)*.985-PERSON_RADIUS)return false;
    for(const o of this.obstacles){
      if(o.type==='circle'){if(Math.hypot(x-o.x,z-o.z)<o.radius+PERSON_RADIUS)return false;}
      else {
        const dx=Math.max(Math.abs(x-o.x)-o.halfX,0),dz=Math.max(Math.abs(z-o.z)-o.halfZ,0);
        if(dx*dx+dz*dz<PERSON_RADIUS*PERSON_RADIUS)return false;
      }
    }
    return true;
  }
  height(x,z){
    let h=deckHeight(x,z);
    for(const s of this.surfaces)if(Math.abs(x-s.x)<=s.halfX&&Math.abs(z-s.z)<=s.halfZ)h=Math.max(h,s.height);
    return h;
  }
  nearest(x,z){
    x=clamp(x,-22.8*SX,22*SX);z=clamp(z,-4.1*SZ,4.1*SZ);if(this.canStand(x,z))return [x,z];
    let best=null,score=Infinity;
    for(let xx=-22.8*SX;xx<=22*SX;xx+=.16)for(let zz=-4.2*SZ;zz<=4.2*SZ;zz+=.16){
      const d=(xx-x)**2+(zz-z)**2;if(d<score&&this.canStand(xx,zz)){best=[xx,zz];score=d;}
    }
    return best||[deckStations.Helm[0],deckStations.Helm[1]];
  }
  move(position,dx,dz){
    const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.06));
    for(let i=0;i<steps;i++){
      const nx=position[0]+dx/steps,nz=position[1]+dz/steps;
      if(this.canStand(nx,nz)){position[0]=nx;position[1]=nz;}
      else {if(this.canStand(nx,position[1]))position[0]=nx;if(this.canStand(position[0],nz))position[1]=nz;}
    }
    return position;
  }
}

export class DeckWalker {
  constructor(yacht){this.yacht=yacht;this.nav=new DeckNavigator(yacht.metadata);this.position=[deckStations.Helm[0],deckStations.Helm[1]];this.yaw=0;this.pitch=-.05;this.stick=[0,0];this.walkSpeed=1.5;this.distance=0;this.bob=0;}
  board(cam){
    const local=this.yacht.toLocalPoint([cam.x,cam.y,cam.z]);
    const close=Math.hypot(local[0],local[2])<70*SX;
    this.position=this.nav.nearest(...(close?[local[0],local[2]]:[deckStations.Helm[0],deckStations.Helm[1]]));
    this.yaw=0;this.pitch=-.04;this.stick=[0,0];this.bob=0;
  }
  station(name){
    const locations=deckStations;
    const [x,z,yaw,pitch]=locations[name]||locations.Helm;
    this.position=this.nav.nearest(x,z);this.yaw=yaw;this.pitch=pitch;this.bob=0;
  }
  update(dt,keys){
    let forward=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0)-this.stick[1];
    let side=(keys.has('d')?1:0)-(keys.has('a')?1:0)+this.stick[0];
    const length=Math.max(1,Math.hypot(forward,side));forward/=length;side/=length;
    if(keys.has('arrowleft'))this.yaw-=dt*1.0;if(keys.has('arrowright'))this.yaw+=dt*1.0;
    const speed=this.walkSpeed*(keys.has('shift')?1.65:1),time=clamp(dt,0,.1);
    const dx=(Math.cos(this.yaw)*forward-Math.sin(this.yaw)*side)*speed*time;
    const dz=(Math.sin(this.yaw)*forward+Math.cos(this.yaw)*side)*speed*time;
    const old=[...this.position];this.nav.move(this.position,dx,dz);
    const travel=Math.hypot(this.position[0]-old[0],this.position[1]-old[1]);this.distance+=travel;
    const target=travel>1e-4?Math.sin(this.distance*8)*.008:0;this.bob+=(target-this.bob)*(1-Math.exp(-time*12));
  }
  syncCamera(cam){
    const y=this.yacht,[x,z]=this.position,h=this.nav.height(x,z)+EYE_HEIGHT+this.bob;
    const p=y.toWorld([x,h,z]);cam.x=p[0];cam.y=p[1];cam.z=p[2];
    const cp=Math.cos(this.pitch),local=[Math.cos(this.yaw)*cp,Math.sin(this.pitch),Math.sin(this.yaw)*cp];
    cam.forward=y.toWorldDir(local);cam.up=[...y.axes.up];
    cam.yaw=Math.atan2(cam.forward[0],-cam.forward[2]);cam.pitch=Math.asin(clamp(cam.forward[1],-1,1));
  }
}
