// The room behind the case: the concept shows the cabinet in a warm, lamplit study, softly out of
// focus. Weatherglass paints its backdrop sphere ('glassBackdrop') with a plain procedural gradient;
// this swaps in an out-of-focus study (models/room.webp, an equirectangular panorama built from a
// generated photo, its centre behind the case) while keeping Weatherglass's own lighting of the
// room: uBdRoom dims it at night and the warm halo still glows behind the case.
import { TextureLoader, SRGBColorSpace, LinearFilter } from 'three';

const BASE_ROOM = 0.085 + 0.075 + 0.068; // Weatherglass's default room colour, summed

export class Room {
  constructor(ctx, url) {
    this.ctx = ctx;
    new TextureLoader().load(url, (tex) => {
      tex.colorSpace = SRGBColorSpace;
      tex.minFilter = LinearFilter;
      tex.generateMipmaps = false;
      this.apply(tex);
    });
  }

  apply(tex) {
    const mesh = this.ctx.scene.getObjectByName('glassBackdrop');
    const m = mesh?.material;
    if (!m?.fragmentShader?.includes('vec3 c = gBackdrop(d);')) {
      console.warn('[room] backdrop shader not found');
      return;
    }
    m.uniforms.uRoomTex = { value: tex };
    m.fragmentShader = m.fragmentShader
      .replace('varying vec3 vWorld;', 'varying vec3 vWorld;\nuniform sampler2D uRoomTex;')
      .replace(
        'vec3 c = gBackdrop(d);',
        `vec3 c = gBackdrop(d);
  {
    vec2 ruv = vec2(atan(d.x, -d.z) / 6.2831853 + 0.5, asin(clamp(d.y, -1.0, 1.0)) / 3.14159265 + 0.5);
    vec3 room = texture2D(uRoomTex, ruv).rgb;
    float lit = dot(uBdRoom, vec3(1.0)) / ${BASE_ROOM.toFixed(4)};   // Weatherglass's day/night room level
    float halo = max(dot(d, uHaloDir), 0.0);
    room *= 1.7 * lit * (0.8 + 0.6 * uHalo * pow(halo, 6.0));
    c = mix(c, room, 0.88);
  }`,
      )
      // the photo has its own texture; keep only a whisper of the cloth mottling
      .replace('c *= 0.92 + 0.16 * wgNoise(', 'c *= 0.98 + 0.04 * wgNoise(');
    m.needsUpdate = true;
  }
}
