// Caps the size of the dinosaurs' skin textures on phones and tablets.
//
// Each species ships three 4096 x 4096 skins (colour, normal, roughness). On the GPU that is about
// 85 MB apiece with mipmaps, some 1.3 GB for the whole cast: a desktop card copes, a phone's GPU runs
// out of memory, loses its WebGL context, and Chrome then refuses WebGL on the page altogether
// ("Error creating WebGL context"). On phones and tablets (the page's own mobile check) each skin is
// shrunk as soon as it is decoded, before it reaches the GPU: 2048 (about a quarter of the memory),
// or 1024 on devices reporting 4 GB of RAM or less. ?skins=1024|2048 forces a size; ?skins=4096 forces full size.

export function skinCap(quality, params) {
  const asked = parseInt(params.get('skins') || '', 10);
  if (asked === 4096) return 0; // full size, as on desktop
  if ([512, 1024, 2048].includes(asked)) return asked;
  if (!quality?.mobile) return 0; // desktop is never touched: full size, loaded as before
  const mem = navigator.deviceMemory;
  return mem && mem <= 4 ? 1024 : 2048;
}

async function shrink(texture, cap) {
  const img = texture.image;
  const w = img?.width || 0, h = img?.height || 0;
  if (!cap || Math.max(w, h) <= cap) return texture;
  const k = cap / Math.max(w, h);
  const nw = Math.max(1, Math.round(w * k)), nh = Math.max(1, Math.round(h * k));
  let small = null;
  if (typeof createImageBitmap === 'function') {
    try {
      small = await createImageBitmap(img, {
        resizeWidth: nw,
        resizeHeight: nh,
        resizeQuality: 'high',
        premultiplyAlpha: 'none',
        colorSpaceConversion: 'none',
      });
    } catch {
      small = null;
    }
  }
  if (!small) {
    const c = document.createElement('canvas');
    c.width = nw;
    c.height = nh;
    const g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(img, 0, 0, nw, nh);
    small = c;
  }
  img.close?.(); // free the full-size bitmap now rather than at the next GC
  texture.image = small; // shared by every clone of this texture (they share its Source)
  texture.needsUpdate = true;
  return texture;
}

// Registers a GLTFLoader plugin that shrinks each image once, as it is decoded.
export function capLoaderTextures(loader, cap) {
  if (!cap) return loader;
  loader.register((parser) => {
    const orig = parser.loadImageSource.bind(parser);
    const done = new Map();
    parser.loadImageSource = (i, l) => {
      if (done.has(i)) return done.get(i).then((t) => t.clone());
      const p = orig(i, l).then((t) => shrink(t, cap));
      done.set(i, p);
      return p;
    };
    return { name: 'JT_skin_cap' };
  });
  return loader;
}
