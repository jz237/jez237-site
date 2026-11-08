/* R75. Connected architectural districts, built once per loaded mine.
 * Material substitution is cosmetic; native geometry, portals, lights, signs,
 * hazards, secret-door behavior and simulation RNG remain authoritative. */
#include "gameseg.h"
#include "gameseq.h"
#include "wall.h"
#include "fuelcen.h"
extern int astra_ov_enabled(void);
enum { SZ_TYPES=8 };
static short sz_regions[MAX_SEGMENTS],sz_queue[MAX_SEGMENTS],sz_sizes[MAX_SEGMENTS];
static unsigned char sz_types[MAX_SEGMENTS];
static int sz_level=-999,sz_rooms=-1,sz_vertices=-1,sz_count,sz_builds,sz_face_room=-1,sz_face_side=-1;
static vms_vector sz_first;
static unsigned sz_draws,sz_seen;
static int sz_solid(int room,int s){
    side *f=&Segments[room].sides[s];
    if(f->wall_num<0)return Segments[room].children[s]<0;
    wall *w=&Walls[f->wall_num];
    return w->type==WALL_DOOR&&w->clip_num>=0&&(WallAnims[w->clip_num].flags&WCF_HIDDEN);
}
static void sz_build(void){
    if(sz_level==Current_level_num&&sz_rooms==Highest_segment_index&&sz_vertices==Highest_vertex_index&&!memcmp(&sz_first,&Vertices[0],sizeof sz_first))return;
    sz_level=Current_level_num;sz_rooms=Highest_segment_index;sz_vertices=Highest_vertex_index;sz_first=Vertices[0];sz_count=0;sz_builds++;sz_seen=sz_draws=0;
    memset(sz_regions,0xff,sizeof sz_regions);memset(sz_sizes,0,sizeof sz_sizes);
    /* A bounded breadth-first fill creates contiguous stretches of 8-16 rooms.
     * Door thresholds and large spatial gaps naturally divide districts. */
    for(int seed=0;seed<=sz_rooms;seed++)if(sz_regions[seed]<0){
        int id=sz_count++,head=0,tail=1,limit=10+(id%4)*2;
        sz_queue[0]=seed;sz_regions[seed]=id;
        vms_vector center;compute_segment_center(&center,&Segments[seed]);
        while(head<tail){int r=sz_queue[head++];
            for(int j=0;j<6&&tail<limit;j++){int s=(j+id)%6,child=Segments[r].children[s];
                if(child<0||child>sz_rooms||sz_regions[child]>=0||Segments[r].sides[s].wall_num>=0)continue;
                vms_vector p;compute_segment_center(&p,&Segments[child]);if(vm_vec_dist_quick(&p,&center)>i2f(110))continue;
                sz_regions[child]=id;sz_queue[tail++]=child;
            }
        }
        sz_sizes[id]=tail;
    }
    /* Attach tiny dead ends to their surrounding district. This avoids isolated
     * randomly colored cubes while retaining the connected region property. */
    for(int pass=0;pass<3;pass++)for(int id=0;id<sz_count;id++)if(sz_sizes[id]>0&&sz_sizes[id]<4){
        int target=-1;
        for(int r=0;r<=sz_rooms;r++)if(sz_regions[r]==id)for(int s=0;s<6;s++){
            int c=Segments[r].children[s];if(c<0||c>sz_rooms)continue;int other=sz_regions[c];
            if(other!=id&&sz_sizes[other]>=4&&(target<0||sz_sizes[other]>sz_sizes[target]))target=other;
        }
        if(target>=0){for(int r=0;r<=sz_rooms;r++)if(sz_regions[r]==id)sz_regions[r]=target;sz_sizes[target]+=sz_sizes[id];sz_sizes[id]=0;}
    }
    /* Neighboring surviving districts advance through a deliberate palette.
     * No native object, texture index, light value or gameplay random state is written. */
    int ordinal=0;for(int id=0;id<sz_count;id++)if(sz_sizes[id])sz_types[id]=(ordinal+++(abs(Current_level_num)-1)*3)%SZ_TYPES;
    EM_ASM(Module.mineDistricts=({version:75,regions:$0,rooms:$1,builds:$2,counts:Array(8).fill(0),seen:0,draws:0});for(let i=0;i<$1;i++)Module.mineDistricts.counts[HEAPU8[$3+HEAP16[($4>>1)+i]]]++;,ordinal,sz_rooms+1,sz_builds,sz_types,sz_regions);
}
int astra_district(int room){if(room<0||room>Highest_segment_index||astra_ov_enabled())return -1;sz_build();return sz_types[sz_regions[room]];}
static int sz_natural(int family){return family==3||family>=16;}
static int sz_eligible(int room,int s){
    if(room<0||room>Highest_segment_index||s<0||s>5||!sz_solid(room,s))return 0;
    side *f=&Segments[room].sides[s];int t=f->tmap_num;
    if(f->tmap_num2||t<0||t>=NumTextures||TmapInfo[t].lighting||TmapInfo[t].damage||TmapInfo[t].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD))return 0;
    grs_bitmap *bm=&GameBitmaps[Textures[t].index];const char *n=piggy_game_bitmap_name(bm);if(!n)return 0;
    if(f->wall_num>=0)return 1; /* Native alpha still opens a hidden wall. */
    if(bm->bm_flags&(BM_FLAG_TRANSPARENT|BM_FLAG_SUPER_TRANSPARENT))return 0;
    if(strncmp(n,"rock",4)&&strncmp(n,"metl",4)&&strncmp(n,"ceil",4)&&strncmp(n,"wall",4))return 0;
    if(strchr(n,'#'))return 0;int number=atoi(n+4);
    if(!strncmp(n,"ceil",4)&&(number==6||number==15||number==16||number==17||number==19))return 0;
    if(!strncmp(n,"metl",4)&&(number==23||number==24||number==65||number==68||number==70||number==96))return 0;
    return 1;
}
/* Returns a shared atlas family, never changes a bitmap/level texture itself. */
int astra_district_family(int room,int s){
    int zone=astra_district(room);if(zone<0||!sz_eligible(room,s))return -1;
    side *f=&Segments[room].sides[s];ogl_texture *tex=GameBitmaps[Textures[f->tmap_num].index].gltexture;
    if(tex&&tex->faithful>=20){int old=tex->faithful-20;if(old!=0&&old!=3&&old!=8&&old!=9&&old!=12&&old!=14)return -1;}
    if(zone<4){static int natural[]={3,16,17,18};return natural[zone];}
    if(zone==4)return 3; /* Half-built lining is blended over exposed rock. */
    if(zone==5)return 8;
    if(zone==6)return 12;
    return 9;
}
static int sz_support(int room){int z=astra_district(room);return z>=4;}
static int sz_material(int room,int s,int original){int family=astra_district_family(room,s);return family>=0?family:original;}
static void sz_record(int room){int z=astra_district(room);if(z>=0){sz_draws++;sz_seen|=1u<<z;}}
