/* Native D2 object poses drive Overload render batches. Simulation still uses the D2 POF. */
#include "polyobj.h"
#include "robot.h"
#include "astra_fleet_types.inc"
typedef struct {unsigned mat,joint,count;float *v;} astra_batch;
typedef struct {int tried,count;astra_batch *group;unsigned char *bytes;} astra_chassis;
static astra_chassis af_models[32];
static GLuint af_maps[64][2],af_program;
static int af_enabled=-1,af_failed,af_draws;
int astra_robot_id=-1;
static GLint af_basis,af_origin,af_energy,af_flash,af_clock;
static void af_program_init(void){
    const char *vs="varying mediump vec2 uv;varying highp vec3 p,n,t;varying mediump float hand;"
        "uniform mat3 axis;uniform vec3 origin;"
        "void main(){p=axis*gl_Vertex.xyz+origin;gl_Position=gl_ProjectionMatrix*vec4(p,1.);"
        "mat3 rot=mat3(normalize(axis[0]),normalize(axis[1]),normalize(axis[2]));"
        "n=normalize(rot*(gl_Color.xyz*2.-1.));hand=gl_Color.a*2.-1.;uv=gl_MultiTexCoord0.xy;"
        "vec2 e=gl_MultiTexCoord0.zw*2.-1.;vec3 v=vec3(e,1.-abs(e.x)-abs(e.y));"
        "if(v.z<0.)v.xy=(1.-abs(v.yx))*sign(v.xy+vec2(.000001));t=normalize(rot*v);}";
    const char *fs="precision highp float;varying mediump vec2 uv;varying highp vec3 p,n,t;varying mediump float hand;"
        "uniform sampler2D paint,detail;uniform vec3 energy;uniform vec4 flash;uniform float clock;"
        "void main(){vec4 a=texture2D(paint,uv),m=texture2D(detail,uv);vec3 N=normalize(n),T=normalize(t-N*dot(t,N));"
        "vec2 xy=(m.xy*2.-1.)*.82;N=normalize(T*xy.x+cross(N,T)*hand*xy.y+N*sqrt(max(.06,1.-dot(xy,xy))));"
        "vec3 V=normalize(-p),K=normalize(vec3(-.63,.80,.82)),R=normalize(vec3(.72,.28,-.68));"
        "float key=max(dot(N,K),0.),rim=pow(1.-max(dot(N,V),0.),2.6),rough=m.a,metal=m.b;"
        "float coat=pow(max(dot(N,normalize(K+V)),0.),mix(100.,12.,rough));"
        "vec3 base=pow(max(a.rgb,vec3(.014)),vec3(.79));"
        "vec3 color=base*(.30+key*1.18+max(dot(N,R),0.)*.24)*energy;"
        "color+=coat*mix(vec3(.65,.75,.86),max(base,vec3(.24)),metal)*(.44+.65*metal);"
        "color+=vec3(.09,.38,.46)*rim*(.35+max(dot(N,R),0.));"
        "vec3 F=flash.xyz-p;float fd=length(F);color+=vec3(1.,.40,.13)*flash.w/(1.+fd*fd*.01)*max(0.,dot(N,F/max(.1,fd)))*base;"
        "vec3 emission=mix(vec3(.20,.79,1.),max(base,vec3(.15)),smoothstep(.08,.42,max(base.r,base.g)-base.b));"
        "color+=emission*pow(a.a,.77)*(1.32+.075*sin(clock*3.));gl_FragColor=vec4(color/(1.+.23*color),1.);}";
    GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);
    if(!v||!f){af_failed=1;return;}
    af_program=glCreateProgram();glAttachShader(af_program,v);glAttachShader(af_program,f);glLinkProgram(af_program);
    glDeleteShader(v);glDeleteShader(f);GLint ok;glGetProgramiv(af_program,GL_LINK_STATUS,&ok);
    if(!ok){char log[512]={0};glGetProgramInfoLog(af_program,sizeof log,NULL,log);fprintf(stderr,"Astra fleet: %s\n",log);af_failed=1;return;}
    glUseProgram(af_program);glUniform1i(glGetUniformLocation(af_program,"paint"),0);glUniform1i(glGetUniformLocation(af_program,"detail"),1);
    af_basis=glGetUniformLocation(af_program,"axis");af_origin=glGetUniformLocation(af_program,"origin");
    af_energy=glGetUniformLocation(af_program,"energy");af_flash=glGetUniformLocation(af_program,"flash");af_clock=glGetUniformLocation(af_program,"clock");
    glUseProgram(0);
}
static int af_load_mesh(int id){
    astra_chassis *ch=&af_models[id];if(ch->tried)return ch->count;
    ch->tried=1;char name[32];snprintf(name,sizeof name,"fleet%d.mesh",id);
    PHYSFS_File *file=PHYSFS_openRead(name);if(!file)return 0;
    int length=PHYSFS_fileLength(file);if(length<16||length>32*1024*1024){PHYSFS_close(file);return 0;}
    unsigned char *data=malloc(length);int ok=data&&PHYSFS_readBytes(file,data,length)==length;PHYSFS_close(file);
    if(!ok){free(data);return 0;}
    unsigned batches=*(unsigned*)data,at=4;
    if(batches<1||batches>128){free(data);return 0;}
    astra_batch *g=calloc(batches,sizeof(*g));
    for(unsigned i=0;ok&&i<batches;i++){
        if(at+12>(unsigned)length){ok=0;break;}
        unsigned *h=(unsigned*)(data+at);at+=12;
        if(h[0]>=64||h[1]>2||h[2]>(length-at)/44){ok=0;break;}
        g[i]=(astra_batch){h[0],h[1],h[2],(float*)(data+at)};at+=h[2]*44;
    }
    if(!ok||at!=length){free(data);free(g);return 0;}
    ch->bytes=data;ch->group=g;ch->count=batches;return batches;
}
static int af_bind(unsigned id){
    for(int unit=0;unit<2;unit++){
        glActiveTexture(unit?GL_TEXTURE1:GL_TEXTURE0);
        if(!af_maps[id][unit]){
            char name[32];png_data im;snprintf(name,sizeof name,unit?"relief%d.png":"coat%d.png",id);
            if(!read_png(name,&im)){glActiveTexture(GL_TEXTURE0);return 0;}
            glGenTextures(1,&af_maps[id][unit]);glBindTexture(GL_TEXTURE_2D,af_maps[id][unit]);
            GLenum fmt=im.channels==4?GL_RGBA:GL_RGB;
            glTexImage2D(GL_TEXTURE_2D,0,fmt,im.width,im.height,0,fmt,GL_UNSIGNED_BYTE,im.data);free(im.data);
            glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR_MIPMAP_LINEAR);
            glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);glGenerateMipmap(GL_TEXTURE_2D);
        }else glBindTexture(GL_TEXTURE_2D,af_maps[id][unit]);
    }
    glActiveTexture(GL_TEXTURE0);return 1;
}
static int af_gun_joint(polymodel *pm,robot_info *ri,int side){
    int selected=0;fix best=0;
    for(int g=0;g<ri->n_guns&&g<MAX_GUNS;g++){
        int j=ri->gun_submodels[g];if(j<=0||j>=pm->n_models)continue;
        fix x=ri->gun_points[g].x;
        for(int k=j,n=0;k>0&&k<pm->n_models&&n++<MAX_SUBMODELS;k=pm->submodel_parents[k])x+=pm->submodel_offsets[k].x;
        fix score=side==1?-x:x;if(!selected||score>best){selected=j;best=score;}
    }
    return selected;
}
int astra_draw_robot(int model,polymodel *pm,vms_angvec *angles,g3s_lrgb light){
    if(af_enabled<0)af_enabled=EM_ASM_INT(return !!Module.astra);
    if(!af_enabled||af_failed||astra_robot_id<0||astra_robot_id>=N_robot_types||Robot_info[astra_robot_id].model_num!=model||model<0)return 0;
    int id=model<sizeof(astra_fleet_type)?astra_fleet_type[model]:(Robot_info[astra_robot_id].boss_flag?6:(astra_robot_id*7+3)%12);if(!af_load_mesh(id))return 0;
    if(!af_program)af_program_init();if(af_failed)return 0;
    vms_vector extent={(pm->maxs.x-pm->mins.x)/2,(pm->maxs.y-pm->mins.y)/2,(pm->maxs.z-pm->mins.z)/2};
    extent.x=extent.x*85/100;extent.y=extent.y*86/100;extent.z=extent.z*91/100;
    vms_vector center={(pm->maxs.x+pm->mins.x)/2,(pm->maxs.y+pm->mins.y)/2,(pm->maxs.z+pm->mins.z)/2};
    GLboolean cull=glIsEnabled(GL_CULL_FACE),depth=glIsEnabled(GL_DEPTH_TEST);
    glDisable(GL_CULL_FACE);glEnable(GL_DEPTH_TEST);glUseProgram(af_program);
    glUniform3f(af_energy,.51f+.62f*fminf(1.4f,f2fl(light.r)),.55f+.62f*fminf(1.4f,f2fl(light.g)),.58f+.62f*fminf(1.4f,f2fl(light.b)));
    glUniform4fv(af_flash,1,astra_flash);glUniform1f(af_clock,SDL_GetTicks()*.001f);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    for(int b=0;b<af_models[id].count;b++){
        astra_batch *part=&af_models[id].group[b];
        int chain[MAX_SUBMODELS],n=0;
        vms_vector origin=center;
        if(angles&&part->joint){
            int j=af_gun_joint(pm,&Robot_info[astra_robot_id],part->joint);
            while(j>0&&j<pm->n_models&&n<MAX_SUBMODELS-1){chain[n++]=j;vm_vec_sub2(&origin,&pm->submodel_offsets[j]);j=pm->submodel_parents[j];}
            for(int k=n-1;k>=0;k--){int i=chain[k];g3_start_instance_angles(&pm->submodel_offsets[i],&angles[i]);}
        }
        g3s_point pt;g3_rotate_point(&pt,&origin);glUniform3f(af_origin,f2fl(pt.p3_x),f2fl(pt.p3_y),-f2fl(pt.p3_z));
        float m[9];for(int k=0;k<3;k++){
            vms_vector delta={0,0,0},rot;if(k==0)delta.x=extent.x;else if(k==1)delta.y=extent.y;else delta.z=extent.z;
            g3_rotate_delta_vec(&rot,&delta);m[k*3]=f2fl(rot.x);m[k*3+1]=f2fl(rot.y);m[k*3+2]=-f2fl(rot.z);
        }
        glUniformMatrix3fv(af_basis,1,GL_FALSE,m);
        if(af_bind(part->mat)){
            glVertexPointer(3,GL_FLOAT,44,part->v);glColorPointer(4,GL_FLOAT,44,part->v+3);glTexCoordPointer(4,GL_FLOAT,44,part->v+7);
            glDrawArrays(GL_TRIANGLES,0,part->count);
        }
        while(n--)g3_done_instance();
    }
    glDisableClientState(GL_TEXTURE_COORD_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);
    glUseProgram(0);if(cull)glEnable(GL_CULL_FACE);if(!depth)glDisable(GL_DEPTH_TEST);
    af_draws++;
    EM_ASM(Module.fleetDraws=$0;Module.lastChassis=$1;,af_draws,id);
    return 1;
}

