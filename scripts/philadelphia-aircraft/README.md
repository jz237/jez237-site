# Philadelphia aircraft home relay

Experimental, free hobby relay for the Philadelphia diorama. Requires Node 20+
and the official Windows cloudflared executable. Installation is a private copy
under `%LOCALAPPDATA%\PhiladelphiaReliefAircraft`, not a web-served directory.

`run.mjs` binds only to `127.0.0.1:8937`, starts a free Quick Tunnel, and registers
the tunnel with `workers/philly-aircraft-relay`. If cloudflared exits it restarts
after 30 seconds. Quick Tunnels have no uptime guarantee. Nothing opens router
ports, exposes files, or changes the computer's firewall.

The private `config.json` contains `token` (at least 32 random characters), `port`
(8937), `gateway` (`https://philly-aircraft-relay.jez237.workers.dev`), and `node`
(absolute node.exe path). The same token is installed as gateway secret `RELAY_KEY`
and Pages secret `AIRCRAFT_RELAY_KEY`. Restrict the local directory to the owner
and SYSTEM; never commit its configuration or credentials. Gateway registration
and aircraft requests both require the secret. Redirects are rejected.

Use the **Start Philadelphia Aircraft** shortcut to launch it invisibly, and
**Stop Philadelphia Aircraft** to stop the helper and tunnel. Installation may
also add the start shortcut to the current user's Windows Startup folder. Stop
lasts until manually started or the next sign-in; remove the Startup shortcut
to disable automatic startup. The relay does not prevent Windows from sleeping.

Only `/health`, `/aircraft` and `/ships` exist; all need authentication. The aircraft route
has one hardcoded provider and region, rejects query strings and non-GET methods,
caps responses at 1 MiB, checks timestamps, strips unrelated fields, merges
concurrent requests and caches successful reports for 15 seconds. It contacts
the provider only in response to an aircraft request. Failures back off 30 seconds,
rate limits at least 5 minutes (honoring a numeric Retry-After up to 24 hours),
and access denials one hour. There is no IP rotation or provider fallback.

The gateway verifies the helper's authenticated health endpoint before storing
its `https://*.trycloudflare.com` address in KV. KV address changes can take a
minute to propagate after a restart. It forwards only the fixed aircraft and ship paths.
The Pages endpoint performs the final geographic validation and normalization.
If the helper, tunnel or provider is offline the map displays an unavailable
message and eventually removes stale aircraft.

`status.json` reports idle/running state and the last provider request status;
`relay.log` contains bounded operational messages without visitor data or tokens.
Stopping the relay leaves the rest of the map operational. To remove the feature,
stop the helper, remove its shortcuts and private installation, remove the Pages
secret, and remove the dedicated gateway Worker and KV namespace. Removing only
the Pages secret reverts to direct provider requests, which may still be blocked.

Tests: `node --test demos/philadelphia-relief/tests/aircraft-relay.test.js`.

## Optional ship feed

Install the standard `ws` package beside the private helper and add an `aisKey`
field to its private `config.json`. Obtain the free key from AISStream; never put
it in browser code, logs or the repository. The same authenticated gateway and
Pages secret protect the ship route. The existing Start/Stop shortcuts manage
both feeds.

A ship request opens one shared AISStream WebSocket for the fixed map region.
It closes after 75 seconds without a request. The client polls every 30 seconds
only while enabled and visible. Reports expire after ten minutes; positions older
than two minutes are marked stale. Destination text is crew-entered and may be old.
The key stays on this computer. Ships require the computer and helper to be running.

Aircraft automatically uncheck after 30 minutes per activation. A wall-clock check
also expires a suspended browser tab before it requests or displays more aircraft.
Checking the box again starts a new 30-minute session.
