// Original sound design for this remake; these are not extracted Amiga samples.
// Short deterministic PCM effects keep polyphony bounded and work on every
// Web Audio device without additional downloads or oscillator lifetimes.
export const effectDurations = {
  fall: 0.7,
  stun: 0.55,
  respawn: 0.24,
  finish: 1.25,
  timeout: 0.7,
  collect: 0.32,
  spring: 0.4,
  checkpoint: 0.18,
  machine: 0.18,
  bird: 0.2,
  muncher: 0.16,
  swallow: 0.5,
  reform: 0.75,
  vacuum: 0.3,
  magnet: 0.22,
  acid: 0.22,
};
export function effectSamples(kind, rate) {
  const duration = effectDurations[kind];
  if (!duration) return null;
  const samples = new Float32Array(Math.ceil(duration * rate));
  let phase = 0,
    seed = 237,
    smooth = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate,
      u = t / duration;
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const noise = seed / 2147483648 - 1;
    smooth += 0.12 * (noise - smooth);
    let frequency = 440,
      signal,
      amplitude = 0.22;
    switch (kind) {
      case "fall":
        frequency = 850 * Math.pow(0.055, u);
        break;
      case "stun":
        frequency = 480 + 170 * Math.sin(u * 28) * (1 - u);
        amplitude = 0.12;
        break;
      case "respawn":
        frequency = 320 + 780 * u;
        break;
      case "finish":
        frequency = [523.25, 659.25, 783.99, 1046.5][
          Math.min(3, Math.floor(t / 0.17))
        ];
        amplitude = 0.18;
        break;
      case "timeout":
        frequency = 280 * Math.pow(0.3, u);
        break;
      case "collect":
        frequency = t < 0.1 ? 1046.5 : 1568;
        break;
      case "spring":
        frequency = 180 + 900 * Math.exp(-u * 3) * Math.abs(Math.sin(u * 13));
        break;
      case "checkpoint":
        frequency = 880;
        amplitude = 0.12;
        break;
      case "machine":
        frequency = 95 + 65 * (1 - u);
        signal = smooth * 0.8;
        break;
      case "bird":
        frequency = 1400 + 650 * Math.sin(u * 10);
        amplitude = 0.1;
        break;
      case "muncher":
        frequency = 130 + 75 * Math.sin(u * 15);
        signal = smooth * 0.7;
        break;
      case "swallow":
        frequency = 350 * Math.pow(0.16, u) + 25 * Math.sin(u * 30);
        signal = smooth * 0.35;
        amplitude = 0.18;
        break;
      case "reform":
        frequency = 340 + 950 * u;
        amplitude = 0.13 * (0.7 + 0.3 * Math.cos(u * 38));
        break;
      case "vacuum":
        frequency = 190 + 30 * Math.sin(u * 8);
        signal = smooth;
        amplitude = 0.11;
        break;
      case "magnet":
        frequency = 120 + 25 * Math.sin(u * 12);
        amplitude = 0.09;
        break;
      case "acid":
        frequency = 280 + 600 * Math.sin(u * Math.PI);
        signal = smooth * 0.4;
        amplitude = 0.1;
        break;
    }
    phase += (2 * Math.PI * frequency) / rate;
    const tone = Math.sin(phase) + 0.22 * Math.sin(phase * 2);
    const envelope =
      Math.min(1, t / 0.006) * Math.pow(1 - u, kind === "finish" ? 0.7 : 1.5);
    samples[i] =
      amplitude *
      envelope *
      (signal === undefined ? tone : signal + tone * 0.35);
  }
  return samples;
}
