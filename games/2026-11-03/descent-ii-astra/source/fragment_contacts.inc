/* Presentation-only swept contacts. Native object FVI suppresses robot/robot
 * tests; use the traversed room list and exact segment/sphere contact instead.
 * No damage, object allocations, or simulation random draws are performed. */
static const object *ac_preview_target;
static float ac_sphere_contact(const vms_vector *a,const vms_vector *b,const vms_vector *center,float radius){
    float x=f2fl(a->x-center->x),y=f2fl(a->y-center->y),z=f2fl(a->z-center->z);
    float dx=f2fl(b->x-a->x),dy=f2fl(b->y-a->y),dz=f2fl(b->z-a->z);
    float c=x*x+y*y+z*z-radius*radius;if(c<=0)return 0;
    float q=dx*dx+dy*dy+dz*dz;if(q<.000001f)return 2;
    float dot=x*dx+y*dy+z*dz,disc=dot*dot-q*c;if(dot>=0||disc<0)return 2;
    float t=(-dot-sqrtf(disc))/q;return t>=0&&t<=1?t:2;
}
static int ac_ship_contact(ac_fragment *piece,const vms_vector *next,const fvi_info *wall,int result,float radius){
    float travel=f2fl(vm_vec_dist(&piece->pos,next)),best=1.0001f;int selected=-1;
    if(result==HIT_WALL)best=f2fl(vm_vec_dist(&piece->pos,&wall->hit_pnt))/fmaxf(.0001f,travel);
    else if(result!=HIT_NONE)return 0;
    for(int r=-1;r<wall->n_segs;r++){
        int room=r<0?piece->room:wall->seglist[r];if(room<0||room>Highest_segment_index)continue;
        int guard=0;
        for(int i=Segments[room].objects;i>=0&&i<=Highest_object_index&&guard++<MAX_OBJECTS;i=Objects[i].next){
            const object *o=&Objects[i];
            if((o->type!=OBJ_ROBOT&&o->type!=OBJ_PLAYER)||(o->flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING))||o->signature==piece->robot.signature)continue;
            float t=ac_sphere_contact(&piece->pos,next,&o->pos,f2fl(o->size)+radius);
            if(t<best){best=t;selected=i;}
        }
    }
    if(selected<0)return 0;
    vms_vector delta;vm_vec_sub(&delta,next,&piece->pos);vm_vec_scale_add2(&piece->pos,&delta,fl2f(best));
    piece->hit=piece->pos;vm_vec_normalized_dir(&piece->normal,&piece->pos,&Objects[selected].pos);
    piece->room=Objects[selected].segnum;piece->impact=2;piece->impact_age=piece->age;piece->struck=piece->born+fl2f(piece->age);vm_vec_zero(&piece->velocity);
    EM_ASM(Module.componentShipHits=(Module.componentShipHits||0)+1;);return 1;
}
static void ac_preview_contact(ac_fragment *piece,vms_vector *next){
    if(piece->chain&&ac_preview_target){
        float t=ac_sphere_contact(&piece->pos,next,&ac_preview_target->pos,f2fl(ac_preview_target->size)+.5f);
        if(t<=1){vms_vector delta;vm_vec_sub(&delta,next,&piece->pos);vm_vec_scale_add2(&piece->pos,&delta,fl2f(t));piece->hit=piece->pos;
            vm_vec_normalized_dir(&piece->normal,&piece->pos,&ac_preview_target->pos);piece->impact=2;piece->impact_age=piece->age;return;}
    }
    fix *p=&next->x,*v=&piece->velocity.x;const fix bounds[3][2]={{-19*F1_0,19*F1_0},{-9*F1_0,9*F1_0},{9*F1_0,79*F1_0}};
    for(int k=0;k<3;k++)if(p[k]<bounds[k][0]||p[k]>bounds[k][1]){
        p[k]=p[k]<bounds[k][0]?bounds[k][0]:bounds[k][1];v[k]=-fixmul(v[k],fl2f(.48f));piece->bounces++;
        if(piece->chain){piece->impact=1;piece->impact_age=piece->age;piece->hit=*next;vm_vec_zero(&piece->normal);(&piece->normal.x)[k]=p[k]==bounds[k][0]?F1_0:-F1_0;break;}
    }
    piece->pos=*next;
}
