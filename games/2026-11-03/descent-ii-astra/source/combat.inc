/* Cosmetic damage follows native object signatures. No simulation RNG or
 * gameplay objects are allocated, and native health/physics remain untouched. */
extern int astra_preview_active,astra_preview_silent;
extern float astra_preview_clock;
static float astra_visual_clock(void){return astra_preview_active?astra_preview_clock:SDL_GetTicks()*.001f;}
object *astra_robot_object;
static float ac_preview_damage=-1;
typedef struct {int signature;fix maximum;float damage;fix64 hit;} ac_damage;
static ac_damage ac_robots[MAX_OBJECTS];
typedef struct {vms_vector origin;fix64 born;int room;unsigned seed;} ac_shed;
static ac_shed ac_chips[24];static unsigned ac_serial;
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
float astra_panel_damage(void){return ac_damage_for(astra_robot_object);}
void astra_combat_clear(void){memset(ac_robots,0,sizeof ac_robots);memset(ac_chips,0,sizeof ac_chips);}
void astra_robot_hit(object *robot,fix damage){
    if(damage<=0||robot->shields<0||!EM_ASM_INT(return !!Module.astra))return;
    int index=ac_index(robot);if(index<0)return;ac_damage *state=&ac_robots[index];
    if(state->signature!=robot->signature||state->maximum<=0){
        memset(state,0,sizeof *state);state->signature=robot->signature;
        state->maximum=Robot_info[robot->id].strength>robot->shields+damage?Robot_info[robot->id].strength:robot->shields+damage;
    }
    float value=ac_damage_for(robot);int before=(int)(state->damage*4),after=(int)(value*4);
    state->damage=value;state->hit=GameTime64;
    if(after>before){
        ac_shed *shed=&ac_chips[ac_serial++%24];
        shed->origin=robot->pos;shed->room=robot->segnum;shed->born=GameTime64;
        shed->seed=ac_hash(robot->signature*1237u+after*919u+ac_serial)|1;
        EM_ASM(Module.armorSheds=(Module.armorSheds||0)+1;);
    }
    EM_ASM(Module.lastRobotDamage=({object:$0,signature:$1,damage:$2});,index,robot->signature,value);
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
