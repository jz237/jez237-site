/* ============================================================================
   WATER KIT - FFT ocean host for WebGL2
   ----------------------------------------------------------------------------
   Owns the textures and runs the passes in kit/glsl/fft. Also does the CPU
   side: sea-state statistics (wave height, whitecap thresholds, roughness)
   and asynchronous read-back of the surface for physics.

     var ocean = new WaterFFT.Ocean(gl, { size: 256, shaders: S });
     ocean.setParams({ windSpeed: 9, ... });
     each frame:   ocean.update(time, dt, originX, originZ);
                   ocean.bind(program, firstTextureUnit);      // any material
     physics:      ocean.runQueries([{ x, z, half, filter, owner }], time);
                   ocean.poll();                                // delivers to opts.onPatches
   update() and runQueries() change the framebuffer, viewport, program,
   vertex array and blend/depth state; set your own afterwards.
   ========================================================================== */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WaterFFT = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var G = 9.81;
  var TAU = Math.PI * 2;
  var REPEAT_TIME = 200;          // must match WATER_REPEAT_TIME in water_fft.glsl
  var BAND_SPLIT = 6;             // cascade c starts at wavelength L_c / 6; the cascade above stops there
  var DEFAULT_TILES = [1024, 128, 16, 3];

  var DEFAULTS = {
    windSpeed: 9,              // m/s at 10 m height
    windDirection: 0.6,        // radians, direction the waves travel towards (0 = +X)
    fetchKm: 300,              // distance the wind has blown over open water
    gamma: 3.3,                // JONSWAP peak sharpness
    spreadScale: 1,            // > 1 lines the waves up into longer crests
    choppiness: 1.0,           // sideways motion; 1 gives sharp crests, more makes them loop
    amplitudeScale: 1,         // artistic multiplier on wind-wave height
    detailScale: 1.0,          // multiplier on the ripple cascades (normal detail)
    swellHeight: 0.6,          // significant height of the swell, metres
    swellLength: 90,           // swell peak wavelength, metres
    swellDirection: 1.4,       // radians
    swellGamma: 6,             // swell peak sharpness
    swellSpread: 30,           // swell directional focus
    foamAmount: 1,             // multiplier on whitecap coverage
    seed: 1337
  };

  // ---------------------------------------------------------------------------
  //  CPU statistics. Same formulas as the shaders; double precision.
  // ---------------------------------------------------------------------------
  function Rng(seed) {                       // mulberry32 (public domain, T. Ettinger)
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function jonswapShape(w, wp, gamma) {
    var sigma = w <= wp ? 0.07 : 0.09;
    var d = (w - wp) / (sigma * wp);
    return (G * G) / Math.pow(w, 5) * Math.exp(-1.25 * Math.pow(wp / w, 4)) * Math.pow(gamma, Math.exp(-0.5 * d * d));
  }
  function seaStateFromWind(windSpeed, fetchKm) {      // JONSWAP fetch laws, capped at a fully developed sea
    var U = Math.max(windSpeed, 0.5);
    var x = Math.min(G * fetchKm * 1000 / (U * U), 2.2e4);
    return { peakOmega: TAU * 3.5 * Math.pow(x, -0.33) * G / U, significantHeight: 4 * Math.sqrt(1.6e-7 * x) * U * U / G };
  }
  function whitecapCoverage(windSpeed) {               // Monahan & O'Muircheartaigh 1980
    return Math.min(3.84e-6 * Math.pow(Math.max(windSpeed, 0), 3.41), 0.5);
  }
  function upperNormalQuantile(p) {                    // z with P(Z > z) = p (Abramowitz & Stegun 26.2.23)
    p = Math.min(Math.max(p, 1e-9), 0.5);
    var t = Math.sqrt(-2 * Math.log(p));
    return t - (2.515517 + 0.802853 * t + 0.010328 * t * t) / (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t);
  }
  function integrate(f, w0, w1, n) {                   // trapezoid on a log-spaced grid
    if (w1 <= w0) return 0;
    var r = Math.pow(w1 / w0, 1 / n), s = 0, w = w0, prev = f(w0);
    for (var i = 0; i < n; i++) { var w2 = w * r, v = f(w2); s += 0.5 * (prev + v) * (w2 - w); prev = v; w = w2; }
    return s;
  }
  function spreading(cosDelta, s) {                    // same as waterSpreading()
    var base = Math.max(0.5 + 0.5 * cosDelta, 0);
    return Math.sqrt(s + 0.25 + 1 / (32 * s + 32)) / 3.5449077 * Math.pow(base, s);
  }

  // Band edges per cascade: cascade c keeps BAND_SPLIT * 2 pi / L_c <= k < the next cascade's lower edge.
  function bandsFor(tiles, N) {
    var out = [];
    for (var c = 0; c < tiles.length; c++) {
      var lo = c === 0 ? 0 : BAND_SPLIT * TAU / tiles[c];
      var hi = c === tiles.length - 1 ? Math.PI * N / tiles[c] : BAND_SPLIT * TAU / tiles[c + 1];
      out.push({ L: tiles[c], kLow: lo, kHigh: hi, texel: tiles[c] / N });
    }
    return out;
  }

  // Everything the GPU and the game need to know about a sea state.
  function computeSeaState(userParams, tiles, N) {
    var p = {}, k;
    for (k in DEFAULTS) p[k] = DEFAULTS[k];
    if (userParams) for (k in userParams) if (userParams[k] !== undefined) p[k] = userParams[k];
    var st = seaStateFromWind(p.windSpeed, p.fetchKm);
    var wp = st.peakOmega, hsWind = st.significantHeight * p.amplitudeScale;
    var ws = Math.sqrt(G * TAU / Math.max(p.swellLength, 4));
    var m0Wind = integrate(function (w) { return jonswapShape(w, wp, p.gamma); }, 0.3 * wp, 60 * wp, 800);
    var m0Swell = integrate(function (w) { return jonswapShape(w, ws, p.swellGamma); }, 0.4 * ws, 10 * ws, 600);
    var windScale = hsWind > 0 ? Math.pow(hsWind / 4, 2) / m0Wind : 0;
    var swellScale = p.swellHeight > 0 ? Math.pow(p.swellHeight / 4, 2) / m0Swell : 0;
    var spectrum1D = function (w) { return windScale * jonswapShape(w, wp, p.gamma) + swellScale * jonswapShape(w, ws, p.swellGamma); };

    var bands = bandsFor(tiles, N);
    var ripple = Math.min(Math.max((p.windSpeed - 2) / 6, 0), 1);       // light airs leave ripples weak
    var m0 = 0, mssTotal = 0;
    for (var c = 0; c < bands.length; c++) {
      var b = bands[c];
      b.gain = c >= 2 ? p.detailScale * (0.45 + 0.55 * ripple) : 1;        // ripple cascades
      var wLo = Math.sqrt(G * Math.max(b.kLow, 1e-5)), wHi = Math.sqrt(G * b.kHigh);
      b.m0 = b.gain * b.gain * integrate(spectrum1D, Math.max(wLo, 0.05), wHi, 400);
      b.mss = b.gain * b.gain * integrate(function (w) { var kk = w * w / G; return kk * kk * spectrum1D(w); }, Math.max(wLo, 0.05), wHi, 400);
      b.kShore = c === 0 ? wp * wp / G : b.kLow;                          // k used for the shallow-water fade
      m0 += b.m0; mssTotal += b.mss;
    }

    // Whitecaps. The Jacobian of the breaking-scale cascades is close to normal with
    // sigma = choppiness * sqrt(mean square slope); pick the threshold the requested
    // fraction of the sea falls below. Cascade 0 alone gets its own threshold for the
    // distant foam it stores.
    var onset = Math.min(Math.max((p.windSpeed - 3) / 2, 0), 1);
    var coverage = Math.min(whitecapCoverage(p.windSpeed) * p.foamAmount * 0.6, 0.3) * onset * onset * (3 - 2 * onset);
    var z = coverage > 1e-6 ? upperNormalQuantile(coverage) : 1e3;
    var sNear = p.choppiness * Math.sqrt(bands[0].mss + (bands.length > 1 ? bands[1].mss : 0)) + 1e-6;
    var sFar = p.choppiness * Math.sqrt(bands[0].mss) + 1e-6;
    var ws2 = Math.min(Math.max((p.windSpeed - 11) / 11, 0), 1);

    // Roughness below the smallest simulated wave: what the Cox & Munk (1954)
    // sun-glitter measurements say is left over.
    var mssCoxMunk = 0.003 + 0.00512 * p.windSpeed;

    return {
      params: p,
      bands: bands,
      peakOmega: wp,
      peakPeriod: TAU / wp,
      peakWavelength: TAU * G / (wp * wp),
      significantHeight: 4 * Math.sqrt(m0),
      swellOmega: ws,
      windScale: windScale,
      swellScale: swellScale,
      spreadPeak: 11.5 * Math.pow(Math.max(p.windSpeed * wp / G, 0.2), -2.5) * p.spreadScale,
      foamThreshold: 1 - z * sNear,             // for the near-field foam simulation and per-pixel foam
      foamGain: 1 / (0.35 * sNear),
      farFoamThreshold: 1 - z * sFar,           // stored in cascade 0's foam channel
      farFoamGain: 1 / (0.35 * sFar),
      windStreaks: 0.6 * ws2 * ws2 * (3 - 2 * ws2) * Math.min(p.foamAmount, 1.5),
      coverage: coverage,                       // whitecap fraction asked for (calibrateFoam measures against it)
      meanSquareSlope: mssTotal,
      baseRoughness2: Math.min(Math.max((mssCoxMunk - mssTotal) * 0.2, 0.0004), 0.012)
    };
  }

  // ---------------------------------------------------------------------------
  //  WebGL2 host
  // ---------------------------------------------------------------------------
  var FULLSCREEN_VS = 'void main() { vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }\n';

  function compile(gl, type, src, name) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(sh), m = /ERROR: \d+:(\d+)/.exec(log), at = m ? +m[1] : 0;
      var lines = src.split('\n').map(function (l, i) { return (i + 1) + ': ' + l; });
      throw new Error('Shader "' + name + '" failed to compile:\n' + log + '\n' + lines.slice(Math.max(0, at - 4), at + 3).join('\n'));
    }
    return sh;
  }
  function program(gl, vs, fs, name) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs, name + '.vert'));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs, name + '.frag'));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Program "' + name + '" failed to link: ' + gl.getProgramInfoLog(p));
    var cache = {};
    return { p: p, loc: function (n) { if (!(n in cache)) cache[n] = gl.getUniformLocation(p, n); return cache[n]; } };
  }
  function texArray(gl, N, layers, internal, levels, linear, repeat) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, t);
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, levels, internal, N, N, layers);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, linear ? (levels > 1 ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR) : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, linear ? gl.LINEAR : gl.NEAREST);
    var wrap = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, wrap);
    return t;
  }
  function tex2D(gl, w, h, internal) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texStorage2D(gl.TEXTURE_2D, 1, internal, w, h);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  function mrt(gl, textures) {
    var f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    var bufs = [];
    textures.forEach(function (t, i) { gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, t, 0); bufs.push(gl.COLOR_ATTACHMENT0 + i); });
    gl.drawBuffers(bufs);
    return f;
  }

  /* opts:
       size          N, a power of two (256 high quality, 128 low)
       tiles         tile sizes in metres, largest first (default 1024, 128, 16, 3)
       shaders       { header, fft, cascades, spectrum, evolve, butterfly, assemble, query }
                     header = '#version 300 es' + precision lines (+ highp sampler2DArray)
       queryPrelude  GLSL inserted before fft_query.frag (e.g. a depth function and
                     #define WATER_QUERY_DEPTH(p) ...)
       queryMax, queryGrid   query slots and grid points per side (32, 5)
       onPatches(items, data)   called with read-back results */
  function Ocean(gl, opts) {
    opts = opts || {};
    this.gl = gl;
    this.N = opts.size || 256;
    this.tiles = (opts.tiles || DEFAULT_TILES).slice();
    this.C = this.tiles.length;
    this.queryMax = opts.queryMax || 32;
    this.queryGrid = opts.queryGrid || 5;
    this.onPatches = opts.onPatches || null;
    var full = !!gl.getExtension('EXT_color_buffer_float');
    if (!full && !gl.getExtension('EXT_color_buffer_half_float')) throw new Error('WaterFFT needs float render targets');
    this.fullPrecision = full;
    var fftFormat = full ? gl.RGBA32F : gl.RGBA16F;
    var aniso = gl.getExtension('EXT_texture_filter_anisotropic');

    var S = opts.shaders, H = S.header + '#define WATER_CASCADES ' + this.C + '\n';
    var lib = H + S.fft;
    this.prog = {
      spectrum: program(gl, H + FULLSCREEN_VS, lib + S.spectrum, 'fft_spectrum'),
      evolve: program(gl, H + FULLSCREEN_VS, lib + S.evolve, 'fft_evolve'),
      butterfly: program(gl, H + FULLSCREEN_VS, lib + S.butterfly, 'fft_butterfly'),
      assemble: program(gl, H + FULLSCREEN_VS, lib + S.assemble, 'fft_assemble'),
      query: program(gl, H + FULLSCREEN_VS, H + '#define WATER_QUERY_MAX ' + this.queryMax + '\n' + S.cascades + (opts.queryPrelude || '') + S.query, 'fft_query'),
      // Jacobian of the breaking-scale cascades (r) and of cascade 0 alone (g) on a scattered grid
      calib: program(gl, H + FULLSCREEN_VS, H + S.cascades +
        'uniform float uStep;\nout vec4 o;\nvoid main() {\n  vec2 p = gl_FragCoord.xy * uStep;\n' +
        '  vec4 d0 = textureLod(uWaterDeriv, vec3(waterCascadeUv(p, 0), 0.0), 0.0);\n' +
        '  float x0 = textureLod(uWaterMom, vec3(waterCascadeUv(p, 0), 0.0), 0.0).x;\n' +
        '  o = vec4(waterFoamJacobianFFT(p, 0.0, 1.0e4), (1.0 + d0.z) * (1.0 + d0.w) - x0 * x0, 0.0, 1.0);\n}\n', 'fft_calibrate')
    };

    var N = this.N, C = this.C, levels = Math.log2(N) + 1;
    // gaussian noise, one pair per cell, fixed by the seed
    this.noise = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.noise);
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RG32F, N, N, C);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    this.noiseSeed = null;

    this.h0 = texArray(gl, N, C, fftFormat, 1, false, false);
    this.pp = [0, 1].map(function () { var a = tex2D(gl, N, N, fftFormat), b = tex2D(gl, N, N, fftFormat); return { t: [a, b], fbo: mrt(gl, [a, b]) }; });
    var self = this;
    this.disp = [0, 1, 2].map(function () { return texArray(gl, N, C, gl.RGBA16F, levels, true, true); });
    this.deriv = texArray(gl, N, C, gl.RGBA16F, levels, true, true);
    this.mom = texArray(gl, N, C, gl.RGBA16F, levels, true, true);
    if (aniso) {
      var maxA = Math.min(gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 16);
      this.disp.concat([this.deriv, this.mom]).forEach(function (t) {
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, t);
        gl.texParameterf(gl.TEXTURE_2D_ARRAY, aniso.TEXTURE_MAX_ANISOTROPY_EXT, maxA);
      });
    }
    this.layerFbo = gl.createFramebuffer();
    this.assembleFbo = gl.createFramebuffer();
    this.vao = gl.createVertexArray();

    // physics queries
    var QW = this.queryMax * this.queryGrid, QH = this.queryGrid;
    this.queryTex = [tex2D(gl, QW, QH, gl.RGBA32F), tex2D(gl, QW, QH, gl.RGBA32F)];
    this.queryFbo = mrt(gl, this.queryTex);
    this.calibTex = tex2D(gl, 128, 128, gl.RGBA32F);
    this.calibFbo = mrt(gl, [this.calibTex]);
    this.queryUniform = new Float32Array(this.queryMax * 4);
    this.pbos = [0, 1, 2].map(function () {              // one buffer per output, three frames in flight
      return [0, 1].map(function () {
        var b = gl.createBuffer();
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, b);
        gl.bufferData(gl.PIXEL_PACK_BUFFER, QW * QH * 16, gl.STREAM_READ);
        return b;
      });
    });
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    this.pboNext = 0;
    this.pending = [];
    this.readBuf = new Float32Array(QW * QH * 8);

    this.ring = 0;
    this.dt = [1 / 60, 1 / 60];
    this.time = 0;
    this.origin = [0, 0];
    this.cascadeUniform = new Float32Array(C * 4);
    this.offsetUniform = new Float32Array(C * 4);
    this.dirty = true;
    this.state = null;
    this.setParams({});
  }

  Ocean.prototype.setParams = function (params) {
    this.state = computeSeaState(params, this.tiles, this.N);
    this.dirty = true;
    var seed = this.state.params.seed;
    if (seed !== this.noiseSeed) this.uploadNoise(seed);
    return this.state;
  };

  Ocean.prototype.uploadNoise = function (seed) {
    var gl = this.gl, N = this.N, C = this.C;
    this.noiseData = [];
    for (var c = 0; c < C; c++) {
      var rand = Rng((seed * 7919 + c * 104729) >>> 0), a = new Float32Array(N * N * 2);
      for (var i = 0; i < N * N; i++) {                  // Box-Muller
        var r = Math.sqrt(-2 * Math.log(1 - rand())), t = TAU * rand();
        a[i * 2] = r * Math.cos(t); a[i * 2 + 1] = r * Math.sin(t);
      }
      this.noiseData.push(a);
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.noise);
      gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, c, N, N, 1, gl.RG, gl.FLOAT, a);
    }
    this.noiseSeed = seed;
  };

  Ocean.prototype.spectrumUniforms = function () {
    var st = this.state, p = st.params;
    return {
      windA: [Math.cos(p.windDirection), Math.sin(p.windDirection), st.peakOmega, p.gamma],
      windB: [st.windScale, st.spreadPeak, 0, 0],
      swellA: [Math.cos(p.swellDirection), Math.sin(p.swellDirection), st.swellOmega, p.swellGamma],
      swellB: [st.swellScale, p.swellSpread, 0, 0]
    };
  };

  Ocean.prototype.runSpectrum = function () {
    var gl = this.gl, P = this.prog.spectrum, u = this.spectrumUniforms(), st = this.state;
    gl.useProgram(P.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.noise);
    gl.uniform1i(P.loc('uNoise'), 0);
    gl.uniform1i(P.loc('uN'), this.N);
    gl.uniform4fv(P.loc('uWindA'), u.windA); gl.uniform4fv(P.loc('uWindB'), u.windB);
    gl.uniform4fv(P.loc('uSwellA'), u.swellA); gl.uniform4fv(P.loc('uSwellB'), u.swellB);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.layerFbo);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
    for (var c = 0; c < this.C; c++) {
      var b = st.bands[c];
      gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, this.h0, 0, c);
      gl.uniform1i(P.loc('uCascade'), c);
      gl.uniform4f(P.loc('uBand'), b.L, b.kLow, b.kHigh, b.gain);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    this.dirty = false;
  };

  // Advance to 'time' (seconds) and rebuild the cascades. originX/Z: world position
  // the materials' coordinates are relative to.
  Ocean.prototype.update = function (time, dt, originX, originZ) {
    var gl = this.gl, N = this.N, C = this.C, st = this.state, i, c;
    gl.bindVertexArray(this.vao);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.depthMask(false);
    gl.viewport(0, 0, N, N);
    if (this.dirty) this.runSpectrum();

    this.dt[1] = this.dt[0]; this.dt[0] = Math.max(dt, 1e-4);
    this.ring = (this.ring + 1) % 3;
    var cur = this.disp[this.ring], prev = this.disp[(this.ring + 2) % 3];
    var t = time - REPEAT_TIME * Math.floor(time / REPEAT_TIME);
    this.time = time;
    var stages = Math.log2(N), E = this.prog.evolve, B = this.prog.butterfly, A = this.prog.assemble;
    var decay = Math.exp(-this.dt[0] / 4.0);

    for (c = 0; c < C; c++) {
      gl.useProgram(E.p);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.h0);
      gl.uniform1i(E.loc('uH0'), 0); gl.uniform1i(E.loc('uCascade'), c); gl.uniform1i(E.loc('uN'), N);
      gl.uniform1f(E.loc('uTileSize'), this.tiles[c]); gl.uniform1f(E.loc('uTime'), t);
      gl.uniform1f(E.loc('uChoppy'), st.params.choppiness * (c >= 2 ? 0.6 : 1));     // ripples are not trochoidal
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.pp[0].fbo);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.useProgram(B.p);
      gl.uniform1i(B.loc('uIn0'), 1); gl.uniform1i(B.loc('uIn1'), 2); gl.uniform1i(B.loc('uN'), N);
      var src = 0;
      for (var dir = 1; dir >= 0; dir--) {
        gl.uniform1i(B.loc('uHorizontal'), dir);
        for (i = 0; i < stages; i++) {
          gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.pp[src].t[0]);
          gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, this.pp[src].t[1]);
          gl.bindFramebuffer(gl.FRAMEBUFFER, this.pp[1 - src].fbo);
          gl.uniform1i(B.loc('uSub'), 2 << i);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          src = 1 - src;
        }
      }

      gl.useProgram(A.p);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.pp[src].t[0]);
      gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, this.pp[src].t[1]);
      gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D_ARRAY, prev);
      gl.uniform1i(A.loc('uIn0'), 1); gl.uniform1i(A.loc('uIn1'), 2); gl.uniform1i(A.loc('uPrevDisp'), 3);
      gl.uniform1i(A.loc('uCascade'), c);
      if (c === 0) gl.uniform3f(A.loc('uFoam'), st.farFoamThreshold, st.farFoamGain, decay);
      else gl.uniform3f(A.loc('uFoam'), -10, 1, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.assembleFbo);
      gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, cur, 0, c);
      gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, this.deriv, 0, c);
      gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, this.mom, 0, c);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    [cur, this.deriv, this.mom].forEach(function (tex) { gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex); gl.generateMipmap(gl.TEXTURE_2D_ARRAY); });

    this.origin[0] = originX; this.origin[1] = originZ;
    for (c = 0; c < C; c++) {
      var L = this.tiles[c], b = st.bands[c];
      this.cascadeUniform[c * 4] = 1 / L;
      this.cascadeUniform[c * 4 + 1] = L / N;
      this.cascadeUniform[c * 4 + 2] = b.kShore;
      this.offsetUniform[c * 4] = originX / L - Math.floor(originX / L);
      this.offsetUniform[c * 4 + 1] = originZ / L - Math.floor(originZ / L);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  // Measures the whitecap thresholds on the current surface instead of trusting the
  // Gaussian estimate: the requested fraction of 16384 scattered points falls below them.
  // Reads back from the GPU (a short stall): call when the sea state settles, not every frame.
  Ocean.prototype.calibrateFoam = function () {
    var gl = this.gl, st = this.state, P = this.prog.calib, M = 128;
    if (!(st.coverage > 1e-6)) return;
    gl.bindVertexArray(this.vao);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
    gl.useProgram(P.p);
    this.bind(P, 0);
    gl.uniform1f(P.loc('uStep'), 7.93);                    // incommensurate with every tile
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.calibFbo);
    gl.viewport(0, 0, M, M);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    var px = new Float32Array(M * M * 4), a = new Float32Array(M * M), b = new Float32Array(M * M);
    gl.readPixels(0, 0, M, M, gl.RGBA, gl.FLOAT, px);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    for (var i = 0; i < M * M; i++) { a[i] = px[i * 4]; b[i] = px[i * 4 + 1]; }
    a.sort(); b.sort();
    var q = Math.min(Math.floor(st.coverage * M * M), M * M - 1);
    var spread = function (v) { return Math.max(v[Math.floor(0.5 * M * M)] - v[Math.floor(0.16 * M * M)], 1e-4); };
    st.foamThreshold = a[q]; st.foamGain = 1 / (0.35 * spread(a));
    st.farFoamThreshold = b[q]; st.farFoamGain = 1 / (0.35 * spread(b));
    st.calibrated = true;
  };

  // Frees every GPU resource the ocean owns.
  Ocean.prototype.dispose = function () {
    var gl = this.gl, self = this;
    [this.noise, this.h0, this.deriv, this.mom, this.calibTex].concat(this.disp, this.queryTex, this.pp[0].t, this.pp[1].t).forEach(function (t) { gl.deleteTexture(t); });
    [this.layerFbo, this.assembleFbo, this.queryFbo, this.calibFbo, this.pp[0].fbo, this.pp[1].fbo].forEach(function (f) { gl.deleteFramebuffer(f); });
    this.pbos.forEach(function (pair) { pair.forEach(function (b) { gl.deleteBuffer(b); }); });
    this.pending.forEach(function (p) { gl.deleteSync(p.fence); });
    Object.keys(this.prog).forEach(function (k) { gl.deleteProgram(self.prog[k].p); });
    gl.deleteVertexArray(this.vao);
    this.pending = [];
  };

  // After an instant change of sea state (or a long pause), rebuild the three frames
  // the physics query differences, so the water does not appear to jump.
  Ocean.prototype.reset = function (time, dt, originX, originZ) {
    for (var f = 2; f >= 0; f--) this.update(time - f * dt, dt, originX, originZ);
  };

  // Binds the current cascades to a material. Returns the next free texture unit.
  Ocean.prototype.bind = function (prog, unit) {
    var gl = this.gl, P = prog.p || prog, loc = function (n) { return gl.getUniformLocation(P, n); };
    if (!P.__waterLoc) P.__waterLoc = { disp: loc('uWaterDisp'), deriv: loc('uWaterDeriv'), mom: loc('uWaterMom'), cas: loc('uWaterCascade[0]'), off: loc('uWaterOffset[0]') };
    var L = P.__waterLoc;
    gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.disp[this.ring]);
    gl.activeTexture(gl.TEXTURE0 + unit + 1); gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.deriv);
    gl.activeTexture(gl.TEXTURE0 + unit + 2); gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.mom);
    if (L.disp) gl.uniform1i(L.disp, unit);
    if (L.deriv) gl.uniform1i(L.deriv, unit + 1);
    if (L.mom) gl.uniform1i(L.mom, unit + 2);
    if (L.cas) gl.uniform4fv(L.cas, this.cascadeUniform);
    if (L.off) gl.uniform4fv(L.off, this.offsetUniform);
    return unit + 3;
  };

  // Water state around each item: [{ x, z, half, filter, ... }] in world metres.
  // Results arrive through opts.onPatches(items, data): data[i] is a Float32Array of
  // G * G * 8 values per item, (height, vx, vy, vz, ax, ay, az, depth) per grid point,
  // row-major from (x - half, z - half) to (x + half, z + half), captured at items.time.
  // sync = true reads back immediately (stalls; use for tests and start-up).
  Ocean.prototype.runQueries = function (items, sync, extraUniforms) {
    var gl = this.gl, n = Math.min(items.length, this.queryMax), Gq = this.queryGrid;
    if (!n || (!sync && this.pending.length >= 3)) return false;
    var P = this.prog.query, U = this.queryUniform, i;
    for (i = 0; i < n; i++) {
      U[i * 4] = items[i].x - this.origin[0]; U[i * 4 + 1] = items[i].z - this.origin[1];
      U[i * 4 + 2] = items[i].half; U[i * 4 + 3] = items[i].filter;
    }
    gl.bindVertexArray(this.vao);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
    gl.useProgram(P.p);
    this.bind(P, 0);
    gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.disp[(this.ring + 2) % 3]);
    gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.disp[(this.ring + 1) % 3]);
    gl.uniform1i(P.loc('uWaterDispPrev'), 3); gl.uniform1i(P.loc('uWaterDispPrev2'), 4);
    gl.uniform4fv(P.loc('uQuery[0]'), U);
    gl.uniform1i(P.loc('uQueryGrid'), Gq);
    gl.uniform2f(P.loc('uQueryDt'), this.dt[0], this.dt[1]);
    if (extraUniforms) extraUniforms(P);
    var w = this.queryMax * Gq, h = Gq;            // always the full width: buffers are written and read whole
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.queryFbo);
    gl.viewport(0, 0, w, h);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    var snap = { items: items.slice(0, n), time: this.time, w: w, h: h };
    if (sync) {
      var a = new Float32Array(w * h * 4), b = new Float32Array(w * h * 4);
      gl.readBuffer(gl.COLOR_ATTACHMENT0); gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, a);
      gl.readBuffer(gl.COLOR_ATTACHMENT1); gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, b);
      gl.readBuffer(gl.COLOR_ATTACHMENT0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      this.deliver(snap, a, b);
      return true;
    }
    var pbo = this.pbos[this.pboNext]; this.pboNext = (this.pboNext + 1) % 3;
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo[0]);
    gl.readBuffer(gl.COLOR_ATTACHMENT0); gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, 0);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo[1]);
    gl.readBuffer(gl.COLOR_ATTACHMENT1); gl.readPixels(0, 0, w, h, gl.RGBA, gl.FLOAT, 0);
    gl.readBuffer(gl.COLOR_ATTACHMENT0);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    snap.pbo = pbo; snap.fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    this.pending.push(snap);
    return true;
  };

  // Collects finished read-backs. Call once per frame.
  Ocean.prototype.poll = function () {
    var gl = this.gl;
    while (this.pending.length) {
      var s = this.pending[0], r = gl.clientWaitSync(s.fence, 0, 0);
      if (r === gl.TIMEOUT_EXPIRED || r === gl.WAIT_FAILED) break;
      this.pending.shift();
      gl.deleteSync(s.fence);
      var n = s.w * s.h * 4;
      var a = this.readBuf.subarray(0, n), b = this.readBuf.subarray(n, n * 2);
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, s.pbo[0]); gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, a);
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, s.pbo[1]); gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, b);
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
      this.deliver(s, a, b);
    }
  };

  Ocean.prototype.deliver = function (snap, a, b) {
    var Gq = this.queryGrid, w = snap.w, out = [];
    for (var i = 0; i < snap.items.length; i++) {
      var d = new Float32Array(Gq * Gq * 8);
      for (var gy = 0; gy < Gq; gy++) for (var gx = 0; gx < Gq; gx++) {
        var src = (gy * w + i * Gq + gx) * 4, dst = (gy * Gq + gx) * 8;
        d[dst] = a[src]; d[dst + 1] = a[src + 1]; d[dst + 2] = a[src + 2]; d[dst + 3] = a[src + 3];
        d[dst + 4] = b[src]; d[dst + 5] = b[src + 1]; d[dst + 6] = b[src + 2]; d[dst + 7] = b[src + 3];
      }
      out.push(d);
    }
    if (this.onPatches) this.onPatches(snap.items, out, snap.time);
  };

  // CPU copy of h0(k) for cascade c, cell (ix, iz): for tests. Matches waterSpectrumH0().
  Ocean.prototype.cpuH0 = function (c, ix, iz) {
    var N = this.N, st = this.state, b = st.bands[c], u = this.spectrumUniforms();
    if (ix === N / 2 || iz === N / 2) return [0, 0];
    var nx = ix < N / 2 ? ix : ix - N, nz = iz < N / 2 ? iz : iz - N;
    var kx = nx * TAU / b.L, kz = nz * TAU / b.L, kl = Math.hypot(kx, kz);
    if (kl < b.kLow || kl >= b.kHigh || kl < 1e-6) return [0, 0];
    var w = Math.sqrt(G * kl), S = 0;
    if (u.windB[0] > 0) {
      var r = w / u.windA[2], s = u.windB[1] * (r <= 1 ? Math.pow(r, 5) : Math.pow(r, -2.5));
      S += u.windB[0] * jonswapShape(w, u.windA[2], u.windA[3]) * spreading((kx * u.windA[0] + kz * u.windA[1]) / kl, Math.max(s, 0.05));
    }
    if (u.swellB[0] > 0) S += u.swellB[0] * jonswapShape(w, u.swellA[2], u.swellA[3]) * spreading((kx * u.swellA[0] + kz * u.swellA[1]) / kl, u.swellB[1]);
    S *= (G / (2 * w)) / kl;
    var amp = 0.5 * (TAU / b.L) * b.gain * Math.sqrt(S), nd = this.noiseData[c], o = (iz * N + ix) * 2;
    return [nd[o] * amp, nd[o + 1] * amp];
  };

  return {
    Ocean: Ocean,
    DEFAULTS: DEFAULTS,
    REPEAT_TIME: REPEAT_TIME,
    computeSeaState: computeSeaState,
    bandsFor: bandsFor,
    jonswapShape: jonswapShape,
    upperNormalQuantile: upperNormalQuantile
  };
});
