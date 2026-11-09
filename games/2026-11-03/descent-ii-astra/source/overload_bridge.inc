/* Overload campaign adapter: native D2 physics and weapon code. */
extern void EnterSecretLevel(void),ExitSecretLevel(void);
static int ov_created[MAX_OBJECTS];
static int ov_configured,ov_signature[MAX_OBJECTS],ov_kind[MAX_OBJECTS],ov_hidden[MAX_OBJECTS];
static float ov_snapshot[MAX_OBJECTS][8];
static int ov_active,ov_pending,ov_props[MAX_OBJECTS],ov_owner[MAX_OBJECTS],ov_shield[MAX_OBJECTS];
static int ov_saved_control[MAX_OBJECTS],ov_saved_render[MAX_OBJECTS];
static robot_info ov_original_robots[26];
int astra_ov_enabled(void){return ov_active;}
static int ov_barriers[MAX_WALLS];
EM_ASYNC_JS(void,ov_prepare_js,(const char *name),{
    if(window.astraOverload){try{await window.astraOverload.prepare(UTF8ToString(name));}catch(e){abort(e.message);}}
});
void astra_ov_prepare(const char *name){
    extern void astra_ov_tactics_reset(void);astra_ov_tactics_reset();
    extern void astra_ov_world_reset(void);astra_ov_world_reset();
    if(ov_configured){memcpy(Robot_info,ov_original_robots,sizeof ov_original_robots);ov_configured=0;}
    memset(ov_created,0,sizeof ov_created);memset(ov_hidden,0,sizeof ov_hidden);memset(ov_props,0,sizeof ov_props);memset(ov_shield,0,sizeof ov_shield);memset(ov_barriers,0,sizeof ov_barriers);
    ov_prepare_js(name);ov_active=EM_ASM_INT(return !!Module.overload);ov_pending=ov_active;
}
EMSCRIPTEN_KEEPALIVE void astra_ov_remove(int index){if(index>0&&index<=Highest_object_index)Objects[index].flags|=OF_SHOULD_BE_DEAD;}
EMSCRIPTEN_KEEPALIVE void astra_ov_visibility(int index,int hidden){
    if(index<=0||index>Highest_object_index)return;object *o=&Objects[index];
    if(hidden&&!ov_hidden[index]){ov_signature[index]=o->signature;ov_kind[index]=o->type;ov_saved_control[index]=o->control_type;ov_saved_render[index]=o->render_type;ov_hidden[index]=1;o->type=OBJ_GHOST;o->control_type=CT_NONE;o->render_type=RT_NONE;}
    else if(!hidden&&ov_hidden[index]&&o->signature==ov_signature[index]){ov_hidden[index]=0;o->type=ov_kind[index];o->control_type=ov_saved_control[index];o->render_type=ov_saved_render[index];}
}
EMSCRIPTEN_KEEPALIVE void astra_ov_shield(int index,int on){if(index>0&&index<MAX_OBJECTS)ov_shield[index]=on;}
EMSCRIPTEN_KEEPALIVE void astra_ov_barrier(int index,int on){if(index>=0&&index<Num_walls){ov_barriers[index]=1;Walls[index].type=on?WALL_CLOSED:WALL_OPEN;}}
int astra_ov_barrier_flags(int index){if(!ov_active||index<0||index>=Num_walls||!ov_barriers[index])return -1;return Walls[index].type==WALL_OPEN?(WID_FLY_FLAG|WID_RENDPAST_FLAG):(WID_RENDER_FLAG|WID_RENDPAST_FLAG);}
EMSCRIPTEN_KEEPALIVE void astra_ov_warp(double x,double y,double z,int room,double fx,double fy,double fz,double ux,double uy,double uz){
    if(!ov_active||room<0||room>Highest_segment_index||Player_is_dead)return;
    ConsoleObject->pos=(vms_vector){fl2f(x*4),fl2f(y*4),fl2f(z*4)};vms_vector forward={fl2f(fx),fl2f(fy),fl2f(fz)},up={fl2f(ux),fl2f(uy),fl2f(uz)};
    vm_vector_2_matrix(&ConsoleObject->orient,&forward,&up,NULL);vm_vec_zero(&ConsoleObject->mtype.phys_info.velocity);obj_relink(ConsoleObject-Objects,room);
}
EMSCRIPTEN_KEEPALIVE int astra_ov_spawn(int type,int room,double x,double y,double z){
    if(!ov_active||type<0||type>=26||room<0||room>Highest_segment_index)return -1;
    vms_vector position={fl2f(x*4),fl2f(y*4),fl2f(z*4)};int actual=find_point_seg(&position,room);if(actual<0)return -1;
    int i=obj_create(OBJ_ROBOT,type,actual,&position,&vmd_identity_matrix,i2f(4),CT_AI,MT_PHYSICS,RT_POLYOBJ);
    if(i>=0){ov_created[i]=1;Objects[i].rtype.pobj_info.model_num=Robot_info[type].model_num;init_ai_object(i,AIB_NORMAL,actual);if(Game_mode&GM_MULTI)map_objnum_local_to_local(i);}return i;
}
/* Spawn identities use the existing native object map, including late joins. */
EMSCRIPTEN_KEEPALIVE int astra_ov_net_object(int owner,int remote){
    if(owner<0||owner>=4||remote<0||remote>=MAX_OBJECTS)return -1;
    int i=objnum_remote_to_local(remote,owner);return i>=0&&i<=Highest_object_index&&Objects[i].type==OBJ_ROBOT?i:-1;
}
EMSCRIPTEN_KEEPALIVE void astra_ov_net_map(int i,int owner,int remote){
    if(i<0||i>Highest_object_index||owner<0||owner>=4||remote<0||remote>=MAX_OBJECTS)return;
    if(owner==Player_num&&remote==i)map_objnum_local_to_local(i);else map_objnum_local_to_remote(i,remote,owner);
}
EMSCRIPTEN_KEEPALIVE void astra_ov_prop(int index,int owner,int mode,int shield,double radius,double health){
    if(index<=0||index>Highest_object_index)return;
    ov_props[index]=mode;ov_owner[index]=owner;ov_shield[index]=shield;ov_signature[index]=Objects[index].signature;
    Objects[index].size=fl2f(radius);if(!EM_ASM_INT(return !!Module.overloadLate))Objects[index].shields=fl2f(health);
}
int astra_ov_hide_proxy(object *obj){return ov_active&&(obj->type==OBJ_CNTRLCEN||(ov_props[obj-Objects]&&ov_signature[obj-Objects]==obj->signature));}
int astra_ov_invulnerable(object *obj){int i=obj-Objects;return ov_active&&i>=0&&i<MAX_OBJECTS&&ov_signature[i]==obj->signature&&ov_shield[i];}
int astra_ov_impact(object *weapon,object *target){
    int i=target-Objects;if(!ov_active||i<=0||i>=MAX_OBJECTS)return 0;
    if(ov_signature[i]!=target->signature)return 0;
    if(ov_shield[i]){weapon->flags|=OF_SHOULD_BE_DEAD;return 1;}
    if(ov_props[i]==2||ov_props[i]==3){
        if(weapon->ctype.laser_info.parent_type==OBJ_PLAYER&&(!(Game_mode&GM_MULTI)||weapon->ctype.laser_info.parent_num==Players[Player_num].objnum))EM_ASM(window.astraOverload?.hit($0,$1);,ov_owner[i],f2fl(weapon->shields));
        weapon->flags|=OF_SHOULD_BE_DEAD;return 1;
    }return 0;
}
static void ov_profiles_init(void){
    if(!ov_configured){memcpy(ov_original_robots,Robot_info,sizeof ov_original_robots);robot_info base=Robot_info[0];for(int k=0;k<26;k++){
        Robot_info[k]=base;robot_info *ri=&Robot_info[k];ri->boss_flag=0;ri->companion=0;ri->thief=0;ri->smart_blobs=0;ri->energy_blobs=0;ri->kamikaze=0;ri->attack_type=0;ri->n_guns=2;ri->contains_count=0;
        memset(ri->gun_submodels,0,sizeof(ri->gun_submodels));memset(ri->anim_states,0,sizeof(ri->anim_states));ri->weapon_type2=-1;
    }ov_configured=1;}
}
EMSCRIPTEN_KEEPALIVE void astra_ov_profile(int type,double health,double speed,int weapon,int melee,int detonator,double refire,int burst,int stationary){
    if(type<0||type>=26)return;ov_profiles_init();robot_info *r=&Robot_info[type];r->strength=fl2f(health);r->weapon_type=weapon;r->attack_type=!!melee;r->kamikaze=detonator?1:0;
    for(int d=0;d<NDL;d++){r->max_speed[d]=stationary?0:fl2f(speed*(.65+.12*d));r->firing_wait[d]=fl2f(refire*(1.4-.15*d));r->rapidfire_count[d]=burst;r->field_of_view[d]=fl2f(.1);r->turn_time[d]=fl2f(.45-.05*d);r->circle_distance[d]=i2f(50);}
}
EMSCRIPTEN_KEEPALIVE void astra_ov_type_gun(int type,int gun,double x,double y,double z){
    if(type<0||type>=26||gun<0||gun>=MAX_GUNS)return;robot_info *r=&Robot_info[type];if(!gun)r->n_guns=1;else if(r->n_guns<=gun)r->n_guns=gun+1;r->gun_points[gun]=(vms_vector){fl2f(x),fl2f(y),fl2f(z)};
}
EMSCRIPTEN_KEEPALIVE void astra_ov_recharge(double amount,double cap){if(ov_active&&Players[Player_num].energy<fl2f(cap)){fix e=Players[Player_num].energy+fl2f(amount),limit=fl2f(cap);Players[Player_num].energy=e>limit?limit:e;}}
EMSCRIPTEN_KEEPALIVE void astra_ov_robot(int index,double health,double radius,double speed,int weapon,int melee,int hidden){
    if(index<=0||index>Highest_object_index||(Objects[index].type!=OBJ_ROBOT&&Objects[index].type!=OBJ_GHOST))return;ov_profiles_init();
    object *obj=&Objects[index];if(obj->id>=26)return;robot_info *ri=&Robot_info[obj->id];
    ri->strength=fl2f(health);ri->weapon_type=weapon;ri->attack_type=!!melee;ri->n_guns=2;
    for(int g=0;g<2;g++)ri->gun_points[g]=(vms_vector){fl2f(radius*(g?-.5:.5)),0,fl2f(radius*.7)};
    for(int d=0;d<NDL;d++){ri->max_speed[d]=fl2f(speed*(.65+.12*d));ri->field_of_view[d]=fl2f(.1);ri->firing_wait[d]=fl2f(.6-.08*d);ri->turn_time[d]=fl2f(.45-.05*d);ri->circle_distance[d]=i2f(50);ri->rapidfire_count[d]=3;}
    obj->size=fl2f(radius);if(!(Game_mode&GM_MULTI)||!EM_ASM_INT(return !!Module.overloadLate)||ov_created[index])obj->shields=fl2f(health);ov_created[index]=0;obj->type=OBJ_ROBOT;obj->render_type=RT_POLYOBJ;obj->mtype.phys_info.mass=ri->mass;obj->mtype.phys_info.drag=ri->drag;obj->control_type=CT_AI;
    ov_signature[index]=obj->signature;ov_kind[index]=OBJ_ROBOT;ov_saved_control[index]=CT_AI;ov_saved_render[index]=RT_POLYOBJ;ov_hidden[index]=!!hidden;
    if(hidden){obj->type=OBJ_GHOST;obj->control_type=CT_NONE;obj->render_type=RT_NONE;}
}
EMSCRIPTEN_KEEPALIVE int astra_ov_states(void){
    for(int i=0;i<MAX_OBJECTS;i++){
        object *o=&Objects[i];ov_snapshot[i][0]=i<=Highest_object_index?o->type:OBJ_NONE;ov_snapshot[i][1]=o->flags;ov_snapshot[i][2]=f2fl(o->shields);ov_snapshot[i][3]=o->signature;
        ov_snapshot[i][4]=f2fl(o->pos.x)/4;ov_snapshot[i][5]=f2fl(o->pos.y)/4;ov_snapshot[i][6]=f2fl(o->pos.z)/4;ov_snapshot[i][7]=o->type==OBJ_WEAPON?o->ctype.laser_info.parent_type==OBJ_PLAYER:ov_hidden[i];
    }return (int)ov_snapshot;
}
EMSCRIPTEN_KEEPALIVE void astra_ov_gun(int index,int gun,double x,double y,double z){
    if(index<=0||index>Highest_object_index||gun<0||gun>=MAX_GUNS||Objects[index].id>=26)return;
    robot_info *r=&Robot_info[Objects[index].id];if(!gun)r->n_guns=1;else if(r->n_guns<=gun)r->n_guns=gun+1;r->gun_points[gun]=(vms_vector){fl2f(x),fl2f(y),fl2f(z)};
}
EMSCRIPTEN_KEEPALIVE void astra_ov_traits(int index,int detonator,double refire,int burst,int stationary){
    if(index<=0||index>Highest_object_index||Objects[index].id>=26)return;object *o=&Objects[index];robot_info *r=&Robot_info[o->id];
    r->kamikaze=detonator?1:0;
    for(int d=0;d<NDL;d++){r->firing_wait[d]=fl2f(refire*(1.4-.15*d));r->rapidfire_count[d]=burst;if(stationary)r->max_speed[d]=0;}
    if(stationary)o->ctype.ai_info.behavior=AIB_STILL;
}
EMSCRIPTEN_KEEPALIVE void astra_ov_reveal(int i){
    if(i<=0||i>Highest_object_index||Objects[i].signature!=ov_signature[i])return;
    object *o=&Objects[i];astra_ov_visibility(i,0);if(o->type==OBJ_ROBOT){o->control_type=CT_AI;init_ai_object(i,AIB_NORMAL,o->segnum);}
}
EMSCRIPTEN_KEEPALIVE void astra_ov_stasis(int i){if(i>0&&i<=Highest_object_index&&Objects[i].type==OBJ_ROBOT)Objects[i].control_type=CT_NONE;}
EMSCRIPTEN_KEEPALIVE void astra_ov_door(int i,int locked,int open){
    if(i<0||i>=Num_walls)return;wall *w=&Walls[i];if(locked)w->flags|=WALL_DOOR_LOCKED;else w->flags&=~WALL_DOOR_LOCKED;
    if(open>0){w->flags&=~WALL_DOOR_AUTO;wall_open_door(&Segments[w->segnum],w->sidenum);}
    else if(open<0){w->flags|=WALL_DOOR_AUTO;wall_close_door(&Segments[w->segnum],w->sidenum);}
}
float astra_ov_door_fraction(int i){
    if(i<0||i>=Num_walls)return 0;wall *w=&Walls[i];
    if(w->state==WALL_DOOR_WAITING||w->state==WALL_DOOR_OPEN||w->type==WALL_OPEN)return 1;
    if(w->state==WALL_DOOR_CLOSED)return 0;
    for(int d=0;d<Num_open_doors;d++)for(int part=0;part<ActiveDoors[d].n_parts;part++)if(ActiveDoors[d].front_wallnum[part]==i||ActiveDoors[d].back_wallnum[part]==i){
        float t=f2fl(ActiveDoors[d].time)/fmaxf(.01f,f2fl(WallAnims[w->clip_num].play_time));t=fmaxf(0,fminf(1,t));return w->state==WALL_DOOR_CLOSING?1-t:t;
    }return (w->flags&WALL_DOOR_OPENED)?1:0;
}
EMSCRIPTEN_KEEPALIVE void astra_ov_finish(void){if(!Player_is_dead){if(Current_level_num<0)ExitSecretLevel();else PlayerFinishedLevel(0);}}
EMSCRIPTEN_KEEPALIVE void astra_ov_escape(void){if(ov_active&&!Control_center_destroyed)do_controlcen_destroyed_stuff(NULL);}
#include "overload_save.inc"
void astra_ov_tick(void){
    if(!ov_active)return;
    if(ov_pending){ov_pending=0;ov_restore_before_begin();EM_ASM(window.astraOverload?.begin());ov_restore_after_begin();}
    if(!EM_ASM_INT(return !!window.astraOverload?.controller))return;
    int pointer=astra_ov_states();
    EM_ASM(window.astraOverloadHeap=HEAPF32;window.astraOverload.tick($0,$1,$2,$3,$4);,f2fl(FrameTime),pointer,ConsoleObject->segnum,!Player_is_dead,ConsoleObject-Objects);
    if(!Player_is_dead&&EM_ASM_INT(if(Module.overloadFinish){Module.overloadFinish=false;return 1;}return 0;))astra_ov_finish();
    else if(EM_ASM_INT(if(Module.overloadSecret){Module.overloadSecret=false;return 1;}return 0;)){extern int First_secret_visit;First_secret_visit=1;EnterSecretLevel();}
}
