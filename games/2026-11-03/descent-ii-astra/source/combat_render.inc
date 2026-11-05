/* Recognizable pieces retain the parent model, materials and articulated pose.
 * Bounded presentation-only physics never touch native objects or random draws. */
static vms_vector ac_world(const vms_vector *local,const vms_matrix *basis){
    vms_matrix inverse;vm_copy_transpose_matrix(&inverse,basis);vms_vector result;vm_vec_rotate(&result,local,&inverse);return result;
}
static void ac_init_fragment(ac_fragment *piece,const object *robot,int part,int explosion){
    memset(piece,0,sizeof *piece);piece->robot=*robot;piece->part=part;piece->room=robot->segnum;
    piece->seed=ac_hash(robot->signature*1237u+part*919u);piece->born=GameTime64;
    piece->life=explosion?6.8f+(piece->seed%11)*.09f:4.8f;
    piece->spin=(piece->seed&1?1:-1)*(.55f+(piece->seed%17)*.045f);
    polymodel *pm=&Polygon_models[Robot_info[robot->id].model_num];
    vms_vector center={(pm->maxs.x+pm->mins.x)/2,(pm->maxs.y+pm->mins.y)/2,(pm->maxs.z+pm->mins.z)/2};
    float extent[3]={f2fl(pm->maxs.x-pm->mins.x)*.425f,f2fl(pm->maxs.y-pm->mins.y)*.43f,f2fl(pm->maxs.z-pm->mins.z)*.455f};
    float lo[3]={1e8,1e8,1e8},hi[3]={-1e8,-1e8,-1e8};int id=ac_model(robot);
    if(af_load_mesh(id))for(int b=0;b<af_models[id].count;b++){
        astra_batch *batch=&af_models[id].group[b];if(batch->part!=part)continue;
        for(unsigned i=0;i<batch->count;i++)for(int k=0;k<3;k++){float v=batch->v[i*11+k]*extent[k];lo[k]=fminf(lo[k],v);hi[k]=fmaxf(hi[k],v);}
    }
    piece->pivot=center;if(lo[0]<1e8){piece->pivot.x+=fl2f((lo[0]+hi[0])*.5f);piece->pivot.y+=fl2f((lo[1]+hi[1])*.5f);piece->pivot.z+=fl2f((lo[2]+hi[2])*.5f);}
    vms_vector offset=ac_world(&piece->pivot,&robot->orient);vm_vec_add(&piece->pos,&robot->pos,&offset);
    vms_vector direction;vm_vec_sub(&direction,&piece->pivot,&center);
    if(vm_vec_normalize(&direction)<F1_0/100)direction=(vms_vector){F1_0/4,F1_0/2,-F1_0};
    direction=ac_world(&direction,&robot->orient);vm_vec_normalize(&direction);
    vm_vec_copy_scale(&piece->velocity,&direction,fl2f((explosion?10:5)+(piece->seed%19)*.27f));
    vm_vec_scale_add2(&piece->velocity,&robot->mtype.phys_info.velocity,fl2f(.55f));
    if(piece->room>=0){int found=find_point_seg(&piece->pos,piece->room);if(found>=0)piece->room=found;else {piece->pos=robot->pos;piece->room=robot->segnum;}}
}
static void ac_launch(const object *robot,int part,int explosion){
    ac_fragment *piece=&ac_fragments[ac_serial++%AC_FRAGMENTS];ac_init_fragment(piece,robot,part,explosion);
    EM_ASM(Module.componentSheds=(Module.componentSheds||0)+1;);
}
static void ac_advance(ac_fragment *piece,float age,int preview){
    int steps=0;while(piece->age+.0001f<age&&steps++<220){
        float dt=fminf(.035f,age-piece->age);piece->age+=dt;if(piece->bounces>=4)continue;
        vms_vector next;vm_vec_scale_add(&next,&piece->pos,&piece->velocity,fl2f(dt));
        if(preview){
            fix *p=&next.x,*v=&piece->velocity.x;const fix bounds[3][2]={{-16*F1_0,16*F1_0},{-8*F1_0,8*F1_0},{6*F1_0,70*F1_0}};
            for(int k=0;k<3;k++)if(p[k]<bounds[k][0]||p[k]>bounds[k][1]){p[k]=p[k]<bounds[k][0]?bounds[k][0]:bounds[k][1];v[k]=-fixmul(v[k],fl2f(.48f));piece->bounces++;}
            piece->pos=next;continue;
        }
        if(piece->room<0||piece->room>Highest_segment_index){piece->bounces=4;continue;}
        float radius=fminf(.6f,fmaxf(.12f,f2fl(piece->robot.size)*.08f));
        fvi_query query={&piece->pos,&next,piece->room,fl2f(radius),-1,NULL,0};fvi_info hit;
        int result=find_vector_intersection(&query,&hit);
        if(result==HIT_WALL){
            piece->normal=hit.hit_wallnorm;if(vm_vec_normalize(&piece->normal)<F1_0/100){piece->bounces=4;continue;}
            piece->hit=hit.hit_pnt;vm_vec_scale_add(&piece->pos,&hit.hit_pnt,&piece->normal,fl2f(radius+.03f));
            piece->room=hit.hit_seg>=0?hit.hit_seg:piece->room;piece->bounces++;
            fix dot=vm_vec_dot(&piece->velocity,&piece->normal);vm_vec_scale_add2(&piece->velocity,&piece->normal,-2*dot);vm_vec_scale(&piece->velocity,fl2f(.45f));
            piece->struck=piece->born+fl2f(piece->age);
            astra_environment_hit(hit.hit_side_seg,hit.hit_side,&piece->hit,radius*1.5f);
            EM_ASM(Module.componentWallHits=(Module.componentWallHits||0)+1;);
        }else if(result==HIT_NONE){piece->pos=next;if(hit.hit_seg>=0)piece->room=hit.hit_seg;vm_vec_scale(&piece->velocity,fl2f(1-dt*.13f));}
        else piece->bounces=4;
    }
}
static void ac_render_robot(object *robot,int mask){
    object *saved=astra_robot_object;int saved_id=astra_robot_id,oldmask=ac_fragment_mask;
    extern int astra_hull;int hull=astra_hull;astra_hull=1;
    astra_robot_object=robot;astra_robot_id=robot->id;ac_fragment_mask=mask;
    g3s_lrgb light={F1_0,F1_0,F1_0};fix glow[2]={F1_0,0};
    draw_polygon_model(&robot->pos,&robot->orient,robot->rtype.pobj_info.anim_angles,Robot_info[robot->id].model_num,0,light,glow,NULL);
    astra_hull=hull;ac_fragment_mask=oldmask;astra_robot_object=saved;astra_robot_id=saved_id;
}
static void ac_draw_fragment(ac_fragment *piece,float age){
    object robot=piece->robot;float turn=fminf(age,2.5f)*piece->spin/(1+piece->bounces*.35f);
    vms_angvec angle={(fixang)(turn*3500),(fixang)(turn*4700),(fixang)(turn*6100)};vms_matrix spin;vm_angles_2_matrix(&spin,&angle);
    vm_matrix_x_matrix(&robot.orient,&piece->robot.orient,&spin);
    vms_vector offset=ac_world(&piece->pivot,&robot.orient);vm_vec_sub(&robot.pos,&piece->pos,&offset);
    ac_render_robot(&robot,1u<<piece->part);
    if(piece->struck){ad_piece spark={0};spark.hit=piece->hit;spark.normal=piece->normal;spark.struck=piece->struck;ad_sparks(&spark,age,piece->seed);}
}
void astra_combat_fragments(const short *rooms,int count,int window_num){
    if(astra_preview_active)return;int rendered=0;
    for(int i=0;i<AC_FRAGMENTS;i++){
        ac_fragment *piece=&ac_fragments[i];float age=(double)(GameTime64-piece->born)/F1_0;
        if(!piece->life||age<0||age>piece->life)continue;ac_advance(piece,age,0);
        int room=0;while(room<count&&rooms[room]!=piece->room)room++;if(room==count)continue;
        g3s_point view;g3_rotate_point(&view,&piece->pos);if(view.p3_z<F1_0/2||view.p3_z>i2f(160))continue;
        ac_draw_fragment(piece,age);rendered++;
        if(!window_num&&piece->struck&&GameTime64-piece->struck<F1_0/12){
            static fix64 last;if(GameTime64-last>F1_0/6){last=GameTime64;digi_link_sound_to_pos2(SOUND_LASER_HIT_CLUTTER,piece->room,0,&piece->hit,0,F1_0/16,i2f(65));}
        }
    }
    EM_ASM(Module.componentFragments=$0;,rendered);
}
void astra_combat_showcase(int mode,float clock){
    ax_count=0;ax_energy=0;
    ax_paint(.08f,.12f,.15f,0);aw_quad(-20,-10,8,-20,10,80,1);aw_quad(20,-10,8,20,10,80,1);
    aw_quad(-20,-10,8,20,-10,80,2);aw_quad(-20,10,8,20,10,80,2);aw_quad(-20,-10,80,20,10,80,0);
    for(int side=-1;side<=1;side+=2)for(int i=0;i<6;i++){ax_paint(.05f,.46f,.59f,.65f);ax_tube(side*19.8f,-7,12+i*11,side*19.8f,7,12+i*11,.045f,.045f,5);}
    ax_flush(1,1);if(mode==1)return;
    int id=EM_ASM_INT(return Module.combatRobot|0);if(id<0||id>=N_robot_types)id=0;
    object robot;memset(&robot,0,sizeof robot);robot.id=id;robot.type=OBJ_ROBOT;robot.render_type=RT_POLYOBJ;robot.segnum=-1;robot.signature=31041+id*13;
    robot.rtype.pobj_info.model_num=Robot_info[id].model_num;robot.size=Polygon_models[Robot_info[id].model_num].rad;
    robot.pos.z=fl2f(fmaxf(12,f2fl(robot.size)*2.9f));robot.pos.y=fl2f(2.1f);
    vms_angvec angles={-2400,1000,30000};vm_angles_2_matrix(&robot.orient,&angles);
    unsigned available=ac_available(&robot),missing=0;int pieces=0;
    int order[3]={1+(id&1),3,6};if(!(available&(1u<<3)))order[1]=4;
    if(mode==2){if(clock>=2)missing=available;}
    else for(int i=0;i<3;i++)if(clock>=2+i*2)missing|=available&(1u<<order[i]);
    ac_preview_damage=mode==2?(clock>=2?.99f:0):clock<2?0:clock<4?.34f:clock<6?.65f:.88f;
    ac_preview_mask=missing;robot.shields=fixmul(Robot_info[id].strength,fl2f(1-ac_preview_damage));
    if(mode!=2||clock<2){ac_render_robot(&robot,-1);astra_draw_mechanisms(&robot);}
    for(int part=0;part<AC_PARTS;part++)if(missing&(1u<<part)){
        float onset=2;if(mode!=2){for(int j=0;j<3;j++)if(order[j]==part){onset=2+j*2;break;}}
        ac_fragment piece;ac_init_fragment(&piece,&robot,part,mode==2);float age=clock-onset;
        if(age<piece.life){ac_advance(&piece,age,1);ac_draw_fragment(&piece,age);pieces++;}
    }
    if(mode==2&&clock>=2&&clock<4.4f)astra_blast(&robot.pos,fixmul(robot.size,fl2f(1.05f)),(clock-2)/2.4f,ac_hash(robot.signature),3,1);
    EM_ASM(Module.combatPreview=({version:31,damage:$0,robot:$1,missing:$2,pieces:$3,mode:$4});,ac_preview_damage,id,missing,pieces,mode);
    ac_preview_damage=-1;ac_preview_mask=-1;
}
