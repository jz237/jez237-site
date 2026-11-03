/* Shade solid mine faces from the closest active flares. Closed portals stop propagation. */
float astra_blast_positions[3][4],astra_blast_colors[3][4];
int astra_room_blast_count;
extern int astra_effect_type(object*);
extern const float *astra_effect_color(int);
static void astra_find_blasts(int segnum,const vms_vector *center)
{
    float rank[3]={0};
    astra_room_blast_count=0;
    for(int side=-1;side<6;side++){
        int room=side<0?segnum:Segments[segnum].children[side];
        if(room<0 || (side>=0 && !(WALL_IS_DOORWAY(&Segments[segnum],side)&WID_RENDPAST_FLAG)))continue;
        for(int j=Segments[room].objects;j>=0;j=Objects[j].next){
            object *o=&Objects[j];if(o->type!=OBJ_FIREBALL || o->lifeleft<=0)continue;
            int kind=astra_effect_type(o);if(kind<0)continue;
            float age=1.f-(float)o->lifeleft/Vclip[o->id].play_time;
            if(age<0 || age>=1)continue;
            float r=f2fl(o->size),reach=fminf(70,8+r*4.9f);
            float pulse=(1-age)*(1-age)*(.87f+.13f*cosf(age*(28+2*kind)+o->signature%7));
            if(kind==4 || kind==6)pulse+=.48f*expf(-80.f*(age-.43f)*(age-.43f));
            float strength=pulse*(.84f+fminf(1.15f,r*.11f));
            float dist=f2fl(vm_vec_dist_quick(center,&o->pos));
            float weight=strength/(1+dist*dist/(reach*reach));
            int slot=0;for(int n=1;n<3;n++)if(rank[n]<rank[slot])slot=n;
            if(weight<=rank[slot])continue;
            if(rank[slot]==0)astra_room_blast_count++;
            rank[slot]=weight;float *pos=astra_blast_positions[slot],*col=astra_blast_colors[slot];
            pos[0]=f2fl(o->pos.x);pos[1]=f2fl(o->pos.y);pos[2]=f2fl(o->pos.z);pos[3]=reach;
            const float *rgb=astra_effect_color(kind);
            for(int n=0;n<3;n++)col[n]=rgb[n]*strength;
            col[3]=1;
        }
    }
    for(int n=0;n<3;n++)if(rank[n]==0)astra_blast_positions[n][3]=0;
}
/* Local fixtures and luminous objects. Only the renderer reads these positions. */
float astra_lamp[4],astra_flash[4];
int astra_drawing_mine;
static void astra_light_position(float *dest,vms_vector *world,float brightness)
{
    g3s_point p; g3_rotate_point(&p,world);
    dest[0]=f2fl(p.p3_x);dest[1]=f2fl(p.p3_y);dest[2]=-f2fl(p.p3_z);dest[3]=brightness;
}
static void astra_room_lights(int segnum)
{
    static int enabled=-1,lastseg=-1,lastframe=-1;
    if(enabled<0) enabled=EM_ASM_INT(return !!Module.astra);
    astra_drawing_mine=enabled;
    if(!enabled || (lastseg==segnum && lastframe==framecount))return;
    lastseg=segnum;lastframe=framecount;
    float top_fixture=0,top_moving=0;astra_lamp[3]=astra_flash[3]=0;
    vms_vector center; compute_segment_center(&center,&Segments[segnum]);astra_find_blasts(segnum,&center);
    for(int k=-1;k<6;k++){
        int room=k<0?segnum:Segments[segnum].children[k];
        if(room<0)continue;
        segment *s=&Segments[room];
        for(int i=0;i<6;i++){
            int base=s->sides[i].tmap_num,overlay=s->sides[i].tmap_num2&0x3fff;
            if((Light_subtracted[room]&(1<<i)) || base>=NumTextures || overlay>=NumTextures)continue;
            if(s->children[i]>=0 && s->sides[i].wall_num<0)continue;
            fix power=TmapInfo[base].lighting+(overlay?TmapInfo[overlay].lighting:0);
            if(power<F1_0/32)continue;
            vms_vector point;compute_center_point_on_side(&point,s,i);
            float dist=f2fl(vm_vec_dist_quick(&center,&point));
            float strength=f2fl(power)/(8+dist);
            if(strength>top_fixture){
                top_fixture=strength;
                vms_vector ctr;compute_segment_center(&ctr,s);
                point.x+=(ctr.x-point.x)/5;point.y+=(ctr.y-point.y)/5;point.z+=(ctr.z-point.z)/5;
                astra_light_position(astra_lamp,&point,fminf(2.4f,.55f+f2fl(power)));
            }
        }
        for(int j=s->objects;j>=0;j=Objects[j].next){
            object *o=&Objects[j];
            if(o->type!=OBJ_WEAPON)continue;
            float power=o->type==OBJ_FIREBALL?2.0f:1.0f;
            float strength=power/(2+f2fl(vm_vec_dist_quick(&center,&o->pos)));
            if(strength>top_moving){top_moving=strength;astra_light_position(astra_flash,&o->pos,power);}
        }
    }
}

