# Two-player online racing · v2.20.0

Choose **Race online · 2 players** from the racing menu, or open
[the online lobby](https://jez237.com/games/2026-09-10/after-the-storm/online.html).

1. The host chooses **Create invite** and sends the private invite link.
2. The friend opens it, chooses a rider, selects **Make return code**, and sends
   that code back to the host.
3. The host pastes the return code and selects **Connect players**. Once the
   connection is ready, the host chooses the course, class and water conditions
   in the game, then starts. Both players can pause or resume.

Each device renders its own full view with the detailed craft, riders and water.
The guest uses their own normal Player 1 keyboard/gamepad/touch bindings to drive
Player 2. Camera, graphics, sound and rumble remain local preferences. Existing
local split-screen and separate-window play remain available. Dolphin Park
provides online two-player Free Ride with its existing ramps, rings and tricks.

The host's existing simulation owns both riders, collisions, water, buoy judging,
laps and results. The guest supplies bounded controls for Player 2 and receives
display snapshots; it cannot supply Player 1 input, positions or race progress.
Both players wait while the guest loads the course. A stopped connection pauses
the race, releases held controls and keeps the host's existing state. A recovered
connection requires an explicit resume. A fresh invitation can reconnect to a
paused host race. Refreshing or closing the host game ends that race.

Connections use WebRTC data channels and the public
[Cloudflare STUN service](https://developers.cloudflare.com/realtime/turn/faq/).
Cloudflare documents that STUN service as free and unlimited. No game server,
Durable Object, database, account, paid TURN relay or billing resource was added.
Some restrictive networks require a TURN relay and cannot connect in this
version. The lobby explains a failed direct connection and permits another
network or a fresh invite. This is private invitation play.

[WebRTC encrypts data channels](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels).
The invitation carries the peer connection description in its URL fragment,
which is not sent to the static site server. The peer receives connection
information as part of establishing direct play. Return codes are bound to the
original invitation, build and session, expire after two hours, and are not
saved or logged by the game. No microphone or camera is requested.

Snapshots preserve signed16 water heights, Float32 local water and physical rider
targets. The bounded binary codec avoids JSON-expanding the water grid, gzip
compresses packets, and fragments messages below16KiB payloads. Active capture is
bounded to20Hz and one in-flight snapshot; congestion skips obsolete snapshots.
Paused/results views use a1Hz keepalive, with immediate pause/resume updates.
Interpolation is presentation only. Input becomes neutral after250ms without a
fresh sequence. Reassembly, decompression, object depth, allocation sizes, roles,
generations and commands are bounded before display or use.

Online versus results use the two-player result display. They are excluded from
the worldwide solo leaderboards, local solo records, ghosts and championship
unlocks by the existing versus-mode rules. Global scoring remains available for
eligible solo events.

Validation and remaining compatibility observations are recorded in
[RACEWAVE-PARITY.md](RACEWAVE-PARITY.md). Online play is an additional feature;
it does not establish full original-game gameplay parity.
