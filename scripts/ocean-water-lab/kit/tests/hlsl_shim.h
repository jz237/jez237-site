// Minimal stand-in for clang's hlsl.h: just the types and intrinsic prototypes the water kit uses,
// so `clang -x hlsl -fsyntax-only` can parse and type-check the port without a full DXC install.
namespace hlsl {
typedef unsigned int uint;
typedef vector<float, 2> float2;
typedef vector<float, 3> float3;
typedef vector<float, 4> float4;
typedef vector<int, 2> int2;
typedef vector<uint, 2> uint2;
#define UNARY(f) float f(float); float2 f(float2); float3 f(float3); float4 f(float4);
UNARY(sin) UNARY(cos) UNARY(exp) UNARY(sqrt) UNARY(abs) UNARY(floor) UNARY(frac) UNARY(normalize) UNARY(log2) UNARY(sign) UNARY(asin) UNARY(acos)
#define BINARY(f) float f(float, float); float2 f(float2, float2); float3 f(float3, float3); float3 f(float3, float); float2 f(float2, float);
BINARY(min) BINARY(max) BINARY(pow)
float dot(float2, float2); float dot(float3, float3);
float length(float2); float length(float3);
float clamp(float, float, float); float2 clamp(float2, float, float); float3 clamp(float3, float, float);
float lerp(float, float, float); float3 lerp(float3, float3, float); float3 lerp(float3, float3, float3);
float smoothstep(float, float, float);
float2 step(float2, float2); float step(float, float);
float3 reflect(float3, float3); float3 refract(float3, float3, float);
typedef vector<int, 3> int3;
struct SamplerState { int unused; };
struct Texture2DArray {
  float4 Sample(SamplerState s, float3 uv);
  float4 SampleLevel(SamplerState s, float3 uv, float lod);
};
}
using namespace hlsl;
