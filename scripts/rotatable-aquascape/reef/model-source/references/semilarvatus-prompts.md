# Semilarvatus model reference provenance

Generated September 27, 2026 with the built-in image-generation tool. No paid
API fallback, purchased models or stock assets. The user's approved yellow fish
with vertical stripes and a blue cheek was the artistic reference. Final shape
was traced into `profiles.json`, modeled and exported by Blender 5.2.1 LTS.
These references are illustrations, not specimen photographs.

## Reference prompt

Use case: scientific-educational. Create a highly detailed photorealistic lateral reference plate for modeling a golden bluecheek butterflyfish, Chaetodon semilarvatus, in Blender. One complete fish only, facing RIGHT, exact flat side view with no perspective foreshortening. Deep compressed nearly circular golden-yellow trunk, narrow caudal peduncle, gently rounded yellow tail with a nearly straight trailing edge, continuous rounded dorsal and anal fins following the oval body contour rather than exaggerated tang sails. Short pointed butterflyfish snout, small natural mouth, small realistic dark eye, blue-gray cobalt patch immediately behind and below the eye. Fine closely spaced subdued orange vertical stripes across the flank, extending subtly into the rounded dorsal and anal fins. Golden yellow translucent pectoral fan shown clearly on the near side. Natural fine scale detail and individual fin rays, not plastic, not metallic. Neutral diffuse studio illumination, no dramatic reflections. Centered whole fish fills about 80 percent of a landscape 1536 by 1024 composition with generous margin around every fin. Uniform charcoal-gray background. The supplied image is a color and marking reference; correct its exaggerated eye, long snout and tall tang-like fins to a believable Chaetodon semilarvatus. No tang scalpel at the tail, no black tail-base spot, no extra fish, no text.

## Clean-flank edit prompt

Use case: precise-object-edit. Edit this exact fish reference plate to create its clean skin texture for a Blender 3D model. Remove ONLY the near-side pectoral fin, the triangular fan across the middle-right flank whose base meets the body behind the gill. Fill its former area with continuous yellow skin, fine scales and uninterrupted orange vertical pinstripes matched exactly to the neighboring flank. Preserve the entire fish's position, size, silhouette, all OTHER fins including lower pelvic fin, mouth, blue cheek patch, eye, dorsal and anal fin outlines, tail, colors, lighting and gray background pixel-aligned. Do not move, resize or redesign anything else. The removed pectoral fin will be a separately animated mesh. No new fins or markings.

## Validation

Blender proof reviewed after correcting the forehead contour. Export contains a
closed body with a recessed mouth, two conformed gills, two shallow eyes, three
median fins, two pectorals and two pelvic fins: 16,712 source triangles.
The existing reef geometry/material/fin/navigation tests pass; navigation now
also exercises this species through three deterministic obstacle scenarios.
Browser review covered the real Explore selector, close-up, front/oblique tank,
feeding, pause/resume and a 390 × 844 viewport without horizontal overflow.
Freshwater bundles and their existing release receipt remain unchanged.
