# Reference graphics pass — v2.9.0

The target was the supplied coastal-racing reference: sculpted cloud masses, warm reflected sunlight, turquoise wave faces, finely broken whitewater and more substantial rocky scenery, while retaining playable performance.

## Shipped rendering changes

- A locally saved panoramic cloud texture replaces the repeated per-pixel cloud ray march when available. Sky, water reflection fallback and environment lighting share it. Sun direction, venue tint, night, weather dimming and slow drift remain live. The procedural sky remains the load-failure fallback.
- Stronger mipmapped capillary normals break up smooth wave reflections. Revised optical color, finite sun highlights and face lighting keep deeper water dark and crests readable.
- Seamless cellular foam is generated once into a 256-pixel texture with mipmaps. Existing world-space foam history still carries crests, wake trails and wet-shore interactions. Residual foam coverage is reduced so open water stays visible.
- More detailed spray at medium/high settings; low retains its emission budget. The existing water-contact conditions still decide when spray appears.
- Distant landforms use asymmetric peaks, eroded surface detail, photographic rock shading and slope-dependent vegetation. More exposed rocks fill the existing coastal scenery. Racing terrain, collisions and navigation are unchanged.
- Reuse the environment prefilter generator and refresh it less often when weather is stable. Existing adaptive resolution, reflection/refraction budgets and scenery culling remain active.

## Verification

Browser: local Codex in-app browser, Windows host. Frame rates are measurements on this host, not a guarantee for physical phones. QA uses a rolling 240-frame window, with inactive or suspended tabs excluded.

- 1280×720 medium, Sunny Beach: 60.0 fps; 95th percentile frame interval 16.8 ms; CPU 95th percentile 15.0 ms.
- 1280×720 medium, Sunset Bay: 48.5 fps; 95th percentile frame interval 33.4 ms; CPU 95th percentile 24.3 ms.
- 844×390 landscape, low: 59.7 fps; 95th percentile frame interval 16.8 ms; CPU 95th percentile 14.5 ms. Compact demo UI and Take control verified.
- 1280×720 high, Twilight City storm free ride while afloat (one craft): 60.0 fps; frame P95 16.8 ms; CPU P95 10.7 ms. This is a rendering sanity check, not a four-rider race benchmark.
- Browser shader/console check: no errors in the tested daytime, sunset and Twilight City storm scenes. Night water retains reflected building lights and a readable horizon.
- 29 targeted rendering-budget, foam life, quality/input and frame-metric tests passed.
- 26 demo, speed, wake-crossing and immersion tests passed, including the full demo tour.

## Asset and practical limits

Cloud image: [assets/sky/coastal-clouds-v2.png](assets/sky/coastal-clouds-v2.png). Generated with the built-in image_gen tool; no paid external API or third-party photograph was used. The tool returned 1774×887 pixels (not the requested 3840×1920). The original reference is an art-direction target, not an exact reproduction.

Final image prompt: “Upscale and refine this sky panorama into a production 3840 x 1920 pixel equirectangular texture (2:1). Preserve full-sphere composition and all cloud positions. Add photographic high-frequency cloud billow detail and crisp silvery/golden edges, remove soft blur. Preserve cloudy blue gray atmosphere and bright central warm gap, no sun disk. Make the left and right edges seamlessly wrap to one another. No land, no water, no objects, no text. Do not crop or change framing. Lower half remains haze. The final output must be 3840 x 1920 pixels so cloud detail remains sharp when a 60-degree portion fills a browser viewport.”

The cloud shapes are baked into a panorama; they do not evolve as a full fluid volume. Fine ripples, foam, spray and wet sand are real-time approximations. The game continues to use the same shared displaced wave model for visible swells and jet-ski buoyancy. The increased top speed remains in place.
