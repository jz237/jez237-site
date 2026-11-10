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
    vms_vector route[8],gaze,cruise,right,turn_goal;
    int route_count,gaze_ready,turn_side,polar;
    fix64 gaze_until,turn_until,avoid_next;
    float rates[3],accels[3],command_velocity[3],command_accel[3],remaining,view_depth;
    unsigned short visits[MAX_SEGMENTS];
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
int astra_squad_owns(int id){return sq_owner(id);}
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
    fvi_query q={&ship->pos,point,ship->segnum,radius,ship-Objects,NULL,radius?0:FQ_TRANSPOINT};fvi_info hit;
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
int astra_squad_pickup(object*,object*);
/* Route anchors are portals, not stop signs. Look through several rooms and
 * pursue a point ahead on the hull-checked line, braking only for its end. */
static void sq_route(int id,object *o,vms_vector end){
    squad_pilot *b=&sq[id];b->route_count=0;b->remaining=0;
    int path[MAX_SEGMENTS],n=0,at=b->goal,from=o->segnum;
    while(at>=0&&at!=from&&n<MAX_SEGMENTS){path[n++]=at;at=sq_parent[at];}
    if(at!=from)return;
    for(int p=n-1;p>=0&&b->route_count<6;p--){
        int next=path[p],side=-1;for(int s=0;s<6;s++)if(Segments[from].children[s]==next){side=s;break;}
        if(side<0)break;
        vms_vector point;compute_center_point_on_side(&point,&Segments[from],side);
        if(!(WALL_IS_DOORWAY(&Segments[from],side)&WID_FLY_FLAG))break;
        b->route[b->route_count++]=point;from=next;
    }
    vms_vector last=end;if(from!=b->goal)compute_segment_center(&last,&Segments[from]);
    if(b->route_count<8)b->route[b->route_count++]=last;
}
static vms_vector sq_pursuit(squad_pilot *b,object *o){
    vms_vector chosen=b->move,from=o->pos;b->remaining=0;
    float look=sq_clamp(13+f2fl(vm_vec_mag(&o->mtype.phys_info.velocity))*.45f,15,36),walk=0;
    int picked=0;
    for(int i=0;i<b->route_count;i++){
        vms_vector direction;float length=f2fl(vm_vec_normalized_dir(&direction,&b->route[i],&from));
        if(!picked){
            vms_vector point;vm_vec_scale_add(&point,&from,&direction,fl2f(fminf(length,fmaxf(0,look-walk))));
            if(sq_clear(o,&point,o->size,-1)){chosen=point;if(walk+length>=look)picked=1;}
            else picked=1;
        }
        walk+=length;from=b->route[i];
    }
    b->remaining=walk;return chosen;
}
static float sq_depth(object *o,vms_vector direction,float range,fix radius,fvi_info *result){
    if(vm_vec_normalize(&direction)<F1_0/100)return 0;
    vms_vector end;vm_vec_scale_add(&end,&o->pos,&direction,fl2f(range));
    fvi_query q={&o->pos,&end,o->segnum,radius,o-Objects,NULL,0};fvi_info hit;
    int kind=find_vector_intersection(&q,&hit);if(result)*result=hit;
    return kind==HIT_NONE?range:kind==HIT_BAD_P0?0:sq_distance(&o->pos,&hit.hit_pnt);
}
/* Eye direction is independent of a short pickup/avoidance correction. Only
 * geometry is surveyed here: enemies still need native visibility tests. */
static vms_vector sq_gaze(int id,object *o,vms_vector route){
    squad_pilot *b=&sq[id];vms_vector desired;vm_vec_normalized_dir(&desired,&route,&o->pos);
    if(b->gaze_ready&&GameTime64<b->gaze_until){
        vms_vector held;float d=f2fl(vm_vec_normalized_dir(&held,&b->gaze,&o->pos));
        if(d>12&&vm_vec_dot(&held,&desired)>-F1_0/4&&sq_depth(o,held,65,0,NULL)>24)return b->gaze;
    }
    float best=-1e9f;vms_vector selected=route;
    for(int k=-2;k<6+b->route_count;k++){
        vms_vector point,d;
        if(k==-2)point=route;
        else if(k==-1)vm_vec_scale_add(&point,&o->pos,&o->orient.fvec,i2f(65));
        else if(k>=6)point=b->route[k-6];
        else {int child=Segments[o->segnum].children[k];if(child<0||!(WALL_IS_DOORWAY(&Segments[o->segnum],k)&WID_FLY_FLAG))continue;
            compute_center_point_on_side(&point,&Segments[o->segnum],k);vms_vector center;compute_segment_center(&center,&Segments[child]);vm_vec_sub(&d,&center,&point);vm_vec_scale_add2(&point,&d,F1_0/2);}
        if(vm_vec_normalized_dir(&d,&point,&o->pos)<i2f(4)||!sq_clear(o,&point,0,-1))continue;
        float depth=sq_depth(o,d,100,0,NULL),alignment=f2fl(vm_vec_dot(&d,&desired));
        float score=fminf(depth,70)*.65f+alignment*27+f2fl(vm_vec_dot(&d,&o->orient.fvec))*12;
        if(score>best){best=score;vm_vec_scale_add(&selected,&o->pos,&d,fl2f(fminf(depth*.85f,75)));}
    }
    b->gaze=selected;b->gaze_ready=1;b->gaze_until=GameTime64+F1_0/2;return selected;
}
static float sq_arc(object *o,float angle,float rise){
    float score=0,nearest=100;
    for(int n=1;n<=5;n++){float a=angle*n/6.f;vms_vector d;vm_vec_copy_scale(&d,&o->orient.fvec,fl2f(cosf(a)));vm_vec_scale_add2(&d,&o->orient.rvec,fl2f(sinf(a)));vm_vec_scale_add2(&d,&o->orient.uvec,fl2f(rise*n/6.f));float depth=sq_depth(o,d,80,0,NULL);score+=fminf(depth,60);nearest=fminf(nearest,depth);}
    return score/5+fminf(nearest,35)*.8f-fabsf(angle)*5;
}
static void sq_plan(int id,object *ship){
    squad_pilot *b=&sq[id];int skill=astra_net_bot_skill[id];
    b->think=GameTime64+fl2f(.12f+.035f*(4-skill));
    /* A pursuit can finish already inside a pickup's collision sphere. A
     * zero-length physics sweep then misses it. Use the same native pickup
     * handler for actual overlap, or move on if it cannot be collected. */
    if(b->pick>=0&&b->pick<=Highest_object_index){
        object *item=&Objects[b->pick];
        if(item->type==OBJ_POWERUP&&!(item->flags&OF_SHOULD_BE_DEAD)&&sq_need(id,item)>0&&
           sq_distance(&ship->pos,&item->pos)<f2fl(ship->size+item->size)&&sq_clear(ship,&item->pos,0,-1)){
            astra_squad_pickup(ship,item);
            if(!(item->flags&OF_SHOULD_BE_DEAD)&&sq_need(id,item)>0)b->ignored[item-Objects]=GameTime64+i2f(30);
        }
    }
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
    int previous_pick=b->pick;
    b->door=b->route_side=b->pick=-1;int goal=ship->segnum,follow_look=0;vms_vector end=ship->pos,follow_aim=ship->pos;float cost=1e9f;
    /* Only useful, nearby supplies: a wingman leaves the human's supplies alone
     * while healthy. Full ammunition can never trap a pilot in a pickup loop. */
    for(int i=0;i<=Highest_object_index;i++){
        object *o=&Objects[i];if(o->type!=OBJ_POWERUP||o->flags&OF_SHOULD_BE_DEAD||o->segnum<0||sq_dist[o->segnum]<0)continue;
        float need=sq_need(id,o);if(need<=0)continue;
        if((Game_mode&GM_MULTI_COOP)&&(sq_command[id]==3||(Players[id].shields>i2f(65)&&Players[id].energy>i2f(40))))continue;
        if(sq_dist[o->segnum]>6)continue;
        float score=sq_dist[o->segnum]*20+sq_distance(&o->pos,&ship->pos)*.12f-need*.15f;
        if(i==previous_pick)score-=12; /* Finish a useful approach before swapping supplies. */
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
    sq_route(id,ship,end);
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
    if(b->door<0&&b->route_count)b->move=sq_pursuit(b,ship);
    if(b->target<0)b->aim=follow_look&&b->door<0?follow_aim:b->move;
    /* An impact bearing can draw attention only while that point is visible. */
    if(b->contact_until>GameTime64&&enemy<0&&sq_clear(ship,&b->contact,0,-1))b->aim=b->contact;
    if(sq_distance(&ship->pos,&b->last)>5){b->last=ship->pos;b->progress=GameTime64;}
    if(GameTime64-b->progress>i2f(4)&&(goal!=ship->segnum||b->pick>=0||sq_distance(&ship->pos,&b->move)>3)){
        b->stuck++;b->progress=GameTime64;b->roam_until=0;
        if(b->route_side>=0)b->blocked[ship->segnum][b->route_side]=GameTime64+i2f(8);
        if(b->pick>=0)b->ignored[b->pick]=GameTime64+i2f(15);
        compute_segment_center(&b->move,&Segments[ship->segnum]);
        if(sq_distance(&b->move,&ship->pos)<5)vm_vec_scale_add2(&b->move,&ship->orient.rvec,i2f((b->stuck&1)?8:-8));
        b->escape=b->move;b->escape_until=GameTime64+fl2f(1.2f);
    }
    if(GameTime64<b->escape_until){b->move=b->escape;b->door=-1;b->route_count=0;}
}
static float sq_turn(object *o,squad_pilot *b,int axis,float error,float limit,float feed){
    float dt=sq_clamp(f2fl(FrameTime),0,.1f),rate=axis==0?f2fl(o->mtype.phys_info.rotvel.x):axis==1?f2fl(o->mtype.phys_info.rotvel.y):f2fl(o->mtype.phys_info.rotvel.z);
    float acceleration=axis==2?.055f:.28f;
    float brake=sqrtf(2*acceleration*fabsf(error)/6.2831853f);
    float desired=sq_clamp(copysignf(fminf(fabsf(error)*.5f,brake),error)+feed/6.2831853f,-limit,limit);
    float gap=desired-b->rates[axis],a=sq_clamp(gap/.14f,-acceleration,acceleration),jerk=axis==2?.35f:1.8f;
    b->accels[axis]+=sq_clamp(a-b->accels[axis],-jerk*dt,jerk*dt);
    float step=b->accels[axis]*dt;
    if(step*gap>=0&&fabsf(step)>fabsf(gap)){b->rates[axis]=desired;b->accels[axis]=0;}
    else b->rates[axis]+=step;
    float drag=sq_clamp(f2fl(o->mtype.phys_info.drag)*2.5f,.01f,.9f),gain=64*(1-drag)*f2fl(Player_ship->max_rotthrust)/fmaxf(.01f,f2fl(o->mtype.phys_info.mass));
    return sq_clamp((64*drag*b->rates[axis]+(b->rates[axis]-rate)*8)/fmaxf(.01f,gain),-1,1);
}
static void sq_look(object *o,squad_pilot *b,vms_vector direction,int visible,int skill,float distance,vms_vector target_velocity){
    float x=f2fl(vm_vec_dot(&direction,&o->orient.rvec)),y=f2fl(vm_vec_dot(&direction,&o->orient.uvec)),z=f2fl(vm_vec_dot(&direction,&o->orient.fvec));
    float ux=f2fl(vm_vec_dot(&b->up,&o->orient.rvec)),uy=f2fl(vm_vec_dot(&b->up,&o->orient.uvec)),projection=sqrtf(ux*ux+uy*uy);
    if(!b->polar&&projection<.36f)b->polar=1;if(b->polar&&projection>.62f)b->polar=0;
    float yaw=atan2f(x,z),pitch=-atan2f(y,sqrtf(x*x+z*z)),roll=0,bank_feed=0;
    if(!b->polar){
        vms_vector flat=o->orient.fvec;float rise=f2fl(vm_vec_dot(&flat,&b->up));
        vm_vec_scale_add2(&flat,&b->up,-fl2f(rise));vm_vec_normalize(&flat);vm_vec_cross(&b->right,&b->up,&flat);vm_vec_normalize(&b->right);
        float bearing=atan2f(f2fl(vm_vec_dot(&direction,&b->right)),f2fl(vm_vec_dot(&direction,&flat)));
        if(b->turn_side&&(z>.65f||GameTime64>=b->turn_until||vm_vec_dot(&b->turn_goal,&direction)<F1_0/2))b->turn_side=0;
        if(!b->turn_side&&fabsf(bearing)>1.8f){
            float left=bearing<0?bearing:bearing-6.2831853f,right=bearing>0?bearing:bearing+6.2831853f;
            float ls=sq_arc(o,left,y),rs=sq_arc(o,right,y);b->turn_side=fabsf(rs-ls)>8?(rs>ls?1:-1):(bearing>0?1:-1);b->turn_goal=direction;b->turn_until=GameTime64+i2f(5);
        }
        if(b->turn_side>0&&bearing<0)bearing+=6.2831853f;if(b->turn_side<0&&bearing>0)bearing-=6.2831853f;
        float elevation=asinf(sq_clamp(rise,-1,1))-asinf(sq_clamp(f2fl(vm_vec_dot(&direction,&b->up)),-.9986f,.9986f));
        yaw=bearing*uy-elevation*ux/projection;pitch=bearing*ux+elevation*uy/projection;
        roll=atan2f(-ux,uy);
        bank_feed=sq_clamp(6.2831853f*rise*(f2fl(o->mtype.phys_info.rotvel.y)*uy+f2fl(o->mtype.phys_info.rotvel.x)*ux)/fmaxf(.1296f,projection*projection),-.7f,.7f);
        bank_feed*=sq_clamp((projection-.36f)/.26f,0,1);
    }else{
        vms_vector right=b->right;vm_vec_scale_add2(&right,&o->orient.fvec,-vm_vec_dot(&right,&o->orient.fvec));if(vm_vec_normalize(&right)<F1_0/10)right=o->orient.rvec;b->right=right;
        roll=atan2f(f2fl(vm_vec_dot(&right,&o->orient.uvec)),f2fl(vm_vec_dot(&right,&o->orient.rvec)));
    }
    float dt=f2fl(FrameTime),limit=visible?.16f+.018f*skill:.16f,fy=0,fp=0;
    if(visible&&distance>5){vms_vector relative;vm_vec_sub(&relative,&target_velocity,&o->mtype.phys_info.velocity);float weight=sq_clamp(z,0,1);weight=weight*weight/distance;fy=f2fl(vm_vec_dot(&relative,&o->orient.rvec))*weight;fp=-f2fl(vm_vec_dot(&relative,&o->orient.uvec))*weight;}
    Controls.heading_time=fl2f(sq_turn(o,b,1,yaw,limit,fy)*dt);Controls.pitch_time=fl2f(sq_turn(o,b,0,pitch,limit,fp)*dt);
    Controls.bank_time=fl2f(sq_turn(o,b,2,copysignf(fmaxf(0,fabsf(roll)-.025f),roll),b->polar?.025f:.07f,bank_feed)*dt);
}
static void sq_drive(int id,object *o){
    squad_pilot *b=&sq[id];int skill=astra_net_bot_skill[id];float dt=f2fl(FrameTime),speed=30+skill*5;
    if(b->door<0&&b->route_count&&GameTime64>=b->escape_until)b->move=sq_pursuit(b,o);
    vms_vector aim=b->aim,travel,target_velocity={0,0,0};float distance=f2fl(vm_vec_normalized_dir(&travel,&b->move,&o->pos));
    int visible=b->target>=0&&sq_enemy(id,b->target)&&Objects[b->target].signature==b->target_sig&&sq_clear(o,&Objects[b->target].pos,0,b->target);
    if(visible){
        object *foe=&Objects[b->target];aim=foe->pos;target_velocity=foe->mtype.phys_info.velocity;float d=sq_distance(&foe->pos,&o->pos);
        int weapon=Players[id].primary_weapon,wi=Primary_weapon_to_weapon_info[weapon];
        if(skill>=2)vm_vec_scale_add2(&aim,&foe->mtype.phys_info.velocity,fl2f(fminf(.5f,d/fmaxf(60,f2fl(Weapon_info[wi].speed[Difficulty_level])))*(.45f+.1f*skill)));
        /* Continuous range keeping avoids the old approach/back-off/orbit
         * switches. Orbit direction stays stable for the engagement. */
        vms_vector line,lateral;vm_vec_normalized_dir(&line,&foe->pos,&o->pos);vm_vec_cross(&lateral,&b->up,&line);if(vm_vec_normalize(&lateral)<F1_0/10)lateral=o->orient.rvec;
        vm_vec_copy_scale(&travel,&line,fl2f(sq_clamp((d-43)*.7f,-21,25+skill*3)));
        vm_vec_scale_add2(&travel,&lateral,fl2f((id&1?1:-1)*(skill>=2?12+skill*1.5f:5)));
        speed=f2fl(vm_vec_normalize(&travel));distance=70;
    }else{
        if(b->door<0)aim=sq_gaze(id,o,b->target<0?b->aim:b->move);
        else aim=b->move;
    }
    vms_vector direction;float aim_distance=f2fl(vm_vec_normalized_dir(&direction,&aim,&o->pos));if(aim_distance<.1f)direction=o->orient.fvec;
    float z=f2fl(vm_vec_dot(&direction,&o->orient.fvec));sq_look(o,b,direction,visible,skill,aim_distance,target_velocity);
    float remaining=b->door<0&&b->route_count?b->remaining:distance;
    if(!visible)speed=fminf(speed,sqrtf(65*fmaxf(0,remaining-.6f)));
    {
        vms_vector desire;vm_vec_copy_scale(&desire,&travel,fl2f(speed));
        for(int p=0;p<N_players;p++)if(p!=id&&Players[p].connected==CONNECT_PLAYING){object *friend=&Objects[Players[p].objnum];if(friend->type!=OBJ_PLAYER)continue;vms_vector away;float d=f2fl(vm_vec_normalized_dir(&away,&o->pos,&friend->pos)),space=(Game_mode&GM_MULTI_COOP)?15:f2fl(o->size+friend->size)+2;
            if(d<space&&sq_clear(o,&friend->pos,0,friend-Objects)){if(d<.1f){away=Player_init[0].orient.rvec;vm_vec_scale(&away,id>p?F1_0:-F1_0);}vm_vec_scale_add2(&desire,&away,fl2f((space-d)*3));}}
        speed=fminf(speed+15,f2fl(vm_vec_normalize(&desire)));travel=desire;
    }
    if(b->door>=0&&!visible){speed=fminf(speed,sqrtf(60*fmaxf(0,distance-12)));if(z>.97f&&GameTime64>b->flare){Flare_create(o);b->flare=GameTime64+F1_0;}}
    /* Inspect enough space to brake, then favor a safe tangent instead of
     * slamming the requested velocity to zero at a fixed nine-unit probe. */
    float look=sq_clamp(12+speed*.3f+speed*speed/100,14,55);
    fvi_info obstruction;float clearance=sq_depth(o,travel,look,o->size,&obstruction);
    if(clearance<look-1&&b->door<0&&GameTime64<b->avoid_next){
        float held=sq_depth(o,b->cruise,look,o->size,NULL);
        if(held>clearance+2){travel=b->cruise;clearance=held;}
    }else if(clearance<look-1&&b->door<0){
        b->avoid_next=GameTime64+F1_0/5;
        vms_vector best=travel;float quality=-1e9f;
        for(int candidate=0;candidate<9;candidate++){
            vms_vector d=travel;
            if(candidate==0){if(obstruction.hit_type!=HIT_WALL)continue;fix toward=vm_vec_dot(&d,&obstruction.hit_wallnorm);vm_vec_scale_add2(&d,&obstruction.hit_wallnorm,-toward);}
            else if(candidate==1)d=b->cruise;
            else if(candidate==2){vms_vector center;compute_segment_center(&center,&Segments[o->segnum]);vm_vec_normalized_dir(&d,&center,&o->pos);}
            else {int side=candidate-3,child=Segments[o->segnum].children[side];if(child<0||!(WALL_IS_DOORWAY(&Segments[o->segnum],side)&WID_FLY_FLAG))continue;vms_vector portal;compute_center_point_on_side(&portal,&Segments[o->segnum],side);vm_vec_normalized_dir(&d,&portal,&o->pos);}
            if(vm_vec_normalize(&d)<F1_0/100)continue;
            float space=sq_depth(o,d,look,o->size,NULL),alignment=f2fl(vm_vec_dot(&d,&travel));
            float score=space+alignment*16+f2fl(vm_vec_dot(&d,&b->cruise))*5;
            if(space>6&&score>quality){quality=score;best=d;}
        }
        if(quality>-1e8f){travel=best;clearance=sq_depth(o,travel,look,o->size,NULL);}
    }
    b->cruise=travel;speed=fminf(speed,sqrtf(70*fmaxf(0,clearance-1.5f)));
    /* A bounded world-space acceleration keeps thrusters continuous through
     * portal changes and strafes. Native D2 physics still moves the ship. */
    vms_vector desired;vm_vec_copy_scale(&desired,&travel,fl2f(speed));
    float values[3]={f2fl(desired.x),f2fl(desired.y),f2fl(desired.z)},stepdt=sq_clamp(dt,0,.05f);
    for(int i=0;i<3;i++){
        float gap=values[i]-b->command_velocity[i],want=sq_clamp(gap/.25f,-45,45);
        b->command_accel[i]+=sq_clamp(want-b->command_accel[i],-220*stepdt,220*stepdt);
        float step=b->command_accel[i]*stepdt;
        if(step*gap>=0&&fabsf(step)>fabsf(gap)){b->command_velocity[i]=values[i];b->command_accel[i]=0;}else b->command_velocity[i]+=step;
    }
    desired.x=fl2f(b->command_velocity[0]);desired.y=fl2f(b->command_velocity[1]);desired.z=fl2f(b->command_velocity[2]);
    /* Do not let the comfort filter carry residual thrust into a near wall. */
    float filtered=f2fl(vm_vec_mag(&desired));
    if(filtered>1){fvi_info wall;float room=sq_depth(o,desired,8+filtered*filtered/90,o->size,&wall);
        if(wall.hit_type==HIT_WALL&&room<5){fix into=vm_vec_dot(&desired,&wall.hit_wallnorm);if(into<0)vm_vec_scale_add2(&desired,&wall.hit_wallnorm,-into);b->command_velocity[0]=f2fl(desired.x);b->command_velocity[1]=f2fl(desired.y);b->command_velocity[2]=f2fl(desired.z);}}
    vms_vector axes[3]={o->orient.rvec,o->orient.uvec,o->orient.fvec};fix *outputs[3]={&Controls.sideways_thrust_time,&Controls.vertical_thrust_time,&Controls.forward_thrust_time};
    for(int i=0;i<3;i++){
        float goal=f2fl(vm_vec_dot(&desired,&axes[i])),velocity=f2fl(vm_vec_dot(&o->mtype.phys_info.velocity,&axes[i]));
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
            memset(b,0,sizeof(*b));b->level=Current_level_num;b->signature=o->signature;b->target=b->goal=b->last_room=b->pick=-1;b->progress=GameTime64;b->last=o->pos;b->up=Player_init[0].orient.uvec;b->right=o->orient.rvec;
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
            memset(b->rates,0,sizeof b->rates);memset(b->accels,0,sizeof b->accels);memset(b->command_velocity,0,sizeof b->command_velocity);memset(b->command_accel,0,sizeof b->command_accel);
            b->gaze_ready=b->turn_side=b->polar=b->route_count=0;b->right=o->orient.rvec;b->cruise=o->orient.fvec;b->last=o->pos;b->progress=GameTime64;b->escape_until=0;
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
