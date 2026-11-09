/* Small, opportunistic graphics jobs around the ship. No ray casts, targeting,
 * simulation steps or gameplay random numbers. Completed draws keep their art. */
enum { AW_JOBS=768, AW_BITMAP, AW_FAMILY, AW_NORMAL, AW_FLEET, AW_PAINT, AW_PICKUP };
typedef struct {short kind,id;unsigned char done;} aw_job;
static aw_job aw_jobs[AW_JOBS];static int aw_count,aw_cursor,aw_stream_room=-1,aw_enabled=-1;
static unsigned aw_generation,aw_finished,aw_overruns,aw_plans;
static double aw_frame_start,aw_next,aw_cost,aw_peak;static int aw_remaining;
static void aw_add(int kind,int id){
    if(id<0||aw_count>=AW_JOBS)return;
    for(int i=0;i<aw_count;i++)if(aw_jobs[i].kind==kind&&aw_jobs[i].id==id)return;
    aw_jobs[aw_count++]=(aw_job){kind,id,0};aw_remaining++;
}
static void aw_surface_dependencies(grs_bitmap *bm){
    ogl_texture *t=bm->gltexture;if(!t||!t->handle)return;
    if(t->faithful>=20&&t->faithful<39)aw_add(AW_FAMILY,t->faithful-20);
    else if(!t->faithful_detail&&t->material>0&&t->material<256)aw_add(AW_NORMAL,t->material);
}
static void aw_stream_plan(int start){
    aw_count=aw_cursor=aw_remaining=0;aw_stream_room=start;aw_plans++;
    unsigned char seen[MAX_SEGMENTS]={0},depth[24]={0};int queue[24],tail=1;queue[0]=start;seen[start]=1;
    for(int head=0;head<tail;head++){
        int room=queue[head];
        for(int side=0;side<6;side++){
            int ts[2]={Segments[room].sides[side].tmap_num,Segments[room].sides[side].tmap_num2&0x3fff};
            for(int k=0;k<2;k++)if((k==0||ts[k])&&ts[k]>=0&&ts[k]<NumTextures){
                int id=Textures[ts[k]].index;if(id<0||id>=Num_bitmap_files)continue;
                aw_add(AW_BITMAP,id);aw_surface_dependencies(&GameBitmaps[id]);
            }
            int family=astra_district_family(room,side);if(family>=0)aw_add(AW_FAMILY,family);
            int child=Segments[room].children[side];
            if(depth[head]<3&&child>=0&&child<=Highest_segment_index&&!seen[child]&&tail<24){seen[child]=1;queue[tail]=child;depth[tail++]=depth[head]+1;}
        }
    }
    for(int i=0;i<=Highest_object_index;i++){
        object *o=&Objects[i];if(o->segnum<0||o->segnum>Highest_segment_index||!seen[o->segnum])continue;
        if(o->type==OBJ_ROBOT&&o->id<N_robot_types){int id=ac_model(o);if(id>=0&&id<32){aw_add(AW_FLEET,id);for(int b=0;b<af_models[id].count;b++)aw_add(AW_PAINT,af_models[id].group[b].mat);}}
        if(o->type==OBJ_POWERUP&&o->id<53)aw_add(AW_PICKUP,o->id);
    }
    EM_ASM({const s=Module.roomPreparation;if(s){s.room=$0;s.plans=$1;s.rooms=$2;s.pending=$3;}},start,aw_plans,tail,aw_remaining);
}
/* Only mounted files are decoded inside a frame. Fetching/conversion happens
 * asynchronously in JS; the native draw path never waits on this request. */
static int aw_mounted(const char *name){
    if(PHYSFS_exists(name))return 1;
    return EM_ASM_INT({const name=UTF8ToString($0);const depot=Module.assetDepot;if(!depot?.knows(name))return -1;depot.prefetchImage?.(name);return 0;},name);
}
static int aw_job_ready(const aw_job *job){
    int id=job->id;
    switch(job->kind){
    case AW_BITMAP:return GameBitmaps[id].gltexture&&GameBitmaps[id].gltexture->handle;
    case AW_FAMILY:return ag_colors[id]&&ag_details[id];
    case AW_NORMAL:return astra_normals[id]!=0;
    case AW_FLEET:return af_models[id].buffer!=0;
    case AW_PAINT:return af_maps[id][0]&&af_maps[id][1];
    case AW_PICKUP:return ap_bad||ap_buffer[id]!=0;
    }return 1;
}
static int aw_do_job(aw_job *job){
    int id=job->id;char name[40],other[40];
    switch(job->kind){
    case AW_BITMAP:{
        grs_bitmap *bm=&GameBitmaps[id];const char *label=piggy_game_bitmap_name(bm);
        /* These small native masks are cheap to reconstruct. Expensive legacy
         * sign/fan reconstruction keeps its normal load path and full quality. */
        bitmap_index index={(short)id};PIGGY_PAGE_IN(index);
        if(label&&ag_candidate(bm,label)){ogl_loadbmtexture(bm);aw_surface_dependencies(bm);}
        return 1;
    }
    case AW_FAMILY:
        snprintf(name,sizeof name,"g%02d.png",id);snprintf(other,sizeof other,"g%02d-n.png",id);
        {int a=aw_mounted(name),b=aw_mounted(other);if(a<0||b<0)return 1;if(!a||!b)return 0;}ag_load(id);return 1;
    case AW_NORMAL:
        snprintf(name,sizeof name,"n%03d.png",id-1);{int mounted=aw_mounted(name);if(mounted<0)return 1;if(!mounted)return 0;}astra_prepare_normal(id);return 1;
    case AW_FLEET:{
        snprintf(name,sizeof name,"fleet%d.mesh",id);if(!PHYSFS_exists(name))return 1;
        if(!af_load_mesh(id))return 1;astra_chassis *ch=&af_models[id];
        if(!ch->buffer){glGenBuffers(1,&ch->buffer);glBindBuffer(GL_ARRAY_BUFFER,ch->buffer);glBufferData(GL_ARRAY_BUFFER,ch->size,ch->bytes,GL_STATIC_DRAW);af_uploads++;}
        for(int b=0;b<ch->count;b++)aw_add(AW_PAINT,ch->group[b].mat);return 1;
    }
    case AW_PAINT:
        snprintf(name,sizeof name,"coat%d.png",id);snprintf(other,sizeof other,"relief%d.png",id);
        {int a=aw_mounted(name),b=aw_mounted(other);if(a<0||b<0)return 1;if(!a||!b)return 0;}af_bind(id);return 1;
    case AW_PICKUP:
        if(ap_bad||!ap_ready)return 1;
        glGenBuffers(1,&ap_buffer[id]);glBindBuffer(GL_ARRAY_BUFFER,ap_buffer[id]);glBufferData(GL_ARRAY_BUFFER,ap_count[id]*44,ap_data[id],GL_STATIC_DRAW);ap_uploads++;return 1;
    }return 1;
}
static void aw_stream_reset(void){
    aw_stream_room=-1;aw_count=aw_cursor=aw_remaining=0;aw_finished=aw_overruns=aw_plans=0;aw_cost=aw_peak=0;aw_next=emscripten_get_now()+1000;aw_generation++;
    EM_ASM({Module.roomPreparation=({generation:$0,rooms:0,prepared:0,pending:0,peakMs:0,overruns:0});},aw_generation);
}
void astra_stream_frame_begin(void){aw_frame_start=emscripten_get_now();}
void astra_stream_frame_end(void){
    if(aw_enabled<0)aw_enabled=EM_ASM_INT(return !!Module.astra);
    if(!aw_enabled||!ConsoleObject||ConsoleObject->segnum<0||ConsoleObject->segnum>Highest_segment_index)return;
    double now=emscripten_get_now(),render=now-aw_frame_start;
    /* Leave busy frames alone. At most one upload per opportunity; a costly
     * item delays the next opportunity, rather than causing an upload burst. */
    if(now<aw_next||render>11.0||FrameTime>F1_0/35)return;
    int room=ConsoleObject->segnum;
    if(room!=aw_stream_room){aw_stream_plan(room);aw_next=now+16;return;}
    if(!aw_remaining)return;
    int selected=-1;
    for(int n=0;n<aw_count;n++){
        int i=aw_cursor++%aw_count;aw_job *job=&aw_jobs[i];if(job->done)continue;
        if(aw_job_ready(job)){job->done=1;aw_remaining--;continue;}selected=i;break;
    }
    if(selected<0){EM_ASM({if(Module.roomPreparation)Module.roomPreparation.pending=0;});return;}
    GLint active,texture[2],buffer;glGetIntegerv(GL_ACTIVE_TEXTURE,&active);glGetIntegerv(GL_ARRAY_BUFFER_BINDING,&buffer);
    for(int i=0;i<2;i++){glActiveTexture(GL_TEXTURE0+i);glGetIntegerv(GL_TEXTURE_BINDING_2D,&texture[i]);}glActiveTexture(GL_TEXTURE0);
    double began=emscripten_get_now();int completed=aw_do_job(&aw_jobs[selected]);double cost=emscripten_get_now()-began;
    if(completed){aw_jobs[selected].done=1;aw_remaining--;aw_finished++;}
    glBindBuffer(GL_ARRAY_BUFFER,buffer);for(int i=0;i<2;i++){glActiveTexture(GL_TEXTURE0+i);glBindTexture(GL_TEXTURE_2D,texture[i]);}glActiveTexture(active);
    aw_cost=cost;aw_peak=fmax(aw_peak,cost);if(cost>3)aw_overruns++;
    aw_next=emscripten_get_now()+fmax(16,cost*5);
    EM_ASM({const s=Module.roomPreparation;if(s){s.room=$0;s.plans=$1;s.prepared=$2;s.pending=$3;s.peakMs=$4;s.overruns=$5;s.lastMs=$6;}Module.fleetMeshUploads=$7;Module.pickupMeshUploads=$8;},room,aw_plans,aw_finished,aw_remaining,aw_peak,aw_overruns,cost,af_uploads,ap_uploads);
}
