import * as T from 'three';
import { BOWL } from '../render/bowl';
import { BED_LEVEL, BED_RADIUS, GLASS_INNER, MAT, stream } from '../render/scape/mesh.mjs';
import { buildScapePieces } from '../render/scape/scene.mjs';
import { WATER_LEVEL } from './slosh.mjs';
import { makeWaterFilm } from './waterFilm.mjs';
import { movingPlant } from './plants.mjs';

// The same bowl and furnishings, rasterized once per view. Their material and cavity detail is
// baked into vertex colours at load time. No scene BVH, refraction pass or fluid grid is needed.
const colours = {
  [MAT.BARK]: 0x795334, [MAT.WOOD_END]: 0xb98a56, [MAT.ROCK]: 0x797b72,
  [MAT.LEAF_BIG]: 0x50802f, [MAT.LEAF_SMALL]: 0x77a440, [MAT.STEM]: 0x526e31,
  [MAT.ROOT]: 0x6c5c3b, [MAT.HEATER]: 0x313b3d, [MAT.HEATER_LAMP]: 0xe98039,
  [MAT.SPONGE]: 0x384443, [MAT.TUBE]: 0x555e60, [MAT.SUCTION]: 0x718788,
};
const palette = Object.fromEntries(Object.entries(colours).map(([k, hex]) => [k, new T.Color(hex)]));

function furnishings(scene, waterFilm) {
  const material = new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide });
  waterFilm.illuminate(material);
  const pieces = buildScapePieces({ detail: 0.28 });
  const obstacles = pieces.flatMap(p => p.obstacles);
  const plants = new Map();
  for (const piece of pieces) for (const mesh of piece.meshes) {
    const { positions, indices, normals, materials, attrs } = mesh;
    const colour = new Float32Array(positions.length);
    for (let i = 0; i < indices.length; i++) {
      const v = indices[i], id = materials[Math.floor(i / 3)], a = v * 4, base = palette[id];
      let shade = 0.55 + 0.45 * attrs[a + 3];
      if (id === MAT.BARK) shade *= 0.68 + 0.32 * (1 - attrs[a + 2]) + 0.12 * Math.sin(attrs[a + 1] * 17);
      if (id === MAT.ROCK) shade *= 1 - 0.43 * attrs[a + 1];
      if (id === MAT.LEAF_BIG || id === MAT.LEAF_SMALL) shade *= 0.72 + 0.32 * attrs[a] + 0.13 * Math.cos(9 * attrs[a + 1]);
      colour[3 * v] = base.r * shade;
      colour[3 * v + 1] = base.g * shade;
      colour[3 * v + 2] = base.b * shade;
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new T.BufferAttribute(normals, 3));
    geometry.setAttribute('color', new T.BufferAttribute(colour, 3));
    geometry.setIndex(new T.BufferAttribute(indices, 1));
    if (mesh.motion) plants.set(mesh.name, movingPlant(mesh, geometry, obstacles));
    const part = new T.Mesh(geometry, material);
    part.name = mesh.name;
    part.userData.topic = ({ driftwood: 'driftwood', rocks: 'rock', plantTall: 'anubias', plantSmall: 'rosette' })[mesh.name] ?? (materials.includes(MAT.HEATER) ? 'heater' : 'filter');
    if (materials.includes(MAT.HEATER_LAMP)) {
      const lampVertices = new Set();
      for (let i = 0; i < indices.length; i++) {
        if (materials[Math.floor(i / 3)] === MAT.HEATER_LAMP) lampVertices.add(indices[i]);
      }
      part.userData.lampVertices = [...lampVertices];
    }
    part.castShadow = part.receiveShadow = true;
    scene.add(part);
  }
  return { plants, obstacles: obstacles.map(o => ({ ...o, leaf: !!o.follow })), bubbles: pieces.find(p => p.bubbles)?.bubbles };
}

function ring(radius, width, y, material) {
  const mesh = new T.Mesh(new T.TorusGeometry(radius, width, 8, 80), material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.y = y;
  return mesh;
}

function disc(radius, y, material) {
  const mesh = new T.Mesh(new T.CircleGeometry(radius, 80), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  return mesh;
}

function sphereBand(radius, top, bottom) {
  const theta = Math.acos(top / radius);
  return new T.SphereGeometry(radius, 80, 36, 0, Math.PI * 2, theta, Math.acos(bottom / radius) - theta);
}

function sandMaterial() {
  const n = 128, bytes = new Uint8Array(n * n * 4), random = stream(912);
  for (let i = 0; i < bytes.length; i += 4) {
    const v = 0.74 + random() * 0.32 - (random() < 0.045 ? 0.35 : 0);
    bytes.set([202 * v, 164 * v, 111 * v, 255], i);
  }
  const map = new T.DataTexture(bytes, n, n);
  map.wrapS = map.wrapT = T.RepeatWrapping;
  map.repeat.set(4, 4);
  map.colorSpace = T.SRGBColorSpace;
  map.magFilter = T.LinearFilter;
  map.minFilter = T.LinearMipmapLinearFilter;
  map.generateMipmaps = true;
  map.needsUpdate = true;
  return new T.MeshLambertMaterial({ map });
}

/** Angular glass highlights and a shallow water tint stand in for tracing a ray through the bowl. */
function glassMaterial() {
  return new T.ShaderMaterial({
    transparent: true, depthWrite: false,
    vertexShader: `varying vec3 n; varying vec3 eye;
      void main() {
        vec4 p = modelViewMatrix * vec4(position,1.);
        n = normalMatrix * normal; eye = -p.xyz; gl_Position = projectionMatrix * p;
      }`,
    fragmentShader: `varying vec3 n; varying vec3 eye;
      void main() {
        vec3 N = normalize(n);
        float rim = pow(1.-clamp(dot(N,normalize(eye)),0.,1.), 3.);
        vec2 panel = abs(N.xy - vec2(-.67,.40));
        float glow = (1.-smoothstep(.055,.12,panel.x))*(1.-smoothstep(.16,.28,panel.y));
        float stripe = smoothstep(.76,.82,N.x)*(1.-smoothstep(.84,.89,N.x))*(1.-smoothstep(.25,.7,abs(N.y)));
        gl_FragColor = vec4(mix(vec3(.58,.83,.97),vec3(.08,.26,.37),rim), .018 + .60*rim + .24*glow + .13*stripe);
        #include <colorspace_fragment>
      }`,
  });
}

export function makeBowl(basin, shell, liquid, slosh, keyLight) {
  const waterFilm = makeWaterFilm(liquid, slosh, keyLight);
  const scape = furnishings(shell, waterFilm);
  const glass = glassMaterial();
  const wall = new T.Mesh(sphereBand(1, BOWL.mouth, -0.99), glass);
  wall.renderOrder = 5;
  wall.userData.topic = 'glass';
  shell.add(wall);
  const rim = new T.MeshPhongMaterial({ color: 0x9bc8cf, transparent: true, opacity: 0.63, depthWrite: false, shininess: 70 });
  shell.add(ring(Math.sqrt(1 - BOWL.mouth ** 2), BOWL.beadRadius, BOWL.mouth, rim));
  const sand = sandMaterial();
  waterFilm.illuminate(sand);
  const bed = new T.Mesh(new T.RingGeometry(0, BED_RADIUS, 80, 10), sand);
  bed.rotation.x = -Math.PI / 2;
  bed.position.y = BED_LEVEL;
  bed.receiveShadow = true;
  const sandWall = new T.Mesh(sphereBand(GLASS_INNER, BED_LEVEL, -0.98), sand);
  bed.userData.topic = sandWall.userData.topic = 'sand';
  shell.add(sandWall, bed);
  const tint = new T.Mesh(sphereBand(GLASS_INNER, WATER_LEVEL, -0.98),
    new T.MeshBasicMaterial({ color: 0x77c5d9, transparent: true, depthWrite: false, opacity: 0.06 }));
  // Seen edge-on, the film still has a narrow dark contact line on the wet glass.
  tint.material.onBeforeCompile = shader => {
    shader.vertexShader = 'varying float belowFilm;\n' + shader.vertexShader.replace('#include <begin_vertex>',
      `#include <begin_vertex>\nbelowFilm = ${WATER_LEVEL} - position.y;`);
    shader.fragmentShader = 'varying float belowFilm;\n' + shader.fragmentShader.replace('#include <opaque_fragment>', `
      float line = 1.-smoothstep(.002,.017,belowFilm);
      outgoingLight = mix(outgoingLight,vec3(.009,.030,.043),line);
      diffuseColor.a += (1.-diffuseColor.a)*.56*line;
      #include <opaque_fragment>`);
  };
  tint.renderOrder = 4;
  liquid.add(tint);
  const lid = new T.Group(), dark = new T.MeshPhongMaterial({ color: 0x142229, shininess: 70 });
  lid.position.y = BOWL.mouth + BOWL.lidThickness;
  const lip = new T.Mesh(new T.RingGeometry(BOWL.lidRadius - BOWL.rimWidth, BOWL.lidRadius, 80),
    new T.MeshPhongMaterial({ color: 0x19252b, side: T.DoubleSide }));
  lip.rotation.x = -Math.PI / 2;
  const knob = new T.Mesh(new T.CylinderGeometry(BOWL.knobRadius, BOWL.knobRadius, BOWL.knobHeight, 20), dark);
  knob.position.y = BOWL.knobHeight / 2;
  const lamp = disc(BOWL.puckRadius, -0.022, new T.MeshBasicMaterial({ color: 0xffe6ba, side: T.DoubleSide }));
  lid.add(lip, ring(BOWL.lidRadius - 0.01, 0.013, 0, dark), disc(BOWL.lidRadius - BOWL.rimWidth, 0, rim.clone()), knob, lamp);
  lid.userData.topic = 'lid';
  basin.add(lid);
  // A contact shadow on the table stays under the bowl as the camera orbits and zooms.
  const shadow = new T.ShaderMaterial({
    transparent: true, depthWrite: false,
    vertexShader: 'varying vec2 p; void main(){ p=uv*2.-1.; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'varying vec2 p; void main(){ float r=dot(p,p); gl_FragColor=vec4(.003,.009,.014,.62*exp(-4.*r)*(1.-smoothstep(.65,1.,r))); }',
  });
  const footprint = new T.Mesh(new T.PlaneGeometry(2.6, 2.6), shadow);
  footprint.rotation.x = -Math.PI / 2;
  footprint.position.y = -0.985;
  basin.add(footprint);
  return { lid, tint, waterFilm, ...scape };
}
