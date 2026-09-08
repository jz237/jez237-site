# Painted footwork — 5.7.1

Ten 1280×1280 WebP atlases, sixteen 320×320 full-body cells each. Created with built-in image_gen from the existing painted fighter references. The exact prompt set and correction notes are in prompts-v1.json. Original generated images are preserved outside the repository.

Cells: guard, forward step, gather, backward step, backward gather, stop, high block, low block, high recoil, low recoil, standing kick chamber, crouch punch windup, crouch kick retraction, air kick chamber, air punch recovery, landing.

The packer isolates connected full figures before repacking. Source rows are not assumed to be exact quarters: doing so cut shoes from adjacent rows into some frames. Every final figure has at least eight pixels of atlas padding; source bounds and calibrated common anatomical scale are recorded in audit-v1.json. All sixteen poses for a fighter share one scale; crouches are never independently enlarged.

Distance advances walking frames. Block and landing frames follow their actual state transitions. Additional attack frames stay outside contact windows. A sheet that loads after an attack starts is deferred until the next attack.

This release also adds contact-height head/body reactions and low leg buckles, missed-strike follow-through without changing combat recovery duration, character-specific timed victory sequences using the existing painted celebration art, and CPU spacing hysteresis so approaches and retreats continue through a small range band.

Validation: footwork/presentation unit tests; existing swing, bridge, flow and CPU strategy tests; all-roster Move Viewer traversal; browser CPU matches, controls, offline cache, title and painted-only checks. The game remains entirely painted.
