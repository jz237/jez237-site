// ============================================================================
//  WATER KIT - FFT ocean, pass logic (HLSL: compute shaders or blits)
// ----------------------------------------------------------------------------
//  Generated from glsl/fft/water_fft.glsl - same functions, same names.
//  Each pass is a function of one texel: call it from a compute kernel
//  ([numthreads(8,8,1)], one thread per cell) or a full-screen pixel shader.
//  The GLSL wrappers in glsl/fft/fft_*.frag show the fetches each pass needs.
// ============================================================================
#ifndef WATER_FFT_HLSL
#define WATER_FFT_HLSL

#ifndef WATER_LOOP
#define WATER_LOOP [loop]            // these loops exit early on data; do not let the compiler unroll them
#endif

#define WATER_G 9.81
#define WATER_TAU 6.28318530718
#ifndef WATER_REPEAT_TIME
#define WATER_REPEAT_TIME 200.0        // the sea repeats after this many seconds; keeps float phases exact
#endif

float2 waterCmul(float2 a, float2 b) { return float2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }
float2 waterCi(float2 a) { return float2(-a.y, a.x); }                 // multiply by i

// Wavenumber (rad/m) of grid cell id on a tile of L metres with N cells.
float2 waterGridK(int2 id, int N, float L) {
    int h = N / 2;
    int2 n = int2(id.x < h ? id.x : id.x - N, id.y < h ? id.y : id.y - N);
    return float2(n) * (WATER_TAU / L);
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
float waterSpectrum2D(float2 k, float4 windA, float4 windB, float4 swellA, float4 swellB) {
    float kl = length(k);
    if (kl < 1e-6) return 0.0;
    float w = sqrt(WATER_G * kl);
    float2 kn = k / kl;
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
float4 waterSpectrumH0(int2 id, int N, float4 band, float2 noiseK, float2 noiseNegK,
                     float4 windA, float4 windB, float4 swellA, float4 swellB) {
    if (id.x == N / 2 || id.y == N / 2) return float4(0.0, 0.0, 0.0, 0.0);          // the Nyquist row has no mirror partner
    float2 k = waterGridK(id, N, band.x);
    float kl = length(k);
    if (kl < band.y || kl >= band.z) return float4(0.0, 0.0, 0.0, 0.0);
    float dk = WATER_TAU / band.x;
    float amp = 0.5 * dk * band.w;                                 // E|h0|^2 = S dk^2 / 2
    float a = amp * sqrt(waterSpectrum2D(k, windA, windB, swellA, swellB));
    float b = amp * sqrt(waterSpectrum2D(-k, windA, windB, swellA, swellB));
    return float4(noiseK * a, noiseNegK * b);
}

// ---------------------------------------------------------------------------
//  Pass 2 (every frame): move the spectrum to time t and build 8 real fields,
//  packed two per complex number (a + i b) so one inverse FFT returns both.
//    o0 = (Dy + i Dx, Dz + i dh/dx)      o1 = (dh/dz + i dDx/dx, dDz/dz + i dDx/dz)
//  t must be in [0, WATER_REPEAT_TIME). choppy scales the sideways motion.
// ---------------------------------------------------------------------------
void waterEvolve(float2 k, float4 h0, float t, float choppy, out float4 o0, out float4 o1) {
    float kl = length(k);
    if (kl < 1e-6) { o0 = float4(0.0, 0.0, 0.0, 0.0); o1 = float4(0.0, 0.0, 0.0, 0.0); return; }
    float wt = waterOmega(kl) * t;
    float2 e = float2(cos(wt), sin(wt));
    // h0(k) travels along +k; conj(h0(-k)) is its mirror partner
    float2 h = waterCmul(h0.xy, float2(e.x, -e.y)) + waterCmul(float2(h0.z, -h0.w), e);
    float2 ih = waterCi(h);
    float2 kn = k / kl;
    float2 dx = ih * (kn.x * choppy);                                // sideways motion points at the crests
    float2 dz = ih * (kn.y * choppy);
    float2 sx = ih * k.x;
    float2 sz = ih * k.y;
    float2 dxx = h * (-k.x * kn.x * choppy);
    float2 dzz = h * (-k.y * kn.y * choppy);
    float2 dxz = h * (-k.x * kn.y * choppy);
    o0 = float4(h + waterCi(dx), dz + waterCi(sx));
    o1 = float4(sz + waterCi(dxx), dzz + waterCi(dxz));
}

// ---------------------------------------------------------------------------
//  Pass 3 (log2 N times per axis): one Stockham radix-2 stage of an inverse DFT.
//  i = output index along the axis, sub = 2, 4, ... N.
//  Fetch the two inputs at the indices waterFftSources() returns.
// ---------------------------------------------------------------------------
int2 waterFftSources(int i, int sub, int N) {
    int hs = sub / 2;
    int e = (i / sub) * hs + (i % hs);
    return int2(e, e + N / 2);
}

float4 waterFftButterfly(float4 even, float4 odd, int i, int sub) {
    float a = WATER_TAU * float(i % sub) / float(sub);
    float2 tw = float2(cos(a), sin(a));
    return float4(even.xy + waterCmul(tw, odd.xy), even.zw + waterCmul(tw, odd.zw));
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
void waterAssemble(float4 t0, float4 t1, float prevFoam, float3 foam, out float4 disp, out float4 deriv, out float4 mom) {
    float J = (1.0 + t1.y) * (1.0 + t1.z) - t1.w * t1.w;
    float f = max(prevFoam * foam.z, clamp((foam.x - J) * foam.y, 0.0, 1.0));
    disp = float4(t0.y, t0.x, t0.z, f);
    deriv = float4(t0.w, t1.x, t1.y, t1.z);
    mom = float4(t1.w, t0.w * t0.w, t1.x * t1.x, t0.w * t1.x);
}

#endif // WATER_FFT_HLSL
