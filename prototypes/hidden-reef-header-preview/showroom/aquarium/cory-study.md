# Dwarf Corydoras: visual and behavior study

Six salt-and-pepper dwarf Corydoras (Corydoras habrosus) join the existing cardinal tetras, cherry shrimp and ramshorn snails. This is an illustrative aquarium simulation, not a validated animal-behavior or husbandry model.

## Evidence and interpretation

Mike Hellweg's firsthand keeping and breeding observations distinguish habrosus from pygmaeus and hastatus: habrosus spends most of its time on the bottom and often forages alone or with one or two companions. That supports independent browsing with weak local cohesion, rather than copying the cardinal school. He also describes searching substrate for food and emphasizes feeding these fish rather than treating them as waste disposal. [Corydoras in Miniature, Tropical Fish Hobbyist](https://www.tfhmagazine.com/articles/freshwater/corydoras-in-miniature-full-article).

A laboratory husbandry protocol describes fine sand as enrichment for natural Corydoras foraging. The simulation therefore adds separate sinking pellets and visible substrate inspections. [Chiang et al., 2024, Comprehensive Husbandry Protocol](https://pmc.ncbi.nlm.nih.gov/articles/PMC11467888/).

Air-breathing research on bronze Corydoras (C. aeneus) shows environmental and social effects. It is comparative evidence, not species-specific timing for habrosus. This version does not turn that evidence into a repetitive surface-gulp loop. [Pineda et al., 2020](https://eprints.gla.ac.uk/223448/).

The chosen speeds, fin frequencies, pauses, short excursions and body-wave amplitudes are visual tuning choices. They are not measured habrosus kinematics. The generated image is an art reference, not evidence for anatomy or behavior.

## Model and movement

The macro reference informed the stocky head, downturned mouth, three pairs of barbels, mottled cream/brown pigment, paired armor seams, dark eyes and translucent spotted fins. Connected ray geometry and membrane vertices share their fin pivots. A continuous traveling deformation increases toward the caudal peduncle while the head stays steady; pectoral and pelvic fins have independent phase offsets. Barbels sweep subtly during inspections. Individuals vary speed, alternate browsing and inspection pauses, make short excursions above the substrate, and loosely rejoin companions.

All six use two shared instanced geometry batches. Pigment is evaluated per pixel for close-up detail. The reference image loads only when opened; it does not add a texture download to normal aquarium startup. Existing plants, tetras and render resolution are preserved.

Swept body envelopes reserve space for fins and barbels. They check other cories, existing fish, shrimp, snails, tank walls, hardscape and indexed plant geometry. Conservative foliage motion envelopes reserve room for swaying leaves. Collision shapes intentionally allow more room than the visible skin; they are not a microscopic contact solver. Blocked fish try another gradual turn or a short retreat rather than tunneling or teleporting.

## GPT Image reference

Generated with the built-in GPT Image tool; no external paid asset or API was purchased. Saved as `cory-reference.png`. No image-generation CLI was used.

Prompt:

Create a photorealistic scientific macro reference plate for a detailed 3D aquarium fish model: salt-and-pepper dwarf Corydoras, Corydoras habrosus (Hoplisoma habrosum), NOT pygmaeus, NOT a tetra. Four views of the same healthy small stocky armored catfish: large left-side profile facing right, top view, front three-quarter view, and close detail of head and downward-facing mouth with three pairs of delicate short barbels. Creamy translucent silver-beige body, irregular dark brown salt-and-pepper blotches along flanks and back, two rows of interlocking bony flank plates, dark spotted translucent dorsal and forked caudal fins with individually visible fine fin rays; paired pectoral and pelvic fins, tiny adipose fin, glossy black eyes with silver rims, subtle gill covers. Fins attached anatomically, no decorative extra whiskers. Natural underwater macro photography with fine pale sand and dark teal water background, physically convincing soft aquarium top lighting. Extremely fine skin detail, wet translucent fin membranes, natural small asymmetries. Clean four-panel composition with no text, no labels, no watermarks. This is an art/modeling reference, not a research diagram.
