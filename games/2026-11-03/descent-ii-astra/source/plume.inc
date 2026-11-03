/* View-facing layers from the full Overload flipbooks, in the native 3D pass. */
static GLuint plumeMaps[4],plumeProgram;static int plumeFailed;
static void plume_program(void){
    const char *vs="varying mediump vec4 tex;varying mediump vec4 tint;void main(){gl_Position=ftransform();tex=gl_MultiTexCoord0;tint=gl_Color;}";
    const char *fs="precision mediump float;uniform sampler2D atlas;varying mediump vec4 tex;varying mediump vec4 tint;void main(){vec4 a=texture2D(atlas,tex.xy);float edge=1.-smoothstep(.67,1.,max(abs(tex.z),abs(tex.w)));float opacity=a.a*tint.a*edge;if(opacity<.006)discard;vec3 fire=a.rgb*tint.rgb;gl_FragColor=vec4(fire/(1.+.27*fire),opacity);}";
    GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){plumeFailed=1;return;}
    plumeProgram=glCreateProgram();glAttachShader(plumeProgram,v);glAttachShader(plumeProgram,f);glLinkProgram(plumeProgram);glDeleteShader(v);glDeleteShader(f);
    GLint ok;glGetProgramiv(plumeProgram,GL_LINK_STATUS,&ok);if(!ok)plumeFailed=1;
}
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
static void plume_card(int sheet,int cell,float x,float y,float z,float r,float rotation,float cr,float cg,float cb,float alpha){
    char key[20];snprintf(key,sizeof key,"plume%d.png",sheet);if(!refit_png(key,&plumeMaps[sheet],GL_CLAMP_TO_EDGE))return;
    float co=cosf(rotation),si=sinf(rotation),sx=f2fl(Matrix_scale.x),sy=f2fl(Matrix_scale.y);
    const float corners[4][2]={{-1,1},{-1,-1},{1,-1},{1,1}};
    float p[12],t[16],c[16];cell=cell<0?0:cell>63?63:cell;
    for(int i=0;i<4;i++){
        float a=corners[i][0],b=corners[i][1];p[i*3]=x+r*(a*co-b*si)*sx;p[i*3+1]=y+r*(a*si+b*co)*sy;p[i*3+2]=-z;
        t[i*4]=((cell%8)+.5f+.49f*a)/8.f;t[i*4+1]=((cell/8)+.5f-.49f*b)/8.f;
        t[i*4+2]=a;t[i*4+3]=b;c[i*4]=cr;c[i*4+1]=cg;c[i*4+2]=cb;c[i*4+3]=alpha;
    }
    glVertexPointer(3,GL_FLOAT,0,p);glTexCoordPointer(4,GL_FLOAT,0,t);glColorPointer(4,GL_FLOAT,0,c);glDrawArrays(GL_TRIANGLE_FAN,0,4);
}
static void astra_fire_layers(vms_vector *where,fix radius,float age,unsigned seed){
    if(age<0||age>=1||radius<F1_0/4||plumeFailed)return;
    g3s_point p;g3_rotate_point(&p,where);
    float x=f2fl(p.p3_x),y=f2fl(p.p3_y),z=f2fl(p.p3_z),r=f2fl(radius);
    if(z<.5f||z>350||r/z<.003)return;
    int oldfade=grd_curcanv->cv_fade_level,oldblend=grd_curcanv->cv_blend_func;
    GLboolean cull=glIsEnabled(GL_CULL_FACE);glDisable(GL_CULL_FACE);glDepthMask(GL_FALSE);
    OGL_ENABLE(TEXTURE_2D);glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);glEnableClientState(GL_COLOR_ARRAY);
    if(!plumeProgram)plume_program();glUseProgram(plumeProgram);
    float a=(seed%997)*.0063f,g=sin(age*3.1415926f),parity=seed&1?1:-1;
    gr_settransblend(GR_FADE_OFF,GR_BLEND_NORMAL);
    if(age>.18f)plume_card(3,4+(int)(age*52),x,y+.24f*r*age,z+.16f*r,r*(1.35f+1.1f*age),a,.27f,.30f,.36f,.47f*g);
    plume_card(2,3+(int)(age*55),x-.17f*r*parity,y+.25f*r*age,z,r*(1.2f+.63f*age),a*.19f,1,.90f,.73f,.82f);
    gr_settransblend(GR_FADE_OFF,GR_BLEND_ADDITIVE_A);
    for(int i=0;i<3;i++){
        float ang=a+i*2.094f,dist=r*(.14f+.67f*age);
        int cell=7+(int)(age*(47-i*3))+i*2;
        plume_card(i%2,cell,x+cosf(ang)*dist,y+sinf(ang)*dist,z-.10f*r,r*(1.06f+.34f*g),ang*.53f,1.13f,.84f,.61f,.69f);
    }
    if(age<.26f)plume_card(0,15+(int)(age*35),x,y,z-.14f*r,r*(1.7f-age*1.9f),a,1.45f,1.30f,1.02f,1-age/.26f);
    glDisableClientState(GL_TEXTURE_COORD_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);
    if(cull)glEnable(GL_CULL_FACE);glUseProgram(0);glDepthMask(GL_TRUE);gr_settransblend(oldfade,oldblend);
    EM_ASM(Module.layeredBlasts=(Module.layeredBlasts||0)+1);
}

