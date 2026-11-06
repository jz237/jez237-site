/* Overload-only attack rhythms. D2 navigation, projectiles and collisions remain
 * authoritative. No target knowledge, firing or blink travel through walls. */
typedef struct {int signature,phase,volley,visible;fix64 charge,ready,probe,blink;float glow;} ot_state;
static ot_state ot_states[MAX_OBJECTS];
static void astra_d2_tactics_reset(void);
void astra_ov_tactics_reset(void){memset(ot_states,0,sizeof ot_states);astra_d2_tactics_reset();}
static ot_state *ot_get(object *o){ot_state *s=&ot_states[o-Objects];if(s->signature!=o->signature){memset(s,0,sizeof *s);s->signature=o->signature;s->ready=GameTime64+F1_0/2;}return s;}
static int ot_enabled(object *o){extern int astra_ov_enabled(void);return astra_ov_enabled()&&o->type==OBJ_ROBOT&&o->id<25&&o->control_type==CT_AI&&!(o->flags&(OF_EXPLODING|OF_SHOULD_BE_DEAD))&&!Player_is_dead;}
static int ot_clear(object *o,vms_vector *from,vms_vector *to,fix radius){
    int room=find_point_seg(from,o->segnum);if(room<0)return 0;
    fvi_query query={0};fvi_info hit;query.p0=from;query.p1=to;query.startseg=room;query.rad=radius;query.thisobjnum=o-Objects;query.flags=0;
    return find_vector_intersection(&query,&hit)==HIT_NONE;
}
static int ot_phase(object *o){if(o->id<19||o->id>21)return 0;float health=f2fl(o->shields)/fmaxf(1,f2fl(Robot_info[o->id].strength));return health<.32?2:health<.66?1:0;}
float astra_ov_telegraph(object *o){if(!ot_enabled(o))return 0;ot_state *s=ot_get(o);return s->charge?s->glow:0;}
static int astra_ov_fire(object *o,vms_vector *gun,int gun_num){
    if(!ot_enabled(o))return 0;
    ot_state *s=ot_get(o);ai_local *ai=&Ai_local_info[o-Objects];int id=o->id,boss=id>=19&&id<=21,phase=ot_phase(o);
    ai->next_fire=F1_0/20;ai->next_fire2=F1_0/20;
    if(Players[Player_num].flags&PLAYER_FLAGS_CLOAKED||!ot_clear(o,&o->pos,gun,0)||!ot_clear(o,gun,&ConsoleObject->pos,0)){s->charge=0;s->glow=0;return 1;}
    if(GameTime64<s->ready)return 1;
    float windup=boss?.9f-phase*.12f:(id==6||id==7||id==13||id==14)?.65f:(id==15||id==16)?.45f:.26f;
    if(!s->charge){s->charge=GameTime64?GameTime64:1;s->phase=phase;}
    s->glow=fminf(1,(float)(GameTime64-s->charge)/fl2f(windup));
    if(s->glow<1)return 1;
    vms_vector aim;vm_vec_normalized_dir_quick(&aim,&ConsoleObject->pos,gun);
    if(vm_vec_dot(&aim,&o->orient.fvec)<fl2f(.65))return 1;
    int count=boss?3+phase:(id==6||id==7)?3:(id==2||id==3)?2:1;
    int weapon=Robot_info[id].weapon_type;
    int style=boss?(id-19)%3:0;
    if(boss&&style==2&&s->volley%3==2){weapon=15;count=2;}
    for(int shot=0;shot<count;shot++){
        vms_vector direction=aim;float offset=(shot-(count-1)*.5f)*(boss?.10f:.055f);
        vm_vec_scale_add2(&direction,style==1&&s->volley%2?&o->orient.uvec:&o->orient.rvec,fl2f(offset));vm_vec_normalize(&direction);
        Laser_create_new_easy(&direction,gun,o-Objects,weapon,1);
    }
    s->volley++;s->charge=0;s->glow=0;
    float delay=boss?(style==0?1.45f:style==1?.95f:1.7f)-phase*.18f:fmaxf(.28f,f2fl(Robot_info[id].firing_wait[Difficulty_level]));
    if(id==2||id==3){vms_vector recoil=aim;vm_vec_scale(&recoil,-i2f(12));vm_vec_add2(&o->mtype.phys_info.velocity,&recoil);}
    s->ready=GameTime64+fl2f(delay);ai->next_fire=fl2f(delay);ai->next_fire2=fl2f(delay);
    EM_ASM(Module.overloadTacticsShots=(Module.overloadTacticsShots||0)+$0;Module.overloadLastAttack=({type:$1,phase:$2,style:$3});,count,id,phase,style);
    return 1;
}
void astra_ov_tactics_frame(object *o){
    if(!ot_enabled(o))return;ot_state *s=ot_get(o);
    fix distance=vm_vec_dist_quick(&o->pos,&ConsoleObject->pos);if(distance>i2f(260)){s->charge=0;s->glow=0;return;}
    if(GameTime64>=s->probe){s->visible=!(Players[Player_num].flags&PLAYER_FLAGS_CLOAKED)&&ot_clear(o,&o->pos,&ConsoleObject->pos,0);s->probe=GameTime64+F1_0/5;}
    if(!s->visible){s->charge=0;s->glow=0;return;}
    int id=o->id;float speed=f2fl(Robot_info[id].max_speed[Difficulty_level]);
    if(id==13||id==14)return; /* authored stationary sentries */
    if(s->charge){vm_vec_scale(&o->mtype.phys_info.velocity,fl2f(fmaxf(.7f,1-f2fl(FrameTime)*3)));return;}
    if(id==11||id==12||id==15||id==16||id>=19){
        float side=((o->signature+s->volley/2)&1)?1:-1;
        vm_vec_scale_add2(&o->mtype.phys_info.velocity,&o->orient.rvec,fl2f(side*speed*.5f*f2fl(FrameTime)));
        fix length=vm_vec_mag_quick(&o->mtype.phys_info.velocity);if(length>fl2f(speed)&&length>0)vm_vec_scale(&o->mtype.phys_info.velocity,fixdiv(fl2f(speed),length));
    }
    if((id==17||id==18)&&GameTime64>s->blink&&distance<i2f(150)){
        s->blink=GameTime64+i2f(6);vms_vector destination=o->pos;vm_vec_scale_add2(&destination,&o->orient.rvec,o->size*((o->signature+s->volley)&1?3:-3));
        int room=find_point_seg(&destination,o->segnum);
        if(room>=0&&ot_clear(o,&o->pos,&destination,o->size)&&ot_clear(o,&destination,&ConsoleObject->pos,0)){
            object_create_explosion(o->segnum,&o->pos,o->size,VCLIP_MORPHING_ROBOT);
            o->pos=destination;obj_relink(o-Objects,room);object_create_explosion(room,&o->pos,o->size,VCLIP_MORPHING_ROBOT);s->ready=GameTime64+F1_0/2;
        }
    }
}

/* Original / Vertigo: warn before native volleys, retaining each robot's own
 * guns, leading, burst pattern and boss powers. Never adapt Overload type IDs. */
typedef struct {int signature,phase,volleys;fix64 charge,last,follow;float glow;} dt_state;
static dt_state dt_states[MAX_OBJECTS];
static int dt_enabled(object *o){
    extern int astra_ov_enabled(void);
    if(astra_ov_enabled()||Game_mode&GM_MULTI||Player_is_dead||o->type!=OBJ_ROBOT||o->id>=N_robot_types||o->control_type!=CT_AI||o->flags&(OF_EXPLODING|OF_SHOULD_BE_DEAD))return 0;
    robot_info *r=&Robot_info[o->id];
    return !r->companion&&!r->thief&&!r->attack_type&&!r->kamikaze&&!o->ctype.ai_info.dying_start_time&&!(r->boss_flag&&Boss_dying_start_time);
}
static dt_state *dt_get(object *o){dt_state *s=&dt_states[o-Objects];if(s->signature!=o->signature||GameTime64<s->last){memset(s,0,sizeof *s);s->signature=o->signature;}s->last=GameTime64;return s;}
static int dt_phase(object *o){
    if(!Robot_info[o->id].boss_flag)return 0;
    /* Match copy_defaults_to_robot: difficulty scales the initial boss health. */
    fix total=Robot_info[o->id].strength/(NDL+3)*(Difficulty_level+4);if(!Difficulty_level)total/=2;
    return o->shields<total/3?2:o->shields<total-total/3?1:0;
}
float astra_d2_telegraph(object *o){
    if(!o||o<Objects||o>Objects+Highest_object_index||!dt_enabled(o)||Players[Player_num].flags&PLAYER_FLAGS_CLOAKED)return 0;
    dt_state *s=dt_get(o);return s->charge&&GameTime64-s->charge<i2f(3)?s->glow:0;
}
static int astra_d2_charge(object *o,vms_vector *gun){
    if(!dt_enabled(o))return 0;
    dt_state *s=dt_get(o);ai_local *ai=&Ai_local_info[o-Objects];robot_info *r=&Robot_info[o->id];
    /* Preserve native blind-fire behaviour while cloaked; never use the actual
     * cloaked position for our warning or new targeting information. */
    if(Players[Player_num].flags&PLAYER_FLAGS_CLOAKED){s->charge=0;s->glow=0;return 0;}
    if(!ot_clear(o,&o->pos,gun,0)||!ot_clear(o,gun,&ConsoleObject->pos,0)){s->charge=0;s->glow=0;ai->next_fire=F1_0/10;ai->next_fire2=F1_0/10;return 1;}
    if(ai->rapidfire_count>0||GameTime64<s->follow)return 0;
    s->phase=dt_phase(o);
    int weapon=r->weapon_type;int heavy=weapon>=0&&weapon<N_weapon_types&&(Weapon_info[weapon].homing_flag||Weapon_info[weapon].damage_radius>i2f(8));
    float duration=r->boss_flag?.70f-s->phase*.08f:heavy?.42f:.22f;
    if(!s->charge||GameTime64-s->charge>i2f(3))s->charge=GameTime64?GameTime64:1;
    s->glow=fminf(1,(float)(GameTime64-s->charge)/fl2f(duration));
    if(s->glow<1){ai->next_fire=F1_0/40;ai->next_fire2=F1_0/40;return 1;}
    s->charge=0;s->glow=0;s->follow=GameTime64+F1_0/5;s->volleys++;return 0;
}
static void astra_d2_fired(object *o,int gun){
    if(!dt_enabled(o))return;dt_state *s=dt_get(o);ai_local *ai=&Ai_local_info[o-Objects];int phase=dt_phase(o);
    fix *delay=gun==0&&Robot_info[o->id].weapon_type2!=-1?&ai->next_fire2:&ai->next_fire;
    /* Burst spacing and projectile damage stay native. Damaged bosses press
     * more often, with a clear recovery after every third advanced volley. */
    if(phase&&*delay>F1_0/4)*delay=fixmul(*delay,fl2f(s->volleys%3==0?1.12f:1-phase*.09f));
    EM_ASM(Module.d2TacticsShots=(Module.d2TacticsShots||0)+1;Module.d2LastAttack=({type:$0,boss:!!$1,phase:$2,volley:$3,delay:$4});,o->id,Robot_info[o->id].boss_flag,phase,s->volleys,f2fl(*delay));
}

static void astra_d2_tactics_reset(void){memset(dt_states,0,sizeof dt_states);}
