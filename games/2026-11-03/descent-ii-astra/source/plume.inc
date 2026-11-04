static int refit_png(const char *name,GLuint *id,int wrap){
    if(*id){glBindTexture(GL_TEXTURE_2D,*id);return 1;}
    png_data im;if(!read_png(name,&im))return 0;
    GLenum fmt=im.channels==4?GL_RGBA:GL_RGB;
    glGenTextures(1,id);glBindTexture(GL_TEXTURE_2D,*id);
    glTexImage2D(GL_TEXTURE_2D,0,fmt,im.width,im.height,0,fmt,GL_UNSIGNED_BYTE,im.data);free(im.data);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,wrap);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,wrap);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR_MIPMAP_LINEAR);
    glGenerateMipmap(GL_TEXTURE_2D);return 1;
}
/* Four optical samples in each depth-tested slab. The baked density, surface
 * normal and fuel are sampled in mine coordinates, never in screen space. */
extern vms_matrix Unscaled_matrix;
static GLuint ashProgram,ashTexture;
static GLint ashBasis,ashScale,ashTime,ashTint;
static int ashFailed;
static unsigned cloud_hash(unsigned a,unsigned b,unsigned c)
{
    unsigned h=a*374761393u+b*668265263u+c*2246822519u;
    h=(h^(h>>13))*1274126177u;return h^(h>>16);
}
static float pyro_random(unsigned seed,int index,int channel)
{
    return (cloud_hash(seed,index,channel)>>8)*(1.f/16777216.f);
}
static float pyro_ramp(float lo,float hi,float x)
{
    float t=fminf(1,fmaxf(0,(x-lo)/(hi-lo)));return t*t*(3-2*t);
}
int astra_pyro_ready(void)
{
    if(ashTexture||ashFailed)return ashTexture!=0;
    const char *vs=
      "precision highp float;uniform mat3 basis;uniform vec3 scale;uniform float elapsed;"
      "varying highp vec3 coord,rayStep,lamp;varying highp vec4 state;"
      "void main(){gl_Position=ftransform();state=gl_Color;"
      "float a=state.g*6.283+elapsed*(state.g-.5)*.86,b=state.g*13.47;"
      "float c=cos(a),s=sin(a),e=cos(b),f=sin(b);"
      "mat3 turn=mat3(c,s,0.,-s,c,0.,0.,0.,1.)*mat3(e,0.,f,0.,1.,0.,-f,0.,e)*basis;"
      "coord=turn*gl_MultiTexCoord0.xyz;vec3 p=gl_Vertex.xyz/scale;"
      "rayStep=turn*vec3(p.xy/max(.10,-p.z),1.)*gl_MultiTexCoord0.w;"
      "lamp=normalize(turn*gl_Normal+vec3(.00001));}";
    const char *fs=
      "precision highp float;uniform sampler2D volume;uniform vec3 tint;"
      "varying highp vec3 coord,rayStep,lamp;varying highp vec4 state;"
      "vec2 tile(float z){return vec2(mod(z,8.),floor(z/8.))*112.;}"
      "vec4 field(vec3 p){vec3 q=clamp(p*.5+.5,0.,1.)*111.;float z=floor(q.z);"
      "vec2 f=q.xy+.5;vec2 inv=vec2(1./896.,1./1568.);"
      "return mix(texture2D(volume,(tile(z)+f)*inv),texture2D(volume,(tile(min(111.,z+1.))+f)*inv),fract(q.z));}"
      "vec3 normalAt(vec2 e){vec2 n=e*2.-1.;vec3 d=vec3(n,1.-abs(n.x)-abs(n.y));"
      "if(d.z<0.)d.xy=(1.-abs(d.yx))*sign(d.xy);return normalize(d+vec3(.00001));}"
      "void main(){if(dot(coord,coord)>1.44)discard;vec3 sum=vec3(0.);float trans=1.;"
      "float optical=state.a*length(rayStep)*2.45;"
      "for(int i=0;i<4;i++){vec3 p=coord+(float(i)*.25-.375)*rayStep;vec4 v=field(p);"
      "if(v.r>.015){vec3 n=normalAt(v.gb);float lit=dot(n,lamp);"
      "float fuel=state.r+(1.12*v.a-.60)+.23*lit-.16*length(p);"
      "float through=pow(max(0.,dot(normalize(rayStep),lamp)),2.5);"
      "fuel+=.24*through*smoothstep(.09,.49,state.r)*(1.-smoothstep(.63,.92,state.r));"
      "vec3 soot=mix(vec3(.035,.035,.040),vec3(.26,.245,.233),clamp(.42+.36*n.y+.19*lit+.25*v.a,0.,1.));"
      "soot+=vec3(.19,.057,.012)*max(0.,lit)*smoothstep(.06,.54,state.r);"
      "vec3 red=mix(vec3(.22,.018,.004),vec3(.98,.158,.009),smoothstep(.28,.53,fuel));"
      "vec3 flame=mix(red,vec3(1.,.62,.042),smoothstep(.48,.68,fuel));"
      "flame=mix(flame,vec3(1.,.90,.34),smoothstep(.60,.84,fuel));"
      "flame=mix(flame,vec3(1.,.994,.87),smoothstep(.82,1.00,fuel));"
      "flame=mix(flame,tint*(.4+.60*smoothstep(.3,.76,fuel)),state.b*(1.-smoothstep(.55,.96,fuel)));"
      "vec3 rgb=mix(soot,flame,smoothstep(.20,.43,fuel));"
      "float alpha=1.-exp(-v.r*optical);sum+=trans*alpha*rgb;trans*=1.-alpha;}}"
      "float a=1.-trans;if(a<.003)discard;gl_FragColor=vec4(sum/a,a);}";
    GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);
    if(!v||!f){ashFailed=1;return 0;}
    ashProgram=glCreateProgram();glAttachShader(ashProgram,v);glAttachShader(ashProgram,f);
    glLinkProgram(ashProgram);glDeleteShader(v);glDeleteShader(f);
    GLint ok;glGetProgramiv(ashProgram,GL_LINK_STATUS,&ok);
    if(!ok){char log[512]={0};glGetProgramInfoLog(ashProgram,sizeof log,NULL,log);fprintf(stderr,"Astra plume link: %s\n",log);ashFailed=1;return 0;}
    ashBasis=glGetUniformLocation(ashProgram,"basis");ashScale=glGetUniformLocation(ashProgram,"scale");
    ashTime=glGetUniformLocation(ashProgram,"elapsed");ashTint=glGetUniformLocation(ashProgram,"tint");
    png_data im={0};if(!read_png("pyro-field.png",&im)){ashFailed=1;return 0;}
    if(im.width!=896 || im.height!=1568 || im.channels!=4){free(im.data);ashFailed=1;return 0;}
    glGenTextures(1,&ashTexture);glBindTexture(GL_TEXTURE_2D,ashTexture);
    glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,im.width,im.height,0,GL_RGBA,GL_UNSIGNED_BYTE,im.data);free(im.data);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE);
    return 1;
}
