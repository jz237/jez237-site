// Preserve real elapsed time down to 1 fps; cap long suspend stalls.
export function frameElapsed(seconds){return Number.isFinite(seconds)?Math.max(0,Math.min(1,seconds)):0;}
