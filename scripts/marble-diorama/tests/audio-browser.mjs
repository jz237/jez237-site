import { AudioEngine } from "../src/audio.mjs";

// Offline rendering tests the browser's actual decoder and audio-clock loop,
// without playing test tones through the user's speakers.
function wav(samples, channels = 1, rate = 8000) {
  const bytes = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(bytes);
  const tag = (offset, value) =>
    [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  tag(0, "RIFF");
  view.setUint32(4, bytes.byteLength - 8, true);
  tag(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  tag(36, "data");
  view.setUint32(40, samples.length * 2, true);
  samples.forEach((sample, i) => view.setInt16(44 + i * 2, sample, true));
  return bytes;
}

export async function runAudioBrowserChecks() {
  const results = [];
  const samples = [-8192, -4096, 4096, 8192];
  for (const mode of ["loop", "one-shot", "restart", "stopped", "stereo"]) {
    const context = new OfflineAudioContext(2, 256, 8000);
    const audio = new AudioEngine({
      createContext: () => context,
      fetchAudio: async () => ({
        ok: true,
        arrayBuffer: async () =>
          mode === "stereo"
            ? wav(
                samples.flatMap((n) => [n, -n]),
                2,
              )
            : wav(samples),
      }),
    });
    audio.ensureContext();
    audio.volumes(1, 0.7);
    audio.verifiedCues.test = {
      verified: true,
      path: "fixture.wav",
      sampleRate: 8000,
      startFrame: mode === "one-shot" ? 1 : 0,
      loopStartFrame: 1,
      loopEndFrame: 4,
      loop: mode !== "one-shot" && mode !== "stereo",
    };
    if (!(await audio.playCue("test"))) throw Error(audio.lastMusicError);
    const decoded = audio.track.buffer.getChannelData(0).slice();
    const decodedRight = audio.track.buffer
      .getChannelData(audio.track.buffer.numberOfChannels - 1)
      .slice();
    // PCM decoders can normalize signed 16-bit values by 32767 or 32768.
    // Check that conversion within one PCM step; compare loop timing against
    // the actual decoded samples, with a much tighter processing tolerance.
    const decodeMaxError = Math.max(
      ...samples.map((n, i) =>
        Math.max(
          Math.abs(decoded[i] - n / 32768),
          Math.abs(decodedRight[i] - (mode === "stereo" ? -n : n) / 32768),
        ),
      ),
    );
    if (mode === "restart") await audio.playCue("test");
    if (mode === "stopped") audio.stop();
    const output = await context.startRendering();
    const expected = Array.from({ length: 24 }, (_, i) => {
      if (mode === "stopped") return 0;
      if (mode === "one-shot") return decoded[i + 1] ?? 0;
      if (mode === "stereo") return decoded[i] ?? 0;
      return decoded[i < 4 ? i : 1 + ((i - 4) % 3)];
    });
    const left = output.getChannelData(0),
      right = output.getChannelData(1);
    const maxError = Math.max(
      ...expected.map((n, i) =>
        Math.max(
          Math.abs(left[i] - n),
          Math.abs(right[i] - (mode === "stereo" ? (decodedRight[i] ?? 0) : n)),
        ),
      ),
    );
    results.push({
      mode,
      passed: maxError < 0.000001 && decodeMaxError <= 1 / 32768,
      maxError,
      decodeMaxError,
      sampleRate: output.sampleRate,
    });
  }
  return results;
}
