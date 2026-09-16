import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { partGeometry } from "./course.mjs";

export function stoneTexture() {
  const size = 512,
    data = new Uint8Array(size * size * 4);
  const hash = (x, y) => {
    const n = Math.sin(x * 127.1 + y * 311.7 + 237) * 43758.5453;
    return n - Math.floor(n);
  };
  const noise = (x, y, n) => {
    const u = (x * n) / size,
      v = (y * n) / size,
      ix = Math.floor(u),
      iy = Math.floor(v),
      a = u - ix,
      b = v - iy,
      s = a * a * (3 - 2 * a),
      t = b * b * (3 - 2 * b),
      h = (dx, dy) => hash((ix + dx) % n, (iy + dy) % n);
    return (
      (h(0, 0) * (1 - s) + h(1, 0) * s) * (1 - t) +
      (h(0, 1) * (1 - s) + h(1, 1) * s) * t
    );
  };
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const coarse = noise(x, y, 8),
        grain = noise(x, y, 64),
        fine = hash(x, y),
        pore = fine > 0.979 ? 0.24 : 0,
        value = 0.4 * coarse + 0.38 * grain + 0.22 * fine - pore,
        i = (y * size + x) * 4;
      data[i] = Math.round(255 * (0.48 + 0.52 * value));
      data[i + 1] = Math.round(255 * Math.max(0, value));
      data[i + 2] = Math.round(255 * (0.75 + grain * 0.25));
      data[i + 3] = 255;
    }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

export function finishStone(material, texture) {
  const compile = material.onBeforeCompile,
    key = material.customProgramCacheKey.bind(material);
  material.roughness = 0.9;
  material.metalness = 0;
  material.onBeforeCompile = function (shader, renderer) {
    compile.call(this, shader, renderer);
    shader.uniforms.stoneGrain = { value: texture };
    shader.fragmentShader =
      "uniform sampler2D stoneGrain;\n" + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <alphamap_fragment>",
      `
      vec3 stoneNormal=abs(normalize(cross(dFdx(vTrackPosition),dFdy(vTrackPosition))));
      float stoneAxis=stoneNormal.z/max(stoneNormal.x+stoneNormal.z,0.0001);
      vec3 stoneA=texture2D(stoneGrain,vTrackPosition.zy*0.45).rgb;
      vec3 stoneB=texture2D(stoneGrain,vTrackPosition.xy*0.45).rgb;
      vec3 stoneSample=mix(stoneA,stoneB,stoneAxis);
      float stoneU=mix(vTrackPosition.z,vTrackPosition.x,stoneAxis);
      float stoneRow=floor(vTrackPosition.y/1.25);
      vec2 block=vec2(stoneU/2.8+mod(stoneRow,2.0)*0.5,vTrackPosition.y/1.25);
      vec2 jointDistance=abs(fract(block+0.5)-0.5);
      vec2 joint=1.0-smoothstep(vec2(0.009),vec2(0.009)+fwidth(block),jointDistance);
      float mortar=max(joint.x,joint.y);
      float blockTone=fract(sin(dot(floor(block),vec2(17.17,41.83)))*43758.5);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.23,0.20,0.15),0.12);
      diffuseColor.rgb*=mix(0.68,1.22,stoneSample.r)*mix(0.9,1.06,blockTone);
      diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*0.46,mortar*0.8);
      float stoneHeight=stoneSample.g*0.055-mortar*0.024;
      #include <alphamap_fragment>`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <normal_fragment_maps>",
      `
      #include <normal_fragment_maps>
      vec3 stoneDx=dFdx(-vViewPosition),stoneDy=dFdy(-vViewPosition);
      vec3 stoneR1=cross(stoneDy,normal),stoneR2=cross(normal,stoneDx);
      float stoneDet=dot(stoneDx,stoneR1);
      vec3 stoneGradient=sign(stoneDet)*(dFdx(stoneHeight)*stoneR1+dFdy(stoneHeight)*stoneR2);
      normal=normalize(abs(stoneDet)*normal-stoneGradient);`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      "#include <roughnessmap_fragment>\nroughnessFactor=clamp(0.72+stoneSample.b*0.26,0.72,0.98);",
    );
  };
  material.customProgramCacheKey = () => key() + "-stone-grain-v1";
  return material;
}

export function displayBase(course, grain) {
  const group = new THREE.Group(),
    sq = Math.SQRT1_2;
  // Local x runs across the board; local z follows its length.
  let minX = Infinity,
    maxX = -Infinity,
    minZ = Infinity,
    maxZ = -Infinity,
    bottom = Infinity;
  const parts = [];
  for (const p of course.parts) {
    const g = partGeometry(p);
    let loX = Infinity,
      hiX = -Infinity,
      loZ = Infinity,
      hiZ = -Infinity,
      loY = Infinity;
    for (let i = 0; i < g.vertices.length; i += 3) {
      const wx = g.vertices[i] + p.x,
        wz = g.vertices[i + 2] + p.z,
        x = (wx - wz) * sq,
        z = (wx + wz) * sq,
        y = g.vertices[i + 1] + p.y;
      loX = Math.min(loX, x);
      hiX = Math.max(hiX, x);
      loZ = Math.min(loZ, z);
      hiZ = Math.max(hiZ, z);
      loY = Math.min(loY, y);
    }
    minX = Math.min(minX, loX);
    maxX = Math.max(maxX, hiX);
    minZ = Math.min(minZ, loZ);
    maxZ = Math.max(maxZ, hiZ);
    bottom = Math.min(bottom, loY);
    parts.push({ p, loX, hiX, loZ, hiZ, loY });
  }
  const w = maxX - minX + 7,
    d = maxZ - minZ + 7,
    cx = (minX + maxX) / 2,
    cz = (minZ + maxZ) / 2,
    top = bottom - 0.04;
  group.rotation.y = Math.PI / 4;
  const wood = new THREE.MeshStandardMaterial({
    color: "#583522",
    roughness: 0.5,
    metalness: 0.02,
  });
  wood.onBeforeCompile = (shader) => {
    shader.uniforms.woodNoise = { value: grain };
    shader.vertexShader = "varying vec3 vWood;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nvWood=position;",
    );
    shader.fragmentShader =
      "varying vec3 vWood; uniform sampler2D woodNoise;\n" +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      float figure=texture2D(woodNoise,vWood.xz*vec2(0.035,0.009)).g;
      float grainLine=sin(vWood.x*11.0+sin(vWood.z*0.22)*1.7+figure*18.0);
      float fineGrain=texture2D(woodNoise,vWood.xz*vec2(0.7,0.035)).r;
      diffuseColor.rgb*=mix(0.6,1.4,figure)*mix(0.76,1.14,smoothstep(-0.7,0.7,grainLine))*mix(0.8,1.15,fineGrain);`,
    );
  };
  const metal = new THREE.MeshStandardMaterial({
      color: "#b59a61",
      roughness: 0.34,
      metalness: 0.78,
    }),
    dark = new THREE.MeshStandardMaterial({
      color: "#20272a",
      roughness: 0.82,
    }),
    support = new THREE.MeshStandardMaterial({
      color: "#635b4c",
      roughness: 0.92,
    });
  const box = (width, height, depth, x, y, z, material, radius = 0.15) => {
    const mesh = new THREE.Mesh(
      new RoundedBoxGeometry(
        width,
        height,
        depth,
        3,
        Math.min(radius, height / 3, width / 3, depth / 3),
      ),
      material,
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };
  box(w, 1.15, d, cx, top - 0.575, cz, wood, 0.22);
  box(w + 0.14, 0.11, d + 0.14, cx, top - 0.88, cz, metal, 0.03);
  box(w - 0.25, 0.25, d - 0.25, cx, top - 1.27, cz, dark, 0.08);
  for (const x of [minX + 0.3, maxX - 0.3])
    for (const z of [minZ + 0.3, maxZ - 0.3])
      box(2.4, 0.5, 2.4, x, top - 1.6, z, dark, 0.14);
  // Discrete display supports beneath higher static slabs, below racing space.
  for (const { p, loX, hiX, loZ, hiZ, loY } of parts) {
    if (
      p.motion ||
      loY - top < 0.35 ||
      hiX - loX < 2 ||
      hiZ - loZ < 2 ||
      ["wall", "pyramid", "tube"].includes(p.kind)
    )
      continue;
    const height = loY - top;
    for (const t of [0.3, 0.7])
      box(
        0.8,
        height,
        0.8,
        loX + (hiX - loX) * t,
        top + height / 2,
        loZ + (hiZ - loZ) * 0.5,
        support,
        0.09,
      );
  }
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#a38c58";
  ctx.fillRect(0, 0, 768, 128);
  ctx.strokeStyle = "#473d29";
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, 748, 108);
  ctx.fillStyle = "#292a25";
  ctx.font = "500 38px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(course.name, 384, 64, 710);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 1.34),
    new THREE.MeshStandardMaterial({ map, roughness: 0.42, metalness: 0.5 }),
  );
  plaque.rotation.x = -Math.PI / 2;
  plaque.position.set(cx, top + 0.025, maxZ + 2);
  group.add(plaque);
  return { group, top, ground: top - 1.87 };
}
