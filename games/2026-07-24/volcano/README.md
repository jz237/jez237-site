# Volcano — Living Eruption v2

GPT Image supplied a clean photographic background (`assets/landscape-clean-v2.webp`) by removing the static eruption from the earlier landscape. The original generated ash photograph is no longer loaded by the renderer. The mountain and background stay stationary.

## Live rendering

- A 64-sample emission history advects new ash up a three-dimensional density field. The fragment shader integrates transmittance along the view ray, with three light-direction density probes for self-shadowing, cool ambient illumination and localized orange crater light.
- Three scales of advected volume noise provide billowing shapes and evolving smaller turbulence. Wind changes the column trajectory. Turning intensity off allows the existing material to leave the frame; restart clears its history.
- The volume renders to a bounded intermediate target: 56 ray steps on desktop, 32 on narrow screens. A deterministic 64-cubed R8 noise texture occupies 256 KiB. No video, external image API or runtime generation is used.
- Lava channels are extracted from the background color within the mountain region. A flow front advances downhill while hot material and dark cooling crust travel within the fixed channels. The underlying photographic rock stays stationary.
- Live embers, cooling ballistic bombs, terrain collisions, flank ash, sound, heat refraction and restrained bloom remain active.

This is a fixed-view photographic terrain and procedural volumetric eruption, not an orbitable 3D terrain or a scientific eruption forecast.

## Controls

Click/tap or **Erupt** adds a blast. Drag horizontally for wind; scroll or use the panel to zoom. **Space/Pause** freezes and mutes, **Sound** toggles audio, **P** opens controls, **R** restarts, **H** hides the interface and **D** shows diagnostics. `?qa` exposes rendering/simulation hooks for regression checks.

## Image provenance

The clean plate was edited using the built-in GPT Image tool on September 26, 2026. Source: the earlier generated erupting volcano. The edit preserves the camera, mountain, lava channels and twilight environment while removing all airborne smoke and ejecta. Original dimensions: 1672 × 941. Encoded as WebP at quality 94. Full prompt: `assets/landscape-clean-v2-prompt.txt`.
