/* Companion state uses the same PHYSFS save location as native pilot saves. */
static int ov_restoring;
static int *ov_arrays[]={ov_signature,ov_kind,ov_hidden,ov_props,ov_owner,ov_shield,ov_saved_control,ov_saved_render};
static int ov_array_backup[8][MAX_OBJECTS];
static object *ov_restore_objects;
static vms_vector ov_restore_position;static vms_matrix ov_restore_orientation;static int ov_restore_room;
void astra_ov_save(const char *filename){
    char path[1024];snprintf(path,sizeof path,"%s.ov",filename);
    if(!ov_active){PHYSFS_delete(path);return;}
    char *json=(char*)EM_ASM_INT({const value=JSON.stringify(window.astraOverload.save());return stringToNewUTF8(value);});
    unsigned size=strlen(json);PHYSFS_File *f=PHYSFS_openWrite(path);
    if(f){PHYSFS_writeBytes(f,"OVS2",4);PHYSFS_writeBytes(f,&size,4);PHYSFS_writeBytes(f,json,size);for(int a=0;a<8;a++)PHYSFS_writeBytes(f,ov_arrays[a],sizeof ov_array_backup[a]);int room=ConsoleObject->segnum;PHYSFS_writeBytes(f,&ConsoleObject->pos,sizeof(vms_vector));PHYSFS_writeBytes(f,&ConsoleObject->orient,sizeof(vms_matrix));PHYSFS_writeBytes(f,&room,4);PHYSFS_close(f);}free(json);
}
void astra_ov_restore(const char *filename){
    if(!ov_active)return;char path[1024],magic[4];snprintf(path,sizeof path,"%s.ov",filename);PHYSFS_File *f=PHYSFS_openRead(path);
    if(!f){Error("Missing Overload mission save companion");return;}
    unsigned size=0;PHYSFS_readBytes(f,magic,4);PHYSFS_readBytes(f,&size,4);
    if(memcmp(magic,"OVS2",4)||size>8*1024*1024){PHYSFS_close(f);Error("Invalid Overload mission save");return;}
    char *json=malloc(size+1);int ok=json&&PHYSFS_readBytes(f,json,size)==size;
    if(ok){json[size]=0;for(int a=0;a<8;a++)if(PHYSFS_readBytes(f,ov_array_backup[a],sizeof ov_array_backup[a])!=sizeof ov_array_backup[a])ok=0;}
    if(ok)ok=PHYSFS_readBytes(f,&ov_restore_position,sizeof ov_restore_position)==sizeof ov_restore_position&&PHYSFS_readBytes(f,&ov_restore_orientation,sizeof ov_restore_orientation)==sizeof ov_restore_orientation&&PHYSFS_readBytes(f,&ov_restore_room,4)==4;
    PHYSFS_close(f);if(!ok){free(json);Error("Truncated Overload mission save");return;}
    EM_ASM(window.astraOverload.restoreState=JSON.parse(UTF8ToString($0));,json);free(json);
    ov_restoring=1;ov_pending=1;
}
static void ov_restore_before_begin(void){
    if(!ov_restoring)return;
    ov_restore_objects=malloc(sizeof Objects);if(!ov_restore_objects)Error("Out of memory restoring campaign");memcpy(ov_restore_objects,Objects,sizeof Objects);
    /* Configure all type profiles, even when a saved robot is hidden. The
       saved object bytes and visibility bookkeeping are restored afterward. */
    for(int i=1;i<=Highest_object_index;i++)if(ov_array_backup[2][i]&&ov_array_backup[1][i]==OBJ_ROBOT)Objects[i].type=OBJ_ROBOT;
}
static void ov_restore_after_begin(void){
    if(!ov_restoring)return;memcpy(Objects,ov_restore_objects,sizeof Objects);free(ov_restore_objects);ov_restore_objects=NULL;
    for(int a=0;a<8;a++)memcpy(ov_arrays[a],ov_array_backup[a],sizeof ov_array_backup[a]);ov_restoring=0;
    ConsoleObject->pos=ov_restore_position;ConsoleObject->orient=ov_restore_orientation;if(ov_restore_room>=0&&ov_restore_room<=Highest_segment_index)obj_relink(ConsoleObject-Objects,ov_restore_room);
}
