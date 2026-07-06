/* ===================================================================
   data.js — Home network topology + behavior data for the map.
   Generated from an OpenClaw LAN scan on 2026-07-06 (74 responding
   devices; noisy IoT categories grouped so the public map stays
   readable). MAC addresses are intentionally omitted — this file is
   published on the public site.

   Node fields:
     id       (required) stable unique key
     type     icon + default behavior profile: internet | router | switch |
              ap | nas | server | workstation | laptop | phone | tablet |
              tv | console | printer | camera | speaker | plug | thermostat
     label    display name
     tier     0 = internet, 1 = router, 2 = infrastructure (switch/AP);
              leaf devices may omit it (inferred as 3)
     cluster  which district the node lives in (key of clusters below)
     uplink   id of the parent node — the uplink tree IS the link list
     media    "ethernet" (solid trace) | "wifi" (dashed trace)
     linkMbps nominal link speed, shown in the inspector
     ip/model/notes  inspector metadata
     profile  traffic behavior key from traffic-sim.js PROFILES
              (defaults from type); override rates per device via
              profileOverrides below.
   =================================================================== */

window.NETMAP_DATA = {
  "meta": {
    "name": "Jez Home Network",
    "seed": 237
  },
  "clusters": {
    "core": { "label": "Core / Wired", "angle": 205, "color": "leaf" },
    "lab": { "label": "AI Lab / Servers", "angle": 250, "color": "blue" },
    "media": { "label": "Media / AV", "angle": 15, "color": "pink" },
    "mobile": { "label": "Mobile Wi-Fi", "angle": 335, "color": "blue" },
    "iot": { "label": "IoT / Cameras", "angle": 155, "color": "gold" }
  },
  "nodes": [
    { "id": "internet", "type": "internet", "label": "Internet", "tier": 0, "notes": "ISP uplink; plan speed not reported by local scan" },
    { "id": "router", "type": "router", "label": "TP-Link Gateway", "tier": 1, "ip": "192.168.1.1", "model": "TP-Link router", "linkMbps": 1000, "notes": "Default gateway; DHCP/client telemetry source" },

    { "id": "gs308epp", "type": "switch", "label": "Netgear GS308EPP PoE switch", "tier": 2, "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "ip": "192.168.1.69", "model": "Netgear GS308EPP", "notes": "PoE switch; exact downstream ports not exposed by router" },
    { "id": "netgear-switch", "type": "switch", "label": "Netgear switch", "tier": 2, "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "ip": "192.168.1.24", "model": "Netgear GS510TLP/managed PoE switch (likely)", "notes": "Identified from scan clues; downstream ports inferred" },
    { "id": "netgear-admin", "type": "switch", "label": "Netgear admin device", "tier": 2, "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "ip": "192.168.1.149", "model": "Netgear", "notes": "Local web/admin page; role likely switch/infrastructure" },
    { "id": "re813xe", "type": "ap", "label": "TP-Link RE813XE extender", "tier": 2, "cluster": "mobile", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "ip": "192.168.1.79", "model": "TP-Link RE813XE Wi-Fi 6E range extender", "notes": "Extender telemetry also reports extenderIp 192.168.1.199; current scan sees 192.168.1.79" },

    { "id": "openclaw-evo-x2", "type": "server", "label": "OpenClaw host / EVO X2", "cluster": "lab", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "server", "ip": "192.168.1.68", "notes": "Fresh scan source host; also seen on Wi-Fi as evo-x2 at 192.168.1.211" },
    { "id": "vengeance", "type": "workstation", "label": "VENGEANCE", "cluster": "lab", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "workstation", "ip": "192.168.1.8", "notes": "Windows RTX workstation" },
    { "id": "spark", "type": "server", "label": "Spark / edgexpert-83a9", "cluster": "lab", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "server", "ip": "192.168.1.160", "notes": "Local AI/Ollama host" },
    { "id": "hermes", "type": "server", "label": "Hermes computer", "cluster": "lab", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "server", "ip": "192.168.1.150", "notes": "Linux/mini-PC/SSH host" },
    { "id": "jez-pc", "type": "workstation", "label": "Jez-PC", "cluster": "lab", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "workstation", "ip": "192.168.1.4", "notes": "Windows/media PC" },
    { "id": "camera-laptop", "type": "laptop", "label": "CAMERA-LAPTOP", "cluster": "lab", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "workstation", "ip": "192.168.1.144", "notes": "Laptop, likely camera-related" },
    { "id": "predator-laptop", "type": "laptop", "label": "Predator-Laptop", "cluster": "mobile", "uplink": "router", "media": "wifi", "linkMbps": 144, "profile": "workstation", "ip": "192.168.1.190", "notes": "2.4 GHz Wi-Fi, signal -20 dBm" },

    { "id": "qnap-tvs-882", "type": "nas", "label": "TVS-882 NAS (Plex + Tautulli)", "cluster": "media", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "nas", "ip": "192.168.1.191", "notes": "QNAP NAS/storage server" },
    { "id": "qnap-ts-673a", "type": "nas", "label": "TS-673A", "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "nas", "ip": "192.168.1.200", "notes": "QNAP NAS/storage server" },
    { "id": "wdmycloud", "type": "nas", "label": "WDMyCloudEX4100", "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "nas", "ip": "192.168.1.136", "notes": "Western Digital My Cloud NAS" },
    { "id": "hdhomerun-a", "type": "tv", "label": "HDHR-10A1F0DF", "cluster": "media", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "streamer", "ip": "192.168.1.21", "notes": "SiliconDust HDHomeRun TV tuner/DVR" },
    { "id": "hdhomerun-b", "type": "tv", "label": "HDHR-1072E696", "cluster": "media", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "streamer", "ip": "192.168.1.227", "notes": "SiliconDust HDHomeRun TV tuner/DVR" },
    { "id": "living-room-media-pc", "type": "workstation", "label": "Living-Room-Media-PC", "cluster": "media", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "streamer", "ip": "192.168.1.65", "notes": "Windows/media PC" },
    { "id": "denon-avr", "type": "speaker", "label": "Denon AVR-X4500H", "cluster": "media", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "speaker", "ip": "192.168.1.77", "notes": "Denon AV receiver" },
    { "id": "ampak-media", "type": "tv", "label": "AMPAK media device", "cluster": "media", "uplink": "router", "media": "wifi", "linkMbps": 65, "profile": "streamer", "ip": "192.168.1.229", "notes": "Streaming/TV dongle or embedded Wi-Fi media device; 2.4 GHz" },

    { "id": "jez-phone", "type": "phone", "label": "Jez mobile device", "cluster": "mobile", "uplink": "router", "media": "wifi", "linkMbps": 1361, "profile": "phone", "ip": "192.168.1.155", "notes": "5 GHz Wi-Fi, signal -61 dBm" },
    { "id": "s25-ultra", "type": "phone", "label": "jeff-s-S25-Ultra", "cluster": "mobile", "uplink": "re813xe", "media": "wifi", "linkMbps": 816, "profile": "phone", "ip": "192.168.1.108", "notes": "Extender client, 5 GHz Wi-Fi" },
    { "id": "tab-s8", "type": "tablet", "label": "jeff-s-Tab-S8", "cluster": "mobile", "uplink": "router", "media": "wifi", "linkMbps": 400, "profile": "tablet", "ip": "192.168.1.158", "notes": "Router-reported personal tablet; current router cache labels it wired, report classifies as phone/tablet" },

    { "id": "geovision-cams", "type": "camera", "label": "GeoVision cameras x5", "cluster": "iot", "uplink": "gs308epp", "media": "ethernet", "linkMbps": 1000, "profile": "camera", "ip": "192.168.1.103", "notes": "Grouped wired GeoVision devices: .103, .104, .105, .112, .223" },
    { "id": "ring-devices", "type": "camera", "label": "Ring devices x9", "cluster": "iot", "uplink": "re813xe", "media": "wifi", "linkMbps": 130, "profile": "camera", "ip": "192.168.1.9", "notes": "Grouped Ring doorbell/cameras/chime; some associate through extender, some through router" },
    { "id": "wiz-lights", "type": "plug", "label": "WiZ lights x12", "cluster": "iot", "uplink": "router", "media": "wifi", "linkMbps": 72, "profile": "iot-sensor", "ip": "192.168.1.57", "notes": "Grouped WiZ smart lighting devices; report classifies as wireless despite router cache showing some as wired" },
    { "id": "amazon-iot", "type": "speaker", "label": "Amazon/Echo devices x5", "cluster": "iot", "uplink": "re813xe", "media": "wifi", "linkMbps": 130, "profile": "speaker", "ip": "192.168.1.35", "notes": "AmazonPlug26MR, Echo Show, AmazonAQM, and other Amazon smart-home/media clients" },
    { "id": "lutron-bridge", "type": "plug", "label": "Lutron bridge", "cluster": "iot", "uplink": "router", "media": "ethernet", "linkMbps": 100, "profile": "iot-sensor", "ip": "192.168.1.38", "notes": "Lutron smart lighting/bridge device" },
    { "id": "airthings-hub", "type": "plug", "label": "airthings-hub", "cluster": "iot", "uplink": "router", "media": "ethernet", "linkMbps": 100, "profile": "iot-sensor", "ip": "192.168.1.66", "notes": "Indoor air-quality/radon monitor hub" },
    { "id": "sleep-number", "type": "plug", "label": "Sleep Number bed", "cluster": "iot", "uplink": "router", "media": "wifi", "linkMbps": 72, "profile": "iot-sensor", "ip": "192.168.1.115", "notes": "Sleep Number / Select Comfort bed controller" },
    { "id": "myq", "type": "plug", "label": "Chamberlain myQ", "cluster": "iot", "uplink": "re813xe", "media": "wifi", "linkMbps": 72, "profile": "iot-sensor", "ip": "192.168.1.147", "notes": "Garage door opener/controller; extender cache also shows .157" },
    { "id": "switchbot-hub", "type": "plug", "label": "SwitchBot Hub Mini", "cluster": "iot", "uplink": "router", "media": "wifi", "linkMbps": 65, "profile": "iot-sensor", "ip": "192.168.1.75", "notes": "2.4 GHz Wi-Fi, signal -53 dBm" },
    { "id": "tesla-wall", "type": "plug", "label": "Tesla Wall Connector", "cluster": "iot", "uplink": "re813xe", "media": "wifi", "linkMbps": 54, "profile": "iot-sensor", "ip": "192.168.1.84", "notes": "EV charger, extender client" },
    { "id": "govee-devices", "type": "plug", "label": "Govee devices x3", "cluster": "iot", "uplink": "re813xe", "media": "wifi", "linkMbps": 72, "profile": "iot-sensor", "ip": "192.168.1.217", "notes": "Grouped Govee / Intellirocks smart-home devices observed around .217, .220, .250/.253" },

    { "id": "epson-printer", "type": "printer", "label": "EPSON257B2E", "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 100, "profile": "printer", "ip": "192.168.1.183", "notes": "Epson printer" },
    { "id": "brother-printer", "type": "printer", "label": "Brother network printer", "cluster": "iot", "uplink": "re813xe", "media": "wifi", "linkMbps": 72, "profile": "printer", "ip": "192.168.1.184", "notes": "2.4 GHz Wi-Fi; extender cache also shows .193" },
    { "id": "unknown-wired", "type": "server", "label": "Unknown wired devices x3", "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "server", "ip": "192.168.1.47", "notes": "Grouped unlabeled wired devices: .47, .210, plus one Netgear/unknown admin-class device if not infrastructure" },
    { "id": "unknown-wifi", "type": "phone", "label": "Unknown Wi-Fi clients x7", "cluster": "mobile", "uplink": "router", "media": "wifi", "linkMbps": 286, "profile": "phone", "ip": "192.168.1.11", "notes": "Grouped unlabeled wireless/Linux/wlan0 clients: .11, .60, .107, .137, .182, and extender-only unknowns" }
  ],
  "profileOverrides": {
    "camera": { "base": { "rx": 30, "tx": 1800 } },
    "nas": { "base": { "rx": 200, "tx": 600 } },
    "iot-sensor": { "base": { "rx": 6, "tx": 12 } }
  }
};
