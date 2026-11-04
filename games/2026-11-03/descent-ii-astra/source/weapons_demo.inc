/* Cockpit firing range. Native muzzle coordinates, speed and fire cadence;
 * presentation objects never enter the mission or spend its ammunition. */
static const int aw_ids[]={LASER_ID_L1,LASER_ID_L4,LASER_ID_L6,VULCAN_ID,GAUSS_ID,SPREADFIRE_ID,PLASMA_ID,FUSION_ID,HELIX_ID,PHOENIX_ID,OMEGA_ID,CONCUSSION_ID,HOMING_ID,SMART_ID,MEGA_ID,FLASH_ID,GUIDEDMISS_ID,MERCURY_ID,EARTHSHAKER_ID};
static const int aw_primary[]={0,0,0,1,6,2,3,4,7,8,9};
static const int aw_secondary[]={0,1,3,4,5,6,8,9};
static void aw_quad(float x,float y,float z,float X,float Y,float Z,int side){
    float p[4][3]={{x,y,z},{X,y,z},{X,Y,Z},{x,Y,Z}},n[3]={0,0,-1};
    if(side==1){float q[4][3]={{x,y,z},{x,Y,z},{X,Y,Z},{X,y,Z}};memcpy(p,q,sizeof p);n[0]=x<0?1:-1;n[2]=0;}
    if(side==2){float q[4][3]={{x,y,z},{X,y,z},{X,Y,Z},{x,Y,Z}};memcpy(p,q,sizeof p);n[1]=y<0?1:-1;n[2]=0;}
    const int order[]={0,1,2,0,2,3};for(int i=0;i<6;i++)ax_vertex_add(p[order[i]][0],p[order[i]][1],p[order[i]][2],n[0],n[1],n[2]);
}
void astra_weapon_showcase(int index,float clock){
    if(index<0||index>=19)return;
    static int selected=-1,sounded=-1;static float began,last_clock;
    if(selected!=index||clock<last_clock){selected=index;began=clock;sounded=-1;digi_stop_digi_sounds();}
    last_clock=clock;float elapsed=clock-began;int id=aw_ids[index];weapon_info *wi=&Weapon_info[id];
    float cadence=fmaxf(.06f,f2fl(wi->fire_wait));if(id==FUSION_ID)cadence=1.25f;
    if(id==OMEGA_ID)cadence=.12f;
    int volley=(int)floorf(elapsed/cadence);
    if(volley!=sounded){if(wi->flash_sound>=0)digi_play_sample(wi->flash_sound,F1_0/3);sounded=volley;}
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
    float speed=fmaxf(1,f2fl(wi->speed[Difficulty_level]));
    int missiles=index>=11,lanes=missiles||id==VULCAN_ID||id==GAUSS_ID||id==OMEGA_ID?1:id==SPREADFIRE_ID?3:id==HELIX_ID?5:2;
    int visible=0;
    for(int n=0;n<32;n++){
        int serial=volley-n;if(serial<0)break;
        float age=elapsed-serial*cadence;if(age*speed>175)break;
        for(int lane=0;lane<lanes;lane++){
            int gun=missiles?Secondary_weapon_to_gun_num[aw_secondary[index-11]]:lanes==2?lane:6;
            if(id==OMEGA_ID)gun=1;
            if(missiles&&gun==4)gun+=serial&1;
            vms_vector muzzle=Player_ship->gun_points[gun],direction={0,0,F1_0};
            if(id==SPREADFIRE_ID){if(serial&1)direction.x=fl2f((lane-1)/16.f);else direction.y=fl2f((lane-1)/16.f);}
            if(id==HELIX_ID){float angle=(serial%8)*3.14159265f/8;direction.x=fl2f((lane-2)*cosf(angle)/16);direction.y=fl2f((lane-2)*sinf(angle)/16);}
            if(id==VULCAN_ID||id==GAUSS_ID){float spread=id==GAUSS_ID?.0025f:.0125f;direction.x=fl2f(sinf(serial*17.3f)*spread);direction.y=fl2f(cosf(serial*31.1f)*spread);}
            vm_vec_normalize(&direction);
            if(id==OMEGA_ID && age>.075f)continue;
            int chain=id==OMEGA_ID?36:1;
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
                if(shot.render_type==RT_POLYOBJ&&wi->model_num>=0){
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
    EM_ASM(Module.weaponDemoCoverage=Module.weaponDemoCoverage||{};Module.weaponDemoCoverage[$0]=true;Module.weaponDemoId=$1;Module.weaponRange=({version:13,cockpit:true,lanes:$2,speed:$3,cadence:$4,visible:$5,renderType:$6,matter:$7,model:$8});,index,id,lanes,speed,cadence,visible,wi->render_type,wi->matter,wi->model_num);
}
