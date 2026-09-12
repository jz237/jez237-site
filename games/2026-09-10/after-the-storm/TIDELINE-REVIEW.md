# Independent gameplay review · TIDELINE 2.0.0

September 12, 2026. Independent review of the upgraded physics, navigation, stunt routes and live demonstration. Renderer, camera and controls changes also received a read-only code review; hardware-browser evidence is recorded separately in [TIDELINE-UPGRADE.md](TIDELINE-UPGRADE.md).

## Findings and fixes

| Finding | Resolution |
| --- | --- |
| Twilight stunt approaches oscillated before closely spaced rings and misaligned the later ramps. | City-specific lookahead, heading settlement and precision approach points. The smooth navigable course spline remains separate from those helm targets. |
| Twilight checkpoint allowances expired before a physical route could reach them. | Calibrated section limits to 48 / 27 / 27 / 35 seconds. Both complete branches are now verified, not just the opening rings. |
| The city jump/dive pilot followed the outer buoy direction after committing to the shortcut, missing the wall crossing on later laps. | Preserve the committed lane and align to its actual ramp; trigger a dive close to re-entry. Full Hard jumping and Expert diving retain real collision checks. |
| An adverse city demo seed had its chosen outer branch overwritten, causing a prolonged unscored circuit. | Preserve the branch choice, settle the city exhibition pace and correct its late wrong-side approach. Recovery is deliberately city-specific: applying it globally regressed Port navigation and suppressed Sunny Beach's clean optional flips. |
| Sunset Hard clipped a pier support; Glacier Reverse missed a late-lap buoy beside the ice. | Two local, open-water helm approaches. Neither piles, ice, gate dimensions nor scoring were weakened. |
| The Fortress ridge verifier approached a trough using its old hold time. | Recalibrated the verifier to the supporting crest near a six-second hold. The existing clearance, impact and physical gate-crossing assertions remain intact. |
| A low-detail mesh replacement could retain the wrong detail until the craft changed distance. | The renderer owner made detail selection robust to late/replaced children and added a lifecycle regression. This was a code-review robustness finding, not an observed startup failure. |

Short incidental hops no longer make the verification pilot request an impossible full rotation. The player's trick controls remain unchanged. The new contact-dependent carving and progressive grip return were retained after route testing; no new airborne steering assist was added.

## Final receipts

| Check | Result |
| --- | --- |
| Complete `npm test` run | **290 / 290 passed**, zero failed, skipped or cancelled; approximately 214 seconds. |
| All nine venues × four classes | Three physical laps per combination; complete gate counts, zero missed buoys and no disqualification. Included in the full suite. |
| Twilight stunt branches × four class selections | Inner: 14 selected rings; outer: 11. Both: all four checkpoints, zero stunt crashes. |
| Sunset pier and city wall regressions | All required laps retain actual geometry/collision assertions; no collision exemptions. |
| Demo regression suite | **15 / 15**, including seed 1 Twilight branch commitment, zero missed buoys and zero rescue requests. |
| Surf-racing suite | **5 / 5**, including all four riders jumping, occasional clean flips, shared water sampling and ordinary elapsed time. |
| Seeded demo matrix | **44 / 44**: seeds **1, 42, 197, 811** × all **11 scenes / 9 venues**. 36 completed physical race laps and 8 completed stunt courses. |
| Additional Storm setting matrix | **9 / 9** venues, seed 42: a physical lead-rider lap each, zero missed buoys, disqualifications or rescue requests. |
| Patch hygiene | `git diff --check` passed. |

The seeded matrix advances `stepRace` at 1/60 second using `demoInput` until the ordinary `demoSceneDone` condition. Every race lead ski crossed the real finish before the 150-second limit; each stunt run reached four checkpoints and at least 14 rings. Scene times were **53.6–118.5 seconds**, with **zero lead-ski disqualifications or rescue requests**. There is no replayed position or injected lap progress.

## Boundaries of the evidence

- Demo completion is the lead ski's scene-completion rule, not a claim that all rivals finish before the next scene. Separate tests check racing speed, pack separation and all-rider jumping.
- Eighteen of the 44 seeded scenes recorded collision-indicator frames. The matrix establishes completion without stalls or rescues, **not universally collision-free driving**.
- Seeds do not exhaust every wave phase, rider, tune or human input. The Fortress timing check samples 5.9 / 6.0 / 6.1-second holds; it is not an all-weather automatic shortcut guarantee.
- Camera/water/controls code review found no remaining blocker. Hardware browser checks were performed by the implementation owner, not a second independent physical device. Physical phone performance and a physical gamepad remain unverified.
- The water is a shared surface-wave simulation with real-time rendering effects, not volumetric breaking surf or a claim of exact Wave Race 64 parity.

**Review freeze:** the final city-scoped recovery code passes the complete suite and the two scenario matrices above. No unresolved release-blocking finding remains in this review scope.
