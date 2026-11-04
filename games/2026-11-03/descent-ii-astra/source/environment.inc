/* Astra mine refit. Bounded render-only decoration; native portals, collision,
 * secrets, destructible lights and simulation RNG remain authoritative. */
#include "wall.h"
#include "gameseg.h"
#include "fuelcen.h"
#include "gameseq.h"
enum { AE_MARKS=96 };
typedef struct {vms_vector p;int room,side;float size;fix64 born;unsigned seed;} ae_mark;
static ae_mark ae_marks[AE_MARKS];static unsigned ae_serial;
typedef struct {vms_vector p,normal;float size;fix64 born;int room;} ae_scrap;
static ae_scrap ae_scraps[48];static unsigned ae_scrap_serial;
static int ae_level=-999,ae_segments=-1;
static unsigned ae_faces,ae_machines,ae_doors,ae_reactors,ae_atmosphere;
extern float astra_mine_clock,astra_mine_door;
extern int astra_mine_wall,astra_mine_wall2;
static float ae_clock(void){if(astra_mine_clock>=0)return astra_mine_clock;return (double)(GameTime64%(F1_0*1800))/F1_0;}
void astra_environment_clear(void){memset(ae_marks,0,sizeof ae_marks);memset(ae_scraps,0,sizeof ae_scraps);}
void astra_environment_scrap(int room,const vms_vector *p,const vms_vector *normal,float size){
    ae_scraps[ae_scrap_serial++%48]=(ae_scrap){*p,*normal,size,GameTime64,room};
    EM_ASM(Module.environmentScraps=(Module.environmentScraps||0)+1;);
}
static void ae_reset(void){
    if(ae_level!=Current_level_num||ae_segments!=Highest_segment_index){
        astra_environment_clear();ae_level=Current_level_num;ae_segments=Highest_segment_index;
    }
}
/* Identity follows functional rooms, hazards and stable native material groups. */
static int ae_theme(int room){
    int special=Segment2s[room].special;
    if(special==SEGMENT_IS_FUELCEN||special==SEGMENT_IS_REPAIRCEN)return 2;
    if(special==SEGMENT_IS_CONTROLCEN||special==SEGMENT_IS_ROBOTMAKER)return 3;
    int rock=0,metal=0;
    for(int s=0;s<6;s++){
        int t=Segments[room].sides[s].tmap_num;if(t<0||t>=NumTextures)continue;
        if(TmapInfo[t].damage>0||TmapInfo[t].flags&TMI_VOLATILE)return 4;
        if(TmapInfo[t].flags&TMI_WATER)return 2;
        if(t<64)rock++;else metal++;
    }
    return rock>metal?0:1;
}
void astra_environment_material(int room,int side,int texture){
    ae_reset();int theme=ae_theme(room),kind=1;
    if(texture>=0&&texture<NumTextures){
        if(TmapInfo[texture].damage>0||TmapInfo[texture].flags&(TMI_WATER|TMI_VOLATILE))kind=4;
        else if(texture<64)kind=0;
        else if(theme==2)kind=2;
        else if((texture/7)%4==0)kind=3;
    }
    astra_surface[0]=kind;astra_surface[1]=theme;astra_surface[2]=ae_clock();
    astra_surface[3]=(texture*17%31)/31.f;
}
/* Record actual native wall hits, without changing damage or weapon behavior. */
void astra_environment_hit(int room,int side,const vms_vector *point,float size){
    if(!ax_on()||room<0||room>Highest_segment_index||side<0||side>5)return;
    ae_reset();segment *s=&Segments[room];int t=s->sides[side].tmap_num;
    if(s->sides[side].wall_num>=0||s->children[side]>=0||t<0||t>=NumTextures||
        TmapInfo[t].damage||TmapInfo[t].flags&(TMI_WATER|TMI_FORCE_FIELD|TMI_VOLATILE))return;
    for(int i=0;i<AE_MARKS;i++)if(ae_marks[i].born&&ae_marks[i].room==room&&ae_marks[i].side==side&&
        vm_vec_dist_quick(point,&ae_marks[i].p)<F1_0/2){ae_marks[i].born=GameTime64;return;}
    ae_mark *m=&ae_marks[ae_serial++%AE_MARKS];
    *m=(ae_mark){*point,room,side,fminf(2.6f,fmaxf(.35f,size)),GameTime64,ae_serial};
    EM_ASM(Module.environmentScars=(Module.environmentScars||0)+1;);
}
static int ae_basis(int,int,vms_vector*,vms_matrix*,float*,float*);
static void ae_wall_finish(int nv,const g3s_point **points,int room,int side,int frame){
    static GLuint program;static int failed;if(failed||nv<3||nv>4)return;
    float p[12],uv[8],marks[24]={0},mount[4]={0};int count=0;
    if(frame&&side%2==0&&(room+side)%3!=1){
        vms_vector c;vms_matrix b;float w,h;if(ae_basis(room,side,&c,&b,&w,&h)){
            vm_vec_scale_add2(&c,&b.rvec,fl2f(-w*.30f));vm_vec_scale_add2(&c,&b.uvec,fl2f(h*.20f));
            g3s_point q;g3_rotate_point(&q,&c);mount[0]=f2fl(q.p3_x);mount[1]=f2fl(q.p3_y);mount[2]=-f2fl(q.p3_z);mount[3]=fminf(1.45f,fminf(w,h)*.095f)*1.3f;
        }
    }
    for(int i=0;i<nv;i++){p[3*i]=f2fl(points[i]->p3_x);p[3*i+1]=f2fl(points[i]->p3_y);p[3*i+2]=-f2fl(points[i]->p3_z);uv[i*2]=(i==1||i==2);uv[i*2+1]=i>=2;}
    for(int i=AE_MARKS-1;i>=0&&count<6;i--){ae_mark *m=&ae_marks[i];float age=(double)(GameTime64-m->born)/F1_0;
        if(!m->born||age<0||age>180||m->room!=room||m->side!=side)continue;
        g3s_point v;g3_rotate_point(&v,&m->p);marks[count*4]=f2fl(v.p3_x);marks[count*4+1]=f2fl(v.p3_y);marks[count*4+2]=-f2fl(v.p3_z);marks[count*4+3]=m->size*(1-fmaxf(0,age-150)/30);count++;
    }
    if(!frame&&!count)return;
    if(!program){
        const char *vs="varying highp vec3 p;varying mediump vec2 uv;void main(){p=gl_Vertex.xyz;uv=gl_MultiTexCoord0.xy;gl_Position=ftransform();}";
        const char *fs="precision highp float;varying highp vec3 p;varying mediump vec2 uv;uniform vec4 marks[6],mount;uniform vec3 scale;uniform float frame;"
          "void main(){vec2 e=min(uv,1.-uv);float ao=exp(-min(e.x,e.y)*90.)*.24*frame;float burn=0.,chips=0.;"
          "for(int i=0;i<6;i++){vec3 d=(p-marks[i].xyz)/scale;float r=length(d)/max(.001,marks[i].w);"
          "float n=sin(d.x*17.+d.y*13.)*sin(d.z*21.+d.x*11.);burn=max(burn,(1.-smoothstep(.15,.98+n*.09,r))*.67*step(.01,marks[i].w));"
          "chips=max(chips,(1.-smoothstep(.016,.05,abs(r-.55-n*.13)))*step(.75,n)*step(.01,marks[i].w));}"
          "float contact=(1.-smoothstep(max(.001,mount.w*.48),max(.002,mount.w*1.25),length((p-mount.xyz)/scale)))*.19*step(.01,mount.w);"
          "gl_FragColor=vec4(mix(vec3(.012,.018,.022),vec3(.20,.23,.24),chips),max(max(ao,contact),burn));}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){failed=1;return;}
        program=glCreateProgram();glAttachShader(program,v);glAttachShader(program,f);glLinkProgram(program);glDeleteShader(v);glDeleteShader(f);
        GLint ok;glGetProgramiv(program,GL_LINK_STATUS,&ok);if(!ok){failed=1;return;}
    }
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;gr_settransblend(GR_FADE_OFF,GR_BLEND_NORMAL);
    glDepthMask(GL_FALSE);glEnable(GL_POLYGON_OFFSET_FILL);glPolygonOffset(-1,-1);glUseProgram(program);
    glUniform4fv(glGetUniformLocation(program,"marks[0]"),6,marks);glUniform1f(glGetUniformLocation(program,"frame"),frame);
    glUniform4fv(glGetUniformLocation(program,"mount"),1,mount);
    glUniform3f(glGetUniformLocation(program,"scale"),f2fl(Matrix_scale.x),f2fl(Matrix_scale.y),f2fl(Matrix_scale.z));
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);glVertexPointer(3,GL_FLOAT,0,p);glTexCoordPointer(2,GL_FLOAT,0,uv);glDrawArrays(GL_TRIANGLE_FAN,0,nv);
    glDisableClientState(GL_TEXTURE_COORD_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);glUseProgram(0);glDisable(GL_POLYGON_OFFSET_FILL);glDepthMask(GL_TRUE);gr_settransblend(fade,blend);
}
/* Face-local world frame: circular fittings remain circular on stretched walls. */
static int ae_basis(int room,int side,vms_vector *center,vms_matrix *basis,float *width,float *height){
    int ids[4];get_side_verts(ids,room,side);vms_vector right,up,normal=Segments[room].sides[side].normals[0];
    compute_center_point_on_side(center,&Segments[room],side);
    *width=f2fl(vm_vec_normalized_dir(&right,&Vertices[ids[1]],&Vertices[ids[0]]));
    *height=f2fl(vm_vec_normalized_dir(&up,&Vertices[ids[3]],&Vertices[ids[0]]));
    vms_vector ctr,dir;compute_segment_center(&ctr,&Segments[room]);vm_vec_sub(&dir,&ctr,center);
    if(vm_vec_dot(&normal,&dir)<0)vm_vec_negate(&normal);
    vm_vector_2_matrix(basis,&normal,&up,NULL);
    return *width>6&&*height>6;
}
static void ae_panel(float x,float y,float w,float h,float z){
    ax_paint(.055f,.073f,.085f,0);ax_tube(x-w,y-h,z,x+w,y-h,z,.10f,.10f,6);ax_tube(x-w,y+h,z,x+w,y+h,z,.10f,.10f,6);
    ax_tube(x-w,y-h,z,x-w,y+h,z,.10f,.10f,6);ax_tube(x+w,y-h,z,x+w,y+h,z,.10f,.10f,6);
}
static void ae_machine(int room,int side,int theme,float w,float h){
    float t=ae_clock(),x=-w*.30f,y=h*.20f,rad=fminf(1.45f,fminf(w,h)*.095f);int style=(room*7+side*11)%4;
    ax_count=0;ax_energy=0;
    if(style==0){ /* recessed fan, casing, spinning curved blades and fixed grille */
        ax_paint(.055f,.075f,.09f,0);ax_ring(x,y,.22f,rad,.15f,0,6.2832f,0);
        ax_paint(.28f,.36f,.39f,0);ax_tube(x,y,.12f,x,y,.48f,rad*.18f,rad*.13f,12);
        for(int i=0;i<5;i++){float a=t*(1.4f+(room%5)*.17f)+i*1.25664f;
            ax_paint(.22f,.29f,.32f,0);ax_tube(x+cosf(a)*rad*.2f,y+sinf(a)*rad*.2f,.27f,x+cosf(a+.45f)*rad*.83f,y+sinf(a+.45f)*rad*.83f,.23f,rad*.13f,rad*.22f,4);}
        ax_paint(.40f,.47f,.49f,0);for(int i=-2;i<=2;i++){
            float yy=i*rad*.28f,xx=sqrtf(rad*rad-yy*yy)*.89f;ax_tube(x-xx,y+yy,.55f,x+xx,y+yy,.55f,.033f,.033f,5);}
    }else if(style==1){ /* twin hydraulic service pistons and their pipe unions */
        for(int i=0;i<2;i++){float xx=x+i*rad*.8f,stroke=.25f+.3f*sinf(t*.75f+i);
            ax_paint(.15f,.21f,.25f,0);ax_tube(xx,y-rad,.25f,xx,y,.25f,rad*.16f,rad*.16f,10);
            ax_paint(.55f,.62f,.64f,0);ax_tube(xx,y-.1f,.25f,xx,y+rad*(.5f+stroke),.25f,rad*.065f,rad*.065f,10);
            ax_paint(.26f,.32f,.36f,0);ax_tube(xx-rad*.22f,y+rad*(.5f+stroke),.25f,xx+rad*.22f,y+rad*(.5f+stroke),.25f,.12f,.12f,6);}
    }else if(style==2){ /* instrument terminal, inset screen, scanning readouts */
        ae_panel(x,y,rad,rad*.65f,.23f);
        for(int i=0;i<6;i++){float yy=y-rad*.44f+i*rad*.17f,len=rad*(.35f+.35f*sinf(i*3.7f+floorf(t*.7f)));
            ax_paint(.04f,.45f+(i%2)*.14f,.57f,.38f);ax_tube(x-rad*.78f,yy,.15f,x+len,yy,.15f,.022f,.022f,4);}
        ax_paint(.8f,.35f,.08f,.5f);ax_tube(x-rad*.8f,y-rad*.78f,.25f,x-rad*.45f,y-rad*.78f,.25f,.04f,.04f,5);
    }else{ /* bundled cables sag between fixed clamps */
        for(int cable=0;cable<3;cable++)for(int j=0;j<8;j++){
            float a=j/8.f,b=(j+1)/8.f;ax_paint(.07f+cable*.025f,.10f+cable*.025f,.12f+cable*.025f,0);
            ax_tube(x-rad*1.4f+a*rad*2.8f,y-sinf(a*3.14159f)*rad*.38f+cable*.13f,.21f,x-rad*1.4f+b*rad*2.8f,y-sinf(b*3.14159f)*rad*.38f+cable*.13f,.21f,.052f,.052f,5);}
        if(((int)(t*3)+room)%23==0){ax_paint(.12f,.58f,.8f,.8f);for(int j=0;j<6;j++){
            float a=j*.12f,b=(j+1)*.12f;ax_tube(x+a,y+sinf(j*9.f+t*31)*.08f,.30f,x+b,y+sinf((j+1)*9.f+t*31)*.08f,.30f,.014f,.014f,4);}}
    }
    /* Service pipe with flange joints and visible coolant pulses. */
    float px=w*.36f;ax_paint(.22f,.29f,.31f,0);ax_tube(px,-h*.36f,.24f,px,h*.36f,.24f,.14f,.14f,9);
    for(int i=-1;i<=1;i++){float yy=i*h*.25f;ax_paint(.38f,.43f,.44f,0);ax_tube(px,yy-.10f,.24f,px,yy+.10f,.24f,.23f,.23f,9);}
    if(theme==2||theme==3){for(int i=0;i<4;i++){float yy=(fmodf(t*.8f+i*h*.18f,h*.68f)-h*.34f);
        ax_paint(theme==3?.8f:.05f,theme==3?.3f:.65f,theme==3?.06f:.7f,.45f);ax_tube(px,yy,.40f,px,yy+.25f,.40f,.045f,.045f,5);}}
    ax_flush(1,1);ae_machines++;
}
void astra_environment_face(int nv,const g3s_point **points,g3s_lrgb *light,int room,int side,int flags){
    if(!ax_on())return;ae_faces++;ae_reset();segment *s=&Segments[room];int wallnum=s->sides[side].wall_num;
    int hidden=wallnum>=0&&Walls[wallnum].type==WALL_DOOR&&Walls[wallnum].clip_num>=0&&(WallAnims[Walls[wallnum].clip_num].flags&WCF_HIDDEN);
    int solid=s->children[side]<0&&wallnum<0;
    if(!solid&&!hidden)return;
    int texture=s->sides[side].tmap_num,theme=ae_theme(room),wet=texture>=0&&texture<NumTextures&&(TmapInfo[texture].damage||TmapInfo[texture].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD));
    if(hidden&&(Walls[wallnum].state!=WALL_DOOR_CLOSED))return;
    ae_wall_finish(nv,points,room,side,!wet&&nv==4);
    if(wet||nv!=4||flags&WID_CLOAKED_FLAG)return;
    astra_gantry(nv,points,light,room*7+side,s->sides[side].normals[0].y>F1_0*3/4);
    vms_vector center;vms_matrix basis;float w,h;if(!ae_basis(room,side,&center,&basis,&w,&h))return;
    g3s_point p;g3_rotate_point(&p,&center);if(p.p3_z<F1_0||p.p3_z>i2f(105)||w>100||h>100)return;
    if(side%2==0&&(room+side)%3!=1&&p.p3_z<i2f(80)){g3_start_instance_matrix(&center,&basis);ae_machine(room,side,theme,w,h);g3_done_instance();}
}
/* Kept on the perimeter, including when the native door is fully open. No mesh
 * ever fills the aperture or reveals hidden doors. Hydraulic travel reads state. */
static void ae_door(int room,int side){
    int id=Segments[room].sides[side].wall_num;if(id<0)return;wall *wall=&Walls[id];
    if(wall->type!=WALL_DOOR||wall->clip_num<0||WallAnims[wall->clip_num].flags&WCF_HIDDEN)return;
    vms_vector center;vms_matrix basis;float w,h;if(!ae_basis(room,side,&center,&basis,&w,&h))return;
    g3s_point p;g3_rotate_point(&p,&center);if(p.p3_z<F1_0||p.p3_z>i2f(115)||w>90||h>90)return;
    float open=wall->state==WALL_DOOR_WAITING||wall->state==WALL_DOOR_OPEN?1:0;
    for(int i=0;i<Num_open_doors;i++)for(int k=0;k<ActiveDoors[i].n_parts;k++)if(ActiveDoors[i].front_wallnum[k]==id||ActiveDoors[i].back_wallnum[k]==id){
        float t=fminf(1,f2fl(ActiveDoors[i].time)/fmaxf(.01f,f2fl(WallAnims[wall->clip_num].play_time)));open=wall->state==WALL_DOOR_CLOSING?1-t:t;}
    if(astra_mine_door>=0&&(id==astra_mine_wall||id==astra_mine_wall2))open=astra_mine_door;
    g3_start_instance_matrix(&center,&basis);ax_count=0;ax_energy=0;
    for(int side=-1;side<=1;side+=2){float x=side*w*.475f;
        ax_paint(.10f,.15f,.18f,0);ax_tube(x,-h*.46f,.11f,x,h*.46f,.11f,.19f,.19f,6);
        ax_paint(.40f,.47f,.49f,0);ax_tube(x-side*.22f,-h*.41f,.22f,x-side*.22f,h*(.05f+.33f*open),.22f,.065f,.065f,9);
        ax_paint(.18f,.24f,.26f,0);ax_tube(x-side*.22f,-h*.41f,.22f,x-side*.22f,-h*.05f,.22f,.16f,.16f,9);
        for(int i=0;i<3;i++){float y=(i-1)*h*.27f;
            if(wall->keys&KEY_BLUE)ax_paint(.08f,.26f,.90f,.45f);else if(wall->keys&KEY_RED)ax_paint(.85f,.055f,.025f,.45f);else if(wall->keys&KEY_GOLD)ax_paint(.85f,.57f,.025f,.45f);else ax_paint(.07f,.50f,.53f,.35f);
            ax_tube(x,y-.25f,.32f,x,y+.25f,.32f,.055f,.055f,6);}}
    ax_flush(1,1);g3_done_instance();ae_doors++;
}
int astra_environment_reactor(object *obj){
    if(!ax_on()||obj->flags&OF_EXPLODING)return 0;g3s_point p;g3_rotate_point(&p,&obj->pos);if(p.p3_z<F1_0||p.p3_z>i2f(250))return 0;
    g3_start_instance_matrix(&obj->pos,&obj->orient);float r=f2fl(obj->size)*.78f,t=ae_clock();ax_count=0;ax_energy=0;
    polymodel *model=&Polygon_models[obj->rtype.pobj_info.model_num];
    float h=fminf(r*.85f,fmaxf(r*.35f,f2fl(model->maxs.y-model->mins.y)*.43f)),pulse=.48f+.12f*sinf(t*2.1f);
    /* Machined graphite housing, ribbed ceramic core and service struts. The
     * native reactor object still owns every gun, hitbox and countdown. */
    for(int s=-1;s<=1;s+=2){float y=s*h;
        ax_paint(.12f,.17f,.20f,0);ax_tube(0,y-r*.09f,0,0,y+r*.09f,0,r*.73f,r*.65f,12);
        ax_paint(.38f,.45f,.47f,0);ax_ring(0,y,0,r*.65f,r*.033f,0,6.2832f,1);
        ax_paint(.66f,.27f,.04f,.22f);ax_ring(0,y+s*r*.105f,0,r*.49f,r*.022f,0,6.2832f,1);
    }
    ax_paint(.05f,.32f,.38f,pulse);ax_tube(0,-h*.82f,0,0,h*.82f,0,r*.29f,r*.29f,20);
    ax_flush(1,1);
    for(int j=-3;j<=3;j++){
        ax_paint(.29f,.36f,.37f,0);ax_ring(0,j*h*.23f,0,r*.32f,r*.026f,0,6.2832f,1);
        ax_paint(.04f,.63f,.70f,pulse);ax_ring(0,j*h*.23f+r*.035f,0,r*.31f,r*.015f,t*.25f+j,4.8f,1);
        ax_flush(1,1);
    }
    int struts=4+obj->id%3;
    for(int j=0;j<struts;j++){float a=j*6.2832f/struts,x=cosf(a)*r*.55f,z=sinf(a)*r*.55f;
        ax_paint(.22f,.29f,.32f,0);ax_tube(x,-h,z,x,h,z,r*.047f,r*.047f,8);
        ax_paint(.06f,.46f,.52f,.3f);ax_tube(x*1.02f,-h*.64f,z*1.02f,x*1.02f,h*.64f,z*1.02f,r*.016f,r*.016f,6);
        ax_paint(.42f,.47f,.48f,0);ax_tube(x,-h*.8f,z,x,-h*.66f,z,r*.08f,r*.08f,8);
    }
    ax_flush(1,1);
    for(int k=0;k<3;k++){ax_paint(.19f,.25f,.28f,0);ax_ring(0,0,0,r*(.90f+k*.035f),r*.026f,t*(k%2?-.4f:.3f)+k,4.7f,k);
        ax_paint(.78f,.24f,.035f,.35f+.15f*sinf(t*2.4f+k));ax_ring(0,0,0,r*(.91f+k*.035f),r*.012f,t*(k%2?-.4f:.3f)+k,.65f,k);ax_flush(1,1);}
    ax_flush(1,1);g3_done_instance();ae_reactors++;return 1;
}
static void ae_haze_flush(void){
    static GLuint program;static int failed;if(!ax_count||failed)return;
    if(!program){
        const char *vs="varying mediump vec3 uv;varying mediump vec4 tint;void main(){gl_Position=ftransform();uv=gl_Normal;tint=gl_Color;}";
        const char *fs="precision mediump float;varying mediump vec3 uv;varying mediump vec4 tint;void main(){float r=dot(uv.xy,uv.xy);float a=exp(-r*3.8)*(1.-smoothstep(.65,1.,r));a*=.72+.28*sin(uv.x*8.+sin(uv.y*9.+uv.z));gl_FragColor=vec4(tint.rgb,tint.a*a);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){failed=1;return;}
        program=glCreateProgram();glAttachShader(program,v);glAttachShader(program,f);glLinkProgram(program);glDeleteShader(v);glDeleteShader(f);
        GLint ok;glGetProgramiv(program,GL_LINK_STATUS,&ok);if(!ok){failed=1;return;}
    }
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;gr_settransblend(GR_FADE_OFF,GR_BLEND_NORMAL);
    GLboolean cull=glIsEnabled(GL_CULL_FACE);glDisable(GL_CULL_FACE);glDepthMask(GL_FALSE);glUseProgram(program);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_NORMAL_ARRAY);glEnableClientState(GL_COLOR_ARRAY);
    glVertexPointer(3,GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].p);glNormalPointer(GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].n);glColorPointer(4,GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].color);glDrawArrays(GL_TRIANGLES,0,ax_count);
    glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_NORMAL_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glUseProgram(0);glDepthMask(GL_TRUE);if(cull)glEnable(GL_CULL_FACE);gr_settransblend(fade,blend);ax_count=0;
}
void astra_environment_rooms(const short *rooms,int count,int window_num){
    if(!ax_on())return;ae_reset();float t=ae_clock();int budget=0;
    for(int i=0;i<count;i++){int room=rooms[i];if(room<0||room>Highest_segment_index)continue;
        for(int side=0;side<6;side++)ae_door(room,side);
        for(int j=0;j<48;j++){ae_scrap *scrap=&ae_scraps[j];float age=(double)(GameTime64-scrap->born)/F1_0;
            if(!scrap->born||scrap->room!=room||age<0||age>45)continue;
            g3s_point view;g3_rotate_point(&view,&scrap->p);if(view.p3_z<F1_0||view.p3_z>i2f(90))continue;
            vms_matrix orient;vm_vector_2_matrix(&orient,&scrap->normal,NULL,NULL);g3_start_instance_matrix(&scrap->p,&orient);
            ax_count=0;ax_energy=0;ax_paint(.20f,.24f,.25f,0);float r=scrap->size;
            ax_tube(-r*.7f,-r*.2f,.06f,r*.8f,r*.25f,.10f,r*.25f,r*.13f,3);ax_flush(1,fminf(1,(45-age)/5));g3_done_instance();
        }
        if(budget>=10)continue;vms_vector center;compute_segment_center(&center,&Segments[room]);g3s_point p;g3_rotate_point(&p,&center);
        if(p.p3_z<i2f(8)||p.p3_z>i2f(95))continue;int theme=ae_theme(room);budget++;
        /* Anchor wisps near a real solid face, never a door or a passage. */
        int side=(room*13)%6;for(int n=0;n<6;n++){int s=(side+n)%6;if(Segments[room].children[s]<0&&Segments[room].sides[s].wall_num<0){side=s;break;}}
        if(Segments[room].children[side]>=0||Segments[room].sides[side].wall_num>=0)continue;
        vms_vector anchor;compute_center_point_on_side(&anchor,&Segments[room],side);vms_vector normal=Segments[room].sides[side].normals[0];
        vm_vec_scale_add2(&anchor,&normal,F1_0/2);vms_matrix basis;vm_vector_2_matrix(&basis,&normal,NULL,NULL);
        g3_start_instance_matrix(&anchor,&basis);ax_count=0;
        for(int j=0;j<5;j++){float phase=fmodf(t*.14f+j*.193f+room*.17f,1.f),x=sinf(room+j*4.3f)*2.f+phase*.5f,y=cosf(room+j*7.1f)*1.4f+phase*.7f,z=.25f+phase*1.6f;
            ax_paint(theme==4?.6f:.31f,theme==4?.25f:.43f,theme==4?.09f:.47f,0);
            af_particle(x,y,z,theme==0?.045f:.20f+phase*.45f,(theme==0?.24f:.035f)*sinf(phase*3.14159f),room+j+phase);}
        /* A faint, short fixture shaft broken into overlapping soft volumes. */
        int tex=Segments[room].sides[side].tmap_num;
        if(tex>=0&&tex<NumTextures&&TmapInfo[tex].lighting>F1_0/10&&!(Light_subtracted[room]&(1<<side)))for(int j=0;j<4;j++){
            ax_paint(.36f,.48f,.50f,0);af_particle(0,0,.5f+j*.65f,.24f+j*.14f,.022f,room+j);}
        ae_haze_flush();g3_done_instance();ae_atmosphere++;
    }
    if(!window_num)EM_ASM(Module.environmentVersion=18;Module.environmentStats=({faces:$0,machines:$1,doors:$2,reactors:$3,atmosphere:$4});Module.environmentLevel=$5;Module.environmentFrames=(Module.environmentFrames||0)+1;,ae_faces,ae_machines,ae_doors,ae_reactors,ae_atmosphere,Current_level_num);
}
