#define WATER_CASCADES 4
#include "../hlsl/WaterFFT.hlsl"
#include "../hlsl/WaterCascades.hlsl"
// every FFT entry point, the way a compute kernel or material would call it
float4 testFft(int2 id, float2 noiseA, float2 noiseB, float t, float2 p) {
    float4 band = float4(1024.0, 0.0, 0.3, 1.0), windA = float4(1.0, 0.0, 0.9, 3.3), windB = float4(0.01, 15.0, 0.0, 0.0);
    float4 h0 = waterSpectrumH0(id, 256, band, noiseA, noiseB, windA, windB, windA, windB);
    float4 o0, o1;
    waterEvolve(waterGridK(id, 256, 1024.0), h0, t, 1.0, o0, o1);
    int2 src = waterFftSources(id.x, 8, 256);
    float4 b = waterFftButterfly(o0, o1, src.x, 8);
    float4 disp, deriv, mom;
    waterAssemble(b, o1, 0.5, float3(0.8, 3.0, 0.98), disp, deriv, mom);
    float3 d = waterDisplaceFFT(p, 1.0, 20.0);
    WaterDetail wd = waterDetailFFT(p, 20.0);
    float j = waterFoamJacobianFFT(p, 0.3, 20.0) + waterHeightFFT(p, 1.0, 20.0, 2) + waterCausticsFFT(p, 2.0, 0.7, 0.05);
    return disp + deriv + mom + float4(d + wd.normal * (wd.jacobian + wd.lostVar + wd.foam + wd.foamJacobian), j);
}
