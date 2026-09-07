# Additional painted attack frames — 5.5.0

All ten fighters receive an additional painted approach sheet. Built-in image generation used the existing repaired attack sheet as the identity/style reference. Exact prompts and selected source filenames are recorded in `approach-sources.json`; packed project assets are `../../assets/inbetweens/<fighter>-approach-v1.webp` with matching cell metadata.

The 160 packed drawings have complete transparent borders. Eight cells per fighter are selected for standing, crouching and airborne normal punches/kicks, including heavy attacks (80 new drawings used by those sequences). The remaining cells are reserved artwork, not advertised as additional live animation. Preparation occupies 35–75% of startup; retraction occupies 25–55% of recovery. Contact frames, authored special animations, gameplay timing and canonical pose traces remain unchanged. Late availability is latched per attack, preventing a mid-move image load from changing the sequence.

Both canvas and billboard renderers resolve the presentation frame against the correct bank's facing, scale and floor registration. Existing repaired artwork remains intact. Automatic CPU cadence uses 0.75× during neutral movement and 0.6× during exchanges; the on-screen Pace button cycles Auto / 0.5× / 1×. Pause toggles to Resume. These controls stay inside the demo on mouse/touch input.

Rebuild: set `SHARP_PACKAGE` to the installed Sharp module, then run `node tools/painted-flow/pack-approach.mjs <generated-master-directory>`. Tests cover every fighter's new punch/kick selection, active-frame exclusion, late loads, existing repaired banks, canonical pose chains, both renderers and the visible demo transport. All packed cells are checked for nonempty artwork and transparent gutters.
