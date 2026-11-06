/* Four authored lamps per mesh batch, selected once when loading. Fan shadows
 * reuse the existing RGBA silhouette target: one nearby assembly per view. */
static unsigned ov_shadow_stamp;
static int ov_shadow_chunk=-1;
static float ov_shadow_depth;
static void ov_geometry_bind(ov_batch *p){
    if(!p->buffers[0]){glGenBuffers(2,p->buffers);glBindBuffer(GL_ARRAY_BUFFER,p->buffers[0]);glBufferData(GL_ARRAY_BUFFER,p->vertex_count*44,p->vertices,GL_STATIC_DRAW);glBindBuffer(GL_ELEMENT_ARRAY_BUFFER,p->buffers[1]);glBufferData(GL_ELEMENT_ARRAY_BUFFER,p->count*2,p->indices,GL_STATIC_DRAW);}
    else{glBindBuffer(GL_ARRAY_BUFFER,p->buffers[0]);glBindBuffer(GL_ELEMENT_ARRAY_BUFFER,p->buffers[1]);}
}
static void ov_transform(ov_batch *p,float *transform){
    const float identity[12]={1,0,0,0,0,1,0,0,0,0,1,0};memcpy(transform,identity,sizeof identity);
    if(!p->poses)return;float fraction=0;
    if(p->loop)fraction=fmodf(astra_visual_clock()*p->speed/fmaxf(.01f,p->duration)+p->phase,1);
    else if(p->wall>=0){extern float astra_ov_door_fraction(int);fraction=astra_ov_door_fraction(p->wall);}else return;
    float frame=fmaxf(0,fminf(1,fraction))*(p->frames-1);int low=(int)frame,high=low+1<p->frames?low+1:low;float t=frame-low;
    for(int i=0;i<12;i++)transform[i]=p->poses[low*12+i]*(1-t)+p->poses[high*12+i]*t;
}
static void ov_apply_lights(ov_batch *p,float *basis){
    float positions[16]={0},colors[16]={0},directions[16]={0};
    for(int k=0;k<4;k++){
        int id=p->lights[k];if(id<0)continue;ov_light *l=&ov_lights[id];vms_vector point={fl2f(l->position[0]),fl2f(l->position[1]),fl2f(l->position[2])};g3s_point view;g3_rotate_point(&view,&point);
        positions[k*4]=f2fl(view.p3_x);positions[k*4+1]=f2fl(view.p3_y);positions[k*4+2]=-f2fl(view.p3_z);positions[k*4+3]=l->radius;
        for(int a=0;a<3;a++){colors[k*4+a]=l->color[a];directions[k*4+a]=basis[a]*l->direction[0]+basis[3+a]*l->direction[1]+basis[6+a]*l->direction[2];}colors[k*4+3]=l->cone;
    }
    glUniform1f(af_light_on,1);glUniform4fv(af_lpos,4,positions);glUniform4fv(af_lcolor,4,colors);glUniform4fv(af_ldir,4,directions);
    glUniform1f(af_shadow_on,ov_shadow_stamp==ov_frame&&p->chunk==ov_shadow_chunk?1:0);
}
static void ov_shadow_bind(void){
    if(ov_shadow_stamp!=ov_frame)return;
    glActiveTexture(GL_TEXTURE2);glBindTexture(GL_TEXTURE_2D,ss_texture);glActiveTexture(GL_TEXTURE0);
    glUniform3fv(af_shadow_center,1,ss_center);glUniform3fv(af_shadow_lamp,1,ss_light);glUniform3fv(af_shadow_right,1,ss_right);glUniform3fv(af_shadow_up,1,ss_up);glUniform3fv(af_shadow_normal,1,ss_normal);
    glUniform2f(af_shadow_size,ss_width,ss_height);glUniform1f(af_shadow_depth,ov_shadow_depth);
}
static void ov_shadow_frame(int chunk){
    if(ov_shadow_stamp==ov_frame||!ss_quality||ss_failed)return;
    ov_batch *fan=NULL;float nearest=180;
    for(int b=ov_chunk_first[chunk];b>=0;b=ov_batches[b].next){ov_batch *p=&ov_batches[b];if(!p->loop||p->speed<=0||p->hidden||p->radius<1)continue;
        vms_vector c={fl2f(p->center[0]),fl2f(p->center[1]),fl2f(p->center[2])};g3s_point v;g3_rotate_point(&v,&c);float d=sqrtf(powf(f2fl(v.p3_x),2)+powf(f2fl(v.p3_y),2)+powf(f2fl(v.p3_z),2));
        if(v.p3_z>0&&d<nearest){fan=p;nearest=d;}
    }
    if(!fan)return;
    int light=-1;float best=1e20;
    for(int i=0;i<ov_light_count;i++)if(ov_lights[i].chunk==chunk){float d=0;for(int a=0;a<3;a++)d+=powf(ov_lights[i].position[a]-fan->center[a],2);if(d<best&&d>fan->radius*fan->radius){best=d;light=i;}}
    if(light<0||best>140*140)return;
    ov_light *l=&ov_lights[light];vms_vector center={fl2f(fan->center[0]),fl2f(fan->center[1]),fl2f(fan->center[2])},lamp={fl2f(l->position[0]),fl2f(l->position[1]),fl2f(l->position[2])},normal;
    vm_vec_sub(&normal,&lamp,&center);vm_vec_normalize(&normal);vms_matrix plane;vm_vector_2_matrix(&plane,&normal,NULL,NULL);
    float radius=fmaxf(2,fan->radius);vm_vec_scale_add2(&center,&normal,fl2f(-radius*3));
    if(!ss_start(&center,&plane,radius*12,radius*12,&lamp)){ss_end();return;}
    static GLint axis_uniform=-1,origin_uniform=-1;if(axis_uniform<0){axis_uniform=glGetUniformLocation(ss_program,"axis");origin_uniform=glGetUniformLocation(ss_program,"origin");}
    float base[9];for(int k=0;k<3;k++){vms_vector axis={0},rot;if(k==0)axis.x=F1_0;else if(k==1)axis.y=F1_0;else axis.z=F1_0;g3_rotate_delta_vec(&rot,&axis);base[k*3]=f2fl(rot.x);base[k*3+1]=f2fl(rot.y);base[k*3+2]=-f2fl(rot.z);}
    glEnableClientState(GL_VERTEX_ARRAY);
    for(int b=ov_chunk_first[chunk];b>=0;b=ov_batches[b].next){ov_batch *p=&ov_batches[b];if(p->entity!=fan->entity||p->hidden)continue;
        float transform[12],axis[9];ov_transform(p,transform);
        for(int column=0;column<3;column++)for(int row=0;row<3;row++)axis[column*3+row]=base[row]*transform[column]+base[3+row]*transform[4+column]+base[6+row]*transform[8+column];
        vms_vector offset={fl2f(transform[3]),fl2f(transform[7]),fl2f(transform[11])};g3s_point point;g3_rotate_point(&point,&offset);
        glUniformMatrix3fv(axis_uniform,1,GL_FALSE,axis);glUniform3f(origin_uniform,f2fl(point.p3_x),f2fl(point.p3_y),-f2fl(point.p3_z));
        ov_geometry_bind(p);glVertexPointer(3,GL_FLOAT,44,(void*)0);glDrawElements(GL_TRIANGLES,p->count,GL_UNSIGNED_SHORT,(void*)0);
    }
    glBindBuffer(GL_ARRAY_BUFFER,0);glBindBuffer(GL_ELEMENT_ARRAY_BUFFER,0);glDisableClientState(GL_VERTEX_ARRAY);ss_end();ov_shadow_stamp=ov_frame;ov_shadow_chunk=chunk;ov_shadow_depth=radius*2;
    EM_ASM(Module.overloadFanShadows=(Module.overloadFanShadows||0)+1;Module.overloadShadowFan=$0;,fan->entity);
}
