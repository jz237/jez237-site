# Hosted copy on jez237.com

Upstream: https://github.com/Leonxlnx/procedural-fire
Commit: 95ab0a9003e20f1b0a5556ac14b401dfa0a37596
Copyright 2026 Leon Lin. MIT license retained in LICENSE.

The upstream package metadata says ISC; the repository LICENSE grants MIT.
The upstream README and research/tooling are retained unchanged.

Site integration adds creator/license/back links, a visible site version, keyboard
activation and a readable unsupported-WebGPU message. Simulation, rendering, audio
DSP and quality defaults are unchanged. No runtime npm dependency or backend.

Build from the repository root: `node scripts/build-procedural-fire.mjs`.
This copies only index.html, src/ and LICENSE to demos/procedural-fire/.
The catalog entry follows Fire Pro. Run `node scripts/build-demos.mjs` after catalog edits.
Use the site's guarded full-site Pages release workflow, not a sparse-tree upload.
