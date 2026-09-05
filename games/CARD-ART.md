# Animated card artwork

The user approved publication of this gallery redesign on September 5, 2026. The existing SKYNET artwork is preserved; `card-art.js` provides hand-built SVG mini-scenes for the other 51 catalog titles. `card-art.css` supplies scoped animation and reduced-motion behavior.

Each entry has an explicit title-to-scene mapping and color palette. Illustrations reuse small drawing primitives, but compositions follow the game's theme. No game assets, external media, or extra 3D scenes are loaded. The combined source assets are approximately 33 KB before compression.

The renderer falls back to the existing icon for SKYNET and any future unmapped title. Unique SVG gradient IDs survive filtering. An IntersectionObserver pauses animations outside the nearby viewport; tab visibility and OS reduced-motion settings also stop animation. The existing title, URL, description, category, status, and tag data are unchanged.

Public gallery: https://jez237.com/games/

Local preview: http://127.0.0.1:8778/games/

Validation: JavaScript syntax and deployment guard; all 52 catalog entries and links retained; 51 new covers plus original SKYNET; unique SVG IDs; real animation; off-screen pausing; search and filters; desktop and mobile screenshots; reduced motion; no page or SVG attribute errors. Preview tooling is in `D:/Projects/Skynet-Cyberdyne-Logo/serve-gallery-preview.mjs` and `verify-gallery-art.mjs`.
