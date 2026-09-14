// Conservative, local shallow wash. Stored water moves down the *water surface*
// gradient; a bed depression retains water after the incident wave has receded.
export function createRunoff(n,cell,bed){return {n,cell,bed:Float32Array.from(bed),water:new Float32Array(n*n),fx:new Float32Array(n*n),fz:new Float32Array(n*n),delta:new Float32Array(n*n)};}
export function stepRunoff(g,dt,{sea=null,infiltration=.0015}={}){
 if(dt<=0)return;const {n,cell,bed,water,fx,fz}=g;fx.fill(0);fz.fill(0);
 if(sea)for(let i=0;i<water.length;i++){const wash=Math.max(0,sea[i]-bed[i]);if(wash>0)water[i]=Math.max(water[i],Math.min(.22,wash));}
 const delta=g.delta??(g.delta=new Float32Array(water.length));delta.fill(0);const k=Math.min(.2,dt*1.5/cell);
 for(let z=0;z<n;z++)for(let x=0;x<n;x++){const i=z*n+x;for(let axis=0;axis<2;axis++){const j=axis?(z+1<n?i+n:-1):(x+1<n?i+1:-1);if(j<0)continue;
  const dh=bed[i]+water[i]-bed[j]-water[j];let q=dh*k;if(q>0)q=Math.min(q,water[i]*.24);else q=-Math.min(-q,water[j]*.24);
  delta[i]-=q;delta[j]+=q;(axis?fz:fx)[i]+=q/Math.max(dt,.001);(axis?fz:fx)[j]+=q/Math.max(dt,.001);
 }}
 for(let i=0;i<water.length;i++)water[i]=Math.max(0,water[i]+delta[i]-infiltration*dt);
}
