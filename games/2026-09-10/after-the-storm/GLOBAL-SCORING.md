# Global scoring · v2.19.0

The menu's **Global leaderboard** shows the worldwide top ten. Completed solo races, time trials, championship rounds and stunt runs offer **Post worldwide**, which shares three initials and the result. **Save on this device** keeps the existing local course records independently.

Race, time-trial and championship-round boards rank the fastest total time to the millisecond. Stunt boards rank points. Course, difficulty, lap count, sea state, course-layout revision and standard/custom tuning have separate boards. Stunt events have a fixed course layout rather than a lap-count filter. All four riders may compete in each category.

Free Ride, two-player events, disqualified/incomplete runs, demos, inspection tools and the experimental native-physics preview do not submit. Both default Big surf and venue-condition runs have online boards. A run captures its rules and tuning when it starts, so later options cannot change its category.

The existing `game-scores.jez237.workers.dev` service stores the results. No new account, paid service or database was created. These are community submitted records; the service does not replay or authenticate the browser's physics. Only initials and a numeric result are sent. The modern physics namespace is `ats-v1`; a future incompatible driving-model change should use a new namespace.

The game checks HTTP failures, validates returned records, limits requests to ten seconds including their response bodies, and ignores results from outdated filter requests. Posting disables double clicks. A failed post can be retried while the completed result remains open; a confirmed successful post stays disabled. Local recording does not depend on network success. The global dialog supports keyboard focus, Escape, screen readers and phone widths.

Validation on October 15, 2026:

- Twelve scoring tests pass, covering ranking direction/precision, board isolation, completed-run eligibility, response validation, deadlines and submission retries.
- Fourteen browser checks pass, including offline recovery, stale requests, form resets and duplicate-click prevention.
- A race time posted and read back exactly through the live shared service in a separate QA namespace; test data was kept out of public game boards.
- The live leaderboard loads from the local game, fits a 390 × 844 phone viewport, and leaves high graphics available.
- Full suite: 2,035 tests, 2,024 pass, the same eleven existing gameplay calibration failures. Their remaining work is tracked in [RACEWAVE-PARITY.md](RACEWAVE-PARITY.md).

Global scoring leaves rendering and racing physics unchanged. Original-game parity remains in progress.
