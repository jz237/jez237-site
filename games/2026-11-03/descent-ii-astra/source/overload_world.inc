/* Overload campaign renderer. Authored meshes share the native camera/depth buffer. */
typedef struct {int chunk,owner,material,count;float *vertices;unsigned short *indices;int hidden,entity,wall,frames;float *poses;int transparent;} ov_batch;
static ov_batch *ov_batches;
static unsigned char *ov_mesh_bytes;
static int ov_batch_count,ov_chunk_for_room[MAX_SEGMENTS],ov_loaded;
static unsigned ov_chunk_frame[512];
static GLuint ov_material[512][2];
static unsigned ov_frame;
EMSCRIPTEN_KEEPALIVE void astra_ov_owner(int owner,int hidden){EM_ASM(if(!Module.overloadHidden)Module.overloadHidden=new Set();if($1)Module.overloadHidden.add($0);else Module.overloadHidden.delete($0);,owner,hidden);for(int i=0;i<ov_batch_count;i++)if(ov_batches[i].owner==owner||ov_batches[i].entity==owner)ov_batches[i].hidden=hidden;}
void astra_ov_world_reset(void){
    for(int i=0;i<ov_batch_count;i++)free(ov_batches[i].poses);
    free(ov_batches);free(ov_mesh_bytes);ov_batches=NULL;ov_mesh_bytes=NULL;ov_batch_count=ov_loaded=0;
    memset(ov_chunk_frame,0,sizeof ov_chunk_frame);
    for(int i=0;i<512;i++)for(int k=0;k<2;k++)if(ov_material[i][k]){glDeleteTextures(1,&ov_material[i][k]);ov_material[i][k]=0;}
}
void astra_overload_view(void){ov_frame++;if(!ov_frame){memset(ov_chunk_frame,0,sizeof ov_chunk_frame);ov_frame=1;}}
static int ov_bind(int id){
    if(id<0||id>=512)return 0;
    for(int unit=0;unit<2;unit++){
        glActiveTexture(unit?GL_TEXTURE1:GL_TEXTURE0);
        if(!ov_material[id][unit]){
            char name[64];png_data image;snprintf(name,sizeof name,"o%c%d.png",unit?'n':'m',id);
            if(!read_png(name,&image)){glActiveTexture(GL_TEXTURE0);return 0;}
            glGenTextures(1,&ov_material[id][unit]);glBindTexture(GL_TEXTURE_2D,ov_material[id][unit]);
            GLenum fmt=image.channels==4?GL_RGBA:GL_RGB;
            glTexImage2D(GL_TEXTURE_2D,0,fmt,image.width,image.height,0,fmt,GL_UNSIGNED_BYTE,image.data);free(image.data);
            glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR_MIPMAP_LINEAR);
            glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);glGenerateMipmap(GL_TEXTURE_2D);
        }else glBindTexture(GL_TEXTURE_2D,ov_material[id][unit]);
    }
    glActiveTexture(GL_TEXTURE0);return 1;
}
static int ov_load(void){
    if(ov_loaded)return ov_batch_count;
    extern int astra_ov_enabled(void);if(!astra_ov_enabled())return 0;ov_loaded=1;
    PHYSFS_File *file=PHYSFS_openRead("overload.mesh");if(!file)return 0;
    int size=PHYSFS_fileLength(file);if(size<4||size>512*1024*1024){PHYSFS_close(file);return 0;}
    ov_mesh_bytes=malloc(size);int ok=ov_mesh_bytes&&PHYSFS_readBytes(file,ov_mesh_bytes,size)==size;PHYSFS_close(file);if(!ok)return 0;
    if(memcmp(ov_mesh_bytes,"OVM2",4))return 0;
    unsigned count=*(unsigned*)(ov_mesh_bytes+4),offset=8;if(count>16000)return 0;
    ov_batches=calloc(count,sizeof(*ov_batches));if(!ov_batches)return 0;
    for(unsigned b=0;b<count;b++){
        if(offset+20>(unsigned)size)return 0;int *h=(int*)(ov_mesh_bytes+offset);offset+=20;
        if(h[0]<0||h[0]>=512||h[2]<0||h[2]>=512||h[3]<0||h[4]<0||(unsigned)h[3]>(size-offset)/44)return 0;
        ov_batches[b]=(ov_batch){h[0],h[1],h[2],h[4],(float*)(ov_mesh_bytes+offset),NULL,0,h[1],-1,0,NULL,0};offset+=h[3]*44;
        if((unsigned)h[4]>(size-offset)/4||h[3]>65535)return 0;
        unsigned *source=(unsigned*)(ov_mesh_bytes+offset);unsigned short *shorts=(unsigned short*)source;
        for(int i=0;i<h[4];i++){if(source[i]>=(unsigned)h[3])return 0;shorts[i]=(unsigned short)source[i];}
        ov_batches[b].indices=shorts;offset+=h[4]*4;
        ov_batch *p=&ov_batches[b];int frames=EM_ASM_INT(return Module.overloadMotions?.[$0]?.frames||0;,p->owner);
        if(frames>0&&frames<=120){
            p->poses=malloc(frames*12*sizeof(float));if(!p->poses)return 0;p->frames=frames;
            EM_ASM(HEAPF32.set(Module.overloadMotions[$0].matrices,$1>>2);,p->owner,p->poses);
            p->entity=EM_ASM_INT(return Module.overloadMotions[$0].owner;,p->owner);
            p->wall=EM_ASM_INT(return Module.overloadMotions[$0].wall??-1;,p->owner);
        }
        p->transparent=EM_ASM_INT(return Module.overloadTransparent?.includes($0)||false;,p->owner);
        p->hidden=EM_ASM_INT(return Module.overloadHidden?.has($0)||Module.overloadHidden?.has($1)||false;,p->owner,p->entity);
    }
    if(offset!=(unsigned)size)return 0;
    ov_batch_count=count;
    EM_ASM(for(let i=0;i<Module.overloadChunks.length;i++)HEAP32[($0>>2)+i]=Module.overloadChunks[i];Module.overloadGroups=$1;,ov_chunk_for_room,count);
    return count;
}
int astra_overload_side(int room){
    if(!ov_load())return 0;
    int chunk=ov_chunk_for_room[room];unsigned frame=ov_frame;
    if(chunk<0||chunk>=512)return 1;
    if(ov_chunk_frame[chunk]==frame)return 1;ov_chunk_frame[chunk]=frame;
    if(!fleet_program)af_program_init();if(fleet_failed)return 0;
    GLboolean cull=glIsEnabled(GL_CULL_FACE),depth=glIsEnabled(GL_DEPTH_TEST),blend=glIsEnabled(GL_BLEND),depthmask;GLint blend_source,blend_dest;float blend_color[4];
    glGetBooleanv(GL_DEPTH_WRITEMASK,&depthmask);glGetIntegerv(GL_BLEND_SRC,&blend_source);glGetIntegerv(GL_BLEND_DST,&blend_dest);glGetFloatv(GL_BLEND_COLOR,blend_color);
    glDisable(GL_CULL_FACE);glEnable(GL_DEPTH_TEST);glUseProgram(fleet_program);
    glUniform3f(af_energy,.65,.65,.65);glUniform4fv(af_flash,1,astra_flash);glUniform1f(af_clock,astra_visual_clock());
    vms_vector origin={0,0,0};g3s_point pt;g3_rotate_point(&pt,&origin);glUniform3f(af_origin,f2fl(pt.p3_x),f2fl(pt.p3_y),-f2fl(pt.p3_z));
    float basis[9];for(int k=0;k<3;k++){vms_vector axis={0,0,0},rot;if(k==0)axis.x=F1_0;else if(k==1)axis.y=F1_0;else axis.z=F1_0;g3_rotate_delta_vec(&rot,&axis);basis[k*3]=f2fl(rot.x);basis[k*3+1]=f2fl(rot.y);basis[k*3+2]=-f2fl(rot.z);}
    glUniformMatrix3fv(af_basis,1,GL_FALSE,basis);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    int draws=0;
    for(int b=0;b<ov_batch_count;b++){
        ov_batch *p=&ov_batches[b];if(p->chunk!=chunk||p->hidden||!ov_bind(p->material))continue;
        if(p->transparent){glEnable(GL_BLEND);glBlendColor(0,0,0,.20);glBlendFunc(GL_CONSTANT_ALPHA,GL_ONE_MINUS_CONSTANT_ALPHA);glDepthMask(GL_FALSE);}else{glDisable(GL_BLEND);glDepthMask(GL_TRUE);}
        float transform[12]={1,0,0,0,0,1,0,0,0,0,1,0};
        if(p->poses&&p->wall>=0){
            extern float astra_ov_door_fraction(int);float frame=astra_ov_door_fraction(p->wall)*(p->frames-1);int low=(int)frame,high=low+1<p->frames?low+1:low;float t=frame-low;
            for(int i=0;i<12;i++)transform[i]=p->poses[low*12+i]*(1-t)+p->poses[high*12+i]*t;
        }
        vms_vector offset={fl2f(transform[3]),fl2f(transform[7]),fl2f(transform[11])};g3_rotate_point(&pt,&offset);glUniform3f(af_origin,f2fl(pt.p3_x),f2fl(pt.p3_y),-f2fl(pt.p3_z));
        float posebasis[9];for(int column=0;column<3;column++)for(int row=0;row<3;row++)posebasis[column*3+row]=basis[row]*transform[column]+basis[3+row]*transform[4+column]+basis[6+row]*transform[8+column];glUniformMatrix3fv(af_basis,1,GL_FALSE,posebasis);
        glVertexPointer(3,GL_FLOAT,44,p->vertices);glColorPointer(4,GL_FLOAT,44,p->vertices+3);glTexCoordPointer(4,GL_FLOAT,44,p->vertices+7);glDrawElements(GL_TRIANGLES,p->count,GL_UNSIGNED_SHORT,p->indices);draws++;
    }
    glDisableClientState(GL_TEXTURE_COORD_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);glUseProgram(0);
    if(cull)glEnable(GL_CULL_FACE);if(!depth)glDisable(GL_DEPTH_TEST);
    glDepthMask(depthmask);glBlendColor(blend_color[0],blend_color[1],blend_color[2],blend_color[3]);glBlendFunc(blend_source,blend_dest);if(blend)glEnable(GL_BLEND);else glDisable(GL_BLEND);
    EM_ASM(Module.overloadDraws=(Module.overloadDraws||0)+$0;,draws);return 1;
}
