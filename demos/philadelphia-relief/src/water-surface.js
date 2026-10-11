// The same river shading is applied to the terrain and every aerial tile.
// It shares their depth, so no independent sheet can cut triangular banks.
export const WATER_COVERAGE_GLSL=`
  uniform sampler2D uWaterGlobal,uWaterLocal;
  uniform vec4 uWaterBounds,uWaterLocalBounds;
  uniform float uWaterReady,uWaterLocalReady;
  float mappedWater(vec2 world){
    vec2 uv=(world-uWaterBounds.xy)/(uWaterBounds.zw-uWaterBounds.xy);
    float coverage=texture2D(uWaterGlobal,clamp(uv,0.0,1.0)).r;
    if(uWaterLocalReady>.5){
      vec2 local=(world-uWaterLocalBounds.xy)/(uWaterLocalBounds.zw-uWaterLocalBounds.xy);
      vec2 edge=min(local,1.0-local);
      float blend=smoothstep(0.0,.012,min(edge.x,edge.y));
      coverage=mix(coverage,texture2D(uWaterLocal,clamp(local,0.0,1.0)).r,blend);
    }
    return coverage;
  }
`;
export const WATER_SURFACE_GLSL=`
  ${WATER_COVERAGE_GLSL}
  uniform float uWaterOpacity,uWaterTime,uWaterIntensity;
  uniform vec3 uWaterDeep,uWaterShallow,uWaterSpec;
  vec3 mappedWaterColor(vec3 world,vec3 eye,vec3 sun){
    vec3 view=normalize(eye-world);
    float w1=sin(world.x*.0016+uWaterTime*.30),w2=sin(world.z*.0021-uWaterTime*.24);
    float w3=sin((world.x+world.z)*.0009+uWaterTime*.17);
    float nearMix=1.0-smoothstep(1500.0,18000.0,length(eye-world));
    vec2 finePhase=world.xz*.16+vec2(uWaterTime*.34,-uWaterTime*.22);
    float ripple=sin(finePhase.x+sin(finePhase.y*.63))*sin(finePhase.y);
    float rippleAA=1.0-smoothstep(.5,2.5,max(fwidth(finePhase.x),fwidth(finePhase.y)));
    vec3 normal=normalize(vec3((w1+w3)*.035+ripple*nearMix*rippleAA*.024,
      1.0,(w2-w3)*.035+ripple*nearMix*rippleAA*.018));
    float fresnel=pow(1.0-clamp(dot(normal,view),0.0,1.0),3.0);
    vec3 body=mix(uWaterDeep,uWaterShallow,.18+fresnel*.64);
    vec3 reflected=mix(vec3(.18,.26,.28),uWaterSpec,.35+view.y*.25);
    body=mix(body,reflected,fresnel*.28*uWaterIntensity);
    vec3 halfVec=normalize(sun+view);
    float power=mix(220.0,42.0,clamp(length(fwidth(normal))*18.0,0.0,1.0));
    float glint=pow(max(0.0,dot(normal,halfVec)),power)*power/220.0;
    float sheen=pow(max(0.0,dot(normal,halfVec)),24.0)*.25;
    float highlight=glint*2.2+sheen;highlight/=1.0+highlight*.65;
    return body+uWaterSpec*(highlight+fresnel*.34)*uWaterIntensity+uWaterShallow*.22*uWaterIntensity;
  }
  vec3 shadeMappedWater(vec3 color,vec3 world,vec3 eye,vec3 sun){
    if(uWaterReady<.5||uWaterOpacity<.001)return color;
    float coverage=mappedWater(world.xz)*uWaterOpacity;
    if(coverage<.001)return color;
    return mix(color,mappedWaterColor(world,eye,sun),coverage);
  }
`;
