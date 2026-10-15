# Dunmere farm scenery validation

Source commit: 8cf2c17. Prepared and checked on Evo X2, with Windows candidate checks on Vengeance. Not published.

Added farm barns with closed gables, grain silos, hay bales, tractor/trailer, trees and paddock scenery. Driving and recovery corridors preserved. Saltmarsh unchanged.

Validation: 37 focused tests passed on both machines; production builds and multiplayer TypeScript checks passed. Browser scenery reported 27 draws, 101556 triangles, no errors. Normal-input player race and 24-car demo finished; all 24 demo cars finished. 308 visible damage marks recorded, zero misses, zero errors; preferences restored. No state/finish injection. Evidence: work/farm-scenery/gameplay.json and gallery.json. Screenshot: ../../outputs/farm-scenery-preview.png.

Publication pending: guarded install into Vengeance quarry-impact succeeded with a recovery backup; website refresh stopped before staging/commit/push/deploy. Website HEAD a541a1a7e and origin/main d0349d706 diverge by 19 local and 10 upstream commits. Local commits include separate native race reconstruction work. Do not silently publish those unrelated commits. Two untracked Hidden Reef MOVED-TO-EVO-X2.txt notices were preserved. No full-site copy created; no backup cleanup run because publication has not succeeded.

Resume: inspect ownership/readiness of divergent website commits or use an existing current clean website checkout. Do not rerun candidate checks/extraction or original installation blindly (farm inputs already installed and validation exists). Use guarded source staging from the tested candidate, preserve newer site work, then mandatory deploy-reusing-stage.mjs wrapper and live verification. Keep newest stage/backup only after successful release. Frozen farm fixture leaf is committed; do not recapture it.

Evo X2 tools confirmed available: Blender 4.5.13 LTS, Node/npm, Python, FFmpeg and Chrome. Node/Python/browser used for this increment; no claim of Blender-authored models.
