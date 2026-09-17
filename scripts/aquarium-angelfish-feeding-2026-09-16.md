# Angelfish feeding alignment

Fixed the final feeding approach to use the model's local mouth position
(.785, -.035, 0), transformed by each fish's scale and upright orientation.
The previous center-directed pursuit could miss sinking food while companion
steering deflected the final approach. Regression scenarios reproduced misses
with food at different heights/depths and a nearby companion.

The fish now brake according to their own mouth offset and make bounded,
fin-driven corrections in three dimensions. Companion preference fades during
alignment; exact swept whole-body collision checks remain authoritative.
Inspection pauses cannot interrupt a current food target. The pair select
different morsels, and approach screening uses the same mouth offset.

Food is consumed only after a collision-cleared movement brings the mouth
within .055 scene units of the actual particle. The mouth opens on approach,
then the confirmed bite drives the existing closing pulse and short pause.
Existing food-removal and nitrogen-accounting callbacks are unchanged.
These are illustrative animation parameters, not measured angelfish rates.

Validation:

- 236 tests passed, including both fish sizes, 60/20 Hz updates, falling food
  above/below/across depth, companion steering, mouth/model transform agreement,
  blocked contact, and pre-contact opening/pause/closing.
- Full planted-habitat regression: both angelfish ate before food expired;
  every checked pose stayed clear of the scenery and the other angelfish.
- Browser feeding with all inhabitants active recorded repeated actual bites
  at mouth-to-flake distances of approximately .053-.054 scene units. Confirmed
  visible approach opening and a 2.4 mouth animation pulse on consumption.
- No browser warnings/errors. TypeScript and production build passed.
- Build synchronization verified 83 assets across all three aquarium copies;
  Hidden Reef link check passed for 38 pages.

No geometry, textures, reflection resolution, or visual detail were reduced.
