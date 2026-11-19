import * as THREE from '../vendor/three.module.min.js';

// Game-sized, cratered adaptations of six radar meshes from C. Neese (ed.),
// Small Body Radar Shape Models V1.0, NASA PDS, https://doi.org/10.26033/vtj1-tb13.
// Albedo and tangent normals derive from the CC0 scan https://polyhaven.com/a/rock_boulder_dry.
const asset = name => new URL('../art/asteroids/' + name, import.meta.url).href;
const tones = [0xb4a898, 0xd2ceca, 0xb1b4b6, 0x999898, 0xabb1b8, 0xc3bcb1];

function solidTexture(bytes, colorSpace) {
  const texture = new THREE.DataTexture(new Uint8Array(bytes), 1, 1);
  texture.colorSpace = colorSpace;
  texture.needsUpdate = true;
  return texture;
}

function provisionalShape(i) {
  const geometry = new THREE.IcosahedronGeometry(1, 2);
  const positions = geometry.attributes.position;
  const colors = [];
  for (let k = 0; k < positions.count; k++) {
    const x = positions.getX(k), y = positions.getY(k), z = positions.getZ(k);
    const h = 1 + 0.14 * Math.sin(x * 4.8 + i) * Math.cos(4 * y - 1.2 * z) + 0.08 * Math.sin(z * 7 - i);
    positions.setXYZ(k, x * h * (0.86 + 0.02 * i), y * h * (0.57 + 0.06 * i), z * h * 0.78);
    const shade = 0.7 + 0.1 * Math.sin(x * 5 + z * 4);
    colors.push(shade, shade, shade);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function radarGeometry(body, tone) {
  const positions = [], colors = [], uvs = [], indices = body.triangles.slice();
  const tint = new THREE.Color(tone);
  for (let k = 0; k < body.vertices.length; k += 4) {
    const x = body.vertices[k] / 4096, y = body.vertices[k + 1] / 4096, z = body.vertices[k + 2] / 4096;
    const value = body.vertices[k + 3] / 255;
    positions.push(x, y, z);
    colors.push(value * tint.r, value * tint.g, value * tint.b);
    uvs.push(0.5 + Math.atan2(z, x) / (2 * Math.PI), 0.5 + Math.asin(y / Math.hypot(x, y, z)) / Math.PI);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const normals = Array.from(geometry.attributes.normal.array);
  // Split only the longitude seam, retaining the normals from the welded surface.
  const wrapped = new Map();
  for (let t = 0; t < indices.length; t += 3) {
    const a = uvs[indices[t] * 2], b = uvs[indices[t + 1] * 2], c = uvs[indices[t + 2] * 2];
    if (Math.max(a, b, c) - Math.min(a, b, c) < 0.5) continue;
    for (let j = t; j < t + 3; j++) {
      const i = indices[j];
      if (uvs[i * 2] >= 0.5) continue;
      if (!wrapped.has(i)) {
        wrapped.set(i, positions.length / 3);
        for (const array of [positions, colors, normals]) array.push(array[i * 3], array[i * 3 + 1], array[i * 3 + 2]);
        uvs.push(1 + uvs[i * 2], uvs[i * 2 + 1]);
      }
      indices[j] = wrapped.get(i);
    }
  }
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeBoundingSphere();
  return geometry;
}

export class AsteroidArt {
  constructor(anisotropy) {
    this.anisotropy = Math.min(4, anisotropy);
    this.shapes = tones.map((_, i) => provisionalShape(i));
    this.material = new THREE.MeshStandardMaterial({
      color: 0xf4f4f4, vertexColors: true, roughness: 0.97, metalness: 0.015, envMapIntensity: 0.12,
      map: solidTexture([126, 124, 122, 255], THREE.SRGBColorSpace),
      normalMap: solidTexture([128, 128, 255, 255], THREE.NoColorSpace),
      normalScale: new THREE.Vector2(1.15, 1.15),
    });
  }

  async loadTexture(file, key) {
    const texture = await new THREE.TextureLoader().loadAsync(asset(file));
    if (key === 'map') texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
    texture.anisotropy = this.anisotropy;
    this.material[key].dispose();
    this.material[key] = texture;
  }

  async loadShapes() {
    const response = await fetch(asset('radar-v1.json'));
    if (!response.ok) throw Error('Asteroid shapes ' + response.status);
    const bodies = await response.json();
    if (bodies.length !== this.shapes.length) throw Error('Incomplete asteroid shapes');
    bodies.forEach((body, i) => {
      // Visible meteors, rock batches and the model pool share these handles.
      const geometry = radarGeometry(body, tones[i]), target = this.shapes[i];
      target.dispose();
      target.setIndex(geometry.index);
      for (const [name, attribute] of Object.entries(geometry.attributes)) target.setAttribute(name, attribute);
      target.boundingSphere = geometry.boundingSphere;
      target.boundingBox = null;
      target.name = body.name;
    });
  }

  load() {
    if (!this.ready) {
      this.ready = Promise.allSettled([
        this.loadShapes(), this.loadTexture('regolith-v1.webp', 'map'), this.loadTexture('fractures-v1.webp', 'normalMap'),
      ]).then(results => results.every(result => result.status === 'fulfilled'));
    }
    return this.ready;
  }
}
