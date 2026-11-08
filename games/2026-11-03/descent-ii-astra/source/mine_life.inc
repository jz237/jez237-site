/* R64: decorative installations and bounded physical-looking responses.
 * No gameplay objects, damage, collision, sound or simulation RNG writes. */
typedef struct {ax_vertex v;float part;} ml_vertex;
typedef struct {GLuint buffer;int count;} ml_mesh;
typedef struct {int tested,valid,side,zone;vms_vector p;vms_matrix basis;float scale;} ml_site;
typedef struct {int active,room,side,kind,preview;vms_vector p,n;float born,size;unsigned seed;} ml_event;
static ml_site ml_sites[MAX_SEGMENTS];static ml_mesh ml_meshes[5];static ml_event ml_events[48];
typedef struct {int tested,valid;vms_vector p;vms_matrix basis;float height;} ml_drip;
static ml_drip ml_drip_sites[MAX_SEGMENTS];
static int ml_level=-999,ml_rooms=-1;static unsigned ml_serial,ml_draws,ml_uploads,ml_hits,ml_dust,ml_drips;
static GLuint ml_program;static int ml_failed;static float ml_parts[18000];
static void ae_haze_flush(void);
static void ml_reset(void){if(ml_level==Current_level_num&&ml_rooms==Highest_segment_index)return;ml_level=Current_level_num;ml_rooms=Highest_segment_index;memset(ml_sites,0,sizeof ml_sites);memset(ml_events,0,sizeof ml_events);memset(ml_drip_sites,0,sizeof ml_drip_sites);}
static int ml_inside(int room,int s,const vms_vector *point){
    int ids[4];get_side_verts(ids,room,s);float sign=0;vms_vector n=Segments[room].sides[s].normals[0];
    for(int j=0;j<4;j++){vms_vector a,b,c;vm_vec_sub(&a,&Vertices[ids[(j+1)%4]],&Vertices[ids[j]]);vm_vec_sub(&b,point,&Vertices[ids[j]]);vm_vec_cross(&c,&a,&b);float d=f2fl(vm_vec_dot(&c,&n));if(fabsf(d)<.001f)continue;if(sign*d<0)return 0;sign=d;}return 1;
}
static ml_site *ml_site_for(int room){
    ml_reset();ml_site *m=&ml_sites[room];if(m->tested)return m;m->tested=1;m->zone=astra_room_identity(room);float best=-1;
    for(int s=0;s<6;s++){
        side *f=&Segments[room].sides[s];int t=f->tmap_num;
        if(Segments[room].children[s]>=0||f->wall_num>=0||f->type!=SIDE_IS_QUAD||f->tmap_num2||t<0||t>=NumTextures||TmapInfo[t].lighting||TmapInfo[t].damage||TmapInfo[t].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD)||astra_fixture_kind(room,s))continue;
        const char *name=piggy_game_bitmap_name(&GameBitmaps[Textures[t].index]);if(!name||(strncmp(name,"metl",4)&&strncmp(name,"rock",4)&&strncmp(name,"wall",4)))continue;
        vms_vector p,ctr;vms_matrix basis;float w,h;if(!ae_basis(room,s,&p,&basis,&w,&h)||w<15||h<15||w>90||h>90)continue;
        compute_segment_center(&ctr,&Segments[room]);if(vm_vec_dist(&ctr,&p)<i2f(8))continue;
        vm_vec_scale_add2(&p,&basis.rvec,fl2f(-w*.23f));vm_vec_scale_add2(&p,&basis.uvec,fl2f(h*.17f));
        int safe=1;for(int x=-1;x<=1;x+=2)for(int y=-1;y<=1;y+=2){vms_vector q=p;vm_vec_scale_add2(&q,&basis.rvec,fl2f(x*3.1f));vm_vec_scale_add2(&q,&basis.uvec,fl2f(y*3.1f));if(!ml_inside(room,s,&q))safe=0;vm_vec_scale_add2(&q,&basis.fvec,fl2f(2.2f));if(find_point_seg(&q,room)!=room)safe=0;}
        if(!safe)continue;float score=w*h+(astra_environment_rock(t)?0:300);if(score<=best)continue;best=score;
        vm_vec_scale_add2(&p,&basis.fvec,fl2f(astra_environment_rock(t)?1.25f:.18f));m->p=p;m->basis=basis;m->scale=1;m->side=s;m->valid=1;
    }return m;
}
int astra_life_anchor(int room,vms_vector *point,int *side){extern int astra_scenery_any_anchor(int,vms_vector*,int*);if(astra_scenery_any_anchor(room,point,side))return 1;ml_site *m=ml_site_for(room);if(!m->valid)return 0;*point=m->p;*side=m->side;return 1;}
int astra_surface_mount(int room,int side,float *p,float *r,float *u,int *zone){
    ml_site *m=ml_site_for(room);if(!m->valid||m->side!=side)return 0;
    al_vec(p,&m->p);al_vec(r,&m->basis.rvec);al_vec(u,&m->basis.uvec);*zone=m->zone;return 1;
}
static void ml_tag(int start,int part){for(int i=start;i<ax_count;i++)ml_parts[i]=part;}
static void ml_build(int style){
    if(ml_meshes[style].buffer)return;ax_count=0;ax_energy=0;memset(ml_parts,0,sizeof ml_parts);
    ax_paint(.10f,.14f,.16f,0);ag_box(0,0,.08f,2.65f,2.6f,.07f);
    ax_paint(.32f,.39f,.40f,0);for(int sign=-1;sign<=1;sign+=2){ax_tube(sign*2.55f,-2.5f,.18f,sign*2.55f,2.5f,.18f,.10f,.10f,8);for(int j=-1;j<=1;j+=2)ax_tube(sign*2.4f,j*2.35f,.18f,sign*2.4f,j*2.35f,.25f,.085f,.085f,6);}
    if(style==0||style==1||style==3){
        ax_paint(.035f,.05f,.06f,0);ax_tube(-1.05f,.35f,.16f,-1.05f,.35f,.21f,1.15f,1.15f,24);
        ax_paint(.37f,.42f,.44f,0);ax_ring(-1.05f,.35f,.35f,1.14f,.10f,0,6.283185f,0);
        int begin=ax_count;for(int j=0;j<5;j++){float a=j*1.256637f;ax_paint(.30f,.35f,.37f,0);ax_tube(-1.05f+cosf(a)*.22f,.35f+sinf(a)*.22f,.31f,-1.05f+cosf(a+.38f)*.94f,.35f+sinf(a+.38f)*.94f,.32f,.10f,.19f,5);}ml_tag(begin,1);
        ax_paint(.47f,.51f,.52f,0);for(int j=-3;j<=3;j++){float y=j*.27f,x=sqrtf(1.12f*1.12f-y*y);ax_tube(-1.05f-x,.35f+y,.50f,-1.05f+x,.35f+y,.50f,.026f,.026f,6);}
        ax_paint(.15f,.20f,.22f,0);ag_box(1.4f,.35f,.25f,.68f,1.3f,.14f);
        for(int j=0;j<7;j++){ax_paint(style==3?.48f:.30f,style==3?.25f:.37f,.15f,0);ax_tube(.82f,-.55f+j*.26f,.44f,1.96f,-.55f+j*.26f,.44f,.06f,.06f,7);}
    }else if(style==2){
        for(int j=-1;j<=1;j+=2){float x=j*1.25f;ax_paint(.26f,.34f,.36f,0);ax_tube(x,-1.8f,.31f,x,1.5f,.31f,.28f,.28f,16);for(int k=-1;k<=1;k++){ax_paint(.45f,.50f,.51f,0);ax_tube(x,k*.95f-.09f,.31f,x,k*.95f+.09f,.31f,.39f,.39f,12);}ax_paint(.055f,.38f,.46f,.28f);ax_tube(x,-1.45f,.61f,x,1.35f,.61f,.045f,.045f,7);}
        ax_paint(.21f,.30f,.33f,0);ax_tube(-1.25f,-1.8f,.31f,1.25f,-1.8f,.31f,.28f,.28f,12);
        ax_paint(.05f,.09f,.10f,0);ax_tube(0,.6f,.2f,0,.6f,.25f,.58f,.58f,20);ax_paint(.42f,.52f,.53f,0);ax_ring(0,.6f,.3f,.58f,.06f,0,6.283185f,0);
        int begin=ax_count;ax_paint(.12f,.8f,.88f,.3f);ax_tube(0,.6f,.34f,.39f,.6f,.34f,.022f,.022f,6);ml_tag(begin,3);
    }else{
        for(int j=-2;j<=2;j++){float x=j*.85f;ax_paint(.07f,.10f,.12f,0);ag_box(x,.25f,.24f,.31f,1.55f,.12f);for(int k=0;k<9;k++){ax_paint(.48f,.25f,.10f,0);ax_tube(x-.29f,-1.1f+k*.31f,.43f,x+.29f,-1.1f+k*.31f,.43f,.055f,.055f,7);}ax_paint(.85f,.18f,.025f,.25f);ag_box(x,2,.3f,.22f,.08f,.04f);}
    }
    /* Shared hydraulic service line and curved cable with clamps. */
    ax_paint(.24f,.30f,.32f,0);ax_tube(-1.9f,-2.13f,.33f,1.9f,-2.13f,.33f,.11f,.11f,10);
    for(int j=0;j<12;j++){float x=-2.1f+j*.35f,X=x+.35f,y=1.92f+.16f*cosf(x),Y=1.92f+.16f*cosf(X);ax_paint(.045f,.06f,.07f,0);ax_tube(x,y,.32f,X,Y,.32f,.075f,.075f,7);}
    int begin=ax_count;ax_paint(.56f,.60f,.61f,0);ax_tube(1.95f,-2,.43f,1.95f,-1.28f,.43f,.055f,.055f,8);ml_tag(begin,2);
    ax_paint(.12f,.18f,.20f,0);ax_tube(1.95f,-2.36f,.43f,1.95f,-1.78f,.43f,.12f,.12f,9);
    static ml_vertex data[18000];for(int i=0;i<ax_count;i++){data[i].v=ax_vertices[i];data[i].part=ml_parts[i];float *q=data[i].v.p;float contact=.73f+.27f*nd_smooth((q[2]-.10f)/.34f);if(q[2]>.18f)contact*=.82f+.18f*fmaxf(0,data[i].v.n[2]);for(int k=0;k<3;k++)data[i].v.color[k]*=contact;}
    ml_mesh *m=&ml_meshes[style];glGenBuffers(1,&m->buffer);glBindBuffer(GL_ARRAY_BUFFER,m->buffer);glBufferData(GL_ARRAY_BUFFER,ax_count*sizeof(ml_vertex),data,GL_STATIC_DRAW);glBindBuffer(GL_ARRAY_BUFFER,0);m->count=ax_count;ax_count=0;ml_uploads++;
}
static void ml_installation(int room){
    if(!sz_support(room))return;
    if(!astra_detail_upgrade||astra_native_compare||ss_capture||ml_failed)return;ml_site *site=ml_site_for(room);if(!site->valid)return;
    float distance=f2fl(vm_vec_dist(&site->p,&View_position)),opacity=1-nd_smooth((distance-48)/26);if(opacity<=0)return;
    vms_vector d;vm_vec_sub(&d,&View_position,&site->p);if(vm_vec_dot(&d,&site->basis.fvec)<0)return;
    int style=site->zone;ml_build(style);astra_fixture_lights(room);
    if(!ml_program){
        const char *vs="uniform mat3 axis;uniform vec3 origin;uniform float clock;varying highp vec3 p,n,q;varying mediump vec4 coat;void main(){q=gl_Vertex.xyz;vec3 N=gl_Normal;float part=gl_MultiTexCoord0.x;if(part>.5&&part<1.5){float a=clock,c=cos(a),s=sin(a);vec2 v=q.xy-vec2(-1.05,.35);q.xy=mat2(c,s,-s,c)*v+vec2(-1.05,.35);N.xy=mat2(c,s,-s,c)*N.xy;}else if(part>1.5&&part<2.5)q.y+=.22*sin(clock*.4);else if(part>2.5){float a=sin(clock*.18)*1.2,c=cos(a),s=sin(a);q.xy=mat2(c,s,-s,c)*(q.xy-vec2(0.,.6))+vec2(0.,.6);N.xy=mat2(c,s,-s,c)*N.xy;}p=axis*q+origin;n=normalize(axis*N);coat=gl_Color;gl_Position=gl_ProjectionMatrix*vec4(p,1.);}";
        const char *fs="precision highp float;uniform sampler2D metal,detail;uniform mat3 axis;uniform float opacity;uniform vec4 lamps[4],colors[4];varying highp vec3 p,n,q;varying mediump vec4 coat;void main(){vec3 V=normalize(-p);vec2 uv=q.xy*.18+vec2(.27,.13);vec3 art=texture2D(metal,uv).rgb;vec3 bump=texture2D(detail,uv).rgb;vec3 N=normalize(n+axis[0]*(bump.x-.5)*.65+axis[1]*(bump.y-.5)*.65);vec3 base=mix(coat.rgb,art*.67,.48);float rough=clamp(.25+bump.b*.55,.25,.86);float edge=max(abs(q.x)/2.65,abs(q.y)/2.6);float weld=(1.-smoothstep(.018,.045,abs(edge-.94)))*step(q.z,.17);float bead=.7+.3*sin((q.x+q.y)*86.)*(1.-smoothstep(5.,22.,length(p)));base=mix(base,vec3(.37,.40,.39)*bead,weld*.7);float bolt=length(abs(q.xy)-vec2(2.4,2.35));float socket=(1.-smoothstep(.105,.16,bolt))*step(q.z,.18);base*=1.-socket*.65;float seal=(1.-smoothstep(.035,.08,abs(q.y+1.78)))*(1.-smoothstep(.1,.17,abs(q.x-1.95)));base=mix(base,vec3(.028,.034,.036),seal);float rod=step(.38,q.z)*(1.-smoothstep(.04,.075,abs(q.x-1.95)))*step(-2.1,q.y)*step(q.y,-1.0);base=mix(base,vec3(.48,.52,.54),rod*.65);rough=mix(rough,.2,rod);float exponent=mix(66.,17.,rough);vec3 key=normalize(vec3(-.4,.7,.8));float occlusion=mix(.7,1.,smoothstep(.12,.42,q.z));vec3 c=base*(.38+.7*max(0.,dot(N,key)))*occlusion+coat.rgb*coat.a+vec3(.12,.14,.15)*pow(max(0.,dot(N,normalize(V+key))),exponent);for(int i=0;i<4;i++){vec3 D=lamps[i].xyz-p;float d=length(D);D/=max(.01,d);float f=pow(max(0.,1.-d/max(.01,lamps[i].w)),2.);c+=colors[i].rgb*f*(base*(.12+.7*max(0.,dot(N,D)))+.28*pow(max(0.,dot(N,normalize(V+D))),exponent));}gl_FragColor=vec4(c/(1.+c*.18),opacity);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){ml_failed=1;return;}ml_program=glCreateProgram();glAttachShader(ml_program,v);glAttachShader(ml_program,f);glLinkProgram(ml_program);glDeleteShader(v);glDeleteShader(f);GLint ok;glGetProgramiv(ml_program,GL_LINK_STATUS,&ok);if(!ok){ml_failed=1;return;}
    }
    ag_load(7);if(!ag_colors[7])return;g3s_point origin;g3_rotate_point(&origin,&site->p);float axis[9];const vms_vector *directions[]={&site->basis.rvec,&site->basis.uvec,&site->basis.fvec};for(int k=0;k<3;k++){vms_vector v;g3_rotate_delta_vec(&v,directions[k]);axis[k*3]=f2fl(v.x);axis[k*3+1]=f2fl(v.y);axis[k*3+2]=-f2fl(v.z);}
    GLboolean cull=glIsEnabled(GL_CULL_FACE),write=astra_depth_write;int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;glDisable(GL_CULL_FACE);glDepthMask(opacity>.995?GL_TRUE:GL_FALSE);gr_settransblend(GR_FADE_OFF,GR_BLEND_NORMAL);glUseProgram(ml_program);
    glUniformMatrix3fv(AS_UNIFORM(ml_program,"axis"),1,GL_FALSE,axis);glUniform3f(AS_UNIFORM(ml_program,"origin"),f2fl(origin.p3_x),f2fl(origin.p3_y),-f2fl(origin.p3_z));glUniform1f(AS_UNIFORM(ml_program,"clock"),ae_clock()*(1.1f+(room%5)*.13f));glUniform1f(AS_UNIFORM(ml_program,"opacity"),opacity);glUniform4fv(AS_UNIFORM(ml_program,"lamps[0]"),4,&afx_lamps[0][0]);glUniform4fv(AS_UNIFORM(ml_program,"colors[0]"),4,&afx_colors[0][0]);glActiveTexture(GL_TEXTURE1);glBindTexture(GL_TEXTURE_2D,ag_details[7]);glUniform1i(AS_UNIFORM(ml_program,"detail"),1);glActiveTexture(GL_TEXTURE0);glBindTexture(GL_TEXTURE_2D,ag_colors[7]);glUniform1i(AS_UNIFORM(ml_program,"metal"),0);
    ml_mesh *m=&ml_meshes[style];glBindBuffer(GL_ARRAY_BUFFER,m->buffer);glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_NORMAL_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);glVertexPointer(3,GL_FLOAT,sizeof(ml_vertex),(void*)0);glNormalPointer(GL_FLOAT,sizeof(ml_vertex),(void*)(3*sizeof(float)));glColorPointer(4,GL_FLOAT,sizeof(ml_vertex),(void*)(6*sizeof(float)));glTexCoordPointer(1,GL_FLOAT,sizeof(ml_vertex),(void*)(10*sizeof(float)));glDrawArrays(GL_TRIANGLES,0,m->count);glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_NORMAL_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_TEXTURE_COORD_ARRAY);glBindBuffer(GL_ARRAY_BUFFER,0);glUseProgram(0);glDepthMask(write);if(cull)glEnable(GL_CULL_FACE);gr_settransblend(fade,blend);ml_draws++;
}
static void ml_emit(int room,int side,const vms_vector *p,float size,int kind){
    ml_reset();float clock=ae_clock();int preview=astra_mine_clock>=0;
    for(int i=0;i<48;i++)if(ml_events[i].active&&ml_events[i].room==room&&ml_events[i].side==side&&ml_events[i].preview==preview&&clock-ml_events[i].born>=0&&clock-ml_events[i].born<.085f)return;
    ml_event *e=&ml_events[ml_serial++%48];*e=(ml_event){1,room,side,kind,preview,*p,Segments[room].sides[side].normals[0],clock,fminf(2.2f,fmaxf(.35f,size)),ml_serial*2654435761u};vms_vector center,d;compute_segment_center(&center,&Segments[room]);vm_vec_sub(&d,&center,p);if(vm_vec_dot(&d,&e->n)<0)vm_vec_negate(&e->n);ml_hits++;
}
void astra_environment_response(int room,int s,const vms_vector *p,float size){
    if(!ax_on()||room<0||room>Highest_segment_index||s<0||s>5)return;int t=Segments[room].sides[s].tmap_num;if(t<0||t>=NumTextures||TmapInfo[t].flags&TMI_FORCE_FIELD)return;
    int liquid=astra_liquid_kind(t);ml_emit(room,s,p,size,liquid?liquid:astra_environment_rock(t)?4:3);
}
void astra_environment_blast(int room,const vms_vector *p,float radius){
    if(!ax_on()||room<0||room>Highest_segment_index||astra_mine_clock>=0)return;int made=0;
    for(int s=0;s<6&&made<2;s++)if(ng_rock(room,s)&&Segments[room].sides[s].wall_num<0){
        vms_vector center,d,hit;compute_center_point_on_side(&center,&Segments[room],s);vm_vec_sub(&d,p,&center);vms_vector n=Segments[room].sides[s].normals[0];fix distance=vm_vec_dot(&d,&n);if(abs(distance)>fl2f(radius+7))continue;vm_vec_scale_add(&hit,p,&n,-distance);if(!ml_inside(room,s,&hit))continue;ml_emit(room,s,&hit,fminf(2.2f,radius*.25f),4);ml_dust++;made++;
    }
}
void astra_reaction_light(int room){
    if(!astra_detail_upgrade||astra_native_compare)return;ml_reset();float now=ae_clock(),best=0;ml_event *event=NULL;
    for(int i=0;i<48;i++){ml_event *e=&ml_events[i];float age=now-e->born;if(e->active&&e->room==room&&e->kind==3&&e->preview==(astra_mine_clock>=0)&&age>=0&&age<.28f){float strength=(1-age/.28f)*.48f;if(strength>best){best=strength;event=e;}}}
    if(!event)return;int slot=3; /* Reserved impact slot; steady lamps are untouched. */
    vms_vector point;vm_vec_scale_add(&point,&event->p,&event->n,F1_0/2);g3s_point p;afx_point(&p,&point);afx_lamps[slot][0]=f2fl(p.p3_x);afx_lamps[slot][1]=f2fl(p.p3_y);afx_lamps[slot][2]=-f2fl(p.p3_z);afx_lamps[slot][3]=6;afx_colors[slot][0]=best;afx_colors[slot][1]=best*.35f;afx_colors[slot][2]=best*.06f;afx_colors[slot][3]=0;memset(afx_axes[slot],0,sizeof afx_axes[slot]);al_vec(afx_light_world[slot],&point);afx_light_world[slot][3]=6;
}
static void ml_responses(int room){
    if(!astra_detail_upgrade||astra_native_compare||ss_capture)return;float now=ae_clock();int preview=astra_mine_clock>=0;
    for(int i=0;i<48;i++){
        ml_event *e=&ml_events[i];float age=now-e->born;if(!e->active||e->room!=room||e->preview!=preview||age<0||age>2.6f)continue;
        g3s_point view;g3_rotate_point(&view,&e->p);if(view.p3_z<F1_0||view.p3_z>i2f(80))continue;float near=nd_smooth((f2fl(view.p3_z)-1)/5);
        vms_matrix b;vm_vector_2_matrix(&b,&e->n,NULL,NULL);vms_vector anchor=e->p;if(e->kind==4)vm_vec_scale_add2(&anchor,&e->n,fl2f(1.6f));g3_start_instance_matrix(&anchor,&b);ax_count=0;ax_energy=0;float fade=(1-age/2.6f)*near;
        if(e->kind==1){
            ax_paint(.17f,.43f,.48f,.12f);for(int k=0;k<2;k++){float r=age*(2.2f+k*.8f);if(r>.08f)ax_ring(0,0,.035f,r,.018f*(1-age/2.6f),0,6.283185f,0);}ax_flush(1,fade*.55f);
            if(age<1.2f){ax_paint(.32f,.62f,.66f,.16f);for(int j=0;j<9;j++){float a=j*2.39996f+e->seed*.00001f,r=age*(.8f+j*.09f)*e->size,z=.1f+age*3.7f-age*age*3.0f;if(z<0)continue;ax_tube(cosf(a)*r,sinf(a)*r,z,cosf(a)*r,sinf(a)*r,z+.07f,.022f,.014f,5);}ax_flush(1,fade*.7f);}
        }else if(e->kind==3||e->kind==2){
            if(age<.75f){ax_energy=1;ax_paint(1,e->kind==2?.22f:.53f,.055f,1);for(int j=0;j<11;j++){float a=j*2.39996f+(e->seed%101)*.11f,r=age*(1.4f+(j%4)*.7f),z=.08f+age*(1.2f+(j%3)*.5f)-age*age*.6f;ax_tube(cosf(a)*r,sinf(a)*r,z,cosf(a)*(r+.15f),sinf(a)*(r+.15f),z+.04f,.018f,.006f,4);}ax_flush(1,fade*.65f);ax_energy=0;}
        }else{
            for(int j=0;j<7;j++){float a=j*2.39996f+(e->seed%101)*.11f,r=age*(.25f+j*.055f),z=.15f+age*.42f;ax_paint(.31f,.29f,.25f,0);af_particle(cosf(a)*r,sinf(a)*r,z,(.10f+age*.25f)*e->size,fade*.045f,j+e->seed);}ae_haze_flush();
            if(age<1.5f){ax_paint(.24f,.23f,.20f,0);for(int j=0;j<5;j++){float a=j*2.4f,z=.08f+age*1.2f-age*age*.28f;ax_tube(cosf(a)*age,sinf(a)*age,z,cosf(a)*age+.05f,sinf(a)*age+.06f,z+.08f,.045f,.025f,4);}ax_flush(1,fade);}
        }g3_done_instance();
    }
}
static void ml_water_drips(int room){
    if(!astra_detail_upgrade||astra_native_compare||ss_capture)return;ml_drip *site=&ml_drip_sites[room];
    if(!site->tested){
        site->tested=1;if(astra_room_identity(room)!=2)return;vms_matrix upright;extract_orient_from_segment(&upright,&Segments[room]);
        for(int s=0;s<6&&!site->valid;s++)if(astra_liquid_kind(Segments[room].sides[s].tmap_num)==1&&Segments[room].children[s]<0){
            float normal[3];ng_face_normal(room,s,normal);vms_vector n={fl2f(normal[0]),fl2f(normal[1]),fl2f(normal[2])};if(vm_vec_dot(&n,&upright.uvec)<fl2f(.6f))continue;
            vms_vector point;compute_center_point_on_side(&point,&Segments[room],s);float height=1e9f;int ceiling=-1;
            for(int c=0;c<6;c++)if(c!=s){vms_vector p,d;compute_center_point_on_side(&p,&Segments[room],c);vm_vec_sub(&d,&p,&point);float dot=f2fl(vm_vec_dot(&n,&Segments[room].sides[c].normals[0]));if(fabsf(dot)<.01f)continue;float h=f2fl(vm_vec_dot(&d,&Segments[room].sides[c].normals[0]))/dot;if(h>.2f&&h<height){height=h;ceiling=c;}}
            if(ceiling<0||height<4||height>42||Segments[room].children[ceiling]>=0||Segments[room].sides[ceiling].wall_num>=0)continue;
            vms_vector top;vm_vec_scale_add(&top,&point,&n,fl2f(height));if(!ml_inside(room,ceiling,&top))continue;
            site->p=point;vm_vector_2_matrix(&site->basis,&n,NULL,NULL);site->height=height-.18f;site->valid=1;
        }
    }
    if(!site->valid)return;g3s_point view;g3_rotate_point(&view,&site->p);if(view.p3_z<i2f(3)||view.p3_z>i2f(65))return;
    g3_start_instance_matrix(&site->p,&site->basis);ax_count=0;ax_energy=0;
    for(int j=0;j<2;j++){float t=fmodf(ae_clock()*.28f+j*.47f+room*.13f,1),x=(j-.5f)*.38f,y=0,z=site->height*(1-fminf(1,t/.78f)*fminf(1,t/.78f));ax_paint(.28f,.57f,.62f,.13f);if(t<.78f)ax_tube(x,y,z+.04f,x,y,z+.16f,.018f,.010f,5);else ax_ring(x,y,.045f,(t-.78f)*3.8f,.014f*(1-t)/.22f,0,6.283185f,0);}
    ax_flush(1,.65f);g3_done_instance();ml_drips++;
}
#include "astra_scenery.inc"
static void ml_room(int room){
    extern int astra_ov_enabled(void);if(astra_ov_enabled())return;ml_reset();if(!sc_room(room))ml_installation(room);ml_water_drips(room);ml_responses(room);
}
void astra_life_preview(int room,int s,int command){
    static int last=-1;if(command==last)return;last=command;if(room<0||room>Highest_segment_index||s<0||s>5)return;
    for(int i=0;i<48;i++)if(ml_events[i].preview)ml_events[i].active=0;
    vms_vector p;compute_center_point_on_side(&p,&Segments[room],s);astra_environment_response(room,s,&p,1.4f);
}
