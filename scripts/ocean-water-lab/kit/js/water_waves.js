/* ============================================================================
   WATER KIT - wave core, JavaScript reference implementation
   ----------------------------------------------------------------------------
   One wave set drives everything: the vertex shader displaces the mesh with it,
   the fragment shader takes analytic normals from it, and gameplay code samples
   it on the CPU for buoyancy. Same numbers everywhere, no GPU read-back.

   Pipeline
     1. generate(params)       wind / swell settings -> N trochoidal (Gerstner) waves,
                               amplitudes taken from a JONSWAP ocean spectrum
     2. advance(dt) / setTime(t)  move the sea forward
     3. packForGpu(ox, oz)     per frame: two vec4 arrays for the shaders
     4. sample(x, z, ...)      CPU query: height, normal, particle velocity, acceleration

   The C++ (WaterPhysics.h) and C# (WaterPhysics.cs) files are line-for-line ports.
   ========================================================================== */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WaterKit = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var G = 9.81;
  var TAU = Math.PI * 2;
  var SHORE_K = 1.5;        // must match WATER_SHORE_K in the shaders
  var SWELL_WAVES = 3;      // geometry slots reserved for swell

  /* mulberry32 (public domain, T. Ettinger). Integer-exact in JS, C++ and C#. */
  function Rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* JONSWAP spectral shape S(w), without the alpha scale (we normalise to Hs). */
  function jonswapShape(w, wp, gamma) {
    var sigma = w <= wp ? 0.07 : 0.09;
    var d = (w - wp) / (sigma * wp);
    var peak = Math.pow(gamma, Math.exp(-0.5 * d * d));
    return (G * G) / Math.pow(w, 5) * Math.exp(-1.25 * Math.pow(wp / w, 4)) * peak;
  }

  /* Wind speed (m/s at 10 m) and fetch (km) -> peak frequency and significant height.
     JONSWAP fetch relations, capped at the fully developed (Pierson-Moskowitz) sea. */
  function seaStateFromWind(windSpeed, fetchKm) {
    var U = Math.max(windSpeed, 0.5);
    var x = Math.min(G * fetchKm * 1000 / (U * U), 2.2e4);
    return {
      peakOmega: TAU * 3.5 * Math.pow(x, -0.33) * G / U,
      significantHeight: 4 * Math.sqrt(1.6e-7 * x) * U * U / G
    };
  }

  /* Fraction of the sea covered by whitecaps (Monahan & O'Muircheartaigh 1980). */
  function whitecapCoverage(windSpeed) {
    return Math.min(3.84e-6 * Math.pow(Math.max(windSpeed, 0), 3.41), 0.5);
  }

  var DEFAULTS = {
    windSpeed: 9,            // m/s at 10 m height
    windDirection: 0.6,      // radians, direction the waves travel towards (0 = +X)
    fetchKm: 300,            // distance the wind has blown over open water
    gamma: 3.3,              // JONSWAP peak sharpness
    spread: 12,              // directional focus at the peak (higher = longer crests)
    choppiness: 0.9,         // 0 = sine waves, 1 = full trochoid (sharp crests)
    amplitudeScale: 1,       // artistic multiplier on wind-wave height
    detailScale: 1.5,        // multiplier on the short normal-only waves (wind ripples)
    swellHeight: 0.6,        // significant height of the swell group, metres
    swellLength: 90,         // swell wavelength, metres
    swellDirection: 1.4,     // radians
    geoMinWavelength: 4.0,   // shortest wave that moves vertices, metres (shorter ones are a few cm high: shading only)
    detailMinWavelength: 0.08, // shortest wave in the normal-only band, metres
    foamAmount: 1,           // multiplier on whitecap coverage
    seed: 1337
  };

  function WaveSet(geoCount, detailCount) {
    this.geoCount = geoCount;
    this.detailCount = detailCount;
    this.count = geoCount + detailCount;
    var n = this.count;
    this.dirX = new Float64Array(n);
    this.dirZ = new Float64Array(n);
    this.k = new Float64Array(n);          // wavenumber, rad/m
    this.amp = new Float64Array(n);        // vertical amplitude, m
    this.ampH = new Float64Array(n);       // horizontal amplitude (choppiness * amp), m
    this.omega = new Float64Array(n);      // angular frequency, rad/s
    this.phase = new Float64Array(n);      // phase at t = 0, origin
    this.timePhase = new Float64Array(n);  // omega * t, accumulated (see setTime / advance)
    this.wavelength = new Float64Array(n);
    this.tailVariance = new Float64Array(n); // slope variance of waves i..n-1
    this.gpuA = new Float32Array(n * 4);
    this.gpuB = new Float32Array(n * 4);
    this.params = null;
    this.significantHeight = 0;
    this.peakPeriod = 0;
    this.peakWavelength = 0;
    this.foamThreshold = 0;
    this.foamGain = 1;
    this.windStreaks = 0;                  // foam streak amount for the shader, 0..0.6
    this.slopeVariance = 0;
  }

  WaveSet.prototype.generate = function (userParams) {
    var p = {}, key;
    for (key in DEFAULTS) p[key] = DEFAULTS[key];
    if (userParams) for (key in userParams) if (userParams[key] !== undefined) p[key] = userParams[key];
    this.params = p;

    var rand = Rng(p.seed);
    var state = seaStateFromWind(p.windSpeed, p.fetchKm);
    var wp = state.peakOmega;
    var nGeo = this.geoCount, nDet = this.detailCount, n = this.count;
    var nWind = nGeo - SWELL_WAVES;
    var i, j;

    // ---- frequency bands (geometric spacing, jittered) --------------------
    var wLo = 0.7 * wp;
    var wGeoHi = Math.max(Math.sqrt(G * TAU / p.geoMinWavelength), wLo * 4);
    var wDetHi = Math.max(Math.sqrt(G * TAU / p.detailMinWavelength), wGeoHi * 3);
    var list = [];
    var energy = 0;

    function addBand(w0, w1, count, isDetail) {
      var ratio = Math.pow(w1 / w0, 1 / count);
      for (var b = 0; b < count; b++) {
        var u0 = rand(), u1 = rand(), u2 = rand(), u3 = rand();   // always four draws per wave
        var wa = w0 * Math.pow(ratio, b), wb = wa * ratio;
        var w = wa * Math.pow(ratio, 0.5 + 0.7 * (u0 - 0.5));
        var a = Math.sqrt(2 * jonswapShape(w, wp, p.gamma) * (wb - wa));
        // directional spreading: cos^2s model reduced to an angular std-dev
        var rel = w / wp;
        var s = p.spread * Math.pow(rel, rel <= 1 ? 5 : -2.5);
        var sd = Math.min(Math.sqrt(2 / (s + 1)), 1.05);
        // Neighbouring waves share a wavelength band; fan each triple out across the
        // spread (left, centre, right in scrambled order) so crests come out short
        // and broken like a real wind sea instead of long parallel ridges.
        var stratum = (b * 2 + (b / 3 | 0)) % 3;
        var uq = Math.min(Math.max((stratum + u1) / 3, 0.03), 0.97);
        var gauss = Math.log(uq / (1 - uq)) / 1.702;            // logistic approximation of the normal quantile
        var ang = p.windDirection + Math.max(-1.75, Math.min(1.75, sd * gauss)) + (u2 - 0.5) * 0.08;
        list.push({ w: w, a: a, ang: ang, phase: TAU * u3, detail: isDetail, swell: false });
        energy += 0.5 * a * a;
      }
    }
    addBand(wLo, wGeoHi, nWind, false);
    addBand(wGeoHi, wDetHi, nDet, true);

    // ---- scale the wind sea to the target significant wave height ---------
    var hsTarget = state.significantHeight * p.amplitudeScale;
    var scale = energy > 0 ? (hsTarget / 4) / Math.sqrt(energy) : 0;
    // light airs leave the small ripples weak; from a moderate breeze up they are fully developed
    var ripple = (p.windSpeed - 2) / 6; ripple = ripple < 0 ? 0 : ripple > 1 ? 1 : ripple;
    var detailMul = p.detailScale * (0.45 + 0.55 * ripple);
    for (i = 0; i < list.length; i++) list[i].a *= scale * (list[i].detail ? detailMul : 1);

    // ---- swell: three long, nearly parallel waves --------------------------
    var swellMul = [0.84, 1.0, 1.19], swellAmp = [0.55, 1.0, 0.6], swellAng = [-0.11, 0.0, 0.09];
    var se = 0;
    for (i = 0; i < SWELL_WAVES; i++) se += 0.5 * swellAmp[i] * swellAmp[i];
    var swellScale = (p.swellHeight / 4) / Math.sqrt(se);
    for (i = 0; i < SWELL_WAVES; i++) {
      var u = rand();
      var L = Math.max(p.swellLength, 4) * swellMul[i];
      list.push({ w: Math.sqrt(G * TAU / L), a: swellAmp[i] * swellScale, ang: p.swellDirection + swellAng[i], phase: TAU * u, detail: false, swell: true });
    }

    // ---- order: geometry waves longest first, then the detail band ---------
    var geo = [], det = [];
    for (i = 0; i < list.length; i++) (list[i].detail ? det : geo).push(list[i]);
    geo.sort(function (m, q) { return m.w - q.w; });
    det.sort(function (m, q) { return m.w - q.w; });
    var all = geo.concat(det);

    var varGeoH = 0, total = 0;
    for (i = 0; i < n; i++) {
      var e = all[i];
      var kk = e.w * e.w / G;                       // deep-water dispersion
      this.omega[i] = e.w;
      this.k[i] = kk;
      this.wavelength[i] = TAU / kk;
      this.amp[i] = e.a;
      // keep every single wave below the breaking limit k*a_h < 1
      this.ampH[i] = Math.min(p.choppiness * (e.swell ? 0.8 : 1) * e.a, 0.9 / kk);
      this.dirX[i] = Math.cos(e.ang);
      this.dirZ[i] = Math.sin(e.ang);
      this.phase[i] = e.phase;
      total += 0.5 * e.a * e.a;
      if (i < nGeo) varGeoH += 0.5 * Math.pow(kk * this.ampH[i], 2);
    }
    var tail = 0;
    for (j = n - 1; j >= 0; j--) {
      tail += 0.5 * Math.pow(this.k[j] * this.amp[j], 2);
      this.tailVariance[j] = tail;
    }

    this.slopeVariance = tail;
    this.significantHeight = 4 * Math.sqrt(total);
    this.peakPeriod = TAU / wp;
    this.peakWavelength = TAU * G / (wp * wp);

    // ---- whitecaps: threshold on the surface-compression Jacobian ----------
    // Where the horizontal motion squeezes the surface (J small) a crest is about
    // to break. Pick the J value that the requested fraction of the sea falls
    // below, measured on this wave set at a fixed set of sample points.
    // (Whitecap coverage counts lingering foam too; a bit over half of it is actively breaking.)
    var ws = (p.windSpeed - 11) / 11; ws = ws < 0 ? 0 : ws > 1 ? 1 : ws;
    this.windStreaks = 0.6 * ws * ws * (3 - 2 * ws) * Math.min(p.foamAmount, 1.5);
    var onset = (p.windSpeed - 3) / 2; onset = onset < 0 ? 0 : onset > 1 ? 1 : onset;      // no whitecaps in light airs
    var coverage = Math.min(whitecapCoverage(p.windSpeed) * p.foamAmount * 0.6, 0.3) * onset * onset * (3 - 2 * onset);
    var sigmaJ = Math.sqrt(varGeoH);
    if (coverage < 1e-6 || sigmaJ < 1e-5) {
      this.foamThreshold = -10; this.foamGain = 1;
    } else {
      var M = 2048, js = new Float64Array(M);
      var span = 40 * this.wavelength[0];
      for (var m = 0; m < M; m++) {
        var qx = rand() * span, qz = rand() * span;
        var hxx = 0, hzz = 0, hxz = 0;
        for (i = 0; i < nGeo; i++) {
          var c = Math.cos(this.k[i] * (this.dirX[i] * qx + this.dirZ[i] * qz) + this.phase[i]) * this.k[i] * this.ampH[i];
          hxx += this.dirX[i] * this.dirX[i] * c; hzz += this.dirZ[i] * this.dirZ[i] * c; hxz += this.dirX[i] * this.dirZ[i] * c;
        }
        js[m] = (1 - hxx) * (1 - hzz) - hxz * hxz;
      }
      js.sort();
      var qi = coverage * (M - 1), q0 = Math.floor(qi);
      this.foamThreshold = js[q0] + (js[Math.min(q0 + 1, M - 1)] - js[q0]) * (qi - q0);
      this.foamGain = 1 / (0.4 * sigmaJ);
    }
    return this;
  };

  /* Time. Either set an absolute time (deterministic, good for networking) or
     advance by dt each step (lets wind and swell change without the sea jumping). */
  WaveSet.prototype.setTime = function (time) {
    for (var i = 0; i < this.count; i++) {
      var ph = this.omega[i] * time;
      this.timePhase[i] = ph - TAU * Math.floor(ph / TAU);
    }
  };
  WaveSet.prototype.advance = function (dt) {
    for (var i = 0; i < this.count; i++) {
      var ph = this.timePhase[i] + this.omega[i] * dt;
      this.timePhase[i] = ph >= TAU ? ph - TAU : ph;
    }
  };

  /* Per frame: fold time and the floating origin into each wave's phase (in double
     precision) and pack for the shaders. Shader positions are relative to
     (originX, originZ), which keeps float32 precision far from the world origin.
       A[i] = (dirX, dirZ, k, amplitude)
       B[i] = (phase now, horizontal amplitude, wavelength, tail slope variance) */
  WaveSet.prototype.packForGpu = function (originX, originZ) {
    var A = this.gpuA, B = this.gpuB;
    for (var i = 0, o = 0; i < this.count; i++, o += 4) {
      var ph = this.phase[i] - this.timePhase[i] + this.k[i] * (this.dirX[i] * originX + this.dirZ[i] * originZ);
      ph -= TAU * Math.floor(ph / TAU);
      A[o] = this.dirX[i]; A[o + 1] = this.dirZ[i]; A[o + 2] = this.k[i]; A[o + 3] = this.amp[i];
      B[o] = ph; B[o + 1] = this.ampH[i]; B[o + 2] = this.wavelength[i]; B[o + 3] = this.tailVariance[i];
    }
  };

  function lod(wavelength, minWavelength) {
    var v = wavelength / minWavelength - 1;
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }
  function shore(k, depth) {
    var v = k * depth * SHORE_K;
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  /* Water state at world position (x, z).
       minWavelength  ignore waves shorter than this (use roughly the object's size)
       depth          water depth here in metres (pass 1e9 for open ocean)
       out            object to fill: height, nx/ny/nz, vx/vy/vz, ax/ay/az
     Trochoidal waves move points sideways, so "the height at x,z" needs the rest
     position that lands on x,z. Three fixed-point steps get within millimetres. */
  WaveSet.prototype.sample = function (x, z, minWavelength, depth, out) {
    var n = this.geoCount, i, w, th, s, c;
    var px = x, pz = z;
    var mw = Math.max(minWavelength, 1e-3);
    for (var it = 0; it < 3; it++) {
      var ox = 0, oz = 0;
      for (i = 0; i < n; i++) {
        w = lod(this.wavelength[i], mw);
        if (w <= 0) break;
        w *= shore(this.k[i], depth);
        th = this.k[i] * (this.dirX[i] * px + this.dirZ[i] * pz) - this.timePhase[i] + this.phase[i];
        s = Math.sin(th) * this.ampH[i] * w;
        ox -= this.dirX[i] * s; oz -= this.dirZ[i] * s;
      }
      px = x - ox; pz = z - oz;
    }
    var h = 0, sx = 0, sz = 0, hxx = 0, hzz = 0, hxz = 0;
    var vx = 0, vy = 0, vz = 0, ax = 0, ay = 0, az = 0;
    for (i = 0; i < n; i++) {
      w = lod(this.wavelength[i], mw);
      if (w <= 0) break;
      w *= shore(this.k[i], depth);
      var dX = this.dirX[i], dZ = this.dirZ[i], kk = this.k[i], om = this.omega[i];
      th = kk * (dX * px + dZ * pz) - this.timePhase[i] + this.phase[i];
      s = Math.sin(th); c = Math.cos(th);
      var a = this.amp[i] * w, ah = this.ampH[i] * w;
      h += a * c;
      sx += kk * dX * a * s; sz += kk * dZ * a * s;
      hxx += dX * dX * kk * ah * c; hzz += dZ * dZ * kk * ah * c; hxz += dX * dZ * kk * ah * c;
      // orbital velocity and acceleration of the water particle
      vx += dX * ah * om * c; vz += dZ * ah * om * c; vy += a * om * s;
      ax += dX * ah * om * om * s; az += dZ * ah * om * om * s; ay -= a * om * om * c;
    }
    var jac = (1 - hxx) * (1 - hzz) - hxz * hxz;
    var nx = sx * (1 - hzz) + sz * hxz, ny = Math.max(jac, 0.05), nz = sz * (1 - hxx) + sx * hxz;
    var inv = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz);
    out.height = h;
    out.nx = nx * inv; out.ny = ny * inv; out.nz = nz * inv;
    out.vx = vx; out.vy = vy; out.vz = vz;
    out.ax = ax; out.ay = ay; out.az = az;
    out.jacobian = jac;
    return out;
  };

  /* --------------------------------------------------------------------------
     Buoyancy for one rigid body, engine-agnostic.
     Call once per physics step with the body's hull sample points in world space,
     then apply each returned force at its point with your engine's
     AddForceAtPosition. Covers Archimedes lift, the Froude-Krylov force (the
     pressure field of the wave itself, which is what makes a floating object
     follow the orbital motion), and linear + quadratic drag against the moving water.

       points      Float64Array [x,y,z, ...] world positions of the hull samples
       velocities  Float64Array [x,y,z, ...] world velocity of the body at each sample
       cfg         { pointVolume, pointRadius, pointArea, waterDensity, linearDrag, quadDrag, minWavelength }
       depthAt     optional function(x, z) -> water depth in metres
       forces      Float64Array [x,y,z, ...] output, newtons
     returns submerged fraction 0..1
     ------------------------------------------------------------------------ */
  var tmpSample = {};
  WaveSet.prototype.buoyancy = function (points, velocities, count, cfg, depthAt, forces) {
    var rho = cfg.waterDensity || 1025;
    var wet = 0;
    for (var i = 0, o = 0; i < count; i++, o += 3) {
      var x = points[o], y = points[o + 1], z = points[o + 2];
      var depth = depthAt ? depthAt(x, z) : 1e9;
      var s = this.sample(x, z, cfg.minWavelength, depth, tmpSample);
      var r = cfg.pointRadius;
      var f = (s.height - (y - r)) / (2 * r);
      f = f < 0 ? 0 : f > 1 ? 1 : f;
      if (f <= 0) { forces[o] = forces[o + 1] = forces[o + 2] = 0; continue; }
      wet += f;
      var m = rho * cfg.pointVolume * f;                 // displaced mass at this sample
      var rx = velocities[o] - s.vx, ry = velocities[o + 1] - s.vy, rz = velocities[o + 2] - s.vz;
      var speed = Math.sqrt(rx * rx + ry * ry + rz * rz);
      var drag = m * cfg.linearDrag + 0.5 * rho * cfg.quadDrag * cfg.pointArea * f * speed;
      forces[o] = m * s.ax - drag * rx;
      forces[o + 1] = m * (G + s.ay) - drag * ry;
      forces[o + 2] = m * s.az - drag * rz;
    }
    return wet / count;
  };

  return {
    G: G,
    SWELL_WAVES: SWELL_WAVES,
    DEFAULTS: DEFAULTS,
    WaveSet: WaveSet,
    Rng: Rng,
    seaStateFromWind: seaStateFromWind,
    whitecapCoverage: whitecapCoverage,
    jonswapShape: jonswapShape
  };
});
