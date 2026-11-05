/* Autonomous spectator pilot. Plans over the real mine graph and drives the
 * same Controls used by a human. No teleports, aim snapping or damage cheats. */
#include "fvi.h"
#include "switch.h"
#include "powerup.h"
#include "robot.h"
#include "fuelcen.h"
int astra_auto_enabled(void){return EM_ASM_INT(return !!Module.autopilot);}
void astra_auto_pause_frame(void){
    static int paused;
    int want=astra_auto_enabled()&&EM_ASM_INT(return !!Module.autoPaused);
    if(want&&!paused){stop_time();paused=1;}
    if(!want&&paused){start_time();paused=0;}
}
static int aa_level=-999,aa_segment=-1,aa_goal=-1,aa_object=-1,aa_wall=-1,aa_mode,aa_route_mode;
static int aa_dist[MAX_SEGMENTS],aa_parent[MAX_SEGMENTS],aa_queue[MAX_SEGMENTS],aa_visits[MAX_SEGMENTS];
static fix64 aa_ignore[MAX_OBJECTS],aa_wall_seen[MAX_WALLS],aa_next,aa_stuck_since,aa_level_since,aa_dead_since,aa_status_next;
static vms_vector aa_last,aa_escape_goal;
static fix64 aa_flare_next,aa_door_flare_next;
static int aa_door_flare_wall=-1,aa_door_flare_count;static float aa_door_flare_distance,aa_cruise_pitch;
static fix64 aa_escape_until,aa_blocked[MAX_SEGMENTS][6];
static int aa_escape_count,aa_escape_room=-1;
static float aa_smooth_rate[3];
static int aa_ignore_signature[MAX_OBJECTS],aa_pick_object=-1,aa_pick_signature,aa_pick_rejected;
static fix64 aa_pick_progress,aa_pick_contact;
static float aa_pick_distance;
static void aa_skip_pickup(int i,int seconds){
    if(i<0||i>Highest_object_index)return;
    if(aa_ignore_signature[i]==Objects[i].signature&&aa_ignore[i]>GameTime64)return;
    aa_ignore[i]=GameTime64+i2f(seconds);aa_ignore_signature[i]=Objects[i].signature;
    aa_next=0;aa_pick_object=-1;aa_pick_rejected++;
}
static fix64 aa_weapon_next,aa_missile_next,aa_missile_ready;
static int aa_pending_missile=-1,aa_pending_target=-1,aa_pending_signature;
static float aa_facing_velocity;
static fix64 aa_attack_until[MAX_OBJECTS];
static int aa_attack_signature[MAX_OBJECTS],aa_recent_attacker=-1,aa_retaliations,aa_combat_target=-1,aa_combat_signature;
static int aa_arsenal_signature=-1;
static int aa_hostile(int i){return i>=0&&i<=Highest_object_index&&Objects[i].type==OBJ_ROBOT&&!(Objects[i].flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING))&&!Robot_info[Objects[i].id].companion;}
/* Perception comes from the main cockpit render, never the object database.
 * Frustum tests use the renderer's actual aspect/zoom. Several body samples
 * allow a partly exposed robot while native ray tests reject walls, closed
 * doors and opaque parts of grates. Extra views and tours cannot grant sight. */
static unsigned char aa_sighted[MAX_OBJECTS];
static int aa_sight_signature[MAX_OBJECTS],aa_sight_active,aa_sight_level,aa_sight_count;
static fix64 aa_sight_time;
static vms_vector aa_sight_eye;
extern vms_vector Viewer_eye;
static int aa_combat_object(int i){return aa_hostile(i)||(i>=0&&i<=Highest_object_index&&Objects[i].type==OBJ_CNTRLCEN&&!(Objects[i].flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING)));}
static int aa_can_see(int i){
    return aa_combat_object(i)&&aa_sight_active&&aa_sight_level==Current_level_num&&
        GameTime64>=aa_sight_time&&GameTime64-aa_sight_time<=F1_0/4&&
        aa_sighted[i]&&aa_sight_signature[i]==Objects[i].signature&&
        !(Objects[i].type==OBJ_ROBOT&&Objects[i].ctype.ai_info.CLOAKED);
}
void astra_auto_sight_begin(int window_num){
    if(window_num)return;
    memset(aa_sighted,0,sizeof aa_sighted);aa_sight_count=0;
    aa_sight_active=astra_auto_enabled()&&Viewer==ConsoleObject&&!Rear_view&&!Player_is_dead&&!Endlevel_sequence;
    aa_sight_level=Current_level_num;aa_sight_time=GameTime64;aa_sight_eye=Viewer_eye;
}
void astra_auto_sight_object(int i,int window_num){
    if(window_num||!aa_sight_active||!aa_combat_object(i))return;
    object *o=&Objects[i];
    if(o->render_type==RT_NONE||(o->type==OBJ_ROBOT&&o->ctype.ai_info.CLOAKED))return;
    if(vm_vec_dist_quick(&o->pos,&aa_sight_eye)>i2f(210))return;
    for(int sample=0;sample<5;sample++){
        vms_vector point=o->pos;g3s_point view;
        if(sample)vm_vec_scale_add2(&point,sample<3?&ConsoleObject->orient.rvec:&ConsoleObject->orient.uvec,fixmul(o->size,fl2f((sample%2?.5f:-.5f))));
        if(g3_rotate_point(&view,&point))continue;
        fvi_query q={&aa_sight_eye,&point,ConsoleObject->segnum,0,ConsoleObject-Objects,NULL,FQ_TRANSPOINT};
        fvi_info hit;
        /* A robot's collision sphere can protrude through a closed door even
         * when its visible hull does not. Test the wall to the body point first. */
        if(find_vector_intersection(&q,&hit)!=HIT_NONE)continue;
        q.flags|=FQ_CHECK_OBJS|FQ_IGNORE_POWERUPS;int result=find_vector_intersection(&q,&hit);
        if(result==HIT_NONE||(result==HIT_OBJECT&&hit.hit_object==i)){
            if(!aa_sighted[i])aa_sight_count++;
            aa_sighted[i]=1;aa_sight_signature[i]=o->signature;return;
        }
    }
}
void astra_auto_attacked(object *o){
    if(!astra_auto_enabled()||!o)return;
    if(o->type==OBJ_WEAPON){int parent=o->ctype.laser_info.parent_num;if(!aa_hostile(parent)||Objects[parent].signature!=o->ctype.laser_info.parent_signature)return;o=&Objects[parent];}
    int i=o-Objects;if(!aa_hostile(i)||!aa_can_see(i))return;
    if(aa_attack_signature[i]!=o->signature||aa_attack_until[i]<GameTime64){aa_retaliations++;aa_next=0;}
    aa_recent_attacker=i;aa_attack_signature[i]=o->signature;aa_attack_until[i]=GameTime64+i2f(10);
}
static int aa_threat(int i){return aa_hostile(i)&&aa_attack_signature[i]==Objects[i].signature&&aa_attack_until[i]>GameTime64;}
static void aa_sense_fire(void){
    for(int i=0;i<=Highest_object_index;i++){
        object *shot=&Objects[i];if(shot->type!=OBJ_WEAPON||shot->ctype.laser_info.parent_type!=OBJ_ROBOT||shot->movement_type!=MT_PHYSICS)continue;
        vms_vector toward,travel=shot->mtype.phys_info.velocity;vm_vec_sub(&toward,&ConsoleObject->pos,&shot->pos);
        float range=f2fl(vm_vec_mag(&toward));if(range>180||range<.1f||vm_vec_mag(&travel)<F1_0)continue;
        vm_vec_normalize(&travel);float closing=f2fl(vm_vec_dot(&toward,&travel));
        if(closing>0 && range*range-closing*closing<18*18)astra_auto_attacked(shot);
    }
}
static void aa_demo_arsenal(void){
    if(!EM_ASM_INT(return !!Module.demoArsenal)||aa_arsenal_signature==ConsoleObject->signature)return;
    aa_arsenal_signature=ConsoleObject->signature;player *p=&Players[Player_num];
    p->primary_weapon_flags=0xffff^(1<<SUPER_LASER_INDEX);p->secondary_weapon_flags=0xffff;
    p->primary_ammo[VULCAN_INDEX]=VULCAN_AMMO_MAX;
    for(int i=0;i<MAX_SECONDARY_WEAPONS;i++)p->secondary_ammo[i]=Secondary_ammo_max[i];
    p->laser_level=MAX_SUPER_LASER_LEVEL;update_laser_weapon_info();
    EM_ASM(Module.demoArsenalGranted=true;);
}
static int aa_recover,aa_seen,aa_deaths,aa_kills,aa_collects;
static float aa_clamp(float x,float a,float b){return fminf(b,fmaxf(a,x));}
static float aa_len(vms_vector *a,vms_vector *b){return f2fl(vm_vec_dist_quick(a,b));}
static int aa_visible(vms_vector *p,fix radius){
    fvi_query q={&ConsoleObject->pos,p,ConsoleObject->segnum,radius,ConsoleObject-Objects,NULL,radius?0:FQ_TRANSPOINT};
    fvi_info hit;return find_vector_intersection(&q,&hit)==HIT_NONE;
}
static int aa_pass(int seg,int side){
    segment *s=&Segments[seg];if(s->children[side]<0||aa_blocked[seg][side]>GameTime64)return 0;
    if(WALL_IS_DOORWAY(s,side)&WID_FLY_FLAG)return 1;
    int w=s->sides[side].wall_num;if(w<0)return 1;
    wall *d=&Walls[w];
    if(d->type==WALL_BLASTABLE)return 1;
    if(d->type!=WALL_DOOR || d->flags&WALL_DOOR_LOCKED)return 0;
    return d->keys==KEY_NONE || !d->keys || (Players[Player_num].flags&d->keys)==d->keys;
}
static void aa_graph(void){
    for(int i=0;i<=Highest_segment_index;i++){aa_dist[i]=-1;aa_parent[i]=-1;}
    int start=ConsoleObject->segnum,a=0,b=0;aa_dist[start]=0;aa_queue[b++]=start;
    while(a<b){int seg=aa_queue[a++];for(int side=0;side<6;side++){
        int child=Segments[seg].children[side];
        if(child>=0 && aa_dist[child]<0 && aa_pass(seg,side)){
            aa_dist[child]=aa_dist[seg]+1;aa_parent[child]=seg;aa_queue[b++]=child;
        }
    }}
}
/* Read-only counterpart of do_powerup's capacity rules, including ammunition
 * inside Vulcan/Gauss weapons and duplicate equipment's single-player energy. */
static float aa_pickup_need(const player *p,const object *o,fix64 now){
    int id=o->id,rack=(p->flags&PLAYER_FLAGS_AMMO_RACK)?2:1;
    float energy=p->energy<i2f(150)?20:0;
    if((o->ctype.powerup_info.flags&PF_SPAT_BY_PLAYER) && o->ctype.powerup_info.creation_time>0 && now<o->ctype.powerup_info.creation_time+i2f(2))return 0;
    if(id==POW_ENERGY)return p->energy<i2f(160)?(p->energy<i2f(35)?230:60):0;
    if(id==POW_SHIELD_BOOST)return p->shields<i2f(160)?(p->shields<i2f(60)?280:80):0;
    if(id>=POW_KEY_BLUE&&id<=POW_KEY_GOLD)return p->flags&(2<<(id-POW_KEY_BLUE))?0:210;
    if(id==POW_LASER)return p->laser_level<MAX_LASER_LEVEL?100:energy;
    if(id==POW_SUPER_LASER)return p->laser_level<MAX_SUPER_LASER_LEVEL?140:energy;
    if(id==POW_QUAD_FIRE)return p->flags&PLAYER_FLAGS_QUAD_LASERS?energy:130;
    if(id==POW_EXTRA_LIFE)return p->lives<MAX_LIVES?100:0;
    if(id==POW_VULCAN_AMMO)return p->primary_ammo[VULCAN_INDEX]<VULCAN_AMMO_MAX*rack?55:0;
    if(id==POW_VULCAN_WEAPON||id==POW_GAUSS_WEAPON){
        int w=id==POW_VULCAN_WEAPON?VULCAN_INDEX:GAUSS_INDEX;
        if(!(p->primary_weapon_flags&(1<<w)))return 125;
        return o->ctype.powerup_info.count>0 && p->primary_ammo[VULCAN_INDEX]<VULCAN_AMMO_MAX*rack?55:0;
    }
    for(int w=1;w<MAX_PRIMARY_WEAPONS;w++)
        if(w!=SUPER_LASER_INDEX && Primary_weapon_to_powerup[w]==id)return p->primary_weapon_flags&(1<<w)?energy:125;
    int single=id;
    switch(id){
      case POW_MISSILE_4:case POW_HOMING_AMMO_4:case POW_SMISSILE1_4:
      case POW_GUIDED_MISSILE_4:case POW_MERCURY_MISSILE_4:single=id-1;break;
    }
    for(int w=0;w<MAX_SECONDARY_WEAPONS;w++)
        if(Secondary_weapon_to_powerup[w]==single)return p->secondary_ammo[w]<Secondary_ammo_max[w]*rack?55:0;
    int flag=0;
    switch(id){
      case POW_FULL_MAP:flag=PLAYER_FLAGS_MAP_ALL;break;
      case POW_CONVERTER:flag=PLAYER_FLAGS_CONVERTER;break;
      case POW_AMMO_RACK:flag=PLAYER_FLAGS_AMMO_RACK;break;
      case POW_AFTERBURNER:flag=PLAYER_FLAGS_AFTERBURNER;break;
      case POW_HEADLIGHT:flag=PLAYER_FLAGS_HEADLIGHT;break;
      case POW_CLOAK:return p->flags&PLAYER_FLAGS_CLOAKED?0:95;
      case POW_INVULNERABILITY:return p->flags&PLAYER_FLAGS_INVULNERABLE?0:95;
    }
    if(flag)return p->flags&flag?energy:95;
    return 0; // Reserved and multiplayer-only objects cannot help this pilot.
}

static void aa_plan(void){
    aa_graph();float best=-1;aa_goal=-1;aa_object=-1;aa_wall=-1;aa_mode=0;
    for(int i=0;i<=Highest_object_index;i++){
        object *o=&Objects[i];int seg=o->segnum;
        if(seg<0||seg>Highest_segment_index||aa_dist[seg]<0||o->flags&OF_SHOULD_BE_DEAD||(aa_ignore[i]>GameTime64&&aa_ignore_signature[i]==o->signature))continue;
        float weight=0;
        if(o->type==OBJ_POWERUP)weight=aa_pickup_need(&Players[Player_num],o,GameTime64);
        if(o->type==OBJ_HOSTAGE)weight=65;
        if(o->type==OBJ_ROBOT&&aa_can_see(i))weight=aa_threat(i)?650:85;
        if(o->type==OBJ_CNTRLCEN&&!Control_center_destroyed&&aa_can_see(i))weight=GameTime64-aa_level_since>i2f(180)?120:45;
        if(Control_center_destroyed)weight=0;
        float score=weight/(1+aa_dist[seg]*1.9f+aa_len(&o->pos,&ConsoleObject->pos)*.012f);
        if(score>best&&weight>0){best=score;aa_goal=seg;aa_object=i;aa_mode=o->type==OBJ_POWERUP?1:o->type==OBJ_HOSTAGE?2:3;}
    }
    for(int i=0;i<Num_walls;i++){
        wall *w=&Walls[i];if(w->trigger<0||w->trigger>=Num_triggers||aa_dist[w->segnum]<0)continue;
        trigger *t=&Triggers[w->trigger];if(t->flags&TF_DISABLED)continue;
        int exit=t->type==TT_EXIT || (Current_level_num<0 && t->type==TT_SECRET_EXIT);
        int unlock=t->type==TT_OPEN_DOOR||t->type==TT_UNLOCK_DOOR||t->type==TT_OPEN_WALL||t->type==TT_ILLUSION_OFF;
        if((!exit&&!unlock)||(exit&&!Control_center_destroyed)||(!exit&&aa_wall_seen[i]>GameTime64))continue;
        float score=(exit?20000.f:38.f)/(1+aa_dist[w->segnum]*1.6f);
        if(score>best){best=score;aa_goal=w->segnum;aa_wall=i;aa_object=-1;aa_mode=exit?5:4;}
    }
    if(aa_goal<0){
        for(int i=0;i<=Highest_segment_index;i++)if(aa_dist[i]>=0&&i!=ConsoleObject->segnum){
            float score=28.f/((1+aa_dist[i])*(1+aa_visits[i]*4));
            if(score>best){best=score;aa_goal=i;aa_object=aa_wall=-1;aa_mode=0;}
        }
    }
    aa_route_mode=aa_mode;aa_next=GameTime64+F1_0/2;
}
static int aa_sliding,aa_slide_count;
static float aa_drive_intent;
static vms_vector aa_slide_heading;
static fix64 aa_slide_until;
static int aa_slide_goal=-2;
static void aa_move(vms_vector target,float speed){
    object *ship=ConsoleObject;vms_vector delta;vm_vec_sub(&delta,&target,&ship->pos);
    float distance=f2fl(vm_vec_mag(&delta));if(distance>.01f)vm_vec_normalize(&delta);
    float facing=f2fl(vm_vec_dot(&delta,&ship->orient.fvec));
    float aligned=aa_clamp((facing-.35f)/.60f,0,1);
    float desired=copysignf(fminf(fabsf(speed),sqrtf(65*fmaxf(0,distance-.65f))),speed);
    if(aa_sliding)desired=aa_clamp(desired,-20,24);
    else if(speed>0)desired*=aligned;
    aa_drive_intent=fabsf(desired);
    /* All three native thrust axes track a world-space velocity. Small offsets
     * no longer require rotating the cockpit onto the movement direction. */
    vms_vector dirs[3]={ship->orient.rvec,ship->orient.uvec,ship->orient.fvec};
    fix *output[3]={&Controls.sideways_thrust_time,&Controls.vertical_thrust_time,&Controls.forward_thrust_time};
    for(int k=0;k<3;k++){
        float goal=f2fl(vm_vec_dot(&delta,&dirs[k]))*desired;
        if(!aa_sliding&&k!=2)goal=aa_clamp(goal,-16,16);
        float velocity=f2fl(vm_vec_dot(&ship->mtype.phys_info.velocity,&dirs[k]));
        float drag=f2fl(ship->mtype.phys_info.drag),mass=f2fl(ship->mtype.phys_info.mass);
        float hold=goal*mass*drag/fmaxf(.01f,(1-drag)*f2fl(Player_ship->max_thrust));
        *output[k]=fl2f(aa_clamp(hold+(goal-velocity)*.12f,-1,1)*f2fl(FrameTime));
    }
}
/* Aim and level through the original rotational thrust controls. Rates are
 * turns/second in D2; angular errors below are radians. */
static vms_vector aa_up,aa_watch_point,aa_last_foe,aa_target_velocity;
static int aa_up_ready,aa_last_kills,aa_watch_count,aa_switches,aa_last_target=-1;
static fix64 aa_watch_until,aa_target_since,aa_weapon_changed,aa_dodge_next;
static float aa_roll_error,aa_aim_error,aa_turn_side=1,aa_dodge_side=1;
static float aa_rotation_control(float error,float rate,float limit,float feedforward,int axis){
    float acceleration=axis==2?.11f:.27f,dt=aa_clamp(f2fl(FrameTime),0,.1f);
    float brake=sqrtf(2*acceleration*fabsf(error)/6.2831853f);
    float wanted=copysignf(fminf(fabsf(error)*3.1f/6.2831853f,brake),error)+feedforward/6.2831853f;
    wanted=aa_clamp(wanted,-limit,limit);
    if(!aa_up_ready)aa_smooth_rate[axis]=rate;
    aa_smooth_rate[axis]+=aa_clamp(wanted-aa_smooth_rate[axis],-acceleration*dt,acceleration*dt);
    wanted=aa_smooth_rate[axis];
    physics_info *p=&ConsoleObject->mtype.phys_info;
    float drag=aa_clamp(f2fl(p->drag)*2.5f,.01f,.90f);
    float gain=64*(1-drag)*f2fl(Player_ship->max_rotthrust)/fmaxf(.01f,f2fl(p->mass));
    return aa_clamp((64*drag*wanted+(wanted-rate)*8)/fmaxf(.01f,gain),-1,1);
}
static void aa_level_up(void){
    if(!aa_up_ready){aa_up=ConsoleObject->orient.uvec;aa_up_ready=1;}
    /* Segment side numbers can rotate between rooms. Keep a remembered up
     * reference and choose the nearest mine plane to it, never to a temporary
     * bank caused by combat. This follows sloping corridors without flipping
     * onto a new wall just because its authored side number is 'floor'. */
    vms_vector desired=aa_up;fix best=-F1_0;
    for(int i=0;i<6;i++){
        side *plane=&Segments[ConsoleObject->segnum].sides[i];vms_vector normal=plane->normals[0];
        if(get_num_faces(plane)==2)vm_vec_add2(&normal,&plane->normals[1]);
        if(vm_vec_normalize(&normal)<F1_0/100)continue;
        fix alignment=vm_vec_dot(&normal,&aa_up);
        if(alignment>best){best=alignment;desired=normal;}
    }
    float t=aa_clamp(f2fl(FrameTime)*1.6f,0,.12f);
    vms_vector next;vm_vec_copy_scale(&next,&aa_up,fl2f(1-t));vm_vec_scale_add2(&next,&desired,fl2f(t));
    if(vm_vec_normalize(&next)>F1_0/100)aa_up=next;
}
/* Sliding holds a heading, not an accidental nose-up attitude. Small vertical
 * offsets use translation; only real climbs/shafts tilt the cruise camera. */
static void aa_cruise_direction(vms_vector *direction){
    fix rise=vm_vec_dot(direction,&aa_up);vms_vector flat=*direction;
    vm_vec_scale_add2(&flat,&aa_up,-rise);fix horizontal=vm_vec_normalize(&flat);
    float vertical=f2fl(rise);
    if(!aa_sliding&&horizontal<F1_0/10)return;
    if(horizontal<F1_0/10){flat=ConsoleObject->orient.fvec;vm_vec_scale_add2(&flat,&aa_up,-vm_vec_dot(&flat,&aa_up));if(vm_vec_normalize(&flat)<F1_0/10)return;}
    vertical*=aa_sliding?0:aa_clamp((fabsf(vertical)-.38f)/.42f,0,1);
    vm_vec_copy_scale(direction,&flat,fl2f(sqrtf(fmaxf(0,1-vertical*vertical))));vm_vec_scale_add2(direction,&aa_up,fl2f(vertical));vm_vec_normalize(direction);
}
static float aa_aim(vms_vector target,int focus){
    object *ship=ConsoleObject;vms_vector d;vm_vec_sub(&d,&target,&ship->pos);
    float distance=f2fl(vm_vec_normalize(&d));if(distance<.01f)d=ship->orient.fvec;
    aa_level_up();if(!focus)aa_cruise_direction(&d);
    float x=f2fl(vm_vec_dot(&d,&ship->orient.rvec)),y=f2fl(vm_vec_dot(&d,&ship->orient.uvec)),z=f2fl(vm_vec_dot(&d,&ship->orient.fvec));
    float alignment=z;aa_aim_error=acosf(aa_clamp(z,-1,1))*57.29578f;
    if(!focus){
        vms_vector travel=ship->mtype.phys_info.velocity;fix motion=vm_vec_mag(&travel),ahead=vm_vec_dot(&travel,&ship->orient.fvec);
        if(motion>i2f(28)&&z<.45f&&ahead>fixmul(motion,fl2f(.75f))){
            vm_vec_normalize(&travel);aa_cruise_direction(&travel);x=f2fl(vm_vec_dot(&travel,&ship->orient.rvec));y=f2fl(vm_vec_dot(&travel,&ship->orient.uvec));z=f2fl(vm_vec_dot(&travel,&ship->orient.fvec));
        }
    }
    float yaw=atan2f(x,z),pitch=-atan2f(y,sqrtf(x*x+z*z));
    if(fabsf(yaw)>2.9f)yaw=fabsf(yaw)*aa_turn_side;else if(fabsf(yaw)>.08f)aa_turn_side=yaw>0?1:-1;
    float dt=f2fl(FrameTime),limit=focus?.22f:.17f,feed_yaw=0,feed_pitch=0;
    if(focus==1&&distance>4){
        vms_vector relative;vm_vec_sub(&relative,&aa_target_velocity,&ship->mtype.phys_info.velocity);
        float weight=aa_clamp(z,0,1);weight=weight*weight/distance;
        feed_yaw=f2fl(vm_vec_dot(&relative,&ship->orient.rvec))*weight;
        feed_pitch=-f2fl(vm_vec_dot(&relative,&ship->orient.uvec))*weight;
    }
    Controls.heading_time=fl2f(aa_rotation_control(yaw,f2fl(ship->mtype.phys_info.rotvel.y),limit,feed_yaw,1)*dt);
    Controls.pitch_time=fl2f(aa_rotation_control(pitch,f2fl(ship->mtype.phys_info.rotvel.x),limit,feed_pitch,0)*dt);
    aa_cruise_pitch=asinf(aa_clamp(f2fl(vm_vec_dot(&ship->orient.fvec,&aa_up)),-1,1))*57.29578f;
    float ux=f2fl(vm_vec_dot(&aa_up,&ship->orient.rvec)),uy=f2fl(vm_vec_dot(&aa_up,&ship->orient.uvec));
    float projected=sqrtf(ux*ux+uy*uy),roll=projected>.25f?atan2f(-ux,uy):0;
    aa_roll_error=roll*57.29578f;
    Controls.bank_time=fl2f(aa_rotation_control(roll,f2fl(ship->mtype.phys_info.rotvel.z),.060f,0,2)*dt);
    return alignment;
}
/* Only fire at a native, reachable door. Keys and locks still belong to D2.
 * The second ray starts at the real flare barrel and follows its firing axis. */
static int aa_flare_door(int number,int firing){
    if(number<0||number>=Num_walls)return 0;wall *door=&Walls[number];
    if(door->type!=WALL_DOOR||!aa_pass(door->segnum,door->sidenum)||
       (door->state!=WALL_DOOR_CLOSED&&door->state!=WALL_DOOR_CLOSING))return 0;
    vms_vector center,start=ConsoleObject->pos,end,d;compute_center_point_on_side(&center,&Segments[door->segnum],door->sidenum);
    float distance=aa_len(&center,&start);if(distance>100||distance<f2fl(ConsoleObject->size)*1.2f)return 0;
    int room=ConsoleObject->segnum;
    if(firing){vms_matrix inverse;vm_copy_transpose_matrix(&inverse,&ConsoleObject->orient);vm_vec_rotate(&d,&Player_ship->gun_points[6],&inverse);vm_vec_add2(&start,&d);
        room=find_point_seg(&start,room);if(room<0)return 0;d=ConsoleObject->orient.fvec;
    }else vm_vec_normalized_dir(&d,&center,&start);
    vm_vec_scale_add(&end,&start,&d,fl2f(distance+4));fvi_query q={&start,&end,room,0,ConsoleObject-Objects,NULL,0};fvi_info hit;
    return find_vector_intersection(&q,&hit)==HIT_WALL&&hit.hit_side_seg==door->segnum&&hit.hit_side==door->sidenum;
}
/* Recovery uses collision-tested clearance and normal translational thrust.
 * It also runs during combat; seeing an enemy no longer suppresses recovery. */
static int aa_escape_pick(vms_vector target){
    object *o=ConsoleObject;float best=-1;vms_vector selected=o->pos,toward;
    vm_vec_normalized_dir(&toward,&target,&o->pos);
    for(int i=0;i<27;i++){
        int n=(i+aa_recover*7)%27,x=n%3-1,y=(n/3)%3-1,z=n/9-1;if(!x&&!y&&!z)continue;
        vms_vector direction={0};vm_vec_scale_add2(&direction,&o->orient.rvec,i2f(x));vm_vec_scale_add2(&direction,&o->orient.uvec,i2f(y));vm_vec_scale_add2(&direction,&o->orient.fvec,i2f(z));vm_vec_normalize(&direction);
        for(int step=0;step<2;step++){
            float distance=step?6:12;vms_vector candidate;vm_vec_scale_add(&candidate,&o->pos,&direction,fl2f(distance));
            if(!aa_visible(&candidate,fixmul(o->size,fl2f(.92f))))continue;
            float score=distance+f2fl(vm_vec_dot(&direction,&toward))*2.f+f2fl(vm_vec_dot(&direction,&o->orient.uvec))*.8f;
            if(score>best){best=score;selected=candidate;}break;
        }
    }
    if(best<0){compute_segment_center(&selected,&Segments[o->segnum]);if(!aa_visible(&selected,0))return 0;}
    aa_escape_goal=selected;aa_escape_until=GameTime64+F1_0*7/2;aa_escape_count++;aa_recover++;return 1;
}
static void aa_escape_move(void){
    object *o=ConsoleObject;vms_vector d;vm_vec_sub(&d,&aa_escape_goal,&o->pos);float distance=f2fl(vm_vec_normalize(&d));
    float speed=fminf(12,sqrtf(fmaxf(0,distance-.5f)*35));
    vms_vector axes[3]={o->orient.rvec,o->orient.uvec,o->orient.fvec};fix *out[3]={&Controls.sideways_thrust_time,&Controls.vertical_thrust_time,&Controls.forward_thrust_time};
    for(int k=0;k<3;k++){
        float goal=f2fl(vm_vec_dot(&d,&axes[k]))*speed,velocity=f2fl(vm_vec_dot(&o->mtype.phys_info.velocity,&axes[k]));
        float drag=f2fl(o->mtype.phys_info.drag),mass=f2fl(o->mtype.phys_info.mass);
        float hold=goal*mass*drag/fmaxf(.01f,(1-drag)*f2fl(Player_ship->max_thrust));
        *out[k]=fl2f(aa_clamp(hold+(goal-velocity)*.14f,-1,1)*f2fl(FrameTime));
    }
}
static int aa_primary_safe(int w,float distance){
    float blast=f2fl(Weapon_info[Primary_weapon_to_weapon_info[w]].damage_radius);
    if(blast<=0)return 1;
    float clearance=blast+f2fl(ConsoleObject->size)+4;
    if(distance<clearance)return 0;
    vms_vector ahead;vm_vec_scale_add(&ahead,&ConsoleObject->pos,&ConsoleObject->orient.fvec,fl2f(clearance));
    return aa_visible(&ahead,fixmul(ConsoleObject->size,fl2f(.7f)));
}
static float aa_weapon_score(int w,float distance,int enemy){
    if(w==SUPER_LASER_INDEX||player_has_weapon(Player_num,w,0)!=HAS_ALL||!aa_primary_safe(w,distance))return -100;
    float shields=enemy>=0?f2fl(Objects[enemy].shields):0,score=1;
    switch(w){
      case LASER_INDEX:score=Players[Player_num].laser_level>=MAX_LASER_LEVEL?2.35f:1.8f;break;
      case VULCAN_INDEX:score=distance>75?2.45f:1.5f;break;
      case GAUSS_INDEX:score=distance>65?3.3f:2.15f;break;
      case SPREADFIRE_INDEX:score=distance<40?2.65f:1.2f;break;
      case HELIX_INDEX:score=distance<48?3.1f:1.8f;break;
      case PLASMA_INDEX:score=distance<95?2.85f:1.5f;break;
      case PHOENIX_INDEX:score=distance>45&&distance<100?2.4f:.7f;break;
      case FUSION_INDEX:score=shields>140&&distance>55?3.4f:1.1f;if(distance<35)score=-10;break;
      case OMEGA_INDEX:score=distance<48?3.2f:1.5f;if(distance>65)score=-10;break;
    }
    if(Players[Player_num].energy<i2f(35))score+=(w==VULCAN_INDEX||w==GAUSS_INDEX)?1.5f:-1.2f;
    return score;
}
static void aa_choose_weapon(float distance,int enemy){
    player *p=&Players[Player_num];int current=p->primary_weapon;
    int unavailable=player_has_weapon(Player_num,current,0)!=HAS_ALL;
    int unsafe=!aa_primary_safe(current,distance);
    if(enemy<0&&!unavailable&&!unsafe)return; /* Keep a safe gun for doors/switches. */
    int unsuitable=unsafe||(current==OMEGA_INDEX&&distance>75)||(current==FUSION_INDEX&&distance<24);
    if(!unavailable&&!unsuitable&&GameTime64<aa_weapon_next)return;
    float present=aa_weapon_score(current,distance,enemy),best=present;int selected=current;
    for(int w=0;w<MAX_PRIMARY_WEAPONS;w++){float score=aa_weapon_score(w,distance,enemy);if(score>best){best=score;selected=w;}}
    if(selected!=current&&(unavailable||unsuitable||best>present+.55f)){
        select_weapon(selected,0,0,1);aa_switches++;aa_weapon_changed=GameTime64;
        aa_weapon_next=GameTime64+i2f(14);
    }else aa_weapon_next=GameTime64+i2f(3);
}

void astra_auto_frame(void){
    if(!astra_auto_enabled()||!ConsoleObject)return;
    memset(&Controls,0,sizeof Controls);
    if(Player_is_dead){
        aa_pending_missile=-1;aa_weapon_next=aa_missile_next=0;aa_watch_until=0;aa_up_ready=0;
        if(!aa_dead_since){aa_dead_since=GameTime64;aa_deaths++;}
        if(Player_exploded&&GameTime64-aa_dead_since>i2f(11))Death_sequence_aborted=1;
        EM_ASM(window.astraAutoStatus?.("Ship lost - relaunching",$0,$1,$2,$3);,aa_seen,aa_deaths,aa_kills,aa_collects);
        return;
    }
    if(aa_dead_since){aa_flare_next=GameTime64+i2f(3);aa_door_flare_next=0;aa_door_flare_wall=-1;}
    if(aa_dead_since){aa_sliding=0;aa_slide_until=0;aa_slide_goal=-2;aa_escape_until=0;aa_escape_room=-1;aa_arsenal_signature=-1;aa_combat_target=-1;aa_next=0;aa_pick_object=aa_object=aa_goal=-1;aa_up_ready=0;aa_last_kills=Players[Player_num].num_kills_total;aa_weapon_next=GameTime64+i2f(8);}
    aa_dead_since=0;if(Endlevel_sequence)return;
    if(aa_level!=Current_level_num){
        aa_sliding=0;aa_slide_until=0;aa_slide_goal=-2;aa_escape_until=0;aa_escape_room=-1;memset(aa_blocked,0,sizeof aa_blocked);
        aa_weapon_next=GameTime64+i2f(8);aa_missile_next=0;aa_pending_missile=-1;aa_watch_until=0;aa_up_ready=0;
        aa_last_target=-1;aa_last_kills=Players[Player_num].num_kills_total;aa_weapon_changed=GameTime64;
        aa_arsenal_signature=-1;aa_recent_attacker=aa_combat_target=-1;memset(aa_attack_until,0,sizeof aa_attack_until);
        aa_flare_next=GameTime64+i2f(2);aa_door_flare_next=0;aa_door_flare_wall=-1;
        aa_level=Current_level_num;aa_level_since=GameTime64;aa_next=aa_status_next=0;aa_segment=-1;aa_seen=0;
        memset(aa_visits,0,sizeof aa_visits);memset(aa_ignore,0,sizeof aa_ignore);memset(aa_wall_seen,0,sizeof aa_wall_seen);
        aa_last=ConsoleObject->pos;aa_stuck_since=GameTime64;
    }
    aa_demo_arsenal();aa_sense_fire();
    /* Keep a confirmed destruction in frame before moving to the next target.
     * This is a short tactical pause, cancelled by an immediate close threat. */
    if(Players[Player_num].num_kills_total>aa_last_kills && aa_combat_target>=0){
        object *last=&Objects[aa_combat_target];
        if(last->signature!=aa_combat_signature || !aa_hostile(aa_combat_target) || last->shields<0){
            aa_watch_point=aa_last_foe;aa_watch_until=GameTime64+F1_0*3/2;aa_watch_count++;aa_pending_missile=-1;
        }
    }
    aa_last_kills=Players[Player_num].num_kills_total;
    int seg=ConsoleObject->segnum;
    if(seg!=aa_segment){if(!aa_visits[seg])aa_seen++;aa_visits[seg]++;aa_segment=seg;aa_next=0;}
    if(GameTime64>=aa_next||aa_goal<0||(aa_combat_object(aa_object)&&!aa_can_see(aa_object)))aa_plan();
    aa_mode=aa_route_mode;vm_vec_zero(&aa_target_velocity);
    vms_vector target;compute_segment_center(&target,&Segments[seg]);
    int door=-1;
    if(aa_goal>=0){
        if(seg==aa_goal){
            if(aa_object>=0 && Objects[aa_object].type!=OBJ_NONE)target=Objects[aa_object].pos;
            if(aa_wall>=0)compute_center_point_on_side(&target,&Segments[seg],Walls[aa_wall].sidenum);
        }else{
            int next=aa_goal,limit=0;
            while(aa_parent[next]>=0&&aa_parent[next]!=seg&&limit++<MAX_SEGMENTS)next=aa_parent[next];
            for(int s=0;s<6;s++)if(Segments[seg].children[s]==next){
                compute_center_point_on_side(&target,&Segments[seg],s);
                vms_vector beyond,dir;compute_segment_center(&beyond,&Segments[next]);vm_vec_sub(&dir,&beyond,&target);vm_vec_normalize(&dir);
                if(!(WALL_IS_DOORWAY(&Segments[seg],s)&WID_FLY_FLAG))door=Segments[seg].sides[s].wall_num;
                vm_vec_scale_add2(&target,&dir,door>=0?-ConsoleObject->size:i2f(7));
                break;
            }
        }
    }
    int flare_door=aa_flare_door(door,0)?door:-1;
    /* Look through several open portals instead of stopping at every room.
     * A swept ship-radius ray keeps the shortcut inside the actual mine. */
    if(door<0 && aa_goal>=0 && seg!=aa_goal){
        int path[MAX_SEGMENTS],count=0,at=aa_goal;
        while(at>=0&&at!=seg&&count<MAX_SEGMENTS){path[count++]=at;at=aa_parent[at];}
        int from=seg;
        if(at==seg)for(int p=count-1;p>=0&&p>=count-4;p--){
            int next=path[p],side=-1;for(int j=0;j<6;j++)if(Segments[from].children[j]==next){side=j;break;}
            if(side<0)break;
            if(!(WALL_IS_DOORWAY(&Segments[from],side)&WID_FLY_FLAG)){
                int w=Segments[from].sides[side].wall_num;if(aa_flare_door(w,0))flare_door=w;break;
            }
            vms_vector candidate;compute_segment_center(&candidate,&Segments[next]);
            if(aa_len(&candidate,&ConsoleObject->pos)>95||!aa_visible(&candidate,ConsoleObject->size))break;
            target=candidate;from=next;
        }
    }
    /* A rejected collision or a stalled approach must not hold the pilot in
     * an orbit. Object signatures prevent cooldowns leaking to reused slots. */
    if(aa_object>=0 && aa_mode==1){
        object *pickup=&Objects[aa_object];float distance=aa_len(&pickup->pos,&ConsoleObject->pos);
        if(aa_pick_object!=aa_object||aa_pick_signature!=pickup->signature){
            aa_pick_object=aa_object;aa_pick_signature=pickup->signature;
            aa_pick_distance=distance;aa_pick_progress=GameTime64;aa_pick_contact=0;
        }
        if(distance<aa_pick_distance-1){aa_pick_distance=distance;aa_pick_progress=GameTime64;}
        if(seg==pickup->segnum && distance<f2fl(ConsoleObject->size+pickup->size)+1){
            if(!aa_pick_contact)aa_pick_contact=GameTime64;
        }else aa_pick_contact=0;
        if(pickup->type!=OBJ_POWERUP || !aa_pickup_need(&Players[Player_num],pickup,GameTime64))aa_next=0;
        else if(GameTime64-aa_pick_progress>i2f(6)||(aa_pick_contact&&GameTime64-aa_pick_contact>F1_0))aa_skip_pickup(aa_object,30);
    }else aa_pick_object=-1;
    if(aa_wall>=0 && seg==aa_goal && aa_mode==4 && aa_len(&target,&ConsoleObject->pos)<10){aa_wall_seen[aa_wall]=GameTime64+i2f(35);}
    /* Aim at the closest visible threat; the guide-bot is never a target. */
    int enemy=-1;float threat=0;
    for(int i=0;i<=Highest_object_index;i++){
        object *o=&Objects[i];if(o->type!=OBJ_ROBOT&&o->type!=OBJ_CNTRLCEN)continue;
        if(o->flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING))continue;
        if(o->type==OBJ_ROBOT&&Robot_info[o->id].companion)continue;
        float d=aa_len(&o->pos,&ConsoleObject->pos);if(!aa_can_see(i))continue;
        float s=(aa_threat(i)?12.f:o->type==OBJ_CNTRLCEN?.65f:1.f)/(d+24);
        if(i==aa_combat_target&&o->signature==aa_combat_signature)s*=1.5f;
        if(s>threat){threat=s;enemy=i;}
    }
    int locked=aa_combat_target;
    if(aa_hostile(locked) && Objects[locked].signature==aa_combat_signature &&
       aa_can_see(locked)){
        int urgent=enemy>=0&&enemy!=locked&&aa_threat(enemy)&&
            aa_len(&Objects[enemy].pos,&ConsoleObject->pos)<22&&aa_len(&Objects[locked].pos,&ConsoleObject->pos)>65;
        if(!urgent)enemy=locked;
    }
    if(enemy!=aa_last_target){aa_target_since=GameTime64;aa_last_target=enemy;}
    aa_combat_target=enemy;if(enemy>=0){aa_combat_signature=Objects[enemy].signature;aa_last_foe=Objects[enemy].pos;}
    if(aa_pending_missile>=0&&!aa_can_see(aa_pending_target))aa_pending_missile=-1;
    float speed=Control_center_destroyed?58:52;
    vms_vector aim=target;int attacking=0;
    if(door>=0){compute_center_point_on_side(&aim,&Segments[Walls[door].segnum],Walls[door].sidenum);aa_mode=6;}
    if(enemy>=0 && !Control_center_destroyed){
        object *foe=&Objects[enemy];aim=foe->pos;attacking=1;door=-1;flare_door=-1;
        float distance=aa_len(&aim,&ConsoleObject->pos);
        int wi=Primary_weapon_to_weapon_info[Players[Player_num].primary_weapon];
        float projectile_speed=fmaxf(55,f2fl(Weapon_info[wi].speed[Difficulty_level]));
        if(foe->movement_type==MT_PHYSICS && wi!=OMEGA_ID){
            vms_vector lead;vm_vec_copy_scale(&lead,&foe->mtype.phys_info.velocity,fl2f(fminf(.18f,distance/projectile_speed)));
            fix len=vm_vec_mag(&lead),limit=fixmul(foe->size,fl2f(.45f));
            if(len>limit&&len>0)vm_vec_scale(&lead,fixdiv(limit,len));vm_vec_add2(&aim,&lead);
        }
        /* Hold a firing lane. Back away from a rammer without turning our back
         * on it, and brake before reaching the preferred fighting distance. */
        vms_vector line;vm_vec_normalized_dir_quick(&line,&foe->pos,&ConsoleObject->pos);
        float closing=foe->movement_type==MT_PHYSICS?fmaxf(0,-f2fl(vm_vec_dot(&foe->mtype.phys_info.velocity,&line))):0;
        float preferred=55+fminf(18,closing*.30f),gap=distance-preferred;
        target=aim;speed=fabsf(gap)<7?0:aa_clamp(gap*1.3f,-24,36);aa_mode=3;
        if(foe->movement_type==MT_PHYSICS)aa_target_velocity=foe->mtype.phys_info.velocity;
        if(speed<0){vms_vector back;vm_vec_scale_add(&back,&ConsoleObject->pos,&ConsoleObject->orient.fvec,-i2f(16));if(!aa_visible(&back,ConsoleObject->size))speed=0;}
    }
    int watching=aa_watch_until>GameTime64&&!Control_center_destroyed;
    if(watching && (Players[Player_num].shields<i2f(25)||(enemy>=0&&aa_threat(enemy)&&aa_len(&Objects[enemy].pos,&ConsoleObject->pos)<38))){aa_watch_until=0;watching=0;}
    if(watching){aim=target=aa_watch_point;speed=0;attacking=0;door=-1;flare_door=-1;aa_mode=8;aa_stuck_since=GameTime64;vm_vec_zero(&aa_target_velocity);}
    if(flare_door>=0){
        wall *gate=&Walls[flare_door];compute_center_point_on_side(&aim,&Segments[gate->segnum],gate->sidenum);
        float distance=aa_len(&aim,&ConsoleObject->pos);
        /* Allow the flare and the native door animation to arrive first. */
        speed=fminf(speed,fmaxf(5,(distance-8)/1.8f));
        vms_matrix inverse;vms_vector muzzle;vm_copy_transpose_matrix(&inverse,&ConsoleObject->orient);vm_vec_rotate(&muzzle,&Player_ship->gun_points[6],&inverse);vm_vec_sub2(&aim,&muzzle);aa_mode=6;
    }
    vms_vector travel_direction;float travel_distance=f2fl(vm_vec_normalized_dir(&travel_direction,&target,&ConsoleObject->pos));
    float travel_facing=f2fl(vm_vec_dot(&travel_direction,&ConsoleObject->orient.fvec));
    int short_slide=!attacking&&!watching&&door<0&&flare_door<0&&!(aa_wall>=0&&seg==aa_goal)&&travel_distance<38&&
        (travel_facing>.05f||travel_distance<17)&&aa_visible(&target,fixmul(ConsoleObject->size,fl2f(.95f)));
    if(aa_slide_goal!=aa_goal||!short_slide||GameTime64>aa_slide_until)aa_sliding=0;
    if(short_slide&&!aa_sliding){
        aa_slide_heading=ConsoleObject->orient.fvec;aa_slide_until=GameTime64+i2f(4);aa_slide_goal=aa_goal;aa_slide_count++;
    }
    aa_sliding=short_slide;
    if(aa_sliding)vm_vec_scale_add(&aim,&ConsoleObject->pos,&aa_slide_heading,i2f(60));
    /* Combat keeps its firing lane; positional corrections may use all axes. */
    int wants_travel=fabsf(speed)>=8;
    /* A hull can rock across a portal without making any progress. Neither a
     * room change nor an unfinished turn resets this spatial watchdog. */
    if(aa_len(&aa_last,&ConsoleObject->pos)>4.5f||watching||!wants_travel){
        if(aa_escape_room!=seg){aa_escape_room=seg;aa_recover=0;}
        aa_last=ConsoleObject->pos;aa_stuck_since=GameTime64;
    }
    if(aa_escape_until>0&&(GameTime64>=aa_escape_until||aa_len(&aa_escape_goal,&ConsoleObject->pos)<1.5f)){aa_escape_until=0;aa_stuck_since=GameTime64;aa_last=ConsoleObject->pos;aa_next=0;}
    if(!aa_escape_until&&!watching&&wants_travel&&GameTime64-aa_stuck_since>F1_0*(attacking?3:5)){
        if(aa_recover>=2){
            if(aa_object>=0)aa_skip_pickup(aa_object,45);
            if(aa_wall>=0)aa_wall_seen[aa_wall]=GameTime64+i2f(45);
            int next=aa_goal,limit=0;while(next>=0&&aa_parent[next]>=0&&aa_parent[next]!=seg&&limit++<MAX_SEGMENTS)next=aa_parent[next];
            for(int side=0;side<6;side++)if(Segments[seg].children[side]==next)aa_blocked[seg][side]=GameTime64+i2f(45);
            aa_next=0;
        }
        aa_escape_pick(target);aa_stuck_since=GameTime64;
    }
    int escaping=aa_escape_until>GameTime64;
    if(escaping){aa_escape_move();aa_mode=7;}else aa_move(target,speed);
    float alignment=aa_aim(aim,attacking||watching?1:door>=0||flare_door>=0||(aa_wall>=0&&seg==aa_goal)?2:0);
    if(!escaping&&attacking&&alignment>.97f&&enemy>=0&&aa_threat(enemy)&&fabsf(speed)<30){
        /* A small, deliberate lateral dodge keeps the nose on the opponent.
         * Reverse only for clearance, not according to a periodic sine wave. */
        vms_vector sidepoint;vm_vec_scale_add(&sidepoint,&ConsoleObject->pos,&ConsoleObject->orient.rvec,fl2f(aa_dodge_side*12));
        if(!aa_visible(&sidepoint,ConsoleObject->size)&&GameTime64>aa_dodge_next){aa_dodge_side=-aa_dodge_side;aa_dodge_next=GameTime64+i2f(3);vm_vec_scale_add(&sidepoint,&ConsoleObject->pos,&ConsoleObject->orient.rvec,fl2f(aa_dodge_side*12));}
        if(aa_visible(&sidepoint,ConsoleObject->size)){
            float desired=aa_dodge_side*(aa_len(&Objects[enemy].pos,&ConsoleObject->pos)<35?13:7),velocity=f2fl(vm_vec_dot(&ConsoleObject->mtype.phys_info.velocity,&ConsoleObject->orient.rvec));
            float drag=f2fl(ConsoleObject->mtype.phys_info.drag),mass=f2fl(ConsoleObject->mtype.phys_info.mass);
            float hold=desired*mass*drag/fmaxf(.01f,(1-drag)*f2fl(Player_ship->max_thrust));
            Controls.sideways_thrust_time=fl2f(aa_clamp(hold+(desired-velocity)*.14f,-1,1)*f2fl(FrameTime));
        }
    }
    if(!watching&&(attacking||(door>=0&&Walls[door].type==WALL_BLASTABLE)||(aa_wall>=0&&seg==aa_goal&&aa_mode==4))){
        if(alignment>.985f){
            float distance=enemy>=0?aa_len(&Objects[enemy].pos,&ConsoleObject->pos):aa_len(&aim,&ConsoleObject->pos);
            aa_choose_weapon(distance,enemy);
            Controls.fire_primary_state=aa_primary_safe(Players[Player_num].primary_weapon,distance)&&(Players[Player_num].primary_weapon!=FUSION_INDEX || (GameTime64%(F1_0*3/2))<F1_0);
            if(aa_pending_missile>=0&&(enemy!=aa_pending_target||enemy<0||Objects[enemy].signature!=aa_pending_signature))aa_pending_missile=-1;
            if(attacking&&distance>48&&alignment>.994f&&aa_pending_missile<0&&GameTime64>=aa_missile_next){
                int tough=Objects[enemy].shields>i2f(140)&&distance>115;
                int order[]={distance>95?SMISSILE4_INDEX:HOMING_INDEX,HOMING_INDEX,CONCUSSION_INDEX,SMISSILE1_INDEX,MEGA_INDEX,SMART_INDEX,SMISSILE5_INDEX};
                for(int m=0;m<7;m++){
                    int w=order[m];if(!Players[Player_num].secondary_ammo[w]||(m>=4&&!tough))continue;
                    if(Players[Player_num].secondary_weapon!=w)select_weapon(w,1,0,1);
                    aa_pending_missile=w;aa_pending_target=enemy;aa_pending_signature=Objects[enemy].signature;aa_missile_ready=GameTime64+F1_0*11/10;break;
                }
            }
            int heavy=aa_pending_missile==SMART_INDEX||aa_pending_missile==MEGA_INDEX||aa_pending_missile==SMISSILE5_INDEX;
            if(aa_pending_missile>=0&&GameTime64>=aa_missile_ready&&attacking&&enemy==aa_pending_target&&distance>(heavy?115:48)&&alignment>.994f){
                if(Players[Player_num].secondary_weapon==aa_pending_missile)Controls.fire_secondary_state=1;
                aa_pending_missile=-1;aa_missile_next=GameTime64+i2f(6);
            }
        }
    }
    if(Players[Player_num].flags&PLAYER_FLAGS_CONVERTER && Players[Player_num].shields<i2f(80)&&Players[Player_num].energy>i2f(130))Controls.energy_to_shield_state=1;
    /* Door preparation has its own short retry timer. Ambient lighting cannot
     * consume it, and an opening door is never pelted with unnecessary flares. */
    if(!attacking&&!watching&&!escaping&&flare_door>=0&&GameTime64>=aa_door_flare_next&&aa_flare_door(flare_door,1)){
        vms_vector center;wall *gate=&Walls[flare_door];compute_center_point_on_side(&center,&Segments[gate->segnum],gate->sidenum);
        Controls.fire_flare_count=1;aa_door_flare_count++;aa_door_flare_wall=flare_door;aa_door_flare_distance=aa_len(&center,&ConsoleObject->pos);
        aa_door_flare_next=GameTime64+F1_0*3/2;aa_flare_next=GameTime64+i2f(14);
        EM_ASM(Module.autoDoorFlare=({wall:$0,distance:$1,shots:$2});,flare_door,aa_door_flare_distance,aa_door_flare_count);
    }else if(!attacking&&!watching&&!escaping&&door<0&&flare_door<0&&alignment>.92f&&!Control_center_destroyed&&
       Players[Player_num].energy>i2f(25)&&GameTime64>=aa_flare_next&&Segment2s[seg].static_light<F1_0*3/4){
        Controls.fire_flare_count=1;aa_flare_next=GameTime64+i2f(14);
    }
    extern void do_weapon_n_item_stuff(void);do_weapon_n_item_stuff();
    if(GameTime64>aa_status_next){
        static const char *labels[]={"Exploring the mine","Collecting supplies","Rescuing hostages","Engaging hostile","Activating switch","Escaping to exit","Opening door","Finding clearance","Watching destruction"};
        aa_kills=Players[Player_num].num_kills_total;
        vms_vector travel=ConsoleObject->mtype.phys_info.velocity;float velocity=f2fl(vm_vec_mag(&travel));
        aa_facing_velocity=velocity>.05f?f2fl(vm_vec_dot(&travel,&ConsoleObject->orient.fvec))/velocity:1;
        EM_ASM(Module.autoFlight=({speed:$0,forward:$1,primary:$2,secondary:$3,energy:$4,shields:$5,version:21});,velocity,aa_facing_velocity,Players[Player_num].primary_weapon,Players[Player_num].secondary_weapon,f2fl(Players[Player_num].energy),f2fl(Players[Player_num].shields));
        EM_ASM({window.astraAutoStatus?.(UTF8ToString($0),$1,$2,$3,$4);Module.autoTelemetry=({segment:$5,goal:$6,object:$7,enemy:$8,mode:$9,x:$10,y:$11,z:$12});},watching?labels[8]:enemy>=0&&aa_threat(enemy)?"Returning fire":labels[aa_mode],aa_seen,aa_deaths,aa_kills,aa_collects,seg,aa_goal,aa_object,enemy,aa_mode,f2fl(ConsoleObject->pos.x),f2fl(ConsoleObject->pos.y),f2fl(ConsoleObject->pos.z));
        EM_ASM(Module.autoCombat=({attacker:$0,target:$1,retaliating:!!$2,retaliations:$3,cruise:52,arsenal:!!Module.demoArsenal});,aa_recent_attacker,enemy,enemy>=0&&aa_threat(enemy),aa_retaliations);
        EM_ASM(Module.autoSight=({version:21,visible:$0,targetVisible:!!$1,hiddenRoute:!!$2});,aa_sight_count,enemy>=0&&aa_can_see(enemy),aa_combat_object(aa_object)&&!aa_can_see(aa_object));
        EM_ASM(Module.autoPilot=({version:21,aimError:$0,rollError:$1,watching:!!$2,watches:$3,switches:$4,held:$5,targetAge:$6,turnRate:$7});,
            aa_aim_error,aa_roll_error,watching,aa_watch_count,aa_switches,(double)(GameTime64-aa_weapon_changed)/F1_0,(double)(GameTime64-aa_target_since)/F1_0,f2fl(vm_vec_mag(&ConsoleObject->mtype.phys_info.rotvel))*360);
        EM_ASM(Module.autoLevel=({version:32,pitch:$0,cruising:!!$1,door:$2});,aa_cruise_pitch,!attacking&&!watching&&door<0&&flare_door<0,flare_door);
        EM_ASM(Module.autoSlide=({active:!!$0,count:$1,requested:$2,forward:$3});,aa_sliding,aa_slide_count,aa_drive_intent,travel_facing);
        EM_ASM(Module.autoRecovery=({active:!!$0,count:$1,attempts:$2,stalled:$3});,escaping,aa_escape_count,aa_recover,(double)(GameTime64-aa_stuck_since)/F1_0);
        int needed=aa_object>=0&&Objects[aa_object].type==OBJ_POWERUP?(int)aa_pickup_need(&Players[Player_num],&Objects[aa_object],GameTime64):-1;
        EM_ASM(Module.autoPickup=({id:$0,need:$1,rejected:$2,deaths:$3});,needed>=0?Objects[aa_object].id:-1,needed,aa_pick_rejected,aa_deaths);
        aa_status_next=GameTime64+F1_0/3;
    }
}
void astra_auto_pickup_result(object *o,int useful){
    if(!astra_auto_enabled())return;
    if(useful){aa_collects++;aa_next=0;}
    else if(o->type==OBJ_POWERUP)aa_skip_pickup(o-Objects,20);
}
