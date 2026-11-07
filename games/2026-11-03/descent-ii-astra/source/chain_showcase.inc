/* The same hull sections and swept contact functions run in the display bay
 * and live mines. Preview pieces are local values, so seeking/replay is exact
 * and never adds fragments, damage or pickups to the paused campaign. */
void astra_component_lights(int room,const vms_vector *center,float rank[3],float pos[3][4],float colors[3][4]){
    for(int i=0;i<AC_FRAGMENTS;i++){
        ac_fragment *p=&ac_fragments[i];if(!p->impact||p->room!=room)continue;
        float age=(double)(GameTime64-p->born)/F1_0-p->impact_age;if(age<0||age>.65f)continue;
        float power=.8f*expf(-age*5)*(1-age/.65f),distance=f2fl(vm_vec_dist_quick(center,&p->hit));
        float weight=power/(1+distance*distance/144);int k=0;for(int j=1;j<3;j++)if(rank[j]<rank[k])k=j;
        if(weight<=rank[k])continue;rank[k]=weight;
        pos[k][0]=f2fl(p->hit.x);pos[k][1]=f2fl(p->hit.y);pos[k][2]=f2fl(p->hit.z);pos[k][3]=12;
        colors[k][0]=power;colors[k][1]=power*.46f;colors[k][2]=power*.10f;colors[k][3]=1;
    }
}
void astra_chain_showcase(int profile,float seconds,float length,unsigned seed){
    float t=fmaxf(0,seconds)/length,glow=seconds>=0&&t<1?astra_pattern_light(profile,t):0;
    ax_count=0;ax_energy=0;
    ax_paint(.055f+glow*.085f,.085f+glow*.026f,.11f,.02f);
    aw_quad(-20,-10,8,-20,10,80,1);aw_quad(20,-10,8,20,10,80,1);
    aw_quad(-20,-10,8,20,-10,80,2);aw_quad(-20,10,8,20,10,80,2);aw_quad(-20,-10,80,20,10,80,0);
    for(int side=-1;side<=1;side+=2)for(int i=0;i<7;i++){
        ax_paint(.055f,.38f,.52f,.45f);ax_tube(side*19.8f,-9,12+i*10,side*19.8f,9,12+i*10,.045f,.045f,5);
        ax_paint(.35f,.17f,.055f,.18f+glow*.3f);ax_tube(side*19.8f,-9,12+i*10,0,-9,12+i*10,.035f,.035f,5);
    }
    ax_flush(1,1);
    int breakup=astra_chain_breakup(profile),pieces=0,walls=0,ships=0;unsigned missing=0;
    vms_vector center={0,0,48*F1_0};float radius=10.5f*astra_detonations[profile].scale;
    object robot,target;memset(&robot,0,sizeof robot);memset(&target,0,sizeof target);
    if(breakup){
        int id=profile==AB_ARMOR_COOKOFF?40:profile==AB_POD_RUNAWAY?25:profile==AB_SHRAPNEL_RELAY?9:16;
        if(id>=N_robot_types)id=0;
        robot.id=id;robot.type=OBJ_ROBOT;robot.render_type=RT_POLYOBJ;robot.segnum=-1;
        robot.signature=(seed&0x3fffffff)+1;robot.rtype.pobj_info.model_num=Robot_info[id].model_num;
        robot.size=Polygon_models[Robot_info[id].model_num].rad;robot.pos=center;robot.shields=Robot_info[id].strength;
        vms_angvec angles={-1500,1800,29000};vm_angles_2_matrix(&robot.orient,&angles);
        radius=fminf(8,f2fl(robot.size)*.8f)*astra_detonations[profile].scale;
        unsigned available=ac_available(&robot);int aim_part=available&(1u<<1)?1:2;
        ac_fragment guide;ac_init_fragment(&guide,&robot,aim_part,1);
        /* Use the outward piece with the most runway. A hit-aligned impulse
         * can nearly cancel the old, fixed left-wing trajectory. */
        float runway=-1;vms_vector intercept_point={0};
        for(int candidate=0;candidate<AC_PARTS;candidate++)if(available&(1u<<candidate)){
            ac_fragment trial;ac_init_fragment(&trial,&robot,candidate,1);float duration=1.25f;
            for(int k=0;k<3;k++){float p=f2fl((&trial.pos.x)[k]),v=f2fl((&trial.velocity.x)[k]),lo=k==0?-15:k==1?-5:16,hi=k==0?15:k==1?5:72;if(fabsf(v)>.01f){float time=(v>0?hi-p:lo-p)/v;if(time>0)duration=fminf(duration,time);}}
            vms_vector point;vm_vec_scale_add(&point,&trial.pos,&trial.velocity,fl2f(fmaxf(.01f,duration)));float distance=f2fl(vm_vec_dist(&point,&center));
            if(distance>runway){runway=distance;guide=trial;intercept_point=point;}
        }
        target=robot;target.id=0;target.signature=robot.signature^0x40000000;target.rtype.pobj_info.model_num=Robot_info[0].model_num;
        target.size=Polygon_models[Robot_info[0].model_num].rad;
        target.pos=intercept_point;
        ac_render_robot(&target,-1);ac_preview_target=&target;
        float latest_hit=-1;vms_vector soundpoint={0};
        for(int part=0;part<AC_PARTS;part++)if(available&(1u<<part)){
            float onset=profile==AB_POD_RUNAWAY?.18f+part*.11f:profile==AB_LAST_LIGHT?.25f+part*.10f:part*.055f;
            if(seconds<onset)continue;
            missing|=1u<<part;
            ac_fragment piece;ac_init_fragment(&piece,&robot,part,1);piece.chain=1;
            float age=seconds-onset;ac_advance(&piece,age,1);
            if(piece.impact==1)walls++;if(piece.impact==2)ships++;
            if(piece.impact&&piece.impact_age+onset>latest_hit){latest_hit=piece.impact_age+onset;soundpoint=piece.hit;}
            if(seconds<length){ac_draw_fragment(&piece,age);pieces++;}
        }
        ac_preview_target=NULL;
        if(seconds<length)ac_render_robot(&robot,available&~missing);
        static unsigned lastseed;static int lastprofile;static float lastclock;
        if(seed!=lastseed||profile!=lastprofile||seconds<lastclock){lastclock=-1;lastseed=seed;lastprofile=profile;}
        if(!astra_preview_silent&&latest_hit>lastclock&&latest_hit<=seconds&&seconds-latest_hit<.08f)
            astra_death_audio(SOUND_ROBOT_DESTROYED,1,F1_0/6,fl2f(fmaxf(.1f,fminf(.9f,.5f+f2fl(soundpoint.x)/45))));
        lastclock=seconds;
    }
    if(seconds>=0&&seconds<length)astra_pattern_blast(&center,fl2f(radius),t,seed,profile,1);
    EM_ASM(Module.chainPreview=({version:59,number:$0,profile:$1,age:$2,length:$3,seed:$4>>>0,breakup:!!$5,pieces:$6,wallHits:$7,shipHits:$8,missing:$9});,
        profile-AB_FUSE_RUN+1,profile,seconds,length,seed,breakup,pieces,walls,ships,missing);
}
