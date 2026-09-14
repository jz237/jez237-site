# Atmosphere and racing — v2.6.0

- Rivals and the smart demo compare future wave heights along three nearby lines on safe open straights. They prefer smoother water, ease throttle for steep faces, and sometimes seek a suitable crest. Buoy approaches, ramps and restricted passages retain their dedicated guidance.
- Turning spray uses curved strips of water emitted into world space. It keeps its momentum as the hull turns away, spreads, falls and breaks into foam holes alongside droplets and mist.
- Bow-first landings throw water forward; stern-first entries throw it aft; side landings produce a wider, lower fan. The existing directional drag and yaw response now have matching spray. Clean level entries retain more momentum.
- The rider adds head pitch, a look toward the selected wave line, shoulder lag and corner lean. Hands remain on the steering grips and boots stay on the footrests through the existing limb solver.
- Big Surf and Storm Swell have a travelling weather front: cloud cover, a distant rain curtain, local rain, lighting, gust strength and extra physical chop share the same boundary. Venue conditions retain their authored weather. Restart restores the front to its initial position.
- The sky uses a continuous procedural cloud volume, height-dependent density, sunlight shading and atmospheric haze. The same cloud coverage shades water and scenery and appears in reflections. Graphics quality varies cloud integration detail (12/14/16 samples).

## Controls

Controls are unchanged. Watch smart demo is on the title screen. WASD/arrows steer and accelerate; Space brakes; B absorbs waves; Q/E trim; 1 requests a flip in the air; R rescues; Esc pauses. Phone controls remain available.

## Scope and verification

Clouds, rain and spray are efficient procedural approximations, not a full fluid/weather simulation. Wave-aware steering is deliberately bounded to preserve legal race lines. Weather fronts are enabled for the custom Big Surf and Storm Swell settings. Phone layout can be checked in the included responsive review page; actual phone hardware performance varies.

The full regression run passed 366 of 367 checks. Its cloud-variation failure was corrected by matching faster CPU/GLSL cloud drift; all 14 affected atmosphere and immersion checks passed on rerun. All course/class and championship tests passed. Browser verification completed a three-lap Big Surf race in 3:27.117 with zero missed buoys and the front arriving during lap three; replay preserved the live state, and restart returned to lap one. Landscape and portrait phone-sized demo layouts were checked. No game rendering errors were reported.
