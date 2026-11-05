/* Render-only machinery and weapon geometry. Never consumes the simulation RNG. */
#include "laser.h"
#include "weapon.h"
#include "fvi.h"
typedef struct {float p[3],n[3],color[4];} ax_vertex;
static ax_vertex ax_vertices[18000];
static int ax_count,ax_failed,ax_enabled=-1;
static GLuint ax_program;
static int ax_energy;
static float ax_color[4];
static fix64 ax_fired[MAX_OBJECTS];
static int ax_signature[MAX_OBJECTS];
static int ax_on(void){if(ax_enabled<0)ax_enabled=EM_ASM_INT(return !!Module.astra);return ax_enabled;}
static void ax_paint(float r,float g,float b,float glow){ax_color[0]=r;ax_color[1]=g;ax_color[2]=b;ax_color[3]=glow;}
static void ax_vertex_add(float x,float y,float z,float nx,float ny,float nz){
    if(ax_count>=18000)return;ax_vertex *v=&ax_vertices[ax_count++];
    v->p[0]=x;v->p[1]=y;v->p[2]=z;v->n[0]=nx;v->n[1]=ny;v->n[2]=nz;memcpy(v->color,ax_color,sizeof ax_color);
}
/* A closed tapered tube, with a stable local frame even for vertical arcs. */
static void ax_tube(float x,float y,float z,float X,float Y,float Z,float r,float R,int sides){
    float d[3]={X-x,Y-y,Z-z},u[3],v[3];float len=sqrtf(d[0]*d[0]+d[1]*d[1]+d[2]*d[2]);if(len<.0001f)return;
    for(int k=0;k<3;k++)d[k]/=len;
    if(fabsf(d[1])<.9f){u[0]=d[2];u[1]=0;u[2]=-d[0];}else{u[0]=0;u[1]=-d[2];u[2]=d[1];}
    len=sqrtf(u[0]*u[0]+u[1]*u[1]+u[2]*u[2]);for(int k=0;k<3;k++)u[k]/=len;
    v[0]=d[1]*u[2]-d[2]*u[1];v[1]=d[2]*u[0]-d[0]*u[2];v[2]=d[0]*u[1]-d[1]*u[0];
    const int idx[]={0,1,2,0,2,3};
    for(int i=0;i<sides;i++){
        float n[2][3];for(int j=0;j<2;j++){float a=(i+j)*6.2831853f/sides;for(int k=0;k<3;k++)n[j][k]=u[k]*cosf(a)+v[k]*sinf(a);}
        for(int j=0;j<6;j++){int q=idx[j],end=q>=2,edge=q==1||q==2;float rad=end?R:r;
            ax_vertex_add((end?X:x)+rad*n[edge][0],(end?Y:y)+rad*n[edge][1],(end?Z:z)+rad*n[edge][2],n[edge][0],n[edge][1],n[edge][2]);}
        for(int end=0;end<2;end++){float rad=end?R:r;float cx=end?X:x,cy=end?Y:y,cz=end?Z:z,sg=end?1:-1;
            ax_vertex_add(cx,cy,cz,sg*d[0],sg*d[1],sg*d[2]);
            for(int j=0;j<2;j++)ax_vertex_add(cx+rad*n[j][0],cy+rad*n[j][1],cz+rad*n[j][2],sg*d[0],sg*d[1],sg*d[2]);}
    }
}
static void ax_ring(float cx,float cy,float cz,float r,float tube,float start,float span,int plane){
    int steps=(int)(fabsf(span)*4)+4;
    for(int i=0;i<steps;i++){
        float a=start+span*i/steps,b=start+span*(i+1)/steps;
        float p[3]={cosf(a)*r,sinf(a)*r,0},q[3]={cosf(b)*r,sinf(b)*r,0};
        if(plane==1){p[2]=p[1];p[1]=0;q[2]=q[1];q[1]=0;}
        if(plane==2){p[2]=p[0];p[0]=0;q[2]=q[0];q[0]=0;}
        ax_tube(cx+p[0],cy+p[1],cz+p[2],cx+q[0],cy+q[1],cz+q[2],tube,tube,5);
    }
}
static void ax_orb(float radius,float stretch){
    const int order[]={0,1,2,0,2,3};
    for(int y=0;y<12;y++)for(int x=0;x<20;x++)for(int j=0;j<6;j++){
        int k=order[j];float a=(x+(k==1||k==2))*6.2831853f/20,b=(y+(k>=2))*3.14159265f/12;
        float nx=cosf(a)*sinf(b),ny=cosf(b),nz=sinf(a)*sinf(b);
        ax_vertex_add(nx*radius,ny*radius,nz*radius*stretch,nx,ny,nz/stretch);
    }
}
static void ax_arc(float radius,float phase,float clock,int plane,float thickness){
    float prev[3]={0};
    for(int i=0;i<=12;i++){
        float a=phase+i*.12f,noise=sinf(i*19.7f+floorf(clock*13)*11.31f+phase)*.08f;
        float p[3]={cosf(a)*(radius+noise),sinf(a)*(radius+noise),sinf(i*9.1f+clock*7)*.055f};
        if(plane==1){float t=p[1];p[1]=p[2];p[2]=t;}
        if(plane==2){float t=p[0];p[0]=p[2];p[2]=t;}
        if(i)ax_tube(prev[0],prev[1],prev[2],p[0],p[1],p[2],thickness,thickness,5);
        memcpy(prev,p,sizeof p);
    }
}
static void ax_flush(float scale,float opacity){
    if(!ax_count||ax_failed)return;
    if(!ax_program){
        const char *vs="varying highp vec3 p,n,q;varying mediump vec4 color;uniform mat3 axis;uniform vec3 origin;void main(){q=gl_Vertex.xyz;p=axis*q+origin;n=normalize(axis*(gl_Normal));color=gl_Color;gl_Position=gl_ProjectionMatrix*vec4(p,1.);}";
        const char *fs="precision highp float;varying highp vec3 p,n,q;varying mediump vec4 color;uniform float opacity,clock,energy;void main(){vec3 N=normalize(n),V=normalize(-p),L=normalize(vec3(-.5,.8,.7));float spec=pow(max(dot(N,normalize(V+L)),0.),48.);float flow=.68+.32*sin(q.x*17.+sin(q.z*13.+clock*7.)+q.y*12.);float emit=color.a*mix(1.,flow,step(1.4,color.a));vec3 c=color.rgb*(.28+1.05*max(dot(N,L),0.)+emit)+vec3(.4,.52,.6)*spec*(1.-min(.8,color.a));if(energy>1.5){float facing=max(0.,dot(N,V));float glow=.18+.65*pow(facing,.8)+.13*max(dot(N,normalize(vec3(-.4,.6,1.))),0.)+.04*flow;gl_FragColor=vec4(color.rgb*glow,opacity);}else if(energy>.5){float rim=pow(max(0.,dot(N,V)),.6);gl_FragColor=vec4(color.rgb*(.24+.50*rim+.30*flow),opacity*rim*.8);}else gl_FragColor=vec4(c/(1.+.27*c),opacity);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){ax_failed=1;return;}
        ax_program=glCreateProgram();glAttachShader(ax_program,v);glAttachShader(ax_program,f);glLinkProgram(ax_program);glDeleteShader(v);glDeleteShader(f);
        GLint ok;glGetProgramiv(ax_program,GL_LINK_STATUS,&ok);if(!ok){ax_failed=1;fprintf(stderr,"Astra motion shader failed\n");return;}
    }
    float axis[9];for(int k=0;k<3;k++){vms_vector a={0,0,0},r;if(k==0)a.x=fl2f(scale);else if(k==1)a.y=fl2f(scale);else a.z=fl2f(scale);g3_rotate_delta_vec(&r,&a);axis[3*k]=f2fl(r.x);axis[3*k+1]=f2fl(r.y);axis[3*k+2]=-f2fl(r.z);}
    g3s_point p;vms_vector zero={0};g3_rotate_point(&p,&zero);
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;
    GLboolean cull=glIsEnabled(GL_CULL_FACE),depth=glIsEnabled(GL_DEPTH_TEST);glDisable(GL_CULL_FACE);glEnable(GL_DEPTH_TEST);
    gr_settransblend(GR_FADE_OFF,GR_BLEND_NORMAL);glDepthMask((!ax_energy||ax_energy==2)&&opacity>.99f?GL_TRUE:GL_FALSE);
    glUseProgram(ax_program);glUniform1f(glGetUniformLocation(ax_program,"energy"),ax_energy);glUniformMatrix3fv(glGetUniformLocation(ax_program,"axis"),1,GL_FALSE,axis);
    glUniform3f(glGetUniformLocation(ax_program,"origin"),f2fl(p.p3_x),f2fl(p.p3_y),-f2fl(p.p3_z));glUniform1f(glGetUniformLocation(ax_program,"opacity"),opacity);glUniform1f(glGetUniformLocation(ax_program,"clock"),SDL_GetTicks()*.001f);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_NORMAL_ARRAY);glEnableClientState(GL_COLOR_ARRAY);
    glVertexPointer(3,GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].p);glNormalPointer(GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].n);glColorPointer(4,GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].color);
    glDrawArrays(GL_TRIANGLES,0,ax_count);glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_NORMAL_ARRAY);glDisableClientState(GL_COLOR_ARRAY);
    glUseProgram(0);glDepthMask(GL_TRUE);if(cull)glEnable(GL_CULL_FACE);if(!depth)glDisable(GL_DEPTH_TEST);gr_settransblend(fade,blend);ax_count=0;
}
void astra_pickup_arcs(int id,float clock,float scale){
    if(!ax_on())return;ax_count=0;
    int energy=id==1||id==2||id==7||id==23||id==24||id==32||id==34;
    if(id==1)ax_paint(1,.58f,.055f,1.45f);else if(id==2||id==4)ax_paint(.08f,.52f,1,1.5f);else if(id==5)ax_paint(1,.12f,.09f,1.3f);else if(id==6)ax_paint(1,.75f,.12f,1.3f);else ax_paint(.06f,.88f,.95f,1.35f);
    if(energy){for(int k=0;k<3;k++)ax_arc(.81f,clock*(k&1?-1.3f:1.6f)+k*2.1f,clock,k,.009f);}
    else {ax_ring(0,-.72f,0,.68f,.013f,clock*1.9f+id,1.6f,1);ax_ring(0,-.72f,0,.68f,.013f,clock*1.9f+id+3.14f,1.6f,1);
        if(id!=50&&id%3==0)ax_arc(.83f,-clock*1.25f+id,clock,0,.007f);}
    ax_flush(scale,1);EM_ASM(Module.pickupAnimationVersion=10;);
}
void astra_visual_fired(int parent){
    if(parent<0||parent>=MAX_OBJECTS||!ax_on())return;
    ax_fired[parent]=GameTime64;ax_signature[parent]=Objects[parent].signature;
}
/* Real animated gun anchors: machinery follows D2's articulated joints. */
void astra_draw_mechanisms(object *obj){
    if(!ax_on()||obj->type!=OBJ_ROBOT||obj->ctype.ai_info.CLOAKED||obj->flags&OF_EXPLODING)return;
    g3s_point view;g3_rotate_point(&view,&obj->pos);if(view.p3_z<i2f(1)||view.p3_z>i2f(210))return;
    robot_info *ri=&Robot_info[obj->id];float clock=f2fl((fix)(GameTime64%(F1_0*2000))),phase=clock*(2.1f+obj->id%5*.4f)+obj->signature;
    int index=obj-Objects;float fired=100;
    if(index>=0&&index<MAX_OBJECTS&&ax_signature[index]==obj->signature)fired=(double)(GameTime64-ax_fired[index])/F1_0;
    float recoil=fired<.26f?.30f*expf(-fired*15):0,scale=fminf(.85f,fmaxf(.24f,f2fl(obj->size)*.14f));
    for(int g=0;g<ri->n_guns&&g<4;g++){
        vms_vector muzzle;calc_gun_point(&muzzle,obj,g);g3_start_instance_matrix(&muzzle,&obj->orient);ax_count=0;
        ax_paint(.19f,.25f,.29f,0);ax_tube(0,0,-.75f,0,0,-.07f-recoil,.46f,.36f,16);
        ax_paint(.45f,.55f,.61f,0);ax_ring(0,0,-.32f-recoil,.38f,.06f,0,6.2831853f,0);
        for(int b=0;b<3;b++){float a=phase*(obj->id%2?-1:1)+b*2.0944f,x=cosf(a)*.25f,y=sinf(a)*.25f;
            ax_paint(.26f,.33f,.38f,0);ax_tube(x,y,-.55f-recoil,x,y,.05f-recoil,.082f,.070f,8);
            ax_paint(.09f,.72f,.94f,.9f);ax_tube(x,y,-.49f-recoil,x,y,-.37f-recoil,.086f,.086f,8);
        }
        if(fired<.12f){ax_paint(.19f,.65f,1,1.8f);ax_tube(0,0,.05f,0,0,.70f*(1-fired/.12f),.22f,0,10);}
        ax_flush(scale,1);g3_done_instance();
    }
    /* Two cooling louvers open independently across the rear upper hull. */
    polymodel *pm=&Polygon_models[obj->rtype.pobj_info.model_num];
    float ex=f2fl(pm->maxs.x-pm->mins.x)*.5f,top=f2fl(pm->maxs.y),rear=f2fl(pm->mins.z)*.68f;
    g3_start_instance_matrix(&obj->pos,&obj->orient);ax_count=0;
    for(int side=-1;side<=1;side+=2)for(int k=0;k<3;k++){
        float x=side*ex*.48f,y=top*.92f,z=rear+k*scale*.52f,open=.15f+.16f*(.5f+.5f*sinf(clock*1.9f+k+side));
        ax_paint(.18f,.25f,.29f,0);ax_tube(x-scale*.65f,y,z,x+scale*.65f,y+scale*open,z+scale*.16f,scale*.12f,scale*.12f,4);
        ax_paint(.06f,.63f,.84f,.65f);ax_tube(x-scale*.48f,y-scale*.02f,z,x+scale*.48f,y-scale*.02f,z,scale*.035f,scale*.035f,5);
    }
    ax_flush(1,1);
    if(obj->shields<ri->strength/3&&((int)(clock*5)+obj->signature)%7<2){ax_count=0;ax_paint(.24f,.64f,1,1.5f);ax_arc(.77f,phase,clock,0,.009f);ax_flush(f2fl(obj->size),1);}
    g3_done_instance();EM_ASM(Module.mechanismDraws=(Module.mechanismDraws||0)+1;);
}
static void ax_weapon_color(int id,int enemy){
    switch(id){
      /* Original HAM polygon colors, including every in-game upgrade. */
      case LASER_ID_L1:ax_paint(1,0,0,1.6f);break;
      case LASER_ID_L2:ax_paint(28.f/31,0,28.f/31,1.6f);break;
      case LASER_ID_L3:ax_paint(14.f/31,14.f/31,1,1.6f);break;
      case LASER_ID_L4:ax_paint(0,28.f/31,0,1.6f);break;
      case LASER_ID_L5:ax_paint(1,24.f/31,0,1.6f);break;
      case LASER_ID_L6:ax_paint(27.f/31,27.f/31,27.f/31,1.6f);break;
      case PLASMA_ID:case PLAYER_SMART_HOMING_ID:case ROBOT_SMART_HOMING_ID:ax_paint(.12f,1,.35f,1.7f);break;
      case FUSION_ID:ax_paint(.80f,.16f,1,1.7f);break;
      case SPREADFIRE_ID:case SILENT_SPREADFIRE_ID:case HELIX_ID:ax_paint(1,.38f,.065f,1.65f);break;
      case PHOENIX_ID:ax_paint(1,.13f,.075f,1.7f);break;
      case OMEGA_ID:ax_paint(.20f,.61f,1,1.75f);break;
      case VULCAN_ID:case GAUSS_ID:ax_paint(1,.72f,.25f,1.25f);break;
      default:if(enemy)ax_paint(1,.22f,.10f,1.5f);else ax_paint(1,.14f,.08f,1.6f);
    }
}
/* View-facing optical samples distributed in three dimensions. The particles
 * depth-test against the mine, never write depth, and use no simulation RNG. */
static void af_particle(float x,float y,float z,float radius,float alpha,float seed){
    vms_vector pos={fl2f(x),fl2f(y),fl2f(z)};g3s_point p;g3_rotate_point(&p,&pos);
    if(p.p3_z<F1_0/5)return;
    float near=fminf(1,fmaxf(0,(f2fl(p.p3_z)/f2fl(Matrix_scale.z)-.3f)/3.f));
    float sx=radius*f2fl(Matrix_scale.x),sy=radius*f2fl(Matrix_scale.y);
    const int order[]={0,1,2,0,2,3};ax_color[3]=alpha*near;
    for(int j=0;j<6;j++){int k=order[j];float u=k==1||k==2?1:-1,v=k>=2?1:-1;
        ax_vertex_add(f2fl(p.p3_x)+u*sx,f2fl(p.p3_y)+v*sy,-f2fl(p.p3_z),u,v,seed);}
}
static void af_beam(float x,float y,float z,float X,float Y,float Z,float radius,float alpha,float seed){
    vms_vector a={fl2f(x),fl2f(y),fl2f(z)},b={fl2f(X),fl2f(Y),fl2f(Z)};g3s_point A,B;g3_rotate_point(&A,&a);g3_rotate_point(&B,&b);
    float scale[3]={f2fl(Matrix_scale.x),f2fl(Matrix_scale.y),f2fl(Matrix_scale.z)};
    float p[3]={f2fl(A.p3_x)/scale[0],f2fl(A.p3_y)/scale[1],f2fl(A.p3_z)/scale[2]},q[3]={f2fl(B.p3_x)/scale[0],f2fl(B.p3_y)/scale[1],f2fl(B.p3_z)/scale[2]};
    if(p[2]<.35f&&q[2]<.35f)return;
    for(int end=0;end<2;end++){float *v=end?q:p,*w=end?p:q;if(v[2]<.35f){float t=(.35f-v[2])/(w[2]-v[2]);for(int k=0;k<3;k++)v[k]+=(w[k]-v[k])*t;}}
    float d[3]={q[0]-p[0],q[1]-p[1],q[2]-p[2]},u[3]={d[1]*p[2]-d[2]*p[1],d[2]*p[0]-d[0]*p[2],d[0]*p[1]-d[1]*p[0]};
    float mag=sqrtf(u[0]*u[0]+u[1]*u[1]+u[2]*u[2]);if(mag<.0001f){u[0]=1;u[1]=u[2]=0;mag=1;}
    for(int k=0;k<3;k++)u[k]*=radius/mag;
    const int order[]={0,1,2,0,2,3};ax_color[3]=alpha;
    for(int j=0;j<6;j++){int k=order[j],end=k>=2;float sign=k==1||k==2?1:-1,*v=end?q:p;
        ax_vertex_add((v[0]+sign*u[0])*scale[0],(v[1]+sign*u[1])*scale[1],-(v[2]+sign*u[2])*scale[2],sign,end,seed);}
}
static void af_flush_tinted(float clock,int style,int preserve_hue){
    /* This include and the robot renderer share a translation unit.
     * Keep particle shader ownership local to the batch that uses it. */
    static GLuint particle_program = 0;
    static int particle_failed = 0;
    if(!ax_count||particle_failed)return;
    if(!particle_program){
        const char *vs="varying highp vec3 uv;varying mediump vec4 tint;void main(){gl_Position=ftransform();uv=gl_Normal;tint=gl_Color;}";
        const char *fs=
          "precision highp float;varying highp vec3 uv;varying mediump vec4 tint;uniform float clock,style,preserveHue;"
          "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}"
          "float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}"
          "void main(){if(style>.5&&style<1.5){float edge=exp(-uv.x*uv.x*6.)*(1.-smoothstep(.8,1.,abs(uv.x)));float core=exp(-uv.x*uv.x*60.);float flow=.88+.12*sin(uv.y*38.-clock*36.+uv.z);gl_FragColor=vec4(mix(tint.rgb,vec3(.9,.96,1.),core*mix(.78,.16,preserveHue)),tint.a*edge*flow);return;}"
          "float r=length(uv.xy);if(r>1.)discard;float a=uv.z+clock*.7;mat2 turn=mat2(cos(a),sin(a),-sin(a),cos(a));vec2 p=turn*uv.xy;"
          "float grain=noise(p*5.+vec2(uv.z,clock*1.4));grain=.68*grain+.32*noise(p*13.-clock*2.);"
          "float cloud=(1.-smoothstep(.12,1.,r))*(.28+.72*grain);float core=exp(-r*r*24.);"
          "vec3 c=mix(tint.rgb,vec3(.94,.97,1.),core*mix(.45,.12,preserveHue));float alpha=(cloud*.68+core*.6)*tint.a;"
          "if(style>1.5){c=tint.rgb*(.55+.6*grain);alpha=cloud*tint.a;}"
          "if(alpha<.003)discard;gl_FragColor=vec4(c,alpha);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){particle_failed=1;return;}
        particle_program=glCreateProgram();glAttachShader(particle_program,v);glAttachShader(particle_program,f);glLinkProgram(particle_program);glDeleteShader(v);glDeleteShader(f);
        GLint ok;glGetProgramiv(particle_program,GL_LINK_STATUS,&ok);if(!ok){particle_failed=1;fprintf(stderr,"Astra weapon particles failed\n");return;}
    }
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;
    GLboolean cull=glIsEnabled(GL_CULL_FACE),depth=glIsEnabled(GL_DEPTH_TEST);glDisable(GL_CULL_FACE);glEnable(GL_DEPTH_TEST);
    gr_settransblend(GR_FADE_OFF,style==2?GR_BLEND_NORMAL:GR_BLEND_ADDITIVE_A);glDepthMask(GL_FALSE);glUseProgram(particle_program);
    glUniform1f(glGetUniformLocation(particle_program,"clock"),clock);
    glUniform1f(glGetUniformLocation(particle_program,"style"),style);
    glUniform1f(glGetUniformLocation(particle_program,"preserveHue"),preserve_hue);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_NORMAL_ARRAY);glEnableClientState(GL_COLOR_ARRAY);
    glVertexPointer(3,GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].p);glNormalPointer(GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].n);glColorPointer(4,GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].color);
    glDrawArrays(GL_TRIANGLES,0,ax_count);glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_NORMAL_ARRAY);glDisableClientState(GL_COLOR_ARRAY);
    glUseProgram(0);glDepthMask(GL_TRUE);if(cull)glEnable(GL_CULL_FACE);if(!depth)glDisable(GL_DEPTH_TEST);gr_settransblend(fade,blend);ax_count=0;
}

static void af_flush(float clock,int style){af_flush_tinted(clock,style,0);}

/* A visual record of the native Omega hit. Two emitters share that hit: no
 * second weapon, collision, energy debit, damage calculation or random draw. */
typedef struct {int parent,signature;fix64 time;vms_vector goal;} af_omega;
static af_omega af_omegas[16];
void astra_omega_fired(object *parent,vms_vector *goal){
    if(!ax_on())return;int num=parent-Objects;if(num<0||num>=MAX_OBJECTS)return;
    af_omega *e=&af_omegas[num%16];e->parent=num;e->signature=parent->signature;e->goal=*goal;e->time=GameTime64;
}
static void af_omega_arc(vms_vector *start,vms_vector *goal,int seed,float clock){
    vms_vector dir;vm_vec_sub(&dir,goal,start);float length=f2fl(vm_vec_normalize(&dir));if(length<.1f)return;
    vms_matrix basis;vm_vector_2_matrix(&basis,&dir,NULL,NULL);g3_start_instance_matrix(start,&basis);
    int steps=(int)fminf(96,fmaxf(8,length/1.2f));float phase=floorf(clock*24)+seed*11.7f;
    {
        ax_count=0;ax_paint(.12f,.48f,1,1);
        float px=0,py=0,pz=0;
        for(int i=1;i<=steps;i++){
            float t=(float)i/steps,z=t*length,envelope=sinf(t*3.14159265f);
            float x=sinf(i*17.17f+phase)*.6f*envelope,y=cosf(i*13.7f+phase*1.9f)*.5f*envelope;
            af_beam(px,py,pz,x,y,z,.29f,.87f,seed+i);
            if(i%7==0)af_beam(x,y,z,x+sinf(i+phase)*1.25f,y+cosf(i*2+phase)*1.25f,z-2,.10f,.46f,seed+i);
            px=x;py=y;pz=z;
        }
        af_flush(clock,1);
    }
    ax_energy=0;ax_count=0;ax_paint(.10f,.43f,1,1);
    for(int i=1;i<steps;i++){float t=(float)i/steps;af_particle(sinf(i*17.17f+phase)*.6f*sinf(t*3.14159265f),cosf(i*13.7f+phase*1.9f)*.5f*sinf(t*3.14159265f),t*length,.40f,.26f,seed+i);}
    af_particle(0,0,.6f,.75f,.6f,seed);af_flush(clock,0);g3_done_instance();
}
void astra_render_omega(int window_num){
    if(!ax_on()||window_num)return;
    for(int n=0;n<16;n++){
        af_omega *e=&af_omegas[n];if(!e->time||GameTime64<e->time||GameTime64-e->time>F1_0/10)continue;
        object *p=&Objects[e->parent];if(p->signature!=e->signature||p->type!=OBJ_PLAYER)continue;
        vms_matrix transpose;vm_copy_transpose_matrix(&transpose,&p->orient);
        for(int gun=0;gun<2;gun++){vms_vector muzzle;vm_vec_rotate(&muzzle,&Player_ship->gun_points[gun],&transpose);vm_vec_add2(&muzzle,&p->pos);af_omega_arc(&muzzle,&e->goal,gun+p->signature,SDL_GetTicks()*.001f);}
        EM_ASM(Module.omegaEmitters=2;Module.omegaVisualEvents=(Module.omegaVisualEvents||0)+1;);
    }
}

int astra_weapon_missile(object *obj){
    /* Lasers and Fusion also use polygon models in the original HAM data. */
    return obj->type==OBJ_WEAPON&&obj->id!=FLARE_ID&&obj->id<N_weapon_types&&obj->render_type==RT_POLYOBJ&&Weapon_info[obj->id].matter;
}
/* Phoenix ricochets reverse velocity instantly. Grow a new visual trail only
 * along the current straight flight leg, and stop it at the mine wall. */
typedef struct {int signature;fix64 stamp;vms_vector pos,dir;float length;} af_phoenix_leg;
static af_phoenix_leg af_phoenix_legs[MAX_OBJECTS];
static float af_phoenix_tail(object *o,vms_vector *direction,float age,float speed){
    float length=fminf(3.4f,age*speed);
    if(o->segnum>=0){
        int index=o-Objects;if(index>=0&&index<MAX_OBJECTS){
            af_phoenix_leg *leg=&af_phoenix_legs[index];
            if(!leg->stamp||leg->signature!=o->signature||GameTime64<leg->stamp){
                leg->length=fminf(.6f,length);leg->signature=o->signature;leg->stamp=GameTime64;leg->pos=o->pos;leg->dir=*direction;
            }else if(GameTime64>leg->stamp){
                if(GameTime64-leg->stamp>F1_0/5||vm_vec_dot(&leg->dir,direction)<fl2f(.96f)){
                    leg->length=.08f;EM_ASM(Module.phoenixTrailResets=(Module.phoenixTrailResets||0)+1;);
                }else leg->length=fminf(3.4f,leg->length+f2fl(vm_vec_dist(&leg->pos,&o->pos)));
                leg->stamp=GameTime64;leg->pos=o->pos;leg->dir=*direction;
            }
            length=leg->length;
        }
        vms_vector end;vm_vec_scale_add(&end,&o->pos,direction,-fl2f(length));
        fvi_query query={&o->pos,&end,o->segnum,0,o-Objects,NULL,0};fvi_info hit;
        if(find_vector_intersection(&query,&hit)!=HIT_NONE){length=fmaxf(0,f2fl(vm_vec_dist(&o->pos,&hit.hit_pnt))-.12f);EM_ASM(Module.phoenixWallClips=(Module.phoenixWallClips||0)+1;);}
    }
    EM_ASM(Module.phoenixVisualVersion=16;Module.phoenixTrailLength=$0;,length);
    return length;
}

/* Flare cartridge, burning tail and spitting embers share the native projectile.
 * Put the burning end behind the point so it stays outside the wall on impact. */
static void af_flare(object *obj, float age, float speed, float clock, float depth)
{
    /* Limit the projected size as a charge crosses the cockpit or lands at the nose. */
    float scale=fminf(1.f,depth/20.f);
    float burn=fminf(1.f,fmaxf(0.f,f2fl(obj->lifeleft)*1.7f));
    float phase=age*9.f+(obj->signature & 255);
    float flicker=.88f+.12f*sinf(phase*1.7f)*cosf(phase*.93f);
    ax_count=0;ax_energy=0;
    ax_paint(.28f,.21f,.14f,.16f);
    ax_tube(0,0,.22f,0,0,-.66f,.14f,.24f,8);
    ax_paint(.92f,.33f,.035f,1.f);
    ax_tube(0,0,-.58f,0,0,-.82f,.26f,.25f,8);
    ax_paint(1.f,.80f*burn,.18f*burn,1.3f*burn);
    ax_tube(0,0,-.82f,0,0,-1.15f,.245f,.12f,7);
    ax_flush(scale,1);
    float heat=burn*flicker;
    ax_paint(1,.29f,.035f,1);
    af_particle(0,0,-.96f*scale,1.65f*scale,.56f*heat,phase);
    ax_paint(1,.80f,.27f,1);
    af_particle(0,0,-1.12f*scale,.62f*scale,.94f*heat,phase);
    float trail=fminf(2.7f,age*speed);
    for(int k=0;k<6;k++){
        float u=fmodf(age*2.1f+k/6.f,1.f),angle=2.4f*k+(obj->signature & 15);
        float spread=(speed>1.f?.29f:.75f)*u;
        ax_paint(1,.58f-.32f*u,.045f,1);
        af_particle(cosf(angle)*spread*scale,sinf(angle)*spread*scale,(-1.f-u*(.55f+trail))*scale,
                    (.15f+.11f*(1.f-u))*scale,heat*(1.f-u),angle);
    }
    af_flush_tinted(clock,0,1);
}

int astra_draw_weapon(object *obj){
    if(!ax_on()||obj->type!=OBJ_WEAPON||obj->id>=N_weapon_types)return 0;
    int id=obj->id,missile=astra_weapon_missile(obj);
    int laser=(id>=LASER_ID_L1&&id<=LASER_ID_L4)||id==LASER_ID_L5||id==LASER_ID_L6;
    if(is_proximity_bomb_or_smart_mine(id)||id==PMINE_ID)return 0;
    if(obj->render_type==RT_NONE&&id!=FLARE_ID&&id!=VULCAN_ID&&id!=GAUSS_ID)return 0;
    /* Player Omega is drawn once as a continuous paired discharge. */
    if(id==OMEGA_ID&&obj->ctype.laser_info.parent_type==OBJ_PLAYER)return 1;
    g3s_point view;g3_rotate_point(&view,&obj->pos);if(view.p3_z<F1_0/4)return missile?0:1;
    float age=fmaxf(0,(double)(GameTime64-obj->ctype.laser_info.creation_time)/F1_0),clock=SDL_GetTicks()*.001f;
    vms_vector velocity=obj->mtype.phys_info.velocity;float speed=f2fl(vm_vec_mag(&velocity));vms_matrix axis=obj->orient;
    if(!missile&&speed>.01f){vm_vec_normalize(&velocity);vm_vector_2_matrix(&axis,&velocity,NULL,NULL);}
    float tail=fminf(age*speed,fminf(9.f,1.5f+speed*.035f));
    if(id==PHOENIX_ID)tail=af_phoenix_tail(obj,&velocity,age,speed);
    int enemy=obj->ctype.laser_info.parent_type==OBJ_ROBOT;
    float radius=fminf(.65f,fmaxf(.32f,f2fl(Weapon_info[id].blob_size)*.38f));
    g3_start_instance_matrix(&obj->pos,&axis);
    if(id==FLARE_ID){
        af_flare(obj,age,speed,clock,f2fl(view.p3_z)/f2fl(Matrix_scale.z));
        EM_ASM({var f=Module.flareView||(Module.flareView={moving:0,stuck:0});
                f[$0?"moving":"stuck"]++;f.signature=$1;f.enemy=!!$2;},speed>.1f,obj->signature,enemy);
    }else if(missile){
        polymodel *pm=&Polygon_models[obj->rtype.pobj_info.model_num];float rear=f2fl(pm->mins.z);
        /* Collision radius is divided by length/width; use model dimensions. */
        float nozzle=fminf(.65f,fmaxf(.28f,f2fl(pm->maxs.x-pm->mins.x)*.45f));
        float length=fminf(age*speed+.6f,8.f+speed*.018f),phase=clock*11+obj->signature;
        ax_count=0;ax_paint(.25f,.28f,.31f,1);
        for(int i=17;i>=6;i--){float t=i/17.f;af_particle(sinf(i*2.39f-phase)*t*.4f,cosf(i*1.97f-phase)*t*.4f,rear-t*length*1.35f,nozzle*(1.5f+2.5f*t),.22f*(1-t),i+obj->signature);}
        af_flush(clock,2);ax_count=0;
        for(int i=23;i>=0;i--){
            float t=i/23.f;
            float z=rear-t*length,spread=t*t*.45f;
            float x=sinf(i*2.39f-phase)*spread,y=cosf(i*1.97f-phase*1.3f)*spread;
            float r=nozzle*(.95f+1.8f*t)*(1+.12f*sinf(i*3.1f-phase*2));
            if(id==SMART_ID)ax_paint(.23f+.4f*(1-t),.85f, .30f+.65f*(1-t),1);
            else if(id==MERCURY_ID||id==GUIDEDMISS_ID)ax_paint(.20f+.5f*(1-t),.44f+.4f*(1-t),1,1);
            else ax_paint(1,.22f+.68f*(1-t),.06f+.90f*powf(1-t,3),1);
            af_particle(x,y,z,r,(.16f+.30f*(1-t))*(1-t*t),obj->signature+i*.73f);
        }
        ax_paint(.50f,.78f,1,1);af_particle(0,0,rear-.18f,nozzle*1.3f,.85f,phase);af_flush(clock,0);
        EM_ASM(Module.missileExhaustVersion=14;Module.missileExhaustSamples=24;);
    }else if(id==PLASMA_ID){
        /* Every visible plasma component is round geometry. No billboard halo
         * or ribbon can turn into a flat green shape as the view changes. */
        float r=radius*.86f,near=fminf(1,fmaxf(0,(f2fl(view.p3_z)/f2fl(Matrix_scale.z)-.35f)/2.5f));
        ax_count=0;ax_energy=2;ax_paint(.035f,.94f,.19f,1.7f);ax_orb(r*.94f,1.12f);
        ax_flush(1,near);ax_energy=2;ax_count=0;
        for(int j=1;j<=4;j++){
            float u=j/4.f;int start=ax_count;
            ax_paint(.018f,.34f*(1-u*.7f),.09f,1);ax_orb(r*(.24f-.14f*u),1.1f);
            for(int v=start;v<ax_count;v++)ax_vertices[v].p[2]-=fminf(tail,1.25f)*u;
        }
        ax_flush(1,near);ax_energy=0;
        EM_ASM(Module.plasmaVisualVersion=19;Module.plasmaGeometryOnly=true;);
    }else if(id==PHOENIX_ID){
        /* Compact turbulent comet, without camera-crossing ribbons or a
         * rotating halo of separate lights. Ricochet flight remains native. */
        ax_count=0;ax_weapon_color(id,enemy);float r=fminf(.44f,radius);
        for(int j=9;j>=1;j--){float t=j/9.f;af_particle(0,0,-tail*t,r*(1.3f-.65f*t),.25f*(1-t),obj->signature+j*.73f);}
        af_particle(0,0,0,r*1.85f,.48f,obj->signature);
        af_particle(0,0,-r*.15f,r*.72f,.78f,obj->signature+21);
        af_flush_tinted(clock,0,1);
    }else{
        int blob=id==PLASMA_ID||id==FUSION_ID||id==PHOENIX_ID||id==PLAYER_SMART_HOMING_ID||id==ROBOT_SMART_HOMING_ID;
        float r=blob?radius*(id==FUSION_ID?1.5f:1):id==VULCAN_ID?.052f:id==GAUSS_ID?.095f:radius*.38f;
        ax_count=0;ax_weapon_color(id,enemy);
        af_beam(0,0,.25f,0,0,-fmaxf(.6f,tail),blob?r*.8f:r*2.8f,.88f,obj->signature);af_flush_tinted(clock,1,laser);
        ax_count=0;ax_weapon_color(id,enemy);
        af_particle(0,0,0,blob?r*2.4f:r*4,.82f,obj->signature);
        if(blob){af_particle(0,0,-r*.25f,r,.8f,obj->signature+21);}
        for(int j=1;j<=7;j++){
            float t=j/7.f,z=-tail*t,w=blob?r*(1.6f-t*.6f):r*(2.8f-t*1.5f);
            float spiral=blob?.12f*sinf(t*3.14f):.015f;
            af_particle(cosf(clock*12+j*2)*spiral,sinf(clock*12+j*2)*spiral,z,w,(1-t)*.24f,obj->signature+j);
        }
        if(id==FUSION_ID||id==PHOENIX_ID){
            for(int j=0;j<5;j++){float a=j*1.2566f+clock*9;af_particle(cosf(a)*r*.8f,sinf(a)*r*.8f,-r*.5f,r*.38f,.7f,obj->signature+j*5);}
        }
        af_flush_tinted(clock,0,laser);
    }
    g3_done_instance();
    EM_ASM(Module.weaponEffects=(Module.weaponEffects||0)+1;Module.weaponVisualVersion=19;Module.weaponEffectCoverage=Module.weaponEffectCoverage||{};Module.weaponEffectCoverage[$0]=true;Module.weaponEffectKinds=Module.weaponEffectKinds||{};Module.weaponEffectKinds[$0]=$2?'exhaust':'energy';Module[$1?'enemyWeaponEffects':'playerWeaponEffects']=(Module[$1?'enemyWeaponEffects':'playerWeaponEffects']||0)+1;,id,enemy,missile);
    return !missile;
}
