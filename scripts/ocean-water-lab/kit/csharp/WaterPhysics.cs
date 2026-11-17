// ============================================================================
//  WATER KIT - wave core and buoyancy, C# (Unity, Godot .NET, Stride, MonoGame)
// ----------------------------------------------------------------------------
//  One wave set drives everything: the vertex shader displaces the mesh with it,
//  the fragment shader takes analytic normals from it, and gameplay code samples
//  it here on the CPU for buoyancy. Same numbers everywhere, no GPU read-back.
//
//      var sea = new WaterKit.WaveSet();              // 40 geometry + 24 detail waves
//      sea.Generate(new WaterKit.WaveParams());       // wind, swell, choppiness...
//      // every physics step
//      sea.Advance(dt);                               // or sea.SetTime(t) for lockstep
//      WaterKit.WaterSample s;
//      sea.Sample(x, z, 1.0, 1e9, out s);             // height, normal, velocity, acceleration
//      // every rendered frame
//      sea.PackForGpu(originX, originZ);              // then upload GpuA / GpuB as vec4 arrays
//
//  Y is up; waves travel in the XZ plane. SI units throughout.
//  Port of js/water_waves.js and cpp/WaterPhysics.h, statement for statement.
//
//  FFT ocean: copy the GPU read-back of fft_query.frag into a WaterPatch
//  (Unity: AsyncGPUReadback) and call WaterPhysics.Buoyancy(patch.Sample, ...).
//  No engine types are used, so the file compiles anywhere.
// ============================================================================
using System;
using System.Collections.Generic;

namespace WaterKit
{
    public class WaveParams
    {
        public double windSpeed = 9;              // m/s at 10 m height
        public double windDirection = 0.6;        // radians, direction the waves travel towards (0 = +X)
        public double fetchKm = 300;              // distance the wind has blown over open water
        public double gamma = 3.3;                // JONSWAP peak sharpness
        public double spread = 12;                // directional focus at the peak (higher = longer crests)
        public double choppiness = 0.9;           // 0 = sine waves, 1 = full trochoid (sharp crests)
        public double amplitudeScale = 1;         // artistic multiplier on wind-wave height
        public double detailScale = 1.5;          // multiplier on the short normal-only waves (wind ripples)
        public double swellHeight = 0.6;          // significant height of the swell group, metres
        public double swellLength = 90;           // swell wavelength, metres
        public double swellDirection = 1.4;       // radians
        public double geoMinWavelength = 4.0;     // shortest wave that moves vertices, metres
        public double detailMinWavelength = 0.08; // shortest wave in the normal-only band, metres
        public double foamAmount = 1;             // multiplier on whitecap coverage
        public uint seed = 1337;
    }

    public struct WaterSample
    {
        public double height;                     // surface height above the rest level
        public double nx, ny, nz;                 // surface normal
        public double vx, vy, vz;                 // velocity of the water itself (orbital motion)
        public double ax, ay, az;                 // acceleration of the water
        public double jacobian;                   // < 1 where the surface is being squeezed
    }

    public class BuoyancyConfig
    {
        public double pointVolume = 0.05;         // hull volume represented by one sample point, m^3
        public double pointRadius = 0.18;         // half height of that cell: a point is fully wet this far under
        public double pointArea = 0.13;           // cross-section of the cell, for quadratic drag, m^2
        public double waterDensity = 1025;        // kg/m^3
        public double linearDrag = 1.1;           // 1/s
        public double quadDrag = 1.0;             // drag coefficient
        public double minWavelength = 1.0;        // ignore waves shorter than the hull, metres
    }

    /// <summary>mulberry32 (public domain, T. Ettinger). Integer-exact in JS, C++ and C#.</summary>
    public class Rng
    {
        private uint s;
        public Rng(uint seed) { s = seed; }
        public double Next()
        {
            unchecked
            {
                s += 0x6D2B79F5u;
                uint t = s;
                t = (t ^ (t >> 15)) * (t | 1u);
                t ^= t + (t ^ (t >> 7)) * (t | 61u);
                return (double)(t ^ (t >> 14)) / 4294967296.0;
            }
        }
    }

    public class WaveSet
    {
        public const double Gravity = 9.81;
        public const double Tau = 6.283185307179586;
        public const double ShoreK = 1.5;         // must match WATER_SHORE_K in the shaders
        public const int SwellWaves = 3;          // geometry slots reserved for swell

        public readonly int geoCount, detailCount, count;
        public readonly double[] dirX, dirZ;      // unit direction of travel
        public readonly double[] k;               // wavenumber, rad/m
        public readonly double[] amp;             // vertical amplitude, m
        public readonly double[] ampH;            // horizontal amplitude (choppiness * amp), m
        public readonly double[] omega;           // angular frequency, rad/s
        public readonly double[] phase;           // phase at t = 0, origin
        public readonly double[] timePhase;       // omega * t, accumulated (see SetTime / Advance)
        public readonly double[] wavelength;
        public readonly double[] tailVariance;    // slope variance of waves i..n-1
        public readonly float[] GpuA, GpuB;       // 4 floats per wave, ready to upload as vec4 arrays
        public WaveParams parameters;
        public double significantHeight, peakPeriod, peakWavelength;
        public double foamThreshold, foamGain = 1; // uniforms uFoamThreshold / uFoamGain
        public double windStreaks;                 // uniform uWindStreaks, 0..0.6
        public double slopeVariance;

        private struct Entry
        {
            public double w, a, ang, phase;
            public bool detail, swell;
        }

        public WaveSet(int geo = 40, int detail = 24)
        {
            geoCount = geo; detailCount = detail; count = geo + detail;
            int n = count;
            dirX = new double[n]; dirZ = new double[n]; k = new double[n]; amp = new double[n]; ampH = new double[n];
            omega = new double[n]; phase = new double[n]; timePhase = new double[n]; wavelength = new double[n];
            tailVariance = new double[n];
            GpuA = new float[n * 4]; GpuB = new float[n * 4];
        }

        /// <summary>JONSWAP spectral shape S(w), without the alpha scale (we normalise to Hs).</summary>
        public static double JonswapShape(double w, double wp, double gamma)
        {
            double sigma = w <= wp ? 0.07 : 0.09;
            double d = (w - wp) / (sigma * wp);
            double peak = Math.Pow(gamma, Math.Exp(-0.5 * d * d));
            return (Gravity * Gravity) / Math.Pow(w, 5.0) * Math.Exp(-1.25 * Math.Pow(wp / w, 4.0)) * peak;
        }

        /// <summary>Wind speed (m/s at 10 m) and fetch (km) to peak frequency and significant height.
        /// JONSWAP fetch relations, capped at the fully developed (Pierson-Moskowitz) sea.</summary>
        public static void SeaStateFromWind(double windSpeed, double fetchKm, out double peakOmega, out double significantHeight)
        {
            double U = Math.Max(windSpeed, 0.5);
            double x = Math.Min(Gravity * fetchKm * 1000.0 / (U * U), 2.2e4);
            peakOmega = Tau * 3.5 * Math.Pow(x, -0.33) * Gravity / U;
            significantHeight = 4.0 * Math.Sqrt(1.6e-7 * x) * U * U / Gravity;
        }

        /// <summary>Fraction of the sea covered by whitecaps (Monahan and O'Muircheartaigh 1980).</summary>
        public static double WhitecapCoverage(double windSpeed)
        {
            return Math.Min(3.84e-6 * Math.Pow(Math.Max(windSpeed, 0.0), 3.41), 0.5);
        }

        private static void AddBand(List<Entry> list, Rng rand, WaveParams p, double wp, double w0, double w1, int bandCount, bool isDetail, ref double energy)
        {
            double ratio = Math.Pow(w1 / w0, 1.0 / bandCount);
            for (int b = 0; b < bandCount; b++)
            {
                double u0 = rand.Next(), u1 = rand.Next(), u2 = rand.Next(), u3 = rand.Next();   // always four draws per wave
                double wa = w0 * Math.Pow(ratio, (double)b), wb = wa * ratio;
                double w = wa * Math.Pow(ratio, 0.5 + 0.7 * (u0 - 0.5));
                double a = Math.Sqrt(2.0 * JonswapShape(w, wp, p.gamma) * (wb - wa));
                // directional spreading: cos^2s model reduced to an angular std-dev
                double rel = w / wp;
                double s = p.spread * Math.Pow(rel, rel <= 1.0 ? 5.0 : -2.5);
                double sd = Math.Min(Math.Sqrt(2.0 / (s + 1.0)), 1.05);
                // Neighbouring waves share a wavelength band; fan each triple out across the
                // spread so crests come out short and broken like a real wind sea.
                int stratum = (b * 2 + b / 3) % 3;
                double uq = Math.Min(Math.Max((stratum + u1) / 3.0, 0.03), 0.97);
                double gauss = Math.Log(uq / (1.0 - uq)) / 1.702;    // logistic approximation of the normal quantile
                double ang = p.windDirection + Math.Max(-1.75, Math.Min(1.75, sd * gauss)) + (u2 - 0.5) * 0.08;
                Entry e = new Entry();
                e.w = w; e.a = a; e.ang = ang; e.phase = Tau * u3; e.detail = isDetail; e.swell = false;
                list.Add(e);
                energy += 0.5 * a * a;
            }
        }

        // insertion sort: stable, and the lists are tiny
        private static void SortByFrequency(List<Entry> v)
        {
            for (int i = 1; i < v.Count; i++)
            {
                Entry e = v[i];
                int j = i - 1;
                while (j >= 0 && v[j].w > e.w) { v[j + 1] = v[j]; j--; }
                v[j + 1] = e;
            }
        }

        public void Generate(WaveParams p)
        {
            parameters = p;
            Rng rand = new Rng(p.seed);
            double wp, hsWind;
            SeaStateFromWind(p.windSpeed, p.fetchKm, out wp, out hsWind);
            int nGeo = geoCount, nDet = detailCount, n = count, nWind = nGeo - SwellWaves;

            // ---- frequency bands (geometric spacing, jittered) -----------------
            double wLo = 0.7 * wp;
            double wGeoHi = Math.Max(Math.Sqrt(Gravity * Tau / p.geoMinWavelength), wLo * 4.0);
            double wDetHi = Math.Max(Math.Sqrt(Gravity * Tau / p.detailMinWavelength), wGeoHi * 3.0);
            List<Entry> list = new List<Entry>();
            double energy = 0;
            AddBand(list, rand, p, wp, wLo, wGeoHi, nWind, false, ref energy);
            AddBand(list, rand, p, wp, wGeoHi, wDetHi, nDet, true, ref energy);

            // ---- scale the wind sea to the target significant wave height ------
            double hsTarget = hsWind * p.amplitudeScale;
            double scale = energy > 0 ? (hsTarget / 4.0) / Math.Sqrt(energy) : 0.0;
            // light airs leave the small ripples weak; from a moderate breeze up they are fully developed
            double ripple = Math.Min(Math.Max((p.windSpeed - 2.0) / 6.0, 0.0), 1.0);
            double detailMul = p.detailScale * (0.45 + 0.55 * ripple);
            for (int i = 0; i < list.Count; i++)
            {
                Entry e = list[i];
                e.a *= scale * (e.detail ? detailMul : 1.0);
                list[i] = e;
            }

            // ---- swell: three long, nearly parallel waves -----------------------
            double[] swellMul = { 0.84, 1.0, 1.19 }, swellAmp = { 0.55, 1.0, 0.6 }, swellAng = { -0.11, 0.0, 0.09 };
            double se = 0;
            for (int i = 0; i < SwellWaves; i++) se += 0.5 * swellAmp[i] * swellAmp[i];
            double swellScale = (p.swellHeight / 4.0) / Math.Sqrt(se);
            for (int i = 0; i < SwellWaves; i++)
            {
                double u = rand.Next();
                double L = Math.Max(p.swellLength, 4.0) * swellMul[i];
                Entry e = new Entry();
                e.w = Math.Sqrt(Gravity * Tau / L); e.a = swellAmp[i] * swellScale; e.ang = p.swellDirection + swellAng[i];
                e.phase = Tau * u; e.detail = false; e.swell = true;
                list.Add(e);
            }

            // ---- order: geometry waves longest first, then the detail band ------
            List<Entry> geo = new List<Entry>(), det = new List<Entry>();
            for (int i = 0; i < list.Count; i++)
            {
                if (list[i].detail) det.Add(list[i]); else geo.Add(list[i]);
            }
            SortByFrequency(geo);
            SortByFrequency(det);
            geo.AddRange(det);

            double varGeoH = 0, total = 0;
            for (int i = 0; i < n; i++)
            {
                Entry e = geo[i];
                double kk = e.w * e.w / Gravity;                   // deep-water dispersion
                omega[i] = e.w;
                k[i] = kk;
                wavelength[i] = Tau / kk;
                amp[i] = e.a;
                // keep every single wave below the breaking limit k*a_h < 1
                ampH[i] = Math.Min(p.choppiness * (e.swell ? 0.8 : 1.0) * e.a, 0.9 / kk);
                dirX[i] = Math.Cos(e.ang);
                dirZ[i] = Math.Sin(e.ang);
                phase[i] = e.phase;
                total += 0.5 * e.a * e.a;
                if (i < nGeo) varGeoH += 0.5 * (kk * ampH[i]) * (kk * ampH[i]);
            }
            double tail = 0;
            for (int j = n - 1; j >= 0; j--)
            {
                tail += 0.5 * (k[j] * amp[j]) * (k[j] * amp[j]);
                tailVariance[j] = tail;
            }
            slopeVariance = tail;
            significantHeight = 4.0 * Math.Sqrt(total);
            peakPeriod = Tau / wp;
            peakWavelength = Tau * Gravity / (wp * wp);

            // ---- whitecaps: threshold on the surface-compression Jacobian -------
            // Where the horizontal motion squeezes the surface (J small) a crest is about
            // to break. Pick the J value that the requested fraction of the sea falls
            // below, measured on this wave set at a fixed set of sample points.
            double ws = Math.Min(Math.Max((p.windSpeed - 11.0) / 11.0, 0.0), 1.0);
            windStreaks = 0.6 * ws * ws * (3.0 - 2.0 * ws) * Math.Min(p.foamAmount, 1.5);
            double onset = Math.Min(Math.Max((p.windSpeed - 3.0) / 2.0, 0.0), 1.0);             // no whitecaps in light airs
            double coverage = Math.Min(WhitecapCoverage(p.windSpeed) * p.foamAmount * 0.6, 0.3) * onset * onset * (3.0 - 2.0 * onset);
            double sigmaJ = Math.Sqrt(varGeoH);
            if (coverage < 1e-6 || sigmaJ < 1e-5)
            {
                foamThreshold = -10; foamGain = 1;
            }
            else
            {
                const int M = 2048;
                double[] js = new double[M];
                double span = 40.0 * wavelength[0];
                for (int m = 0; m < M; m++)
                {
                    double qx = rand.Next() * span;
                    double qz = rand.Next() * span;
                    double hxx = 0, hzz = 0, hxz = 0;
                    for (int i = 0; i < nGeo; i++)
                    {
                        double c = Math.Cos(k[i] * (dirX[i] * qx + dirZ[i] * qz) + phase[i]) * k[i] * ampH[i];
                        hxx += dirX[i] * dirX[i] * c; hzz += dirZ[i] * dirZ[i] * c; hxz += dirX[i] * dirZ[i] * c;
                    }
                    js[m] = (1.0 - hxx) * (1.0 - hzz) - hxz * hxz;
                }
                Array.Sort(js);
                double qi = coverage * (M - 1);
                int q0 = (int)Math.Floor(qi);
                foamThreshold = js[q0] + (js[Math.Min(q0 + 1, M - 1)] - js[q0]) * (qi - q0);
                foamGain = 1.0 / (0.4 * sigmaJ);
            }
        }

        // Time. Either set an absolute time (deterministic, good for networking) or
        // advance by dt each step (lets wind and swell change without the sea jumping).
        public void SetTime(double time)
        {
            for (int i = 0; i < count; i++)
            {
                double ph = omega[i] * time;
                timePhase[i] = ph - Tau * Math.Floor(ph / Tau);
            }
        }

        public void Advance(double dt)
        {
            for (int i = 0; i < count; i++)
            {
                double ph = timePhase[i] + omega[i] * dt;
                timePhase[i] = ph >= Tau ? ph - Tau : ph;
            }
        }

        /// <summary>Per frame: fold time and the floating origin into each wave's phase (in double
        /// precision) and pack for the shaders. Shader positions are relative to (originX, originZ),
        /// which keeps float precision far from the world origin.
        ///   A[i] = (dirX, dirZ, k, amplitude)
        ///   B[i] = (phase now, horizontal amplitude, wavelength, tail slope variance)</summary>
        public void PackForGpu(double originX, double originZ)
        {
            for (int i = 0, o = 0; i < count; i++, o += 4)
            {
                double ph = phase[i] - timePhase[i] + k[i] * (dirX[i] * originX + dirZ[i] * originZ);
                ph -= Tau * Math.Floor(ph / Tau);
                GpuA[o] = (float)dirX[i]; GpuA[o + 1] = (float)dirZ[i]; GpuA[o + 2] = (float)k[i]; GpuA[o + 3] = (float)amp[i];
                GpuB[o] = (float)ph; GpuB[o + 1] = (float)ampH[i]; GpuB[o + 2] = (float)wavelength[i]; GpuB[o + 3] = (float)tailVariance[i];
            }
        }

        private static double Lod(double wl, double minWl)
        {
            double v = wl / minWl - 1;
            return v < 0 ? 0 : v > 1 ? 1 : v;
        }

        private static double Shore(double kk, double depth)
        {
            double v = kk * depth * ShoreK;
            return v < 0 ? 0 : v > 1 ? 1 : v;
        }

        /// <summary>Water state at world position (x, z).
        ///   minWavelength  ignore waves shorter than this (use roughly the object's size)
        ///   depth          water depth here in metres (pass 1e9 for open ocean)
        /// Trochoidal waves move points sideways, so "the height at x,z" needs the rest
        /// position that lands on x,z. Three fixed-point steps get within millimetres.</summary>
        public void Sample(double x, double z, double minWavelength, double depth, out WaterSample o)
        {
            int n = geoCount;
            double px = x, pz = z;
            double mw = Math.Max(minWavelength, 1e-3);
            for (int it = 0; it < 3; it++)
            {
                double ox = 0, oz = 0;
                for (int i = 0; i < n; i++)
                {
                    double w = Lod(wavelength[i], mw);
                    if (w <= 0) break;
                    w *= Shore(k[i], depth);
                    double th = k[i] * (dirX[i] * px + dirZ[i] * pz) - timePhase[i] + phase[i];
                    double s = Math.Sin(th) * ampH[i] * w;
                    ox -= dirX[i] * s; oz -= dirZ[i] * s;
                }
                px = x - ox; pz = z - oz;
            }
            double h = 0, sx = 0, sz = 0, hxx = 0, hzz = 0, hxz = 0;
            double vx = 0, vy = 0, vz = 0, ax = 0, ay = 0, az = 0;
            for (int i = 0; i < n; i++)
            {
                double w = Lod(wavelength[i], mw);
                if (w <= 0) break;
                w *= Shore(k[i], depth);
                double dX = dirX[i], dZ = dirZ[i], kk = k[i], om = omega[i];
                double th = kk * (dX * px + dZ * pz) - timePhase[i] + phase[i];
                double s = Math.Sin(th), c = Math.Cos(th);
                double a = amp[i] * w, ah = ampH[i] * w;
                h += a * c;
                sx += kk * dX * a * s; sz += kk * dZ * a * s;
                hxx += dX * dX * kk * ah * c; hzz += dZ * dZ * kk * ah * c; hxz += dX * dZ * kk * ah * c;
                // orbital velocity and acceleration of the water particle
                vx += dX * ah * om * c; vz += dZ * ah * om * c; vy += a * om * s;
                ax += dX * ah * om * om * s; az += dZ * ah * om * om * s; ay -= a * om * om * c;
            }
            double jac = (1 - hxx) * (1 - hzz) - hxz * hxz;
            double nx = sx * (1 - hzz) + sz * hxz, ny = Math.Max(jac, 0.05), nz = sz * (1 - hxx) + sx * hxz;
            double inv = 1.0 / Math.Sqrt(nx * nx + ny * ny + nz * nz);
            o = new WaterSample();
            o.height = h;
            o.nx = nx * inv; o.ny = ny * inv; o.nz = nz * inv;
            o.vx = vx; o.vy = vy; o.vz = vz;
            o.ax = ax; o.ay = ay; o.az = az;
            o.jacobian = jac;
        }

        /// <summary>Buoyancy for one rigid body, engine-agnostic.
        /// Call once per physics step with the body's hull sample points in world space, then
        /// apply each returned force at its point (Rigidbody.AddForceAtPosition and the like).
        /// Covers Archimedes lift, the Froude-Krylov force (the pressure field of the wave
        /// itself, which is what makes a floating object follow the orbital motion), and
        /// linear + quadratic drag against the moving water. Add gravity yourself.
        ///   points, velocities, forces: pointCount * 3 doubles (x, y, z)
        ///   depthAt(x, z): water depth in metres, or null for open ocean
        /// Returns the submerged fraction 0..1.</summary>
        public double Buoyancy(double[] points, double[] velocities, int pointCount, BuoyancyConfig cfg,
                               Func<double, double, double> depthAt, double[] forces)
        {
            return WaterPhysics.Buoyancy((double x, double z, out WaterSample s) =>
            {
                Sample(x, z, cfg.minWavelength, depthAt != null ? depthAt(x, z) : 1e9, out s);
            }, points, velocities, pointCount, cfg, forces);
        }
    }

    public delegate void WaterSampler(double x, double z, out WaterSample sample);

    public static class WaterPhysics
    {
        /// <summary>Buoyancy for one rigid body against any water source.
        /// Archimedes lift, the Froude-Krylov force (the wave's own pressure field, which makes
        /// a floating object follow the orbital motion), and linear + quadratic drag against the
        /// moving water. Apply each force at its point; add gravity yourself.
        ///   points, velocities, forces: pointCount * 3 doubles (x, y, z)
        /// Returns the submerged fraction 0..1.</summary>
        public static double Buoyancy(WaterSampler sampler, double[] points, double[] velocities, int pointCount,
                                      BuoyancyConfig cfg, double[] forces)
        {
            double wet = 0;
            WaterSample s;
            for (int i = 0, o = 0; i < pointCount; i++, o += 3)
            {
                double x = points[o], y = points[o + 1], z = points[o + 2];
                sampler(x, z, out s);
                double r = cfg.pointRadius;
                double f = (s.height - (y - r)) / (2 * r);
                f = f < 0 ? 0 : f > 1 ? 1 : f;
                if (f <= 0) { forces[o] = 0; forces[o + 1] = 0; forces[o + 2] = 0; continue; }
                wet += f;
                double m = cfg.waterDensity * cfg.pointVolume * f;          // displaced mass at this sample
                double rx = velocities[o] - s.vx, ry = velocities[o + 1] - s.vy, rz = velocities[o + 2] - s.vz;
                double speed = Math.Sqrt(rx * rx + ry * ry + rz * rz);
                double drag = m * cfg.linearDrag + 0.5 * cfg.waterDensity * cfg.quadDrag * cfg.pointArea * f * speed;
                forces[o] = m * s.ax - drag * rx;
                forces[o + 1] = m * (WaveSet.Gravity + s.ay) - drag * ry;
                forces[o + 2] = m * s.az - drag * rz;
            }
            return pointCount > 0 ? wet / pointCount : 0.0;
        }
    }

    /// <summary>Water state read back from the GPU (FFT ocean) around one body.
    /// data: grid * grid * 8 floats, row-major from (centerX - half, centerZ - half) to
    /// (centerX + half, centerZ + half): height, vx, vy, vz, ax, ay, az, depth.
    /// The read-back is a frame or two old; Sample moves it forward to time t.</summary>
    public class WaterPatch
    {
        public double centerX, centerZ, half = 1;
        public double time;                       // when the GPU captured it, same clock as t
        public int grid = 5;
        public float[] data;
        public double now;                        // set before calling Buoyancy(patch.Sample, ...)

        public void Sample(double x, double z, out WaterSample o)
        {
            o = new WaterSample();
            o.ny = 1; o.jacobian = 1;
            if (data == null || data.Length < grid * grid * 8) return;
            double g1 = grid - 1;
            double u = ((x - centerX) / half * 0.5 + 0.5) * g1, v = ((z - centerZ) / half * 0.5 + 0.5) * g1;
            u = Math.Min(Math.Max(u, 0.0), g1 - 1e-4); v = Math.Min(Math.Max(v, 0.0), g1 - 1e-4);
            int iu = (int)u, iv = (int)v;
            double fu = u - iu, fv = v - iv;
            double[] q = new double[7];
            for (int k = 0; k < 7; k++)
            {
                double a = data[(iv * grid + iu) * 8 + k], b = data[(iv * grid + iu + 1) * 8 + k];
                double c = data[((iv + 1) * grid + iu) * 8 + k], d = data[((iv + 1) * grid + iu + 1) * 8 + k];
                q[k] = (a * (1 - fu) + b * fu) * (1 - fv) + (c * (1 - fu) + d * fu) * fv;
            }
            for (int k = 1; k < 4; k++) q[k] = Math.Min(Math.Max(q[k], -12.0), 12.0);   // never let a glitch launch a body
            for (int k = 4; k < 7; k++) q[k] = Math.Min(Math.Max(q[k], -30.0), 30.0);
            double dt = Math.Min(Math.Max(now - time, 0.0), 0.12);
            o.height = q[0] + q[2] * dt + 0.5 * q[5] * dt * dt;
            o.vx = q[1] + q[4] * dt; o.vy = q[2] + q[5] * dt; o.vz = q[3] + q[6] * dt;
            o.ax = q[4]; o.ay = q[5]; o.az = q[6];
        }
    }
}
