#include "../hlsl/WaterWaves.hlsl"
#include "../hlsl/WaterShading.hlsl"
float shoreDepth(float2 p) { return max(0.05 * length(p) - 2.0, 0.0); }
#define WATER_SURF_DEPTH(p) shoreDepth(p)
#include "../hlsl/WaterSurf.hlsl"
#include "../hlsl/WaterWeather.hlsl"
// exercise every entry point the way a material would
float4 testAll(float2 p, float2 dx, float2 dy, float3 V, float3 L, float3 sun, float3 amb, float3 refl, float3 refr) {
    float3 d = waterDisplace(p, 0.5, 30.0);
    WaterDetail wd = waterDetail(p, dx, dy, 30.0);
    float j = waterJacobian(p, 1.0, 30.0) + waterHeightApprox(p, 1.0, 30.0) + waterCaustics(p, 2.0, 0.7, 0.05);
    float3 N = normalize(wd.normal);
    WaterMaterial m;
    m.extinction = float3(0.38, 0.075, 0.045); m.scatterColor = float3(0.004, 0.045, 0.085);
    m.sssColor = float3(0.02, 0.42, 0.36); m.sssStrength = 1.0; m.roughness = 0.035; m.foamColor = float3(0.92, 0.92, 0.92); m.specular = 1.0;
    float3 R = waterReflectDir(N, V, sqrt(wd.lostVar));
    float foam = waterFoamMask(p, float2(1.0, 0.0), 0.5, 0.02) + waterWindStreaks(p, float2(1.0, 0.0), 0.3, 0.02);
    N.xz -= waterRainRipples(p, 1.0, 1.0, 0.01) * N.y;
    float3 c = waterShade(N, V, L, sun, amb, refl + R, refr, 3.0, 0.5, foam, wd.lostVar, m);
    WaterSurf sf = waterSurf(p, 3.0);
    c += sf.foam + sf.height + sf.grad.x + sf.push.y + waterSurfFoam(p, sf, 0.05);
    WaterRogue rg = waterRogue(p, 40.0);
    c += rg.disp + rg.grad.x + rg.foam + waterGustMask(p) + waterSlickMask(p).x;
    return float4(c + d * j, waterFresnel(0.5, 0.1));
}
