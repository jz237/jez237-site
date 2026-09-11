/** Downgrade graphics only after sustained slow foreground frames, after warmup. */
export class FrameBudget {
 elapsed=0;slow=0;warmup=0;
 sample(seconds:number,visible:boolean,ready:boolean){
  if(!visible||!ready||!Number.isFinite(seconds)||seconds<=0)return false;
  const dt=Math.min(seconds,.25);
  this.warmup+=dt;if(this.warmup<=3)return false;
  this.elapsed+=dt;if(seconds>1/28)this.slow+=dt;
  if(this.elapsed<3)return false;
  const downgrade=this.slow>1.5;this.elapsed=0;this.slow=0;return downgrade;
 }
}
