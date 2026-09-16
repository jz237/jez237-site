# Amiga diorama remake — source audit

Date: 2026-09-15. Status: **six-course reconstruction plus bonuses; release work continues**.

## Isolated work

Branch `codex/marble-diorama-20260915` starts at remote main `4e4895f84`.
The main checkout has unrelated Vector Arena changes; those were not edited,
stashed, reset or merged. The prior standalone Marble project was read only.
The original browser page is retained byte-for-byte under `legacy/index.html`.
Publication is withheld because the requested campaign/audio acceptance gates
are not satisfied. A passing physics suite is not campaign parity.

## Existing implementation findings

Audited `games/2026-07-13/marble-madness/index.html` from main and the earlier
standalone project's README and parity ledgers.

| Area | Evidence in existing source | Decision |
|---|---|---|
| Geometry | Practice source explicitly describes the route beyond depth 42 as an invented run-out. Later layouts are provisional. | Do not import old geometry as verified Amiga courses. |
| Rendering | Canvas cell painter and hand-authored decorative geometry. | Replace with Three.js BufferGeometry. |
| Physics | Separate cell-height interpolation/solver. Decorative surfaces can differ from collision surfaces. | Replace with Rapier; compile one vertex/index representation. |
| Rotation | Drawn marble pattern, rather than a rigid body's quaternion. | Render simulated position and quaternion with interpolation. |
| Music | Source calls its FM sequencer original compositions. | Do not reuse it as authentic Amiga music. |
| Rules | Prior ledger still leaves difficulty effects, two-player rules, scoring triggers and time behavior open. | Preserve uncertainty; do not inherit old PASS labels. |
| Public listing | Describes all six races, measured fidelity and music more strongly than the source evidence supports. | Prepare accurate preview wording locally. |

The prior ledger's claim of 6.25 displayed clock units per real second requires
fresh emulator-speed validation. It is not an authoritative clock calibration.
The proof course uses 180 real seconds and its own provisional scoring.

## Reference register

| Reference | What it supports | Verification status |
|---|---|---|
| [Amiga manual transcription](https://www.lemonamiga.com/doc/marble-madness/1052) | Two players, eight difficulty settings (0–7), input choices, button-held turbo. | Read. Does not provide course dimensions or difficulty multipliers. |
| [World of Longplays Amiga 500 recording](https://www.youtube.com/watch?v=Nfa2etJ84_8) | Six-course gameplay, clock/award transitions, silhouettes and audio comparison. | All-course contact sheet inspected; finish/transition/ending frames measured. Automated audio comparison performed; listening and detailed hazard traces remain open. |
| [ExoticA soundtrack catalogue](https://www.exotica.org.uk/wiki/Marble_Madness) | Six named custom modules and format caveat. | Catalogue read; archive download returned a verification HTML page. |
| Earlier local `docs/parity/course-maps.md` | Practice measurements and later-course landmark inventory. | Read; uncertainties retained. |
| Earlier local `marble-ref/level1.png`, `level2.png` | Practice banked reversals and Beginner landmarks. | Visually inspected privately; source revision/platform still needs corroboration before parity claims. |
| Earlier local `level3.png` through `level6.png` | Remaining course maps. | All visually inspected and compared with longplay silhouettes; detailed geometry remains open. |

No private preservation disks, emulator states, original artwork or source game
code are included in the new game or deliverable. New surfaces and marble
patterns are authored in code. No paid services were used.

## Soundtrack dependency

Catalogue archive: `Game/Reed_Larry/Marble_Madness.lha`.
Listed cues: `cust.Practice` (27,808 bytes), `cust.Beginner` (33,088),
`cust.Intermedia` (34,248), `cust.Aerial` (40,364), `cust.Silly` (40,420),
`cust.Ultimate` (40,540).

The catalogue credits Larry Reed and customisation by Don Adan. Its format note
says the modules use the Amiga audio device and do not work with PC DeliPlayer.
Other credits differ; preserve source attribution rather than guessing a
composer credit. A successful HTTP response was **not** an audio download:
inspection found a 317-byte browser-verification page, and archive decoding
rejected it. Its SHA-256 must never be used as a soundtrack fingerprint.

The new music cue registry is intentionally empty. The volume control is
present but clearly marked unavailable. Impact effects are newly generated
from measured contact forces and are not represented as original effects.

Update: an alternate catalogue provided a real ZIP containing all six modules.
Their sizes match the catalogue, and WebUADE+ renders the original data. The
regular UADE 3.05 renderer failed on the custom audio-device driver. See MUSIC.md
and music-provenance.json for hashes, rendering details and comparison findings.
The custom rip's 60 Hz conversion is corrected only in the renderer's in-memory
copy for PAL reference comparison; original sample bytes/pitches are unchanged.
Final cue assignment, loops, all-cue listening, pause/restart, tab switching and
mobile startup remain release gates. No music has been enabled in the game yet.

## Publication gate

Do not publish this preview as the requested completed remake. Complete the
course/rules/audio ledger and release tests first. Then fetch current main,
integrate only the Marble paths, retain the legacy URL, build locally, publish
to GitHub/Jez237 through the site's established pipeline, and verify the live
campaign and demo. No GitHub push or live deployment has been performed.

## Six-course checkpoint update

All races, their campaign state machine and ending are now connected. Three
bonus courses, richer editor tools, enemy/acid/bird/vanishing mechanics and
contact effects are authored. Current automated coverage is 41 tests; see
VALIDATION.md and campaign-measurements.json for modes and outcomes.

The [Amiga Monitor retrospective by Michael Webb](https://www.nightvzn.net/portfolio/web/amiga_monitor/archives/1_2html/mmadness.htm)
was read alongside the Amiga longplay: it corroborates moving acid, wall-to-wall
birds and disappearing bridges at Ultimate's ending. The old checklist wrongly
assigned vanishing paths to other courses; that has been corrected. This is
behavioral evidence, not a measured cycle/coordinate specification.

The clock reference has mostly 1.2–1.4 real-second intervals per displayed unit,
with visibly slower intervals in Ultimate's busy rooms. Automated digit reads
contain errors and were not used to alter clocks. The remake retains the
nominal PAL 50/64 rate; complete timed campaign traversal still needs work.

The source archive and original soundtrack rendering described above have been
obtained. Final music verification remains open; no soundtrack or emulator
engine has been shipped. No paid service was used and publication is pending.


## Subsequent checkpoint: waves, alternates and persistence

48 tests pass. Intermediate now has two shared-geometry traveling-wave strips;
all authored alternate demos complete, with remaining original-route parity
listed in PARITY.md. Replay follows the marble through seeking. Compact saved
inputs retain exact analog values; quota handling preserves authored courses
and score records. Latest portrait and landscape viewport checks are recorded
in VALIDATION.md. The game remains unpublished while release gates are open.
