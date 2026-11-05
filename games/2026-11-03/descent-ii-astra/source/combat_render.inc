/* Shared real-game armor chips and a detached inspection robot. */
void astra_combat_fragments(void){
    if(astra_preview_active)return;
    for(int i=0;i<24;i++){
        ac_shed *shed=&ac_chips[i];float age=(double)(GameTime64-shed->born)/F1_0;
        if(!shed->born||age<0||age>2.4f)continue;
        astra_debris(&shed->origin,F1_0,age,2.4f,shed->seed,3,shed->room,0);
    }
}
void astra_combat_showcase(int mode,float clock){
    ax_count=0;ax_energy=0;
    ax_paint(.08f,.12f,.15f,0);aw_quad(-20,-10,8,-20,10,80,1);aw_quad(20,-10,8,20,10,80,1);
    aw_quad(-20,-10,8,20,-10,80,2);aw_quad(-20,10,8,20,10,80,2);aw_quad(-20,-10,80,20,10,80,0);
    for(int side=-1;side<=1;side+=2)for(int i=0;i<6;i++){
        ax_paint(.05f,.46f,.59f,.65f);ax_tube(side*19.8f,-7,12+i*11,side*19.8f,7,12+i*11,.045f,.045f,5);
    }
    ax_flush(1,1);
    if(mode)return;
    int id=-1;for(int i=0;i<N_robot_types;i++)if(!Robot_info[i].boss_flag&&!Robot_info[i].companion&&Polygon_models[Robot_info[i].model_num].rad<i2f(5)){id=i;break;}
    if(id<0)return;
    object robot;memset(&robot,0,sizeof robot);robot.id=id;robot.type=OBJ_ROBOT;robot.render_type=RT_POLYOBJ;robot.segnum=-1;robot.signature=28041;
    robot.rtype.pobj_info.model_num=Robot_info[id].model_num;robot.size=Polygon_models[Robot_info[id].model_num].rad;
    robot.pos.z=fl2f(fmaxf(5.5f,f2fl(robot.size)*2.25f));robot.pos.y=fl2f(.7f);
    vms_angvec angles={-2400,1000,(fixang)(32768+sinf(clock*.3f)*7000)};vm_angles_2_matrix(&robot.orient,&angles);
    ac_preview_damage=clock<2.5f?0:clock<5?.34f:clock<7.5f?.65f:.88f;
    robot.shields=fixmul(Robot_info[id].strength,fl2f(1-ac_preview_damage));
    object *saved=astra_robot_object;int saved_id=astra_robot_id;astra_robot_object=&robot;astra_robot_id=id;
    g3s_lrgb light={F1_0,F1_0,F1_0};fix glow[2]={F1_0,0};extern int astra_hull;int saved_hull=astra_hull;astra_hull=1;
    draw_polygon_model(&robot.pos,&robot.orient,robot.rtype.pobj_info.anim_angles,robot.rtype.pobj_info.model_num,0,light,glow,NULL);astra_hull=saved_hull;
    astra_draw_mechanisms(&robot);
    astra_robot_object=saved;astra_robot_id=saved_id;
    float t=fmodf(clock,2.5f);
    if(clock>=2.5f&&t<1.8f)for(int i=0;i<4;i++){
        float a=i*1.5708f+.4f;vms_vector p=robot.pos;
        p.x+=fl2f(cosf(a)*(f2fl(robot.size)*.65f+t*3));p.y+=fl2f(sinf(a)*(f2fl(robot.size)*.65f+t*2)-t*t*.6f);p.z-=fl2f(t*2);
        vms_angvec spin={(fixang)(t*9000+i*2000),(fixang)(t*18000),0};g3_start_instance_angles(&p,&spin);
        ax_count=0;ad_chunk(.12f+i*.025f,i,expf(-t*2));ax_flush(1,1-pyro_ramp(1,1.8f,t));g3_done_instance();
    }
    EM_ASM(Module.combatPreview=({version:28,damage:$0,robot:$1});,ac_preview_damage,id);
    ac_preview_damage=-1;
}
