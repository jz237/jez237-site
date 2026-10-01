# Progression and challenges milestone — October 1, 2026

This milestone advances the full Wreckfest 2 PC feature-parity objective. It does not complete that objective.

## Implemented

- Racer, Wrecker and Showman XP and levels, stored in a separate versioned browser profile. Existing settings and garage saves remain compatible.
- Thirty original solo challenges: ten racing, ten demolition and ten stunt events. Fixed stock cars, individual time limits/lap counts, bronze/silver/gold targets, saved medals, qualifying best scores and attempt counts.
- Live score HUD and results. Recoveries and sandbox traffic changes are disabled during challenges. Race medals require an actual finish and all ordered checkpoints. Survival requires the full duration, surviving condition and opponent damage.
- Physics-step telemetry measures chassis travel, grounded drifts, speed, actual opponent health loss, knockouts and landed jumps. Countdown, pauses, demos, online simulation and QA autopilot do not award progression.
- Event IDs prevent duplicate settlement. New medal tiers award their bonus once. Abandoned active sessions retain earned XP, while inactive completed attempts are recorded without XP. Storage failures are surfaced in the profile/results UI.

## Verification

- TypeScript and Vite production build passed on VENGEANCE; bundle `index-CKeb_Zvc.js`.
- Full candidate suite: 211/211 passed, including eleven progression/scoring/telemetry/save tests. Existing garage, vehicle, damage, world and source-recovery checks remain enabled.
- Browser inspection at 1280×720 verified challenge board layout, category selection, fixed-car event entry, live scoring, paused timer stability, recovery rejection and timed results.
- First Contact completed with 24 displayed damage, 76% condition, +4 Racer XP and +71 Wrecker XP. The profile showed one event and one attempt, retained the exact XP after reload, and did not issue a medal below the bronze threshold.
- Historical source audit chain preserves exact prior release bytes. The new snapshot layer does not alter historical expected hashes; runtime tests use current modules.

## Remaining proof and limits

All 30 medal targets still need sustained human driving and difficulty balancing on the real course. Unit tests establish scoring rules, not that every gold target is comfortably attainable. No new sustained GPU performance benchmark or wheel/gamepad accessibility audit is claimed. Progression is local to each browser origin, with no account or cloud synchronization. Challenge medals do not yet unlock parts or vehicles.

The public website has not been republished. The full roadmap still includes larger fields, additional locations and cars, more event rules, multiplayer expansion, replay/photo mode, a layered livery editor and deeper PC input support. See PARITY_PLAN.md.
