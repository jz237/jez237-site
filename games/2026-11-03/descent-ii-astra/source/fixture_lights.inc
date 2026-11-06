/* R38: nearby fixture light is confined to the owning convex mine segment.
 * Broken lights stop contributing immediately. No simulation or RNG writes. */
static float afx_lamps[3][4],afx_colors[3][4],afx_light_world[3][4],afx_axes[3][4];
/* Object draws use a local g3 instance. Transform world fixture positions into
 * that instance before projecting; otherwise light would rotate with the robot. */
static object *afx_instance;
static void afx_point(g3s_point *out,const vms_vector *world){
    if(!afx_instance){g3_rotate_point(out,world);return;}
    vms_vector d,local;vm_vec_sub(&d,world,&afx_instance->pos);vm_vec_rotate(&local,&d,&afx_instance->orient);g3_rotate_point(out,&local);
}
static void afx_axis(vms_vector *out,const vms_vector *world){
    if(!afx_instance){g3_rotate_delta_vec(out,world);return;}
    vms_vector local;vm_vec_rotate(&local,world,&afx_instance->orient);g3_rotate_delta_vec(out,&local);
}
extern int astra_liquid_kind(int);
extern float astra_mine_clock;
void astra_fixture_lights(int room){
    aw_room=room;memset(afx_axes,0,sizeof afx_axes);
    memset(afx_light_world,0,sizeof afx_light_world);memset(afx_lamps,0,sizeof afx_lamps);memset(afx_colors,0,sizeof afx_colors);
    if(room<0||room>Highest_segment_index)return;
    float rank[3]={0};vms_vector center;compute_segment_center(&center,&Segments[room]);
    for(int s=0;s<6;s++)for(int rail=0;rail<2;rail++){
        side *face=&Segments[room].sides[s];int base=face->tmap_num,top=face->tmap_num2&0x3fff;
        if(base<0||base>=NumTextures||top>=NumTextures||Light_subtracted[room]&(1<<s))continue;
        if(Segments[room].children[s]>=0)continue;
        int lava=astra_liquid_kind(base)==2;
        float time=astra_mine_clock>=0?astra_mine_clock:(double)(GameTime64%(F1_0*1800))/F1_0;
        float power=f2fl(TmapInfo[base].lighting+(top?TmapInfo[top].lighting:0));
        aw_mount mount;int accent=aw_mount_at(room,s,rail,&mount),vent=aw_vent(room,s);
        if(rail&&!accent)continue;
        if(vent)power=.78f*aw_warmth(room,s,time);
        if(accent)power=.85f;
        if(lava)power=fmaxf(.70f,power)*(.88f+.12f*sinf(time*.72f+room*.4f+s));if(power<.06f)continue;
        vms_vector point;if(accent)point=mount.p;else compute_center_point_on_side(&point,&Segments[room],s);
        float d=f2fl(vm_vec_dist_quick(&point,&center)),score=power/(4+d);int slot=0;
        for(int i=1;i<3;i++)if(rank[i]<rank[slot])slot=i;if(score<=rank[slot])continue;rank[slot]=score;
        vms_vector normal=face->normals[0],into;vm_vec_sub(&into,&center,&point);if(vm_vec_dot(&normal,&into)<0)vm_vec_negate(&normal);
        vm_vec_scale_add2(&point,&normal,F1_0/2);g3s_point p;afx_point(&p,&point);
        afx_lamps[slot][0]=f2fl(p.p3_x);afx_lamps[slot][1]=f2fl(p.p3_y);afx_lamps[slot][2]=-f2fl(p.p3_z);
        if(accent){vms_vector axis;afx_axis(&axis,&mount.r);float scale=fmaxf(.001f,f2fl(vm_vec_mag(&axis)));afx_axes[slot][0]=f2fl(axis.x)/scale;afx_axes[slot][1]=f2fl(axis.y)/scale;afx_axes[slot][2]=-f2fl(axis.z)/scale;afx_axes[slot][3]=mount.width*scale;}
        else memset(afx_axes[slot],0,sizeof afx_axes[slot]);
        afx_lamps[slot][3]=fminf(lava?55:38,14+power*(lava?24:12));
        afx_light_world[slot][0]=f2fl(point.x);afx_light_world[slot][1]=f2fl(point.y);afx_light_world[slot][2]=f2fl(point.z);afx_light_world[slot][3]=afx_lamps[slot][3];
        grs_bitmap *bm=&GameBitmaps[Textures[top&&TmapInfo[top].lighting>0?top:base].index];ogl_texture *tex=bm->gltexture;
        float tint[3]={1,.83f,.65f};int filtered=0;if(tex&&tex->faithful==26)filtered=aw_lens_tint(tex,room,tint);
        if(lava||vent){tint[0]=1;tint[1]=vent?.30f:.24f;tint[2]=.025f;}
        if(accent)memcpy(tint,aw_palette[mount.color],sizeof tint);
        float strength=vent?1.24f*aw_warmth(room,s,time):accent?1.35f:fminf(lava?1.3f:.78f,.20f+power*(lava?.68f:.24f));for(int c=0;c<3;c++)afx_colors[slot][c]=tint[c]*strength;
        if(filtered)for(int c=0;c<3;c++)afx_colors[slot][c]*=1.6f;
        afx_colors[slot][3]=accent||filtered||vent?1:0;
    }
}
