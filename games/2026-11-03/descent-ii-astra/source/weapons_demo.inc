/* Isolated presentation range: the same projectile renderer as the mine,
 * without creating gameplay objects or touching inventory and simulation RNG. */
void astra_weapon_showcase(int index,float clock){
    static const int ids[]={LASER_ID_L1,LASER_ID_L4,LASER_ID_L6,VULCAN_ID,GAUSS_ID,SPREADFIRE_ID,PLASMA_ID,FUSION_ID,HELIX_ID,PHOENIX_ID,OMEGA_ID,CONCUSSION_ID,HOMING_ID,SMART_ID,MEGA_ID,FLASH_ID,GUIDEDMISS_ID,MERCURY_ID,EARTHSHAKER_ID};
    if(index<0||index>=19)return;int id=ids[index];weapon_info *wi=&Weapon_info[id];
    ax_count=0;
    ax_paint(.025f,.13f,.17f,.45f);
    for(int i=-6;i<=6;i++)ax_tube(i*4,-4,8,i*4,-4,44,.025f,.025f,4);
    for(int i=0;i<10;i++)ax_tube(-24,-4,8+i*4,24,-4,8+i*4,.025f,.025f,4);
    ax_paint(.11f,.20f,.24f,0);ax_tube(12,-4,14,12,0,14,.6f,.4f,16);
    ax_ring(12,0,14,3.2f,.12f,0,6.2831853f,2);ax_ring(12,0,14,2.5f,.07f,0,6.2831853f,2);
    ax_paint(.13f,.63f,.76f,.9f);ax_ring(12,0,14,3.23f,.03f,-clock*.7f,4.5f,2);
    /* Three metal emitter rails show scale and the direction of travel. */
    for(int i=0;i<3;i++){
        float a=i*2.0944f+clock*.4f,y=cosf(a)*1.1f,z=32+sinf(a)*1.1f;
        ax_paint(.24f,.32f,.38f,0);ax_tube(-15,y,z,-12,y,z,.25f,.17f,12);
        ax_paint(.10f,.65f,.89f,.9f);ax_tube(-14.7f,y,z,-14.3f,y,z,.26f,.26f,12);
    }
    ax_flush(1,1);
    int count=id==OMEGA_ID?22:(id==VULCAN_ID||id==GAUSS_ID)?7:4;
    float cycle=fmodf(clock,2.4f);
    for(int n=0;n<count;n++){
        float t=id==OMEGA_ID?n/(float)(count-1):fmodf(cycle+n*2.4f/count,2.4f)/2.4f;
        object shot;memset(&shot,0,sizeof shot);shot.type=OBJ_WEAPON;shot.id=id;shot.segnum=-1;shot.signature=index*37+n;
        shot.size=fl2f(id==FUSION_ID?2.f:id>=CONCUSSION_ID&&wi->matter?1.4f:1.1f);
        shot.pos=(vms_vector){fl2f(-12+24*t),0,fl2f(32-18*t)};
        vms_vector direction={fl2f(.8f),0,fl2f(-.6f)};vm_vector_2_matrix(&shot.orient,&direction,&vmd_identity_matrix.uvec,NULL);
        shot.movement_type=MT_PHYSICS;vm_vec_copy_scale(&shot.mtype.phys_info.velocity,&direction,i2f(100));
        shot.ctype.laser_info.creation_time=GameTime64-fl2f(.08f+t*.4f);shot.ctype.laser_info.parent_type=OBJ_PLAYER;
        shot.render_type=wi->render_type==WEAPON_RENDER_POLYMODEL?RT_POLYOBJ:wi->render_type==WEAPON_RENDER_LASER?RT_LASER:RT_WEAPON_VCLIP;
        shot.rtype.pobj_info.model_num=wi->model_num;
        if(!astra_draw_weapon(&shot)&&shot.render_type==RT_POLYOBJ&&wi->model_num>=0){
            extern int astra_hull;int saved=astra_hull;astra_hull=0;
            g3s_lrgb light={F1_0,F1_0,F1_0};fix glow[2]={F1_0,0};
            draw_polygon_model(&shot.pos,&shot.orient,NULL,wi->model_num,0,light,glow,NULL);astra_hull=saved;
        }
    }
    /* Modest impact plume, leaving the projectiles visible throughout. */
    vms_vector hit={i2f(12),0,i2f(14)};
    astra_blast(&hit,fl2f(1.5f),fmodf(clock,1.2f)/1.2f,9147+index*73,index%8,0);
    EM_ASM(Module.weaponDemoCoverage=Module.weaponDemoCoverage||{};Module.weaponDemoCoverage[$0]=true;Module.weaponDemoId=$1;,index,id);
}
