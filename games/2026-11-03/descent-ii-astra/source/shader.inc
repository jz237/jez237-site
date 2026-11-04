/* Materials are shared across palette slots. One tangent map per source, on unit 1. */
extern float astra_lamp[4],astra_flash[4];
extern int astra_drawing_mine;
static float astra_surface[4];
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
    const char *vs="varying mediump vec2 uv;varying mediump vec4 light;varying highp vec3 p;"
        "void main(){gl_Position=ftransform();uv=gl_MultiTexCoord0.xy;light=gl_Color;p=gl_Vertex.xyz;}";
    const char *fs="precision highp float;varying mediump vec2 uv;varying mediump vec4 light;varying highp vec3 p;"
        "uniform sampler2D colorMap,detailMap;uniform mat3 basis;uniform vec4 lamp,shot,surface;"
        "void main(){vec2 coord=uv;if(surface.x>3.5){coord+=sin(uv.yx*19.+surface.z*.8)*.003;}vec4 a=texture2D(colorMap,coord);if(a.a*light.a<.035)discard;"
        "vec3 sampleN=texture2D(detailMap,coord).rgb;vec2 xy=(sampleN.xy*2.-1.)*.87;"
        "vec3 eye=normalize(-p);vec3 base=basis[2]*sign(dot(basis[2],eye));"
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
        "float cavity=clamp(1.-length(xy)*(.18+.12*rock),.72,1.);"
        "float glint=pow(max(dot(n,normalize(L+eye)),0.),expn)*reach;"
        "vec3 D=shot.xyz-p;float sd=length(D);D/=max(.01,sd);float fire=shot.w/(1.+sd*sd*.009);"
        "vec3 col=a.rgb*(light.rgb*(.91+.53*bevel)*cavity+vec3(.42,.32,.24)*ndl*reach);"
        "col+=vec3(.84,.91,1.)*pow(max(0.,dot(n,beam)),expn)*(.07+.15*metal)*room;"
        "vec3 lampTint=mix(vec3(1.,.75,.46),vec3(.40,.76,.85),step(1.5,surface.y)*(1.-step(2.5,surface.y)));"
        "col+=lampTint*glint*(.12+.35*metal)*(1.-rock*.8);"
        "col+=vec3(1.,.29,.085)*fire*(a.rgb*.64*max(0.,dot(n,D))+.38*pow(max(dot(n,normalize(D+eye)),0.),25.));"
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
    glActiveTexture(GL_TEXTURE1);
    if(!astra_normals[id]){
        char name[20];snprintf(name,sizeof name,"n%03d.png",id-1);png_data data;
        if(!read_png(name,&data)){glActiveTexture(GL_TEXTURE0);glUseProgram(0);return 0;}
        glGenTextures(1,&astra_normals[id]);glBindTexture(GL_TEXTURE_2D,astra_normals[id]);
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR_MIPMAP_LINEAR);
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGB,data.width,data.height,0,GL_RGB,GL_UNSIGNED_BYTE,data.data);
        glGenerateMipmap(GL_TEXTURE_2D);free(data.data);
    }else glBindTexture(GL_TEXTURE_2D,astra_normals[id]);
    glActiveTexture(GL_TEXTURE0);glUseProgram(astra_program);
    float a=uv[2]-uv[0],b=uv[3]-uv[1],c=uv[4]-uv[0],d=uv[5]-uv[1],mat[9];
    float flip=(a*d-b*c)<0?-1.f:1.f;
    for(int i=0;i<3;i++){float e=p[3+i]-p[i],g=p[6+i]-p[i];mat[i]=(d*e-b*g)*flip;mat[3+i]=(a*g-c*e)*flip;}
    astra_unit(mat);astra_unit(mat+3);
    for(int i=0;i<3;i++)mat[6+i]=mat[(i+1)%3]*mat[3+(i+2)%3]-mat[(i+2)%3]*mat[3+(i+1)%3];
    astra_unit(mat+6);
    glUniformMatrix3fv(astra_tangents,1,GL_FALSE,mat);
    glUniform4fv(glGetUniformLocation(astra_program,"surface"),1,astra_surface);
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
