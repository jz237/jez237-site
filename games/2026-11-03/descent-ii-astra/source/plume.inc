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
/* A periodic 3D turbulence field stored as a strip of filtered Z slices for WebGL 1.
 * Color detail is sampled from three axes of the installed Overload fire texture. */
extern vms_matrix Unscaled_matrix;
static GLuint cloudTexture, cloudProgram;
static GLint cloudPhase,cloudStyle,cloudTint;
extern const float *astra_effect_color(int);
static int cloudFailed;
enum { CLOUD_SIDE = 32, CLOUD_ROWS = 4, CLOUD_COLS = 8, CLOUD_PLANES = 24 };

static unsigned cloud_hash(int x,int y,int z) {
    unsigned h=(unsigned)x*374761393u+(unsigned)y*668265263u+(unsigned)z*2246822519u;
    h=(h^(h>>13))*1274126177u;
    return h^(h>>16);
}
static float cloud_noise(float x,float y,float z,int repeat) {
    int ix=(int)floorf(x),iy=(int)floorf(y),iz=(int)floorf(z);
    float fx=x-ix,fy=y-iy,fz=z-iz,sum=0;
    fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);fz=fz*fz*(3-2*fz);
    for(int k=0;k<2;k++)for(int j=0;j<2;j++)for(int i=0;i<2;i++){
        unsigned h=cloud_hash((ix+i)&(repeat-1),(iy+j)&(repeat-1),(iz+k)&(repeat-1));
        sum+=(h>>8)*(1.f/16777216.f)*(i?fx:1-fx)*(j?fy:1-fy)*(k?fz:1-fz);
    }
    return sum;
}
static float cloud_detail(png_data *im,float u,float v,int cell) {
    if(!im->data || im->channels<3)return .5f;
    int x=(int)((cell%8+.5f-.31f*cosf(6.283185f*u))*im->width/8);
    int y=(int)((cell/8+.5f-.31f*cosf(6.283185f*v))*im->height/8);
    const unsigned char *pixel=(const unsigned char*)im->data+(y*im->width+x)*im->channels;
    return (.45f*pixel[0]+.4f*pixel[1]+.15f*pixel[2])/255.f;
}
static void cloud_init(void) {
    const char *vs="varying highp vec3 local;void main(){gl_Position=ftransform();local=gl_MultiTexCoord0.xyz;}";
    const char *fs=
        "precision highp float;uniform sampler2D field;uniform vec4 phase;uniform vec3 style,tint;varying highp vec3 local;"
        "vec2 tile(float z){return vec2(mod(z,8.),floor(z/8.))*32.;}"
        "vec3 noise3(vec3 p){vec3 q=fract(p)*vec3(31.,31.,32.);float z=floor(q.z);vec2 xy=q.xy+.5;"
        "vec2 scale=vec2(1./256.,1./128.);return mix(texture2D(field,(tile(z)+xy)*scale).rgb,"
        "texture2D(field,(tile(mod(z+1.,32.))+xy)*scale).rgb,fract(q.z));}"
        "void main(){float age=phase.x;float kind=style.x;vec3 p=local;float cs=cos(style.y),sn=sin(style.y);"
        "p.xz=mat2(cs,sn,-sn,cs)*p.xz;cs=cos(style.z);sn=sin(style.z);p.xy=mat2(cs,sn,-sn,cs)*p.xy;"
        "p.y-=.15*age;"
        "float rad=length(p);if(rad>1.08)discard;"
        "vec3 offset=vec3(phase.y,phase.z,.37*phase.y);vec3 drift=vec3(.07,-.19,.12)*age;"
        "vec3 coarse=noise3(p*.48+offset+drift);"
        "vec3 fine=noise3(p*1.37+offset.yzx+drift*1.7+(coarse.r-.5)*.20);"
        "vec3 q=p+.32*(vec3(coarse.rg,fine.r)-.5);"
        "vec3 l=q;float shell=length(q)-.52;"
        "vec3 t=q-vec3(.40,.23,.08);float k=length(t)-.40;if(k<shell){shell=k;l=t;}"
        "t=q-vec3(-.28,.34,-.13);k=length(t)-.38;if(k<shell){shell=k;l=t;}"
        "t=q-vec3(-.26,-.19,.37);k=length(t)-.35;if(k<shell){shell=k;l=t;}"
        "t=q-vec3(.12,-.25,-.33);k=length(t)-.39;if(k<shell){shell=k;l=t;}"
        "if(kind==1.){l=q*vec3(1.9,.76,1.8);l.x+=.27*sin(8.*q.y+age*5.);shell=length(l)-.57;}"
        "else if(kind==2.){l=vec3(length(q.xz)-(.18+.46*age),q.y*2.,0.);shell=length(l)-(.29-.13*age);}"
        "else if(kind==3.){l=q;l.y-=.26*age;shell=min(length(l*vec3(1.,1.36,1.))-.63,length((q+vec3(0,.28,0))*vec3(2.5,1.1,2.5))-.41);}"
        "else if(kind==4.){l=q;l.x-=sign(l.x)*(.16+.31*age);shell=length(l*vec3(1.,1.48,1.38))-.45;}"
        "else if(kind==5.){l=q;l.xz*=1.2+.48*sin(l.y*8.-age*6.);shell=length(l*vec3(1.,.80,1.))-.56;}"
        "else if(kind==6.){l=q;shell=min(shell,length(l)-(.29+.42*abs(sin(age*6.7))));}"
        "else if(kind==7.){l=q;l.xz=mat2(cos(q.y*4.),sin(q.y*4.),-sin(q.y*4.),cos(q.y*4.))*l.xz;"
        "l.x-=sign(l.x)*.31;shell=length(l*vec3(1.55,.85,1.6))-.43;}"
        "float folds=.26*(coarse.g-.50)+.21*(fine.r-.50)+.10*(fine.g-.5);"
        "shell+=folds;float d=rad+folds;"
        "float fill=1.-smoothstep(-.045,.12,shell);if(fill<.012)discard;"
        "float curl=1.-abs(2.*fine.g-1.);"
        "float side=dot(normalize(l+vec3(.0001)),vec3(-.42,.72,.55));"
        "float heat=clamp(.95-.49*d-.88*age-.64*shell+.94*(coarse.r-.5)+.88*(fine.r-.5)"
        "+.28*(fine.b-.5)+.19*curl+.18*side,0.,1.);"
        "vec3 smoke=mix(vec3(.052,.043,.044),vec3(.35,.32,.30),clamp(.40+.48*side+.74*(fine.r-.5),0.,1.));"
        "vec3 ember=mix(vec3(.40,.051,.012),vec3(1.,.32,.038),smoothstep(.29,.68,heat));"
        "ember=mix(ember,vec3(1.,.89,.49),smoothstep(.61,.86,heat));"
        "ember=mix(ember,vec3(1.,.98,.86),smoothstep(.84,.98,heat));"
        "ember=mix(tint*.34,tint,smoothstep(.28,.64,heat));ember=mix(ember,vec3(1.,.97,.86),smoothstep(.62,.97,heat));vec3 rgb=mix(smoke,ember,smoothstep(.29,.52,heat));"
        "float opacity=1.-exp(-phase.w*fill*(1.-smoothstep(.65,1.,age))*(.88+.7*fine.r));"
        "gl_FragColor=vec4(rgb,opacity);}";
    GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);
    if(!v||!f){cloudFailed=1;return;}
    cloudProgram=glCreateProgram();glAttachShader(cloudProgram,v);glAttachShader(cloudProgram,f);
    glLinkProgram(cloudProgram);glDeleteShader(v);glDeleteShader(f);
    GLint linked;glGetProgramiv(cloudProgram,GL_LINK_STATUS,&linked);
    if(!linked){cloudFailed=1;return;}
    cloudStyle=glGetUniformLocation(cloudProgram,"style");cloudTint=glGetUniformLocation(cloudProgram,"tint");
    cloudPhase=glGetUniformLocation(cloudProgram,"phase");
    png_data fire={0};if(!read_png("plume0.png",&fire))fire.data=NULL;
    const int width=CLOUD_SIDE*CLOUD_COLS,height=CLOUD_SIDE*CLOUD_ROWS;
    unsigned char *pixels=malloc(width*height*3);
    if(!pixels){free(fire.data);cloudFailed=1;return;}
    for(int k=0;k<CLOUD_SIDE;k++)for(int j=0;j<CLOUD_SIDE;j++)for(int i=0;i<CLOUD_SIDE;i++){
        float x=i/(CLOUD_SIDE-1.f),y=j/(CLOUD_SIDE-1.f),z=k/(float)CLOUD_SIDE;
        float low=cloud_noise(x*4,y*4,z*4,4),mid=cloud_noise(x*8,y*8,z*8,8);
        float detail=cloud_noise(x*16,y*16,z*16,16);
        int index=3*((k/CLOUD_COLS*CLOUD_SIDE+j)*width+k%CLOUD_COLS*CLOUD_SIDE+i);
        pixels[index]=(unsigned char)(255*(.65f*low+.35f*mid));
        pixels[index+1]=(unsigned char)(255*(.68f*mid+.32f*detail));
        pixels[index+2]=(unsigned char)(85*(cloud_detail(&fire,x,y,18)+cloud_detail(&fire,y,z,25)+cloud_detail(&fire,z,x,35)));
    }
    free(fire.data);glGenTextures(1,&cloudTexture);glBindTexture(GL_TEXTURE_2D,cloudTexture);
    glTexImage2D(GL_TEXTURE_2D,0,GL_RGB,width,height,0,GL_RGB,GL_UNSIGNED_BYTE,pixels);free(pixels);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE);
}
static int astra_fire_volume(const g3s_point *center,float radius,float age,unsigned seed,int kind) {
    if(!cloudProgram && !cloudFailed)cloud_init();
    if(cloudFailed)return 0;
    float x=f2fl(center->p3_x),y=f2fl(center->p3_y),z=f2fl(center->p3_z);
    static const float speed[]={3,5,2,2.5f,4,2,3.8f,3};
    float extent=radius*(.32f+1.44f*(1-powf(1-age,speed[kind])));
    float sx=extent*f2fl(Matrix_scale.x),sy=extent*f2fl(Matrix_scale.y),sz=extent*f2fl(Matrix_scale.z);
    int planes=(extent/fmaxf(1,z)>.06f)?CLOUD_PLANES:14;
    float positions[CLOUD_PLANES*18],local[CLOUD_PLANES*18];int n=0;
    const int corners[6][2]={{-1,-1},{1,-1},{1,1},{-1,-1},{1,1},{-1,1}};
    const vms_matrix *m=&Unscaled_matrix;
    for(int k=0;k<planes;k++){
        float depth=1.15f*(1-2*(k+.5f)/planes);
        if(z+depth*sz<=.1f)continue;
        for(int i=0;i<6;i++){
            float u=1.15f*corners[i][0],v=1.15f*corners[i][1];
            positions[n]=x+u*sx;positions[n+1]=y+v*sy;positions[n+2]=-z-depth*sz;
            local[n]=u*f2fl(m->rvec.x)+v*f2fl(m->uvec.x)+depth*f2fl(m->fvec.x);
            local[n+1]=u*f2fl(m->rvec.y)+v*f2fl(m->uvec.y)+depth*f2fl(m->fvec.y);
            local[n+2]=u*f2fl(m->rvec.z)+v*f2fl(m->uvec.z)+depth*f2fl(m->fvec.z);
            n+=3;
        }
    }
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;
    GLboolean cull=glIsEnabled(GL_CULL_FACE);glDisable(GL_CULL_FACE);glDepthMask(GL_FALSE);
    gr_settransblend(GR_FADE_OFF,GR_BLEND_NORMAL);OGL_ENABLE(TEXTURE_2D);
    glBindTexture(GL_TEXTURE_2D,cloudTexture);glUseProgram(cloudProgram);
    unsigned h=cloud_hash(seed,43,19);
    glUniform3f(cloudStyle,kind,(h&255)*.02454f,((h>>8)&255)*.02454f);glUniform3fv(cloudTint,1,astra_effect_color(kind));
    glUniform4f(cloudPhase,age,(h&65535)/65536.f,(h>>16)/65536.f,13.8f/planes);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    glVertexPointer(3,GL_FLOAT,0,positions);glTexCoordPointer(3,GL_FLOAT,0,local);glDrawArrays(GL_TRIANGLES,0,n/3);
    glDisableClientState(GL_TEXTURE_COORD_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);
    glUseProgram(0);glDepthMask(GL_TRUE);if(cull)glEnable(GL_CULL_FACE);gr_settransblend(fade,blend);
    EM_ASM(Module.volumeBlasts=(Module.volumeBlasts||0)+1;Module.blastStyleMask=(Module.blastStyleMask||0)|(1<<$0);,kind);
    return 1;
}
