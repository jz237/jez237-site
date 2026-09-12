# Shoreline drying update

The blue and alpha channels of the existing foam history now track absorbed sand moisture and short-lived surface water separately. Waves wet the beach only where their sampled surface reaches the terrain. The wet footprint stays fixed to the beach while surface foam drifts.

Fresh wash darkens the sand and reduces roughness for a visible sheen. The film drains over a few seconds; absorbed moisture then lightens over approximately 25-40 seconds without fresh wash, depending on local drainage. Partially wetted fringes dry first. Repeated waves replenish both channels. Sand above sea level no longer receives the old permanent wet band.

Adaptive quality changes resample the history rather than erasing it. Byte-format fallback targets use unbiased rounding to avoid wetness freezing through quantization. Venue height maps have finer resolution to match the water contact footprint more accurately.

Validation: 13 focused tests passed, including wet/dry transitions, repeated wash, pause, frame-rate independence, existing wave sampling and underwater fauna behavior. Browser checks covered the wet footprint, receding-water sheen, drying and high-to-low quality switching with no shader errors. The developer page source/shoreline-review.html uses the real ocean and terrain shaders; Drain beach removes the large surf while smaller natural waves remain.
