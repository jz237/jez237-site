import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

/**
 * The neon, drawn on canvases — Breakout's way: white on black, filling a material's `emissiveMap`,
 * so one drawing glows in whatever `emissive` colour the material has. Each drawing is made once and
 * its canvas shared by every texture of it.
 */
const drawings = new Map<string, HTMLCanvasElement>();
function drawing(key: string, width: number, height: number, draw: (g: CanvasRenderingContext2D) => void): HTMLCanvasElement {
  let canvas = drawings.get(key);
  if (canvas) return canvas;
  canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const g = canvas.getContext('2d')!;
  g.fillStyle = '#000';
  g.fillRect(0, 0, width, height);
  draw(g);
  drawings.set(key, canvas);
  return canvas;
}

class NeonTexture extends CanvasTexture {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.colorSpace = SRGBColorSpace;
    this.anisotropy = 8;
  }
}

/** A seeded scatter, so every mushroom wears the same spots. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The floor of the field: one cell of a fine grid, repeated — one per cell of the game's grid. */
export class NeonGridTexture extends NeonTexture {
  constructor() {
    super(
      drawing('grid', 256, 256, (g) => {
        g.strokeStyle = 'rgb(255 255 255 / 0.5)';
        g.lineWidth = 3;
        g.strokeRect(0, 0, 256, 256);
        g.fillStyle = 'rgb(255 255 255 / 0.55)';
        for (const [x, y] of [[0, 0], [256, 0], [0, 256], [256, 256]] as const) {
          g.beginPath();
          g.arc(x, y, 9, 0, Math.PI * 2);
          g.fill();
        }
        g.strokeStyle = 'rgb(255 255 255 / 0.1)';
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(128, 0);
        g.lineTo(128, 256);
        g.moveTo(0, 128);
        g.lineTo(256, 128);
        g.stroke();
      }),
    );
    this.wrapS = this.wrapT = RepeatWrapping;
  }
}

/** A frame inset from the edge, lit along its top: the player's hull and the panels. */
export class NeonFrameTexture extends NeonTexture {
  constructor() {
    super(
      drawing('frame', 512, 160, (g) => {
        const body = g.createLinearGradient(0, 0, 0, 160);
        body.addColorStop(0, 'rgb(120 120 120)');
        body.addColorStop(1, 'rgb(40 40 40)');
        g.fillStyle = body;
        g.beginPath();
        g.roundRect(22, 22, 468, 116, 26);
        g.fill();
        g.shadowColor = '#fff';
        g.shadowBlur = 22;
        g.strokeStyle = '#fff';
        g.lineWidth = 9;
        g.beginPath();
        g.roundRect(22, 22, 468, 116, 26);
        g.stroke();
        g.shadowBlur = 0;
        g.fillStyle = 'rgb(255 255 255 / 0.5)';
        g.fillRect(70, 30, 372, 5);
      }),
    );
  }
}

/**
 * A mushroom cap, pole at the top of the canvas and rim at the bottom: lit glass brightening toward
 * the rim, a scatter of glowing spots, and a hot band where the cap meets the floor.
 */
export class NeonSpotsTexture extends NeonTexture {
  constructor() {
    super(
      drawing('spots', 256, 128, (g) => {
        const body = g.createLinearGradient(0, 0, 0, 128);
        body.addColorStop(0, 'rgb(150 150 150)');
        body.addColorStop(0.6, 'rgb(60 60 60)');
        body.addColorStop(1, 'rgb(110 110 110)');
        g.fillStyle = body;
        g.fillRect(0, 0, 256, 128);
        const random = seeded(7);
        g.shadowColor = '#fff';
        g.shadowBlur = 10;
        g.fillStyle = '#fff';
        for (let i = 0; i < 14; i++) {
          const x = random() * 256;
          const y = 18 + random() * 78;
          const r = 5 + random() * 7;
          for (const dx of [-256, 0, 256]) {
            g.beginPath();
            g.ellipse(x + dx, y, r * 1.4, r, 0, 0, Math.PI * 2);
            g.fill();
          }
        }
        g.shadowBlur = 16;
        g.fillRect(0, 114, 256, 8);
      }),
    );
    this.wrapS = RepeatWrapping;
  }
}

/** A millipede segment's shell, its poles front and back: glowing bands across it, a lit ridge along. */
export class NeonStripeTexture extends NeonTexture {
  constructor() {
    super(
      drawing('stripe', 256, 256, (g) => {
        g.fillStyle = 'rgb(85 85 85)';
        g.fillRect(0, 0, 256, 256);
        g.shadowColor = '#fff';
        g.shadowBlur = 14;
        g.fillStyle = '#fff';
        for (const y of [64, 128, 192]) g.fillRect(0, y - 8, 256, 16);
        g.shadowBlur = 0;
        g.fillStyle = 'rgb(255 255 255 / 0.35)';
        for (const y of [99, 157]) g.fillRect(0, y - 2, 256, 4);
        // The ridge along the back: a stripe at a quarter turn, where the shell faces the camera.
        g.fillStyle = 'rgb(255 255 255 / 0.55)';
        g.fillRect(56, 30, 16, 196);
      }),
    );
  }
}

/** A word in a rounded frame, glowing: a pickup's face. `args={['LASER']}`. */
export class NeonLabelTexture extends NeonTexture {
  constructor(text = '') {
    super(
      drawing(`label:${text}`, 384, 128, (g) => {
        g.shadowColor = '#fff';
        g.shadowBlur = 16;
        g.fillStyle = '#fff';
        g.font = '900 60px Orbitron, "Arial Black", sans-serif';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(text, 192, 68);
        g.lineWidth = 6;
        g.strokeStyle = 'rgb(255 255 255 / 0.6)';
        g.beginPath();
        g.roundRect(10, 10, 364, 108, 52);
        g.stroke();
      }),
    );
  }
}
