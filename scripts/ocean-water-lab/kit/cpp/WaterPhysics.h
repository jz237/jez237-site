// ============================================================================
//  WATER KIT - wave core and buoyancy, C++11, header only
// ----------------------------------------------------------------------------
//  One wave set drives everything: the vertex shader displaces the mesh with it,
//  the fragment shader takes analytic normals from it, and gameplay code samples
//  it here on the CPU for buoyancy. Same numbers everywhere, no GPU read-back.
//
//      water::WaveSet sea;                    // 40 geometry + 24 detail waves
//      sea.generate(water::WaveParams());     // wind, swell, choppiness...
//      // every physics step
//      sea.advance(dt);                       // or sea.setTime(t) for lockstep
//      water::WaterSample s;
//      sea.sample(x, z, 1.0, 1e9, s);         // height, normal, velocity, acceleration
//      // every rendered frame
//      sea.packForGpu(originX, originZ);      // then upload gpuA / gpuB as vec4 arrays
//
//  Y is up; waves travel in the XZ plane. SI units throughout.
//  Line-for-line port of js/water_waves.js.
//
//  FFT ocean: the waves live on the GPU, so physics reads them back. The GPU
//  writes the water state on a small grid around each body (fft_query.frag);
//  copy that into a WaterPatch and call buoyancyWith() with patch.sampler(t).
// ============================================================================
#pragma once
#include <algorithm>
#include <cmath>
#include <cstdint>
#include <vector>

namespace water {

const double kGravity = 9.81;
const double kTau = 6.283185307179586;
const double kShoreK = 1.5;          // must match WATER_SHORE_K in the shaders
const int kSwellWaves = 3;           // geometry slots reserved for swell

struct WaveParams {
    double windSpeed = 9;              // m/s at 10 m height
    double windDirection = 0.6;        // radians, direction the waves travel towards (0 = +X)
    double fetchKm = 300;              // distance the wind has blown over open water
    double gamma = 3.3;                // JONSWAP peak sharpness
    double spread = 12;                // directional focus at the peak (higher = longer crests)
    double choppiness = 0.9;           // 0 = sine waves, 1 = full trochoid (sharp crests)
    double amplitudeScale = 1;         // artistic multiplier on wind-wave height
    double detailScale = 1.5;          // multiplier on the short normal-only waves (wind ripples)
    double swellHeight = 0.6;          // significant height of the swell group, metres
    double swellLength = 90;           // swell wavelength, metres
    double swellDirection = 1.4;       // radians
    double geoMinWavelength = 4.0;     // shortest wave that moves vertices, metres
    double detailMinWavelength = 0.08; // shortest wave in the normal-only band, metres
    double foamAmount = 1;             // multiplier on whitecap coverage
    uint32_t seed = 1337;
};

struct WaterSample {
    double height;                     // surface height above the rest level
    double nx, ny, nz;                 // surface normal
    double vx, vy, vz;                 // velocity of the water itself (orbital motion)
    double ax, ay, az;                 // acceleration of the water
    double jacobian;                   // < 1 where the surface is being squeezed
};

struct BuoyancyConfig {
    double pointVolume = 0.05;         // hull volume represented by one sample point, m^3
    double pointRadius = 0.18;         // half height of that cell: a point is fully wet this far under
    double pointArea = 0.13;           // cross-section of the cell, for quadratic drag, m^2
    double waterDensity = 1025;        // kg/m^3
    double linearDrag = 1.1;           // 1/s
    double quadDrag = 1.0;             // drag coefficient
    double minWavelength = 1.0;        // ignore waves shorter than the hull, metres
};

// mulberry32 (public domain, T. Ettinger). Integer-exact in JS, C++ and C#.
class Rng {
public:
    explicit Rng(uint32_t seed) : s(seed) {}
    double operator()() {
        s += 0x6D2B79F5u;
        uint32_t t = s;
        t = (t ^ (t >> 15)) * (t | 1u);
        t ^= t + (t ^ (t >> 7)) * (t | 61u);
        return double(t ^ (t >> 14)) / 4294967296.0;
    }
private:
    uint32_t s;
};

// JONSWAP spectral shape S(w), without the alpha scale (we normalise to Hs).
inline double jonswapShape(double w, double wp, double gamma) {
    double sigma = w <= wp ? 0.07 : 0.09;
    double d = (w - wp) / (sigma * wp);
    double peak = std::pow(gamma, std::exp(-0.5 * d * d));
    return (kGravity * kGravity) / std::pow(w, 5.0) * std::exp(-1.25 * std::pow(wp / w, 4.0)) * peak;
}

// Wind speed (m/s at 10 m) and fetch (km) -> peak frequency and significant height.
// JONSWAP fetch relations, capped at the fully developed (Pierson-Moskowitz) sea.
inline void seaStateFromWind(double windSpeed, double fetchKm, double& peakOmega, double& significantHeight) {
    double U = std::max(windSpeed, 0.5);
    double x = std::min(kGravity * fetchKm * 1000.0 / (U * U), 2.2e4);
    peakOmega = kTau * 3.5 * std::pow(x, -0.33) * kGravity / U;
    significantHeight = 4.0 * std::sqrt(1.6e-7 * x) * U * U / kGravity;
}

// Fraction of the sea covered by whitecaps (Monahan & O'Muircheartaigh 1980).
inline double whitecapCoverage(double windSpeed) {
    return std::min(3.84e-6 * std::pow(std::max(windSpeed, 0.0), 3.41), 0.5);
}

class WaveSet {
public:
    int geoCount, detailCount, count;
    std::vector<double> dirX, dirZ;      // unit direction of travel
    std::vector<double> k;               // wavenumber, rad/m
    std::vector<double> amp;             // vertical amplitude, m
    std::vector<double> ampH;            // horizontal amplitude (choppiness * amp), m
    std::vector<double> omega;           // angular frequency, rad/s
    std::vector<double> phase;           // phase at t = 0, origin
    std::vector<double> timePhase;       // omega * t, accumulated (see setTime / advance)
    std::vector<double> wavelength;
    std::vector<double> tailVariance;    // slope variance of waves i..n-1
    std::vector<float> gpuA, gpuB;       // 4 floats per wave, ready for glUniform4fv / SetVectorArray
    WaveParams params;
    double significantHeight = 0, peakPeriod = 0, peakWavelength = 0;
    double foamThreshold = 0, foamGain = 1;   // uniforms uFoamThreshold / uFoamGain
    double windStreaks = 0;                    // uniform uWindStreaks, 0..0.6
    double slopeVariance = 0;

    explicit WaveSet(int geo = 40, int detail = 24)
        : geoCount(geo), detailCount(detail), count(geo + detail),
          dirX(count), dirZ(count), k(count), amp(count), ampH(count), omega(count), phase(count),
          timePhase(count, 0.0), wavelength(count), tailVariance(count), gpuA(count * 4), gpuB(count * 4) {}

    void generate(const WaveParams& p) {
        params = p;
        Rng rand(p.seed);
        double wp, hsWind;
        seaStateFromWind(p.windSpeed, p.fetchKm, wp, hsWind);
        const int nGeo = geoCount, nDet = detailCount, n = count, nWind = nGeo - kSwellWaves;

        // ---- frequency bands (geometric spacing, jittered) ---------------------
        double wLo = 0.7 * wp;
        double wGeoHi = std::max(std::sqrt(kGravity * kTau / p.geoMinWavelength), wLo * 4.0);
        double wDetHi = std::max(std::sqrt(kGravity * kTau / p.detailMinWavelength), wGeoHi * 3.0);
        struct Entry { double w, a, ang, phase; bool detail, swell; };
        std::vector<Entry> list;
        double energy = 0;

        auto addBand = [&](double w0, double w1, int bandCount, bool isDetail) {
            double ratio = std::pow(w1 / w0, 1.0 / bandCount);
            for (int b = 0; b < bandCount; b++) {
                double u0 = rand(), u1 = rand(), u2 = rand(), u3 = rand();   // always four draws per wave
                double wa = w0 * std::pow(ratio, double(b)), wb = wa * ratio;
                double w = wa * std::pow(ratio, 0.5 + 0.7 * (u0 - 0.5));
                double a = std::sqrt(2.0 * jonswapShape(w, wp, p.gamma) * (wb - wa));
                // directional spreading: cos^2s model reduced to an angular std-dev
                double rel = w / wp;
                double s = p.spread * std::pow(rel, rel <= 1.0 ? 5.0 : -2.5);
                double sd = std::min(std::sqrt(2.0 / (s + 1.0)), 1.05);
                // Neighbouring waves share a wavelength band; fan each triple out across the
                // spread so crests come out short and broken like a real wind sea.
                int stratum = (b * 2 + b / 3) % 3;
                double uq = std::min(std::max((stratum + u1) / 3.0, 0.03), 0.97);
                double gauss = std::log(uq / (1.0 - uq)) / 1.702;    // logistic approximation of the normal quantile
                double ang = p.windDirection + std::max(-1.75, std::min(1.75, sd * gauss)) + (u2 - 0.5) * 0.08;
                list.push_back({ w, a, ang, kTau * u3, isDetail, false });
                energy += 0.5 * a * a;
            }
        };
        addBand(wLo, wGeoHi, nWind, false);
        addBand(wGeoHi, wDetHi, nDet, true);

        // ---- scale the wind sea to the target significant wave height ----------
        double hsTarget = hsWind * p.amplitudeScale;
        double scale = energy > 0 ? (hsTarget / 4.0) / std::sqrt(energy) : 0.0;
        // light airs leave the small ripples weak; from a moderate breeze up they are fully developed
        double ripple = std::min(std::max((p.windSpeed - 2.0) / 6.0, 0.0), 1.0);
        double detailMul = p.detailScale * (0.45 + 0.55 * ripple);
        for (auto& e : list) e.a *= scale * (e.detail ? detailMul : 1.0);

        // ---- swell: three long, nearly parallel waves ---------------------------
        const double swellMul[3] = { 0.84, 1.0, 1.19 }, swellAmp[3] = { 0.55, 1.0, 0.6 }, swellAng[3] = { -0.11, 0.0, 0.09 };
        double se = 0;
        for (int i = 0; i < kSwellWaves; i++) se += 0.5 * swellAmp[i] * swellAmp[i];
        double swellScale = (p.swellHeight / 4.0) / std::sqrt(se);
        for (int i = 0; i < kSwellWaves; i++) {
            double u = rand();
            double L = std::max(p.swellLength, 4.0) * swellMul[i];
            list.push_back({ std::sqrt(kGravity * kTau / L), swellAmp[i] * swellScale, p.swellDirection + swellAng[i], kTau * u, false, true });
        }

        // ---- order: geometry waves longest first, then the detail band ----------
        std::vector<Entry> geo, det;
        for (const auto& e : list) (e.detail ? det : geo).push_back(e);
        auto byFrequency = [](const Entry& m, const Entry& q) { return m.w < q.w; };
        std::stable_sort(geo.begin(), geo.end(), byFrequency);
        std::stable_sort(det.begin(), det.end(), byFrequency);
        geo.insert(geo.end(), det.begin(), det.end());

        double varGeoH = 0, total = 0;
        for (int i = 0; i < n; i++) {
            const Entry& e = geo[i];
            double kk = e.w * e.w / kGravity;                   // deep-water dispersion
            omega[i] = e.w;
            k[i] = kk;
            wavelength[i] = kTau / kk;
            amp[i] = e.a;
            // keep every single wave below the breaking limit k*a_h < 1
            ampH[i] = std::min(p.choppiness * (e.swell ? 0.8 : 1.0) * e.a, 0.9 / kk);
            dirX[i] = std::cos(e.ang);
            dirZ[i] = std::sin(e.ang);
            phase[i] = e.phase;
            total += 0.5 * e.a * e.a;
            if (i < nGeo) varGeoH += 0.5 * (kk * ampH[i]) * (kk * ampH[i]);
        }
        double tail = 0;
        for (int j = n - 1; j >= 0; j--) {
            tail += 0.5 * (k[j] * amp[j]) * (k[j] * amp[j]);
            tailVariance[j] = tail;
        }
        slopeVariance = tail;
        significantHeight = 4.0 * std::sqrt(total);
        peakPeriod = kTau / wp;
        peakWavelength = kTau * kGravity / (wp * wp);

        // ---- whitecaps: threshold on the surface-compression Jacobian -----------
        // Where the horizontal motion squeezes the surface (J small) a crest is about
        // to break. Pick the J value that the requested fraction of the sea falls
        // below, measured on this wave set at a fixed set of sample points.
        double ws = std::min(std::max((p.windSpeed - 11.0) / 11.0, 0.0), 1.0);
        windStreaks = 0.6 * ws * ws * (3.0 - 2.0 * ws) * std::min(p.foamAmount, 1.5);
        double onset = std::min(std::max((p.windSpeed - 3.0) / 2.0, 0.0), 1.0);             // no whitecaps in light airs
        double coverage = std::min(whitecapCoverage(p.windSpeed) * p.foamAmount * 0.6, 0.3) * onset * onset * (3.0 - 2.0 * onset);
        double sigmaJ = std::sqrt(varGeoH);
        if (coverage < 1e-6 || sigmaJ < 1e-5) {
            foamThreshold = -10; foamGain = 1;
        } else {
            const int M = 2048;
            std::vector<double> js(M);
            double span = 40.0 * wavelength[0];
            for (int m = 0; m < M; m++) {
                double qx = rand() * span;
                double qz = rand() * span;
                double hxx = 0, hzz = 0, hxz = 0;
                for (int i = 0; i < nGeo; i++) {
                    double c = std::cos(k[i] * (dirX[i] * qx + dirZ[i] * qz) + phase[i]) * k[i] * ampH[i];
                    hxx += dirX[i] * dirX[i] * c; hzz += dirZ[i] * dirZ[i] * c; hxz += dirX[i] * dirZ[i] * c;
                }
                js[m] = (1.0 - hxx) * (1.0 - hzz) - hxz * hxz;
            }
            std::sort(js.begin(), js.end());
            double qi = coverage * (M - 1);
            int q0 = int(std::floor(qi));
            foamThreshold = js[q0] + (js[std::min(q0 + 1, M - 1)] - js[q0]) * (qi - q0);
            foamGain = 1.0 / (0.4 * sigmaJ);
        }
    }

    // Time. Either set an absolute time (deterministic, good for networking) or
    // advance by dt each step (lets wind and swell change without the sea jumping).
    void setTime(double time) {
        for (int i = 0; i < count; i++) {
            double ph = omega[i] * time;
            timePhase[i] = ph - kTau * std::floor(ph / kTau);
        }
    }
    void advance(double dt) {
        for (int i = 0; i < count; i++) {
            double ph = timePhase[i] + omega[i] * dt;
            timePhase[i] = ph >= kTau ? ph - kTau : ph;
        }
    }

    // Per frame: fold time and the floating origin into each wave's phase (in double
    // precision) and pack for the shaders. Shader positions are relative to
    // (originX, originZ), which keeps float precision far from the world origin.
    //   A[i] = (dirX, dirZ, k, amplitude)
    //   B[i] = (phase now, horizontal amplitude, wavelength, tail slope variance)
    void packForGpu(double originX, double originZ) {
        for (int i = 0, o = 0; i < count; i++, o += 4) {
            double ph = phase[i] - timePhase[i] + k[i] * (dirX[i] * originX + dirZ[i] * originZ);
            ph -= kTau * std::floor(ph / kTau);
            gpuA[o] = float(dirX[i]); gpuA[o + 1] = float(dirZ[i]); gpuA[o + 2] = float(k[i]); gpuA[o + 3] = float(amp[i]);
            gpuB[o] = float(ph); gpuB[o + 1] = float(ampH[i]); gpuB[o + 2] = float(wavelength[i]); gpuB[o + 3] = float(tailVariance[i]);
        }
    }

    // Water state at world position (x, z).
    //   minWavelength  ignore waves shorter than this (use roughly the object's size)
    //   depth          water depth here in metres (pass 1e9 for open ocean)
    // Trochoidal waves move points sideways, so "the height at x,z" needs the rest
    // position that lands on x,z. Three fixed-point steps get within millimetres.
    void sample(double x, double z, double minWavelength, double depth, WaterSample& out) const {
        const int n = geoCount;
        double px = x, pz = z;
        double mw = std::max(minWavelength, 1e-3);
        for (int it = 0; it < 3; it++) {
            double ox = 0, oz = 0;
            for (int i = 0; i < n; i++) {
                double w = lod(wavelength[i], mw);
                if (w <= 0) break;
                w *= shore(k[i], depth);
                double th = k[i] * (dirX[i] * px + dirZ[i] * pz) - timePhase[i] + phase[i];
                double s = std::sin(th) * ampH[i] * w;
                ox -= dirX[i] * s; oz -= dirZ[i] * s;
            }
            px = x - ox; pz = z - oz;
        }
        double h = 0, sx = 0, sz = 0, hxx = 0, hzz = 0, hxz = 0;
        double vx = 0, vy = 0, vz = 0, ax = 0, ay = 0, az = 0;
        for (int i = 0; i < n; i++) {
            double w = lod(wavelength[i], mw);
            if (w <= 0) break;
            w *= shore(k[i], depth);
            double dX = dirX[i], dZ = dirZ[i], kk = k[i], om = omega[i];
            double th = kk * (dX * px + dZ * pz) - timePhase[i] + phase[i];
            double s = std::sin(th), c = std::cos(th);
            double a = amp[i] * w, ah = ampH[i] * w;
            h += a * c;
            sx += kk * dX * a * s; sz += kk * dZ * a * s;
            hxx += dX * dX * kk * ah * c; hzz += dZ * dZ * kk * ah * c; hxz += dX * dZ * kk * ah * c;
            // orbital velocity and acceleration of the water particle
            vx += dX * ah * om * c; vz += dZ * ah * om * c; vy += a * om * s;
            ax += dX * ah * om * om * s; az += dZ * ah * om * om * s; ay -= a * om * om * c;
        }
        double jac = (1 - hxx) * (1 - hzz) - hxz * hxz;
        double nx = sx * (1 - hzz) + sz * hxz, ny = std::max(jac, 0.05), nz = sz * (1 - hxx) + sx * hxz;
        double inv = 1.0 / std::sqrt(nx * nx + ny * ny + nz * nz);
        out.height = h;
        out.nx = nx * inv; out.ny = ny * inv; out.nz = nz * inv;
        out.vx = vx; out.vy = vy; out.vz = vz;
        out.ax = ax; out.ay = ay; out.az = az;
        out.jacobian = jac;
    }

    // Buoyancy for one rigid body, engine-agnostic.
    // Call once per physics step with the body's hull sample points in world space,
    // then apply each returned force at its point (AddForceAtPosition / AddForceAtLocation).
    // Covers Archimedes lift, the Froude-Krylov force (the pressure field of the wave
    // itself, which is what makes a floating object follow the orbital motion), and
    // linear + quadratic drag against the moving water. Add gravity yourself.
    //   points, velocities, forces: count * 3 doubles (x, y, z)
    //   depthAt(x, z): water depth in metres; pass water::openOcean for deep water
    // Returns the submerged fraction 0..1.
    template <class DepthFn>
    double buoyancy(const double* points, const double* velocities, int pointCount,
                    const BuoyancyConfig& cfg, DepthFn depthAt, double* forces) const {
        const WaveSet* self = this;
        return buoyancyWith([self, &cfg, &depthAt](double x, double z, WaterSample& s) {
            self->sample(x, z, cfg.minWavelength, depthAt(x, z), s);
        }, points, velocities, pointCount, cfg, forces);
    }

private:
    static double lod(double wl, double minWl) { double v = wl / minWl - 1; return v < 0 ? 0 : v > 1 ? 1 : v; }
    static double shore(double kk, double depth) { double v = kk * depth * kShoreK; return v < 0 ? 0 : v > 1 ? 1 : v; }
};

inline double openOcean(double, double) { return 1e9; }

// Buoyancy for one rigid body against any water source.
//   sampleFn(x, z, WaterSample& out) fills the water state at world (x, z).
// Archimedes lift, the Froude-Krylov force (the wave's own pressure field, which
// makes a floating object follow the orbital motion), and linear + quadratic drag
// against the moving water. Apply each force at its point; add gravity yourself.
// Returns the submerged fraction 0..1.
template <class SampleFn>
double buoyancyWith(SampleFn sampleFn, const double* points, const double* velocities, int pointCount,
                    const BuoyancyConfig& cfg, double* forces) {
    double wet = 0;
    WaterSample s;
    for (int i = 0, o = 0; i < pointCount; i++, o += 3) {
        double x = points[o], y = points[o + 1], z = points[o + 2];
        sampleFn(x, z, s);
        double r = cfg.pointRadius;
        double f = (s.height - (y - r)) / (2 * r);
        f = f < 0 ? 0 : f > 1 ? 1 : f;
        if (f <= 0) { forces[o] = forces[o + 1] = forces[o + 2] = 0; continue; }
        wet += f;
        double m = cfg.waterDensity * cfg.pointVolume * f;              // displaced mass at this sample
        double rx = velocities[o] - s.vx, ry = velocities[o + 1] - s.vy, rz = velocities[o + 2] - s.vz;
        double speed = std::sqrt(rx * rx + ry * ry + rz * rz);
        double drag = m * cfg.linearDrag + 0.5 * cfg.waterDensity * cfg.quadDrag * cfg.pointArea * f * speed;
        forces[o] = m * s.ax - drag * rx;
        forces[o + 1] = m * (kGravity + s.ay) - drag * ry;
        forces[o + 2] = m * s.az - drag * rz;
    }
    return pointCount > 0 ? wet / pointCount : 0.0;
}

// ---------------------------------------------------------------------------
//  Water state read back from the GPU (FFT ocean) around one body.
//  data: grid * grid * 8 floats, row-major from (centerX - half, centerZ - half)
//  to (centerX + half, centerZ + half): height, vx, vy, vz, ax, ay, az, depth.
//  The read-back is a frame or two old; sample() moves it forward to time t
//  with the water's own velocity and acceleration.
// ---------------------------------------------------------------------------
struct WaterPatch {
    double centerX = 0, centerZ = 0, half = 1;
    double time = 0;                       // when the GPU captured it, same clock as t
    int grid = 5;
    std::vector<float> data;

    bool sample(double x, double z, double t, WaterSample& out) const {
        if ((int)data.size() < grid * grid * 8) { out = WaterSample(); out.ny = 1; out.jacobian = 1; return false; }
        double g1 = grid - 1;
        double u = ((x - centerX) / half * 0.5 + 0.5) * g1, v = ((z - centerZ) / half * 0.5 + 0.5) * g1;
        u = std::min(std::max(u, 0.0), g1 - 1e-4); v = std::min(std::max(v, 0.0), g1 - 1e-4);
        int iu = int(u), iv = int(v);
        double fu = u - iu, fv = v - iv;
        double q[7];
        for (int k = 0; k < 7; k++) {
            double a = data[(iv * grid + iu) * 8 + k], b = data[(iv * grid + iu + 1) * 8 + k];
            double c = data[((iv + 1) * grid + iu) * 8 + k], d = data[((iv + 1) * grid + iu + 1) * 8 + k];
            q[k] = (a * (1 - fu) + b * fu) * (1 - fv) + (c * (1 - fu) + d * fu) * fv;
        }
        for (int k = 1; k < 4; k++) q[k] = std::min(std::max(q[k], -12.0), 12.0);   // never let a glitch launch a body
        for (int k = 4; k < 7; k++) q[k] = std::min(std::max(q[k], -30.0), 30.0);
        double dt = std::min(std::max(t - time, 0.0), 0.12);
        out.height = q[0] + q[2] * dt + 0.5 * q[5] * dt * dt;
        out.vx = q[1] + q[4] * dt; out.vy = q[2] + q[5] * dt; out.vz = q[3] + q[6] * dt;
        out.ax = q[4]; out.ay = q[5]; out.az = q[6];
        out.nx = 0; out.ny = 1; out.nz = 0; out.jacobian = 1;
        return true;
    }
    // for buoyancyWith(patch.sampler(t), ...)
    struct Sampler {
        const WaterPatch* p; double t;
        void operator()(double x, double z, WaterSample& s) const { p->sample(x, z, t, s); }
    };
    Sampler sampler(double t) const { return Sampler{ this, t }; }
};

} // namespace water
