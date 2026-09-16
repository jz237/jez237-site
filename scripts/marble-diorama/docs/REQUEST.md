# Marble Madness — Amiga Diorama Remake

## Summary

Rebuild the existing Jez237 game as a high-resolution 3D diorama with the six original Amiga courses, authentic Amiga music, faithful gameplay, and playable extras.

The highest priority is **matching the graphics to the physics**: the marble must visibly roll, collide, fall, and land on precisely the surfaces used by the simulation.

## Faithful campaign, graphics, and music

- Reconstruct **Practice, Beginner, Intermediate, Aerial, Silly, and Ultimate** using Amiga gameplay references. Audit the existing implementation before reusing anything; its course geometry and rules contain acknowledged approximations.
- Maintain a parity checklist for each course: layout, alternate routes, hazards, scoring, time limits and carryover, respawns, finish behavior, and ending. Include local two-player racing, independent clocks and scores, marble collisions, eight difficulty settings, and Amiga turbo controls.
- Use the selected **premium miniature** presentation: polished patterned marbles, tactile ceramic and stone tracks, colored course sides, modeled channels and edges, soft shadows, and restrained reflections. Preserve recognizable Amiga colors and silhouettes.
- Use a stable isometric camera with smooth scrolling, modest look-ahead, and zoom. Allow orbit only when paused, watching replays, or editing. Keep playable surfaces sharp and scenery outside the racing space.
- **Restore authentic Amiga music.** The current browser game’s synthesized recreations do not satisfy this requirement. Locate and verify original music data or faithful recordings against Amiga playback before marking audio complete.
- Preserve the original instrumentation, pitch, tempo, course assignments, loops, and transitions. Package verified audio locally with documented provenance and loop points; provide separate music and effects controls.
- Use original soundtrack selections for bonus courses without remixing them. Start audio after player interaction and handle pause, restart, and tab switching without overlapping tracks. If authentic audio cannot be obtained, report that dependency rather than substituting music and calling it original.

## Physics and geometry architecture

- Replace the canvas renderer and custom height-based solver with **Three.js and Rapier 3D**, using locally bundled, pinned dependencies.
- Run physics at **120 Hz**, independent of rendering quality. Interpolate positions and rotations for display and pause when the tab becomes hidden.
- Model each marble as a rigid sphere with matching visible radius, mass, inertia, friction, restitution, and rolling resistance. Apply bounded steering torque and calibrate acceleration, momentum, braking by reverse input, and turbo against the Amiga.
- Render the simulation’s quaternion directly. Patterns must rotate naturally through direction changes and slopes; airborne marbles retain angular momentum, and low-traction surfaces can produce visible slipping.
- Generate course meshes and colliders from one versioned `CourseDefinition`. Playable surfaces, triangle boundaries, transforms, and bevels must agree; avoid separate hand-tuned collision approximations.
- Weld adjoining surfaces and correct internal triangle edges to prevent snagging. Use continuous collision detection for fast marbles and suitable convex colliders for moving objects.
- Drive moving platforms, pistons, launchers, and deforming surfaces from the same physics clock. Their graphics and collision surfaces move together and transfer motion to the marble.
- Trigger impact sounds, rolling noise, dust, and shattering from measured motion and contact forces. Do not hide collision errors with visual offsets or position snapping.
- Keep rendering quality independent of gameplay: reduce shadows, reflection detail, decoration, and resolution when necessary, never collision accuracy or simulation speed.

## Playable extras and controls

- Add three bonus courses:
  - **Clockwork Foundry:** moving bridges, pistons, and timed crossings.
  - **Magnetic Observatory:** magnetic zones and tilting platforms.
  - **Crystal Cascade:** spring launchers, glass channels, and landing challenges.
- Keep new mechanics in bonus and custom courses so the original campaign retains its rules.
- Add untimed practice, course selection, optional checkpoint assistance, medals, and personal-best ghosts. Store assisted records separately.
- Record inputs, course revision, physics version, seed, and periodic snapshots for replay, slow motion, seeking, and non-colliding ghosts.
- Build a watchable demo controller that uses normal steering and turbo inputs. It must navigate and recover through the same physics as the player.
- Add an in-world course editor with floors, ramps, curves, channels, walls, gaps, moving platforms, hazards, starts, checkpoints, and goals. Include snapping, undo/redo, instant playtesting, and local JSON import/export. Use the same geometry compiler as the campaign.
- Store settings, medals, records, recordings, and custom courses locally using versioned storage. Separate old records because the physics changes.
- Support keyboard, mouse-trackball, gamepad, and touch controls. Include turbo, pause, restart, sensitivity settings, and concise instructions.
- Support local two-player through separate keyboard controls or gamepads, plus landscape split-touch controls. Keep mobile overlays clear of the marble and upcoming hazards.

## Build order, acceptance, and publication

1. **Audit and references:** document existing gaps, assemble Amiga course references, verify soundtrack sources, and create the parity checklist.
2. **Physics proof:** finish a playable test course covering flats, slopes, channels, seams, edges, drops, moving surfaces, and marble collisions before expanding the artwork.
3. **Original campaign:** complete and test all six courses, game rules, two-player mode, music, and ending.
4. **Diorama polish and extras:** finish lighting, materials, effects, bonus courses, ghosts, replays, demo, and editor.
5. **Release validation:** inspect desktop and phone layouts, test performance, publish, and verify the live game.

Acceptance checks:

- Settled contact gaps or penetration stay below **1% of marble radius**. Steady no-slip travel and rotation agree within **2%**; direction changes and airborne spin receive separate tests.
- Identical inputs produce matching simulation outcomes at 30, 60, and 120 rendering fps.
- Maximum turbo speed cannot tunnel through barriers or snag on otherwise smooth seams.
- Every campaign course is completed using normal controls, with alternate routes and each hazard verified against references.
- Test independent two-player timeout, collisions, respawn, finishing, pause, restart, and campaign completion.
- Complete all bonus courses and verify demo behavior, ghost playback, replay seeking, editor save/import round trips, and custom-course playtesting.
- Listen to every music cue against an Amiga reference and test loops, transitions, volume controls, and mobile audio startup.
- Target smooth 60 fps through adaptive graphics. Report actual test hardware and distinguish phone-sized viewport checks from physical-phone testing.

Use a separate Git worktree from current `main`, preserve other agents’ changes, retain the old game at a legacy URL, and update the existing Marble Madness page and games listing. Publish to GitHub and Jez237 only after validation, then verify the live campaign and demo.

**Defaults:** no paid services, local saves and multiplayer, original artwork, and authentic Amiga music as an explicit exception to creating new assets. Do not claim full feature parity while checklist items remain unresolved.
