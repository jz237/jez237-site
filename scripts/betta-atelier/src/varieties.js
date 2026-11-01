import * as T from "three";
import { VARIETIES, varietyLook, varietyOf as bowlVarietyOf } from "../../globes/src/fish/varieties.mjs";
import { CAUDAL, caudalCells, luminanceOf, MACRO, measure, painting, prepare, PROFILE, profileCells } from "../../globes/src/fish/bettaPaint.mjs";
import { lookUniforms } from "./look.js";

// The Betta Bowl's colour varieties (../globes/src/fish/varieties.mjs), on the Atelier's fish:
// the photographs' brightness measured once as they load, then each variety's two colour maps
// painted a few ms a frame (bettaPaint.mjs, as the bowl paints them) and handed with its numbers
// to the materials (look.js). Classic, the photographed fish, is the Atelier's own first look;
// the choice is remembered on this device apart from the bowl's.
export { VARIETIES };
export const STORAGE_KEY = "atelier.variety";
export const DEFAULT_VARIETY = "classic";
const PAINT_MS = 4;

export const parseVariety = (text) => (VARIETIES.some((v) => v.id === text) ? text : null);
export const varietyOf = (id) => VARIETIES.find((v) => v.id === id) ?? bowlVarietyOf(DEFAULT_VARIETY);

/** The variety to start with: ?variety= in the address, else the one kept here, else Classic. */
export function startingVariety(search = location.search, storage = () => localStorage) {
  const asked = parseVariety(new URLSearchParams(search).get("variety"));
  if (asked) return asked;
  try {
    return parseVariety(storage().getItem(STORAGE_KEY)) ?? DEFAULT_VARIETY;
  } catch {
    return DEFAULT_VARIETY;
  }
}

export function keepVariety(id, storage = () => localStorage) {
  try {
    storage().setItem(STORAGE_KEY, id);
  } catch {
    // (Not remembered.)
  }
}

/** Paints and shows varieties on a fish once its photographs are in. onShown(id) is told as each
 *  one appears (Classic at once). */
export class VarietyPainter {
  constructor(fish, onShown = () => {}) {
    this.fish = fish;
    this.onShown = onShown;
    this.field = null;
    this.wanted = DEFAULT_VARIETY;
    this.shown = DEFAULT_VARIETY;
    this.job = null;
    this.look = new Float32Array(16);
    this.canvases = {};
    fish.userData.ready.then(() => this.measure()).catch(() => {});
  }

  async measure() {
    try {
      const body = this.fish.children.find((m) => m.name.startsWith("Arc-length"));
      const tail = this.fish.children.find((m) => m.userData.kind === 0);
      const macro = this.fish.userData.macroTextures;
      const grid = async (image, w, h) => {
        const bitmap = await createImageBitmap(image, { resizeWidth: w, resizeHeight: h, resizeQuality: "high" });
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close?.();
        return luminanceOf(ctx.getImageData(0, 0, w, h).data);
      };
      const [profile, caudal, head, scales] = await Promise.all([
        grid(body.material.map.image, PROFILE.w, PROFILE.h),
        grid(tail.material.map.image, CAUDAL.w, CAUDAL.h),
        grid(macro.head.image, MACRO, MACRO),
        grid(macro.scales.image, MACRO, MACRO),
      ]);
      const cells = profileCells();
      this.field = { ...measure({ profile, caudal, head, scales }, cells), cells, caudalOut: caudalCells() };
      prepare(VARIETIES);
      this.show(this.wanted);
    } catch (err) {
      // (The fish stays as photographed.)
      console.warn("[atelier] colour varieties unavailable:", err);
    }
  }

  get ready() {
    return !!this.field;
  }

  /** Shows a variety (its maps painted first, a few ms a frame; a newer choice ends the last). */
  show(id) {
    this.wanted = id;
    const field = this.field;
    if (!field) return;
    const v = varietyOf(id);
    const job = (this.job = {});
    if (!v.body) {
      this.apply(v, null);
      return;
    }
    const rows = painting(v, field);
    const step = () => {
      if (this.job !== job) return;
      const until = performance.now() + PAINT_MS;
      for (let r = rows.next(); ; r = rows.next()) {
        if (r.done) return this.apply(v, r.value);
        if (performance.now() > until) break;
      }
      requestAnimationFrame(step);
    };
    step();
  }

  /** Paints a variety synchronously (for captures and tests). */
  showNow(id) {
    this.wanted = id;
    if (!this.field) return false;
    const v = varietyOf(id);
    this.job = null;
    if (!v.body) return this.apply(v, null), true;
    const rows = painting(v, this.field);
    let r = rows.next();
    while (!r.done) r = rows.next();
    this.apply(v, r.value);
    return true;
  }

  apply(variety, painted) {
    if (painted) {
      lookUniforms.uLookProfile.value = this.texture("profile", painted.profile, PROFILE);
      lookUniforms.uLookCaudal.value = this.texture("caudal", painted.caudal, CAUDAL);
    }
    varietyLook(variety, this.field, this.look);
    lookUniforms.uLook.value.fromArray(this.look);
    this.shown = variety.id;
    this.onShown(variety.id);
  }

  /** A map's bytes on a small canvas (upright, as the photographs are), as a texture. */
  texture(name, bytes, { w, h }) {
    let entry = this.canvases[name];
    if (!entry) {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const texture = new T.CanvasTexture(canvas);
      texture.colorSpace = T.SRGBColorSpace;
      texture.minFilter = T.LinearFilter;
      texture.generateMipmaps = false;
      entry = this.canvases[name] = { canvas, texture };
    }
    entry.canvas.getContext("2d").putImageData(new ImageData(new Uint8ClampedArray(bytes), w, h), 0, 0);
    entry.texture.needsUpdate = true;
    return entry.texture;
  }
}
