/* Autonomous spectator pilot. Plans over the real mine graph and drives the
 * same Controls used by a human. No teleports, aim snapping or damage cheats. */
#include "fvi.h"
#include "switch.h"
#include "powerup.h"
#include "robot.h"
#include "fuelcen.h"
#include "rle.h"
extern int door_is_wall_switched(int wall_num);
int astra_auto_enabled(void){return EM_ASM_INT(return !!Module.autopilot);}
void astra_auto_pause_frame(void){
    static int paused;
    int want=astra_auto_enabled()&&EM_ASM_INT(return !!Module.autoPaused);
    if(want&&!paused){stop_time();paused=1;}
    if(!want&&paused){start_time();paused=0;}
}
static int aa_level=-999,aa_segment=-1,aa_goal=-1,aa_object=-1,aa_wall=-1,aa_mode,aa_route_mode;
static int aa_graph_generation;
static int aa_dist[MAX_SEGMENTS],aa_parent[MAX_SEGMENTS],aa_queue[MAX_SEGMENTS],aa_visits[MAX_SEGMENTS];
static fix64 aa_ignore[MAX_OBJECTS],aa_wall_seen[MAX_WALLS],aa_next,aa_stuck_since,aa_level_since,aa_dead_since,aa_status_next;
static vms_vector aa_last,aa_escape_goal;
static fix64 aa_flare_next,aa_door_flare_next;
static int aa_door_flare_wall=-1,aa_door_flare_count;static float aa_door_flare_distance,aa_cruise_pitch;
static fix64 aa_escape_until,aa_blocked[MAX_SEGMENTS][6];
static int aa_escape_count,aa_escape_room=-1;
static float aa_smooth_rate[3],aa_smooth_acceleration[3];
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
/* Actual contact supplies a frozen bearing, never a hidden robot position.
 * Passive projectile sensing below continues to require cockpit visibility. */
static vms_vector aa_contact_point,aa_contact_direction;
static fix64 aa_contact_until,aa_contact_next,aa_contact_started;
static int aa_contact_ram,aa_contact_count,aa_contact_acquired;
static int aa_arsenal_signature=-1;
static fix64 aa_sense_next,aa_evade_until,aa_evade_next,aa_boost_until,aa_boost_next,aa_gaze_until,aa_gaze_next;
static vms_vector aa_incoming_miss,aa_incoming_velocity,aa_evade_direction,aa_gaze_point;
static float aa_incoming_time=2,aa_gaze_clearance,aa_reaction,aa_boost_seconds,aa_evade_seconds;
static int aa_incoming=-1,aa_dodges,aa_bursts,aa_gaze_changes,aa_gaze_room=-1,aa_evading;
static int aa_enemy_shot(int i){
    if(i<0||i>Highest_object_index)return 0;object *o=&Objects[i];
    return o->type==OBJ_WEAPON&&o->movement_type==MT_PHYSICS&&
        o->ctype.laser_info.parent_type==OBJ_ROBOT&&!(o->flags&OF_SHOULD_BE_DEAD);
}
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
static int aa_perceived(int i){
    return i>=0&&i<=Highest_object_index&&aa_sight_active&&aa_sight_level==Current_level_num&&
        GameTime64>=aa_sight_time&&GameTime64-aa_sight_time<=F1_0/4&&
        aa_sighted[i]&&aa_sight_signature[i]==Objects[i].signature&&
        !(Objects[i].type==OBJ_ROBOT&&Objects[i].ctype.ai_info.CLOAKED);
}
static int aa_can_see(int i){return aa_combat_object(i)&&aa_perceived(i);}
void astra_auto_sight_begin(int window_num){
    if(window_num)return;
    memset(aa_sighted,0,sizeof aa_sighted);aa_sight_count=0;
    aa_sight_active=astra_auto_enabled()&&Viewer==ConsoleObject&&!Rear_view&&!Player_is_dead&&!Endlevel_sequence;
    aa_sight_level=Current_level_num;aa_sight_time=GameTime64;aa_sight_eye=Viewer_eye;
}
void astra_auto_sight_object(int i,int window_num){
    if(window_num||!aa_sight_active||(!aa_combat_object(i)&&!aa_enemy_shot(i)))return;
    object *o=&Objects[i];
    if(o->render_type==RT_NONE||(o->type==OBJ_ROBOT&&o->ctype.ai_info.CLOAKED))return;
    if(vm_vec_dist_quick(&o->pos,&aa_sight_eye)>i2f(210))return;
    for(int sample=0;sample<(aa_enemy_shot(i)?1:5);sample++){
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
            if(!aa_sighted[i]&&aa_combat_object(i))aa_sight_count++;
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
void astra_auto_contact(object *source,int ram){
    if(!astra_auto_enabled()||!ConsoleObject||Player_is_dead||!source)return;
    int attacker=source-Objects;vms_vector direction;
    if(ram){
        if(!aa_hostile(attacker))return;
        vm_vec_sub(&direction,&source->pos,&ConsoleObject->pos);
    }else{
        if(source->type!=OBJ_WEAPON||source->ctype.laser_info.parent_type!=OBJ_ROBOT||source->movement_type!=MT_PHYSICS)return;
        /* The incoming trajectory is physically sensed even if its owner has
         * moved behind cover. Do not read that owner's current coordinates. */
        attacker=source->ctype.laser_info.parent_num;
        if(!aa_hostile(attacker)||Objects[attacker].signature!=source->ctype.laser_info.parent_signature)return;
        vm_vec_copy_scale(&direction,&source->mtype.phys_info.velocity,-F1_0);
    }
    astra_auto_attacked(source);
    if(aa_can_see(attacker)||vm_vec_normalize(&direction)<F1_0/10)return;
    /* Stable bearings under repeated ramming prevent jitter and alternating
     * turns. A fresh impact can interrupt a search after its bounded window. */
    if(GameTime64<aa_contact_next)return;
    if(aa_contact_until>GameTime64&&GameTime64-aa_contact_started<i2f(4))return;
    aa_contact_direction=direction;
    vm_vec_scale_add(&aa_contact_point,&ConsoleObject->pos,&direction,i2f(ram?32:65));
    aa_contact_ram=ram;aa_contact_started=GameTime64;aa_contact_until=GameTime64+i2f(5);
    aa_contact_next=GameTime64+F1_0;aa_contact_count++;
}
static int aa_threat(int i){return aa_hostile(i)&&aa_attack_signature[i]==Objects[i].signature&&aa_attack_until[i]>GameTime64;}
/* Closest approach in the moving pilot's frame. Reject shots travelling away
 * or safely past us; world-space projectile speed alone is insufficient. */
static int aa_collision_course(vms_vector offset,vms_vector velocity,float radius,float *time,vms_vector *miss){
    float x=f2fl(offset.x),y=f2fl(offset.y),z=f2fl(offset.z);
    float vx=f2fl(velocity.x),vy=f2fl(velocity.y),vz=f2fl(velocity.z),vv=vx*vx+vy*vy+vz*vz;
    if(vv<1)return 0;
    float t=-(x*vx+y*vy+z*vz)/vv;
    if(t<0||t>1.25f)return 0;
    x+=vx*t;y+=vy*t;z+=vz*t;
    if(x*x+y*y+z*z>radius*radius)return 0;
    *time=t;miss->x=fl2f(x);miss->y=fl2f(y);miss->z=fl2f(z);return 1;
}
static void aa_sense_fire(void){
    /* Bounded sensing: render visibility is refreshed independently. No
     * hidden shooter locations or unrendered projectiles grant knowledge. */
    if(GameTime64<aa_sense_next)return;
    aa_sense_next=GameTime64+F1_0/16;aa_incoming=-1;aa_incoming_time=2;
    for(int i=0;i<=Highest_object_index;i++){
        if(!aa_enemy_shot(i)||!aa_perceived(i))continue;object *shot=&Objects[i];
        vms_vector offset,relative,miss;float t;
        vm_vec_sub(&offset,&shot->pos,&ConsoleObject->pos);
        vm_vec_sub(&relative,&shot->mtype.phys_info.velocity,&ConsoleObject->mtype.phys_info.velocity);
        if(vm_vec_mag(&offset)>i2f(180))continue;
        if(!aa_collision_course(offset,relative,f2fl(ConsoleObject->size+shot->size)+3,&t,&miss))continue;
        astra_auto_attacked(shot);
        if(t<aa_incoming_time){aa_incoming=i;aa_incoming_time=t;aa_incoming_miss=miss;aa_incoming_velocity=relative;}
    }
}
static void aa_demo_arsenal(void){
    if(!EM_ASM_INT(return !!Module.demoArsenal)||aa_arsenal_signature==ConsoleObject->signature)return;
    aa_arsenal_signature=ConsoleObject->signature;player *p=&Players[Player_num];
    p->primary_weapon_flags=0xffff^(1<<SUPER_LASER_INDEX);p->secondary_weapon_flags=0xffff;
    p->primary_ammo[VULCAN_INDEX]=VULCAN_AMMO_MAX;
    for(int i=0;i<MAX_SECONDARY_WEAPONS;i++)p->secondary_ammo[i]=Secondary_ammo_max[i];
    p->laser_level=MAX_SUPER_LASER_LEVEL;p->flags|=PLAYER_FLAGS_QUAD_LASERS;
    /* The explicitly selected showcase arsenal includes propulsion. Ordinary
     * campaign demos still need to collect their own afterburner. */
    if(!(p->flags&PLAYER_FLAGS_AFTERBURNER)){p->flags|=PLAYER_FLAGS_AFTERBURNER;p->afterburner_charge=F1_0;}
    update_laser_weapon_info();
    EM_ASM(Module.demoArsenalGranted=true;);
}
static int aa_recover,aa_seen,aa_deaths,aa_kills,aa_collects;
static float aa_clamp(float x,float a,float b){return fminf(b,fmaxf(a,x));}
static float aa_len(vms_vector *a,vms_vector *b){return f2fl(vm_vec_dist_quick(a,b));}
/* Mission travel must not accidentally leave through a secret warp or an
 * exit before its reactor is cleared. Manual controls retain native triggers. */
static int aa_forbidden_portal(int seg,int side){
    int wi=Segments[seg].sides[side].wall_num;if(wi<0)return 0;
    int trigger= Walls[wi].trigger;if(trigger<0||trigger>=Num_triggers)return 0;
    int type=Triggers[trigger].type;
    if(type==TT_SECRET_EXIT)return Current_level_num>0||!Control_center_destroyed;
    return type==TT_EXIT&&!Control_center_destroyed;
}
/* Sweep the actual hull, including solid objects. A ray that fits through a
 * room can still drive straight into its reactor. Allow a ship already touching
 * an object to back out, but never to cross farther through its collision body. */
static int aa_hull_path(vms_vector *from,int room,vms_vector *to,fix radius){
    fvi_query q={from,to,room,radius,ConsoleObject-Objects,NULL,FQ_GET_SEGLIST};
    fvi_info hit;if(find_vector_intersection(&q,&hit)!=HIT_NONE)return 0;
    vms_vector travel;vm_vec_sub(&travel,to,from);float length=f2fl(vm_vec_normalize(&travel));
    for(int j=0;j<hit.n_segs;j++){
        int seg=hit.seglist[j];
        if(j)for(int side=0;side<6;side++)if(Segments[hit.seglist[j-1]].children[side]==seg&&aa_forbidden_portal(hit.seglist[j-1],side))return 0;
        for(int i=Segments[seg].objects;i>=0;i=Objects[i].next){
            object *o=&Objects[i];if(o==ConsoleObject||(o->flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING)))continue;
            if(o->type!=OBJ_ROBOT&&o->type!=OBJ_CNTRLCEN&&o->type!=OBJ_PLAYER)continue;
            float body=f2fl(o->size);if(o->type==OBJ_ROBOT&&Robot_info[o->id].attack_type)body*=.75f;
            if(o->type==OBJ_PLAYER)body*=.5f;
            float clearance=f2fl(radius)+body+.4f;
            vms_vector offset;vm_vec_sub(&offset,&o->pos,from);
            float along=f2fl(vm_vec_dot(&offset,&travel)),initial=aa_len(from,&o->pos);
            if(initial<clearance&&along<=0&&aa_len(to,&o->pos)>initial)continue;
            vms_vector nearest;vm_vec_scale_add(&nearest,from,&travel,fl2f(aa_clamp(along,0,length)));
            if(aa_len(&nearest,&o->pos)<clearance)return 0;
        }
    }
    return 1;
}
static int aa_visible(vms_vector *p,fix radius){
    if(radius)return aa_hull_path(&ConsoleObject->pos,ConsoleObject->segnum,p,radius);
    fvi_query q={&ConsoleObject->pos,p,ConsoleObject->segnum,0,ConsoleObject-Objects,NULL,FQ_TRANSPOINT};
    fvi_info hit;return find_vector_intersection(&q,&hit)==HIT_NONE;
}
static int aa_pass(int seg,int side){
    segment *s=&Segments[seg];if(aa_forbidden_portal(seg,side))return 0;
    if(s->children[side]<0||aa_blocked[seg][side]>GameTime64)return 0;
    if(WALL_IS_DOORWAY(s,side)&WID_FLY_FLAG)return 1;
    int w=s->sides[side].wall_num;if(w<0)return 1;
    wall *d=&Walls[w];
    if(d->type==WALL_BLASTABLE)return 1;
    if(d->type!=WALL_DOOR || d->flags&WALL_DOOR_LOCKED)return 0;
    return d->keys==KEY_NONE || !d->keys || (Players[Player_num].flags&d->keys)==d->keys;
}
static void aa_graph(void){
    aa_graph_generation++;
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

/* Route progress is separate from movement. Circling or crossing the same
 * portal cannot indefinitely reset it. Keep a bounded recent-room history. */
static int aa_recent_rooms[48],aa_recent_count,aa_recent_serial;
static fix64 aa_route_sample,aa_progress_time,aa_loop_next,aa_detour_until,aa_tour_next;
static int aa_detour_goal=-1,aa_loop_count,aa_progress_rooms,aa_progress_kills,aa_progress_pickups;
static int aa_progress_target=-1,aa_progress_signature;static fix aa_progress_health;

/* A mission survives combat and supply stops. Only native keys, switches,
 * reactor destruction and the real exit advance it; stalled tours never skip. */
static int aa_mission=-1,aa_mission_object=-1,aa_mission_signature,aa_mission_wall=-1,aa_phase;
static fix64 aa_supply_next,aa_supply_until,aa_mission_since;
static int aa_goal_changes,aa_blocked_shots,aa_clear_shots,aa_reposition,aa_lane_reason;
static fix64 aa_lane_since,aa_damage_since,aa_boss_seen;static fix aa_enemy_health;static int aa_boss_room=-1;
static fix64 aa_combat_defer[MAX_OBJECTS];
static int aa_combat_defer_signature[MAX_OBJECTS];
static fix aa_engage_elapsed[MAX_OBJECTS],aa_engage_health[MAX_OBJECTS];
static int aa_engage_signature[MAX_OBJECTS];
static int aa_switch_shootable(int number){
    wall *w=&Walls[number];int tm=Segments[w->segnum].sides[w->sidenum].tmap_num2&0x3fff;
    if(!tm)return 0;int ec=TmapInfo[tm].eclip_num;
    return ec>=0?(Effects[ec].dest_bm_num>=0&&!(Effects[ec].flags&EF_ONE_SHOT)):TmapInfo[tm].destroyed>=0;
}
/* Route through potential gates only to identify the next prerequisite.
 * The flight graph itself still forbids locked and solid walls. */
static int aa_gate_to(int destination){
    static int generation=-1,cost[MAX_SEGMENTS],parent[MAX_SEGMENTS];static unsigned char done[MAX_SEGMENTS];
    int start=ConsoleObject->segnum;
    if(generation!=aa_graph_generation){
    generation=aa_graph_generation;memset(done,0,sizeof done);
    for(int i=0;i<=Highest_segment_index;i++){cost[i]=1000000;parent[i]=-1;}
    cost[start]=0;
    for(int step=0;step<=Highest_segment_index;step++){
        int room=-1;for(int i=0;i<=Highest_segment_index;i++)if(!done[i]&&(room<0||cost[i]<cost[room]))room=i;
        if(room<0||cost[room]>=1000000)break;done[room]=1;
        for(int side=0;side<6;side++){
            int child=Segments[room].children[side];if(child<0||aa_forbidden_portal(room,side))continue;
            int w=Segments[room].sides[side].wall_num,extra=aa_pass(room,side)?1:50;
            if(extra>1&&(w<0||(Walls[w].type!=WALL_DOOR&&door_is_wall_switched(w)<0)))continue;
            if(cost[child]>cost[room]+extra){cost[child]=cost[room]+extra;parent[child]=room;}
        }
    }
    }
    int gate=-1,n=0;while(destination>=0&&destination!=start&&parent[destination]>=0&&n++<MAX_SEGMENTS){
        int from=parent[destination];for(int side=0;side<6;side++)if(Segments[from].children[side]==destination&&!aa_pass(from,side))gate=Segments[from].sides[side].wall_num;
        destination=from;
    }
    return gate;
}
static int aa_required_gate(void){
    for(int i=0;i<=Highest_object_index;i++)if(Objects[i].type==OBJ_CNTRLCEN&&!(Objects[i].flags&(OF_EXPLODING|OF_SHOULD_BE_DEAD)))return aa_gate_to(Objects[i].segnum);
    return -1;
}
static int aa_trigger_links_gate(int number,int gate){
    if(gate<0)return 1;trigger *t=&Triggers[Walls[number].trigger];wall *g=&Walls[gate];
    int other=Segments[g->segnum].children[g->sidenum];
    for(int i=0;i<t->num_links;i++)if((t->seg[i]==g->segnum&&t->side[i]==g->sidenum)||
        (other>=0&&t->seg[i]==other&&Segments[other].children[t->side[i]]==g->segnum))return 1;
    return 0;
}
static int aa_trigger_needed(int number){
    wall *w=&Walls[number];if(w->trigger<0||w->trigger>=Num_triggers)return 0;
    trigger *t=&Triggers[w->trigger];if(t->flags&TF_DISABLED)return 0;
    if(!(WALL_IS_DOORWAY(&Segments[w->segnum],w->sidenum)&WID_FLY_FLAG)&&!aa_switch_shootable(number))return 0;
    if(t->type!=TT_OPEN_DOOR&&t->type!=TT_UNLOCK_DOOR&&t->type!=TT_OPEN_WALL&&t->type!=TT_ILLUSION_OFF)return 0;
    for(int n=0;n<t->num_links;n++){
        int seg=t->seg[n],side=t->side[n];if(seg<0||seg>Highest_segment_index||side<0||side>5)continue;
        int wi=Segments[seg].sides[side].wall_num;if(wi<0)continue;wall *link=&Walls[wi];
        if(t->type==TT_UNLOCK_DOOR){if((link->flags&WALL_DOOR_LOCKED)||(link->keys!=KEY_NONE&&link->keys))return 1;}
        else if(!(WALL_IS_DOORWAY(&Segments[seg],side)&WID_FLY_FLAG)&&!aa_pass(seg,side))return 1;
    }
    return 0;
}
static void aa_switch_point(int number,vms_vector *point){
    wall *w=&Walls[number];segment *seg=&Segments[w->segnum];int side=w->sidenum;
    compute_center_point_on_side(point,seg,side);if(!aa_switch_shootable(number))return;
    int texture=seg->sides[side].tmap_num2,tm=texture&0x3fff;
    PIGGY_PAGE_IN(Textures[tm]);grs_bitmap *bm=&GameBitmaps[Textures[tm].index];
    if(bm->bm_flags&BM_FLAG_RLE)bm=rle_expand_texture(bm);
    if(!bm->bm_data)return;
    int verts[4];get_side_verts(verts,w->segnum,side);float best=1e20f;
    for(int j=0;j<9;j++)for(int i=0;i<9;i++){
        float x=(i+1)/10.f,y=(j+1)/10.f;vms_vector sample={0};
        vm_vec_scale_add2(&sample,&Vertices[verts[0]],fl2f((1-x)*(1-y)));vm_vec_scale_add2(&sample,&Vertices[verts[1]],fl2f(x*(1-y)));
        vm_vec_scale_add2(&sample,&Vertices[verts[2]],fl2f(x*y));vm_vec_scale_add2(&sample,&Vertices[verts[3]],fl2f((1-x)*y));
        fix u,v;find_hitpoint_uv(&u,&v,NULL,&sample,seg,side,0);
        int px=((unsigned)f2i(u*bm->bm_w))%bm->bm_w,py=((unsigned)f2i(v*bm->bm_h))%bm->bm_h,t;
        switch(texture&0xc000){case 0x4000:t=py;py=px;px=bm->bm_w-t-1;break;case 0x8000:py=bm->bm_h-py-1;px=bm->bm_w-px-1;break;case 0xc000:t=px;px=py;py=bm->bm_h-t-1;break;}
        if(bm->bm_data[py*bm->bm_w+px]==TRANSPARENCY_COLOR)continue;
        float score=(x-.5f)*(x-.5f)+(y-.5f)*(y-.5f);if(score<best){best=score;*point=sample;}
    }
}
static int aa_object_available(int i){
    return i>=0&&i<=Highest_object_index&&Objects[i].type!=OBJ_NONE&&!(Objects[i].flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING))&&
        !(aa_ignore[i]>GameTime64&&aa_ignore_signature[i]==Objects[i].signature);
}
typedef struct aa_objective {int room,object,wall,phase,cost;} aa_objective;
static unsigned char aa_dependency_visiting[MAX_WALLS];static int aa_dependency_budget;
static int aa_resolve_room(int room,int object,int wallno,int phase,int depth,aa_objective *out);
static int aa_resolve_gate(int gate,int depth,aa_objective *out){
    if(gate<0||gate>=Num_walls||depth>12||aa_dependency_visiting[gate]||--aa_dependency_budget<0)return 0;
    aa_dependency_visiting[gate]=1;wall *w=&Walls[gate];int found=0;aa_objective best={.cost=1000000},candidate;
    int missing=w->keys&~Players[Player_num].flags&14;
    if(missing)for(int i=0;i<=Highest_object_index;i++){
        object *o=&Objects[i];if(!aa_object_available(i)||o->type!=OBJ_POWERUP||o->id<POW_KEY_BLUE||o->id>POW_KEY_GOLD||!(missing&(2<<(o->id-POW_KEY_BLUE))))continue;
        if(aa_resolve_room(o->segnum,i,-1,1,depth+1,&candidate)&&candidate.cost<best.cost){best=candidate;found=1;}
    }
    for(int i=0;i<Num_walls;i++){
        wall *source=&Walls[i];if(source->trigger<0||source->trigger>=Num_triggers||aa_wall_seen[i]>GameTime64)continue;
        trigger *t=&Triggers[source->trigger];if(t->flags&TF_DISABLED)continue;
        if(t->type!=TT_OPEN_DOOR&&t->type!=TT_UNLOCK_DOOR&&t->type!=TT_OPEN_WALL&&t->type!=TT_ILLUSION_OFF)continue;
        if(!aa_trigger_links_gate(i,gate))continue;
        if(aa_trigger_needed(i)){
            if(aa_resolve_room(source->segnum,-1,i,4,depth+1,&candidate)&&candidate.cost<best.cost){best=candidate;found=1;}
        }else if(!(WALL_IS_DOORWAY(&Segments[source->segnum],source->sidenum)&WID_FLY_FLAG)&&!aa_switch_shootable(i)){
            /* Some triggers live on a sealed passage. Open that passage first,
             * instead of firing at its inert face or abandoning the puzzle. */
            if(aa_resolve_gate(i,depth+1,&candidate)&&candidate.cost<best.cost){best=candidate;found=1;}
        }
    }
    aa_dependency_visiting[gate]=0;if(found)*out=best;return found;
}
static int aa_resolve_room(int room,int object,int wallno,int phase,int depth,aa_objective *out){
    if(room<0||room>Highest_segment_index||depth>12)return 0;
    if(aa_dist[room]>=0){*out=(aa_objective){room,object,wallno,phase,aa_dist[room]+depth*3};return 1;}
    return aa_resolve_gate(aa_gate_to(room),depth+1,out);
}
static void aa_mission_set(int room,int object,int wall,int phase){
    if(room!=aa_mission||object!=aa_mission_object||wall!=aa_mission_wall||phase!=aa_phase){aa_goal_changes++;aa_mission_since=GameTime64;}
    aa_mission=room;aa_mission_object=object;aa_mission_wall=wall;aa_phase=phase;
    if(object>=0)aa_mission_signature=Objects[object].signature;
}
static void aa_plan(void){
    aa_graph();player *p=&Players[Player_num];int current=ConsoleObject->segnum;
    int valid=aa_mission>=0&&aa_dist[aa_mission]>=0;
    if(aa_mission_object>=0)valid=valid&&aa_object_available(aa_mission_object)&&Objects[aa_mission_object].signature==aa_mission_signature;
    if(aa_phase==1&&valid)valid=aa_pickup_need(p,&Objects[aa_mission_object],GameTime64)>0;
    if(aa_phase==4&&valid)valid=aa_trigger_needed(aa_mission_wall)&&aa_wall_seen[aa_mission_wall]<=GameTime64;
    if(aa_phase==0&&current==aa_mission){vms_vector c;compute_segment_center(&c,&Segments[current]);if(aa_len(&c,&ConsoleObject->pos)<9)valid=0;}
    if(aa_phase==6&&p->energy>=i2f(95))valid=0;
    if(aa_phase==11&&(GameTime64-aa_boss_seen>i2f(8)||aa_boss_room<0))valid=0;
    if(aa_phase==5&&!Control_center_destroyed)valid=0;
    if(Control_center_destroyed&&aa_phase!=5)valid=0;
    int reactor=-1;
    if(!Control_center_destroyed)for(int i=0;i<=Highest_object_index;i++)if(aa_object_available(i)&&Objects[i].type==OBJ_CNTRLCEN&&aa_dist[Objects[i].segnum]>=0){
        if(reactor<0||aa_dist[Objects[i].segnum]<aa_dist[Objects[reactor].segnum])reactor=i;
    }
    /* Reachable reactor takes precedence over further exploration. Emergency
     * energy recovery is retained until recharged, rather than oscillating. */
    if(reactor>=0&&aa_phase!=3&&aa_phase!=6)valid=0;
    if(reactor<0&&aa_boss_room>=0&&GameTime64-aa_boss_seen<i2f(8)&&aa_phase==0)valid=0;
    if(!valid){
        int goal=-1,obj=-1,wallno=-1,phase=0;float best=1e20f;int gate=Control_center_destroyed?-1:aa_required_gate();
        if(Control_center_destroyed){
            for(int i=0;i<Num_walls;i++){
                wall *w=&Walls[i];if(w->trigger<0||w->trigger>=Num_triggers||aa_dist[w->segnum]<0)continue;
                trigger *t=&Triggers[w->trigger];if(t->flags&TF_DISABLED)continue;
                if(t->type!=TT_EXIT&&!(Current_level_num<0&&t->type==TT_SECRET_EXIT))continue;
                float cost=aa_dist[w->segnum];if(cost<best){best=cost;goal=w->segnum;wallno=i;phase=5;}
            }
        }else if(reactor>=0){goal=Objects[reactor].segnum;obj=reactor;phase=3;}
        if(goal<0&&!Control_center_destroyed){
            aa_objective step,chosen={.cost=1000000};aa_dependency_budget=64;memset(aa_dependency_visiting,0,sizeof aa_dependency_visiting);
            /* Resolve reactor -> required key -> its gate -> its switch as a
             * chain. Unrelated optional switches are not equivalent progress. */
            for(int i=0;i<=Highest_object_index;i++)if(aa_object_available(i)&&Objects[i].type==OBJ_CNTRLCEN){
                if(aa_resolve_room(Objects[i].segnum,i,-1,3,0,&step)&&step.cost<chosen.cost)chosen=step;
            }
            if(chosen.cost==1000000)for(int i=0;i<=Highest_object_index;i++){
                object *o=&Objects[i];if(!aa_object_available(i)||o->type!=OBJ_POWERUP||o->id<POW_KEY_BLUE||o->id>POW_KEY_GOLD||!aa_pickup_need(p,o,GameTime64))continue;
                if(aa_resolve_room(o->segnum,i,-1,1,0,&step)&&step.cost<chosen.cost)chosen=step;
            }
            if(chosen.cost<1000000){goal=chosen.room;obj=chosen.object;wallno=chosen.wall;phase=chosen.phase;}
        }
        if(goal<0&&!Control_center_destroyed){
            /* Keys and useful switch links unlock new portions of the mine.
             * Enemy locations are never consulted by this route planner. */
            for(int i=0;i<=Highest_object_index;i++){
                object *o=&Objects[i];if(!aa_object_available(i)||o->type!=OBJ_POWERUP||o->id<POW_KEY_BLUE||o->id>POW_KEY_GOLD||!aa_pickup_need(p,o,GameTime64)||aa_dist[o->segnum]<0)continue;
                float cost=aa_dist[o->segnum]+aa_len(&o->pos,&ConsoleObject->pos)*.01f;
                if(gate>=0&&(Walls[gate].keys&(2<<(o->id-POW_KEY_BLUE))))cost-=1000;
                if(cost<best){best=cost;goal=o->segnum;obj=i;phase=1;}
            }
            for(int i=0;i<Num_walls;i++)if(aa_dist[Walls[i].segnum]>=0&&aa_wall_seen[i]<=GameTime64&&aa_trigger_needed(i)){
                float cost=aa_dist[Walls[i].segnum]+2;
                if(!aa_trigger_links_gate(i,gate))cost+=100;
                if(cost<best){best=cost;goal=Walls[i].segnum;obj=-1;wallno=i;phase=4;}
            }
        }
        if(goal<0&&!Control_center_destroyed&&aa_boss_room>=0&&GameTime64-aa_boss_seen<i2f(8)&&aa_dist[aa_boss_room]>=0){goal=aa_boss_room;phase=11;}
        if(goal<0){
            best=-1;
            for(int i=0;i<=Highest_segment_index;i++)if(aa_dist[i]>=0&&i!=current){
                float score=(aa_visits[i]?1.f/(1+aa_visits[i]):100.f)/(1+aa_dist[i]*.15f);
                if(score>best){best=score;goal=i;obj=wallno=-1;phase=0;}
            }
        }
        aa_mission_set(goal,obj,wallno,phase);
    }
    if(!Control_center_destroyed&&p->energy<i2f(18)&&aa_phase!=6){
        int fuel=-1;for(int i=0;i<=Highest_segment_index;i++)if(aa_dist[i]>=0&&Segment2s[i].special==SEGMENT_IS_FUELCEN&&(fuel<0||aa_dist[i]<aa_dist[fuel]))fuel=i;
        if(fuel>=0)aa_mission_set(fuel,-1,-1,6);
    }
    int previous=aa_object;aa_goal=aa_mission;aa_object=aa_phase==1?aa_mission_object:-1;aa_wall=aa_mission_wall;
    aa_mode=aa_phase==6?9:aa_phase==3?10:aa_phase;
    /* Optional supplies are short, local stops; they cannot replace the
     * mission repeatedly or lure the pilot back to a full death-drop pile. */
    if(!Control_center_destroyed&&aa_phase!=6){
        int supply=-1;float best=0;
        if(GameTime64<aa_supply_until&&aa_object_available(previous)&&Objects[previous].type==OBJ_POWERUP&&aa_pickup_need(p,&Objects[previous],GameTime64)>0&&aa_dist[Objects[previous].segnum]>=0)supply=previous;
        else if(GameTime64>=aa_supply_next){
            for(int i=0;i<=Highest_object_index;i++){
                object *o=&Objects[i];if(!aa_object_available(i)||o->type!=OBJ_POWERUP||aa_dist[o->segnum]<0||aa_dist[o->segnum]>1)continue;
                float need=aa_pickup_need(p,o,GameTime64),distance=aa_len(&o->pos,&ConsoleObject->pos);
                if(need<=0||distance>65)continue;
                float score=need/(1+distance*.06f);if(score>best){best=score;supply=i;}
            }
            if(supply>=0){aa_supply_until=GameTime64+i2f(8);aa_supply_next=GameTime64+i2f(16);}
        }
        if(supply>=0){aa_goal=Objects[supply].segnum;aa_object=supply;aa_wall=-1;aa_mode=1;}
    }
    aa_route_mode=aa_mode;aa_next=GameTime64+F1_0/2;
}
/* A short, hull-checked flight line rounds open portal bends. Rebuild at 4 Hz,
 * not every frame; pursuit and the curvature speed limit use the same line. */
#define AA_LINE_POINTS 24
static vms_vector aa_line[AA_LINE_POINTS];
static int aa_line_count,aa_line_room=-1,aa_line_goal=-1,aa_line_builds,aa_line_rounds,aa_line_active,aa_line_cruising;
static fix64 aa_line_next;
static float aa_line_limit=52,aa_line_distance;
static vms_vector aa_lerp(vms_vector a,vms_vector b,float t){
    vms_vector d;vm_vec_sub(&d,&b,&a);vm_vec_scale_add2(&a,&d,fl2f(t));return a;
}
static void aa_line_append(vms_vector point){
    if(aa_line_count<AA_LINE_POINTS&&(!aa_line_count||aa_len(&point,&aa_line[aa_line_count-1])>.5f))aa_line[aa_line_count++]=point;
}
static int aa_line_clear(vms_vector *points,int count){
    int room=ConsoleObject->segnum;
    for(int i=1;i<count;i++){
        if(!aa_hull_path(&points[i-1],room,&points[i],ConsoleObject->size))return 0;
        room=find_point_seg(&points[i],room);if(room<0)return 0;
    }
    return count>1;
}
static void aa_line_build(void){
    aa_line_builds++;aa_line_count=0;aa_line_next=GameTime64+F1_0/4;
    int seg=ConsoleObject->segnum;aa_line_room=seg;aa_line_goal=aa_goal;
    if(aa_goal<0||aa_goal==seg)return;
    int path[MAX_SEGMENTS],count=0,at=aa_goal;
    while(at>=0&&at!=seg&&count<MAX_SEGMENTS){path[count++]=at;at=aa_parent[at];}
    if(at!=seg||!count)return;
    vms_vector nodes[7];int n=1,from=seg;nodes[0]=ConsoleObject->pos;
    for(int p=count-1;p>=0&&n<5;p--){
        int next=path[p],side=-1;for(int j=0;j<6;j++)if(Segments[from].children[j]==next){side=j;break;}
        if(side<0||aa_forbidden_portal(from,side)||!(WALL_IS_DOORWAY(&Segments[from],side)&WID_FLY_FLAG))break;
        compute_center_point_on_side(&nodes[n],&Segments[from],side);
        if(aa_len(&nodes[n],&nodes[0])>145)break;
        n++;from=next;
    }
    if(n<2)return;
    compute_segment_center(&nodes[n++],&Segments[from]);
    aa_line_append(nodes[0]);
    for(int i=1;i<n-1;i++){
        float before=aa_len(&nodes[i-1],&nodes[i]),after=aa_len(&nodes[i],&nodes[i+1]);
        float cut=fminf(12,fminf(before,after)*.30f);
        if(cut<1){aa_line_append(nodes[i]);continue;}
        vms_vector entry=aa_lerp(nodes[i],nodes[i-1],cut/before),leave=aa_lerp(nodes[i],nodes[i+1],cut/after);
        aa_line_append(entry);
        for(int k=1;k<=3;k++){
            float t=k/3.f;vms_vector a=aa_lerp(entry,nodes[i],t),b=aa_lerp(nodes[i],leave,t);
            aa_line_append(aa_lerp(a,b,t));
        }
    }
    aa_line_append(nodes[n-1]);
    if(aa_line_clear(aa_line,aa_line_count)){aa_line_rounds++;return;}
    /* Narrow or irregular portals retain the exact center route. If even that
     * cannot fit, use the existing ledge/door approach and recovery planner. */
    aa_line_count=0;for(int i=0;i<n;i++)aa_line_append(nodes[i]);
    if(!aa_line_clear(aa_line,aa_line_count))aa_line_count=0;
}
static float aa_bend_speed(vms_vector a,vms_vector b,vms_vector c){
    vms_vector incoming,outgoing;float x=f2fl(vm_vec_normalized_dir(&incoming,&b,&a)),y=f2fl(vm_vec_normalized_dir(&outgoing,&c,&b));
    float dot=aa_clamp(f2fl(vm_vec_dot(&incoming,&outgoing)),-1,1);
    float radius=fminf(x,y)/fmaxf(.04f,2*sinf(acosf(dot)*.5f));
    return aa_clamp(sqrtf(24*radius),12,52);
}
static int aa_flight_line(vms_vector *target){
    if(aa_line_room!=ConsoleObject->segnum||aa_line_goal!=aa_goal||GameTime64>=aa_line_next)aa_line_build();
    if(aa_line_count<2)return 0;
    /* Project onto the nearest forward portion; never jump to a distant loop. */
    float best=1e9f;int first=0;vms_vector start=aa_line[0];
    for(int i=0;i<aa_line_count-1&&i<7;i++){
        vms_vector d,o;vm_vec_sub(&d,&aa_line[i+1],&aa_line[i]);vm_vec_sub(&o,&ConsoleObject->pos,&aa_line[i]);
        float length=f2fl(vm_vec_normalize(&d)),t=aa_clamp(f2fl(vm_vec_dot(&o,&d)),0,length);
        vms_vector p;vm_vec_scale_add(&p,&aa_line[i],&d,fl2f(t));float distance=aa_len(&p,&ConsoleObject->pos);
        if(distance<best){best=distance;first=i;start=p;}
    }
    if(best>12){aa_line_next=0;return 0;}
    float velocity=f2fl(vm_vec_mag(&ConsoleObject->mtype.phys_info.velocity));
    float look=aa_clamp(10+velocity*.42f,12,31),walk=0;aa_line_limit=52;
    vms_vector from=start,pursuit=aa_line[aa_line_count-1];int picked=0;
    for(int i=first+1;i<aa_line_count;i++){
        float length=aa_len(&from,&aa_line[i]);
        if(!picked&&walk+length>=look){pursuit=aa_lerp(from,aa_line[i],(look-walk)/fmaxf(.01f,length));picked=1;}
        walk+=length;
        if(i<aa_line_count-1){float corner=aa_bend_speed(aa_line[i-1],aa_line[i],aa_line[i+1]);aa_line_limit=fminf(aa_line_limit,sqrtf(corner*corner+48*fmaxf(0,walk-5)));}
        from=aa_line[i];
    }
    if(!aa_visible(&pursuit,ConsoleObject->size)){
        int found=0;
        for(int i=first+1;i<aa_line_count;i++){
            if(aa_len(&ConsoleObject->pos,&aa_line[i])>look+5)break;
            if(!aa_visible(&aa_line[i],ConsoleObject->size))break;
            pursuit=aa_line[i];found=1;
        }
        if(!found){aa_line_next=0;return 0;}
    }
    aa_line_distance=walk;*target=pursuit;return 1;
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
    float desired=copysignf(fminf(fabsf(speed),sqrtf(65*fmaxf(0,(aa_line_cruising?aa_line_distance:distance)-.65f))),speed);
    if(aa_sliding)desired=aa_clamp(desired,-20,aa_line_cruising?52:24);
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
static float aa_view_depth(vms_vector direction);
static int aa_arc_active,aa_arc_room=-1,aa_arc_plans,aa_open_turns;
static fix64 aa_arc_until;
static vms_vector aa_arc_goal;
static float aa_arc_left,aa_arc_right;
/* Score the view throughout a turn, not just its destination. Rays inspect
 * mine geometry only; they never discover unrendered robots or projectiles. */
static float aa_arc_score(float angle,float rise){
    object *ship=ConsoleObject;float total=0,nearest=100;
    for(int n=1;n<=5;n++){
        float t=n/6.f,a=angle*t;vms_vector d;
        vm_vec_copy_scale(&d,&ship->orient.fvec,fl2f(cosf(a)));
        vm_vec_scale_add2(&d,&ship->orient.rvec,fl2f(sinf(a)));
        vm_vec_scale_add2(&d,&ship->orient.uvec,fl2f(rise*t));
        float depth=aa_view_depth(d);nearest=fminf(nearest,depth);total+=fminf(depth,65);
    }
    /* A small view fan rejects a narrow slit that looks open down one ray. */
    for(int sign=-1;sign<=1;sign+=2){
        float a=angle*.5f+sign*.18f;vms_vector d;
        vm_vec_copy_scale(&d,&ship->orient.fvec,fl2f(cosf(a)));vm_vec_scale_add2(&d,&ship->orient.rvec,fl2f(sinf(a)));
        nearest=fminf(nearest,aa_view_depth(d));
    }
    return total/5+fminf(nearest,40)*.65f-fabsf(angle)*7;
}
static float aa_open_turn(float yaw,float rise,vms_vector goal){
    object *ship=ConsoleObject;float forward=f2fl(vm_vec_dot(&goal,&ship->orient.fvec));
    /* Near-vertical goals have no useful yaw bearing until pitch catches up. */
    if(fabsf(rise)>.94f){aa_arc_active=0;return 0;}
    if(aa_arc_active&&(forward>.76f||GameTime64>=aa_arc_until||aa_arc_room!=ship->segnum||vm_vec_dot(&goal,&aa_arc_goal)<fl2f(.68f)))aa_arc_active=0;
    if(!aa_arc_active&&fabsf(yaw)>1.80f){
        float left=yaw<0?yaw:yaw-6.2831853f,right=yaw>0?yaw:yaw+6.2831853f;
        aa_arc_left=aa_arc_score(left,rise);aa_arc_right=aa_arc_score(right,rise);
        int shorter=yaw<0?-1:1;
        aa_arc_active=fabsf(aa_arc_right-aa_arc_left)>9?(aa_arc_right>aa_arc_left?1:-1):shorter;
        if(aa_arc_active!=shorter)aa_open_turns++;
        aa_turn_side=aa_arc_active;aa_arc_room=ship->segnum;aa_arc_goal=goal;aa_arc_until=GameTime64+i2f(6);aa_arc_plans++;
    }
    /* Commit through the ambiguous rear bearing; otherwise tiny goal changes
     * repeatedly reverse the turn. Release early enough to brake normally. */
    if(aa_arc_active>0&&yaw<0)yaw+=6.2831853f;
    if(aa_arc_active<0&&yaw>0)yaw-=6.2831853f;
    return yaw;
}
static float aa_rotation_control(float error,float rate,float limit,float feedforward,int axis){
    float smooth=EM_ASM_DOUBLE(return Math.max(0,Math.min(1,Module.comfort?.smooth||0)));
    float acceleration=(axis==2?.09f:.22f+.12f*aa_reaction)*(1-.55f*smooth),dt=aa_clamp(f2fl(FrameTime),0,.1f);limit*=1-.25f*smooth;
    float brake=sqrtf(2*acceleration*fabsf(error)/6.2831853f);
    float wanted=copysignf(fminf(fabsf(error)*3.1f/6.2831853f,brake),error)+feedforward/6.2831853f;
    wanted=aa_clamp(wanted,-limit,limit);
    if(!aa_up_ready){aa_smooth_rate[axis]=rate;aa_smooth_acceleration[axis]=0;}
    float gap=wanted-aa_smooth_rate[axis],desired_acceleration=aa_clamp(gap/fmaxf(.12f,dt),-acceleration,acceleration);
    float jerk=(axis==2?.65f:1.5f+.6f*aa_reaction)*(1-.4f*smooth);
    aa_smooth_acceleration[axis]+=aa_clamp(desired_acceleration-aa_smooth_acceleration[axis],-jerk*dt,jerk*dt);
    float step=aa_smooth_acceleration[axis]*dt;
    if(step*gap>=0&&fabsf(step)>fabsf(gap)){aa_smooth_rate[axis]=wanted;aa_smooth_acceleration[axis]=0;}
    else aa_smooth_rate[axis]+=step;
    wanted=aa_smooth_rate[axis];
    physics_info *p=&ConsoleObject->mtype.phys_info;
    float drag=aa_clamp(f2fl(p->drag)*2.5f,.01f,.90f);
    float gain=64*(1-drag)*f2fl(Player_ship->max_rotthrust)/fmaxf(.01f,f2fl(p->mass));
    return aa_clamp((64*drag*wanted+(wanted-rate)*8)/fmaxf(.01f,gain),-1,1);
}
static void aa_level_up(void){
    if(!aa_up_ready){
        aa_up=ConsoleObject->orient.uvec;aa_up_ready=1;aa_arc_active=0;
        physics_info *p=&ConsoleObject->mtype.phys_info;
        aa_smooth_rate[0]=f2fl(p->rotvel.x);aa_smooth_rate[1]=f2fl(p->rotvel.y);aa_smooth_rate[2]=f2fl(p->rotvel.z);
        memset(aa_smooth_acceleration,0,sizeof aa_smooth_acceleration);
    }
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
    aa_level_up();if(!focus){
        vms_vector unflattened=d;aa_cruise_direction(&d);
        /* A level attitude must not redirect a real climb into its end wall. */
        if(vm_vec_dot(&unflattened,&d)<fl2f(.995f)){
            vms_vector ahead;vm_vec_scale_add(&ahead,&ship->pos,&d,i2f(16));
            if(!aa_visible(&ahead,0))d=unflattened;
        }
    }
    float x=f2fl(vm_vec_dot(&d,&ship->orient.rvec)),y=f2fl(vm_vec_dot(&d,&ship->orient.uvec)),z=f2fl(vm_vec_dot(&d,&ship->orient.fvec));
    float alignment=z;aa_aim_error=acosf(aa_clamp(z,-1,1))*57.29578f;
    if(!focus){
        vms_vector travel=ship->mtype.phys_info.velocity;fix motion=vm_vec_mag(&travel),ahead=vm_vec_dot(&travel,&ship->orient.fvec);
        vms_vector aheadpoint;vm_vec_scale_add(&aheadpoint,&ship->pos,&ship->orient.fvec,i2f(35));
        if(motion>i2f(28)&&z<.45f&&ahead>fixmul(motion,fl2f(.75f))&&aa_visible(&aheadpoint,ship->size)){
            vm_vec_normalize(&travel);aa_cruise_direction(&travel);d=travel;x=f2fl(vm_vec_dot(&travel,&ship->orient.rvec));y=f2fl(vm_vec_dot(&travel,&ship->orient.uvec));z=f2fl(vm_vec_dot(&travel,&ship->orient.fvec));
        }
    }
    float yaw=atan2f(x,z),pitch=-atan2f(y,sqrtf(x*x+z*z));
    yaw=aa_open_turn(yaw,y,d);
    float dt=f2fl(FrameTime),limit=focus?.20f+.04f*aa_reaction:.16f,feed_yaw=0,feed_pitch=0;
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
/* Survey openings independently of short position corrections. A stable
 * world-space interest point prevents staring at a wall for a four-second
 * slide, without adding a continual camera sweep or x-ray target search. */
static float aa_view_depth(vms_vector direction){
    if(vm_vec_normalize(&direction)<F1_0/100)return 0;
    vms_vector end;vm_vec_scale_add(&end,&ConsoleObject->pos,&direction,i2f(100));
    fvi_query q={&ConsoleObject->pos,&end,ConsoleObject->segnum,0,ConsoleObject-Objects,NULL,FQ_TRANSPOINT};fvi_info hit;
    return find_vector_intersection(&q,&hit)==HIT_NONE?100:aa_len(&hit.hit_pnt,&ConsoleObject->pos);
}
static vms_vector aa_survey(vms_vector route,int searching){
    object *ship=ConsoleObject;int seg=ship->segnum;vms_vector held;
    vms_vector route_direction;vm_vec_normalized_dir(&route_direction,&route,&ship->pos);
    if(aa_gaze_room==seg&&GameTime64<aa_gaze_next)return aa_gaze_point;
    aa_gaze_next=GameTime64+F1_0/6;
    aa_gaze_clearance=aa_view_depth(ship->orient.fvec);
    float held_distance=f2fl(vm_vec_normalized_dir(&held,&aa_gaze_point,&ship->pos));
    if(aa_gaze_room>=0&&GameTime64<aa_gaze_until&&held_distance>10&&
        (searching||vm_vec_dot(&held,&route_direction)>F1_0/4)&&
        aa_view_depth(held)>23&&aa_visible(&aa_gaze_point,0))return aa_gaze_point;
    vms_vector best=route;float score=-1000;
    int next=aa_goal,guard=0;
    while(next>=0&&aa_parent[next]>=0&&aa_parent[next]!=seg&&guard++<MAX_SEGMENTS)next=aa_parent[next];
    for(int n=-2;n<6;n++){
        vms_vector point,direction;
        if(n==-2)point=route;
        else if(n==-1)vm_vec_scale_add(&point,&ship->pos,&ship->orient.fvec,i2f(65));
        else{
            int child=Segments[seg].children[n];
            if(child<0||!(WALL_IS_DOORWAY(&Segments[seg],n)&WID_FLY_FLAG)||aa_forbidden_portal(seg,n))continue;
            compute_center_point_on_side(&point,&Segments[seg],n);
            vm_vec_scale_add2(&point,&Segments[seg].sides[n].normals[0],-i2f(7));
        }
        float distance=f2fl(vm_vec_normalized_dir(&direction,&point,&ship->pos));
        if(distance<5||!aa_visible(&point,0))continue;
        float depth=aa_view_depth(direction),forward=f2fl(vm_vec_dot(&direction,&ship->orient.fvec));
        float vertical=fabsf(f2fl(vm_vec_dot(&direction,aa_up_ready?&aa_up:&ship->orient.uvec)));
        float width=depth;
        vms_vector lateral;vm_vec_cross(&lateral,&direction,aa_up_ready?&aa_up:&ship->orient.uvec);vm_vec_normalize(&lateral);
        for(int sign=-1;sign<=1;sign+=2){vms_vector edge=direction;vm_vec_scale_add2(&edge,&lateral,fl2f(sign*.22f));width=fminf(width,aa_view_depth(edge));}
        float value=fminf(depth,80)*.34f+fminf(width,45)*.28f+forward*9-vertical*11;
        if(!searching)value+=f2fl(vm_vec_dot(&direction,&route_direction))*14;
        if(n>=0){int child=Segments[seg].children[n];value+=18+(child==next?28:0)+(aa_visits[child]?0:5);}
        else if(n==-2)value+=searching?-12:26;
        if(depth<18)value-=40;if(width<9)value-=14;
        if(searching&&aa_gaze_room==seg&&vm_vec_dot(&direction,&held)>fl2f(.9f))value-=22;
        if(value>score){score=value;vm_vec_scale_add(&best,&ship->pos,&direction,fl2f(fmaxf(4,fminf(70,depth-2))));}
    }
    /* Enclosed rooms still need a deliberate survey, including their upper
     * recesses. Choose clearance instead of rotating blindly into a wall. */
    if(searching&&score<25){
        for(int side=0;side<6;side++){
            vms_vector point,direction;compute_center_point_on_side(&point,&Segments[seg],side);
            vm_vec_normalized_dir(&direction,&point,&ship->pos);
            float value=aa_view_depth(direction)*.5f+f2fl(vm_vec_dot(&direction,&ship->orient.fvec))*8;
            if(aa_gaze_room==seg&&vm_vec_dot(&direction,&held)>fl2f(.9f))value-=35;
            if(value>score){score=value;best=point;}
        }
    }
    if(aa_gaze_room!=seg||aa_len(&best,&aa_gaze_point)>6)aa_gaze_changes++;
    aa_gaze_point=best;aa_gaze_room=seg;aa_gaze_until=GameTime64+F1_0*5/4;
    return best;
}
static int aa_dodge_fire(int allowed){
    aa_evading=0;
    if(!allowed){aa_evade_until=0;return 0;}
    object *ship=ConsoleObject;
    if(aa_incoming>=0&&GameTime64>=aa_evade_next&&GameTime64>=aa_evade_until){
        float best=-1;vms_vector chosen,trajectory=aa_incoming_velocity;vm_vec_normalize(&trajectory);
        for(int side=-1;side<=1;side++)for(int up=-1;up<=1;up++){
            if(!side&&!up)continue;
            vms_vector dir,point;vm_vec_copy_scale(&dir,&ship->orient.rvec,i2f(side));
            vm_vec_scale_add2(&dir,&ship->orient.uvec,i2f(up));vm_vec_normalize(&dir);
            /* Include existing forward drift when checking where the hull
             * will be during the dodge, not just an empty side ray. */
            vm_vec_scale_add(&point,&ship->pos,&dir,i2f(11));
            vm_vec_scale_add2(&point,&ship->mtype.phys_info.velocity,fl2f(.22f));
            if(!aa_visible(&point,ship->size))continue;
            vms_vector miss=aa_incoming_miss,perp=dir;
            vm_vec_scale_add2(&perp,&trajectory,-vm_vec_dot(&dir,&trajectory));
            vm_vec_scale_add2(&miss,&perp,-fl2f(7));
            float score=f2fl(vm_vec_mag(&miss))+(up==0?1.3f:0)+f2fl(vm_vec_dot(&dir,&aa_evade_direction));
            if(score>best){best=score;chosen=dir;}
        }
        if(best>=0){aa_evade_direction=chosen;aa_evade_until=GameTime64+fl2f(.55f);aa_dodges++;}
        aa_evade_next=GameTime64+F1_0/5;
    }
    if(GameTime64>=aa_evade_until)return 0;
    vms_vector point;vm_vec_scale_add(&point,&ship->pos,&aa_evade_direction,i2f(9));
    vm_vec_scale_add2(&point,&ship->mtype.phys_info.velocity,fl2f(.18f));
    if(!aa_visible(&point,ship->size)){aa_evade_until=0;return 0;}
    vms_vector axes[2]={ship->orient.rvec,ship->orient.uvec};
    fix *out[2]={&Controls.sideways_thrust_time,&Controls.vertical_thrust_time};
    for(int k=0;k<2;k++){
        float desired=f2fl(vm_vec_dot(&aa_evade_direction,&axes[k]))*26;
        float velocity=f2fl(vm_vec_dot(&ship->mtype.phys_info.velocity,&axes[k]));
        float drag=f2fl(ship->mtype.phys_info.drag),mass=f2fl(ship->mtype.phys_info.mass);
        float hold=desired*mass*drag/fmaxf(.01f,(1-drag)*f2fl(Player_ship->max_thrust));
        *out[k]=fl2f(aa_clamp(hold+(desired-velocity)*.16f,-1,1)*f2fl(FrameTime));
    }
    aa_evading=1;aa_evade_seconds+=f2fl(FrameTime);return 1;
}
static void aa_afterburner(vms_vector target,int allowed){
    object *ship=ConsoleObject;player *p=&Players[Player_num];vms_vector direction,clear;
    float distance=f2fl(vm_vec_normalized_dir(&direction,&target,&ship->pos));
    float speed=f2fl(vm_vec_dot(&ship->mtype.phys_info.velocity,&ship->orient.fvec));
    float look=fmaxf(55,25+fmaxf(0,speed)*.5f+speed*speed/100);
    vm_vec_scale_add(&clear,&ship->pos,&ship->orient.fvec,fl2f(look));
    int safe=allowed&&!aa_evading&&aa_incoming<0&&(p->flags&PLAYER_FLAGS_AFTERBURNER)&&
        p->afterburner_charge>F1_0/6&&speed>8&&distance>32&&
        vm_vec_dot(&direction,&ship->orient.fvec)>fl2f(.975f)&&
        (GameTime64<aa_boost_until||Controls.forward_thrust_time>0)&&aa_visible(&clear,ship->size);
    if(!safe){aa_boost_until=0;return;}
    if(GameTime64>=aa_boost_next&&GameTime64>=aa_boost_until&&distance>44&&p->afterburner_charge>F1_0/2){
        aa_boost_until=GameTime64+fl2f(.45f);aa_boost_next=GameTime64+i2f(6);aa_bursts++;
    }
    if(GameTime64<aa_boost_until){Controls.afterburner_state=1;aa_boost_seconds+=f2fl(FrameTime);}
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
/* Test the native barrels and their actual forward trajectory, not the
 * camera-to-target visibility ray. A visible wing behind a corner isn't a
 * clear firing lane. Switch/door shots must hit the intended wall side. */
static int aa_guns(int missile,int *guns){
    int count=0,w=Players[Player_num].primary_weapon;
    if(missile){int g=Secondary_weapon_to_gun_num[Players[Player_num].secondary_weapon];guns[count++]=g;if(g==4)guns[count++]=5;}
    else if(w==VULCAN_INDEX||w==GAUSS_INDEX||w==SPREADFIRE_INDEX||w==HELIX_INDEX)guns[count++]=6;
    else if(w==OMEGA_INDEX)guns[count++]=1;
    else {guns[count++]=0;guns[count++]=1;if(w==LASER_INDEX&&(Players[Player_num].flags&PLAYER_FLAGS_QUAD_LASERS)){guns[count++]=2;guns[count++]=3;}}
    return count;
}
static fix aa_projectile_radius(int missile){
    int w=missile?Secondary_weapon_to_weapon_info[Players[Player_num].secondary_weapon]:Primary_weapon_to_weapon_info[Players[Player_num].primary_weapon];
    if(!missile&&Players[Player_num].primary_weapon==LASER_INDEX){int l=Players[Player_num].laser_level;w=l<=MAX_LASER_LEVEL?LASER_ID+l:SUPER_LASER_ID+l-MAX_LASER_LEVEL-1;}
    weapon_info *info=&Weapon_info[w];
    if(info->render_type==WEAPON_RENDER_POLYMODEL)return fixdiv(Polygon_models[info->model_num].rad,info->po_len_to_width_ratio);
    return info->render_type==WEAPON_RENDER_NONE?F1_0:info->blob_size;
}
/* Check the complete native projectile path, not a shortened camera ray or
 * an approximate screen-space aiming circle. At least one barrel must actually
 * hit the intended object; no barrel may be buried in a nearby wall. */
static int aa_lane_from(vms_vector *position,int segment,vms_matrix *orientation,int enemy,int wallno,vms_vector *aim,int missile){
    int guns[4],count=aa_guns(missile,guns),hits=0;
    vms_matrix inverse;vm_copy_transpose_matrix(&inverse,orientation);
    fix radius=aa_projectile_radius(missile);
    for(int n=0;n<count;n++){
        vms_vector offset,start,end,delta;vm_vec_rotate(&offset,&Player_ship->gun_points[guns[n]],&inverse);vm_vec_add(&start,position,&offset);
        fvi_info hit;fvi_query q={position,&start,segment,radius,ConsoleObject-Objects,NULL,0};
        if(find_vector_intersection(&q,&hit)!=HIT_NONE)return 1;
        int room=find_point_seg(&start,segment);if(room<0)return 2;
        vm_vec_sub(&delta,aim,&start);float along=f2fl(vm_vec_dot(&delta,&orientation->fvec));if(along<=0)return 3;
        float body=enemy>=0?f2fl(Objects[enemy].size):0;
        vm_vec_scale_add(&end,&start,&orientation->fvec,fl2f(along+body+8));
        q.p0=&start;q.p1=&end;q.startseg=room;q.flags=FQ_TRANSPOINT|FQ_CHECK_OBJS|FQ_IGNORE_POWERUPS;
        int result=find_vector_intersection(&q,&hit);
        if(enemy>=0){
            if(result==HIT_OBJECT&&hit.hit_object==enemy)hits++;
            else if(result!=HIT_NONE&&aa_len(&start,&hit.hit_pnt)<fmaxf(4,along-body*.9f))return 4;
        }else if(wallno>=0&&result==HIT_WALL&&hit.hit_side_seg==Walls[wallno].segnum&&hit.hit_side==Walls[wallno].sidenum)hits++;
    }
    return hits?0:5;
}
static int aa_shot_lane(int enemy,int wallno,vms_vector *aim,int missile){
    aa_lane_reason=enemy>=0&&!aa_can_see(enemy)?6:aa_lane_from(&ConsoleObject->pos,ConsoleObject->segnum,&ConsoleObject->orient,enemy,wallno,aim,missile);
    if(aa_lane_reason){aa_blocked_shots++;return 0;}aa_clear_shots++;return 1;
}
static int aa_weapon_effective(int info,int enemy){
    if(!aa_hostile(enemy))return 1;
    int boss=Robot_info[Objects[enemy].id].boss_flag-BOSS_D2;
    if(boss<0||boss>=NUM_D2_BOSSES||Boss_invulnerable_spot[boss])return 1;
    return !(Weapon_info[info].matter?Boss_invulnerable_matter[boss]:Boss_invulnerable_energy[boss]);
}
static float aa_weapon_score(int w,float distance,int enemy){
    if((enemy<0&&(w==OMEGA_INDEX||w==FUSION_INDEX))||w==SUPER_LASER_INDEX||player_has_weapon(Player_num,w,0)!=HAS_ALL||!aa_primary_safe(w,distance)||!aa_weapon_effective(Primary_weapon_to_weapon_info[w],enemy))return -100;
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
    if(aa_hostile(enemy)){
        int boss=Robot_info[Objects[enemy].id].boss_flag-BOSS_D2;
        if(boss>=0&&boss<NUM_D2_BOSSES){
            int matter=Weapon_info[Primary_weapon_to_weapon_info[w]].matter;
            if(matter?Boss_spews_bots_matter[boss]:Boss_spews_bots_energy[boss])score-=1.3f;
        }
    }
    return score;
}
static void aa_choose_weapon(float distance,int enemy){
    player *p=&Players[Player_num];int current=p->primary_weapon;
    int unavailable=player_has_weapon(Player_num,current,0)!=HAS_ALL;
    int unsafe=!aa_primary_safe(current,distance);
    if(enemy<0&&!unavailable&&!unsafe&&current!=OMEGA_INDEX&&current!=FUSION_INDEX)return; /* Keep a safe gun for doors/switches. */
    int unsuitable=unsafe||(enemy<0&&(current==OMEGA_INDEX||current==FUSION_INDEX))||!aa_weapon_effective(Primary_weapon_to_weapon_info[current],enemy)||(current==OMEGA_INDEX&&distance>75)||(current==FUSION_INDEX&&distance<24);
    if(!unavailable&&!unsuitable&&GameTime64<aa_weapon_next)return;
    float present=aa_weapon_score(current,distance,enemy),best=present;int selected=current;
    for(int w=0;w<MAX_PRIMARY_WEAPONS;w++){float score=aa_weapon_score(w,distance,enemy);if(score>best){best=score;selected=w;}}
    if(selected!=current&&(unavailable||unsuitable||best>present+.55f)){
        select_weapon(selected,0,0,1);aa_switches++;aa_weapon_changed=GameTime64;
        aa_weapon_next=GameTime64+i2f(14);
    }else aa_weapon_next=GameTime64+i2f(3);
}

/* Trigger discipline uses elapsed time in this engagement, never a global
 * clock phase. Native fire rates, charge, energy and damage are unchanged. */
static int aa_fire_weapon=-1,aa_fire_enemy=-2,aa_fire_signature,aa_fire_bursts,aa_fusion_releases,aa_fusion_aborts;
static fix64 aa_fire_until,aa_fire_rest,aa_fire_lost;
static float aa_fusion_goal;
static void aa_fire_reset(void){aa_fire_weapon=-1;aa_fire_enemy=-2;aa_fire_until=aa_fire_rest=aa_fire_lost=0;}
static int aa_trigger_rhythm(int enemy,float distance,int permitted){
    int weapon=Players[Player_num].primary_weapon,signature=enemy>=0?Objects[enemy].signature:0;
    if(weapon!=aa_fire_weapon||enemy!=aa_fire_enemy||signature!=aa_fire_signature){
        aa_fire_reset();aa_fire_weapon=weapon;aa_fire_enemy=enemy;aa_fire_signature=signature;
    }
    if(!permitted){
        if(!aa_fire_lost)aa_fire_lost=GameTime64;
        if(GameTime64-aa_fire_lost>F1_0/4)aa_fire_until=0;
        /* Releasing Fusion fires it. A human can cancel an unsafe charge by
         * selecting a different gun; use that native action, with no refund. */
        if(weapon==FUSION_INDEX&&Fusion_charge>0){
            for(int w=0;w<MAX_PRIMARY_WEAPONS;w++)if(w!=FUSION_INDEX&&w!=SUPER_LASER_INDEX&&player_has_weapon(Player_num,w,0)==HAS_ALL){
                select_weapon(w,0,0,1);aa_weapon_changed=GameTime64;aa_weapon_next=GameTime64+i2f(4);aa_switches++;aa_fusion_aborts++;break;
            }
        }
        return 0;
    }
    aa_fire_lost=0;
    if(enemy<0)return 1; /* Doors and switches should not inherit combat pauses. */
    if(GameTime64<aa_fire_rest)return 0;
    if(weapon==FUSION_INDEX){
        if(!aa_fire_until){
            aa_fusion_goal=aa_clamp(.45f+f2fl(Objects[enemy].shields)*.003f,.55f,1.35f);
            aa_fire_until=GameTime64+i2f(2);aa_fire_bursts++;
        }
        if(f2fl(Fusion_charge)>=aa_fusion_goal||GameTime64>=aa_fire_until){
            aa_fire_until=0;aa_fire_rest=GameTime64+F1_0*3/5;aa_fusion_releases++;return 0;
        }
        return 1;
    }
    float burst=1.8f,rest=.12f;
    if(weapon==VULCAN_INDEX||weapon==GAUSS_INDEX){burst=distance>75?.42f:.7f;rest=distance>75?.18f:.12f;}
    else if(weapon==SPREADFIRE_INDEX||weapon==HELIX_INDEX){burst=.85f;rest=.16f;}
    else if(weapon==PHOENIX_INDEX){burst=.65f;rest=.25f;}
    else if(weapon==OMEGA_INDEX){burst=.75f;rest=.16f;}
    if(!aa_fire_until){aa_fire_until=GameTime64+fl2f(burst);aa_fire_bursts++;}
    if(GameTime64>=aa_fire_until){aa_fire_until=0;aa_fire_rest=GameTime64+fl2f(rest);return 0;}
    return 1;
}
static int aa_missile_opportunity(int enemy,int weapon,float distance){
    if(enemy<0||!aa_can_see(enemy))return 0;
    object *foe=&Objects[enemy];int clustered=0;
    if(weapon==SMART_INDEX||weapon==SMISSILE5_INDEX){
        for(int i=0;i<=Highest_object_index;i++)if(aa_hostile(i)&&aa_can_see(i)&&aa_len(&Objects[i].pos,&foe->pos)<45)clustered++;
    }
    float health=f2fl(foe->shields);
    if(weapon==SMART_INDEX)return distance>80&&(clustered>=2||health>180);
    if(weapon==MEGA_INDEX||weapon==SMISSILE5_INDEX)return distance>115&&(health>180||clustered>=3);
    if(health<18&&distance<80&&aa_primary_safe(Players[Player_num].primary_weapon,distance))return 0;
    /* Fast lateral targets suit homing weapons. Unguided missiles wait for a
     * steady shot instead of being launched solely because a timer expired. */
    if((weapon==CONCUSSION_INDEX||weapon==SMISSILE1_INDEX)&&foe->movement_type==MT_PHYSICS){
        vms_vector line;vm_vec_normalized_dir(&line,&foe->pos,&ConsoleObject->pos);
        vms_vector lateral=foe->mtype.phys_info.velocity;fix along=vm_vec_dot(&lateral,&line);vm_vec_scale_add2(&lateral,&line,-along);
        if(foe->movement_type==MT_PHYSICS&&f2fl(vm_vec_mag(&lateral))*distance/160>f2fl(foe->size)*.8f)return 0;
    }
    return GameTime64-aa_target_since>F1_0/2;
}

static void aa_route_reset(void){
    aa_mission=-1;aa_mission_object=aa_mission_wall=-1;aa_boss_room=-1;aa_boss_seen=0;aa_supply_next=aa_supply_until=0;
    aa_recent_count=aa_recent_serial=0;aa_route_sample=aa_loop_next=aa_detour_until=aa_tour_next=0;
    aa_progress_time=GameTime64;aa_detour_goal=-1;aa_loop_count=0;aa_progress_target=-1;
    aa_progress_rooms=aa_seen;aa_progress_kills=Players[Player_num].num_kills_total;aa_progress_pickups=aa_collects;
}
static int aa_recent_has(int room){for(int i=0;i<aa_recent_count;i++)if(aa_recent_rooms[i]==room)return 1;return 0;}
static void aa_route_watch(void){
    if(aa_seen!=aa_progress_rooms||Players[Player_num].num_kills_total!=aa_progress_kills||aa_collects!=aa_progress_pickups){
        aa_progress_time=GameTime64;aa_progress_rooms=aa_seen;aa_progress_kills=Players[Player_num].num_kills_total;aa_progress_pickups=aa_collects;
    }
    int enemy=aa_combat_target;
    if(aa_combat_object(enemy)&&aa_can_see(enemy)){
        if(enemy!=aa_progress_target||Objects[enemy].signature!=aa_progress_signature){aa_progress_target=enemy;aa_progress_signature=Objects[enemy].signature;aa_progress_health=Objects[enemy].shields;}
        else if(Objects[enemy].shields<aa_progress_health-i2f(4)){aa_progress_time=GameTime64;aa_progress_health=Objects[enemy].shields;}
    }
    if(aa_detour_goal==ConsoleObject->segnum||GameTime64>=aa_detour_until)aa_detour_goal=-1;
    if(GameTime64<aa_route_sample)return;aa_route_sample=GameTime64+F1_0;
    aa_recent_rooms[aa_recent_serial++%48]=ConsoleObject->segnum;if(aa_recent_count<48)aa_recent_count++;
    int distinct=0;for(int i=0;i<aa_recent_count;i++){int first=1;for(int j=0;j<i;j++)if(aa_recent_rooms[j]==aa_recent_rooms[i]){first=0;break;}distinct+=first;}
    float quiet=(double)(GameTime64-aa_progress_time)/F1_0;
    if(quiet>28&&aa_recent_count>=24&&GameTime64>=aa_loop_next&&(distinct<=7||quiet>70)){
        if(aa_object>=0&&!aa_combat_object(aa_object)){aa_ignore[aa_object]=GameTime64+i2f(80);aa_ignore_signature[aa_object]=Objects[aa_object].signature;}
        if(aa_wall>=0)aa_wall_seen[aa_wall]=GameTime64+i2f(90);
        aa_graph();float best=-1;int destination=-1;
        for(int room=0;room<=Highest_segment_index;room++)if(aa_dist[room]>1&&room!=ConsoleObject->segnum){
            float score=(aa_visits[room]?50.f/(1+aa_visits[room]):600.f)/(1+aa_dist[room]*.12f);
            if(aa_recent_has(room))score*=.025f;
            if(score>best){best=score;destination=room;}
        }
        aa_detour_goal=destination;aa_detour_until=GameTime64+i2f(35);
        if(aa_phase==0)aa_mission_set(destination,-1,-1,0);aa_loop_next=GameTime64+i2f(35);aa_loop_count++;
        aa_next=0;aa_pick_object=-1;aa_sliding=0;aa_slide_goal=-2;
    }
    EM_ASM(Module.autoNavigation=({version:41,distinct:$0,quiet:$1,reroutes:$2,detour:$3});,distinct,quiet,aa_loop_count,aa_detour_goal);
}

/* Deliberate local combat positioning. The mission graph still chooses the
 * route; this bounded planner finds hull-clear firing positions around visible
 * obstacles, including a reactor directly below the ship. */
static int aa_attack_active,aa_attack_object=-1,aa_position_signature,aa_attack_plans,aa_attack_moves,aa_attack_failures;
static vms_vector aa_attack_point,aa_attack_observed,aa_attack_visited[8];
static fix64 aa_attack_next,aa_position_until,aa_attack_progress,aa_attack_seen,aa_attack_visited_time[8];
static float aa_attack_distance;
static int aa_attack_serial;
static void aa_attack_reset(void){
    aa_attack_active=0;aa_attack_object=-1;aa_attack_next=aa_position_until=aa_attack_seen=0;
    memset(aa_attack_visited_time,0,sizeof aa_attack_visited_time);
}
static void aa_attack_remember(void){
    int slot=aa_attack_serial++%8;aa_attack_visited[slot]=aa_attack_point;aa_attack_visited_time[slot]=GameTime64;
}
static int aa_attack_lane(vms_vector *point,int room,int enemy,vms_vector *aim){
    vms_vector forward;vm_vec_normalized_dir(&forward,aim,point);
    vms_matrix facing,inverse;int guns[4];aa_guns(0,guns);
    /* Account for the offset barrel before scoring a hypothetical position. */
    for(int i=0;i<2;i++){
        vm_vector_2_matrix(&facing,&forward,&ConsoleObject->orient.uvec,NULL);
        vm_copy_transpose_matrix(&inverse,&facing);vms_vector offset,corrected=*aim;
        vm_vec_rotate(&offset,&Player_ship->gun_points[guns[0]],&inverse);vm_vec_sub2(&corrected,&offset);
        vm_vec_normalized_dir(&forward,&corrected,point);
    }
    vm_vector_2_matrix(&facing,&forward,&ConsoleObject->orient.uvec,NULL);
    return aa_lane_from(point,room,&facing,enemy,-1,aim,0)==0;
}
/* Safety is evaluated only for a small shortlist. Geometry rays rank dodge
 * space and escape routes; only currently observed opponents count as threats. */
static float aa_position_quality(vms_vector point,int room,vms_vector observed,int *exits){
    vms_vector away,right,up=aa_up_ready?aa_up:ConsoleObject->orient.uvec;
    vm_vec_normalized_dir(&away,&point,&observed);vm_vec_cross(&right,&up,&away);
    if(vm_vec_normalize(&right)<F1_0/10)right=ConsoleObject->orient.rvec;
    vms_vector dirs[5]={right,right,up,up,away};vm_vec_negate(&dirs[1]);vm_vec_negate(&dirs[3]);
    float quality=0;*exits=0;
    for(int j=0;j<5;j++){
        vms_vector end;vm_vec_scale_add(&end,&point,&dirs[j],i2f(j==4?18:12));
        if(aa_hull_path(&point,room,&end,ConsoleObject->size)){quality+=j==4?15:8;(*exits)++;}
    }
    /* Penalize crossfire, using a bounded sample of rendered enemies only. */
    int checked=0;
    for(int i=0;i<=Highest_object_index&&checked<4;i++)if(i!=aa_combat_target&&aa_hostile(i)&&aa_can_see(i)){
        checked++;fvi_query q={&point,&Objects[i].pos,room,0,ConsoleObject-Objects,NULL,FQ_TRANSPOINT};fvi_info hit;
        if(find_vector_intersection(&q,&hit)==HIT_NONE)quality-=12;
    }
    return quality;
}
static int aa_position_exits,aa_position_checks;
static float aa_position_safety;
static fix aa_pressure_shields;
static fix64 aa_pressure_until;
static void aa_pressure_update(void){
    fix shields=Players[Player_num].shields;
    if(aa_pressure_shields-shields>F1_0/2)aa_pressure_until=GameTime64+F1_0*5/2;
    aa_pressure_shields=shields;
}

static int aa_attack_position(int enemy,vms_vector *aim,vms_vector *target,float *speed){
    object *ship=ConsoleObject,*foe=&Objects[enemy];
    if(enemy!=aa_attack_object||foe->signature!=aa_position_signature){aa_attack_reset();aa_attack_object=enemy;aa_position_signature=foe->signature;}
    aa_attack_observed=*aim;aa_attack_seen=GameTime64;
    float distance=aa_len(&ship->pos,&foe->pos),minimum=f2fl(foe->size+ship->size)+10;
    int weapon=Players[Player_num].primary_weapon;
    float ideal=weapon==OMEGA_INDEX?36:weapon==HELIX_INDEX||weapon==SPREADFIRE_INDEX?42:weapon==GAUSS_INDEX||weapon==VULCAN_INDEX||weapon==FUSION_INDEX?70:55;
    float preferred=fmaxf(ideal,minimum+16);int close=distance<minimum;
    if(aa_attack_active){
        float remaining=aa_len(&ship->pos,&aa_attack_point);
        if(remaining<aa_attack_distance-1){aa_attack_distance=remaining;aa_attack_progress=GameTime64;}
        if(remaining<3||GameTime64>aa_position_until||GameTime64-aa_attack_progress>F1_0*5/2||!aa_visible(&aa_attack_point,ship->size)){
            aa_attack_remember();aa_attack_active=0;aa_attack_next=GameTime64+F1_0/2;
        }
    }
    if(!aa_attack_active&&GameTime64>=aa_attack_next){
        aa_attack_next=GameTime64+F1_0;
        int clear=aa_attack_lane(&ship->pos,ship->segnum,enemy,aim);
        int stalled=GameTime64-aa_damage_since>(foe->type==OBJ_CNTRLCEN?i2f(3):i2f(5));
        int pressured=aa_pressure_until>GameTime64||aa_incoming>=0;
        int exits;float present=aa_position_quality(ship->pos,ship->segnum,*aim,&exits);aa_position_checks++;
        aa_position_safety=present;aa_position_exits=exits;
        if(close||!clear||stalled||(pressured&&exits<3)){
            aa_attack_plans++;float best=-1e9f;vms_vector selected=ship->pos;
            vms_vector shortlist[5];float shortlist_score[5];int shortlist_room[5],shortlist_lane[5],shortlist_count=0;
            vms_vector outward,up=aa_up_ready?aa_up:ship->orient.uvec,right;
            vm_vec_normalized_dir(&outward,&ship->pos,&foe->pos);vm_vec_cross(&right,&up,&outward);
            if(vm_vec_normalize(&right)<F1_0/10)right=ship->orient.rvec;
            vms_vector forward;vm_vec_cross(&forward,&right,&up);vm_vec_normalize(&forward);
            for(int ring=0;ring<3;ring++)for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)for(int z=-1;z<=1;z++){
                if(!(x||y||z))continue;
                vms_vector direction={0,0,0};vm_vec_scale_add2(&direction,&right,i2f(x));vm_vec_scale_add2(&direction,&up,i2f(y));vm_vec_scale_add2(&direction,&forward,i2f(z));vm_vec_normalize(&direction);
                vms_vector candidate;vm_vec_scale_add(&candidate,ring==2?&foe->pos:&ship->pos,&direction,fl2f(ring==2?preferred:ring==1?26:12));
                float travel=aa_len(&candidate,&ship->pos),range=aa_len(&candidate,&foe->pos);
                if(travel<6||range<minimum-3||travel>95)continue;
                int room=find_point_seg(&candidate,ship->segnum);if(room<0||!aa_visible(&candidate,ship->size))continue;
                int lane=aa_attack_lane(&candidate,room,enemy,aim);
                vms_vector bearing;vm_vec_normalized_dir(&bearing,&foe->pos,&candidate);
                float score=(lane?150:0)-fabsf(range-preferred)*.65f-travel*.24f-fabsf(f2fl(vm_vec_dot(&bearing,&up)))*20;
                if(!lane&&!close)score-=40;
                for(int k=0;k<8;k++)if(aa_attack_visited_time[k]&&GameTime64-aa_attack_visited_time[k]<i2f(18)&&aa_len(&candidate,&aa_attack_visited[k])<9)score-=90;
                if(shortlist_count==5&&score<=shortlist_score[4])continue;
                int slot=shortlist_count<5?shortlist_count++:4;
                while(slot>0&&score>shortlist_score[slot-1]){
                    shortlist[slot]=shortlist[slot-1];shortlist_score[slot]=shortlist_score[slot-1];shortlist_room[slot]=shortlist_room[slot-1];shortlist_lane[slot]=shortlist_lane[slot-1];slot--;
                }
                shortlist[slot]=candidate;shortlist_score[slot]=score;shortlist_room[slot]=room;shortlist_lane[slot]=lane;
            }
            for(int j=0;j<shortlist_count;j++){
                int escapes;float safety=aa_position_quality(shortlist[j],shortlist_room[j],*aim,&escapes);aa_position_checks++;
                if(!close&&clear&&!stalled&&safety<present+10)continue;
                float score=shortlist_score[j]+safety*(pressured?1.3f:.8f)-(escapes==0?55:0);
                if(score>best){best=score;selected=shortlist[j];aa_position_safety=safety;aa_position_exits=escapes;}
            }
            if(best>-1e8f){aa_attack_point=selected;aa_attack_distance=aa_len(&ship->pos,&selected);aa_position_until=GameTime64+i2f(5);aa_attack_progress=GameTime64;aa_attack_active=1;aa_attack_moves++;aa_reposition++;}
            else {aa_attack_failures++;aa_attack_next=GameTime64+F1_0;}
        }
    }
    if(aa_attack_active){*target=aa_attack_point;*speed=close?20:17;}
    if(GameTime64>=aa_status_next)EM_ASM(Module.autoAttack=({version:82,active:!!$0,target:$1,plans:$2,moves:$3,failures:$4,range:$5,minimum:$6,waypoint:[$7,$8,$9]});,aa_attack_active,enemy,aa_attack_plans,aa_attack_moves,aa_attack_failures,distance,minimum,f2fl(aa_attack_point.x),f2fl(aa_attack_point.y),f2fl(aa_attack_point.z));
    return aa_attack_active;
}

/* One cover maneuver: retreat -> brief shelter -> peek -> committed volley.
 * Its remembered bearing is frozen when sight is lost. The native sight and
 * barrel checks still authorize every shot independently. */
static int aa_cover_phase,aa_cover_enemy=-1,aa_cover_signature,aa_cover_count,aa_cover_peeks,aa_cover_returns;
static vms_vector aa_cover_hide,aa_cover_peek,aa_cover_observed;
static fix64 aa_cover_until,aa_cover_next,aa_cover_started,aa_cover_seen;
static int aa_cover_returned;
static void aa_cover_reset(void){aa_cover_phase=0;aa_cover_enemy=-1;aa_cover_next=GameTime64+i2f(3);}
static int aa_sheltered(vms_vector point,int room,vms_vector observed){
    fvi_query q={&point,&observed,room,0,ConsoleObject-Objects,NULL,FQ_TRANSPOINT};fvi_info hit;
    if(find_vector_intersection(&q,&hit)!=HIT_WALL)return 0;
    /* A wall at the far end is not nearby cover. */
    return aa_len(&point,&hit.hit_pnt)<28;
}
static int aa_cover_plan(int enemy,vms_vector observed){
    if(GameTime64<aa_cover_next)return 0;aa_cover_next=GameTime64+F1_0;
    object *ship=ConsoleObject;vms_vector away,right,up=aa_up_ready?aa_up:ship->orient.uvec;
    vm_vec_normalized_dir(&away,&ship->pos,&observed);vm_vec_cross(&right,&up,&away);
    if(vm_vec_normalize(&right)<F1_0/10)right=ship->orient.rvec;
    vms_vector peek=ship->pos;int peekroom=ship->segnum;
    if(!aa_attack_lane(&peek,peekroom,enemy,&observed)){
        if(!aa_attack_active)return 0;peek=aa_attack_point;peekroom=find_point_seg(&peek,peekroom);
        if(peekroom<0||!aa_attack_lane(&peek,peekroom,enemy,&observed))return 0;
    }
    float best=-1e9f;vms_vector chosen=peek;
    for(int axis=0;axis<2;axis++)for(int sign=-1;sign<=1;sign+=2)for(int step=0;step<3;step++){
        vms_vector hide=peek;vm_vec_scale_add2(&hide,axis?&up:&right,i2f(sign*(10+step*7)));
        vm_vec_scale_add2(&hide,&away,i2f(6));
        int room=find_point_seg(&hide,peekroom);
        if(room<0||!aa_visible(&hide,ship->size)||!aa_hull_path(&hide,room,&peek,ship->size)||!aa_sheltered(hide,room,observed))continue;
        int exits;float quality=aa_position_quality(hide,room,observed,&exits);
        float value=quality-aa_len(&ship->pos,&hide)*.8f-(axis?8:0);
        if(exits&&value>best){best=value;chosen=hide;}
    }
    if(best<-1e8f)return 0;
    aa_cover_hide=chosen;aa_cover_peek=peek;aa_cover_observed=observed;
    aa_cover_enemy=enemy;aa_cover_signature=Objects[enemy].signature;
    aa_cover_phase=1;aa_cover_started=aa_cover_seen=GameTime64;aa_cover_until=GameTime64+i2f(3);
    aa_cover_returned=0;aa_cover_count++;aa_attack_active=0;return 1;
}
static int aa_cover_step(int enemy,vms_vector *target,vms_vector *aim,float *speed){
    if(!aa_cover_phase)return 0;
    if(!aa_combat_object(aa_cover_enemy)||Objects[aa_cover_enemy].signature!=aa_cover_signature||
       Control_center_destroyed||GameTime64-aa_cover_started>i2f(7)||GameTime64-aa_cover_seen>i2f(4)||
       (enemy>=0&&enemy!=aa_cover_enemy)) {aa_cover_reset();return 0;}
    if(enemy==aa_cover_enemy&&aa_can_see(enemy)){aa_cover_observed=Objects[enemy].pos;aa_cover_seen=GameTime64;}
    vms_vector point=aa_cover_phase<=2?aa_cover_hide:aa_cover_peek;
    if(!aa_visible(&point,ConsoleObject->size)){aa_cover_reset();return 0;}
    float remaining=aa_len(&point,&ConsoleObject->pos);
    if(aa_cover_phase==1&&(remaining<3||GameTime64>=aa_cover_until)){
        if(remaining>=5||!aa_sheltered(ConsoleObject->pos,ConsoleObject->segnum,aa_cover_observed)){aa_cover_reset();return 0;}
        aa_cover_phase=2;aa_cover_until=GameTime64+F1_0*2/5;
    }
    if(aa_cover_phase==2&&GameTime64>=aa_cover_until){aa_cover_phase=3;aa_cover_until=GameTime64+i2f(2);aa_cover_peeks++;remaining=aa_len(&aa_cover_peek,&ConsoleObject->pos);}
    if(aa_cover_phase==3&&(remaining<3||GameTime64>=aa_cover_until)){
        if(remaining>=5){aa_cover_reset();return 0;}
        aa_cover_phase=4;aa_cover_until=GameTime64+F1_0*6/5;
    }
    if(aa_cover_phase==4){
        if(aa_incoming>=0&&aa_incoming_time<.7f&&!aa_cover_returned){
            aa_cover_phase=1;aa_cover_returned=1;aa_cover_returns++;aa_cover_until=GameTime64+i2f(2);
        }else if(GameTime64>=aa_cover_until){aa_cover_reset();return 0;}
    }
    *target=aa_cover_phase<=2?aa_cover_hide:aa_cover_peek;*speed=aa_cover_phase==2||aa_cover_phase==4?0:18;
    /* Watch the exposed corner while tucked, not the opponent through a wall. */
    *aim=enemy>=0&&aa_visible(&aa_cover_observed,0)?aa_cover_observed:aa_cover_peek;
    if(aa_len(aim,&ConsoleObject->pos)<5||!aa_visible(aim,0))*aim=aa_survey(aa_cover_peek,0);
    return 1;
}

void astra_auto_frame(void){
    if(!astra_auto_enabled()||!ConsoleObject)return;
    memset(&Controls,0,sizeof Controls);
    if(Player_is_dead){
        aa_line_count=0;aa_line_room=-1;aa_line_next=0;aa_cover_reset();aa_fire_reset();aa_pressure_until=0;aa_pressure_shields=Players[Player_num].shields;
        aa_sense_next=aa_evade_next=aa_gaze_next=aa_evade_until=aa_boost_until=aa_gaze_until=0;aa_incoming=-1;aa_gaze_room=-1;aa_reaction=0;
        aa_contact_until=aa_contact_next=0;aa_pending_missile=-1;aa_weapon_next=aa_missile_next=0;aa_watch_until=0;aa_up_ready=0;
        if(!aa_dead_since){aa_dead_since=GameTime64;aa_deaths++;}
        if(Player_exploded&&GameTime64-aa_dead_since>i2f(11))Death_sequence_aborted=1;
        EM_ASM(window.astraAutoStatus?.("Ship lost - relaunching",$0,$1,$2,$3);,aa_seen,aa_deaths,aa_kills,aa_collects);
        return;
    }
    if(aa_dead_since){aa_attack_reset();aa_route_reset();aa_flare_next=GameTime64+i2f(3);aa_door_flare_next=0;aa_door_flare_wall=-1;}
    if(aa_dead_since){aa_sliding=0;aa_slide_until=0;aa_slide_goal=-2;aa_escape_until=0;aa_escape_room=-1;aa_arsenal_signature=-1;aa_combat_target=-1;aa_next=0;aa_pick_object=aa_object=aa_goal=-1;aa_up_ready=0;aa_last_kills=Players[Player_num].num_kills_total;aa_weapon_next=GameTime64+i2f(8);}
    aa_dead_since=0;if(Endlevel_sequence)return;
    if(aa_level!=Current_level_num){
        aa_line_count=0;aa_line_room=-1;aa_line_next=0;aa_cover_reset();aa_fire_reset();aa_pressure_until=0;aa_pressure_shields=Players[Player_num].shields;
        aa_attack_reset();
        aa_sense_next=aa_evade_next=aa_gaze_next=aa_evade_until=aa_boost_until=aa_boost_next=aa_gaze_until=0;aa_incoming=-1;aa_gaze_room=-1;
        aa_sliding=0;aa_slide_until=0;aa_slide_goal=-2;aa_escape_until=0;aa_escape_room=-1;memset(aa_blocked,0,sizeof aa_blocked);
        aa_weapon_next=GameTime64+i2f(8);aa_missile_next=0;aa_pending_missile=-1;aa_watch_until=0;aa_up_ready=0;
        aa_last_target=-1;aa_last_kills=Players[Player_num].num_kills_total;aa_weapon_changed=GameTime64;
        aa_arsenal_signature=-1;aa_recent_attacker=aa_combat_target=-1;memset(aa_attack_until,0,sizeof aa_attack_until);
        memset(aa_combat_defer,0,sizeof aa_combat_defer);memset(aa_engage_signature,255,sizeof aa_engage_signature);memset(aa_engage_elapsed,0,sizeof aa_engage_elapsed);
        aa_flare_next=GameTime64+i2f(2);aa_door_flare_next=0;aa_door_flare_wall=-1;
        aa_contact_until=aa_contact_next=0;aa_level=Current_level_num;aa_level_since=GameTime64;aa_next=aa_status_next=0;aa_segment=-1;aa_seen=0;
        memset(aa_visits,0,sizeof aa_visits);memset(aa_ignore,0,sizeof aa_ignore);memset(aa_wall_seen,0,sizeof aa_wall_seen);
        aa_last=ConsoleObject->pos;aa_stuck_since=GameTime64;aa_route_reset();
    }
    aa_demo_arsenal();aa_sense_fire();aa_pressure_update();
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
    aa_route_watch();
    if(GameTime64>=aa_next||aa_goal<0)aa_plan();
    aa_mode=aa_route_mode;vm_vec_zero(&aa_target_velocity);
    vms_vector target;compute_segment_center(&target,&Segments[seg]);
    int door=-1;
    if(aa_goal>=0){
        if(seg==aa_goal){
            if(aa_object>=0 && Objects[aa_object].type!=OBJ_NONE)target=Objects[aa_object].pos;
            if(aa_wall>=0){
                int side=Walls[aa_wall].sidenum;aa_switch_point(aa_wall,&target);
                if(WALL_IS_DOORWAY(&Segments[seg],side)&WID_FLY_FLAG)
                    vm_vec_scale_add2(&target,&Segments[seg].sides[side].normals[0],-ConsoleObject->size-i2f(8));
            }
        }else{
            int next=aa_goal,limit=0;
            while(aa_parent[next]>=0&&aa_parent[next]!=seg&&limit++<MAX_SEGMENTS)next=aa_parent[next];
            for(int s=0;s<6;s++)if(Segments[seg].children[s]==next){
                compute_center_point_on_side(&target,&Segments[seg],s);
                vms_vector beyond,dir;compute_segment_center(&beyond,&Segments[next]);vm_vec_sub(&dir,&beyond,&target);vm_vec_normalize(&dir);
                if(!(WALL_IS_DOORWAY(&Segments[seg],s)&WID_FLY_FLAG))door=Segments[seg].sides[s].wall_num;
                vm_vec_scale_add2(&target,&dir,door>=0?-ConsoleObject->size-i2f(2):ConsoleObject->size+i2f(2));
                /* First center the hull on the approach side if a ledge clips
                 * the swept crossing. Never drive blindly through a corner. */
                if(door<0&&!aa_visible(&target,ConsoleObject->size)){
                    vms_vector approach;compute_center_point_on_side(&approach,&Segments[seg],s);
                    vm_vec_scale_add2(&approach,&Segments[seg].sides[s].normals[0],ConsoleObject->size+i2f(3));
                    if(aa_visible(&approach,ConsoleObject->size))target=approach;
                    else compute_segment_center(&target,&Segments[seg]);
                }
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
    aa_line_active=0;
    if(door<0&&flare_door<0&&!Control_center_destroyed&&aa_goal>=0&&seg!=aa_goal)aa_line_active=aa_flight_line(&target);
    /* A rejected collision or a stalled approach must not hold the pilot in
     * an orbit. Object signatures prevent cooldowns leaking to reused slots. */
    if(aa_object>=0 && aa_mode==1){
        object *pickup=&Objects[aa_object];float distance=aa_len(&pickup->pos,&ConsoleObject->pos);
        if(aa_pick_object!=aa_object||aa_pick_signature!=pickup->signature){
            aa_pick_object=aa_object;aa_pick_signature=pickup->signature;
            aa_pick_distance=distance;aa_pick_progress=GameTime64;aa_pick_contact=0;
        }
        if(distance<aa_pick_distance-1){aa_pick_distance=distance;aa_pick_progress=GameTime64;}
        /* A key behind several bends is approached through portals, not along
         * its straight-line distance. Only time out the final local approach. */
        if(seg!=pickup->segnum){aa_pick_progress=GameTime64;aa_pick_distance=distance;}
        if(seg==pickup->segnum && distance<f2fl(ConsoleObject->size+pickup->size)+1){
            if(!aa_pick_contact)aa_pick_contact=GameTime64;
        }else aa_pick_contact=0;
        if(pickup->type!=OBJ_POWERUP || !aa_pickup_need(&Players[Player_num],pickup,GameTime64))aa_next=0;
        else if(GameTime64-aa_pick_progress>i2f(6)||(aa_pick_contact&&GameTime64-aa_pick_contact>F1_0))aa_skip_pickup(aa_object,30);
    }else aa_pick_object=-1;

    /* Aim at the closest visible threat; the guide-bot is never a target. */
    int contact=aa_contact_until>GameTime64;
    /* Only now, after the renderer confirms sight, associate a bearing with
     * a robot and allow ordinary retaliation and native barrel checks. */
    if(contact)for(int i=0;i<=Highest_object_index;i++)if(aa_hostile(i)&&aa_can_see(i)&&aa_visible(&Objects[i].pos,0)){
        vms_vector bearing;float distance=f2fl(vm_vec_normalized_dir(&bearing,&Objects[i].pos,&ConsoleObject->pos));
        if(distance<115&&vm_vec_dot(&bearing,&aa_contact_direction)>F1_0/3){
            astra_auto_attacked(&Objects[i]);aa_combat_defer[i]=0;
            aa_combat_target=-1;aa_contact_until=0;aa_contact_next=GameTime64+i2f(2);
            aa_contact_acquired++;contact=0;break;
        }
    }
    int enemy=-1;float threat=0;
    for(int i=0;i<=Highest_object_index;i++){
        object *o=&Objects[i];if(o->type!=OBJ_ROBOT&&o->type!=OBJ_CNTRLCEN)continue;
        if(o->flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING))continue;
        if(o->type==OBJ_ROBOT&&Robot_info[o->id].companion)continue;
        float d=aa_len(&o->pos,&ConsoleObject->pos);if(!aa_can_see(i)||(aa_combat_defer[i]>GameTime64&&aa_combat_defer_signature[i]==o->signature))continue;
        float s=(aa_threat(i)?12.f:o->type==OBJ_CNTRLCEN?2.f:1.f)/(d+24);
        if(i==aa_combat_target&&o->signature==aa_combat_signature)s*=1.5f;
        if(s>threat){threat=s;enemy=i;}
    }
    int locked=aa_combat_target;
    if(aa_combat_object(locked) && Objects[locked].signature==aa_combat_signature &&
       aa_can_see(locked)&&aa_combat_defer[locked]<=GameTime64){
        int urgent=enemy>=0&&enemy!=locked&&aa_threat(enemy)&&
            aa_len(&Objects[enemy].pos,&ConsoleObject->pos)<48&&
            (aa_len(&Objects[locked].pos,&ConsoleObject->pos)>65||!aa_threat(locked))&&GameTime64-aa_target_since>F1_0/2;
        if(!urgent)enemy=locked;
    }
    if(enemy!=aa_last_target){aa_target_since=GameTime64;aa_last_target=enemy;aa_lane_since=0;aa_damage_since=GameTime64;aa_enemy_health=enemy>=0?Objects[enemy].shields:0;}
    aa_combat_target=enemy;if(enemy>=0){aa_combat_signature=Objects[enemy].signature;aa_last_foe=Objects[enemy].pos;}
    if(aa_pending_missile>=0&&!aa_can_see(aa_pending_target))aa_pending_missile=-1;
    float speed=Control_center_destroyed?58:aa_line_active?aa_line_limit:52;
    vms_vector aim=target;int attacking=0,flanking=0,searching=0;
    if(aa_wall>=0&&seg==aa_goal&&aa_switch_shootable(aa_wall))speed=aa_len(&target,&ConsoleObject->pos)>24?20:0;
    if(aa_phase==6&&seg==aa_goal&&aa_len(&target,&ConsoleObject->pos)<8)speed=0;
    if((aa_phase==3||aa_phase==11)&&seg==aa_mission&&enemy<0&&aa_object<0&&aa_len(&target,&ConsoleObject->pos)<10){
        aim=aa_survey(target,1);searching=1;
        vms_vector look,step;vm_vec_normalized_dir(&look,&aim,&ConsoleObject->pos);
        vm_vec_scale_add(&step,&ConsoleObject->pos,&look,i2f(8));
        if(aa_visible(&step,ConsoleObject->size)){target=step;speed=7;}else speed=0;
    }
    if(door>=0){compute_center_point_on_side(&aim,&Segments[Walls[door].segnum],Walls[door].sidenum);aa_mode=6;}
    if(enemy>=0 && !Control_center_destroyed){
        object *foe=&Objects[enemy];aim=foe->pos;attacking=1;door=-1;flare_door=-1;
        if(foe->type==OBJ_ROBOT&&Robot_info[foe->id].boss_flag){aa_boss_seen=GameTime64;aa_boss_room=foe->segnum;}
        /* Preserve ineffective-engagement time across brief occlusion and
         * target swaps; flickering visibility cannot reset it indefinitely. */
        if(aa_engage_signature[enemy]!=foe->signature||foe->shields<aa_engage_health[enemy]-F1_0/4){
            aa_engage_signature[enemy]=foe->signature;aa_engage_health[enemy]=foe->shields;aa_engage_elapsed[enemy]=0;
        }
        aa_engage_elapsed[enemy]+=FrameTime;
        if(foe->type==OBJ_ROBOT&&aa_engage_elapsed[enemy]>i2f(18)){
            aa_combat_defer[enemy]=GameTime64+i2f(10);aa_combat_defer_signature[enemy]=foe->signature;aa_engage_elapsed[enemy]=0;
        }
        if(foe->shields<aa_enemy_health){aa_enemy_health=foe->shields;aa_damage_since=GameTime64;}
        if(foe->type==OBJ_ROBOT&&GameTime64-aa_damage_since>i2f(22)){
            aa_combat_defer[enemy]=GameTime64+i2f(10);aa_combat_defer_signature[enemy]=foe->signature;
        }
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
        vms_vector route_target=target;
        target=aim;speed=fabsf(gap)<7?0:aa_clamp(gap*1.3f,-24,36);aa_mode=3;
        if(!aa_visible(&aim,0)){
            /* Partial visibility does not authorize firing into the corner.
             * Translate along the clear route while keeping the foe in view. */
            target=route_target;speed=aa_visible(&target,ConsoleObject->size)?18:0;aa_reposition++;
            if(foe->type==OBJ_ROBOT&&GameTime64-aa_target_since>i2f(12)){
                aa_combat_defer[enemy]=GameTime64+i2f(4);aa_combat_defer_signature[enemy]=foe->signature;
            }
        }else if(speed>0){
            vms_vector advance;vm_vec_scale_add(&advance,&ConsoleObject->pos,&line,i2f(12));
            if(!aa_visible(&advance,ConsoleObject->size)){target=route_target;speed=aa_visible(&target,ConsoleObject->size)?16:0;}
        }
        /* Observe the visible guardian's orientation and strafe toward its
         * vulnerable rear. Never use its live location after sight is lost. */
        int boss=foe->type==OBJ_ROBOT?Robot_info[foe->id].boss_flag-BOSS_D2:-1;
        if(boss>=0&&boss<NUM_D2_BOSSES&&Boss_invulnerable_spot[boss]){
            vms_vector toward;vm_vec_normalized_dir(&toward,&ConsoleObject->pos,&foe->pos);
            extern int Boss_invulnerable_dot;
            if(vm_vec_dot(&toward,&foe->orient.fvec)>Boss_invulnerable_dot-F1_0/8){
                flanking=1;
                vms_vector rear;vm_vec_scale_add(&rear,&foe->pos,&foe->orient.fvec,-i2f(55));
                if(aa_visible(&rear,ConsoleObject->size)){target=rear;speed=24;}
                else for(int sign=-1;sign<=1;sign+=2){
                    vms_vector flank;vm_vec_scale_add(&flank,&ConsoleObject->pos,&ConsoleObject->orient.rvec,i2f(sign*18));
                    if(aa_visible(&flank,ConsoleObject->size)){target=flank;speed=24;break;}
                }
            }
        }
        if(foe->movement_type==MT_PHYSICS)aa_target_velocity=foe->mtype.phys_info.velocity;
        if(speed<0){vms_vector back;vm_vec_scale_add(&back,&ConsoleObject->pos,&ConsoleObject->orient.fvec,-i2f(16));if(!aa_visible(&back,ConsoleObject->size))speed=0;}
    }
    if(aa_attack_active&&(!aa_combat_object(aa_attack_object)||Objects[aa_attack_object].signature!=aa_position_signature))aa_attack_reset();
    int positioning=0;
    if(attacking&&!flanking){
        aa_choose_weapon(aa_len(&Objects[enemy].pos,&ConsoleObject->pos),enemy);
        if(!aa_cover_phase)positioning=aa_attack_position(enemy,&aim,&target,&speed);
    }else if(enemy<0&&!Control_center_destroyed&&aa_attack_active&&GameTime64-aa_attack_seen<F1_0*5/2&&
             aa_len(&aa_attack_point,&ConsoleObject->pos)>3&&
             aa_visible(&aa_attack_point,ConsoleObject->size)){
        /* Finish an observed approach across a brief occlusion without tracking
         * an unseen enemy. Firing remains disabled until the renderer sees it. */
        target=aa_attack_point;aim=aa_attack_observed;speed=18;positioning=1;
        /* Keep the last observed approach, but look around its visible opening
         * rather than staring through the occluder at an obsolete bearing. */
        if(!aa_visible(&aim,0))aim=aa_survey(target,0);
    }
    if(attacking&&!flanking&&!aa_cover_phase&&aa_hostile(enemy)&&
       (aa_pressure_until>GameTime64||aa_incoming>=0)&&aa_len(&aim,&ConsoleObject->pos)>25&&Fusion_charge==0)
        aa_cover_plan(enemy,Objects[enemy].pos);
    int covering=aa_cover_step(enemy,&target,&aim,&speed);
    if(covering){positioning=1;searching=0;door=flare_door=-1;aa_watch_until=0;aa_mode=13;vm_vec_zero(&aa_target_velocity);}
    int investigating=contact&&!Control_center_destroyed&&(aa_contact_ram||enemy<0||!aa_threat(enemy)||aa_len(&Objects[enemy].pos,&ConsoleObject->pos)>40);
    if(investigating){
        if(covering){aa_cover_reset();covering=0;}
        aa_watch_until=0;aim=aa_contact_point;attacking=0;searching=1;flanking=0;
        if(!aa_visible(&aim,0))aim=aa_survey(aa_contact_point,1);
        door=flare_door=-1;aa_pending_missile=-1;aa_mode=12;
        /* Slide away from a physical ram while turning smoothly. Keep the
         * frozen bearing rather than chasing any unseen live object. */
        vms_vector away;vm_vec_scale_add(&away,&ConsoleObject->pos,&aa_contact_direction,-i2f(14));
        if(aa_visible(&away,ConsoleObject->size)){target=away;speed=aa_contact_ram?18:10;}
        else {compute_segment_center(&target,&Segments[seg]);speed=aa_visible(&target,ConsoleObject->size)?10:0;}
        if(GameTime64-aa_contact_started>i2f(3)&&vm_vec_dot(&ConsoleObject->orient.fvec,&aa_contact_direction)>fl2f(.92f))aa_contact_until=0;
    }
    int watching=aa_watch_until>GameTime64&&!Control_center_destroyed;
    if(watching){
        vms_vector look;vm_vec_normalized_dir(&look,&aa_watch_point,&ConsoleObject->pos);
        if(enemy>=0||contact||aa_incoming>=0||Players[Player_num].shields<i2f(25)||
           !aa_visible(&aa_watch_point,0)||vm_vec_dot(&look,&ConsoleObject->orient.fvec)<F1_0/4){aa_watch_until=0;watching=0;}
    }
    if(watching){
        aim=aa_watch_point;speed=aa_visible(&target,ConsoleObject->size)?8:0;
        attacking=0;door=-1;flare_door=-1;aa_mode=8;aa_stuck_since=GameTime64;vm_vec_zero(&aa_target_velocity);
    }
    if(flare_door>=0){
        wall *gate=&Walls[flare_door];compute_center_point_on_side(&aim,&Segments[gate->segnum],gate->sidenum);
        float distance=aa_len(&aim,&ConsoleObject->pos);
        /* Allow the flare and the native door animation to arrive first. */
        speed=fminf(speed,fmaxf(5,(distance-8)/1.8f));
        vms_matrix inverse;vms_vector muzzle;vm_copy_transpose_matrix(&inverse,&ConsoleObject->orient);vm_vec_rotate(&muzzle,&Player_ship->gun_points[6],&inverse);vm_vec_sub2(&aim,&muzzle);aa_mode=6;
    }
    vms_vector travel_direction;float travel_distance=f2fl(vm_vec_normalized_dir(&travel_direction,&target,&ConsoleObject->pos));
    float travel_facing=f2fl(vm_vec_dot(&travel_direction,&ConsoleObject->orient.fvec));
    int short_slide=!aa_line_active&&!searching&&!attacking&&!watching&&door<0&&flare_door<0&&!(aa_wall>=0&&seg==aa_goal)&&travel_distance<38&&
        aa_visible(&target,fixmul(ConsoleObject->size,fl2f(.95f)));
    if(aa_slide_goal!=aa_goal||!short_slide||GameTime64>aa_slide_until)aa_sliding=0;
    if(short_slide&&!aa_sliding){
        aa_slide_heading=ConsoleObject->orient.fvec;aa_slide_until=GameTime64+i2f(4);aa_slide_goal=aa_goal;aa_slide_count++;
    }
    aa_sliding=short_slide;
    int surveying=!searching&&!attacking&&!watching&&!investigating&&!positioning&&door<0&&flare_door<0&&!(aa_wall>=0&&seg==aa_goal);
    if(surveying){
        aim=aa_survey(target,0);
        /* The rounded flight line supplies the bend tangent while the ship is
         * already facing its route. Keep the open-space turnaround for reversals. */
        if((aa_line_active&&travel_facing>.35f)||(!short_slide&&travel_facing<.5f&&aa_visible(&target,ConsoleObject->size)))aim=target;
    }
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
    aa_line_cruising=surveying&&aa_line_active;
    if(escaping){aa_escape_move();aa_mode=7;}else {
        int sliding=aa_sliding;if(attacking||investigating||positioning||watching||searching||(aa_line_active&&travel_facing>.5f))aa_sliding=1;
        aa_move(target,speed);aa_sliding=sliding;aa_line_cruising=0;
    }
    vms_vector shot_target=aim;
    if(attacking||(!watching&&aa_wall>=0&&seg==aa_goal&&!(WALL_IS_DOORWAY(&Segments[seg],Walls[aa_wall].sidenum)&WID_FLY_FLAG))){
        /* Native projectiles leave parallel, offset barrels. Centering the
         * reticle on a small robot can send both streams past its hull. */
        int w=Players[Player_num].primary_weapon;
        int gun=(w==VULCAN_INDEX||w==GAUSS_INDEX||w==SPREADFIRE_INDEX||w==HELIX_INDEX)?6:w==OMEGA_INDEX?1:0;
        if(aa_pending_missile>=0)gun=Secondary_weapon_to_gun_num[aa_pending_missile];
        vms_matrix inverse;vms_vector muzzle;vm_copy_transpose_matrix(&inverse,&ConsoleObject->orient);
        vm_vec_rotate(&muzzle,&Player_ship->gun_points[gun],&inverse);vm_vec_sub2(&aim,&muzzle);
    }
    aa_reaction=attacking||investigating?1:0;
    float alignment=aa_aim(aim,attacking||watching?1:searching||door>=0||flare_door>=0||(aa_wall>=0&&seg==aa_goal)?2:0);
    if(aa_incoming<0&&GameTime64>=aa_evade_until&&!escaping&&!flanking&&!positioning&&attacking&&alignment>.97f&&enemy>=0&&aa_threat(enemy)&&fabsf(speed)<30){
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
    int trigger_permitted=0;
    if(!investigating&&!watching&&!escaping&&(!covering||aa_cover_phase>=3)&&(attacking||(door>=0&&Walls[door].type==WALL_BLASTABLE)||(aa_wall>=0&&seg==aa_goal&&(aa_mode==4||aa_mode==5)&&!(WALL_IS_DOORWAY(&Segments[seg],Walls[aa_wall].sidenum)&WID_FLY_FLAG)))){
        if(alignment>.985f){
            float distance=enemy>=0?aa_len(&Objects[enemy].pos,&ConsoleObject->pos):aa_len(&aim,&ConsoleObject->pos);
            aa_choose_weapon(distance,enemy);
            trigger_permitted=aa_shot_lane(enemy,door>=0?door:aa_wall,&shot_target,0)&&aa_primary_safe(Players[Player_num].primary_weapon,distance)&&aa_weapon_effective(Primary_weapon_to_weapon_info[Players[Player_num].primary_weapon],enemy);
            if(aa_pending_missile>=0&&(enemy!=aa_pending_target||enemy<0||Objects[enemy].signature!=aa_pending_signature))aa_pending_missile=-1;
            if(attacking&&distance>48&&alignment>.994f&&aa_pending_missile<0&&GameTime64>=aa_missile_next){
                int tough=Objects[enemy].shields>i2f(140)&&distance>115;
                int cluster=0;for(int i=0;i<=Highest_object_index;i++)if(aa_hostile(i)&&aa_can_see(i)&&aa_len(&Objects[i].pos,&Objects[enemy].pos)<45)cluster++;
                int smart=distance>80&&cluster>=2;
                int order[]={smart?SMART_INDEX:distance>95?SMISSILE4_INDEX:HOMING_INDEX,HOMING_INDEX,CONCUSSION_INDEX,SMISSILE1_INDEX,MEGA_INDEX,SMART_INDEX,SMISSILE5_INDEX};
                for(int m=0;m<7;m++){
                    int w=order[m];if(!Players[Player_num].secondary_ammo[w]||(m>=4&&!tough)||!aa_weapon_effective(Secondary_weapon_to_weapon_info[w],enemy)||!aa_missile_opportunity(enemy,w,distance))continue;
                    if(Players[Player_num].secondary_weapon!=w)select_weapon(w,1,0,1);
                    aa_pending_missile=w;aa_pending_target=enemy;aa_pending_signature=Objects[enemy].signature;aa_missile_ready=GameTime64+F1_0*11/10;break;
                }
            }
            int heavy=aa_pending_missile==SMART_INDEX||aa_pending_missile==MEGA_INDEX||aa_pending_missile==SMISSILE5_INDEX;
            if(aa_pending_missile>=0&&GameTime64>=aa_missile_ready&&attacking&&enemy==aa_pending_target&&distance>(aa_pending_missile==SMART_INDEX?80:heavy?115:48)&&alignment>.994f){
                if(Players[Player_num].secondary_weapon==aa_pending_missile&&aa_missile_opportunity(enemy,aa_pending_missile,distance)&&aa_shot_lane(enemy,-1,&shot_target,1))Controls.fire_secondary_state=1;
                aa_pending_missile=-1;aa_missile_next=GameTime64+i2f(6);
            }
        }
    }
    Controls.fire_primary_state=aa_trigger_rhythm(enemy,enemy>=0?aa_len(&Objects[enemy].pos,&ConsoleObject->pos):aa_len(&shot_target,&ConsoleObject->pos),trigger_permitted);
    if(attacking&&!watching&&!escaping&&alignment>.985f){
        if(Controls.fire_primary_state||Controls.fire_secondary_state)aa_lane_since=0;
        else if(!aa_lane_since)aa_lane_since=GameTime64;
    }
    /* Imminent projectile evasion takes precedence over lane repositioning.
     * It changes thrust only: the pilot continues looking at the opponent. */
    aa_dodge_fire(!escaping&&!watching);
    aa_afterburner(target,!escaping&&!watching&&!attacking&&!investigating&&!searching&&door<0&&flare_door<0&&!aa_sliding&&speed>30);
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
        static const char *labels[]={"Exploring the mine","Collecting supplies","Rescuing hostages","Engaging hostile","Activating switch","Escaping to exit","Opening door","Finding clearance","Watching destruction","Recharging energy","Navigating to reactor","Tracking reactor guardian","Checking incoming attack","Using cover"};
        aa_kills=Players[Player_num].num_kills_total;
        EM_ASM(Module.autoMission=({version:41,phase:$0,room:$1,wall:$2,changes:$3,age:$4,blockedShots:$5,clearShots:$6,reposition:$7,reactorDestroyed:!!$8,routeDistance:$9});,
            aa_phase,aa_mission,aa_mission_wall,aa_goal_changes,(double)(GameTime64-aa_mission_since)/F1_0,aa_blocked_shots,aa_clear_shots,aa_reposition,Control_center_destroyed,aa_goal>=0?aa_dist[aa_goal]:-1);
        vms_vector travel=ConsoleObject->mtype.phys_info.velocity;float velocity=f2fl(vm_vec_mag(&travel));
        aa_facing_velocity=velocity>.05f?f2fl(vm_vec_dot(&travel,&ConsoleObject->orient.fvec))/velocity:1;
        EM_ASM(Module.autoFlight=({speed:$0,forward:$1,primary:$2,secondary:$3,energy:$4,shields:$5,version:21});,velocity,aa_facing_velocity,Players[Player_num].primary_weapon,Players[Player_num].secondary_weapon,f2fl(Players[Player_num].energy),f2fl(Players[Player_num].shields));
        EM_ASM({window.astraAutoStatus?.(UTF8ToString($0),$1,$2,$3,$4);Module.autoTelemetry=({segment:$5,goal:$6,object:$7,enemy:$8,mode:$9,x:$10,y:$11,z:$12});},watching?labels[8]:investigating?labels[12]:enemy>=0&&aa_threat(enemy)?"Returning fire":labels[aa_mode],aa_seen,aa_deaths,aa_kills,aa_collects,seg,aa_goal,aa_object,enemy,aa_mode,f2fl(ConsoleObject->pos.x),f2fl(ConsoleObject->pos.y),f2fl(ConsoleObject->pos.z));
        EM_ASM(Module.autoContact=({version:41,investigating:!!$0,ram:!!$1,contacts:$2,acquired:$3,remaining:$4});,investigating,aa_contact_ram,aa_contact_count,aa_contact_acquired,fmaxf(0,(double)(aa_contact_until-GameTime64)/F1_0));
        EM_ASM(Module.autoCombat=({attacker:$0,target:$1,retaliating:!!$2,retaliations:$3,cruise:52,arsenal:!!Module.demoArsenal});,aa_recent_attacker,enemy,enemy>=0&&aa_threat(enemy),aa_retaliations);
        EM_ASM(Module.autoSight=({version:21,visible:$0,targetVisible:!!$1,hiddenRoute:!!$2});,aa_sight_count,enemy>=0&&aa_can_see(enemy),aa_combat_object(aa_object)&&!aa_can_see(aa_object));
        EM_ASM(Module.autoView=({version:81,turning:!!$0,turnSide:$0,plans:$1,openTurns:$2,leftScore:$3,rightScore:$4,surveying:!!$5});,aa_arc_active,aa_arc_plans,aa_open_turns,aa_arc_left,aa_arc_right,surveying);
        EM_ASM(Module.autoPilot=({version:82,aimError:$0,rollError:$1,watching:!!$2,watches:$3,switches:$4,held:$5,targetAge:$6,turnRate:$7});,
            aa_aim_error,aa_roll_error,watching,aa_watch_count,aa_switches,(double)(GameTime64-aa_weapon_changed)/F1_0,(double)(GameTime64-aa_target_since)/F1_0,f2fl(vm_vec_mag(&ConsoleObject->mtype.phys_info.rotvel))*360);
        EM_ASM(Module.autoSkill=({version:82,path:!!$0,pathPlans:$1,rounded:$2,speedLimit:$3,pathLength:$4,cover:$5,coverPlans:$6,peeks:$7,returns:$8,exits:$9,positionQuality:$10,positionChecks:$11,bursts:$12,fusionReleases:$13,fusionAborts:$14,trigger:!!$15});,
            aa_line_active,aa_line_builds,aa_line_rounds,aa_line_limit,aa_line_distance,aa_cover_phase,aa_cover_count,aa_cover_peeks,aa_cover_returns,aa_position_exits,aa_position_safety,aa_position_checks,aa_fire_bursts,aa_fusion_releases,aa_fusion_aborts,Controls.fire_primary_state);
        EM_ASM(Module.autoLevel=({version:32,pitch:$0,cruising:!!$1,door:$2});,aa_cruise_pitch,!attacking&&!watching&&door<0&&flare_door<0,flare_door);
        EM_ASM(Module.autoSlide=({active:!!$0,count:$1,requested:$2,forward:$3});,aa_sliding,aa_slide_count,aa_drive_intent,travel_facing);
        EM_ASM(Module.autoLane=({reason:$0,blockedFor:$1});,aa_lane_reason,aa_lane_since?(double)(GameTime64-aa_lane_since)/F1_0:0);
        EM_ASM(Module.autoRecovery=({active:!!$0,count:$1,attempts:$2,stalled:$3});,escaping,aa_escape_count,aa_recover,(double)(GameTime64-aa_stuck_since)/F1_0);
        int needed=aa_object>=0&&Objects[aa_object].type==OBJ_POWERUP?(int)aa_pickup_need(&Players[Player_num],&Objects[aa_object],GameTime64):-1;
        EM_ASM(Module.autoPickup=({id:$0,need:$1,rejected:$2,deaths:$3});,needed>=0?Objects[aa_object].id:-1,needed,aa_pick_rejected,aa_deaths);
        EM_ASM(Module.autoTactics=({version:58,incoming:$0,impactIn:$1,dodging:!!$2,dodges:$3,boosting:!!$4,bursts:$5,gazeChanges:$6,viewDepth:$7,reacting:!!$8,charge:$9,boostSeconds:$10,evadeSeconds:$11});,
            aa_incoming,aa_incoming_time,aa_evading,aa_dodges,Controls.afterburner_state,aa_bursts,aa_gaze_changes,aa_view_depth(ConsoleObject->orient.fvec),aa_reaction,f2fl(Players[Player_num].afterburner_charge),aa_boost_seconds,aa_evade_seconds);
        aa_status_next=GameTime64+F1_0/3;
    }
}
void astra_auto_pickup_result(object *o,int useful){
    if(!astra_auto_enabled())return;
    if(useful){aa_collects++;aa_next=0;}
    else if(o->type==OBJ_POWERUP)aa_skip_pickup(o-Objects,20);
}
