/* Materials are shared across palette slots. One tangent map per source, on unit 1. */
extern float astra_lamp[4],astra_flash[4];
extern int astra_drawing_mine;
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
        "uniform sampler2D colorMap,detailMap;uniform mat3 basis;uniform vec4 lamp,shot;"
        "void main(){vec4 a=texture2D(colorMap,uv);if(a.a*light.a<.035)discard;"
        "vec3 sampleN=texture2D(detailMap,uv).rgb;vec2 xy=(sampleN.xy*2.-1.)*.87;"
        "vec3 eye=normalize(-p);vec3 base=basis[2]*sign(dot(basis[2],eye));"
        "vec3 n=normalize(basis[0]*xy.x+basis[1]*xy.y+base*sqrt(max(.06,1.-dot(xy,xy))));"
        "vec3 L=lamp.xyz-p;float dist=length(L);L/=max(dist,.001);"
        "float reach=lamp.w/(1.+dist*dist*.0018);"
        "vec3 beam=normalize(eye+vec3(-.25,.36,.12));float ndl=max(0.,dot(n,L));"
        "float bevel=dot(n,beam)-dot(base,beam);float room=clamp(dot(light.rgb,vec3(.21,.72,.07)),.0,1.4);"
        "float metal=1.-sampleN.z;float expn=mix(12.,70.,metal);"
        "float glint=pow(max(dot(n,normalize(L+eye)),0.),expn)*reach;"
        "vec3 D=shot.xyz-p;float sd=length(D);D/=max(.01,sd);float fire=shot.w/(1.+sd*sd*.009);"
        "vec3 col=a.rgb*(light.rgb*(.91+.53*bevel)+vec3(.42,.32,.24)*ndl*reach);"
        "col+=vec3(.84,.91,1.)*pow(max(0.,dot(n,beam)),expn)*(.07+.15*metal)*room;"
        "col+=vec3(1.,.75,.46)*glint*(.20+.40*metal);"
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
    glUniform4fv(astra_fixture,1,astra_lamp);glUniform4fv(astra_moving,1,astra_flash);
    ++astra_shaded;return 1;
}

