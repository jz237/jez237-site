/* Render-only geological shell. Shared rock edges use one world-space field
 * and shared normals. Unsupported borders taper to the native portal/fixture.
 * Noise is deterministic and never consumes the simulation random stream. */
typedef struct {int face,next;} ng_link;
static ng_link *ng_links;static int *ng_head;static float (*ng_normal)[3];static unsigned char *ng_border;
static int ng_level=-999,ng_rooms=-1,ng_vertices=-1,ng_count;static unsigned ng_catalogs;
typedef struct {int room,side,rock,type,ids[4],shared[4],wet[4];float p[4][3],n[3],corner[4][3],width,height,amplitude;int mounted,zone,closed[4];float mount[3],right[3],up[3];} ng_shape;
extern int astra_surface_mount(int,int,float*,float*,float*,int*);
static int ng_solid(int room,int s){
    side *f=&Segments[room].sides[s];if(Segments[room].children[s]<0&&f->wall_num<0)return 1;
    if(f->wall_num<0)return 0;wall *w=&Walls[f->wall_num];return w->type==WALL_DOOR&&w->clip_num>=0&&(WallAnims[w->clip_num].flags&WCF_HIDDEN);
}
static int ng_rock(int room,int s){
    side *f=&Segments[room].sides[s];int t=f->tmap_num;
    int family=astra_district_family(room,s);
    return ng_solid(room,s)&&!f->tmap_num2&&t>=0&&t<NumTextures&&!TmapInfo[t].lighting&&!astra_liquid_kind(t)&&(family>=0?sz_natural(family):astra_environment_rock(t));
}
static void ng_face_normal(int room,int s,float *n){
    side *f=&Segments[room].sides[s];vms_vector center,wall,d;compute_segment_center(&center,&Segments[room]);compute_center_point_on_side(&wall,&Segments[room],s);vm_vec_sub(&d,&center,&wall);
    al_vec(n,&f->normals[0]);if(f->type!=SIDE_IS_QUAD){float b[3];al_vec(b,&f->normals[1]);for(int k=0;k<3;k++)n[k]+=b[k];}astra_unit(n);
    if(n[0]*d.x+n[1]*d.y+n[2]*d.z<0)for(int k=0;k<3;k++)n[k]=-n[k];
}
static int ng_adjacent(int face,int a,int b){
    for(int i=ng_head[a];i>=0;i=ng_links[i].next){int f=ng_links[i].face;if(f==face)continue;int ids[4];get_side_verts(ids,f/6,f%6);
        for(int e=0;e<4;e++)if((ids[e]==a&&ids[(e+1)%4]==b)||(ids[e]==b&&ids[(e+1)%4]==a))return f;}
    return -1;
}
static void ng_catalog(void){
    if(ng_level==Current_level_num&&ng_rooms==Highest_segment_index&&ng_vertices==Highest_vertex_index)return;
    ng_level=Current_level_num;ng_rooms=Highest_segment_index;ng_vertices=Highest_vertex_index;ng_count=0;ng_catalogs++;
    free(ng_links);free(ng_head);free(ng_normal);free(ng_border);
    ng_links=malloc((ng_rooms+1)*24*sizeof *ng_links);ng_head=malloc((ng_vertices+1)*sizeof *ng_head);ng_normal=calloc(ng_vertices+1,sizeof *ng_normal);ng_border=calloc(ng_vertices+1,1);
    if(!ng_links||!ng_head||!ng_normal||!ng_border){free(ng_links);free(ng_head);free(ng_normal);free(ng_border);ng_links=NULL;ng_head=NULL;ng_normal=NULL;ng_border=NULL;return;}
    for(int v=0;v<=ng_vertices;v++)ng_head[v]=-1;
    for(int r=0;r<=ng_rooms;r++)for(int s=0;s<6;s++)if(ng_rock(r,s)){
        int ids[4];float n[3];get_side_verts(ids,r,s);ng_face_normal(r,s,n);
        for(int e=0;e<4;e++){int v=ids[e];ng_links[ng_count]=(ng_link){r*6+s,ng_head[v]};ng_head[v]=ng_count++;for(int k=0;k<3;k++)ng_normal[v][k]+=n[k];}
    }
    for(int r=0;r<=ng_rooms;r++)for(int s=0;s<6;s++)if(ng_rock(r,s)){
        int ids[4];get_side_verts(ids,r,s);for(int e=0;e<4;e++)if(ng_adjacent(r*6+s,ids[e],ids[(e+1)%4])<0)ng_border[ids[e]]=ng_border[ids[(e+1)%4]]=1;
    }
    for(int v=0;v<=ng_vertices;v++)if(ng_head[v]>=0)astra_unit(ng_normal[v]);
}
static float ng_noise(float x,float y,float z){
    /* Continuous low-frequency strata with broken secondary ridges. */
    return .5f+.23f*sinf(x*.31f+y*.17f+z*.23f)+.15f*sinf(x*.79f-y*.57f+z*.43f)+.08f*sinf(x*1.71f+y*.93f-z*1.37f);
}
static void ng_prepare(int room,int s,int rock,ng_shape *g){
    memset(g,0,sizeof *g);g->room=room;g->side=s;g->rock=rock;g->type=Segments[room].sides[s].type;get_side_verts(g->ids,room,s);ng_face_normal(room,s,g->n);
    for(int i=0;i<4;i++)al_vec(g->p[i],&Vertices[g->ids[i]]);
    g->width=f2fl(vm_vec_dist(&Vertices[g->ids[0]],&Vertices[g->ids[1]]));g->height=f2fl(vm_vec_dist(&Vertices[g->ids[0]],&Vertices[g->ids[3]]));
    g->amplitude=fminf(1.3f,fminf(g->width,g->height)*.05f);
    g->mounted=astra_surface_mount(room,s,g->mount,g->right,g->up,&g->zone);
    if(rock)ng_catalog();
    for(int i=0;i<4;i++){
        memcpy(g->corner[i],g->n,sizeof g->n);
        for(int f=0;f<6;f++)if(f!=s&&ng_solid(room,f)){int ids[4],matches=0;get_side_verts(ids,room,f);for(int j=0;j<4;j++)if(ids[j]==g->ids[i]||ids[j]==g->ids[(i+1)%4])matches++;if(matches==2)g->closed[i]=1;}
        if(rock&&ng_head){g->shared[i]=ng_adjacent(room*6+s,g->ids[i],g->ids[(i+1)%4])>=0;memcpy(g->corner[i],ng_normal[g->ids[i]],sizeof g->n);}
        for(int f=0;f<6;f++)if(astra_liquid_kind(Segments[room].sides[f].tmap_num)==1){int ids[4],matches=0;get_side_verts(ids,room,f);for(int j=0;j<4;j++)if(ids[j]==g->ids[i]||ids[j]==g->ids[(i+1)%4])matches++;if(matches==2)g->wet[i]=1;}
    }
}
static void ng_weights(int type,float u,float v,float *w){
    w[0]=(1-u)*(1-v);w[1]=u*(1-v);w[2]=u*v;w[3]=(1-u)*v;
    if(type==SIDE_IS_TRI_02){if(u>=v){w[0]=1-u;w[1]=u-v;w[2]=v;w[3]=0;}else{w[0]=1-v;w[1]=0;w[2]=u;w[3]=v-u;}}
    if(type==SIDE_IS_TRI_13){if(u+v<=1){w[0]=1-u-v;w[1]=u;w[2]=0;w[3]=v;}else{w[0]=0;w[1]=1-v;w[2]=u+v-1;w[3]=1-u;}}
}
static void ng_position(ng_shape *g,float u,float v,float *p,float *finish){
    float w[4],direction[3]={0},edge[4]={v*g->height,(1-u)*g->width,(1-v)*g->height,u*g->width};ng_weights(g->type,u,v,w);memset(p,0,3*sizeof(float));
    for(int i=0;i<4;i++)for(int k=0;k<3;k++){p[k]+=g->p[i][k]*w[i];direction[k]+=g->corner[i][k]*w[i];}astra_unit(direction);
    float rise,ao=1,wet=0;
    if(g->rock){
        float guard=1,join=1;
        for(int i=0;i<4;i++){
            if(!g->shared[i])guard=fminf(guard,nd_smooth(edge[i]/1.25f));
            if(ng_border&&ng_border[g->ids[i]]){float delta[3];for(int k=0;k<3;k++)delta[k]=p[k]-g->p[i][k];join=fminf(join,nd_smooth(sqrtf(al_dot(delta,delta))/1.25f));}
            if(g->wet[i])wet=fmaxf(wet,(1-nd_smooth(edge[i]/2.4f))*(.72f+.28f*ng_noise(p[0]*2,p[1]*2,p[2]*2)));
        }
        float field=ng_noise(p[0]*.62f,p[1]*.62f,p[2]*.62f);float strata=.5f+.5f*sinf(p[1]*1.8f+p[0]*.24f+p[2]*.19f+field*2.8f);
        /* One amplitude at shared borders prevents cracks between unequal faces. */
        float edgeDistance=fminf(fminf(edge[0],edge[1]),fminf(edge[2],edge[3]));float amp=.62f+(g->amplitude-.62f)*nd_smooth(edgeDistance/1.4f);
        for(int e=0;e<4;e++)if(edge[e]<.0001f&&g->shared[e]){guard=1;for(int i=0;i<4;i++)if(ng_border&&ng_border[g->ids[i]]){float delta[3];for(int k=0;k<3;k++)delta[k]=p[k]-g->p[i][k];guard=fminf(guard,nd_smooth(sqrtf(al_dot(delta,delta))/1.25f));}join=1;}
        float rounded=0;for(int e=0;e<4;e++)if(g->shared[e])rounded=fmaxf(rounded,(1-nd_smooth(edge[e]/2.8f))*.64f);
        /* Broad asymmetric shelves and fracture shoulders: same grid and a
         * zero contribution on shared boundaries keep neighboring skins joined. */
        float fracture=.5f+.5f*sinf(p[0]*.27f-p[1]*.41f+p[2]*.36f+field*3.1f);
        float ledge=(nd_smooth((strata-.35f)/.38f)*.20f+nd_smooth((fracture-.42f)/.3f)*.27f)*nd_smooth(edgeDistance/2.2f);
        rise=.008f+guard*join*(amp*(.30f+field*.66f+strata*.25f)+rounded+ledge);ao=.76f+.24f*nd_smooth(field*1.2f+strata*.18f);
    }else{float edgeDistance=fminf(fminf(edge[0],edge[1]),fminf(edge[2],edge[3])),joint=fabsf(u-.5f)*g->width;rise=.008f+.21f*nd_smooth(fminf(edgeDistance,joint)/.45f);ao=.72f+.28f*nd_smooth(fminf(edgeDistance,joint)/.6f);}
    for(int k=0;k<3;k++)p[k]+=direction[k]*rise;
    if(finish){finish[0]=ao;finish[1]=wet;finish[2]=0;finish[3]=0;}
}
/* Baked once per surface upload. All distances are world units, so a bolt
 * recess or a wet tide line cannot stretch to room-sized proportions. */
static void ng_finish(ng_shape *g,float u,float v,nd_vertex *out){
    float edge[4]={v*g->height,(1-u)*g->width,(1-v)*g->height,u*g->width},contact=0,wet=out->finish[1];
    for(int e=0;e<4;e++){
        if(g->closed[e])contact=fmaxf(contact,(1-nd_smooth(edge[e]/1.0f))*.15f);
        if(g->wet[e])wet=fmaxf(wet,(1-nd_smooth(edge[e]/2.4f))*(.78f+.22f*ng_noise(out->p[0]*2,out->p[1]*2,out->p[2]*2)));
    }
    float rust=0,soot=0;
    if(g->mounted){
        float delta[3];for(int k=0;k<3;k++)delta[k]=out->p[k]-g->mount[k];
        float x=al_dot(delta,g->right),y=al_dot(delta,g->up);
        float box=fmaxf(fabsf(x)-2.72f,fabsf(y)-2.67f);
        contact=fmaxf(contact,.37f*(1-nd_smooth(fmaxf(0,box)/1.0f)));
        float below=nd_smooth((-y-2.0f)/.65f)*(1-nd_smooth((-y-2.7f)/5.5f));
        float drip=1-nd_smooth(fabsf(fabsf(x)-1.25f)/.78f);
        rust=below*drip*(g->zone==2?.8f:.5f);
        if(g->zone!=2){float above=nd_smooth((y-1.2f)/1.0f)*(1-nd_smooth((y-2.1f)/4.5f));soot=above*(1-nd_smooth(fabsf(x+1.05f)/2.2f))*.66f;}
    }
    out->finish[0]*=1-contact;out->finish[1]=wet;out->finish[2]=rust;out->finish[3]=soot;
}
static void ng_point(ng_shape *g,float u,float v,nd_vertex *out){
    float w[4];ng_weights(g->type,u,v,w);memset(out,0,sizeof *out);ng_position(g,u,v,out->p,out->finish);ng_finish(g,u,v,out);side *f=&Segments[g->room].sides[g->side];
    for(int i=0;i<4;i++){out->uv[0]+=f2fl(f->uvls[i].u)*w[i];out->uv[1]+=f2fl(f->uvls[i].v)*w[i];}out->uv[2]=u;out->uv[3]=v;
    float a[3],b[3],c[3],d[3];float du=fminf(.006f,.08f/fmaxf(1,g->width)),dv=fminf(.006f,.08f/fmaxf(1,g->height));
    ng_position(g,fmaxf(0,u-du),v,a,NULL);ng_position(g,fminf(1,u+du),v,b,NULL);ng_position(g,u,fmaxf(0,v-dv),c,NULL);ng_position(g,u,fminf(1,v+dv),d,NULL);
    for(int k=0;k<3;k++){b[k]-=a[k];d[k]-=c[k];}al_cross(out->n,b,d);astra_unit(out->n);if(al_dot(out->n,g->n)<0)for(int k=0;k<3;k++)out->n[k]*=-1;
    if(g->rock){float edge=fminf(fminf(u,1-u)*g->width,fminf(v,1-v)*g->height),mix=1-nd_smooth(edge/.8f),shared=0;float n[3]={0};for(int i=0;i<4;i++)for(int k=0;k<3;k++)n[k]+=g->corner[i][k]*w[i];for(int i=0;i<4;i++)shared+=g->shared[i];if(shared>0){for(int k=0;k<3;k++)out->n[k]=out->n[k]*(1-mix)+n[k]*mix;astra_unit(out->n);}}
}
