import {landMaps,coastalLighting} from './land-materials.js';
// Lighting remains live; world-space wear and joints survive merged geometry.
export function dressMaterial(mat,style){
 const previous=mat.onBeforeCompile,previousKey=mat.customProgramCacheKey();
 mat.onBeforeCompile=s=>{previous.call(mat,s);Object.assign(s.uniforms,{venueGrain:{value:landMaps.rock.diff},venueStorm:coastalLighting.storm});
 s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 venueP;varying vec3 venueN;').replace('#include <project_vertex>',`#include <project_vertex>
 vec4 vp=vec4(transformed,1.);vec3 vn=objectNormal;
 #ifdef USE_INSTANCING
 vp=instanceMatrix*vp;vn=mat3(instanceMatrix)*vn;
 #endif
 venueP=(modelMatrix*vp).xyz;venueN=normalize(mat3(modelMatrix)*vn);`);
 s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
 varying vec3 venueP;varying vec3 venueN;uniform sampler2D venueGrain;uniform float venueStorm;
 float venueHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float venueNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(venueHash(i),venueHash(i+vec2(1.,0.)),f.x),mix(venueHash(i+vec2(0.,1.)),venueHash(i+1.),f.x),f.y);}
 `).replace('#include <color_fragment>',`#include <color_fragment>
 vec3 vdAn=abs(normalize(venueN));vec2 vdWall=vdAn.y>max(vdAn.x,vdAn.z)?venueP.xz:vec2(vdAn.x>vdAn.z?venueP.z:venueP.x,venueP.y);
 float vdGrain=texture2D(venueGrain,vdWall*.31).r;
 float vdStreak=venueNoise(vec2(vdWall.x*1.7,vdWall.y*.065));
 float vdDamp=1.-smoothstep(.1,2.6,venueP.y);
 diffuseColor.rgb*=.82+vdGrain*.32;
 diffuseColor.rgb*=1.-(vdStreak*.12+vdDamp*.16+venueStorm*.045);
 ${style==='concrete'?`
 vec2 vdJoints=abs(fract(vdWall/vec2(6.,3.5))-.5);
 float vdJoint=smoothstep(.492,.498,max(vdJoints.x,vdJoints.y));
 diffuseColor.rgb*=1.-vdJoint*.24;
 `:style==='masonry'?`
 vec2 vdCell=vec2(vdWall.x/1.7+mod(floor(vdWall.y/.72),2.)*.5,vdWall.y/.72);
 vec2 vdEdge=min(fract(vdCell),1.-fract(vdCell));float vdMortar=1.-smoothstep(.012,.045,min(vdEdge.x,vdEdge.y));
 float vdBlockTone=venueHash(floor(vdCell));
 diffuseColor.rgb*=.77+vdBlockTone*.38;diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.13,.145,.12),vdMortar*.65*(1.-vdAn.y));
 diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.48,.68,.32),vdDamp*vdStreak*.48);
 `:style==='metal'?`
 float vdRust=smoothstep(.61,.80,vdStreak+vdGrain*.2)*(.25+.75*vdDamp);
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.16,.058,.023),vdRust*.5);
 float vdSeam=pow(.5+.5*cos(vdWall.x*26.),12.);diffuseColor.rgb*=1.-vdSeam*.065;
 `:style==='ice'?`
 float vdLayer=sin(venueP.y*1.9+venueNoise(venueP.xz*.05)*4.);
 float vdFracture=pow(max(0.,sin(vdWall.x*.7+vdWall.y*.9+vdStreak*3.)),24.);
 diffuseColor.rgb=mix(vec3(.19,.40,.49),vec3(.67,.80,.82),.55+vdLayer*.12+vdGrain*.16);
 float vdSnow=smoothstep(.28,.82,normalize(venueN).y);
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.84,.91,.94)*(.9+vdGrain*.12),vdSnow);diffuseColor.rgb*=1.-vdFracture*.18*(1.-vdSnow);
 `:style==='facade'?`
 vec2 vdPane=fract(vdWall/vec2(3.3,3.6));float vdWindow=smoothstep(.15,.19,vdPane.x)*(1.-smoothstep(.78,.82,vdPane.x))*smoothstep(.22,.26,vdPane.y)*(1.-smoothstep(.78,.82,vdPane.y))*(1.-vdAn.y);
 float vdLit=step(.43,venueHash(floor(vdWall/vec2(3.3,3.6))));
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.035,.065,.08),vdWindow);
 `:''}
 `);
 if(style==='facade')s.fragmentShader=s.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
 totalEmissiveRadiance+=vec3(.72,.48,.20)*vdWindow*vdLit*.7;`);
 };mat.customProgramCacheKey=()=> previousKey+'-venue-dressing-'+style+'-v2';return mat;
}
