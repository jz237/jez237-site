/* Ocean Water Lab - demo application.
   Renders the water kit (kit/glsl + kit/js) with raw WebGL2, no libraries. */
(function () {
  'use strict';

  var S = window.WATER_SHADERS;
  var Kit = window.WaterKit;
  var FFTKit = window.WaterFFT;
  var $ = function (id) { return document.getElementById(id); };
  var canvas = $('sea');
  var TEST = location.hash.indexOf('test') >= 0;

  var gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' });
  if (!gl) { document.body.classList.add('nogl'); return; }

  var HDR = location.hash.indexOf('ldr') < 0 && !!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'));
  gl.getExtension('OES_texture_float_linear');
  var SIMS = HDR;                              // ripple and foam buffers need float targets
  var FFT = HDR && !!gl.getExtension('EXT_color_buffer_float') && location.hash.indexOf('gerstner') < 0;   // FFT ocean needs 32-bit float targets; the analytic wave sum is the fallback
  var QUERY_GRID = 5;

  var GEO = 40, DETAIL = 24, TOTAL = GEO + DETAIL;
  var PI = Math.PI, TAU = PI * 2, DEG = PI / 180;
  var ISLAND = [-175, 45];
  var SPLATS = 24;

  // ===========================================================================
  //  small math library
  // ===========================================================================
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function mix(a, b, t) { return a + (b - a) * t; }
  function smoothstep(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

  function perspective(o, fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    for (var i = 0; i < 16; i++) o[i] = 0;
    o[0] = f / aspect; o[5] = f; o[10] = (far + near) * nf; o[11] = -1; o[14] = 2 * far * near * nf;
    return o;
  }
  function lookAt(o, e, c, basis) {
    var fx = c[0] - e[0], fy = c[1] - e[1], fz = c[2] - e[2];
    var l = 1 / Math.hypot(fx, fy, fz); fx *= l; fy *= l; fz *= l;
    var rx = -fz, ry = 0, rz = fx;                       // forward x up(0,1,0)
    l = 1 / Math.hypot(rx, rz); rx *= l; rz *= l;
    var ux = ry * fz - rz * fy, uy = rz * fx - rx * fz, uz = rx * fy - ry * fx;
    o[0] = rx; o[1] = ux; o[2] = -fx; o[3] = 0;
    o[4] = ry; o[5] = uy; o[6] = -fy; o[7] = 0;
    o[8] = rz; o[9] = uz; o[10] = -fz; o[11] = 0;
    o[12] = -(rx * e[0] + ry * e[1] + rz * e[2]);
    o[13] = -(ux * e[0] + uy * e[1] + uz * e[2]);
    o[14] = fx * e[0] + fy * e[1] + fz * e[2];
    o[15] = 1;
    basis.right = [rx, ry, rz]; basis.up = [ux, uy, uz]; basis.fwd = [fx, fy, fz];
    return o;
  }
  function mul4(o, a, b) {
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++)
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    return o;
  }
  // quaternions are [x, y, z, w]
  function qRotate(q, v, o) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var tx = 2 * (y * v[2] - z * v[1]), ty = 2 * (z * v[0] - x * v[2]), tz = 2 * (x * v[1] - y * v[0]);
    o[0] = v[0] + w * tx + (y * tz - z * ty);
    o[1] = v[1] + w * ty + (z * tx - x * tz);
    o[2] = v[2] + w * tz + (x * ty - y * tx);
    return o;
  }
  function qInvRotate(q, v, o) { return qRotate([-q[0], -q[1], -q[2], q[3]], v, o); }
  function qFromAxisAngle(ax, ay, az, ang) {
    var l = Math.hypot(ax, ay, az) || 1, s = Math.sin(ang / 2) / l;
    return [ax * s, ay * s, az * s, Math.cos(ang / 2)];
  }
  function modelMatrix(o, q, p) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    o[0] = 1 - 2 * (y * y + z * z); o[1] = 2 * (x * y + z * w); o[2] = 2 * (x * z - y * w); o[3] = 0;
    o[4] = 2 * (x * y - z * w); o[5] = 1 - 2 * (x * x + z * z); o[6] = 2 * (y * z + x * w); o[7] = 0;
    o[8] = 2 * (x * z + y * w); o[9] = 2 * (y * z - x * w); o[10] = 1 - 2 * (x * x + y * y); o[11] = 0;
    o[12] = p[0]; o[13] = p[1]; o[14] = p[2]; o[15] = 1;
    return o;
  }

  // The island, same formula as terrainHeight() in common.glsl. The tide lowers the
  // land rather than raising the sea, so everything else can keep sea level at 0.
  var tideNow = 0;
  function terrainHeight(x, z) { return terrainRaw(x, z) - tideNow; }
  function terrainRaw(x, z) {
    var qx = x - ISLAND[0], qz = z - ISLAND[1];
    var r = Math.hypot(qx, qz), a = Math.atan2(qz, qx);
    var R = 95 + 22 * Math.sin(3 * a + 0.6) + 12 * Math.sin(5 * a - 1.3) + 7 * Math.sin(8 * a + 2.1);
    if (r < R) { var e = (1 - r / R) * 95; return 0.07 * e + 15 * smoothstep(22, 92, e); }
    var d = r - R;
    return Math.max(-(0.055 * d + 0.0011 * d * d), -70);
  }
  function depthAt(x, z) { return Math.max(-terrainHeight(x, z), 0); }

  // ===========================================================================
  //  GL helpers
  // ===========================================================================
  function compile(type, src, name) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(sh);
      var lines = src.split('\n').map(function (l, i) { return (i + 1) + ': ' + l; });
      var m = /ERROR: \d+:(\d+)/.exec(log);
      var at = m ? parseInt(m[1], 10) : 0;
      throw new Error('Shader "' + name + '" failed to compile:\n' + log + '\n' + lines.slice(Math.max(0, at - 4), at + 3).join('\n'));
    }
    return sh;
  }
  function Program(name, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs, name + '.vert'));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs, name + '.frag'));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Program "' + name + '" failed to link: ' + gl.getProgramInfoLog(p));
    this.p = p; this.cache = {};
  }
  Program.prototype.loc = function (n) {
    if (!(n in this.cache)) this.cache[n] = gl.getUniformLocation(this.p, n);
    return this.cache[n];
  };
  Program.prototype.use = function () { gl.useProgram(this.p); return this; };
  Program.prototype.f = function (n, a, b, c, d) {
    var l = this.loc(n); if (l === null) return this;
    if (d !== undefined) gl.uniform4f(l, a, b, c, d);
    else if (c !== undefined) gl.uniform3f(l, a, b, c);
    else if (b !== undefined) gl.uniform2f(l, a, b);
    else gl.uniform1f(l, a);
    return this;
  };
  Program.prototype.v3 = function (n, v) { var l = this.loc(n); if (l !== null) gl.uniform3f(l, v[0], v[1], v[2]); return this; };
  Program.prototype.i = function (n, v) { var l = this.loc(n); if (l !== null) gl.uniform1i(l, v); return this; };
  Program.prototype.m4 = function (n, m) { var l = this.loc(n); if (l !== null) gl.uniformMatrix4fv(l, false, m); return this; };
  Program.prototype.v4a = function (n, arr) { var l = this.loc(n); if (l !== null) gl.uniform4fv(l, arr); return this; };

  var COLOR_IF = HDR ? gl.RGBA16F : gl.RGBA8;
  var COLOR_TYPE = HDR ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;

  function makeTexture(w, h, internal, format, type, filter, wrap, mips) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    if (mips) gl.texStorage2D(gl.TEXTURE_2D, mips, internal, w, h);
    else gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips ? gl.LINEAR_MIPMAP_LINEAR : filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap[0]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap[1]);
    return t;
  }
  function makeTarget(w, h, withDepth, filter) {
    var CL = [gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE];
    var t = { w: w, h: h, fbo: gl.createFramebuffer(), color: makeTexture(w, h, COLOR_IF, gl.RGBA, COLOR_TYPE, filter || gl.LINEAR, CL), depth: null };
    gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.color, 0);
    if (withDepth) {
      t.depth = makeTexture(w, h, gl.DEPTH_COMPONENT24, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, gl.NEAREST, CL);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, t.depth, 0);
    }
    var st = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (st !== gl.FRAMEBUFFER_COMPLETE) throw new Error('Framebuffer incomplete: 0x' + st.toString(16));
    return t;
  }
  function freeTarget(t) {
    if (!t) return;
    gl.deleteFramebuffer(t.fbo); gl.deleteTexture(t.color); if (t.depth) gl.deleteTexture(t.depth);
  }
  function bindTex(unit, tex) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); }

  // ===========================================================================
  //  shaders
  // ===========================================================================
  var BASE = '#version 300 es\nprecision highp float;\nprecision highp int;\nprecision highp sampler2D;\nprecision highp sampler2DArray;\nprecision highp sampler3D;\nprecision highp sampler2DArrayShadow;\n';
  var HEAD = BASE +
    '#define WATER_GEO_WAVES ' + GEO + '\n#define WATER_DETAIL_WAVES ' + DETAIL + '\n' +
    (HDR ? '' : '#define LDR_TARGETS\n') +
    (SIMS ? '#define WATER_RIPPLES\n#define WATER_FOAM_SIM\n' : '') +
    (FFT ? '#define WATER_FFT\n' : '') +
    (location.hash.indexOf('noplanar') < 0 ? '#define WATER_PLANAR\n' : '') +
    '#define RIPPLE_SPLATS ' + SPLATS + '\n#define FOAM_SPLATS ' + SPLATS + '\n';
  var COMMON = S['common.glsl'], SKY = S['sky.glsl'], SHADE = S['water_shading.glsl'], LIT = S['lit.glsl'];
  var WAVES = FFT ? S['water_cascades.glsl'] : S['water_waves.glsl'];        // surface sampling for every material
  var FSV = HEAD + COMMON + S['fullscreen.vert'];
  var CLOUDS = S['clouds.glsl'];
  var FSV_SKY = HEAD + '#define WITH_SKY\n' + COMMON + SKY + S['fullscreen.vert'];
  var ATM = HEAD + COMMON + S['atmosphere.glsl'];

  var prog = {};
  function buildPrograms() {
    prog.atmTrans = new Program('atm_transmittance', FSV, ATM + S['atm_transmittance.frag']);
    prog.atmMulti = new Program('atm_multi', FSV, ATM + S['atm_multi.frag']);
    prog.atmSky = new Program('atm_skyview', FSV, ATM + S['atm_skyview.frag']);
    prog.cloudNoise = new Program('cloud_noise', FSV, HEAD + COMMON + CLOUDS + S['cloud_noise.frag']);
    prog.cloudWeather = new Program('cloud_weather', FSV, HEAD + S['cloud_weather.frag']);
    prog.cloudPass = new Program('cloud_pass', FSV_SKY, HEAD + COMMON + SKY + CLOUDS + S['cloud_pass.frag']);
    prog.env = new Program('env', FSV_SKY, HEAD + COMMON + SKY + CLOUDS + S['env.frag']);
    prog.background = new Program('background', FSV_SKY, HEAD + COMMON + SKY + S['background.frag']);
    var SUNVIS = '#define WATER_SUN_SHADOW(p) sunVisibility(p)\n';
    var SURF = '#define WATER_SURF\n#define WATER_WEATHER\n', WX = S['water_surf.glsl'] + S['water_weather.glsl'];
    if (TEST && location.hash.indexOf('foamdbg') >= 0) S['ocean.frag'] = S['ocean.frag'].replace(/fragColor = vec4\(encodeHDR\(col\), 1\.0\);\s*}\s*$/,
      'fragColor = vec4(waterSurfFoam(restWorld, sf, footprint), sf.breaking, sf.phase, 1.0); }\n');
    prog.ocean = new Program('ocean', HEAD + SURF + COMMON + WAVES + WX + S['ocean.vert'],
      HEAD + SURF + SUNVIS + COMMON + CLOUDS + S['shadow.glsl'] + WAVES + SHADE + WX + S['ocean.frag']);
    prog.terrain = new Program('terrain', HEAD + S['terrain.vert'], HEAD + COMMON + CLOUDS + S['shadow.glsl'] + WAVES + LIT + S['terrain.frag']);
    prog.object = new Program('object', HEAD + S['object.vert'], HEAD + COMMON + CLOUDS + S['shadow.glsl'] + WAVES + LIT + S['object.frag']);
    if (SIMS) {
      prog.ripple = new Program('ripple', FSV, HEAD + S['ripple_sim.frag']);
      prog.foam = new Program('foam', FSV, HEAD + '#define WATER_FOAM_DEPTH(p) waterDepthAt((p) + uWaveOrigin)\n' +
        (FFT ? '#define WATER_FOAM_JACOBIAN(p, texel, depth) waterFoamJacobianFFT(p, texel, depth)\n' : '') + COMMON + WAVES + S['foam_sim.frag']);
    }
    prog.shadowTerrain = new Program('shadow_terrain', HEAD + S['terrain.vert'], HEAD + S['shadow_depth.frag']);
    prog.shadowObject = new Program('shadow_object', HEAD + S['object.vert'], HEAD + S['shadow_object.frag']);
    prog.spray = new Program('spray', HEAD + COMMON + S['spray.vert'], HEAD + COMMON + S['spray.frag']);
    prog.rain = new Program('rain', HEAD + S['rain.vert'], HEAD + COMMON + S['rain.frag']);
    prog.fxaa = new Program('fxaa', FSV, HEAD + S['fxaa.frag']);
    prog.bloomDown = new Program('bloomDown', FSV, HEAD + S['bloom_down.frag']);
    prog.bloomUp = new Program('bloomUp', FSV, HEAD + S['bloom_up.frag']);
    prog.composite = new Program('composite', FSV, HEAD + COMMON + S['composite.frag']);
  }

  // ===========================================================================
  //  geometry
  // ===========================================================================
  var emptyVao = gl.createVertexArray();

  function buildOceanGrid(N, extent) {
    var half = N / 2, s0 = 0.22, lo = 1e-4, hi = 0.3, i, x, z;
    for (i = 0; i < 60; i++) {
      var mid = (lo + hi) / 2;
      if (s0 * (Math.exp(mid * half) - 1) / mid < extent) lo = mid; else hi = mid;
    }
    var a = (lo + hi) / 2;
    var coord = new Float32Array(N + 1), spacing = new Float32Array(N + 1);
    for (i = 0; i <= N; i++) {
      var u = Math.abs(i - half);
      coord[i] = Math.sign(i - half) * s0 * (Math.exp(a * u) - 1) / a;
      spacing[i] = s0 * Math.exp(a * u);
    }
    var verts = new Float32Array((N + 1) * (N + 1) * 3), o = 0;
    for (z = 0; z <= N; z++) for (x = 0; x <= N; x++) {
      verts[o++] = coord[x]; verts[o++] = coord[z]; verts[o++] = Math.max(spacing[x], spacing[z]);
    }
    var idx = new Uint32Array(N * N * 6); o = 0;
    for (z = 0; z < N; z++) for (x = 0; x < N; x++) {
      var i0 = z * (N + 1) + x, i1 = i0 + 1, i2 = i0 + N + 1, i3 = i2 + 1;
      idx[o++] = i0; idx[o++] = i2; idx[o++] = i1; idx[o++] = i1; idx[o++] = i2; idx[o++] = i3;
    }
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    var vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 12, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 12, 8);
    var ib = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    return { vao: vao, vb: vb, ib: ib, count: idx.length, extent: coord[N], cell: s0 };
  }

  function meshFromArrays(pos, nrm, idx) {
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    var vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    if (nrm) {
      var nb = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, nb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nrm), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
    }
    var ib = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(idx), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    return { vao: vao, count: idx.length };
  }

  function buildTerrain() {
    var rings = 170, segs = 200, rMax = 430, pos = [], idx = [], j, s;
    for (j = 0; j <= rings; j++) {
      var r = rMax * j / rings;
      for (s = 0; s <= segs; s++) {
        var a = TAU * s / segs;
        var x = ISLAND[0] + r * Math.cos(a), z = ISLAND[1] + r * Math.sin(a);
        pos.push(x, terrainRaw(x, z), z);
      }
    }
    for (j = 0; j < rings; j++) for (s = 0; s < segs; s++) {
      var i0 = j * (segs + 1) + s, i1 = i0 + 1, i2 = i0 + segs + 1, i3 = i2 + 1;
      idx.push(i0, i2, i1, i1, i2, i3);
    }
    return meshFromArrays(pos, null, idx);
  }

  function buildBox() {
    var pos = [], nrm = [], idx = [];
    var faces = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    faces.forEach(function (n, f) {
      var u = [n[1], n[2], n[0]], v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) {
        pos.push(0.5 * (n[0] + c[0] * u[0] + c[1] * v[0]), 0.5 * (n[1] + c[0] * u[1] + c[1] * v[1]), 0.5 * (n[2] + c[0] * u[2] + c[1] * v[2]));
        nrm.push(n[0], n[1], n[2]);
      });
      var b = f * 4; idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    });
    return meshFromArrays(pos, nrm, idx);
  }

  // surface of revolution around y; profile = [[radius, y], ...] in a unit box (-0.5..0.5)
  function buildLathe(profile, segs) {
    var pos = [], nrm = [], idx = [], i, s, n = profile.length;
    for (i = 0; i < n; i++) {
      var p0 = profile[Math.max(i - 1, 0)], p1 = profile[Math.min(i + 1, n - 1)];
      var dr = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dr, dy) || 1;
      var nr = dy / l, ny = -dr / l;
      for (s = 0; s <= segs; s++) {
        var a = TAU * s / segs, c = Math.cos(a), sn = Math.sin(a);
        pos.push(profile[i][0] * c, profile[i][1], profile[i][0] * sn);
        nrm.push(nr * c, ny, nr * sn);
      }
    }
    for (i = 0; i < n - 1; i++) for (s = 0; s < segs; s++) {
      var i0 = i * (segs + 1) + s, i1 = i0 + 1, i2 = i0 + segs + 1, i3 = i2 + 1;
      idx.push(i0, i2, i1, i1, i2, i3);
    }
    return meshFromArrays(pos, nrm, idx);
  }
  function profileRadius(profile, y) {
    for (var i = 0; i < profile.length - 1; i++) {
      var a = profile[i], b = profile[i + 1];
      if ((y >= a[1] && y <= b[1]) || (y <= a[1] && y >= b[1])) {
        var t = Math.abs(b[1] - a[1]) < 1e-6 ? 0 : (y - a[1]) / (b[1] - a[1]);
        return a[0] + (b[0] - a[0]) * t;
      }
    }
    return 0;
  }

  var PROFILE = {
    barrel: [[0, -0.5], [0.40, -0.5], [0.44, -0.46], [0.485, -0.2], [0.5, 0], [0.485, 0.2], [0.44, 0.46], [0.40, 0.5], [0, 0.5]],
    buoy: [[0, -0.5], [0.38, -0.5], [0.5, -0.44], [0.5, -0.22], [0.42, -0.16], [0.16, 0.16], [0.11, 0.34], [0.045, 0.36], [0.045, 0.42], [0.10, 0.43], [0.10, 0.49], [0, 0.5]],
    lighthouse: [[0, -0.5], [0.5, -0.5], [0.34, 0.30], [0.44, 0.31], [0.44, 0.335], [0.27, 0.34], [0.27, 0.43], [0.36, 0.44], [0, 0.5]]
  };
  var mesh = {};

  // ===========================================================================
  //  state
  // ===========================================================================
  var OP = window.OceanParams;
  var state = OP.defaults();
  Object.assign(state, { water: 'ocean', drop: 'crate', dive: false, stir: false, quality: 'auto', sea: 'breeze', sky: 'day', scene: 'custom', sound: false });
  var SEA_PRESETS = {
    calm: { wind: 2.5, chop: 0.8, swell: 0.3, swellLen: 70 },
    breeze: { wind: 9, chop: 1.0, swell: 0.7, swellLen: 90 },
    rough: { wind: 14, chop: 1.12, swell: 1.4, swellLen: 125 },
    storm: { wind: 21, chop: 1.2, swell: 2.6, swellLen: 180 }
  };
  var SKY_PRESETS = {
    day: { sunElev: 34, sunAz: 238, clouds: 0.42, cloudType: 0.75, cloudBase: 1500, cloudTop: 4200, rain: 0 },
    noon: { sunElev: 64, sunAz: 150, clouds: 0.3, cloudType: 0.7, cloudBase: 1600, cloudTop: 4000, rain: 0 },
    golden: { sunElev: 5, sunAz: 186, clouds: 0.46, cloudType: 0.55, cloudBase: 1700, cloudTop: 4200, rain: 0 },
    overcast: { sunElev: 28, sunAz: 200, clouds: 0.96, cloudType: 1.0, cloudBase: 650, cloudTop: 5500, rain: 0.6 },
    night: { sunElev: -14, sunAz: 30, clouds: 0.3, cloudType: 0.5, cloudBase: 1500, cloudTop: 4000, rain: 0 }
  };
  // the water body, rebuilt from the optics parameters whenever they change
  var look = { extinction: [0.42, 0.085, 0.05], scatter: [0.0012, 0.0085, 0.022], sss: [0.01, 0.17, 0.15], sssStrength: 1.0 };
  function applyLook() {
    look.extinction = [state.absR, state.absG, state.absB];
    var sc = OP.hexToRgb(state.scatterCol), ss = OP.hexToRgb(state.sssCol);
    look.scatter = sc.map(function (x) { return x * state.scatterAmt; });
    look.sss = ss.map(function (x) { return x * 0.5; });
    look.sssStrength = state.sss;
  }

  var waves = new Kit.WaveSet(GEO, DETAIL);       // analytic sea (fallback)
  waves.setTime(120);
  var fft = null;                                  // FFT sea, created in start()
  var simTime = 120, physTime = 120;
  var sun = { dir: [0, 1, 0], trans: [1, 1, 1], cloudSun: [3, 3, 3], color: [3, 3, 3], illum: [PI, PI, PI], exposure: 1, mie: 1 };
  var cloudWind = [0, 0, 0];
  var night = { sky: [0, 0, 0], moon: [0, 1, 0, 0] };
  var shadow = { tex: null, fbo: null, size: 2048, mats: new Float32Array(32), texel: [0.04, 0.3], on: true, view: new Float32Array(16), proj: new Float32Array(16) };
  var clouds = { noise: null, weather: null, size: 64, rt: [null, null], cur: 0, valid: false, frame: 0, prevRot: new Float32Array(16), envValid: false };
  var lutDirty = { trans: true, sky: true };

  function fftSize() {
    var q = state.quality;
    if (q === 'auto') q = (matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) < 700) ? 'low' : 'high';
    if (TEST) q = location.hash.indexOf('high') >= 0 ? 'high' : 'low';
    return q === 'low' ? 128 : 256;
  }
  function createFFT() {
    if (fft) fft.dispose();
    fft = new FFTKit.Ocean(gl, {
      size: fftSize(),
      shaders: {
        header: BASE, fft: S['water_fft.glsl'], cascades: S['water_cascades.glsl'], spectrum: S['fft_spectrum.frag'],
        evolve: S['fft_evolve.frag'], butterfly: S['fft_butterfly.frag'], assemble: S['fft_assemble.frag'], query: S['fft_query.frag']
      },
      queryPrelude: COMMON + '#define WATER_QUERY_DEPTH(p) waterDepthAt((p) + uWaveOrigin)\n',
      queryGrid: QUERY_GRID, queryMax: 32, onPatches: onPatches
    });
  }

  // what the rest of the demo needs to know about the sea, whichever model draws it
  var sea = { hs: 1, tp: 5, lp: 40, foamThreshold: 0, foamGain: 1, windStreaks: 0, baseRough2: 0.002 };
  function readSea() {
    if (fft) {
      var st = fft.state;
      sea.hs = st.significantHeight; sea.tp = st.peakPeriod; sea.lp = st.peakWavelength;
      sea.foamThreshold = st.foamThreshold; sea.foamGain = st.foamGain; sea.windStreaks = st.windStreaks;
      sea.baseRough2 = st.baseRoughness2;
    } else {
      sea.hs = waves.significantHeight; sea.tp = waves.peakPeriod; sea.lp = waves.peakWavelength;
      sea.foamThreshold = waves.foamThreshold; sea.foamGain = waves.foamGain; sea.windStreaks = waves.windStreaks;
      sea.baseRough2 = Math.pow(0.035, 2);
    }
  }

  // The sea eases towards the requested settings instead of jumping (phases are kept,
  // so the same waves simply grow, shrink and turn).
  var seaNow = null, SEA_KEYS = ['wind', 'windDir', 'chop', 'swell', 'swellDir', 'swellLen', 'foam', 'waveScale', 'detail', 'fetch', 'gamma', 'spread', 'swellSpread'];
  function applySea(instant) {
    if (!seaNow || instant) { seaNow = {}; SEA_KEYS.forEach(function (k) { seaNow[k] = state[k]; }); }
    var p = {
      windSpeed: seaNow.wind, windDirection: seaNow.windDir * DEG, choppiness: seaNow.chop,
      swellHeight: seaNow.swell, swellLength: seaNow.swellLen, swellDirection: seaNow.swellDir * DEG,
      foamAmount: seaNow.foam, fetchKm: seaNow.fetch, gamma: seaNow.gamma, spreadScale: seaNow.spread,
      amplitudeScale: seaNow.waveScale, detailScale: seaNow.detail, swellSpread: seaNow.swellSpread, seed: Math.round(state.seed)
    };
    if (fft) fft.setParams(p); else waves.generate(p);
    readSea();
  }
  function easeSea(dt) {
    var moving = false, k = 1 - Math.exp(-dt * 1.6);
    for (var i = 0; i < SEA_KEYS.length; i++) {
      var key = SEA_KEYS[i], d = state[key] - seaNow[key];
      if ((key === 'windDir' || key === 'swellDir') && Math.abs(d) > 180) { seaNow[key] += d > 0 ? 360 : -360; d = state[key] - seaNow[key]; }
      if (Math.abs(d) < 1e-3) { seaNow[key] = state[key]; continue; }
      seaNow[key] += d * k; moving = true;
    }
    if (moving) { applySea(false); updateReadout(); seaSettled = false; }
    else if (!seaSettled && fft) { fft.calibrateFoam(); readSea(); seaSettled = true; }
  }
  var seaSettled = false;

  // Sunlight through the same atmosphere the sky shader uses (Hillaire 2020 constants, km).
  var ATM_RB = 6360, ATM_RT = 6460;
  function atmTransmittance(mu, mie) {
    var r = ATM_RB + 0.002, b = r * mu, c = r * r - ATM_RT * ATM_RT;
    var t = -b + Math.sqrt(b * b - c), n = 160, dt = t / n, od = [0, 0, 0];
    var ray = [5.802e-3, 13.558e-3, 33.1e-3], oz = [0.650e-3, 1.881e-3, 0.085e-3];
    for (var i = 0; i < n; i++) {
      var s = (i + 0.5) * dt, x = Math.sqrt(Math.max(1 - mu * mu, 0)) * s, y = r + mu * s;
      var h = Math.hypot(x, y) - ATM_RB;
      var dR = Math.exp(-h / 8), dM = Math.exp(-h / 1.2) * mie, dO = Math.max(0, 1 - Math.abs(h - 25) / 15);
      for (var k = 0; k < 3; k++) od[k] += (ray[k] * dR + (3.996e-3 + 4.40e-3) * dM + oz[k] * dO) * dt;
    }
    return od.map(function (v) { return Math.exp(-v); });
  }
  function applySky() {
    // below -2 degrees the moon takes over as the light (same shaders, far dimmer, bluer)
    night.active = state.sunElev < -2;
    var nightAmt = smoothstep(-2, -8, state.sunElev);
    var el = state.sunElev * DEG, az = state.sunAz * DEG;
    if (night.active) { el = 32 * DEG; az = state.sunAz * DEG + PI; }
    sun.dir = [Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az)];
    var mie = 1 + 5 * smoothstep(0.55, 1.0, state.clouds) + state.rain * 3 + state.haze;
    if (Math.abs(mie - sun.mie) > 1e-3) lutDirty.trans = true;
    sun.mie = mie;
    lutDirty.sky = true;
    var T = atmTransmittance(Math.max(sun.dir[1], 0.0), mie), fade = smoothstep(-0.06, 0.02, sun.dir[1]);
    var shade = 1 - 0.985 * smoothstep(0.35, 0.95, state.clouds);       // direct sun that gets through the clouds
    var lum = 0, E = PI, MOON = [0.0034, 0.0040, 0.0050];
    for (var i = 0; i < 3; i++) {
      sun.illum[i] = night.active ? E * MOON[i] * state.moon * nightAmt : E;
      sun.trans[i] = T[i] * fade;
      sun.cloudSun[i] = sun.illum[i] * sun.trans[i];
      sun.color[i] = sun.cloudSun[i] * shade;
      lum += [0.2126, 0.7152, 0.0722][i] * sun.trans[i] * (0.45 + 0.55 * shade) * sun.illum[i] / E;
      night.sky[i] = [0.0007, 0.0011, 0.0024][i] * nightAmt;
    }
    night.moon = [sun.dir[0], sun.dir[1], sun.dir[2], 3 * nightAmt * (1 - smoothstep(0.5, 0.9, state.clouds))];
    sun.exposure = clamp(Math.pow(1 / Math.max(lum, 1e-4), 0.6) * 1.55, 1.0, night.active ? 28 : 9);
  }

  // ===========================================================================
  //  camera
  // ===========================================================================
  var cam = {
    target: [0, 1.0, 0], yaw: 0.30, pitch: 0.15, dist: 15,
    tYaw: 0.30, tPitch: 0.15, tDist: 15, tTarget: [0, 1.0, 0],
    fov: 50 * DEG, pos: [0, 0, 0], near: 0.3, far: 60000,
    view: new Float32Array(16), proj: new Float32Array(16), viewProj: new Float32Array(16),
    right: [1, 0, 0], up: [0, 1, 0], fwd: [0, 0, -1], underwater: false, aspect: 1
  };
  var tmpS = {};
  var lastInput = -1e9;

  function updateCamera(dt) {
    var k = 1 - Math.exp(-dt * 9);
    cam.yaw += (cam.tYaw - cam.yaw) * k;
    cam.pitch += (cam.tPitch - cam.pitch) * k;
    cam.dist += (cam.tDist - cam.dist) * k;
    for (var i = 0; i < 3; i++) cam.target[i] += (cam.tTarget[i] - cam.target[i]) * k;
    var cp = Math.cos(cam.pitch);
    var px = cam.target[0] + cam.dist * cp * Math.cos(cam.yaw);
    var py = cam.target[1] + cam.dist * Math.sin(cam.pitch);
    var pz = cam.target[2] + cam.dist * cp * Math.sin(cam.yaw);
    // keep the lens out of the waterline: either clearly above or clearly below
    var d = depthAt(px, pz);
    var surf = surfaceAt(px, pz, camProbe);
    var ground = terrainHeight(px, pz);
    if (state.dive && py < surf - 0.05 && d > 1.0) {
      cam.underwater = true;
      py = Math.max(Math.min(py, surf - 0.45), ground + 0.5);
    } else {
      cam.underwater = false;
      py = Math.max(py, surf + 0.4, ground + 0.6);
    }
    cam.pos[0] = px; cam.pos[1] = py; cam.pos[2] = pz;
    cam.aspect = canvas.width / Math.max(canvas.height, 1);
    cam.near = 0.25;
    lookAt(cam.view, cam.pos, cam.target, cam);
    perspective(cam.proj, cam.fov, cam.aspect, cam.near, cam.far);
    mul4(cam.viewProj, cam.proj, cam.view);
  }
  function screenRay(cx, cy) {
    var r = canvas.getBoundingClientRect();
    var nx = ((cx - r.left) / r.width) * 2 - 1, ny = 1 - ((cy - r.top) / r.height) * 2;
    var ty = Math.tan(cam.fov / 2), tx = ty * cam.aspect;
    var d = [0, 0, 0];
    for (var i = 0; i < 3; i++) d[i] = cam.fwd[i] + cam.right[i] * nx * tx + cam.up[i] * ny * ty;
    var l = 1 / Math.hypot(d[0], d[1], d[2]);
    return [d[0] * l, d[1] * l, d[2] * l];
  }
  function hitWater(dir) {
    if (cam.underwater || dir[1] > -0.015) return null;
    var t = -cam.pos[1] / dir[1], x = 0, z = 0, h = 0;
    for (var i = 0; i < (fft ? 1 : 5); i++) {                    // FFT: the sea plane is close enough to aim with
      x = cam.pos[0] + dir[0] * t; z = cam.pos[2] + dir[2] * t;
      h = fft ? 0 : waves.sample(x, z, 0.6, depthAt(x, z), tmpS).height;
      t = (h - cam.pos[1]) / dir[1];
    }
    if (t < 0 || t > 600) return null;
    return [cam.pos[0] + dir[0] * t, h, cam.pos[2] + dir[2] * t];
  }

  // ---- water state for gameplay ------------------------------------------------
  // FFT: interpolate the surface patch read back from the GPU around each owner,
  // moved forward from the moment it was captured to time t. Analytic sea: exact.
  var camProbe = { patch: null };
  function patchSample(P, x, z, t, out) {
    if (!P) { out.height = 0; out.vx = out.vy = out.vz = out.ax = out.ay = out.az = 0; return out; }
    var G1 = QUERY_GRID - 1, d = P.data;
    var u = clamp(((x - P.cx) / P.half * 0.5 + 0.5) * G1, 0, G1 - 1e-4), v = clamp(((z - P.cz) / P.half * 0.5 + 0.5) * G1, 0, G1 - 1e-4);
    var iu = Math.floor(u), iv = Math.floor(v), fu = u - iu, fv = v - iv;
    var o00 = (iv * QUERY_GRID + iu) * 8, o10 = o00 + 8, o01 = o00 + QUERY_GRID * 8, o11 = o01 + 8;
    var w00 = (1 - fu) * (1 - fv), w10 = fu * (1 - fv), w01 = (1 - fu) * fv, w11 = fu * fv;
    var q = [0, 0, 0, 0, 0, 0, 0];
    for (var k = 0; k < 7; k++) q[k] = d[o00 + k] * w00 + d[o10 + k] * w10 + d[o01 + k] * w01 + d[o11 + k] * w11;
    for (k = 1; k < 4; k++) q[k] = clamp(q[k], -12, 12);           // m/s
    for (k = 4; k < 7; k++) q[k] = clamp(q[k], -30, 30);           // m/s^2
    var dt = P.extrapolate ? clamp(t - P.time, 0, 0.12) : 0;
    out.height = q[0] + q[2] * dt + 0.5 * q[5] * dt * dt;
    out.vx = q[1] + q[4] * dt; out.vy = q[2] + q[5] * dt; out.vz = q[3] + q[6] * dt;
    out.ax = q[4]; out.ay = q[5]; out.az = q[6];
    return out;
  }
  function sampleWater(x, z, minWavelength, owner, t, out) {
    if (fft) patchSample(owner && owner.patch, x, z, t, out);
    else waves.sample(x, z, minWavelength, depthAt(x, z), out);
    if (state.surf > 0.001) out.height += surfHeight(x, z, t);
    if (rogue.h > 0.01) out.height += rogueHeight(x, z);
    return out;
  }
  function surfaceAt(x, z, owner) { return sampleWater(x, z, 0.6, owner, simTime, tmpS).height; }
  function onPatches(items, data, time) {
    for (var i = 0; i < items.length; i++) {
      items[i].owner.patch = { cx: items[i].x, cz: items[i].z, half: items[i].half, data: data[i], time: time, extrapolate: true };
    }
  }
  var queryItems = [];
  function runQueries(sync) {
    if (!fft) return;
    queryItems.length = 0;
    queryItems.push({ x: cam.pos[0], z: cam.pos[2], half: 1.0, filter: 0.5, owner: camProbe });
    for (var i = 0; i < bodies.length && queryItems.length < 32; i++) {
      var b = bodies[i];
      queryItems.push({ x: b.pos[0], z: b.pos[2], half: b.radius * 1.3 + 0.25, filter: b.cfg.minWavelength * 0.5, owner: b });
    }
    fft.runQueries(queryItems, sync, function (P) {
      gl.uniform2f(P.loc('uWaveOrigin'), origin[0], origin[1]);
      gl.uniform2f(P.loc('uIslandPos'), ISLAND[0], ISLAND[1]);
      gl.uniform1f(P.loc('uTide'), tideNow);
    });
  }

  // ===========================================================================
  //  rigid bodies floating on the wave set
  // ===========================================================================
  var KINDS = {
    crate: { kind: 0, mesh: 'box', scale: [1.1, 1.1, 1.1], res: [3, 3, 3], density: 430, tint: [0.62, 0.43, 0.24] },
    barrel: { kind: 1, mesh: 'barrel', scale: [0.64, 0.95, 0.64], res: [3, 4, 3], density: 340, tint: [0.10, 0.30, 0.52], profile: 'barrel' },
    buoy: { kind: 2, mesh: 'buoy', scale: [1.7, 3.1, 1.7], res: [4, 8, 4], density: 300, tint: [0.80, 0.07, 0.04], profile: 'buoy', com: [0, -1.12, 0] },
    raft: { kind: 3, mesh: 'box', scale: [3.6, 0.36, 2.4], res: [6, 1, 4], density: 270, tint: [0.70, 0.56, 0.36] }
  };
  var bodies = [];
  var MAX_BODIES = 26;
  var MAXP = 260;
  var bufP = new Float64Array(MAXP * 3), bufV = new Float64Array(MAXP * 3), bufF = new Float64Array(MAXP * 3), bufR = new Float64Array(MAXP * 3);

  function makeBody(type, x, y, z, q) {
    var def = KINDS[type], sc = def.scale, res = def.res, pts = [], ix, iy, iz;
    var com = def.com || [0, 0, 0];
    var cell = [sc[0] / res[0], sc[1] / res[1], sc[2] / res[2]];
    for (ix = 0; ix < res[0]; ix++) for (iy = 0; iy < res[1]; iy++) for (iz = 0; iz < res[2]; iz++) {
      var ux = (ix + 0.5) / res[0] - 0.5, uy = (iy + 0.5) / res[1] - 0.5, uz = (iz + 0.5) / res[2] - 0.5;
      if (def.profile && Math.hypot(ux, uz) > profileRadius(PROFILE[def.profile], uy) + 0.02) continue;
      if (def.mask && !def.mask(ux * sc[0], uy * sc[1], uz * sc[2])) continue;
      pts.push(ux * sc[0] - com[0], uy * sc[1] - com[1], uz * sc[2] - com[2]);
    }
    var n = pts.length / 3, cellVol = cell[0] * cell[1] * cell[2];
    var mass = def.density * cellVol * n, mp = mass / n;
    var I = [0, 0, 0];
    for (var i = 0; i < n; i++) {
      var px = pts[i * 3], py = pts[i * 3 + 1], pz = pts[i * 3 + 2];
      I[0] += mp * (py * py + pz * pz + (cell[1] * cell[1] + cell[2] * cell[2]) / 12);
      I[1] += mp * (px * px + pz * pz + (cell[0] * cell[0] + cell[2] * cell[2]) / 12);
      I[2] += mp * (px * px + py * py + (cell[0] * cell[0] + cell[1] * cell[1]) / 12);
    }
    return {
      type: type, def: def, n: n, pts: new Float64Array(pts), com: com,
      mass: mass, I: I, pos: [x, y, z], vel: [0, 0, 0], q: q || [0, 0, 0, 1], w: [0, 0, 0],
      radius: 0.5 * Math.hypot(sc[0], sc[1], sc[2]) * 0.82, wet: 0, wetPrev: 0, seed: Math.random() * 100,
      cfg: {
        pointVolume: cellVol, pointRadius: 0.5 * Math.min(cell[0], cell[1], cell[2]), pointArea: Math.pow(cellVol, 2 / 3),
        waterDensity: 1025, linearDrag: 1.1, quadDrag: 1.0, minWavelength: Math.max(sc[0], sc[2]) * 1.2, hDrag: def.hDrag
      },
      model: new Float32Array(16), relV: [0, 0, 0]
    };
  }

  // Buoyancy (same model as kit WaveSet.buoyancy / WaterPhysics.h): Archimedes lift,
  // the wave's own pressure field (Froude-Krylov), drag against the moving water.
  var wsamp = {};
  function buoyancy(b, n, t) {
    var cfg = b.cfg, rho = state.density, wet = 0, G = Kit.G, dk = state.drag, hd = cfg.hDrag === undefined ? 1 : cfg.hDrag;
    for (var i = 0, o = 0; i < n; i++, o += 3) {
      var y = bufP[o + 1];
      var s = sampleWater(bufP[o], bufP[o + 2], cfg.minWavelength, b, t, wsamp);
      var r = cfg.pointRadius, f = clamp((s.height - (y - r)) / (2 * r), 0, 1);
      if (f <= 0) { bufF[o] = bufF[o + 1] = bufF[o + 2] = 0; continue; }
      wet += f;
      var m = rho * cfg.pointVolume * f;
      var rx = bufV[o] - s.vx, ry = bufV[o + 1] - s.vy, rz = bufV[o + 2] - s.vz;
      var drag = (m * cfg.linearDrag + 0.5 * rho * cfg.quadDrag * cfg.pointArea * f * Math.sqrt(rx * rx + ry * ry + rz * rz)) * dk;
      bufF[o] = m * s.ax - drag * rx * hd;
      bufF[o + 1] = m * (G + s.ay) - drag * ry;
      bufF[o + 2] = m * s.az - drag * rz * hd;
    }
    return wet / n;
  }

  var tv = [0, 0, 0], tr = [0, 0, 0];
  function stepBody(b, h, t) {
    var n = b.n, i, o, G = Kit.G;
    for (i = 0, o = 0; i < n; i++, o += 3) {
      tv[0] = b.pts[o]; tv[1] = b.pts[o + 1]; tv[2] = b.pts[o + 2];
      qRotate(b.q, tv, tr);
      bufR[o] = tr[0]; bufR[o + 1] = tr[1]; bufR[o + 2] = tr[2];
      bufP[o] = b.pos[0] + tr[0]; bufP[o + 1] = b.pos[1] + tr[1]; bufP[o + 2] = b.pos[2] + tr[2];
      bufV[o] = b.vel[0] + b.w[1] * tr[2] - b.w[2] * tr[1];
      bufV[o + 1] = b.vel[1] + b.w[2] * tr[0] - b.w[0] * tr[2];
      bufV[o + 2] = b.vel[2] + b.w[0] * tr[1] - b.w[1] * tr[0];
    }
    b.wet = buoyancy(b, n, t);

    var fx = 0, fy = -b.mass * G, fz = 0, tx = 0, ty = 0, tz = 0;
    var kGround = b.mass * 260 / n, cGround = b.mass * 14 / n, pr = b.cfg.pointRadius;
    for (i = 0, o = 0; i < n; i++, o += 3) {
      var px = bufF[o], py = bufF[o + 1], pz = bufF[o + 2];
      var ground = terrainHeight(bufP[o], bufP[o + 2]);
      var pen = ground - (bufP[o + 1] - pr);
      if (pen > 0) {                                                  // resting on the sea bed or the beach
        py += kGround * Math.min(pen, 0.6) - cGround * bufV[o + 1];
        px -= cGround * 0.8 * bufV[o]; pz -= cGround * 0.8 * bufV[o + 2];
      }
      fx += px; fy += py; fz += pz;
      tx += bufR[o + 1] * pz - bufR[o + 2] * py;
      ty += bufR[o + 2] * px - bufR[o] * pz;
      tz += bufR[o] * py - bufR[o + 1] * px;
    }
    var im = 1 / b.mass;
    b.vel[0] += fx * im * h; b.vel[1] += fy * im * h; b.vel[2] += fz * im * h;
    // angular: work in body space where the inertia tensor is diagonal
    var wb = qInvRotate(b.q, b.w, [0, 0, 0]), tb = qInvRotate(b.q, [tx, ty, tz], [0, 0, 0]), I = b.I;
    wb[0] += (tb[0] - (I[2] - I[1]) * wb[1] * wb[2]) / I[0] * h;
    wb[1] += (tb[1] - (I[0] - I[2]) * wb[2] * wb[0]) / I[1] * h;
    wb[2] += (tb[2] - (I[1] - I[0]) * wb[0] * wb[1]) / I[2] * h;
    var air = Math.exp(-0.05 * h);
    wb[0] *= air; wb[1] *= air; wb[2] *= air;
    qRotate(b.q, wb, b.w);
    b.pos[0] += b.vel[0] * h; b.pos[1] += b.vel[1] * h; b.pos[2] += b.vel[2] * h;
    var q = b.q, wx = b.w[0], wy = b.w[1], wz = b.w[2], hh = 0.5 * h;
    var qx = q[0] + hh * (wx * q[3] + wy * q[2] - wz * q[1]);
    var qy = q[1] + hh * (wy * q[3] + wz * q[0] - wx * q[2]);
    var qz = q[2] + hh * (wz * q[3] + wx * q[1] - wy * q[0]);
    var qw = q[3] - hh * (wx * q[0] + wy * q[1] + wz * q[2]);
    var l = 1 / Math.hypot(qx, qy, qz, qw);
    q[0] = qx * l; q[1] = qy * l; q[2] = qz * l; q[3] = qw * l;
  }
  function collideBodies() {
    for (var i = 0; i < bodies.length; i++) for (var j = i + 1; j < bodies.length; j++) {
      var a = bodies[i], b = bodies[j];
      var dx = b.pos[0] - a.pos[0], dy = b.pos[1] - a.pos[1], dz = b.pos[2] - a.pos[2];
      var d = Math.hypot(dx, dy, dz), min = a.radius + b.radius;
      if (d >= min || d < 1e-4) continue;
      var nx = dx / d, ny = dy / d, nz = dz / d, pen = min - d;
      var wa = b.mass / (a.mass + b.mass), wb = 1 - wa;
      a.pos[0] -= nx * pen * wa * 0.5; a.pos[1] -= ny * pen * wa * 0.5; a.pos[2] -= nz * pen * wa * 0.5;
      b.pos[0] += nx * pen * wb * 0.5; b.pos[1] += ny * pen * wb * 0.5; b.pos[2] += nz * pen * wb * 0.5;
      var rv = (b.vel[0] - a.vel[0]) * nx + (b.vel[1] - a.vel[1]) * ny + (b.vel[2] - a.vel[2]) * nz;
      if (rv < 0) {
        var jimp = -1.3 * rv;
        a.vel[0] -= nx * jimp * wa; a.vel[1] -= ny * jimp * wa; a.vel[2] -= nz * jimp * wa;
        b.vel[0] += nx * jimp * wb; b.vel[1] += ny * jimp * wb; b.vel[2] += nz * jimp * wb;
      }
    }
  }
  function spawn(type, x, y, z, q) {
    if (bodies.length >= MAX_BODIES) { var old = bodies[0] === boat.body ? 1 : 0; bodies.splice(old, 1); }
    var b = makeBody(type, x, y, z, q);
    bodies.push(b);
    return b;
  }
  function resetBodies() {
    bodies.length = 0;
    spawn('raft', 1.5, 0.1, -2.5, qFromAxisAngle(0, 1, 0, 0.5));
    spawn('crate', -3.2, 0.2, 2.2, qFromAxisAngle(0, 1, 0, 0.3));
    spawn('crate', 4.6, 0.2, 3.4, qFromAxisAngle(1, 0.3, 0, 0.9));
    spawn('crate', -1.0, 0.2, 5.6, qFromAxisAngle(0, 1, 0.2, 1.7));
    spawn('barrel', -5.6, 0.1, -1.6, qFromAxisAngle(1, 0, 0, 1.57));
    spawn('barrel', 6.2, 0.1, -4.8, qFromAxisAngle(0, 0, 1, 1.57));
    spawn('buoy', -9.5, 0.9, -7.5);
    spawn('buoy', -34, 0.9, 16);
    spawn('crate', -12, 0.2, 6.5, qFromAxisAngle(0.2, 1, 0, 2.4));
    spawn('raft', -15, 0.1, -1.5, qFromAxisAngle(0, 1, 0, -0.8));
    if (boat.body && state.boat) bodies.push(boat.body); else ensureBoat();
  }

  // ripple + foam disturbances gathered each frame
  var rippleSplats = [], foamSplats = [];
  function addRipple(x, z, radius, strength) { if (rippleSplats.length < SPLATS) rippleSplats.push([x, z, radius, strength]); }
  function addFoam(x, z, radius, amount) { if (foamSplats.length < SPLATS) foamSplats.push([x, z, radius, amount]); }

  function bodyDisturbances(dt) {
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (b.isBoat) { b.wetPrev = b.wet; continue; }
      var s = sampleWater(b.pos[0], b.pos[2], b.cfg.minWavelength, b, physTime, tmpS);
      var rx = b.vel[0] - s.vx, ry = b.vel[1] - s.vy, rz = b.vel[2] - s.vz;
      var touching = b.wet > 0.02 && b.wet < 0.995 ? 1 : 0;
      var size = b.radius * 0.75;
      if (b.wetPrev < 0.02 && b.wet >= 0.02 && ry < -1.5) {            // splash on entry
        addRipple(b.pos[0], b.pos[2], size * 1.4, clamp(ry * 0.06, -0.5, 0));
        addFoam(b.pos[0], b.pos[2], size * 1.8, 0.9);
        for (var sp = 0; sp < 26 * state.spray; sp++) {
          var an = Math.random() * TAU, rv = 1 + Math.random() * 2.5;
          emitSpray(b.pos[0] + Math.cos(an) * size, b.pos[1] - 0.2, b.pos[2] + Math.sin(an) * size, Math.cos(an) * rv, 1.5 - ry * 0.35 * Math.random(), Math.sin(an) * rv, 0.1 + Math.random() * 0.25, 0.5 + Math.random() * 0.6);
        }
      } else if (touching) {
        // the hull pushes the surface by how far it moved through the water this frame
        if (Math.abs(ry) > 0.12) addRipple(b.pos[0], b.pos[2], size, clamp(ry * dt * 0.5, -0.03, 0.03));
        var sp = Math.hypot(rx, rz);
        if (sp > 0.35) {                                                // bow wave and wake
          var k = clamp(sp * dt * 0.3, 0, 0.02);
          addRipple(b.pos[0] + rx / sp * size, b.pos[2] + rz / sp * size, size * 0.7, k);
          addRipple(b.pos[0] - rx / sp * size, b.pos[2] - rz / sp * size, size * 0.7, -k);
        }
        var churn = Math.hypot(rx, ry, rz);
        if (churn > 0.8) addFoam(b.pos[0], b.pos[2], size * 1.3, clamp((churn - 0.8) * dt * 1.2, 0, 0.08));
      }
      b.wetPrev = b.wet;
    }
  }

  // ===========================================================================
  //  simulation textures (ripples, foam)
  // ===========================================================================
  var sim = null;
  function makeSim(res, size) {
    var a = makeTarget(res, res, false, gl.LINEAR), b = makeTarget(res, res, false, gl.LINEAR);
    [a, b].forEach(function (t) { gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT); });
    return { res: res, size: size, texel: size / res, cur: a, prev: b, cx: 0, cz: 0, scrollX: 0, scrollZ: 0, acc: 0 };
  }
  function simFollow(s, x, z) {
    var nx = Math.round(x / s.texel) * s.texel, nz = Math.round(z / s.texel) * s.texel;
    s.scrollX += (nx - s.cx) / s.size; s.scrollZ += (nz - s.cz) / s.size;
    s.cx = nx; s.cz = nz;
  }
  var splatBuf = new Float32Array(SPLATS * 4);
  function packSplats(list, s) {
    for (var i = 0; i < SPLATS * 4; i++) splatBuf[i] = 0;
    var n = Math.min(list.length, SPLATS);
    for (i = 0; i < n; i++) {
      splatBuf[i * 4] = (list[i][0] - s.cx) / s.size + 0.5;
      splatBuf[i * 4 + 1] = (list[i][1] - s.cz) / s.size + 0.5;
      splatBuf[i * 4 + 2] = Math.max(list[i][2], s.texel * 1.3) / s.size;
      splatBuf[i * 4 + 3] = list[i][3];
    }
    return n;
  }
  function stepSims(dt, origin) {
    if (!SIMS) { rippleSplats.length = 0; foamSplats.length = 0; return; }
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.depthMask(false);
    gl.bindVertexArray(emptyVao);
    var R = sim.ripple, F = sim.foam;
    simFollow(R, cam.target[0], cam.target[2]);
    simFollow(F, cam.target[0], cam.target[2]);

    // ripples: fixed 60 Hz steps
    R.acc = Math.min(R.acc + dt, 0.05);
    var first = true, p = prog.ripple.use();
    while (R.acc >= 1 / 60) {
      R.acc -= 1 / 60;
      simSwapTargets(R);
      gl.bindFramebuffer(gl.FRAMEBUFFER, R.cur.fbo); gl.viewport(0, 0, R.res, R.res);
      bindTex(5, R.prev.color);
      var n = first ? packSplats(rippleSplats, R) : 0;
      p.i('uPrev', 5).f('uTexel', 1 / R.res, 1 / R.res).f('uScroll', R.scrollX, R.scrollZ).f('uC2', 0.07).f('uDamping', 0.997).i('uSplatCount', n);
      if (first) p.v4a('uSplats', splatBuf);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      R.scrollX = 0; R.scrollZ = 0; first = false;
    }
    if (!first) rippleSplats.length = 0;

    // foam: once per frame
    simSwapTargets(F);
    gl.bindFramebuffer(gl.FRAMEBUFFER, F.cur.fbo); gl.viewport(0, 0, F.res, F.res);
    bindTex(5, F.prev.color);
    p = prog.foam.use();
    var nf = packSplats(foamSplats, F);
    p.i('uPrev', 5).f('uScroll', F.scrollX, F.scrollZ).f('uRect', F.cx - origin[0], F.cz - origin[1], F.size, F.texel)
      .f('uDecay', Math.exp(-dt / state.foamLife)).f('uWakeDecay', Math.exp(-dt / state.wakeLife)).f('uFoamThreshold', sea.foamThreshold).f('uFoamGain', sea.foamGain)
      .i('uSplatCount', nf).v4a('uSplats', splatBuf)
      .f('uWaveOrigin', origin[0], origin[1]).f('uIslandPos', ISLAND[0], ISLAND[1]).f('uTide', tideNow);
    setWaves(p);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    F.scrollX = 0; F.scrollZ = 0;
    foamSplats.length = 0;
  }
  function simSwapTargets(s) { var t = s.cur; s.cur = s.prev; s.prev = t; }

  // ===========================================================================
  //  render targets
  // ===========================================================================
  var rt = { scene: null, main: null, refl: null, bloom: [], env: null, envB: null, envMips: 1, w: 0, h: 0, lut: null };
  function make3D(size) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_3D, t);
    gl.texStorage3D(gl.TEXTURE_3D, Math.log2(size) + 1, gl.RGBA8, size, size, size);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T, gl.TEXTURE_WRAP_R].forEach(function (w) { gl.texParameteri(gl.TEXTURE_3D, w, gl.REPEAT); });
    return t;
  }
  // tileable cloud noise (3D) and the weather map (2D), generated on the GPU once
  function buildClouds() {
    var size = (quality.envW <= 256) ? 64 : 128;
    if (clouds.noise && clouds.size === size) return;
    if (clouds.noise) gl.deleteTexture(clouds.noise);
    clouds.size = size;
    clouds.noise = make3D(size);
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.bindVertexArray(emptyVao); gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
    gl.viewport(0, 0, size, size);
    var p = prog.cloudNoise.use().f('uSize', size);
    for (var z = 0; z < size; z++) {
      gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, clouds.noise, 0, z);
      p.f('uLayer', (z + 0.5) / size);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.bindTexture(gl.TEXTURE_3D, clouds.noise); gl.generateMipmap(gl.TEXTURE_3D);
    if (!clouds.weather) {
      clouds.weather = makeTexture(256, 256, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, gl.LINEAR, [gl.REPEAT, gl.REPEAT]);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, clouds.weather, 0);
      gl.viewport(0, 0, 256, 256);
      prog.cloudWeather.use().f('uSize', 256);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fbo);
    gl.activeTexture(gl.TEXTURE0 + UNITS.cloudNoise); gl.bindTexture(gl.TEXTURE_3D, clouds.noise);
    bindTex(UNITS.weather, clouds.weather);
    clouds.valid = false; clouds.envValid = false;
  }
  function buildShadows() {
    var size = quality.envW <= 256 ? 1024 : 2048;
    if (shadow.tex && shadow.size === size) return;
    if (shadow.tex) { gl.deleteTexture(shadow.tex); gl.deleteFramebuffer(shadow.fbo); }
    shadow.size = size;
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, t);
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.DEPTH_COMPONENT24, size, size, 2);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
    shadow.tex = t;
    shadow.fbo = gl.createFramebuffer();
    gl.activeTexture(gl.TEXTURE0 + UNITS.shadow); gl.bindTexture(gl.TEXTURE_2D_ARRAY, t);
  }
  function buildLuts() {
    rt.lut = { trans: makeTarget(256, 64, false), multi: makeTarget(32, 32, false), sky: makeTarget(192, 108, false) };
  }
  var quality = { grid: 448, scale: 1, envW: 512, foamRes: 1024, rippleRes: 512, started: false };
  var ocean = null;

  function pickQuality() {
    var q = state.quality;
    if (q === 'auto') q = (matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) < 700) ? 'low' : 'high';
    if (TEST) q = location.hash.indexOf('high') >= 0 ? 'high' : 'low';
    if (q === 'low') { quality.grid = 320; quality.envW = 256; quality.foamRes = 512; quality.rippleRes = 384; }
    else { quality.grid = 640; quality.envW = 512; quality.foamRes = 1024; quality.rippleRes = 512; }
    return q;
  }
  function buildQualityResources() {
    pickQuality();
    if (ocean) { gl.deleteVertexArray(ocean.vao); gl.deleteBuffer(ocean.vb); gl.deleteBuffer(ocean.ib); }
    ocean = buildOceanGrid(quality.grid, 7000);
    [rt.env, rt.envB].forEach(function (e) { if (e) { gl.deleteFramebuffer(e.fbo); gl.deleteTexture(e.color); } });
    var w = quality.envW, h = w / 2;
    rt.envMips = Math.floor(Math.log2(w)) + 1;
    var tex = makeTexture(w, h, COLOR_IF, gl.RGBA, COLOR_TYPE, gl.LINEAR, [gl.REPEAT, gl.CLAMP_TO_EDGE], rt.envMips);
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    rt.env = { fbo: fbo, color: tex, w: w, h: h };
    var tex2 = makeTexture(w, h, COLOR_IF, gl.RGBA, COLOR_TYPE, gl.LINEAR, [gl.REPEAT, gl.CLAMP_TO_EDGE], rt.envMips);
    var fbo2 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex2, 0);
    rt.envB = { fbo: fbo2, color: tex2, w: w, h: h };
    clouds.envValid = false;
    if (SIMS) {
      if (sim) [sim.ripple, sim.foam].forEach(function (s) { freeTarget(s.cur); freeTarget(s.prev); });
      sim = { ripple: makeSim(quality.rippleRes, 48), foam: makeSim(quality.foamRes, 340) };
    }
  }
  function resizeTargets() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    var cw = Math.max(2, Math.round(canvas.clientWidth * dpr)), ch = Math.max(2, Math.round(canvas.clientHeight * dpr));
    if (rec.on || film.on) { cw = film.on ? film.w : rec.cv.width; ch = film.on ? film.h : rec.cv.height; quality.scale = 1; }      // recordings are full HD, whatever the window
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    if (!quality.started) {                         // first frame: aim for about 1080p worth of pixels
      quality.started = true;
      if (!TEST) quality.scale = clamp(Math.round(Math.sqrt(2.4e6 / (cw * ch)) * 8) / 8, 0.5, 1);
    }
    var w = Math.max(2, Math.round(cw * quality.scale)), h = Math.max(2, Math.round(ch * quality.scale));
    if (w === rt.w && h === rt.h) return;
    rt.w = w; rt.h = h;
    freeTarget(rt.scene); freeTarget(rt.main); freeTarget(rt.refl); rt.bloom.forEach(freeTarget); rt.bloom = [];
    rt.scene = makeTarget(w, h, true);
    if (rt.ldr) { gl.deleteFramebuffer(rt.ldr.fbo); gl.deleteTexture(rt.ldr.color); }
    var ldrTex = makeTexture(w, h, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, gl.LINEAR, [gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE]), ldrFbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, ldrFbo); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ldrTex, 0);
    rt.ldr = { fbo: ldrFbo, color: ldrTex, w: w, h: h };
    rt.main = makeTarget(w, h, true);
    rt.refl = makeTarget(Math.max(2, w >> 1), Math.max(2, h >> 1), true);
    clouds.rt.forEach(freeTarget);
    var cdiv = quality.envW > 256 ? 2 : 3;
    clouds.rt = [makeTarget(Math.max(2, Math.round(w / cdiv)), Math.max(2, Math.round(h / cdiv)), false), makeTarget(Math.max(2, Math.round(w / cdiv)), Math.max(2, Math.round(h / cdiv)), false)];
    clouds.valid = false;
    if (HDR) {
      var bw = w, bh = h;
      for (var i = 0; i < 5; i++) {
        bw = Math.max(2, bw >> 1); bh = Math.max(2, bh >> 1);
        rt.bloom.push(makeTarget(bw, bh, false));
      }
    }
  }

  // ===========================================================================
  //  frame
  // ===========================================================================
  var origin = [0, 0], gridScale = 1;
  var mModel = new Float32Array(16), IDENT_Q = [0, 0, 0, 1];
  var lighthouse = { pos: [ISLAND[0] + 4, 0, ISLAND[1] - 3], scale: [5.2, 17, 5.2] };
  lighthouse.pos[1] = terrainRaw(lighthouse.pos[0], lighthouse.pos[2]) + lighthouse.scale[1] / 2 - 0.4;
  function atTide(p) { return [p[0], p[1] - tideNow, p[2]]; }

  var LUT_UNITS = { trans: 11, multi: 12, sky: 13 }, FFT_UNIT = 7, REFL_UNIT = 10;
  function setClouds(p) {
    var cover = state.clouds;
    p.i('uCloudNoise', UNITS.cloudNoise).i('uWeather', UNITS.weather)
      .f('uCloudLayer', state.cloudBase, Math.max(state.cloudTop, state.cloudBase + 200), cover, mix(0.9, 1.7, smoothstep(0.7, 1.0, cover)) * state.cloudDensity)
      .f('uCloudShape', state.cloudType, 6500, 950, 0.34).v3('uCloudWind', cloudWind).f('uFlash', flash.level)
      .f('uMieScale', sun.mie);
    return p;
  }
  function setShadow(p) {
    p.i('uShadowMap', UNITS.shadow).m4('uShadowMat[0]', shadow.mats)
      .f('uShadowInfo', shadow.texel[0], shadow.texel[1], shadow.on ? 1 : 0, shadow.size);
    return p;
  }
  function setFrame(p) {
    setShadow(setClouds(p));
    var w = look;
    p.v3('uSunDir', sun.dir).v3('uSunColor', sun.color).v3('uCamPos', cam.pos).f('uTime', simTime % 3600)
      .f('uWaveOrigin', origin[0], origin[1]).f('uIslandPos', ISLAND[0], ISLAND[1]).f('uTide', tideNow).i('uEnv', 0)
      .v3('uExtinction', w.extinction).v3('uScatterColor', w.scatter).f('uUnderwater', cam.underwater ? 1 : 0)
      .f('uEnvMaxLod', rt.envMips - 1).f('uWaveHs', sea.hs).f('uCausticStrength', 0.7 * state.caustics).f('uClipWater', 0)
      .f('uSurf', state.surf, state.surfPeriod, state.breakRatio, state.shoreFoam).f('uSurfFoam', state.surfTrail, state.surfStreaks, state.foamScale, state.foamLinger)
      .f('uWetSand', state.wetSand, 0.35 + state.surf * 0.7 + state.tideRange * 1.2);
    return p;
  }
  function setSky(p) {
    var w = look;
    p.v3('uSunIllum', sun.illum).v3('uCloudSun', sun.cloudSun).f('uCloudCover', state.clouds)
      .i('uSkyLut', LUT_UNITS.sky).v3('uNightSky', night.sky)
      .f('uDeepColor', w.scatter[0] * 1.3 + 0.004, w.scatter[1] * 1.3 + 0.008, w.scatter[2] * 1.3 + 0.012);
    return p;
  }
  function setWaves(p) {
    if (fft) fft.bind(p, FFT_UNIT);
    else p.v4a('uWaveA[0]', waves.gpuA).v4a('uWaveB[0]', waves.gpuB);
    return p;
  }
  function setAtm(p) {
    return p.f('uMieScale', sun.mie).i('uTransLut', LUT_UNITS.trans).i('uMultiLut', LUT_UNITS.multi).v3('uSunDir', sun.dir);
  }

  function render(dt, realDt) { prepare(dt, realDt); draw(); }
  function fogDensity() { return (0.000035 + (sun.mie - 1) * 0.00012 + state.rain * 0.0009) * state.fog; }

  // camera, wave textures, physics read-back and simulation textures for this frame
  function prepare(dt, realDt) {
    resizeTargets();
    cam.fov = state.fov * DEG;
    var rdt = realDt === undefined ? dt : realDt;
    if (state.follow && boat.body && bodies.indexOf(boat.body) >= 0) {
      var bb = boat.body;
      qRotate(bb.q, [1, 0, 0], bf);
      cam.tTarget[0] = bb.pos[0]; cam.tTarget[1] = bb.pos[1] + (bb.isShip ? 5 : 1.4); cam.tTarget[2] = bb.pos[2];
      if (performance.now() - lastInput > 1800 || (!state.autopilot && Object.keys(boat.keys).some(function (k) { return boat.keys[k]; }))) {
        var dy = Math.atan2(bf[2], bf[0]) + PI - cam.tYaw;
        while (dy > PI) dy -= TAU; while (dy < -PI) dy += TAU;
        cam.tYaw += dy * (1 - Math.exp(-rdt * 2.2));
      }
    }
    updateCamera(rdt);

    // the ocean grid follows the camera in whole cells, and grows with altitude
    gridScale = clamp(cam.pos[1] / 7, 1, 7.5);
    var snap = ocean.cell * gridScale * 2;
    origin[0] = Math.round(cam.pos[0] / snap) * snap;
    origin[1] = Math.round(cam.pos[2] / snap) * snap;
    if (fft) {
      fft.update(simTime, dt, origin[0], origin[1]);
      runQueries(TEST);
      if (!TEST) fft.poll();
    } else waves.packForGpu(origin[0], origin[1]);

    stepSims(dt, origin);
  }

  function renderLuts() {
    gl.bindVertexArray(emptyVao);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.depthMask(false);
    var L = rt.lut;
    if (lutDirty.trans) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, L.trans.fbo); gl.viewport(0, 0, 256, 64);
      setAtm(prog.atmTrans.use()); gl.drawArrays(gl.TRIANGLES, 0, 3);
      bindTex(LUT_UNITS.trans, L.trans.color);
      gl.bindFramebuffer(gl.FRAMEBUFFER, L.multi.fbo); gl.viewport(0, 0, 32, 32);
      setAtm(prog.atmMulti.use()); gl.drawArrays(gl.TRIANGLES, 0, 3);
      bindTex(LUT_UNITS.multi, L.multi.color);
      lutDirty.trans = false; lutDirty.sky = true;
    }
    if (lutDirty.sky) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, L.sky.fbo); gl.viewport(0, 0, 192, 108);
      setAtm(prog.atmSky.use()); gl.drawArrays(gl.TRIANGLES, 0, 3);
      bindTex(LUT_UNITS.sky, L.sky.color);
      lutDirty.sky = false;
    }
  }

  var flash = { level: 0, timer: 3 };
  var UNITS = { cloudNoise: 15, weather: 16, cloudTex: 17, envHist: 18, shadow: 19 };

  // ---- sun shadow cascades, centred on what the camera looks at ---------------
  function ortho(o, l, r, b, t, n, f) {
    for (var i = 0; i < 16; i++) o[i] = 0;
    o[0] = 2 / (r - l); o[5] = 2 / (t - b); o[10] = -2 / (f - n);
    o[12] = -(r + l) / (r - l); o[13] = -(t + b) / (t - b); o[14] = -(f + n) / (f - n); o[15] = 1;
    return o;
  }
  var shadowVP = [new Float32Array(16), new Float32Array(16)], basisTmp = {};
  function renderShadows() {
    shadow.on = sun.dir[1] > 0.02 && sun.color[1] > 1e-4;
    if (!shadow.on) return;
    var halves = [36, 300], S = shadow.size;
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadow.fbo);
    gl.drawBuffers([gl.NONE]); gl.readBuffer(gl.NONE);
    gl.viewport(0, 0, S, S);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(true);
    gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(2.0, 4.0);
    var centre = [cam.target[0], 0, cam.target[2]];
    for (var c = 0; c < 2; c++) {
      var h = halves[c], texel = 2 * h / S;
      shadow.texel[c] = texel;
      // stable: move the centre in whole texels of light space
      var eye = [centre[0] + sun.dir[0] * 1200, centre[1] + sun.dir[1] * 1200, centre[2] + sun.dir[2] * 1200];
      lookAt(shadow.view, eye, centre, basisTmp);
      var r = basisTmp.right, u = basisTmp.up;
      var cx = centre[0] * r[0] + centre[2] * r[2], cy = centre[0] * u[0] + centre[1] * u[1] + centre[2] * u[2];
      var sx = Math.round(cx / texel) * texel - cx, sy = Math.round(cy / texel) * texel - cy;
      ortho(shadow.proj, -h + sx, h + sx, -h + sy, h + sy, 1, 2600);
      mul4(shadowVP[c], shadow.proj, shadow.view);
      shadow.mats.set(shadowVP[c], c * 16);
      gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, shadow.tex, 0, c);
      gl.clearDepth(1); gl.clear(gl.DEPTH_BUFFER_BIT);
      drawCasters(shadowVP[c], c);
    }
    gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
  }
  function drawCasters(vp, cascade) {
    var pt = prog.shadowTerrain.use().m4('uViewProj', vp).f('uTide', tideNow);
    if (cascade === 1) { gl.bindVertexArray(mesh.terrain.vao); gl.drawElements(gl.TRIANGLES, mesh.terrain.count, gl.UNSIGNED_INT, 0); }
    var po = prog.shadowObject.use().m4('uViewProj', vp);
    modelMatrix(mModel, IDENT_Q, atTide(lighthouse.pos));
    po.m4('uModel', mModel).v3('uScale', lighthouse.scale).i('uKind', 4).f('uTime', simTime % 3600);
    gl.bindVertexArray(mesh.lighthouse.vao);
    gl.drawElements(gl.TRIANGLES, mesh.lighthouse.count, gl.UNSIGNED_INT, 0);
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i], m = mesh[b.def.mesh];
      po.m4('uModel', b.model).v3('uScale', b.def.meshScale || b.def.scale).i('uKind', b.def.kind);
      gl.bindVertexArray(m.vao);
      gl.drawElements(gl.TRIANGLES, m.count, gl.UNSIGNED_INT, 0);
    }
    drawPalms(po, true);
    drawShipParts(po, true);
    if (extraCasters) extraCasters(po, vp, cascade);
    return pt;
  }
  var extraCasters = null;

  var mirror = new Float32Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  var reflView = new Float32Array(16), reflViewProj = new Float32Array(16);

  // terrain, lighthouse and floating objects, with the given view-projection and eye
  function drawOpaque(viewProj, eye, clip) {
    var pt = setWaves(setFrame(prog.terrain.use())).m4('uViewProj', viewProj).v3('uCamPos', eye).f('uClipWater', clip);
    gl.bindVertexArray(mesh.terrain.vao);
    gl.drawElements(gl.TRIANGLES, mesh.terrain.count, gl.UNSIGNED_INT, 0);
    var po = setWaves(setFrame(prog.object.use())).m4('uViewProj', viewProj).v3('uCamPos', eye).f('uClipWater', clip);
    modelMatrix(mModel, IDENT_Q, atTide(lighthouse.pos));
    po.m4('uModel', mModel).v3('uScale', lighthouse.scale).i('uKind', 4).f('uTint', 1, 1, 1).f('uSeed', 0);
    gl.bindVertexArray(mesh.lighthouse.vao);
    gl.drawElements(gl.TRIANGLES, mesh.lighthouse.count, gl.UNSIGNED_INT, 0);
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i], m = mesh[b.def.mesh];
      po.m4('uModel', b.model).v3('uScale', b.def.meshScale || b.def.scale).i('uKind', b.def.kind).v3('uTint', b.def.tint).f('uSeed', b.seed);
      gl.bindVertexArray(m.vao);
      gl.drawElements(gl.TRIANGLES, m.count, gl.UNSIGNED_INT, 0);
    }
    drawPalms(po, false);
    drawShipParts(po, false);
    return pt;
  }

  function draw() {
    var i;
    renderLuts();
    gl.bindVertexArray(emptyVao);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE); gl.depthMask(false);

    clouds.frame++;
    var hiQ = quality.envW > 256, ambBottom = [0, 0, 0];
    for (i = 0; i < 3; i++) ambBottom[i] = sun.color[i] * (0.05 * Math.max(sun.dir[1], 0) / PI) + 0.004 + night.sky[i] * 0.3;

    // ---- sky + clouds -> environment map (accumulated over frames) ------------
    var envPrev = rt.env, envCur = rt.envB;
    bindTex(0, null);
    bindTex(UNITS.envHist, envPrev.color);
    gl.bindFramebuffer(gl.FRAMEBUFFER, envCur.fbo); gl.viewport(0, 0, envCur.w, envCur.h);
    setSky(setFrame(prog.env.use())).i('uEnvHistory', UNITS.envHist).f('uHistory', clouds.envValid ? 0.75 : 0).f('uFrame', clouds.frame % 64)
      .i('uSteps', hiQ ? 28 : 18).i('uLightSteps', hiQ ? 4 : 3).v3('uCloudAmbBottom', ambBottom);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    rt.env = envCur; rt.envB = envPrev; clouds.envValid = true;
    bindTex(UNITS.envHist, null);
    bindTex(0, rt.env.color); gl.generateMipmap(gl.TEXTURE_2D);

    // ---- cloud layer for the camera, reduced resolution, accumulated ----------
    var ty0 = Math.tan(cam.fov / 2), cprev = clouds.rt[clouds.cur], ccur = clouds.rt[1 - clouds.cur];
    bindTex(UNITS.cloudTex, cprev.color);
    gl.bindFramebuffer(gl.FRAMEBUFFER, ccur.fbo); gl.viewport(0, 0, ccur.w, ccur.h);
    setSky(setFrame(prog.cloudPass.use())).v3('uCamRight', cam.right).v3('uCamUp', cam.up).v3('uCamFwd', cam.fwd).f('uTanFov', ty0 * cam.aspect, ty0)
      .i('uCloudHistory', UNITS.cloudTex).m4('uPrevRot', clouds.prevRot).f('uHistory', clouds.valid && location.hash.indexOf('nohist') < 0 ? 0.82 : 0).f('uFrame', clouds.frame % 64)
      .i('uSteps', hiQ ? 44 : 28).i('uLightSteps', hiQ ? 5 : 3).v3('uCloudAmbBottom', ambBottom);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    clouds.cur = 1 - clouds.cur; clouds.valid = true;
    bindTex(UNITS.cloudTex, ccur.color);
    var rot = new Float32Array(cam.view); rot[12] = rot[13] = rot[14] = 0;
    mul4(clouds.prevRot, cam.proj, rot);

    for (i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      // the mesh is authored around its geometric centre, the body turns around its centre of mass
      qRotate(b.q, [-b.com[0], -b.com[1], -b.com[2]], tr);
      modelMatrix(b.model, b.q, [b.pos[0] + tr[0], b.pos[1] + tr[1], b.pos[2] + tr[2]]);
    }
    renderShadows();
    gl.depthMask(false); gl.disable(gl.DEPTH_TEST);
    gl.bindVertexArray(emptyVao);

    // ---- opaque scene --------------------------------------------------------
    gl.bindFramebuffer(gl.FRAMEBUFFER, rt.scene.fbo); gl.viewport(0, 0, rt.w, rt.h);
    gl.depthMask(true); gl.clearDepth(1); gl.clear(gl.DEPTH_BUFFER_BIT); gl.depthMask(false);
    var ty = Math.tan(cam.fov / 2);
    setSky(setFrame(prog.background.use())).v3('uCamRight', cam.right).v3('uCamUp', cam.up).v3('uCamFwd', cam.fwd).f('uTanFov', ty * cam.aspect, ty)
      .i('uCloudTex', UNITS.cloudTex).f('uMoon', night.moon[0], night.moon[1], night.moon[2], night.moon[3])
      .f('uBolt', bolt.az, bolt.top, bolt.seed, flash.level > 0.02 ? flash.level * 60 : 0)
      .f('uRainSky', state.rain * state.rainShafts * 0.9, simTime % 1000, Math.atan2(state.cloudBase, 3500));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(true);
    drawOpaque(cam.viewProj, cam.pos, 0);

    // ---- the same scene mirrored in the sea, for reflections -----------------
    var planar = !cam.underwater;
    if (planar) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, rt.refl.fbo); gl.viewport(0, 0, rt.refl.w, rt.refl.h);
      gl.clearColor(0, 0, 0, 0); gl.clearDepth(1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      mul4(reflView, cam.view, mirror); mul4(reflViewProj, cam.proj, reflView);
      drawOpaque(reflViewProj, [cam.pos[0], -cam.pos[1], cam.pos[2]], 1);
    }

    // ---- water, drawn over a copy of the scene it refracts -------------------
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, rt.scene.fbo);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, rt.main.fbo);
    gl.blitFramebuffer(0, 0, rt.w, rt.h, 0, 0, rt.w, rt.h, gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT, gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, rt.main.fbo);
    gl.viewport(0, 0, rt.w, rt.h);
    bindTex(1, rt.scene.color); bindTex(2, rt.scene.depth);
    bindTex(REFL_UNIT, planar ? rt.refl.color : null);
    bindTex(REFL_UNIT + 4, planar ? rt.refl.depth : null);
    if (SIMS) { bindTex(3, sim.ripple.cur.color); bindTex(4, sim.foam.cur.color); }
    var w = look, R = sim && sim.ripple, F = sim && sim.foam;
    var pw = setWaves(setFrame(prog.ocean.use()));
    pw.m4('uViewProj', cam.viewProj).m4('uView', cam.view).f('uGridCenter', origin[0], origin[1]).f('uGridScale', gridScale)
      .i('uSceneColor', 1).i('uSceneDepth', 2).f('uInvViewport', 1 / rt.w, 1 / rt.h).f('uNearFar', cam.near, cam.far)
      .f('uFoamThreshold', sea.foamThreshold).f('uFoamGain', sea.foamGain)
      .f('uFogDensity', fogDensity()).f('uMeshRadius', ocean.extent * gridScale * 0.97)
      .v3('uSssColor', w.sss).f('uSssStrength', w.sssStrength).f('uRoughness', Math.sqrt(sea.baseRough2) * state.rough)
      .f('uWindDir', Math.cos(state.windDir * DEG), Math.sin(state.windDir * DEG)).f('uWindStreaks', sea.windStreaks * state.streaks).f('uRain', state.rain)
      .f('uLook', state.reflect, state.spec, state.refract, state.foamBright)
      .f('uRogueA', rogue.cx, rogue.cz, rogue.dx, rogue.dz).f('uRogueB', rogue.h, rogue.k, rogue.phase, rogue.len)
      .f('uGust', state.gusts * smoothstep(2, 6, state.wind), state.gustSize, gustDrift[0], gustDrift[1])
      .f('uSlick', state.slicks * (1 - smoothstep(9, 14, state.wind)), state.slickSpace, Math.cos(state.windDir * DEG), Math.sin(state.windDir * DEG))
      .v3('uBio', bioGlow())
      .i('uReflection', REFL_UNIT).i('uReflDepth', REFL_UNIT + 4);
    if (SIMS) {
      pw.i('uRipple', 3).f('uRippleRect', R.cx, R.cz, 1 / R.size, 1 / R.res)
        .i('uFoamTex', 4).f('uFoamRect', F.cx, F.cz, 1 / F.size, 1 / F.res);
    }
    gl.bindVertexArray(ocean.vao);
    gl.drawElements(gl.TRIANGLES, ocean.count, gl.UNSIGNED_INT, 0);
    drawParticles();

    // ---- bloom + tone mapping ------------------------------------------------
    gl.bindVertexArray(emptyVao);
    gl.disable(gl.DEPTH_TEST); gl.depthMask(false);
    if (HDR) {
      var src = rt.main, pd = prog.bloomDown.use().i('uTex', 5);
      for (i = 0; i < rt.bloom.length; i++) {
        var dst = rt.bloom[i];
        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo); gl.viewport(0, 0, dst.w, dst.h);
        bindTex(5, src.color);
        pd.f('uTexel', 1 / src.w, 1 / src.h).f('uThreshold', i === 0 ? 1.15 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        src = dst;
      }
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
      var pu = prog.bloomUp.use().i('uTex', 5);
      for (i = rt.bloom.length - 1; i > 0; i--) {
        var small = rt.bloom[i], big = rt.bloom[i - 1];
        gl.bindFramebuffer(gl.FRAMEBUFFER, big.fbo); gl.viewport(0, 0, big.w, big.h);
        bindTex(5, small.color);
        pu.f('uTexel', 1 / small.w, 1 / small.h);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      gl.disable(gl.BLEND);
    }
    var aa = state.fxaa, rays = sunRays();
    if (aa) { gl.bindFramebuffer(gl.FRAMEBUFFER, rt.ldr.fbo); gl.viewport(0, 0, rt.w, rt.h); }
    else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height); }
    bindTex(5, rt.main.color);
    if (HDR) bindTex(6, rt.bloom[0].color);
    var wb = whiteBalance(state.temp, state.tint), sh = OP.hexToRgb(state.shadowTint), hi = OP.hexToRgb(state.highTint);
    prog.composite.use().i('uScene', 5).i('uBloom', 6).f('uBloomStrength', 0.045 * state.bloom)
      .f('uExposure', sun.exposure * Math.pow(2, state.ev) * (cam.underwater ? 1.5 : 1))
      .i('uTonemap', ['aces', 'agx', 'filmic', 'reinhard'].indexOf(state.tonemap)).v3('uWhiteBalance', wb)
      .f('uGrade', state.sat, state.vib, state.contrast, state.vignette).v3('uShadowTint', sh).v3('uHighTint', hi).f('uSplit', state.split)
      .f('uLens', state.grain, state.ca, state.sharpen, simTime % 100).f('uTexel', 1 / rt.w, 1 / rt.h).f('uFlashScreen', flash.level * 0.5)
      .f('uLensRain', cam.underwater ? 0 : state.lensRain * Math.max(state.rain, 0.25 * smoothstep(14, 22, state.wind)), simTime % 1000)
      .f('uFade', tour.on ? tour.fade : 0).f('uRays', rays[0], rays[1], rays[2], 1 / Math.max(sun.exposure * Math.pow(2, state.ev), 1e-3));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (aa) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height);
      bindTex(5, rt.ldr.color);
      prog.fxaa.use().i('uTex', 5).f('uTexel', 1 / rt.w, 1 / rt.h);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
  // where the sun is on screen, for the light shafts (strongest underwater and with the sun low)
  function sunRays() {
    var d = sun.dir, p = [cam.pos[0] + d[0] * 5000, cam.pos[1] + d[1] * 5000, cam.pos[2] + d[2] * 5000], m = cam.viewProj;
    var x = m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], y = m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], w = m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15];
    var amt = state.rays * (cam.underwater ? 1.6 : 0.6 * (1 - smoothstep(8, 40, state.sunElev)) + 0.15);
    if (w <= 0 || state.sunElev < -2) return [0.5, 0.5, 0];
    var u = x / w * 0.5 + 0.5, v = y / w * 0.5 + 0.5;
    var onScreen = 1 - smoothstep(0.6, 1.2, Math.max(Math.abs(u - 0.5), Math.abs(v - 0.5)));
    return [u, v, amt * onScreen];
  }
  // temperature (blue..amber) and tint (green..magenta) as per-channel gains of equal brightness
  function whiteBalance(t, u) {
    var g = [1 + 0.28 * t + 0.06 * u, 1 - 0.16 * u, 1 - 0.3 * t + 0.06 * u];
    var l = 0.2126 * g[0] + 0.7152 * g[1] + 0.0722 * g[2];
    return [g[0] / l, g[1] / l, g[2] / l];
  }

  // ===========================================================================
  //  shore surf on the CPU (same formula as kit/glsl/water_surf.glsl), for physics
  // ===========================================================================
  function surfHeight(x, z, t) {
    var H0 = state.surf, T = Math.max(state.surfPeriod, 1);
    if (H0 <= 0.001) return 0;
    var h = depthAt(x, z), h0 = clamp(1.5613 * T * T * 0.06, 3, 14);
    if (h >= h0 * 1.8 || h <= 0) return 0;
    var gx = (depthAt(x + 1.5, z) - depthAt(x - 1.5, z)) / 3, gz = (depthAt(x, z + 1.5) - depthAt(x, z - 1.5)) / 3;
    var sl = Math.hypot(gx, gz);
    if (sl < 1e-3) return 0;
    var slope = 0.05, tau = 2 * Math.sqrt(h / 9.81) / slope;
    var vary = 0.6 * Math.sin(x * 0.031 - z * 0.024) + 0.4 * Math.sin(-x * 0.013 + z * 0.041);
    var psi = TAU * ((t % 3600) + tau) / T + vary, c = 0.5 + 0.5 * Math.cos(psi);
    var Hraw = H0 * Math.pow(h0 / Math.max(h, 0.05), 0.25) * smoothstep(h0 * 1.8, h0, h);
    var H = Math.min(Hraw, state.breakRatio * h), k = mix(1, 5, smoothstep(h0, h0 * 0.25, h));
    return H * (Math.pow(c, k) - 0.55 / Math.sqrt(k + 0.2)) * smoothstep(0, 0.35, h);
  }

  // ===========================================================================
  //  palm trees (procedural: a curved trunk and a crown of cut-out fronds)
  // ===========================================================================
  function meshFromArraysAux(pos, nrm, aux, idx) {
    var m = meshFromArrays(pos, nrm, idx);
    gl.bindVertexArray(m.vao);
    var ab = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ab); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aux), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    return m;
  }
  function rng(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function buildPalm(seed) {
    var R = rng(seed), H = 7 + R() * 3, lean = 0.12 + R() * 0.22, segs = 10, sides = 10;
    var tp = [], tn = [], ta = [], ti = [], i, j;
    var spine = function (t) { return [lean * H * t * t, H * t, 0]; };
    for (i = 0; i <= segs; i++) {
      var t = i / segs, c = spine(t), r = 0.2 - 0.07 * t + 0.14 * Math.pow(1 - t, 8);
      for (j = 0; j <= sides; j++) {
        var a = TAU * j / sides;
        tp.push(c[0] + r * Math.cos(a), c[1], c[2] + r * Math.sin(a)); tn.push(Math.cos(a), 0.15, Math.sin(a)); ta.push(0, 0);
      }
    }
    for (i = 0; i < segs; i++) for (j = 0; j < sides; j++) {
      var i0 = i * (sides + 1) + j, i2 = i0 + sides + 1;
      ti.push(i0, i2, i0 + 1, i0 + 1, i2, i2 + 1);
    }
    var crown = spine(1), fp = [], fn = [], fa = [], fi = [], NF = 9 + Math.floor(R() * 4), US = 12;
    for (var f = 0; f < NF; f++) {
      var phi = TAU * f / NF + R() * 0.4, el = 0.55 - R() * 0.9, L = 3.2 + R() * 1.4, droop = 1.6 + R() * 1.4;
      var dx = Math.cos(phi), dz = Math.sin(phi), sx = -dz, sz = dx, base = fp.length / 3;
      for (var u = 0; u <= US; u++) {
        var uu = u / US, w = 0.62 * Math.pow(Math.sin(Math.PI * Math.min(uu * 1.08 + 0.04, 1)), 0.7);
        var hz = L * uu * Math.cos(el), hy = L * uu * Math.sin(el) - droop * uu * uu;
        var cx = crown[0] + dx * hz, cy = crown[1] + hy, cz = crown[2] + dz * hz;
        // tangent of the spine, for the normal
        var ty = L * Math.sin(el) - 2 * droop * uu, th = L * Math.cos(el), tl = Math.hypot(ty, th) || 1;
        var tx2 = dx * th / tl, ty2 = ty / tl, tz2 = dz * th / tl;
        var nx = ty2 * sz - tz2 * 0, ny = tz2 * sx - tx2 * sz, nz = tx2 * 0 - ty2 * sx;
        if (ny < 0) { nx = -nx; ny = -ny; nz = -nz; }
        for (var sdx = -1; sdx <= 1; sdx++) {
          var fold = Math.abs(sdx) * w * 0.35;                         // leaflets angle up into a shallow V
          fp.push(cx + sx * w * sdx, cy + fold, cz + sz * w * sdx); fn.push(nx, ny, nz); fa.push(uu, sdx);
        }
      }
      for (u = 0; u < US; u++) {
        var b0 = base + u * 3, b1 = b0 + 3;
        fi.push(b0, b1, b0 + 1, b0 + 1, b1, b1 + 1, b0 + 1, b1 + 1, b0 + 2, b0 + 2, b1 + 1, b1 + 2);
      }
    }
    return { trunk: meshFromArraysAux(tp, tn, ta, ti), fronds: meshFromArraysAux(fp, fn, fa, fi) };
  }
  var palms = [], palmMeshes = [];
  function buildPalms() {
    for (var k = 0; k < 3; k++) palmMeshes.push(buildPalm(101 + k * 977));
    var R = rng(4242);
    for (var i = 0; i < 22; i++) {
      var a = (i / 22) * TAU + R() * 0.25;
      var Rr = 95 + 22 * Math.sin(3 * a + 0.6) + 12 * Math.sin(5 * a - 1.3) + 7 * Math.sin(8 * a + 2.1);
      var e = 13 + R() * 16, r = Rr * (1 - e / 95);
      var x = ISLAND[0] + r * Math.cos(a), z = ISLAND[1] + r * Math.sin(a);
      if (Math.hypot(x - lighthouse.pos[0], z - lighthouse.pos[2]) < 8) continue;
      // lean towards the sea: rotate local +x (lean direction) to the outward direction
      var yaw = -a + (R() - 0.5) * 0.6, s = 0.85 + R() * 0.35;
      palms.push({ pos: [x, terrainRaw(x, z) - 0.25, z], q: qFromAxisAngle(0, 1, 0, yaw), yaw: yaw, scale: [s, s, s], mesh: palmMeshes[i % 3], seed: R() * 10 });
      if (R() < 0.35) {                                                 // a second palm in the same clump
        var x2 = x + (R() - 0.5) * 5, z2 = z + (R() - 0.5) * 5, yaw2 = yaw + (R() - 0.5) * 1.2, s2 = s * (0.7 + R() * 0.3);
        palms.push({ pos: [x2, terrainRaw(x2, z2) - 0.25, z2], q: qFromAxisAngle(0, 1, 0, yaw2), yaw: yaw2, scale: [s2, s2, s2], mesh: palmMeshes[(i + 1) % 3], seed: R() * 10 });
      }
    }
  }
  function drawPalms(po, shadowPass) {
    if (!state.palms) return;
    var wd = state.windDir * DEG, amp = 0.4 + state.wind * 0.07;
    for (var i = 0; i < palms.length; i++) {
      var p = palms[i];
      modelMatrix(mModel, p.q, atTide(p.pos));
      // wind in the palm's own frame
      var c = Math.cos(p.yaw), s = Math.sin(p.yaw), wx = Math.cos(wd), wz = Math.sin(wd);
      po.m4('uModel', mModel).v3('uScale', p.scale).f('uSway', c * wx - s * wz, s * wx + c * wz, amp, p.seed).f('uSeed', p.seed).f('uTint', 1, 1, 1);
      po.i('uKind', 5); gl.bindVertexArray(p.mesh.trunk.vao); gl.drawElements(gl.TRIANGLES, p.mesh.trunk.count, gl.UNSIGNED_INT, 0);
      po.i('uKind', 6); gl.bindVertexArray(p.mesh.fronds.vao); gl.drawElements(gl.TRIANGLES, p.mesh.fronds.count, gl.UNSIGNED_INT, 0);
    }
    po.f('uSway', 0, 0, 0, 0);
  }

  // ===========================================================================
  //  speedboat: a V hull floating on the same buoyancy, plus thrust, outboard
  //  steering, keel, form drag and planing lift
  // ===========================================================================
  var HULL = {
    halfBeam: function (x) {
      var s = (x + 3.6) / 7.2;
      return s < 0.6 ? 1.18 - 0.1 * (0.6 - s) / 0.6 : 1.18 * Math.sqrt(Math.max(0, 1 - Math.pow((s - 0.6) / 0.4, 2)));
    },
    keel: function (x) { var s = (x + 3.6) / 7.2; return -0.5 + 0.62 * Math.pow(Math.max(0, (s - 0.68) / 0.32), 2); },
    sheer: function (x) { var s = (x + 3.6) / 7.2; return 0.42 + 0.22 * Math.pow(Math.max(0, (s - 0.55) / 0.45), 2); }
  };
  function buildBoatMesh() {
    var pos = [], nrm = [], aux = [], idx = [], NS = 24, i;
    function quad(a, b, c, d, part) {
      var e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
      var n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]], l = Math.hypot(n[0], n[1], n[2]) || 1;
      var o = pos.length / 3;
      [a, b, c, d].forEach(function (p) { pos.push(p[0], p[1], p[2]); nrm.push(n[0] / l, n[1] / l, n[2] / l); aux.push(part, 0); });
      idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
    }
    function section(x) {
      var b = Math.max(HULL.halfBeam(x), 0.02), k = HULL.keel(x), sh = HULL.sheer(x), ch = k + (sh - k) * 0.3;
      return [[x, k, 0], [x, ch, b * 0.94], [x, sh, b]];
    }
    for (i = 0; i < NS; i++) {
      var x0 = -3.6 + 7.2 * i / NS, x1 = -3.6 + 7.2 * (i + 1) / NS, A = section(x0), B = section(x1);
      for (var side = -1; side <= 1; side += 2) {
        var m = function (p) { return [p[0], p[1], p[2] * side]; };
        for (var k = 0; k < 2; k++) {
          if (side > 0) quad(m(A[k]), m(A[k + 1]), m(B[k + 1]), m(B[k]), 0);
          else quad(m(A[k]), m(B[k]), m(B[k + 1]), m(A[k + 1]), 0);
        }
        // deck from the sheer line to the centre, sunk into a cockpit behind the windscreen
        var dY = (x0 > -2.6 && x1 < 0.4) ? -0.25 : 0;
        var a0 = [x0, A[2][1] + dY, A[2][2] * side * 0.88], a1 = [x1, B[2][1] + dY, B[2][2] * side * 0.88];
        var c0 = [x0, A[2][1] + dY + 0.02, 0], c1 = [x1, B[2][1] + dY + 0.02, 0];
        if (side > 0) quad(a0, c0, c1, a1, 1); else quad(a0, a1, c1, c0, 1);
        // gunwale: the strip from the hull side to the deck edge
        var g0 = m(A[2]), g1 = m(B[2]);
        if (side > 0) quad(g0, a0, a1, g1, 3); else quad(g0, g1, a1, a0, 3);
      }
    }
    // transom
    var T = section(-3.6);
    quad([-3.6, T[0][1], 0], [-3.6, T[1][1], -T[1][2]], [-3.6, T[2][1], -T[2][2]], [-3.6, T[2][1], 0], 0);
    quad([-3.6, T[0][1], 0], [-3.6, T[2][1], 0], [-3.6, T[2][1], T[2][2]], [-3.6, T[1][1], T[1][2]], 0);
    // windscreen
    var wy = HULL.sheer(0.4), wb = HULL.halfBeam(0.4) * 0.85;
    quad([0.4, wy, -wb], [0.4, wy, wb], [-0.05, wy + 0.5, wb * 0.9], [-0.05, wy + 0.5, -wb * 0.9], 2);
    // seats
    var box = function (x0, x1, y0, y1, z0, z1, part) {
      quad([x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], part);
      quad([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], part);
      quad([x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0], part);
      quad([x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0], part);
      quad([x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [x0, y0, z1], part);
    };
    box(-1.0, -0.4, 0.17, 0.62, -0.75, -0.15, 3); box(-1.0, -0.4, 0.17, 0.62, 0.15, 0.75, 3);
    box(-2.6, -2.0, 0.17, 0.55, -0.9, 0.9, 3);
    box(-3.95, -3.6, -0.5, 0.75, -0.16, 0.16, 4);                      // outboard
    return meshFromArraysAux(pos, nrm, aux, idx);
  }
  KINDS.boat = {
    kind: 7, mesh: 'boat', scale: [7.2, 1.2, 2.4], meshScale: [1, 1, 1], res: [10, 2, 4], density: 330, tint: [1, 1, 1], com: [-0.4, -0.25, 0],
    hDrag: 0.04,
    mask: function (x, y, z) {
      var k = HULL.keel(x), sh = HULL.sheer(x), b = HULL.halfBeam(x);
      if (y < k - 0.1 || y > sh) return false;
      return Math.abs(z) < b * clamp((y - k) / Math.max((sh - k) * 0.3, 0.05) + 0.3, 0.35, 1.0);
    }
  };
  var boat = { body: null, throttle: 0, steer: 0, keys: {}, centre: [25, -5], radius: 40, slam: 0, sail: 0.8, boost: 0 };
  var sound = {};
  function ensureBoat() {
    var has = bodies.indexOf(boat.body) >= 0;
    var want = state.vessel === 'ship' ? 'ship' : 'boat';
    if (has && boat.body.type !== want) { bodies.splice(bodies.indexOf(boat.body), 1); boat.body = null; has = false; }
    if (state.boat && !has) {
      var a = Math.random() * TAU, R = boat.radius * (want === 'ship' ? 1.6 : 1);
      var x = boat.centre[0] + R * Math.cos(a), z = boat.centre[1] + R * Math.sin(a);
      boat.body = makeBody(want, x, want === 'ship' ? 0.6 : 0.2, z, qFromAxisAngle(0, 1, 0, -(a + PI / 2)));
      boat.body.isBoat = true; boat.body.isShip = want === 'ship';
      bodies.push(boat.body);
    } else if (!state.boat && has) bodies.splice(bodies.indexOf(boat.body), 1);
  }
  var bf = [0, 0, 0], bu = [0, 0, 0], bs = [0, 0, 0], bp = [0, 0, 0], bt = [0, 0, 0], bw = [0, 0, 0];
  function pushBody(b, F, r, h) {                                     // force F (world) at offset r (world) for h seconds
    var im = 1 / b.mass;
    b.vel[0] += F[0] * im * h; b.vel[1] += F[1] * im * h; b.vel[2] += F[2] * im * h;
    var tq = [r[1] * F[2] - r[2] * F[1], r[2] * F[0] - r[0] * F[2], r[0] * F[1] - r[1] * F[0]];
    qInvRotate(b.q, tq, bt); qInvRotate(b.q, b.w, bw);
    bw[0] += bt[0] / b.I[0] * h; bw[1] += bt[1] / b.I[1] * h; bw[2] += bt[2] / b.I[2] * h;
    qRotate(b.q, bw, b.w);
  }
  function boatControls(dt) {
    var b = boat.body; if (!b) return;
    var thr = 0, steer = 0;
    var manual = state.follow && !state.autopilot;
    if (manual) {
      var k = boat.keys;
      steer = (k.left ? 1 : 0) - (k.right ? 1 : 0);
      if (b.isShip) {                                                    // W / S set more or less sail
        boat.sail = clamp(boat.sail + ((k.up ? 1 : 0) - (k.down ? 1 : 0)) * dt * 0.6, 0, 1);
        thr = boat.sail;
      } else {
        thr = (k.up ? 1 : 0) - (k.down ? 0.4 : 0);
        thr *= state.throttle > 0.05 ? state.throttle / 0.75 : 1;
        if (k.boost && thr > 0) thr *= 1.45;
      }
    } else {
      // pure pursuit around a circle in deep water
      qRotate(b.q, [1, 0, 0], bf);
      var heading = Math.atan2(bf[2], bf[0]);
      var R = boat.radius * (b.isShip ? 1.6 : 1);
      var phi = Math.atan2(b.pos[2] - boat.centre[1], b.pos[0] - boat.centre[0]) + (b.isShip ? 0.35 : 0.55);
      var tx = boat.centre[0] + R * Math.cos(phi), tz = boat.centre[1] + R * Math.sin(phi);
      var want = Math.atan2(tz - b.pos[2], tx - b.pos[0]), err = want - heading;
      while (err > PI) err -= TAU; while (err < -PI) err += TAU;
      steer = clamp(err * 1.8, -1, 1);
      thr = b.isShip ? Math.max(state.throttle, 0.6) : state.throttle;
      if (Math.hypot(b.pos[0] - boat.centre[0], b.pos[2] - boat.centre[1]) > R * 3) thr *= 0.5;
    }
    boat.throttle += (thr - boat.throttle) * (1 - Math.exp(-dt * 2.5));
    boat.steer += (steer - boat.steer) * (1 - Math.exp(-dt * 4));
  }
  function boatForces(b, h) {
    qRotate(b.q, [1, 0, 0], bf); qRotate(b.q, [0, 1, 0], bu); qRotate(b.q, [0, 0, 1], bs);
    var v = b.vel, vf = v[0] * bf[0] + v[1] * bf[1] + v[2] * bf[2], vs = v[0] * bs[0] + v[1] * bs[1] + v[2] * bs[2];
    var inWater = clamp(b.wet * 3, 0, 1), M = b.mass;
    // propeller under the stern, only pushes while it is in the water
    qRotate(b.q, [-3.7 - b.com[0], -0.6 - b.com[1], 0], bp);
    var px = b.pos[0] + bp[0], py = b.pos[1] + bp[1], pz = b.pos[2] + bp[2];
    var depth = surfaceAt(px, pz, b) - py, propIn = smoothstep(-0.25, 0.2, depth);
    var a = -boat.steer * 0.42, ca = Math.cos(a), sa = Math.sin(a), T = boat.throttle * M * 7.5 * propIn;
    pushBody(b, [(bf[0] * ca + bs[0] * sa) * T, (bf[1] * ca + bs[1] * sa) * T, (bf[2] * ca + bs[2] * sa) * T], bp, h);
    // keel: sideways resistance at the centre of lateral resistance, ahead of the centre of mass
    var lat = -vs * M * 3.2 * inWater;
    qRotate(b.q, [0.7, -0.35, 0], bp);
    pushBody(b, [bs[0] * lat, bs[1] * lat, bs[2] * lat], bp, h);
    // drag along the hull (wave-making + skin) and planing lift under the forward bottom
    var fd = (-vf * Math.abs(vf) * 0.026 - vf * 0.06) * M * inWater;
    b.vel[0] += bf[0] * fd / M * h; b.vel[1] += bf[1] * fd / M * h; b.vel[2] += bf[2] * fd / M * h;
    var lift = M * 9.81 * 0.3 * smoothstep(3, 13, Math.abs(vf)) * inWater;
    qRotate(b.q, [0.6, -0.4, 0], bp);
    pushBody(b, [0, lift, 0], bp, h);
    // yaw and roll damping from the hull in the water
    var damp = Math.exp(-1.2 * h * inWater);
    b.w[1] *= damp;
    boat.speed = Math.abs(vf);
  }
  function boatWake(dt) {
    var b = boat.body; if (!b || bodies.indexOf(b) < 0) return;
    if (b.isShip) { shipWake(dt); return; }
    var sp = Math.hypot(b.vel[0], b.vel[2]);
    if (b.wet < 0.03 || sp < 0.8) return;
    var fx = b.vel[0] / sp, fz = b.vel[2] / sp, sx = -fz, sz = fx, W = state.wake;
    var x = b.pos[0], z = b.pos[2], amt = -Math.min(0.2, sp * 0.3 * dt) * W;
    addFoam(x - fx * 3.4, z - fz * 3.4, 1.0, amt);                                  // prop wash
    addFoam(x - fx * 3.2 + sx * 1.0, z - fz * 3.2 + sz * 1.0, 0.9, amt * 0.6);
    addFoam(x - fx * 3.2 - sx * 1.0, z - fz * 3.2 - sz * 1.0, 0.9, amt * 0.6);
    if (sp > 4) {
      addFoam(x + fx * 2.0 + sx * 1.1, z + fz * 2.0 + sz * 1.1, 0.7, amt * 0.5);       // bow wave
      addFoam(x + fx * 2.0 - sx * 1.1, z + fz * 2.0 - sz * 1.1, 0.7, amt * 0.5);
      // the two arms of the Kelvin wedge (19.5 degrees either side of the track)
      for (var d = 7; d <= 21; d += 7) {
        var off = 1.1 + d * 0.354, k = amt * 0.35 * (1 - d / 28);
        addFoam(x + fx * (2 - d) + sx * off, z + fz * (2 - d) + sz * off, 0.8 + d * 0.04, k);
        addFoam(x + fx * (2 - d) - sx * off, z + fz * (2 - d) - sz * off, 0.8 + d * 0.04, k);
      }
    }
    addRipple(x + fx * 3.0, z + fz * 3.0, 1.4, clamp(sp * dt * 0.25, 0, 0.05));      // bow pushes the surface up
    addRipple(x - fx * 3.0, z - fz * 3.0, 1.4, -clamp(sp * dt * 0.2, 0, 0.04));
    // spray off the bow and a rooster tail behind the propeller
    var n = sp * state.spray * dt * 34;
    for (var i = 0; i < n; i++) {
      var side = Math.random() < 0.5 ? -1 : 1, u = 1.2 + Math.random() * 1.4;
      var bx = x + fx * u + sx * side * (HULL.halfBeam(u) + 0.1), bz = z + fz * u + sz * side * (HULL.halfBeam(u) + 0.1);
      var out = 1.5 + Math.random() * 3 * (sp / 15), upv = 1.5 + Math.random() * 3.2 * (sp / 15);
      emitSpray(bx, b.pos[1] - 0.15, bz, b.vel[0] * 0.55 + sx * side * out, upv, b.vel[2] * 0.55 + sz * side * out, 0.12 + Math.random() * 0.3, 0.5 + Math.random() * 0.7);
    }
    if (sp > 6) {
      var nt = (sp - 6) * state.spray * dt * 10;
      for (i = 0; i < nt; i++) {
        emitSpray(x - fx * 3.9, b.pos[1] - 0.1, z - fz * 3.9, b.vel[0] * 0.3 - fx * (1 + Math.random() * 2) + (Math.random() - 0.5), 2 + Math.random() * 3.5,
          b.vel[2] * 0.3 - fz * (1 + Math.random() * 2) + (Math.random() - 0.5), 0.25 + Math.random() * 0.35, 0.8 + Math.random() * 0.8);
      }
    }
    // the hull slamming back down after leaving a crest
    if (b.vel[1] < -2.2 && b.wet > 0.05 && boat.slam <= 0) {
      boat.slam = 0.6;
      for (i = 0; i < 40 * state.spray; i++) {
        var ang = Math.random() * TAU, rr = 1 + Math.random() * 1.5;
        emitSpray(x + Math.cos(ang) * rr, b.pos[1] - 0.2, z + Math.sin(ang) * rr, Math.cos(ang) * 3 + b.vel[0] * 0.4, 2 + Math.random() * 3, Math.sin(ang) * 3 + b.vel[2] * 0.4, 0.3 + Math.random() * 0.4, 0.9 + Math.random() * 0.6);
      }
      addFoam(x, z, 3, -0.6 * W);
    }
    boat.slam -= dt;
  }

  // ===========================================================================
  //  pirate ship: a 24 m square-rigger driven by the wind in its sails
  // ===========================================================================
  var SHIP = {
    halfBeam: function (x) {
      var s = (x + 12) / 24;                                          // 0 stern .. 1 bow
      if (s < 0.42) return 3.1 * (0.8 + 0.2 * Math.sin(s / 0.42 * PI / 2));
      return 3.1 * Math.sqrt(Math.max(0, 1 - Math.pow((s - 0.42) / 0.58, 2)));
    },
    keel: function (x) { var s = (x + 12) / 24; return -2.4 + 2.1 * Math.pow(Math.max(0, (s - 0.8) / 0.2), 2) + 0.9 * Math.pow(Math.max(0, (0.05 - s) / 0.05), 2); },
    sheer: function (x) { var s = (x + 12) / 24; return 1.5 + 1.1 * Math.pow(Math.max(0, (s - 0.78) / 0.22), 2) + 0.5 * Math.pow(Math.max(0, (0.2 - s) / 0.2), 2); },
    masts: [[6.5, 17, 10.5], [0.5, 20, 12.5], [-6, 14, 8.5]]          // x, height above deck, yard length
  };
  function buildShipMeshes() {
    var pos = [], nrm = [], aux = [], idx = [];
    function vtx(p, n, a0, a1) { pos.push(p[0], p[1], p[2]); nrm.push(n[0], n[1], n[2]); aux.push(a0, a1); return pos.length / 3 - 1; }
    function quad(a, b, c, d, part) {
      var e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [d[0] - a[0], d[1] - a[1], d[2] - a[2]];
      var n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]], l = Math.hypot(n[0], n[1], n[2]) || 1;
      n = [n[0] / l, n[1] / l, n[2] / l];
      var o = vtx(a, n, part, 0); vtx(b, n, part, 0); vtx(c, n, part, 0); vtx(d, n, part, 0);
      idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
    }
    function box(x0, x1, y0, y1, z0, z1, part, top) {
      quad([x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], top === undefined ? part : top);
      quad([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], part);
      quad([x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0], part);
      quad([x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0], part);
      quad([x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [x0, y0, z1], part);
    }
    function cyl(p0, p1, r0, r1, part, segs) {
      segs = segs || 8;
      var d = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], L = Math.hypot(d[0], d[1], d[2]);
      d = [d[0] / L, d[1] / L, d[2] / L];
      var a = Math.abs(d[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      var u = [d[1] * a[2] - d[2] * a[1], d[2] * a[0] - d[0] * a[2], d[0] * a[1] - d[1] * a[0]], ul = Math.hypot(u[0], u[1], u[2]);
      u = [u[0] / ul, u[1] / ul, u[2] / ul];
      var v = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]], base = pos.length / 3;
      for (var i = 0; i <= segs; i++) {
        var t = TAU * i / segs, c = Math.cos(t), s = Math.sin(t), n = [u[0] * c + v[0] * s, u[1] * c + v[1] * s, u[2] * c + v[2] * s];
        vtx([p0[0] + n[0] * r0, p0[1] + n[1] * r0, p0[2] + n[2] * r0], n, part, 0);
        vtx([p1[0] + n[0] * r1, p1[1] + n[1] * r1, p1[2] + n[2] * r1], n, part, 0);
      }
      for (i = 0; i < segs; i++) { var o = base + i * 2; idx.push(o, o + 2, o + 1, o + 1, o + 2, o + 3); }
    }
    function section(x) {
      var b = Math.max(SHIP.halfBeam(x), 0.05), k = SHIP.keel(x), sh = SHIP.sheer(x);
      return [[x, k, 0], [x, k + 0.35 * (sh - k), b * 0.82], [x, k + 0.72 * (sh - k), b], [x, sh, b * 0.9]];
    }
    var NS = 36, i;
    for (i = 0; i < NS; i++) {
      var x0 = -12 + 24 * i / NS, x1 = -12 + 24 * (i + 1) / NS, A = section(x0), B = section(x1);
      for (var side = -1; side <= 1; side += 2) {
        var m = function (p) { return [p[0], p[1], p[2] * side]; };
        for (var k = 0; k < 3; k++) {
          if (side > 0) quad(m(A[k]), m(A[k + 1]), m(B[k + 1]), m(B[k]), 0);
          else quad(m(A[k]), m(B[k]), m(B[k + 1]), m(A[k + 1]), 0);
        }
        // bulwark: a low wall above the deck, with a gold cap rail
        var r0 = m([x0, A[3][1] + 0.9, A[3][2]]), r1 = m([x1, B[3][1] + 0.9, B[3][2]]);
        if (side > 0) quad(m(A[3]), r0, r1, m(B[3]), 0); else quad(m(A[3]), m(B[3]), r1, r0, 0);
        var c0 = m([x0, A[3][1] + 0.9, A[3][2] * 0.9]), c1 = m([x1, B[3][1] + 0.9, B[3][2] * 0.9]);
        if (side > 0) quad(r0, c0, c1, r1, 2); else quad(r0, r1, c1, c0, 2);
        // deck
        var d0 = m([x0, A[3][1] - 0.15, A[3][2] * 0.9]), d1 = m([x1, B[3][1] - 0.15, B[3][2] * 0.9]);
        if (side > 0) quad(d0, [x0, A[3][1] - 0.15, 0], [x1, B[3][1] - 0.15, 0], d1, 1); else quad(d0, d1, [x1, B[3][1] - 0.15, 0], [x0, A[3][1] - 0.15, 0], 1);
      }
    }
    var T = section(-12);
    for (var tk = 0; tk < 3; tk++) {
      quad([-12, T[tk][1], -T[tk][2]], [-12, T[tk][1], T[tk][2]], [-12, T[tk + 1][1], T[tk + 1][2]], [-12, T[tk + 1][1], -T[tk + 1][2]], 5);
    }
    // stern castle with gallery windows, and a forecastle
    var shS = SHIP.sheer(-12), bS = SHIP.halfBeam(-9) * 0.88;
    box(-12.2, -6.5, shS - 0.2, shS + 2.4, -bS, bS, 5, 1);
    box(-12.4, -6.3, shS + 2.4, shS + 2.65, -bS - 0.15, bS + 0.15, 2);
    var shF = SHIP.sheer(9), bF = SHIP.halfBeam(9) * 0.8;
    box(7.5, 10.6, shF - 0.2, shF + 0.9, -bF, bF, 5, 1);
    // masts, yards, bowsprit
    SHIP.masts.forEach(function (mt) {
      var dy = SHIP.sheer(mt[0]) - 0.2;
      cyl([mt[0], dy, 0], [mt[0], dy + mt[1], 0], 0.32, 0.16, 3, 10);
      [0.42, 0.78].forEach(function (f, j) {
        var y = dy + mt[1] * f, half = mt[2] * (j ? 0.38 : 0.5);
        cyl([mt[0] + 0.3, y, -half], [mt[0] + 0.3, y, half], 0.13, 0.13, 3, 6);
      });
      box(mt[0] - 0.9, mt[0] + 0.9, dy + mt[1] * 0.58, dy + mt[1] * 0.58 + 0.2, -0.9, 0.9, 3);   // fighting top
    });
    cyl([10.5, SHIP.sheer(10.5) + 0.5, 0], [17.5, SHIP.sheer(10.5) + 3.2, 0], 0.24, 0.12, 3, 8);
    var hull = meshFromArraysAux(pos, nrm, aux, idx);

    // sails: (u across 0..1, v down 0..1); a flag uses v + 2
    pos = []; nrm = []; aux = []; idx = [];
    function sail(xc, y0, y1, halfTop, halfBot, flag) {
      var NU = 8, NV = 6, base = pos.length / 3;
      for (var j = 0; j <= NV; j++) for (var i2 = 0; i2 <= NU; i2++) {
        var u = i2 / NU, v = j / NV, half = halfTop + (halfBot - halfTop) * v;
        vtx([xc, y0 + (y1 - y0) * v, (u - 0.5) * 2 * half], [1, 0, 0], u, flag ? v + 2 : v);
      }
      for (j = 0; j < NV; j++) for (i2 = 0; i2 < NU; i2++) {
        var o = base + j * (NU + 1) + i2;
        idx.push(o, o + NU + 1, o + 1, o + 1, o + NU + 1, o + NU + 2);
      }
    }
    SHIP.masts.forEach(function (mt) {
      var dy = SHIP.sheer(mt[0]) - 0.2, yC = dy + mt[1] * 0.42, yT = dy + mt[1] * 0.78;
      sail(mt[0] + 0.45, yC - 0.2, dy + 2.6, mt[2] * 0.48, mt[2] * 0.54);                 // course
      sail(mt[0] + 0.45, yT - 0.2, yC + 0.4, mt[2] * 0.36, mt[2] * 0.46);                 // topsail
    });
    var top = SHIP.sheer(0.5) - 0.2 + 20;
    (function () {                                                     // flag flying aft from the main truck
      var base = pos.length / 3, NU = 6, NV = 3;
      for (var j = 0; j <= NV; j++) for (var i2 = 0; i2 <= NU; i2++) {
        var u = i2 / NU, v = j / NV;
        vtx([0.5 - u * 2.6, top + 0.2 - v * 1.6, 0], [0, 0, 1], u, v + 2);
      }
      for (j = 0; j < NV; j++) for (i2 = 0; i2 < NU; i2++) { var o = base + j * (NU + 1) + i2; idx.push(o, o + NU + 1, o + 1, o + 1, o + NU + 1, o + NU + 2); }
    })();
    var sails = meshFromArraysAux(pos, nrm, aux, idx);
    return { hull: hull, sails: sails };
  }
  KINDS.ship = {
    kind: 10, mesh: 'ship', scale: [24, 5, 6.6], meshScale: [1, 1, 1], res: [16, 3, 5], density: 300, tint: [1, 1, 1], com: [-0.5, -1.7, 0],
    hDrag: 0.03,
    mask: function (x, y, z) {
      var k = SHIP.keel(x), sh = SHIP.sheer(x), b = SHIP.halfBeam(x);
      if (y < k - 0.2 || y > sh + 0.2) return false;
      return Math.abs(z) < b * clamp((y - k) / Math.max((sh - k) * 0.35, 0.1) * 0.82 + 0.25, 0.3, 1.0);
    }
  };
  var ship = { sailForce: 0, reload: [0, 0], balls: [] };
  function shipForces(b, h) {
    qRotate(b.q, [1, 0, 0], bf); qRotate(b.q, [0, 1, 0], bu); qRotate(b.q, [0, 0, 1], bs);
    var v = b.vel, vf = v[0] * bf[0] + v[1] * bf[1] + v[2] * bf[2], vs = v[0] * bs[0] + v[1] * bs[1] + v[2] * bs[2];
    var inWater = clamp(b.wet * 2.5, 0, 1), M = b.mass;
    // apparent wind on the sails; a square rig drives best with the wind behind or on the beam
    var wd = state.windDir * DEG, U = state.wind;
    var ax = Math.cos(wd) * U - v[0], az = Math.sin(wd) * U - v[2], A = Math.hypot(ax, az) + 1e-3;
    var fh = Math.hypot(bf[0], bf[2]) + 1e-6, cosT = (ax * bf[0] + az * bf[2]) / (A * fh);
    var eff = Math.max(0, cosT) * 0.9 + Math.max(0, 1 - Math.abs(cosT)) * 0.45 + 0.08;   // run, reach, a little even close-hauled
    // (a real 180 t brig would need far more canvas than looks right on screen: the gain is for play)
    var drive = M * 0.05 * A * A * eff * boat.throttle;
    drive = Math.min(drive, M * 1.8);
    ship.sailForce = clamp(drive / (M * 1.2), 0, 1);
    // drive acts at the centre of effort, high up: the ship heels and pitches with it
    qRotate(b.q, [0.5, 3.5, 0], bp);
    pushBody(b, [bf[0] * drive * 0.8 + (ax / A) * drive * 0.2, 0, bf[2] * drive * 0.8 + (az / A) * drive * 0.2], bp, h);
    // the ballast and the beam of the hull keep her from heeling too far
    var wb = qInvRotate(b.q, b.w, [0, 0, 0]);
    wb[0] *= Math.exp(-1.6 * h); wb[2] *= Math.exp(-1.0 * h);
    qRotate(b.q, wb, b.w);
    // rudder: turning force at the stern grows with speed through the water
    var rud = -boat.steer * M * 0.9 * clamp(Math.abs(vf) / 4, 0.15, 2.0) * inWater;
    qRotate(b.q, [-11.5, -1.5, 0], bp);
    pushBody(b, [bs[0] * rud, 0, bs[2] * rud], bp, h);
    // keel and hull drag
    var lat = -vs * M * 1.6 * inWater;
    qRotate(b.q, [0.8, -1.4, 0], bp);
    pushBody(b, [bs[0] * lat, bs[1] * lat, bs[2] * lat], bp, h);
    var fd = (-vf * Math.abs(vf) * 0.035 - vf * 0.05) * M * inWater;
    b.vel[0] += bf[0] * fd / M * h; b.vel[1] += bf[1] * fd / M * h; b.vel[2] += bf[2] * fd / M * h;
    b.w[1] *= Math.exp(-0.8 * h * inWater);
    boat.speed = Math.abs(vf);
  }
  var ballMesh = null;
  function fireCannons(side) {                                         // side: +1 starboard, -1 port, 0 both
    var b = boat.body; if (!b || !b.isShip) return;
    qRotate(b.q, [1, 0, 0], bf); qRotate(b.q, [0, 1, 0], bu); qRotate(b.q, [0, 0, 1], bs);
    [-1, 1].forEach(function (sd) {
      if (side && side !== sd) return;
      var si = sd > 0 ? 1 : 0;
      if (ship.reload[si] > 0) return;
      ship.reload[si] = 2.5;
      for (var g = 0; g < 5; g++) {
        var lx = -6 + g * 3, ly = SHIP.sheer(lx) - 0.9, lz = SHIP.halfBeam(lx) * sd * 1.02;
        var r = qRotate(b.q, [lx - b.com[0], ly - b.com[1], lz - b.com[2]], [0, 0, 0]);
        var p = [b.pos[0] + r[0], b.pos[1] + r[1], b.pos[2] + r[2]];
        var spd = 90 + Math.random() * 10, up = 0.07 + Math.random() * 0.04;
        var dir = [bs[0] * sd + bu[0] * up, bs[1] * sd + bu[1] * up + up, bs[2] * sd + bu[2] * up];
        var dl = Math.hypot(dir[0], dir[1], dir[2]);
        ship.balls.push({ p: p, v: [dir[0] / dl * spd + b.vel[0], dir[1] / dl * spd + b.vel[1], dir[2] / dl * spd + b.vel[2]], t: g * 0.11, fired: false });
      }
      // recoil rolls the ship away from the broadside
      pushBody(b, [-bs[0] * sd * b.mass * 0.6, 0, -bs[2] * sd * b.mass * 0.6], qRotate(b.q, [0, 1.0, 0], [0, 0, 0]), 0.2);
    });
    sound.cannon && sound.cannon();
  }
  function stepShip(dt) {
    ship.reload[0] = Math.max(0, ship.reload[0] - dt); ship.reload[1] = Math.max(0, ship.reload[1] - dt);
    for (var i = ship.balls.length - 1; i >= 0; i--) {
      var c = ship.balls[i];
      if (c.t > 0) { c.t -= dt; continue; }                            // ripple-fire down the battery
      if (!c.fired) {
        c.fired = true;
        for (var s = 0; s < 18; s++) {                                 // muzzle smoke, drifting with the wind
          var wd = state.windDir * DEG;
          emitSpray(c.p[0], c.p[1], c.p[2], c.v[0] * 0.04 + Math.cos(wd) * 2 + (Math.random() - 0.5) * 3, 0.6 + Math.random() * 1.5,
            c.v[2] * 0.04 + Math.sin(wd) * 2 + (Math.random() - 0.5) * 3, 0.7 + Math.random() * 1.2, 2.5 + Math.random() * 2.5, -0.8);
        }
        flash.muzzle = 1;
      }
      c.v[1] -= 9.81 * dt;
      c.p[0] += c.v[0] * dt; c.p[1] += c.v[1] * dt; c.p[2] += c.v[2] * dt;
      var hit = null;
      for (var k = 0; k < bodies.length; k++) {
        var bb = bodies[k];
        if (bb.isShip) continue;
        if (Math.hypot(bb.pos[0] - c.p[0], bb.pos[1] - c.p[1], bb.pos[2] - c.p[2]) < bb.radius + 0.3) { hit = bb; break; }
      }
      if (hit) {
        hit.vel[0] += c.v[0] * 0.15; hit.vel[1] += 4; hit.vel[2] += c.v[2] * 0.15;
        hit.w[0] += (Math.random() - 0.5) * 6; hit.w[2] += (Math.random() - 0.5) * 6;
        for (s = 0; s < 30; s++) emitSpray(c.p[0], c.p[1], c.p[2], (Math.random() - 0.5) * 8, Math.random() * 6, (Math.random() - 0.5) * 8, 0.3 + Math.random() * 0.5, 0.8 + Math.random(), -0.6);
        ship.balls.splice(i, 1);
        continue;
      }
      var surf = surfHeight(c.p[0], c.p[2], simTime) + rogueHeight(c.p[0], c.p[2]);
      if (c.p[1] < surf + 0.1) {                                       // a tall white plume and a ring of foam
        for (s = 0; s < 70 * Math.max(state.spray, 0.3); s++) {
          var a = Math.random() * TAU, rr = Math.random() * 1.2, up = 5 + Math.random() * 12;
          emitSpray(c.p[0] + Math.cos(a) * rr, surf, c.p[2] + Math.sin(a) * rr, Math.cos(a) * (1 + Math.random() * 3), up, Math.sin(a) * (1 + Math.random() * 3), 0.25 + Math.random() * 0.5, 1.2 + Math.random() * 0.9);
        }
        addRipple(c.p[0], c.p[2], 2.5, -0.5); addFoam(c.p[0], c.p[2], 3.5, -0.9);
        sound.splash && sound.splash(Math.hypot(c.p[0] - cam.pos[0], c.p[2] - cam.pos[2]));
        ship.balls.splice(i, 1);
      } else if (c.p[1] < -60 || ship.balls.length > 60) ship.balls.splice(i, 1);
    }
    flash.muzzle = Math.max(0, (flash.muzzle || 0) - dt * 6);
  }
  function drawShipParts(po, shadowPass) {
    var b = boat.body;
    if (b && b.isShip && bodies.indexOf(b) >= 0) {
      var wind = 0.6 + ship.sailForce * 1.6;
      po.m4('uModel', b.model).v3('uScale', [1, 1, 1]).i('uKind', 9).f('uSeed', b.seed).f('uTint', 1, 1, 1)
        .f('uSail', wind * boat.throttle + 0.15, 0.4 + state.wind * 0.03, boat.throttle, 0);
      gl.bindVertexArray(mesh.shipSails.vao); gl.drawElements(gl.TRIANGLES, mesh.shipSails.count, gl.UNSIGNED_INT, 0);
      po.f('uSail', 0, 0, 0, 0);
    }
    if (ship.balls.length && !shadowPass) {
      po.i('uKind', 8).v3('uScale', [0.32, 0.32, 0.32]).f('uTint', 0.05, 0.05, 0.05);
      gl.bindVertexArray(ballMesh.vao);
      for (var i = 0; i < ship.balls.length; i++) {
        var c = ship.balls[i]; if (c.t > 0) continue;
        modelMatrix(mModel, IDENT_Q, c.p); po.m4('uModel', mModel);
        gl.drawElements(gl.TRIANGLES, ballMesh.count, gl.UNSIGNED_INT, 0);
      }
    }
  }
  function shipWake(dt) {
    var b = boat.body; if (!b || !b.isShip || bodies.indexOf(b) < 0) return;
    var sp = Math.hypot(b.vel[0], b.vel[2]);
    if (b.wet < 0.03 || sp < 0.6) return;
    var fx = b.vel[0] / sp, fz = b.vel[2] / sp, sx = -fz, sz = fx, W = state.wake;
    var x = b.pos[0], z = b.pos[2], amt = -Math.min(0.2, sp * 0.22 * dt) * W;
    addFoam(x + fx * 11.5, z + fz * 11.5, 1.6, amt * 1.2);                           // bow wave breaking at the cutwater
    for (var u = -9; u <= 9; u += 6) {                                               // water churned along the hull
      var hb = SHIP.halfBeam(u) + 0.6;
      addFoam(x + fx * u + sx * hb, z + fz * u + sz * hb, 1.2, amt * 0.5);
      addFoam(x + fx * u - sx * hb, z + fz * u - sz * hb, 1.2, amt * 0.5);
    }
    addFoam(x - fx * 12.5, z - fz * 12.5, 2.4, amt);                                  // the stern wake
    for (var d = 10; d <= 40; d += 10) {                                             // Kelvin arms
      var off = 3.2 + d * 0.354, k = amt * 0.4 * (1 - d / 50);
      addFoam(x + fx * (11 - d) + sx * off, z + fz * (11 - d) + sz * off, 1.4, k);
      addFoam(x + fx * (11 - d) - sx * off, z + fz * (11 - d) - sz * off, 1.4, k);
    }
    addRipple(x + fx * 12, z + fz * 12, 3, clamp(sp * dt * 0.2, 0, 0.05));
    var n = sp * state.spray * dt * 8;                                               // spray thrown off the bow
    for (var i = 0; i < n; i++) {
      var side = Math.random() < 0.5 ? -1 : 1, uu = 8 + Math.random() * 3;
      emitSpray(x + fx * uu + sx * side * (SHIP.halfBeam(uu) + 0.2), b.pos[1] - 1.2, z + fz * uu + sz * side * (SHIP.halfBeam(uu) + 0.2),
        b.vel[0] * 0.5 + sx * side * (1 + Math.random() * 2.5), 1 + Math.random() * 3 * (sp / 6), b.vel[2] * 0.5 + sz * side * (1 + Math.random() * 2.5),
        0.25 + Math.random() * 0.4, 0.7 + Math.random() * 0.6);
    }
  }

  // ===========================================================================
  //  particles: spray and splashes (CPU), rain (GPU, from the instance id)
  // ===========================================================================
  var PMAX = 3000, PS = 10, part = { n: 0, x: new Float32Array(PMAX * PS), inst: new Float32Array(PMAX * 5), vao: null, ib: null, quad: null, rainVao: null };
  function emitSpray(x, y, z, vx, vy, vz, size, life, alpha) {
    if (part.n >= PMAX) return;
    var o = part.n++ * PS, X = part.x;
    X[o] = x; X[o + 1] = y; X[o + 2] = z; X[o + 3] = vx; X[o + 4] = vy; X[o + 5] = vz; X[o + 6] = life; X[o + 7] = life; X[o + 8] = size;
    X[o + 9] = alpha === undefined ? 1 : alpha;
  }
  function stepParticles(dt) {
    var X = part.x, drag = Math.exp(-1.4 * dt);
    for (var i = 0; i < part.n; i++) {
      var o = i * PS;
      var a9 = X[o + 9], neutral = a9 > 0 && a9 < 0.2;
      X[o + 4] -= 9.81 * dt * (neutral ? 0 : a9 < 0 ? -0.12 : a9 < 0.5 ? 0.25 : 1);   // smoke rises, spindrift mist hangs, snow drifts
      X[o + 3] *= drag; X[o + 4] *= drag; X[o + 5] *= drag;
      X[o] += X[o + 3] * dt; X[o + 1] += X[o + 4] * dt; X[o + 2] += X[o + 5] * dt;
      X[o + 6] -= dt;
      if (X[o + 6] <= 0 || (!neutral && X[o + 1] < -0.6 && X[o + 4] < 0)) {        // gone, or back in the sea
        var last = (--part.n) * PS;
        for (var k = 0; k < PS; k++) X[o + k] = X[last + k];
        i--;
      }
    }
  }
  function buildParticles() {
    part.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, part.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
    part.vao = gl.createVertexArray();
    gl.bindVertexArray(part.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, part.quad);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    part.ib = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, part.ib); gl.bufferData(gl.ARRAY_BUFFER, part.inst.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 20, 0); gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 20, 16); gl.vertexAttribDivisor(2, 1);
    var rq = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rq);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 0, 1, 0, 1, 1, -1, 0, 1, 1, -1, 1]), gl.STATIC_DRAW);
    part.rainVao = gl.createVertexArray();
    gl.bindVertexArray(part.rainVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, rq);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
  }
  function drawParticles() {
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST); gl.depthMask(false);
    if (part.n > 0) {
      var X = part.x, I = part.inst;
      for (var i = 0; i < part.n; i++) {
        var o = i * PS, f = X[o + 6] / X[o + 7];
        I[i * 5] = X[o]; I[i * 5 + 1] = X[o + 1]; I[i * 5 + 2] = X[o + 2];
        I[i * 5 + 3] = X[o + 8] * (1 + (1 - f) * 1.6);
        I[i * 5 + 4] = Math.pow(f, 0.7) * 0.6 * X[o + 9];
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, part.ib); gl.bufferSubData(gl.ARRAY_BUFFER, 0, I.subarray(0, part.n * 5));
      setFrame(prog.spray.use()).m4('uViewProj', cam.viewProj).v3('uCamRight', cam.right).v3('uCamUp', cam.up);
      gl.bindVertexArray(part.vao);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, part.n);
    }
    if (state.rain > 0.01 && !cam.underwater) {
      var wd = state.windDir * DEG, drift = 1 + state.wind * 0.35;
      setFrame(prog.rain.use()).m4('uViewProj', cam.viewProj).f('uFall', Math.cos(wd) * drift, -9.5, Math.sin(wd) * drift)
        .f('uBox', 18).f('uShutter', 0.05 * state.rainSize).f('uDropSize', state.rainSize).f('uAmount', Math.min(0.35 + state.rain * 0.8, 1));
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.bindVertexArray(part.rainVao);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, Math.round(14000 * Math.pow(state.rain, 1.3)));
    }
    gl.disable(gl.BLEND); gl.depthMask(true);
  }

  // ===========================================================================
  //  weather on the sea: rogue wave groups, gust drift, spindrift, rain splashes
  // ===========================================================================
  // A rogue wave is one wave group that focuses as it passes the camera: the envelope
  // moves at the group speed, the crests inside it at twice that.
  var rogue = { on: false, t0: 0, x0: 0, z0: 0, cx: 0, cz: 0, dx: 1, dz: 0, h: 0, k: 0.04, phase: 0, len: 150, peak: 0, next: 20, tx: 0, tz: 0 };
  function spawnRogue() {
    var L = Math.max(sea.lp, state.swell > 0.3 ? state.swellLen : 0, 60), dir = (state.swell > 0.3 ? state.swellDir : state.windDir) * DEG;
    rogue.on = true; rogue.t0 = simTime; rogue.k = TAU / L; rogue.len = L * 1.1;
    rogue.dx = Math.cos(dir); rogue.dz = Math.sin(dir);
    rogue.tx = cam.target[0]; rogue.tz = cam.target[2];
    rogue.x0 = rogue.tx - rogue.dx * 650; rogue.z0 = rogue.tz - rogue.dz * 650;
    rogue.peak = Math.max(state.rogue, 0.5);
  }
  function stepRogue() {
    if (state.rogue > 0 && !rogue.on && simTime > rogue.next) spawnRogue();
    if (!rogue.on) { rogue.h = 0; return; }
    var w = Math.sqrt(9.81 * rogue.k), cg = w / (2 * rogue.k), t = simTime - rogue.t0, s = cg * t;
    rogue.cx = rogue.x0 + rogue.dx * s; rogue.cz = rogue.z0 + rogue.dz * s;
    rogue.phase = -0.5 * w * t;
    var away = s - 650;                                            // metres past the point it was aimed at
    rogue.h = rogue.peak * (0.3 + 0.7 * Math.exp(-away * away / (380 * 380)));
    if (away > 700) { rogue.on = false; rogue.h = 0; rogue.next = simTime + state.rogueEvery * (0.7 + Math.random() * 0.6); }
  }
  function rogueHeight(x, z) {
    if (rogue.h <= 0.01) return 0;
    var qx = x - rogue.cx, qz = z - rogue.cz, s = qx * rogue.dx + qz * rogue.dz, n = -qx * rogue.dz + qz * rogue.dx, L = rogue.len;
    var env = Math.exp(-(s * s) / (L * L) - (n * n) / (9 * L * L)) * smoothstep(2, 14, depthAt(x, z));
    var A = 0.5 * rogue.h * env, th = rogue.k * s + rogue.phase;
    return A * Math.cos(th) + 0.12 * rogue.k * A * A * Math.cos(2 * th);
  }
  var gustDrift = [0, 0];
  function bioGlow() {
    var night = smoothstep(4, -6, state.sunElev), c = OP.hexToRgb(state.bioCol), k = state.bio * night * 0.09;
    return [c[0] * k, c[1] * k, c[2] * k];
  }
  function stepWeather(dt) {
    stepRogue();
    var wd = state.windDir * DEG, wx = Math.cos(wd), wz = Math.sin(wd), gs = state.wind * 0.6;
    gustDrift[0] += wx * gs * dt; gustDrift[1] += wz * gs * dt;
    var cx = cam.target[0], cz = cam.target[2];
    // spindrift: spray torn off the crests and blown downwind in a gale
    var sd = state.spindrift * smoothstep(14, 24, state.wind) * dt * 260;
    for (var i = 0; i < sd; i++) {
      var a = Math.random() * TAU, r = 6 + Math.random() * 55;
      var x = cx + Math.cos(a) * r - wx * 20, z = cz + Math.sin(a) * r - wz * 20;
      var sp = state.wind * (0.55 + Math.random() * 0.4);
      emitSpray(x, Math.random() * sea.hs * 0.45, z, wx * sp, 0.5 + Math.random() * 2, wz * sp, 0.35 + Math.random() * 0.9, 1.2 + Math.random() * 1.8, 0.35);
    }
    // underwater: drifting specks catch the light (marine snow)
    if (cam.underwater) for (i = 0; i < dt * 60; i++) {
      var ma = Math.random() * TAU, mr = 1 + Math.random() * 9;
      emitSpray(cam.pos[0] + Math.cos(ma) * mr, cam.pos[1] + (Math.random() - 0.5) * 6, cam.pos[2] + Math.sin(ma) * mr,
        (Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.15, 0.02 + Math.random() * 0.03, 4 + Math.random() * 4, 0.15);
    }
    // rain hitting the sea throws up little crowns of droplets
    var rs = state.rain * state.rainSplash * dt * 700;
    if (!cam.underwater) for (i = 0; i < rs; i++) {
      var a2 = Math.random() * TAU, r2 = 1 + Math.sqrt(Math.random()) * 17;
      var x2 = cam.pos[0] + Math.cos(a2) * r2, z2 = cam.pos[2] + Math.sin(a2) * r2;
      emitSpray(x2, surfaceAt(x2, z2, camProbe) + 0.02, z2, (Math.random() - 0.5) * 0.6, 0.8 + Math.random() * 1.2, (Math.random() - 0.5) * 0.6, 0.025 + Math.random() * 0.04 * state.rainSize, 0.22 + Math.random() * 0.15, 0.9);
    }
  }

  // ===========================================================================
  //  lightning: a few quick pulses per strike, at random intervals
  // ===========================================================================
  var bolt = { t: 9, az: 0, seed: 0, top: 0.1 };
  function stepLightning(dt) {
    var on = state.lightning > 0.01 && state.clouds > 0.55;
    flash.timer -= dt;
    if (on && flash.timer <= 0) {
      bolt.t = 0; bolt.az = flash.aim !== undefined ? flash.aim : Math.random() * TAU; bolt.seed = Math.random() * 100; flash.aim = undefined;
      var dist = 2500 + Math.random() * 6000;
      if (sound.thunder) sound.thunder(dist);
      bolt.top = Math.atan2(state.cloudBase, dist);
      bolt.near = 1 - (dist - 2500) / 6000;
      flash.timer = (2 + Math.random() * 10) / Math.max(state.lightning, 0.05);
    }
    bolt.t += dt;
    var t = bolt.t, g = function (c, w) { return Math.exp(-Math.pow((t - c) / w, 2)); };
    flash.level = on ? (g(0.02, 0.04) + 0.7 * g(0.16, 0.035) + 0.55 * g(0.33, 0.05) + 0.25 * g(0.5, 0.08)) * (0.5 + 0.5 * (bolt.near || 0)) : 0;
  }

  // ---- simulation step --------------------------------------------------------
  var H = 1 / 120, physAcc = 0;
  function simulate(dt) {
    simTime += dt;
    tideNow = state.tide + state.tideRange * Math.sin(TAU * simTime / Math.max(state.tidePeriod, 5));
    easeSea(dt);
    physAcc = Math.min(physAcc + dt, 0.06);
    while (physAcc >= H) {
      physTime += H;
      if (!fft) waves.advance(H);
      for (var i = 0; i < bodies.length; i++) { if (bodies[i].isShip) shipForces(bodies[i], H); else if (bodies[i].isBoat) boatForces(bodies[i], H); stepBody(bodies[i], H, physTime); }
      collideBodies();
      physAcc -= H;
    }
    for (i = bodies.length - 1; i >= 0; i--) if (bodies[i].pos[1] < -80 || !isFinite(bodies[i].pos[1])) bodies.splice(i, 1);
    bodyDisturbances(dt);
    boatControls(dt);
    boatWake(dt);
    stepWeather(dt);
    stepShip(dt);
    stepParticles(dt);
    stepLightning(dt);
    var wd = state.windDir * DEG, cs = 0.004 + state.wind * 0.0012;
    var cspd = (4 + state.wind * 1.2) * state.cloudSpeed;              // m/s at cloud height
    cloudWind[0] -= Math.cos(wd) * cspd * dt; cloudWind[2] -= Math.sin(wd) * cspd * dt;
  }

  // ---- adaptive resolution ------------------------------------------------------
  // Drop the render scale when frames run long, creep back up when there is headroom.
  // Each time a raise has to be undone, wait twice as long before trying again.
  var perf = { ema: 16, timer: 0, clock: 0, fast: 0, fps: 60, hold: 8000, blockUntil: 0 };
  function adaptResolution(dtMs) {
    perf.ema += (dtMs - perf.ema) * 0.06;
    perf.fps = 1000 / perf.ema;
    perf.timer += dtMs; perf.clock += dtMs;
    if (TEST || perf.locked || perf.clock < 2500 || perf.timer < 1500) return;      // ignore start-up hitches; hold still while recording
    perf.timer = 0;
    if (perf.ema > 27 && quality.scale > 0.5) {
      quality.scale = Math.max(0.5, quality.scale - 0.125);
      perf.blockUntil = perf.clock + perf.hold; perf.hold = Math.min(perf.hold * 2, 120000); perf.fast = 0;
    } else if (perf.ema < 18.5 && quality.scale < 1 && perf.clock >= perf.blockUntil) {
      if (++perf.fast >= 3) { quality.scale = Math.min(1, quality.scale + 0.125); perf.fast = 0; }
    } else perf.fast = 0;
  }

  // ===========================================================================
  //  sound: procedural, driven by the same state as the picture
  // ===========================================================================
  var audio = { ctx: null, on: false, n: null, dest: null };
  function noiseBuffer(ctx, seconds, kind) {
    var len = Math.floor(ctx.sampleRate * seconds), buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch), b0 = 0, b1 = 0, b2 = 0, last = 0;
      for (var i = 0; i < len; i++) {
        var w = Math.random() * 2 - 1;
        if (kind === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
        else if (kind === 'pink') { b0 = 0.997 * b0 + w * 0.029591; b1 = 0.985 * b1 + w * 0.032534; b2 = 0.95 * b2 + w * 0.048056; d[i] = (b0 + b1 + b2 + w * 0.0186) * 2.2; }
        else d[i] = w * 0.5;
      }
    }
    return buf;
  }
  // The mix: sea roar, wash, wind, rain beds, an engine, into a compressor. Built the same
  // way for the live context and for an offline one (film renders).
  function buildAudioGraph(ctx) {
    var n = { ctx: ctx, buf: { brown: noiseBuffer(ctx, 5, 'brown'), pink: noiseBuffer(ctx, 5, 'pink'), white: noiseBuffer(ctx, 3, 'white') } };
    n.master = ctx.createGain(); n.master.gain.value = 0.9;
    n.under = ctx.createBiquadFilter(); n.under.type = 'lowpass'; n.under.frequency.value = 18000;
    n.comp = ctx.createDynamicsCompressor(); n.comp.threshold.value = -16; n.comp.ratio.value = 3;
    n.master.connect(n.under); n.under.connect(n.comp); n.comp.connect(ctx.destination);
    function bed(buf, type, freq, q) {
      var s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.loopStart = Math.random();
      var f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q || 0.7;
      var g = ctx.createGain(); g.gain.value = 0;
      s.connect(f); f.connect(g); g.connect(n.master); s.start();
      return { f: f, g: g };
    }
    n.sea = bed(n.buf.brown, 'lowpass', 500);              // the low roar of open water
    n.wash = bed(n.buf.pink, 'bandpass', 900, 0.5);        // waves breaking, foam fizzing
    n.wind = bed(n.buf.pink, 'bandpass', 500, 1.4);
    n.rain = bed(n.buf.white, 'highpass', 2600);
    n.eng = ctx.createGain(); n.eng.gain.value = 0;
    var ef = ctx.createBiquadFilter(); ef.type = 'lowpass'; ef.frequency.value = 520; ef.Q.value = 2;
    n.o1 = ctx.createOscillator(); n.o1.type = 'sawtooth'; n.o2 = ctx.createOscillator(); n.o2.type = 'square';
    n.o1.connect(ef); n.o2.connect(ef); ef.connect(n.eng); n.eng.connect(n.master); n.o1.start(); n.o2.start();
    return n;
  }
  function startAudio() {
    if (audio.ctx) { audio.ctx.resume(); audio.on = true; return; }
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    var ctx = new AC();
    audio.n = buildAudioGraph(ctx);
    audio.dest = ctx.createMediaStreamDestination(); audio.n.comp.connect(audio.dest);
    audio.ctx = ctx; audio.on = true;
  }
  function stopAudio() { if (audio.ctx) audio.ctx.suspend(); audio.on = false; }
  // one burst of filtered noise: kind of noise, filter, gain envelope; at time t in context n.ctx
  function playShot(n, t, a) {
    var ctx = n.ctx, s = ctx.createBufferSource(); s.buffer = n.buf[a[0]]; s.playbackRate.value = a[6] || 1;
    var f = ctx.createBiquadFilter(); f.type = a[1]; f.frequency.value = a[2];
    var g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a[3], t + a[4]); g.gain.exponentialRampToValueAtTime(0.0005, t + a[4] + a[5]);
    s.connect(f); f.connect(g); g.connect(n.master); s.start(t, Math.random() * 1.5); s.stop(t + a[4] + a[5] + 0.1);
  }
  function oneShot(kind, type, freq, gain, attack, decay, delay, rate) {
    var a = [kind, type, freq, gain, attack, decay, rate];
    if (film.on) { film.events.push({ t: film.time + (delay || 0), a: a }); return; }
    if (audio.on && audio.n) playShot(audio.n, audio.ctx.currentTime + (delay || 0), a);
  }
  sound.cannon = function () {
    for (var i = 0; i < 5; i++) {
      oneShot('brown', 'lowpass', 180, 1.6, 0.004, 1.8, i * 0.11, 0.7);
      oneShot('white', 'lowpass', 2400, 0.5, 0.002, 0.25, i * 0.11);
    }
  };
  sound.splash = function (dist) { oneShot('white', 'bandpass', 1300, 0.9 / (1 + dist / 60), 0.01, 0.9, dist / 343); };
  sound.thunder = function (dist) {
    var d = dist / 343, g = clamp(2.2 - dist / 4000, 0.3, 1.8);
    oneShot('brown', 'lowpass', 260, g, 0.05, 3.5, Math.min(d, 9), 0.6);
    oneShot('brown', 'lowpass', 120, g * 0.8, 0.4, 5.0, Math.min(d, 9) + 0.3, 0.5);
  };
  // what each part of the mix should be doing now, from the state of the scene
  function audioTargets(t) {
    var hs = Math.min(sea.hs, 8), height = Math.max(cam.pos[1], 1), near = clamp(1.25 - Math.log(height) / Math.log(300), 0.15, 1.1);
    var swell = 0.5 + 0.5 * Math.sin(t * TAU / Math.max(sea.tp, 3)), under = cam.underwater ? 1 : 0;
    var shore = state.surf > 0.01 ? smoothstep(16, 1, depthAt(cam.target[0], cam.target[2])) * clamp(state.surf / 2, 0.25, 1.5) : 0;
    var crash = Math.exp(-5 * ((simTime % state.surfPeriod) / state.surfPeriod));
    var gust = 0.7 + 0.3 * Math.sin(t * 0.63) * Math.sin(t * 1.71);
    var b = boat.body, engine = b && !b.isShip && bodies.indexOf(b) >= 0 && state.boat;
    var dist = engine ? Math.hypot(b.pos[0] - cam.pos[0], b.pos[1] - cam.pos[1], b.pos[2] - cam.pos[2]) : 1e9;
    var f0 = 36 + 64 * boat.throttle + 2.2 * (boat.speed || 0);
    return [
      under ? 420 : 18000,
      (0.12 + 0.07 * hs) * near * (0.75 + 0.25 * swell), 260 + 70 * hs + 200 * swell,
      (0.025 + 0.05 * clamp(state.foam * state.wind / 15, 0, 1.5) + 0.3 * shore * crash) * near,
      smoothstep(3, 26, state.wind) * 0.32 * gust * (1 - 0.8 * under), 260 + state.wind * 28 * gust,
      state.rain * 0.22 * (1 - 0.9 * under),
      engine ? clamp(10 / (dist + 6), 0, 1) * (0.06 + 0.22 * boat.throttle) : 0, f0, f0 * 1.5 + 1.3
    ];
  }
  function applyTargets(n, v, t) {
    n.under.frequency.setTargetAtTime(v[0], t, 0.08);
    n.sea.g.gain.setTargetAtTime(v[1], t, 0.2); n.sea.f.frequency.setTargetAtTime(v[2], t, 0.2);
    n.wash.g.gain.setTargetAtTime(v[3], t, 0.1);
    n.wind.g.gain.setTargetAtTime(v[4], t, 0.2); n.wind.f.frequency.setTargetAtTime(v[5], t, 0.2);
    n.rain.g.gain.setTargetAtTime(v[6], t, 0.2);
    n.eng.gain.setTargetAtTime(v[7], t, 0.1); n.o1.frequency.setTargetAtTime(v[8], t, 0.1); n.o2.frequency.setTargetAtTime(v[9], t, 0.1);
  }
  function updateAudio() {
    if (film.on) { if (film.frame % 2 === 0) film.alog.push({ t: film.time, v: audioTargets(film.time) }); return; }
    if (!audio.on || !audio.ctx) return;
    applyTargets(audio.n, audioTargets(audio.ctx.currentTime), audio.ctx.currentTime);
  }

  // ===========================================================================
  //  showreel: a scripted tour of the scenes, and a recorder for it
  // ===========================================================================
  var TOUR = [
    { scene: 'glass', dur: 7, title: ['OCEAN WATER LAB', 'An open-source real-time ocean for games'], cam: { from: [-20, 30, -1.45, 0.03, 36], to: [-20, 30, -1.05, 0.08, 24] } },
    { scene: 'tropical', dur: 8, caption: ['Tropical Bay', 'FFT ocean · volumetric clouds · shoreline'], cam: { follow: true, yaw: [1.1, 2.3], dist: [20, 15], pitch: 0.13 } },
    { scene: 'surfbeach', dur: 8, caption: ['Big Surf', 'Breakers that follow the depth, foam torn into streaks'], cam: { from: [-68, 18, 0.15, 1.05, 50], to: [-73, 22, 0.55, 0.72, 36] } },
    { scene: 'golden', dur: 8, caption: ['Golden Coast', 'Physical sky · sun glitter · speedboat wake'], cam: { follow: true, yaw: [-0.5, 0.7], dist: [13, 20], pitch: 0.09 } },
    { scene: 'pirate', dur: 11, caption: ['Pirate Seas', 'Sailing by the wind · broadsides'], fire: [3.2, 7.5], cam: { follow: true, yaw: [2.5, 1.3], dist: [44, 34], pitch: 0.11 } },
    { scene: 'deep', dur: 10, caption: ['Rogue Wave', 'A wave group that focuses as it passes'], rogue: 0.55, cam: { from: [150, -150, -2.09, 0.04, 36], to: [150, -150, -1.95, 0.1, 30] } },
    { scene: 'hurricane', dur: 9, caption: ['Hurricane', 'Torrential rain · gust fronts · spindrift · lightning'], strikes: [1.8, 5.2, 7.6], cam: { from: [60, -60, 2.4, 0.1, 44], to: [60, -60, 2.9, 0.15, 36] } },
    { scene: 'night', dur: 9, caption: ['Moonlit', 'Bioluminescent wake'], cam: { follow: true, yaw: [0.4, -0.5], dist: [14, 19], pitch: 0.12 } },
    { scene: 'golden', dur: 7, title: ['OPEN SOURCE', 'github.com/rahulbhola877/ocean-water-lab'], end: true, cam: { from: [-40, 15, 0.2, 0.05, 34], to: [-40, 15, 0.42, 0.14, 48] } }
  ];
  var tour = { on: false, i: -1, t: 0, fade: 0, caption: null, fired: {}, onEnd: null };
  function startTour(onEnd) {
    tour.on = true; tour.i = -1; tour.t = 0; tour.onEnd = onEnd || null;
    document.body.classList.add('touring');
    nextShot();
  }
  function stopTour() {
    tour.on = false; tour.fade = 0; tour.caption = null; $('tour-caption').hidden = true;
    document.body.classList.remove('touring');
    if (tour.onEnd) { var f = tour.onEnd; tour.onEnd = null; f(); }
    syncUI();
  }
  function nextShot() {
    tour.i++; tour.t = 0; tour.fired = {};
    if (tour.i >= TOUR.length) { stopTour(); return; }
    var s = TOUR[tour.i];
    applyScene(s.scene);
    state.autopilot = true; state.follow = false;
    if (s.rogue) {
      spawnRogue();
      var w = Math.sqrt(9.81 * rogue.k), cg = w / (2 * rogue.k);
      rogue.t0 -= Math.max(0, (650 - cg * s.dur * s.rogue) / cg);
    }
    if (s.cam.follow && boat.body) {                                   // start the chase already behind the vessel at speed
      qRotate(boat.body.q, [1, 0, 0], bf);
      var sp = boat.body.isShip ? 4 : 12;
      boat.body.vel[0] = bf[0] * sp; boat.body.vel[2] = bf[2] * sp; boat.throttle = boat.body.isShip ? 1 : 0.85;
    }
    tour.caption = s.title ? { big: true, a: s.title[0], b: s.title[1] } : { big: false, a: s.caption[0], b: s.caption[1] };
    var cap = $('tour-caption');
    cap.hidden = false; cap.className = 'plate' + (tour.caption.big ? ' big' : '');
    $('tour-a').textContent = tour.caption.a; $('tour-b').textContent = tour.caption.b;
    placeTourCamera(0, true);
  }
  function placeTourCamera(f, snap) {
    var s = TOUR[tour.i], c = s.cam, e = f * f * (3 - 2 * f), k;
    if (c.follow && boat.body && bodies.indexOf(boat.body) >= 0) {
      var b = boat.body;
      qRotate(b.q, [1, 0, 0], bf);
      var heading = Math.atan2(bf[2], bf[0]);
      cam.tTarget[0] = b.pos[0]; cam.tTarget[1] = b.pos[1] + (b.isShip ? 6 : 1.4); cam.tTarget[2] = b.pos[2];
      cam.tYaw = heading + PI + mix(c.yaw[0], c.yaw[1], e); cam.tDist = mix(c.dist[0], c.dist[1], e); cam.tPitch = c.pitch;
    } else {
      var a = c.from, z = c.to;
      cam.tTarget[0] = mix(a[0], z[0], e); cam.tTarget[1] = 1; cam.tTarget[2] = mix(a[1], z[1], e);
      cam.tYaw = mix(a[2], z[2], e); cam.tPitch = mix(a[3], z[3], e); cam.tDist = mix(a[4], z[4], e);
    }
    if (snap) { for (k = 0; k < 3; k++) cam.target[k] = cam.tTarget[k]; cam.yaw = cam.tYaw; cam.pitch = cam.tPitch; cam.dist = cam.tDist; }
  }
  function stepTour(dt) {
    if (!tour.on) return;
    var s = TOUR[tour.i];
    tour.t += dt;
    var f = clamp(tour.t / s.dur, 0, 1);
    placeTourCamera(f, false);
    lastInput = performance.now();
    tour.fade = Math.max(smoothstep(0.7, 0, tour.t), smoothstep(s.dur - 0.7, s.dur, tour.t)) * (tour.i === 0 && tour.t < 0.7 ? 1 : 1);
    (s.fire || []).forEach(function (at, j) { if (tour.t > at && !tour.fired['f' + j]) { tour.fired['f' + j] = true; fireCannons(j % 2 ? 1 : -1); } });
    (s.strikes || []).forEach(function (at, j) {
      if (tour.t > at && !tour.fired['s' + j]) { tour.fired['s' + j] = true; flash.timer = 0; flash.aim = Math.atan2(cam.fwd[2], cam.fwd[0]) + (Math.random() - 0.5) * 0.5; }
    });
    if (tour.t >= s.dur) nextShot();
  }

  var rec = { on: false, mr: null, chunks: [], cv: null, cx: null, t0: 0, type: '', blob: null, url: '' };
  // Hand a file to the viewer: through the artifact viewer's downloads capability when the
  // page runs inside claude.ai, otherwise as an ordinary browser download.
  var downloadsApi = null;
  if (window.claude && typeof window.claude.use === 'function') {
    try { window.claude.use('downloads').then(function (d) { downloadsApi = d; }, function () {}); } catch (e) { /* not in a viewer */ }
  }
  function saveFile(filename, blob, done) {
    if (downloadsApi) {
      downloadsApi.save({ filename: filename, data: blob }).then(function () { done && done(true); },
        function (err) { done && done(false, err && err.code); });
      return;
    }
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    done && done(true);
  }
  function startRecording(w, h) {
    if (!window.MediaRecorder) { $('note').textContent = 'This browser cannot record video.'; return false; }
    rec.cv = document.createElement('canvas'); rec.cv.width = w; rec.cv.height = h; rec.cx = rec.cv.getContext('2d');
    var stream = rec.cv.captureStream(60);
    if (audio.dest) audio.dest.stream.getAudioTracks().forEach(function (t) { stream.addTrack(t); });
    var types = ['video/mp4;codecs=avc1.640028,mp4a.40.2', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    rec.type = types.filter(function (t) { return MediaRecorder.isTypeSupported(t); })[0] || '';
    rec.mr = new MediaRecorder(stream, { mimeType: rec.type, videoBitsPerSecond: 18e6, audioBitsPerSecond: 192000 });
    rec.chunks = [];
    rec.mr.ondataavailable = function (e) { if (e.data && e.data.size) rec.chunks.push(e.data); };
    rec.mr.onstop = function () {
      rec.blob = new Blob(rec.chunks, { type: rec.type || 'video/webm' });
      var name = 'ocean-water-lab-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + (/mp4/.test(rec.type) ? '.mp4' : '.webm');
      var mb = (rec.blob.size / 1048576).toFixed(1);
      $('note').textContent = 'Recorded ' + mb + ' MB. Saving…';
      saveFile(name, rec.blob, function (ok, code) {
        $('note').textContent = ok ? 'Saved ' + mb + ' MB video (' + (/mp4/.test(rec.type) ? 'MP4' : 'WebM') + ').' : 'The video was not saved (' + (code || 'cancelled') + '). Use Save last video to try again.';
        $('rec-save').hidden = false;
      });
    };
    rec.mr.start(1000); rec.on = true; rec.t0 = performance.now();
    perf.locked = true; quality.scale = 1;
    return true;
  }
  function stopRecording() { if (rec.on) { rec.on = false; rec.mr.stop(); perf.locked = false; syncUI(); } }
  function recordFrame() {
    if (!rec.on) return;
    var c = rec.cx, W = rec.cv.width, H = rec.cv.height, sw = canvas.width, sh = canvas.height;
    var s = Math.max(W / sw, H / sh), dw = sw * s, dh = sh * s;
    c.drawImage(canvas, (W - dw) / 2, (H - dh) / 2, dw, dh);
    drawCaption(c, W, H);
  }
  function drawCaption(c, W, H) {
    var cap = tour.on && tour.caption, u = H / 1080;
    if (!cap) return;
    var fade = 1 - tour.fade, disp = '"Saira Condensed", "Arial Narrow", Arial, sans-serif';
    c.save(); c.globalAlpha = fade;
    if (cap.big) {
      c.textAlign = 'center'; c.fillStyle = '#e8f1f4';
      c.font = '600 ' + Math.round(86 * u) + 'px ' + disp; c.fillText(cap.a.split('').join(String.fromCharCode(8202)), W / 2, H * 0.44);
      c.fillStyle = '#ffb84d'; c.font = '500 ' + Math.round(34 * u) + 'px ' + disp; c.fillText(cap.b, W / 2, H * 0.44 + 56 * u);
    } else {
      c.fillStyle = 'rgba(6, 18, 29, 0.62)';
      c.font = '600 ' + Math.round(40 * u) + 'px ' + disp;
      var w1 = c.measureText(cap.a.toUpperCase()).width; c.font = '500 ' + Math.round(26 * u) + 'px ' + disp;
      var w2 = c.measureText(cap.b).width, bw = Math.max(w1, w2) + 56 * u;
      c.fillRect(48 * u, H - 172 * u, bw, 124 * u);
      c.fillStyle = '#ffb84d'; c.fillRect(48 * u, H - 172 * u, 5 * u, 124 * u);
      c.fillStyle = '#e8f1f4'; c.font = '600 ' + Math.round(40 * u) + 'px ' + disp; c.fillText(cap.a.toUpperCase(), 76 * u, H - 118 * u);
      c.fillStyle = '#94acb8'; c.font = '500 ' + Math.round(26 * u) + 'px ' + disp; c.fillText(cap.b, 76 * u, H - 74 * u);
    }
    c.restore();
  }

  // ===========================================================================
  //  film render: every frame at a fixed time step, encoded with WebCodecs into an
  //  MP4, so the video is smooth however slowly the GPU draws it. The sound is mixed
  //  offline afterwards from a log of the live mix and its one-off sounds.
  // ===========================================================================
  var film = { on: false, fps: 30, frame: 0, time: 0, w: 1920, h: 1080, cv: null, cx: null, enc: null, mux: null, alog: [], events: [], total: 0, cancel: false, error: null };
  function filmSupported() { return !!(window.VideoEncoder && window.VideoFrame && window.Mp4Muxer); }
  function pickVideoCodec(w, h, fps) {
    var tries = [['avc', 'avc1.640034'], ['avc', 'avc1.640033'], ['avc', 'avc1.640028'], ['vp9', 'vp09.00.41.08'], ['vp9', 'vp09.00.40.08']];
    var i = 0;
    function next() {
      if (i >= tries.length) return Promise.resolve(null);
      var c = tries[i++], cfg = { codec: c[1], width: w, height: h, bitrate: 14e6, framerate: fps };
      return VideoEncoder.isConfigSupported(cfg).then(function (r) { return r.supported ? { mux: c[0], cfg: cfg } : next(); }, next);
    }
    return next();
  }
  function pickAudioCodec() {
    if (!window.AudioEncoder || !window.OfflineAudioContext) return Promise.resolve(null);
    var tries = [['aac', { codec: 'mp4a.40.2', sampleRate: 48000, numberOfChannels: 2, bitrate: 192000 }], ['opus', { codec: 'opus', sampleRate: 48000, numberOfChannels: 2, bitrate: 160000 }]];
    var i = 0;
    function next() {
      if (i >= tries.length) return Promise.resolve(null);
      var c = tries[i++];
      return AudioEncoder.isConfigSupported(c[1]).then(function (r) { return r.supported ? c : next(); }, next);
    }
    return next();
  }
  function filmStatus(text) { var rs = $('rec-status'); rs.hidden = !text; rs.textContent = text || ''; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function nextFrame() { return new Promise(function (r) { requestAnimationFrame(function () { r(); }); }); }
  async function renderFilm(w, h, fps) {
    if (film.on) { film.cancel = true; return; }
    if (!filmSupported()) { $('note').textContent = 'This browser has no WebCodecs, so use Record tour (real time) instead.'; return; }
    var vc = await pickVideoCodec(w, h, fps), ac = await pickAudioCodec();
    if (!vc) { $('note').textContent = 'No video encoder for ' + w + '×' + h + ' here, so use Record tour instead.'; return; }
    film.w = w; film.h = h; film.fps = fps; film.frame = 0; film.time = 0; film.alog = []; film.events = []; film.cancel = false; film.error = null;
    film.total = Math.round(TOUR.reduce(function (a, s) { return a + s.dur; }, 0) * fps);
    film.cv = document.createElement('canvas'); film.cv.width = w; film.cv.height = h; film.cx = film.cv.getContext('2d');
    film.mux = new Mp4Muxer.Muxer({ target: new Mp4Muxer.ArrayBufferTarget(), fastStart: 'in-memory',
      video: { codec: vc.mux, width: w, height: h, frameRate: fps },
      audio: ac ? { codec: ac[0], numberOfChannels: 2, sampleRate: 48000 } : undefined });
    film.enc = new VideoEncoder({ output: function (chunk, meta) { film.mux.addVideoChunk(chunk, meta); }, error: function (e) { film.error = e; } });
    film.enc.configure(vc.cfg);
    var liveSound = audio.on; if (liveSound) stopAudio();             // the live mix would not line up with film time
    film.on = true; perf.locked = true; quality.scale = 1;
    startTour();
    syncUI();
    var t0 = performance.now();
    try {
      while (tour.on && !film.cancel && !film.error) {
        var dt = 1 / fps;
        stepTour(dt); simulate(dt); render(dt, dt);
        updateAudio();
        film.cx.drawImage(canvas, 0, 0, w, h); drawCaption(film.cx, w, h);
        var vf = new VideoFrame(film.cv, { timestamp: Math.round(film.frame * 1e6 / fps), duration: Math.round(1e6 / fps) });
        film.enc.encode(vf, { keyFrame: film.frame % (fps * 2) === 0 }); vf.close();
        film.frame++; film.time = film.frame / fps;
        if (film.frame % 4 === 0) {
          var done = film.frame / Math.max(film.total, 1), el = (performance.now() - t0) / 1000;
          filmStatus('FILM ' + Math.round(done * 100) + '% · ' + Math.max(0, Math.round(el / Math.max(done, 1e-3) - el)) + ' s left · Esc to cancel');
        }
        while (film.enc.encodeQueueSize > 3) await wait(4);
        await nextFrame();
      }
      await film.enc.flush();
      if (film.error) throw film.error;
      if (film.cancel) { $('note').textContent = 'Film render cancelled.'; return; }
      if (ac) { filmStatus('Mixing sound…'); await nextFrame(); await encodeFilmAudio(ac[1], film.time); }
      film.mux.finalize();
      var blob = new Blob([film.mux.target.buffer], { type: 'video/mp4' }), mb = (blob.size / 1048576).toFixed(1);
      rec.blob = blob; rec.type = 'video/mp4';
      $('note').textContent = 'Film rendered: ' + mb + ' MB, ' + w + '×' + h + ' at ' + fps + ' fps' + (ac ? ' with sound' : '') + '. Saving…';
      saveFile('ocean-water-lab-demo-' + h + 'p.mp4', blob, function (ok, code) {
        $('note').textContent = ok ? 'Saved the ' + mb + ' MB film.' : 'The film was not saved (' + (code || 'cancelled') + '). Use Save last video to try again.';
        $('rec-save').hidden = false;
      });
    } catch (e) {
      $('note').textContent = 'Film render failed: ' + (e && e.message || e);
    } finally {
      film.on = false; perf.locked = false; filmStatus('');
      if (tour.on) stopTour();
      try { if (film.enc && film.enc.state !== 'closed') film.enc.close(); } catch (e2) { /* already closed */ }
      if (liveSound) startAudio();
      lastT = performance.now();
      syncUI();
    }
  }
  async function encodeFilmAudio(cfg, seconds) {
    var sr = 48000, len = Math.ceil((seconds + 0.25) * sr);
    var oc = new OfflineAudioContext(2, len, sr), n = buildAudioGraph(oc);
    film.alog.forEach(function (e) { applyTargets(n, e.v, e.t); });
    film.events.forEach(function (e) { if (e.t < seconds) playShot(n, Math.max(e.t, 0.001), e.a); });
    var buf = await oc.startRendering();
    var enc = new AudioEncoder({ output: function (chunk, meta) { film.mux.addAudioChunk(chunk, meta); }, error: function (e) { film.error = e; } });
    enc.configure(cfg);
    var L = buf.getChannelData(0), R = buf.getChannelData(1), block = 4800;
    for (var i = 0; i < buf.length; i += block) {
      var nf = Math.min(block, buf.length - i), data = new Float32Array(nf * 2);
      data.set(L.subarray(i, i + nf), 0); data.set(R.subarray(i, i + nf), nf);
      var ad = new AudioData({ format: 'f32-planar', sampleRate: sr, numberOfFrames: nf, numberOfChannels: 2, timestamp: Math.round(i / sr * 1e6), data: data });
      enc.encode(ad); ad.close();
    }
    await enc.flush();
    enc.close();
    if (film.error) throw film.error;
  }

  // ===========================================================================
  //  interface
  // ===========================================================================
  var DOUGLAS = [[0.01, 'Calm, glassy'], [0.1, 'Calm, rippled'], [0.5, 'Smooth'], [1.25, 'Slight'], [2.5, 'Moderate'], [4, 'Rough'], [6, 'Very rough'], [9, 'High'], [14, 'Very high'], [1e9, 'Phenomenal']];
  function updateReadout() {
    var hs = sea.hs, code = 0;
    while (hs > DOUGLAS[code][0]) code++;
    $('ro-state').textContent = 'Sea state ' + code;
    $('ro-name').textContent = DOUGLAS[code][1];
    $('ro-hs').textContent = hs.toFixed(hs < 10 ? 2 : 1);
    $('ro-tp').textContent = sea.tp.toFixed(1);
    $('ro-lp').textContent = sea.lp.toFixed(0);
    $('ro-bf').textContent = Math.round(Math.pow(state.wind / 0.836, 2 / 3));
  }
  var SLIDERS = [
    ['wind', 'sea'], ['windDir', 'sea'], ['chop', 'sea'], ['swell', 'sea'], ['foam', 'sea'],
    ['sunElev', 'sky'], ['sunAz', 'sky'], ['clouds', 'sky']
  ];
  var FORMAT = {
    wind: function (v) { return v.toFixed(1) + ' m/s'; }, windDir: function (v) { return ('00' + Math.round(v)).slice(-3) + '°'; },
    chop: function (v) { return v.toFixed(2); }, swell: function (v) { return v.toFixed(1) + ' m'; }, foam: function (v) { return v.toFixed(1) + '×'; },
    sunElev: function (v) { return Math.round(v) + '°'; }, sunAz: function (v) { return ('00' + Math.round(v)).slice(-3) + '°'; },
    clouds: function (v) { return Math.round(v * 100) + '%'; }
  };
  function syncUI() {
    SLIDERS.forEach(function (s) {
      var el = $('s-' + s[0]); if (!el) return;
      el.value = state[s[0]];
      $('v-' + s[0]).textContent = FORMAT[s[0]](+state[s[0]]);
    });
    document.querySelectorAll('[data-set]').forEach(function (btn) {
      var kv = btn.getAttribute('data-set').split(':');
      btn.setAttribute('aria-pressed', String(state[kv[0]]) === kv[1] ? 'true' : 'false');
    });
    document.querySelectorAll('[data-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', state[btn.getAttribute('data-toggle')] ? 'true' : 'false');
    });
    syncAdvanced();
    updateReadout();
  }
  // ---- advanced panel: every parameter, generated from OceanParams ------------------
  function updateDriveHud() {
    var hud = $('drive-hud'), b = boat.body;
    var on = state.boat && b && bodies.indexOf(b) >= 0 && state.follow;
    hud.hidden = !on;
    if (!on) return;
    qRotate(b.q, [1, 0, 0], bf);
    var hdg = (Math.atan2(bf[2], bf[0]) / DEG + 360) % 360, kn = Math.hypot(b.vel[0], b.vel[2]) * 1.9438;
    $('hud-vessel').textContent = b.isShip ? 'Pirate ship' : 'Speedboat';
    $('hud-speed').textContent = kn.toFixed(kn < 10 ? 1 : 0);
    $('hud-hdg').textContent = ('00' + Math.round(hdg)).slice(-3);
    $('hud-power').textContent = b.isShip ? Math.round(boat.throttle * 100) + '% sail' : Math.round(boat.throttle * 100) + '% throttle';
    $('hud-keys').textContent = state.autopilot ? 'Autopilot on. Turn it off to take the helm.' :
      (b.isShip ? 'W/S sail · A/D rudder · Space broadside · Q/E port/starboard' : 'W/S throttle · A/D steer · Shift boost');
  }
  function syncAdvanced() {
    OP.PARAMS.forEach(function (p) {
      var el = $('a-' + p[0]); if (!el) return;
      if (document.activeElement !== el) el.value = state[p[0]];
      var o = $('av-' + p[0]); if (o) o.textContent = p[7] === 'color' ? String(state[p[0]]).toUpperCase() : OP.fmt(p[7], +state[p[0]]);
    });
    document.querySelectorAll('[data-switch]').forEach(function (b) { b.setAttribute('aria-pressed', state[b.getAttribute('data-switch')] ? 'true' : 'false'); });
    document.querySelectorAll('[data-choice]').forEach(function (b) { var kv = b.getAttribute('data-choice').split(':'); b.setAttribute('aria-pressed', state[kv[0]] === kv[1] ? 'true' : 'false'); });
    document.querySelectorAll('[data-scene]').forEach(function (b) { b.setAttribute('aria-pressed', state.scene === b.getAttribute('data-scene') ? 'true' : 'false'); });
    var dh = $('drive-hint'); if (dh) dh.hidden = !(state.boat && state.follow && !state.autopilot);
    $('tour-play').textContent = tour.on && !rec.on ? 'Stop tour' : 'Play tour';
    $('tour-play').setAttribute('aria-pressed', tour.on && !rec.on ? 'true' : 'false');
    $('tour-rec').textContent = rec.on && tour.on ? 'Stop recording' : 'Record tour';
    $('tour-rec').setAttribute('aria-pressed', rec.on && tour.on ? 'true' : 'false');
    $('rec-free').textContent = rec.on && !tour.on ? 'Stop recording' : 'Record';
    $('film-render').textContent = film.on ? 'Cancel film' : 'Render film';
    $('film-render').setAttribute('aria-pressed', film.on ? 'true' : 'false');
    $('rec-free').setAttribute('aria-pressed', rec.on && !tour.on ? 'true' : 'false');
    if (exportFmt && !$('tab-export').hidden) refreshExport();
  }
  var SKY_KEYS = /^(sunElev|sunAz|moon|clouds|cloud|haze|rain|fog)/, LOOK_KEYS = /^(abs|scatter|sss)/;
  function setParam(k, v) {
    state[k] = v; state.scene = 'custom';
    if (SEA_KEYS.indexOf(k) >= 0) state.sea = 'custom';
    if (k === 'seed') applySea(false);
    if (LOOK_KEYS.test(k)) { state.water = 'custom'; applyLook(); }
    if (SKY_KEYS.test(k)) { if (/^(sunElev|sunAz|clouds)$/.test(k)) state.sky = 'custom'; applySky(); }
    if (k === 'boat') ensureBoat();
    if (k === 'follow' && v) { if (!state.boat) { state.boat = true; ensureBoat(); } cam.tDist = state.vessel === 'ship' ? 46 : Math.min(cam.tDist, 15); cam.tPitch = clamp(cam.tPitch, 0.12, 0.35); }
    if (k === 'vessel') { ensureBoat(); if (state.follow) cam.tDist = v === 'ship' ? 46 : 15; }
    syncUI();
  }
  function el(tag, props) { var e = document.createElement(tag); for (var k in props) e[k] = props[k]; return e; }
  function buildPanels() {
    var sc = $('scene-chips');
    Object.keys(OP.SCENES).forEach(function (k) {
      var b = el('button', { type: 'button', textContent: OP.SCENES[k].label });
      b.setAttribute('data-scene', k);
      b.addEventListener('click', function () { applyScene(k); });
      sc.appendChild(b);
    });
    var adv = $('tab-adv');
    OP.GROUPS.forEach(function (g, gi) {
      var det = el('details', { open: gi === 0 }), sum = el('summary', { textContent: g[1] });
      det.appendChild(sum);
      OP.PARAMS.forEach(function (p) {
        if (p[1] !== g[0]) return;
        var row = el('div', { className: 'row' }), id = 'a-' + p[0];
        var lab = el('label', { htmlFor: id, textContent: p[2], title: p[2] });
        var inp = p[7] === 'color' ? el('input', { id: id, type: 'color' }) : el('input', { id: id, type: 'range', min: p[3], max: p[4], step: p[5] });
        var out = el('output', { id: 'av-' + p[0] });
        inp.addEventListener('input', function () { setParam(p[0], p[7] === 'color' ? inp.value : parseFloat(inp.value)); });
        row.appendChild(lab); row.appendChild(inp); row.appendChild(out);
        det.appendChild(row);
      });
      var chips = el('div', { className: 'chips' }), any = false;
      Object.keys(OP.SWITCHES).forEach(function (k) {
        if (OP.SWITCHES[k][0] !== g[0]) return;
        var b = el('button', { type: 'button', textContent: OP.SWITCHES[k][1] });
        b.setAttribute('data-switch', k);
        b.addEventListener('click', function () { setParam(k, !state[k]); });
        chips.appendChild(b); any = true;
      });
      Object.keys(OP.CHOICES).forEach(function (k) {
        var c = OP.CHOICES[k]; if (c[0] !== g[0]) return;
        c[3].forEach(function (opt) {
          var b = el('button', { type: 'button', textContent: opt[1], title: c[1] + ': ' + opt[1] });
          b.setAttribute('data-choice', k + ':' + opt[0]);
          b.addEventListener('click', function () { setParam(k, opt[0]); });
          chips.appendChild(b);
        });
        any = true;
      });
      if (g[0] === 'waves') {
        var rs = el('button', { type: 'button', textContent: 'New seed' });
        rs.addEventListener('click', function () { setParam('seed', 1 + Math.floor(Math.random() * 9998)); });
        chips.appendChild(rs); any = true;
      }
      if (g[0] === 'weather') {
        var rb = el('button', { type: 'button', textContent: 'Rogue wave now' });
        rb.addEventListener('click', function () { if (state.rogue <= 0) setParam('rogue', 12); spawnRogue(); });
        chips.appendChild(rb); any = true;
      }
      if (g[0] === 'optics') {
        Object.keys(OP.LOOKS).forEach(function (k) {
          var b = el('button', { type: 'button', textContent: k });
          b.setAttribute('data-set', 'water:' + k);
          b.addEventListener('click', function () { setValue('water', k); });
          chips.appendChild(b);
        });
        any = true;
      }
      if (any) det.appendChild(chips);
      adv.appendChild(det);
    });
    document.querySelectorAll('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.getAttribute('data-tab');
        document.querySelectorAll('[data-tab]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        ['quick', 'adv', 'export'].forEach(function (n) { $('tab-' + n).hidden = n !== t; });
        if (t === 'export') refreshExport();
        syncUI();
      });
    });
    document.querySelectorAll('[data-fmt]').forEach(function (b) {
      b.addEventListener('click', function () {
        exportFmt = b.getAttribute('data-fmt');
        document.querySelectorAll('[data-fmt]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        refreshExport();
      });
    });
    $('export-copy').addEventListener('click', function () {
      var ta = $('export-text'), txt = ta.value;
      var done = function () { $('export-copy').textContent = 'Copied'; setTimeout(function () { $('export-copy').textContent = 'Copy'; }, 1400); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { ta.select(); document.execCommand('copy'); done(); });
      else { ta.select(); document.execCommand('copy'); done(); }
    });
    $('export-save').addEventListener('click', function () {
      var ext = { json: 'json', kit: 'txt', unity: 'txt', unreal: 'txt', godot: 'txt' }[exportFmt];
      saveFile('ocean-' + (state.scene || 'custom') + '-' + exportFmt + '.' + ext, new Blob([$('export-text').value], { type: 'text/plain' }));
    });
    $('import-load').addEventListener('click', function () {
      try { importSettings(JSON.parse($('import-text').value)); $('import-load').textContent = 'Loaded'; }
      catch (e) { $('import-load').textContent = 'Not valid JSON'; }
      setTimeout(function () { $('import-load').textContent = 'Load'; }, 1600);
    });
    $('reset-all').addEventListener('click', function () { importSettings({ params: OP.defaults() }); state.scene = 'custom'; syncUI(); });
  }
  var exportFmt = 'json';
  function derived() {
    return {
      extinction: look.extinction, scatter: look.scatter, sss: look.sss, roughness: Math.sqrt(sea.baseRough2) * state.rough,
      foamThreshold: sea.foamThreshold, foamGain: sea.foamGain, hs: sea.hs, tp: sea.tp, lp: sea.lp, windStreaks: sea.windStreaks * state.streaks,
      fogDensity: fogDensity(), sunDir: sun.dir, sunColor: sun.color
    };
  }
  function refreshExport() { $('export-text').value = OP.exporters[exportFmt](state, derived()); }
  function settleSea() {
    applySea(true);
    if (fft) { fft.reset(simTime, 1 / 60, origin[0], origin[1]); fft.calibrateFoam(); readSea(); seaSettled = true; }
  }
  function importSettings(obj) {
    var src = obj && obj.params ? obj.params : obj, d = OP.defaults();
    for (var k in d) if (src && k in src && typeof src[k] === typeof d[k]) state[k] = src[k];
    if (obj && typeof obj.scene === 'string') state.scene = obj.scene;
    state.sea = state.sky = state.water = 'custom';
    applyLook(); settleSea(); applySky(); ensureBoat();
    clouds.valid = false; clouds.envValid = false;
    syncUI();
  }
  function applyScene(name) {
    var sc = OP.SCENES[name]; if (!sc) return;
    var d = OP.defaults(), p = sc.p;
    for (var k in d) state[k] = d[k];
    if (p.look) { Object.assign(state, OP.LOOKS[p.look]); state.water = p.look; }
    for (k in p) if (k !== 'look') state[k] = p[k];
    state.scene = name; state.sea = 'custom'; state.sky = 'custom';
    var c = sc.cam;
    cam.target[0] = cam.tTarget[0] = c[0]; cam.target[2] = cam.tTarget[2] = c[1]; cam.target[1] = cam.tTarget[1] = 1;
    cam.yaw = cam.tYaw = c[2]; cam.pitch = cam.tPitch = c[3]; cam.dist = cam.tDist = c[4];
    if (sc.boat) { boat.centre = [sc.boat[0], sc.boat[1]]; boat.radius = sc.boat[2]; }
    if (boat.body) { var bi = bodies.indexOf(boat.body); if (bi >= 0) bodies.splice(bi, 1); boat.body = null; }
    state.dive = false;
    applyLook(); settleSea(); applySky(); ensureBoat();
    clouds.valid = false; clouds.envValid = false;
    lastInput = performance.now();
    syncUI();
  }
  function applyAll() { applySky(); syncUI(); }

  function setValue(key, value) {
    if (key === 'sea') { Object.assign(state, SEA_PRESETS[value]); state.sea = value; }
    else if (key === 'sky') { Object.assign(state, SKY_PRESETS[value]); state.sky = value; clouds.valid = false; clouds.envValid = false; }
    else if (key === 'water') { if (OP.LOOKS[value]) Object.assign(state, OP.LOOKS[value]); state.water = value; applyLook(); }
    else if (key === 'vessel') { state.vessel = value; state.boat = true; ensureBoat(); if (state.follow) cam.tDist = value === 'ship' ? 46 : 15; }
    else if (key === 'quality') {
      state.quality = value; quality.started = false; buildQualityResources(); buildClouds(); buildShadows(); rt.w = 0;
      if (fft && fft.N !== fftSize()) {
        createFFT(); applySea(true);
        fft.reset(simTime, 1 / 60, origin[0], origin[1]); fft.calibrateFoam(); readSea(); seaSettled = true;
      }
    }
    else state[key] = value;
    if (key === 'sea' || key === 'sky' || key === 'water') state.scene = 'custom';
    applyAll();
  }

  function bindUI() {
    SLIDERS.forEach(function (s) {
      var el = $('s-' + s[0]); if (!el) return;
      el.addEventListener('input', function () {
        state[s[0]] = parseFloat(el.value);
        state[s[1]] = 'custom';
        if (s[1] === 'sky') applySky();
        syncUI();
      });
    });
    document.querySelectorAll('[data-set]').forEach(function (btn) {
      btn.addEventListener('click', function () { var kv = btn.getAttribute('data-set').split(':'); setValue(kv[0], kv[1]); });
    });
    document.querySelectorAll('[data-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var k = btn.getAttribute('data-toggle');
        if (k === 'rain') state.rain = state.rain > 0 ? 0 : 0.7; else state[k] = !state[k];
        if (k === 'sound') { if (state.sound) startAudio(); else stopAudio(); }
        if (k === 'boat') ensureBoat();
        if (k === 'follow' && state.follow && !state.boat) { state.boat = true; ensureBoat(); }
        if (k === 'follow' && state.follow) { cam.tDist = state.vessel === 'ship' ? 46 : Math.min(cam.tDist, 15); cam.tPitch = clamp(cam.tPitch, 0.12, 0.35); }
        if (k === 'dive') { cam.tPitch = state.dive ? -0.12 : Math.max(cam.tPitch, 0.12); if (state.dive) cam.tDist = Math.max(cam.tDist, 9); }
        applyAll();
      });
    });
    $('reset').addEventListener('click', function () { resetBodies(); });
    $('tour-play').addEventListener('click', function () { if (tour.on) stopTour(); else startTour(); syncUI(); });
    $('tour-rec').addEventListener('click', function () {
      if (rec.on) { stopTour(); stopRecording(); return; }
      if (!audio.on && state.sound !== false) { startAudio(); state.sound = true; }
      setTimeout(function () { if (startRecording(1920, 1080)) startTour(function () { setTimeout(stopRecording, 300); }); syncUI(); }, 200);
    });
    $('rec-free').addEventListener('click', function () { if (rec.on) stopRecording(); else startRecording(1920, 1080); syncUI(); });
    $('film-render').addEventListener('click', function () { renderFilm(1920, 1080, 30); });
    $('rec-save').addEventListener('click', function () {
      if (!rec.blob) return;
      saveFile('ocean-water-lab-' + Date.now() + (/mp4/.test(rec.type) ? '.mp4' : '.webm'), rec.blob, function (ok, code) {
        $('note').textContent = ok ? 'Saved.' : 'Not saved (' + (code || 'cancelled') + ').';
      });
    });
    $('helm').addEventListener('click', function () {
      state.boat = true; state.follow = true; state.autopilot = false; ensureBoat();
      cam.tDist = state.vessel === 'ship' ? 46 : 15; cam.tPitch = clamp(cam.tPitch, 0.12, 0.3);
      canvas.focus(); syncUI();
    });
    buildPanels();
    $('panel-toggle').addEventListener('click', function () {
      var open = document.body.classList.toggle('panel-open');
      $('panel-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // ---- pointer: drag to look, pinch / wheel to zoom, tap to drop, shift-drag to stir
    var ptrs = new Map(), moved = 0, downAt = 0, pinch = 0, stirring = false;
    function touch() { lastInput = performance.now(); }
    canvas.addEventListener('pointerdown', function (e) {
      canvas.setPointerCapture(e.pointerId);
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, button: e.button });
      moved = 0; downAt = performance.now(); stirring = e.shiftKey || state.stir;
      if (ptrs.size === 2) { var a = Array.from(ptrs.values()); pinch = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); }
      touch();
    });
    canvas.addEventListener('pointermove', function (e) {
      var p = ptrs.get(e.pointerId); if (!p) return;
      var dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
      touch();
      if (ptrs.size === 2) {
        var a = Array.from(ptrs.values()), d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
        if (pinch > 0) cam.tDist = clamp(cam.tDist * pinch / Math.max(d, 1), 2.5, 900);
        pinch = d;
        pan(dx * 0.5, dy * 0.5);
        return;
      }
      if (stirring) {
        var hit = hitWater(screenRay(e.clientX, e.clientY));
        if (hit) { addRipple(hit[0], hit[2], 0.5, -0.06); addFoam(hit[0], hit[2], 0.8, 0.05); }
      } else if (p.button === 2 || p.button === 1) pan(dx, dy);
      else {
        cam.tYaw += dx * 0.0052;
        cam.tPitch = clamp(cam.tPitch + dy * 0.0042, state.dive ? -0.6 : -0.05, 1.45);
      }
    });
    function pan(dx, dy) {
      var s = cam.dist * 0.0016;
      var fx = -Math.cos(cam.yaw), fz = -Math.sin(cam.yaw);
      cam.tTarget[0] += (-cam.right[0] * dx + fx * dy) * s;
      cam.tTarget[2] += (-cam.right[2] * dx + fz * dy) * s;
    }
    function up(e) {
      var p = ptrs.get(e.pointerId); if (!p) return;
      ptrs.delete(e.pointerId);
      if (ptrs.size < 2) pinch = 0;
      if (moved < 6 && performance.now() - downAt < 450 && p.button === 0 && !stirring) {
        var hit = hitWater(screenRay(e.clientX, e.clientY));
        if (hit) {
          var b = spawn(state.drop, hit[0], hit[1] + 3.6, hit[2], qFromAxisAngle(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5, Math.random() * 3));
          b.w = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
        }
      }
    }
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', function (e) { ptrs.delete(e.pointerId); pinch = 0; });
    canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    canvas.addEventListener('wheel', function (e) {
      e.preventDefault();
      cam.tDist = clamp(cam.tDist * Math.exp(e.deltaY * 0.0011), 2.5, 900);
      touch();
    }, { passive: false });
    var DRIVE = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', Shift: 'boost' };
    window.addEventListener('keyup', function (e) { if (DRIVE[e.key]) boat.keys[DRIVE[e.key]] = false; });
    window.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (film.on) { film.cancel = true; return; }
      if (tour.on) { stopTour(); if (rec.on) stopRecording(); }
    });
    window.addEventListener('blur', function () { boat.keys = {}; });
    window.addEventListener('keydown', function (e) {
      if (e.target && /INPUT|BUTTON|TEXTAREA/.test(e.target.tagName)) return;
      if (state.boat && state.follow && !state.autopilot && DRIVE[e.key]) { boat.keys[DRIVE[e.key]] = true; e.preventDefault(); touch(); return; }
      if (state.boat && state.vessel === 'ship' && (e.key === ' ' || e.key === 'q' || e.key === 'Q' || e.key === 'e' || e.key === 'E')) {
        fireCannons(e.key === ' ' ? 0 : (e.key === 'q' || e.key === 'Q') ? -1 : 1); e.preventDefault(); touch(); return;
      }
      var s = cam.dist * 0.08, fx = -Math.cos(cam.yaw), fz = -Math.sin(cam.yaw);
      if (e.key === 'ArrowUp' || e.key === 'w') { cam.tTarget[0] += fx * s; cam.tTarget[2] += fz * s; }
      else if (e.key === 'ArrowDown' || e.key === 's') { cam.tTarget[0] -= fx * s; cam.tTarget[2] -= fz * s; }
      else if (e.key === 'ArrowLeft' || e.key === 'a') { cam.tTarget[0] -= cam.right[0] * s; cam.tTarget[2] -= cam.right[2] * s; }
      else if (e.key === 'ArrowRight' || e.key === 'd') { cam.tTarget[0] += cam.right[0] * s; cam.tTarget[2] += cam.right[2] * s; }
      else return;
      touch();
    });
  }

  // ===========================================================================
  //  boot
  // ===========================================================================
  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lastT = 0, hudTimer = 0, driveTimer = 0;

  function tick(now) {
    if (film.on) { lastT = now; requestAnimationFrame(tick); return; }     // the film render drives frames itself
    var gap = now - lastT;
    var dtMs = clamp(gap, 0, 100); lastT = now;              // a frame's timestamp can precede start-up's last performance.now()
    if (gap > 500 && fft) fft.reset(simTime, 1 / 60, origin[0], origin[1]);
    var dt = dtMs / 1000;
    if (!reducedMotion && now - lastInput > 7000) cam.tYaw += dt * 0.022;      // slow drift when left alone
    stepTour(dt);
    var sdt = dt * Math.max(state.timeScale, 0.01);
    simulate(sdt);
    render(sdt, dt);
    recordFrame();
    updateAudio();
    adaptResolution(dtMs);
    hudTimer += dtMs;
    if (hudTimer > 400) {
      hudTimer = 0;
      $('ro-fps').textContent = Math.round(perf.fps);
      $('ro-res').textContent = rt.w + '×' + rt.h;
      var rs = $('rec-status');
      rs.hidden = !rec.on;
      if (rec.on) rs.textContent = 'REC ' + Math.floor((now - rec.t0) / 60000) + ':' + ('0' + Math.floor((now - rec.t0) / 1000) % 60).slice(-2);
    }
    driveTimer += dtMs;
    if (driveTimer > 150) { driveTimer = 0; updateDriveHud(); }
    requestAnimationFrame(tick);
  }

  function start(saved) {
    try {
      if (saved && typeof saved === 'object') for (var k in state) if (k in saved && typeof saved[k] === typeof state[k]) state[k] = saved[k];
      buildPrograms();
      if (FFT) createFFT();
      buildLuts();
      night.active = false;
      mesh.terrain = buildTerrain();
      mesh.box = buildBox();
      mesh.barrel = buildLathe(PROFILE.barrel, 28);
      mesh.buoy = buildLathe(PROFILE.buoy, 28);
      mesh.lighthouse = buildLathe(PROFILE.lighthouse, 36);
      mesh.boat = buildBoatMesh();
      var sm = buildShipMeshes(); mesh.ship = sm.hull; mesh.shipSails = sm.sails;
      ballMesh = buildLathe([[0, -0.5], [0.25, -0.43], [0.43, -0.25], [0.5, 0], [0.43, 0.25], [0.25, 0.43], [0, 0.5]], 12);
      buildPalms();
      buildParticles();
      applyLook();
      buildQualityResources();
      buildClouds(); buildShadows();
      applySea(true); applySky();
      resetBodies();
      // let the objects settle into the water before the first frame
      if (fft) {
        fft.reset(simTime, 1 / 60, 0, 0);                    // three frames, for water velocity
        fft.calibrateFoam(); readSea(); seaSettled = true;
        updateCamera(0);
        runQueries(true);
        bodies.forEach(function (b) { if (b.patch) b.patch.extrapolate = false; });
        for (var i = 0; i < 360; i++) { for (var j = 0; j < bodies.length; j++) stepBody(bodies[j], H, physTime); collideBodies(); }
      } else {
        for (var i2 = 0; i2 < 480; i2++) { waves.advance(H); physTime += H; for (var j2 = 0; j2 < bodies.length; j2++) stepBody(bodies[j2], H, physTime); collideBodies(); }
      }
      bodies.forEach(function (b) { b.wetPrev = b.wet; });
      bindUI();
      syncUI();
      document.body.classList.add('ready');
      if (!HDR) $('note').textContent = 'This device has no floating-point render targets: bloom, ripples and foam trails are off.';
    } catch (err) {
      document.body.classList.add('failed');
      $('error').textContent = String(err && err.message || err);
      if (window.console) console.error(err);
      return;
    }
    if (TEST) {
      window.OceanLab = {
        state: state, cam: cam, waves: waves, bodies: bodies, apply: applyAll, scene: applyScene, param: setParam, boat: boat,
        particles: function () { return part.n; }, flash: flash, bolt: bolt, rogue: rogue, spawnRogue: spawnRogue,
        tour: tour, startTour: startTour, stepTour: stepTour, fire: fireCannons, ship: ship, film: film, renderFilm: renderFilm, TOUR: TOUR, sea: sea, sun: sun, exportText: function (f) { return OP.exporters[f](state, derived()); },
        set: function (k, v) { setValue(k, v); if (k === 'sea' || k === 'quality') { applySea(true); if (fft) { fft.reset(simTime, 1 / 60, origin[0], origin[1]); fft.calibrateFoam(); readSea(); seaSettled = true; } } },
        // n simulated steps; the last few are drawn (so temporal accumulation settles). readPixels makes the call wait for the GPU.
        frames: function (n, dt) {
          var px = new Uint8Array(4);
          for (var i = 0; i < n; i++) { simulate(dt); prepare(dt); if (i >= n - Math.min(n, 8)) draw(); if (i % 4 === 3 || i === n - 1) gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); }
          return rt.w + 'x' + rt.h;
        },
        // GPU vs CPU: displace rest points with the shader, then ask the CPU sampler for the
        // height at the spot each one landed on. The two should agree to float precision.
        gpuCheck: function () {
          var N = 64, ox = 5000.5, oz = -3000.25, CL = [gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE];
          var chk = new Program('check', FSV, HEAD + COMMON + WAVES +
            'out vec4 o; uniform vec2 uBase; void main() { vec2 p = uBase + vec2(gl_FragCoord.x * 37.7, gl_FragCoord.x * -12.3); o = vec4(waterDisplace(p, 0.01, 1.0e9), 1.0); }');
          var tex = makeTexture(N, 1, gl.RGBA32F, gl.RGBA, gl.FLOAT, gl.NEAREST, CL), fbo = gl.createFramebuffer();
          gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
          gl.viewport(0, 0, N, 1); gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
          waves.packForGpu(ox, oz);
          setWaves(chk.use()).f('uBase', -900, 400);
          gl.bindVertexArray(emptyVao); gl.drawArrays(gl.TRIANGLES, 0, 3);
          var px = new Float32Array(N * 4), worst = 0, big = 0, s = {};
          gl.readPixels(0, 0, N, 1, gl.RGBA, gl.FLOAT, px);
          for (var i = 0; i < N; i++) {
            var rx = ox - 900 + (i + 0.5) * 37.7, rz = oz + 400 + (i + 0.5) * -12.3;
            waves.sample(rx + px[i * 4], rz + px[i * 4 + 2], 0.01, 1e9, s);
            worst = Math.max(worst, Math.abs(s.height - px[i * 4 + 1]));
            big = Math.max(big, Math.abs(px[i * 4 + 1]), Math.hypot(px[i * 4], px[i * 4 + 2]));
          }
          return { maxHeightErrorMetres: worst, largestDisplacementMetres: big, points: N };
        },
        simStats: function () {
          if (!SIMS) return null;
          var out = {};
          ['ripple', 'foam'].forEach(function (name) {
            var t = sim[name], px = new Float32Array(t.res * t.res * 4), max = 0, sum = 0;
            gl.bindFramebuffer(gl.FRAMEBUFFER, t.cur.fbo);
            gl.readPixels(0, 0, t.res, t.res, gl.RGBA, gl.FLOAT, px);
            var at = 0;
            for (var i = 0; i < px.length; i += 4) { var v = Math.abs(px[i]); if (v > max) { max = v; at = i / 4; } sum += v; }
            out[name] = { maxAt: [+(t.cx + ((at % t.res + 0.5) / t.res - 0.5) * t.size).toFixed(1), +(t.cz + ((Math.floor(at / t.res) + 0.5) / t.res - 0.5) * t.size).toFixed(1)], max: +max.toFixed(4), mean: +(sum / (t.res * t.res)).toFixed(5), centre: [t.cx, t.cz], pending: name === 'ripple' ? rippleSplats.length : foamSplats.length };
          });
          return out;
        },
        noiseStats: function () {
          var size = clouds.size, fbo = gl.createFramebuffer(), out = { r: [], g: [], shape: [], w: [] };
          gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
          var px = new Uint8Array(size * size * 4), all = [], shp = [];
          for (var z = 0; z < size; z += Math.max(1, size / 8)) {
            gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, clouds.noise, 0, z);
            gl.readPixels(0, 0, size, size, gl.RGBA, gl.UNSIGNED_BYTE, px);
            for (var i = 0; i < size * size; i++) {
              var r = px[i * 4] / 255, wf = (px[i * 4 + 1] * 0.625 + px[i * 4 + 2] * 0.25 + px[i * 4 + 3] * 0.125) / 255;
              all.push(r); shp.push((r - (wf - 1)) / (1 - (wf - 1)));
            }
          }
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, clouds.weather, 0);
          var wp = new Uint8Array(256 * 256 * 4), wv = [];
          gl.readPixels(0, 0, 256, 256, gl.RGBA, gl.UNSIGNED_BYTE, wp);
          for (var j = 0; j < 256 * 256; j++) wv.push(wp[j * 4] / 255);
          var q = function (a) { a.sort(function (x, y) { return x - y; }); return [0.05, 0.25, 0.5, 0.75, 0.95].map(function (f) { return +a[Math.floor(f * (a.length - 1))].toFixed(3); }); };
          gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.deleteFramebuffer(fbo);
          return { perlinWorley: q(all), shape: q(shp), weather: q(wv) };
        },
        addRipple: addRipple,
        _: function () { return { gl: gl, clouds: clouds, rt: rt, cam: cam, quality: quality, sun: sun }; },
        cloudPixel: function (u, v) {
          var out = [];
          clouds.rt.forEach(function (t, k) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
            var px = new Float32Array(4); gl.readPixels(Math.floor(u * t.w), Math.floor(v * t.h), 1, 1, gl.RGBA, gl.FLOAT, px);
            out.push([k === clouds.cur ? 'cur' : 'old'].concat(Array.from(px).map(function (x) { return +x.toFixed(3); })));
          });
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          return out;
        },
        fft: function () { return fft && { N: fft.N, full: fft.fullPrecision, state: { hs: fft.state.significantHeight, tp: fft.state.peakPeriod, foamThreshold: fft.state.foamThreshold, farFoamThreshold: fft.state.farFoamThreshold, baseRough2: fft.state.baseRoughness2, mss: fft.state.meanSquareSlope, bands: fft.state.bands.map(function (b) { return [b.L, +b.kLow.toFixed(3), +b.kHigh.toFixed(3), +Math.sqrt(b.m0).toFixed(3), +b.mss.toFixed(4)]; }) } }; },
        // measured fraction of the sea under the whitecap threshold (breaking-scale Jacobian), on a grid
        foamCoverage: function () {
          if (!fft) return null;
          var Nc = 128, CL = [gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE];
          var chk = new Program('cov', FSV, HEAD + COMMON + WAVES + 'out vec4 o; void main() { vec2 p = gl_FragCoord.xy * 3.7; o = vec4(waterFoamJacobianFFT(p, 0.3, 1.0e4), 0.0, 0.0, 1.0); }');
          var tex = makeTexture(Nc, Nc, gl.RGBA32F, gl.RGBA, gl.FLOAT, gl.NEAREST, CL), fbo = gl.createFramebuffer();
          gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
          gl.viewport(0, 0, Nc, Nc); gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
          setWaves(chk.use()); gl.bindVertexArray(emptyVao); gl.drawArrays(gl.TRIANGLES, 0, 3);
          var px = new Float32Array(Nc * Nc * 4), under = 0, sum = 0, sum2 = 0;
          gl.readPixels(0, 0, Nc, Nc, gl.RGBA, gl.FLOAT, px);
          for (var i = 0; i < Nc * Nc; i++) { var j = px[i * 4]; if (j < sea.foamThreshold) under++; sum += j; sum2 += j * j; }
          var mean = sum / (Nc * Nc);
          return { coverage: under / (Nc * Nc), threshold: sea.foamThreshold, meanJ: mean, sigmaJ: Math.sqrt(sum2 / (Nc * Nc) - mean * mean) };
        },
        bodyPatch: function (i) { var b = bodies[i]; return b && b.patch && { cx: b.patch.cx, cz: b.patch.cz, time: b.patch.time, now: physTime, centreHeight: b.patch.data[(2 * QUERY_GRID + 2) * 8], bodyY: b.pos[1], wet: b.wet }; },
        spawn: spawn, info: function () { return { hdr: HDR, sims: SIMS, fft: !!fft, hs: sea.hs, bodies: bodies.map(function (b) { return [b.type, b.pos.map(function (v) { return +v.toFixed(2); }), +b.wet.toFixed(2)]; }) }; }
      };
      render(1 / 60);
      return;
    }
    lastT = performance.now();
    requestAnimationFrame(tick);
  }

  var hot = window.claude && window.claude.hot;
  if (hot && hot.snapshot) hot.snapshot(function () { return state; });
  function boot(saved) { requestAnimationFrame(function () { setTimeout(function () { start(saved); }, 0); }); }
  if (TEST) start({});
  else if (hot && hot.ready) hot.ready(boot); else boot((hot && hot.data) || {});
})();
