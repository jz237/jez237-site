/* Cosmetic damage follows native object signatures. No simulation RNG or
 * gameplay objects are allocated, and native health/physics remain untouched. */
#include "polyobj.h"
#include "astra_detonations.h"
#include "robot.h"
extern int astra_preview_active,astra_preview_silent;
extern float astra_preview_clock;
static float astra_visual_clock(void){return astra_preview_active?astra_preview_clock:SDL_GetTicks()*.001f;}
object *astra_robot_object;
static float ac_preview_damage=-1;
typedef struct {int signature;fix maximum;float damage;fix64 hit;unsigned missing;int exploded;} ac_damage;
static ac_damage ac_robots[MAX_OBJECTS];
enum { AC_PARTS=7, AC_FRAGMENTS=32 };
typedef struct {object robot;vms_vector pivot,pos,velocity,hit,normal;fix64 born,struck;float age,life,spin;unsigned seed;int part,room,bounces,chain,impact;float impact_age;} ac_fragment;
static ac_fragment ac_fragments[AC_FRAGMENTS];static unsigned ac_serial;
static int ac_hidden_debris[MAX_OBJECTS],ac_hidden_known[MAX_OBJECTS];
static int ac_fragment_mask=-1,ac_preview_mask=-1;
static unsigned ac_available(const object *robot);
static void ac_launch(const object *robot,int part,int explosion);
static const vms_vector *ac_contact;
void astra_contact(const vms_vector *point){ac_contact=point;}
static unsigned ac_hash(unsigned x){x^=x>>16;x*=0x7feb352du;x^=x>>15;x*=0x846ca68bu;return x^(x>>16);}
static int ac_index(const object *obj){
    uintptr_t p=(uintptr_t)obj,start=(uintptr_t)Objects;
    if(p<start||p>=start+sizeof(object)*MAX_OBJECTS||(p-start)%sizeof(object))return -1;
    return (p-start)/sizeof(object);
}
static float ac_damage_for(const object *obj){
    if(!obj||obj->type!=OBJ_ROBOT)return 0;
    if(ac_preview_damage>=0&&ac_index(obj)<0)return ac_preview_damage;
    int i=ac_index(obj);float maximum=f2fl(Robot_info[obj->id].strength);
    if(i>=0&&ac_robots[i].signature==obj->signature&&ac_robots[i].maximum>0)maximum=f2fl(ac_robots[i].maximum);
    return fminf(.99f,fmaxf(0,1-f2fl(obj->shields)/fmaxf(1,maximum)));
}
/* Fixed, coherent sections of the actual mesh, not scattered random triangles.
 * This rule is shared by the refit chassis, original panels and mechanisms. */
static int ac_region(float x,float y,float z){
    if(x<-.43f)return 1;if(x>.43f)return 2;
    if(y<-.43f)return 3;if(y>.48f)return 4;
    if(z<-.52f)return 5;if(z>.59f)return 6;return 0;
}
static unsigned ac_missing(const object *obj){
    if(!obj||obj->type!=OBJ_ROBOT)return 0;
    int index=ac_index(obj);if(index<0)return ac_preview_mask>=0?(unsigned)ac_preview_mask:0;
    return ac_robots[index].signature==obj->signature?ac_robots[index].missing:0;
}
static int ac_visible_part(int part){
    if(ac_fragment_mask>=0)return (ac_fragment_mask&(1u<<part))!=0;
    return !(ac_missing(astra_robot_object)&(1u<<part));
}
int astra_part_visible(float x,float y,float z){return ac_visible_part(ac_region(x,y,z));}
static int ac_local_part(const object *obj,const vms_vector *local){
    polymodel *pm=&Polygon_models[Robot_info[obj->id].model_num];
    return ac_region((2.f*local->x-pm->maxs.x-pm->mins.x)/fmaxf(1,pm->maxs.x-pm->mins.x),
        (2.f*local->y-pm->maxs.y-pm->mins.y)/fmaxf(1,pm->maxs.y-pm->mins.y),
        (2.f*local->z-pm->maxs.z-pm->mins.z)/fmaxf(1,pm->maxs.z-pm->mins.z));
}
void astra_combat_clear(void){memset(ac_robots,0,sizeof ac_robots);memset(ac_fragments,0,sizeof ac_fragments);memset(ac_hidden_known,0,sizeof ac_hidden_known);}
void astra_hide_debris(object *obj){int index=ac_index(obj);if(index>=0){ac_hidden_debris[index]=obj->signature;ac_hidden_known[index]=1;}}
int astra_fragment_replaced(const object *obj){
    int index=ac_index(obj);if(index<0)return 0;
    if(obj->type==OBJ_DEBRIS)return ac_hidden_known[index]&&ac_hidden_debris[index]==obj->signature;
    return obj->type==OBJ_ROBOT&&ac_robots[index].signature==obj->signature&&ac_robots[index].exploded;
}
void astra_robot_hit(object *robot,fix damage){
    if(damage<=0||robot->shields<0||!EM_ASM_INT(return !!Module.astra))return;
    int index=ac_index(robot);if(index<0)return;ac_damage *state=&ac_robots[index];
    if(state->signature!=robot->signature||state->maximum<=0){
        memset(state,0,sizeof *state);state->signature=robot->signature;
        state->maximum=Robot_info[robot->id].strength>robot->shields+damage?Robot_info[robot->id].strength:robot->shields+damage;
    }
    float value=ac_damage_for(robot);int before=state->damage>=.82f?3:state->damage>=.59f?2:state->damage>=.31f?1:0;
    int after=value>=.82f?3:value>=.59f?2:value>=.31f?1:0;
    state->damage=value;state->hit=GameTime64;
    unsigned available=ac_available(robot)&~1u;
    for(int stage=before;stage<after;stage++){
        int start=stage==0?1+(ac_hash(robot->signature)%2):1+ac_hash(robot->signature+stage*719u)%6;
        for(int j=0;j<6;j++){int part=1+(start-1+j)%6;if((available&~state->missing)&(1u<<part)){
            ac_launch(robot,part,0);state->missing|=1u<<part;break;
        }}
    }
    EM_ASM(Module.lastRobotDamage=({object:$0,signature:$1,damage:$2,missing:$3});,index,robot->signature,value,state->missing);
}
int astra_robot_breakup(object *robot){
    if(robot->type!=OBJ_ROBOT||Robot_info[robot->id].companion||!EM_ASM_INT(return !!Module.astra))return 0;
    int index=ac_index(robot);if(index<0)return 0;
    ac_damage *state=&ac_robots[index];if(state->signature!=robot->signature){memset(state,0,sizeof *state);state->signature=robot->signature;}
    if(state->exploded)return 1;
    /* Different deaths retain the existing blast variety. Roughly two thirds
     * also rupture into all remaining textured hull sections. */
    if(ac_hash(robot->signature*73u+robot->id*131u)%3==0)return 0;
    unsigned parts=ac_available(robot)&~state->missing;if(!parts)return 0;
    for(int part=0;part<AC_PARTS;part++)if(parts&(1u<<part))ac_launch(robot,part,1);
    state->missing=127;state->exploded=1;
    EM_ASM(Module.robotBreakups=(Module.robotBreakups||0)+1;);return 1;
}
void astra_player_hit(object *player,object *killer,fix damage){
    if(damage<=0||!EM_ASM_INT(return !!Module.astra))return;
    vms_vector dir;
    if(ac_contact)vm_vec_sub(&dir,ac_contact,&player->pos);
    else if(killer&&killer!=player)vm_vec_sub(&dir,&killer->pos,&player->pos);
    else {dir=player->mtype.phys_info.velocity;vm_vec_negate(&dir);}
    if(vm_vec_normalize(&dir)<F1_0/100)dir=player->orient.fvec;
    EM_ASM(window.astraImpact?.hit($0,$1,$2,$3);,
      f2fl(vm_vec_dot(&dir,&player->orient.rvec)),f2fl(vm_vec_dot(&dir,&player->orient.uvec)),
      f2fl(vm_vec_dot(&dir,&player->orient.fvec)),f2fl(damage));
}
