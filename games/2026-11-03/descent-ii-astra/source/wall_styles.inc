/* R44. Palette and mounting geometry shared by visible lamps and their light.
 * Only ordinary solid metal faces are eligible. No portals, native lamps,
 * functional overlays, hidden panels, hazards or simulation state are changed. */
#include "gameseq.h"
extern int astra_gallery_scene,astra_gallery_room,astra_gallery_side;
typedef struct {vms_vector p,r,u,n;float width;int color;} aw_mount;
static const float aw_palette[4][3]={{1,.075f,.035f},{.07f,.27f,1},{.035f,.86f,1},{1,.44f,.055f}};
static int aw_room=-1;
/* Filter selected neutral service lamps; retain all originally colored lenses.
 * White work-light rooms remain between colored sectors, including rock mines. */
static int aw_lens_tint(const ogl_texture *tex,int room,float tint[3]){
    memcpy(tint,tex->generated_tint,sizeof(float)*3);
    if(tex->faithful!=26||room<0||room>Highest_segment_index)return 0;
    if(room==astra_gallery_room&&astra_gallery_scene>=21&&astra_gallery_scene<=24){for(int c=0;c<3;c++)tint[c]=.12f+.88f*aw_palette[astra_gallery_scene-21][c];return 1;}
    if(room%3==0)return 0;
    float hi=fmaxf(tint[0],fmaxf(tint[1],tint[2])),lo=fminf(tint[0],fminf(tint[1],tint[2]));
    if(lo<hi*.72f)return 0;
    for(int c=0;c<3;c++)tint[c]=.12f+.88f*aw_palette[(room/7)%4][c];return 1;
}
static int aw_mount_at(int room,int s,int slot,aw_mount *m){
    if(room<0||room>Highest_segment_index||s<0||s>5)return 0;
    segment *seg=&Segments[room];side *f=&seg->sides[s];int t=f->tmap_num;
    if(seg->children[s]>=0||f->wall_num>=0||f->tmap_num2||f->type!=SIDE_IS_QUAD||t<0||t>=NumTextures)return 0;
    if(TmapInfo[t].damage||TmapInfo[t].lighting||TmapInfo[t].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD))return 0;
    grs_bitmap *bm=&GameBitmaps[Textures[t].index];const char *name=piggy_game_bitmap_name(bm);
    if(!name||bm->bm_flags&(BM_FLAG_TRANSPARENT|BM_FLAG_SUPER_TRANSPARENT))return 0;
    int n=atoi(name+4);if(strncmp(name,"metl",4)&&strncmp(name,"ceil",4))return 0;
    if(!strncmp(name,"metl",4)&&(n==23||n==24||n==65||n==68||n==70||n==96))return 0;
    if(!strncmp(name,"ceil",4)&&(n==6||n==15||n==16||n==17||n==19))return 0;
    int ids[4];get_side_verts(ids,room,s);vms_vector a,b,center,into;
    vm_vec_sub(&a,&Vertices[ids[1]],&Vertices[ids[0]]);vm_vec_sub(&b,&Vertices[ids[3]],&Vertices[ids[0]]);
    float w=f2fl(vm_vec_mag(&a)),h=f2fl(vm_vec_mag(&b));if(w<9||h<9||w>90||h>90)return 0;
    m->r=a;vm_vec_normalize(&m->r);m->n=f->normals[0];compute_segment_center(&center,seg);
    /* An inset strip follows the actual quad instead of a texture's rotation. */
    if(slot&&(w<16||h<16||(room+s)%3==0))return 0;
    m->p=Vertices[ids[0]];vm_vec_scale_add2(&m->p,&a,F1_0/2);vm_vec_scale_add2(&m->p,&b,fl2f(slot?.89f:.11f));
    vm_vec_sub(&into,&center,&m->p);if(vm_vec_dot(&m->n,&into)<0)vm_vec_negate(&m->n);
    vm_vec_cross(&m->u,&m->n,&m->r);vm_vec_normalize(&m->u);m->width=fminf(8.f,w*.37f);m->color=(room/7)%4;
    /* Reject skewed/sliver faces whose rectangle would extend past an edge. */
    for(int x=-1;x<=1;x+=2)for(int y=-1;y<=1;y+=2){
        vms_vector q=m->p;vm_vec_scale_add2(&q,&m->r,fl2f(x*(m->width+.25f)));vm_vec_scale_add2(&q,&m->u,fl2f(y*.75f));
        fix sign=0;for(int i=0;i<4;i++){
            vms_vector edge,d,c;vm_vec_sub(&edge,&Vertices[ids[(i+1)%4]],&Vertices[ids[i]]);vm_vec_sub(&d,&q,&Vertices[ids[i]]);vm_vec_cross(&c,&edge,&d);fix z=vm_vec_dot(&c,&m->n);
            if(z&&sign&&((z<0)!=(sign<0)))return 0;if(z)sign=z;
        }
    }
    if(room==astra_gallery_room&&s==astra_gallery_side&&astra_gallery_scene>=21&&astra_gallery_scene<=24)m->color=astra_gallery_scene-21;
    return 1;
}
static int aw_mount_for(int room,int s,aw_mount *m){return aw_mount_at(room,s,0,m);}
/* Warm backlights belong only to ordinary ventilation art or an explicit
 * paused showroom sample. Never illuminate a passage, secret or damage field. */
static int aw_vent(int room,int s){
    side *f=&Segments[room].sides[s];int t=f->tmap_num;
    if(Segments[room].children[s]>=0||f->wall_num>=0||f->type!=SIDE_IS_QUAD||t<0||t>=NumTextures)return 0;
    if(TmapInfo[t].damage||TmapInfo[t].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD))return 0;
    if(room==astra_gallery_room&&s==astra_gallery_side&&astra_gallery_scene==25)return 1;
    if(f->tmap_num2)return 0;
    const char *name=piggy_game_bitmap_name(&GameBitmaps[Textures[t].index]);int num=name?atoi(name+4):0;
    return name&&!strncmp(name,"ceil",4)&&(num==15||num==16||num==17||num==19);
}
static float aw_warmth(int room,int s,float clock){return .94f+.045f*sinf(clock*.85f+room*.73f+s);}
int astra_wall_style(int room,int s){aw_mount m;return aw_mount_for(room,s,&m)?1+m.color:0;}
int astra_wall_inspection_anchor(int room,int s,vms_vector *point){aw_mount m;if(!aw_mount_for(room,s,&m))return 0;*point=m.p;return 1;}
