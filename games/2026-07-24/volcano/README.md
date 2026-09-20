# Volcano — Living Eruption

The scene uses `assets/eruption-gpt-v1.webp`, generated with the built-in GPT Image tool on September 19, 2026. The original 1672 × 941 PNG was encoded as WebP at quality 94 without cropping or retouching.

The WebGL2 landscape shader applies overlapping advection phases to the ash column, channel-masked lava pulses, localized heat refraction, steam and vent light. A measured terrain skyline and the vent at image UV `(0.493, 0.488)` share the scene's cover/zoom transform with the fluid simulation. Ballistic fragments stop at the terrain; ash and embers remain independent particles. Existing audio is reused.

The generated image depicts an ongoing eruption: setting live intensity to zero does not erase the photographed plume or lava. This is an animated photographic composite, not a freely orbitable 3D landscape or a geophysical model.

## Controls

- Click/tap the landscape or **Erupt** for another blast.
- Drag horizontally to change wind; dragging does not trigger a blast.
- Scroll or use the panel slider to zoom.
- **Space** or **Pause** freezes simulation and mutes audio.
- **Sound on/off** toggles audio.
- **P** opens controls, **R** restarts, **H** hides the interface, **D** shows diagnostics.
- Append `?qa` to expose the existing `window.__volcanoQA` test hooks.

## Validation

Checked at 1440 × 900 and portrait touch-browser emulation at 390 × 844: asset loads, shader compilation, GL errors, numerical stability, eruption, pause/resume, mute, controls panel, zoom, reset, restart and drag wind. Both checks passed without page exceptions or failed demo asset requests. Portrait emulation is not a physical phone performance test.

## Image direction

A documentary-style panoramic basaltic stratovolcano at blue-hour twilight, detailed cooling lava channels, charcoal cauliflower ash billows lit orange from below, rugged foreground, distant hazy mountains and coherent natural exposure. No text, logos, UI or artificial geometric cone. Full generation prompt is recorded in `assets/eruption-gpt-v1-prompt.txt`.
