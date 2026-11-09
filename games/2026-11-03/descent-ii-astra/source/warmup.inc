/* Prepare the exact gameplay programs before simulation starts. No rendered
 * frames, random numbers, inputs or physics are advanced during preparation.
 * Existing lazy initializers remain the fallback for non-Astra renderers. */
static void astra_warm_entry_art(void){
    /* Only artwork already mounted for this mine. Never fetch the full library. */
    int families=0,rooms=0;
    for(int id=0;id<19;id++){
        char name[24];snprintf(name,sizeof name,"g%02d.png",id);
        if(PHYSFS_exists(name)){ag_load(id);families++;emscripten_sleep(0);}
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
        for(int head=0;head<tail;head++){
            int room=queue[head];rooms++;
            for(int side=0;side<6;side++){
                int textures[2]={Segments[room].sides[side].tmap_num,Segments[room].sides[side].tmap_num2&0x3fff};
                for(int k=0;k<2;k++)if((k==0||textures[k])&&textures[k]>=0&&textures[k]<NumTextures){
                    bitmap_index bm=Textures[textures[k]];PIGGY_PAGE_IN(bm);ogl_loadbmtexture(&GameBitmaps[bm.index]);
                }
                int child=Segments[room].children[side];
                if(depth[head]<4&&child>=0&&child<=Highest_segment_index&&!seen[child]&&tail<32){seen[child]=1;queue[tail]=child;depth[tail++]=depth[head]+1;}
            }
            emscripten_sleep(0);
        }
        for(int i=0;i<=Highest_object_index;i++){
            object *o=&Objects[i];if(o->segnum<0||o->segnum>Highest_segment_index||!seen[o->segnum])continue;
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
            emscripten_sleep(0);
        }
    }
    glBindBuffer(GL_ARRAY_BUFFER,0);
    EM_ASM({Module.graphicsWarmup.families=$0;Module.graphicsWarmup.rooms=$1;Module.fleetMeshUploads=$2;Module.pickupMeshUploads=$3;},families,rooms,af_uploads,ap_uploads);
}
void astra_warm_graphics(void){
    static int prepared;
    if(prepared||!EM_ASM_INT(return !!Module.astra))return;
    prepared=1;
    EM_ASM({Module.graphicsWarmup=({start:performance.now(),steps:0});window.astraTerminal?.loading(true);const s=document.getElementById('status');if(s)s.textContent='Preparing graphics';});
    emscripten_sleep(0);
    if(!astra_program&&!astra_gpu_failed)astra_init_shader();
    if(!fleet_program&&!fleet_failed)af_program_init();
    if(!ap_ready)ap_init();
    astra_pyro_ready();
    emscripten_sleep(0);
    warm_astra_light_face();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_ae_wall_finish();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_ae_haze_flush();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_afx_finish();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_ag_rock_flush();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_astra_smooth_edges();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_astra_draw_pyro();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_ax_flush();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_ai_wall();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_nd_surface();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_ml_installation();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_nb_room();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_astra_room_materials();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_astra_liquid_face();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_af_flush_tinted();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_astra_recharge_face();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_ss_start();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_astra_gantry();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    warm_astra_lens();
    EM_ASM({Module.graphicsWarmup.steps++;});
    emscripten_sleep(0);
    sc_ready();
    astra_warm_entry_art();
    glUseProgram(0);glBindFramebuffer(GL_FRAMEBUFFER,0);glActiveTexture(GL_TEXTURE0);
    EM_ASM({Module.graphicsWarmup.ms=performance.now()-Module.graphicsWarmup.start;Module.graphicsWarmup.ready=true;window.astraTerminal?.loading(false);});
}
