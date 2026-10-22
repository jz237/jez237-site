import * as T from "three";
const PI = Math.PI,
  clamp = T.MathUtils.clamp;
export const uniforms = {
  uTime: { value: 0 },
  uFlare: { value: 1 },
  uMotion: { value: 1 },
};
const shared = `uniform float uTime; uniform float uFlare; uniform float uMotion;
vec3 swim(vec3 p){float a=smoothstep(-1.3,2.8,p.x);p.z+=sin(p.x*1.9-uTime*1.65)*(.035+.19*a*a)*a;p.y+=sin(p.x*1.4-uTime*1.2)*.025*a;return p;}`;
const project = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
 mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
 mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition.xyz = swim(mvPosition.xyz);
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`;
function animateMaterial(mat, fin = false, kind = 0) {
  mat.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, uniforms);
    s.vertexShader =
      shared +
      "\nvarying vec2 vFishUV;\n" +
      (fin ? "attribute vec3 root;\n" : "") +
      s.vertexShader;
    s.vertexShader = s.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>\nvFishUV=uv;${fin ? `transformed=mix(root,transformed,uFlare);float wave=pow(uv.y,1.65);transformed.z+=wave*(sin(uv.x*17.0-uTime*2.1+uv.y*6.0)*.065+sin(uv.x*36.0+uv.y*11.0-uTime*2.6)*.022);transformed.y+=wave*sin(uv.x*12.0-uTime*1.8)*.022;` : ""}`,
    );
    s.vertexShader = s.vertexShader.replace(
      "#include <project_vertex>",
      project,
    );
    s.fragmentShader = "varying vec2 vFishUV;\n" + s.fragmentShader;
    if (fin)
      s.fragmentShader = s.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
{ float u=vFishUV.x;float v=vFishUV.y;
float n=${kind === 3 ? "18.0" : kind === 2 ? "29.0" : "36.0"};
float branch=mix(n,n*2.0,smoothstep(.40,.49,v));branch=mix(branch,n*4.0,smoothstep(.73,.80,v));
float mainSignal=abs(sin(u*n*3.14159265+sin(v*6.0+u*9.0)*.18));float mainRay=1.0-smoothstep(.10,.20+fwidth(mainSignal),mainSignal);
float raySignal=abs(sin(u*branch*3.14159265+sin(v*8.0)*.12));float rays=1.0-smoothstep(.04,.09+fwidth(raySignal),raySignal);
float fineSignal=abs(sin(u*n*12.56637+v*.8));float fine=(1.0-smoothstep(.03,.07+fwidth(fineSignal),fineSignal))*.45;
vec3 red=mix(vec3(.10,.004,.014),vec3(.27,.009,.029),smoothstep(.13,.70,v));
red*=.80+.20*sin(u*25.0+v*5.0);
vec3 base=mix(vec3(.008,.15,.19),red,smoothstep(.06,.43,v));
base=mix(base,vec3(.008,.095,.125),mainRay*.82+rays*.20);
base+=vec3(.08,.07,.065)*fine*.26;
float edge=smoothstep(.982,1.0,v);base=mix(base,vec3(.20,.32,.34),edge*.60);
${kind === 3 ? "base=mix(base,vec3(.18,.32,.32),.48);" : ""}
diffuseColor.rgb=base; diffuseColor.a*= ${kind === 3 ? ".47" : ".79"}+.14*mainRay+.05*rays; }`,
      );
  };
  mat.customProgramCacheKey = () => `fish-${fin}-${kind}`;
  return mat;
}
function material(opts = {}) {
  return animateMaterial(
    new T.MeshPhysicalMaterial({
      color: 0x0b5260,
      metalness: 0.42,
      roughness: 0.43,
      clearcoat: 0.22,
      clearcoatRoughness: 0.34,
      iridescence: 0.55,
      iridescenceIOR: 1.34,
      iridescenceThicknessRange: [190, 420],
      ...opts,
    }),
  );
}
// Cross sections traced from the lateral, three-quarter and attachment references.
const profile = [
  [-1.68, 0.045, 0.076, 0.085],
  [-1.59, 0.05, 0.145, 0.135],
  [-1.43, 0.055, 0.225, 0.183],
  [-1.2, 0.065, 0.32, 0.247],
  [-0.95, 0.075, 0.38, 0.281],
  [-0.64, 0.085, 0.401, 0.278],
  [-0.29, 0.08, 0.372, 0.25],
  [0.08, 0.075, 0.311, 0.211],
  [0.42, 0.065, 0.232, 0.164],
  [0.76, 0.055, 0.148, 0.112],
  [1.04, 0.05, 0.109, 0.077],
];
function section(x) {
  let i = 0;
  while (i < profile.length - 2 && profile[i + 1][0] < x) i++;
  const a = profile[i],
    b = profile[i + 1],
    t = clamp((x - a[0]) / (b[0] - a[0]), 0, 1),
    s = t * t * (3 - 2 * t);
  return [
    T.MathUtils.lerp(a[1], b[1], s),
    T.MathUtils.lerp(a[2], b[2], s),
    T.MathUtils.lerp(a[3], b[3], s),
  ];
}
function bodyPoint(x, a, extra = 0) {
  const [y, ry, rz] = section(x);
  return new T.Vector3(
    x,
    y + Math.cos(a) * (ry + extra),
    Math.sin(a) * (rz + extra),
  );
}
function bodyGeometry() {
  const p = [],
    uv = [],
    idx = [],
    nx = 150,
    ny = 80;
  for (let i = 0; i <= nx; i++) {
    const x = T.MathUtils.lerp(-1.68, 1.04, i / nx);
    for (let j = 0; j <= ny; j++) {
      const a = (j / ny) * PI * 2;
      const q = bodyPoint(x, a);
      p.push(q.x, q.y, q.z);
      uv.push(i / nx, j / ny);
    }
  }
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++) {
      const a = i * (ny + 1) + j,
        b = a + ny + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
  const front = p.length / 3;
  p.push(-1.689, 0.045, 0);
  uv.push(0, 0.5);
  const end = p.length / 3;
  p.push(1.04, 0.05, 0);
  uv.push(1, 0.5);
  for (let j = 0; j < ny; j++) {
    idx.push(front, j + 1, j);
    const a = nx * (ny + 1) + j;
    idx.push(end, a, a + 1);
  }
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.Float32BufferAttribute(p, 3));
  g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
function scaleGeometry() {
  const p = [0, 0, 0.06],
    uv = [0.5, 0.5],
    col = [0.75, 0.95, 0.98],
    idx = [],
    rings = 5,
    n = 18;
  for (let r = 1; r <= rings; r++)
    for (let j = 0; j <= n; j++) {
      const a = (j / n) * PI * 2,
        k = r / rings,
        xx = Math.cos(a);
      p.push(
        k * (xx * 0.55 + 0.1 * (1 - xx * xx)),
        Math.sin(a) * k * 0.5,
        0.06 * (1 - k * k) + 0.005 * Math.sin(a * 2) * k,
      );
      uv.push(xx * k * 0.5 + 0.5, Math.sin(a) * k * 0.5 + 0.5);
      const c = 1 - 0.68 * k ** 6;
      col.push(c * 0.72, c * 0.94, c);
    }
  for (let j = 0; j < n; j++) idx.push(0, 1 + j, 2 + j);
  for (let r = 0; r < rings - 1; r++)
    for (let j = 0; j < n; j++) {
      const a = 1 + r * (n + 1) + j,
        b = a + n + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.Float32BufferAttribute(p, 3));
  g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
  g.setAttribute("color", new T.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
function surfaceSeam(points, r, mat) {
  const projected = points.map(([x, y, z]) => {
    const [cy, ry, rz] = section(x);
    return [
      x,
      y,
      Math.sign(z) *
        (rz * Math.sqrt(Math.max(0.01, 1 - ((y - cy) / ry) ** 2)) + 0.002),
    ];
  });
  return tube(projected, r, mat);
}
function tube(points, r, mat, segments = 60) {
  const curve = new T.CatmullRomCurve3(points.map((p) => new T.Vector3(...p)));
  return new T.Mesh(new T.TubeGeometry(curve, segments, r, 7, false), mat);
}
function addFin(group, fn, kind = 0, nu = 192, nv = 65) {
  const p = [],
    roots = [],
    uv = [],
    idx = [];
  for (let i = 0; i <= nu; i++)
    for (let j = 0; j <= nv; j++) {
      const u = i / nu,
        v = j / nv,
        q = fn(u, v),
        r = fn(u, 0);
      p.push(...q);
      roots.push(...r);
      uv.push(u, v);
    }
  for (let i = 0; i < nu; i++)
    for (let j = 0; j < nv; j++) {
      const a = i * (nv + 1) + j,
        b = a + nv + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.Float32BufferAttribute(p, 3));
  g.setAttribute("root", new T.Float32BufferAttribute(roots, 3));
  g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  const m = animateMaterial(
    new T.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.63,
      clearcoat: 0.1,
      clearcoatRoughness: 0.48,
      iridescence: 0.12,
      iridescenceThicknessRange: [220, 350],
      transmission: 0.07,
      thickness: 0.012,
      transparent: true,
      opacity: 1,
      side: T.DoubleSide,
      depthWrite: false,
    }),
    true,
    kind,
  );
  const mesh = new T.Mesh(g, m);
  mesh.frustumCulled = false;
  mesh.renderOrder = kind === 3 ? 3 : 2;
  group.add(mesh);
  return mesh;
}
export function createBetta() {
  const fish = new T.Group();
  fish.name = "Betta splendens";
  const bodyMat = material({
    color: 0x063943,
    metalness: 0.48,
    roughness: 0.39,
  });
  const body = new T.Mesh(bodyGeometry(), bodyMat);
  fish.add(body);
  const sg = scaleGeometry(),
    sm = material({
      color: 0xffffff,
      vertexColors: true,
      metalness: 0.58,
      roughness: 0.41,
      iridescence: 0.82,
      clearcoat: 0.18,
    });
  const originalCompile = sm.onBeforeCompile;
  sm.onBeforeCompile = (sh) => {
    originalCompile(sh);
    sh.fragmentShader = sh.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
{vec2 st=vFishUV*vec2(64.,48.);float grain=fract(sin(dot(floor(st),vec2(12.9898,78.233)))*43758.5453);float rings=sin(length((vFishUV-vec2(.33,.5))*vec2(1.,1.3))*140.);diffuseColor.rgb*=.77+.30*grain+.035*rings;}`,
    );
  };
  sm.customProgramCacheKey = () => "betta-micro-scales";
  const cols = 63,
    rows = 42,
    count = cols * rows;
  const scales = new T.InstancedMesh(sg, sm, count);
  scales.frustumCulled = false;
  const matrix = new T.Matrix4(),
    q = new T.Quaternion(),
    basis = new T.Matrix4();
  let k = 0;
  const c = new T.Color();
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      const x =
        -1.53 + (i / (cols - 1)) * 2.53 + ((j % 2) * 0.5 - 0.25) * 0.042;
      const a = ((j + (i % 2) * 0.5) / rows) * 2 * PI;
      const [cy, ry, rz] = section(x);
      const pos = bodyPoint(x, a, 0.002);
      const n = new T.Vector3(
        0,
        Math.cos(a) / ry,
        Math.sin(a) / rz,
      ).normalize();
      const axis = new T.Vector3(1, 0, 0),
        side = new T.Vector3().crossVectors(n, axis).normalize();
      basis.makeBasis(axis, side, n);
      q.setFromRotationMatrix(basis);
      const face = clamp((x + 1.5) / 0.5, 0, 1),
        size = 0.7 + 0.3 * face;
      const circumference = 2 * PI * Math.sqrt((ry * ry + rz * rz) / 2);
      matrix.compose(
        pos,
        q,
        new T.Vector3(
          0.069 * size,
          (circumference / rows) * 1.22,
          0.032 * size,
        ),
      );
      scales.setMatrixAt(k, matrix);
      const rnd = Math.sin(i * 78.23 + j * 42.17) * 0.5 + 0.5;
      const dorsal = (Math.cos(a) + 1) * 0.5;
      const belly = 1 - Math.abs(Math.sin(a));
      c.setHSL(0.505 + 0.055 * rnd + 0.016 * dorsal, 0.72, 0.13 + 0.11 * rnd);
      c.multiplyScalar((0.55 + 0.45 * face) * (1 - 0.35 * belly));
      scales.setColorAt(k++, c);
    }
  scales.instanceMatrix.needsUpdate = true;
  fish.add(scales);
  // A true three-dimensional fan. The radial ridges and edge are geometry, not a billboard.
  addFin(
    fish,
    (u, v) => {
      const a = (u - 0.5) * PI * 1.04,
        edge =
          1 + 0.009 * Math.sin(u * PI * 148) + 0.018 * Math.sin(u * PI * 26);
      const r = 0.105 + v * 1.49 * edge;
      return [
        0.91 + Math.cos(a) * r,
        0.05 + Math.sin(a) * r * 0.93,
        Math.pow(v, 1.45) *
          (0.0035 * Math.sin(u * PI * 72) +
            0.075 * Math.sin(u * PI * 10 + v * 5)),
      ];
    },
    0,
  );
  addFin(
    fish,
    (u, v) => {
      const x = -0.62 + u * 1.62,
        [cy, ry] = section(x),
        h = Math.pow(Math.sin(PI * u), 0.48) * (0.74 + 0.18 * u);
      return [
        x + v * (0.2 + 0.28 * u),
        cy + ry + v * h * (1 + 0.015 * Math.sin(u * PI * 92)),
        0.008 +
          v ** 1.4 *
            (0.003 * Math.sin(u * PI * 54) +
              0.055 * Math.sin(u * PI * 8 + v * 4)),
      ];
    },
    1,
    144,
    52,
  );
  addFin(
    fish,
    (u, v) => {
      const x = -1.02 + u * 2.04,
        [cy, ry] = section(x),
        h = Math.pow(Math.sin(PI * u * 0.93), 0.35) * (0.5 + 0.82 * u);
      return [
        x + v * (0.04 + 0.55 * u),
        cy - ry - v * h * (1 + 0.015 * Math.sin(u * PI * 104)),
        v ** 1.4 *
          (0.003 * Math.sin(u * PI * 58) +
            0.055 * Math.sin(u * PI * 9 + v * 3)),
      ];
    },
    2,
    168,
    60,
  );
  // The paired pelvic filaments, each separately shaped in space.
  for (const s of [-1, 1]) {
    addFin(
      fish,
      (u, v) => {
        const root = [-0.99 + 0.13 * u, -0.22, s * 0.16],
          bend = v * v;
        return [
          -0.94 + 0.51 * bend + (u - 0.5) * 0.2 * Math.pow(1 - v, 1.5),
          root[1] - v * (1.32 + 0.05 * s),
          root[2] +
            s * (0.12 * Math.sin(v * PI)) +
            0.018 * Math.sin(v * 10 + u * 3) * v,
        ];
      },
      2,
      38,
      65,
    );
  }
  const pectorals = [];
  for (const s of [-1, 1]) {
    const f = addFin(
      fish,
      (u, v) => {
        const a = -1.1 + u * 2.0;
        return [
          -0.91 + Math.cos(a) * v * 0.43,
          -0.055 + Math.sin(a) * v * 0.4,
          s * (0.27 + v * 0.22) + 0.012 * Math.sin(u * PI * 36) * v,
        ];
      },
      3,
      72,
      35,
    );
    pectoralVisibility(f, s);
    pectorals.push(f);
  }
  function pectoralVisibility(f, s) {
    f.userData.side = s;
  }
  // Sculpted operculum, dark seam and reflective rim on both sides.
  const faceScales = new T.InstancedMesh(sg, sm, 900);
  let fk = 0;
  for (let i = 0; i < 20; i++)
    for (let j = 0; j < 45; j++) {
      const x = -1.665 + (i / 19) * 0.225,
        a = ((j + (i % 2) * 0.5) / 45) * 2 * PI,
        [cy, ry, rz] = section(x),
        pos = bodyPoint(x, a, 0.0015);
      const n = new T.Vector3(
          0,
          Math.cos(a) / ry,
          Math.sin(a) / rz,
        ).normalize(),
        axis = new T.Vector3(1, 0, 0),
        side = new T.Vector3().crossVectors(n, axis).normalize();
      basis.makeBasis(axis, side, n);
      q.setFromRotationMatrix(basis);
      matrix.compose(
        pos,
        q,
        new T.Vector3(
          0.023,
          ((2 * PI * Math.sqrt((ry * ry + rz * rz) / 2)) / 45) * 1.2,
          0.014,
        ),
      );
      faceScales.setMatrixAt(fk, matrix);
      c.setHSL(
        0.53 + 0.03 * Math.sin(i * 5 + j),
        0.62,
        0.07 + 0.03 * Math.sin(i + j * 13) ** 2,
      );
      faceScales.setColorAt(fk++, c);
    }
  faceScales.instanceMatrix.needsUpdate = true;
  fish.add(faceScales);
  const gills = [];
  for (const s of [-1, 1]) {
    const seam = surfaceSeam(
      [
        [-1.15, 0.35, s * 0.192],
        [-1.04, 0.27, s * 0.248],
        [-0.98, 0.1, s * 0.286],
        [-1.04, -0.1, s * 0.265],
        [-1.23, -0.21, s * 0.191],
      ],
      0.005,
      material({
        color: 0x03171c,
        metalness: 0.15,
        roughness: 0.65,
        iridescence: 0,
      }),
    );
    fish.add(seam);
    gills.push(seam);
    const rim = surfaceSeam(
      [
        [-1.135, 0.34, s * 0.199],
        [-1.02, 0.25, s * 0.258],
        [-0.958, 0.08, s * 0.296],
        [-1.02, -0.115, s * 0.275],
        [-1.22, -0.224, s * 0.192],
      ],
      0.003,
      material({
        color: 0x12474d,
        metalness: 0.4,
        roughness: 0.4,
        iridescence: 0.3,
      }),
    );
    fish.add(rim);
    gills.push(rim);
    // Black globe, copper iris ring, recessed pupil and wet convex cornea.
    const eye = new T.Group();
    eye.position.set(-1.438, 0.163, s * 0.143);
    eye.rotation.y = s * 0.1;
    const socket = new T.Mesh(
      new T.SphereGeometry(0.085, 40, 28),
      material({ color: 0x041314, metalness: 0.3, roughness: 0.38 }),
    );
    socket.scale.set(1, 1, 0.3);
    eye.add(socket);
    const iris = new T.Mesh(
      new T.SphereGeometry(0.075, 48, 32),
      material({
        color: 0x8c6435,
        metalness: 0.75,
        roughness: 0.24,
        iridescence: 0.18,
      }),
    );
    iris.scale.z = 0.24;
    iris.position.z = s * 0.021;
    eye.add(iris);
    const pupil = new T.Mesh(
      new T.SphereGeometry(0.056, 48, 32),
      material({
        color: 0x010304,
        metalness: 0,
        roughness: 0.18,
        clearcoat: 0.2,
        iridescence: 0,
        envMapIntensity: 0.2,
      }),
    );
    pupil.scale.z = 0.25;
    pupil.position.z = s * 0.037;
    eye.add(pupil);
    const cornea = new T.Mesh(
      new T.SphereGeometry(0.078, 48, 32),
      new T.MeshPhysicalMaterial({
        color: 0xd8ffff,
        transparent: true,
        opacity: 0.055,
        metalness: 0,
        roughness: 0.04,
        clearcoat: 0.2,
        transmission: 0.95,
        ior: 1.34,
        thickness: 0.003,
        depthWrite: false,
      }),
    );
    cornea.scale.z = 0.3;
    cornea.position.z = s * 0.029;
    eye.add(cornea);
    fish.add(eye);
    // Tiny nostril pores above the upturned mouth.
    const pore = new T.Mesh(
      new T.SphereGeometry(0.012, 12, 8),
      material({ color: 0x020c0d, roughness: 0.8 }),
    );
    pore.position.set(-1.594, 0.118, s * 0.092);
    pore.scale.set(0.7, 0.7, 0.4);
    fish.add(pore);
  }
  const lipMat = material({
    color: 0x254347,
    metalness: 0.25,
    roughness: 0.38,
  });
  fish.add(
    tube(
      [
        [-1.625, 0.115, -0.077],
        [-1.692, 0.092, -0.044],
        [-1.706, 0.073, 0],
        [-1.692, 0.092, 0.044],
        [-1.625, 0.115, 0.077],
      ],
      0.008,
      lipMat,
      36,
    ),
  );
  fish.add(
    tube(
      [
        [-1.625, 0.08, -0.075],
        [-1.702, 0.044, -0.036],
        [-1.713, 0.042, 0],
        [-1.702, 0.044, 0.036],
        [-1.625, 0.08, 0.075],
      ],
      0.008,
      lipMat,
      36,
    ),
  );
  fish.add(
    tube(
      [
        [-1.654, 0.085, -0.066],
        [-1.711, 0.058, 0],
        [-1.654, 0.085, 0.066],
      ],
      0.0065,
      material({ color: 0x02090b, roughness: 0.8 }),
      30,
    ),
  );
  // Mandibular crease under the head; not a separate cartoon jaw.
  for (const s of [-1, 1])
    fish.add(
      tube(
        [
          [-1.62, -0.045, s * 0.081],
          [-1.47, -0.13, s * 0.149],
          [-1.3, -0.2, s * 0.18],
        ],
        0.004,
        material({ color: 0x233b3d, metalness: 0.15 }),
        30,
      ),
    );
  fish.userData = {
    scaleCount: count + 900,
    finCount: 7,
    update(t) {
      uniforms.uTime.value = t;
      fish.position.y = Math.sin(t * 0.72) * 0.035;
      fish.rotation.y = 0.11 + Math.sin(t * 0.33) * 0.075;
      fish.rotation.z = Math.sin(t * 0.41) * 0.013;
      for (const f of pectorals) {
        f.position.z = f.userData.side * Math.sin(t * 7.1) * 0.052;
        f.rotation.x = f.userData.side * Math.sin(t * 7.1 + 0.6) * 0.055;
      }
      for (const g of gills)
        g.position.z =
          Math.sign(g.geometry.attributes.position.getZ(0)) *
          (0.002 + Math.sin(t * 2.7) * 0.003);
    },
  };
  return fish;
}
