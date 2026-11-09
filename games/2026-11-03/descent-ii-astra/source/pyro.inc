/* The pilot hull uses the flight terminal's mesh at the original model transform. */
static GLuint warm_astra_draw_pyro_program,warm_astra_draw_pyro_skin;static int warm_astra_draw_pyro_count,warm_astra_draw_pyro_failed;static float *warm_astra_draw_pyro_src,*warm_astra_draw_pyro_verts;
static int warm_astra_draw_pyro(void){
    if(warm_astra_draw_pyro_failed)return 0;if(warm_astra_draw_pyro_program)return 1;

        PHYSFS_File *mesh=PHYSFS_openRead("astra.hull"),*fragment=PHYSFS_openRead("pyro.frag");
        if(!mesh||!fragment){if(mesh)PHYSFS_close(mesh);if(fragment)PHYSFS_close(fragment);warm_astra_draw_pyro_failed=1;return 0;}
        size_t bytes=PHYSFS_fileLength(mesh),length=PHYSFS_fileLength(fragment);
        warm_astra_draw_pyro_count=bytes/(9*sizeof(float));warm_astra_draw_pyro_src=malloc(bytes);warm_astra_draw_pyro_verts=malloc(bytes);char *text=malloc(length+1);
        PHYSFS_readBytes(mesh,warm_astra_draw_pyro_src,bytes);PHYSFS_readBytes(fragment,text,length);text[length]=0;PHYSFS_close(mesh);PHYSFS_close(fragment);
        const char *vs="varying mediump vec2 uv;varying highp vec3 normal,position;varying mediump float material;"
            "void main(){gl_Position=ftransform();position=gl_Vertex.xyz;normal=gl_Color.xyz*2.-1.;material=gl_Color.a*8.;uv=gl_MultiTexCoord0.xy;}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,text);
        free(text);if(!v||!f){warm_astra_draw_pyro_failed=1;return 0;}
        warm_astra_draw_pyro_program=glCreateProgram();glAttachShader(warm_astra_draw_pyro_program,v);glAttachShader(warm_astra_draw_pyro_program,f);glLinkProgram(warm_astra_draw_pyro_program);
        glDeleteShader(v);glDeleteShader(f);GLint ok;glGetProgramiv(warm_astra_draw_pyro_program,GL_LINK_STATUS,&ok);
        if(!ok){warm_astra_draw_pyro_failed=1;return 0;}
        png_data coat;
        if(read_png("pyro-skin.png",&coat)){glGenTextures(1,&warm_astra_draw_pyro_skin);glBindTexture(GL_TEXTURE_2D,warm_astra_draw_pyro_skin);
          glTexImage2D(GL_TEXTURE_2D,0,GL_RGB,coat.width,coat.height,0,GL_RGB,GL_UNSIGNED_BYTE,coat.data);glGenerateMipmap(GL_TEXTURE_2D);free(coat.data);}

    return 1;
}
int astra_draw_pyro(g3s_lrgb light)
{

    if(warm_astra_draw_pyro_failed)return 0;
    if(!warm_astra_draw_pyro_program&&!warm_astra_draw_pyro()){return 0;}
    if(ss_capture){vms_vector scale={F1_0,F1_0,F1_0},zero={0};ss_draw(warm_astra_draw_pyro_src,36,warm_astra_draw_pyro_count,&scale,&zero);return 1;}
    for(int i=0;i<warm_astra_draw_pyro_count;i++){
        float *a=warm_astra_draw_pyro_src+i*9,*b=warm_astra_draw_pyro_verts+i*9;
        vms_vector local={(fix)(a[0]*65536),(fix)(a[1]*65536),(fix)(a[2]*65536)};
        g3s_point p;g3_rotate_point(&p,&local);
        b[0]=f2fl(p.p3_x);b[1]=f2fl(p.p3_y);b[2]=-f2fl(p.p3_z);
        vms_vector normal={(fix)(a[3]*65536),(fix)(a[4]*65536),(fix)(a[5]*65536)}, rotated;
        g3_rotate_delta_vec(&rotated,&normal);
        float n[3]={f2fl(rotated.x),f2fl(rotated.y),-f2fl(rotated.z)};astra_unit(n);
        for(int j=0;j<3;j++) b[3+j]=.5f+.5f*n[j];
        b[6]=a[8]/8.f;b[7]=a[6];b[8]=a[7];
    }
    GLboolean cull=glIsEnabled(GL_CULL_FACE),depth=glIsEnabled(GL_DEPTH_TEST);
    glDisable(GL_CULL_FACE);glEnable(GL_DEPTH_TEST);glUseProgram(warm_astra_draw_pyro_program);glBindTexture(GL_TEXTURE_2D,warm_astra_draw_pyro_skin);glUniform1i(glGetUniformLocation(warm_astra_draw_pyro_program,"skin"),0);
    glUniform3f(glGetUniformLocation(warm_astra_draw_pyro_program,"keyLight"),-.63f,.80f,.73f);
    glUniform3f(glGetUniformLocation(warm_astra_draw_pyro_program,"fillLight"),.8f,.4f,-.5f);
    glUniform1f(glGetUniformLocation(warm_astra_draw_pyro_program,"exposure"),fminf(1.35f,.22f+f2fl((light.r+light.g+light.b)/3)));
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    glVertexPointer(3,GL_FLOAT,36,warm_astra_draw_pyro_verts);glColorPointer(4,GL_FLOAT,36,warm_astra_draw_pyro_verts+3);glTexCoordPointer(2,GL_FLOAT,36,warm_astra_draw_pyro_verts+7);
    glDrawArrays(GL_TRIANGLES,0,warm_astra_draw_pyro_count);
    glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_TEXTURE_COORD_ARRAY);
    glUseProgram(0);if(cull)glEnable(GL_CULL_FACE);if(!depth)glDisable(GL_DEPTH_TEST);
    EM_ASM(Module.pyroDraws=(Module.pyroDraws||0)+1);return 1;
}

