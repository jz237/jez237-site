type Point={x:number;z:number};
type Course={halfWidth:number;distance(x:number,z:number):number};
/** Remembers the last observed road position, never a new checkpoint or recovery target. */
export class OffroadMarker {
 private course?:Course;
 private followed?:number;
 private last?:Point;
 private road?:Point;
 private exit?:Point;
 reset(){this.course=undefined;this.followed=undefined;this.last=undefined;this.road=undefined;this.exit=undefined;}
 update(course:Course,id:number,position:Point,enabled=true):Point|undefined{
  if(!enabled||!Number.isFinite(position.x)||!Number.isFinite(position.z)){this.reset();return;}
  if(this.course!==course||this.followed!==id)this.reset();
  this.course=course;this.followed=id;
  // A recovery or remote correction must not leave a stale return instruction.
  if(this.last&&Math.hypot(position.x-this.last.x,position.z-this.last.z)>35){this.road=undefined;this.exit=undefined;}
  this.last={...position};
  const distance=course.distance(position.x,position.z);
  if(distance<=course.halfWidth){this.road={...position};this.exit=undefined;}
  else if(distance>course.halfWidth+2&&this.road&&!this.exit)this.exit={...this.road};
  return this.exit&&{...this.exit};
 }
}
