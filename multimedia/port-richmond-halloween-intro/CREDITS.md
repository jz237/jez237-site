# PORT RICHMOND — Halloween Intro: credits and licences

A real-time Three.js horror film (about 88 seconds) made for PORT RICHMOND, Jez's Unreal Engine 5 zombie game.
Every frame is drawn live in the browser from code and the game's own assets; it is not a pre-rendered video.

## Assets

- **Neighbourhood, buildings, kit pieces, vehicles, textures and game audio** — PORT RICHMOND game assets by Jez
  (Witte St / E Venango St, Port Richmond, Philadelphia). All rights reserved.
- **Infected characters and the porch skeleton** — adapted from [Z-Anatomy](https://www.z-anatomy.com/)
  (CC BY-SA 4.0), which is based on BodyParts3D, © The Database Center for Life Science (CC BY-SA 2.1 JP).
  The derived character models in `assets/creatures/` and `assets/props/skeleton.glb` are released under
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Changes: rebuilt as watertight skinned meshes,
  rigged, given faces, wounds, hair, clothing and procedural textures.
- **Sound design** — the game's audio library plus sounds synthesised in code for this film.

## Software

- [three.js](https://threejs.org/) r185 — MIT License, © 2010–2026 three.js authors (`vendor/three/LICENSE`).
- Draco geometry decoder (Google) — Apache License 2.0, shipped with three.js.

## Making of

Direction, choreography, camera, lighting, procedural props and code were produced with AI assistance (Claude) for
jez237.com, working from Jez's written brief and his game data. The title and main menu at the end are a
non-interactive recreation of the game's front end.
