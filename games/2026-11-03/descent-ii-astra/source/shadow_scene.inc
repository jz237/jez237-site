/* Only same-room light paths are used: native walls/closed doors cannot leak
 * another room's light into these shadows. Both campaigns use the same pass. */
static int ss_fixture(int room,int receiver,const vms_vector *center,const vms_matrix *basis,vms_vector *lamp){
    /* Use the very same active fixture positions as the surface shader. This
     * also removes a broken lamp from the shadow pass on the next frame. */
    astra_fixture_lights(room);float best=0;
    for(int i=0;i<3;i++){
        if(afx_light_world[i][3]<=0)continue;
        vms_vector p={fl2f(afx_light_world[i][0]),fl2f(afx_light_world[i][1]),fl2f(afx_light_world[i][2])},d;
        vm_vec_sub(&d,&p,center);float elevation=f2fl(vm_vec_dot(&d,&basis->fvec)),distance=f2fl(vm_vec_mag(&d));
        float brightness=fmaxf(afx_colors[i][0],fmaxf(afx_colors[i][1],afx_colors[i][2]));
        float score=brightness*elevation/(1+distance*distance*.02f);
        if(elevation>2&&distance<afx_light_world[i][3]&&score>best){best=score;*lamp=p;}
    }return best>0;
}
static int ss_wall(int room,int face){
    if(!ss_quality||!astra_refinement||ss_passes>=(ss_quality==2?10:6)||ss_failed)return 0;
    vms_vector center,lamp;vms_matrix basis;float w,h;
    if(!ae_basis(room,face,&center,&basis,&w,&h)||w>100||h>100)return 0;
    g3s_point p;g3_rotate_point(&p,&center);if(p.p3_z<F1_0||p.p3_z>i2f(90))return 0;
    if(!ss_fixture(room,face,&center,&basis,&lamp))return 0;
    // Plane maps include skewed quadrilaterals without cropping the silhouette.
    int ids[4];get_side_verts(ids,room,face);w=h=0;
    for(int i=0;i<4;i++){vms_vector d;vm_vec_sub(&d,&Vertices[ids[i]],&center);w=fmaxf(w,2*fabsf(f2fl(vm_vec_dot(&d,&basis.rvec))));h=fmaxf(h,2*fabsf(f2fl(vm_vec_dot(&d,&basis.uvec))));}
    if(!ss_start(&center,&basis,w+.2f,h+.2f,&lamp)){ss_end();return 0;}
    ss_passes++;int saved_id=astra_robot_id;object *saved_object=astra_robot_object;
    object exhibit;int has_exhibit=ag_exhibit(&exhibit),next=Segments[room].objects;
    for(int visited=0,drawn=0;visited<MAX_OBJECTS+1&&drawn<5;visited++){
        object *o;if(visited==0&&has_exhibit)o=&exhibit;
        else {if(astra_gallery_scene>=0||next<0||next>Highest_object_index)break;o=&Objects[next];next=o->next;}
        if(o->flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING)||o->type!=OBJ_ROBOT&&o->type!=OBJ_PLAYER||o->type==OBJ_ROBOT&&o->ctype.ai_info.CLOAKED||o->render_type==RT_NONE&&o!=&exhibit)continue;
        if(o->type==OBJ_PLAYER&&(Players[o->id].flags&PLAYER_FLAGS_CLOAKED))continue;
        g3s_lrgb light={F1_0,F1_0,F1_0};fix glow[2]={F1_0,0};extern int astra_hull;int saved_hull=astra_hull;astra_hull=1;
        astra_robot_object=o;astra_robot_id=o->type==OBJ_ROBOT?o->id:-1;
        draw_polygon_model(&o->pos,&o->orient,o->rtype.pobj_info.anim_angles,o->rtype.pobj_info.model_num,0,light,glow,NULL);
        astra_hull=saved_hull;drawn++;
    }
    astra_robot_id=saved_id;astra_robot_object=saved_object;
    int theme=ae_theme(room);
    for(int side=0;side<6;side++){
        vms_vector c;vms_matrix b;float W,H;
        if(!ae_basis(room,side,&c,&b,&W,&H)||W>90||H>90)continue;
        if(Segments[room].children[side]<0&&Segments[room].sides[side].wall_num<0&&!astra_environment_rock(Segments[room].sides[side].tmap_num)){
            g3_start_instance_matrix(&c,&b);
            if(side%2==0&&(room+side)%3!=1)ae_machine(room,side,theme,W,H);
            if(astra_environment_bay(room)==side)ag_equipment(room,theme,W,H);
            g3_done_instance();
        }
        ae_door(room,side);
    }
    ss_end();EM_ASM(Module.shadowPass=({version:28,quality:$0,maps:$1,batches:$2,size:$3});,ss_quality,ss_passes,ss_draws,ss_size);
    return 1;
}
