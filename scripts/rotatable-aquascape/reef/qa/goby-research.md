# Diamond goby anatomy and behavior

Species: *Valenciennea puellaris*, diamond goby / orangespotted glidergoby. This is an added inhabitant requested by the user, not a claim that the small patterned fish in the original reef illustration is this species.

Sources consulted September 23, 2026:

- [Australian Museum species account](https://australian.museum/learn/animals/fishes/orangespotted-glidergoby-valenciennea-puellaris/): orange flank spots/dashes and blue head marks, sandy/rubble habitat and excavated burrows. The account describes pairing; only one individual is added here, without simulating reproduction or asserting an ideal stocking arrangement.
- [PALAIOS 2019, DOI 10.2110/palo.2018.040](https://www.konhauser.com/_files/ugd/161b8a_64845d0560234476b18ebe2b254ba8e2.pdf), *Bioresuspension behaviors of the gobiid, Valenciennea puellaris, and the biogenic sedimentary structures it produces*: observed head insertion into sediment, withdrawal and sediment sifting through the gills. Differentiates feeding from carrying/spitting sediment during burrow excavation. This implementation illustrates feeding, not burrow construction. The study's aquarium feeding rates are contextual observations, not a universal animation frequency.
- [FishBase morphology summary](https://fishbase.org/Fieldguide/FieldGuideSummary.php?c_code=242&genusname=Valenciennea&speciesname=puellaris): rounded caudal fin, two dorsal fins and coloration cross-check.

Implementation: a separately traced Blender body with paired gill covers, recessed modeled mouth, separate pectorals, ray-textured fins, shallow corneal domes, cream/orange skin and blue cheek detail. The shorter ventral fin contour keeps clearance over the sand during head dips. Reference generation prompts are saved under model-source/references/goby-prompts.md. The two-dimensional reference drives surface color; the fish has closed three-dimensional volume, articulation and occlusion.

Behavior: randomly selected short bottom-level moves, settling/inspection pauses, a brief head dip followed by mouth/opercular pumping and a small dispersed sediment stream, slower activity in blue hour, startle repositioning, and reachable low food selected using conservative swept clearance. The elongated body samples five terrain stations over uneven dunes. Existing schooling/open-water inhabitants retain their previous behavior. Timing, visible breathing rates and sediment size are illustrative display choices, not measured species physiology. No living sand-bed nutrition, excavation, burial or ecological stocking simulation is claimed.

Limits: conservative collision volumes are not triangle-exact anatomy contact; background coral in extreme QA macro views can occlude the inspection camera. Full-tank sand/rock/coral realism remains below the user's reference and requires continued work.
