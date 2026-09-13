# Aquarium control and science audit — 13 September 2026

Scope: the eight right-hand learning lessons, exploration/identification panel, experiment model, and shared camera, pause, lighting, feeding and magnifier interactions.

## Corrections

- Overfeed once previously reset to its preset food load, then added another modeled dose when creating visual flakes. Visual feeding now has an explicit model-independent path.
- Challenge results previously reused mutable experiment state when returning from another lesson. Entering a challenge from another mode resets its prediction and comparison. Ordinary feeding does not mutate a completed challenge.
- The 15-minute speed option now retains its selected state after rerender/reset.
- Layer manipulation and reassembly use the view clock while biological motion is paused. Changing layer steps preserves the chosen separation.
- The tour restarts from the beginning when played at its last step, and manual step choices receive a full reading interval.
- Surface-exchange discussion retains the selected day/night state.
- CO2 injection bubbles now follow the model's light timer as well as its supply setting; negligible floating-point residual light at sunset does not keep bubbles on.
- Selecting a different inhabitant cancels prior close-up tracking. Clearing the organism dropdown clears the selection. Shared pause/feeding buttons reflect the main controls.
- Isolated-study camera framing now accommodates narrow aspect ratios. Behind-camera labels are hidden.

## Living close-ups

Added clearly named dropdown choices for Cherry shrimp and Dwarf Corydoras, using the same sculpted anatomy, material atlas, connected appendages and animated body geometry as the aquarium. Models are created only for the active lesson and disposed on exit. Specimens are held in place for anatomical inspection; the text distinguishes that demonstration from free swimming. Ordinary tank populations and their collision behavior are unchanged.

## Scientific review

The teaching explanations correctly distinguish mechanical capture from biological nitrogen transformation, photosynthesis from respiration, and nitrogen assimilation from export. Nitrification uses oxygen and transforms nitrogen; it does not remove all nitrogen. Root and flow diagrams remain explicitly illustrative.

The comparison remains an uncalibrated 180 L mixed-water model at 24 C, not a validated aquarium prediction. CO2 supply is a relative control rather than a direct concentration setting. Total ammonia nitrogen combines ammonia and ammonium; readings in mg N/L are not equivalent to ammonia-only or nitrate-ion test scales. Toxicity depends on chemistry and species and is not computed. The notes now state the lack of a full alkalinity balance, spatial oxygen gradients and species-specific toxicity. Oxygen saturation assumes freshwater near sea level; numerical bounds and empirical rate coefficients make this a qualitative teaching model.

Reviewed sources:
- USGS, dissolved oxygen and water: https://www.usgs.gov/water-science-school/science/dissolved-oxygen-and-water
- EPA, ammonia chemistry and oxygen use during nitrification: https://www.epa.gov/caddis/ammonia
- EPA, nitrification: https://www.epa.gov/sites/default/files/2015-09/documents/nitrification_1.pdf
- UF/IFAS, species-specific cherry shrimp anatomy and feeding: https://ask.ifas.ufl.edu/publication/IN1301
- Mike Hellweg, firsthand dwarf Corydoras observations, including bottom-foraging habrosus compared with pygmaeus/hastatus: https://www.tfhmagazine.com/articles/freshwater/corydoras-in-miniature-full-article

## Validation

120 automated tests passed, including new regressions for paused layer controls, specimen articulation/disposal, timer-controlled CO2 display and six-hour experiment outcomes. Existing animal motion/contact and rendering tests remain intact. TypeScript and Vite production build passed.

Browser checks: both new specimens render with their detailed materials; named specimen selector; overfeeding six-hour comparison; reset and speed retention; challenge run and re-entry after further experimentation; layer reassembly while paused and separation retained across steps; night retained at the surface lesson; shared Evening lock/unlock; selection of shrimp then cory and clearing selection. No application console errors observed. This is not a scientific validation of the simulated concentrations or measured phone performance.
