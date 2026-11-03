/* A separate launch choice uses the actual level-one roster. Enter mine keeps
   the original start position, movement and AI. */
static void astra_encounter_drop(void)
{
    if(!EM_ASM_INT(return !!Module.encounter))return;
    object *target=NULL;vms_vector best_pos;int room=-1;float best=1e9f;
    for(int i=0;i<=Highest_object_index;i++){
        object *o=&Objects[i];
        if(o->type!=OBJ_ROBOT||Robot_info[o->id].companion||Robot_info[o->id].boss_flag)continue;
        fix from_start=vm_vec_dist_quick(&o->pos,&ConsoleObject->pos);
        if(from_start>i2f(450))continue;
        segment *s=&Segments[o->segnum];vms_vector c;compute_segment_center(&c,s);
        for(int j=-1;j<8;j++){
            vms_vector pos=c;
            if(j>=0){vms_vector v=Vertices[s->verts[j]];pos.x+=(v.x-c.x)*6/10;pos.y+=(v.y-c.y)*6/10;pos.z+=(v.z-c.z)*6/10;}
            if(get_seg_masks(&pos,o->segnum,ConsoleObject->size,__FILE__,__LINE__).facemask)continue;
            float distance=f2fl(vm_vec_dist_quick(&pos,&o->pos));
            if(distance<f2fl(o->size+ConsoleObject->size)+1.5f)continue;
            float score=f2fl(from_start)*.045f+fabsf(distance-f2fl(o->size)*6.2f)+(Robot_info[o->id].attack_type?19.f:0.f);
            if(score<best){best=score;best_pos=pos;target=o;room=o->segnum;}
        }
    }
    if(!target)return;
    ConsoleObject->pos=best_pos;obj_relink(ConsoleObject-Objects,room);
    vms_vector f;vm_vec_normalized_dir_quick(&f,&target->pos,&best_pos);
    vm_vector_2_matrix(&ConsoleObject->orient,&f,NULL,NULL);
}



