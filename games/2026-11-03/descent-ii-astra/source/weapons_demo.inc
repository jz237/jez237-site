/* Cockpit firing range. Native muzzle coordinates, speed and fire cadence;
 * presentation objects never enter the mission or spend its ammunition. */
static const int aw_ids[]={LASER_ID_L1,LASER_ID_L4,LASER_ID_L6,VULCAN_ID,GAUSS_ID,SPREADFIRE_ID,PLASMA_ID,FUSION_ID,HELIX_ID,PHOENIX_ID,OMEGA_ID,CONCUSSION_ID,HOMING_ID,SMART_ID,MEGA_ID,FLASH_ID,GUIDEDMISS_ID,MERCURY_ID,EARTHSHAKER_ID,SUPERPROX_ID,PROXIMITY_ID};
static const int aw_primary[]={0,0,0,1,6,2,3,4,7,8,9};
static const int aw_secondary[]={0,1,3,4,5,6,8,9,7,2};
static void aw_quad(float x,float y,float z,float X,float Y,float Z,int side){
    float p[4][3]={{x,y,z},{X,y,z},{X,Y,Z},{x,Y,Z}},n[3]={0,0,-1};
    if(side==1){float q[4][3]={{x,y,z},{x,Y,z},{X,Y,Z},{X,y,Z}};memcpy(p,q,sizeof p);n[0]=x<0?1:-1;n[2]=0;}
    if(side==2){float q[4][3]={{x,y,z},{X,y,z},{X,Y,Z},{x,Y,Z}};memcpy(p,q,sizeof p);n[1]=y<0?1:-1;n[2]=0;}
    const int order[]={0,1,2,0,2,3};for(int i=0;i<6;i++)ax_vertex_add(p[order[i]][0],p[order[i]][1],p[order[i]][2],n[0],n[1],n[2]);
}
static vms_vector aw_smart_path(int i,float t,int mine){
    float start=mine?26:64,angle=i*1.04719755f;
    float x=(i%3-1)*13.f,y=i%3==1?6:-2,z=88+i%3*5;
    /* The initial radial launch bends into three distinct target approaches. */
    float bend=sinf(t*3.14159265f)*(1-t);
    return (vms_vector){fl2f(x*t+cosf(angle)*18*bend),fl2f(y*t+sinf(angle)*15*bend),fl2f(start+(z-start)*t)};
}
static void aw_smart_sequence(int mine,float clock){
    int id=mine==2?PROXIMITY_ID:mine?SUPERPROX_ID:SMART_ID,child=Weapon_info[id].children;
    float burst=mine?4.2f:64.f/fmaxf(1,f2fl(Weapon_info[id].speed[Difficulty_level]));
    int phase=clock<2&&mine?0:clock<burst?1:clock<burst+2.4f?2:3;
    static int sound_id=-1,sound_phase=-1;static float sound_clock;
    if(sound_id!=id||clock<sound_clock){sound_id=id;sound_phase=-1;}sound_clock=clock;
    if(sound_phase!=phase){
        if(!astra_preview_silent){int sound=phase==2?Weapon_info[id].wall_hit_sound:phase==(mine?0:1)?Weapon_info[id].flash_sound:-1;if(sound>=0)digi_play_sample(sound,F1_0/3);}
        sound_phase=phase;
    }
    ax_count=0;
    for(int i=0;i<3;i++){
        float x=(i-1)*13.f,y=i==1?6:-2,z=88+i*5;
        ax_paint(.31f,.38f,.42f,0);ax_tube(x,y,z-1,x,y,z+1,1.5f,.85f,8);
        ax_paint(.10f,.64f,.73f,.65f);ax_ring(x,y,z-1.05f,1.35f,.10f,0,6.2831853f,0);
    }ax_flush(1,1);
    if(clock<burst){
        object shot={0};shot.type=OBJ_WEAPON;shot.id=id;shot.segnum=-1;shot.signature=330019;
        shot.size=Weapon_info[id].blob_size;shot.orient=vmd_identity_matrix;
        shot.pos=(vms_vector){0,0,fl2f(mine?26:fmaxf(4,clock*f2fl(Weapon_info[id].speed[Difficulty_level])))};
        shot.lifeleft=Weapon_info[id].lifetime-fl2f(clock);shot.ctype.laser_info.creation_time=GameTime64-fl2f(clock);shot.ctype.laser_info.parent_type=OBJ_PLAYER;
        shot.render_type=mine?RT_WEAPON_VCLIP:RT_POLYOBJ;shot.rtype.pobj_info.model_num=Weapon_info[id].model_num;
        if(!mine){
            shot.mtype.phys_info.velocity.z=Weapon_info[id].speed[Difficulty_level];
            g3s_lrgb light={F1_0,F1_0,F1_0};fix glow[2]={F1_0,0};extern int astra_hull;int old=astra_hull;astra_hull=0;
            draw_polygon_model(&shot.pos,&shot.orient,NULL,Weapon_info[id].model_num,0,light,glow,NULL);astra_hull=old;
        }
        astra_draw_weapon(&shot);
    }else{
        float age=clock-burst;
        if(age<.65f){vms_vector origin={0,0,fl2f(mine?26:64)};astra_blast(&origin,fl2f(mine?3.5f:5),age/.65f,330017,3,0);}
        for(int i=0;i<(mine==2?0:6);i++){
            float t=(age-i*.035f)/2.2f;if(t<0||t>1)continue;
            object shot={0};shot.type=OBJ_WEAPON;shot.id=child;shot.segnum=-1;shot.signature=330100+i;shot.pos=aw_smart_path(i,t,mine);
            vms_vector next=aw_smart_path(i,fminf(1,t+.01f),mine),direction;vm_vec_normalized_dir(&direction,&next,&shot.pos);
            vm_vector_2_matrix(&shot.orient,&direction,NULL,NULL);vm_vec_copy_scale(&shot.mtype.phys_info.velocity,&direction,Weapon_info[child].speed[Difficulty_level]);
            shot.size=Weapon_info[child].blob_size;shot.render_type=RT_WEAPON_VCLIP;shot.ctype.laser_info.creation_time=GameTime64-fl2f(age);shot.ctype.laser_info.parent_type=OBJ_PLAYER;
            astra_draw_weapon(&shot);
        }
        if(mine!=2&&age>2.2f&&age<2.7f)for(int i=0;i<3;i++){vms_vector p=aw_smart_path(i,1,mine);astra_blast(&p,i2f(2),(age-2.2f)/.5f,330200+i,1,0);}
    }
    EM_ASM(Module.smartRange=({version:62,mine:!!$0,phase:$1,children:$3,childId:$2});Module.weaponRange=({version:62,cockpit:true,lanes:1});,mine,phase,child,mine==2?0:6);
}

void astra_weapon_showcase(int index,float clock){
    if(index<0||index>=21)return;
    static int selected=-1,sounded=-1;static float last_clock;
    if(selected!=index||clock<last_clock){selected=index;sounded=-1;digi_stop_digi_sounds();}
    last_clock=clock;float elapsed=clock;int id=aw_ids[index];weapon_info *wi=&Weapon_info[id];
    float cadence=fmaxf(.06f,f2fl(wi->fire_wait));if(id==FUSION_ID)cadence=1.25f;
    if(id==OMEGA_ID)cadence=.12f;
    int volley=(int)floorf(elapsed/cadence);
    if(index!=13&&index<19&&volley!=sounded){if(!astra_preview_silent&&wi->flash_sound>=0)digi_play_sample(wi->flash_sound,F1_0/3);sounded=volley;}
    ax_count=0;
    for(int i=0;i<10;i++){
        float z=5+i*16,Z=z+15.6f;
        ax_paint(.08f,.12f,.15f,0);aw_quad(-22,-12,z,-22,12,Z,1);aw_quad(22,-12,z,22,12,Z,1);
        ax_paint(.075f,.09f,.11f,0);aw_quad(-22,-12,z,22,-12,Z,2);aw_quad(-22,12,z,22,12,Z,2);
        ax_paint(.15f,.24f,.28f,.15f);
        for(int side=-1;side<=1;side+=2){
            ax_tube(side*21.7f,-12,z,side*21.7f,12,z,.2f,.2f,4);
            ax_paint(.08f,.50f,.62f,.65f);ax_tube(side*21.5f,-6,z+1,side*21.5f,-6,Z-1,.045f,.045f,5);
        }
    }
    ax_paint(.14f,.18f,.21f,0);aw_quad(-22,-12,166,22,12,166,0);
    ax_paint(.12f,.37f,.43f,.3f);ax_ring(0,0,165.5f,8,.15f,0,6.2831853f,0);ax_ring(0,0,165.4f,3,.10f,0,6.2831853f,0);
    ax_flush(1,1);
    if(index==13||index>=19){aw_smart_sequence(index==20?2:index==19,clock);return;}
    float speed=fmaxf(1,f2fl(wi->speed[Difficulty_level]));
    int missiles=index>=11,lanes=index==2?4:missiles||id==VULCAN_ID||id==GAUSS_ID?1:id==SPREADFIRE_ID?3:id==HELIX_ID?5:2;
    int visible=0;
    for(int n=0;n<32;n++){
        int serial=volley-n;if(serial<0)break;
        float age=elapsed-serial*cadence;if(age*speed>175)break;
        for(int lane=0;lane<lanes;lane++){
            int gun=missiles?Secondary_weapon_to_gun_num[aw_secondary[index-11]]:lanes==2||lanes==4?lane:6;
            if(id==OMEGA_ID)gun=lane;
            if(missiles&&gun==4)gun+=serial&1;
            vms_vector muzzle=Player_ship->gun_points[gun],direction={0,0,F1_0};
            if(id==SPREADFIRE_ID){if(serial&1)direction.x=fl2f((lane-1)/16.f);else direction.y=fl2f((lane-1)/16.f);}
            if(id==HELIX_ID){float angle=(serial%8)*3.14159265f/8;direction.x=fl2f((lane-2)*cosf(angle)/16);direction.y=fl2f((lane-2)*sinf(angle)/16);}
            if(id==VULCAN_ID||id==GAUSS_ID){float spread=id==GAUSS_ID?.0025f:.0125f;direction.x=fl2f(sinf(serial*17.3f)*spread);direction.y=fl2f(cosf(serial*31.1f)*spread);}
            vm_vec_normalize(&direction);
            if(id==OMEGA_ID && age>.075f)continue;
            if(id==OMEGA_ID){vms_vector goal={0,0,i2f(72)};af_omega_arc(&muzzle,&goal,lane+71,clock);visible++;continue;}
            int chain=1;
            for(int b=0;b<chain;b++){
                float distance=id==OMEGA_ID?3+b*2.f:age*speed;
                object shot;memset(&shot,0,sizeof shot);shot.type=OBJ_WEAPON;shot.id=id;shot.segnum=-1;shot.signature=index*137+serial*7+lane+b;
                shot.size=wi->blob_size;shot.pos=muzzle;vm_vec_scale_add2(&shot.pos,&direction,fl2f(distance));
                if(shot.pos.z>i2f(164))continue;
                vm_vector_2_matrix(&shot.orient,&direction,&vmd_identity_matrix.uvec,NULL);
                shot.movement_type=MT_PHYSICS;vm_vec_copy_scale(&shot.mtype.phys_info.velocity,&direction,fl2f(speed));
                shot.ctype.laser_info.creation_time=GameTime64-fl2f(fmaxf(age,.025f));shot.ctype.laser_info.parent_type=OBJ_PLAYER;
                shot.render_type=wi->render_type==WEAPON_RENDER_POLYMODEL?RT_POLYOBJ:wi->render_type==WEAPON_RENDER_LASER?RT_LASER:RT_WEAPON_VCLIP;
                shot.rtype.pobj_info.model_num=wi->model_num;
                if(shot.render_type==RT_POLYOBJ)shot.size=fixdiv(Polygon_models[wi->model_num].rad,wi->po_len_to_width_ratio);
                if(astra_weapon_missile(&shot)&&wi->model_num>=0){
                    extern int astra_hull;int saved=astra_hull;astra_hull=0;
                    g3s_lrgb light={F1_0,F1_0,F1_0};fix glow[2]={F1_0,0};
                    draw_polygon_model(&shot.pos,&shot.orient,NULL,wi->model_num,0,light,glow,NULL);astra_hull=saved;
                }
                astra_draw_weapon(&shot);
                visible++;
            }
        }
    }
    /* Hits at the far bulkhead stay small enough to read the next volley. */
    float arrival=164/speed,impact=fmodf(elapsed-arrival,cadence);
    if(elapsed>arrival && impact>=0 && impact<fminf(.25f,cadence)){
        vms_vector hit={0,0,i2f(164)};astra_blast(&hit,fl2f(missiles?3.f:.85f),impact/fminf(.25f,cadence),9147+index*73,index%8,0);
    }
    EM_ASM(Module.weaponDemoCoverage=Module.weaponDemoCoverage||{};Module.weaponDemoCoverage[$0]=true;Module.weaponDemoId=$1;Module.weaponRange=({version:14,cockpit:true,lanes:$2,speed:$3,cadence:$4,visible:$5,renderType:$6,matter:$7,model:$8});,index,id,lanes,speed,cadence,visible,wi->render_type,wi->matter,wi->model_num);
}
