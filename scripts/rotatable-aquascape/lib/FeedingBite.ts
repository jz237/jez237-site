/** One visible opening/closing pulse per swallowed morsel; no frame allocations. */
export class FeedingBite {
 private age=1;value=0;
 trigger(){this.age=0;this.value=1;}
 update(dt:number){if(dt<=0)return;this.age+=dt;this.value=this.age<.09?1:Math.max(0,1-(this.age-.09)/.30)**2;}
}
