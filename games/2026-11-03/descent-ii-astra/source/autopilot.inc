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
static int aa_recover,aa_seen,aa_deaths,aa_kills,aa_collects;
static float aa_clamp(float x,float a,float b){return fminf(b,fmaxf(a,x));}
static float aa_len(vms_vector *a,vms_vector *b){return f2fl(vm_vec_dist_quick(a,b));}
static int aa_visible(vms_vector *p,fix radius){
    fvi_query q={&ConsoleObject->pos,p,ConsoleObject->segnum,radius,ConsoleObject-Objects,NULL,0};
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
        if(o->type==OBJ_ROBOT&&!Robot_info[o->id].companion)weight=42;
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
    float desired=fminf(speed,distance*2.4f);
    vms_vector dirs[3]={ship->orient.rvec,ship->orient.uvec,ship->orient.fvec};
    fix *output[3]={&Controls.sideways_thrust_time,&Controls.vertical_thrust_time,&Controls.forward_thrust_time};
    for(int k=0;k<3;k++){
        float goal=f2fl(vm_vec_dot(&delta,&dirs[k]))*desired;
        float velocity=f2fl(vm_vec_dot(&ship->mtype.phys_info.velocity,&dirs[k]));
        *output[k]=fl2f(aa_clamp((goal-velocity)*.085f,-1,1)*f2fl(FrameTime));
    }
}
static float aa_aim(vms_vector target){
    object *ship=ConsoleObject;vms_vector d;vm_vec_sub(&d,&target,&ship->pos);vm_vec_normalize(&d);
    float x=f2fl(vm_vec_dot(&d,&ship->orient.rvec)),y=f2fl(vm_vec_dot(&d,&ship->orient.uvec)),z=f2fl(vm_vec_dot(&d,&ship->orient.fvec));
    float yaw=atan2f(x,z),pitch=-atan2f(y,sqrtf(x*x+z*z));
    Controls.heading_time=fl2f(aa_clamp(yaw*.85f-f2fl(ship->mtype.phys_info.rotvel.y)*3.8f,-.70f,.70f)*f2fl(FrameTime));
    Controls.pitch_time=fl2f(aa_clamp(pitch*.85f-f2fl(ship->mtype.phys_info.rotvel.x)*3.8f,-.65f,.65f)*f2fl(FrameTime));
    Controls.bank_time=fl2f(-f2fl(ship->mtype.phys_info.rotvel.z)*2*f2fl(FrameTime));
    return z;
}
void astra_auto_frame(void){
    if(!astra_auto_enabled()||!ConsoleObject)return;
    memset(&Controls,0,sizeof Controls);
    if(Player_is_dead){
        if(!aa_dead_since){aa_dead_since=GameTime64;aa_deaths++;}
        if(Player_exploded&&GameTime64-aa_dead_since>i2f(11))Death_sequence_aborted=1;
        EM_ASM(window.astraAutoStatus?.("Ship lost - relaunching",$0,$1,$2,$3);,aa_seen,aa_deaths,aa_kills,aa_collects);
        return;
    }
    aa_dead_since=0;if(Endlevel_sequence)return;
    if(aa_level!=Current_level_num){
        aa_level=Current_level_num;aa_level_since=GameTime64;aa_next=aa_status_next=0;aa_segment=-1;aa_seen=0;
        memset(aa_visits,0,sizeof aa_visits);memset(aa_ignore,0,sizeof aa_ignore);memset(aa_wall_seen,0,sizeof aa_wall_seen);
        aa_last=ConsoleObject->pos;aa_stuck_since=GameTime64;
    }
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
        float d=aa_len(&o->pos,&ConsoleObject->pos);if(d>155||!aa_visible(&o->pos,0))continue;
        float s=(o->type==OBJ_CNTRLCEN?.65f:1.f)/(d+8);
        if(s>threat){threat=s;enemy=i;}
    }
    float speed=Control_center_destroyed?43:32;
    aa_move(target,speed);vms_vector aim=target;
    if(door>=0){
        compute_center_point_on_side(&aim,&Segments[Walls[door].segnum],Walls[door].sidenum);
        aa_mode=6;
    }
    if(enemy>=0){
        object *foe=&Objects[enemy];aim=foe->pos;
        float distance=aa_len(&aim,&ConsoleObject->pos);
        if(foe->movement_type==MT_PHYSICS)vm_vec_scale_add2(&aim,&foe->mtype.phys_info.velocity,fl2f(fminf(.65f,distance/140.f)));
        if(!Control_center_destroyed && Players[Player_num].shields>i2f(35) && Players[Player_num].energy>i2f(12)){
            vms_vector away;vm_vec_sub(&away,&ConsoleObject->pos,&foe->pos);vm_vec_normalize(&away);
            vms_vector move;vm_vec_scale_add(&move,&foe->pos,&away,i2f(40));
            vm_vec_scale_add2(&move,&ConsoleObject->orient.rvec,fl2f(sinf(f2fl((fix)GameTime64)*1.1f)*12));
            if(aa_visible(&move,ConsoleObject->size))aa_move(move,26);
        }
        aa_mode=3;
    }
    float alignment=aa_aim(aim);
    if(enemy>=0||door>=0||(aa_wall>=0&&seg==aa_goal&&aa_mode==4)){
        if(alignment>.965f){
            static const int choice[]={GAUSS_INDEX,PLASMA_INDEX,HELIX_INDEX,SPREADFIRE_INDEX,VULCAN_INDEX,LASER_INDEX};
            for(int k=0;k<6;k++)if(player_has_weapon(Player_num,choice[k],0)==HAS_ALL){
                if(Players[Player_num].primary_weapon!=choice[k])select_weapon(choice[k],0,0,1);break;
            }
            Controls.fire_primary_state=1;
            if(enemy>=0&&aa_len(&Objects[enemy].pos,&ConsoleObject->pos)>40&&alignment>.985f){
                const int ammo_order[]={HOMING_INDEX,SMISSILE4_INDEX,CONCUSSION_INDEX,SMISSILE1_INDEX};
                int missile=-1;for(int m=0;m<4;m++)if(Players[Player_num].secondary_ammo[ammo_order[m]]){missile=ammo_order[m];break;}
                if(missile>=0){
                    if(Players[Player_num].secondary_weapon!=missile)select_weapon(missile,1,0,1);
                    Controls.fire_secondary_state=1;
                }
            }
        }
    }
    if(Players[Player_num].flags&PLAYER_FLAGS_CONVERTER && Players[Player_num].shields<i2f(80)&&Players[Player_num].energy>i2f(130))Controls.energy_to_shield_state=1;
    /* A short lateral dodge against incoming robot fire, through normal thrust. */
    for(int i=0;i<=Highest_object_index;i++){
        object *shot=&Objects[i];
        if(shot->type!=OBJ_WEAPON || shot->ctype.laser_info.parent_type==OBJ_PLAYER || shot->movement_type!=MT_PHYSICS)continue;
        vms_vector to_ship;vm_vec_sub(&to_ship,&ConsoleObject->pos,&shot->pos);
        if(vm_vec_mag_quick(&to_ship)>i2f(24)||vm_vec_dot(&to_ship,&shot->mtype.phys_info.velocity)<=0)continue;
        fix side=vm_vec_dot(&to_ship,&ConsoleObject->orient.rvec);
        Controls.sideways_thrust_time=side>=0?FrameTime:-FrameTime;break;
    }
    if(aa_len(&aa_last,&ConsoleObject->pos)>3){aa_last=ConsoleObject->pos;aa_stuck_since=GameTime64;aa_recover=0;}
    else if(GameTime64-aa_stuck_since>i2f(4)&&enemy<0){
        /* Back away and slide toward the segment centre; no relocation. */
        vms_vector center;compute_segment_center(&center,&Segments[seg]);aa_move(center,18);
        Controls.forward_thrust_time=-FrameTime/2;Controls.sideways_thrust_time=(aa_recover&1)?FrameTime/2:-FrameTime/2;
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
        EM_ASM({window.astraAutoStatus?.(UTF8ToString($0),$1,$2,$3,$4);Module.autoTelemetry=({segment:$5,goal:$6,object:$7,enemy:$8,mode:$9,x:$10,y:$11,z:$12});},labels[aa_mode],aa_seen,aa_deaths,aa_kills,aa_collects,seg,aa_goal,aa_object,enemy,aa_mode,f2fl(ConsoleObject->pos.x),f2fl(ConsoleObject->pos.y),f2fl(ConsoleObject->pos.z));
        aa_status_next=GameTime64+F1_0/3;
    }
}
void astra_auto_collected(void){if(astra_auto_enabled())aa_collects++;}
