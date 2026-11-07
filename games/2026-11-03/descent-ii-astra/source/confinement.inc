/* A bounded convex tunnel envelope, rebuilt only when doors may have moved.
 * Closed native planes constrain the puff volume; open portals provide its
 * venting axis. This is presentation geometry, never pressure/damage physics. */
typedef struct {float n[3],d;} ap_plane;
typedef struct {unsigned seed,used;vms_vector origin;int level,room,count;fix64 checked;float axis[3],width;ap_plane plane[36];} ap_envelope;
static ap_envelope ap_cache[32],*ap_current;static unsigned ap_tick,ap_builds;
static void ap_push_plane(ap_envelope *e,const vms_vector *normal,const vms_vector *point){
    if(e->count>=36)return;ap_plane *p=&e->plane[e->count++];p->n[0]=f2fl(normal->x);p->n[1]=f2fl(normal->y);p->n[2]=f2fl(normal->z);
    vms_vector d;vm_vec_sub(&d,&e->origin,point);p->d=f2fl(vm_vec_dot(&d,normal));
}
static void ap_room_planes(ap_envelope *e,int room,int neighbor){
    for(int s=0;s<6;s++){
        if(WALL_IS_DOORWAY(&Segments[room],s)&WID_RENDPAST_FLAG)continue;
        int count,ids[6];create_abs_vertex_lists(&count,ids,room,s,__FILE__,__LINE__);
        for(int f=0;f<count;f++){
            const vms_vector *n=&Segments[room].sides[s].normals[f],*p=&Vertices[ids[f*3]];
            vms_vector d;vm_vec_sub(&d,&e->origin,p);float dist=f2fl(vm_vec_dot(&d,n));
            /* Adjacent end caps may bound a straight plume, but never use a
             * plane that puts its source outside the conservative envelope. */
            float axial=fabsf(f2fl(n->x)*e->axis[0]+f2fl(n->y)*e->axis[1]+f2fl(n->z)*e->axis[2]);
            if(!neighbor||(dist>.25f&&axial>.85f))ap_push_plane(e,n,p);
        }
    }
}
static void ap_begin(const vms_vector *where,unsigned seed){
    ap_current=NULL;extern int astra_preview_active;ap_envelope *e=NULL;
    for(int i=0;i<32;i++)if(ap_cache[i].used&&ap_cache[i].seed==seed&&ap_cache[i].level==Current_level_num&&vm_vec_dist_quick(where,&ap_cache[i].origin)<F1_0/4){e=&ap_cache[i];break;}
    if(e&&GameTime64-e->checked>=0&&GameTime64-e->checked<F1_0/3){e->used=++ap_tick;ap_current=e;return;}
    if(!e){e=&ap_cache[0];for(int i=1;i<32;i++)if(ap_cache[i].used<e->used)e=&ap_cache[i];}
    memset(e,0,sizeof *e);e->origin=*where;e->seed=seed;e->level=Current_level_num;e->checked=GameTime64;e->used=++ap_tick;e->width=12;
    if(astra_preview_active){
        /* The component showcase uses a real bounded demonstration bay. */
        if(where->z!=48*F1_0)return;
        e->axis[2]=1;e->width=9;
        for(int k=0;k<3;k++)for(int sign=-1;sign<=1;sign+=2){vms_vector n={0},p={0};fix *nn=&n.x,*pp=&p.x;nn[k]=sign*F1_0;pp[k]=i2f(k==0?-sign*20:k==1?-sign*10:sign>0?8:80);ap_push_plane(e,&n,&p);}
    }else{
        int room=find_point_seg(where,ConsoleObject?ConsoleObject->segnum:0);if(room<0)return;e->room=room;
        int best=-1;float opening=0;vms_vector middle;compute_segment_center(&middle,&Segments[room]);
        for(int s=0;s<6;s++)if((WALL_IS_DOORWAY(&Segments[room],s)&WID_RENDPAST_FLAG)&&Segments[room].children[s]>=0){
            vms_vector p,d;compute_center_point_on_side(&p,&Segments[room],s);float reach=f2fl(vm_vec_normalized_dir(&d,&p,&middle));if(reach>opening){opening=reach;best=s;e->axis[0]=f2fl(d.x);e->axis[1]=f2fl(d.y);e->axis[2]=f2fl(d.z);}
        }
        ap_room_planes(e,room,0);
        if(best>=0)for(int s=0;s<6;s++)if((WALL_IS_DOORWAY(&Segments[room],s)&WID_RENDPAST_FLAG)&&Segments[room].children[s]>=0)ap_room_planes(e,Segments[room].children[s],1);
        float half=100;for(int i=0;i<e->count;i++){ap_plane *p=&e->plane[i];float d=p->d+f2fl(middle.x-where->x)*p->n[0]+f2fl(middle.y-where->y)*p->n[1]+f2fl(middle.z-where->z)*p->n[2];if(d>0)half=fminf(half,d);}e->width=fmaxf(.2f,half*.85f);
    }
    ap_current=e;ap_builds++;
    EM_ASM(Module.tunnelPlumes=({version:61,envelopes:$0,planes:$1});,ap_builds,e->count);
}
static void ap_shape(float *offset,float *radius){
    ap_envelope *e=ap_current;if(!e||!e->count)return;
    float along=al_dot(offset,e->axis),narrow=1-fminf(1,e->width/fmaxf(.01f,*radius*2));
    for(int k=0;k<3;k++)offset[k]=offset[k]*(1-.28f*narrow)+e->axis[k]*along*.65f*narrow;
    *radius=fminf(*radius,e->width);
    /* Project inward with the whole sphere, then shrink the residual at corners. */
    for(int pass=0;pass<3;pass++)for(int i=0;i<e->count;i++){ap_plane *p=&e->plane[i];float d=p->d+al_dot(offset,p->n);if(d<*radius+.025f)for(int k=0;k<3;k++)offset[k]+=p->n[k]*(*radius+.025f-d);}
    for(int i=0;i<e->count;i++)*radius=fminf(*radius,fmaxf(.001f,ap_current->plane[i].d+al_dot(offset,e->plane[i].n)-.015f));
}
