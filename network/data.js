/* ===================================================================
   data.js — Home network topology + behavior data for the map.
   Edit this file to make the map match your real network.

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
     ip/mac/model/notes  inspector metadata (placeholders are fine)
     profile  traffic behavior key from traffic-sim.js PROFILES
              (defaults from type); override rates per device via
              profileOverrides below.
   =================================================================== */

window.NETMAP_DATA = {
  meta: { name: "Home Network", seed: 237 },

  // Radial districts around the router core. angle = degrees (0 = east,
  // counterclockwise); color = workbench palette key (blue|leaf|pink|gold).
  clusters: {
    wired:    { label: "Office / Wired", angle: 205, color: "leaf" },
    wireless: { label: "Wireless",       angle: 335, color: "blue" },
    media:    { label: "Media",          angle: 15,  color: "pink" },
    iot:      { label: "IoT",            angle: 155, color: "gold" }
  },

  nodes: [
    { id: "internet", type: "internet", label: "Internet", tier: 0,
      notes: "ISP uplink — fiber, 1 Gbps down / 500 Mbps up" },

    { id: "router", type: "router", label: "Gateway", tier: 1,
      ip: "192.168.1.1", mac: "AA:BB:CC:00:00:01", model: "Edge Router",
      linkMbps: 1000, notes: "DHCP, DNS, and firewall for the whole house" },

    /* --- infrastructure --- */
    { id: "sw1", type: "switch", label: "Office Switch", tier: 2,
      cluster: "wired", uplink: "router", media: "ethernet", linkMbps: 1000,
      ip: "192.168.1.2", mac: "AA:BB:CC:00:00:02", model: "8-port gigabit" },

    { id: "ap1", type: "ap", label: "Living Room AP", tier: 2,
      cluster: "wireless", uplink: "router", media: "ethernet", linkMbps: 1000,
      ip: "192.168.1.3", mac: "AA:BB:CC:00:00:03", model: "Wi-Fi 6 AP" },

    { id: "ap2", type: "ap", label: "Upstairs AP", tier: 2,
      cluster: "iot", uplink: "router", media: "ethernet", linkMbps: 1000,
      ip: "192.168.1.4", mac: "AA:BB:CC:00:00:04", model: "Wi-Fi 6 AP" },

    /* --- office / wired --- */
    { id: "nas", type: "nas", label: "NAS", cluster: "wired", uplink: "sw1",
      media: "ethernet", linkMbps: 1000, profile: "nas",
      ip: "192.168.1.20", mac: "AA:BB:CC:00:00:20",
      notes: "Nightly backups 01:00–03:00" },

    { id: "workstation", type: "workstation", label: "Workstation",
      cluster: "wired", uplink: "sw1", media: "ethernet", linkMbps: 1000,
      profile: "workstation", ip: "192.168.1.21", mac: "AA:BB:CC:00:00:21",
      notes: "Main desk machine" },

    { id: "homeserver", type: "server", label: "Home Server",
      cluster: "wired", uplink: "sw1", media: "ethernet", linkMbps: 1000,
      profile: "server", ip: "192.168.1.22", mac: "AA:BB:CC:00:00:22",
      notes: "Containers, media indexer, agents" },

    { id: "printer", type: "printer", label: "Printer",
      cluster: "wired", uplink: "sw1", media: "ethernet", linkMbps: 100,
      profile: "printer", ip: "192.168.1.23", mac: "AA:BB:CC:00:00:23" },

    /* --- wireless --- */
    { id: "laptop1", type: "laptop", label: "Laptop",
      cluster: "wireless", uplink: "ap1", media: "wifi", linkMbps: 600,
      profile: "workstation", ip: "192.168.1.40", mac: "AA:BB:CC:00:00:40" },

    { id: "phone1", type: "phone", label: "Phone (Jez)",
      cluster: "wireless", uplink: "ap1", media: "wifi", linkMbps: 400,
      profile: "phone", ip: "192.168.1.41", mac: "AA:BB:CC:00:00:41" },

    { id: "phone2", type: "phone", label: "Phone (Guest)",
      cluster: "wireless", uplink: "ap1", media: "wifi", linkMbps: 400,
      profile: "phone", ip: "192.168.1.42", mac: "AA:BB:CC:00:00:42" },

    { id: "tablet", type: "tablet", label: "Tablet",
      cluster: "wireless", uplink: "ap1", media: "wifi", linkMbps: 400,
      profile: "tablet", ip: "192.168.1.43", mac: "AA:BB:CC:00:00:43" },

    /* --- media --- */
    { id: "tv", type: "tv", label: "Living Room TV",
      cluster: "media", uplink: "ap1", media: "wifi", linkMbps: 300,
      profile: "streamer", ip: "192.168.1.30", mac: "AA:BB:CC:00:00:30" },

    { id: "console", type: "console", label: "Game Console",
      cluster: "media", uplink: "router", media: "ethernet", linkMbps: 1000,
      profile: "console", ip: "192.168.1.31", mac: "AA:BB:CC:00:00:31" },

    { id: "speaker", type: "speaker", label: "Kitchen Speaker",
      cluster: "media", uplink: "ap1", media: "wifi", linkMbps: 150,
      profile: "speaker", ip: "192.168.1.32", mac: "AA:BB:CC:00:00:32" },

    /* --- iot --- */
    { id: "cam1", type: "camera", label: "Front Door Cam",
      cluster: "iot", uplink: "ap2", media: "wifi", linkMbps: 150,
      profile: "camera", ip: "192.168.1.60", mac: "AA:BB:CC:00:00:60" },

    { id: "cam2", type: "camera", label: "Backyard Cam",
      cluster: "iot", uplink: "ap2", media: "wifi", linkMbps: 150,
      profile: "camera", ip: "192.168.1.61", mac: "AA:BB:CC:00:00:61" },

    { id: "thermostat", type: "thermostat", label: "Thermostat",
      cluster: "iot", uplink: "ap2", media: "wifi", linkMbps: 72,
      profile: "iot-sensor", ip: "192.168.1.62", mac: "AA:BB:CC:00:00:62" },

    { id: "plug1", type: "plug", label: "Smart Plugs ×4",
      cluster: "iot", uplink: "ap2", media: "wifi", linkMbps: 72,
      profile: "iot-sensor", ip: "192.168.1.63", mac: "AA:BB:CC:00:00:63",
      notes: "Grouped: lamp, heater, grow light, fan" }
  ],

  // Optional per-site tweaks of the built-in behavior profiles, merged
  // shallowly over traffic-sim.js PROFILES. Example:
  //   profileOverrides: { nas: { base: { rx: 40, tx: 900 } } }
  profileOverrides: {}
};
