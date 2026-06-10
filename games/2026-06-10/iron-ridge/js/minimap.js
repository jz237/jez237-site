// Tactical minimap: pre-rendered terrain underlay (height + forest tint),
// live blips for enemies/pillboxes/targets/barrels/crates, view cone, and
// edge-clamped chevrons for threats beyond minimap range.

import { getHeight, forestDensity } from './terrain.js';
import { WORLD_HALF } from './config.js';

const RANGE = 130;       // metres shown from centre to edge

export class Minimap {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.size = 168;                       // logical units
    this.dpr = canvas.width / this.size;   // canvas is 2x for sharpness

    // bake the terrain underlay once: 1px ≈ 2m over the whole world
    const bs = 560;
    this.base = document.createElement('canvas');
    this.base.width = this.base.height = bs;
    const bctx = this.base.getContext('2d');
    const img = bctx.createImageData(bs, bs);
    for (let py = 0; py < bs; py++) {
      for (let px = 0; px < bs; px++) {
        const wx = (px / bs - 0.5) * WORLD_HALF * 2;
        const wz = (py / bs - 0.5) * WORLD_HALF * 2;
        const h = getHeight(wx, wz);
        const f = forestDensity(wx, wz);
        // grass base shaded by height
        const shade = Math.max(0, Math.min(1, (h + 6) / 30));
        let r = 92 + shade * 70, g = 122 + shade * 62, b = 64 + shade * 50;
        // forest darkening
        const forest = f * f * 1.2;
        r = r * (1 - forest * 0.55);
        g = g * (1 - forest * 0.3);
        b = b * (1 - forest * 0.5);
        // rocky highs
        if (h > 15) { const t = Math.min(1, (h - 15) / 10); r = r * (1 - t) + 140 * t; g = g * (1 - t) + 136 * t; b = b * (1 - t) + 128 * t; }
        const i = (py * bs + px) * 4;
        img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = 255;
      }
    }
    bctx.putImageData(img, 0, 0);
  }

  // world → minimap pixels (relative to player at centre)
  toMap(wx, wz, px, pz) {
    const s = this.size / (RANGE * 2);
    return [
      this.size / 2 + (wx - px) * s,
      this.size / 2 + (wz - pz) * s,
    ];
  }

  blip(x, y, color, r = 3.5) {
    const c = this.ctx;
    c.fillStyle = color;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
  }

  // chevron at the rim pointing toward an off-map contact
  edgeMarker(wx, wz, px, pz, color) {
    const c = this.ctx;
    const ang = Math.atan2(wz - pz, wx - px);
    const R = this.size / 2 - 7;
    const cx = this.size / 2 + Math.cos(ang) * R;
    const cy = this.size / 2 + Math.sin(ang) * R;
    c.save();
    c.translate(cx, cy);
    c.rotate(ang + Math.PI / 2);
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(0, -6);
    c.lineTo(4.5, 3);
    c.lineTo(-4.5, 3);
    c.closePath();
    c.fill();
    c.restore();
  }

  draw(player, enemies, props, camYaw) {
    const c = this.ctx;
    const S = this.size;
    const pp = player.body.position;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // circular clip
    c.save();
    c.beginPath();
    c.arc(S / 2, S / 2, S / 2 - 2, 0, Math.PI * 2);
    c.clip();

    // terrain underlay: source rect centred on player
    const bs = this.base.width;
    const pxPerM = bs / (WORLD_HALF * 2);
    const srcW = RANGE * 2 * pxPerM;
    const srcX = (pp.x + WORLD_HALF) * pxPerM - srcW / 2;
    const srcY = (pp.z + WORLD_HALF) * pxPerM - srcW / 2;
    c.imageSmoothingEnabled = true;
    c.drawImage(this.base, srcX, srcY, srcW, srcW, 0, 0, S, S);
    c.fillStyle = 'rgba(8, 14, 8, 0.18)';
    c.fillRect(0, 0, S, S);

    // view cone
    const fov = 0.5;
    c.fillStyle = 'rgba(255, 255, 255, 0.10)';
    c.beginPath();
    c.moveTo(S / 2, S / 2);
    // camera looks along +camYaw (world x = sin, z = cos); map x→wx, y→wz
    const a0 = Math.atan2(Math.cos(camYaw), Math.sin(camYaw));
    c.arc(S / 2, S / 2, S / 2 - 4, a0 - fov, a0 + fov);
    c.closePath();
    c.fill();

    // props
    for (const it of props.items) {
      if (!it.alive) continue;
      const wp = it.body ? it.body.position : { x: it.x, z: it.z };
      const d = Math.hypot(wp.x - pp.x, wp.z - pp.z);
      const colors = {
        target: '#ffd95e', barrel: '#ff8a3c', pillbox: '#ff4d4d',
        crate: '#7dffa8', block: 'rgba(220,214,196,0.55)',
      };
      const col = colors[it.kind];
      if (!col) continue;
      if (d > RANGE * 0.94) {
        if (it.kind === 'target' || it.kind === 'pillbox') this.edgeMarker(wp.x, wp.z, pp.x, pp.z, col);
        continue;
      }
      const [x, y] = this.toMap(wp.x, wp.z, pp.x, pp.z);
      if (it.kind === 'pillbox') {
        c.fillStyle = col;
        c.fillRect(x - 3.5, y - 3.5, 7, 7);
      } else {
        this.blip(x, y, col, it.kind === 'block' ? 2 : 3.2);
      }
    }

    // enemy tanks
    for (const e of enemies) {
      if (!e.tank.alive) continue;
      const ep = e.tank.body.position;
      const d = Math.hypot(ep.x - pp.x, ep.z - pp.z);
      if (d > RANGE * 0.94) {
        this.edgeMarker(ep.x, ep.z, pp.x, pp.z, '#ff3b30');
        continue;
      }
      const [x, y] = this.toMap(ep.x, ep.z, pp.x, pp.z);
      this.blip(x, y, '#ff3b30', 4);
      c.strokeStyle = 'rgba(255,59,48,0.6)';
      c.lineWidth = 1;
      c.beginPath();
      c.arc(x, y, 6, 0, Math.PI * 2);
      c.stroke();
    }

    // player arrow (hull heading)
    const yaw = player.visualYaw();
    c.save();
    c.translate(S / 2, S / 2);
    const mapAng = Math.atan2(Math.cos(yaw), Math.sin(yaw)); // forward in map coords
    c.rotate(mapAng + Math.PI / 2);
    c.fillStyle = '#eaf6d8';
    c.strokeStyle = '#27331c';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(0, -7);
    c.lineTo(5, 6);
    c.lineTo(0, 3);
    c.lineTo(-5, 6);
    c.closePath();
    c.fill();
    c.stroke();
    c.restore();

    c.restore(); // clip

    // rim
    c.strokeStyle = 'rgba(182, 211, 106, 0.5)';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(S / 2, S / 2, S / 2 - 2, 0, Math.PI * 2);
    c.stroke();
    // north tick
    c.fillStyle = 'rgba(232, 238, 221, 0.8)';
    c.font = 'bold 10px sans-serif';
    c.textAlign = 'center';
    c.fillText('N', S / 2, 12);
  }
}
