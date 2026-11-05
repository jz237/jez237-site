/* R38: nearby fixture light is confined to the owning convex mine segment.
 * Broken lights stop contributing immediately. No simulation or RNG writes. */
static float afx_lamps[3][4],afx_colors[3][4];
void astra_fixture_lights(int room){
    memset(afx_lamps,0,sizeof afx_lamps);memset(afx_colors,0,sizeof afx_colors);
    if(room<0||room>Highest_segment_index)return;
    float rank[3]={0};vms_vector center;compute_segment_center(&center,&Segments[room]);
    for(int s=0;s<6;s++){
        side *face=&Segments[room].sides[s];int base=face->tmap_num,top=face->tmap_num2&0x3fff;
        if(base<0||base>=NumTextures||top>=NumTextures||Light_subtracted[room]&(1<<s))continue;
        if(Segments[room].children[s]>=0)continue;
        float power=f2fl(TmapInfo[base].lighting+(top?TmapInfo[top].lighting:0));if(power<.06f)continue;
        vms_vector point;compute_center_point_on_side(&point,&Segments[room],s);
        float d=f2fl(vm_vec_dist_quick(&point,&center)),score=power/(4+d);int slot=0;
        for(int i=1;i<3;i++)if(rank[i]<rank[slot])slot=i;if(score<=rank[slot])continue;rank[slot]=score;
        vms_vector normal=face->normals[0],into;vm_vec_sub(&into,&center,&point);if(vm_vec_dot(&normal,&into)<0)vm_vec_negate(&normal);
        vm_vec_scale_add2(&point,&normal,F1_0/2);g3s_point p;g3_rotate_point(&p,&point);
        afx_lamps[slot][0]=f2fl(p.p3_x);afx_lamps[slot][1]=f2fl(p.p3_y);afx_lamps[slot][2]=-f2fl(p.p3_z);
        afx_lamps[slot][3]=fminf(38,14+power*12);
        grs_bitmap *bm=&GameBitmaps[Textures[top&&TmapInfo[top].lighting>0?top:base].index];ogl_texture *tex=bm->gltexture;
        float tint[3]={1,.83f,.65f};if(tex&&tex->faithful==26)memcpy(tint,tex->generated_tint,sizeof tint);
        float strength=fminf(.78f,.20f+power*.24f);for(int c=0;c<3;c++)afx_colors[slot][c]=tint[c]*strength;
    }
}
