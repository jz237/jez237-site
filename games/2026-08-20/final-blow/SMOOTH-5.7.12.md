# Jez and Benny painted motion — 5.7.12

Standing punch/kick preparation and recovery now use eight ordered drawing slots instead of four. Forward and backward shuffles use eight distance-driven slots instead of four. The added defense drawings cover guard entry, block recoil and recovery from a real missed strike.

Three new 16-cell transition sheets per fighter contain 96 additional painted drawings. Separate contact sheets retain matching extended low/air punches and kicks. Crouched and airborne normals now follow preparation → contact → retraction → guard, instead of briefly showing an unrelated guard or spinning pose inside the strike. These changes target normal attacks, footwork and defense; they do not double the complete sprite library or change specials and fatalities.

Rendering can sample eligible normal attacks between simulation ticks. Contact boundaries, hitstop, landing, cancels and other move families retain their authoritative pose. Combat timing, damage, input handling and AI are unchanged. The move viewer can inspect quarter-tick samples for these two fighters. Actual visible drawing count still depends on move duration, demo pace and display rate.

Final decoded image bounds supply foot and airborne registration. Older standing flow/recovery sheets are registered to the same floor as the new drawings. Both standing punch-return rows and both low/air punching rows were corrected after visual review; a complete frame alone was not accepted as proof of a correct transition.

Validation:

- 25 targeted unit tests passed, covering drawing order, loading boundaries, contact timing, landing, locomotion and render interpolation.
- All 38 move-viewer sequences per fighter passed: 7,318 Jez samples and 7,166 Benny samples, with decoded images and valid source rectangles.
- Inspected rendered strips for standing punches/kicks, low/air normals, forward/backward footwork and high/low defense.
- Independent browser alpha checks passed for all 128 packed cells, with no opaque head, fist, boot or other content touching cell edges.
- Four CPU matches completed, using seeds 237 and 549 with both fighter orders; no runtime exceptions.
- Nine focused browser probes passed: normals, command specials, meter/combos, supers, move viewer, painted flow, CPU tactics, offline cache and console.
- Live wall-clock CPU rendering displayed both fighters' new sheets and recorded 491 fractional attack-pose samples; no exceptions.

Asset provenance and final packed bounds are in `assets/smooth/provenance-v1.json` and `audit-v1.json`. The contact sheets contain supporting source poses as well as their four routed contact cells; those duplicate source poses are not counted as additional in-betweens.
