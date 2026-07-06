# Live mode (owner-only)

The public map at jez237.com/network/ always runs the **simulation**.
Live mode exists so *you* can watch real traffic on your own LAN — it is
deliberately impossible on the deployed site.

## Why live data must stay off the public site

Real-time per-device rates are an occupancy sensor: they show when the
house is asleep, empty, or active, which cameras are streaming, and when
the EV is charging. So:

- **Never** add an exporter origin to `connect-src` in `/_headers`.
  The production CSP blocking all outside fetches is the safety net
  that keeps `?adapter=live&src=...` inert on jez237.com.
- **Never** port-forward the exporter or give it a public DNS name.
- Bind it to a LAN address only (the default is localhost).

## How to run it

1. Start the exporter on a machine that can see traffic stats
   (the OpenClaw host is ideal):

   ```bash
   python3 network/exporter/netmap-exporter.py --bind 192.168.1.68 --port 8321
   ```

2. Serve the site locally from the repo root:

   ```bash
   python3 -m http.server 8000
   ```

3. Open live mode in a browser on the LAN:

   ```
   http://localhost:8000/network/?adapter=live&src=http://192.168.1.68:8321/sample.json
   ```

   The HUD badge switches from SIMULATED to LIVE (or "LIVE · offline"
   while the exporter is unreachable). The day scrubber hides in live
   mode — there is no synthetic clock to scrub.

## Feeding it real numbers

`collect()` in `netmap-exporter.py` ships as a stub returning zeros.
Replace it with real telemetry — the payload contract is documented at
the top of `network/live-adapter.js`. Good sources on this network:

- Router client list (per-client byte counters → diff into rates)
- Extender telemetry for extender-attached clients
- SNMP `ifTable` on the PoE/managed switches for wired ports
- conntrack/netflow on any Linux box for per-connection detail

The device ids in the payload must match `network/data.js`. The fastest
path: ask OpenClaw to implement `collect()` from the router telemetry it
already reads — hand it the exporter file and the contract comment in
`live-adapter.js`.
