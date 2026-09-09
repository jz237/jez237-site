# Defender reconstruction — accuracy and completion ledger

## Target
US Williams upright, later-series board configuration documented in April 1981 drawing set 16P-3001-101 R-T, red-label program configuration. R8570 CPU/video, D8572 ROM, C8573 interface, D8359 linear power supply, D8373 power panel, D8224 sound-board option. This selects a documented compatible configuration; it is not a claim to reproduce one identified surviving serial number.

Monitor: Wells-Gardner K4600 family, supported by its service manual and a documented Defender restoration. This is a compatible reconstruction, not proof of factory fitment to a specific serial number. Individual chassis variant and exact physical dimensions remain approximate.

## Sources inspected
- S1: Williams, April 1981 drawing set, 18 pages. https://arcarc.xmission.com/PDF_Arcade_Williams/Defender_Drawing_Set_(16P-3001-101_R-T)_April_1981.pdf . Locally rendered/read: contents p2; wiring p3; R8570 layout/BOM p4 (enlarged BOM read); C8573 p7; D8572 p8; D8224 layout/BOM p16 and schematic p17.
- S2: Dave Langley's photographed board identification, early/later distinction. https://www.robotron-2084.co.uk/hardware/boardset/williams-defender-early-series-boardset . Early boardset must not be mixed into labels for the selected later-series target.
- S3: First-hand control-panel photograph, Matt Grommes, 2009. https://commons.wikimedia.org/wiki/File:Defender_control_panel_arcade.jpg . Used as reference, not embedded in production. Recreated control artwork remains an approximation.
- S4: Measured cabinet drawings by jbrew, spot checked by William Stillwell. https://www.classicarcadecabinets.com/defender.html . DXF side outline extracted (210 vertices): 70 inches tall and approximately 30 inches deep; 26-inch nominal width used for scale. Source itself identifies dimensional variations.
- S5: MAME Williams driver implementation. https://github.com/mamedev/mame/blob/master/src/mame/williams/williams.cpp . Inspected the Defender sound ROM identification.
- S6: Preserved Williams sound source. https://github.com/historicalsource/williams-soundroms . VSNDRM1.SRC identifies Williams copyright and Sam Dicker, October 1980. Reviewed hardware/effect categories; no redistribution license found. No source routines, wave tables or ROM bytes copied.
- S7: First-hand restoration with WG4600 monitor. https://arcadeblogger.com/2022/09/12/weekend-pickup-williams-defender/ . Monitor explicitly present in surviving cabinet; does not establish factory provenance.

## Verified electrical facts (S1)
- R8570: 6809E at 2I; 24 4116 16K x 1 DRAM chips at rows 1–3, columns R,S,T,U,W,X,Y,Z (48 KiB total); 5101 256 x 4 CMOS RAM at 1E; 7641 512 x 8 decoder PROMs at 3E and 3K; 12 MHz crystal CR1; three AA cells B1–B3.
- CPU TTL designations and locations must come from the p4 BOM, not randomly generated markings. Multiple permitted vendors/logic-family alternatives appear in the BOM; use family labels, no invented manufacturer/date codes.
- C8573 p7 shows a 6821 PIA plus input buffering and inverters. Jumper W1 must be installed for upright; p2 specifies W2 handling for non-red ROMs.
- D8572 red-label assembly chart explicitly leaves IC5 unused. Do not fill all 12 EPROM sockets.
- D8224 p16/17: IC9 6808/6802 processor option; IC10 6821 PIA; IC11 6810 RAM; IC12 sound ROM/PROM; IC13 1408 DAC; IC1 TDA2002 amplifier; IC8 7805 regulator; 3.58 MHz crystal; two 4 A slow-blow fuses. Amplifier output feeds 8-ohm speaker. Digital sound goes through PIA to DAC to amplifier; it is not a modern oscillator chip.

## Implementation and limits
| Area | Implemented evidence | Remaining approximation |
|---|---|---|
| CPU/video | R8570 major IC positions traced from sheet 4; 6809E, 24 socketed 4116s, 5101, two 7641s, crystal, three AA cells | Board dimensions and minor passives are schematic-informed approximations; exact copper routes omitted |
| ROM/input/sound | Separate D8572, C8573, D8224 layouts from sheets 7, 8, 16; eleven program ROMs and empty IC5; correct major package pin counts | No invented vendor or date codes; labels identify families and reference designators, not reproduced factory printing |
| Inspection | Four individually isolated boards; selectable chip regions and dropdown annotations, including DAC, amplifier and regulator | Explanatory descriptions are functional summaries |
| Supply | Open D8359-style assembly with five fuses, capacitors, TO-3 heat sinks; separate lower transformer | Connector positions, harness dressing and minor hardware not measured from an identified donor |
| Cabinet | Measured side outline, remounted controls/CRT/coin door/marquee/speaker, plywood edges and T-molding, fasteners and wear | Joinery, coin acceptor internals and some brackets are approximate; recreated artwork is not a licensed original scan |
| Controls | Seven-button configuration checked against S3; caps clear bezel; joystick and leaf-switch movement | Artwork fine printing and exact center-to-center dimensions not proven against a factory drilling template |
| Monitor | K4600-family main board, upright cards, neck board, socket, yoke, convergence/purity rings, wedges, flyback and HV lead | Family-level construction; not component-for-component chassis emulation |
| CRT image | Curved display, derivative-filtered scanlines, RGB phosphor mask, restrained convergence/halo, glass reflection, mipmapped display | A shader approximation, not electron-beam simulation |
| Game | Autonomous abduction, laser release, falling catch, delivery, red pod swarmers and persistent bomber mines retained | Original implementation inspired by Defender; no original game ROM/emulator; timing and scoring are not cycle-accurate |
| Sound | Newly synthesized event-specific firing, thrust, explosion, abduction, catch, delivery, hyperspace and credit effects; 8-bit quantization and filtered speaker output | Explicitly labeled approximation, not original sound or instruction-level emulation |
| Signals | Control-to-interface-to-CPU, ROM/sound/speaker and supply connections; input-driven activity | Illustrative functional paths, not measured electrical waveforms or a complete wiring loom |
| Materials | Original procedural fiber, surface wear, dust and roughness variation; distinct label atlases | Wear patterns and arcade room are artistic reconstruction |
| Orbit | Drag-distance threshold prevents accidental selection; foreground scenery cutaway prevents wall occlusion; camera stays above floor | Scenery cutaway is an exhibit interaction device |

## Additional primary and first-hand evidence
- Wells-Gardner service manual, figures 13–18: https://www.thegeekpub.com/wp-content/uploads/2023/02/Wells-Gardner-K4600-Service-Manual.pdf . Reviewed tube alignment/yoke, MQ-29 main board, neck board, power card, H/V and interface cards. Research-only copy; no scanned pages embedded in the site.
- Cabinet CAD: https://www.classicarcadecabinets.com/uploads/4/9/8/2/49822065/defender.dxf . The source estimates 96% accuracy and notes donor variation. The exhibit does not claim toleranced manufacturing accuracy.
- Sound source inspected: https://github.com/historicalsource/williams-soundroms/blob/main/VSNDRM1.SRC . Availability is not public redistribution authorization.

## Exact sound asset needed
A lawfully usable copy of `video_sound_rom_1.ic12`, 2048 bytes, CRC32 `fefd5b48`, SHA-1 `ceb0d18483f0691978c604db94417e6941ad7ff2`, together with permission covering public redistribution on this website. The identity is from the MAME Williams driver. No ROM was downloaded or bundled. Supplying a ROM would still require implementing and validating the corresponding sound CPU/PIA/DAC emulation; the current synth must not be described as authentic original audio.

## Implementation and visual-review passes
1. Historical geometry/electronics: replaced generic repeated boards, generic power box and unsupported fan. Traced major layouts, extracted measured cabinet outline, rebuilt monitor and corrected clearances. Browser close-ups exposed a glTF optimization issue merging label materials and mobile cards obscuring boards; distinct atlases and isolated, repositioned board cameras fixed these.
2. Materials/CRT/audio: added surface-specific roughness, phosphor/scanline shader and individually triggered original synthesis. Desktop/mobile screenshots exposed monitor apron and board-edge intersections; remounted tray and removed overlapping trim. Browser analyser measurements verified audible opt-in output and silence on pause, power-off and mute.
3. Interaction/performance: cropped unused atlas space, batched geometry by material and excluded hidden closed-cabinet electronics. Added chip selection. Full-orbit visual review caught wall occlusion and accidental selection even though the first automated script passed. Added scenery cutaway and click-distance guard; strengthened QA to require actual camera movement and no selection during drags. Final desktop/mobile matrix passed with actual camera movement and no drag selections; screenshots of all four modes and chip close-ups reviewed. Closed the rear crown seam and changed the monitor surround to a matte diffuse material after the final visual review. Detached ribbons are hidden during isolated board inspection.

## Validation snapshot (2026-09-09)
- Production build passes TypeScript and Vite. 18 source/model/sound tests pass. The autonomous-display tests explicitly forbid ground pickups; a separate legacy playable-game test is not the displayed demo.
- Optimized cabinet: 187 meshes, approximately 389,000 triangles, 5,195,984 bytes; bounds 1.22 × 3.40 × 1.56 model units.
- Desktop Chrome and a mobile-sized Chrome viewport tested. Mobile viewport is not evidence of physical iPhone/Android GPU performance or Safari compatibility.
- Prior measured high-quality frame submission approximately 334–613 draw calls across modes including shadows/postprocessing; mobile performance setting approximately 129–221. Final figures may change with visibility and camera angle.
- JavaScript bundle remains approximately 1.28 MB before compression (358 KB gzip); Vite reports a size advisory. Geometry detail is retained for close inspection.
- Browser audio/power/pause/quality checks and autonomous rescue-phase checks passed on both viewports with no browser errors. The final full rotation matrix passed; restored front views retain the live CRT.
- Publication is verified separately after this source commit; this ledger records implementation and local review evidence, not deployment status.
