// Prints the C++ wave table, samples and buoyancy forces as JSON so tools/crosscheck.js can diff them against the JS reference.
#include "../cpp/WaterPhysics.h"
#include <cstdio>
static void arr(const char* name, const std::vector<double>& v) { printf("\"%s\":[", name); for (size_t i = 0; i < v.size(); i++) printf("%s%.17g", i ? "," : "", v[i]); printf("],"); }
int main() {
    printf("[");
    const double winds[4] = { 2.5, 9.0, 14.0, 21.0 };
    for (int c = 0; c < 4; c++) {
        water::WaveSet w(40, 24);
        water::WaveParams p; p.windSpeed = winds[c]; p.windDirection = 0.61; p.choppiness = 0.9 + 0.03 * c; p.swellHeight = 0.3 + c * 0.7; p.swellLength = 60 + c * 40; p.swellDirection = 1.4; p.foamAmount = 1.0 + 0.2 * c; p.seed = 1337 + c;
        w.generate(p);
        w.setTime(123.456 + c);
        w.advance(0.25);
        w.packForGpu(1234.5, -987.25);
        printf("%s{", c ? "," : "");
        arr("dirX", w.dirX); arr("dirZ", w.dirZ); arr("k", w.k); arr("amp", w.amp); arr("ampH", w.ampH); arr("omega", w.omega); arr("phase", w.phase); arr("timePhase", w.timePhase); arr("tailVariance", w.tailVariance);
        printf("\"gpuA\":["); for (size_t i = 0; i < w.gpuA.size(); i++) printf("%s%.9g", i ? "," : "", w.gpuA[i]); printf("],");
        printf("\"gpuB\":["); for (size_t i = 0; i < w.gpuB.size(); i++) printf("%s%.9g", i ? "," : "", w.gpuB[i]); printf("],");
        printf("\"scalars\":[%.17g,%.17g,%.17g,%.17g,%.17g,%.17g,%.17g],", w.significantHeight, w.peakPeriod, w.peakWavelength, w.foamThreshold, w.foamGain, w.windStreaks, w.slopeVariance);
        printf("\"samples\":[");
        for (int i = 0; i < 40; i++) {
            double x = -300 + i * 17.3, z = 120 - i * 9.1; water::WaterSample s;
            w.sample(x, z, i % 3 == 0 ? 1.0 : 6.0, i % 4 == 0 ? 3.0 : 1e9, s);
            printf("%s[%.17g,%.17g,%.17g,%.17g,%.17g,%.17g,%.17g,%.17g,%.17g,%.17g,%.17g]", i ? "," : "", s.height, s.nx, s.ny, s.nz, s.vx, s.vy, s.vz, s.ax, s.ay, s.az, s.jacobian);
        }
        printf("],");
        double pts[12] = { 0, -0.2, 0,  1, 0.1, 0.5,  -2, 0.4, 3,  5, -1.0, -4 }, vel[12] = { 0.1, -0.5, 0,  0, 0, 0,  1, 2, -1,  0, 0.3, 0 }, f[12];
        water::BuoyancyConfig cfg; cfg.minWavelength = 1.3;
        double wet = w.buoyancy(pts, vel, 4, cfg, water::openOcean, f);
        printf("\"buoyancy\":[%.17g", wet); for (int i = 0; i < 12; i++) printf(",%.17g", f[i]); printf("]}");
    }
    printf("]\n");
    return 0;
}
