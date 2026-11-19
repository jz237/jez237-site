const MIN_PIXELS = 180000, MAX_PIXELS = 720000;
const RECOVER_MS = 6000;

// Observe the frames actually presented by the 30 FPS pacer. Try one small
// increase at a time and back off if the device cannot sustain the new size.
export class BowlResolution {
  pixels = MAX_PIXELS;
  steady = 0;
  retry = RECOVER_MS;
  previousBudget = 0;
  elapsed = 0;
  samples = 0;
  longest = 0;

  resetTiming() {
    this.elapsed = this.samples = this.longest = this.steady = 0;
  }

  sample(interval, drawnPixels, nativePixels) {
    this.elapsed += interval;
    this.samples++;
    this.longest = Math.max(this.longest, interval);
    if (this.samples < 30 && this.elapsed < 2500) return false;
    // Ignore one isolated stall, such as compiling a shader or opening Learn.
    const time = this.elapsed - this.longest;
    const mean = this.samples > 1 ? time/(this.samples-1) : 0;
    this.elapsed = this.samples = this.longest = 0;
    if (!mean) return false;
    const before = this.pixels;
    if (mean > 39 || (this.previousBudget && mean > 36.5)) {
      this.steady = 0;
      if (this.previousBudget) {
        this.pixels = this.previousBudget;
        this.previousBudget = 0;
        this.retry = Math.min(48000, this.retry*2);
      } else if (drawnPixels > MIN_PIXELS) {
        this.pixels = Math.max(MIN_PIXELS, Math.round(.70 * Math.min(before, drawnPixels)));
      }
    } else {
      this.steady = mean <= 35.5 ? this.steady + time : 0;
      if (this.previousBudget && this.steady >= 3000) {
        this.previousBudget = 0;
        this.retry = RECOVER_MS;
      }
      if (this.steady >= this.retry) {
        this.steady = 0;
        if (before < MAX_PIXELS) {
          this.pixels = Math.min(MAX_PIXELS, Math.ceil(before*1.20));
          if (this.pixels >= nativePixels) this.pixels = MAX_PIXELS;
          if (before < nativePixels) this.previousBudget = before;
        }
      }
    }
    return before !== this.pixels;
  }
}
