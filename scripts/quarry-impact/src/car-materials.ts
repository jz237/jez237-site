import * as T from 'three';

/** Wet paint (offline rain, shared by every car): the colour deepens (WET_PAINT.saturate more saturated, WET_PAINT.darken
 * darker) and dust or mud on it goes much darker; every panel takes a film of water (roughness times WET_PAINT.film on top,
 * halfway to that on the sides) under a sharp clearcoat; and close up, beads of water stand on the panels facing the sky
 * (faded out once a bead is too small on screen to draw). 0 dry to 1 soaked. */
export const CAR_WET={value:0};
export const WET_PAINT={darken:.18,saturate:.3,mud:.5,film:.4,coat:.5,bead:36} as const;
// Body-space shading survives dents and detached parts without swimming UVs.
// Damage is separate from base color: exposed alloy reflects as metal while
// dusty paint gets rougher and loses its clearcoat highlights.
export function finishPaint(material: T.MeshPhysicalMaterial, contactWear = false) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.rainWet = CAR_WET;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec2 impactWear; varying vec3 vBodyPosition; varying vec2 vImpactWear;\nattribute vec3 crumple; varying vec3 vCrumple; varying vec3 vCrumpleRest; varying vec4 vCrumpleFold;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBodyPosition = position; vImpactWear = impactWear;\nvCrumple = crumple; vCrumpleRest = position - crumple;\nvec3 crumpleAlong=crumple-dot(crumple,objectNormal)*objectNormal; float crumpleAlongLen=length(crumpleAlong);\nvCrumpleFold=vec4(crumpleAlongLen>1e-5?crumpleAlong/crumpleAlongLen:vec3(0.,0.,1.),crumpleAlongLen/max(length(crumple),1e-5));');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec3 vBodyPosition; varying vec2 vImpactWear; varying vec3 vCrumple; varying vec3 vCrumpleRest; varying vec4 vCrumpleFold;
uniform float rainWet;
// Bump from a height in metres, using unnormalised screen derivatives so the creases keep their
// real size at any distance (Mikkelsen's surface-gradient form, as in three's bumpmap chunk).
vec3 crumpleBump(vec3 pos,vec3 n,vec2 dh,float face){
  vec3 sx=dFdx(pos),sy=dFdy(pos),r1=cross(sy,n),r2=cross(n,sx);
  float det=dot(sx,r1)*face;
  return normalize(abs(det)*n-sign(det)*(dh.x*r1+dh.y*r2));
}
float bodyNoise(vec3 p) { return fract(sin(dot(floor(p),vec3(127.1,311.7,74.7)))*43758.5453); }
// Interpolate deposited dust across cell boundaries; unfiltered floor noise
// makes the lower body look like a coarse checkerboard at chase distance.
float bodySilt(vec3 p) {
  vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(
    mix(mix(bodyNoise(i),bodyNoise(i+vec3(1.,0.,0.)),f.x),
        mix(bodyNoise(i+vec3(0.,1.,0.)),bodyNoise(i+vec3(1.,1.,0.)),f.x),f.y),
    mix(mix(bodyNoise(i+vec3(0.,0.,1.)),bodyNoise(i+vec3(1.,0.,1.)),f.x),
        mix(bodyNoise(i+vec3(0.,1.,1.)),bodyNoise(i+vec3(1.,1.,1.)),f.x),f.y),f.z);
}
`)
      .replace('#include <color_fragment>', `#include <color_fragment>
float grain=bodyNoise(vBodyPosition*340.);
float silt=bodySilt(vBodyPosition*36.);
float lowBody=1.-smoothstep(.3,1.05,vBodyPosition.y);
float dust=clamp(lowBody*(.18+silt*.16)+vImpactWear.x*.18,0.,.56);
float scratch=clamp(vImpactWear.x,0.,1.);
float scrapeLines=smoothstep(.75,.96,abs(sin(vBodyPosition.y*235.+vBodyPosition.z*29.+sin(vBodyPosition.x*12.))));
float bareMetal=clamp(vImpactWear.y,0.,1.)*max(scrapeLines,smoothstep(.65,.92,grain)*.65);
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.19,.16,.12),dust);
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.22,.24,.24),bareMetal*.9);
diffuseColor.rgb*=1.-scratch*.15;
// Crumpled metal: a panel squeezed along its surface folds into an accordion of creases across the
// push; one pushed straight in creases in rings around the dent (contours of how far it moved). The paint cracks along the sharpest folds and loses its gloss.
float crumpleMove=length(vCrumple);
float crumpleAmt=smoothstep(.015,.2,crumpleMove);
// Screen-space footprints stay outside the branch; the noise only runs where metal has moved.
float crumplePix=length(fwidth(vCrumpleRest)),crumpleRingPix=fwidth(crumpleMove)*52.;
float crumpleHeight=0.,crumpleCrack=0.,crumpleCavity=0.;
if(crumpleAmt>0.){
  vec3 crumpleDir=normalize(vCrumpleFold.xyz+vec3(1e-5));float crumpleAlong=smoothstep(.15,.5,vCrumpleFold.w);
  vec3 crumpleWarp=vec3(bodySilt(vCrumpleRest*3.),bodySilt(vCrumpleRest*3.+11.),bodySilt(vCrumpleRest*3.+23.))-.5;
  float crumpleNoise=bodySilt(vCrumpleRest*6.)*1.6;
  float crumplePhase=dot(vCrumpleRest+crumpleWarp*.16,crumpleDir)*15.+crumpleNoise,crumpleRing=crumpleMove*52.+crumpleWarp.x*2.2+crumpleNoise;
  float crumpleSide=dot(vCrumpleRest+crumpleWarp*.12,normalize(cross(crumpleDir,vec3(.31,.83,.46))))*24.+bodySilt(vCrumpleRest*8.)*2.;
  float crumpleFold=mix(1.-abs(sin(crumpleRing)),1.-abs(sin(crumplePhase)),crumpleAlong),crumpleWrinkle=1.-abs(sin(crumpleSide));
  float crumpleFade=1.-clamp(max(mix(crumpleRingPix,crumplePix*15.,crumpleAlong),crumplePix*14.)*.7,0.,1.);
  float crumpleBuckle=smoothstep(.2,.75,bodySilt(vCrumpleRest*4.3+crumpleDir*floor(mix(crumpleRing,crumplePhase,step(.5,crumpleAlong))/3.14159+.5)));
  crumpleHeight=crumpleAmt*crumpleFade*(.018*crumpleFold*crumpleFold*crumpleFold*(.35+.65*crumpleBuckle)+.004*pow(crumpleWrinkle,8.)*crumpleBuckle*crumpleAlong*smoothstep(.6,1.,crumpleAmt));
  crumpleCrack=smoothstep(.55,1.,crumpleAmt)*crumpleBuckle*smoothstep(.91,.99,crumpleFold)*crumpleFade*crumpleFade;
  crumpleCavity=crumpleAmt*smoothstep(.55,1.,1.-crumpleFold)*.12;
}
vec2 crumpleSlope=vec2(dFdx(crumpleHeight),dFdy(crumpleHeight));
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.34,.35,.35),crumpleCrack*.7);
diffuseColor.rgb*=1.-crumpleCavity;
// Rain deepens the paint, darkens the dirt on it, and close up stands in beads on the panels facing the sky.
#ifdef FLAT_SHADED
float wetSky=0.;
#else
float wetSky=rainWet*smoothstep(.2,.75,dot(normalize(vNormal),normalize((viewMatrix*vec4(0.,1.,0.,0.)).xyz)));
#endif
vec3 beadCell=vBodyPosition*${WET_PAINT.bead}.,beadId=floor(beadCell);vec2 beadAt=fract(beadCell.xz)-.5-(vec2(bodyNoise(beadId+7.),bodyNoise(beadId+13.))-.5)*.5;
float beadSize=.14+.13*bodyNoise(beadId+21.),bead=wetSky*step(.58,bodyNoise(beadId))*smoothstep(beadSize,beadSize*.45,length(beadAt))*(1.-smoothstep(.35,.9,length(fwidth(beadCell))))*(1.-crumpleCrack);
float wetLuma=dot(diffuseColor.rgb,vec3(.299,.587,.114));
diffuseColor.rgb=max(mix(vec3(wetLuma),diffuseColor.rgb,1.+rainWet*${WET_PAINT.saturate}),0.);
diffuseColor.rgb*=1.-rainWet*(${WET_PAINT.darken}+${WET_PAINT.mud}*dust);
// A bead catches the grey sky: a pale speck on the paint.
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.62,.66,.7),bead*.35);
`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor=clamp(mix(roughnessFactor,.88,dust)+scratch*.35+grain*.016,.04,.98);
roughnessFactor=mix(roughnessFactor,.43,bareMetal);
roughnessFactor=clamp(roughnessFactor+crumpleAmt*.12+crumpleCrack*.35,.04,.98);
roughnessFactor=mix(roughnessFactor,.03,bead);
`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>
metalnessFactor=mix(metalnessFactor,.02,dust);
metalnessFactor=mix(metalnessFactor,.95,bareMetal);
metalnessFactor=mix(metalnessFactor,.6,crumpleCrack);
`)
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\nnormal=crumpleBump(-vViewPosition,normal,crumpleSlope,faceDirection);')
      .replace('#include <clearcoat_normal_fragment_begin>', '#include <clearcoat_normal_fragment_begin>\n#ifdef USE_CLEARCOAT\nclearcoatNormal=crumpleBump(-vViewPosition,clearcoatNormal,crumpleSlope,faceDirection);\n#endif')
      .replace('#include <lights_physical_fragment>', `#include <lights_physical_fragment>
#ifdef USE_CLEARCOAT
material.clearcoat *= 1.-clamp(crumpleCrack+crumpleAmt*.35,0.,1.);
#endif
// Rain films every panel, the ones facing the sky most: glossier, under a sharp clearcoat (cracked paint stays dull).
float wetTop=rainWet*mix(.5,1.,smoothstep(.2,.75,dot(normal,normalize((viewMatrix*vec4(0.,1.,0.,0.)).xyz))))*(1.-crumpleCrack);
material.roughness=mix(material.roughness,max(.05,material.roughness*${WET_PAINT.film}),wetTop);
#ifdef USE_CLEARCOAT
material.clearcoat=mix(material.clearcoat,1.,wetTop*${WET_PAINT.coat});material.clearcoatRoughness=mix(material.clearcoatRoughness,.02,wetTop);
#endif`);
    if (contactWear) {
      shader.vertexShader=shader.vertexShader
        .replace('attribute vec2 impactWear;', 'attribute vec2 impactWear; attribute vec3 restPosition; attribute vec3 impactAxis; varying vec3 vImpactAxis;')
        .replace('vBodyPosition = position;', 'vBodyPosition = restPosition; vImpactAxis = impactAxis;');
      shader.fragmentShader=shader.fragmentShader
        .replace('varying vec3 vBodyPosition;', 'varying vec3 vImpactAxis; varying vec3 vBodyPosition;')
        .replace('float grain=bodyNoise(vBodyPosition*340.);', 'float grain=mix(bodyNoise(vBodyPosition*340.),.5,clamp(length(fwidth(vBodyPosition))*340.,0.,1.));')
        .replace('float scrapeLines=smoothstep(.75,.96,abs(sin(vBodyPosition.y*235.+vBodyPosition.z*29.+sin(vBodyPosition.x*12.))));', `
float across=dot(vBodyPosition,vImpactAxis)*310.;
float alias=clamp(fwidth(across),0.,1.);
float scrapeLines=mix(smoothstep(.65,.92,abs(sin(across+bodySilt(vBodyPosition*21.)*2.))),.24,alias);`)
        .replace('#include <lights_physical_fragment>', '#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat *= 1.-clamp(bareMetal+scratch*.5+dust*.7,0.,1.);\n#endif');
    }
  };
  material.customProgramCacheKey = () => contactWear ? 'quarry-contact-paint-crumple-v1' : 'quarry-layered-paint-crumple-v1';
}

/** Rain on glass (offline rain, CAR_WET): beads of water stand on every window, in GLASS_RAIN.cells cells a metre, on all but
 * GLASS_RAIN.keep of them; working wipers keep a windscreen clear (GlassState.wiped 1 leaves only GLASS_RAIN.wipe fewer). */
export const GLASS_RAIN={cells:40,keep:.45,wipe:.85} as const;
export type GlassState = { damage: { value: number }; impact: { value: T.Vector3 }; axes: { value: T.Vector3 }; smoke: { value: number }; wiped: { value: number }; };
export function finishGlass(material: T.MeshPhysicalMaterial, geometry: T.BufferGeometry): GlassState {
  geometry.computeBoundingBox();
  const size = geometry.boundingBox!.getSize(new T.Vector3());
  const state: GlassState = {
    damage: { value: 0 }, impact: { value: geometry.boundingBox!.getCenter(new T.Vector3()) },
    axes: { value: new T.Vector3(size.x < size.z ? 0 : 1, size.x < size.z || size.y > size.z ? 1 : 0, 0) },
    smoke: { value: 0 },
    wiped: { value: 0 },
  };
  material.userData.glassState = state;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.glassDamage = state.damage;
    shader.uniforms.glassImpact = state.impact;
    shader.uniforms.glassAxes = state.axes;
    shader.uniforms.glassSmoke = state.smoke;
    shader.uniforms.glassWiped = state.wiped;
    shader.uniforms.rainWet = CAR_WET;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGlassPosition; varying vec3 vGlassNormal;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGlassPosition=position; vGlassNormal=normal;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vGlassPosition; varying vec3 vGlassNormal; uniform float glassDamage; uniform vec3 glassImpact; uniform vec3 glassAxes; uniform float glassSmoke; uniform float glassWiped; uniform float rainWet;')
      .replace('#include <color_fragment>', `#include <color_fragment>
vec3 d=vGlassPosition-glassImpact;
vec2 p=vec2(mix(d.z,d.x,glassAxes.x),mix(d.y,d.z,1.-glassAxes.y));
float radius=length(p); float angle=atan(p.y,p.x);
float branches=abs(sin(angle*10.5+sin(radius*19.)*.22));
float rings=abs(sin(radius*71.+sin(angle*9.)*.6));
float crack=(1.-smoothstep(.018,.052,branches))*(1.-smoothstep(.12,.86,radius));
crack=max(crack,(1.-smoothstep(.018,.065,rings))*.52*(1.-smoothstep(.04,.34,radius)));
crack*=smoothstep(0.,.16,glassDamage);
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.66,.75,.75),crack);
diffuseColor.a=clamp(diffuseColor.a+crack*.6+glassDamage*.1,0.,.94);
// A cabin full of smoke (a burning car) shows dark and murky through the glass, thicker low down where it lies.
float murk=glassSmoke*(.8+.2*smoothstep(.4,-.2,vGlassPosition.y));
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.11,.1,.09),murk*.85);
diffuseColor.a=clamp(diffuseColor.a+murk*.6,0.,.97);
// Rain stands in beads on the glass (fewer where wipers keep it clear), faded once a bead is too small on screen to draw.
// Laid out on whichever plane the pane faces most, so the beads stay round on every window.
vec3 rainFace=abs(vGlassNormal);vec2 rainAt=(rainFace.x>rainFace.y&&rainFace.x>rainFace.z?vGlassPosition.zy:rainFace.y>rainFace.z?vGlassPosition.xz:vGlassPosition.xy)*${GLASS_RAIN.cells}.;
vec2 rainId=floor(rainAt),rainIn=fract(rainAt)-.5-(vec2(fract(sin(dot(rainId,vec2(12.9898,78.233)))*43758.5453),fract(sin(dot(rainId,vec2(39.35,11.13)))*24634.63))-.5)*.5;
float rainKeep=fract(sin(dot(rainId,vec2(7.13,157.1)))*9837.31),rainSize=.13+.14*fract(rainKeep*13.7);
float glassBead=rainWet*step(${GLASS_RAIN.keep}+${1-GLASS_RAIN.keep}*glassWiped*${GLASS_RAIN.wipe},rainKeep)*smoothstep(rainSize,rainSize*.45,length(rainIn))*(1.-smoothstep(.35,.9,length(fwidth(rainAt))));
diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.74,.79,.82),glassBead*.55);
diffuseColor.a=clamp(diffuseColor.a+glassBead*.35,0.,.97);
`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+crack*.72+glassDamage*.1,0.,1.);');
  };
  material.customProgramCacheKey = () => 'quarry-laminated-glass-v2';
  return state;
}
