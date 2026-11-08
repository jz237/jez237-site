/* R74: six shared, articulated wall installations. All placement is cosmetic.
 * Mounts are checked against the original solid face and convex room. */
typedef struct {ax_vertex v;float meta[4];} sc_vertex;
typedef struct {GLuint buffer;int count,glass;} sc_mesh;
typedef struct {int tested,valid,side,style;vms_vector p;vms_matrix basis;float shade;} sc_site;
static sc_mesh sc_meshes[6];static sc_site sc_sites[MAX_SEGMENTS];
static sc_vertex sc_data[18000];static float sc_meta[18000][4];
static GLuint sc_program,sc_atlas;static int sc_failed,sc_level=-999,sc_rooms=-1;
static unsigned sc_draws,sc_uploads,sc_vertices,sc_site_count,sc_seen;
static unsigned sc_hash(unsigned x){x^=x>>16;x*=0x7feb352dU;x^=x>>15;x*=0x846ca68bU;return x^(x>>16);}
static void sc_reset(void){if(sc_level==Current_level_num&&sc_rooms==Highest_segment_index)return;sc_level=Current_level_num;sc_rooms=Highest_segment_index;memset(sc_sites,0,sizeof sc_sites);sc_site_count=sc_seen=0;}
static sc_site *sc_site_for(int room){
    sc_reset();sc_site *m=&sc_sites[room];if(m->tested)return m;m->tested=1;if(!sz_support(room))return m;
    unsigned key=sc_hash(room+Current_level_num*1987u);int zone=astra_room_identity(room);
    m->style=key%6;if(key&8){if(zone==2)m->style=3;else if(zone==3)m->style=0;else if(zone==4)m->style=4;}
    float best=-1;vms_vector center;compute_segment_center(&center,&Segments[room]);
    for(int s=0;s<6;s++){
        side *face=&Segments[room].sides[s];int t=face->tmap_num;
        if(Segments[room].children[s]>=0||face->wall_num>=0||face->type!=SIDE_IS_QUAD||face->tmap_num2||t<0||t>=NumTextures||TmapInfo[t].lighting||TmapInfo[t].damage||(TmapInfo[t].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD))||astra_fixture_kind(room,s))continue;
        const char *name=piggy_game_bitmap_name(&GameBitmaps[Textures[t].index]);if(!name||(strncmp(name,"metl",4)&&strncmp(name,"rock",4)&&strncmp(name,"wall",4)))continue;
        vms_vector p;vms_matrix b;float w,h;if(!ae_basis(room,s,&p,&b,&w,&h)||w<16||h<12||w>95||h>95)continue;
        if(vm_vec_dist(&center,&p)<i2f(9))continue;
        /* Keep the complete animated envelope shallow and inside the room. */
        float lift=astra_environment_rock(t)?1.45f:.26f;int safe=1;
        for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++){
            vms_vector q=p;vm_vec_scale_add2(&q,&b.rvec,fl2f(x*5.65f));vm_vec_scale_add2(&q,&b.uvec,fl2f(y*3.55f));
            if(!ml_inside(room,s,&q)){safe=0;continue;}
            vm_vec_scale_add2(&q,&b.fvec,fl2f(lift+2.55f));if(find_point_seg(&q,room)!=room)safe=0;
        }
        if(!safe)continue;float score=w*h+(astra_environment_rock(t)?0:220);if(score<=best)continue;best=score;
        vm_vec_scale_add2(&p,&b.fvec,fl2f(lift));m->p=p;m->basis=b;m->side=s;m->valid=1;
        float light=0;for(int j=0;j<4;j++)light+=f2fl(face->uvls[j].l)*.25f;m->shade=fminf(1.0f,.30f+sqrtf(fmaxf(0,light))*.75f);
    }
    if(m->valid)sc_site_count++;return m;
}
int astra_scenery_anchor(int room,int style,vms_vector *p,vms_matrix *basis,int *side){sc_site *m=sc_site_for(room);if(!m->valid||m->style!=style)return 0;*p=m->p;*basis=m->basis;*side=m->side;return 1;}
int astra_scenery_any_anchor(int room,vms_vector *p,int *side){sc_site *m=sc_site_for(room);if(!m->valid)return 0;*p=m->p;*side=m->side;return 1;}
static void sc_tag(int first,int part,int material){for(int i=first;i<ax_count;i++){sc_meta[i][0]=part;sc_meta[i][1]=material;}}
static void sc_box(float x,float y,float z,float w,float h,float d){
    /* Extruded octagon, with a real chamfer around its front face. */
    float c=fminf(.13f,fminf(w,h)*.25f),bevel=fminf(.07f,d*.5f);
    float xy[8][2]={{-w+c,-h},{w-c,-h},{w,-h+c},{w,h-c},{w-c,h},{-w+c,h},{-w,h-c},{-w,-h+c}};
    for(int i=0;i<8;i++){
        int j=(i+1)%8;float a[3]={x+xy[i][0],y+xy[i][1],z-d},b[3]={x+xy[j][0],y+xy[j][1],z-d};
        float A[3]={a[0],a[1],z+d-bevel},B[3]={b[0],b[1],z+d-bevel};
        float C[3]={x+xy[i][0]*(1-bevel/w),y+xy[i][1]*(1-bevel/h),z+d},D[3]={x+xy[j][0]*(1-bevel/w),y+xy[j][1]*(1-bevel/h),z+d};
        float middle[3]={x,y,z+d};ag_triangle(a,b,B);ag_triangle(a,B,A);ag_triangle(A,B,D);ag_triangle(A,D,C);ag_triangle(middle,C,D);
    }
}
static void sc_ring(float x,float y,float z,float r,float tube,int plane){
    const int order[6]={0,1,2,0,2,3};
    for(int i=0;i<24;i++)for(int j=0;j<5;j++)for(int k=0;k<6;k++){
        int n=order[k];float a=(i+(n==1||n==2))*6.2831853f/24,b=(j+(n>=2))*6.2831853f/5;
        float nx=cosf(a)*cosf(b),ny=sinf(a)*cosf(b),nz=sinf(b),X=cosf(a)*(r+tube*cosf(b)),Y=sinf(a)*(r+tube*cosf(b)),Z=tube*sinf(b);
        if(plane==1){float t=Y;Y=Z;Z=t;t=ny;ny=nz;nz=t;}if(plane==2){float t=X;X=Z;Z=t;t=nx;nx=nz;nz=t;}
        ax_vertex_add(x+X,y+Y,z+Z,nx,ny,nz);
    }
}
static void sc_bolt(float x,float y,float z){ax_paint(.45f,.49f,.51f,0);ax_tube(x,y,z-.04f,x,y,z+.045f,.085f,.085f,6);ax_paint(.025f,.035f,.04f,0);ag_box(x,y,z+.05f,.045f,.012f,.006f);}
static void sc_panel(float x,float y,float z,float w,float h,int tile){
    ax_paint(.08f,.11f,.13f,0);sc_box(x,y,z-.09f,w+.12f,h+.12f,.10f);
    const int order[6]={0,1,2,0,2,3};float xy[4][2]={{-1,-1},{1,-1},{1,1},{-1,1}};int begin=ax_count;
    ax_paint(1,1,1,tile<2?.7f:0);
    for(int i=0;i<6;i++){int j=order[i],v=ax_count;ax_vertex_add(x+xy[j][0]*w,y+xy[j][1]*h,z+.025f,0,0,1);sc_meta[v][1]=tile<2?1:4;sc_meta[v][2]=((tile%2)*.5f+.018f+(1-xy[j][0])*.232f)*1254.f/2048;sc_meta[v][3]=((tile/2)*.5f+.018f+(1-xy[j][1])*.232f)*1254.f/2048;}
    (void)begin;
}
static void sc_case(void){
    ax_paint(.055f,.075f,.085f,0);sc_box(0,0,.12f,5.4f,3.3f,.10f);
    ax_paint(.27f,.34f,.36f,0);for(int sign=-1;sign<=1;sign+=2){sc_box(sign*5.28f,0,.40f,.12f,3.22f,.25f);sc_box(0,sign*3.18f,.40f,5.18f,.12f,.25f);}
    for(int sign=-1;sign<=1;sign+=2)for(int j=-2;j<=2;j++)sc_bolt(j*2.45f,sign*3.17f,.68f);
    ax_paint(.035f,.045f,.055f,0);for(int j=0;j<3;j++)ag_box(0,-2.9f+j*.095f,.34f,4.6f,.025f,.04f);
}
static void sc_pipe(float x,float y,float X,float Y,float z,float radius){
    ax_tube(x,y,z,X,Y,z,radius,radius,16);
    float dx=X-x,dy=Y-y,len=sqrtf(dx*dx+dy*dy);if(len<.01f)return;dx/=len;dy/=len;
    for(int j=0;j<3;j++){float t=.15f+j*.35f,cx=x+(X-x)*t,cy=y+(Y-y)*t;ax_paint(.40f,.44f,.45f,0);ax_tube(cx-dx*.09f,cy-dy*.09f,z,cx+dx*.09f,cy+dy*.09f,z,radius*1.28f,radius*1.28f,12);}
}
static void sc_ore(float x,float y,float z,int seed){
    int begin=ax_count;float ring[7][3];
    for(int j=0;j<7;j++){float a=j*6.2831853f/7,r=.27f+(sc_hash(seed*17+j)%101)*.001f;ring[j][0]=x+cosf(a)*r;ring[j][1]=y+sinf(a)*r;ring[j][2]=z+((j%3)-1)*.05f;}
    float top[3]={x+.07f,y-.08f,z+.23f},bottom[3]={x-.04f,y+.06f,z-.18f};ax_paint(.56f,.45f,.31f,0);
    for(int j=0;j<7;j++){ag_triangle(top,ring[j],ring[(j+1)%7]);ag_triangle(bottom,ring[(j+1)%7],ring[j]);}
    sc_tag(begin,3,5);for(int i=begin;i<ax_count;i++)sc_meta[i][2]=x;
}
static void sc_build(int style){
    sc_mesh *mesh=&sc_meshes[style];if(mesh->buffer)return;ax_count=0;ax_energy=0;memset(sc_meta,0,sizeof sc_meta);
    if(style<3)sc_case();else{
        /* Open equipment mounts expose the original stone/steel between parts. */
        for(int j=-1;j<=1;j+=2){ax_paint(.27f,.32f,.32f,0);sc_box(j*4.65f,0,.2f,.18f,2.9f,.14f);for(int y=-2;y<=2;y+=2)sc_bolt(j*4.65f,y,.4f);}
    }
    if(style==0){ /* Turbine and furnace behind protective steel grilles. */
        ax_paint(.018f,.024f,.028f,0);ax_tube(-2,.1f,.24f,-2,.1f,.31f,2.05f,2.05f,32);
        ax_paint(.34f,.40f,.42f,0);sc_ring(-2,.1f,.85f,1.93f,.12f,0);sc_ring(-2,.1f,.91f,.42f,.07f,0);
        int start=ax_count;for(int j=0;j<9;j++){float a=j*6.2831853f/9;float p[3]={-2+cosf(a)*.35f,.1f+sinf(a)*.35f,.72f},q[3]={-2+cosf(a+.20f)*1.75f,.1f+sinf(a+.20f)*1.75f,.56f},r[3]={-2+cosf(a+.48f)*1.65f,.1f+sinf(a+.48f)*1.65f,.81f};ax_paint(.38f,.46f,.48f,0);ag_triangle(p,q,r);float s[3]={-2+cosf(a+.25f)*.43f,.1f+sinf(a+.25f)*.43f,.83f};ag_triangle(p,r,s);}sc_tag(start,1,0);
        ax_paint(.47f,.49f,.48f,0);ax_tube(-2,.1f,.70f,-2,.1f,1.10f,.35f,.28f,20);
        for(int j=-5;j<=5;j++){float y=j*.32f,x=sqrtf(1.86f*1.86f-y*y);ax_paint(.24f,.28f,.30f,0);ax_tube(-2-x,.1f+y,1.18f,-2+x,.1f+y,1.18f,.035f,.035f,6);}
        ax_paint(.055f,.045f,.035f,0);sc_box(2.6f,-.35f,.50f,1.62f,1.8f,.27f);
        for(int j=0;j<7;j++){ax_paint(1,.28f,.018f,.85f);int begin=ax_count;ag_box(2.6f,-1.72f+j*.45f,.81f,1.35f,.13f,.04f);sc_tag(begin,0,3);ax_paint(.22f,.16f,.10f,0);ax_tube(1.1f,-1.85f+j*.45f,1.04f,4.1f,-1.85f+j*.45f,1.04f,.055f,.055f,6);}
        ax_paint(.34f,.30f,.22f,0);for(int j=0;j<5;j++)ax_tube(1.25f+j*.66f,-2.1f,1.12f,1.25f+j*.66f,1.45f,1.12f,.04f,.04f,6);
        sc_panel(2.6f,2.25f,.63f,.64f,.64f,1);
        ax_paint(.18f,.25f,.27f,0);sc_pipe(-4.65f,-2.45f,4.65f,-2.45f,.63f,.15f);
    }else if(style==1){ /* Cabinets, live diagnostic glass and suspended loom. */
        ax_paint(.17f,.25f,.30f,0);sc_box(-3.75f,0,.6f,1.15f,2.65f,.35f);sc_box(.15f,.4f,.5f,2.15f,2.25f,.22f);
        sc_panel(.15f,.4f,.76f,1.85f,1.85f,0);
        for(int j=0;j<10;j++){ax_paint(.055f,.075f,.09f,0);sc_box(-3.75f,-1.95f+j*.43f,.98f,.91f,.12f,.10f);ax_paint(.15f,.76f,.55f,.35f);ag_box(-3.04f,-1.95f+j*.43f,1.09f,.055f,.025f,.015f);}
        for(int cable=0;cable<5;cable++)for(int j=0;j<9;j++){float t=j/9.f,u=(j+1)/9.f,x=3.0f+cable*.27f,y=2.7f-t*4.7f,Y=2.7f-u*4.7f;ax_paint(cable%2?.30f:.07f,cable%2?.18f:.12f,cable%2?.075f:.15f,0);ax_tube(x+.18f*sinf(t*6),y,.67f+t*.3f,x+.18f*sinf(u*6),Y,.67f+u*.3f,.065f,.065f,6);}
        ax_paint(.29f,.35f,.36f,0);for(int j=0;j<4;j++)sc_box(3.55f,-1.4f+j*1.12f,1.08f,.88f,.08f,.06f);
        sc_panel(2.1f,-2.15f,.71f,.49f,.49f,2);ax_paint(.29f,.34f,.35f,0);sc_box(.1f,-2.25f,.8f,1.15f,.31f,.40f);
        for(int j=0;j<4;j++){ax_paint(.05f,.12f,.16f,0);ax_tube(-.55f+j*.42f,-2.25f,1.14f,-.55f+j*.42f,-2.25f,1.29f,.10f,.085f,12);}
    }else if(style==2){ /* A sealed generator / assembly bay with actual depth. */
        ax_paint(.015f,.025f,.032f,0);sc_box(0,0,.29f,4.8f,2.68f,.14f);
        for(int j=-1;j<=1;j+=2){ax_paint(.20f,.27f,.29f,0);sc_box(j*4.7f,0,1.05f,.18f,2.8f,.8f);sc_box(0,j*2.65f,1.05f,4.8f,.17f,.8f);}
        for(int j=0;j<3;j++){
            float x=-3.15f+j*1.8f;ax_paint(.22f,.31f,.34f,0);ax_tube(x,-1.8f,.92f,x,1.55f,.92f,.48f,.48f,20);
            for(int k=0;k<4;k++){ax_paint(.38f,.45f,.47f,0);ax_tube(x,-1.5f+k*.86f,.92f,x,-1.36f+k*.86f,.92f,.59f,.59f,16);}
            ax_paint(.045f,.67f,.82f,.40f);ag_box(x,-.1f,1.42f,.055f,1.42f,.025f);
        }
        /* Articulated maintenance robot on a suspension cradle. */
        ax_paint(.62f,.52f,.29f,0);sc_box(3.1f,.25f,.85f,.56f,.72f,.36f);sc_box(3.1f,1.28f,.91f,.42f,.28f,.29f);
        ax_paint(.02f,.7f,.87f,.8f);ag_box(3.1f,1.3f,1.22f,.30f,.055f,.02f);
        int begin=ax_count;ax_paint(.38f,.44f,.43f,0);ax_tube(2.48f,.65f,.95f,1.95f,-.05f,1.18f,.12f,.10f,12);ax_tube(1.95f,-.05f,1.18f,2.3f,-.65f,1.18f,.095f,.075f,10);sc_tag(begin,4,0);
        ax_paint(.27f,.32f,.33f,0);ax_tube(3.72f,.65f,.95f,4.1f,-.5f,.95f,.13f,.09f,12);for(int j=-1;j<=1;j+=2)ax_tube(3.1f+j*.28f,-.5f,.83f,3.1f+j*.42f,-1.8f,.83f,.14f,.12f,12);
        ax_paint(.19f,.24f,.25f,0);for(int j=-1;j<=1;j+=2){sc_box(3.1f+j*.42f,-1.85f,.94f,.24f,.17f,.32f);ax_tube(3.1f+j*.59f,.63f,.9f,3.1f+j*.59f,.63f,1.17f,.23f,.19f,16);sc_bolt(3.1f+j*.59f,.63f,1.2f);ax_tube(3.1f+j*.39f,-.62f,.91f,3.1f+j*.39f,-1.5f,.91f,.045f,.045f,8);}
        ax_paint(.40f,.43f,.38f,0);sc_box(3.1f,.15f,1.24f,.42f,.46f,.055f);for(int j=0;j<5;j++){ax_paint(.055f,.075f,.07f,0);ag_box(3.1f,-.1f+j*.14f,1.31f,.30f,.027f,.02f);}
        for(int j=-1;j<=1;j+=2)sc_bolt(3.1f+j*.33f,.54f,1.32f);
        ax_paint(.30f,.34f,.33f,0);ax_tube(3.1f,1.58f,.62f,3.1f,2.32f,.62f,.10f,.10f,12);
        ax_paint(.35f,.39f,.41f,0);for(int j=-1;j<=1;j+=2)ax_tube(3.1f+j*.65f,-2.25f,.60f,3.1f+j*.65f,2.3f,.60f,.07f,.07f,10);
        ax_paint(.06f,.60f,.78f,.65f);for(int j=-1;j<=1;j+=2)ag_box(0,j*2.46f,1.85f,4.45f,.035f,.025f);
        sc_panel(-4.88f,0,1.88f,.23f,.42f,0);
    }else if(style==3){ /* Connected coolant manifold with flanges and valves. */
        for(int j=0;j<3;j++){float y=-1.85f+j*1.75f;ax_paint(j==1?.41f:.14f,j==1?.30f:.31f,j==1?.17f:.34f,0);sc_pipe(-4.75f,y,4.6f,y,.85f,.25f+j*.035f);}
        ax_paint(.17f,.30f,.34f,0);sc_pipe(-3.65f,-1.85f,-3.65f,1.65f,.85f,.25f);sc_pipe(3.65f,-1.85f,3.65f,1.65f,.85f,.25f);
        for(int j=-1;j<=1;j+=2){float x=j*2;ax_paint(.25f,.36f,.39f,0);ax_tube(x,-.1f,.85f,x,-.1f,1.45f,.33f,.22f,16);int begin=ax_count;ax_paint(.68f,.20f,.055f,0);sc_ring(x,-.1f,1.64f,.59f,.065f,0);for(int k=0;k<4;k++){float a=k*1.570796f;ax_tube(x,-.1f,1.64f,x+cosf(a)*.54f,-.1f+sinf(a)*.54f,1.64f,.045f,.045f,6);}sc_tag(begin,j<0?1:5,0);}
        sc_panel(0,.9f,1.17f,.66f,.66f,0);
        for(int j=-1;j<=1;j+=2){ax_paint(.035f,.10f,.12f,0);sc_box(j*4.65f,-2.45f,.62f,.33f,.29f,.29f);ax_paint(.1f,.8f,.8f,.4f);ag_box(j*4.65f,-2.44f,.94f,.16f,.035f,.02f);}
        ax_paint(.45f,.51f,.52f,0);for(int j=-1;j<=1;j+=2)for(int k=-1;k<=1;k+=2)sc_bolt(j*3.65f,k*2.34f,.76f);
    }else if(style==4){ /* Extractor, helical drill and motorized ore conveyor. */
        ax_paint(.42f,.34f,.17f,0);sc_box(-3.35f,.95f,.75f,1.2f,1.0f,.53f);ax_paint(.16f,.22f,.24f,0);for(int j=0;j<6;j++)sc_box(-4.1f+j*.30f,.95f,1.32f,.065f,.82f,.10f);
        ax_paint(.37f,.43f,.44f,0);ax_tube(-2.15f,.95f,.88f,1.35f,.95f,.88f,.37f,.37f,20);int begin=ax_count;
        for(int j=0;j<45;j++){float a=j*.43f,b=(j+1)*.43f,x=-1.75f+j*.082f,X=x+.082f;ax_paint(.49f,.52f,.49f,0);ax_tube(x,.95f+cosf(a)*.44f,.88f+sinf(a)*.44f,X,.95f+cosf(b)*.44f,.88f+sinf(b)*.44f,.075f,.075f,5);}ax_tube(1.8f,.95f,.88f,2.75f,.95f,.88f,.46f,.025f,16);sc_tag(begin,1,0);
        ax_paint(.085f,.10f,.11f,0);sc_box(0,-1.35f,.52f,4.5f,.72f,.23f);ax_paint(.35f,.38f,.35f,0);for(int j=-1;j<=1;j+=2)sc_box(0,-1.35f+j*.72f,.95f,4.55f,.09f,.22f);
        begin=ax_count;for(int j=0;j<22;j++){ax_paint(.21f,.25f,.25f,0);int from=ax_count;ag_box(-4.2f+j*.40f,-1.35f,.82f,.14f,.58f,.06f);for(int v=from;v<ax_count;v++)sc_meta[v][2]=-4.2f+j*.40f;}sc_tag(begin,3,0);
        for(int j=0;j<7;j++)sc_ore(-3.65f+j*1.12f,-1.34f,1.04f,j+1);
        sc_panel(3.95f,1.45f,.63f,.76f,.76f,3);
        ax_paint(.40f,.46f,.45f,0);for(int j=-1;j<=1;j+=2)ax_tube(j*1.75f,2.65f,.6f,j*1.75f,1.7f,.6f,.11f,.11f,12);
        ax_paint(.21f,.27f,.28f,0);sc_box(-.3f,2.45f,.7f,2.2f,.12f,.10f);ax_tube(-1.75f,1.7f,.6f,-1.75f,1.7f,1.14f,.13f,.10f,12);ax_tube(1.75f,1.7f,.6f,1.75f,1.7f,1.14f,.13f,.10f,12);
        for(int j=0;j<4;j++)sc_bolt(-4.1f+j*.50f,1.7f,1.34f);
    }else{ /* Numbered landmark and an open, damaged service cabinet. */
        sc_panel(-2.65f,.18f,.62f,1.75f,1.75f,2);
        ax_paint(.15f,.21f,.24f,0);sc_box(2.6f,.25f,.48f,1.75f,2.15f,.28f);ax_paint(.025f,.04f,.045f,0);ag_box(2.6f,.25f,.78f,1.5f,1.87f,.025f);
        for(int j=0;j<7;j++){float x=1.35f+j*.4f;ax_paint(j%2?.46f:.10f,j%2?.22f:.19f,j%2?.065f:.23f,0);for(int k=0;k<7;k++){float y=1.95f-k*.48f,Y=y-.48f;ax_tube(x+.15f*sinf(k*.9f),y,.92f,x+.15f*sinf((k+1)*.9f),Y,.92f,.048f,.048f,6);}}
        ax_paint(.34f,.39f,.39f,0);for(int j=0;j<3;j++)sc_box(2.6f,-1.1f+j*1.2f,1.1f,1.36f,.10f,.08f);
        int begin=ax_count;ax_paint(.34f,.29f,.16f,0);sc_box(4.4f,.2f,1.25f,.55f,1.9f,.10f);for(int i=begin;i<ax_count;i++){float x=ax_vertices[i].p[0]-4.0f,z=ax_vertices[i].p[2]-.8f;ax_vertices[i].p[0]=4.0f+x*.80f-z*.60f;ax_vertices[i].p[2]=.8f+x*.60f+z*.80f;float nx=ax_vertices[i].n[0],nz=ax_vertices[i].n[2];ax_vertices[i].n[0]=nx*.8f-nz*.6f;ax_vertices[i].n[2]=nx*.6f+nz*.8f;}
        ax_paint(.62f,.30f,.04f,.55f);ax_tube(0,2.6f,.55f,0,2.6f,.89f,.19f,.14f,16);
        for(int j=0;j<12;j++){ax_paint(j%2?.035f:.66f,j%2?.045f:.43f,j%2?.045f:.07f,0);ag_box(-4.4f+j*.8f,-2.52f,.55f,.36f,.14f,.03f);}
    }
    mesh->glass=ax_count;
    if(style==2){int begin=ax_count;ax_paint(.14f,.38f,.47f,0);ag_box(0,0,1.96f,4.47f,2.42f,.006f);sc_tag(begin,0,2);}
    if(ax_count>=17990){sc_failed=1;ax_count=0;return;}
    for(int i=0;i<ax_count;i++){sc_data[i].v=ax_vertices[i];memcpy(sc_data[i].meta,sc_meta[i],sizeof sc_meta[i]);}
    glGenBuffers(1,&mesh->buffer);glBindBuffer(GL_ARRAY_BUFFER,mesh->buffer);glBufferData(GL_ARRAY_BUFFER,ax_count*sizeof(sc_vertex),sc_data,GL_STATIC_DRAW);glBindBuffer(GL_ARRAY_BUFFER,0);
    mesh->count=ax_count;sc_vertices+=ax_count;sc_uploads++;ax_count=0;
}
static int sc_ready(void){
    if(sc_failed)return 0;if(!sc_atlas&&!refit_png("scenery74.png",&sc_atlas,GL_CLAMP_TO_EDGE))return 0;
    if(sc_program)return 1;
    const char *vs=
        "uniform mat3 axis;uniform vec3 origin;uniform float clock,style;varying highp vec3 p,n,q;varying mediump vec4 coat,meta;"
        "void main(){q=gl_Vertex.xyz;vec3 N=gl_Normal;meta=gl_MultiTexCoord0;float part=meta.x;"
        "if(part>.5&&part<1.5){float a=clock*(style<.5?1.8:style<3.5?.12:1.2),c=cos(a),s=sin(a);mat2 R=mat2(c,s,-s,c);"
        "if(style>3.5){q.yz=R*(q.yz-vec2(.95,.88))+vec2(.95,.88);N.yz=R*N.yz;}else{vec2 pivot=vec2(-2.,style<.5?.1:-.1);q.xy=R*(q.xy-pivot)+pivot;N.xy=R*N.xy;}}"
        "else if(part>2.5&&part<3.5)q.x+=mod(meta.z+4.4+clock*.58,8.8)-4.4-meta.z;"
        "else if(part>3.5&&part<4.5){float a=.16*sin(clock*.65),c=cos(a),s=sin(a);mat2 R=mat2(c,s,-s,c);q.xy=R*(q.xy-vec2(2.48,.65))+vec2(2.48,.65);N.xy=R*N.xy;}"
        "else if(part>4.5){float a=-clock*.09,c=cos(a),s=sin(a);mat2 R=mat2(c,s,-s,c);q.xy=R*(q.xy-vec2(2.,-.1))+vec2(2.,-.1);N.xy=R*N.xy;}"
        "p=axis*q+origin;n=normalize(axis*N);coat=gl_Color;gl_Position=gl_ProjectionMatrix*vec4(p,1.);}";
    const char *fs=
        "precision highp float;uniform sampler2D metal,detail,atlas,stone;uniform mat3 axis;uniform float clock,opacity,shade;uniform vec4 lamps[4],colors[4],flash;"
        "varying highp vec3 p,n,q;varying mediump vec4 coat,meta;void main(){vec3 N=normalize(n),V=normalize(-p);vec3 local=abs(vec3(dot(N,axis[0]),dot(N,axis[1]),dot(N,axis[2])));"
        "vec2 uv=local.z>max(local.x,local.y)?q.xy*1.4:local.x>local.y?q.zy*1.4:q.xz*1.4;vec3 tex=texture2D(metal,uv).rgb,bump=texture2D(detail,uv).rgb;"
        "N=normalize(N+axis[0]*(bump.x-.5)*.24+axis[1]*(bump.y-.5)*.24);float rough=clamp(.28+bump.b*.45,.28,.8);vec3 base=mix(coat.rgb,tex*coat.rgb*2.2,.42);float glow=coat.a;"
        "if(meta.y>.5&&meta.y<1.5){base=texture2D(atlas,meta.zw).rgb;float line=.92+.08*sin(meta.w*2048.*.75+clock*1.3);base*=line;glow=.72;}"
        "if(meta.y>3.5&&meta.y<4.5){base=texture2D(atlas,meta.zw).rgb;glow=0.;}"
        "if(meta.y>4.5){base=texture2D(stone,q.xy*.8).rgb*vec3(.85,.75,.58);rough=.92;glow=0.;}"
        "if(meta.y>2.5&&meta.y<3.5){float heat=.5+.5*sin(q.x*3.+sin(q.y*4.+clock*.5));base=mix(vec3(.9,.12,.01),vec3(1.,.6,.06),heat*.7);glow=.95;}"
        "float contact=mix(.67,1.,smoothstep(.18,.85,q.z));vec3 key=normalize(vec3(-.4,.6,.7));float exponent=mix(65.,20.,rough);vec3 c=base*(shade*(.46+.56*max(0.,dot(N,key))))*contact+base*glow;"
        "c+=vec3(.21,.24,.25)*pow(max(0.,dot(N,normalize(V+key))),exponent)*(1.-glow);"
        "for(int i=0;i<4;i++){vec3 D=lamps[i].xyz-p;float d=length(D);D/=max(.01,d);float f=pow(max(0.,1.-d/max(.01,lamps[i].w)),2.);c+=colors[i].rgb*f*(base*(.16+.8*max(0.,dot(N,D)))+.18*pow(max(0.,dot(N,normalize(V+D))),exponent));}"
        "c+=base*vec3(1.,.33,.10)*min(1.,flash.w)*.3;float alpha=opacity;"
        "if(meta.y>1.5&&meta.y<2.5){float fres=pow(1.-abs(dot(N,V)),3.);float streak=pow(max(0.,sin((q.x+q.y*.55)*.55)),34.);c=vec3(.10,.24,.28)+vec3(.24,.48,.55)*fres+vec3(.45,.61,.64)*streak*.25;alpha*=.10+fres*.22+streak*.045;}"
        "gl_FragColor=vec4(c/(1.+c*.18),alpha);}";
    GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){sc_failed=1;return 0;}
    sc_program=glCreateProgram();glAttachShader(sc_program,v);glAttachShader(sc_program,f);glLinkProgram(sc_program);glDeleteShader(v);glDeleteShader(f);GLint ok;glGetProgramiv(sc_program,GL_LINK_STATUS,&ok);if(!ok){sc_failed=1;return 0;}return 1;
}
void astra_scenery_light(int room){
    extern int astra_ov_enabled(void);if(!astra_detail_upgrade||astra_native_compare||astra_ov_enabled()||room<0||room>Highest_segment_index)return;
    sc_site *m=sc_site_for(room);if(!m->valid)return;int style=m->style;
    static const float colors[6][3]={{.9f,.29f,.035f},{.10f,.52f,.62f},{.08f,.48f,.63f},{.08f,.45f,.49f},{.65f,.39f,.08f},{.55f,.31f,.06f}};
    vms_vector p=m->p;vm_vec_scale_add2(&p,&m->basis.fvec,F1_0*2);g3s_point view;afx_point(&view,&p);
    afx_lamps[3][0]=f2fl(view.p3_x);afx_lamps[3][1]=f2fl(view.p3_y);afx_lamps[3][2]=-f2fl(view.p3_z);afx_lamps[3][3]=15;
    for(int k=0;k<3;k++)afx_colors[3][k]=colors[style][k];afx_colors[3][3]=0;al_vec(afx_light_world[3],&p);afx_light_world[3][3]=15;
}
static int sc_room(int room){
    if(!sz_support(room))return 1;
    if(!astra_detail_upgrade||astra_native_compare||ss_capture||sc_failed)return 0;
    sc_site *site=sc_site_for(room);if(!site->valid)return 0;
    float distance=f2fl(vm_vec_dist(&site->p,&View_position)),opacity=1-nd_smooth((distance-60)/28);if(opacity<=0)return 1;
    vms_vector delta;vm_vec_sub(&delta,&View_position,&site->p);if(vm_vec_dot(&delta,&site->basis.fvec)<0)return 1;
    if(!sc_ready())return 0;int style=site->style;sc_build(style);sc_mesh *m=&sc_meshes[style];if(!m->buffer)return 0;
    astra_fixture_lights(room);ag_load(0);ag_load(3);if(!ag_colors[0]||!ag_colors[3])return 0;
    g3s_point point;g3_rotate_point(&point,&site->p);float axis[9];const vms_vector *dirs[]={&site->basis.rvec,&site->basis.uvec,&site->basis.fvec};
    for(int k=0;k<3;k++){vms_vector v;g3_rotate_delta_vec(&v,dirs[k]);axis[k*3]=f2fl(v.x);axis[k*3+1]=f2fl(v.y);axis[k*3+2]=-f2fl(v.z);}
    GLboolean cull=glIsEnabled(GL_CULL_FACE),write=astra_depth_write;int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;
    glDisable(GL_CULL_FACE);glDepthMask(opacity>.995f);gr_settransblend(GR_FADE_OFF,GR_BLEND_NORMAL);glUseProgram(sc_program);
    glUniformMatrix3fv(AS_UNIFORM(sc_program,"axis"),1,GL_FALSE,axis);glUniform3f(AS_UNIFORM(sc_program,"origin"),f2fl(point.p3_x),f2fl(point.p3_y),-f2fl(point.p3_z));glUniform1f(AS_UNIFORM(sc_program,"clock"),ae_clock());glUniform1f(AS_UNIFORM(sc_program,"style"),style);
    glUniform1f(AS_UNIFORM(sc_program,"opacity"),opacity);glUniform1f(AS_UNIFORM(sc_program,"shade"),site->shade);glUniform4fv(AS_UNIFORM(sc_program,"lamps[0]"),4,&afx_lamps[0][0]);glUniform4fv(AS_UNIFORM(sc_program,"colors[0]"),4,&afx_colors[0][0]);glUniform4fv(AS_UNIFORM(sc_program,"flash"),1,astra_flash);
    glActiveTexture(GL_TEXTURE3);glBindTexture(GL_TEXTURE_2D,ag_colors[3]);glUniform1i(AS_UNIFORM(sc_program,"stone"),3);glActiveTexture(GL_TEXTURE2);glBindTexture(GL_TEXTURE_2D,sc_atlas);glUniform1i(AS_UNIFORM(sc_program,"atlas"),2);glActiveTexture(GL_TEXTURE1);glBindTexture(GL_TEXTURE_2D,ag_details[0]);glUniform1i(AS_UNIFORM(sc_program,"detail"),1);glActiveTexture(GL_TEXTURE0);glBindTexture(GL_TEXTURE_2D,ag_colors[0]);glUniform1i(AS_UNIFORM(sc_program,"metal"),0);
    glBindBuffer(GL_ARRAY_BUFFER,m->buffer);glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_NORMAL_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    glVertexPointer(3,GL_FLOAT,sizeof(sc_vertex),(void*)0);glNormalPointer(GL_FLOAT,sizeof(sc_vertex),(void*)(3*sizeof(float)));glColorPointer(4,GL_FLOAT,sizeof(sc_vertex),(void*)(6*sizeof(float)));glTexCoordPointer(4,GL_FLOAT,sizeof(sc_vertex),(void*)(10*sizeof(float)));
    glDrawArrays(GL_TRIANGLES,0,m->glass);if(m->glass<m->count){glDepthMask(GL_FALSE);glDrawArrays(GL_TRIANGLES,m->glass,m->count-m->glass);}
    glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_NORMAL_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_TEXTURE_COORD_ARRAY);glBindBuffer(GL_ARRAY_BUFFER,0);glUseProgram(0);glDepthMask(write);if(cull)glEnable(GL_CULL_FACE);gr_settransblend(fade,blend);sc_draws++;sc_seen|=1u<<style;
    if(style==3&&distance<38){float phase=fmodf(ae_clock()*.16f+room*.17f,1);if(phase<.32f){g3_start_instance_matrix(&site->p,&site->basis);ax_count=0;for(int j=0;j<3;j++){float t=phase*3+j*.16f;ax_paint(.40f,.54f,.57f,0);af_particle(4.65f,-2.1f+t*.65f,1.1f+t*.4f,.13f+t*.2f,.035f*(1-phase/.32f),room+j);}ae_haze_flush();g3_done_instance();}}
    return 1;
}
