import * as T from 'three';
export function pistonGeometry() {
  // Closed crown and hollow skirt. Reliefs are shallow depressions in the crown surface.
  const profile = [
    new T.Vector2(0, 0.13),
    new T.Vector2(0.38, 0.13),
    new T.Vector2(0.405, 0.08),
    new T.Vector2(0.405, -0.2),
    new T.Vector2(0.442, -0.2),
    new T.Vector2(0.454, -0.16),
    new T.Vector2(0.458, 0.17),
    new T.Vector2(0.445, 0.23),
  ];
  for (let i = 15; i >= 0; i--)
    profile.push(new T.Vector2((0.445 * i) / 16, 0.23));
  const g = new T.LatheGeometry(profile, 64),
    p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      y = p.getY(i),
      z = p.getZ(i);
    if (y > 0.229) {
      const d = Math.min(Math.hypot(x, z - 0.21), Math.hypot(x, z + 0.21));
      p.setY(i, y - 0.035 * Math.exp(-Math.pow(d / 0.12, 6)));
    }
    if (y < -0.07)
      p.setY(
        i,
        y + (0.085 * Math.pow(Math.abs(z) / 0.458, 4) * (-0.07 - y)) / 0.13,
      );
  }
  g.computeVertexNormals();
  return g;
}
export function markingTexture(text: string) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#abc1bc';
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, 256, 80);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  return t;
}

// Repeatable code-generated surface detail, with no external texture assets.
export function surfaceTexture(kind: 'cast' | 'brushed' | 'rubber') {
  const size = 256,
    data = new Uint8Array(size * size * 4);
  let seed = 217;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise = seed / 4294967296;
      const value =
        kind === 'brushed'
          ? 125 + 20 * Math.sin(y * 2.8) + noise * 12
          : kind === 'rubber'
            ? 145 + noise * 25
            : 90 + noise * 100;
      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = value;
      data[i + 3] = 255;
    }
  const texture = new T.DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = T.RepeatWrapping;
  texture.magFilter = T.LinearFilter;
  texture.minFilter = T.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  return texture;
}

export function sectionCap(
  object: T.Mesh,
  plane: T.Plane,
  scene: T.Scene,
  order: number,
) {
  const special: T.Mesh[] = [];
  for (const [side, operation] of [
    [T.BackSide, T.IncrementWrapStencilOp],
    [T.FrontSide, T.DecrementWrapStencilOp],
  ] as const) {
    const material = new T.MeshBasicMaterial({
      side,
      depthWrite: false,
      depthTest: false,
      colorWrite: false,
      stencilWrite: true,
      stencilFunc: T.AlwaysStencilFunc,
      stencilFail: operation,
      stencilZFail: operation,
      stencilZPass: operation,
      clippingPlanes: [plane],
    });
    const stencil = new T.Mesh(object.geometry, material);
    stencil.renderOrder = order;
    stencil.userData.sectionHelper = true;
    object.add(stencil);
    special.push(stencil);
  }
  const material = new T.MeshStandardMaterial({
    color: 0xca9065,
    metalness: 0.6,
    roughness: 0.48,
    side: T.DoubleSide,
    stencilWrite: true,
    stencilRef: 0,
    stencilFunc: T.NotEqualStencilFunc,
    stencilFail: T.ReplaceStencilOp,
    stencilZFail: T.ReplaceStencilOp,
    stencilZPass: T.ReplaceStencilOp,
  });
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 sectionPosition;',
      )
      .replace(
        '#include <color_fragment>',
        '#include <color_fragment>\nfloat hatch=step(0.84,fract((sectionPosition.x+sectionPosition.y)*14.0)); diffuseColor.rgb *= mix(1.0,0.57,hatch);',
      );
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 sectionPosition;',
      )
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nsectionPosition=position;',
      );
  };
  const cap = new T.Mesh(new T.PlaneGeometry(18, 18), material);
  cap.rotation.y = Math.PI / 2;
  cap.renderOrder = order + 1;
  cap.userData.sectionHelper = true;
  cap.onAfterRender = (renderer) => renderer.clearStencil();
  scene.add(cap);
  special.push(cap);
  return {
    special,
    update(enabled: boolean) {
      let visible = enabled;
      let ancestor: T.Object3D | null = object;
      while (ancestor) {
        visible &&= ancestor.visible;
        ancestor = ancestor.parent;
      }
      special.forEach((o) => {
        o.visible = visible;
      });
      cap.position.set(plane.constant, 1.5, 0);
    },
  };
}
