# Replay and photo milestone — October 1, 2026

The full Wreckfest 2 PC parity objective remains in progress. This milestone adds solo replay recording, file exchange and photo mode to Quarry Impact.

## Player controls

- Pause a solo event or demo and choose **WATCH REPLAY** or **PHOTO MODE**. Results also offer these controls. **P** opens photo mode from a running solo event and returns to pause afterward.
- Replays offer play/pause, 0.25–4× speed, seeking and 0.05-second steps. Space toggles playback; arrows step, Shift+arrow moves one second. H hides controls; Escape returns.
- Select any recorded car and free orbit/pan, chase, hood or overview. Photo controls offer field of view, exposure, roll, five crop choices and a thirds guide. PNG export contains only the rendered picture at the canvas resolution, cropped as chosen.
- Save a compressed `.qir` replay, then use **OPEN REPLAY** on the main menu. **LAST REPLAY** retains the most recent session recording in memory. Starting another event replaces it; save to disk before reloading or starting another event.

## Evidence

- Final candidate production TypeScript/Vite build passed. Existing large-bundle warning remains.
- All **231/231 tests** passed on VENGEANCE. Nine replay tests cover sample limits, file parsing and compression, malformed data, interpolation, teleport discontinuities, live-physics isolation, wheel rotation, paint, actual impact observations and previous-release recovery.
- Actual GLB tests run the three production car models through dents, detached assemblies, repairs and repeated backward/forward seeks after binary file exchange. Geometry/normals agree within 0.00002 and visibility matches; the original live car remains unchanged. A targeted high-damage fixture explicitly resets health before one impact to ensure detachment coverage; it is not a natural-damage balance test.
- Browser recorded a 24-car derby: 99 frames across 5.27 seconds, 44 visual events, 22 props. The exported gzip file decoded successfully and reopened through the final menu control after page reload. This verifies file persistence independently of the in-memory recording.
- Browser verified rewind to zero, slow playback, camera selection, FOV/exposure/roll, square crop, thirds guide, and return to the paused event with the same 00:54 time remaining, seven points and 93% car condition.
- Exported 720×720 PNG was opened and visually inspected: it contains the game scene with no UI or crop guides. No browser console errors were observed in the final imported replay.
- File-picker validation exposed a detached-input issue; the input now remains attached until selection/cancellation completes. A disconnected SSH preview tunnel was restored without restarting the existing server.

## Implementation and bounds

Frames sample at up to 20 Hz. Recording stops at 30 minutes, 192 MiB of frame data or 50,000 visual events, whichever is reached first. The UI identifies truncated recordings. Import caps compressed files at64 MiB and streamed decompression at224 MiB, validates counts, times, finite values and quaternion norms, and rejects incompatible prop counts. File version is QIR1 and is tied to the current quarry/car definitions; cross-version asset compatibility is not promised.

Independent vehicle/prop copies render playback with disabled physics bodies. Original vehicles and the paused event are retained. Impact events record the rendered transform used by damage, including when it differs from the latest physics pose. Backward seeking rebuilds damage from the beginning; forward seeking applies only newly reached events. Wheels preserve continuous spin values, and reset epochs prevent interpolation across respawns/recovery.

## Remaining limits

Online recording is not implemented. Replay omits transient particle trajectories, fire animation, detached debris trajectories, ground evidence and audio. Attached-body damage, removed-part visibility, repairs, coating and soot are retained. Photo mode can capture the frozen live effects. No depth-of-field, independent high-resolution renderer, video export, persistent replay library or long-recording seek optimization is claimed. Full-duration memory/performance and extended 24-car recording benchmarks remain open; the short UI test is not a VENGEANCE GPU benchmark.

Three vehicles and one location remain. Larger content variety, multiplayer capacity/cups/discovery, layered liveries, structural physics and PC peripheral support are still part of the full parity roadmap.

## Installation record

Candidate bundle: `index-ERuonI5g.js`; CSS: `index-BalRGIIG.css`. Install uses baseline6419bf7 hashes, records each changed/new file, preserves recoverable prior sources and dist index under `outputs/parity/replay-20261001`, copies hashed assets first and swaps the index last. Finalization also checks the initially installed hashes before applying the recording-limit correction, retains the initial manifest/index, and reruns all installed tests. Original public website is not republished by this milestone. Consult the backup manifest and installed-tests.log for the completed installation evidence.
