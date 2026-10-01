# Saved replay library — October 1, 2026

Adds a browser-local collection of named solo/demo recordings. The replay studio saves to the library; the main menu browses, searches, plays, renames, imports, exports and deletes saved recordings. Deletion requires a second explicit action in the recording's row. Names use text/escaped markup, and studio keyboard shortcuts do not consume name-entry keystrokes.

Storage uses separate IndexedDB metadata and compressed-recording stores in one transaction. Listing does not load recording blobs. Concurrent write transactions enforce a maximum of 50 recordings and 256 MiB of compressed data. A repeated identical recording reuses its content hash. Excess saves fail without eviction. Storage failures report an error while `.qir` export remains available. Open/import use the existing bounded replay decoder. This is browser/site-local storage, not cloud persistence; export remains the backup path.

Validation:

- Full VENGEANCE candidate regression suite: 303 frontend tests passed; frontend TypeScript/build passed. The multiplayer implementation is unchanged by this milestone.
- Eight actual browser IndexedDB checks passed: fresh-connection recovery, duplicate save/rename, simultaneous writers at capacity, byte-cap rollback, invalid import isolation, export/import and deletion, missing-record handling, and rollback after the blob write aborts.
- In the full game, recorded 29.5 seconds of an eight-car derby, saved “First quarry collision” (0.62 MiB compressed), reloaded the page, reopened the library and played the same recording in the replay studio.
- The visible fixture library retained two recordings after reload and persisted an edited title through the UI.
- Browser test entry: `tools/replay-library-check.html`, served by Vite; test source: `tests/replay-library-browser.ts`. Fixture databases have test-specific names and never touch the real game library.
- Frozen runtime revision is linked into the existing historical restoration chain; prior replay, livery and source-integrity tests pass.

Limits: long recordings near the memory cap need sustained performance testing. Online recording, replay effects/audio, additional tracks/vehicles, cloud/platform persistence and the rest of the feature-parity plan remain unfinished. The previously published frontend is separate from this candidate; publication status is recorded in the deployment report rather than inferred from tests.

Installation: the final candidate passed303 frontend tests and build, then replaced only manifest-checked files in `D:/Projects/hidden reef header/quarry-impact`. Previous files and build were saved in `quarry-backup-before-replay-library-20261001`. Installed application: `assets/index-D48Gr-Ar.js`. Public website remains the earlier `feb427fa` frontend. Full parity is not achieved.
