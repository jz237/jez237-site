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
static int aa_level=-999,aa_segment=-1,aa_goal=-1,aa_object=-1,aa_wall=-1,aa_mode;
static int aa_dist[MAX_SEGMENTS],aa_parent[MAX_SEGMENTS],aa_queue[MAX_SEGMENTS],aa_visits[MAX_SEGMENTS];
static fix64 aa_ignore[MAX_OBJECTS],aa_wall_seen[MAX_WALLS],aa_next,aa_stuck_since,aa_level_since,aa_dead_since,aa_status_next;
static vms_vector aa_last;
static fix64 aa_weapon_next,aa_weapon_used[10],aa_missile_next,aa_missile_ready;
static int aa_missile_turn,aa_pending_missile=-1;
static float aa_facing_velocity;
static fix64 aa_attack_until[MAX_OBJECTS];
static int aa_attack_signature[MAX_OBJECTS],aa_recent_attacker=-1,aa_retaliations,aa_combat_target=-1,aa_combat_signature;
static int aa_arsenal_signature=-1,aa_showcase_turn;
static int aa_hostile(int i){return i>=0&&i<=Highest_object_index&&Objects[i].type==OBJ_ROBOT&&!(Objects[i].flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING))&&!Robot_info[Objects[i].id].companion;}
void astra_auto_attacked(object *o){
    if(!astra_auto_enabled()||!o)return;
    if(o->type==OBJ_WEAPON){int parent=o->ctype.laser_info.parent_num;if(!aa_hostile(parent)||Objects[parent].signature!=o->ctype.laser_info.parent_signature)return;o=&Objects[parent];}
    int i=o-Objects;if(!aa_hostile(i))return;
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
    segment *s=&Segments[seg];if(s->children[side]<0)return 0;
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
static float aa_need(int id){
    player *p=&Players[Player_num];
    if(id==POW_ENERGY)return p->energy<i2f(160)?(p->energy<i2f(35)?230:60):0;
    if(id==POW_SHIELD_BOOST)return p->shields<i2f(160)?(p->shields<i2f(60)?280:80):0;
    if(id>=POW_KEY_BLUE&&id<=POW_KEY_GOLD)return p->flags&(2<<(id-POW_KEY_BLUE))?0:210;
    if(id==POW_LASER)return p->laser_level<3?100:0;
    if(id==POW_SUPER_LASER)return p->laser_level<5?140:0;
    if(id==POW_QUAD_FIRE)return p->flags&PLAYER_FLAGS_QUAD_LASERS?0:130;
    if(id==POW_EXTRA_LIFE)return 100;
    if(id==POW_VULCAN_AMMO)return p->primary_ammo[VULCAN_INDEX]<VULCAN_AMMO_MAX?55:0;
    for(int w=1;w<MAX_PRIMARY_WEAPONS;w++)if(Primary_weapon_to_powerup[w]==id)return p->primary_weapon_flags&(1<<w)?(p->energy<i2f(150)?20:0):125;
    int flag=0;
    switch(id){
      case POW_FULL_MAP:flag=PLAYER_FLAGS_MAP_ALL;break;
      case POW_CONVERTER:flag=PLAYER_FLAGS_CONVERTER;break;
      case POW_AMMO_RACK:flag=PLAYER_FLAGS_AMMO_RACK;break;
      case POW_AFTERBURNER:flag=PLAYER_FLAGS_AFTERBURNER;break;
      case POW_HEADLIGHT:flag=PLAYER_FLAGS_HEADLIGHT;break;
      case POW_CLOAK:flag=PLAYER_FLAGS_CLOAKED;break;
      case POW_INVULNERABILITY:flag=PLAYER_FLAGS_INVULNERABLE;break;
    }
    if(flag)return p->flags&flag?0:95;
    if(id>=POW_FLAG_BLUE)return 0;
    return 40;
}
static void aa_plan(void){
    aa_graph();float best=-1;aa_goal=-1;aa_object=-1;aa_wall=-1;aa_mode=0;
    for(int i=0;i<=Highest_object_index;i++){
        object *o=&Objects[i];int seg=o->segnum;
        if(seg<0||seg>Highest_segment_index||aa_dist[seg]<0||o->flags&OF_SHOULD_BE_DEAD||aa_ignore[i]>GameTime64)continue;
        float weight=0;
        if(o->type==OBJ_POWERUP)weight=aa_need(o->id);
        if(o->type==OBJ_HOSTAGE)weight=65;
        if(o->type==OBJ_ROBOT&&!Robot_info[o->id].companion)weight=aa_threat(i)?650:85;
        if(o->type==OBJ_CNTRLCEN&&!Control_center_destroyed)weight=GameTime64-aa_level_since>i2f(180)?120:45;
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
    aa_next=GameTime64+F1_0/2;
}
static void aa_move(vms_vector target,float speed){
    object *ship=ConsoleObject;vms_vector delta;vm_vec_sub(&delta,&target,&ship->pos);
    float distance=f2fl(vm_vec_mag(&delta));if(distance>.01f)vm_vec_normalize(&delta);
    /* Brake and face the waypoint before accelerating. Lateral thrust only
     * damps drift and makes small portal-centering corrections. */
    float facing=f2fl(vm_vec_dot(&delta,&ship->orient.fvec));
    float aligned=aa_clamp((facing-.74f)/.245f,0,1);
    float desired=fminf(speed,sqrtf(90*fmaxf(0,distance-1)))*aligned;
    float actual_speed=f2fl(vm_vec_mag(&ship->mtype.phys_info.velocity));
    if(actual_speed>18 && f2fl(vm_vec_dot(&ship->mtype.phys_info.velocity,&ship->orient.fvec))<actual_speed*.65f)desired=0;
    vms_vector dirs[3]={ship->orient.rvec,ship->orient.uvec,ship->orient.fvec};
    fix *output[3]={&Controls.sideways_thrust_time,&Controls.vertical_thrust_time,&Controls.forward_thrust_time};
    for(int k=0;k<3;k++){
        float goal=k==2?desired:f2fl(vm_vec_dot(&delta,&dirs[k]))*desired*.38f;
        float velocity=f2fl(vm_vec_dot(&ship->mtype.phys_info.velocity,&dirs[k]));
        float drag=f2fl(ship->mtype.phys_info.drag),mass=f2fl(ship->mtype.phys_info.mass);
        float hold=goal*mass*drag/fmaxf(.01f,(1-drag)*f2fl(Player_ship->max_thrust));
        *output[k]=fl2f(aa_clamp(hold+(goal-velocity)*.14f,-1,1)*f2fl(FrameTime));
    }
}
static float aa_aim(vms_vector target){
    object *ship=ConsoleObject;vms_vector d;vm_vec_sub(&d,&target,&ship->pos);vm_vec_normalize(&d);
    float x=f2fl(vm_vec_dot(&d,&ship->orient.rvec)),y=f2fl(vm_vec_dot(&d,&ship->orient.uvec)),z=f2fl(vm_vec_dot(&d,&ship->orient.fvec));
    float target_alignment=z;
    /* Keep looking along existing forward motion while braking into a sharp
     * turn. Once slow, turn on the spot, then accelerate along the new course. */
    vms_vector travel=ship->mtype.phys_info.velocity;
    fix motion=vm_vec_mag(&travel),ahead=vm_vec_dot(&travel,&ship->orient.fvec);
    if(motion>i2f(22) && (z<.55f||ahead<fixmul(motion,fl2f(.65f))) && ahead>0){
        vm_vec_normalize(&travel);x=f2fl(vm_vec_dot(&travel,&ship->orient.rvec));y=f2fl(vm_vec_dot(&travel,&ship->orient.uvec));z=f2fl(vm_vec_dot(&travel,&ship->orient.fvec));
    }
    float yaw=atan2f(x,z),pitch=-atan2f(y,sqrtf(x*x+z*z));
    Controls.heading_time=fl2f(aa_clamp(yaw*1.7f-f2fl(ship->mtype.phys_info.rotvel.y)*3.4f,-1,1)*f2fl(FrameTime));
    Controls.pitch_time=fl2f(aa_clamp(pitch*1.7f-f2fl(ship->mtype.phys_info.rotvel.x)*3.4f,-1,1)*f2fl(FrameTime));
    Controls.bank_time=fl2f(-f2fl(ship->mtype.phys_info.rotvel.z)*2*f2fl(FrameTime));
    return target_alignment;
}
void astra_auto_frame(void){
    if(!astra_auto_enabled()||!ConsoleObject)return;
    memset(&Controls,0,sizeof Controls);
    if(Player_is_dead){
        aa_pending_missile=-1;aa_weapon_next=aa_missile_next=0;
        if(!aa_dead_since){aa_dead_since=GameTime64;aa_deaths++;}
        if(Player_exploded&&GameTime64-aa_dead_since>i2f(11))Death_sequence_aborted=1;
        EM_ASM(window.astraAutoStatus?.("Ship lost - relaunching",$0,$1,$2,$3);,aa_seen,aa_deaths,aa_kills,aa_collects);
        return;
    }
    if(aa_dead_since){aa_arsenal_signature=-1;aa_combat_target=-1;aa_next=0;}
    aa_dead_since=0;if(Endlevel_sequence)return;
    if(aa_level!=Current_level_num){
        aa_weapon_next=aa_missile_next=0;aa_pending_missile=-1;memset(aa_weapon_used,0,sizeof aa_weapon_used);
        aa_arsenal_signature=-1;aa_recent_attacker=aa_combat_target=-1;memset(aa_attack_until,0,sizeof aa_attack_until);
        aa_level=Current_level_num;aa_level_since=GameTime64;aa_next=aa_status_next=0;aa_segment=-1;aa_seen=0;
        memset(aa_visits,0,sizeof aa_visits);memset(aa_ignore,0,sizeof aa_ignore);memset(aa_wall_seen,0,sizeof aa_wall_seen);
        aa_last=ConsoleObject->pos;aa_stuck_since=GameTime64;
    }
    aa_demo_arsenal();aa_sense_fire();
    int seg=ConsoleObject->segnum;
    if(seg!=aa_segment){if(!aa_visits[seg])aa_seen++;aa_visits[seg]++;aa_segment=seg;aa_next=0;}
    if(GameTime64>=aa_next||aa_goal<0)aa_plan();
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
    /* Look through several open portals instead of stopping at every room.
     * A swept ship-radius ray keeps the shortcut inside the actual mine. */
    if(door<0 && aa_goal>=0 && seg!=aa_goal){
        int path[MAX_SEGMENTS],count=0,at=aa_goal;
        while(at>=0&&at!=seg&&count<MAX_SEGMENTS){path[count++]=at;at=aa_parent[at];}
        int from=seg;
        if(at==seg)for(int p=count-1;p>=0&&p>=count-4;p--){
            int next=path[p],side=-1;for(int j=0;j<6;j++)if(Segments[from].children[j]==next){side=j;break;}
            if(side<0||!(WALL_IS_DOORWAY(&Segments[from],side)&WID_FLY_FLAG))break;
            vms_vector candidate;compute_segment_center(&candidate,&Segments[next]);
            if(aa_len(&candidate,&ConsoleObject->pos)>95||!aa_visible(&candidate,ConsoleObject->size))break;
            target=candidate;from=next;
        }
    }
    if(aa_object>=0 && seg==aa_goal && aa_mode==1 && aa_len(&target,&ConsoleObject->pos)<f2fl(ConsoleObject->size)*.65f){
        aa_ignore[aa_object]=GameTime64+i2f(18);aa_next=0;
    }
    if(aa_wall>=0 && seg==aa_goal && aa_mode==4 && aa_len(&target,&ConsoleObject->pos)<10){aa_wall_seen[aa_wall]=GameTime64+i2f(35);}
    /* Aim at the closest visible threat; the guide-bot is never a target. */
    int enemy=-1;float threat=0;
    for(int i=0;i<=Highest_object_index;i++){
        object *o=&Objects[i];if(o->type!=OBJ_ROBOT&&o->type!=OBJ_CNTRLCEN)continue;
        if(o->flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING))continue;
        if(o->type==OBJ_ROBOT&&Robot_info[o->id].companion)continue;
        float d=aa_len(&o->pos,&ConsoleObject->pos);if(d>210||!aa_visible(&o->pos,0))continue;
        float s=(aa_threat(i)?12.f:o->type==OBJ_CNTRLCEN?.65f:1.f)/(d+24);
        if(i==aa_combat_target&&o->signature==aa_combat_signature)s*=1.5f;
        if(s>threat){threat=s;enemy=i;}
    }
    aa_combat_target=enemy;if(enemy>=0)aa_combat_signature=Objects[enemy].signature;
    float speed=Control_center_destroyed?58:52;
    vms_vector aim=target;int attacking=0;
    if(door>=0){compute_center_point_on_side(&aim,&Segments[Walls[door].segnum],Walls[door].sidenum);aa_mode=6;}
    /* Supplies and an open escape route outrank chasing a threat. Attack runs
     * face the enemy and stop at standoff distance; there is no sideways orbit. */
    if(enemy>=0 && !Control_center_destroyed){
        object *foe=&Objects[enemy];aim=foe->pos;attacking=1;door=-1;
        float distance=aa_len(&aim,&ConsoleObject->pos);
        int wi=Primary_weapon_to_weapon_info[Players[Player_num].primary_weapon];
        float projectile_speed=fmaxf(55,f2fl(Weapon_info[wi].speed[Difficulty_level]));
        if(foe->movement_type==MT_PHYSICS)vm_vec_scale_add2(&aim,&foe->mtype.phys_info.velocity,fl2f(fminf(.42f,distance/projectile_speed)));
        target=aim;speed=aa_clamp((distance-22)*1.6f,0,42);aa_mode=3;
        if(distance<19){
            /* A close attacker calls for a forward escape into open room,
             * then a new attack run, rather than a prolonged reverse strafe. */
            vms_vector escape;compute_segment_center(&escape,&Segments[seg]);
            if(aa_len(&escape,&ConsoleObject->pos)>12 && aa_len(&escape,&foe->pos)>distance+8 && aa_visible(&escape,ConsoleObject->size)){
                target=aim=escape;speed=36;attacking=0;aa_mode=7;
            }
        }
    }
    aa_move(target,speed);float alignment=aa_aim(aim);
    if(attacking||door>=0||(aa_wall>=0&&seg==aa_goal&&aa_mode==4)){
        if(alignment>.970f){
            float distance=enemy>=0?aa_len(&Objects[enemy].pos,&ConsoleObject->pos):40;
            if(GameTime64>=aa_weapon_next||player_has_weapon(Player_num,Players[Player_num].primary_weapon,0)!=HAS_ALL){
                int selected=LASER_INDEX;float best=-1;
                for(int w=0;w<MAX_PRIMARY_WEAPONS;w++){
                    if(w==SUPER_LASER_INDEX||player_has_weapon(Player_num,w,0)!=HAS_ALL)continue;
                    if(w==OMEGA_INDEX&&distance>65)continue;
                    if(w==FUSION_INDEX&&(distance<28||Players[Player_num].energy<i2f(35)))continue;
                    float score=1;
                    if(w==GAUSS_INDEX||w==VULCAN_INDEX)score+=distance>65?.75f:.15f;
                    if(w==HELIX_INDEX||w==SPREADFIRE_INDEX)score+=distance<55?.65f:.05f;
                    if(w==PLASMA_INDEX||w==PHOENIX_INDEX)score+=distance<90?.40f:.10f;
                    if(w==OMEGA_INDEX)score+=distance<48?.6f:0;
                    if(w==FUSION_INDEX)score+=enemy>=0&&Objects[enemy].shields>i2f(80)?.8f:.1f;
                    if(Players[Player_num].energy<i2f(30))score+=(w==GAUSS_INDEX||w==VULCAN_INDEX)?.9f:-.2f;
                    /* Recent use loses priority, allowing each suitable owned
                     * weapon a turn without switching every simulation frame. */
                    if(aa_weapon_used[w])score-=1.1f*aa_clamp(1-(double)(GameTime64-aa_weapon_used[w])/(F1_0*32),0,1);
                    if(score>best){best=score;selected=w;}
                }
                if(EM_ASM_INT(return !!Module.demoArsenal)){
                    static const int tour[]={LASER_INDEX,VULCAN_INDEX,SPREADFIRE_INDEX,PLASMA_INDEX,GAUSS_INDEX,HELIX_INDEX,PHOENIX_INDEX,OMEGA_INDEX,FUSION_INDEX};
                    for(int k=0;k<9;k++){int w=tour[(aa_showcase_turn+k)%9];
                        if(player_has_weapon(Player_num,w,0)!=HAS_ALL||(w==OMEGA_INDEX&&distance>65)||(w==FUSION_INDEX&&distance<28))continue;
                        selected=w;aa_showcase_turn=(aa_showcase_turn+k+1)%9;break;
                    }
                }
                if(Players[Player_num].primary_weapon!=selected)select_weapon(selected,0,0,1);
                aa_weapon_used[selected]=GameTime64;aa_weapon_next=GameTime64+i2f(4);
            }
            Controls.fire_primary_state=Players[Player_num].primary_weapon!=FUSION_INDEX || (GameTime64%(F1_0*3/2))<F1_0;
            if(attacking&&distance>42&&alignment>.988f&&aa_pending_missile<0&&GameTime64>=aa_missile_next){
                const int order[]={HOMING_INDEX,SMISSILE4_INDEX,CONCUSSION_INDEX,SMISSILE1_INDEX,SMART_INDEX,MEGA_INDEX,SMISSILE5_INDEX};
                for(int m=0;m<7;m++){
                    int w=order[(m+aa_missile_turn)%7];
                    if(!Players[Player_num].secondary_ammo[w]||((w==SMART_INDEX||w==MEGA_INDEX||w==SMISSILE5_INDEX)&&distance<85))continue;
                    if(Players[Player_num].secondary_weapon!=w)select_weapon(w,1,0,1);
                    aa_pending_missile=w;aa_missile_ready=GameTime64+F1_0*11/10;aa_missile_turn=(m+aa_missile_turn+1)%7;break;
                }
            }
            int pending_heavy=aa_pending_missile==SMART_INDEX||aa_pending_missile==MEGA_INDEX||aa_pending_missile==SMISSILE5_INDEX;
            if(aa_pending_missile>=0 && GameTime64>=aa_missile_ready && attacking && distance>(pending_heavy?85:42) && alignment>.988f){
                if(Players[Player_num].secondary_weapon==aa_pending_missile)Controls.fire_secondary_state=1;
                aa_pending_missile=-1;aa_missile_next=GameTime64+F1_0*5/2;
            }
        }
    }
    if(Players[Player_num].flags&PLAYER_FLAGS_CONVERTER && Players[Player_num].shields<i2f(80)&&Players[Player_num].energy>i2f(130))Controls.energy_to_shield_state=1;
    if(aa_len(&aa_last,&ConsoleObject->pos)>3){aa_last=ConsoleObject->pos;aa_stuck_since=GameTime64;aa_recover=0;}
    else if(GameTime64-aa_stuck_since>i2f(4)&&enemy<0){
        /* Stop, turn toward clearance, and leave facing the route. */
        vms_vector center;compute_segment_center(&center,&Segments[seg]);aa_aim(center);aa_move(center,14);
        aa_mode=7;
        if(GameTime64-aa_stuck_since>i2f(6)){
            if(aa_object>=0)aa_ignore[aa_object]=GameTime64+i2f(25);
            aa_next=0;aa_stuck_since=GameTime64;aa_recover++;
        }
    }
    extern void do_weapon_n_item_stuff(void);do_weapon_n_item_stuff();
    if(GameTime64>aa_status_next){
        static const char *labels[]={"Exploring the mine","Collecting supplies","Rescuing hostages","Engaging hostile","Activating switch","Escaping to exit","Opening door","Finding clearance"};
        aa_kills=Players[Player_num].num_kills_total;
        vms_vector travel=ConsoleObject->mtype.phys_info.velocity;float velocity=f2fl(vm_vec_mag(&travel));
        aa_facing_velocity=velocity>.05f?f2fl(vm_vec_dot(&travel,&ConsoleObject->orient.fvec))/velocity:1;
        EM_ASM(Module.autoFlight=({speed:$0,forward:$1,primary:$2,secondary:$3,energy:$4,shields:$5,version:11});,velocity,aa_facing_velocity,Players[Player_num].primary_weapon,Players[Player_num].secondary_weapon,f2fl(Players[Player_num].energy),f2fl(Players[Player_num].shields));
        EM_ASM({window.astraAutoStatus?.(UTF8ToString($0),$1,$2,$3,$4);Module.autoTelemetry=({segment:$5,goal:$6,object:$7,enemy:$8,mode:$9,x:$10,y:$11,z:$12});},enemy>=0&&aa_threat(enemy)?"Returning fire":labels[aa_mode],aa_seen,aa_deaths,aa_kills,aa_collects,seg,aa_goal,aa_object,enemy,aa_mode,f2fl(ConsoleObject->pos.x),f2fl(ConsoleObject->pos.y),f2fl(ConsoleObject->pos.z));
        EM_ASM(Module.autoCombat=({attacker:$0,target:$1,retaliating:!!$2,retaliations:$3,cruise:52,arsenal:!!Module.demoArsenal});,aa_recent_attacker,enemy,enemy>=0&&aa_threat(enemy),aa_retaliations);
        aa_status_next=GameTime64+F1_0/3;
    }
}
void astra_auto_collected(void){if(astra_auto_enabled())aa_collects++;}
