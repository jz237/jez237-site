# Upgrade review — 9 September 2026

Three substantial implementation and browser review passes were completed against the supplied visual reference.

1. Rebuilt the cabinet with shaped panels, layered edges, trim, hardware, dense electronics, CRT construction, speaker, supply and coin internals. Reviewed all four modes on desktop and mobile. Corrected inverted CRT/art UVs and oversized trim curves; removed the large editorial heading.
2. Added original material textures and marquee, six neighboring cabinets, brickwork, stools, service case, floor reflections and lighting. Reviewed all modes again. Found mobile exploded cropping and overly uniform lighting. Compressed the detailed GLB to approximately 1.7 MB.
3. Revised mobile framing, staged explosion, inspection focus, label spacing, atmospheric lighting and event-driven hardware demonstrations. Final refinement opened CRT mounting rails, reduced marquee bloom, improved coin labels, and displayed attract gameplay directly on the CRT. Reviewed final screenshots of Hero, Exploded, X-Ray and Play at 1440×960 and 390×844 plus component inspection.

Final browser checks: no page or console errors; no viewport overflow or unexpected fallback in any mode. Exercised orbit/reset, component selection, service manual and help drawers, tour controls, reduced motion, keyboard flight and fire, power pause, hardware contact press/release, coin credit, simultaneous mobile direction/fire and touch release. Seven unit tests pass for gameplay and model hierarchy, bounds, finite geometry and asset budget.

The reference remains more photographic. The exhibit uses original homage artwork and an interpretive model rather than measured Defender restoration geometry. Fine surface wear, cable routing, component variety, and lighting are simplified relative to the reference; mobile uses reduced rendering effects. Browser tests use desktop Chrome and an emulated touch viewport, not physical-device coverage. Physical gamepad and audible speaker output were not newly verified in this upgrade.
