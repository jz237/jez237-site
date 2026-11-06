/* Original Overload robot batches in native object poses. */
static astra_chassis ov_robots[26];
static GLuint ov_robot_maps[128][2];
static GLuint ov_robot_buffers[26][256];
void astra_ov_actor_gpu_reset(void){for(int i=0;i<26;i++){glDeleteBuffers(256,ov_robot_buffers[i]);memset(ov_robot_buffers[i],0,sizeof ov_robot_buffers[i]);}}
static float ov_robot_radius[26];
static int ov_robot_mesh(int id){
    if(id<0||id>=26)return 0;astra_chassis *ch=&ov_robots[id];if(ch->tried)return ch->count;ch->tried=1;
    char name[64];snprintf(name,sizeof name,"ovrobot%d.mesh",id);PHYSFS_File *f=PHYSFS_openRead(name);if(!f)return 0;
    int size=PHYSFS_fileLength(f);if(size<4||size>16*1024*1024){PHYSFS_close(f);return 0;}
    unsigned char *bytes=malloc(size);int ok=bytes&&PHYSFS_readBytes(f,bytes,size)==size;PHYSFS_close(f);if(!ok){free(bytes);return 0;}
    unsigned count=*(unsigned*)bytes,offset=4;if(count>256){free(bytes);return 0;}
    astra_batch *batches=calloc(count,sizeof(*batches));if(!batches){free(bytes);return 0;}
    for(unsigned i=0;i<count;i++){
        if(offset+12>(unsigned)size){ok=0;break;}unsigned *h=(unsigned*)(bytes+offset);offset+=12;
        if(h[0]>=128||h[2]>(size-offset)/44){ok=0;break;}
        batches[i]=(astra_batch){h[0],h[1],h[2],0,(float*)(bytes+offset)};offset+=h[2]*44;
    }
    if(!ok||offset!=(unsigned)size){free(bytes);free(batches);return 0;}ch->bytes=bytes;ch->group=batches;ch->count=count;
    ov_robot_radius[id]=EM_ASM_DOUBLE(return Module.overloadRadii[$0]||1.5;,id)*4;
    return count;
}
static int ov_robot_bind(int id){
    for(int unit=0;unit<2;unit++){
        glActiveTexture(unit?GL_TEXTURE1:GL_TEXTURE0);
        if(!ov_robot_maps[id][unit]){
            png_data im;char name[40];snprintf(name,sizeof name,"oe%c%d.png",unit?'n':'m',id);if(!read_png(name,&im)){glActiveTexture(GL_TEXTURE0);return 0;}
            glGenTextures(1,&ov_robot_maps[id][unit]);glBindTexture(GL_TEXTURE_2D,ov_robot_maps[id][unit]);GLenum fmt=im.channels==4?GL_RGBA:GL_RGB;
            glTexImage2D(GL_TEXTURE_2D,0,fmt,im.width,im.height,0,fmt,GL_UNSIGNED_BYTE,im.data);free(im.data);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR_MIPMAP_LINEAR);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);glGenerateMipmap(GL_TEXTURE_2D);
        }else glBindTexture(GL_TEXTURE_2D,ov_robot_maps[id][unit]);
    }
    glActiveTexture(GL_TEXTURE0);return 1;
}
int astra_overload_robot(object *obj){
    extern int astra_ov_hide_proxy(object*);if(astra_ov_hide_proxy(obj))return 1;
    if(obj->type!=OBJ_ROBOT||!EM_ASM_INT(return !!Module.overload)||!ov_robot_mesh(obj->id))return 0;
    if(!fleet_program)af_program_init();if(fleet_failed)return 0;
    astra_chassis *ch=&ov_robots[obj->id];float radius=ov_robot_radius[obj->id];
    g3_start_instance_matrix(&obj->pos,&obj->orient);
    GLboolean cull=glIsEnabled(GL_CULL_FACE),depth=glIsEnabled(GL_DEPTH_TEST);glDisable(GL_CULL_FACE);glEnable(GL_DEPTH_TEST);glUseProgram(fleet_program);
    extern float astra_ov_telegraph(object*);glUniform1f(af_charge,astra_ov_telegraph(obj));
    glUniform3f(af_energy,.8,.8,.8);glUniform4fv(af_flash,1,astra_flash);glUniform1f(af_clock,astra_visual_clock());
    vms_vector origin={0,0,0};g3s_point pt;g3_rotate_point(&pt,&origin);glUniform3f(af_origin,f2fl(pt.p3_x),f2fl(pt.p3_y),-f2fl(pt.p3_z));
    float basis[9];for(int k=0;k<3;k++){vms_vector axis={0,0,0},rot;if(k==0)axis.x=fl2f(radius);else if(k==1)axis.y=fl2f(radius);else axis.z=fl2f(radius);g3_rotate_delta_vec(&rot,&axis);basis[k*3]=f2fl(rot.x);basis[k*3+1]=f2fl(rot.y);basis[k*3+2]=-f2fl(rot.z);}
    glUniformMatrix3fv(af_basis,1,GL_FALSE,basis);glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    for(int i=0;i<ch->count;i++){astra_batch *b=&ch->group[i];if(!ov_robot_bind(b->mat))continue;
        GLuint *buffer=&ov_robot_buffers[obj->id][i];if(!*buffer){glGenBuffers(1,buffer);glBindBuffer(GL_ARRAY_BUFFER,*buffer);glBufferData(GL_ARRAY_BUFFER,b->count*44,b->v,GL_STATIC_DRAW);}else glBindBuffer(GL_ARRAY_BUFFER,*buffer);
        glVertexPointer(3,GL_FLOAT,44,(void*)0);glColorPointer(4,GL_FLOAT,44,(void*)12);glTexCoordPointer(4,GL_FLOAT,44,(void*)28);glDrawArrays(GL_TRIANGLES,0,b->count);
    }
    glBindBuffer(GL_ARRAY_BUFFER,0);glDisableClientState(GL_TEXTURE_COORD_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);glUniform1f(af_charge,0);glUseProgram(0);if(cull)glEnable(GL_CULL_FACE);if(!depth)glDisable(GL_DEPTH_TEST);g3_done_instance();
    EM_ASM(Module.overloadRobots=(Module.overloadRobots||0)+1;Module.overloadRobotTypes=Module.overloadRobotTypes||{};Module.overloadRobotTypes[$0]=true;,obj->id);return 1;
}
