import test from "node:test";
import assert from "node:assert/strict";
import { effectSamples, effectDurations } from "../src/effects.mjs";
test("all effect PCM is finite, audible, unclipped and fades to silence at device rates", () => {
  for (const rate of [44100, 48000])
    for (const [kind, duration] of Object.entries(effectDurations)) {
      const a = effectSamples(kind, rate);
      assert.equal(a.length, Math.ceil(duration * rate));
      let peak = 0,
        energy = 0;
      for (const x of a) {
        assert.ok(Number.isFinite(x));
        peak = Math.max(peak, Math.abs(x));
        energy += x * x;
      }
      assert.ok(peak < 0.5 && peak > 0.02, kind);
      assert.ok(energy / a.length > 0.00001, kind);
      assert.equal(Math.abs(a[0]), 0);
      assert.ok(Math.abs(a.at(-1)) < 0.001, kind);
    }
});

