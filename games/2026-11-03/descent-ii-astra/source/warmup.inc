/* Prepare the exact gameplay programs before simulation starts. No rendered
 * frames, random numbers, inputs or physics are advanced during preparation.
 * Existing lazy initializers remain the fallback for non-Astra renderers. */
static void aw_stream_reset(void);
static void aw_progress(const char *phase,const char *label,int done,int total){
    EM_ASM({const phase=UTF8ToString($0);if(phase==="effects")Module.graphicsWarmup.steps=$2;window.astraLoad?.progress(phase,UTF8ToString($1),$2,$3);},phase,label,done,total);
    emscripten_sleep(0);
}
/* Whole-mine preparation, selected by the launcher with Module.fullWarmup.
 * Decoding a 1024-pixel map takes tens of milliseconds, so first sight of a
 * new robot or surface used to stall the flight. Here everything this mine can
 * show is decoded behind the loading screen instead. It costs load time and
 * graphics memory; without the flag the bounded warm-up below is unchanged. */
#include "fuelcen.h"
static void aw_warm_surface(grs_bitmap *bm){
    ogl_loadbmtexture(bm);
    ogl_texture *t=bm->gltexture;
    if(t&&t->handle){
        if(t->faithful>=20&&t->faithful<39)ag_load(t->faithful-20);
        else if(!t->faithful_detail&&t->material>0&&t->material<256)astra_prepare_normal(t->material);
    }
    glActiveTexture(GL_TEXTURE0);
}
static void aw_warm_robot(int type){
    int model=Robot_info[type].model_num;
    if(model>=0&&model<N_polygon_models){
        polymodel *pm=&Polygon_models[model];
        for(int j=0;j<pm->n_textures;j++){
            int slot=pm->first_texture+j;
            if(slot<0||slot>=MAX_OBJ_BITMAPS||ObjBitmapPtrs[slot]>=MAX_OBJ_BITMAPS)continue;
            bitmap_index bm=ObjBitmaps[ObjBitmapPtrs[slot]];
            if(bm.index>=Num_bitmap_files)continue;
            PIGGY_PAGE_IN(bm);aw_warm_surface(&GameBitmaps[bm.index]);
        }
    }
    object probe;memset(&probe,0,sizeof probe);probe.type=OBJ_ROBOT;probe.id=type;
    int id=ac_model(&probe);
    if(id>=0&&id<32&&af_load_mesh(id)){
        astra_chassis *ch=&af_models[id];
        if(!ch->buffer){glGenBuffers(1,&ch->buffer);glBindBuffer(GL_ARRAY_BUFFER,ch->buffer);glBufferData(GL_ARRAY_BUFFER,ch->size,ch->bytes,GL_STATIC_DRAW);af_uploads++;}
        for(int b=0;b<ch->count;b++)af_bind(ch->group[b].mat);
    }
}
static void aw_warm_pickup(int id){
    if(ap_bad||id<0||id>=53||ap_buffer[id]||!ap_count[id])return;
    glGenBuffers(1,&ap_buffer[id]);glBindBuffer(GL_ARRAY_BUFFER,ap_buffer[id]);glBufferData(GL_ARRAY_BUFFER,ap_count[id]*44,ap_data[id],GL_STATIC_DRAW);ap_uploads++;
}
static void astra_warm_whole_mine(void){
    int surfaces=0,total=0,ships=0;
    /* Every bitmap Descent paged in for this mine: walls, doors, animation
     * frames, robot paint, weapons, pickups and effects, with their detail maps. */
    for(int i=0;i<Num_bitmap_files;i++)if(!(GameBitmaps[i].bm_flags&BM_FLAG_PAGED_OUT))total++;
    for(int i=0;i<Num_bitmap_files;i++){
        if(GameBitmaps[i].bm_flags&BM_FLAG_PAGED_OUT)continue;
        aw_warm_surface(&GameBitmaps[i]);
        if(++surfaces%24==0||surfaces==total)aw_progress("textures","Preparing every surface in this mine",surfaces,total);
    }
    if(EM_ASM_INT(return !!Module.overload)){
        /* The loader mounts exactly the scenery maps and robots of this stage.
         * A destroyed robot breaks up through the Descent model of the same
         * type, so that model's paint and chassis are prepared as well. */
        int maps=0,mounted=0;char name[32];
        for(int id=0;id<512;id++){snprintf(name,sizeof name,"om%d.png",id);if(PHYSFS_exists(name))mounted++;}
        for(int id=0;id<512;id++){
            snprintf(name,sizeof name,"om%d.png",id);if(!PHYSFS_exists(name))continue;
            ov_bind(id);maps++;
            if(maps%4==0||maps==mounted)aw_progress("textures","Preparing every surface in this mine",maps,mounted);
        }
        unsigned char robot[MAX_ROBOT_TYPES]={0};
        for(int id=0;id<26;id++){
            snprintf(name,sizeof name,"ovrobot%d.mesh",id);
            if(!PHYSFS_exists(name)||!ov_robot_mesh(id))continue;
            for(int b=0;b<ov_robots[id].count;b++)ov_robot_bind(ov_robots[id].group[b].mat);
            robot[id]=1;
        }
        for(int i=0;i<=Highest_object_index;i++)if(Objects[i].type==OBJ_ROBOT&&Objects[i].id<MAX_ROBOT_TYPES)robot[Objects[i].id]=1;
        int types=0;for(int id=0;id<MAX_ROBOT_TYPES;id++)types+=robot[id];
        for(int id=0;id<N_robot_types&&id<MAX_ROBOT_TYPES;id++){
            if(!robot[id])continue;
            aw_warm_robot(id);
            ships++;aw_progress("textures","Preparing every ship in this mine",ships,types);
        }
    }else{
        /* Robots placed in the mine, built by its materialization centers,
         * or released by another robot when it is destroyed. */
        unsigned char robot[MAX_ROBOT_TYPES]={0};int types=0;
        for(int i=0;i<=Highest_object_index;i++){
            object *o=&Objects[i];if(o->type!=OBJ_ROBOT)continue;
            if(o->id<N_robot_types&&o->id<MAX_ROBOT_TYPES)robot[o->id]=1;
            if(o->contains_type==OBJ_ROBOT&&o->contains_count>0&&o->contains_id>=0&&o->contains_id<N_robot_types&&o->contains_id<MAX_ROBOT_TYPES)robot[o->contains_id]=1;
        }
        for(int c=0;c<Num_robot_centers&&c<MAX_ROBOT_CENTERS;c++)
            for(int id=0;id<N_robot_types&&id<64&&id<MAX_ROBOT_TYPES;id++)
                if(RobotCenters[c].robot_flags[id>>5]&(1u<<(id&31)))robot[id]=1;
        for(int pass=0;pass<3;pass++)for(int id=0;id<N_robot_types&&id<MAX_ROBOT_TYPES;id++){
            const robot_info *r=&Robot_info[id];
            if(robot[id]&&r->contains_type==OBJ_ROBOT&&r->contains_count>0&&r->contains_id>=0&&r->contains_id<N_robot_types&&r->contains_id<MAX_ROBOT_TYPES)robot[r->contains_id]=1;
        }
        for(int id=0;id<MAX_ROBOT_TYPES;id++)types+=robot[id];
        for(int id=0;id<MAX_ROBOT_TYPES;id++){
            if(!robot[id])continue;
            aw_warm_robot(id);
            const robot_info *r=&Robot_info[id];
            if(r->contains_type==OBJ_POWERUP&&r->contains_count>0)aw_warm_pickup(r->contains_id);
            aw_progress("textures","Preparing every ship in this mine",++ships,types);
        }
    }
    for(int i=0;i<=Highest_object_index;i++){
        object *o=&Objects[i];
        if(o->type==OBJ_POWERUP)aw_warm_pickup(o->id);
        if(o->type==OBJ_ROBOT&&o->contains_type==OBJ_POWERUP&&o->contains_count>0)aw_warm_pickup(o->contains_id);
    }
    glActiveTexture(GL_TEXTURE0);
    EM_ASM({Module.graphicsWarmup.whole=({surfaces:$0,ships:$1});},surfaces,ships);
}
static void astra_warm_entry_art(void){
    /* Only artwork already mounted for this mine. Never fetch the full library. */
    int families=0,rooms=0,totalFamilies=0;
    for(int id=0;id<19;id++){char name[24];snprintf(name,sizeof name,"g%02d.png",id);if(PHYSFS_exists(name))totalFamilies++;}
    for(int id=0;id<19;id++){
        char name[24];snprintf(name,sizeof name,"g%02d.png",id);
        if(PHYSFS_exists(name)){ag_load(id);families++;aw_progress("textures","Preparing shared surface detail",families,totalFamilies);}
    }
    if(!gantryTexture&&PHYSFS_exists("forge.png"))refit_png("forge.png",&gantryTexture,GL_REPEAT);
    af_bind(2);
    /* Upload a bounded neighborhood of the actual spawn, not every bitmap. */
    int start=-1;
    for(int i=0;i<=Highest_object_index;i++)if(Objects[i].type==OBJ_PLAYER){
        if(start<0)start=Objects[i].segnum;
        if(Objects[i].id==Player_num){start=Objects[i].segnum;break;}
    }
    if(start>=0&&start<=Highest_segment_index){
        unsigned char seen[MAX_SEGMENTS]={0},depth[32]={0};int queue[32],tail=1;queue[0]=start;seen[start]=1;
        for(int head=0;head<tail;head++)for(int side=0;side<6;side++){
            int child=Segments[queue[head]].children[side];
            if(depth[head]<4&&child>=0&&child<=Highest_segment_index&&!seen[child]&&tail<32){seen[child]=1;queue[tail]=child;depth[tail++]=depth[head]+1;}
        }
        for(int head=0;head<tail;head++){
            int room=queue[head];rooms++;
            for(int side=0;side<6;side++){
                int textures[2]={Segments[room].sides[side].tmap_num,Segments[room].sides[side].tmap_num2&0x3fff};
                for(int k=0;k<2;k++)if((k==0||textures[k])&&textures[k]>=0&&textures[k]<NumTextures){
                    bitmap_index bm=Textures[textures[k]];PIGGY_PAGE_IN(bm);ogl_loadbmtexture(&GameBitmaps[bm.index]);
                }
            }
            aw_progress("textures","Preparing the starting rooms",head+1,tail);
        }
        int nearby=0,prepared=0;
        for(int i=0;i<=Highest_object_index;i++){
            object *o=&Objects[i];if(o->segnum>=0&&o->segnum<=Highest_segment_index&&seen[o->segnum]&&(o->type==OBJ_ROBOT||o->type==OBJ_POWERUP))nearby++;
        }
        for(int i=0;i<=Highest_object_index;i++){
            object *o=&Objects[i];if(o->segnum<0||o->segnum>Highest_segment_index||!seen[o->segnum]||(o->type!=OBJ_ROBOT&&o->type!=OBJ_POWERUP))continue;
            if(o->type==OBJ_ROBOT&&o->id<N_robot_types){
                int id=ac_model(o);if(id>=0&&id<32&&af_load_mesh(id)){
                    astra_chassis *ch=&af_models[id];
                    if(!ch->buffer){glGenBuffers(1,&ch->buffer);glBindBuffer(GL_ARRAY_BUFFER,ch->buffer);glBufferData(GL_ARRAY_BUFFER,ch->size,ch->bytes,GL_STATIC_DRAW);af_uploads++;}
                    for(int b=0;b<ch->count;b++)af_bind(ch->group[b].mat);
                }
            }
            if(o->type==OBJ_POWERUP&&!ap_bad&&o->id<53&&!ap_buffer[o->id]){
                int id=o->id;glGenBuffers(1,&ap_buffer[id]);glBindBuffer(GL_ARRAY_BUFFER,ap_buffer[id]);glBufferData(GL_ARRAY_BUFFER,ap_count[id]*44,ap_data[id],GL_STATIC_DRAW);ap_uploads++;
            }
            aw_progress("textures","Preparing nearby ships and collectibles",++prepared,nearby);
        }
    }
    if(EM_ASM_INT(return !!Module.fullWarmup))astra_warm_whole_mine();
    glBindBuffer(GL_ARRAY_BUFFER,0);
    EM_ASM({Module.graphicsWarmup.families=$0;Module.graphicsWarmup.rooms=$1;Module.fleetMeshUploads=$2;Module.pickupMeshUploads=$3;},families,rooms,af_uploads,ap_uploads);
}
void astra_warm_graphics(void){
    static int programs_prepared;static unsigned loads;
    if(!EM_ASM_INT(return !!Module.astra))return;
    EM_ASM({Module.graphicsWarmup=({start:performance.now(),steps:0,ready:false,loads:$0});window.astraTerminal?.loading(true);},++loads);
    emscripten_sleep(0);int steps=0;
    if(!programs_prepared){
    if(!astra_program&&!astra_gpu_failed)astra_init_shader();
    if(!fleet_program&&!fleet_failed)af_program_init();
    if(!ap_ready)ap_init();
    astra_pyro_ready();pyro_prepare_buffers();steps=4;aw_progress("effects","Preparing lighting, weapons and explosions",steps,24);
    warm_astra_light_face();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_ae_wall_finish();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_ae_haze_flush();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_afx_finish();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_ag_rock_flush();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_astra_smooth_edges();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_astra_draw_pyro();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_ax_flush();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_ai_wall();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_nd_surface();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_ml_installation();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_nb_room();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_astra_room_materials();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_astra_liquid_face();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_af_flush_tinted();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_astra_recharge_face();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_ss_start();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_astra_gantry();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    warm_astra_lens();
    aw_progress("effects","Preparing lighting, weapons and explosions",++steps,24);
    sc_ready();aw_progress("effects","Lighting, weapons and explosions ready",24,24);
        programs_prepared=1;
    }else aw_progress("effects","Lighting, weapons and explosions cached",24,24);
    astra_warm_entry_art();
    aw_stream_reset();
    glUseProgram(0);glBindFramebuffer(GL_FRAMEBUFFER,0);glBindBuffer(GL_ARRAY_BUFFER,0);glActiveTexture(GL_TEXTURE0);
    EM_ASM({Module.graphicsWarmup.ms=performance.now()-Module.graphicsWarmup.start;Module.graphicsWarmup.ready=true;window.astraLoad?.finish();});
}

#include "astra_room_stream.inc"
