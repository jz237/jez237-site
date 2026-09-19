# Corydoras feeding update

The visible group increases from six to seven. Larger trial groups caused spawn
or long-run crowding failures in the fully planted habitat and were not shipped.
The larger-group open-floor stress test additionally covers twelve fish.

Feeding now detects descending pellets within 0.9 scene units of the floor,
uses a 4.2-unit detection radius, faster controlled turning and variable swimming
bursts with near-mouth braking. The head/body model, swept collision checks,
retreat behavior, bite pauses, actual-particle capture and food nitrogen callbacks
remain in place. Six-pellet portions and the twelve-pellet cap are unchanged;
portion locations rotate among all fish instead of always selecting the first six.
These rates are illustrative animation choices, not measured physiology.

Full planting regression tests exercise the seven-fish group across three seeds.
Browser QA explicitly requests the high-performance GPU to reproduce the existing
RTX 5090 baseline rather than comparing the integrated GPU against that baseline.
No baseline was regenerated for this release.

Validation: 264 behavior tests passed; full release gate passed on VENGEANCE.
Desktop and phone front/observation screenshots reviewed; 83 shared assets match.
desktop: 7 cories, frame p95 16.7 ms, update p95 2.9 ms.
phone: 7 cories, frame p95 16.7 ms, update p95 2.7 ms.

Staged secret scan reviewed: the only three findings are identical React DOM input-type tables (`password:!0,range:!0,...`) in the generated FilterExhibit bundles, not credentials. Unstaged input is only a local dependency symlink, excluded from deployment.
