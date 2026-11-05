/* Materials are shared across palette slots. One tangent map per source, on unit 1. */
extern float astra_lamp[4],astra_flash[4];
extern int astra_drawing_mine,astra_refinement;
static float astra_surface[4];
static int astra_earth_material;
static GLuint astra_earth_colors[256];
static GLuint astra_normals[256],astra_program;
static GLint astra_tangents,astra_fixture,astra_moving;
static int astra_gpu_failed,astra_shaded;
static int astra_material_id(const char *name)
{
    return EM_ASM_INT({
        var label=window.astraAliases[UTF8ToString($0)];
        return label && /^m[0-9]+/.test(label) ? 1+parseInt(label.slice(1),10) : 0;
    },name);
}
static GLuint astra_compile(GLenum type,const char *code)
{
    GLuint shader=glCreateShader(type);
    glShaderSource(shader,1,&code,NULL);glCompileShader(shader);
    GLint ok=0;glGetShaderiv(shader,GL_COMPILE_STATUS,&ok);
    if(!ok){
        char log[1024]={0};glGetShaderInfoLog(shader,sizeof log,NULL,log);
        fprintf(stderr,"Astra material shader: %s\n",log);
        glDeleteShader(shader);return 0;
    }
    return shader;
}
static void astra_init_shader(void)
{
    const char *vs="varying highp vec2 uv;varying mediump vec4 light;varying highp vec3 p;"
        "void main(){gl_Position=ftransform();uv=gl_MultiTexCoord0.xy;light=gl_Color;p=gl_Vertex.xyz;}";
    const char *fs="precision highp float;varying highp vec2 uv;varying mediump vec4 light;varying highp vec3 p;"
        "uniform sampler2D colorMap,detailMap;uniform mat3 basis;uniform vec4 lamp,shot,surface;uniform vec2 density;uniform float refinement;uniform sampler2D topMap,topDetail;uniform float paired,topTurn;"
        "float hash(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}"
        "float noise(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}"
        "float skin(vec2 q){vec2 f=fract(q),e=min(f,1.-f);float d=min(e.x,e.y);float h=smoothstep(.015,.045,d)*.035;"
        "vec2 b=abs(f-.5)-vec2(.40);float r=length(b);h+=.010*(1.-smoothstep(.020,.032,r))-.009*(1.-smoothstep(.030,.043,r));"
        "float groove=abs(f.y-.70);float cut=(1.-smoothstep(.005,.013,groove))*smoothstep(.12,.16,f.x)*(1.-smoothstep(.82,.87,f.x));return h-cut*.012;}"

        "void main(){vec2 coord=uv;if(surface.x>3.5){coord+=sin(uv.yx*19.+surface.z*.8)*.003;}vec4 a=texture2D(colorMap,coord);"
        "vec3 sampleN=texture2D(detailMap,coord).rgb;"
        "if(paired>.5){vec2 tuv=uv;if(topTurn>.5&&topTurn<1.5)tuv=vec2(1.-uv.y,uv.x);else if(topTurn>1.5&&topTurn<2.5)tuv=1.-uv;else if(topTurn>2.5)tuv=vec2(uv.y,1.-uv.x);"
        "vec4 top=texture2D(topMap,tuv);if(top.a<.001)discard;float useTop=smoothstep(.004,.08,top.a);a=mix(a,vec4(top.rgb,1.),useTop);"
        "vec3 tn=texture2D(topDetail,tuv).rgb;vec2 normal=tn.xy*2.-1.;if(topTurn>.5&&topTurn<1.5)normal=vec2(normal.y,-normal.x);else if(topTurn>1.5&&topTurn<2.5)normal=-normal;else if(topTurn>2.5)normal=vec2(-normal.y,normal.x);"
        "tn.xy=normal*.5+.5;sampleN=mix(sampleN,tn,useTop);}if(a.a*light.a<.035)discard;vec2 xy=(sampleN.xy*2.-1.)*.87;"
        "vec3 eye=normalize(-p);vec3 base=basis[2]*sign(dot(basis[2],eye));"
        "float hard=step(.5,surface.x)*(1.-step(3.5,surface.x));vec2 cell=coord*density;float detailFade=1.-smoothstep(8.,55.,-p.z);float close=1.-smoothstep(35.,120.,-p.z);"
        "float eps=.002;vec2 relief=vec2(skin(cell-vec2(eps,0.))-skin(cell+vec2(eps,0.)),skin(cell-vec2(0.,eps))-skin(cell+vec2(0.,eps)))/(2.*eps);"
        "xy+=relief*.24*hard*close;xy=clamp(xy,vec2(-.85),vec2(.85));vec2 edges=min(fract(cell),1.-fract(cell));"
        "float seam=1.-smoothstep(.012,.050,min(edges.x,edges.y));a.rgb*=1.-seam*.32*hard*close;"
        "float fiber=sin(cell.x*170.+sin(cell.y*21.))*sin(cell.y*110.);a.rgb*=1.+fiber*.015*close*exp(-max(0.,-p.z-8.)*.08);"
        "vec3 n=normalize(basis[0]*xy.x+basis[1]*xy.y+base*sqrt(max(.06,1.-dot(xy,xy))));"
        "vec3 L=lamp.xyz-p;float dist=length(L);L/=max(dist,.001);"
        "float reach=lamp.w/(1.+dist*dist*.0018);"
        "vec3 beam=normalize(eye+vec3(-.25,.36,.12));float ndl=max(0.,dot(n,L));"
        "float bevel=dot(n,beam)-dot(base,beam);float room=clamp(dot(light.rgb,vec3(.21,.72,.07)),.0,1.4);"
        "float rock=1.-step(.5,surface.x),ceramic=step(1.5,surface.x)*(1.-step(2.5,surface.x)),oil=step(2.5,surface.x);"
        "float metal=(1.-sampleN.z)*(1.-rock*.86);float expn=mix(14.,95.,max(metal,oil*.8));"
        "float grain=sin(coord.x*96.+sin(coord.y*13.))*sin(coord.y*48.);"
        "float patina=sin(coord.x*6.7+surface.w*7.)*sin(coord.y*11.3+surface.w*13.);"
        "float wear=smoothstep(.5,.92,patina)*(.06+.09*rock);a.rgb*=1.+grain*.022+patina*.035-wear;"
        "a.rgb=mix(a.rgb,a.rgb*vec3(.93,1.01,1.025),ceramic*.45);expn=mix(expn,32.,ceramic);"
        "float grime=noise(cell*2.3+surface.w*17.),fleck=noise(cell*55.);float seamEdge=1.-smoothstep(.018,.10,min(edges.x,edges.y));"
        "float chip=seamEdge*smoothstep(.55,.73,fleck)*hard*detailFade*refinement;float wet=smoothstep(.64,.86,grime)*oil*refinement;"
        "a.rgb=mix(a.rgb,vec3(.28,.32,.33),chip*.65);a.rgb*=1.-refinement*(smoothstep(.52,.80,grime)*.16+wet*.16);"
        "metal=mix(metal,.88,chip);expn=mix(expn,105.,wet*.8);"
        "float cavity=clamp(1.-length(xy)*(.18+.12*rock),.72,1.);"
        "float glint=pow(max(dot(n,normalize(L+eye)),0.),expn)*reach;"
        "vec3 D=shot.xyz-p;float sd=length(D);D/=max(.01,sd);float fire=shot.w/(1.+sd*sd*.009);"
        "vec3 col=a.rgb*(light.rgb*(.91+.53*bevel)*cavity+vec3(.42,.32,.24)*ndl*reach);"
        "col+=vec3(.84,.91,1.)*pow(max(0.,dot(n,beam)),expn)*(.07+.15*metal)*room;"
        "vec3 lampTint=mix(vec3(1.,.75,.46),vec3(.40,.76,.85),step(1.5,surface.y)*(1.-step(2.5,surface.y)));"
        "col+=lampTint*glint*(.12+.35*metal)*(1.-rock*.8);"
        "col+=vec3(1.,.29,.085)*fire*(a.rgb*.64*max(0.,dot(n,D))+.38*pow(max(dot(n,normalize(D+eye)),0.),25.));"
        "vec3 H=normalize(beam+eye);float tangent=dot(H,basis[0]),across=dot(H,basis[1]);"
        "float brushed=exp(-(tangent*tangent*260.+across*across*16.))*max(0.,dot(n,beam));"
        "col+=refinement*hard*(1.-ceramic)*vec3(.19,.24,.27)*brushed*(.35+.65*metal)*room;"
        "vec3 reflection=reflect(-eye,n);float strip=pow(max(0.,1.-abs(reflection.y-.56)*2.4),14.);"
        "col+=refinement*vec3(.16,.29,.34)*strip*(wet*.43+metal*.07)*room;"
        "float vein=1.-smoothstep(.014,.045,abs(noise(cell*3.5+noise(cell*.8)*2.)-.51));"
        "col+=rock*refinement*vein*vec3(.038,.052,.048)*close;"
        "float haze=min(.16,1.-exp(-max(0.,-p.z-10.)*.0017));col=mix(col,vec3(.09,.145,.16),haze);"
        "gl_FragColor=vec4(col,a.a*light.a);}";
    GLuint v=astra_compile(GL_VERTEX_SHADER,vs), f=astra_compile(GL_FRAGMENT_SHADER,fs);
    if(!v||!f){astra_gpu_failed=1;return;}
    astra_program=glCreateProgram();glAttachShader(astra_program,v);glAttachShader(astra_program,f);
    glLinkProgram(astra_program);glDeleteShader(v);glDeleteShader(f);
    GLint ok;glGetProgramiv(astra_program,GL_LINK_STATUS,&ok);
    if(!ok){char log[1024];glGetProgramInfoLog(astra_program,sizeof log,NULL,log);fprintf(stderr,"Astra link: %s\n",log);astra_gpu_failed=1;return;}
    glUseProgram(astra_program);
    glUniform1i(glGetUniformLocation(astra_program,"colorMap"),0);
    glUniform1i(glGetUniformLocation(astra_program,"detailMap"),1);
    glUniform1i(glGetUniformLocation(astra_program,"topMap"),2);glUniform1i(glGetUniformLocation(astra_program,"topDetail"),3);
    astra_tangents=glGetUniformLocation(astra_program,"basis");
    astra_fixture=glGetUniformLocation(astra_program,"lamp");astra_moving=glGetUniformLocation(astra_program,"shot");
}
static void astra_unit(float *s){float d=sqrtf(s[0]*s[0]+s[1]*s[1]+s[2]*s[2]);if(d>1e-7f)for(int i=0;i<3;i++)s[i]/=d;}
static int astra_material_begin(ogl_texture *tex,const float *p,const float *uv)
{
    if(!tex || tex->material<=0 || tex->material>=256 || astra_gpu_failed)return 0;
    if(!astra_program)astra_init_shader();
    if(astra_gpu_failed)return 0;
    int id=tex->material;
    int earth=astra_drawing_mine&&astra_refinement?astra_earth_material:0;astra_earth_material=0;
    if(earth){
        if(!astra_earth_colors[earth]){char name[24];png_data data;snprintf(name,sizeof name,"m%03d.png",earth-1);
            if(read_png(name,&data)){glGenTextures(1,&astra_earth_colors[earth]);glBindTexture(GL_TEXTURE_2D,astra_earth_colors[earth]);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR_MIPMAP_LINEAR);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_REPEAT);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_REPEAT);glTexImage2D(GL_TEXTURE_2D,0,data.channels==4?GL_RGBA:GL_RGB,data.width,data.height,0,data.channels==4?GL_RGBA:GL_RGB,GL_UNSIGNED_BYTE,data.data);glGenerateMipmap(GL_TEXTURE_2D);free(data.data);}
        }if(astra_earth_colors[earth])id=earth;else earth=0;
    }
    glActiveTexture(GL_TEXTURE1);
    if(!astra_normals[id]){
        char name[20];snprintf(name,sizeof name,"n%03d.png",id-1);png_data data;
        if(!read_png(name,&data)){glActiveTexture(GL_TEXTURE0);glUseProgram(0);return 0;}
        glGenTextures(1,&astra_normals[id]);glBindTexture(GL_TEXTURE_2D,astra_normals[id]);
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR_MIPMAP_LINEAR);
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGB,data.width,data.height,0,GL_RGB,GL_UNSIGNED_BYTE,data.data);
        glGenerateMipmap(GL_TEXTURE_2D);
        if(ogl_maxanisotropy>1.0)glTexParameterf(GL_TEXTURE_2D,GL_TEXTURE_MAX_ANISOTROPY_EXT,fminf(8,ogl_maxanisotropy));
        free(data.data);
    }else glBindTexture(GL_TEXTURE_2D,astra_normals[id]);
    glActiveTexture(GL_TEXTURE0);if(earth)glBindTexture(GL_TEXTURE_2D,astra_earth_colors[earth]);glUseProgram(astra_program);glUniform1f(glGetUniformLocation(astra_program,"paired"),0);
    float a=uv[2]-uv[0],b=uv[3]-uv[1],c=uv[4]-uv[0],d=uv[5]-uv[1],mat[9];
    float flip=(a*d-b*c)<0?-1.f:1.f;
    for(int i=0;i<3;i++){float e=p[3+i]-p[i],g=p[6+i]-p[i];mat[i]=(d*e-b*g)*flip;mat[3+i]=(a*g-c*e)*flip;}
    float density[2];
    for(int j=0;j<2;j++)density[j]=fminf(12,fmaxf(.6f,sqrtf(mat[j*3]*mat[j*3]+mat[j*3+1]*mat[j*3+1]+mat[j*3+2]*mat[j*3+2])/fmaxf(.001f,fabsf(a*d-b*c))/8.f));
    glUniform2fv(glGetUniformLocation(astra_program,"density"),1,density);
    astra_unit(mat);astra_unit(mat+3);
    for(int i=0;i<3;i++)mat[6+i]=mat[(i+1)%3]*mat[3+(i+2)%3]-mat[(i+2)%3]*mat[3+(i+1)%3];
    astra_unit(mat+6);
    glUniformMatrix3fv(astra_tangents,1,GL_FALSE,mat);
    static int kinds[256],kinds_ready;
    if(!kinds_ready){EM_ASM({var k=window.astraMaterialTypes||[];for(var i=0;i<256;i++)HEAP32[($0>>2)+i]=k[i]??-1;},kinds);kinds_ready=1;}
    float surface[4];memcpy(surface,astra_surface,sizeof surface);if(kinds[id]==0||kinds[id]==4)surface[0]=kinds[id];else if(kinds[id]>0&&surface[0]==0)surface[0]=1;if(id>=181&&id<=183)surface[0]=1;if(earth)surface[0]=0;
    glUniform4fv(glGetUniformLocation(astra_program,"surface"),1,surface);
    glUniform1f(glGetUniformLocation(astra_program,"refinement"),astra_refinement);
    EM_ASM(Module.wallDetailVersion=22;);
    glUniform4fv(astra_fixture,1,astra_lamp);glUniform4fv(astra_moving,1,astra_flash);
    ++astra_shaded;return 1;
}


/* The polygon uses the same camera vertices as the textured face. Interpolated
 * world coordinates put the light at the impact even on very large mine walls. */
extern float astra_blast_positions[3][4],astra_blast_colors[3][4];
extern int astra_room_blast_count;
void astra_light_face(int count,const g3s_point **view,const int *ids)
{
    static GLuint program;static GLint bulbs,colors;static int failed;
    if(!astra_room_blast_count || failed || count<3 || count>8)return;
    float p[24],world[24],low[3],high[3];
    for(int i=0;i<count;i++){
        p[i*3]=f2fl(view[i]->p3_vec.x);p[i*3+1]=f2fl(view[i]->p3_vec.y);p[i*3+2]=-f2fl(view[i]->p3_vec.z);
        const vms_vector *v=&Vertices[ids[i]];
        float *w=world+3*i;w[0]=f2fl(v->x);w[1]=f2fl(v->y);w[2]=f2fl(v->z);
        for(int a=0;a<3;a++){if(!i || w[a]<low[a])low[a]=w[a];if(!i || w[a]>high[a])high[a]=w[a];}
    }
    int near=0;
    for(int i=0;i<3;i++){const float *b=astra_blast_positions[i];float d2=0;
        for(int a=0;a<3;a++){float d=fmaxf(0,fmaxf(low[a]-b[a],b[a]-high[a]));d2+=d*d;}
        if(b[3]>0 && d2<b[3]*b[3])near++;}
    if(!near)return;
    if(!program){
        const char *vs="varying highp vec3 world;void main(){world=gl_MultiTexCoord0.xyz;gl_Position=ftransform();}";
        const char *fs="precision highp float;varying highp vec3 world;uniform vec4 bulbs[3],colors[3];"
          "void main(){vec3 light=vec3(0.);for(int i=0;i<3;i++){float r=bulbs[i].w;"
          "float t=clamp(1.-distance(world,bulbs[i].xyz)/max(.001,r),0.,1.);"
          "light+=colors[i].rgb*t*t*(.58+.42*t);}gl_FragColor=vec4(light,1.);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);
        if(!v||!f){failed=1;return;}
        program=glCreateProgram();glAttachShader(program,v);glAttachShader(program,f);glLinkProgram(program);
        glDeleteShader(v);glDeleteShader(f);GLint linked;glGetProgramiv(program,GL_LINK_STATUS,&linked);
        if(!linked){failed=1;return;}bulbs=glGetUniformLocation(program,"bulbs[0]");colors=glGetUniformLocation(program,"colors[0]");
    }
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;
    gr_settransblend(GR_FADE_OFF,GR_BLEND_ADDITIVE_A);glDepthMask(GL_FALSE);
    /* Reflect more light from bright metal while retaining a little scatter in dark areas. */
    glBlendFunc(GL_DST_COLOR,GL_ONE);glUseProgram(program);
    glUniform4fv(bulbs,3,&astra_blast_positions[0][0]);glUniform4fv(colors,3,&astra_blast_colors[0][0]);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    glVertexPointer(3,GL_FLOAT,0,p);glTexCoordPointer(3,GL_FLOAT,0,world);glDrawArrays(GL_TRIANGLE_FAN,0,count);
    glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_TEXTURE_COORD_ARRAY);
    glUseProgram(0);glDepthMask(GL_TRUE);gr_settransblend(fade,blend);
    EM_ASM(Module.blastLitFaces=(Module.blastLitFaces||0)+1);
}

/* Super-transparent overlays must remain separate high-resolution layers. The
 * stock CPU merger has only a 64x64 indexed-color destination and loses both
 * replacements. Alpha 0 is the native cut-out, alpha 1/255 reveals the base. */
int astra_layered_can(grs_bitmap *base,grs_bitmap *top){
    if(!ogl_allow_png()||!base||!top)return 0;
    const char *a=piggy_game_bitmap_name(base),*b=piggy_game_bitmap_name(top);
    if(!a||!b||!astra_material_id(a)||!astra_material_id(b))return 0;
    if(!astra_program&&!astra_gpu_failed)astra_init_shader();return !astra_gpu_failed;
}
static int astra_layered_draw(int nv,const g3s_point **points,const g3s_uvl *uvl,g3s_lrgb *light,grs_bitmap *base,grs_bitmap *top,int turn){
    if(!(top->bm_flags&BM_FLAG_SUPER_TRANSPARENT)||!astra_layered_can(base,top))return 0;
    ogl_bindbmtex(base);ogl_texwrap(base->gltexture,GL_REPEAT);ogl_bindbmtex(top);ogl_texwrap(top->gltexture,GL_REPEAT);
    float p[24],uv[16],color[32];
    for(int i=0;i<nv;i++){
        p[3*i]=f2fl(points[i]->p3_x);p[3*i+1]=f2fl(points[i]->p3_y);p[3*i+2]=-f2fl(points[i]->p3_z);
        uv[2*i]=f2fl(uvl[i].u);uv[2*i+1]=f2fl(uvl[i].v);
        color[4*i]=fminf(1,f2fl(light[i].r));color[4*i+1]=fminf(1,f2fl(light[i].g));color[4*i+2]=fminf(1,f2fl(light[i].b));color[4*i+3]=1;
    }
    if(!astra_material_begin(top->gltexture,p,uv)||!astra_material_begin(base->gltexture,p,uv))return 0;
    glActiveTexture(GL_TEXTURE2);glBindTexture(GL_TEXTURE_2D,top->gltexture->handle);
    glActiveTexture(GL_TEXTURE3);glBindTexture(GL_TEXTURE_2D,astra_normals[top->gltexture->material]);
    glActiveTexture(GL_TEXTURE0);OGL_BINDTEXTURE(base->gltexture->handle);
    glUniform1f(glGetUniformLocation(astra_program,"paired"),1);glUniform1f(glGetUniformLocation(astra_program,"topTurn"),turn);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    glVertexPointer(3,GL_FLOAT,0,p);glColorPointer(4,GL_FLOAT,0,color);glTexCoordPointer(2,GL_FLOAT,0,uv);glDrawArrays(GL_TRIANGLE_FAN,0,nv);
    glDisableClientState(GL_TEXTURE_COORD_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);
    glUseProgram(0);EM_ASM(Module.wallLayersVersion=20;Module.wallLayerFrames=(Module.wallLayerFrames||0)+1;);return 1;
}
