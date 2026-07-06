# Collecting real topology with OpenClaw

`data.js` ships with a placeholder network. To map the real one, give the
prompt below to OpenClaw (or any agent with router access), then paste its
JSON output back into `data.js` as `window.NETMAP_DATA = { ... };`.

> **Privacy note:** `data.js` is published on the public site. MAC
> addresses are omitted from the map entirely — don't add them. Consider
> renaming devices you'd rather not advertise and skipping anything
> sensitive in `notes`. Private-range IPs (192.168.x.x / 10.x.x.x) reveal
> nothing on their own, but device names can.

---

## Prompt for OpenClaw

```
Read my router's connected-client information (DHCP leases, ARP table,
and wireless client lists — whatever the router exposes) plus any managed
switch/AP info you can see, and produce a home network topology as strict
JSON, no commentary, matching this schema:

{
  "meta": { "name": "Home Network", "seed": 237 },
  "clusters": {
    // 3-5 districts grouping the devices, e.g.:
    // "wired": { "label": "Office / Wired", "angle": 205, "color": "leaf" },
    // "wireless": { "label": "Wireless", "angle": 335, "color": "blue" },
    // "media": { "label": "Media", "angle": 15, "color": "pink" },
    // "iot": { "label": "IoT", "angle": 155, "color": "gold" }
    // angle = degrees around the router (0 = east, counterclockwise,
    // avoid 60-120 which is where the internet uplink sits);
    // color = one of: blue, leaf, pink, gold
  },
  "nodes": [
    // exactly one internet node and one router node first:
    { "id": "internet", "type": "internet", "label": "Internet", "tier": 0,
      "notes": "<ISP name and plan speed if known>" },
    { "id": "router", "type": "router", "label": "<router name>", "tier": 1,
      "ip": "<lan ip>", "model": "<model>",
      "linkMbps": 1000 },
    // then one node per switch/AP with "tier": 2, and one per device:
    { "id": "<short-stable-id>",
      "type": "<one of: switch | ap | nas | server | workstation | laptop |
               phone | tablet | tv | console | printer | camera | speaker |
               plug | thermostat>",
      "label": "<friendly name>",
      "cluster": "<cluster key>",
      "uplink": "<id of the switch/AP/router it connects through>",
      "media": "<ethernet | wifi>",
      "linkMbps": <negotiated or nominal link speed, number>,
      "ip": "<ip>",
      "notes": "<optional>",
      "profile": "<optional traffic profile: workstation | server | nas |
                  streamer | phone | tablet | console | speaker | camera |
                  iot-sensor | printer — pick whatever best matches how the
                  device behaves; omit to infer from type>" }
  ],
  "profileOverrides": {}
}

Rules:
- ids: lowercase, stable, no spaces (e.g. "nas", "cam-frontdoor").
- Wired devices behind a dumb switch you can't see: uplink them to the
  router and note the guess.
- Group similar IoT gadgets (e.g. smart plugs) into one node with a
  "×N" label if there are many.
- Do NOT include MAC addresses — the public map omits them.
- If the router reports live per-client traffic, add a one-line summary
  per busy device in "notes" so traffic profiles can be tuned.
```

---

## Wiring it in

1. Replace the object in `network/data.js` with the JSON (keep the
   `window.NETMAP_DATA =` prefix and the trailing `;`).
2. Open `/network/` locally and sanity-check the layout; adjust cluster
   `angle`s if districts crowd each other.
3. Tune per-device behavior with `profile` or `profileOverrides` (see
   `PROFILES` in `traffic-sim.js`).

For *live* traffic instead of simulation, see the adapter contract at the
top of `traffic-sim.js` — OpenClaw could also run a tiny exporter that
serves that sample shape from your LAN (the exporter's origin must then be
added to `connect-src` in `/_headers`).
