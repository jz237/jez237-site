const API =
    "https://game-scores.jez237.workers.dev/scores/subway-siege-ironline",
  LOCAL = "subway_siege_ironline_scores";
export const store = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export class Scores {
  constructor() {
    this.global = null;
    this.error = false;
    this.last = 0;
    this.local = this.read();
    this.pending = null;
    this.posting = false;
    this.posted = false;
  }
  read() {
    const v = store.get(LOCAL, []);
    return Array.isArray(v)
      ? v
          .filter((r) => r && Number.isFinite(r.score) && r.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
      : [];
  }
  async fetch() {
    let timer;
    try {
      const ctl = new AbortController();
      timer = setTimeout(() => ctl.abort(), 6500);
      const r = await fetch(API, { signal: ctl.signal, cache: "no-store" });
      if (!r.ok) throw Error("board");
      const data = await r.json();
      if (!Array.isArray(data)) throw Error("format");
      this.global = data
        .filter((x) => x && Number.isFinite(x.score))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      this.error = false;
      this.last = Date.now();
    } catch {
      this.error = true;
    } finally {
      clearTimeout(timer);
    }
    return this.global;
  }
  table(title, rows, limit = 10, local = false) {
    return `<section class="board ${local ? "local" : ""}"><h3>${title}</h3><ol>${
      rows?.length
        ? rows
            .slice(0, limit)
            .map(
              (r, i) =>
                `<li><span>${i + 1}.</span><b>${escape((r.initials || "---").slice(0, 3))}</b><em>${Math.floor(r.score).toLocaleString()}</em><small>W${Math.floor(r.wave || r.level || 1)}</small></li>`,
            )
            .join("")
        : `<li class="note">${rows === null ? (this.error ? "Global board unavailable" : "Connecting to global board…") : "No scores yet. Set the first record."}</li>`
    }</ol></section>`;
  }
  html(limit = 10) {
    return (
      this.table("🌐 GLOBAL / IRONLINE", this.global, limit) +
      this.table("⌂ THIS DEVICE", this.local, limit, true)
    );
  }
  startRun() {
    this.pending = null;
    this.posting = false;
    this.posted = false;
  }
  save(initials, score, wave) {
    if (this.pending) return this.pending;
    initials = initials
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .padEnd(3, "A")
      .slice(0, 3);
    const e = {
      initials,
      score: Math.max(0, Math.floor(score)),
      wave,
      level: wave,
      ts: Date.now(),
    };
    store.set("jez237_initials", initials);
    if (e.score > 0) {
      this.local = [...this.read(), e]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      store.set(LOCAL, this.local);
    }
    this.pending = e;
    return e;
  }
  async post() {
    if (this.posting || this.posted || !this.pending || this.pending.score <= 0)
      return this.posted;
    this.posting = true;
    let timer;
    try {
      const ctl = new AbortController();
      timer = setTimeout(() => ctl.abort(), 8500);
      const { initials, score, wave } = this.pending;
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initials, score, wave, level: wave }),
        signal: ctl.signal,
      });
      if (!res.ok) throw Error("submit");
      this.posted = true;
      await this.fetch();
      return true;
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
      this.posting = false;
    }
  }
  get best() {
    return Math.max(this.global?.[0]?.score || 0, this.local[0]?.score || 0);
  }
}
