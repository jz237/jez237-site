# Chemistry connected to the aquarium

13 September 2026. Supersedes the earlier control audit's descriptions of a lesson-only comparison and missing alkalinity tracking.

## What drives it

One ongoing 180 L model runs while the tank is visible, including during identification and close-ups. Default: one real second advances one simulated minute. Offscreen/hidden suspension and Pause motion stop the clock. Closing a lesson preserves it. No hidden-tab catch-up occurs. Pause chemistry holds time while deliberate actions (feeding, water changes and actual bites) can still change pools. This is an in-session simulation, restarted on page reload or explicit reset; it is not a sensor logger.

Flow, CO2 supply and lighting affect both the chemistry and the displayed circulation, diffuser and illumination. The day/night lesson and Evening/Daylight control change the ongoing light setting. The daily timer can be restored in Water chemistry. Temperature approaches the heater target gradually. The unchanged control shares the lighting but not extra food, temperature/flow/CO2 interventions or water changes. Predict & test uses an entirely separate model and never resets the displayed tank.

A normal accepted Feed fish action represents up to 120 mg dry food at an assumed 7% nitrogen: 65% flakes, 35% sinking pellets. If existing pellets prevent a new pellet release, only newly released food is added. Individual tetra and angelfish bites and Corydoras pellet consumption transfer the represented nitrogen out of the organic pool: 25% retained tissue and 75% digestion, released over hours. Visual expiration does not imply ingestion or remove chemical nitrogen. Remaining organic matter decays; plant turnover returns N to that pool. Pools are well mixed, so a bite is bounded by available organic nitrogen rather than an independent chemical calculation for each visible crumb. These ration sizes, composition, retention fractions and rates are assumptions, not measured feed or species data.

Reset also clears visible food. Generation IDs prevent any stale bite callback from spending a new comparison's food. Existing detailed geometry, swimming and collision handling remain unchanged.

## Accounting

All nitrogen pools use mg N/L: organic material, digestion, fish tissue, plant tissue, total ammonia, nitrite and nitrate. Added food is tracked as input. Nitrification transfers nitrogen between pools. Plant uptake transfers ammonium/nitrate into plant N; it does not delete nitrogen. A 30% water change exports 30% of dissolved ammonia, nitrite and nitrate. It retains detritus, animals, plants and attached biofilm. Replacement is explicitly assumed conditioned, nitrogen-free, 24 C, 4 dKH and air-equilibrated. It mixes dissolved inorganic carbon, alkalinity, temperature and oxygen rather than averaging pH.

The checked identity is: current nitrogen inventory + cumulative export = starting inventory + cumulative food input.

Nitrification uses oxidation stoichiometry: 3.43 mg O2 per mg ammonia-N converted to nitrite, then 1.14 mg O2 per mg nitrite-N converted to nitrate. The first step consumes 7.14 mg CaCO3-equivalent alkalinity per mg N. Oxygen/alkalinity availability bounds transfers. Simplified organic-N mineralization and ammonium/nitrate uptake alkalinity terms are included. Nitrifier biomass yield and counterion detail are not represented.

Photosynthesis removes inorganic carbon and releases the corresponding molar oxygen amount. Respiration and organic decay consume available oxygen and return inorganic carbon. Gas exchange is bidirectional, temperature-dependent for oxygen saturation, and sensitive to circulation. Oxygen cannot be spent below zero; it is not propped up by an arbitrary positive floor.

## Estimates and limits

The carbonate equilibrium solves pH from dissolved inorganic carbon and alkalinity, using dilute-water constants near 25 C and a bracketed root solve. This omits humic acids, phosphate buffers, mineral dissolution, ionic-strength corrections and temperature-adjusted carbonate constants. Consequently pH remains an approximate carbonate-system estimate, especially outside the neighborhood of 25 C or in actual aquasoil-rich water. CO2 exchange does not itself destroy alkalinity. Ammonia/ammonium partition uses pH and water temperature. NH3-N is shown as nitrogen, not as NH3 mass.

Oxygen solubility uses the EPA-listed freshwater polynomial at sea-level pressure. Respiration, nitrifier activity, growth, food composition and gas transfer are assumed parameters. No automatic feeding/fertilizer is silently added. Initial plant and animal nitrogen represent assumed biomass, not scanned mass. The model is mechanistic and conservative within its stated pools; it is not calibrated or validated as a prediction for this particular tank. No toxicity/stocking score is inferred from a single concentration. Nitrite/nitrate displayed as nitrogen differ from ion-mass test-kit units by approximately 3.29 and 4.43 respectively.

## Sources

- EPA Nutrient Control Design Manual, oxidation and alkalinity stoichiometry: https://www.epa.gov/sites/default/files/2019-02/documents/nutrient-control-design-manual-state-tech.pdf
- EPA Rates, Constants, and Kinetics Formulations, freshwater oxygen saturation polynomial: https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=9100R3IW.TXT
- USGS DOTABLES, temperature/pressure/salinity dependence and modern solubility references: https://www.usgs.gov/tools/dotables
- USGS alkalinity FAQ, carbonate equilibrium and interpretation: https://or.water.usgs.gov/alk/faq.html
- EPA ammonia pH/temperature relation (Emerson-type expression): https://19january2021snapshot.epa.gov/sites/static/files/2017-09/documents/r10-npdes-paradise-wa0025569-fact-sheet-2016.pdf
- USGS ammonia/ammonium speciation: https://www.usgs.gov/data/simulating-changes-distribution-ammonium-and-ammonia-versus-physical-and-chemical-conditions

## Checks

Automated tests cover stoichiometric consumption, no negative oxygen/N pools, a week of feeding/uptake/nitrification/water changes with N error below 1e-9 mg N/L, pH/CO2 direction, temperature-sensitive NH3 fraction and oxygen saturation, gradual heating, dilution with retained solids/biofilm, frame-rate tolerance, pause, challenge isolation, stale bite callbacks, and Corydoras ingestion versus visual expiration. Existing animal, rendering and collision tests remain applicable.

Browser checks verify actual feeding changes the comparison; advancing hours produces distinct readings; 30% water changes reduce dissolved nitrogen by the corresponding fraction; lesson close/reopen retains the clock and lighting; chart choices and reset are functional. No phone performance measurement or real-aquarium validation is claimed.

## Angelfish addition · 15 September 2026

The two small angelfish add an assumed 0.4 mg N/L tissue budget each to both the
ongoing tank and its unchanged control. Initial animal tissue N is now 2.8 mg N/L.
Respiration therefore includes their modeled biomass. These are illustrative
weights, not measured fish masses. Their bites consume existing flake nitrogen;
no extra ration or nitrogen is silently created.
