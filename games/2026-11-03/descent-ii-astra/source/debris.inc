/* Cosmetic hull fragments: swept collision against native mine walls, with
 * no gameplay objects, damage, pickup changes or simulation random draws. */
enum { AD_GROUPS=32, AD_PIECES=12 };
typedef struct {vms_vector pos,velocity,hit,normal;int room,hitroom,bounces;float size,spin;fix64 struck;} ad_piece;
typedef struct {unsigned seed;vms_vector origin;fix64 born,seen;float age;int count;ad_piece piece[AD_PIECES];} ad_group;
static ad_group ad_groups[AD_GROUPS];
void astra_debris_clear(void){memset(ad_groups,0,sizeof ad_groups);}
static void ad_chunk(float size,int index,float heat){
    float p[6][3]={{-.9f,0,0},{.8f,0,0},{0,-.28f,0},{0,.37f,0},{.16f,0,-1.4f},{-.13f,0,1.1f}};
    const int face[8][3]={{0,2,4},{2,1,4},{1,3,4},{3,0,4},{2,0,5},{1,2,5},{3,1,5},{0,3,5}};
    for(int f=0;f<8;f++){
        float *a=p[face[f][0]],*b=p[face[f][1]],*c=p[face[f][2]];
        float u[3],v[3],n[3];for(int k=0;k<3;k++){u[k]=b[k]-a[k];v[k]=c[k]-a[k];}
        for(int k=0;k<3;k++)n[k]=u[(k+1)%3]*v[(k+2)%3]-u[(k+2)%3]*v[(k+1)%3];astra_unit(n);
        if((f+index)%5==0)ax_paint(.26f+.57f*heat,.17f+.14f*heat,.075f,.05f+heat*.7f);
        else ax_paint(.22f+(f%2)*.09f,.26f+(f%2)*.08f,.28f+(f%2)*.07f,.015f);
        for(int j=0;j<3;j++){float *q=p[face[f][j]];ax_vertex_add(q[0]*size,q[1]*size,q[2]*size,n[0],n[1],n[2]);}
    }
}
static void ad_sparks(ad_piece *p,float elapsed,int seed){
    float age=(double)(GameTime64-p->struck)/F1_0;if(!p->struck||age<0||age>.24f)return;
    vms_matrix basis;vm_vector_2_matrix(&basis,&p->normal,NULL,NULL);g3_start_instance_matrix(&p->hit,&basis);
    float t=age/.24f;ax_count=0;ax_paint(1,.51f,.09f,1);
    for(int i=0;i<6;i++){
        float a=i*1.0472f+seed,x=cosf(a),y=sinf(a),length=(.3f+1.9f*t)*(1+pyro_random(seed,i,4));
        af_beam(x*length*.25f,y*length*.25f,.08f,x*length,y*length,.12f+t*.75f,.022f*(1-t),.7f*(1-t),seed+i);
    }
    af_flush_tinted(elapsed,1,1);ax_count=0;ax_paint(1,.44f,.07f,1);
    af_particle(0,0,.08f,.30f+.4f*t,.48f*(1-t),seed);af_flush_tinted(elapsed,0,1);g3_done_instance();
}
void astra_debris(vms_vector *where,fix radius,float seconds,float lifetime,unsigned seed,int tier,int room,int window_num){
    if(!ax_on()||tier<1||room<0||room>Highest_segment_index||seconds<0||seconds>lifetime)return;
    int shape=(seed>>8)%5;ad_group *group=NULL;
    for(int i=0;i<AD_GROUPS;i++)if(ad_groups[i].count&&ad_groups[i].seed==seed&&
        !memcmp(&ad_groups[i].origin,where,sizeof *where)&&seconds>=ad_groups[i].age-.08f){group=&ad_groups[i];break;}
    if(!group){
        int slot=0;for(int i=1;i<AD_GROUPS;i++)if(ad_groups[i].seen<ad_groups[slot].seen)slot=i;
        group=&ad_groups[slot];memset(group,0,sizeof *group);group->seed=seed;group->origin=*where;group->born=GameTime64-fl2f(seconds);
        group->count=tier==3?3:tier==2?12:shape>=3?10:6;
        vms_vector center,inward;compute_segment_center(&center,&Segments[room]);vm_vec_normalized_dir(&inward,&center,where);
        for(int i=0;i<group->count;i++){
            ad_piece *p=&group->piece[i];float d[3];pyro_dir(seed,i+153,d);
            float speed=tier==3?5+pyro_random(seed,i,42)*5:(tier==2?14:11)+pyro_random(seed,i,42)*17;
            vm_vec_scale_add(&p->pos,where,&inward,fl2f(.8f));p->room=room;
            p->velocity=(vms_vector){fl2f(d[0]*speed),fl2f(d[1]*speed),fl2f(d[2]*speed)};
            p->size=tier==3?.10f+.08f*pyro_random(seed,i,49):fminf(.68f,fmaxf(.16f,f2fl(radius)*(.033f+.035f*pyro_random(seed,i,49))));
            p->spin=(pyro_random(seed,i,55)-.5f)*5;
        }
    }
    group->seen=GameTime64;
    /* Bounded substeps keep fragments on the correct side of thin walls even
     * on phones. A camera seeing an old blast catches up without teleporting. */
    int substeps=0;float lastSound=-1;
    while(group->age+.001f<seconds&&substeps++<150){
        float dt=fminf(.04f,seconds-group->age);group->age+=dt;
        for(int i=0;i<group->count;i++){
            ad_piece *p=&group->piece[i];if(p->room<0||p->bounces>=3)continue;
            vms_vector next;vm_vec_scale_add(&next,&p->pos,&p->velocity,fl2f(dt));
            fvi_query q={&p->pos,&next,p->room,fl2f(p->size*.35f),-1,NULL,0};fvi_info hit;
            int result=find_vector_intersection(&q,&hit);
            if(result==HIT_WALL){
                p->normal=hit.hit_wallnorm;if(vm_vec_normalize(&p->normal)<F1_0/100){p->bounces=3;continue;}
                p->hit=hit.hit_pnt;vm_vec_scale_add(&p->pos,&hit.hit_pnt,&p->normal,fl2f(.06f));
                p->room=hit.hit_seg>=0?hit.hit_seg:p->room;p->hitroom=p->room;p->bounces++;
                fix dot=vm_vec_dot(&p->velocity,&p->normal);vm_vec_scale_add2(&p->velocity,&p->normal,-2*dot);vm_vec_scale(&p->velocity,fl2f(.42f));
                p->struck=group->born+fl2f(group->age);lastSound=i;
                astra_environment_hit(hit.hit_side_seg,hit.hit_side,&p->hit,p->size*1.8f);
                if(p->bounces>=3||vm_vec_mag_quick(&p->velocity)<i2f(2)){p->bounces=3;astra_environment_scrap(p->room,&p->pos,&p->normal,p->size);}
                EM_ASM(Module.debrisWallHits=(Module.debrisWallHits||0)+1;);
            }else if(result==HIT_NONE){p->pos=next;if(hit.hit_seg>=0)p->room=hit.hit_seg;vm_vec_scale(&p->velocity,fl2f(1-.18f*dt));}
            else p->bounces=3;
        }
    }
    if(lastSound>=0&&!window_num){
        static fix64 last;ad_piece *p=&group->piece[(int)lastSound];
        if(GameTime64-last>F1_0/7&&GameTime64-p->struck<F1_0/8){
            last=GameTime64;digi_link_sound_to_pos2(SOUND_LASER_HIT_CLUTTER,p->room,0,&p->hit,0,F1_0/14,i2f(70));
        }
    }
    float fade=1-pyro_ramp(lifetime*.66f,lifetime,seconds),heat=expf(-seconds*1.3f);
    for(int i=0;i<group->count;i++){
        ad_piece *p=&group->piece[i];g3s_point projected;g3_rotate_point(&projected,&p->pos);
        if(projected.p3_z<F1_0/2)continue;
        float turn=seconds*p->spin/(1+p->bounces);
        vms_angvec angle={(fixang)(turn*8400+seed%65535),(fixang)(turn*6100+i*3500),(fixang)(turn*7300+i*1800)};vms_matrix basis;vm_angles_2_matrix(&basis,&angle);
        g3_start_instance_matrix(&p->pos,&basis);ax_count=0;ax_energy=0;ad_chunk(p->size,i,heat);ax_flush(1,fade);g3_done_instance();
        ad_sparks(p,seconds,seed+i);
    }
    EM_ASM(Module.debrisVisualVersion=17;Module.debrisPieces=$0;,group->count);
}
void astra_debris_lights(int room,const vms_vector *center,float rank[3],float pos[3][4],float colors[3][4]){
    for(int g=0;g<AD_GROUPS;g++)for(int j=0;j<ad_groups[g].count;j++){
        ad_piece *p=&ad_groups[g].piece[j];float age=(double)(GameTime64-p->struck)/F1_0;
        if(!p->struck||p->hitroom!=room||age<0||age>.18f)continue;
        float power=.16f*(1-age/.18f),distance=f2fl(vm_vec_dist_quick(center,&p->hit));
        float weight=power/(1+distance*distance/36);int k=0;for(int n=1;n<3;n++)if(rank[n]<rank[k])k=n;
        if(weight<=rank[k])continue;rank[k]=weight;
        pos[k][0]=f2fl(p->hit.x);pos[k][1]=f2fl(p->hit.y);pos[k][2]=f2fl(p->hit.z);pos[k][3]=6;
        colors[k][0]=power;colors[k][1]=power*.47f;colors[k][2]=power*.10f;colors[k][3]=1;
    }
}

/* Brief world-space shield/metal streaks. These never spawn smoke, hull chunks,
 * chain sounds, blast lighting or secondary explosions. */
void astra_hull_sparks(vms_vector *where,fix radius,float t,unsigned seed){
    if(t<0||t>=1||!ax_on())return;
    g3s_point point;g3_rotate_point(&point,where);if(point.p3_z<-radius)return;
    float size=f2fl(radius),fade=(1-t)*(1-t);
    g3_start_instance_matrix(where,&vmd_identity_matrix);ax_count=0;
    for(int i=0;i<8+(seed%3);i++){
        float d[3];pyro_dir(seed,i+381,d);
        float travel=size*(.12f+1.75f*t)*(.65f+.65f*pyro_random(seed,i,82));
        float tail=fmaxf(0,travel-size*(.09f+.30f*(1-t)));
        if(i%4==0)ax_paint(.45f,.80f,1,.7f);else ax_paint(1,.62f,.20f,.8f);
        af_beam(d[0]*tail,d[1]*tail,d[2]*tail,d[0]*travel,d[1]*travel,d[2]*travel,
            size*(.012f+.008f*(1-t)),.68f*fade,seed+i);
    }
    af_flush_tinted(t,1,1);g3_done_instance();
    EM_ASM(Module.hullSparkDraws=(Module.hullSparkDraws||0)+1;Module.hullSparkVersion=84;);
}
