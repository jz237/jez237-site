/* R38: nearby fixture light is confined to the owning convex mine segment.
 * Broken lights stop contributing immediately. No simulation or RNG writes. */
static float afx_lamps[4][4],afx_colors[4][4],afx_light_world[4][4],afx_axes[4][4];
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
extern void astra_reaction_light(int);
extern void astra_scenery_light(int);

/* Cinematic lighting (pyre106). The mine's original vertex light is even from
 * wall to wall, so a room read as one flat tone. Every lamp now tints the vertex
 * light of the rooms it reaches (its own and two more through open sides) with
 * its own colour, the colour its lens is drawn in, and the vertex light gets more
 * contrast: rooms are lit by their lamps, in their colours, with darker space
 * between. Strength follows Flight comfort > Cinematic lighting (0 = the earlier
 * look). Rendering only: no simulation state or RNG. */
#include "wall.h"
extern int astra_native_compare,framecount;
static float ac_tint[MAX_VERTICES][4];
static int ac_key=-1,ac_pending,ac_built_frame=-1000,ac_rebuilds,ac_frame=-1,ac_asked=-1000,ac_lamps;
static float ac_strength=.75f;
/* Each scaled by the strength: vertex contrast, vertex pivot, lamp tint amount, lamp pool boost,
 * lens shadow contrast, saturation, wide glow, Mine brightness reduction, vignette, bright-pass
 * cut, lens pivot, glow gain, lamp reach. Chosen by comparing paused hands-free flights at 0 and
 * 75 percent in Counterstrike mines 1 and 5. */
static const float ac_tune[13]={.6f,.5f,.85f,1.8f,.35f,.20f,.70f,.30f,.24f,.08f,.22f,.20f,1.1f};
static float astra_cinema(void){
    if(framecount-ac_asked>30||framecount<ac_asked){ac_asked=framecount;ac_strength=(float)EM_ASM_DOUBLE(return Math.max(0,Math.min(1,Module.comfort?.cinematic??.75)));}
    return astra_native_compare?0.f:ac_strength;
}
/* A texture's brightest tones, as a colour whose largest channel is 1. */
static void ac_native_color(int t,float out[3]){
    out[0]=1;out[1]=.92f;out[2]=.80f;
    PIGGY_PAGE_IN(Textures[t]);grs_bitmap *bm=&GameBitmaps[Textures[t].index];
    if(bm->bm_flags&BM_FLAG_PAGED_OUT||!bm->bm_data||bm->bm_w<=0||bm->bm_h<=0)return;
    if(bm->bm_flags&BM_FLAG_RLE)bm=rle_expand_texture(bm);
    double sum[3]={0,0,0},weight=0;int n=bm->bm_w*bm->bm_h;
    for(int i=0;i<n;i++){
        int c=bm->bm_data[i];if(c>=254)continue;
        float r=gr_palette[c*3]/63.f,g=gr_palette[c*3+1]/63.f,b=gr_palette[c*3+2]/63.f,y=.30f*r+.59f*g+.11f*b,w=y*y*y;
        sum[0]+=r*w;sum[1]+=g*w;sum[2]+=b*w;weight+=w;
    }
    if(weight<=0)return;float top=0;
    for(int k=0;k<3;k++){out[k]=(float)(sum[k]/weight);top=fmaxf(top,out[k]);}
    if(top<=0){out[0]=out[1]=out[2]=1;return;}
    for(int k=0;k<3;k++)out[k]/=top;
}
/* The colour of a lamp face: its lens colour where Astra draws a lens, else the
 * texture's brightest tones. Returns 0 while the lamp's texture is not loaded. */
static int ac_lamp_color(int room,int s,float out[3]){
    side *face=&Segments[room].sides[s];int base=face->tmap_num,top=face->tmap_num2&0x3fff;
    if(astra_liquid_kind(base)==2){out[0]=1;out[1]=.30f;out[2]=.05f;return 1;}
    int t=top&&TmapInfo[top].lighting>0?top:base;
    ogl_texture *tex=GameBitmaps[Textures[t].index].gltexture;
    if(tex&&tex->handle>0&&tex->faithful==26){
        aw_lens_tint(tex,room,out);float m=fmaxf(out[0],fmaxf(out[1],out[2]));
        if(m>0)for(int k=0;k<3;k++)out[k]/=m;else out[0]=out[1]=out[2]=1;
        return 1;
    }
    ac_native_color(t,out);return tex&&tex->handle>0;
}
static void ac_build(void){
    static int stamp[MAX_VERTICES],seen[MAX_SEGMENTS];static short queue[MAX_SEGMENTS],depth[MAX_SEGMENTS];static float acc[MAX_VERTICES][4];
    int verts=Highest_vertex_index+1;if(verts>MAX_VERTICES)verts=MAX_VERTICES;if(verts<0)verts=0;
    memset(acc,0,sizeof acc);memset(stamp,0,sizeof stamp);memset(seen,0,sizeof seen);
    const float reach=38.f*38.f;int id=0;ac_pending=0;ac_lamps=0;
    for(int room=0;room<=Highest_segment_index;room++)for(int s=0;s<6;s++){
        segment *seg=&Segments[room];side *face=&seg->sides[s];int base=face->tmap_num,top=face->tmap_num2&0x3fff;
        if(base<0||base>=NumTextures||top>=NumTextures)continue;
        if(seg->children[s]>=0&&face->wall_num<0)continue;
        int lava=astra_liquid_kind(base)==2;float power=f2fl(TmapInfo[base].lighting+(top?TmapInfo[top].lighting:0));
        if(lava)power=fmaxf(power,.7f);
        if(power<.05f)continue;
        float color[3];if(!ac_lamp_color(room,s,color))ac_pending=1;
        vms_vector point,center,n=face->normals[0],into;compute_center_point_on_side(&point,seg,s);compute_segment_center(&center,seg);
        vm_vec_sub(&into,&center,&point);if(vm_vec_dot(&n,&into)<0)vm_vec_negate(&n);
        float P[3]={f2fl(point.x),f2fl(point.y),f2fl(point.z)},N[3]={f2fl(n.x),f2fl(n.y),f2fl(n.z)};
        int head=0,tail=0;id++;ac_lamps++;queue[tail]=room;depth[tail++]=0;seen[room]=id;
        while(head<tail){
            int r=queue[head],d=depth[head++];segment *g=&Segments[r];
            for(int k=0;k<8;k++){
                int v=g->verts[k];if(v<0||v>=verts||stamp[v]==id)continue;stamp[v]=id;
                float D[3]={f2fl(Vertices[v].x)-P[0],f2fl(Vertices[v].y)-P[1],f2fl(Vertices[v].z)-P[2]};
                float dist2=D[0]*D[0]+D[1]*D[1]+D[2]*D[2],dist=sqrtf(dist2)+.001f,facing=(D[0]*N[0]+D[1]*N[1]+D[2]*N[2])/dist;
                float w=power*reach/(reach+dist2)*(.30f+.70f*fmaxf(0.f,facing));
                for(int c=0;c<3;c++)acc[v][c]+=w*color[c];acc[v][3]+=w;
            }
            if(d>=2)continue;
            for(int c=0;c<6;c++){
                int child=g->children[c];if(child<0||child>Highest_segment_index||seen[child]==id)continue;
                if(!(WALL_IS_DOORWAY(g,c)&WID_RENDPAST_FLAG))continue;
                seen[child]=id;queue[tail]=child;depth[tail++]=d+1;
            }
        }
    }
    /* Keep the brightness the level designer gave each corner; change only its colour.
     * One weak lamp far away tints a little, a strong one nearby tints a lot. */
    for(int v=0;v<verts;v++){
        float w=acc[v][3];if(w<=1e-4f){ac_tint[v][0]=ac_tint[v][1]=ac_tint[v][2]=1;ac_tint[v][3]=0;continue;}
        float c[3];for(int k=0;k<3;k++)c[k]=acc[v][k]/w;
        float y=.2126f*c[0]+.7152f*c[1]+.0722f*c[2];if(y<.05f)y=.05f;
        for(int k=0;k<3;k++)ac_tint[v][k]=fminf(2.4f,c[k]/y);ac_tint[v][3]=w/(w+.30f);
    }
    for(int v=verts;v<MAX_VERTICES;v++){ac_tint[v][0]=ac_tint[v][1]=ac_tint[v][2]=1;ac_tint[v][3]=0;}
}
static void ac_refresh(void){
    int key=Current_level_num*7919+Highest_segment_index*131+Highest_vertex_index*7+(Vertices[0].x>>12)+(Vertices[Highest_vertex_index>0?Highest_vertex_index:0].z>>10);
    if(key!=ac_key){ac_key=key;ac_rebuilds=0;ac_build();ac_built_frame=framecount;return;}
    /* Lens colours are known once a lamp's texture is loaded; refresh while some are not. */
    if(ac_pending&&ac_rebuilds<40&&(framecount-ac_built_frame>90||framecount<ac_built_frame)){ac_rebuilds++;ac_build();ac_built_frame=framecount;}
}
/* Called by render_face for each corner, before explosions and other moving light are added. */
void astra_cinema_vertex(g3s_lrgb *light,int v){
    if(v<0||v>=MAX_VERTICES)return;
    float k=astra_cinema();if(k<=0)return;
    if(ac_frame!=framecount){ac_frame=framecount;ac_refresh();}
    float r=f2fl(light->r),g=f2fl(light->g),b=f2fl(light->b),l=fmaxf(r,fmaxf(g,b));if(l<=0)return;
    /* Contrast about a middle light level: dim corners darker, lamp-lit corners brighter. */
    float scale=powf(fminf(l,1.f)/ac_tune[1],ac_tune[0]*k);const float *t=ac_tint[v];float amount=k*ac_tune[2]*t[3];
    r*=scale*(1+amount*(t[0]-1));g*=scale*(1+amount*(t[1]-1));b*=scale*(1+amount*(t[2]-1));
    light->r=fl2f(fminf(1.f,fmaxf(0.f,r)));light->g=fl2f(fminf(1.f,fmaxf(0.f,g)));light->b=fl2f(fminf(1.f,fmaxf(0.f,b)));
}
/* Lamp selection for one room and one camera, reused by every face of the room
 * drawn from that camera in this frame. Object draws (afx_instance) compute afresh. */
static int afx_cache_room=-1,afx_cache_frame=-1;static vms_vector afx_cache_view;static fix afx_cache_turn;
static float afx_cache[4][4][4];
static fix afx_turn(void){return View_matrix.fvec.x+View_matrix.uvec.y*3+View_matrix.rvec.z*7+View_matrix.fvec.z*11;}
void astra_fixture_lights(int room){
    aw_room=room;
    if(!afx_instance&&room==afx_cache_room&&framecount==afx_cache_frame&&!memcmp(&afx_cache_view,&View_position,sizeof afx_cache_view)&&afx_cache_turn==afx_turn()){
        memcpy(afx_lamps,afx_cache[0],sizeof afx_lamps);memcpy(afx_colors,afx_cache[1],sizeof afx_colors);
        memcpy(afx_light_world,afx_cache[2],sizeof afx_light_world);memcpy(afx_axes,afx_cache[3],sizeof afx_axes);return;
    }
    memset(afx_axes,0,sizeof afx_axes);
    memset(afx_light_world,0,sizeof afx_light_world);memset(afx_lamps,0,sizeof afx_lamps);memset(afx_colors,0,sizeof afx_colors);
    if(room<0||room>Highest_segment_index)return;
    float rank[3]={0};vms_vector center;compute_segment_center(&center,&Segments[room]);
    float cinema=astra_cinema(),time=astra_mine_clock>=0?astra_mine_clock:(double)(GameTime64%(F1_0*1800))/F1_0;
    /* Cinematic lighting: lamps of the neighbouring rooms seen through open sides light
     * this room too, so a lamp's pool carries on past the edge of its own segment. */
    int owners[7],count=0;owners[count++]=room;
    if(cinema>0)for(int c=0;c<6;c++){int child=Segments[room].children[c];if(child>=0&&child<=Highest_segment_index&&(WALL_IS_DOORWAY(&Segments[room],c)&WID_RENDPAST_FLAG))owners[count++]=child;}
    for(int o=0;o<count;o++){
    int owner=owners[o];vms_vector owner_center;compute_segment_center(&owner_center,&Segments[owner]);
    for(int s=0;s<6;s++)for(int rail=0;rail<2;rail++){
        side *face=&Segments[owner].sides[s];int base=face->tmap_num,top=face->tmap_num2&0x3fff;
        if(base<0||base>=NumTextures||top>=NumTextures||Light_subtracted[owner]&(1<<s))continue;
        if(Segments[owner].children[s]>=0)continue;
        int lava=astra_liquid_kind(base)==2;
        float power=f2fl(TmapInfo[base].lighting+(top?TmapInfo[top].lighting:0));
        aw_mount mount;int accent=aw_mount_at(owner,s,rail,&mount),vent=aw_vent(owner,s);
        if(rail&&!accent)continue;
        if(vent)power=.78f*aw_warmth(owner,s,time);
        if(accent)power=.85f;
        if(lava)power=fmaxf(.70f,power)*(.88f+.12f*sinf(time*.72f+owner*.4f+s));if(power<.06f)continue;
        vms_vector point;if(accent)point=mount.p;else compute_center_point_on_side(&point,&Segments[owner],s);
        float d=f2fl(vm_vec_dist_quick(&point,&center)),score=(lava?1.1f:vent?.9f:accent?1.f:power)/(4+d);int slot=0;
        for(int i=1;i<3;i++)if(rank[i]<rank[slot])slot=i;if(score<=rank[slot])continue;rank[slot]=score;
        vms_vector normal=face->normals[0],into;vm_vec_sub(&into,&owner_center,&point);if(vm_vec_dot(&normal,&into)<0)vm_vec_negate(&normal);
        vm_vec_scale_add2(&point,&normal,F1_0/2);g3s_point p;afx_point(&p,&point);
        afx_lamps[slot][0]=f2fl(p.p3_x);afx_lamps[slot][1]=f2fl(p.p3_y);afx_lamps[slot][2]=-f2fl(p.p3_z);
        if(accent){vms_vector axis;afx_axis(&axis,&mount.r);float scale=fmaxf(.001f,f2fl(vm_vec_mag(&axis)));afx_axes[slot][0]=f2fl(axis.x)/scale;afx_axes[slot][1]=f2fl(axis.y)/scale;afx_axes[slot][2]=-f2fl(axis.z)/scale;afx_axes[slot][3]=mount.width*scale;}
        else memset(afx_axes[slot],0,sizeof afx_axes[slot]);
        afx_lamps[slot][3]=fminf(lava?55:38,14+power*(lava?24:12))*(1+ac_tune[12]*cinema);
        afx_light_world[slot][0]=f2fl(point.x);afx_light_world[slot][1]=f2fl(point.y);afx_light_world[slot][2]=f2fl(point.z);afx_light_world[slot][3]=afx_lamps[slot][3];
        grs_bitmap *bm=&GameBitmaps[Textures[top&&TmapInfo[top].lighting>0?top:base].index];ogl_texture *tex=bm->gltexture;
        float tint[3]={1,.83f,.65f};int filtered=0;if(tex&&tex->faithful==26)filtered=aw_lens_tint(tex,owner,tint);
        if(lava||vent){tint[0]=1;tint[1]=vent?.30f:.24f;tint[2]=.025f;}
        if(accent)memcpy(tint,aw_palette[mount.color],sizeof tint);
        /* Cinematic lighting: an ordinary lamp lights in its own colour, and more strongly. */
        if(cinema>0&&!accent&&!vent&&!lava&&!(tex&&tex->faithful==26)){float lamp[3];ac_lamp_color(owner,s,lamp);for(int c=0;c<3;c++)tint[c]+=cinema*(lamp[c]-tint[c]);}
        float strength=vent?1.24f*aw_warmth(owner,s,time):accent?1.35f:fminf(lava?1.3f:.78f,.20f+power*(lava?.68f:.24f));for(int c=0;c<3;c++)afx_colors[slot][c]=tint[c]*strength;
        if(filtered)for(int c=0;c<3;c++)afx_colors[slot][c]*=1.6f;
        for(int c=0;c<3;c++)afx_colors[slot][c]*=1+ac_tune[3]*cinema;
        afx_colors[slot][3]=accent||filtered||vent?1:0;
    }
    }
    astra_scenery_light(room);
    astra_reaction_light(room);
    if(!afx_instance){
        afx_cache_room=room;afx_cache_frame=framecount;afx_cache_view=View_position;afx_cache_turn=afx_turn();
        memcpy(afx_cache[0],afx_lamps,sizeof afx_lamps);memcpy(afx_cache[1],afx_colors,sizeof afx_colors);
        memcpy(afx_cache[2],afx_light_world,sizeof afx_light_world);memcpy(afx_cache[3],afx_axes,sizeof afx_axes);
    }
}
