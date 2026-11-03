/* Chamfered steel jambs, recessed vents and area lamps follow solid mine faces.
   All geometry is visual and stays close to the original collision surface. */
typedef struct {float p[3],c[4],uv[2];} forge_vertex;
static forge_vertex gantryVerts[840];static int gantryN;
static float corners3[4][3],faceNrm[3],forgeLight;
static GLuint gantryTexture,gantryProgram;static int gantryFailed;
static void forge_vertex_at(float u,float v,float h,float s,float t,float r,float g,float b,float lamp){
    forge_vertex *o=&gantryVerts[gantryN++];float s0=(1-u)*(1-v),s1=u*(1-v),s2=u*v,s3=(1-u)*v;
    for(int k=0;k<3;k++)o->p[k]=s0*corners3[0][k]+s1*corners3[1][k]+s2*corners3[2][k]+s3*corners3[3][k]+faceNrm[k]*h;
    o->uv[0]=s;o->uv[1]=t;o->c[0]=r;o->c[1]=g;o->c[2]=b;o->c[3]=lamp;
}
static void forge_strip(float a,float b,float c,float d,float h,int tile,int style,int upright){
    float us[4]={a,c,c,a},vs[4]={b,b,d,d};float w=fminf((c-a)*.14f,.009f),v=fminf((d-b)*.15f,.009f);
    float U[4]={a+w,c-w,c-w,a+w},V[4]={b+v,b+v,d-v,d-v};
    int ci[6]={0,1,2,0,2,3};
    float color[3]={.49f,.65f,.70f};
    if(style==1){color[0]=.14f;color[1]=.78f;color[2]=1.f;}
    if(style==2){color[0]=1.f;color[1]=.48f;color[2]=.10f;}
    if(style==3){color[0]=.91f;color[1]=.74f;color[2]=.46f;}
    for(int e=0;e<4;e++){
        int j=(e+1)%4;float q=(e==0||e==3)?.72f:.28f;
        for(int i=0;i<6;i++){
            int k=ci[i],idx=(k==0||k==3)?e:j,high=k>1;
            forge_vertex_at(high?U[idx]:us[idx],high?V[idx]:vs[idx],high?h:.022f,(idx&1)?1:0,(tile+.1f+.80f*high)/4.f,q*.57f*forgeLight,q*.73f*forgeLight,q*.82f*forgeLight,0);
        }
    }
    for(int i=0;i<6;i++){
        int k=ci[i];float x=(k==1||k==2),y=k>=2;
        float aLight=style==1||style==2?1:0;
        forge_vertex_at(U[k],V[k],h,upright?y:x,(tile+.013f+(upright?x:y)*.973f)/4.f,color[0]*(aLight?1:forgeLight),color[1]*(aLight?1:forgeLight),color[2]*(aLight?1:forgeLight),aLight);
    }
}
void astra_gantry(int nv,const g3s_point **points,g3s_lrgb *l,int seed,int floor){
    static int enabled=-1;if(enabled<0)enabled=EM_ASM_INT(return !!Module.astra);
    if(!enabled||nv!=4||gantryFailed)return;
    for(int i=0;i<4;i++){corners3[i][0]=f2fl(points[i]->p3_x);corners3[i][1]=f2fl(points[i]->p3_y);corners3[i][2]=-f2fl(points[i]->p3_z);}
    float A[3],B[3];for(int k=0;k<3;k++){A[k]=corners3[1][k]-corners3[0][k];B[k]=corners3[3][k]-corners3[0][k];}
    float aw=sqrtf(A[0]*A[0]+A[1]*A[1]+A[2]*A[2]),bw=sqrtf(B[0]*B[0]+B[1]*B[1]+B[2]*B[2]);
    if(aw<5||bw<5||aw>170||bw>170||-corners3[0][2]>175)return;
    for(int i=0;i<3;i++)faceNrm[i]=A[(i+1)%3]*B[(i+2)%3]-A[(i+2)%3]*B[(i+1)%3];astra_unit(faceNrm);
    if(faceNrm[0]*corners3[0][0]+faceNrm[1]*corners3[0][1]+faceNrm[2]*corners3[0][2]>0)for(int k=0;k<3;k++)faceNrm[k]*=-1;
    if(!gantryTexture&&!refit_png("forge.png",&gantryTexture,GL_REPEAT))return;
    if(!gantryProgram){
        const char *vs="varying mediump vec2 uv;varying mediump vec4 paint;void main(){gl_Position=ftransform();uv=gl_MultiTexCoord0.xy;paint=gl_Color;}";
        const char *fs="precision mediump float;uniform sampler2D atlas;varying mediump vec2 uv;varying mediump vec4 paint;void main(){vec3 art=texture2D(atlas,uv).rgb;vec3 steel=(vec3(.065)+pow(art,vec3(.83))*1.26)*paint.rgb;gl_FragColor=vec4(mix(steel,paint.rgb*(.90+.10*art),paint.a),1.);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){gantryFailed=1;return;}
        gantryProgram=glCreateProgram();glAttachShader(gantryProgram,v);glAttachShader(gantryProgram,f);glLinkProgram(gantryProgram);glDeleteShader(v);glDeleteShader(f);
        GLint ok;glGetProgramiv(gantryProgram,GL_LINK_STATUS,&ok);if(!ok){gantryFailed=1;return;}
    }
    forgeLight=.39f+.86f*fminf(1.2f,f2fl((l[0].r+l[0].g+l[0].b)/3));gantryN=0;
    float u=fminf(.115f,.92f/aw),v=fminf(.13f,1.05f/bw);
    forge_strip(.007,.004,u, .995,.32,1,0,1);forge_strip(1-u,.004,.993,.995,.32,1,0,1);
    forge_strip(u,.007,1-u,v,.25,1,0,0);forge_strip(u,1-v,1-u,.993,.25,0,0,0);
    if(floor){
        forge_strip(.17,.015,.229,.985,.13,0,0,1);forge_strip(.771,.015,.83,.985,.13,0,0,1);
        for(int i=0;i<3;i++){float y=.14f+i*.31f;forge_strip(.194,y,.204,y+.067,.155,1,2,1);forge_strip(.797,y,.807,y+.067,.155,1,2,1);}
    }else{
        float L=.16f+(seed%3)*.045f;forge_strip(L,v+.012,1-L,v+.076,.37,0,0,0);
        forge_strip(L+.024,v+.027,1-L-.024,v+.047,.40,1,(seed%4==0)?2:1,0);
        for(int i=0;i<3;i++){
            float y=.22f+.23f*i;
            forge_strip(u*.41f,y,u*.65f,y+.077f,.35f,1,1,1);
            forge_strip(1-u*.65f,y,1-u*.41f,y+.077f,.35f,1,1,1);
        }
        if((seed&3)==0)forge_strip(.24,.73,.76,.82,.18,0,3,0);
    }
    GLboolean cull=glIsEnabled(GL_CULL_FACE);glDisable(GL_CULL_FACE);glUseProgram(gantryProgram);glBindTexture(GL_TEXTURE_2D,gantryTexture);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    glVertexPointer(3,GL_FLOAT,sizeof(forge_vertex),gantryVerts[0].p);glColorPointer(4,GL_FLOAT,sizeof(forge_vertex),gantryVerts[0].c);
    glTexCoordPointer(2,GL_FLOAT,sizeof(forge_vertex),gantryVerts[0].uv);glDrawArrays(GL_TRIANGLES,0,gantryN);
    glDisableClientState(GL_TEXTURE_COORD_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);glUseProgram(0);if(cull)glEnable(GL_CULL_FACE);
}

