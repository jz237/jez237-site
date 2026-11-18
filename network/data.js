/* ===================================================================
   data.js — Home network topology + behavior data for the map.
   Generated from an OpenClaw LAN scan on 2026-07-06 (74 responding
   devices; noisy IoT categories grouped so the public map stays
   readable). This file is published on the public site, so it carries
   no real addressing: MAC addresses are omitted, every "ip" is a
   made-up placeholder (10.0.0.x in listing order), and labels/notes
   must not contain real addresses, address fragments or hardware IDs.

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
    { "id": "router", "type": "router", "label": "Gateway", "tier": 1, "ip": "10.0.0.1", "linkMbps": 1000, "notes": "Default gateway; DHCP/client telemetry source" },

    { "id": "poe-switch", "type": "switch", "label": "PoE Switch", "tier": 2, "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "ip": "10.0.0.2", "notes": "PoE switch; exact downstream ports not exposed by router" },
    { "id": "managed-switch", "type": "switch", "label": "Managed Switch", "tier": 2, "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "ip": "10.0.0.3", "notes": "Identified from scan clues; downstream ports inferred" },
    { "id": "net-admin", "type": "switch", "label": "Network Admin Device", "tier": 2, "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "ip": "10.0.0.4", "notes": "Local web/admin page; role likely switch/infrastructure" },
    { "id": "extender", "type": "ap", "label": "Wi-Fi Extender", "tier": 2, "cluster": "mobile", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "ip": "10.0.0.5", "notes": "Wi-Fi extender; its telemetry reports under two addresses" },

    { "id": "openclaw-evo-x2", "type": "server", "label": "OpenClaw host / EVO X2", "cluster": "lab", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "server", "ip": "10.0.0.6", "notes": "Fresh scan source host; also has a Wi-Fi interface" },
    { "id": "vengeance", "type": "workstation", "label": "VENGEANCE", "cluster": "lab", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "workstation", "ip": "10.0.0.7", "notes": "Windows RTX workstation" },
    { "id": "spark", "type": "server", "label": "Spark", "cluster": "lab", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "server", "ip": "10.0.0.8", "notes": "Local AI/Ollama host" },
    { "id": "hermes", "type": "server", "label": "Hermes computer", "cluster": "lab", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "server", "ip": "10.0.0.9", "notes": "Linux/mini-PC/SSH host" },
    { "id": "jez-pc", "type": "workstation", "label": "Jez-PC", "cluster": "lab", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "workstation", "ip": "10.0.0.10", "notes": "Windows/media PC" },
    { "id": "camera-laptop", "type": "laptop", "label": "CAMERA-LAPTOP", "cluster": "lab", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "workstation", "ip": "10.0.0.11", "notes": "Laptop, likely camera-related" },
    { "id": "predator-laptop", "type": "laptop", "label": "Predator-Laptop", "cluster": "mobile", "uplink": "router", "media": "wifi", "linkMbps": 144, "profile": "workstation", "ip": "10.0.0.12", "notes": "2.4 GHz Wi-Fi, signal -20 dBm" },

    { "id": "qnap-tvs-882", "type": "nas", "label": "TVS-882 NAS (Plex + Tautulli)", "cluster": "media", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "nas", "ip": "10.0.0.13", "notes": "QNAP NAS/storage server" },
    { "id": "qnap-ts-673a", "type": "nas", "label": "TS-673A", "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "nas", "ip": "10.0.0.14", "notes": "QNAP NAS/storage server" },
    { "id": "wdmycloud", "type": "nas", "label": "WDMyCloudEX4100", "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "nas", "ip": "10.0.0.15", "notes": "Western Digital My Cloud NAS" },
    { "id": "hdhomerun-a", "type": "tv", "label": "HDHomeRun tuner A", "cluster": "media", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "streamer", "ip": "10.0.0.16", "notes": "SiliconDust HDHomeRun TV tuner/DVR" },
    { "id": "hdhomerun-b", "type": "tv", "label": "HDHomeRun tuner B", "cluster": "media", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "streamer", "ip": "10.0.0.17", "notes": "SiliconDust HDHomeRun TV tuner/DVR" },
    { "id": "living-room-media-pc", "type": "workstation", "label": "Living-Room-Media-PC", "cluster": "media", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "streamer", "ip": "10.0.0.18", "notes": "Windows/media PC" },
    { "id": "denon-avr", "type": "speaker", "label": "Denon AVR-X4500H", "cluster": "media", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "speaker", "ip": "10.0.0.19", "notes": "Denon AV receiver" },
    { "id": "ampak-media", "type": "tv", "label": "AMPAK media device", "cluster": "media", "uplink": "router", "media": "wifi", "linkMbps": 65, "profile": "streamer", "ip": "10.0.0.20", "notes": "Streaming/TV dongle or embedded Wi-Fi media device; 2.4 GHz" },

    { "id": "jez-phone", "type": "phone", "label": "Jez mobile device", "cluster": "mobile", "uplink": "router", "media": "wifi", "linkMbps": 1361, "profile": "phone", "ip": "10.0.0.21", "notes": "5 GHz Wi-Fi, signal -61 dBm" },
    { "id": "s25-ultra", "type": "phone", "label": "jeff-s-S25-Ultra", "cluster": "mobile", "uplink": "extender", "media": "wifi", "linkMbps": 816, "profile": "phone", "ip": "10.0.0.22", "notes": "Extender client, 5 GHz Wi-Fi" },
    { "id": "tab-s8", "type": "tablet", "label": "jeff-s-Tab-S8", "cluster": "mobile", "uplink": "router", "media": "wifi", "linkMbps": 400, "profile": "tablet", "ip": "10.0.0.23", "notes": "Router-reported personal tablet; current router cache labels it wired, report classifies as phone/tablet" },

    { "id": "geovision-cams", "type": "camera", "label": "GeoVision cameras x5", "cluster": "iot", "uplink": "poe-switch", "media": "ethernet", "linkMbps": 1000, "profile": "camera", "ip": "10.0.0.24", "notes": "Grouped wired GeoVision devices" },
    { "id": "ring-devices", "type": "camera", "label": "Ring devices x9", "cluster": "iot", "uplink": "extender", "media": "wifi", "linkMbps": 130, "profile": "camera", "ip": "10.0.0.25", "notes": "Grouped Ring doorbell/cameras/chime; some associate through extender, some through router" },
    { "id": "wiz-lights", "type": "plug", "label": "WiZ lights x12", "cluster": "iot", "uplink": "router", "media": "wifi", "linkMbps": 72, "profile": "iot-sensor", "ip": "10.0.0.26", "notes": "Grouped WiZ smart lighting devices; report classifies as wireless despite router cache showing some as wired" },
    { "id": "amazon-iot", "type": "speaker", "label": "Amazon/Echo devices x5", "cluster": "iot", "uplink": "extender", "media": "wifi", "linkMbps": 130, "profile": "speaker", "ip": "10.0.0.27", "notes": "AmazonPlug26MR, Echo Show, AmazonAQM, and other Amazon smart-home/media clients" },
    { "id": "lutron-bridge", "type": "plug", "label": "Lutron bridge", "cluster": "iot", "uplink": "router", "media": "ethernet", "linkMbps": 100, "profile": "iot-sensor", "ip": "10.0.0.28", "notes": "Lutron smart lighting/bridge device" },
    { "id": "airthings-hub", "type": "plug", "label": "airthings-hub", "cluster": "iot", "uplink": "router", "media": "ethernet", "linkMbps": 100, "profile": "iot-sensor", "ip": "10.0.0.29", "notes": "Indoor air-quality/radon monitor hub" },
    { "id": "sleep-number", "type": "plug", "label": "Sleep Number bed", "cluster": "iot", "uplink": "router", "media": "wifi", "linkMbps": 72, "profile": "iot-sensor", "ip": "10.0.0.30", "notes": "Sleep Number / Select Comfort bed controller" },
    { "id": "myq", "type": "plug", "label": "Chamberlain myQ", "cluster": "iot", "uplink": "extender", "media": "wifi", "linkMbps": 72, "profile": "iot-sensor", "ip": "10.0.0.31", "notes": "Garage door opener/controller" },
    { "id": "switchbot-hub", "type": "plug", "label": "SwitchBot Hub Mini", "cluster": "iot", "uplink": "router", "media": "wifi", "linkMbps": 65, "profile": "iot-sensor", "ip": "10.0.0.32", "notes": "2.4 GHz Wi-Fi, signal -53 dBm" },
    { "id": "tesla-wall", "type": "plug", "label": "Tesla Wall Connector", "cluster": "iot", "uplink": "extender", "media": "wifi", "linkMbps": 54, "profile": "iot-sensor", "ip": "10.0.0.33", "notes": "EV charger, extender client" },
    { "id": "govee-devices", "type": "plug", "label": "Govee devices x3", "cluster": "iot", "uplink": "extender", "media": "wifi", "linkMbps": 72, "profile": "iot-sensor", "ip": "10.0.0.34", "notes": "Grouped Govee / Intellirocks smart-home devices" },

    { "id": "epson-printer", "type": "printer", "label": "Epson printer", "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 100, "profile": "printer", "ip": "10.0.0.35", "notes": "Epson printer" },
    { "id": "brother-printer", "type": "printer", "label": "Brother network printer", "cluster": "iot", "uplink": "extender", "media": "wifi", "linkMbps": 72, "profile": "printer", "ip": "10.0.0.36", "notes": "2.4 GHz Wi-Fi" },
    { "id": "unknown-wired", "type": "server", "label": "Unknown wired devices x3", "cluster": "core", "uplink": "router", "media": "ethernet", "linkMbps": 1000, "profile": "server", "ip": "10.0.0.37", "notes": "Grouped unlabeled wired devices, plus one Netgear/unknown admin-class device if not infrastructure" },
    { "id": "unknown-wifi", "type": "phone", "label": "Unknown Wi-Fi clients x7", "cluster": "mobile", "uplink": "router", "media": "wifi", "linkMbps": 286, "profile": "phone", "ip": "10.0.0.38", "notes": "Grouped unlabeled wireless/Linux/wlan0 clients and extender-only unknowns" }
  ],
  "profileOverrides": {
    "camera": { "base": { "rx": 30, "tx": 1800 } },
    "nas": { "base": { "rx": 200, "tx": 600 } },
    "iot-sensor": { "base": { "rx": 6, "tx": 12 } }
  }
};
