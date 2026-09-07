# Old Jez and Benny atlas audit — 5.4.8

Reviewed 426 cells/images in 32 files: base combat atlases, portraits, motion,
motion2, motion3, walk, unified and all five extensions, current and legacy
specials, and HD base/special sheets. Scope is Jez and Benny.

The earlier 5.4.7 replacement list missed defects inside otherwise empty atlas
margins. Benny's base sheet has detached neighboring fists and boots; his legacy
specials contain clipped raised arms, cropped cap tops and white separator bars.
Other findings include a knockout missing its boots, an erased jump face,
cropped dash feet, and extremities cut at cell boundaries. HD copies preserve
several of those same defects.

116 cells were rebuilt from existing, visually reviewed complete companion
drawings. This count includes duplicated defects in SD and HD copies and the
previously routed repairs now fixed in the old files themselves. It is not a
count of newly generated animation drawings. Matching pose types were retained;
no move duration, active window or hitbox changed. Frame substitution can change
the illustration style in rarely used legacy fallback poses.

`old-atlas-audit.json` lists every reviewed file and every replacement with its
source bank/frame and finding. The original bytes remain in git at
`4990e7df82552cbc0104117ba8776f197db20b91`. The companion packing tool uses that
same baseline for calibration so repacking cannot drift after these repairs.

Verification: all 116 replacements have nonempty artwork and clear borders;
unaffected cells preserve their visible RGBA pixels exactly. Benny's repaired
base sheet was checked on an opaque backdrop for detached body pieces. Six
browser probes passed (both painted frame suites, pose chains, CPU render motion,
billboard renderer, console), plus eight targeted unit/worker checks.

Rebuild: `node tools/painted-flow/repair-old-atlases.mjs`.
Verify: `node tools/painted-flow/verify-old-atlases.mjs`.
Both require Sharp (or `SHARP_PACKAGE` pointing to its package directory) and
the audited git baseline. Repairs copy complete cells into their destinations;
they do not regenerate art or resize the remaining cells. A release-specific
query is applied to Jez/Benny SD and HD image requests to bypass stale copies.
