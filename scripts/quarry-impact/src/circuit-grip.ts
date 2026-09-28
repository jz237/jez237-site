import profileData from './circuit-grip-profile.json';

export interface CircuitGripProfile {
  version: number;
  segments: number;
  /** Exact old lane vertices: world X, world Z, Float32 route S, lateral D. */
  vertices: number[];
  pavedCells: number[];
  mask: { width:number; height:number; lengthMetres:number; lateralMinimum:number; lateralMaximum:number; threshold:number; columnMajor:boolean; redRuns:number[] };
}
export interface CircuitSurfaceHit {
  cell: number;
  triangle: number;
  t: number;
  s: number;
  lateral: number;
  coverage: number;
  surface: 'asphalt' | 'gravel';
}

/** Lossless numerical profile only: no Three, browser, image or async I/O. */
export function decodeCircuitRed(profile:CircuitGripProfile){
  const {width,height,redRuns,columnMajor}=profile.mask;
  if(profile.version!==1||profile.segments!==360||width!==2048||height!==128||!columnMajor||redRuns.length%2)throw new Error('Invalid circuit grip profile');
  const red=new Uint8Array(width*height);let cursor=0;
  for(let i=0;i<redRuns.length;i+=2){
    const count=redRuns[i],value=redRuns[i+1];
    if(!Number.isInteger(count)||count<=0||cursor+count>red.length||!Number.isInteger(value)||value<0||value>255)throw new Error('Invalid circuit R-channel run');
    red.fill(value,cursor,cursor+count);cursor+=count;
  }
  if(cursor!==red.length)throw new Error('Incomplete circuit R-channel profile');
  return red;
}

const GRID=16,INSIDE_EPSILON=1e-10;
const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
const wrap=(v:number,n:number)=>((v%n)+n)%n;
type Triangle={a:number;b:number;c:number;ax:number;az:number;ux:number;uz:number;vx:number;vz:number;inverse:number};
type Cell={triangles:Triangle[];ax:number;az:number;dx:number;dz:number;lengthSquared:number};

export class CircuitGripQuery {
  readonly red:Uint8Array;
  readonly vertices:Float32Array;
  readonly paved:Uint8Array;
  private readonly cells:Cell[]=[];
  private readonly grid=new Map<string,number[]>();

  constructor(readonly profile:CircuitGripProfile){
    this.red=decodeCircuitRed(profile);
    if(profile.vertices.length!==(profile.segments+1)*8||!profile.vertices.every(Number.isFinite))throw new Error('Invalid circuit lane vertices');
    this.vertices=new Float32Array(profile.vertices);this.paved=new Uint8Array(profile.segments);
    for(const cell of profile.pavedCells){if(!Number.isInteger(cell)||cell<0||cell>=profile.segments)throw new Error('Invalid paved cell');this.paved[cell]=1;}
    const p=this.vertices;
    const triangle=(a:number,b:number,c:number):Triangle=>{
      const ax=p[a*4],az=p[a*4+1],ux=p[b*4]-ax,uz=p[b*4+1]-az,vx=p[c*4]-ax,vz=p[c*4+1]-az,det=ux*vz-uz*vx;
      if(Math.abs(det)<1e-10)throw new Error('Degenerate circuit triangle');
      return {a,b,c,ax,az,ux,uz,vx,vz,inverse:1/det};
    };
    for(let i=0;i<profile.segments;i++){
      const a=i*2,ax=(p[a*4]+p[(a+1)*4])*.5,az=(p[a*4+1]+p[(a+1)*4+1])*.5;
      const dx=(p[(a+2)*4]+p[(a+3)*4])*.5-ax,dz=(p[(a+2)*4+1]+p[(a+3)*4+1])*.5-az;
      this.cells.push({triangles:[triangle(a,a+2,a+1),triangle(a+1,a+2,a+3)],ax,az,dx,dz,lengthSquared:dx*dx+dz*dz});
      const xs=[0,1,2,3].map(j=>p[(a+j)*4]),zs=[0,1,2,3].map(j=>p[(a+j)*4+1]);
      for(let x=Math.floor(Math.min(...xs)/GRID);x<=Math.floor(Math.max(...xs)/GRID);x++)for(let z=Math.floor(Math.min(...zs)/GRID);z<=Math.floor(Math.max(...zs)/GRID);z++){
        const key=x+':'+z,entries=this.grid.get(key)??[];entries.push(i);this.grid.set(key,entries);
      }
    }
  }

  /** Base-resolution bilinear R sampling matches Repeat-U/Clamp-V texel centers.
   * The physical contour deliberately ignores camera mip levels and shader grain. */
  coverageAt(s:number,lateral:number){
    if(!Number.isFinite(s)||!Number.isFinite(lateral))return 0;
    const m=this.profile.mask,x=wrap(s/m.lengthMetres,1)*m.width-.5;
    const y=clamp((lateral-m.lateralMinimum)/(m.lateralMaximum-m.lateralMinimum)*m.height-.5,0,m.height-1);
    const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,x0=wrap(ix,m.width),x1=wrap(ix+1,m.width),y1=Math.min(iy+1,m.height-1);
    const a=this.red[x0*m.height+iy]*(1-fy)+this.red[x0*m.height+y1]*fy;
    const b=this.red[x1*m.height+iy]*(1-fy)+this.red[x1*m.height+y1]*fy;
    return (a*(1-fx)+b*fx)/255;
  }

  query(x:number,z:number):CircuitSurfaceHit|null{
    if(!Number.isFinite(x)||!Number.isFinite(z))return null;
    const candidates=this.grid.get(Math.floor(x/GRID)+':'+Math.floor(z/GRID));if(!candidates)return null;
    let hit:CircuitSurfaceHit|null=null,bestDistance=Infinity;
    const p=this.vertices;
    for(const id of candidates){
      const cell=this.cells[id],t=clamp(((x-cell.ax)*cell.dx+(z-cell.az)*cell.dz)/cell.lengthSquared,0,1);
      const distance=(x-cell.ax-t*cell.dx)**2+(z-cell.az-t*cell.dz)**2;
      if(hit&&(distance>bestDistance+1e-12||(Math.abs(distance-bestDistance)<=1e-12&&id>hit.cell)))continue;
      for(let index=0;index<2;index++){
        const q=cell.triangles[index],px=x-q.ax,pz=z-q.az;
        const wb=(px*q.vz-pz*q.vx)*q.inverse,wc=(q.ux*pz-q.uz*px)*q.inverse,wa=1-wb-wc;
        if(wa < -INSIDE_EPSILON||wb < -INSIDE_EPSILON||wc < -INSIDE_EPSILON)continue;
        const s=wa*p[q.a*4+2]+wb*p[q.b*4+2]+wc*p[q.c*4+2];
        const lateral=wa*p[q.a*4+3]+wb*p[q.b*4+3]+wc*p[q.c*4+3];
        const coverage=this.coverageAt(s,lateral);
        hit={cell:id,triangle:index,t,s,lateral,coverage,surface:this.paved[id]&&coverage*255>=this.profile.mask.threshold?'asphalt':'gravel'};
        bestDistance=distance;break;
      }
    }
    return hit;
  }
}

export const circuitGrip=new CircuitGripQuery(profileData);
export const circuitSurfaceAt=(x:number,z:number):'asphalt'|'gravel'=>circuitGrip.query(x,z)?.surface??'gravel';
