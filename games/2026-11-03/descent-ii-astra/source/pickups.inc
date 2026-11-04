/* Solid, depth-tested collectible meshes. The original objects own pickup
 * collision, size, animation clock, contents, scoring and sound. */
#include "lighting.h"
static GLuint ap_program,ap_buffer[51];
static unsigned ap_count[51],ap_draws;
static float *ap_data[51];
static unsigned char *ap_bytes;
static int ap_ready,ap_bad;
static GLint ap_axis,ap_origin,ap_light,ap_time,ap_flash;
static void ap_init(void){
    ap_ready=1;
    if(!EM_ASM_INT(return !!Module.astra)){ap_bad=1;return;}
    PHYSFS_File *f=PHYSFS_openRead("collectibles.mesh");if(!f){ap_bad=1;return;}
    int length=PHYSFS_fileLength(f);
    if(length<8||length>64*1024*1024){PHYSFS_close(f);ap_bad=1;return;}
    ap_bytes=malloc(length);
    int ok=ap_bytes&&PHYSFS_readBytes(f,ap_bytes,length)==length;PHYSFS_close(f);
    if(!ok||memcmp(ap_bytes,"APU8",4)||*(unsigned*)(ap_bytes+4)!=51){ap_bad=1;return;}
    unsigned at=8;
    for(int i=0;i<51;i++){
        if(at+4>(unsigned)length){ap_bad=1;return;}
        ap_count[i]=*(unsigned*)(ap_bytes+at);at+=4;
        if(ap_count[i]>(length-at)/44){ap_bad=1;return;}
        ap_data[i]=(float*)(ap_bytes+at);at+=ap_count[i]*44;
    }
    if(at!=length){ap_bad=1;return;}
    const char *vs="varying highp vec3 p,n,local,ln;varying mediump vec4 coat;varying mediump float glow;"
      "uniform mat3 axis;uniform vec3 origin;"
      "void main(){local=gl_Vertex.xyz;p=axis*local+origin;gl_Position=gl_ProjectionMatrix*vec4(p,1.);"
      "ln=gl_Color.xyz*2.-1.;n=normalize(axis*ln);glow=gl_Color.a;coat=gl_MultiTexCoord0;}";
    const char *fs="precision highp float;varying highp vec3 p,n,local,ln;varying mediump vec4 coat;varying mediump float glow;"
      "uniform vec3 lighting;uniform vec4 flash;uniform float clock;uniform sampler2D paint,detail;uniform mat3 axis;"
      "void main(){vec3 N=normalize(n),V=normalize(-p),L=normalize(vec3(-.4,.65,.75)),R=normalize(vec3(.7,-.1,-.6));"
      "vec3 w=pow(abs(ln),vec3(5.));w/=max(.001,w.x+w.y+w.z);"
      "vec3 uv=local*.62+vec3(.5);vec4 tex=texture2D(paint,uv.yz)*w.x+texture2D(paint,uv.xz)*w.y+texture2D(paint,uv.xy)*w.z;"
      "vec4 relief=texture2D(detail,uv.yz)*w.x+texture2D(detail,uv.xz)*w.y+texture2D(detail,uv.xy)*w.z;"
      "vec2 bump=(relief.xy-.5)*.23;N=normalize(N+normalize(axis[0])*bump.x+normalize(axis[1])*bump.y);"
      "float grain=sin(local.x*237.+sin(local.y*161.))*sin(local.z*83.+local.y*193.);"
      "float diff=max(dot(N,L),0.),rim=pow(1.-max(dot(N,V),0.),3.);"
      "float spec=pow(max(dot(N,normalize(V+L)),0.),mix(96.,24.,coat.a));"
      "vec3 base=coat.rgb*(.65+dot(tex.rgb,vec3(.299,.587,.114))*.8+grain*.025);vec3 c=base*(.26+diff*1.18+max(dot(N,R),0.)*.31)*lighting;"
      "c+=mix(vec3(.55,.68,.78),base,.48)*spec*.78+vec3(.06,.24,.32)*rim;"
      "vec3 F=flash.xyz-p;float fd=length(F);c+=base*vec3(1.,.42,.13)*flash.w/(1.+fd*fd*.01)*max(0.,dot(N,F/max(.01,fd)));"
      "c+=coat.rgb*glow*(1.15+.12*sin(clock*2.5+local.z*8.));"
      "gl_FragColor=vec4(c/(1.+.22*c),1.);}";
    GLuint v=astra_compile(GL_VERTEX_SHADER,vs),s=astra_compile(GL_FRAGMENT_SHADER,fs);
    if(!v||!s){ap_bad=1;return;}
    ap_program=glCreateProgram();glAttachShader(ap_program,v);glAttachShader(ap_program,s);glLinkProgram(ap_program);
    glDeleteShader(v);glDeleteShader(s);GLint linked;glGetProgramiv(ap_program,GL_LINK_STATUS,&linked);
    if(!linked){ap_bad=1;fprintf(stderr,"Astra pickup shader failed\n");return;}
    glUseProgram(ap_program);glUniform1i(glGetUniformLocation(ap_program,"paint"),0);glUniform1i(glGetUniformLocation(ap_program,"detail"),1);glUseProgram(0);
    ap_axis=glGetUniformLocation(ap_program,"axis");ap_origin=glGetUniformLocation(ap_program,"origin");
    ap_light=glGetUniformLocation(ap_program,"lighting");ap_time=glGetUniformLocation(ap_program,"clock");ap_flash=glGetUniformLocation(ap_program,"flash");
    EM_ASM(Module.pickupModels=51;Module.pickupCoverage=[];);
}
int astra_draw_pickup(object *obj){
    if(!ap_ready)ap_init();if(ap_bad||obj->id>=51)return 0;
    int id=obj->type==OBJ_HOSTAGE?50:obj->id;
    vms_vector pos=obj->pos;
    float clock=EM_ASM_INT(return (Module.pickupInspect??-1)>=0)?SDL_GetTicks()*.001f:f2fl((fix)(GameTime64%(F1_0*2000)));
    pos.y+=fl2f(sinf(clock*1.65f+id)*f2fl(obj->size)*.035f);
    vms_angvec angle={3500,2200,(int)(clock*2700)+id*2901};
    g3_start_instance_angles(&pos,&angle);
    g3s_point pt;vms_vector zero={0,0,0};g3_rotate_point(&pt,&zero);
    float axis[9];
    for(int k=0;k<3;k++){
        vms_vector a={0,0,0},r;
        if(k==0)a.x=obj->size;else if(k==1)a.y=obj->size;else a.z=obj->size;
        g3_rotate_delta_vec(&r,&a);axis[k*3]=f2fl(r.x);axis[k*3+1]=f2fl(r.y);axis[k*3+2]=-f2fl(r.z);
    }
    g3s_lrgb light={F1_0,F1_0,F1_0};
    if(obj->segnum>=0)light=compute_object_light(obj,NULL);
    GLboolean cull=glIsEnabled(GL_CULL_FACE),depth=glIsEnabled(GL_DEPTH_TEST),blend=glIsEnabled(GL_BLEND);
    glDisable(GL_CULL_FACE);glEnable(GL_DEPTH_TEST);glDisable(GL_BLEND);af_bind(2);glUseProgram(ap_program);
    glUniformMatrix3fv(ap_axis,1,GL_FALSE,axis);glUniform3f(ap_origin,f2fl(pt.p3_x),f2fl(pt.p3_y),-f2fl(pt.p3_z));
    glUniform3f(ap_light,.55f+.5f*fminf(1.5f,f2fl(light.r)),.55f+.5f*fminf(1.5f,f2fl(light.g)),.55f+.5f*fminf(1.5f,f2fl(light.b)));
    glUniform1f(ap_time,clock);glUniform4fv(ap_flash,1,astra_flash);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    glVertexPointer(3,GL_FLOAT,44,ap_data[id]);glColorPointer(4,GL_FLOAT,44,ap_data[id]+3);glTexCoordPointer(4,GL_FLOAT,44,ap_data[id]+7);
    glDrawArrays(GL_TRIANGLES,0,ap_count[id]);
    glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_TEXTURE_COORD_ARRAY);
    glUseProgram(0);if(cull)glEnable(GL_CULL_FACE);if(!depth)glDisable(GL_DEPTH_TEST);if(blend)glEnable(GL_BLEND);
    g3_done_instance();
    ap_draws++;EM_ASM(Module.pickupDraws=$0;Module.pickupCoverage[$1]=true;,ap_draws,id);
    return 1;
}
