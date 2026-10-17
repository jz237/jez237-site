// Volumetric lamp light in the damp night air (EXTERIOR graphics pass 2026-10-16). No real lights: additive shading.
//  * cobra heads: a soft cone of light under every head (the lamp's tilted beam), brightest near the head (1/r^2),
//    a low ground-mist layer glowing where the beam reaches the street, drifting 3D noise (mist), forward scatter
//    (Henyey-Greenstein) so the cones glow when the camera looks toward the lamp. The rain streaks (props/rain.js lamp
//    columns) fall through them.
//  * lit porch lanterns: a glow dome in front of the wall.
// One merged mesh (world space, one draw call, one program). Per pixel, the view ray's segment inside the volume is
// integrated with equi-angular sampling around the lamp (the samples sit where the in-scattering is), clipped by the
// ground plane and by the facades on both sides of the street (no glow through walls). Camera outside a volume: its
// front faces (depth-tested against the scene: anything in front hides it) start the segment; camera inside: its back
// faces end it (the base disc lies on the ground). Lamp intensity per frame = colour x k(t) (the failing lamp's
// flicker drives its cone exactly like its halo), set by update().
import * as THREE from 'three';

export const VOL_MAX = 24;

// Keep an additive / transparent effect mesh out of override-material passes (the post chain's GTAO normal/depth pass
// and the medium-tier depth prepass draw the scene with scene.overrideMaterial: a glow volume or a halo quad would go
// in as a solid surface -> dark AO shapes and wrong DOF depth). The draw range is emptied for any material but the
// mesh's own and restored right after the draw.
export function skipOverridePasses(mesh) {
  const own = mesh.material;
  mesh.onBeforeRender = (r, s, c, geometry, material) => { if (material !== own) geometry.drawRange.count = 0; };
  mesh.onAfterRender = (r, s, c, geometry) => { geometry.drawRange.count = Infinity; };
  return mesh;
}

const SAMPLES = { high: 4, medium: 3, low: 0 };

function coneGeometry(apex, axis, angle, groundY, maxLen, seg = 28) {
  // generators at `angle` around the axis, cut by the ground plane (or maxLen), closed by a fan base
  const up = Math.abs(axis.y) < 0.95 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const u = new THREE.Vector3().crossVectors(axis, up).normalize();
  const v = new THREE.Vector3().crossVectors(axis, u).normalize();
  const ring = [];
  const g = new THREE.Vector3();
  for (let k = 0; k < seg; k++) {
    const phi = (k / seg) * Math.PI * 2;
    g.copy(axis).multiplyScalar(Math.cos(angle))
      .addScaledVector(u, Math.sin(angle) * Math.cos(phi)).addScaledVector(v, Math.sin(angle) * Math.sin(phi)).normalize();
    let t = maxLen;
    if (g.y < -1e-3) t = Math.min(t, (groundY - apex.y) / g.y);
    ring.push(apex.clone().addScaledVector(g, Math.max(0.5, t)));
  }
  const c = new THREE.Vector3();
  for (const p of ring) c.add(p);
  c.multiplyScalar(1 / ring.length);
  const pos = [];
  for (let k = 0; k < seg; k++) {
    const a = ring[k], b = ring[(k + 1) % seg];
    pos.push(apex.x, apex.y, apex.z, b.x, b.y, b.z, a.x, a.y, a.z);   // side (outward-facing, CCW from outside)
    pos.push(c.x, c.y, c.z, a.x, a.y, a.z, b.x, b.y, b.z);             // base
  }
  return pos;
}

function domeGeometry(center, n, R, segU = 20, segV = 8) {
  // hemisphere toward n, closed by a disc on the wall plane
  const up = Math.abs(n.y) < 0.95 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const u = new THREE.Vector3().crossVectors(n, up).normalize();
  const v = new THREE.Vector3().crossVectors(n, u).normalize();
  const P = (i, j) => {
    const th = (j / segV) * Math.PI / 2;          // 0 = pole (along n) .. pi/2 = rim
    const ph = (i / segU) * Math.PI * 2;
    return center.clone().addScaledVector(n, R * Math.cos(th)).addScaledVector(u, R * Math.sin(th) * Math.cos(ph))
      .addScaledVector(v, R * Math.sin(th) * Math.sin(ph));
  };
  const pos = [];
  const push = (a, b, c) => pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  for (let j = 0; j < segV; j++) {
    for (let i = 0; i < segU; i++) {
      const a = P(i, j), b = P(i + 1, j), c = P(i, j + 1), d = P(i + 1, j + 1);
      push(a, c, b); push(b, c, d);
    }
  }
  for (let i = 0; i < segU; i++) push(center, P(i + 1, segV), P(i, segV));
  return pos;
}

export function buildVolumes(lamps, { groundY, quality = 'high' } = {}) {
  const pos = [];
  const ids = [];
  const vols = [];
  const uVA = Array.from({ length: VOL_MAX }, () => new THREE.Vector4(0, -1000, 0, 0));
  const uVB = Array.from({ length: VOL_MAX }, () => new THREE.Vector4(0, -1, 0, 0.5));
  const uVC = Array.from({ length: VOL_MAX }, () => new THREE.Vector4(0.9, -1000, 0, 0));
  const uVD = Array.from({ length: VOL_MAX }, () => new THREE.Vector4(1, 0, 0, 0));
  const uVCol = Array.from({ length: VOL_MAX }, () => new THREE.Vector3());
  const MESH_ANGLE = 0.74, OUTER = 0.68, INNER = 0.47, MAXLEN = 15;
  for (const e of lamps) {
    if (vols.length >= VOL_MAX) break;
    if (e.kind === 'cobra') {
      const apex = e.lightPos.clone();
      const axis = e.dir.clone().normalize();
      // highest ground under the footprint (the base disc must sit on / above every ground point it covers)
      const tt = (apex.y - groundY(apex.x, apex.z, apex.y - 8)) / Math.max(0.3, -axis.y);
      const foot = apex.clone().addScaledVector(axis, tt);
      let gTop = -1e9;
      for (let dx = -6; dx <= 6; dx += 1.5) for (let dz = -6; dz <= 6; dz += 1.5) gTop = Math.max(gTop, groundY(foot.x + dx, foot.z + dz, -1e9));
      if (gTop < -1e8) gTop = apex.y - 8;
      gTop += 0.05;
      const arm = new THREE.Vector2(axis.x, axis.z);
      if (arm.lengthSq() < 1e-6) arm.set(-Math.sign(apex.x || 1), 0);
      arm.normalize();
      const i = vols.length;
      const p = coneGeometry(apex, axis, MESH_ANGLE, gTop, MAXLEN);
      pos.push(...p);
      for (let k = 0; k < p.length / 3; k++) ids.push(i);
      uVA[i].set(apex.x, apex.y, apex.z, 0);
      uVB[i].set(axis.x, axis.y, axis.z, Math.cos(OUTER));
      // facades: ~4.1 m behind the head (pole side), ~7.2 m in front (across the street)
      uVC[i].set(Math.cos(INNER), gTop, 4.1, 7.2);
      uVD[i].set(arm.x, arm.y, Math.cos(MESH_ANGLE), MAXLEN);
      vols.push({ e, i, kind: 'cobra', gain: 1.0 });
    } else if (e.lit && e.intensity > 0) {
      const base = e.base ? e.base : null;
      const n = base ? new THREE.Vector3(e.lightPos.x - base.x, 0, e.lightPos.z - base.z) : new THREE.Vector3(0, 0, 1);
      if (n.lengthSq() < 1e-6) n.set(0, 0, 1);
      n.normalize();
      const R = 2.3;
      const wallPt = base ? new THREE.Vector3(base.x, e.lightPos.y, base.z).addScaledVector(n, 0.04) : e.lightPos.clone().addScaledVector(n, -0.15);
      const i = vols.length;
      const p = domeGeometry(wallPt, n, R);
      pos.push(...p);
      for (let k = 0; k < p.length / 3; k++) ids.push(i);
      const gy = groundY(e.lightPos.x + n.x * 1.0, e.lightPos.z + n.z * 1.0, e.lightPos.y - 2.4);
      uVA[i].set(e.lightPos.x, e.lightPos.y, e.lightPos.z, 1);
      uVB[i].set(n.x, n.y, n.z, 0);
      uVC[i].set(R, gy, wallPt.dot(n), 0);
      vols.push({ e, i, kind: 'porch', gain: 1.0 });
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('aVol', new THREE.Float32BufferAttribute(ids, 1));
  geo.computeBoundingSphere();
  const uniforms = {
    uVA: { value: uVA }, uVB: { value: uVB }, uVC: { value: uVC }, uVD: { value: uVD }, uVCol: { value: uVCol },
    uTime: { value: 0 }, uVolK: { value: 1.0 },
  };
  const ns = SAMPLES[quality] ?? SAMPLES.high;
  const mat = new THREE.ShaderMaterial({
    name: 'pr_volume',
    uniforms,
    defines: { VOL_MAX, NS: Math.max(1, ns) },
    transparent: true, depthWrite: false, depthTest: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    fog: false, toneMapped: true,
    vertexShader: /* glsl */ `
      uniform vec4 uVA[ VOL_MAX ];
      uniform vec4 uVB[ VOL_MAX ];
      uniform vec4 uVC[ VOL_MAX ];
      uniform vec4 uVD[ VOL_MAX ];
      attribute float aVol;
      varying vec3 vW;
      varying float vId;
      varying float vIn;
      void main() {
        int id = int( aVol + 0.5 );
        vec4 A = uVA[ id ], B = uVB[ id ], C = uVC[ id ], D = uVD[ id ];
        vec3 cp = cameraPosition;
        float inside;
        if ( A.w < 0.5 ) {
          vec3 d = cp - A.xyz; float l = length( d );
          inside = ( dot( d, B.xyz ) > D.z * l && cp.y > C.y && l < D.w ) ? 1.0 : 0.0;
        } else {
          inside = ( length( cp - A.xyz ) < C.x && dot( cp, B.xyz ) > C.z ) ? 1.0 : 0.0;
        }
        vIn = inside;
        vId = aVol;
        vW = position;
        gl_Position = projectionMatrix * viewMatrix * vec4( position, 1.0 );
      }`,
    fragmentShader: /* glsl */ `
      uniform vec4 uVA[ VOL_MAX ];
      uniform vec4 uVB[ VOL_MAX ];
      uniform vec4 uVC[ VOL_MAX ];
      uniform vec4 uVD[ VOL_MAX ];
      uniform vec3 uVCol[ VOL_MAX ];
      uniform float uTime;
      uniform float uVolK;
      varying vec3 vW;
      varying float vId;
      varying float vIn;
      float vh( vec3 p ) { p = fract( p * 0.3183099 + 0.1 ); p *= 17.0; return fract( p.x * p.y * p.z * ( p.x + p.y + p.z ) ); }
      float vn3( vec3 x ) {
        vec3 i = floor( x ), f = fract( x ); f = f * f * ( 3.0 - 2.0 * f );
        return mix( mix( mix( vh( i ), vh( i + vec3( 1.0, 0.0, 0.0 ) ), f.x ), mix( vh( i + vec3( 0.0, 1.0, 0.0 ) ), vh( i + vec3( 1.0, 1.0, 0.0 ) ), f.x ), f.y ),
                    mix( mix( vh( i + vec3( 0.0, 0.0, 1.0 ) ), vh( i + vec3( 1.0, 0.0, 1.0 ) ), f.x ), mix( vh( i + vec3( 0.0, 1.0, 1.0 ) ), vh( i + vec3( 1.0, 1.0, 1.0 ) ), f.x ), f.y ), f.z );
      }
      void main() {
        int id = int( vId + 0.5 );
        bool inside = vIn > 0.5;
        if ( inside == gl_FrontFacing ) discard;
        vec3 col = uVCol[ id ];
        if ( col.r + col.g + col.b < 1e-6 ) discard;
        vec4 A = uVA[ id ], B = uVB[ id ], C = uVC[ id ], D = uVD[ id ];
        vec3 ro = cameraPosition;
        vec3 dv = vW - ro; float tw = length( dv ); vec3 rd = dv / tw;
        float t0 = inside ? 0.0 : tw;
        float t1 = inside ? tw : tw + 40.0;
        if ( rd.y < -1e-4 ) t1 = min( t1, ( C.y - ro.y ) / rd.y );
        if ( A.w < 0.5 ) {
          // facades on both sides of the street (slab along the arm direction)
          float s0 = dot( ro.xz - A.xz, D.xy ), sd = dot( rd.xz, D.xy );
          if ( abs( sd ) > 1e-5 ) {
            float ta = ( - C.z - s0 ) / sd, tb = ( C.w - s0 ) / sd;
            t0 = max( t0, min( ta, tb ) ); t1 = min( t1, max( ta, tb ) );
          } else if ( s0 < - C.z || s0 > C.w ) discard;
        } else {
          // the street side of the wall, inside the dome radius
          float s0 = dot( ro, B.xyz ) - C.z, sd = dot( rd, B.xyz );
          if ( abs( sd ) > 1e-5 ) { float tp = - s0 / sd; if ( sd < 0.0 ) t1 = min( t1, tp ); else t0 = max( t0, tp ); }
          vec3 oc = ro - A.xyz; float bq = dot( oc, rd ), cq = dot( oc, oc ) - C.x * C.x, disc = bq * bq - cq;
          if ( disc <= 0.0 ) discard;
          float sq = sqrt( disc );
          t0 = max( t0, - bq - sq ); t1 = min( t1, - bq + sq );
        }
        t0 = max( t0, 0.0 );
        if ( t1 <= t0 + 1e-3 ) discard;
        vec3 L = A.xyz;
        float tc = dot( L - ro, rd );
        // in-scattering falls off as 1 / ( r^2 + r0^2 ): a soft core at the head instead of a hot point (the halos
        // already glow there), so the beam body reads. Equi-angular sampling handles it with h' = sqrt( h^2 + r0^2 ).
        float r0 = A.w < 0.5 ? 1.2 : 0.3;
        float hd = sqrt( dot( ro + rd * tc - L, ro + rd * tc - L ) + r0 * r0 );
        float a0 = atan( ( t0 - tc ) / hd ), a1 = atan( ( t1 - tc ) / hd );
        float acc = 0.0;
        const float G = 0.22;
        for ( int i = 0; i < NS; i ++ ) {
          float u = ( float( i ) + 0.5 ) / float( NS );
          float t = tc + hd * tan( mix( a0, a1, u ) );
          vec3 p = ro + rd * t;
          vec3 lp = p - L; float r = max( length( lp ), 1e-3 ); vec3 ld = lp / r;
          float prof;
          if ( A.w < 0.5 ) prof = smoothstep( B.w, C.x, dot( ld, B.xyz ) );
          else prof = smoothstep( -0.2, 0.35, dot( ld, B.xyz ) ) * ( 1.0 - smoothstep( C.x * 0.45, C.x, r ) );
          float h = p.y - C.y;
          vec3 q = p * vec3( 0.55, 0.8, 0.55 ) + vec3( uTime * 0.09, - uTime * 0.04, uTime * 0.06 );
          float mist = 0.35 + 0.8 * vn3( q ) + 0.45 * vn3( q * 2.7 + 5.3 );
          float lowM = 1.0 + 2.2 * exp( - max( h, 0.0 ) * 1.5 );
          float cs = dot( ld, - rd );
          float ph = 0.18 + ( 1.0 - G * G ) / pow( 1.0 + G * G - 2.0 * G * cs, 1.5 );
          // artistic: the beam body falls off slower than 1 / r^2 (x (r^2 + r0^2)^0.3), so the cone reads below the head
          float body = A.w < 0.5 ? pow( r * r + r0 * r0, 0.3 ) : 1.0;
          acc += prof * mist * lowM * ph * body * smoothstep( -0.05, 0.12, h );
        }
        float I = ( a1 - a0 ) / hd * acc / float( NS );
        gl_FragColor = vec4( col * I * uVolK, 1.0 );
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  mat.forceSinglePass = true;   // both faces in one draw (the shader picks front or back per volume)
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'LampVolumes';
  mesh.frustumCulled = false;
  mesh.renderOrder = 4;
  mesh.matrixAutoUpdate = false;
  mesh.visible = ns > 0;
  mesh.userData.noAO = true;
  skipOverridePasses(mesh);
  const K = { cobra: 1.6e-4, porch: 1.4e-3 };
  function update(t) {
    uniforms.uTime.value = t;
    for (const v of vols) {
      const e = v.e;
      const k = (e.lit ? e.k(t) : 0) * (v.kind === 'cobra' ? K.cobra : K.porch) * e.intensity * v.gain;
      uVCol[v.i].set(e.color.r * k, e.color.g * k, e.color.b * k);
    }
  }
  function setQuality(q) {
    const n = SAMPLES[q] ?? SAMPLES.high;
    mesh.visible = n > 0;
    if (n > 0 && mat.defines.NS !== n) { mat.defines.NS = n; mat.needsUpdate = true; }
  }
  function setStrength(cobra = 1.6e-4, porch = 1.4e-3) { K.cobra = cobra; K.porch = porch; }
  return { mesh, update, setQuality, setStrength, vols, uniforms, K };
}
