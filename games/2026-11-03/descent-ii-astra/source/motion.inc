/* Render-only machinery and weapon geometry. Never consumes the simulation RNG. */
#include "laser.h"
#include "weapon.h"
typedef struct {float p[3],n[3],color[4];} ax_vertex;
static ax_vertex ax_vertices[18000];
static int ax_count,ax_failed,ax_enabled=-1;
static GLuint ax_program;
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
        const char *fs="precision highp float;varying highp vec3 p,n,q;varying mediump vec4 color;uniform float opacity,clock;void main(){vec3 N=normalize(n),V=normalize(-p),L=normalize(vec3(-.5,.8,.7));float spec=pow(max(dot(N,normalize(V+L)),0.),48.);float flow=.68+.32*sin(q.x*17.+sin(q.z*13.+clock*7.)+q.y*12.);float emit=color.a*mix(1.,flow,step(1.4,color.a));vec3 c=color.rgb*(.28+1.05*max(dot(N,L),0.)+emit)+vec3(.4,.52,.6)*spec*(1.-min(.8,color.a));gl_FragColor=vec4(c/(1.+.27*c),opacity);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){ax_failed=1;return;}
        ax_program=glCreateProgram();glAttachShader(ax_program,v);glAttachShader(ax_program,f);glLinkProgram(ax_program);glDeleteShader(v);glDeleteShader(f);
        GLint ok;glGetProgramiv(ax_program,GL_LINK_STATUS,&ok);if(!ok){ax_failed=1;fprintf(stderr,"Astra motion shader failed\n");return;}
    }
    float axis[9];for(int k=0;k<3;k++){vms_vector a={0,0,0},r;if(k==0)a.x=fl2f(scale);else if(k==1)a.y=fl2f(scale);else a.z=fl2f(scale);g3_rotate_delta_vec(&r,&a);axis[3*k]=f2fl(r.x);axis[3*k+1]=f2fl(r.y);axis[3*k+2]=-f2fl(r.z);}
    g3s_point p;vms_vector zero={0};g3_rotate_point(&p,&zero);
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;
    GLboolean cull=glIsEnabled(GL_CULL_FACE),depth=glIsEnabled(GL_DEPTH_TEST);glDisable(GL_CULL_FACE);glEnable(GL_DEPTH_TEST);
    gr_settransblend(GR_FADE_OFF,GR_BLEND_NORMAL);glDepthMask(opacity>.99f?GL_TRUE:GL_FALSE);
    glUseProgram(ax_program);glUniformMatrix3fv(glGetUniformLocation(ax_program,"axis"),1,GL_FALSE,axis);
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
      case PLASMA_ID:case PLAYER_SMART_HOMING_ID:case ROBOT_SMART_HOMING_ID:ax_paint(.12f,1,.35f,1.7f);break;
      case FUSION_ID:ax_paint(.80f,.16f,1,1.7f);break;
      case SPREADFIRE_ID:case SILENT_SPREADFIRE_ID:case HELIX_ID:ax_paint(1,.38f,.065f,1.65f);break;
      case PHOENIX_ID:ax_paint(1,.13f,.075f,1.7f);break;
      case OMEGA_ID:ax_paint(.20f,.61f,1,1.75f);break;
      case VULCAN_ID:case GAUSS_ID:ax_paint(1,.72f,.25f,1.25f);break;
      default:if(enemy)ax_paint(1,.22f,.10f,1.5f);else if(id==2||id==30)ax_paint(.14f,.56f,1,1.6f);else if(id==1||id==31)ax_paint(.15f,1,.61f,1.6f);else ax_paint(1,.14f,.08f,1.6f);
    }
}
int astra_draw_weapon(object *obj){
    if(!ax_on()||obj->type!=OBJ_WEAPON||obj->id>=N_weapon_types)return 0;
    if(obj->render_type==RT_NONE&&obj->id!=VULCAN_ID&&obj->id!=GAUSS_ID)return 0;
    int id=obj->id,missile=obj->render_type==RT_POLYOBJ&&Weapon_info[id].matter;
    if(is_proximity_bomb_or_smart_mine(id)||id==PMINE_ID)return 0;
    g3s_point view;g3_rotate_point(&view,&obj->pos);
    if(view.p3_z<F1_0/4)return missile?0:1;
    float age=fmaxf(0,(double)(GameTime64-obj->ctype.laser_info.creation_time)/F1_0);
    float clock=f2fl((fix)(GameTime64%(F1_0*2000))),phase=clock*15+obj->signature;
    float speed=f2fl(vm_vec_mag_quick(&obj->mtype.phys_info.velocity));
    float radius=fminf(.7f,fmaxf(.14f,f2fl(obj->size)*.38f));
    float tail=fminf(age*speed,fminf(7.f,1.2f+speed*.025f));
    int enemy=obj->ctype.laser_info.parent_type==OBJ_ROBOT;
    g3_start_instance_matrix(&obj->pos,&obj->orient);ax_count=0;ax_weapon_color(id,enemy);
    if(missile){
        polymodel *pm=&Polygon_models[obj->rtype.pobj_info.model_num];float rear=f2fl(pm->mins.z);
        radius=fminf(.45f,fmaxf(.12f,f2fl(obj->size)*.17f));
        ax_paint(.08f,.52f,1,1.7f);ax_tube(0,0,rear,0,0,rear-1.2f-tail*.5f,radius,0,12);
        for(int i=0;i<3;i++){float z=rear-.25f-i*.35f;ax_ring(0,0,z,radius*(.9f-i*.17f),radius*.10f,phase+i,6.28f,0);}
    }else if(id==OMEGA_ID){
        float p[3]={0,0,.2f};for(int i=1;i<=7;i++){float z=-i*.36f,x=sinf(phase+i*17)*.13f,y=cosf(phase*1.3f+i*21)*.13f;ax_tube(p[0],p[1],p[2],x,y,z,.035f,.035f,5);p[0]=x;p[1]=y;p[2]=z;}
    }else if(id==PLASMA_ID||id==FUSION_ID||id==PHOENIX_ID||id==PLAYER_SMART_HOMING_ID||id==ROBOT_SMART_HOMING_ID){
        float r=radius*(id==FUSION_ID?1.3f:1);ax_orb(r,id==FUSION_ID?1.65f:1);
        for(int k=0;k<3;k++)ax_ring(0,0,0,r*1.22f,r*.055f,phase*(k&1?-1:1)+k,4.2f,k);
        ax_tube(0,0,-r,0,0,-tail,r*.38f,0,10);
    }else{
        float r=id==VULCAN_ID?.038f:id==GAUSS_ID?.065f:radius*.36f;
        ax_tube(0,0,.55f,0,0,-tail,r*.25f,r,10);ax_tube(0,0,-tail,0,0,-tail-.6f,r,0,10);
        if(id==HELIX_ID||id==GAUSS_ID||id>=30){for(int k=0;k<2;k++)ax_ring(0,0,-.25f-k*.65f,r*2.4f,r*.22f,phase+k,5,0);}
    }
    ax_flush(1,1);g3_done_instance();
    EM_ASM(Module.weaponEffects=(Module.weaponEffects||0)+1;Module.weaponEffectCoverage=Module.weaponEffectCoverage||{};Module.weaponEffectCoverage[$0]=true;Module[$1?'enemyWeaponEffects':'playerWeaponEffects']=(Module[$1?'enemyWeaponEffects':'playerWeaponEffects']||0)+1;,id,enemy);
    return !missile;
}
