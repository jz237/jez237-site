/* Excavation zoning is a read-only view of the native segment graph. Doors,
 * overlays, lights, secrets, animated/hazardous materials and functional rooms
 * are never resurfaced. No objects, navigation data or simulation RNG change. */
static unsigned char gm_zone[MAX_SEGMENTS],gm_faces[MAX_SEGMENTS][6],gm_variant[MAX_SEGMENTS];
static int gm_level=-999,gm_count=-1,gm_rooms,gm_surfaces,gm_edges;
static vms_vector gm_first;
static unsigned gm_hash(unsigned n){n^=n>>16;n*=0x7feb352du;n^=n>>15;n*=0x846ca68bu;return n^(n>>16);}
static int gm_safe(int room,int face){
    segment *s=&Segments[room];side *f=&s->sides[face];int t=f->tmap_num;
    if(s->children[face]>=0||f->wall_num>=0||f->type!=SIDE_IS_QUAD||f->tmap_num2||t<0||t>=NumTextures)return 0;
    if(TmapInfo[t].damage||TmapInfo[t].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD)||TmapInfo[t].lighting>0||TmapInfo[t].eclip_num>=0)return 0;
    int ids[4];get_side_verts(ids,room,face);
    float w=f2fl(vm_vec_dist(&Vertices[ids[0]],&Vertices[ids[1]])),h=f2fl(vm_vec_dist(&Vertices[ids[0]],&Vertices[ids[3]]));
    if(w<8||h<8||w>100||h>100)return 0;
    /* Extremely skewed quadrilaterals cannot safely host fitted machinery. */
    float d=f2fl(vm_vec_dist(&Vertices[ids[0]],&Vertices[ids[2]]));return d>fmaxf(w,h)*.45f;
}
static void gm_regions(void){
    if(gm_level==Current_level_num&&gm_count==Highest_segment_index&&!memcmp(&gm_first,&Vertices[0],sizeof gm_first))return;
    gm_level=Current_level_num;gm_count=Highest_segment_index;gm_first=Vertices[0];gm_rooms=gm_surfaces=gm_edges=0;
    memset(gm_zone,0,sizeof gm_zone);memset(gm_faces,0,sizeof gm_faces);
    unsigned char eligible[MAX_SEGMENTS]={0},rock[MAX_SEGMENTS]={0},weight[MAX_SEGMENTS]={0};int queue[MAX_SEGMENTS],head=0,tail=0,best=-1,best_score=-1,available=0;
    for(int r=0;r<=Highest_segment_index;r++){
        int protected=Segment2s[r].special!=SEGMENT_IS_NOTHING,score=0,ports=0;
        for(int f=0;f<6;f++){
            side *s=&Segments[r].sides[f];int t=s->tmap_num;
            if(t>=0&&t<NumTextures&&(TmapInfo[t].damage||TmapInfo[t].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD)))protected=1;
            if(s->wall_num>=0&&Walls[s->wall_num].type==WALL_DOOR&&Walls[s->wall_num].clip_num>=0&&(WallAnims[Walls[s->wall_num].clip_num].flags&WCF_HIDDEN))protected=1;
            if(gm_safe(r,f)){score++;if(astra_environment_rock(t))rock[r]++;}
            if(Segments[r].children[f]>=0)ports++;
        }
        eligible[r]=!protected&&score>=1;
        weight[r]=score+(ports==2?2:0);if(eligible[r])available++;
        if(eligible[r]&&score+(ports==2?2:0)>best_score){best=r;best_score=score+(ports==2?2:0);}
        if(eligible[r]&&rock[r]){gm_zone[r]=3;queue[tail++]=r;}
    }
    /* Mines without an existing rock patch get one connected excavation zone. */
    if(!tail&&best>=0){gm_zone[best]=4;queue[tail++]=best;}
    for(int patch=0;patch<MAX_SEGMENTS;patch++){
        while(head<tail){int r=queue[head++];if(gm_zone[r]<=1)continue;
            for(int f=0;f<6;f++){int c=Segments[r].children[f];
                if(c<0||c>Highest_segment_index||!eligible[c]||gm_zone[c]||Segments[r].sides[f].wall_num>=0)continue;
                gm_zone[c]=gm_zone[r]-1;queue[tail++]=c;
            }
        }
        if(tail>=available*.43f)break;
        /* Add connected excavation pockets among broad transport spaces.
         * Doors bound zones; service rooms retain their original purpose. */
        int seed=-1;float score=-1;
        for(int r=0;r<=Highest_segment_index;r++)if(eligible[r]&&!gm_zone[r]){
            float s=weight[r]+(gm_hash(r+Current_level_num*971u)%1000)*.001f;
            for(int f=0;f<6;f++){int c=Segments[r].children[f];if(c>=0&&eligible[c]&&!gm_zone[c]&&Segments[r].sides[f].wall_num<0)s+=1.5f;}
            if(s>score){score=s;seed=r;}
        }
        if(seed<0)break;gm_zone[seed]=3;queue[tail++]=seed;
    }
    for(int r=0;r<=Highest_segment_index;r++){
        vms_vector c;compute_segment_center(&c,&Segments[r]);
        /* Broad geological bands share a palette across adjoining rooms. */
        gm_variant[r]=(unsigned)(abs(c.x/i2f(160))+abs(c.z/i2f(160))+abs(Current_level_num))%3;
        int n=0;
        for(int f=0;f<6;f++)if(gm_zone[r]&&gm_safe(r,f)){
            gm_faces[r][f]=gm_zone[r]>=2||astra_environment_rock(Segments[r].sides[f].tmap_num)?1:2;
            gm_surfaces++;n++;if(gm_faces[r][f]==2)gm_edges++;
        }
        if(n)gm_rooms++;
    }
}
int astra_excavation_face(int room,int face){gm_regions();return room>=0&&room<=Highest_segment_index&&face>=0&&face<6?gm_faces[room][face]:0;}
int astra_excavation_bay(int room){
    gm_regions();int choice=-1;float best=0;
    for(int f=0;f<6;f++)if(gm_faces[room][f]){
        int ids[4];get_side_verts(ids,room,f);float w=f2fl(vm_vec_dist(&Vertices[ids[0]],&Vertices[ids[1]])),h=f2fl(vm_vec_dist(&Vertices[ids[0]],&Vertices[ids[3]]));
        if(w>=16&&h>=14&&w<=70&&h<=70&&w*h>best){
            vms_vector ctr,mid,up,normal=Segments[room].sides[f].normals[0],into;vms_matrix basis;
            compute_center_point_on_side(&mid,&Segments[room],f);compute_segment_center(&ctr,&Segments[room]);vm_vec_sub(&into,&ctr,&mid);if(vm_vec_dot(&normal,&into)<0)vm_vec_negate(&normal);
            vm_vec_normalized_dir(&up,&Vertices[ids[3]],&Vertices[ids[0]]);vm_vector_2_matrix(&basis,&normal,&up,NULL);int fits=1;
            for(int x=-1;x<=1;x+=2)for(int y=-1;y<=1;y+=2){vms_vector p=mid;vm_vec_scale_add2(&p,&basis.rvec,fl2f(x*4.25f));vm_vec_scale_add2(&p,&basis.uvec,fl2f(-h*.14f+y*2.65f));vm_vec_scale_add2(&p,&normal,F1_0/2);if(find_point_seg(&p,room)!=room)fits=0;}
            if(fits){choice=f;best=w*h;}
        }
    }return choice;
}
