/* Cached, partly submerged boulders at actual rock/water junctions. There is
 * no geometry across open portals, metal edges or shared water seams. */
typedef struct {float p[3],n[3],uv[3];} nb_vertex;
typedef struct {GLuint buffer;unsigned stamp,used;int room,side,count;} nb_mesh;
static nb_mesh nb_meshes[64];static nb_vertex nb_vertices[8192];static unsigned nb_tick,nb_uploads,nb_draws;static int nb_count,nb_frame=-1,nb_budget;static GLuint nb_program;static int nb_failed;
static void nb_sphere(float *center,float *along,float *across,float *up,float rx,float ry,float rz,float seed){
    nb_vertex grid[7][13];
    for(int y=0;y<=6;y++)for(int x=0;x<=12;x++){
        float a=x*6.2831853f/12,b=-1.5707963f+y*3.1415926f/6,X=cosf(a)*cosf(b),Y=sinf(a)*cosf(b),Z=sinf(b);
        float shape=.94f+.07f*sinf(a*3+seed)*cosf(b)*cosf(b)+.04f*cosf(b*5+seed);nb_vertex *v=&grid[y][x];
        for(int k=0;k<3;k++){v->p[k]=center[k]+shape*(along[k]*X*rx+across[k]*Y*ry+up[k]*Z*rz);v->n[k]=along[k]*X/rx+across[k]*Y/ry+up[k]*Z/rz;}
        astra_unit(v->n);v->uv[0]=v->p[0]*.13f+v->p[2]*.07f;v->uv[1]=v->p[1]*.13f+v->p[2]*.09f;v->uv[2]=nd_smooth((Z+.45f)/1.35f);
    }
    for(int y=0;y<6;y++)for(int x=0;x<12;x++)if(nb_count+6<=8192){nb_vertex *q[]={&grid[y][x],&grid[y][x+1],&grid[y+1][x+1],&grid[y+1][x]};int order[]={0,1,2,0,2,3};for(int i=0;i<6;i++)nb_vertices[nb_count++]=*q[order[i]];}
}
static nb_mesh *nb_build(int room,int side){
    unsigned stamp=nd_stamp(room,side);nb_mesh *m=NULL;for(int i=0;i<64;i++)if(nb_meshes[i].stamp==stamp&&nb_meshes[i].room==room&&nb_meshes[i].side==side){m=&nb_meshes[i];m->used=++nb_tick;return m;}
    m=&nb_meshes[0];for(int i=1;i<64;i++)if(nb_meshes[i].used<m->used)m=&nb_meshes[i];nb_count=0;
    int ids[4];get_side_verts(ids,room,side);float n[3];ng_face_normal(room,side,n);vms_vector ctr;compute_center_point_on_side(&ctr,&Segments[room],side);float middle[3];al_vec(middle,&ctr);
    for(int e=0;e<4;e++){
        int a=ids[e],b=ids[(e+1)%4],rock=0;
        for(int s=0;s<6;s++)if(ng_rock(room,s)){int other[4],matches=0;get_side_verts(other,room,s);for(int j=0;j<4;j++)if(other[j]==a||other[j]==b)matches++;if(matches==2)rock=1;}
        if(!rock)continue;float start[3],end[3],along[3],across[3],in[3];al_vec(start,&Vertices[a]);al_vec(end,&Vertices[b]);for(int k=0;k<3;k++){along[k]=end[k]-start[k];in[k]=middle[k]-start[k];}float length=sqrtf(al_dot(along,along));if(length<5)continue;astra_unit(along);al_cross(across,n,along);astra_unit(across);if(al_dot(across,in)<0)for(int k=0;k<3;k++)across[k]=-across[k];
        int number=(int)fminf(5,fmaxf(2,length/5));for(int j=0;j<number;j++){
            float seed=room*1.71f+side*2.13f+e*3.3f+j*5.19f,t=(j+.5f+.18f*sinf(seed))/number;
            float radius=.65f+.45f*(.5f+.5f*sinf(seed*1.27f)),c[3];for(int k=0;k<3;k++)c[k]=start[k]+along[k]*length*t+across[k]*.28f-n[k]*.24f;
            nb_sphere(c,along,across,n,radius*1.5f,radius,radius*.64f,seed);
        }
    }
    if(nb_count){if(!m->buffer)glGenBuffers(1,&m->buffer);glBindBuffer(GL_ARRAY_BUFFER,m->buffer);glBufferData(GL_ARRAY_BUFFER,nb_count*sizeof(nb_vertex),nb_vertices,GL_STATIC_DRAW);glBindBuffer(GL_ARRAY_BUFFER,0);nb_uploads++;}
    m->room=room;m->side=side;m->stamp=stamp;m->count=nb_count;m->used=++nb_tick;return m;
}
static int warm_nb_room(void){
    if(nb_failed)return 0;if(nb_program)return 1;

            const char *vs="uniform mat3 axis;uniform vec3 origin;varying highp vec3 world,p,n;varying mediump vec3 uv;void main(){world=gl_Vertex.xyz;p=axis*world+origin;n=normalize(axis*gl_Normal);uv=gl_MultiTexCoord0.xyz;gl_Position=gl_ProjectionMatrix*vec4(p,1.);}";
            const char *fs="precision highp float;uniform sampler2D stone;uniform vec3 shade;uniform float opacity;uniform vec4 lamps[3],colors[3];varying highp vec3 world,p,n;varying mediump vec3 uv;void main(){vec3 N=normalize(n),V=normalize(-p);float wet=1.-uv.z;vec3 base=texture2D(stone,uv.xy).rgb*mix(.55,.91,uv.z);vec3 c=base*(shade*.78+.10)*( .7+.3*uv.z);for(int i=0;i<3;i++){vec3 L=lamps[i].xyz-p;float d=length(L);L/=max(.01,d);float f=pow(max(0.,1.-d/max(.01,lamps[i].w)),2.);c+=colors[i].rgb*f*(base*(.1+.75*max(0.,dot(N,L)))+pow(max(0.,dot(N,normalize(V+L))),56.)*(.10+.65*wet));}c+=vec3(.025,.045,.055)*pow(1.-max(0.,dot(N,V)),3.)*wet;gl_FragColor=vec4(c,opacity);}";
            GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){nb_failed=1;return 0;}nb_program=glCreateProgram();glAttachShader(nb_program,v);glAttachShader(nb_program,f);glLinkProgram(nb_program);glDeleteShader(v);glDeleteShader(f);GLint ok;glGetProgramiv(nb_program,GL_LINK_STATUS,&ok);if(!ok){nb_failed=1;return 0;}

    return 1;
}
static void nb_room(int room){
    extern int astra_ov_enabled(void);if(!astra_detail_upgrade||astra_native_compare||ss_capture||astra_ov_enabled()||nb_failed)return;
    if(nb_frame!=framecount){nb_frame=framecount;nb_budget=0;}if(nb_budget>=6)return;
    for(int side=0;side<6&&nb_budget<6;side++){
        if(astra_liquid_kind(Segments[room].sides[side].tmap_num)!=1||Segments[room].children[side]>=0)continue;
        vms_vector center;compute_center_point_on_side(&center,&Segments[room],side);float distance=f2fl(vm_vec_dist(&center,&View_position)),opacity=1-nd_smooth((distance-45)/30);if(opacity<=0)continue;
        nb_mesh *m=nb_build(room,side);if(!m->count)continue;astra_fixture_lights(room);
        if(!nb_program&&!warm_nb_room()){return;}
        float axis[9];for(int k=0;k<3;k++){vms_vector a={0},r;if(k==0)a.x=F1_0;else if(k==1)a.y=F1_0;else a.z=F1_0;g3_rotate_delta_vec(&r,&a);axis[k*3]=f2fl(r.x);axis[k*3+1]=f2fl(r.y);axis[k*3+2]=-f2fl(r.z);}
        vms_vector zero={0};g3s_point origin;g3_rotate_point(&origin,&zero);ag_load(3);if(!ag_colors[3])continue;
        int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;GLboolean cull=glIsEnabled(GL_CULL_FACE),write=astra_depth_write;gr_settransblend(GR_FADE_OFF,GR_BLEND_NORMAL);glDisable(GL_CULL_FACE);glDepthMask(opacity>.995?GL_TRUE:GL_FALSE);glUseProgram(nb_program);
        glUniformMatrix3fv(glGetUniformLocation(nb_program,"axis"),1,GL_FALSE,axis);glUniform3f(glGetUniformLocation(nb_program,"origin"),f2fl(origin.p3_x),f2fl(origin.p3_y),-f2fl(origin.p3_z));glUniform1f(glGetUniformLocation(nb_program,"opacity"),opacity);
        float light=0;for(int j=0;j<4;j++)light+=f2fl(Segments[room].sides[side].uvls[j].l)*.25f;light=fmaxf(.16f,fminf(1,light));glUniform3f(glGetUniformLocation(nb_program,"shade"),light,light,light);
        glUniform4fv(glGetUniformLocation(nb_program,"lamps[0]"),3,&afx_lamps[0][0]);glUniform4fv(glGetUniformLocation(nb_program,"colors[0]"),3,&afx_colors[0][0]);glActiveTexture(GL_TEXTURE0);glBindTexture(GL_TEXTURE_2D,ag_colors[3]);glUniform1i(glGetUniformLocation(nb_program,"stone"),0);
        glBindBuffer(GL_ARRAY_BUFFER,m->buffer);glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_NORMAL_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);glVertexPointer(3,GL_FLOAT,sizeof(nb_vertex),(void*)0);glNormalPointer(GL_FLOAT,sizeof(nb_vertex),(void*)(3*sizeof(float)));glTexCoordPointer(3,GL_FLOAT,sizeof(nb_vertex),(void*)(6*sizeof(float)));glDrawArrays(GL_TRIANGLES,0,m->count);glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_NORMAL_ARRAY);glDisableClientState(GL_TEXTURE_COORD_ARRAY);glBindBuffer(GL_ARRAY_BUFFER,0);glUseProgram(0);glDepthMask(write);if(cull)glEnable(GL_CULL_FACE);gr_settransblend(fade,blend);nb_budget++;nb_draws++;
    }
    EM_ASM(Module.naturalGeometry=({version:63,banks:$0,bankUploads:$1,rockCatalogs:$2});,nb_draws,nb_uploads,ng_catalogs);
}
