/* Paused, detached inspection of the actual loaded mine. No player movement,
 * exploration credit, AI updates or gameplay door operations occur here. */
#include "wall.h"
#include "gameseg.h"
#include "render.h"
#include "fvi.h"
#include "effects.h"
#include "bm.h"
#include "textures.h"
#include "piggy.h"
int astra_mine_inspecting,astra_mine_wall=-1,astra_mine_wall2=-1;
int astra_gallery_scene=-1,astra_gallery_room=-1,astra_gallery_side=-1;
extern int astra_refinement,astra_native_compare,astra_detail_upgrade;
extern int astra_environment_theme(int),astra_environment_bay(int),astra_environment_rock(int);
float astra_mine_clock=-1,astra_mine_door=-1;
typedef struct {vms_vector eye,goal,up;int room,side,subject,valid;} am_scene;
static am_scene am_scenes[31];static int am_level=-999,am_segments=-1,am_mask;
static float am_distance(const vms_vector *a,const vms_vector *b){return f2fl(vm_vec_dist(a,b));}
static int am_clear(const vms_vector *a,int room,const vms_vector *b,fix radius){
    fvi_query q={a,b,room,radius,-1,NULL,0};fvi_info hit;return find_vector_intersection(&q,&hit)==HIT_NONE;
}
static int am_face(int room,int side,int machine,am_scene *scene){
    int ids[4];get_side_verts(ids,room,side);vms_vector center,up,n=Segments[room].sides[side].normals[0],ctr,into;
    compute_center_point_on_side(&center,&Segments[room],side);compute_segment_center(&ctr,&Segments[room]);vm_vec_sub(&into,&ctr,&center);
    if(vm_vec_dot(&n,&into)<0)vm_vec_negate(&n);
    vm_vec_normalized_dir(&up,&Vertices[ids[3]],&Vertices[ids[0]]);vms_matrix basis;vm_vector_2_matrix(&basis,&n,&up,NULL);
    float w=am_distance(&Vertices[ids[1]],&Vertices[ids[0]]),h=am_distance(&Vertices[ids[3]],&Vertices[ids[0]]);
    if(w<8||h<8||w>90||h>90)return 0;
    vms_vector goal=center,eye;
    if(machine==1){vm_vec_scale_add2(&goal,&basis.rvec,fl2f(-w*.30f));vm_vec_scale_add2(&goal,&basis.uvec,fl2f(h*.20f));}
    if(machine==2)vm_vec_scale_add2(&goal,&basis.uvec,fl2f(-h*.13f));
    vm_vec_scale_add2(&goal,&n,F1_0/2);
    if(find_point_seg(&goal,room)!=room)return 0;
    float distance=machine?9.5f:fminf(25,fmaxf(10,fmaxf(w,h)*.70f));
    vm_vec_scale_add(&eye,&goal,&n,fl2f(distance));int eye_room=find_point_seg(&eye,room);
    if(eye_room<0||!am_clear(&goal,room,&eye,F1_0/3)){
        if(machine)return 0;
        eye=ctr;eye_room=room;
        if(!am_clear(&eye,room,&goal,0))return 0;
    }
    float actual=am_distance(&eye,&goal);if(actual<4||actual>50)return 0;
    *scene=(am_scene){eye,goal,basis.uvec,eye_room,side,room,1};return 1;
}
static void am_reactor_view(am_scene *scene,object *o,vms_vector eye,float *best){
    int room=find_point_seg(&eye,o->segnum);float r=f2fl(o->size),d=am_distance(&eye,&o->pos);
    if(room<0||d<r*1.9f||d>r*5||!am_clear(&o->pos,o->segnum,&eye,0))return;
    vms_vector forward;vms_matrix basis;vm_vec_normalized_dir(&forward,&o->pos,&eye);vm_vector_2_matrix(&basis,&forward,&o->orient.uvec,NULL);
    float score=fabsf(d-r*3);
    /* Favor a view of the whole housing, not just its center through a door. */
    for(int k=0;k<4;k++){
        vms_vector edge;vm_vec_scale_add(&edge,&o->pos,k<2?&basis.rvec:&basis.uvec,fl2f(r*.74f*(k%2?1:-1)));
        if(!am_clear(&eye,room,&edge,0))score+=r*8;
    }
    if(score<*best){*best=score;*scene=(am_scene){eye,o->pos,o->orient.uvec,room,-1,(int)(o-Objects),1};}
}
static void am_liquid_view(int room,int side,am_scene *scene){
    if(!am_face(room,side,0,scene))return;
    vms_vector n,eye;vm_vec_normalized_dir(&n,&scene->eye,&scene->goal);
    float span=fminf(19,am_distance(&scene->eye,&scene->goal));
    for(int attempt=0;attempt<3;attempt++)for(int sign=-1;sign<=1;sign+=2){
        float depth=attempt==0?.35f:attempt==1?.30f:.25f,offset=attempt==0?.60f:attempt==1?.30f:.15f;
        vm_vec_scale_add(&eye,&scene->goal,&n,fl2f(span*depth));vm_vec_scale_add2(&eye,&scene->up,fl2f(sign*span*offset));
        int r=find_point_seg(&eye,room);if(r>=0&&am_clear(&scene->goal,room,&eye,F1_0/3)){scene->eye=eye;scene->room=r;return;}
    }
}
static void am_build(void){
    memset(am_scenes,0,sizeof am_scenes);am_mask=0;am_level=Current_level_num;am_segments=Highest_segment_index;float liquid_score[2]={-1,-1};
    for(int room=0;room<=Highest_segment_index;room++)for(int side=0;side<6;side++){
        segment *s=&Segments[room];int t=s->sides[side].tmap_num;if(t<0||t>=NumTextures)continue;
        int solid=s->children[side]<0&&s->sides[side].wall_num<0;
        extern int astra_liquid_kind(int);int liquid=astra_liquid_kind(t);
        if(liquid&&solid){
            am_scene candidate={0};am_liquid_view(room,side,&candidate);
            if(candidate.valid){
                vms_matrix orient;extract_orient_from_segment(&orient,s);float score=12*fmaxf(0,f2fl(vm_vec_dot(&s->sides[side].normals[0],&orient.uvec)));
                for(int j=0;j<6;j++){int t2=s->sides[j].tmap_num;if(s->children[j]<0&&!astra_liquid_kind(t2))score+=3;if(t2>=0&&t2<NumTextures)score+=f2fl(TmapInfo[t2].lighting);}
                score+=am_distance(&candidate.eye,&candidate.goal)*.1f;
                if(score>liquid_score[liquid-1]){liquid_score[liquid-1]=score;am_scenes[18+liquid]=candidate;}
            }
        }
        if(solid&&!TmapInfo[t].damage&&!(TmapInfo[t].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD))){
            extern int astra_detail_surface_kind(int,int);int detail=astra_detail_surface_kind(room,side);
            if(detail&&!am_scenes[detail==1?27:28].valid)am_face(room,side,0,&am_scenes[detail==1?27:28]);
            extern int astra_fixture_kind(int,int);int fixture=astra_fixture_kind(room,side);
            extern int astra_wall_style(int,int);int accent=astra_wall_style(room,side);
            if(accent&&!am_scenes[20+accent].valid)am_face(room,side,0,&am_scenes[20+accent]);
            int exhibit=fixture==1?15:fixture==3?16:fixture==2?17:fixture==4?18:-1;
            if(exhibit>=0&&!am_scenes[exhibit].valid)am_face(room,side,3,&am_scenes[exhibit]);
            if(!am_scenes[0].valid)am_face(room,side,0,&am_scenes[0]);
            int theme=astra_environment_theme(room),bay=astra_environment_bay(room);
            if(s->sides[side].type==SIDE_IS_QUAD){
                int ids[4];get_side_verts(ids,room,side);float w=am_distance(&Vertices[ids[0]],&Vertices[ids[1]]),h=am_distance(&Vertices[ids[0]],&Vertices[ids[3]]);
                if(!astra_environment_rock(t)&&side!=bay&&(room*3+side)%3==1&&w>=20&&h>=20&&!am_scenes[8].valid)am_face(room,side,0,&am_scenes[8]);
                if(!astra_environment_rock(t)&&side!=bay&&w>=14&&h>=14&&!am_scenes[9].valid)am_face(room,side,0,&am_scenes[9]);
                if(astra_environment_rock(t)&&!am_scenes[10].valid)am_face(room,side,0,&am_scenes[10]);
                if(side==bay){
                    int index=theme==5?11:theme==2?12:-1;
                    if(index>=0&&!am_scenes[index].valid)am_face(room,side,2,&am_scenes[index]);
                    if((theme==2||theme==3)&&!am_scenes[13].valid)am_face(room,side,2,&am_scenes[13]);
                }
                if(!astra_environment_rock(t)&&!am_scenes[14].valid&&side%2==0&&(room+side)%3!=1)am_face(room,side,1,&am_scenes[14]);
            }
            if(!astra_environment_rock(t)&&side%2==0&&(room+side)%3!=1&&s->sides[side].type==SIDE_IS_QUAD){
                int kind=1+(room*7+side*11)%4;if(!am_scenes[kind].valid)am_face(room,side,1,&am_scenes[kind]);
            }
        }
        int wn=s->sides[side].wall_num;
        if(!am_scenes[5].valid&&wn>=0&&Walls[wn].type==WALL_DOOR&&Walls[wn].clip_num>=0&&!(WallAnims[Walls[wn].clip_num].flags&WCF_HIDDEN)){
            if(am_face(room,side,0,&am_scenes[5]))am_scenes[5].subject=wn;
        }
        if(!am_scenes[7].valid&&TmapInfo[t].eclip_num==ECLIP_NUM_FUELCEN)am_face(room,side,0,&am_scenes[7]);
    }
    for(int i=0;i<=Highest_object_index&&!am_scenes[6].valid;i++)if(Objects[i].type==OBJ_CNTRLCEN&&!(Objects[i].flags&OF_SHOULD_BE_DEAD)){
        object *o=&Objects[i];float best=1e9f;am_scene *scene=&am_scenes[6];
        for(int room=0;room<=Highest_segment_index;room++){
            vms_vector eye;compute_segment_center(&eye,&Segments[room]);am_reactor_view(scene,o,eye,&best);
        }
        for(int angle=0;angle<16;angle++)for(int step=0;step<2;step++){
            float a=angle*6.2831853f/16,r=f2fl(o->size),d=r*(step?2.3f:3.f);vms_vector eye=o->pos;
            vm_vec_scale_add2(&eye,&o->orient.rvec,fl2f(cosf(a)*d));vm_vec_scale_add2(&eye,&o->orient.fvec,fl2f(sinf(a)*d));
            vm_vec_scale_add2(&eye,&o->orient.uvec,fl2f(r*.12f));am_reactor_view(scene,o,eye,&best);
        }
    }
    if(!am_scenes[9].valid)am_scenes[9]=am_scenes[0];
    /* Fitting samples remain inspectable even if this mine has no vent/conduit
     * material. These two exhibits mount on a safe ordinary showroom wall. */
    for(int i=15;i<=17;i+=2)if(!am_scenes[i].valid){am_scene *base=am_scenes[18].valid?&am_scenes[18]:&am_scenes[9];
        if(!am_face(base->subject,base->side,3,&am_scenes[i]))am_scenes[i]=*base;}
    /* Begin with real connected architecture, not a camera against one tile. */
    float overview_best=-1;
    for(int room=0;room<=Highest_segment_index;room++){
        segment *seg=&Segments[room];vms_vector eye;vms_matrix upright;
        compute_segment_center(&eye,seg);extract_orient_from_segment(&upright,seg);
        int portals=0,metal=0;
        for(int side=0;side<6;side++){
            if(seg->children[side]>=0&&seg->sides[side].wall_num<0)portals++;
            int t=seg->sides[side].tmap_num;
            if(seg->children[side]<0&&t>=0&&t<NumTextures&&!astra_environment_rock(t)&&!TmapInfo[t].damage)metal++;
        }
        if(portals<2)continue;
        for(int side=0;side<6;side++){
            int child=seg->children[side];if(child<0||seg->sides[side].wall_num>=0)continue;
            vms_vector goal;compute_segment_center(&goal,&Segments[child]);
            if(!am_clear(&eye,room,&goal,F1_0/3))continue;
            float distance=am_distance(&eye,&goal);if(distance<12||distance>90)continue;
            float score=portals*2+metal*9+fminf(35,distance)*.1f;
            if(score>overview_best){overview_best=score;am_scenes[0]=(am_scene){eye,goal,upright.uvec,room,side,room,1};}
        }
    }
    /* If this mine lacks one palette, inspect that diffuser on an existing
     * safe service mount. It is a showroom sample, never a gameplay rewrite. */
    for(int i=21;i<25;i++)if(!am_scenes[i].valid){
        for(int j=21;j<25;j++)if(am_scenes[j].valid){am_scenes[i]=am_scenes[j];break;}
        if(!am_scenes[i].valid&&am_scenes[16].valid)am_scenes[i]=am_scenes[16];
    }
    am_scenes[25]=am_scenes[15];
    fix strip_light=-1;
    for(int i=21;i<25;i++)if(am_scenes[i].valid){
        am_scene *v=&am_scenes[i];fix light=0;for(int j=0;j<4;j++)light+=Segments[v->subject].sides[v->side].uvls[j].l/4;
        if(light>strip_light){strip_light=light;am_scenes[26]=*v;}
    }
    /* Aim between the channel and panel, keeping the entire light in view. */
    for(int i=21;i<27;i++)if(i!=25&&am_scenes[i].valid){
        extern int astra_wall_inspection_anchor(int,int,vms_vector*);am_scene *v=&am_scenes[i];vms_vector lamp,shift,eye,goal;
        if(astra_wall_inspection_anchor(v->subject,v->side,&lamp)){
            vm_vec_sub(&shift,&lamp,&v->goal);vm_vec_scale(&shift,fl2f(.50f));vm_vec_add(&eye,&v->eye,&shift);vm_vec_add(&goal,&v->goal,&shift);
            int room=find_point_seg(&eye,v->room);if(room>=0&&am_clear(&v->eye,v->room,&eye,F1_0/3)&&am_clear(&eye,room,&goal,0)){v->eye=eye;v->goal=goal;v->room=room;}
        }
    }
    if(!am_scenes[27].valid)am_scenes[27]=am_scenes[9];if(!am_scenes[28].valid)am_scenes[28]=am_scenes[10].valid?am_scenes[10]:am_scenes[9];
    am_scenes[29]=am_scenes[26].valid?am_scenes[26]:am_scenes[16];am_scenes[30]=am_scenes[27];
    for(int i=27;i<31;i++)if(am_scenes[i].valid){am_scene *v=&am_scenes[i];vms_vector f,r,eye;vm_vec_normalized_dir(&f,&v->goal,&v->eye);vm_vec_cross(&r,&f,&v->up);vm_vec_normalize_quick(&r);vm_vec_scale_add(&eye,&v->eye,&r,i2f(i==30?6:3));int room=find_point_seg(&eye,v->room);if(room>=0&&am_clear(&v->eye,v->room,&eye,F1_0/3)&&am_clear(&eye,room,&v->goal,0)){v->eye=eye;v->room=room;}}
    for(int i=0;i<31;i++)if(am_scenes[i].valid)am_mask|=1<<i;
}
/* The transient door frame is restored immediately after drawing, including
 * its connected side. No wall_open_door, trigger, sound or ActiveDoors changes. */
typedef struct {int id;wall saved;short base,overlay;} am_door_saved;
static void am_set_door(int id,float open,am_door_saved *save){
    save->id=-1;if(id<0||id>=Num_walls)return;wall *w=&Walls[id];
    if(w->type!=WALL_DOOR||w->clip_num<0||w->clip_num>=Num_wall_anims||WallAnims[w->clip_num].num_frames<1)return;
    save->id=id;side *s=&Segments[w->segnum].sides[w->sidenum];
    save->saved=*w;save->base=s->tmap_num;save->overlay=s->tmap_num2;
    wclip *clip=&WallAnims[w->clip_num];int frame=(int)(open*(clip->num_frames-1));
    if(clip->flags&WCF_TMAP1)s->tmap_num=clip->frames[frame];else s->tmap_num2=clip->frames[frame];
    w->state=open>.99f?WALL_DOOR_WAITING:WALL_DOOR_OPENING;
    if(open>.5f)w->flags|=WALL_DOOR_OPENED;else w->flags&=~WALL_DOOR_OPENED;
}
static void am_restore_door(am_door_saved *save){
    if(save->id<0)return;wall *w=&Walls[save->id];*w=save->saved;side *s=&Segments[w->segnum].sides[w->sidenum];s->tmap_num=save->base;s->tmap_num2=save->overlay;
}
void astra_mine_preview(int index,float clock,float zoom){
    if(am_level!=Current_level_num||am_segments!=Highest_segment_index||!am_mask)am_build();
    if(index<0||index>30||!am_scenes[index].valid){index=0;while(index<31&&!am_scenes[index].valid)index++;}
    if(index>=31){EM_ASM(window.astraMinePreview?.unavailable());return;}
    am_scene *s=&am_scenes[index];vms_vector forward,eye,delta;vms_matrix orient;
    vm_vec_sub(&delta,&s->eye,&s->goal);vm_vec_scale_add(&eye,&s->goal,&delta,fl2f(fminf(1.5f,fmaxf(.65f,zoom))));
    vm_vec_normalized_dir(&forward,&s->goal,&s->eye);vm_vector_2_matrix(&orient,&forward,&s->up,NULL);
    vm_vec_scale_add2(&eye,&orient.rvec,fl2f(sinf(clock*.27f)*.65f));vm_vec_scale_add2(&eye,&orient.uvec,fl2f(sinf(clock*.18f)*.23f));
    int room=find_point_seg(&eye,s->room);
    if(room<0||!am_clear(&s->eye,s->room,&eye,F1_0/3)){eye=s->eye;room=s->room;}
    vm_vec_normalized_dir(&forward,&s->goal,&eye);vm_vector_2_matrix(&orient,&forward,&s->up,NULL);
    am_door_saved doors[2];doors[0].id=doors[1].id=-1;
    astra_mine_inspecting=1;astra_mine_clock=clock;
    astra_gallery_scene=index;astra_gallery_room=s->subject;astra_gallery_side=s->side;
    astra_detail_upgrade=!EM_ASM_INT(return Module.mineRefinement===false);astra_native_compare=index<27&&!astra_detail_upgrade;astra_refinement=!astra_native_compare;astra_mine_wall=astra_mine_wall2=-1;astra_mine_door=-1;
    if(index==5){
        int id=s->subject;wall *w=&Walls[id];int child=Segments[w->segnum].children[w->sidenum],other=-1;
        if(child>=0){int connected=find_connect_side(&Segments[w->segnum],&Segments[child]);if(connected>=0)other=Segments[child].sides[connected].wall_num;}
        float t=fmodf(clock,10),open=t<2?0:t<4?(t-2)*.5f:t<7?1:t<9?1-(t-7)*.5f:0;
        astra_mine_wall=id;astra_mine_wall2=other;astra_mine_door=open;
        am_set_door(id,open,&doors[0]);am_set_door(other,open,&doors[1]);
    }
    extern void astra_inspection_render(const vms_vector*,const vms_matrix*,int);astra_inspection_render(&eye,&orient,room);
    am_restore_door(&doors[1]);am_restore_door(&doors[0]);
    astra_gallery_scene=astra_gallery_room=astra_gallery_side=-1;astra_refinement=1;astra_native_compare=0;astra_detail_upgrade=1;
    astra_mine_inspecting=0;astra_mine_clock=astra_mine_door=-1;astra_mine_wall=astra_mine_wall2=-1;
    EM_ASM(window.astraMinePreview?.update($0,$1,$2,$3,$4);,index,am_mask,Current_level_num,room,clock);
}
