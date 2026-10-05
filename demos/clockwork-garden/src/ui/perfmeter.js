// ?debug=1: a small frame-rate readout in the corner, for reporting how the
// garden runs on a particular device (fps, the slowest frames, how many missed
// the display's refresh, main-thread and GPU time per frame, the resolution
// the governor has settled on).

export class PerfMeter {
  constructor(gov, info) {
    this.gov = gov;
    this.info = info;
    this.el = document.createElement('div');
    this.el.className = 'perfmeter';
    Object.assign(this.el.style, {
      position: 'fixed', left: '8px', top: '8px', zIndex: 50, pointerEvents: 'none',
      font: '11px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace', color: '#e8dcc0',
      background: 'rgba(6, 18, 20, 0.72)', padding: '6px 8px', borderRadius: '4px', whiteSpace: 'pre',
    });
    document.body.appendChild(this.el);
    this.next = 0;
  }

  update(now) {
    if (now < this.next) return;
    this.next = now + 250;
    const s = this.gov.stats();
    const i = this.info();
    const c = document.getElementById('film');
    this.el.textContent =
      `${s.fps.toFixed(0)} fps  (display ${s.hz.toFixed(0)} Hz${s.cap > 1 ? `, every ${s.cap}` : ''})\n` +
      `slowest 5%: ${s.p95.toFixed(1)} ms   missed: ${s.missed}/60\n` +
      `cpu ${s.cpu.toFixed(1)} ms   gpu ${s.gpu == null ? 'n/a' : s.gpu.toFixed(1) + ' ms'}\n` +
      `resolution ${(s.scale * 100).toFixed(0)}% (${c.width}×${c.height})   detail ${['full', 'shadows ½', 'shadows ½ + cull', 'shadows ½ + more cull'][s.cpuLevel]}\n` +
      `${i.mode || 'landing'}${i.planting ? '' : '   planting…'}`;
  }
}
