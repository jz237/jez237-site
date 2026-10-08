import * as T from 'three';
import {WAYPOINTS,type WaypointRace} from './waypoint-race';
import {landscapeHeight} from './quarry-layout';
/** Six reusable scene markers; never participates in collision or scoring. */
export class WaypointMarkers {
  readonly root=new T.Group();private stations:T.Group[]=[];
  constructor(scene:T.Scene){
    const ring=new T.TorusGeometry(10,.13,4,64),beam=new T.CylinderGeometry(.10,.10,22,4),material=new T.MeshBasicMaterial({color:0xf1d786,transparent:true,opacity:.78,depthWrite:false});
    for(const p of WAYPOINTS){const group=new T.Group();group.position.set(p.x,landscapeHeight(p.x,p.z)+.2,p.z);const halo=new T.Mesh(ring,material);halo.rotation.x=-Math.PI/2;group.add(halo);const light=new T.Mesh(beam,material);light.position.y=11;group.add(light);
      const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;const c=canvas.getContext('2d')!;c.fillStyle='#14241de8';c.fillRect(0,0,256,128);c.strokeStyle='#efd68f';c.lineWidth=5;c.strokeRect(4,4,248,120);c.fillStyle='#fff1bd';c.font=`bold ${p.id?80:42}px Arial`;c.textAlign='center';c.textBaseline='middle';c.fillText(p.label,128,66);const texture=new T.CanvasTexture(canvas),badge=new T.Sprite(new T.SpriteMaterial({map:texture,depthTest:false}));badge.scale.set(8,4,1);badge.position.y=13;group.add(badge);this.root.add(group);this.stations.push(group);
    }scene.add(this.root);this.root.visible=false;
  }
  update(race:WaypointRace|null,id:number,active:boolean,height=landscapeHeight){this.root.visible=active&&!!race;if(!race)return;const available=race.available(id);this.stations.forEach((g,i)=>{const p=race.stations[i];g.position.set(p.x,height(p.x,p.z)+.2,p.z);g.visible=available.includes(i);});}
}
