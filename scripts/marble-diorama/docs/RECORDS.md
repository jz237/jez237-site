# Medals and personal records

These are remake extras, not claimed original Amiga awards. Targets use elapsed
simulation seconds, including falls and recovery time. Bronze requires a finish;
gold and silver include the exact target time. Untimed practice still measures
elapsed time for medals, but has its own records.

| Course | Gold | Silver |
|---|---:|---:|
| Practice | 35 s | 55 s |
| Beginner | 75 s | 110 s |
| Intermediate | 65 s | 95 s |
| Aerial | 75 s | 110 s |
| Silly | 95 s | 140 s |
| Ultimate | 85 s | 125 s |
| Each bonus course | 35 s | 60 s |

Campaign targets allow some margin above the measured normal-input demo times
at difficulty 0. Difficulty categories stay separate. Course balance changes
may warrant adjusting these targets before the full release. Proof and custom
courses without authored targets award bronze for completion. Imported targets
must be finite, positive, and ordered gold no slower than silver.

The start card and course picker show targets and saved personal bests. The
picker can inspect single-course or campaign records. Results show a medal for
each finishing player, the record category, personal-best status and high score.
A slower high-scoring run updates the high score without replacing the fastest
run or its solo ghost. Two-player records belong to individual player slots;
they are separate from solo records and do not reuse a solo ghost.

Record keys include physics version, course ID/revision, difficulty, player
count, assistance, timed/untimed and campaign/single-course. Existing built-in
solo keys are preserved. Custom keys additionally fingerprint the definition:
changing a layout under the same revision cannot inherit its older records.
Old custom records remain stored but are not matched to an unverified layout.
Renaming a course or adjusting only medal targets does not alter its fingerprint.
Display medals are derived from the current course targets and saved best time.

Only human play saves records; demos and replays cannot earn medals. Failed
storage writes leave all previous records and replays intact and show an unsaved
result. Quota pruning retains scores and medals before discarding ghost/replay
data, and the UI reports when such data was removed.

## Verification — September 16

- Eight record tests cover exact medal boundaries, invalid imports, independent
  two-player awards, high score versus fastest ghost, record category isolation,
  demo/replay/timeout exclusion, failed-write rollback, serialization, quota
  pruning, and changed custom definitions.
- Browser flow: imported a small local custom course with its finish at the
  starting area to exercise result UI through normal simulation. Solo and both
  player slots earned gold; two-player records survived page reload and appeared
  in the picker. Enabling checkpoint assistance showed an empty separate record
  category, then saved distinct assisted results. No console errors captured.
- Result card inspected at the desktop viewport, 390×844 portrait and 844×390
  landscape. Portrait shows both players and all actions; landscape scrolls
  within the viewport and its Back button is reachable. These are viewport
  checks, not physical-phone acceptance or evidence of campaign completion.
- Built HTML includes content-derived versions for JavaScript and CSS URLs to
  request new assets when an updated deployment is loaded.
- A final demo check found and fixed an empty-waypoint crash on custom courses.
  One additional physics regression test completes missing/empty-route custom
  floors with both players, and the browser demo completes without displaying
  earned medals. The complete suite now has 77 passing tests.
