# Mini Moto — Pine Ridge Park

Local static adaptation of the published Mini Moto game at https://mini-moto-park.chipchaunceytheonlyone.chatgpt.site/, retrieved September 13, 2026 at the site owner's request. Original authorship remains with the original creator. SOURCE.json records asset provenance and original checksums.

The published browser bundles include the racing engine, Rapier physics, Three.js renderer, React UI, procedural audio, and rider management. Original models and textures are stored locally.

Adaptation: replaced the hosting framework's startup/preloader with a standalone React mount; changed the five game asset paths to relative URLs for both hosting roots. Gameplay routines remain intact. Browser-local park/roster saves retain the original storage keys and are separate per website origin.

Serve this directory over HTTP; no build, paid services, or original-host connection is required to play.
