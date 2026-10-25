// Holds phones to 60 frames a second on screens that refresh faster (90, 120 Hz and more): a
// refresh is drawn only once a frame is due, on a timeline a sixtieth of a second a step (on a
// 120 Hz screen every other refresh; on a 90 Hz one, two in three). Unheld, the frames came as
// fast as the phone could draw them, unevenly, and each worked the water out in as many substeps
// as a whole sixtieth's frame does (FluidSim's least), for nothing the eye could see. A frame
// drawn late (the work took longer than a refresh, and a refresh that was due went by unseen)
// starts the timeline again from itself, so the next frames are not drawn early to catch up. (A
// phone whose GPU cannot hold 60 at its lowest quality level is held to 30 instead: frameMs,
// app/quality/controller.mjs.)
// (Late is told by the refreshes seen, not by how far past its time a frame is: on a 75 Hz
// screen a frame on time falls up to 6.7 ms past it, on a 120 Hz one a late frame 8.3, and a
// little unevenness in the refreshes' times blurs any line drawn between.)

/** The pace: ms a frame. */
export const FRAME_MS = 1000 / 60;
/** How early a refresh may come and still be drawn (ms): less than a 90 Hz refresh's lead on a
 *  due frame (5.6 ms), more than a 144 Hz one's (2.8). */
const EARLY_MS = 4;
/** No screen refreshes quicker than this (ms; 240 Hz): two refreshes closer say nothing of it
 *  (the loop's first call, timed by the clock rather than the screen). */
const MIN_REFRESH_MS = 4;

export class FramePace {
  due = -Infinity;
  /** The last refresh seen, drawn or not (ms). */
  seen = -Infinity;
  /** The screen's refresh, as near as the refreshes seen tell (ms): the shortest time between
   *  two, let grow a little at each in case the screen slows. */
  refresh = FRAME_MS;
  /** The pace: ms a frame (FRAME_MS, or twice it). */
  frameMs = FRAME_MS;

  /** A refresh at `now` (its animation frame's time, ms): whether to draw it. */
  draw(now) {
    const gap = now - this.seen;
    this.seen = now;
    if (gap >= MIN_REFRESH_MS) this.refresh = Math.min(gap, this.refresh * 1.01);
    if (now < this.due - EARLY_MS) return false;
    // (Late: a whole frame behind, or the refresh before this one went by unseen, the page busy,
    // though it would have been drawn.)
    const late = now - this.due > this.frameMs || (gap > 1.5 * this.refresh && now - this.refresh >= this.due - EARLY_MS);
    this.due = (late ? now : this.due) + this.frameMs;
    return true;
  }
}
