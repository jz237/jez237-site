(function () {
  const PAL_CLOCK = 985248;
  const FRAME_RATE = 50;
  const FRAME_DATA_OFFSET = 0x7c + 0x100;
  const TWO_PI = Math.PI * 2;

  function read16be(bytes, offset) {
    return (bytes[offset] << 8) | bytes[offset + 1];
  }

  function readAscii(bytes, start, length) {
    let out = "";
    for (let i = start; i < start + length; i += 1) {
      if (bytes[i] === 0) break;
      out += String.fromCharCode(bytes[i]);
    }
    return out.trim();
  }

  function parseSid(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    const magic = readAscii(bytes, 0, 4);
    if (magic !== "PSID" && magic !== "RSID") {
      throw new Error("Not a PSID/RSID file");
    }

    const headerLength = read16be(bytes, 6);
    const loadAddress = read16be(bytes, 8);
    const initAddress = read16be(bytes, 10);
    const playAddress = read16be(bytes, 12);
    const title = readAscii(bytes, 22, 32);
    const author = readAscii(bytes, 54, 32);
    const released = readAscii(bytes, 86, 32);

    const expectedReplayTable = headerLength + 0x100;
    if (loadAddress !== 0x1000 || initAddress !== 0x1000 || playAddress !== 0x1020 || expectedReplayTable !== FRAME_DATA_OFFSET) {
      throw new Error("This native player currently supports the generated SID-lab replay format only");
    }

    const usableLength = bytes.length - FRAME_DATA_OFFSET;
    if (usableLength <= 0 || usableLength % 25 !== 0) {
      throw new Error("SID frame table is missing or malformed");
    }

    return {
      title,
      author,
      released,
      frames: usableLength / 25,
      regs: bytes.subarray(FRAME_DATA_OFFSET),
    };
  }

  function sidFrequency(lo, hi) {
    const value = lo | (hi << 8);
    return value * PAL_CLOCK / 16777216;
  }

  function pulseWidth(lo, hi) {
    return Math.max(0.05, Math.min(0.95, ((lo | ((hi & 0x0f) << 8)) || 0x800) / 4095));
  }

  function makeNoise(seed) {
    let lfsr = seed || 0x7ffff8;
    return function nextNoise() {
      const bit = ((lfsr >> 22) ^ (lfsr >> 17)) & 1;
      lfsr = ((lfsr << 1) | bit) & 0x7fffff;
      return ((lfsr & 0xffff) / 32768) - 1;
    };
  }

  function waveSample(kind, phase, duty, noise) {
    if (kind === "noise") return noise();
    if (kind === "saw") return phase * 2 - 1;
    if (kind === "tri") return 1 - 4 * Math.abs(phase - 0.5);
    return phase < duty ? 1 : -1;
  }

  function voiceKind(ctrl) {
    if (ctrl & 0x80) return "noise";
    if (ctrl & 0x40) return "pulse";
    if (ctrl & 0x20) return "saw";
    if (ctrl & 0x10) return "tri";
    return "off";
  }

  function renderSidToBuffer(audioContext, sid) {
    const sampleRate = audioContext.sampleRate;
    const samplesPerFrame = Math.max(1, Math.round(sampleRate / FRAME_RATE));
    const totalSamples = sid.frames * samplesPerFrame;
    const buffer = audioContext.createBuffer(1, totalSamples, sampleRate);
    const output = buffer.getChannelData(0);
    const phase = [0, 0, 0];
    const env = [0, 0, 0];
    const noise = [makeNoise(0x123456), makeNoise(0x654321), makeNoise(0x456789)];
    const bases = [0, 7, 14];

    let pos = 0;
    for (let frame = 0; frame < sid.frames; frame += 1) {
      const frameOffset = frame * 25;
      const volume = (sid.regs[frameOffset + 0x18] & 0x0f) / 15;
      const voiceState = bases.map((base, voice) => {
        const o = frameOffset + base;
        const ctrl = sid.regs[o + 4];
        const kind = voiceKind(ctrl);
        const gate = (ctrl & 1) !== 0 && kind !== "off";
        return {
          gate,
          kind,
          freq: sidFrequency(sid.regs[o], sid.regs[o + 1]),
          duty: pulseWidth(sid.regs[o + 2], sid.regs[o + 3]),
          attack: ((sid.regs[o + 5] >> 4) & 0x0f) / 15,
          release: (sid.regs[o + 6] & 0x0f) / 15,
        };
      });

      for (let i = 0; i < samplesPerFrame && pos < totalSamples; i += 1, pos += 1) {
        let mixed = 0;
        for (let voice = 0; voice < 3; voice += 1) {
          const state = voiceState[voice];
          if (state.gate) {
            const attackStep = 0.001 + (0.018 * (1 - state.attack));
            env[voice] = Math.min(1, env[voice] + attackStep);
          } else {
            const releaseStep = 0.002 + (0.03 * (1 - state.release));
            env[voice] = Math.max(0, env[voice] - releaseStep);
          }

          if (state.kind === "off" || state.freq <= 1 || env[voice] <= 0.0001) continue;
          phase[voice] = (phase[voice] + state.freq / sampleRate) % 1;
          mixed += waveSample(state.kind, phase[voice], state.duty, noise[voice]) * env[voice] * 0.26;
        }

        // Soft clipping keeps loud three-voice sections comfortable.
        output[pos] = Math.tanh(mixed * volume * 1.8);
      }
    }
    return buffer;
  }

  class NativeSidPlayer {
    constructor() {
      this.context = null;
      this.source = null;
      this.cache = new Map();
    }

    async ensureContext() {
      if (!this.context) {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.context.state === "suspended") {
        await this.context.resume();
      }
      return this.context;
    }

    stop() {
      if (this.source) {
        try {
          this.source.stop();
        } catch (_error) {
          // Already stopped.
        }
        this.source.disconnect();
        this.source = null;
      }
    }

    async load(track) {
      if (this.cache.has(track.sid)) return this.cache.get(track.sid);
      const response = await fetch(track.sid);
      if (!response.ok) throw new Error(`Could not fetch ${track.sid}`);
      const sid = parseSid(await response.arrayBuffer());
      const context = await this.ensureContext();
      const buffer = renderSidToBuffer(context, sid);
      const loaded = { sid, buffer };
      this.cache.set(track.sid, loaded);
      return loaded;
    }

    async play(track) {
      const context = await this.ensureContext();
      const loaded = await this.load(track);
      this.stop();
      const source = context.createBufferSource();
      source.buffer = loaded.buffer;
      source.connect(context.destination);
      source.start();
      this.source = source;
      return loaded.sid;
    }
  }

  window.NativeSidPlayer = NativeSidPlayer;
})();
