/* R37: render-only, smooth distance contours for native animated doors.
 * Native wall state, animation timing, collision and triggers remain untouched.
 * One padded atlas per visible clip; no image downloads or per-frame allocation. */
#include "wall.h"
#include "gameseq.h"
extern int astra_mine_wall,astra_mine_wall2;
extern float astra_mine_door;
typedef struct {GLuint handle;int frames,w,h;} ad_atlas;
static ad_atlas ad_atlases[MAX_WALL_ANIMS];
static int ad_clip=-1,ad_level=-999,ad_segments=-1,ad_base;
static grs_bitmap *ad_bitmap;
static float ad_phase;
static unsigned ad_draws;
enum {AD_SIZE=64,AD_TILE=68,AD_COLUMNS=8};
static void ad_clear(void){
    for(int i=0;i<MAX_WALL_ANIMS;i++)if(ad_atlases[i].handle){glDeleteTextures(1,&ad_atlases[i].handle);memset(&ad_atlases[i],0,sizeof ad_atlases[i]);}
    ad_clip=-1;
}
void astra_door_face(int room,int face){
    if(ad_level!=Current_level_num||ad_segments!=Highest_segment_index){ad_clear();ad_level=Current_level_num;ad_segments=Highest_segment_index;}
    ad_clip=-1;ad_phase=0;ad_bitmap=NULL;
    if(room<0||room>Highest_segment_index||face<0||face>5)return;
    int id=Segments[room].sides[face].wall_num;
    if(id<0||id>=Num_walls)return;wall *w=&Walls[id];
    if(w->type!=WALL_DOOR||w->clip_num<0||w->clip_num>=Num_wall_anims)return;
    wclip *clip=&WallAnims[w->clip_num];int n=clip->num_frames;
    if(n<2||n>MAX_CLIP_FRAMES||(clip->flags&WCF_BLASTABLE))return;
    ad_clip=w->clip_num;ad_base=(clip->flags&WCF_TMAP1)!=0;
    int t=ad_base?Segments[room].sides[face].tmap_num:Segments[room].sides[face].tmap_num2&0x3fff;
    if(t>=0&&t<NumTextures)ad_bitmap=&GameBitmaps[Textures[t].index];
    for(int i=0;i<n;i++)if(clip->frames[i]==t){ad_phase=i;break;}
    if(astra_mine_door>=0&&(id==astra_mine_wall||id==astra_mine_wall2))ad_phase=astra_mine_door*(n-1);
    else if(w->state==WALL_DOOR_OPEN||w->state==WALL_DOOR_WAITING)ad_phase=n-1;
    else if(w->state==WALL_DOOR_CLOSED)ad_phase=0;
    else for(int d=0;d<Num_open_doors;d++){
        active_door *a=&ActiveDoors[d];int match=0;
        for(int p=0;p<a->n_parts&&p<2;p++)if(a->front_wallnum[p]==id||a->back_wallnum[p]==id)match=1;
        if(!match)continue;
        /* Use the same fixed-point frame interval as wall.c, retaining its
         * fractional part only in the renderer. Reversals follow native time. */
        float f=a->time/(float)(clip->play_time/n?clip->play_time/n:1);
        ad_phase=w->state==WALL_DOOR_CLOSING?n-1-f:f;break;
    }
    ad_phase=fminf(n-1,fmaxf(0,ad_phase));
}
static int ad_matches(ogl_texture *texture){return ad_clip>=0&&ad_bitmap&&texture==ad_bitmap->gltexture;}
static void ad_distance(float *d,const unsigned char *mask,int target){
    const int n=AD_SIZE;
    for(int i=0;i<n*n;i++)d[i]=(mask[i]!=0)==target?0:128;
    for(int pass=0;pass<2;pass++)for(int yy=0;yy<n;yy++)for(int xx=0;xx<n;xx++){
        int x=pass?n-1-xx:xx,y=pass?n-1-yy:yy,step=pass?1:-1,i=y*n+x;
        if(x+step>=0&&x+step<n)d[i]=fminf(d[i],d[i+step]+1);
        if(y+step>=0&&y+step<n){
            d[i]=fminf(d[i],d[i+step*n]+1);
            if(x>0)d[i]=fminf(d[i],d[i+step*n-1]+1.41421356f);
            if(x<n-1)d[i]=fminf(d[i],d[i+step*n+1]+1.41421356f);
        }
    }
}
static int ad_build(int id){
    if(id<0||id>=Num_wall_anims)return 0;
    ad_atlas *atlas=&ad_atlases[id];if(atlas->handle)return 1;
    wclip *clip=&WallAnims[id];int w=1024,h=pow2ize(((clip->num_frames+7)/8)*AD_TILE);
    unsigned char *pixels=calloc(w*h,1),mask[AD_SIZE*AD_SIZE],index[256*256];
    float inside[AD_SIZE*AD_SIZE],outside[AD_SIZE*AD_SIZE],field[AD_SIZE*AD_SIZE];
    if(!pixels)return 0;
    for(int f=0;f<clip->num_frames;f++){
        int t=clip->frames[f];if(t<0||t>=NumTextures){free(pixels);return 0;}
        PIGGY_PAGE_IN(Textures[t]);grs_bitmap *bm=&GameBitmaps[Textures[t].index];
        int bw=bm->bm_w,bh=bm->bm_h;
        if(!bm->bm_data||bw<1||bh<1||bw>256||bh>256){free(pixels);return 0;}
        if(bm->bm_flags&BM_FLAG_RLE){int wide=(bm->bm_flags&BM_FLAG_RLE_BIG)!=0;unsigned char *sizes=bm->bm_data+4,*row=sizes+bh*(1+wide);
            for(int y=0;y<bh;y++){gr_rle_decode(row,index+y*bw);row+=wide?(sizes[y*2]|sizes[y*2+1]<<8):sizes[y];}
        }else for(int y=0;y<bh;y++)memcpy(index+y*bw,bm->bm_data+y*bm->bm_rowsize,bw);
        for(int y=0;y<AD_SIZE;y++)for(int x=0;x<AD_SIZE;x++){
            int p=index[(y*bh/AD_SIZE)*bw+x*bw/AD_SIZE];
            mask[y*AD_SIZE+x]=!((p==254&&(bm->bm_flags&BM_FLAG_SUPER_TRANSPARENT))||(p==255&&(bm->bm_flags&BM_FLAG_TRANSPARENT)));
        }
        ad_distance(inside,mask,0);ad_distance(outside,mask,1);
        for(int i=0;i<AD_SIZE*AD_SIZE;i++)field[i]=fminf(16,fmaxf(-16,mask[i]?inside[i]-.5f:.5f-outside[i]));
        /* Filter the distance, not the texture. A 64-pixel staircase becomes a
         * continuous diagonal/curve; narrow opaque borders stay bounded. */
        const float kernel[5]={1,4,6,4,1};
        for(int y=-2;y<AD_SIZE+2;y++)for(int x=-2;x<AD_SIZE+2;x++){
            int px=x<0?0:x>=AD_SIZE?AD_SIZE-1:x,py=y<0?0:y>=AD_SIZE?AD_SIZE-1:y;float d=0;
            for(int ky=-2;ky<=2;ky++)for(int kx=-2;kx<=2;kx++){
                int sx=px+kx,sy=py+ky;sx=sx<0?0:sx>=AD_SIZE?AD_SIZE-1:sx;sy=sy<0?0:sy>=AD_SIZE?AD_SIZE-1:sy;
                d+=field[sy*AD_SIZE+sx]*kernel[kx+2]*kernel[ky+2]/256.f;
            }
            pixels[((f/8)*AD_TILE+y+2)*w+(f%8)*AD_TILE+x+2]=(unsigned char)fminf(255,fmaxf(0,128+d*7.9f));
        }
    }
    glActiveTexture(GL_TEXTURE6);glGenTextures(1,&atlas->handle);glBindTexture(GL_TEXTURE_2D,atlas->handle);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE);
    glPixelStorei(GL_UNPACK_ALIGNMENT,1);glTexImage2D(GL_TEXTURE_2D,0,GL_LUMINANCE,w,h,0,GL_LUMINANCE,GL_UNSIGNED_BYTE,pixels);
    free(pixels);atlas->w=w;atlas->h=h;atlas->frames=clip->num_frames;
    glActiveTexture(GL_TEXTURE0);return 1;
}
static void ad_bind(GLuint program,int active){
    int ready=active&&ad_clip>=0&&ad_build(ad_clip);glUniform1f(glGetUniformLocation(program,"doorActive"),ready);
    glActiveTexture(GL_TEXTURE6);
    /* A valid same-type fallback also satisfies WebGL sampler validation on
     * ordinary walls, before the first door atlas has been constructed. */
    GLint fallback=0;if(!ready){glActiveTexture(GL_TEXTURE0);glGetIntegerv(GL_TEXTURE_BINDING_2D,&fallback);glActiveTexture(GL_TEXTURE6);}
    glBindTexture(GL_TEXTURE_2D,ready?ad_atlases[ad_clip].handle:(GLuint)fallback);
    if(ready){
        ad_atlas *a=&ad_atlases[ad_clip];int f=(int)floorf(ad_phase),g=f+1<a->frames?f+1:f;
        float tile[4]={((f%8)*AD_TILE+2.f)/a->w,((f/8)*AD_TILE+2.f)/a->h,((g%8)*AD_TILE+2.f)/a->w,((g/8)*AD_TILE+2.f)/a->h};
        glUniform4fv(glGetUniformLocation(program,"doorTiles"),1,tile);
        glUniform3f(glGetUniformLocation(program,"doorScale"),AD_SIZE/(float)a->w,AD_SIZE/(float)a->h,ad_phase-f);
        if((++ad_draws&31)==1)EM_ASM({Module.smoothDoors=({version:37,clip:$0,frame:$1,draws:$2});},ad_clip,ad_phase,ad_draws);
    }
    glActiveTexture(GL_TEXTURE0);
}
