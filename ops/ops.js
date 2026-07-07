/* ops.js — renders the Operations & Statistics live modules from the
   same-origin snapshot at /api/ops-snapshot (Pages Function + KV, pushed
   from the home lab every ~10 minutes, pre-redacted at the source).

   Design rules:
   - schema-tolerant: a missing section or {status:"unavailable"} hides
     that module quietly; unknown keys are ignored; one bad renderer
     never takes down the page.
   - every remote string goes through esc().
   - statuses are always dot + word, never color alone.
   - last good snapshot is cached in localStorage for instant paint and
     an honest OFFLINE mode. */

(function () {
  "use strict";

  var URL_DEFAULT = "/api/ops-snapshot";
  var FETCH_TIMEOUT_MS = 8000;
  var REFRESH_MS = 180000; // 3 min; data cadence ~10 min, edge cache 60 s
  var TICK_MS = 30000;
  var LS_KEY = "opsSnapshot.v1";

  var srcOverride = null;
  try {
    srcOverride = new URLSearchParams(location.search).get("src");
  } catch (e) { /* ignore */ }
  var SNAPSHOT_URL = srcOverride || URL_DEFAULT;

  var state = {
    snap: null,
    source: null, // 'network' | 'cache'
    freshness: "loading", // loading|live|stale|warming|offline
    lastFetchAt: 0,
    inFlight: false,
  };

  // ------------------------------------------------------------ helpers

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function num(value, fallback) {
    return typeof value === "number" && isFinite(value) ? value : fallback;
  }

  function fmtPct(value) {
    var v = num(value, null);
    return v == null ? "—" : (Math.round(v * 10) / 10) + "%";
  }

  function fmtGB(value) {
    var v = num(value, null);
    if (v == null) return "—";
    return v >= 100 ? Math.round(v) + " GB" : (Math.round(v * 10) / 10) + " GB";
  }

  function fmtUptime(seconds) {
    var s = num(seconds, null);
    if (s == null) return "—";
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    if (d >= 1) return d + " d " + h + " h";
    var m = Math.floor((s % 3600) / 60);
    return h >= 1 ? h + " h " + m + " m" : m + " m";
  }

  function fmtDur(seconds) {
    var s = num(seconds, null);
    if (s == null) return "—";
    if (s < 90) return s + " s";
    var m = Math.floor(s / 60);
    if (m < 90) return m + " m " + String(s % 60).padStart(2, "0") + " s";
    return Math.round(m / 60) + " h";
  }

  function fmtRel(iso) {
    var t = Date.parse(iso || "");
    if (!isFinite(t)) return "—";
    var diff = Math.max(0, Date.now() - t);
    var min = Math.floor(diff / 60000);
    if (min < 1) return "just now";
    if (min < 60) return min + " min ago";
    var h = Math.floor(min / 60);
    if (h < 48) return h + " h ago";
    return Math.floor(h / 24) + " d ago";
  }

  function statusMeta(status) {
    switch (status) {
      case "active": return { cls: "is-ok", label: "Active" };
      case "idle": return { cls: "is-info", label: "Idle" };
      case "sleeping": return { cls: "is-dim", label: "Sleeping" };
      case "offline": return { cls: "is-err", label: "Offline" };
      case "ok": return { cls: "is-ok", label: "OK" };
      case "error": return { cls: "is-err", label: "Failed" };
      case "skipped": return { cls: "is-warn", label: "Skipped" };
      default: return { cls: "is-dim", label: "Unknown" };
    }
  }

  function thresholdCls(value, warnAt, errAt) {
    var v = num(value, null);
    if (v == null) return "";
    if (v >= errAt) return "is-err";
    if (v >= warnAt) return "is-warn";
    return "is-ok";
  }

  function sparkSVG(series, opts) {
    if (!Array.isArray(series)) return "";
    var pts = series.filter(function (v) { return typeof v === "number" && isFinite(v); });
    if (pts.length < 2) return "";
    var w = 100, h = 28;
    var min = opts && opts.min != null ? opts.min : Math.min.apply(null, pts);
    var max = opts && opts.max != null ? opts.max : Math.max.apply(null, pts);
    if (max - min < 1e-6) { max = min + 1; }
    var step = w / (pts.length - 1);
    var line = "";
    for (var i = 0; i < pts.length; i++) {
      var x = (i * step).toFixed(2);
      var y = (h - 2 - ((pts[i] - min) / (max - min)) * (h - 6)).toFixed(2);
      line += (i ? "L" : "M") + x + " " + y;
    }
    var area = line + "L" + w + " " + h + "L0 " + h + "Z";
    return '<svg class="om-spark" viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<path class="om-spark-area" d="' + area + '"></path>' +
      '<path class="om-spark-line" d="' + line + '"></path></svg>';
  }

  function meterHTML(pct, cls) {
    var v = Math.max(0, Math.min(100, num(pct, 0)));
    return '<i class="om-meter ' + (cls || "") + '"><b style="width:' + v + '%"></b></i>';
  }

  function dotWord(status) {
    var m = statusMeta(status);
    return '<span class="' + m.cls + '"><i class="om-dot"></i>' + m.label + "</span>";
  }

  function tsSpan(iso) {
    return '<span data-ts="' + esc(iso) + '">' + esc(fmtRel(iso)) + "</span>";
  }

  function sectionOK(data) {
    return data && typeof data === "object" && data.status !== "unavailable";
  }

  // ------------------------------------------------------------ renderers

  function renderPulse(el, _unused, snap) {
    var meta = snap.meta || {};
    var agents = sectionOK(snap.agents) ? snap.agents : null;
    var autos = sectionOK(snap.automations) ? snap.automations : null;
    var counts = (agents && agents.counts) || {};
    var total = num(counts.active, 0) + num(counts.idle, 0) + num(counts.sleeping, 0) + num(counts.offline, 0);
    var awake = num(counts.active, 0) + num(counts.idle, 0);
    var rate = autos && autos.stats ? autos.stats.success_rate_7d : null;

    el.innerHTML =
      '<div class="om-pulse" role="group" aria-label="Lab snapshot summary">' +
      '<span class="om-stat"><b>' + esc(fmtUptime(meta.uptime_seconds)) + "</b><i>uptime</i></span>" +
      (agents ? '<span class="om-stat"><b>' + awake + "<em>/" + total + '</em></b><i>agents awake</i></span>' : "") +
      (autos && autos.totals ? '<span class="om-stat"><b>' + num(autos.totals.enabled, 0) + "<em>/" + num(autos.totals.jobs, 0) + '</em></b><i>jobs enabled</i></span>' : "") +
      (rate != null ? '<span class="om-stat"><b>' + esc(fmtPct(rate)) + "</b><i>job success · 7d</i></span>" : "") +
      (autos && autos.stats ? '<span class="om-stat"><b>' + num(autos.stats.runs_24h, 0) + "</b><i>runs · 24h</i></span>" : "") +
      '<span class="om-badge" id="om-freshness">…</span>' +
      "</div>";
  }

  function renderSystem(el, sys, snap) {
    var meta = snap.meta || {};
    var hist = sys.history || {};
    var cpu = sys.cpu || {};
    var tiles = "";

    tiles += '<article class="om-tile"><div class="om-k">CPU <span class="om-v">' + esc(fmtPct(cpu.percent)) + "</span></div>" +
      sparkSVG(hist.cpu, { min: 0 }) +
      '<div class="om-sub">' + esc(cpu.model || "") + " · " + num(cpu.cores, "?") + "c/" + num(cpu.threads, "?") + "t</div></article>";

    var load = Array.isArray(sys.load_avg) ? sys.load_avg : [];
    tiles += '<article class="om-tile"><div class="om-k">Load <span class="om-v">' + esc(load.map(function (v) { return num(v, 0).toFixed(2); }).join(" / ") || "—") + "</span></div>" +
      sparkSVG(hist.load1, { min: 0 }) +
      '<div class="om-sub">1 / 5 / 15 min averages</div></article>';

    var ram = sys.ram || {};
    tiles += '<article class="om-tile"><div class="om-k">Memory <span class="om-v">' + esc(fmtPct(ram.percent)) + "</span></div>" +
      sparkSVG(hist.ram, { min: 0, max: 100 }) +
      '<div class="om-sub">' + esc(fmtGB(ram.used_gb)) + " of " + esc(fmtGB(ram.total_gb)) + " in use</div></article>";

    var disk = sys.disk || {};
    tiles += '<article class="om-tile"><div class="om-k">Disk <span class="om-v">' + esc(fmtPct(disk.percent)) + "</span></div>" +
      meterHTML(disk.percent, thresholdCls(disk.percent, 80, 92)) +
      '<div class="om-sub">' + esc(fmtGB(disk.free_gb)) + " free of " + esc(fmtGB(disk.total_gb)) + "</div></article>";

    var temps = sys.temps_c || {};
    var tempBits = [];
    if (temps.cpu != null) tempBits.push("CPU " + Math.round(temps.cpu) + "°");
    if (temps.gpu != null) tempBits.push("GPU " + Math.round(temps.gpu) + "°");
    if (temps.nvme != null) tempBits.push("NVMe " + Math.round(temps.nvme) + "°");
    if (temps.board != null) tempBits.push("board " + Math.round(temps.board) + "°");
    if (tempBits.length) {
      tiles += '<article class="om-tile"><div class="om-k">Temps <span class="om-v">' +
        (temps.cpu != null ? Math.round(temps.cpu) + "°C" : "—") + "</span></div>" +
        sparkSVG(hist.temp) +
        '<div class="om-sub">' + esc(tempBits.join(" · ")) + "</div></article>";
    }

    var swap = sys.swap || {};
    if (num(swap.total_gb, 0) > 0) {
      tiles += '<article class="om-tile"><div class="om-k">Swap <span class="om-v">' + esc(fmtPct(swap.percent)) + "</span></div>" +
        meterHTML(swap.percent, thresholdCls(swap.percent, 60, 85)) +
        '<div class="om-sub">' + esc(fmtGB(swap.used_gb)) + " of " + esc(fmtGB(swap.total_gb)) + "</div></article>";
    }

    el.innerHTML = '<div class="om-grid om-sys">' + tiles + "</div>" +
      '<div class="om-meta-line">' + esc(meta.os || "") + " · kernel " + esc(meta.kernel || "") +
      " · up " + esc(fmtUptime(meta.uptime_seconds)) +
      (meta.cadence_seconds ? " · snapshot every " + Math.round(meta.cadence_seconds / 60) + " min" : "") + "</div>";
  }

  function renderFleet(el, fleet) {
    var cards = (fleet.nodes || []).map(function (node) {
      var specs = "";
      if (node.cpu) specs += "<dt>CPU</dt><dd>" + esc(node.cpu) + "</dd>";
      if (node.gpu) specs += "<dt>GPU</dt><dd>" + esc(node.gpu) + "</dd>";
      if (node.ram_gb) specs += "<dt>RAM</dt><dd>" + esc(node.ram_gb) + " GB</dd>";
      if (node.os) specs += "<dt>OS</dt><dd>" + esc(node.os) + "</dd>";
      return '<article class="om-tile om-machine">' +
        '<div class="om-mach-head"><h3>' + esc(node.name) + "</h3>" +
        (node.this_box ? '<span class="om-chip is-info">reporting node</span>' : "") + "</div>" +
        '<div class="om-role">' + esc(node.role || "") + "</div>" +
        (specs ? '<dl class="om-specs">' + specs + "</dl>" : "") +
        (node.note ? '<p class="om-note">' + esc(node.note) + "</p>" : "") +
        "</article>";
    }).join("");
    el.innerHTML = '<div class="om-grid om-cols-wide">' + cards + "</div>";
  }

  function renderGpu(el, gpu) {
    var cards = (gpu.nodes || []).map(function (node) {
      if (!node.online) {
        return '<article class="om-tile"><div class="om-k">' + esc(node.name) + "</div>" +
          '<div class="om-status" style="margin-top:8px">' + dotWord("sleeping") + " · powered down or unreachable</div></article>";
      }
      var bits = "";
      if (node.util_pct != null) {
        bits += '<div class="om-k" style="margin-top:2px">GPU load <span class="om-v">' + num(node.util_pct, 0) + "%</span></div>" +
          meterHTML(node.util_pct, thresholdCls(node.util_pct, 80, 95));
      }
      if (node.vram_total_gb) {
        var vramPct = (num(node.vram_used_gb, 0) / node.vram_total_gb) * 100;
        bits += '<div class="om-sub" style="margin-top:8px">VRAM ' + esc(fmtGB(node.vram_used_gb)) + " of " + esc(fmtGB(node.vram_total_gb)) + "</div>" +
          meterHTML(vramPct, thresholdCls(vramPct, 85, 95));
      }
      var tail = [];
      if (node.temp_c != null) tail.push(Math.round(node.temp_c) + "°C");
      if (node.power_w != null) tail.push(num(node.power_w, 0) + " W");
      if (tail.length) bits += '<div class="om-sub" style="margin-top:8px">' + esc(tail.join(" · ")) + "</div>";
      return '<article class="om-tile"><div class="om-k">' + esc(node.name) +
        ' <span class="om-status">' + dotWord("ok") + "</span></div>" + bits + "</article>";
    }).join("");
    el.innerHTML = '<div class="om-grid">' + cards + "</div>";
  }

  function renderAgents(el, agents) {
    var cards = (agents.agents || []).map(function (agent) {
      return '<article class="om-tile om-agent">' +
        '<div class="om-agent-top"><span class="om-emoji">' + esc(agent.emoji || "") + '</span>' +
        '<b class="om-agent-name">' + esc(agent.name) + "</b></div>" +
        '<div class="om-agent-role">' + esc(agent.role || "") + "</div>" +
        (agent.model ? '<div class="om-agent-model"><span class="om-chip">' + esc(agent.model) + "</span></div>" : "") +
        '<div class="om-status">' + dotWord(agent.status) +
        (agent.last_seen ? " · " + tsSpan(agent.last_seen) : "") + "</div>" +
        "</article>";
    }).join("");
    el.innerHTML = '<div class="om-grid om-cols-narrow">' + cards + "</div>";
    var counts = agents.counts || {};
    var sub = document.querySelector('[data-om-sub="agents"]');
    if (sub) {
      var total = num(counts.active, 0) + num(counts.idle, 0) + num(counts.sleeping, 0) + num(counts.offline, 0);
      sub.textContent = num(counts.active, 0) + " active · " + num(counts.sleeping, 0) + " sleeping · " + total + " total";
    }
  }

  function renderModels(el, models) {
    var rows = (models.providers || []).map(function (provider) {
      return '<div class="om-provider"><b>' + esc(provider.name) + "</b>" +
        '<span class="om-chip ' + (provider.kind === "local" ? "is-ok" : "is-dim") + '">' +
        (provider.kind === "local" ? "LOCAL" : "CLOUD") + "</span>" +
        '<span class="om-prov-count">' + num(provider.models, 0) + " model" + (num(provider.models, 0) === 1 ? "" : "s") + "</span></div>";
    }).join("");
    el.innerHTML =
      '<div class="om-tile">' +
      '<div class="om-models-default">Default model <span class="om-chip is-info">' + esc(models.default_model || "—") + "</span>" +
      (models.total_models ? ' <span class="om-chip">' + num(models.total_models, 0) + " configured</span>" : "") + "</div>" +
      rows + "</div>";
  }

  function jobRow(job) {
    var rate = job.success_rate_30d;
    return '<div class="om-job" role="row">' +
      '<span class="om-job-name" role="cell">' + dotWord(job.last_status) + " " + esc(job.name) + "</span>" +
      '<span class="om-job-agent" role="cell">' + esc(job.agent || "") + "</span>" +
      '<span class="om-job-cad" role="cell">' + esc(job.cadence || "") + "</span>" +
      '<span class="om-job-last" role="cell">' + (job.last_run_at ? tsSpan(job.last_run_at) : "—") + "</span>" +
      '<span class="om-job-rate" role="cell">' + (rate != null ? meterHTML(rate, thresholdCls(100 - rate, 5, 15)) + esc(fmtPct(rate)) : "—") + "</span>" +
      '<span class="om-job-dur" role="cell">' + (job.avg_duration_s != null ? esc(fmtDur(job.avg_duration_s)) : "—") + "</span>" +
      "</div>";
  }

  function renderAutomations(el, autos) {
    var totals = autos.totals || {};
    var stats = autos.stats || {};
    var chips =
      '<div class="om-autos-totals">' +
      '<span class="om-stat"><b>' + num(totals.enabled, 0) + "<em>/" + num(totals.jobs, 0) + '</em></b><i>jobs enabled</i></span>' +
      (stats.runs_24h != null ? '<span class="om-stat"><b>' + num(stats.runs_24h, 0) + "</b><i>runs · 24h</i></span>" : "") +
      (stats.runs_7d != null ? '<span class="om-stat"><b>' + num(stats.runs_7d, 0) + "</b><i>runs · 7d</i></span>" : "") +
      (stats.success_rate_7d != null ? '<span class="om-stat"><b>' + esc(fmtPct(stats.success_rate_7d)) + "</b><i>success · 7d</i></span>" : "") +
      "</div>";

    var jobs = (autos.jobs || []).slice();
    var head = '<div class="om-job om-job-head" role="row">' +
      '<span role="columnheader">Job</span><span role="columnheader">Agent</span>' +
      '<span role="columnheader">Cadence</span><span role="columnheader">Last run</span>' +
      '<span role="columnheader">Success · 30d</span><span role="columnheader">Avg</span></div>';
    var top = jobs.slice(0, 10).map(jobRow).join("");
    var rest = jobs.slice(10).map(jobRow).join("");

    el.innerHTML = chips +
      '<div class="om-autos" role="table" aria-label="Scheduled jobs">' + head + top + "</div>" +
      (rest ? '<details class="om-more"><summary>Show all ' + jobs.length + " published jobs</summary>" +
        '<div class="om-autos" role="table" aria-label="More scheduled jobs">' + rest + "</div></details>" : "") +
      (num(totals.jobs, 0) > jobs.length ? '<div class="om-meta-line">' + (num(totals.jobs, 0) - jobs.length) + " internal jobs run beyond this list — counted in the totals above.</div>" : "");
  }

  function renderSecurity(el, sec) {
    var sentinel = sec.sentinel || {};
    var services = sec.services || {};
    var tiles = "";

    function sentinelTile(label, entry) {
      if (!entry) return "";
      return '<article class="om-tile"><div class="om-k">' + label + "</div>" +
        '<div class="om-status" style="margin-top:8px">' + dotWord(entry.status) +
        (entry.last_run_at ? " · " + tsSpan(entry.last_run_at) : "") + "</div></article>";
    }

    tiles += sentinelTile("Sentinel · daily scan", sentinel.daily_scan);
    tiles += sentinelTile("Sentinel · weekly audit", sentinel.weekly_audit);
    tiles += '<article class="om-tile"><div class="om-k">Services</div>' +
      '<div class="om-status" style="margin-top:8px">' + dotWord(services.gateway ? "ok" : "error") + " Gateway</div>" +
      '<div class="om-status" style="margin-top:4px">' + dotWord(services.ops_backend ? "ok" : "error") + " Ops backend</div></article>";

    el.innerHTML = '<div class="om-grid">' + tiles + "</div>";
  }

  function renderWorkshop(el, shop) {
    var games = shop.games || {};
    var memory = shop.memory || {};
    var counters = "";
    if (games.count != null) counters += '<a class="om-counter" href="../games/"><b>' + num(games.count, 0) + "</b><i>games shipped</i></a>";
    if (shop.apps_count != null) counters += '<span class="om-counter"><b>' + num(shop.apps_count, 0) + "</b><i>experiments</i></span>";
    if (shop.skills_count != null) counters += '<span class="om-counter"><b>' + num(shop.skills_count, 0) + "</b><i>agent skills</i></span>";
    if (memory.daily_log_days != null) counters += '<span class="om-counter"><b>' + num(memory.daily_log_days, 0) + "</b><i>days of lab logs</i></span>";

    var sites = (shop.sites || []).map(function (site) {
      return '<a href="' + esc(site.url) + '" rel="noopener">' + esc(site.label) + "</a>";
    }).join(" · ");

    el.innerHTML = '<div class="om-counters">' + counters + "</div>" +
      (sites ? '<div class="om-sites">Live sites: ' + sites + "</div>" : "") +
      (Array.isArray(games.recent) && games.recent.length ?
        '<div class="om-meta-line">Recently updated: ' + games.recent.map(esc).join(", ") +
        (memory.since ? " · logging since " + esc(memory.since) : "") + "</div>" : "");
  }

  function renderMilestones(el, milestones) {
    var items = (Array.isArray(milestones) ? milestones : []).slice().reverse().slice(0, 8).map(function (m) {
      return "<li><time>" + esc(m.date) + "</time><span>" + esc(m.title) + "</span></li>";
    }).join("");
    el.innerHTML = '<ul class="om-miles">' + items + "</ul>";
  }

  // ------------------------------------------------------- section registry

  var SECTIONS = [
    { key: "__pulse", sel: "#om-pulse", secSel: "#sec-pulse", render: renderPulse },
    { key: "system", sel: "#om-system", secSel: "#sec-system", render: renderSystem },
    { key: "fleet", sel: "#om-fleet", secSel: "#sec-fleet", render: renderFleet },
    { key: "gpu", sel: "#om-gpu", secSel: "#sec-gpu", render: renderGpu },
    { key: "agents", sel: "#om-agents", secSel: "#sec-agents", render: renderAgents },
    { key: "models", sel: "#om-models", secSel: "#sec-models", render: renderModels },
    { key: "automations", sel: "#om-autos", secSel: "#sec-autos", render: renderAutomations },
    { key: "security_reliability", sel: "#om-security", secSel: "#sec-security", render: renderSecurity },
    { key: "workshop", sel: "#om-workshop", secSel: "#sec-workshop", render: renderWorkshop },
    { key: "milestones", sel: "#om-milestones", secSel: "#sec-milestones", render: renderMilestones },
  ];

  function renderAll(snap) {
    SECTIONS.forEach(function (entry) {
      var sec = document.querySelector(entry.secSel);
      var el = document.querySelector(entry.sel);
      if (!sec || !el) return;
      var data = entry.key === "__pulse" ? snap : snap[entry.key];
      var ok = entry.key === "__pulse" ? !!snap.meta :
        entry.key === "milestones" ? Array.isArray(data) && data.length > 0 : sectionOK(data);
      if (!ok) { sec.hidden = true; return; }
      try {
        entry.render(el, data, snap);
        sec.hidden = false;
      } catch (err) {
        sec.hidden = true;
        if (window.console && console.warn) console.warn("ops module failed:", entry.key, err);
      }
    });
  }

  // ------------------------------------------------------- freshness badge

  function computeFreshness(outcome) {
    var snap = state.snap;
    if (!snap || !snap.meta) {
      return outcome === "warming" ? "warming" : (outcome === "error" ? "offline" : "loading");
    }
    var age = Date.now() - Date.parse(snap.meta.generated_at || 0);
    var cadence = (num(snap.meta.cadence_seconds, 600)) * 1000;
    if (outcome === "error" && state.source === "cache") return "offline";
    if (outcome === "warming" && state.source === "cache") return "offline";
    return age > cadence * 2.5 ? "stale" : "live";
  }

  var lastAnnounced = "";
  function renderBadge() {
    var badge = document.getElementById("om-freshness");
    if (!badge) return;
    var f = state.freshness;
    var genAt = state.snap && state.snap.meta ? state.snap.meta.generated_at : null;
    var text, cls;
    switch (f) {
      case "live": text = "LIVE SNAPSHOT · " + fmtRel(genAt); cls = "is-live"; break;
      case "stale": text = "STALE · " + fmtRel(genAt); cls = "is-stale"; break;
      case "warming": text = "WARMING UP"; cls = "is-warming"; break;
      case "offline": text = genAt ? "OFFLINE · cached " + fmtRel(genAt) : "OFFLINE"; cls = "is-offline"; break;
      default: text = "CONNECTING…"; cls = ""; break;
    }
    badge.textContent = text;
    badge.className = "om-badge " + cls;
    var live = document.getElementById("om-freshness-live");
    if (live && f !== lastAnnounced && (f === "stale" || f === "offline" || (lastAnnounced && f === "live"))) {
      live.textContent = f === "live" ? "Reconnected — live snapshot." : "Snapshot is " + f + ".";
    }
    lastAnnounced = f;
  }

  // ------------------------------------------------------------ data flow

  function readCache() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      var doc = JSON.parse(raw);
      return doc && doc.meta && doc.meta.schema_version === 1 ? doc : null;
    } catch (e) { return null; }
  }

  function writeCache(doc) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(doc)); } catch (e) { /* quota/private */ }
  }

  function fetchSnapshot() {
    if (state.inFlight) return;
    state.inFlight = true;
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = ctrl && setTimeout(function () { ctrl.abort(); }, FETCH_TIMEOUT_MS);

    fetch(SNAPSHOT_URL, { signal: ctrl ? ctrl.signal : undefined, cache: "no-cache" })
      .then(function (resp) {
        if (resp.status === 404 || resp.status === 503) throw { warming: true };
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        return resp.json();
      })
      .then(function (doc) {
        if (!doc || !doc.meta) throw new Error("bad document");
        state.snap = doc;
        state.source = "network";
        writeCache(doc);
        renderAll(doc);
        state.freshness = computeFreshness("ok");
        renderBadge();
      })
      .catch(function (err) {
        var outcome = err && err.warming ? "warming" : "error";
        state.freshness = computeFreshness(outcome);
        renderBadge();
      })
      .finally(function () {
        if (timer) clearTimeout(timer);
        state.inFlight = false;
        state.lastFetchAt = Date.now();
      });
  }

  function tick() {
    document.querySelectorAll("[data-ts]").forEach(function (el) {
      el.textContent = fmtRel(el.getAttribute("data-ts"));
    });
    if (state.snap && (state.freshness === "live" || state.freshness === "stale")) {
      state.freshness = computeFreshness("ok");
    }
    renderBadge();
    if (!document.hidden && Date.now() - state.lastFetchAt >= REFRESH_MS) fetchSnapshot();
  }

  function boot() {
    var cached = readCache();
    if (cached) {
      state.snap = cached;
      state.source = "cache";
      renderAll(cached);
      state.freshness = computeFreshness("ok");
      renderBadge();
    }
    fetchSnapshot();
    setInterval(tick, TICK_MS);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) tick();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
