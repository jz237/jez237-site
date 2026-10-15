# Existing-checkout publication recovery — 2026-10-15

The normal `releases/quarry-parity-20261001` worktree is occupied by `racewave-parity-20261014`, has nineteen commits outside origin/main and active uncommitted After the Storm scoring/UI work. Do not stash, switch, merge or publish that work on behalf of Quarry.

Reused the already-existing `D:/Projects/hidden reef header/releases/jez237-quarry-impact` checkout. Its original `codex/quarry-impact` branch remains at 529c847e8a03812491ff8de1f64b85f22f8166a8. Created `codex/quarry-scenery-release-20261015` at fetched origin/main d0349d70691217df609f34020c4b0e4da0755b52. No full-site copy was created. Both existing Hidden Reef MOVED-TO-EVO-X2.txt notices remain; their exact paths are excluded locally in Git info/exclude. The checkout had no tracked changes before the switch and was clean afterward.

The existing mandatory `D:/Projects/hidden reef header/deploy-reusing-stage.mjs` now accepts `--existing-checkout`, selecting that existing checkout. Default behavior is unchanged. Clean-tree, latest-origin, active-deployment, shared lock, Functions rebuild, preview/production checks and successful-release cleanup all remain in force. The original helper hash was verified before replacement. Local and Windows Node syntax checks passed. Candidate and original helper are retained locally in work/deploy; the small remote candidate is in the existing work directory.

Read-only comparison command:

    node "D:/Projects/hidden reef header/deploy-reusing-stage.mjs" --check --existing-checkout

It correctly stopped at the active deployment guard. Read-only process inspection confirmed PID 17360, node scripts/deploy_jez237_pages.mjs D:/Projects/.deploy/phila-traffic-density-20261015b, at observation time. Do not kill it, remove its files, or treat a stale record as proof it is still running. Recheck that process before the next comparison. No Quarry runtime/source was staged into the website and no push or publication was made.

Next: after other publication finishes, fetch origin/main and fast-forward this clean release branch. Recheck local and remote Quarry source hashes against the coast release before staging the validated farm/port changes. The current local game also includes the optional scoring implementation; its public service deployment still requires the authorization already requested (GLOBAL_SCORING_VALIDATION.md). Do not retry the rejected service deployment through another host/tool. Once a complete approved candidate is staged, committed and pushed, use:

    node "D:/Projects/hidden reef header/deploy-reusing-stage.mjs" --deploy --existing-checkout

This reuses the newest existing staging folder and runs the original mandatory wrapper. Cleanup retains the newest stage and recovery backup only after success. Do not bypass safety checks or publish other tasks' uncommitted work. Current farm/port/scoring implementations are local work, not a claim of a live release or full Wreckfest 2 parity.
