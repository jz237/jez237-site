#!/usr/bin/env python3
"""Reference NetMap traffic exporter — OWNER-ONLY, LAN-ONLY.

Serves /sample.json in the shape the map's LiveAdapter expects
(see network/live-adapter.js for the full contract). Run it on a
machine that can see per-device traffic (the OpenClaw host is ideal),
then open the map locally in live mode:

    python3 netmap-exporter.py --bind 192.168.1.68 --port 8321
    # from the repo root, in another terminal:
    python3 -m http.server 8000
    # browse: http://localhost:8000/network/?adapter=live&src=http://192.168.1.68:8321/sample.json

SECURITY: never port-forward this, never put it behind a public DNS
name, and never add its origin to the public site's CSP. Real-time
rates reveal when the house is occupied, asleep, or empty.

The collect() function below ships with a placeholder that returns
zeros — replace it with real telemetry (router client stats, extender
telemetry, SNMP from the PoE switch, per-IP conntrack, etc.). OpenClaw
already knows how to read the router client list; asking it to fill
in collect() from that data is the fastest path.
"""

import argparse
import json
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

# Node ids must match network/data.js
DEVICE_IDS = [
    "router", "poe-switch", "managed-switch", "net-admin", "extender",
    "openclaw-evo-x2", "vengeance", "spark", "hermes", "jez-pc",
    "camera-laptop", "predator-laptop", "qnap-tvs-882", "qnap-ts-673a",
    "wdmycloud", "hdhomerun-a", "hdhomerun-b", "living-room-media-pc",
    "denon-avr", "ampak-media", "jez-phone", "s25-ultra", "tab-s8",
    "geovision-cams", "ring-devices", "wiz-lights", "amazon-iot",
    "lutron-bridge", "airthings-hub", "sleep-number", "myq",
    "switchbot-hub", "tesla-wall", "govee-devices", "epson-printer",
    "brother-printer", "unknown-wired", "unknown-wifi",
]


def collect():
    """Return {device_id: {rx, tx, online, status, classes, connections}}.

    Rates are kbps. This placeholder returns zeros — wire it to real
    telemetry. Useful sources on this network:
      - Router client list (per-client up/down counters; diff
        two reads to get a rate)
      - Extender telemetry for extender-attached clients
      - SNMP ifTable on the managed/PoE switches for wired ports
      - conntrack / netflow on a Linux box for per-connection detail
    """
    return {
        dev_id: {
            "rx": 0.0,
            "tx": 0.0,
            "online": True,
            "status": "online",
            "classes": {"browsing": 1},
            "connections": [],
        }
        for dev_id in DEVICE_IDS
    }


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.split("?")[0] != "/sample.json":
            self.send_error(404)
            return
        payload = json.dumps({
            "ts": int(time.time() * 1000),
            "devices": collect(),
            "events": [],
        }).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        # CORS: the map page is served from a different local origin
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, *_):
        pass  # keep the terminal quiet at 1 poll/second


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--bind", default="127.0.0.1",
                    help="LAN address to listen on (default 127.0.0.1; "
                         "use your LAN IP to reach it from other machines)")
    ap.add_argument("--port", type=int, default=8321)
    args = ap.parse_args()
    srv = ThreadingHTTPServer((args.bind, args.port), Handler)
    print(f"netmap exporter on http://{args.bind}:{args.port}/sample.json "
          f"(LAN only — do not expose)")
    srv.serve_forever()


if __name__ == "__main__":
    main()
