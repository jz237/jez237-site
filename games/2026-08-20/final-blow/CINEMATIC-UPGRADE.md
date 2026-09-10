# Cinematic knockout and fatality upgrade

Goal: implement every cinematic suggestion from the conversation for all ten fighters. This is in progress; 5.7.15 remains the published release.

Required delivery:
- One character-specific knockout and two distinct staged fatalities per fighter.
- Dedicated painted attacker and victim sequences with anticipation, contact, reaction and held aftermath.
- Believable buckling, bracing, falls and settling; adapt falls to punch, kick, uppercut and wall impacts.
- Controlled close-up inserts and readable wide contact shots, without animated background scaling.
- Arena-specific dust, puddle disturbance, debris, impact marks and lingering aftermath.
- Music ducking, distinct impact sounds, aftermath space and delayed victory announcement.
- Verify all ten fighters in both scene roles, both fatalities, both facing directions, edge positions, reduced motion, graphic effects disabled, and CPU playback. Publish and verify the public release.

Implementation order: establish Jez/Benny benchmark; inspect its complete scenes; extend dedicated assets and choreography to the other eight; run roster-wide checks; publish. A benchmark or data table alone does not complete this goal.

Current evidence: existing fatalities reuse regular combat poses and a shared projectile staging function. A residual time-varying fatality lens scales the background. First new Benny knockout source generated in work/cinema580/benny-ko-source.json; it still requires extraction, consistent anatomical scale/ground registration and playback review.

No additional paid services or asset purchases are authorized.

## Checkpoint

- All ten fighters now have new 16-frame backward KO sheets (160 drawings), integrated through cinema-ko pose/preload/palette atlas/drawing paths. Packer uses one uniform scale per sequence and 10px bottom padding. Assets: assets/cinema/{id}-cinema-ko-v1.webp. Source provenance and audits: work/cinema580; packer: work/pack-cinema580.mjs. Commissioner extra-arm source repaired before packing.
- Roster browser probe work/probe-cinema580-ko.mjs passed all ten fighters, both facings, all 16 cells, no browser exceptions. Contact sheets rendered and visually inspected for every fighter at least one facing. Full images stay connected and on floor. Edge positions, alternate palettes, reduced motion, real CPU KO causes and transition scale still need checks.
- New drawings bypass downTilt and procedural stretch/rotation; floor correction applied. Also disabled idle bob and crouch squeeze for cinema-ko. Alternate palette handling currently returns original cinema atlas and still needs correction.
- Landing thud/floor impact moved to tick31 to match hips contacting the floor (~0.52 sec). This happened after roster probe page load; verify landing timing with a fresh dedicated probe.
- Winner holds guard until 1.65 seconds after KO, after victim settles at1.3. Main winner banner and speech now use a presentation-only pending call sampled from phaseTime; pause holds this clock. Unrelated unlock announcements cannot interrupt the fall. work/probe-cinema580-timing.mjs passes paused hold, settled victim before announcement, and eventual JEZ WINS; evidence work/cinema580/victory-timing.json. Timeout decisions remain immediate. Round story callouts start with delayed victory. Music stinger is still immediate and needs the planned audio arc.
- engine/cinematic-scenes.mjs defines 30 scene identities and beat clocks, but these metadata are NOT completed live signature attacks or fatalities. knockoutFrame is integrated. New module added to service-worker shell.
- finisherLens is fixed at1; performFinisher still initializes cinematicZoom1.24 and peakZoom1.24: remove that residual and verify transitions before claiming fixed stage throughout.
- Syntax check and4 targeted cinematic/direction unit tests pass. No full regression yet.
- Next: dedicated attacker KO and both fatality art, two genuinely distinct choreographies each, portrait inserts, alternate cause falls, stage aftermath and audio arc. Extend/test whole roster, both roles/facings, edges, graphic-off, reduced motion, CPU. Do not treat fall sheets alone as completion.
- No cinematic upgrade published; public remains5.7.15. Goal active until all required delivery is implemented, reviewed and published. Unrelated 3D assets/review PNGs must remain untouched.
## Latest continuation: staged Jez/Benny benchmark

Previous turn classified as progress: new source artwork, live choreography, rendering and browser evidence changed.
- Created two cinema-strike sheets (16 generated cells each;13 curated cells per fighter used, excludes arm-switch drawings). Prompts and sources: work/cinema580/{jez,benny}-strike-source.json. Packer now anchors rear shoe for strike sheets; full bounds audited. Renderer restores body origin by80px Jez/67px Benny in atlas units. These deliberate offsets need transition review in real CPU play across sizes.
- Added live state.koScene for plain grounded KOs won by Jez/Benny. createKnockoutScene/sampleKnockoutScene in engine/cinematic-scenes.mjs stage walking approach,320px gap, strike, victim fall, landing, victory. Scene is serialized/restored in rollback snapshot, reset on round, and independent of asset readiness. Other eight winners still use fall-only path pending their signature attack art. Airborne defeat cases also fallback and need cause-specific scenes.
- updateKnockoutScene runs after fighter updates; strike/impact/landing cues keyed to its phaseTime clock. It triggers heavy whoosh shortly before contact, heavy impact and KO/stinger at contact, floor landing at .516sec after contact. Landing event duplication suppressed in regular down timer while scene active. Scene duration is impact+4.9, victory at impact+1.65. No fatality behavior is marked complete by this KO path.
- Victim uses cinema-ko frame0 during anticipation, avoiding prior abrupt stand-up at impact. Both art sequences bypass procedural distortion. Generic cinema atlas loader now applies alternate palette pipeline (not browser-verified yet). Added2 detailed painted portraits and full-frame static anticipation inserts for Jez/Benny KO and existing fatality pre-contact windows. Inserts clear .28sec BEFORE impact. Saved assets: assets/cinema/{jez,benny}-portrait-v1.webp; provenance/prompts work/cinema580/{id}-portrait.json, packer work/pack-cinema580-portraits.mjs. Built-in imagegen used, no paid API/purchase.
- Removed performFinisher initial1.24 zoom/peakZoom. Remaining full camera behavior needs real CPU/reduced-motion verification; pure lens test alone insufficient.
- work/probe-cinema580-pair.mjs PASS both winners and both facings with curated strike frames and all16 fall frames. JPEG captures work/cinema580/{id}-pair-{facing}.json, reviews via work/review-cinema580-pair.mjs. Visual reviewed Jez+1 prior spacing fix and Benny-1 after fix; latest contact sheets all regenerated. Need inspect latest Jez+1 and remaining facings before blanket visual claim. First PNG probe stalled returning huge screenshot batch; canceled only its exact NodePID, child browser ended; JPEG rerun passed. No jobs currently running.
- work/probe-cinema580-insert.mjs PASS4 shots including paused clock, rollback scene restoration, body fully settled before announcement, eventual correct winner text. Results work/cinema580/insert-timing-results.json, live portrait JPEGs bothfacings. Viewed Jez+1/Benny-1 live portraits, heads/fists intact, text readable.
- Latest syntax plus6 targeted tests pass. Additional whoosh cue added after browser probe; runtime audio needs listening review. Original fall-only roster probe and old timing probe now need adaptation because Jez/Benny winners have approach/strike before falls.
- Must still complete: other8 signature KO attackers/portraits, all20 distinct staged fatalities with dedicated attacker/victim art, cause-specific falls, more arena-specific consequences, full audio stage, exhaustive roster roles/facings/edge/reduced-motion/graphics-off/palettes/CPU and full regressions, then publish. Public remains5.7.15, all cinematic changes local/uncommitted. Keep goal active.

## Latest continuation: Jez distinct fatality staging

Previous goal turn was progress. This continuation generated, integrated and browser-tested2 new sequences; no processes remain running.
- Added assets/cinema/jez-cinema-fatal-{0,1}-v1.webp,16 cells each. Built-in imagegen source/prompts in work/cinema580/jez-fatal-{0,1}-source.json. Packer applies rear-foot registration to every non-KO cinema bank;14 total sheets224 packed drawings now. Both raw sheets visually reviewed, connected-components and edge/padding pack audit passed. They are high cable pull and low sweeping cable pull, not reused combat frames.
- engine/cinematic-scenes.mjs paintedFatalityScript now authors Jez variants with separate timings, poses and victim paths. Low variant shifts prime/trap+.12s and kill+.35s, different body positions. Each has16 art-frame keys. projectileFinisherScript integrates this, preserving old scripts for other9. fighterAnimationPose resolves new attacker banks before old motion code. Current helper called twice in projectileFinisherScript; can refactor once for clarity later. Generic cinema atlas loader/preloader admits both Jez banks.
- Initial full-scene review exposed old victim renderer rotating/slicing body below floor. New painted path now draws its victim from dedicated cinema-ko fall bank: frame0 anticipation,1 after trap,1..15 after final. updateFinisher overrides vy/vr to0 for this path. It bypasses legacy body slicing via activeGraphicFatality(null for painted scripts), procedural postkill twitch/slump and severed-limb/gore-fragment spawning. IMPORTANT: these new scenes currently preserve the whole body, with blood and impact effects. Injury-specific/dismemberment artwork is NOT complete; do not claim realistic anatomical fatality completion from this intermediate replacement.
- Wound/effect anchor now follows estimated fall progression instead of old rotated-stump coordinates. This is an approximation and still needs actual atlas body/cord contact anchoring. Legacy giant impact drawing, duplicate projectile sprite and focus burst are suppressed for painted path (art already contains mouse/cord). Some legacy neon gore/lens/signature effects remain and need final aesthetic review.
- New path preserves original stage (finisherRealityAmount returns0), has fixed native zoom. It triggers landing floor impact and foley at31/60sec after kill. Attacker glow reduced. Fatality bank guard scale measured relative to KO standingheight272: high272/246, low272/283. Generic translation offset80atlaspx Jez used; foot/scale transitions still need broader review.
- Labels for new staging are HIGH CABLE CAST / UPPER BODY BIND / FINAL CABLE PULL, and LOW CABLE CAST / ANKLE BIND / LOW CABLE REAP; titles remain NEON GUILLOTINE / VINYL WRAP. Avoids announcing a limb sever when whole-body artwork is playing. Profile metadata still includes old anatomical limb/device descriptions for legacy anchors; this needs coherent final resolution.
- Painted fatalities have a static opening portrait cut for first.42sec to cover staging reposition; another intent insert before final clears.28sec before contact. Never animate stage scaling. This opening cut was last change and playback probe rerun passed; latest contact sheets should be regenerated if reviewing opening appearance.
- work/probe-cinema580-fatal.mjs PASS8 cases:2 Jezvariants x2facings xgoreon/off, all16 attacker frame indices, zoom1, no runtime errors. Work captures work/cinema580/jez-fatal-{variant}-{facing}-{gore}.json; filmstrips via work/review-cinema580-fatal.mjs. Viewed high+1goreon before victim correction, low-1goreon after correction, latest high+1goreoff after size/effect/label corrections. Do not blanket-claim all8 visually reviewed.
- Syntax and7 targeted tests pass. New test verifies distinct Jez variants,16 ordered art keys, separation>=200 and constantzoom. Narrow tests are NOT full roster or visual proof. QA graphicFatality accepts optional6th facing arg (-1 swaps positions) for tests.
- NEXT: refine actual cable-target attachment and injury-specific victim frames/aftermath for Jez benchmark; create Benny variants; create remaining8 KO signature attacks and portraits and18 remaining fatality pairs; cause-specific falls; full arena/audio treatment. Then allroster roles/facings/edges/palettes/reduced-motion/goreoff/CPU/rollback/asset-readiness/fullregression review and publish. Public still5.7.15; all cinema work local uncommitted. Keep full goal active.

## Latest continuation: Benny fatality variants

Previous goal turn classified as progress. This continuation adds2 generated and integrated Benny sequences, gameplay-effect corrections and browser/regression evidence. No live processes remain.
- Added assets/cinema/benny-cinema-fatal-{0,1}-v1.webp.16 generated cells each, horizontal variant excludes hand-switch frame3 in playback (15 distinct cells); rising uses16. Source images/prompts in work/cinema580/benny-fatal-{0,1}-source.json, built-in imagegen. Raw sheets inspected; CC/padding pack audit passed. All packed sheets now16/256drawings, not256 newly added this turn. No paid services used.
- bennyFatalityScript in cinematic-scenes.mjs gives separate horizontal/rising clocks and staged blade draw, opening cut, final cut. Labels accurate to actions. Existing painted victim floor path, native stage, static portrait inserts used. Genericloader now admits Benny fatalitybanks; guard-height corrections296/299 and296/276 preserve size relative to his KO bank. projectileFinisherScript refactored to compute directed script once, choosing authored labels when available.
- First rising review showed blade short of target. Moved contact attacker ax-235 (victim+10) and final ax-220 (victim+28), with approach keys adjusted. Torso gap remains>=230 perunit sampling. Last viewed horizontal-1goreoff shows blade reaches target and whole grounded fall; rising+1goreon reviewed before this spacing correction. Latest8 contact sheets regenerated. Need inspect corrected rising and remaining visual cases rather than claiming all8 reviewed.
- New painted prime beat now only prepares the prop and plays object foley: no premature victim flash, blood or impact. This also fixes Jez cable-cast setup. Benny wound targeting now uses upperbody/rising-face target instead of inherited leg profile; post-impact blood anchor follows generic fall approximation. Still needs anatomical anchors and injury detail review, as with Jez.
- work/probe-cinema580-benny-fatal.mjs PASS8 cases (2variants,2facings,goreon/off), all curated frames, camera zoom1, no runtime errors. Captures work/cinema580/benny-fatal-{variant}-{facing}-{gore}.json; contact sheets via work/review-cinema580-benny-fatal.mjs. Earlier console line incorrectly said all16cells for horizontal; changed to all curated cells. Assets32generated,31used.
- Added unit coverage for Benny ordered clocks, distinct arcs/labels, excluded hand-switch frame, spacing and last frame. Scene-catalog test renamed to say beat plans, not falsely imply live completed cinematics for all30 scenes.
- Broadened tests to cinematic-scenes/finisher/bookends/announcer/gore: initially2 stale source-pattern assertions failed (immediate KO sound/collapse now bypassed when koScene stages its own contact). Updated those expected guards/landing branch while keeping decision and fallback checks. Rerun41/41pass; log work/cinema580/targeted-tests.log. No full regression/public release yet.
- Outstanding counts:8 KO signature attackers,8 portraits,16 additional fatality attacker variants; dedicated cause-specific victim reactions/falls across roster; anatomical contact/injury detail, arena/audio treatment, exhaustive visual/CPU/reduced-motion/edges/palettes/readiness/rollback and publication. Four Jez/Benny fatality variants are integrated intermediate scenes, NOT a claim of final realistic injury quality. Full goal remains active; public5.7.15 unchanged.

## Latest continuation: arena landing aftermath

- Added engine/cinematic-aftermath.mjs and registered it in sw.js. Cinematic knockdown impacts now emit water droplets/ripples on Somerset and Cruise, soil on Janney, grit at the Vet, wood on Wildwood and tile chips at the Buffet. Ordinary fight landings retain their existing effects. Stage scar calls now forward the selected material mark.
- Solid particles bounce once and settle at their own floor depth, remaining through the aftermath instead of falling through the floor. Water droplets expire at contact. Reduced motion suppresses flying particles and keeps the wet mark static. Wood chips render as slender fragments.
- Added four behavioral tests covering six arena materials, multiple simulation tick rates, stationary debris, water contact, reduced motion and quality budgets. The focused cinematic/finisher/bookends/announcer run passed 31 tests; syntax checks passed.
- Added readonly QA cinematicAftermath() and work/probe-cinema580-aftermath.mjs. Actual staged KO playback passed on six arenas, with particles emitted at landing, wet-only ripples, water expired and solid debris settled. Evidence work/cinema580/aftermath-results.json and impact/settled JPGs. Visually inspected Somerset impact and Janney settled shots: full bodies visible, no floor penetration. This is not exhaustive cinematic visual approval.
- Previous goal turn (recommendations only) classified as no progress; this turn changed implementation and produced browser evidence. No jobs remain running. Full roster art/choreography/contact/audio and exhaustive verification remain as listed above. Local only, not published; full goal remains active.

## Latest continuation: Alan signature knockout attacker

- Previous turn was progress. Generated a 16-cell Alan body-hook strike sheet with built-in imagegen; provenance/prompt work/cinema580/alan-strike-source.json. Packer passed connected-component and source/cell-edge audit, 17 sheets/272 drawings total. New project asset alan-cinema-strike-v1.webp.
- Visual raw-sheet inspection rejected undersized final-row cells12..15. Playback uses11 unique consistent drawings0..10 on16 time keys, recovering through wind-up frames back to0; cell11 is also unused. Do not claim16 accepted unique frames. Character size registered275/304 against his KO standing art; rear-shoe anchor75.
- Enabled Alan in cinema-strike loader and staged KO scene. Body hook contact has190 center separation and per-scene hitHeight.60/hitOffset0, versus existing Jez/Benny320/.65/55. Initial browser inspection showed fist short and impact too low: corrected spacing/height, inspected contact both facings before spacing correction and right-facing after, then shifted effect from forearm to fist by setting hitOffset0. Bodies remain whole; feet overlap briefly during close contact. Still needs dedicated body-buckle victim reaction and fuller spacing/aftermath visual review; current generic fall is intermediate.
- Browser work/probe-cinema580-alan.mjs passed staged strike and16 victim fallframes in both facings, including final effect-anchor rerun, no runtime errors. Captures alan-pair-{1,-1}.json. work/inspect-alan-cinema.mjs extracts frame snapshots (rerun if using final effect position).11 cinematic/aftermath unit tests passed, including rejected frames, original-guard recovery, contact clock and mirrored spacing. Syntax passes.
- Remaining scope:7 KO signature attacker banks,8 portraits,16 additional fatality attacker variants, cause-specific victim artwork and physically accurate contact/reaction, remaining audio/visual treatment, exhaustive roster scenarios and publication. Alan portrait not yet made. Everything remains local/unpublished; no active process; full goal active.

## Latest continuation: physical audio timing correction

- Previous turn was progress. Found staged KO sound('ko') played fall foley at the fist contact while spawnKnockdownImpact played a punch at the floor. Staged KO now preserves the KO voice with deferFoley:true; dedicated hit-heavy remains at fist contact. Cinematic floor impact passes the existing throw/body-weight foley descriptor, resolving to fall.mp3 and panning from the victim. Ordinary fight landing behavior unchanged.
- Actual warm WebAudio browser probe work/probe-cinema580-audio.mjs passed Jez/Benny/Alan: heavy sample at strike, fall sample at floor, playback count advances. Evidence audio-timing-results.json. Additional work/probe-cinema580-fatal-audio.mjs passed both painted fatality variants for Jez/Benny: fatal contact precedes exactly one body landing sample. Evidence fatal-audio-timing-results.json. These verify scheduling/sample routing, not a listening-based mix review.
- Syntax passed and21 move-foley/bookends/announcer tests passed. No new audio files or purchases. Full audio mix still needs listening and simulation-clock music duck review (current duckMusic uses wall-clock timer). Full roster art/contact/scene scope remains unfinished and unpublished. No running jobs; goal active.

## Latest continuation: scene-clock music envelope

- Previous turn progress. Added cinematicMusicGain(relativeImpact) to cinematic-scenes.mjs: smooth anticipation fade, .08 level through contact and landing, smooth recovery from +1sec to +1.65sec. It is a pure scene-clock sample, so pausing/slow playback cannot expire the cinematic quiet interval.
- effectiveMusicDuck() combines the scene envelope with existing transient/stinger duck (minimum wins). Applies to main bed, danger stem and ambience; active staged KO/painted fatality updates refresh the music mix. Existing non-cinematic timer behavior retained. QA music snapshot includes effectiveDuck.
- Browser work/probe-cinema580-music.mjs holds actual KO at contact for2.2wallseconds: old duck timer expires to1 while effectiveDuck stays.08; remains quiet through landing and restores at victory. Initial test stepped nominal1sec and expected completion too early due hitstop; changed to inspect scene elapsed and step until impact+1.7, passed. Evidence music-clock-results.json. No listening-based mix review or painted fatality clock browser coverage yet.
- Two pure music-envelope tests cover continuity, anticipation/recovery monotonicity, contact/landing/victory values and repeat/seek sampling.11 focused music/scenes/foley tests pass; syntax passes. Local only, full roster scope still unfinished and unpublished. No active jobs. Goal active.

## Latest continuation: Allan portrait insert

- Previous goal turn was progress. Added alan-portrait-v1.webp using built-in imagegen, provenance/prompt work/cinema580/alan-portrait.json; portrait packer now includes alan. Enabled portrait loader for alan. Display name is ALLAN (roster), internal ID alan. Raw and both live facing portraits inspected: full head/closed fist visible, textured painted shading, static framing, readable title.
- work/probe-cinema580-alan-insert.mjs verifies both facings, held scene clock, rollback restoration, insert cleared before contact, complete victim fall before victory. Initial assertion incorrectly expected ALAN WINS; verified roster name ALLAN and corrected expectation; rerun passed. Evidence alan-insert-timing-results.json and alan-portrait-{1,-1}-live.jpg.
- Remaining:7 portrait inserts,7 signature KO attacker banks,16 fatality attacker variants, cause-specific victim reactions/contact refinement, full listening/visual/roster verification and publish. No active jobs. Local only; full goal active.

## Latest continuation: Ali signature knockout

- Previous turn progress. Generated and integrated ali-cinema-strike-v1.webp,16 new painted poses, source/prompt work/cinema580/ali-strike-source.json. Packer passed source-edge, component, padding audit;18 sheets288 drawings total. Raw sheet inspected: complete limbs and consistent recovery scale; all16 accepted. Guard registration293/296, support-foot translation40.
- Added Ali strike clock with contact frame7 and recovery15, center gap220, hitOffset25. Initial right-facing browser shot showed short kick atgap270; corrected and reran, inspected left-facing final contact. Victim still uses generic whole-body KO fall; dedicated kick response remains outstanding. Renderer and preload admit Ali strike. Added per-scene swingCue/impactCue; Ali resolves roundhouse-swing/roundhouse-impact, other staged KOs keep heavy/hit-heavy.
- work/probe-cinema580-ali.mjs passed both facings, all strike transitions and16 victim fallframes, no runtime errors. Evidence ali-pair-{1,-1}.json and extracted work/inspect-ali-cinema.mjs snapshots.12 focused scene/music/foley tests pass; new test validates all16 Ali poses, contact/recovery and kick audio selection. Syntax passes. Audio selection unit-tested but Ali live-audio sample probe not yet extended.
- Remaining6 signature KO attacker banks,7 portrait inserts,16 fatality attacker variants; cause-specific victim art, precise contact/aftermath polish and exhaustive roster verification/publication. No active jobs. Local only, full goal active.

## Latest continuation: Ali G close-up

- Previous turn progress. Added ali-portrait-v1.webp and enabled loader/packer. Built-in generated initial portrait clipped top of beanie; rejected, regenerated corrected wider framing with full hat. Source, rejected path and both prompts preserved work/cinema580/ali-portrait.json. Corrected source and right-facing live shot inspected, complete head/fist visible.
- work/probe-cinema580-ali-insert.mjs passed both facings, pause, rollback restoration, full fall before victory. Initial assertion used ALI WINS; verified roster ALI G and fixed test expectation. Evidence ali-insert-timing-results.json and ali-portrait-{1,-1}-live.jpg. Left-facing image captured but not independently visually inspected this turn.
- Remaining6 portraits,6 KO attacker banks,16 fatality attacker variants plus cause-specific victim/contact/quality work and full verification/publication. Local only, no running jobs; full goal active.

## Latest continuation: cinematic intro readiness

- Previous turn progress. Added cinematicBanks(id) as shared inventory of shipped banks; portrait and atlas loaders use it. Cinema images now participate in trackSheetDecode bookkeeping. fighterArtReadiness includes cinematic banks and portraits alongside unified family, sheetDrawableNow reads corresponding caches. Existing intro hold remains capped1.5sec; this improves preflight but DOES NOT yet prevent midscene asset insertion after capped/failed intro. Further latching or scene-level loading handling still required.
- Eight art-readiness tests pass after normalizing CRLF on game.js text before source assertions (newline-only regex was failing); Ali portrait/rollback/live sequence probe passes unchanged. Syntax passes.
- Browser work/probe-cinema580-readiness.mjs intercepted cinematic downloads and verified named banks pending, then cleared after release/decode. Initial runs did not intercept because service worker/cache served files; enabled Network bypassServiceWorker/cacheDisabled, rerun passed. Evidence readiness-delay-results.json. No outstanding process.
- Full goal still active; remaining art/physical choreography/QA/publication unchanged. Local only, not published.

## Latest continuation: late artwork presentation latch

- Previous turn progress. Added WeakMap cinemaPresentationAvailability keyed by scene/finisher, evaluating attacker+victim bank readiness as one body-art choice and portrait availability once. fighterAnimationPose and portrait rendering consult latched choice; delayed files cannot replace the active scene's chosen artwork. Render-only, no combat clocks/state altered. Next scene gets a fresh readiness choice.
- Browser work/probe-cinema580-late-art.mjs holds all cinema downloads, starts KO with original art, releases assets and confirms active KO still uses original art, then starts fresh KO and confirms cinematic strike/KO banks. Evidence late-art-results.json. Warm Ali portrait/pause/rollback probe also passes. Syntax passes.
- Important outstanding edge: rollback rebuilding a scene object after assets change may reevaluate WeakMap choice; only warm rollback tested. Cold fallback choreography and fatalities need visual review and equivalent delayed-file probes. This change proves no ordinary midscene bank switch, not full loading/rollback robustness. No running jobs; local only, full goal active with previous roster-art/contact/publication scope outstanding.

## Latest continuation: late-download rollback continuity

- Previous turn progress. Added bounded64-entry cinemaPresentationHistory keyed by local match seed, round/score, fighter IDs, winner/type and staging coordinates. Rebuilt scene objects recover the same renderer-only art choice through this map. No availability data added to combat snapshots/checksums. WeakMap remains fast path.
- work/probe-cinema580-late-art-rollback.mjs passed: hold cinema downloads, start KO on old art, release files, structured-clone rollback restore, still old art, then fresh KO uses new banks. work/probe-cinema580-late-fatal-art.mjs passes equivalent Jez variant0 with Ali victim, including clone restore and next fatality using new banks. Evidence late-art-rollback-results.json and late-fatal-art-rollback-results.json. These are behavior/pose checks, not visual approval of cold fallback choreography. Other fatality variants/match types still require breadth coverage.
- No active jobs; full roster art/choreography/quality/publication still pending. Goal active, local only.

## Latest continuation: Commissioner cane knockout

- Previous turn progress. Generated commissioner-cinema-strike-v1.webp16cells, source/prompt work/cinema580/commissioner-strike-source.json. Raw review rejected frame7 incomplete cane tip. Curated16-time-key playback uses14 unique drawings (also omits13, reuses6/5 during recovery). Packer component/source-edge/padding audit passed,19sheets304drawings total. Guard registration294/266.
- cinematicBanks now separates strike and portrait availability; Commissioner strike enabled without nonexistent portrait. Added cane clock/contact8/recovery15, optional objectCue atimpact, upper-guard hitHeight.75/offset25 after right-facing contact review showed oldeffect too low. Actual cane reaches guard. Generic victim fall remains; dedicated cane reaction and physical recovery need broader review.
- work/probe-cinema580-commissioner.mjs passes both facings and complete victim fall. Initial probe failed because Commissioner is unlockable; invoked existing local QA commissioner(true), then passed. Did not change published unlock state. Extractor work/inspect-commissioner-cinema.mjs; viewed right-facing before last effect correction; JSON captures rerun after correction.9 scene tests pass including rejection/contact/end and object audio metadata. No jobs running.
- Remaining5 signature KO attacker banks,6 portraits,16 fatality attacker variants, cause-specific victim reactions, detailedcontact/visual/audio/fullroster checks and publication. Goal active, everything local/unpublished.

## Latest continuation: Commissioner portrait

- Previous turn progress. Added commissioner-portrait-v1.webp; source/prompt work/cinema580/commissioner-portrait.json, built-in imagegen. Portrait packer and cinematicBanks inventory updated. Full hair/head and closed fist intact in source and inspected left-facing live shot, title fits despite long name.
- work/probe-cinema580-commissioner-insert.mjs passed both facings, pause, rollback restoration and full fall before victory; used local QA unlock and verified roster name THE COMMISSIONER. Evidence commissioner-insert-timing-results.json and commissioner-portrait-{1,-1}-live.jpg. Right-facing captured but not separately inspected this turn.
- Remaining5 portrait inserts and5 KO signature attacker banks,16 fatality attacker variants plus cause-specific victim/contact/visual/audio work and exhaustive verification/publication. Everything local/unpublished, no active jobs; full goal active.

## Latest continuation: Cyraxx strike

- Previous turn progress. Added cyraxx-cinema-strike-v1.webp from built-in generation plus correction. First raw sheet clipped bottom shoes; rejected and regenerated with padding, corrected raw inspected and pack audit passed. Source/correction/rejected path in work/cinema580/cyraxx-strike-source.json.20sheets320drawings total. Final sequence12unique drawings on13keys: skips frame4 prematureguard, frames10/12/13 unnecessary resets, holds frame7 acrosscontact. Guard registration301/304, spacing230.
- Enabled cinematicBanks strike for Cyraxx, no portrait yet. work/probe-cinema580-cyraxx.mjs passed both facings and16 victim fallframes. Inspected right-facing extension: complete bodies and fist reaches raised forearm; final jaw/backfist precision still needs further art/contact review, not final realistic choreography. Current generic victim fall remains.
- Ten scene tests pass including rejection/contact/recovery checks. Raw clipped first sheet is not used. No active jobs; remaining4 KO attacker banks,5portraits,16fatality attacker variants plus cause-specific victim/contact/audio/visual/exhaustive checks and publication. Full goal active, local only.

## Latest continuation: Cyraxx portrait

- Previous turn progress. Added cyraxx-portrait-v1.webp via built-in imagegen; provenance work/cinema580/cyraxx-portrait.json. Updated portrait packer and cinematicBanks inventory. Raw and right-facing live shot inspected: full head/hair/fist, thin build, textured painted face and shirt, static composition.
- work/probe-cinema580-cyraxx-insert.mjs passed both facings, pause, rollback restoration and full fall before victory. Evidence cyraxx-insert-timing-results.json and cyraxx-portrait-{1,-1}-live.jpg. Left-facing captured, not separately inspected this turn.
- Remaining4 KO attacker banks and4 portraits (deathblow/devil/donald/post),16 fatality attacker variants, cause-specific victim art/contact/quality work and full verification/publication. Goal active, no running jobs, local only.

## Latest continuation: Deathblow uppercut

- Previous turn progress. Added deathblow-cinema-strike-v1.webp,16 corrected drawings. First generated sheet baked checkerboard into background, pack rejected; built-in edit replaced with magenta. First live strike then exposed vertical fist missing opponent; second built-in edit authored forward/rising arc and restored missing guard arm. Final source/prompt/rejected paths/corrections work/cinema580/deathblow-strike-source.json. Packer21sheets336drawings passes. Latest16 all accepted (initial frame10 rejection superseded by corrected art).
- New Deathblow timing uses16 ali-style keys contact7 recovery15, high effect.85, offset0. Guard registration286/289. First spacing190 on original art insufficient for vertical strike; revised forward art tested260, then reduced to210 based on visible gap. Right-facing revised drawing inspected at260; final210 rerun captured but not yet visually inspected. Full jaw-contact/uppercut-specific victim response still needs review; generic fall currently used.
- work/probe-cinema580-deathblow.mjs passes both facings and16 victim fallframes; latest JSONs at210.11 scene tests pass, including16frame progression/contact/high effect. No jobs running. Remaining3KO attackers(devil/donald/post),4portraits(includingdeathblow),16fatality attacker variants, cause-specific victim/art/contact/audio/visual/fullchecks/publication. Everything local/unpublished, goal active.

## Latest continuation: Deathblow close-up

- Previous turn progress. Added deathblow-portrait-v1.webp via built-in imagegen, source/prompt work/cinema580/deathblow-portrait.json. Packer/inventory updated. Raw and left-facing live portrait inspected: wholecap/fist, detailed wornarmor/leather/cotton and correct shark shirt, title readable. Both facing playback checks pass including pause, rollback restoration, full fall before victory: work/probe-cinema580-deathblow-insert.mjs; evidence deathblow-insert-timing-results.json and live JPGs.
- Also inspected latest210-gap uppercut frame6 right-facing. Fist now reaches opponent head area, forearms contact guard; needs precise victim chin recoil and avoiding anticipation/contact overlap as part of final choreography review. Generic victim fall not yet cause-specific.
- Remaining3KO attacker banks and3portraits(devil/donald/post),16fatality attacker variants and full victim/contact/quality/verification/publication scope. No active jobs, local/unpublished, goal active.

## Latest continuation: Devil wing sweep

- Previous turn progress. Added devil-cinema-strike-v1.webp16poses, built-in imagegen source/prompt work/cinema580/devil-strike-source.json. Although prompted magenta, output alpha was clean; pack component/edge/padding audit passed.22sheets352drawings total. Full16 chronology uses alan16keyclock, contact8/recovery15; scale246/200 to KO standingart.
- Work/probe-cinema580-devil.mjs passes both facings and16 victim fallframes, no runtime errors. Right-facing contact inspected: wing reaches opponent forearm/upperbody, main bodies separated, fullhorns/tail/feet intact. Wing obscures some Devil torso as expected but does not cover opponent body. Dedicated wing-driven victim reaction and fullart-anatomy/contact review still needed.
- Twelve scene tests pass including16poses/open/contact/fold timing. No jobs active. Remaining2KO attackers(donald/post),3portraits(devil/donald/post),16fatality attacker variants and full victim/contact/audio/visual/verification/publication scope. Local only; goal active.

## Latest continuation: Devil cinematic close-up

- Previous response was recommendations only (no progress); revalidated actual worktree and resumed missing roster art. Added devil-portrait-v1.webp via built-in imagegen, source/prompt work/cinema580/devil-portrait.json. Portrait packer and cinematicBanks inventory now enable eight portraits.
- Inspected generated source and BOTH live facing images: horns, snout and raised claw intact, title clear. Chest-up wing/torso edge crop is deliberate portrait framing. Browser work/probe-cinema580-devil-insert.mjs passed both facings, pause, rollback restoration and full fall before victory. Evidence devil-insert-timing-results.json, devil-portrait-{1,-1}-live.jpg. Twelve cinematic scene tests passed.
- Remaining two KO attacker banks and two portraits (Donald/Post), sixteen fatality attacker variants, dedicated cause-specific victim/contact work, full visual/audio/roster verification and publication. This portrait check does not validate all choreography. Local/unpublished; no jobs active; full goal remains active.

## Latest continuation: Donald club knockout

- Previous turn progress. Added donald-cinema-strike-v1.webp from built-in imagegen; provenance work/cinema580/donald-strike-source.json. Packing passed23sheets368drawings. Raw and packed sheets inspected. Curated playback skips frame2 premature low dip and orders recovery10before9 to avoid extending again;15unique drawings on16keys. Club reads as a forward club drive, not a broad horizontal golf swing. Guard registration282/247, default320gap.
- Enabled Donald strike inventory and ali16-key clock contact7/recovery15. Browser work/probe-cinema580-donald.mjs passes both facings and full16frame victim fall. Both contact-facing captures visually inspected: bodies separate, complete heads/feet/club, club head reaches raised elbow/guard. Does not yet prove anatomically precise body contact or force-specific recoil; generic victim fall remains. Inspect helper work/inspect-donald-cinema.mjs.
- Thirteen cinematic scene tests pass including curated chronology. Remaining one KO attacker bank(Post), two portraits(Donald/Post), sixteen fatality attacker variants, dedicated victim/contact refinement and exhaustive visual/audio/roster checks/publication. All local/unpublished. No running jobs; full goal active.

## Latest continuation: Donald close-up

- Previous turn progress. Added donald-portrait-v1.webp using built-in imagegen; source/prompt work/cinema580/donald-portrait.json. Packer and cinematicBanks updated for nine portraits. Inspected source and both live facing captures: full hair/head and fist intact, title readable, detailed painted cloth/metal/leather.
- Browser work/probe-cinema580-donald-insert.mjs passed both facings, pause, rollback restoration and full fall before victory. Evidence donald-insert-timing-results.json and donald-portrait-{1,-1}-live.jpg. Verified roster display DONALD TRUMP in assertion.
- Remaining Post KO attacker bank and portrait, sixteen fatality attacker variants, dedicated victim reactions/contact refinements, comprehensive visual/audio/roster testing and publication. Local only/unpublished; no active jobs; full goal active.

## Latest continuation: Post shoulder prototype, NOT activated

- Previous turn progress. Generated initial16pose Post shoulder sheet; rejected head-leading lean. Edit then produced17figures and clipped shoes; rejected, provenance post-strike-rejected-edit.json. Rebuilt16figure sheet and packed (24sheets384drawings), saved post-strike-source.json, copied draft post-cinema-strike-v1.webp. Omit can-bearing0/1 using guards12/13 instead. Draft16keys14unique, contact7, registration292/301, trialspacing170.
- TEMPORARILY enabled and ran probe-cinema580-post.mjs (pose progression/full16victimfall/bothfacings PASS). Visual right-facing contact FAILED quality: front feet overlap, shoulder does not cleanly contact torso, impact effect floats. Screenshot post-1-7.jpg. These passing pose checks are NOT approval. Disabled Post cinematic-strike in inventory again; createKnockoutScene now requires inventory-approved bank as well as timeline so it cannot stage unapproved drawings with fallback art. Draft timeline/scale/art retained for corrections. Probe Post now expected to fail strike assertion until explicitly enabled after correction.
- Fourteen scene tests passed, including unapproved Post cannot start stagedKO. Remaining Post attacker CONTACT/STAGING correction and portrait,16fatality attacker variants, dedicated victim/contact/visual/audio/fullroster checks and publication. Need narrower planted stance or authored paired recoil to avoid foot overlap while giving real shoulder contact; do not merely enable this draft. Local/unpublished, no jobs active, full goal active.

## Latest continuation: Post portrait, shoulder still disabled

- Previous turn progress. Added post-portrait-v1.webp via built-in imagegen, provenance work/cinema580/post-portrait.json. Packer/inventory now cover all10 portraits. Source and BOTH live facing pictures inspected: head/hair/fist intact, title readable, detailed cloth/hair/paint. This does not activate Post draft shoulder strike.
- Browser work/probe-cinema580-post-insert.mjs uses EXISTING Post fatality0 goreoff (not stagedKO), tests before-impact portrait interval, both facings, manual pause, rollback and clock advance; PASS. Evidence post-insert-timing-results.json and post-portrait-{1,-1}-live.jpg. Does not claim fullfall-beforevictory for this legacy finisher or new fatality choreography.
- Remaining Post shoulder contact/staging correction,16fatality attacker variants, dedicated victim reactions/contact refinements, complete visual/audio/roster verification and publication. All10portraits created is only one deliverable. Everything local/unpublished, no running jobs, full goal active.

## Latest continuation: Post narrower stance, paired reaction needed

- Previous turn progress. Rebuilt Post16pose shoulder atlas with narrow stance, provenance post-strike-narrow.json; post-strike-source.json points to new image and retains priorWideStance. Packer24sheets384drawings passes; guard width126/height304 vs prior194/301, scale292/304. No can, all16drawings usable in draft order0,1,2,4,5,3,6,7,8,9,10,11,12,13,14,15 to avoid a premature turn/unturn.
- TEMP enabled for probe-cinema580-post.mjs, both directions pose/fall pass, inspected right contact. Narrow stance removed interleaved feet, but shoulder still short of opponent torso and effect floats. Post inventory disabled AGAIN after inspection; no unapproved scene starts in normal playback. Same old pose-only probe cannot approve contact.
- Next substantive correction should author a paired body-impact victim brace/recoil with feet under hips (Benny first); his current wide guard places foot far forward of torso, incompatible with close shoulder contact. Merely moving fighters closer brings back foot overlap. Need dedicated narrow brace and coordinated body recoil, then fall; also correct effect to actual contact. Keep Post disabled until that succeeds. Full16remainingfatality attacker variants/other victimart/allverification/publication remain. Local only, no jobs active, full goal active.

## Latest continuation: paired Benny body reaction

- Previous turn progress. Added benny-cinema-body-ko-v1.webp16drawings, source/prompt benny-body-ko-source.json, pack25sheets400drawings. Packer now treats banks ending-ko as falls (uniform silhouette centering, not rear-foot anchoring). New narrow guard, torso recoil, buckle, hip landing and horizontal rest; source inspected. Registration296/304.
- Scene carries victimBank; readiness latches both selected banks, preload includes body-ko, victim pose uses selected bank including braceframe0 beforecontact. createKnockoutScene now accepts victimId as sixth arg, game passes loser.def.id. Post enabled ONLY against Benny pending other paired reactions, remaining opponents retain fallbackKO. This restriction is intermediate, not completion of Post roster scope.
- Post/Benny spacing120, shoulder/guard impactoffset50. New pose removes interleaved feet, inspected rightcontact and earlier110gap bothfacings, corrected final120 rightcontact and finalrest screenshot. Body interaction now reaches guard; further precision/weight transfer review still warranted. Entire16fall advances bothfacings in probe-cinema580-post-body.mjs; old post probe expects cinema-ko and is stale. Latest post-pair-{1,-1}.json use newbank. 22 scene/readiness tests pass including unsupported Post victims fallback and paired brace/contact/rest selection.
- Remaining other9bodyreaction banks for Post,16fatality attacker variants, other cause-specific victim/contact refinements, complete visual/audio/rollback/loading/roster QA and publication. Newbank paths need delayed-load/rollback coverage beyond current warm pose tests. Alllocal/unpublished, no activejobs, fullgoal active.

## Latest continuation: Jez paired body reaction

- Previous turn progress. Added jez-cinema-body-ko-v1.webp16drawings via built-in imagegen, source/prompt jez-body-ko-source.json. Pack26sheets416drawings passes. Narrow brace, rearward recoil, buckle, hip landing and rest; source and both live contacts plus right-facing finalrest inspected. Full heads/limbs visible, feet separate at shoulder/guard contact. Registration272/304 matches existingKO scale; no claim all recoil poses are final quality.
- Inventory includes Jez bodybank. Post scene selection now gates on bodybank availability instead of hardcoded Benny; currently Jez/Benny only, other8 still fallback. Probe-cinema580-post-jez-body.mjs passes bothfacings and all16victimframes; separate post-jez-pair-{1,-1}.json and inspect-post-jez-cinema.mjs, post-jez-rest.jpg. Fourteen scene tests pass with both supported victims and unsupportedAlan fallback.
- Remaining8bodyreactionbanks forPost,16fatality attacker variants, othercause-specific victim/contact refinements, fullvisual/audio/rollback/loading/rosterchecks and publication. Nothing published; no active jobs; full goal active.

## Latest continuation: Allan paired body reaction

- Previous turn progress. Added alan-cinema-body-ko-v1.webp16drawings via built-in imagegen; source/prompt alan-body-ko-source.json. Pack27sheets432drawings passes. Alpha source clean after packing. Preserves heavy build, chest recoil, knee buckle, hip landing and horizontal rest. Registration275/256.
- Inventory enables Allan bodybank; Post gap150/impactoffset70 for wider build (Jez/Benny remain120/50). Both live contact facings inspected: shoulder meets guard, bodies separate, toes touch without interleaved feet, full heads/limbs. Otherfallframes captured but not individually visually approved this turn. probe-cinema580-post-alan-body.mjs passes bothfacings and all16victimframes; evidence post-alan-pair-{1,-1}.json and inspect-post-alan-cinema.mjs. Fourteen scene tests pass including3supportedvictims and unsupportedAli fallback.
- Remaining7bodyreactionbanks forPost,16fatality attacker variants, othercause-specific victim/contact refinements, fullvisual/audio/rollback/loading/rosterchecks and publication. Everything local/unpublished, no activejobs, fullgoal active.

## Latest continuation: Ali G body reaction

- Previous turn progress. Added ali-cinema-body-ko-v1.webp16drawings. Initial bottomrow lounged with head propped on hand; rejected that pose and built-in edit lowered head onto extended relaxed arm. Source/prompt/correction/rejected path ali-body-ko-source.json. Pack28sheets448drawings passed. Hat/glasses/backpack remain attached. Registration293/282.
- Enabled bodybank; first live contact120gap had shoe overlap, increased Ali to150gap/70impactoffset likeAllan. Rerun probe-cinema580-post-ali-body.mjs bothfacings/full16fall PASS. Final rightcontact and side-rest inspected: feet separate at contact, fullhead/hat/arm/boots intact, backpack retained. Correctedleft captured but not separately inspected thisturn. Evidence post-ali-pair-{1,-1}.json, inspect-post-ali-cinema.mjs, post-ali-rest.jpg. Fourteen scene tests pass with4supportedvictims and Cyraxx fallback.
- Remaining6bodyreactionbanks forPost,16fatality attacker variants, othercause-specific victim/contact refinement, fullvisual/audio/rollback/loading/rosterchecks and publication. Local only/unpublished, no activejobs, fullgoal active.

## Latest continuation: Cyraxx paired body reaction

- Previous turn progress. Added cyraxx-cinema-body-ko-v1.webp16drawings via built-in imagegen; source/prompt cyraxx-body-ko-source.json. Pack29sheets464drawings passes. Preserves thin build, compact brace, recoil/buckle/hipland/rest, full scalp/hair/limbs. Registration301/288.
- Enabled bodybank, Post default120gap/50offset. Both contact facings and right-facing rest inspected: feet separate at contact, full head and limbs, shoulder against raised guard. Detailed weight transfer through every frame still part of final motion review. Probe-cinema580-post-cyraxx-body.mjs passes bothfacings/full16fall, evidence post-cyraxx-pair-{1,-1}.json, inspect-post-cyraxx-cinema.mjs and post-cyraxx-rest.jpg. Fourteen scene tests pass with5supportedvictims and Devil fallback.
- Remaining5bodyreactionbanks forPost (commissioner/deathblow/devil/donald/post),16fatality attacker variants, othercause-specific victim/contact refinement, fullvisual/audio/rollback/loading/rosterchecks and publication. Alllocal/unpublished, no activejobs, fullgoal active.

## Latest continuation: Commissioner paired body reaction

- Previous turn progress. Added commissioner-cinema-body-ko-v1.webp16drawings via built-in imagegen; source/prompt commissioner-body-ko-source.json. Pack30sheets480drawings passes. Coat settles behind body, full head/hands/shoes, barehanded defense. Registration294/285.
- Enabled bodybank; Post gap150/impactoffset70 for wider stance. Both live contact facings inspected: separate bodies, shoulder reaches guard, full head/coat/shoes. Toes touch but do not interleave. Fallframe progression passes but individual in-game fallframes still need finalvisualreview. Probe-cinema580-post-commissioner-body.mjs passes bothfacings/full16fall using localQA commissioner unlock only. Evidence post-commissioner-pair-{1,-1}.json and inspect-post-commissioner-cinema.mjs. Fourteen scene tests pass with6supportedvictims.
- Remaining4bodyreactionbanks forPost (deathblow/devil/donald/post),16fatality attacker variants, othercause-specific victim/contact refinement, fullvisual/audio/rollback/loading/rosterchecks and publication. Alllocal/unpublished, no activejobs, fullgoal active.

## Latest continuation: Deathblow paired body reaction

- Previous turn progress. Added deathblow-cinema-body-ko-v1.webp16drawings via built-in imagegen; source/prompt deathblow-body-ko-source.json. Pack31sheets496drawings passes. Full cap,armor,hands,legs/shoes, stocky build and horizontal rest. Registration286/260.
- Enabled bodybank, Post150gap/70offset. Both contact facings inspected: shoulder at armored guard, separate bodies, toes touching rather than interleaved feet, complete head/limbs. Fall images captured but not individually visually approved thisturn. Probe-cinema580-post-deathblow-body.mjs passes bothfacings/full16fall, evidence post-deathblow-pair-{1,-1}.json and inspect-post-deathblow-cinema.mjs. Fourteen scene tests pass with7supportedvictims.
- Remaining3bodyreactionbanks forPost (devil/donald/post),16fatality attacker variants, othercause-specific victim/contact refinement, fullvisual/audio/rollback/loading/rosterchecks and publication. Alllocal/unpublished, no activejobs, fullgoal active.

## Latest continuation: Donald paired body reaction

- Previous turn progress. Added donald-cinema-body-ko-v1.webp16drawings via built-in imagegen; source/prompt donald-body-ko-source.json. Pack32sheets512drawings passes. Complete hair/armor/hands/legs/shoes, suit/tie follows body recoil, horizontal rest. Registration282/252.
- Enabled bodybank, Post150gap/70offset. Both live contacts inspected: shoulder reaches guard, bodies separate, toes touch without interleaving, full head/limbs. Fall images captured but not individually visually approved thisturn. Probe-cinema580-post-donald-body.mjs passes bothfacings/full16fall, evidence post-donald-pair-{1,-1}.json and inspect-post-donald-cinema.mjs. Fourteen scene tests pass with8supportedvictims.
- Remaining2bodyreactionbanks forPost (devil/post),16fatality attacker variants, othercause-specific victim/contact refinement, fullvisual/audio/rollback/loading/rosterchecks and publication. Alllocal/unpublished, no activejobs, fullgoal active.

## Latest continuation: Post mirror body reaction

- Previous turn progress. Added post-cinema-body-ko-v1.webp16drawings via built-in imagegen; source/prompt post-body-ko-source.json. Pack33sheets528drawings passes. Full hair,gloves,connectedlimbs and horizontal rest. Registration292/260.
- Enabled bodybank. First mirror contact120gap overlapped boots; widened Post victim to150gap/70offset and reran. Both corrected contact facings inspected: feet separate, complete heads/limbs, shoulder reaches guard. Fall images captured but not individually visually approved thisturn. Probe-cinema580-post-mirror-body.mjs passes bothfacings/full16fall, evidence post-mirror-pair-{1,-1}.json and inspect-post-mirror-cinema.mjs. Fourteen scene tests pass with9supportedvictims.
- Remaining Devil bodyreaction forPost,16fatality attacker variants, othercause-specific victim/contact refinement, fullvisual/audio/rollback/loading/rosterchecks and publication. Alllocal/unpublished, no activejobs, fullgoal active.

## Latest continuation: Devil body reaction and failed contact review

- Prior recommendation-only turn was no progress; resumed from authoritative worktree. Generated devil-cinema-body-ko-v1.webp with 16 drawings via built-in imagegen; source/prompt work/cinema580/devil-body-ko-source.json. Pack34 sheets544 drawings passes connected-component and source/atlas-edge checks. Packed sheet visually inspected: horns, wings, tail and limbs contained. Registration246/245 matches original guard height. All ten fighters now have body-reaction source assets, not all pairings approved.
- Temporarily enabled Post/Devil at150gap/70offset and ran probe-cinema580-post-devil-body.mjs: full16 fall poses and both facings passed structural checks. Live contact screenshots post-devil-{1,-1}-7.jpg reveal Post shoulder hits Devil head instead of torso; feet also touch. This is NOT a visual pass. Kept Devil body asset/inventory but disabled this Post pairing in createKnockoutScene until a lower dedicated attacker pose can make shoulder/torso contact at proper height. Final14 scene tests pass and assert this temporary gate. Probe now intentionally cannot pass until that pose/gate changes; existing screenshots document rejected staging.
- Next: create lower Post shoulder sequence for shorter Devil with consistent identity and planted feet, wire per-pair attacker bank through loading/readiness/pose/registration and inspect both contact facings. Review Devil seated-to-side fall transition (9->10) for abruptness. Remaining16 fatality attacker variants, cause-specific victim/contact work, complete visual/audio/rollback/loading/roster QA and publication remain. All work local/unpublished; no live jobs; full goal active.

## Latest continuation: lower Post attack for Devil

- Previous turn progress. Generated16 new lower Post knee-bent strike drawings. First output had baked checkerboard rejected by packer; built-in image edit replaced background magenta preserving poses. Provenance post-low-strike-source.json includes rejected source. Packed35 sequences560drawings; copied post-cinema-strike-low-v1.webp into game.
- Added scene.attackerBank through cinematicBanks, preload, presentation readiness latch, animation pose, strike frame sampling and render registration/anchor. Post/Devil now selects lower bank and all16 sequential frames, other Post opponents retain curated old sequence. Corrected previous Devil registration edit which inspection showed had never matched actual source: now246/245 body-bank registration applied.
- Live probe initially caught stray id expression from broad text replacement in portrait beat code; fixed both instances, rerun passes no runtime exceptions and full16 fall frames both facings. Initial150gap crossed feet; widened200 and lowered impact flash from.65 to.45height. Both corrected contact screenshots inspected. Post now contacts around raised torso guard, full figures visible, toes still touch; shoulder silhouette partly behind tucked forearms so exact shoulder contact needs final choreography review. Do not treat this as final visual approval. Evidence post-devil-pair-{1,-1}.json and post-devil-{1,-1}-7.jpg updated; probe/inspector now expect cinema-strike-low.
- Remaining: Devil9->10 fall transition review; final contact/footwork refinement,16 fatality attacker variants, cause-specific victim art, all roster/edge/loading/rollback/reduced-motion/audio QA and publication. Local only, no live jobs, full goal active.

## Latest continuation: Allan first fatality draft

- Previous turn progress. Generated alan-cinema-fatal-0-v1.webp16drawings, source alan-fatal-0-source.json. Pack36sheets576drawings passes clipping/component checks. Packed sheet visually inspected, complete heads/fists/boots. Copied to game, inventory enabled variant0 only; registration275/282.
- Added alanPressureScript for variant0: two actual impacts at1.05/2.8 matched extended fists5/10, deliberate reload, floor-based staging, fixed zoom1,4.65duration. Variant1 remains original pending dedicated overhead artwork. Added meaningful timing test;15 scene tests pass.
- Probe-cinema580-alan-fatal.mjs passes16attackerframes bothfacings goreon/off fixedzoom no runtime exceptions. Contact screenshots alan-fatal-contact-{1,-1}-10.jpg show punches too high for BODY PRESSURE label and interleaved front boots. This is a draft NOT visual approval. Exact final torso contact needs corrected lower punch drawings and narrower attacker/victim stance or paired body-bank defense; broad gap increase alone would miss. Existing generic victim art remains. Evidence alan-fatal-0-{1,-1}-{true,false}.json.
- Remaining15 fatality attacker variants plus this draft's contact corrections, paired cause-specific victim art, prior Post/Devil contact/transition review, full visual/audio/loading/rollback/roster checks and publication. All local/unpublished; no live jobs; full goal active.

## Latest continuation: Allan lower punches and paired brace

- Previous turn progress. Built-in edit corrected Allan fatal0 all16 poses to narrow stance and belt-height fists; provenance updated source plus alan-fatal-0-correction.json; rejected original retained. Pack36/576 passes; registration275/302. Both live final contact facings inspected: abdomen contact, feet separate with toes touching rather than interleaved. All16 attacker frames both facings/gore states run.
- Added script.victimBank and victimBraceFrames support through readiness and pose selection. Allan uses cinema-body-ko victims; first-hit1/2/3 recoil returns through2/1/0 then final timed collapse. Existing victim bodybanks now used for actual body punch cause. Full-roster visual pairing still pending.
- Found inherited projectilePhase prime/kill wrongly showing a sandwich and skipping first physical impact. Allan explicitly nulls both projectile phases and supplies hit-heavy foley and.44height body effect location. Game supports explicit impact height/foley. Rerun browser probe and15 scene tests pass. Final no-projectile visual screenshot still needs inspection; earlier contact screenshots include rejected sandwich effect. Alllocal/unpublished.
- Remaining15 fatality attacker variants, final contact/aftermath/audio review incl this corrected scene, prior Post/Devil review, comprehensive roster/loading/rollback/reducedmotion QA/publication. No live jobs, full goal active.

## Latest continuation: Allan overhead variant

- Previous turn progress. Inspected corrected pressure contact/held aftermath: full bodies, separated prone body. Effect .44 logical-height position was below fist; raised .8 for pressure to compensate logical vs painted height; final updated position not visually reviewed again.
- Added alan-cinema-fatal-1-v1.webp16drawings via built-in imagegen; source alan-fatal-1-source.json. Pack37sheets592drawings passes; packed review inspected no clipped overhead hands. Registration275/258. Curated order0,2,1,3,4,5,7,6,10,9,8,11,12,13,14,15 fixes descending row reversal; missing finer transition from overhead to extended hands remains a motion-review concern.
- Added distinct alanOverheadScript variant1: overhead anticipation, single final contact2.1,4.05duration, bodybankvictimbrace, no projectile, heavyfoley, fixedzoom. Probe now checks both Allan variants each facing/gore setting, all16curatedframes fixedzoom no runtime errors PASS. Both finalcontact facings inspected: joined hands against upper torso/guard and separate boots with toes touching. Not final full motion/roster visual approval; generic bodyfall still needs overhead-specific downward buckle. Updated15scene tests pass distinct trajectories/cells/no projectile.
- Remaining14fatality attacker variants, cause-specific reactions/impact effects and full visual/audio/loading/rollback/roster/reducedmotion/publication QA. Local only/unpublished; no livejobs; full goal active.

## Latest continuation: Jez downward overhead reaction

- Previous turn progress. Generated jez-cinema-overhead-ko-v1.webp16drawings: highguard/downward compression/kneel/palmscatch/side rest. Source jez-overhead-ko-source.json. Pack38/608 passes. Registration272/283; full heads/hands/feet in inspected source and live contact/rest.
- Added per-victim script.victimBanks map resolving in loading readiness and pose, plus Jez overhead preload/inventory. Allan variant1 uses Jez overhead bank, others still bodybank until their overhead art exists. Contact widened205->225 to remove observed boot overlap; corrected right-facing contact and right rest visually inspected. Left corrected capture exists, not separately reviewed after widening.
- Dedicated probe-cinema580-jez-overhead-reaction.mjs asserts all16 victim frames in order bothfacings/gore on/off, fixed zoom/runtime exceptions PASS. Output label inherited generic Allan text but checks victim pose[1] cinema-overhead-ko. Evidence jez-overhead-reaction-1-{1,-1}-{true,false}.json. Allan attacker variant probe also passes;23scene/readiness tests pass.
- Remaining9overheadvictim banks,14fatality attacker variants, othercause-specific contact/art/effects, fullvisual/audio/loading/rollback/roster/reducedmotion/publication QA. No livejobs, local/unpublished, fullgoal active.

## Latest continuation: Benny downward overhead reaction

- Previous turn progress. Generated benny-cinema-overhead-ko-v1.webp16poses via built-in imagegen. Source benny-overhead-ko-source.json; pack39sheets624drawings passes. Registration296/297. Enabled Benny overhead bank in inventory/preload/Allan variant1 per-victim map.
- Both live contact facings and right-facing rest visually inspected: cap, arms, connected legs and boots intact; feet separated; highguard receives joined hands. Rest horizontal head on relaxed forearm, separated from standing attacker. Full intermediate pose anatomical continuity remains part of finalmotionreview.
- Probe-cinema580-benny-overhead-reaction.mjs checks victim pose[1] all16 overhead frames in order both facings/gore settings, fixed zoom and runtime errors PASS. Evidence benny-overhead-reaction-1-{1,-1}-{true,false}.json plus benny-overhead-{1,-1}-{1,15}.jpg.23scene/readiness tests pass.
- Remaining8overheadvictim banks,14fatality attacker variants, othercause-specific art/contact/effect refinement, fullvisual/audio/loading/rollback/roster/reducedmotion QA/publication. All local/unpublished; no livejobs; fullgoal active.

## Latest continuation: broad regression audit

- Previous turn progress. Ran all tests/*.test.mjs explicitly (node --test tests alone does not discover directory here).757tests719pass38fail. Full log work/cinema580/full-tests-before-normalization.log. No claim all regressions new: many source-regex tests fail on CRLF, several cover removed3D/olderinput behavior; motion semantic failures also need investigation.
- Fixed audio-manifest.test.mjs source read to normalizeCRLF before existing caption regex. All7 audio manifest tests nowPASS unchanged assertions: exact announcer counts and recorded takes agree. This fixes a false failure, not product behavior.
- Confirmed actual service-worker guard fails SHELL62entries >60 limit after two cinematic modules were added. Do NOT loosen test to hide growth. Need consolidate startup modules/bundle or explicitly lazy-load optional feature with offline behavior preserved. File-count and bytes requirements both need passing. Other37 original failures remain untriaged/unfixed; broad suite not rerun after single normalization.
- Next can address offline shell module architecture and remaining source-test normalization, distinguish baseline/stale failures from regressions with evidence. Remaining8overheadvictim banks14fatality attacker variants and all previously documented choreography/effects/fullQA/publication requirements intact. All local/unpublished, no livejobs, fullgoal active.

## Latest continuation: startup cache consolidation

- Previous turn progress. Consolidated cinematic-aftermath and render-motion implementations into cinematic-scenes.mjs. Original module paths remain thin reexports for callers/tests; game imports shared module directly, avoiding both extra requests. Removed only those2former startup entries. No behavior or test-budget changes.
- Serviceworker guard nowPASS:60startuprequests,2,993,119bytes below3MiB.25scene/motion/landing/cache tests pass. Browser Allan both fatalities and Benny full16overheadreaction bothfacings/goreonoff probes pass after change.
- Reran fullsuite dot output saved work/cinema580/full-tests-after-cache-fix.log. Other source-format/legacy/semantic failures remain; not a fullgreen suite. No offline browser reload claim: existing offline guard passed, actual offline end-to-end still needs review. No new art this turn.
- Remaining8overheadvictim banks14fatalityattacker variants and allprevious choreography/effects/comprehensiveQA/publication scope intact. All local/unpublished; no livejobs; fullgoal active.

## Latest continuation: reliable regression baseline

- Previous turn progress. core.autocrlf=true caused source-regex tests to fail. Added game-scoped.gitattributes *.js/*.mjs text eol=lf; normalized game.js and engine/*.mjs LF without semantic changes (unchanged files show no Git content diff). Fullsuite rerun log work/cinema580/full-tests-lf.log:22failures vs36 before;14false failures removed.
- BK-C was stale: expected a one-line routing wrapper before clipped/repaired filtering existed. Replaced exact implementation regex with execution of isolated live motionBankCellDrawable and six behavioral cases: normal/denied, clipped original, unloaded repair, loaded repair supersedes rejection, remapped clipped cell. All8 banks tests nowPASS. No product acceptance rule weakened.
-21other failures remain after this focused fix (fullsuite not rerun afterward), including removed3D expectations, olderdemo input expectations, and motion/swing assertions requiring triage. Art/cinematic scope remains8overheadvictim banks14fatalityattacker variants plus contact/effect refinements/fullvisual/audio/loading/rollback/roster/reducedmotion/publication QA. No livejobs; all local/unpublished; fullgoal active.

## Latest continuation: Ali disc-return artwork

- Previous turn progress. Generated ali-cinema-fatal-0-v1.webp16drawings. First output switched disc hands without a transfer; built-in edit made cells3/12 explicit two-handed rim handoffs. Provenance ali-fatal-0-source.json retains rejected source/correction. Pack40sheets640drawings passes clipping/components. Packed review visually inspected: hat,backpack,disc,fingers,shoes full; no extra floating disc components.
- Copied asset into game but NOT enabled inventory/script yet. Needs coherent actual projectile flight before use: record held0-4, released5-10, caught11-15. Existing spawnFinisherProjectile uses generic startX+58/startY-142 and focusFinisherProjectile target/phase; cannot attach new artwork unchanged or it will duplicate held record and miss catch. Required integration: timed release/catch, matching hand anchors, outbound and returning paths, clean catch removal, impacts only at actual crossings, corresponding victim reaction.
- Candidate registration from packed guard height is293/262 (not applied yet). No livebrowser QA for this asset since it is not enabled. Remaining14attacker variants requiring integration includes this newly drawn Ali0;13 not yet drawn.8overheadvictim banks,21 regression failures, othercause-specific choreography/effects/fullQA/publication remain. No livejobs; all local/unpublished; fullgoal active.

## Latest continuation: Ali disc flight integration

- Previous turn progress. Enabled Ali0bank/inventory registration293/262. Added aliDiscScript16frames (release1.25 frame5 catch2.85frame11), outbound1.7 andreturn2.4 impacts, constant attackerroot-380, victim bodybrace timed to firstcrossing,4.2duration,portraitAt1.1 clears beforeflight. OtherAli variant stillold awaiting bass-drop art.
- Added pure cinematicDiscFlight interpolated stage-local flight withnull outside release/catch, outwardturn2.05, bothimpactx0. Draws one existingpainted vinyl prop via drawThrowable afterfighters onlywhen ready. No genericprojectile phases/duplicates; impacts object-vinylfoley. Scene-clock-derived flight so no unsnapshotted effect state. Tests release/catchframes, impactcrossing, step-continuity;17scene/cache checks passed before replacing redundant repeat assertion with continuity bound (rerun pending).
- Liveprobe Ali0 bothfacings/gore settings all16 attackerframes fixedzoom/noexceptionsPASS. Initialscreenshots showed release too low and catch too farforward; adjusted release(-190,-280),catch(-285,-315),diam70. Final browserprobe passes but corrected anchor screenshots not yet inspected, exactreturn/catchalignment and palette discmatch stillneed finalvisualQA. Initial ali-disc-{4,5,10,11}.jpg reflect prior anchors; JSONali-fatal-0-* overwrittenafterfinalprobe.
- Remaining13fatalityattacker variants notdrawn,8overheadvictim banks, cause-specificart/contact/effects,21broaderregressionfailures, fullvisual/audio/loading/rollback/roster/reducedmotion/publication QA. Alllocal/unpublished no livejobs fullgoalactive.

## Latest continuation: matched disc prop and catch review

- Previous turn progress. Initialrelease screenshot showed flying record shiftedleft20px and different purple center vs redhelddisc. Built-in generated isolated painted black/red record, provenance ali-disc-prop.json (not source.json; singleprop), packed via work/pack-cinema580-disc.mjs to assets/cinema/ali-disc-v1.webp256px. Bounds checkedsource; samepropnowdrawn70px with elliptical-to-round presentation. Added Ali disc inventory/preload and scene readinessrequirespropdecoded to avoid midscene pop/missingprojectile.
- Shifted release localx-190->-170 (y-280); catch remains-285,-315. LiveAli variantprobePASS. Dedicated probe-cinema580-ali-disc-anchors.mjs captures everytick2.78..2.9 in bothdirections/gore modes, all16uniqueattackerframes checked. Evidence ali-disc-anchors-0-* JSON and ali-catch-*-before/after/held.jpg. Beware rounded gore.elapsed2.85 may stillbe pose10; usepose11 to identifyheldcatch.
- Rightcatch review: disc center/size nearlymatchesheldpose but emptyhandframe10 extends beyond incomingdisc; wrist/arm retracts abruptly into frame11. Next editcell10 to bend emptycatchhand toward shoulder matchingcell11, preserve disc absent until11. Oppositefacing images captured but not independentlyapproved. Currentcatch notfinalvisualapproval.
-17scene/cachechecksPASS. Remaining13fatalityattacker variants8overheadvictim banks21broaderfailures and allprevious fullQA/refinement/publication scope intact. Alllocal/unpublished no livejobs fullgoalactive.

## Latest continuation: corrected Ali catch handoff

- Previous conversational recommendation turn was no progress; resumed authoritative files and recovered completed image result rather than regenerating. Integrated edited cell10 with bent elbow/open shoulder-height hand. Provenance retains prior extended-hand source; new source exec-90e92d01-f850-43ab-b96c-9785600d0d77.png. All40sheets640drawings pack margin/component checks pass.
- Live before/held images reviewed in both directions. Removed large arm retraction; shifted flight catch endpoint(-285,-315) to(-273,-310) to align record center with held drawing. Corrected final before images visually inspected both directions. Remaining minor wrist/record perspective change is visible; not a claim every sequence is fully polished.
- Ali anchor browser probe all16frames bothfacings/gore on/off, fixedzoom/noexceptions PASS.16 cinematic scene unit tests PASS. Attempted cache-guard.test.mjs name does not exist, so that invocation proves only16scene tests, no new cache evidence. Probe console still has inherited Benny label despite Ali assertions.
- Remaining13fatality attacker variants,8overheadvictim banks,21broaderregressionfailures and full choreography/effects/audio/loading/rollback/roster/reducedmotion/publication requirements unchanged. Local only/unpublished; no livejobs; goal active.

## Latest continuation: current release regression evidence

- Previous status-only response was no progress. Revalidated current worktree, ran swing resolver suite, and located stale source assertion requiring recordPoseTrace(fighter, pose) although finalPose now includes the doubled full-library selector. Updated assertion to require traced and returned value match and explicitly cover finalPose. No production behavior changed; entire standalone swing-resolve suite passes, including its ground/air chains.
- Ran all tests/*.test.mjs again: work/cinema580/full-tests-current.log.20failures remain (down from21), covering legacy3D wiring, demo input/personas/transport, motion/specials/unified integration and tools layout. They need individual triage; fullsuite is not green and publication has not occurred. Do not treat source expectations as proof of actual runtime defects or silently weaken them.
- Full art and cinematic scope unchanged:13fatality variants undrawn,8overhead banks outstanding plus all motion/contact/effects/audio/loading/rollback/roster/reducedmotion/fullQA/publication. No livejobs; goal active.

## Latest continuation: demo controls regression contract

- Previous turn progress. Current pointer/keyboard handlers already implement requested left-click pause/resume and Esc-only keyboard exit. Added demo-input.test.mjs executing extracted actual handlers in VM with stubbed collaborators: two clicks toggle, controls/share/sound/right/outside clicks never toggle/exit, Esc exits while normal/transport keys stay, non-demo click preserves activity, touch release arms audio. Five cases pass. This is handler-level evidence, not a new browser interaction verification.
- Updated obsolete demo-audio/demo-speed/demo-share source expectations that still demanded any-input exits, no spectator configuration, and only share-button exemptions. Share guard now evaluated behaviorally for all six HUD targets and demo-scoped rejection. URL boot/QA/link assertions now require forwarding current matchConfig in addition to raw seed/cycle. No production behavior changed and no intended acceptance removed.
- All44 tests across demo-input/demo-audio/demo-speed/demo-share pass. Eliminates five of the previous20failures;15other failures remain by previous inventory, broad suite not rerun this turn. Fullcinematic artwork/motion/effects/audio/loading/rollback/roster/reducedmotion/publication scope unchanged. Local/unpublished, no livejobs, goal active.

## Latest continuation: Allan overhead victim artwork

- Previous turn progress. Built-in imagegen added alan-cinema-overhead-ko16drawings; source alan-overhead-ko-source.json, exec-9ff7387e-a1bf-42dd-baae-32813505a2b0.png. Pack41atlases656drawings passes margin/components. Packed sheet inspected, connected limbs/fullheadsboots, downward guard/buckle/kneel/palmcatch/sidefall/rest progression. Registration275/263. Enabled bank/preload and Allan overhead finisher victim map.
- New work/probe-cinema580-alan-overhead-reaction.mjs uses Allan attacker/victim QA mirror matchup, all16victim frames sequential bothfacings/gore onoff/fixedzoom/runtimeexceptions PASS. Evidence alan-overhead-reaction-1-* JSON. Both contact directions and right rest visually inspected. Boot tips meet/slightly overlap at contact; needs per-victim spacing refinement without ruining arm contact. No final contact/motion quality approval. Full intermediate motion beyond sheet still needs detailed review.
-22cinematic scene/music/aftermath testsPASS. Remaining7overheadvictim banks,13fatalityattacker variants,15other regression failures by inventory, plus previously documented allroster/cause/art/effects/audio/loading/rollback/reducedmotion/comprehensiveQA/publication. Local/unpublished no livejobs fullgoal active.

## Latest continuation: Allan overhead contact clearance

- Previous turn progress. Added overhead script victimSpacing alan18; updateFinisher applies attackerroot clearance throughout scene before world-facing transform. This separates boots continuously rather than moving them abruptly on the impact tick. Other victim matchups unchanged. Pure script metadata, no additional mutable/snapshot state.
- Re-ran Allan overhead victim browser probe all16frames bothfacings/gore fixedzoom/runtimeexceptions PASS. Re-extracted and visually inspected contact frame1 bothdirections: visible narrow boot gap, hands still reach raisedguard, neither head clipped. Hand contacts forearmguard rather than top of skull as shown; no claim fullyfinal choreography or allintermediate QA.22scene/music/aftermath testsPASS.
- Full remaining7overheadbanks13fatalityattacker variants15other regressionfailures and all previous effects/art/audio/loading/rollback/roster/reducedmotion/comprehensiveQA/publication requirements intact. Local/unpublished no livejobs fullgoalactive.

## Latest continuation: Ali overhead victim reaction

- Previous turn progress. Generated ali-cinema-overhead-ko16poses via built-in imagegen, source ali-overhead-ko-source.json / exec-d6026e37-11c7-4aa4-86a8-05c461199258.png. Pack42atlases672drawings margins/componentsPASS. Registration293/304; enabled inventory/preload/Allan overhead victim map. Hat glasses backpack retained through kneel/palmcatch/sidefall/rest; source inspected.
- Browser probe work/probe-cinema580-ali-overhead-reaction.mjs checks16victim frames sequential bothfacings/gore onoff fixedzoom/runtimeexceptions PASS. Captures ali-overhead-reaction-1-* JSON; both contact directions and right rest images visually reviewed. Boots separated, strike reaches near guard, no visible clipped head/limbs in reviewedframes. Fullintermediate motion and detailed backpack rotation still need finalvisual review, not full approval.
-22cinematic scene/music/aftermath testsPASS. Remaining6overheadvictim banks13fatalityattacker variants15other regression failures and full cause-specificart/effects/audio/loading/rollback/roster/reducedmotion/comprehensiveQA/publication scope unchanged. All local/unpublished no livejobs fullgoal active.

## Latest continuation: motion and specials regression checks

- Previous turn progress. Updated motion-cell test's obsolete launcher-smear expectation. Explicit smear acceptance/rejection fallback remains checked; new allroster launcher/enhancedLauncher tick sweep requires authored startup/rising contact/recovery poses, preventing horizontal-follow substitution. Full motion-cells standalone suitePASS.
- Specials suite had stale direct-call/source expectations after flow/full-library/atlas extraction and fighterArtUrl cacheversioning. Checks now cover redirect before inbetweens, actual legacy atlas resolver identity plus table forwarding, shadow using same palette/displayed bank as body, and versioned base-only HD lookup. Full specials-bank standalone suitePASS. No product changes or restored3D in this turn.
-13other failures remain by prior15inventory, not fullsuite rerun. Remaining6overhead banks13fatality variants plus complete art/contact/effects/audio/loading/rollback/roster/reducedmotion/fullQA/publication unchanged. Local/unpublished no livejobs goalactive.
- CORRECTION to preceding paragraph: final specials suite did NOT pass. Next revealed failure is physical existence of renderer/hd/deathblow-specials.webp despite retired manifest expectation. Do not claim suitePASS or13remaining;14remain by inventory. Need inspect tracked/ignored artifact provenance and references before removing or changing assertion. Motion suite alonePASS. Earlier log paragraph was written before result inspected and is superseded here.

## Latest continuation: retired HD specials removed

- Previous turn progress. Confirmed hdSheetPath only answers basebank; repository runtime references to eight hd/*-specials.webp absent apart from retirement metadata and historical audit/repair tooling. Some obsoletefiles processed again in98088adf7. Removed eight exact tracked retirement paths (21,681,532bytes) with directory validation; active baseHD and current/legacy SDspecials intact, Git history preserves oldfiles.
- Specials suite then reached obsolete3D source contract. Replaced archivedrenderer assertions with execution of both current3D gates returningfalse and no import of renderer/three in game.js, reflecting user's painted-only requirement. Full specials-bank suitePASS.
- Full test suite rerun work/cinema580/full-tests-current.log:13failures remain, legacy3D host/overlay/probe contracts, demo-persona sampling/gating, stage-reachbrick/scars, tools-layout, unified-bank/swing. No fullgreen/publication claim. Remaining6overheadbanks13fatalityattacker variants and complete art/choreography/effects/audio/loading/rollback/roster/reducedmotion/fullQA/publication scope intact. Local/unpublished no livejobs goalactive.

## Latest continuation: counter persona precedence

- Previous turn progress. Demo-personas sampler exposed real regression: generic deliberateDefense branch preceded authored counterFirstChance, reducing Allan backSpecial share to0.404 below existing0.45 contract. Moved the authored counter read before generic deliberateDefense and gated it with existing canRead (grounded/free of attack/stun/wakeup/down). No threshold weakened, same random salts and no added mutable state; noncounter tiers skip this branch as before.
- Existing archetype sampler nowPASS, including counter vs flat baseline and other archetypes. Updated separate stale no-demoPersonaFor-call assertion to execute actual demoAiTier for custom matchups: auto returns fighterpersona, explicitrookie/street/pro/final honors configuredchoice. Existing standard/story/clock gating assertions retained.
-63checks selected by *ai*.test.mjs +demo-personas +demo-session PASS (ai-current.log).11other broad failures remain by prior13 inventory, fullsuite not rerun. Complete cinematic6overheadbanks13fatalityvariants plus all art/contact/effects/audio/loading/rollback/roster/reducedmotion/fullQA/publication scope unchanged. Local/unpublished no livejobs goalactive.

## Latest continuation: Commissioner overhead victim reaction

- Previous turn progress. Built-in generated commissioner-cinema-overhead-ko16drawings, provenance commissioner-overhead-ko-source.json exec-ce2a0423-8db9-4040-9505-62526a510227.png. Pack43atlases688drawings margin/componentsPASS; registration294/304, inventory/preload/Allan overheadvictim mapenabled. No cane in dedicatedreaction, bothhands free.
- Probe-cinema580-commissioner-overhead-reaction.mjs enablescommissioner then Allan/Commissioner, checksall16victimframes bothfacings goreonoff fixedzoom/noexceptionsPASS. Bothcontactframes and rightrest visuallyinspected: fullhead/coattail/feet intact, restingcoat settles. NOT finalcontact approval: shoesoverlap and attackerhands finish at lowerchest/abdomen below highguard on tallerCommissioner. Needs tailoredcontacttiming/pose andspacing, not just blanketdistanceincrease. AllintermediatevisualQA also pending.
-22cinematic scene/music/aftermath testsPASS. Remaining5overheadvictim banks13fatalityattacker variants11broad failures by inventory and full allroster/choreography/causeart/effects/audio/loading/rollback/reducedmotion/fullQA/publication intact. Local/unpublished no livejobs goalactive.

## Latest continuation: corrected overhead contact drawing

- Previous turn progress. Inspected Allan overhead attacker sheet: frame10 had joinedfists shoulderheight, allother descendingframes lower, leaving no highcontactpose. Built-in edited cell10 to eyeheight, source exec-16cedbd6-4c16-4446-8002-288e1ac64ecb.png saved in alan-fatal-1-source.json retaining previousLowContact. Pack43/688 passes; guardregistration remains275/258; copied correctedatlas.
- Added Commissioner victimSpacing22 (Allan18 remains). Commissioner contact images bothfacings visually reviewed: fists now reach highguard, shoes have narrow gap. No runtimebody shifting upward or camera zoom used. Rest intact from previousinspection. Globalcontact edit affects othermatchups, whose new captures still need detailed visualcomparison.
- Browser all16overheadreaction probes rerun sequentially for Commissioner,Jez,Benny,Allan,Ali bothfacings/goreonoff fixedzoom/noexceptionsPASS.16scene unitchecksPASS. Remaining5overheadbanks13fatalityvariants11broad failures and fullchoreography/art/effects/audio/loading/rollback/roster/reducedmotion/fullQA/publication intact. Local/unpublished no livejobs goalactive.

## Latest continuation: Cyraxx overhead victim reaction

- Previous turn progress. Generated cyraxx-cinema-overhead-ko16drawings built-in, source cyraxx-overhead-ko-source.json exec-35f9d267-e817-4471-891c-422cb9489c9f.png. Pack44atlases704drawings margin/componentsPASS. Registration301/304; enabled inventory/preload/Allan overheadvictim map.
- Dedicated probe-cinema580-cyraxx-overhead-reaction.mjs all16victimframes sequential bothfacings goreonoff fixedzoom/noexceptionsPASS. Bothcontact directions/rightrest visually reviewed: fists meet guard, shoes separated, head beard arms legs insideimage. Final body appears shorter than upright silhouette (bentlegs/sideperspective); intermediate size/continuity still needs finalvisualmotion audit, no fullqualityapproval. Source sheet inspected.
- Remaining4overheadvictim banks (Deathblow,Devil,Donald,Post),13fatalityattacker variants,11broad failures plus complete art/contact/effects/audio/loading/rollback/roster/reducedmotion/fullQA/publication scope intact. Local/unpublished no livejobs goalactive.

## Latest continuation: Deathblow overhead reaction

- Previous turn progress. Generated deathblow-cinema-overhead-ko16drawings built-in, source deathblow-overhead-ko-source.json exec-7fbe2e32-64bc-462b-b9cb-524e635a0d6d.png. Pack45atlases720drawings margin/componentsPASS, registration286/281; inventory/preload/Allan overhead victim mapenabled.
- Both contact directions and rightrest reviewed. Initialfrontshoe overlap corrected with victimSpacing deathblow24, constantthroughscene. Finalbothfacings contact reviewed: shoegap and handsmeetgauntletguard, no clippedcap/limbs; restingbodycomplete. Source frame9to10roll raiseshead a little before settling; detailedcontinuous-motion QA stillpending, not finalapproval.
- Dedicated Deathblowoverhead browserprobe rerunafterspacing:all16victimframes bothfacings/gore onoff fixedzoom/noexceptionsPASS. Remaining3overheadbanks (Devil,Donald,Post),13fatalityvariants11broad failures and completeart/contact/effects/audio/loading/rollback/roster/reducedmotion/fullQA/publication scope intact. Local/unpublished no livejobs goalactive.

## Latest continuation: Donald overhead reaction

- Previous turn progress. Generated donald-cinema-overhead-ko16poses built-in, source donald-overhead-ko-source.json exec-0e3428ae-42e5-48b0-8f8c-562f898a6352.png. Pack46atlases736drawings margin/componentsPASS. Registration282/290; inventory/preload/Allan overhead victim mapenabled, club absent reactionhandsfree.
- Bothcontact directions/rightrest visually inspected: fullhead/hands/armor/shoes, strike meetsguard, shoetips touching/slightoverlap. Added DonaldvictimSpacing14 throughscene and reran browserprobePASS all16victimframes bothfacings/gore fixedzoom/noexceptions. Corrected screenshots still in JSON awaiting finalvisualreview; no finalspacingapproval. Intermediatefall consistency stillpending.
- Remaining2overheadbanks (Devil,Post),13fatalityvariants11broad failures and allprevious art/choreography/contact/effects/audio/loading/rollback/roster/reducedmotion/fullQA/publication scope intact. Local/unpublished no livejobs goalactive.

## Latest continuation: painted-renderer regression verification

- Previous goal turn yielded status evidence only, no implementation progress. Revalidated current worktree and ran the full explicit test-file suite: 11 failures confirmed in work/cinema580/full-tests-current.log.
- Updated stage-reach tests to execute the actual painted throwable/physical-prop renderer in a VM. Brick uses its atlas rectangle, stays within requested dimensions, and does not draw while unloaded. Existing material clatter/pickup tests retained. Scar wiring now checks cinematic landing material and active painted world draw instead of retired renderer host. All 11 stage-reach tests pass.
- Updated unified-swing source integration checks for actual smooth/recovery/footwork/bridge/in-between selection followed by full-library final-pose tracing. Preserved the fallback transform gate (no deformation once recovery art loaded), and pinned cinematic victory delay and character victory selection. Entire standalone unified-swing test passes.
- Eight failures remain by subtraction; full suite not rerun after these targeted passes. tools/inbetweens contains six old scripts, not merely a cache; do not remove blindly. No product art or runtime changes this turn. Remaining two overhead victim banks, thirteen fatality variants, full motion/contact/effects/audio/loading/rollback/roster/reduced-motion QA and publication remain unfinished. Local/unpublished.

## Latest continuation: full automated suite green

- Previous goal turn was progress: repaired three stale integration checks. Revalidated remaining test sources against game.js. The active painted game has false cinema3dAllowed/WorldActive gates, no module.createRenderer host, painted combat reads, and painted stage pulse/damage paths.
- Updated cinema-host, cinema-fighters, cinema-spectacle, probe-registry and unified-bank tests to reflect retired 3D integration without removing their archived renderer unit coverage. Retirement checks execute both false gates and prohibit renderer imports/creation. Painted checks retain foreign-context rendering, combat reads, pulse latch, unified readiness and final console sweep.
- Verified tools/swing is the documented replacement for tools/inbetweens: identical ext2 grammar, color core retained with main guard, portable repo_root, bank-aware build_sheet. Removed six tracked obsolete inbetweens scripts and now-empty directory after validating exact resolved path and exact filename inventory. Git preserves old files. No generators or paid APIs executed.
- Ran full explicit tests/*.test.mjs list with Node spec reporter. Authoritative work/cinema580/full-tests-current.log: 763 tests, 763 pass, 0 fail/skip/cancel. This supersedes earlier counts of unresolved regression failures.
- Automated success does not approve motion/art quality. Two overhead victim banks (Post/Devil), thirteen fatality attacker variants, detailed choreography/contact/visual/audio/loading/offline/rollback/roster/reduced-motion QA and publication remain unfinished. No new runtime or art modifications this turn; all cinematic upgrades remain local/unpublished. Goal active.

## Latest continuation: Post overhead reaction

- Previous goal turn was progress, clearing the automated regression suite. Generated Post overhead victim reaction using the built-in image tool and inspected the reference and output. Source exec-4d1b108b-e4fb-47cc-9f0d-a5355ac3b431.png retained in post-overhead-ko-source.json. Sixteen poses, orange painted coveralls/long hair/black boots, hands free. Pack now 47 sequences/752 drawings, margins/components pass. Guard registration292/304.
- Enabled Post bank inventory/preload and Allan overhead victim mapping. Dedicated browser probe all16 frames, both facings, gore on/off, fixed zoom and no exceptions passed. Contact screenshots initially showed boot overlap; added constant Post spacing24. Reran probe and visually inspected corrected contact both directions: shoes separated, hands contact high guard. Right-facing rest complete inside viewport. Full intermediate motion/anatomy continuity still needs review; no full-motion quality approval.
- Cinematic scene unit tests16/16 pass. Prior full suite763/763 passed before this art addition. Devil is the last missing overhead reaction; thirteen fatality attacker variants and full visual/audio/offline/loading/rollback/roster/reduced-motion QA and publication remain. Local/unpublished, goal active.

## Latest continuation: Devil overhead reaction

- Previous turn progress. Generated and inspected Devil16pose overhead victim sheet from his painted reference, source exec-32dfc6c0-864f-419d-99dd-71695570fa74.png saved in devil-overhead-ko-source.json. Pack48 sequences768drawings margin/components passes. Registration246/286. Added bank inventory/preload and Allan victim mapping. All ten overhead victim banks now exist.
- Dedicated Devil browser probe all16 frames bothfacings/gore onoff fixedzoom/noexceptions passes. Initial contact screenshots showed foot overlap; spacing32 removed most but tips still touched. Increased constant Devilspacing40 and reran probePASS. Final40 images remain in JSON for visualconfirmation;32 bothdirections and fullrest visually inspected, no croppedhorns/wings/tail. Contact is atop horns/head, not human forehead. Continuousmotion and scale/anatomy consistency still pending; not full approval.
- Scene tests16/16 passed at spacing32. Thirteen fatality attacker variants plus full art/contact/effects/audio/loading/offline/rollback/roster/reduced-motion QA and publication remain. Local/unpublished; goal active.

## Latest continuation: Ali bass-drop attacker sequence

- Previous turn progress. Visually checked Devil spacing40 right-facing contact: small footgap and complete body; left40 image still pending final review.
- Generated Ali second fatality attacker16poses, taking single boombox from backpack, bracing, projecting it forward, recovering/replacing. Source exec-046f0699-e806-493a-a1f4-e4452500b8af.png saved ali-fatal-1-source.json. Source inspected. Pack49 sequences784frames margins/components PASS; registration293/297. Copied atlas into game.
- Added aliBassScript variant1 with finalimpact1.86/frame8, duration4.15, fixedax-380/body-KO reaction, no disc/projectile phases, stationary camera. Bank inventory now bothAli variants. Ali browser probe now variants0/1, bothfacings, goreonoff; all16frames and fixedzoom/noexceptionsPASS. Sceneunit16/16PASS.
- Right-facing frame8 and15 inspected: complete hands/boombox/shoes, good separation and complete victimrest. Sheet speakerfront points partly towardviewer; pulse must be anchored/directed properly in effects pass. Bass sound/effect timing and lingering vinyl metadata still need work before this variant is finished. Full transfer anatomy/continuousmotion review pending. Twelve attacker fatality variants still undrawn; completeart/effects/audio/loading/offline/rollback/roster/reducedmotion QA/publication remain. Local/unpublished goalactive.

## Latest continuation: Ali bass pulse and cue

- Previous turn progress. Added deterministic cinematicBassPulse from1.72 to2.1, source(-180,-250) travels to victim(0,-187) at1.86 impact, fades afterward. Painted draw emits three restrained gold elliptical pressure fronts after fighters, gated by scene readiness; reduced-motion shrinks/dims effect. Fixed-stage scale retained. No new simulation fields/timers.
- Ali bass script now declares bassPulse, BASS DROP combo/BOOMBOX signatureSpecial and vfx-bass audioCue. Finisher impact invokes existing sound route for this cue; original impact processing/rollback guard unchanged. Actual listening still pending. Legacy fatality profile still contains vinyl limb/caption data used elsewhere; those downstream visuals need review rather than claiming fully converted metadata.
- New test checks pulse boundaries, monotonic travel, contact/frame8 alignment, deterministic seeking and reduced-motion path/intensity. Full suite now764/764 pass, no skip/fail. BothAli variant browser probes bothfacings/gore all16frames fixedzoom/noexceptionsPASS. Inspected right-facing release7 andimpact8 screenshots: pulse leaves speaker vicinity and reaches victim at impact, fighter silhouettes clear. Left/reducedmotion live visual and fullcontinuousreview still pending.
- Twelve attacker fatality variants remain undrawn, plus full choreography/effects/audio/loading/offline/rollback/roster/reduced-motion QA/publication. Local/unpublished; goal active.

## Latest continuation: bass presentation coherence

- Previous turn progress. Added cinematicFatalityProfile override for Ali1 and routed live game getGraphicFatality import to it. Live title/caption/special/setup/action/finale/device now BASS DROP/BOOMBOX pressure wording, affected region torso. Other fighter/variant profiles unchanged; archived projectile profiles remain unmutated. Added profile regression checks.
- Disabled inherited severed-limb arterial emitter for bassPulse scripts; pressure blast keeps painted body intact. Existing gore impact/pool remains, requires aesthetic review. ProjectileId vinyl remains in archived compatibility fields, but this script has no projectile phases and no discFlight, so no projectile is spawned.
- Reran bothAli browser variant probes bothfacings/gore onoff all16frames fixedzoom/noexceptionsPASS. Full suite765/765 PASS after torso/arterial changes. Actual audio listening, left/reducedmotion visuals and complete continuousmotion/aftermath review remain pending.
- Twelve fatality attacker variants undrawn; full scope art/choreography/effects/audio/loading/offline/rollback/roster/reduced-motion QA and publication remains. Local/unpublished goalactive.

## Latest continuation: Commissioner overhead cane attacker

- Previous turn progress. Generated Commissioner fatality1 sixteen drawings. Initial source exec-c83c1e5b-9b58-4b03-81aa-d472406305bd.png rejected for cane shrink/flip. Corrected rigid hooked end with exec-6bdda6b2-2a33-4f62-961e-24fa5bef218b.png; source provenance saved commissioner-fatal-1-source.json. Packed50sequences800drawings passes. Registration294/247. Added inventory and commissionerGavelScript: contact2.1/frame8 duration4.1, ax-340 contact, allvictims overheadKO, object-cane cue, no projectilephase.
- Browser probe Commissioner enabled; variant1 bothfacings/goreonoff all16frames fixedzoom/noexceptionsPASS. Initialcontact bothdirections/rest reviewed: full figures, no overlap, cane above Jezguard. Edited only contactcell8 to angle shaft downwardright, exec-151eb484-bdd8-4827-87e1-802da7927730.png, previous source retained. Repacked50/800, copied correctedatlas, reran probePASS. Finalcorrected contact screenshots inJSON still need inspection; not approved for allvictims. Cane griptransfer/body scale/continuous arc still need detailedreview.
- Eleven attacker fatality variants undrawn (Commissioner0, Cyraxx/Deathblow/Devil/Donald/Post0/1). Metadata still original cane limb profile; needs choreography-consistent pass. Fullvisual/audio/loading/offline/rollback/roster/reducedmotionQA/publication remain. Local/unpublished goalactive.

## Latest continuation: Commissioner contact verification and full roster playback

- Previous turn progress. Visually inspected corrected Commissioner frame8 vsJez bothfacings: cane reaches highguard, fullbody/canetip intact and feet separated. This does not establish contact correctness against every height.
- Added Commissioner1 cinematic profile FINAL VERDICT/OVERHEAD CANE STRIKE with head region. Added intactImpact script property to Commissioner1/Ali1 and used it to suppress inherited severed-limb arterial emitter. Added timing test for frame7-before/frame8-at/frame9-after contact2.1 and held16-frame recovery, allkeys nozoom/verticaloffset/rotation. Fullsuite766/766PASS.
- Added Commissioner roster probe tenvictims bothfacings goreoff. Firstattempt failed when newvictim art notwarmed (no cinema frames). Corrected probe to q.fight eachpair +700ms artwait before q.graphicFatality; rerun all20cases16attackerframes fixedzoom/noexceptionsPASS. Evidence commissioner-roster-{victim}-1-{facing}-false.json. Detailedpervictim contact screenshots, coldload fallback and continuousmotion QA stillpending; no all-roster visualapproval claimed.
- Eleven attacker fatality variants remain undrawn plus all outstanding fullvisual/audio/loading/offline/rollback/reduced-motion QA and publication. Local/unpublished goalactive.

## Latest continuation: Commissioner roster contact review

- Previous turn progress. Inspected right-facing contactframe8 screenshots for remaining9victims: cane reaches highguards/head silhouette, full heads/hands/feet insideview. Devilfoot almost touches; added constant victimSpacing devil12 for thisscript. Otherpairs visibly separated. Left-facing fullroster still needs visualreview.
- Impact cue was at victimshoulder well behind cane contact. Added optional impact.hitOffset (default12 preserves otherfinishers), set Commissioner1 hitOffset75 and hitHeight1.2. Reran full20case roster browser probe goreoff all16frames fixedzoom/noexceptionsPASS; sceneunit19/19PASS. Reviewed revisedJez/Devil/Deathblow contact: cue now near guard/horn/cane contact, Devilfootgap improved. Remaining revisedcue screenshots need finalinspection; general puff aesthetics stillpending.
- Eleven attackerfatality variants plus fullcontinuousmotion/art/effects/audio/loading/offline/rollback/reducedmotionQA/publication remain. Local/unpublished goalactive.

## Latest continuation: Commissioner cane-lock sequence

- Previous turn progress. Added Commissioner0 dedicated16pose horizontal hook/pull/bodythrust bank. Originalsource exec-c3878819-0c40-4a54-836f-84e8799666cd.png; initial pack51sequences816drawings passed. Integrated commissionerLockScript with hook1/frame4, final2.6/frame10, duration4.5, bodyKO reaction and inward victim pull. BothCommissioner variants browser bothfacings/goreonoff all16fixedzoom/noexceptionsPASS initially.
- Inspected initialrightframe4/10/15: fullbodies, but hook too high/far and finalthrust short. Changed approach/contactax hook-280 (was-340), final-310(was-330). Generated cell3/4 downwardhook correction exec-b0bf9e28-73ef-4649-afca-f15eebd88681.png rejected bypacker duebakedcheckerboard. Replacedbackground viaimagegen exec-18c21f37-cba0-4570-bb31-05f25b3104cb.png; provenance retained commissioner-fatal-0-source.json. Finalpack51/816passed; copiedcorrectedatlas and updatedregistration fromaudit. CorrectedbrowserbothvariantsPASS. Finalhook/contact screenshots stillrequireinspection. Generatededit smoothed somecoatdetail; fullartcontinuity/weaponlength review remains, no finalqualityapproval.
- Ten attackerfatality variants remain undrawn (Cyraxx/Deathblow/Devil/Donald/Post0/1). Commissioner0 profile/captions/effectanchor also needalignment. Fullvisual/audio/loading/offline/rollback/reducedmotionQA/publication remain. Local/unpublished goalactive.
- Installation correction: first finalcopy attempt failed on Python default cp1252 read beforecopy; reran explicitUTF8 successfully, actual registration294/284, copied finalatlas and reran bothvariant probePASS. Previous intervening pass had used oldatlas; finalpass now usescorrectedasset.

## Latest continuation: Commissioner pull continuity

- Previous turn progress. Inspected corrected lock4/6/10 right-facing: hook now reaches upperbody, but victim lagged far behind cane duringretract. Changed pullkeys at1.4/1.8 to ax-430/vx-200, final2.6 ax-480/vx-200, separate through aftermathax-530/vx-40. Reran probe and inspected6/10: hooked cane reaches victimforwardhand atpull; finalthrust reaches upperbody. Near-touch shoes atpull corrected with Jezspacing10; finalspacing screenshots pending confirmation.
- Finalimpact cue moved from belly to upperbody hitHeight1.05/offset25. Commissioner0 profile now CANE LOCK/HOOK,PULL,BODY STRIKE/torso, no old sever wording. Bothvariants browser bothdirections/goreonoff all16frames/fixedzoom/noexceptionsPASS after final changes. Fullsuite766/766PASS.
- Fullpull anatomicallean and footplant remain visualreview items: inwardtranslation now tracks grip but body reaction leans back; no claimperfect naturalmotion. Otherroster lockcontact requirescheck. Ten attackervariants stillundrawn; fullart/effects/audio/loading/offline/rollback/reducedmotionQA/publication remain. Local/unpublished goalactive.

## Cyraxx feedback verification

- Previous status-only turn made no implementation progress. Revalidated current files and reviewed browser screenshots cyraxx-feedback-8.jpg and cyraxx-feedback-15.jpg: full visible bodies and separated feet at release, intact resting victim at end. These two stills do not prove continuous movement quality or all-matchup correctness. Release currently has an unconnected purple impact puff: feedbackPulse is not rendered yet, so the causal visual connection remains unfinished.
- Existing Cyraxx fatality1 adds sixteen attacker drawings (52 packed sequences / 832 drawings). Corrected live profile to DEAD AIR / FEEDBACK RELEASE / torso pressure wave so labels and aftermath metadata match the intact body reaction. Added regression coverage for release-frame timing, held recovery, and archive immutability. Scene tests 20/20 pass.
- Nine attacker fatality variants remain undrawn. Continuous motion, feedback effect/audio, full roster and loading QA, and publication remain outstanding. All cinematic changes remain local and unpublished.

## Cyraxx pressure-wave connection

- Previous turn progress. Added deterministic feedback pulse from release1.94 to impact2.1, fading by2.34. Renderer connects authored mouth region to the victim upper-body impact, mirrored with facing and gated on complete cinema bodies. Reduced-motion uses lower opacity; no camera scaling or flashing added.
- Scene tests21/21 and game syntax pass. Browser probe both facings/gore on-off passes all16 attacker frames with fixed zoom and no exceptions. Reviewed frame8 contact both facings: thin wave fronts reach the existing impact region and bodies remain separated/intact. Pulse is subtle beside inherited purple impact circles; effects art direction still needs improvement. Mouth origin and continuous travel need dedicated intermediate-time review. No actual sound review yet.
- Nine fatality attacker variants and full remaining visual/audio/loading/roster QA remain unfinished. Local and unpublished.

## Cyraxx second painted sequence

- Previous turn progress. Generated new Cyraxx0 SWARM RISE sixteen-pose sheet, source exec-28eeef5c-96d9-436a-8f4d-185cba03e81a.png; provenance work/cinema580/cyraxx-fatal-0-source.json. Inspected source: complete figures, scoop/rise/release/recovery; crouch hand continuity needs closer motion review. Packed53sequences848drawings passed component/padding checks. Installed atlas and registration301/277.
- Added distinct4.3s script, upward releaseframe8 at1.9, overhead-collapse victim bank, fixed camera and intact body metadata. BothCyraxxvariants browser bothfacings/goreonoff all16frames noexceptions/fixedzoom pass. SwarmRise flag has no dedicated insect rendering yet: this is an unfinished local scene, not visual approval. Detailed browser contact stills/continuous playback and swarm effect remain next.
- Eight fatality attacker variants remain undrawn (Deathblow/Devil/Donald/Post both). Full scope art/effects/audio/loading/roster QA and publication remain unfinished.

## Swarm connection and portrait correction

- Previous turn progress. Added scene-clock-driven swarm: staggered rising insects reach victim at1.9/frame8 then descend/fade by3.3. Small shaded bodies, heads and legs replace an otherwise missing connection; reduced-motion cuts population and removes oscillation. No persistent simulation particles or changing stage scale.
- Browser review of frames6/8/11 found portrait obscured gathering gesture and displayed archived FEEDBACK BLACKOUT. Moved swarm portrait earlier (portraitAt.85); cinematicScene now reads live cinematicFatalityProfile so all authored overrides appear in portrait titles. Repeated bothCyraxxvariants bothdirections/goreonoff probePASS, all16frames fixedzoom noexceptions. Reviewed corrected frame6: gesture now visible. Contact/rest intact and separated in right-facing stills. Bugs remain visually subtle at this scale; complete continuous-motion and left-facing aesthetic review still required.
- Scene tests22/22; full suite769/769PASS. Eight undrawn attacker variants and remaining art/effects/audio/loading/roster verification plus publication remain. Local unpublished.

## Deathblow ground-drive sequence

- Previous turn progress. Generated Deathblow1 sixteen dedicated painted drawings source exec-07dd0c20-e6d7-48fb-abc6-e9774aab45de.png, provenance deathblow-fatal-1-source.json. Packed54sequences864drawings passes. Registration286/255 and installed atlas. Source and right-facing browser frames6/8/10 reviewed: overhead fists/cap/fullfeet visible, joined fists contact floor atframe8, figures separated. Full arc and footplant still need continuous review.
- Added GROUND DRIVE profile/script:1.9 groundstrike/frame8 then groundwave reaches victim2.08 before overhead-collapse reaction; duration4.2, portrait clears before overhead wind-up, fixed scale/intact body. Small shaded debris and fracture line follow scene time; reduced-motion removes hop. Initial wave is subtle and inherited generic impact circles still dominate aftermath. Dedicated ground-contact audio at1.9 remains pending; current impact foley at2.08.
- Browser variant1 bothfacings/goreonoff all16frames fixedzoom/noexceptionsPASS (probe console inherited Cyraxx label; actual script uses Deathblow). Scene tests23/23 and syntaxPASS. Seven attacker variants remain undrawn (Deathblow0; Devil/Donald/Post0/1). Full effects/audio/continuousmotion/roster/loading QA and publication remain. Local unpublished.

## Ground-contact audio timing

- Previous turn progress. Revalidated updateFinisher and MoveFoleyPlayer. Added authored foleyCues for Deathblow1 downswing1.8/heavy and floorcontact1.9/object-brick (existing fall sample), keeping victim impact2.08 separate. Generic interval sampler fires only when scene-clock crosses timestamp; pause/reverse seeks do not retrigger. Runtime explicitly skips rollback resimulation, no extra persistent state.
- Scene tests24/24 and syntax pass; coverage includes exact boundary, paused/reverse/repeated intervals, multi-cue timestep and scripts without cues. Actual listening and browser audio-event verification still pending, including cold audio-bank behavior. This change establishes cue timing, not final sound mix approval.
- Seven attacker variants remain undrawn; all remaining visual/audio/loading/roster QA and publication still outstanding. Local unpublished.

## Deathblow wheel-pass draft

- Previous turn progress. Generated16pose cutter bank exec-b552340f-e24a-4de1-b845-b5d05a63a077.png; provenance deathblow-fatal-0-source.json. Packed55sequences880drawings passes, registration286/277. Installed and integrated4.25s WHEEL PASS with frame7 contact1.9, bodyKO, handheld steel-cutter metadata, swing/metal foley and no spawned pizza projectile.
- Browser bothDeathblowvariants bothfacings/goreonoff all16frames fixedzoom/noexceptionsPASS. Reviewed frame7 bothdirections: cap/cutter/feet complete and body silhouettes separated. Cutter reaches forward guard region; body-contact connection is weak and reads as thrust more than intended sweep. Sourceframe9 changes supporting-hand position. These are concrete choreography/handcontinuity review issues, not approved final quality. Scene tests24/24PASS.
- Six attacker variants undrawn (Devil/Donald/Post0/1); full art/motion/effects/audio/loading/roster QA and publication remain. Local unpublished.

## Wheel-pass arc correction

- Previous turn progress. Edited cells5-9 of Deathblow0 using builtin imagegen: exec-7f87743c-1527-4936-81a8-f4289a227ff3.png (previousThrustSource retained). New upward sweep and chest retraction removes wrist-support hand from frame9. Pack55/880PASS, installed correctedatlas registration286/281.
- Browser initially showed newframe7 blade above/shortofvictim at oldimpact1.9. Changed impact to lower risingframe6 at1.72 with ax-265, retreatto-305 while blade followsup frame7; swingcue1.5. Repeated bothvariants/facings/goreprobe all16/noexceptions/fixedzoomPASS. Reviewed rightcontactfinal: cutter meets forwardguard, feet visibly separated narrowly. Leftfinalcontact and allotheropponent sizes stillrequirevisualreview. No fullcontinuousmotion approval; upper follow-through still needs timing scrutiny.
- Scene regression locks contactframe6 before raisedframe7 and earlier swingcue. Six undrawn attacker variants plus full visual/audio/loading/roster QA and publication remain. Local unpublished.

## Devil stamp artwork and anatomy repair

- Previous turn progress. Generated Devil1 sixteen-pose stamp sheet exec-3d66c87b-1783-47c1-987d-dfc9bf576389.png. Visual inspection rejected frame7: supporting leg missing/airborne. Builtin edit exec-1d558764-d012-4ef8-9ab7-605c40f78d8f.png restores two visibly distinct connected legs, rear planted and front descending. Inspected corrected fullsheet. Provenance devil-fatal-1-source.json retains rejectedMissingLegSource.
- Corrected pack56sequences896drawings passed component/padding checks. Copied corrected atlas to assets/cinema/devil-cinema-fatal-1-v1.webp. Guardheight285 (baseline246) for forthcoming registration. This asset is NOT enabled in inventory/playback yet; script/reaction/effect/audio integration and browser visualverification are next. Do not count packing as completed finisher.
- Five fatality attacker variants remain undrawn (Devil0, Donald/Post0/1), plus Devil1 integration and all outstanding detailed quality/roster/loading/audio review and publication. Local unpublished.

## Devil stamp integration

- Previous turn progress. Enabled repaired Devil1 bank registration246/285 and dedicated HOOF STAMP script: repaireddescendingframe7 at1.8, plantedstampframe8 at1.9, traveling ground impact2.08, fullrecovery4.3. Added matching intactbody profile, separate swing/stampfoley, overheadKO victim. Groundeffect accepts authored origin(-245) and Devil ember coloring, retains fixedstage scale and reducedmotion/nohop behavior.
- Browser variant1 bothfacings/goreonoff all16frames fixedzoom/noexceptionsPASS. Inspected repaired7 right and8 bothdirections: bothlegs visible and connected, wings/horns/tailtips unclipped, clear gap toJez. Stamporigin/ember visibility and continuousmotion still need review; frame8 is beforevictimreaction by design. Tests cover pose/foley/groundwave timing, bank/profile/all16frames; no claimallroster visualquality.
- Five undrawn attacker variants remain (Devil0, Donald/Post0/1), plus remaining fullart/effects/audio/loading/roster QA and publication. Local unpublished.

## Devil crossing-wing finisher

- Previous turn progress. Generated Devil0 source exec-dcae1781-2fde-4002-87c1-16f85f4d063c.png; source looked transparent with edge specks, extractedreview inspected clean continuousfigures. Packed57sequences912drawings passes. Installed246/188 registration. WING CROSS script has wingwindup/crossingframe8 at1.95/recovery4.25, intactbody/bodyKO, separateheavywhoosh and roundhouseimpact.
- Browser bothDevilvariants bothfacings/goreonoff all16fixedzoom/noexceptionsPASS. Contactframe8bothdirectionsreviewed: entire wings/tail/horns/feet intact, wingtip meets victimabdomen and torso/feet separated. Effectcue was high atforearm; adjusted hitHeight.78/offset25 toabdomen afterreview (finalcue still needsnewbrowserinspection). Complete wing joint anatomy/continuousarc and allopponents remain unverified. Scene tests26/26 passed before finaleffectanchor change.
- Four undrawn attacker variants remain (Donald/Post0/1). Remaining fullart/effects/audio/loading/roster QA and publication still required. Local unpublished.

## Donald tee-shot draft artwork

- Previous turn progress. Generated Donald0 sixteenpose tee-shot source exec-8efae889-6cea-44ce-8fb0-386392b280e1.png. Review found shortenedclub in severalcells. Builtin edit exec-e47ae6bb-2bac-4598-8891-7ff7b87cf5e8.png lengthens multiple shafts, provenance keeps previousShortClubSource. Still visible length/perspective variation in backswing and upright recovery; NOT rigidclub-quality approved. Twohand swing identity and fullbodyposes retained. No ball drawn; future scene must add coherent balltrajectory.
- Corrected pack58sequences928drawings passes component/padding. Copied atlas into assets/cinema/donald-cinema-fatal-0-v1.webp but NOT enabled in inventory/gameplay. Requires pose curation or furtherclub artfix, script/ball/effects/audio integration, browser review. Padding pass does not establish naturalmotion.
- Three attacker variants undrawn (Donald1/Post0/1), plus Donald0 integration and all outstanding fullart/effects/audio/loading/roster QA/publication. Local unpublished.

## Donald tee-shot integration

- Previous turn progress. Enabled Donald0 bank282/242 and4.25s TEE SHOT script. Ball release at1.9/frame8, opponentimpact2.12, bodyKO, intact profile, swing1.7/golfcontact1.9 foley. Added small shaded/dimpled ball with deterministic flight and brief rebound, no asset-dependent late pop. Bothfacings supported.
- Browser variant0 bothfacings/goreonoff all16/noexceptions/fixedzoomPASS. Reviewed rightframe8/9: bodies/clubtips intact and separated, ball ahead ofclub atrelease. Adjusted ballorigin from-175 to-215 and reran probePASS. Exactneworigin stillneedsvisualinspection, plus club-length/hand continuity/completearc remain knownartreview issues. Scene tests27/27 and syntaxPASS, including ballreleasebeforevictimimpact and expiry.
- Three undrawn attacker variants (Donald1/Post0/1) and all outstanding art/effects/audio/loading/roster verification/publication remain. Local unpublished.

## Donald direct club finisher

- Previous turn progress. Generated Donald1 source exec-fb7da885-e396-4ef3-a5bb-a950b87de9a2.png, provenance donald-fatal-1-source.json. Packed59sequences944drawingsPASS, inspected extractedreview. Clubshaft still varies length acrossposes; windup and shortfollowthrough need furtherartcontinuity correction. Installed282/291 registration.
- Integrated FINAL CLUB dedicated4.25s overhead sequence frame8impact1.95, overheadKO, intactprofile, heavywhoosh/objectgolfballfoley, no ballflight. BothDonaldvariants browser bothfacings/goreonoff all16fixedzoom/noexceptionsPASS. Rightcontact showed goldhead slightlyshortofguard; movedapproach/contact30closer (contactax-285), reranprobePASS. Correctedcontactstill needsvisualreview; allopponentheights/continuousarcnotapproved. Scene tests27/27 beforefinalspacing adjustment.
- Two attacker variants undrawn (Post0/1), plus remaining fullart/effects/audio/loading/roster QA and publication. Local unpublished.

## Post wire-pull artwork

- Previous turn progress. Generated Post0 sixteenpose grab/brace/pull/release source exec-55a13273-dfcc-4564-8811-498c3cbc7e12.png, provenance post-fatal-0-source.json. Inspected source completefigures; handheight changes duringinitialgrab need choreography matching, and release is sourceframe10 (earlier thanrequestedframe11). No wire painted; requires runtime cable anchored to actual grip and victim body.
- Pack60sequences960drawings passed component/padding checks. Copied atlas to assets/cinema/post-cinema-fatal-0-v1.webp, guardheight291/baseline292. NOT enabled in inventory/playback: needs script, grip anchors, cable tension, pairedvictim pull/fall and browser verification. Sourcealphaedge appearance requires packed/runtime visualreview.
- One attacker variant stillundrawn (Post1), plus Post0 integration and all outstanding fullart/effects/audio/loading/roster QA/publication. Local unpublished.

## Post wire-pull integration

- Previous turn progress. Enabled Post0 registration292/291 and4.4s wire-pull script, gripping/brace/retract/release frames, victimoverheadKO bracing then inwardtranslation(-110), fixed scale. Cable uses authored atlasgripcoordinates transformed with actual renderedsize/facing, dark wire/highlight and reduced sag afterbrace; disappears atsourceframe10 release. Added intacttorso profile and wirefoley.
- Browser variant0 bothfacings/goreonoff all16fixedzoom/noexceptionsPASS. Rightframes4/7/9 reviewed: cable follows fist, body silhouettes and feet separated. Victim resetfrombrace2 tofall1 atfinal caused visible straightening; corrected shared cinema victim frame floor to preserve latestbrace until fall catchesup. RepeatedprobePASS. Correctedtransition stillrequiresvisualreview. Cabletarget jumps from.78height to.6height atimpact and needs smoothing; appearance currently singleline with no wrap, not completephysical cable treatment. Pullfootplant and exact leftgripreview remain.
- One undrawn attacker variant (Post1), plus fullart/effects/audio/loading/roster QA and publication remain. Local unpublished.

## Wire attachment continuity

- Previous turn progress. Revalidated Postwire renderer and victimbrace transition. Replaced abrupt .78-to-.6 targetheight switch with smooth descent over1.8-2.5, added small torso wrap joined to cable edge. Retains atlasgrip anchor and scene-clock determinism.
- Browser bothfacings/goreonoff all16fixedzoom/noexceptionsPASS. Reviewed corrected rightframe9: victim remains bent throughfinalimpact rather thanstraightening, cable tracksgrip and torso region, bodies/feet separated. Leftattachment and continuousfullplayback stillrequirevisualreview. Releasecurrentlyremoveswire atopenhandframe10 rather thanphysicaldrop: remainingpolish item.
- Fullsuite775/775PASS, including continuousmonotonic attachmentheight/noimpactjump and openhandrelease tests. One undrawn attacker variant(Post1) plus fullart/effects/audio/loading/roster QA/publication remain. Local unpublished.

## Final missing attacker bank: Post paint-and-kick

- Previous turn progress. Generated Post1 source exec-2ac7f855-142e-4a3a-aba5-4997459ad3d4.png. Removed unrequested white shake marks using builtin edit exec-c79c42c5-33fe-4604-bd1b-a5c32daca094.png; previousMotionMarksSource retained. Correctedsource inspected, pack61sequences976drawingsPASS. Installed292/288 registration.
- Enabled all20 dedicated fatality attacker banks. This is coverage of draft artwork, NOT completed quality/goal. Post1 FINAL COAT 4.4s: spray .8-1.3, brace1.05, kick2.1/frame8, heldrecoil thenrecover. Added subtle spraycone, paint/roundhousefoley and intacttorso profile; no wires. BothPostvariants browser bothfacings/goreonoff all16fixedzoom/noexceptionsPASS. Reviewed rightframe4/8: fulllegs/bootscan/hair intact, bootmeetsforwardguard, body/groundedfoot separate. Impactcue too low; movedtoheight1.05offset65 afterreview (newcueunverified). Sprayvisibility/nozzleexactanchor and allpairsrequiremorevisualwork. Scene tests28/28 passedbeforecueadjustment.
- No attackerbank remains undrawn, but knownweapon/posecontinuity issues, completephysicaleffects/aftermath/audio, allroster/facings/edges/palettes/reducedmotion/goreoff/CPU/coldload/offline/rollback QA, commit/publication/publicverification remain outstanding. Local unpublished, goalincomplete.

## Corrected contact matrix and released wire

- Prior status-only goal turn was no progress; resumed authoritative artifact inspection. Corrected matrix job is terminal: 400 results, zero failed playback assertions/errors. Capture uses full-precision status elapsed at impact + 1/120; earlier rounded-clock contact screenshots were premature and superseded.
- Regenerated and visually reviewed Donald1, Post1, Devil0 right-facing contact montages against all ten opponents. These show the intended club/boot/wing reaching the opponent with separate body silhouettes and complete figures. This is contact still evidence only, not approval of full motion, weapon continuity, or the remaining 340 captures.
- Fixed Post0 wire disappearing at open-hand frame10. Released cable now uses deterministic release-time endpoints, gravity and ground settling; its wrap falls with it. No mutable presentation state or wall clock. Added continuity, floor-bound and deterministic settling test. Scene tests29/29 PASS. Post both variants/both facings/gore on-off browser probe PASS, all16 frames and fixed zoom, no exceptions. Reviewed frames9-12 both facings: cable leaves hand, falls while victim collapses, bodies remain separated. Fine cable is intentionally subtle; physical pull anatomy still needs full-motion review.
- All changes remain local/unpublished. Full quality, sound, remaining matrix/edge/loading/offline/rollback/CPU checks and publication remain incomplete.

## Cinematic cold-audio fallback

- Previous goal turn was progress (wire release behavior plus visual evidence). Inspected cinema cue callers and confirmed direct sample-only calls silently returned false on cold/failed banks.
- Added playCinematicFoley for authored KO/fatality swings, object cues, impact cues and landing. Uses loaded samples when available, otherwise immediate existing material synth for objects or mapped procedural fallback for physical cues. Preserves sound toggle, volume, attract gate and rollback suppression; no deferred late hit. General combat sound() retains its existing fallback.
- Added QA-only cue trigger and work/probe-cinema580-audio-fallback.mjs. Browser probe blocks moves-v1 requests and instruments actual oscillator starts: all6 representative cues create immediate fallbacks; unblocked/warmed load routes all6 through samples; mute creates zero oscillators in both cases. Evidence work/cinema580/audio-fallback.json. This proves routing and sound creation, NOT subjective sound quality or complete soundtrack listening.
- Full regression776/776 PASS. Initial run exposed CRLF reintroduced by Windows Python writes; normalized touched JS/MJS to LF per repository attributes and repeated successfully. No test assertions weakened.
- Outstanding full visual continuity/material aftermath/audio listening/edge/cold art/offline/CPU/rollback checks and publication remain. Local unpublished, goal incomplete.

## Contact readability pass

- Prior goal turn progress: immediate cinematic audio fallback and runtime verification. Reviewed all20 fatality contact stills against Jez in both facings (all-contact-1.png/all-contact--1.png). Figures are whole and separated at sampled contact; this does not prove continuous weapon trajectories or all opponent combinations. The review exposed palette-colored impact orbs obscuring the physical moves.
- Painted non-blood contact effects now use fine neutral directional droplets and brief cloth-dust mist, bounded12 particles (3 reduced motion), instead of large radial palette-colored circles. Existing blood-enabled final-hit effects are retained and still need their own polish. Added size/direction/lifetime/quality tests.
- Removed legacy distortion-ring/RGB-split latch from painted final impacts. It was visible as a broad lens ring despite fixed background zoom. Legacy non-painted effects remain gated as before.
- Post bothvariants/bothfacings/gore on-off probe PASS; reviewed right kick follow-through after final change: complete boot/hand/body silhouettes, no distortion ring. Fullsuite777/777 PASS. Particle visibility in continuous playback and the remaining gore-on/material effects are not yet final-approved.
- Local unpublished. Remaining quality/coverage/publication requirements unchanged; active goal incomplete.

## Painted blood aftermath cleanup

- Previous turn progress: contact particles and distortion cleanup. Reviewed Post1 gore-on collapse frame11: legacy bright pool, camera blood and unrelated signature fragments mismatched intact painted body.
- Painted pools now render a shallow irregular dark stain with no shadow glow, delayed until fall, modest spread, reduced size for intact choreography and a subtle wet-stage highlight. Offset beneath the fallen body; victim-specific final body positions still need the broader aftermath matrix.
- Painted finishers no longer spawn lensBlood or generic goreShockwave. Intact scripts no longer spawn inherited signature bone chips/glitch debris or play gore-bone. Blood spray remains available; this is material/continuity cleanup, not a completed injury-art or full gore-quality claim.
- Post both variants/bothfacings/goreonoff playback PASS. Inspected updated right Post1 settled frame13: whole fallen body and grounded dark stain, no camera splashes. Fullsuite777/777 PASS. Wider final-body alignment, complete continuous-motion/art/audio review and remaining QA/publication stay outstanding. Local unpublished.

## Full roster delayed-art and rollback verification

- Previous turn progress (painted blood aftermath cleanup). Expanded late-art browser test from Jez-only to all10 attackers, both fatalities, with cyclic opponents covering all10 victim roles.
- For each of20 fresh page loads, service worker and HTTP cache are bypassed, all cinema requests are paused, and scene starts on fallback artwork. Requests are released during that active scene. Asserted no switch to cinema banks after completion or rollback; rollback checksum matches. New fight then uses matching fatality atlas and painted victim bank. All20 cases PASS, zero runtime exceptions. Script work/probe-cinema580-roster-late-art.mjs; detailed evidence work/cinema580/roster-late-art.json. Process completed successfully.
- This verifies late arrival and rollback choice stability for20 scenes, not permanent network failures, full offline service-worker behavior, visual fallback quality or every matchup. No game code change needed for this gate. Remaining edge/reduced-motion/CPU/offline/full-motion/audio and publication requirements still open. Local unpublished.

## Corner staging and reduced-motion coverage

- Previous turn progress (all20 delayed-art/rollback verification). Found old anchor clamp allowed victim anchor390 with attacker offset-530, placing attacker root offscreen. Painted scenes now use reviewed central anchor W/2+direction200; opening portrait masks corner relocation without changing background scale. Legacy scripts preserve old anchor rule.
- QA graphicFatality accepts optional startPositions for explicit corner setups. Added work/probe-cinema580-edge-reduced.mjs: all10 attackers, cyclic victims covering all10 roles, both variants/facings, both corner starts, reduced-motion enabled, goreoff =80 cases. All reach final atlas frame with fixedzoom1, zero runtime exceptions. Evidence edge-reduced-matrix.json and edge-* contact captures.
- Reviewed Jez/Benny, Deathblow/Devil, Devil/Donald and Post/Jez contact images in both directions: complete figures inside viewport. Remaining windup/settled-frame bounds not proven by contact screenshots; need full-envelope review. Fullsuite777/777 PASS.
- Local unpublished; original completion requirements including continuous-motion/art/audio/offline/CPU/publication remain open.

## Opaque painted bounds through pose changes

- Previous turn progress (central corner staging and reduced-motion playback). Added work/probe-cinema580-bounds.mjs, instrumenting the live game canvas drawImage/getTransform with packed atlas per-cell opaque bounds. Captures both roles whenever either animation frame changes, including windup, impact and resting frames; avoids treating transparent atlas padding as body geometry.
- All20 fatalities bothfacings with cyclic opponents covering all10 victim roles =40 scenes,2372 measured painted shapes, zero viewport clipping. Minimum margins: left150.39,right152.04,top118.44,bottom144.82 pixels on1280x720 canvas. Evidence work/cinema580/painted-bounds.json. Probe completed successfully. Initial probe syntax collision fixed before execution; no game edits.
- This proves sampled pose-change bounds for cyclic matchups, not every matchup/intermediate translation or anatomical correctness. Existing400-matrix contact evidence complements it but does not replace continuous-motion review. Remaining audio/offline/CPU/quality/publication requirements open. Local unpublished.

## Offline cache verification and priority fix

- Previous turn progress (opaque-bounds evidence). Added real service-worker offline reload probe work/probe-cinema580-offline-roster.mjs. Initial page-only CDP offline emulation left worker networking live; rejected that result. Final probe disconnects page AND worker, overrides navigator network state, and asserts an uncached fetch fails after reload before counting animation results.
- Repeated roster cycling failed at Deathblow because required files were no longer cached, while a fresh Deathblow/Devil diagnostic passed. Reconnection retry alone did not resolve it. Kept reconnect handler that discards failed cinema Image objects for future requests, preserving active scene choice; do not claim that was the fix for the repeated cache failure.
- Changed bounded runtime cache trimming to retain the small cinema library ahead of other older media, still insertion-ordered within both groups and still capped120MB total. Library currently21.13MB. Unit test proves prioritized retention and that oversized cinema still cannot bypass cap. No eager installation or additional cache budget.
- After cache change, all10 pairs/20 finishers pass a fresh online load, disconnected worker/page, offline reload and full authored-frame playback with fixed zoom. Prior repeatable Deathblow failure is resolved. Evidence work/cinema580/offline-roster.json (20 entries). This verifies recently loaded pairs, not a promise to store all game media forever. Process terminal PASS.
- Fullsuite778/778 PASS. Changes local unpublished. Full motion/weapon/art/audio listening/CPU and final publication audit remain outstanding.

## Natural CPU ending integration

- Previous turn progress (offline cache fix and20 cached finishers). Added work/probe-cinema580-cpu.mjs. Starts actual QA CPU demos with fixed seeds237-246, all10 cyclic matchups on Janney, final difficulty/bestof1. No health override or forced KO: ordinary demo AI fights until an ending, then tracks painted poses through settled victim frame15.
- All10 natural CPU matches reached complete painted end scenes, covering both staged KO and fatalities. Zero runtime exceptions. Evidence cpu-cinema.json and cpu-* screenshots. These10 outcomes do not guarantee each fighter won or both variants appeared naturally; explicit variant coverage is in prior dedicated probes.
- Initial fast-stepped screenshot was washed out because presentation flashes had little wall-clock time to decay. Added650ms render settling before screenshot; colors returned normally without a game change. Reviewed complete10 ending montage cpu-settled-review.png: whole bodies grounded/separate, readable victory pose. Some lingering legacy mist/paper-like overlays and blood emission in older Jez/Benny/Ali scenes still need aesthetic/continuity review; do not treat integration PASS as final art approval.
- All changes local unpublished. Continuous weapon/anatomy review, final audio listening/remaining aesthetic fixes and final publication audit remain.

## Combat elemental emissions during end scenes

- Previous turn progress (natural CPU match integration). Traced CPU aftermath paper/smoke overlays to normal elemental observer. It could observe a retained special-attack descriptor outside fight phase, and used !fighter.cinematicFrame, incorrectly admitting frame0.
- Added post-integration phase gate: outside fight phase, reset attack observers and fade wash, allowing existing particles to expire without emitting new combat specials. Changed cinematic frame check to ==null. This preserves ordinary live combat effects and authored cinematic effects.
- Repeated10 natural CPU matches PASS. Increased capture render settling to1.3sec for wall-clock particles; inspected Commissioner/Cyraxx aftermath: complete head/body, previous large paper overlay gone. Evidence refreshed cpu-cinema.json/cpu-* images. Does not prove every possible combat effect or full scene aesthetic.
- Fullsuite778/778 PASS. Remaining full motion/weapon quality, audio listening and final publication audit remain outstanding. Local unpublished.

## Donald overhead grip repair

- Previous turn progress (combat element observer fix). Reviewed Donald1 full source/packed sequence: detached-looking secondary grip and short overhead shaft weakened continuity.
- Builtin edit exec-1d8fcc03-3ed3-4609-b090-b1a3100e1d8e.png joined hands/clarified shaft but returned an opaque checkerboard. Rejected for integration. Builtin background correction exec-84cdab0c-b13a-4cfa-9ec1-3eb6f6a2393e.png uses solid magenta. Preserved original source and rejected checkerboard path in provenance donald-fatal-1-source.json.
- Reviewed source and packed sheet: all16 figures/clubs intact; overhead hands stay joined and shaft clearer. Pack61sequences976framesPASS. Installed Donald1 atlas, updated registration282/290 (old282/291). Source still has some projected-length variation across low/recovery poses; do not claim mathematically rigid weapon or final continuous-motion approval.
- Donaldbothvariants/bothfacings/gore on-off browser PASS, all16frameindices/fixedzoom/noexceptions. Reviewed new right frame8: complete clubhead/shaft/hands, bodies separated, head at upperguard approach. Exact impact/crossing and fullarc still need motion review. No additional paid API used. Local unpublished; goal incomplete.

## Alan body-hook knockout reaction

- Previous turn progress (Donald1 grip artwork). Audited KO scene routing: Alan body-hook still used general backward KO despite dedicated body-impact banks for every victim. Routed Alan KO to cinema-body-ko, preserving existing strike timing/landing/victory clock.
- Added body-hook routing/timing test for all10 victims. Browser work/probe-cinema580-alan-body-ko.mjs PASS all10 victims bothfacings, all16 reaction frames. Reviewed Jez right frames0/1/3/6/9/15 (alan-ko-reaction-review.png): body recoils then knees buckle and settles; this bank does NOT show the strong forward fold initially described in commentary. Corrected that description. Closely placed feet at contact merit remaining detailed matchup review; no detached body parts in reviewed strip.
- Fullsuite779/779PASS. Probe terminal success. Local unpublished. Remaining original quality/motion/audio/final publication audit requirements remain open.

## Choreography labels and intact blunt aftermath

- Previous turn progress (Alan KO reaction). Updated remaining7 live profiles: Jez cable-lock/low-cable-reap, Benny cross/rising cut, Alan body-pressure/overhead-hammer, Ali return-cut. Labels/setup/action/finale/device/limb now describe painted actions and no longer claim old projectile arm/leg severing. Archived base profiles remain unchanged.
- Jez cable pulls and Alan blunt finishers now set intactImpact, suppressing inherited arterial pumping/signature bone treatment while retaining impact blood option. Benny/Ali blade cuts retain their cutting aftermath.
- Updated semantic metadata test across all20 profiles to reject stale sever/amputate/decapitate labels; removed obsolete equality assumption against archived profiles. Jez8-case gore/facing playbackPASS. Refreshed400 warmed roster/facing/variant matrixPASS, zeroexceptions, all reachfinalframes, fixedzoom. Fullsuite779/779PASS. New contact screenshots supersede older matrix assets; not all refreshed images visually re-reviewed.
- Local unpublished. Remaining complete motion/weapon-quality/audio-listening/publication audit remains open; goal incomplete.

## Release preparation 5.8.0

- Prior status-only turn was no progress; revalidated current worktree and fetched origin/main. Upstream Final Blow changes are confined to signaling dependency files, outside cinematic edits.
- Post spray now uses the existing paint-spray effect at .8sec; Cyraxx swarm plays its object cue at1.05sec. Timeline crossing tests cover each release and paused repeat suppression. Full regression780/780PASS. This is routing/timing evidence, not a subjective listening claim.
- Prepared title, engine, asset cache, service worker and smoke-test version markers for5.8.0. Release remains unpublished until remote verification. Remaining visual limitations include projected weapon-length variation and approximate contact anchors.

## Public release verification and banner correction

- Published5.8.0 as6cd87add713cadb240b85ac96011e374ef28c2f5; Cloudflare and GitHub Pages checks completed successfully. All76 checked code/art files match local SHA256. Served HTML differs only through site analytics and Cloudflare injection; application-version5.8.0 verified.
- Public unmodified CPU demo Jez/Benny rendered15 observed KO atlas cells and settled victory with zero browser exceptions. Evidence work/cinema580/public-cpu-cinema.json and public-cpu-ending.jpg. Local QA controls are intentionally unavailable in production; replaced the initial incompatible QA-based public probe with observational Canvas draw instrumentation and normal demo URL.
- Public screenshot exposed victory banner obscuring raised hands.5.8.1 positions all roundover announcements at25percent height with half-size headline, including story follow-ups that replace the victory text. Local browser verified Jez/Benny both facings, paused/rollback timing and full fall before announcement. Reviewed latest screenshot: headline above whole upright fighter, no head/hand overlap.
- Original outstanding cause-specific airborne/wall reaction and detailed motion/audio quality requirements are not proven by this layout change. Goal remains open.

## Cause-specific KO travel follow-up

- Previous turn progress: banner fix committed/pushed asbe27c602278a4a5b85b7ccc37c052552a3e542a8. This turn Cloudflare/GitHub deployment succeeded;77 release assets including CSS match committed bytes.
- Found kick and uppercut KO victim paths were fixed-position. Added deterministic kick recoil60px and uppercut35px recoil/52px parabolic lift, ending lift at existing31/60sec landing cue. No sprite rotation/stretch or new image edits.
- Fullsuite781/781PASS. Browser work/probe-cinema581-reactions.mjs completed40cases: Ali/Deathblow against all10 victims, bothfacings, all16reactionframes, zeroexceptions. Reviewed Jez reaction strips for both attackers: entire figures, lift settles, backward kick movement. These runtime checks do not independently prove bounds/anatomy for every captured frame. Changes remain local pending final visual/edge review and publication.
- Audited actual defeat flow: checkKnockout clears pending knockdown to establish finish window before signature endscene. Preservation of the original airborne/wall impact remains a separate incomplete requirement; these signature reaction improvements do not claim that requirement complete.

## Reaction edge audit and5.8.2

- Current goal turn progress: found real clipping at the recoil-side edge. Reserve reactionTravel in scene victimTarget outer margin before recoil; preserves full60px kick and35px uppercut movement rather than clipping/truncating it.
- Initial mirror-match failures were instrumentation errors: palette canvases use alt-palette:id:bank names, which the old bounds probe did not recognize; it consequently sampled a reflection. Corrected audit name mapping; no gameplay/palette change for this instrumentation issue.
- work/probe-cinema582-reaction-bounds.mjs PASS80cases:2attackers/all10victims/bothfacings/bothstartingedges. Each100steps captures2actual sprite bounds;16,000shapes zero offscreen bounds. Evidence work/cinema580/reaction-bounds.json. Fullsuite782/782PASS.
-5.8.1 public normal CPU banner check alsoPASS and screenshot reviewed: Benny head and raisedhands clear beneath header.5.8.2 prepared for the recoil/spatial followup; public verification still required.

## Public5.8.2 and airborne KO diagnosis

-5.8.2 Cloudflare deployment completed.77 checked assets match88f4ba0ca873011e1dd5bafc6eece579352986ae. Ordinary public Ali/Deathblow CPU match produced painted KO and clear victory header, zero browser exceptions; screenshot and trace work/cinema580/public582-cpu-*.
- Initial airborne probe setup was invalid: QA fighter setter ignores y/grounded, and input() queues frames rather than stepping. Corrected by sending jump then stepping .2sec before zero-health round end. Reproduced victim frozen at y457.04 through180simulationsteps. Root cause updateFighter returned before physics whenever phase was notfight.
- Local fix continues airborne physics during finish/roundover when no authored scene owns the fighters. On roundover touchdown, clear stunned pose, start collapse and store snapshotted cinemaTouchdownTick. Painted floor transition begins atframe6 and advances to15; floor thud at7ticks aligns with frame8; winner call waits until body settles. Fighter initialization includes nullable field, generic rollback snapshot already stores it.
- Corrected singlefighter probe now lands at35ticks, progresses6..15 and settles by89ticks. Fullsuite782/782PASS. All10fighter airborne/rollback browser probe launched as next verification. Fix not yet published; remaining cinematic wall/continuous-motion/audio review requirements stay open.

- All10fighter airborne landing/rollback probe completed PASS, evidence airborne-ko-roster.json. Preparing5.8.3 publication of the freeze fix.
