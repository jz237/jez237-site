/** Windscreen crazing seen from the dashboard camera: every blow that cracks the laminated screen leaves a spider-web of
 * radial cracks and broken rings around where it landed, growing with the damage. Visual only. */
export const CRAZE={threshold:.12,radius:.42,centres:4,move:.25,first:.35} as const;
/** A crack segment, in units of the crack's full radius around its centre: x1,y1,x2,y2. */
export type Seg=[number,number,number,number];
const rng=(seed:number)=>{let s=(seed>>>0)||1;return()=>{s=(s+0x6d2b79f5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};};
/** The crack pattern of one blow at this level (0..1): radials that wander outward, joined by broken rings. Deterministic. */
export function crazePattern(seed:number,level:number):Seg[]{
  const l=Math.max(0,Math.min(1,Number.isFinite(level)?level:0));if(l<=0)return[];
  const r=rng(seed),n=9+Math.floor(r()*6),segs:Seg[]=[],spokes:{x:number;y:number;d:number}[][]=[];
  for(let k=0;k<n;k++){
    let a=2*Math.PI*k/n+(r()-.5)*.5,d=.02+r()*.03,x=Math.cos(a)*d,y=Math.sin(a)*d;const pts=[{x,y,d}];
    const reach=l*(.65+r()*.35);
    while(d<reach){const step=.05+r()*.07;a+=(r()-.5)*.5;const nx=x+Math.cos(a)*step,ny=y+Math.sin(a)*step;segs.push([x,y,nx,ny]);x=nx;y=ny;d=Math.hypot(x,y);pts.push({x,y,d});
      // Now and then a short side crack splits off.
      if(r()<.18){const b=a+(r()<.5?1:-1)*(.5+r()*.6),s=step*(.5+r());segs.push([x,y,x+Math.cos(b)*s,y+Math.sin(b)*s]);}}
    spokes.push(pts);
  }
  for(const ring of [.1,.22,.36,.52,.7,.88]){
    if(ring>l*.85)break;
    for(let k=0;k<n;k++){
      if(r()<.28)continue;
      const near=(pts:{x:number;y:number;d:number}[])=>pts.reduce((b,p)=>Math.abs(p.d-ring)<Math.abs(b.d-ring)?p:b,pts[0]);
      const p=near(spokes[k]),q=near(spokes[(k+1)%n]);if(Math.abs(p.d-ring)>.08||Math.abs(q.d-ring)>.08)continue;
      const mx=(p.x+q.x)/2*(1+(r()-.5)*.12),my=(p.y+q.y)/2*(1+(r()-.5)*.12);segs.push([p.x,p.y,mx,my],[mx,my,q.x,q.y]);
    }
  }
  return segs;
}
export type CrazeCentre={p:[number,number,number];level:number;seed:number};
export type CrazeState={centres:CrazeCentre[];last:number};
/** Fold the screen's damage (0..1) and last impact (glass-local) into the crack centres: growth near an old centre
 * deepens it; a fresh blow elsewhere starts a new one (up to CRAZE.centres). A repaired screen (0) clears them. */
export function trackCraze(state:CrazeState,impact:[number,number,number],level:number,seed:number):CrazeState{
  const l=Math.max(0,Math.min(1,Number.isFinite(level)?level:0));
  if(l<=0)return{centres:[],last:0};
  const grew=l-state.last;if(grew<=1e-6||l<CRAZE.threshold)return state;
  const centres=state.centres.map(c=>({...c,p:[...c.p] as [number,number,number]}));
  let best=-1,dist=Infinity;centres.forEach((c,i)=>{const d=Math.hypot(c.p[0]-impact[0],c.p[1]-impact[1],c.p[2]-impact[2]);if(d<dist){dist=d;best=i;}});
  if(best>=0&&dist<=CRAZE.move)centres[best].level=Math.min(1,centres[best].level+grew);
  else if(centres.length<CRAZE.centres)centres.push({p:[...impact],level:Math.min(1,Math.max(CRAZE.first,grew)),seed});
  else centres[best].level=Math.min(1,centres[best].level+grew);
  return{centres,last:l};
}
/** Convex hull (monotone chain) of screen points: the outline the cracks are clipped to. */
export function hull(points:readonly {x:number;y:number}[]){
  const p=points.filter(q=>Number.isFinite(q.x)&&Number.isFinite(q.y)).slice().sort((a,b)=>a.x-b.x||a.y-b.y);if(p.length<3)return p;
  const cross=(o:{x:number;y:number},a:{x:number;y:number},b:{x:number;y:number})=>(a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);
  const lower:{x:number;y:number}[]=[],upper:{x:number;y:number}[]=[];
  for(const q of p){while(lower.length>=2&&cross(lower[lower.length-2],lower[lower.length-1],q)<=0)lower.pop();lower.push(q);}
  for(const q of p.reverse()){while(upper.length>=2&&cross(upper[upper.length-2],upper[upper.length-1],q)<=0)upper.pop();upper.push(q);}
  return lower.slice(0,-1).concat(upper.slice(0,-1));
}
/** Draws the crazing onto a full-window canvas laid over the 3D view; repaints only when something moved. */
export class ScreenCraze{
  private key='';private readonly cache=new Map<string,Seg[]>();
  constructor(private readonly canvas:HTMLCanvasElement){}
  draw(spots:readonly {x:number;y:number;level:number;seed:number}[],clip:readonly {x:number;y:number}[]=[]){
    const c=this.canvas,dpr=Math.min(2,globalThis.devicePixelRatio||1),w=Math.round(innerWidth*dpr),h=Math.round(innerHeight*dpr);
    const key=w+'x'+h+'|'+spots.map(s=>`${Math.round(s.x)},${Math.round(s.y)},${s.level.toFixed(3)},${s.seed}`).join(';')+'|'+clip.map(q=>`${Math.round(q.x)},${Math.round(q.y)}`).join(';');
    if(key===this.key)return;this.key=key;
    if(c.width!==w||c.height!==h){c.width=w;c.height=h;}
    const g=c.getContext('2d');if(!g)return;g.clearRect(0,0,w,h);if(!spots.length)return;
    const unit=Math.min(w,h)*CRAZE.radius;g.lineCap='round';g.lineJoin='round';
    // Only on the glass: clip to the screen's outline when there is one.
    g.save();if(clip.length>=3){g.beginPath();clip.forEach((q,i)=>i?g.lineTo(q.x*dpr,q.y*dpr):g.moveTo(q.x*dpr,q.y*dpr));g.closePath();g.clip();}
    for(const s of spots){
      const id=s.seed+':'+s.level.toFixed(3);let segs=this.cache.get(id);if(!segs){segs=crazePattern(s.seed,s.level);this.cache.set(id,segs);if(this.cache.size>32)this.cache.delete(this.cache.keys().next().value!);}
      const cx=s.x*dpr,cy=s.y*dpr;
      for(const [stroke,width] of [['rgba(18,22,26,.32)',2.4*dpr],['rgba(236,242,246,.62)',1*dpr]] as const){
        g.strokeStyle=stroke;g.lineWidth=width;g.beginPath();
        for(const [x1,y1,x2,y2] of segs){g.moveTo(cx+x1*unit,cy+y1*unit);g.lineTo(cx+x2*unit,cy+y2*unit);}g.stroke();
      }
      // The point of impact: a pale, powdered star.
      const r=unit*.05*(.6+s.level),glow=g.createRadialGradient(cx,cy,0,cx,cy,r);glow.addColorStop(0,'rgba(240,244,248,.7)');glow.addColorStop(1,'rgba(240,244,248,0)');
      g.fillStyle=glow;g.beginPath();g.arc(cx,cy,r,0,Math.PI*2);g.fill();
    }
    g.restore();
  }
}
