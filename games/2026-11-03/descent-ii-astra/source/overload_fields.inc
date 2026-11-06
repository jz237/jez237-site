/* Authored box forcefields can sit inside a segment. Intersect them at their
 * actual pose rather than moving a barrier to the nearest Descent side. */
typedef struct {int owner,room,enabled;float m[16],size[3],center[3];} ov_field;
static ov_field ov_fields[128];static int ov_field_count;
EMSCRIPTEN_KEEPALIVE void astra_ov_fields_load(void){
    ov_field_count=EM_ASM_INT(return Math.min(128,Module.overloadFields?.length||0));
    for(int i=0;i<ov_field_count;i++){
        ov_field *f=&ov_fields[i];f->owner=EM_ASM_INT(return Module.overloadFields[$0].go;,i);f->room=EM_ASM_INT(return Module.overloadFields[$0].room;,i);f->enabled=1;
        EM_ASM({const r=Module.overloadFields[$0];const b=r.box;HEAPF32.set(r.inverse,$1>>2);HEAPF32.set([b.m_Size.x,b.m_Size.y,b.m_Size.z],$2>>2);HEAPF32.set([b.m_Center.x,b.m_Center.y,b.m_Center.z],$3>>2);},i,f->m,f->size,f->center);
    }
}
EMSCRIPTEN_KEEPALIVE void astra_ov_field_enable(int owner,int enabled){for(int i=0;i<ov_field_count;i++)if(ov_fields[i].owner==owner)ov_fields[i].enabled=enabled;}
int astra_ov_field_intersection(fvi_query *query,fvi_info *hit,int result){
    extern int astra_ov_enabled(void);if(!astra_ov_enabled()||result==HIT_BAD_P0||!ov_field_count)return result;
    float start[3]={f2fl(query->p0->x)/4,f2fl(query->p0->y)/4,f2fl(query->p0->z)/4},delta[3]={f2fl(query->p1->x-query->p0->x)/4,f2fl(query->p1->y-query->p0->y)/4,f2fl(query->p1->z-query->p0->z)/4};
    float length2=delta[0]*delta[0]+delta[1]*delta[1]+delta[2]*delta[2];if(length2<1e-10f)return result;
    float best=1;if(result!=HIT_NONE){float x=f2fl(hit->hit_pnt.x-query->p0->x)/4,y=f2fl(hit->hit_pnt.y-query->p0->y)/4,z=f2fl(hit->hit_pnt.z-query->p0->z)/4;best=fmaxf(0,fminf(1,(x*delta[0]+y*delta[1]+z*delta[2])/length2));}
    int selected=-1;float bestnormal[3]={0};
    for(int i=0;i<ov_field_count;i++){
        ov_field *f=&ov_fields[i];if(!f->enabled)continue;
        float enter=0,leave=best,normal[3]={0};int inside=1,valid=1;
        for(int axis=0;axis<3;axis++){
            float *row=&f->m[axis*4],p=row[0]*start[0]+row[1]*start[1]+row[2]*start[2]+row[3]-f->center[axis],v=row[0]*delta[0]+row[1]*delta[1]+row[2]*delta[2];
            float norm=sqrtf(row[0]*row[0]+row[1]*row[1]+row[2]*row[2]),extent=f->size[axis]*.5f+f2fl(query->rad)*norm/4;
            if(fabsf(p)>extent)inside=0;
            if(fabsf(v)<1e-8f){if(fabsf(p)>extent){valid=0;break;}continue;}
            float a=(-extent-p)/v,b=(extent-p)/v,sign=-1;if(a>b){float swap=a;a=b;b=swap;sign=1;}
            if(a>enter){enter=a;for(int k=0;k<3;k++)normal[k]=sign*row[k]/fmaxf(.00001f,norm);}
            if(b<leave)leave=b;if(enter>leave){valid=0;break;}
        }
        if(valid&&!inside&&enter>=0&&enter<best){best=enter;selected=i;memcpy(bestnormal,normal,sizeof normal);}
    }
    if(selected<0)return result;
    float time=fmaxf(0,best-.00001f);hit->hit_pnt=(vms_vector){query->p0->x+fl2f(delta[0]*4*time),query->p0->y+fl2f(delta[1]*4*time),query->p0->z+fl2f(delta[2]*4*time)};
    int room=find_point_seg(&hit->hit_pnt,query->startseg);if(room<0)room=ov_fields[selected].room;
    hit->hit_wallnorm=(vms_vector){fl2f(bestnormal[0]),fl2f(bestnormal[1]),fl2f(bestnormal[2])};hit->hit_seg=hit->hit_side_seg=room;hit->hit_side=0;fix bestdot=-F1_0;
    for(int side=0;side<6;side++){fix dot=vm_vec_dot(&hit->hit_wallnorm,&Segments[room].sides[side].normals[0]);if(dot>bestdot){bestdot=dot;hit->hit_side=side;}}
    for(int i=0;i<hit->n_segs;i++)if(hit->seglist[i]==room){hit->n_segs=i+1;break;}
    hit->hit_object=-1;hit->hit_type=HIT_WALL;return HIT_WALL;
}
