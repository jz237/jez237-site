# Black tang model reference provenance

Generated October 19, 2026 through fal with `openai/gpt-image-2` (quality
high), at the user's request. `fal_gpt_image.py` sent each request and
`fal-requests.json` records every request id, including one rejected plate.
Five paid generations were made in total. These are generated illustrations of
*Zebrasoma rostratum*, not photographs of a measured specimen.

## Plates

| File | Use |
| --- | --- |
| `rostratum.png` | Accepted 2304 x 1536 lateral plate: tracing, eye, pectoral and fin texture |
| `rostratum-skin.png` | Clean flank: near-side pectoral and pelvic removed for separately animated fins |
| `rostratum-fin-mask.png` | The only region taken from the edit when compositing the clean flank |
| `rostratum-texture.png`, `rostratum-skin-texture.png` | Edge-padded copies embedded in the GLB |
| `rostratum-dorsal.jpg` | Width profile along the body |
| `rostratum-front.jpg` | Cross-section check: tall lens with narrow keels |

The fish was shot on mid gray so its black silhouette could be traced.
`prepare_plates.py rostratum --luminance 105` composites the clean flank and pads the fish's own
colors outward into the backdrop, so fin margins never pick up a light fringe.
`trace_rostratum.py` writes the `profiles.json` entry and a review overlay.

The first lateral plate was rejected: its skin and fins read as carved wood or
fabric and the eye as a glass taxidermy eye. The second prompt asked for a live
fish photographed underwater and is the accepted plate.

## Lateral prompt (accepted)

Use case: photorealistic-natural. Asset: precise side-profile reference photograph for sculpting and texturing an interactive Blender fish model. A single LIVE fish photographed underwater through clean aquarium glass: whole body and every fin visible, perfectly lateral side view with no perspective foreshortening, nose pointing RIGHT, tail LEFT, horizontally level. Plain, even, medium neutral-gray background of empty water, uniform tone with no gradient and no vignette. No other animals, no plants, no rocks, no text, no labels. The fish fills about 78 percent of the frame width with generous empty margins; every fin is uncropped and clearly separated from the background. Real macro aquarium photography under soft neutral white diffused light, sharp focus across the whole fish, anatomically correct proportions.

Subject: Zebrasoma rostratum, adult male black tang (black longnose tang). Deep, strongly laterally compressed, nearly disc-shaped body. Uniform deep sooty black-brown coloration. Skin: smooth wet fish skin with tiny, closely spaced natural scales and a soft satin sheen, with very faint slightly lighter longitudinal scale rows on the flank. NOT fabric, NOT carved wood, NOT engraved, NOT a sculpture or taxidermy specimen. Characteristic long, narrow, protruding snout ending in a small terminal puckered grazing mouth, with a concave forehead profile above the snout. Small natural fish eye set high and well back from the snout tip: dark pupil, narrow dark-bronze iris, flush with the head, not bulging and not glassy. Subtle gill-cover edge. Tall sail-like dorsal and anal fins with smoothly rounded outlines: thin translucent smoky-black membranes with slender rays, becoming slightly see-through toward the margins. A short white bony caudal spine (scalpel) lies flat in a groove along the side of the caudal peduncle, with a small velvety dark patch of fine short bristles directly in front of it. Slightly emarginate translucent dark caudal fin. Near-side translucent dark pectoral fin held close to the flank just behind the gill opening; small dark pelvic fin on the chest directly below the pectoral base. No yellow, no blue, no stripes or bars.

## Clean-flank edit prompt

Sent with `rostratum.png` and a mask covering both near-side paired fins.

Use case: precise-object-edit. Edit this exact fish reference plate to create its clean skin texture for a Blender 3D model. Remove ONLY two paired fins on the near side: (1) the dark pectoral fin, the fan-shaped fin on the middle-right flank whose base meets the body just behind the gill cover, and (2) the small dark pelvic fin hanging below the chest. Fill the pectoral fin's former area with continuous velvety black-brown skin and fine scale rows matched exactly to the neighboring flank and the curved gill-cover edge. Where the pelvic fin hung below the belly, continue the smooth lower body outline and fill outside it with the same plain gray background. Preserve the entire fish's position, size, silhouette, the dorsal, anal and caudal fins, mouth, eye, gill-cover groove, white caudal spine and bristle patch, colors, lighting and background pixel-aligned. Do not move, resize or redesign anything else. The removed fins will be separately animated meshes. No new fins or markings.

## Dorsal view prompt

Sent as an edit with `rostratum.png` attached as the identity reference.

Use case: scientific reference, multi-view modeling sheet for a Blender 3D model. The supplied image is a side view of this exact adult black tang, Zebrasoma rostratum. Create a matching DORSAL view of the same individual: a live fish photographed from directly above, with its back toward the camera and both eyes visible on top of the head. The body is perfectly straight and horizontal across the frame, nose pointing RIGHT, tail LEFT, at the same scale as the side view, so the snout tip and tail tip span the same horizontal extent of the frame. Show the true thin, strongly laterally compressed body: seen from above the trunk is a narrow lens, widest just behind the eyes, tapering forward to the long narrow snout and backward to the slender caudal peduncle. The dorsal fin is seen edge-on as a thin dark line along the midline, the caudal fin edge-on as a thin line at the left, both pectoral fins slightly spread to either side, small white caudal spines on both sides of the peduncle. Same velvety black-brown coloration, scale texture and soft neutral diffused lighting as the reference. Plain even medium-gray background, no shadow, no other objects, no text, no labels.

## Front view prompt

Sent as an edit with `rostratum.png` attached as the identity reference.

Use case: scientific reference, multi-view modeling sheet for a Blender 3D model. The supplied image is a side view of this exact adult black tang, Zebrasoma rostratum. Create a matching FRONT view of the same individual: a live fish facing directly toward the camera, nose pointing straight at the viewer, perfectly symmetric head-on view, body upright and level. Show the long narrow snout foreshortened toward the viewer with the small puckered mouth at the center, one eye on each side of the head, and behind them the very thin, laterally compressed body as a tall narrow lens-shaped silhouette. The tall dorsal fin above and anal fin below are seen edge-on as thin dark vertical blades, the pectoral fins are slightly spread to each side, the small pelvic fins hang below the chest. Same velvety black-brown coloration, scale texture and soft neutral diffused lighting as the reference. Centered, the fish's full height including fins fills about 80 percent of the frame height. Plain even medium-gray background, no shadow, no other objects, no text, no labels.

## Rejected first lateral prompt

Use case: photorealistic-natural. Asset: precise side-profile reference photograph for sculpting and texturing an interactive Blender fish model. A single living fish, whole body and every fin visible, perfectly lateral side view with no perspective foreshortening, nose pointing RIGHT, tail LEFT, horizontally level. Plain uniform medium neutral-gray studio background, even mid gray with no gradient and no vignette. No other animals, no plants, no rocks, no text, no labels. The fish fills about 78 percent of the frame width with generous empty margins; every fin is uncropped and clearly separated from the background. Photorealistic macro aquarium photography under neutral white diffused light: anatomically correct proportions, restrained natural highlights, tiny real scales, shallow natural eye, operculum and small mouth, fine translucent fin membranes and visible supporting rays. Avoid stylization, cartoon eyes, plastic surface, glossy or metallic sheen, illustrative outlines, extra fins, duplicate fish, motion blur. True natural specimen quality; sharp focus across the whole fish.

Subject: Zebrasoma rostratum, adult black tang (black longnose tang). Deep, strongly laterally compressed, nearly disc-shaped body. Uniform deep sooty black-brown coloration with soft velvety matte skin; very fine, closely spaced, slightly lighter longitudinal scale lines visible only on close inspection. Characteristic long, narrow, protruding snout ending in a small terminal puckered grazing mouth, with a concave forehead profile above the snout. Small dark eye set high and well back from the snout tip. Tall sail-like dorsal and anal fins with smoothly rounded outlines, dark membranes with fine visible rays and a slightly lighter translucent margin. A bright white bony caudal spine (scalpel) lies along the side of the caudal peduncle, with a small patch of bristle-like setae just in front of it. Slightly emarginate dark caudal fin. Near-side dark translucent pectoral fin held close to the flank just behind the gill opening; small dark pelvic fin below the chest. No yellow, no blue, no stripes or bars.

## Modeling choices

- The dorsal plate's width is used for shape only. Its peak is capped at 0.068
  body lengths per side (about a quarter of body depth), because GPT Image
  tends to widen fish seen from above.
- `crossPower` 1.25 narrows the dorsal and ventral keels toward the lens seen
  in the front plate.
- `dorsalFade` shortens the rear fade so the dorsal lobe overhangs the
  peduncle as in the plate.
- Natural-history cross-check: https://en.wikipedia.org/wiki/Zebrasoma_rostratum
  (longer "beaked" snout, black body, white patch around the caudal spine and a
  bristle patch in front of it in males).

## Close-up pass against the user's reference sheet (October 19, 2026)

- Snout: the plate's generated fat, rounded lower lip made a bulbous tip; the
  last snout points are re-traced to the sheet's straight lower jaw line and
  pointed tip with a small mouth, with smaller lip rings (`lipRings`).
- Scalpel: the plate showed only a sliver of the caudal spine; the white
  sheath around it ("a white patch around the spine", Wikipedia) is painted
  into the skin texture at the sheet's proportions
  (`prepare_plates.py rostratum --luminance 105 --paint-scalpel 626,836,42,16`).
- Skin: fine, irregular imbricate scales in relief (a generated tile, about
  11 plate px per scale) replace bump from the plate's colors, which read as
  woven fabric up close; the velvet sheen is lower so the back stays dark.
- Eye: rounder cornea (`eyeDome` .0035) with a glossy wet coat.
- Body: slightly sharper dorsal and ventral keels (`crossPower` 1.45).
No new generations were needed.
