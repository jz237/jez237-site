/* Host-owned AI player ships. Each has independent perception, navigation,
 * inventory and controls. Native D2 physics, collision and weapons do the work. */
extern int astra_net_active,astra_net_humans,astra_net_count,astra_net_owner,astra_net_host,astra_net_bot_skill[4];
extern int astra_net_human(int);
extern void init_player_stats_new_ship(ubyte);
extern void drop_player_eggs(object*);
typedef struct {
    int level,signature,target,target_sig,goal,last_room,door,route_side,pick,shots,missiles,pickups,stuck;
    fix64 think,seen,react,fire,missile,flare,spawn,progress,roam_until,weapon_until,contact_until,report,escape_until;
    vms_vector last,move,aim,up,contact,escape;
    float rates[3];unsigned short visits[MAX_SEGMENTS];
    fix64 blocked[MAX_SEGMENTS][6];
    fix64 ignored[MAX_OBJECTS];
} squad_pilot;
static squad_pilot sq[4];
int astra_squad_silent_pickup=0;
static int sq_handoff=0;
static int sq_command[4],sq_leader[4]={-1,-1,-1,-1},sq_focus[4]={-1,-1,-1,-1},sq_focus_sig[4];
static fix64 sq_command_until[4];
EMSCRIPTEN_KEEPALIVE int astra_squad_order(int leader,int order,float x,float y,float z){
    if(!astra_net_active||astra_net_owner!=astra_net_host||!(Game_mode&GM_MULTI_COOP)||leader<0||leader>=N_players||!astra_net_human(leader)||Players[leader].connected!=CONNECT_PLAYING||order<0||order>3)return 0;
    object *ship=&Objects[Players[leader].objnum];if(ship->type!=OBJ_PLAYER)return 0;
    vms_vector direction={fl2f(x),fl2f(y),fl2f(z)};if(order==2&&vm_vec_normalize(&direction)<F1_0/2)return 0;
    int target=-1;fix closest=fl2f(.965f);
    if(order==2)for(int i=0;i<=Highest_object_index;i++){
        object *o=&Objects[i];if(o->type!=OBJ_ROBOT||o->shields<=0||Robot_info[o->id].companion||o->flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING))continue;
        vms_vector d;fix distance=vm_vec_normalized_dir(&d,&o->pos,&ship->pos),aim=vm_vec_dot(&direction,&d);
        if(distance<i2f(200)&&aim>closest&&object_to_object_visibility(ship,o,0)){closest=aim;target=i;}
    }
    if(order==2&&target<0)return 0;
    for(int i=1;i<astra_net_count;i++)if(astra_net_bot_skill[i]>=0){sq_command[i]=order;sq_leader[i]=leader;sq_focus[i]=target;sq_focus_sig[i]=target>=0?Objects[target].signature:0;sq_command_until[i]=GameTime64+i2f(order==3?12:120);sq[i].think=0;}
    return 1;
}
void astra_squad_takeover(void){sq_handoff=1;memset(sq,0,sizeof sq);}
int astra_squad_respawn_left(int id){return sq[id].spawn?(int)max(1,min(i2f(5),sq[id].spawn-GameTime64)):0;}
static int sq_bot(int id){return astra_net_active&&id>0&&id<astra_net_count&&id<4&&astra_net_bot_skill[id]>=0;}
static int sq_owner(int id){return sq_bot(id)&&astra_net_owner==astra_net_host;}
static float sq_clamp(float x,float a,float b){return fmaxf(a,fminf(b,x));}
static float sq_distance(vms_vector *a,vms_vector *b){return f2fl(vm_vec_dist_quick(a,b));}
static float sq_need(int id,object *o){
    player *p=&Players[id];int type=o->id;
    if(sq[id].ignored[o-Objects]>GameTime64)return 0;
    if(type==POW_EXTRA_LIFE)return 0;
    if(type==POW_LASER&&p->laser_level>=MAX_LASER_LEVEL)return 0;
    if(type==POW_SUPER_LASER&&p->laser_level>=MAX_SUPER_LASER_LEVEL)return 0;
    if(type==POW_QUAD_FIRE&&(p->flags&PLAYER_FLAGS_QUAD_LASERS))return 0;
    for(int w=1;w<MAX_PRIMARY_WEAPONS;w++)if(w!=SUPER_LASER_INDEX&&w!=VULCAN_INDEX&&w!=GAUSS_INDEX&&Primary_weapon_to_powerup[w]==type&&(p->primary_weapon_flags&(1<<w)))return 0;
    int flag=type==POW_FULL_MAP?PLAYER_FLAGS_MAP_ALL:type==POW_CONVERTER?PLAYER_FLAGS_CONVERTER:type==POW_AMMO_RACK?PLAYER_FLAGS_AMMO_RACK:type==POW_AFTERBURNER?PLAYER_FLAGS_AFTERBURNER:type==POW_HEADLIGHT?PLAYER_FLAGS_HEADLIGHT:0;
    if(flag&&(p->flags&flag))return 0;
    return aa_pickup_need(p,o,GameTime64);
}
static int sq_clear(object *ship,vms_vector *point,fix radius,int target){
    fvi_query q={&ship->pos,point,ship->segnum,radius,ship-Objects,NULL,FQ_TRANSPOINT};fvi_info hit;
    if(find_vector_intersection(&q,&hit)!=HIT_NONE)return 0;
    if(target<0)return 1;
    q.flags|=FQ_CHECK_OBJS|FQ_IGNORE_POWERUPS;int r=find_vector_intersection(&q,&hit);
    return r==HIT_NONE||(r==HIT_OBJECT&&hit.hit_object==target);
}
static int sq_enemy(int id,int obj){
    if(obj<0||obj>Highest_object_index)return 0;object *o=&Objects[obj];
    if(o->flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING)||o->render_type==RT_NONE)return 0;
    if(Game_mode&GM_MULTI_COOP)return o->type==OBJ_ROBOT&&!Robot_info[o->id].companion&&!o->ctype.ai_info.CLOAKED;
    return o->type==OBJ_PLAYER&&o->id!=id&&o->id<N_players&&Players[o->id].connected==CONNECT_PLAYING&&!(Players[o->id].flags&PLAYER_FLAGS_CLOAKED);
}
static int sq_pass(int id,int room,int side){
    segment *s=&Segments[room];if(s->children[side]<0||sq[id].blocked[room][side]>GameTime64)return 0;
    if(WALL_IS_DOORWAY(s,side)&WID_FLY_FLAG)return 1;
    int w=s->sides[side].wall_num;if(w<0)return 1;wall *d=&Walls[w];
    if(d->type!=WALL_DOOR||d->flags&WALL_DOOR_LOCKED)return 0;
    return !d->keys||d->keys==KEY_NONE||(Players[id].flags&d->keys)==d->keys;
}
static int sq_parent[MAX_SEGMENTS],sq_dist[MAX_SEGMENTS],sq_queue[MAX_SEGMENTS];
static void sq_plan(int id,object *ship){
    squad_pilot *b=&sq[id];int skill=astra_net_bot_skill[id];
    b->think=GameTime64+fl2f(.12f+.035f*(4-skill));
    if(b->last_room!=ship->segnum){b->visits[ship->segnum]++;b->last_room=ship->segnum;}
    int enemy=-1;float best=1e10f;
    if(GameTime64>sq_command_until[id])sq_command[id]=0;
    if(sq_leader[id]>=0&&Players[sq_leader[id]].connected!=CONNECT_PLAYING)sq_leader[id]=-1;
    for(int i=0;i<=Highest_object_index;i++)if(sq_enemy(id,i)){
        vms_vector direction;float distance=f2fl(vm_vec_normalized_dir(&direction,&Objects[i].pos,&ship->pos));
        int marked=sq_command[id]==2&&i==sq_focus[id]&&Objects[i].signature==sq_focus_sig[id];
        if(sq_command[id]==3&&b->contact_until<GameTime64)continue;
        if(distance>170||(!marked&&sq_command[id]!=1&&vm_vec_dot(&direction,&ship->orient.fvec)<fl2f(.25f-.05f*skill))||!sq_clear(ship,&Objects[i].pos,0,i))continue;
        float cost=distance*(i==b->target?.6f:1)*(marked?.08f:1);
        if(sq_command[id]==1&&sq_leader[id]>=0)cost+=sq_distance(&Objects[i].pos,&Objects[Players[sq_leader[id]].objnum].pos)*.7f;if(cost<best){best=cost;enemy=i;}
    }
    if(enemy>=0){
        if(enemy!=b->target||b->target_sig!=Objects[enemy].signature)b->react=GameTime64+fl2f(.85f-.16f*skill);
        b->target=enemy;b->target_sig=Objects[enemy].signature;b->seen=GameTime64;b->aim=Objects[enemy].pos;
    }else if(GameTime64-b->seen>F1_0){b->target=-1;}
    for(int i=0;i<=Highest_segment_index;i++){sq_parent[i]=-1;sq_dist[i]=-1;}
    int first=0,last=0;sq_queue[last++]=ship->segnum;sq_dist[ship->segnum]=0;
    while(first<last){int r=sq_queue[first++];for(int side=0;side<6;side++){
        int child=Segments[r].children[side];if(child>=0&&sq_dist[child]<0&&sq_pass(id,r,side)){sq_parent[child]=r;sq_dist[child]=sq_dist[r]+1;sq_queue[last++]=child;}
    }}
    b->door=b->route_side=b->pick=-1;int goal=ship->segnum,follow_look=0;vms_vector end=ship->pos,follow_aim=ship->pos;float cost=1e9f;
    /* Only useful, nearby supplies: a wingman leaves the human's supplies alone
     * while healthy. Full ammunition can never trap a pilot in a pickup loop. */
    for(int i=0;i<=Highest_object_index;i++){
        object *o=&Objects[i];if(o->type!=OBJ_POWERUP||o->flags&OF_SHOULD_BE_DEAD||o->segnum<0||sq_dist[o->segnum]<0)continue;
        float need=sq_need(id,o);if(need<=0)continue;
        if((Game_mode&GM_MULTI_COOP)&&(sq_command[id]==3||(Players[id].shields>i2f(65)&&Players[id].energy>i2f(40))))continue;
        if(sq_dist[o->segnum]>6)continue;
        float score=sq_dist[o->segnum]*20+sq_distance(&o->pos,&ship->pos)*.12f-need*.15f;
        if(score<cost){cost=score;goal=o->segnum;end=o->pos;b->pick=i;}
    }
    if(cost==1e9f&&(Game_mode&GM_MULTI_COOP)){
        float near=1e9f;
        for(int p=0;p<astra_net_count;p++)if(astra_net_human(p)&&Players[p].connected==CONNECT_PLAYING&&(sq_leader[id]<0||sq_leader[id]==p)){
            object *lead=&Objects[Players[p].objnum];if(lead->type!=OBJ_PLAYER||lead->segnum<0||sq_dist[lead->segnum]<0)continue;
            float d=sq_distance(&lead->pos,&ship->pos);if(d<near){near=d;goal=lead->segnum;end=lead->pos;
                vm_vec_scale_add2(&end,&lead->orient.fvec,-i2f((sq_command[id]==1?27:13)+id*3));vm_vec_scale_add2(&end,&lead->orient.rvec,i2f((id&1?1:-1)*10));
                if(find_point_seg(&end,lead->segnum)<0)end=lead->pos;
                follow_look=near<50;vm_vec_scale_add(&follow_aim,&lead->pos,&lead->orient.fvec,i2f(90));
                if(near<18)end=ship->pos;
            }
        }
    }else if(cost==1e9f){
        if(b->goal>=0&&b->goal<=Highest_segment_index&&sq_dist[b->goal]>0&&GameTime64<b->roam_until)goal=b->goal;
        else {float score=1e9f;for(int i=0;i<last;i++){int r=sq_queue[i];if(r==ship->segnum)continue;float n=b->visits[r]*5+sq_dist[r]+((r*13+id*7)%11)*.18f;if(n<score){score=n;goal=r;}}b->roam_until=GameTime64+i2f(12);}
        compute_segment_center(&end,&Segments[goal]);
    }
    b->goal=goal;b->move=end;
    if(goal!=ship->segnum){
        int next=goal;while(sq_parent[next]>=0&&sq_parent[next]!=ship->segnum)next=sq_parent[next];
        for(int side=0;side<6;side++)if(Segments[ship->segnum].children[side]==next){
            b->route_side=side;
            vms_vector portal,center,dir;compute_center_point_on_side(&portal,&Segments[ship->segnum],side);compute_segment_center(&center,&Segments[next]);vm_vec_normalized_dir(&dir,&center,&portal);vm_vec_scale_add(&b->move,&portal,&dir,i2f(5));
            int w=Segments[ship->segnum].sides[side].wall_num;
            if(w>=0&&Walls[w].type==WALL_DOOR&&Walls[w].state!=WALL_DOOR_OPEN&&Walls[w].state!=WALL_DOOR_WAITING){b->door=w;b->move=portal;}
            if(!sq_clear(ship,&b->move,ship->size,-1)&&b->door<0)compute_segment_center(&b->move,&Segments[ship->segnum]);
            break;
        }
    }
    if(b->target<0)b->aim=follow_look&&b->door<0?follow_aim:b->move;
    if(b->contact_until>GameTime64&&enemy<0)b->aim=b->contact;
    if(sq_distance(&ship->pos,&b->last)>5){b->last=ship->pos;b->progress=GameTime64;}
    if(GameTime64-b->progress>i2f(4)&&(goal!=ship->segnum||sq_distance(&ship->pos,&b->move)>3)){
        b->stuck++;b->progress=GameTime64;b->roam_until=0;
        if(b->route_side>=0)b->blocked[ship->segnum][b->route_side]=GameTime64+i2f(8);
        if(b->pick>=0)b->ignored[b->pick]=GameTime64+i2f(15);
        compute_segment_center(&b->move,&Segments[ship->segnum]);
        if(sq_distance(&b->move,&ship->pos)<5)vm_vec_scale_add2(&b->move,&ship->orient.rvec,i2f((b->stuck&1)?8:-8));
        b->escape=b->move;b->escape_until=GameTime64+fl2f(1.2f);
    }
    if(GameTime64<b->escape_until){b->move=b->escape;b->aim=b->move;b->door=-1;}
}
static float sq_turn(object *o,squad_pilot *b,int axis,float error,float limit){
    float dt=sq_clamp(f2fl(FrameTime),0,.1f),rate=axis==0?f2fl(o->mtype.phys_info.rotvel.x):axis==1?f2fl(o->mtype.phys_info.rotvel.y):f2fl(o->mtype.phys_info.rotvel.z);
    float desired=sq_clamp(error*.45f,-limit,limit);b->rates[axis]+=sq_clamp(desired-b->rates[axis],-.35f*dt,.35f*dt);
    float drag=sq_clamp(f2fl(o->mtype.phys_info.drag)*2.5f,.01f,.9f),gain=64*(1-drag)*f2fl(Player_ship->max_rotthrust)/fmaxf(.01f,f2fl(o->mtype.phys_info.mass));
    return sq_clamp((64*drag*b->rates[axis]+(b->rates[axis]-rate)*8)/fmaxf(.01f,gain),-1,1);
}
static void sq_drive(int id,object *o){
    squad_pilot *b=&sq[id];int skill=astra_net_bot_skill[id];float dt=f2fl(FrameTime),speed=30+skill*5;
    vms_vector aim=b->aim,travel;float distance=f2fl(vm_vec_normalized_dir(&travel,&b->move,&o->pos));
    int visible=b->target>=0&&sq_enemy(id,b->target)&&Objects[b->target].signature==b->target_sig&&sq_clear(o,&Objects[b->target].pos,0,b->target);
    if(visible){
        object *foe=&Objects[b->target];aim=foe->pos;float d=sq_distance(&foe->pos,&o->pos);
        int weapon=Players[id].primary_weapon,wi=Primary_weapon_to_weapon_info[weapon];
        if(skill>=2)vm_vec_scale_add2(&aim,&foe->mtype.phys_info.velocity,fl2f(fminf(.5f,d/fmaxf(60,f2fl(Weapon_info[wi].speed[Difficulty_level])))*(.45f+.1f*skill)));
        if(d>60){vm_vec_normalized_dir(&travel,&foe->pos,&o->pos);speed=25+skill*3;}
        else if(d<25){vm_vec_normalized_dir(&travel,&o->pos,&foe->pos);speed=20;}
        else {travel=o->orient.rvec;vm_vec_scale(&travel,((id+(int)(GameTime64/i2f(3)))&1)?F1_0:-F1_0);speed=skill>=2?12+skill*2:3;}
        distance=20;
    }
    vms_vector direction;vm_vec_normalized_dir(&direction,&aim,&o->pos);
    float x=f2fl(vm_vec_dot(&direction,&o->orient.rvec)),y=f2fl(vm_vec_dot(&direction,&o->orient.uvec)),z=f2fl(vm_vec_dot(&direction,&o->orient.fvec));
    Controls.heading_time=fl2f(sq_turn(o,b,1,atan2f(x,z),.15f+.025f*skill)*dt);
    Controls.pitch_time=fl2f(sq_turn(o,b,0,-atan2f(y,sqrtf(x*x+z*z)),.15f+.025f*skill)*dt);
    Controls.bank_time=fl2f(sq_turn(o,b,2,atan2f(-f2fl(vm_vec_dot(&b->up,&o->orient.rvec)),f2fl(vm_vec_dot(&b->up,&o->orient.uvec))),.07f)*dt);
    speed=fminf(speed,distance*2.2f);
    if(Game_mode&GM_MULTI_COOP){
        vms_vector desire;vm_vec_copy_scale(&desire,&travel,fl2f(speed));
        for(int p=0;p<N_players;p++)if(p!=id&&Players[p].connected==CONNECT_PLAYING){object *friend=&Objects[Players[p].objnum];if(friend->type!=OBJ_PLAYER)continue;vms_vector away;float d=f2fl(vm_vec_normalized_dir(&away,&o->pos,&friend->pos));if(d>1&&d<15)vm_vec_scale_add2(&desire,&away,fl2f((15-d)*3));}
        speed=fminf(speed+15,f2fl(vm_vec_normalize(&desire)));travel=desire;
    }
    if(b->door>=0){speed=fminf(speed,fmaxf(0,distance-12)*2);if(z>.97f&&GameTime64>b->flare){Flare_create(o);b->flare=GameTime64+F1_0;}}
    vms_vector probe;vm_vec_scale_add(&probe,&o->pos,&travel,i2f(9));if(!sq_clear(o,&probe,o->size,-1))speed=0;
    vms_vector axes[3]={o->orient.rvec,o->orient.uvec,o->orient.fvec};fix *outputs[3]={&Controls.sideways_thrust_time,&Controls.vertical_thrust_time,&Controls.forward_thrust_time};
    for(int i=0;i<3;i++){
        float goal=f2fl(vm_vec_dot(&travel,&axes[i]))*speed,velocity=f2fl(vm_vec_dot(&o->mtype.phys_info.velocity,&axes[i]));
        float drag=f2fl(o->mtype.phys_info.drag),mass=f2fl(o->mtype.phys_info.mass),hold=goal*mass*drag/fmaxf(.01f,(1-drag)*f2fl(Player_ship->max_thrust));
        *outputs[i]=fl2f(sq_clamp(hold+(goal-velocity)*.12f,-1,1)*dt);
    }
    read_flying_controls(o);
    if(!visible||GameTime64<b->react||z<.985f-.003f*(4-skill))return;
    if(GameTime64>=b->weapon_until){
        static const int choice[]={PLASMA_INDEX,SPREADFIRE_INDEX,GAUSS_INDEX,LASER_INDEX};int best=LASER_INDEX;
        for(int i=0;i<4;i++)if(Players[id].primary_weapon_flags&(1<<choice[i])){if(choice[i]==GAUSS_INDEX&&Players[id].primary_ammo[VULCAN_INDEX]<20)continue;best=choice[i];break;}
        Players[id].primary_weapon=best;b->weapon_until=GameTime64+i2f(8);
    }
    if(GameTime64>=b->fire){
        int weapon=Players[id].primary_weapon,wi=Primary_weapon_to_weapon_info[weapon];
        if(weapon==LASER_INDEX)wi=Players[id].laser_level<=MAX_LASER_LEVEL?LASER_ID+Players[id].laser_level:SUPER_LASER_ID+Players[id].laser_level-MAX_LASER_LEVEL-1;
        fix cost=Weapon_info[wi].energy_usage;
        if(Players[id].energy>=cost){
            int flags=(Players[id].flags&PLAYER_FLAGS_QUAD_LASERS)?LASER_QUAD:0;
            do_laser_firing(o-Objects,weapon,Players[id].laser_level,flags,1,o->orient.fvec);Players[id].energy-=cost;b->shots++;
            if(weapon==GAUSS_INDEX)Players[id].primary_ammo[VULCAN_INDEX]=max(0,Players[id].primary_ammo[VULCAN_INDEX]-Weapon_info[wi].ammo_usage);
        }
        b->fire=GameTime64+max(Weapon_info[wi].fire_wait,fl2f(.35f-.05f*skill));
    }
    if(skill>=1&&GameTime64>=b->missile&&sq_distance(&aim,&o->pos)>32){
        int type=Players[id].secondary_ammo[HOMING_INDEX]>0?HOMING_INDEX:CONCUSSION_INDEX;
        if(Players[id].secondary_ammo[type]>0){int wi=Secondary_weapon_to_weapon_info[type];Laser_player_fire(o,wi,4,1,0,o->orient.fvec);multi_send_fire(type+MISSILE_ADJUST,0,0,1,b->target);Players[id].secondary_ammo[type]--;b->missiles++;}
        b->missile=GameTime64+i2f(6-skill);
    }
}
void astra_squad_frame(void){
    if(!astra_net_active||astra_net_owner!=astra_net_host||FrameTime<=0||Endlevel_sequence)return;
    int saved=Player_num,dead=Player_is_dead;object *console=ConsoleObject;control_info controls=Controls;
    for(int id=1;id<astra_net_count;id++){
        if(!sq_bot(id))continue;
        object *o=&Objects[Players[id].objnum];squad_pilot *b=&sq[id];
        if(b->level!=Current_level_num||b->signature!=o->signature){
            memset(b,0,sizeof(*b));b->level=Current_level_num;b->signature=o->signature;b->target=b->goal=b->last_room=-1;b->progress=GameTime64;b->last=o->pos;b->up=o->orient.uvec;
            if(!sq_handoff)init_player_stats_new_ship(id);
            else {EM_ASM({const p=Module.netBotInventory?.[$0];if(p){HEAP32[$1>>2]=p.shields;HEAP32[$2>>2]=p.energy;HEAP32[$3>>2]=p.flags;HEAP8[$4]=p.laser;HEAP16[$5>>1]=p.primary;HEAP16[$6>>1]=p.secondary;for(let i=0;i<10;i++){HEAP16[($7>>1)+i]=p.pa[i];HEAP16[($8>>1)+i]=p.sa[i];}}},id,&Players[id].shields,&Players[id].energy,&Players[id].flags,&Players[id].laser_level,&Players[id].primary_weapon_flags,&Players[id].secondary_weapon_flags,Players[id].primary_ammo,Players[id].secondary_ammo);}
            if(sq_handoff){
                Players[id].primary_weapon=EM_ASM_INT(return Module.netBotInventory?.[$0]?.weapon??0;,id);
                Players[id].secondary_weapon=EM_ASM_INT(return Module.netBotInventory?.[$0]?.missile??0;,id);
                int inv=EM_ASM_INT(return Module.netBotInventory?.[$0]?.inv??0;,id),cloak=EM_ASM_INT(return Module.netBotInventory?.[$0]?.cloak??0;,id);
                Players[id].invulnerable_time=GameTime64-INVULNERABLE_TIME_MAX+max(0,min(INVULNERABLE_TIME_MAX,inv));
                Players[id].cloak_time=GameTime64-CLOAK_TIME_MAX+max(0,min(CLOAK_TIME_MAX,cloak));
                if(o->type==OBJ_GHOST){int left=EM_ASM_INT(return Module.netBotInventory?.[$0]?.respawn??65536;,id);b->spawn=GameTime64+max(1,min(i2f(5),left));}
            }
            o->shields=Players[id].shields;
        }
        if(b->spawn){
            if(GameTime64<b->spawn)continue;b->spawn=0;Player_num=saved;ConsoleObject=console;
            multi_make_ghost_player(id);int pos=(id+Players[id].net_killed_total)%max(1,NumNetPlayerPositions);
            o->pos=Player_init[pos].pos;o->orient=Player_init[pos].orient;obj_relink(o-Objects,Player_init[pos].segnum);
            Players[id].flags|=PLAYER_FLAGS_INVULNERABLE;Players[id].invulnerable_time=GameTime64-INVULNERABLE_TIME_MAX+i2f(2);o->shields=Players[id].shields;
            Player_num=id;ConsoleObject=o;multi_send_reappear();create_player_appearance_effect(o);b->target=-1;b->think=0;
        }
        if(o->type!=OBJ_PLAYER)continue;
        if((Players[id].flags&PLAYER_FLAGS_INVULNERABLE)&&GameTime64-Players[id].invulnerable_time>INVULNERABLE_TIME_MAX)Players[id].flags&=~PLAYER_FLAGS_INVULNERABLE;
        if((Players[id].flags&PLAYER_FLAGS_CLOAKED)&&GameTime64-Players[id].cloak_time>CLOAK_TIME_MAX){Players[id].flags&=~PLAYER_FLAGS_CLOAKED;int save=Player_num;Player_num=id;multi_send_decloak();Player_num=save;}
        Player_num=id;ConsoleObject=o;Player_is_dead=0;memset(&Controls,0,sizeof Controls);o->control_type=CT_NONE;
        o->movement_type=MT_PHYSICS;o->mtype.phys_info.flags|=PF_USES_THRUST;
        if(Game_mode&GM_MULTI_COOP)Players[id].flags|=Players[saved].flags&(PLAYER_FLAGS_BLUE_KEY|PLAYER_FLAGS_RED_KEY|PLAYER_FLAGS_GOLD_KEY);
        if(GameTime64>=b->think)sq_plan(id,o);sq_drive(id,o);
        if(GameTime64>=b->report){b->report=GameTime64+F1_0/4;
        EM_ASM({Module.netBots=Module.netBots||[];Module.netBots[$0]=({skill:$1,goal:$2,target:$3,shots:$4,missiles:$5,pickups:$6,stuck:$7,energy:$8,order:$9,leader:$10});},id,astra_net_bot_skill[id],b->goal,b->target,b->shots,b->missiles,b->pickups,b->stuck,f2fl(Players[id].energy),sq_command[id],sq_leader[id]);}
    }
    sq_handoff=0;
    Player_num=saved;ConsoleObject=console;Player_is_dead=dead;Controls=controls;
}
int astra_squad_damage(object *ship,object *killer,fix damage,int friendly){
    int id=ship->id;if(ship->type!=OBJ_PLAYER||!sq_bot(id))return 0;
    if(!sq_owner(id)||sq[id].spawn||damage<=0||Players[id].flags&PLAYER_FLAGS_INVULNERABLE||Endlevel_sequence)return 1;
    if(friendly&&(Game_mode&GM_MULTI_COOP)&&killer&&killer->type==OBJ_PLAYER)return 1;
    Players[id].shields-=damage;ship->shields=Players[id].shields;
    if(killer&&killer!=ship){sq[id].contact=killer->pos;sq[id].contact_until=GameTime64+i2f(2);sq[id].think=0;}
    if(Players[id].shields>=0)return 1;
    sq[id].spawn=GameTime64+i2f(5);
    int saved=Player_num;object *console=ConsoleObject;Player_num=id;ConsoleObject=ship;Players[id].killer_objnum=killer?killer-Objects:-1;
    multi_send_kill(ship-Objects);drop_player_eggs(ship);multi_send_player_explode(MULTI_PLAYER_EXPLODE);
    Player_num=saved;ConsoleObject=console;explode_badass_player(ship);ship->flags&=~OF_SHOULD_BE_DEAD;multi_make_player_ghost(id);
    return 1;
}
int astra_squad_pickup(object *ship,object *item){
    if(!sq_owner(ship->id)||Endlevel_sequence||sq[ship->id].spawn)return 0;
    if(sq_need(ship->id,item)<=0)return 1;
    int saved=Player_num,dead=Player_is_dead;object *console=ConsoleObject;
    int quiet=EM_ASM_INT(return !!Module.arenaDemo),pr=PaletteRedAdd,pg=PaletteGreenAdd,pb=PaletteBlueAdd;
    Player_num=ship->id;ConsoleObject=ship;Player_is_dead=0;
    astra_squad_silent_pickup=quiet;
    if(do_powerup(item)){item->flags|=OF_SHOULD_BE_DEAD;multi_send_remobj(item-Objects);sq[ship->id].pickups++;sq[ship->id].think=0;}
    else sq[ship->id].ignored[item-Objects]=GameTime64+i2f(20);
    astra_squad_silent_pickup=0;
    if(quiet){PaletteRedAdd=pr;PaletteGreenAdd=pg;PaletteBlueAdd=pb;}
    Player_num=saved;ConsoleObject=console;Player_is_dead=dead;return 1;
}
