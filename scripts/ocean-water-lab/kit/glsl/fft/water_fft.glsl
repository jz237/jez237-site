// ============================================================================
//  WATER KIT - FFT ocean, pass logic (GLSL 3.30+ / GLSL ES 3.00)
// ----------------------------------------------------------------------------
//  Tessendorf-style ocean: a directional wave spectrum on an N x N grid of
//  wavenumbers, advanced in time, turned into a surface by an inverse FFT.
//  Three cascades (square tiles of different size) each cover one band of
//  wavelengths, so together they span long swell down to 10 cm ripples.
//
//  Every pass is a function of one texel, so it runs the same as a fragment
//  shader (the fft_*.frag wrappers), a compute shader, or an engine's
//  render-target blit. The host does the texture fetches.
//
//  Per frame, per cascade:
//    evolve     h0 -> two complex textures that hold 8 real fields
//    butterfly  log2(N) passes along x, then log2(N) along z (ping-pong)
//    assemble   -> displacement (Dx, Dy, Dz, foam), derivatives, slope moments
// ============================================================================

#define WATER_G 9.81
#define WATER_TAU 6.28318530718
#ifndef WATER_REPEAT_TIME
#define WATER_REPEAT_TIME 200.0        // the sea repeats after this many seconds; keeps float phases exact
#endif

vec2 waterCmul(vec2 a, vec2 b) { return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }
vec2 waterCi(vec2 a) { return vec2(-a.y, a.x); }                 // multiply by i

// Wavenumber (rad/m) of grid cell id on a tile of L metres with N cells.
vec2 waterGridK(ivec2 id, int N, float L) {
    int h = N / 2;
    ivec2 n = ivec2(id.x < h ? id.x : id.x - N, id.y < h ? id.y : id.y - N);
    return vec2(n) * (WATER_TAU / L);
}

// Deep-water dispersion, rounded to whole multiples of 2 pi / WATER_REPEAT_TIME.
float waterOmega(float k) {
    float w0 = WATER_TAU / WATER_REPEAT_TIME;
    return floor(sqrt(WATER_G * k) / w0) * w0;
}

// JONSWAP spectral shape (without the alpha scale; the host normalises to the wave height).
float waterJonswap(float w, float wp, float gamma) {
    float sigma = w <= wp ? 0.07 : 0.09;
    float d = (w - wp) / (sigma * wp);
    float r = wp / w;
    float r2 = r * r;
    float w2 = w * w;
    return WATER_G * WATER_G / (w2 * w2 * w) * exp(-1.25 * r2 * r2) * pow(gamma, exp(-0.5 * d * d));
}

// cos^2s((theta - theta0) / 2) directional spreading, normalised over the circle.
float waterSpreading(float cosDelta, float s) {
    float base = max(0.5 + 0.5 * cosDelta, 0.0);
    // Gamma(s + 1) / Gamma(s + 1/2), within a few percent for all s
    float ratio = sqrt(s + 0.25 + 1.0 / (32.0 * s + 32.0));
    return ratio / 3.5449077 * pow(base, s);                       // 3.5449 = 2 sqrt(pi)
}

// Directional variance spectrum S(kx, kz), m^4.
//   windA  = (direction x, direction z, peak omega, gamma)
//   windB  = (energy scale, spreading at the peak, 0, 0)
//   swellA = (direction x, direction z, peak omega, gamma)
//   swellB = (energy scale, spreading, 0, 0)
float waterSpectrum2D(vec2 k, vec4 windA, vec4 windB, vec4 swellA, vec4 swellB) {
    float kl = length(k);
    if (kl < 1e-6) return 0.0;
    float w = sqrt(WATER_G * kl);
    vec2 kn = k / kl;
    float S = 0.0;
    if (windB.x > 0.0) {
        float r = w / windA.z;
        float s = windB.y * (r <= 1.0 ? pow(r, 5.0) : pow(r, -2.5));
        S += windB.x * waterJonswap(w, windA.z, windA.w) * waterSpreading(dot(kn, windA.xy), max(s, 0.05));
    }
    if (swellB.x > 0.0) {
        S += swellB.x * waterJonswap(w, swellA.z, swellA.w) * waterSpreading(dot(kn, swellA.xy), swellB.y);
    }
    return S * (WATER_G / (2.0 * w)) / kl;                         // S(omega, theta) -> S(kx, kz)
}

// ---------------------------------------------------------------------------
//  Pass 1 (when the sea state changes): initial amplitudes.
//    band       = (tile size L, lowest k kept, highest k kept, gain)
//    noiseK     = two independent standard normal numbers for cell id
//    noiseNegK  = the same for the mirrored cell (N - id) mod N
//  Returns (h0(k), h0(-k)) as two complex numbers.
// ---------------------------------------------------------------------------
vec4 waterSpectrumH0(ivec2 id, int N, vec4 band, vec2 noiseK, vec2 noiseNegK,
                     vec4 windA, vec4 windB, vec4 swellA, vec4 swellB) {
    if (id.x == N / 2 || id.y == N / 2) return vec4(0.0);          // the Nyquist row has no mirror partner
    vec2 k = waterGridK(id, N, band.x);
    float kl = length(k);
    if (kl < band.y || kl >= band.z) return vec4(0.0);
    float dk = WATER_TAU / band.x;
    float amp = 0.5 * dk * band.w;                                 // E|h0|^2 = S dk^2 / 2
    float a = amp * sqrt(waterSpectrum2D(k, windA, windB, swellA, swellB));
    float b = amp * sqrt(waterSpectrum2D(-k, windA, windB, swellA, swellB));
    return vec4(noiseK * a, noiseNegK * b);
}

// ---------------------------------------------------------------------------
//  Pass 2 (every frame): move the spectrum to time t and build 8 real fields,
//  packed two per complex number (a + i b) so one inverse FFT returns both.
//    o0 = (Dy + i Dx, Dz + i dh/dx)      o1 = (dh/dz + i dDx/dx, dDz/dz + i dDx/dz)
//  t must be in [0, WATER_REPEAT_TIME). choppy scales the sideways motion.
// ---------------------------------------------------------------------------
void waterEvolve(vec2 k, vec4 h0, float t, float choppy, out vec4 o0, out vec4 o1) {
    float kl = length(k);
    if (kl < 1e-6) { o0 = vec4(0.0); o1 = vec4(0.0); return; }
    float wt = waterOmega(kl) * t;
    vec2 e = vec2(cos(wt), sin(wt));
    // h0(k) travels along +k; conj(h0(-k)) is its mirror partner
    vec2 h = waterCmul(h0.xy, vec2(e.x, -e.y)) + waterCmul(vec2(h0.z, -h0.w), e);
    vec2 ih = waterCi(h);
    vec2 kn = k / kl;
    vec2 dx = ih * (kn.x * choppy);                                // sideways motion points at the crests
    vec2 dz = ih * (kn.y * choppy);
    vec2 sx = ih * k.x;
    vec2 sz = ih * k.y;
    vec2 dxx = h * (-k.x * kn.x * choppy);
    vec2 dzz = h * (-k.y * kn.y * choppy);
    vec2 dxz = h * (-k.x * kn.y * choppy);
    o0 = vec4(h + waterCi(dx), dz + waterCi(sx));
    o1 = vec4(sz + waterCi(dxx), dzz + waterCi(dxz));
}

// ---------------------------------------------------------------------------
//  Pass 3 (log2 N times per axis): one Stockham radix-2 stage of an inverse DFT.
//  i = output index along the axis, sub = 2, 4, ... N.
//  Fetch the two inputs at the indices waterFftSources() returns.
// ---------------------------------------------------------------------------
ivec2 waterFftSources(int i, int sub, int N) {
    int hs = sub / 2;
    int e = (i / sub) * hs + (i % hs);
    return ivec2(e, e + N / 2);
}

vec4 waterFftButterfly(vec4 even, vec4 odd, int i, int sub) {
    float a = WATER_TAU * float(i % sub) / float(sub);
    vec2 tw = vec2(cos(a), sin(a));
    return vec4(even.xy + waterCmul(tw, odd.xy), even.zw + waterCmul(tw, odd.zw));
}

// ---------------------------------------------------------------------------
//  Pass 4 (every frame): unpack the fields into the textures materials sample.
//    t0 = (Dy, Dx, Dz, dh/dx), t1 = (dh/dz, dDx/dx, dDz/dz, dDx/dz) after the FFT
//    prevFoam = foam channel of this texel last frame
//    foam = (whitecap threshold on the Jacobian, gain, decay per frame)
//  Outputs (all mip-mapped by the host):
//    disp  = (Dx, Dy, Dz, foam)
//    deriv = (dh/dx, dh/dz, dDx/dx, dDz/dz)
//    mom   = (dDx/dz, (dh/dx)^2, (dh/dz)^2, dh/dx * dh/dz)   second moments for roughness
// ---------------------------------------------------------------------------
void waterAssemble(vec4 t0, vec4 t1, float prevFoam, vec3 foam, out vec4 disp, out vec4 deriv, out vec4 mom) {
    float J = (1.0 + t1.y) * (1.0 + t1.z) - t1.w * t1.w;
    float f = max(prevFoam * foam.z, clamp((foam.x - J) * foam.y, 0.0, 1.0));
    disp = vec4(t0.y, t0.x, t0.z, f);
    deriv = vec4(t0.w, t1.x, t1.y, t1.z);
    mom = vec4(t1.w, t0.w * t0.w, t1.x * t1.x, t0.w * t1.x);
}
