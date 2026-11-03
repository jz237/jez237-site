/* Raised, chamfered hull plates. Work on view-space vertices after articulation
   so every panel follows its original subobject, including firing animations. */
static int astra_mesh_faces;
static int astra_plates_enabled=-1;
static void astra_plate(int n,const g3s_point **outer,g3s_uvl *uv,g3s_lrgb *light,
                        grs_bitmap *bitmap, const vms_vector *normal)
{
    if(astra_plates_enabled<0) astra_plates_enabled=EM_ASM_INT(return !!Module.astra);
    if(!astra_plates_enabled || n<3 || n>=MAX_POINTS_PER_POLY || outer[0]->p3_z>i2f(160)) {
        g3_draw_tmap(n,outer,uv,light,bitmap); return;
    }
    astra_mesh_faces++;
    vms_vector center={0,0,0}, local_lift, lift;
    g3s_uvl tuv={0,0,0};
    for(int i=0;i<n;i++) {
        center.x+=outer[i]->p3_x/n; center.y+=outer[i]->p3_y/n; center.z+=outer[i]->p3_z/n;
        tuv.u+=uv[i].u/n;tuv.v+=uv[i].v/n;tuv.l+=uv[i].l/n;
    }
    fix radius=vm_vec_dist(&center,&outer[0]->p3_vec);
    fix depth=radius/28;
    if(depth>F1_0/10) depth=F1_0/10;
    vm_vec_copy_scale(&local_lift,normal,depth);
    g3_rotate_delta_vec(&lift,&local_lift);
    g3s_point inner[MAX_POINTS_PER_POLY];
    const g3s_point *top[MAX_POINTS_PER_POLY];
    g3s_uvl inneruv[MAX_POINTS_PER_POLY];
    for(int i=0;i<n;i++){
        inner[i]=*outer[i];
        inner[i].p3_x+=(center.x-inner[i].p3_x)/14+lift.x;
        inner[i].p3_y+=(center.y-inner[i].p3_y)/14+lift.y;
        inner[i].p3_z+=(center.z-inner[i].p3_z)/14+lift.z;
        inner[i].p3_flags=0;g3_code_point(&inner[i]);top[i]=&inner[i];
        inneruv[i]=uv[i];
        inneruv[i].u+=(tuv.u-uv[i].u)/14;inneruv[i].v+=(tuv.v-uv[i].v)/14;
    }
    for(int i=0;i<n;i++){
        int j=(i+1)%n;
        const g3s_point *edge[4]={outer[i],outer[j],top[j],top[i]};
        g3s_uvl coords[4]={uv[i],uv[j],inneruv[j],inneruv[i]};
        float dx=f2fl(outer[j]->p3_x-outer[i]->p3_x), dy=f2fl(outer[j]->p3_y-outer[i]->p3_y);
        float lit=(dx*.7f+dy*.5f)/(fabsf(dx)+fabsf(dy)+.01f);
        g3s_lrgb shade[4];
        for(int k=0;k<4;k++){
            float g=k<2?.66f:(1.16f+.46f*lit);
            shade[k].r=(fix)(light[i].r*g);shade[k].g=(fix)(light[i].g*g);shade[k].b=(fix)(light[i].b*(g+.035f));
        }
        g3_draw_tmap(4,edge,coords,shade,bitmap);
    }
    g3_draw_tmap(n,top,inneruv,light,bitmap);
}

