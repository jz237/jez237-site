/* Shallow physical relief, immutable cached buffers, and room-clipped light.
 * Original UVs, texture resolution, collision hulls and flight physics stay intact. */
#include "astra_surface_lod.inc"
typedef struct {float p[3],n[3],uv[4],finish[4];} nd_vertex;
typedef struct {GLuint buffer;unsigned stamp,used;int room,side,count,half,rock;} nd_mesh;
#include "astra_geology.inc"
static nd_mesh nd_meshes[128];static unsigned nd_tick,nd_uploads;static int nd_frame=-1,nd_draws,nd_shafts;
static GLuint nd_program;static int nd_failed;static GLint nd_axis,nd_origin,nd_basis,nd_tint,nd_lamps,nd_colors,nd_axes,nd_rock,nd_flash,nd_blasts,nd_blast_colors,nd_opacity,nd_light,nd_type;
static int nd_lod_level=-999;static double nd_lod_clock;
static void nd_frame_begin(void){
    if(nd_frame==framecount)return;nd_frame=framecount;nd_draws=nd_shafts=0;
    double now=emscripten_get_now();float dt=(now-nd_lod_clock)*.001;nd_lod_clock=now;
    if(nd_lod_level!=Current_level_num){memset(nd_residents,0,sizeof nd_residents);nd_lod_level=Current_level_num;dt=0;}
    nd_choice_count=0;
    extern short Render_list[];extern int N_render_segs;
    for(int i=0;i<N_render_segs;i++){
        int room=Render_list[i];if(room<0||room>Highest_segment_index)continue;
        for(int s=0;s<6;s++){
            side *f=&Segments[room].sides[s];int t=f->tmap_num;
            if(!ng_solid(room,s)||f->tmap_num2||t<0||t>=NumTextures||TmapInfo[t].lighting>0)continue;
            ogl_texture *tex=GameBitmaps[Textures[t].index].gltexture;
            if(!tex||tex->faithful<20||tex->faithful==24||tex->faithful==26||tex->faithful==31)continue;
            vms_vector center,delta,inside;compute_center_point_on_side(&center,&Segments[room],s);
            float distance=f2fl(vm_vec_dist(&center,&View_position));if(distance>=76)continue;
            compute_segment_center(&inside,&Segments[room]);vm_vec_sub2(&inside,&center);vm_vec_sub(&delta,&View_position,&center);
            fix facing=vm_vec_dot(&delta,&f->normals[0]);if(vm_vec_dot(&inside,&f->normals[0])<0)facing=-facing;if(facing<=0)continue;
            if(aw_vent(room,s)||astra_fixture_kind(room,s))continue;
            nd_consider(room*6+s+1,distance);
        }
    }
    nd_choose_step(dt);
}
static unsigned nd_stamp(int room,int s){unsigned h=(unsigned)Current_level_num;int ids[4];get_side_verts(ids,room,s);for(int i=0;i<4;i++){h=(h^(unsigned)Vertices[ids[i]].x)*16777619u;h=(h^(unsigned)Vertices[ids[i]].y)*16777619u;h=(h^(unsigned)Vertices[ids[i]].z)*16777619u;}return h^(unsigned)Segments[room].sides[s].tmap_num;}
static nd_mesh *nd_build(int room,int s,int rock){
    unsigned stamp=nd_stamp(room,s);nd_mesh *m=NULL;
    for(int i=0;i<128;i++)if(nd_meshes[i].buffer&&nd_meshes[i].room==room&&nd_meshes[i].side==s&&nd_meshes[i].stamp==stamp){m=&nd_meshes[i];m->used=++nd_tick;return m;}
    m=&nd_meshes[0];for(int i=1;i<128;i++)if(!nd_meshes[i].buffer||nd_meshes[i].used<m->used)m=&nd_meshes[i];
    static nd_vertex vertices[2400],grid[21][21];int count=0;const float cuts[]={0,.018f,.045f,.455f,.482f,.5f,.518f,.545f,.955f,.982f,1};int cells=rock?20:10;
    ng_shape shape;ng_prepare(room,s,rock,&shape);
    for(int y=0;y<=cells;y++)for(int x=0;x<=cells;x++)ng_point(&shape,rock?x/(float)cells:cuts[x],rock?y/(float)cells:cuts[y],&grid[y][x]);
    for(int half=0;half<2;half++){
        for(int y=0;y<cells;y++)for(int x=0;x<cells;x++){
            nd_vertex *q[]={&grid[y][x],&grid[y][x+1],&grid[y+1][x+1],&grid[y+1][x]};
            const int diagonal02[]={0,1,2,0,2,3},diagonal13[]={0,1,3,1,2,3};const int *order=shape.type==SIDE_IS_TRI_13?diagonal13:diagonal02;
            for(int t=0;t<2;t++){
                float u=0,v=0;for(int j=0;j<3;j++){u+=q[order[t*3+j]]->uv[2]/3;v+=q[order[t*3+j]]->uv[3]/3;}
                int owner=shape.type==SIDE_IS_TRI_13?(u+v>1):(u<v);if(owner!=half)continue;
                for(int j=0;j<3;j++)vertices[count++]=*q[order[t*3+j]];
            }
        }
        if(!half)m->half=count;
    }
    if(!m->buffer)glGenBuffers(1,&m->buffer);glBindBuffer(GL_ARRAY_BUFFER,m->buffer);glBufferData(GL_ARRAY_BUFFER,count*sizeof(nd_vertex),vertices,GL_STATIC_DRAW);glBindBuffer(GL_ARRAY_BUFFER,0);
    m->room=room;m->side=s;m->stamp=stamp;m->count=count;m->rock=rock;m->used=++nd_tick;nd_uploads++;return m;
}
int astra_detail_surface_kind(int room,int s){
    side *f=&Segments[room].sides[s];int t=f->tmap_num;
    if(Segments[room].children[s]>=0||f->wall_num>=0||f->tmap_num2||t<0||t>=NumTextures||TmapInfo[t].lighting||TmapInfo[t].damage||TmapInfo[t].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD)||astra_fixture_kind(room,s))return 0;
    const char *name=piggy_game_bitmap_name(&GameBitmaps[Textures[t].index]);if(!name)return 0;
    int family=astra_district_family(room,s);if(family>=0)return sz_natural(family)?2:1;
    if(astra_environment_rock(t))return 2;return (!strncmp(name,"metl",4)||!strncmp(name,"ceil",4)||!strncmp(name,"wall",4))?1:0;
}
static void nd_surface(int room,int s,int nv,const int *vp,const g3s_lrgb *light){
    extern int astra_ov_enabled(void);nd_frame_begin();if(nd_failed||!astra_detail_upgrade||astra_native_compare||astra_ov_enabled()||ss_capture)return;if(nd_draws>=ND_SLOTS*2)return;
    side *face=&Segments[room].sides[s];int t=face->tmap_num;if(face->tmap_num2||t<0||t>=NumTextures||TmapInfo[t].lighting>0)return;
    ogl_texture *tex=GameBitmaps[Textures[t].index].gltexture;if(!tex||tex->faithful<20||tex->faithful==24||tex->faithful==26||tex->faithful==31)return;
    vms_vector center;compute_center_point_on_side(&center,&Segments[room],s);float distance=f2fl(vm_vec_dist(&center,&View_position));float opacity=nd_residency(room*6+s+1)*nd_distance_fade(distance);if(opacity<=0)return;
    if(aw_vent(room,s)||astra_fixture_kind(room,s))return;
    afx_plane plane;if(!afx_plane_for(room,s,0,&plane))return;int family=sz_material(room,s,tex->faithful-20),district=astra_district_family(room,s)>=0?astra_district(room):-1;int rock=sz_natural(family);
    if(!nd_program){
        const char *vs="uniform mat3 axis;uniform vec3 origin;uniform vec3 wallLight[4];uniform float faceType;varying mediump vec4 finish;varying mediump vec3 shade;varying highp vec3 p,n;varying highp vec2 uv;varying highp vec3 world,worldNormal;void main(){world=gl_Vertex.xyz;worldNormal=gl_Normal;p=axis*gl_Vertex.xyz+origin;n=normalize(axis*gl_Normal);uv=gl_MultiTexCoord0.xy;vec2 q=gl_MultiTexCoord0.zw;vec4 w=vec4((1.-q.x)*(1.-q.y),q.x*(1.-q.y),q.x*q.y,(1.-q.x)*q.y);if(faceType>1.5&&faceType<2.5){if(q.x>=q.y)w=vec4(1.-q.x,q.x-q.y,q.y,0.);else w=vec4(1.-q.y,0.,q.x,q.y-q.x);}if(faceType>2.5){if(q.x+q.y<=1.)w=vec4(1.-q.x-q.y,q.x,0.,q.y);else w=vec4(0.,1.-q.y,q.x+q.y-1.,1.-q.x);}shade=wallLight[0]*w.x+wallLight[1]*w.y+wallLight[2]*w.z+wallLight[3]*w.w;finish=gl_Color;gl_Position=gl_ProjectionMatrix*vec4(p,1.);}";
        const char *fs="precision highp float;varying mediump vec4 finish;varying highp vec3 p,n;varying highp vec2 uv;uniform sampler2D paint,detail,liningPaint,liningDetail;uniform float district;uniform mat3 basis;uniform vec3 tint;uniform mat3 axis;uniform float rock,opacity;varying mediump vec3 shade;uniform vec4 lamps[4],colors[4],axes[4],flash;uniform vec4 blasts[3],blastColors[3];varying highp vec3 world,worldNormal;" AR_ROOM_GLSL AS_STRATA_GLSL
        "vec3 rockSample(sampler2D image,vec2 q){vec2 f=fract(q),b=(1.-smoothstep(vec2(0.),vec2(.065),min(f,1.-f)))*.5;vec3 a=texture2D(image,q).rgb;return mix(mix(a,texture2D(image,vec2(1.-f.x,f.y)).rgb,b.x),mix(texture2D(image,vec2(f.x,1.-f.y)).rgb,texture2D(image,1.-f).rgb,b.x),b.y);}"
        "void main(){vec4 material=texture2D(detail,uv);vec2 normal=(material.xy*2.-1.)*.55;vec3 N=normalize(n+basis[0]*normal.x+basis[1]*normal.y),V=normalize(-p);vec3 c=texture2D(paint,uv).rgb*tint;if(rock>.5){c=strataSample(paint,world,worldNormal)*strataTint(world);N=normalize(axis*strataNormal(detail,world,normalize(worldNormal)));if(district==4.){float cover=districtLining(uv);material=mix(material,texture2D(liningDetail,uv),cover);normal=(material.xy*2.-1.)*.55;N=normalize(mix(N,n+basis[0]*normal.x+basis[1]*normal.y,cover));c=mix(c,texture2D(liningPaint,uv).rgb,cover);}}float grain=sin(uv.x*77.)*sin(uv.y*51.);c*=1.+grain*.012;float wet=finish.y;float grainWear=.65+.35*material.b;c=mix(c,c*vec3(.66,.36,.18),finish.z*grainWear);c*=1.-finish.w*.42;float mineral=wet*(1.-wet)*1.6;c=mix(c,vec3(.34,.36,.29),mineral*.28);c*=mix(1.,.67,wet);float rough=mix(clamp(material.b*.7+.17+rock*.18+finish.z*.24,.22,.96),.20,wet);vec3 lit=c*shade*finish.x*(.91+(dot(N,V)-dot(normalize(n),V))*.53);float specular=mix(70.,16.,rough);for(int i=0;i<4;i++){vec3 D=lamps[i].xyz-p;D+=axes[i].xyz*clamp(dot(-D,axes[i].xyz),-axes[i].w,axes[i].w);float len=length(D);D/=max(.01,len);float fall=pow(max(0.,1.-len/max(.01,lamps[i].w)),2.);lit+=colors[i].rgb*fall*(c*(.14+.7*max(0.,dot(N,D)))+pow(max(0.,dot(N,normalize(V+D))),specular)*(.24-rock*.20+wet*.34)*(1.-finish.z*.65));}vec3 D=flash.xyz-p;float d=length(D);D/=max(.01,d);lit+=vec3(1.,.3,.08)*flash.w/(1.+d*d*.009)*(c*max(0.,dot(N,D))+.2*pow(max(0.,dot(N,normalize(V+D))),28.));float fresnel=pow(1.-max(0.,dot(N,V)),3.);lit+=vec3(.035,.05,.055)*fresnel*(1.-rock*.8);for(int i=0;i<3;i++){float fade=max(0.,1.-distance(world,blasts[i].xyz)/max(.001,blasts[i].w));vec3 B=normalize(axis*(blasts[i].xyz-world)+vec3(.0001));float diffuse=max(0.,dot(N,B)),spec=pow(max(0.,dot(N,normalize(V+B))),specular);lit+=blastColors[i].rgb*fade*fade*(c*(.18+.82*diffuse)+spec*(.35-rock*.31+wet*.35)*(1.-finish.z*.65));}if(roomReflection>0.)lit+=roomReflection*roomRay(reflect(-V,N),rough)*(.04+.25*fresnel)*(1.-rock*.86+wet*.65);gl_FragColor=vec4(lit,opacity);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){nd_failed=1;return;}nd_program=glCreateProgram();glAttachShader(nd_program,v);glAttachShader(nd_program,f);glLinkProgram(nd_program);glDeleteShader(v);glDeleteShader(f);GLint linked=0;glGetProgramiv(nd_program,GL_LINK_STATUS,&linked);if(!linked){nd_failed=1;return;}
        nd_type=glGetUniformLocation(nd_program,"faceType");nd_opacity=glGetUniformLocation(nd_program,"opacity");nd_light=glGetUniformLocation(nd_program,"wallLight[0]");nd_axis=glGetUniformLocation(nd_program,"axis");nd_origin=glGetUniformLocation(nd_program,"origin");nd_basis=glGetUniformLocation(nd_program,"basis");nd_tint=glGetUniformLocation(nd_program,"tint");nd_lamps=glGetUniformLocation(nd_program,"lamps[0]");nd_colors=glGetUniformLocation(nd_program,"colors[0]");nd_axes=glGetUniformLocation(nd_program,"axes[0]");nd_rock=glGetUniformLocation(nd_program,"rock");nd_flash=glGetUniformLocation(nd_program,"flash");nd_blasts=glGetUniformLocation(nd_program,"blasts[0]");nd_blast_colors=glGetUniformLocation(nd_program,"blastColors[0]");glUseProgram(nd_program);glUniform1i(glGetUniformLocation(nd_program,"detail"),1);glUniform1i(glGetUniformLocation(nd_program,"paint"),0);glUseProgram(0);
    }
    extern float astra_blast_positions[3][4],astra_blast_colors[3][4];
    nd_mesh *mesh=nd_build(room,s,rock);float axis[9],basis[9];for(int k=0;k<3;k++){vms_vector a={0},r;if(k==0)a.x=F1_0;else if(k==1)a.y=F1_0;else a.z=F1_0;g3_rotate_delta_vec(&r,&a);axis[k*3]=f2fl(r.x);axis[k*3+1]=f2fl(r.y);axis[k*3+2]=-f2fl(r.z);}
    for(int j=0;j<3;j++){float *src=j==0?plane.u:j==1?plane.v:plane.n;for(int k=0;k<3;k++)basis[j*3+k]=axis[k]*src[0]+axis[3+k]*src[1]+axis[6+k]*src[2];astra_unit(basis+j*3);}
    vms_vector zero={0};g3s_point origin;g3_rotate_point(&origin,&zero);GLboolean cull=glIsEnabled(GL_CULL_FACE);glDisable(GL_CULL_FACE);glUseProgram(nd_program);ar_bind_to(nd_program,room);
    glUniformMatrix3fv(nd_axis,1,GL_FALSE,axis);glUniformMatrix3fv(nd_basis,1,GL_FALSE,basis);glUniform3f(nd_origin,f2fl(origin.p3_x),f2fl(origin.p3_y),-f2fl(origin.p3_z));float districtTint[3]={1,1,1};glUniform3fv(nd_tint,1,district>=0?districtTint:tex->generated_tint);glUniform1f(AS_UNIFORM(nd_program,"district"),district);int ids[4],half=0;get_side_verts(ids,room,s);float illumination[12];for(int i=0;i<4;i++){illumination[i*3]=illumination[i*3+1]=illumination[i*3+2]=fminf(1,f2fl(face->uvls[i].l));for(int j=0;j<nv;j++)if(ids[i]==vp[j]){illumination[i*3]=fminf(1,f2fl(light[j].r));illumination[i*3+1]=fminf(1,f2fl(light[j].g));illumination[i*3+2]=fminf(1,f2fl(light[j].b));}}if(nv==3){int unique=face->type==SIDE_IS_TRI_13?2:3;for(int j=0;j<nv;j++)if(vp[j]==ids[unique])half=1;}glUniform1f(nd_type,face->type);glUniform3fv(nd_light,4,illumination);glUniform1f(nd_opacity,opacity);glUniform1f(nd_rock,rock);
    glUniform4fv(nd_lamps,4,&afx_lamps[0][0]);glUniform4fv(nd_colors,4,&afx_colors[0][0]);glUniform4fv(nd_axes,4,&afx_axes[0][0]);glUniform4fv(nd_flash,1,astra_flash);glUniform4fv(nd_blasts,3,&astra_blast_positions[0][0]);glUniform4fv(nd_blast_colors,3,&astra_blast_colors[0][0]);
    ag_load(family);if(district==4){ag_load(8);glActiveTexture(GL_TEXTURE2);glBindTexture(GL_TEXTURE_2D,ag_colors[8]);glUniform1i(AS_UNIFORM(nd_program,"liningPaint"),2);glActiveTexture(GL_TEXTURE3);glBindTexture(GL_TEXTURE_2D,ag_details[8]);glUniform1i(AS_UNIFORM(nd_program,"liningDetail"),3);}
    glActiveTexture(GL_TEXTURE1);glBindTexture(GL_TEXTURE_2D,ag_details[family]);glActiveTexture(GL_TEXTURE0);glBindTexture(GL_TEXTURE_2D,ag_colors[family]);
    /* The original wall already owns depth. Retain it so projected damage and
     * ship shadows still land on the shallow cosmetic relief. */
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;gr_settransblend(GR_FADE_OFF,GR_BLEND_NORMAL);
    GLboolean write=astra_depth_write;glDepthMask(GL_FALSE);
    glBindBuffer(GL_ARRAY_BUFFER,mesh->buffer);glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_NORMAL_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);glVertexPointer(3,GL_FLOAT,sizeof(nd_vertex),(void*)0);glNormalPointer(GL_FLOAT,sizeof(nd_vertex),(void*)(3*sizeof(float)));glTexCoordPointer(4,GL_FLOAT,sizeof(nd_vertex),(void*)(6*sizeof(float)));glColorPointer(4,GL_FLOAT,sizeof(nd_vertex),(void*)(10*sizeof(float)));glDrawArrays(GL_TRIANGLES,nv==3&&half?mesh->half:0,nv==3?(half?mesh->count-mesh->half:mesh->half):mesh->count);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_NORMAL_ARRAY);glDisableClientState(GL_TEXTURE_COORD_ARRAY);glBindBuffer(GL_ARRAY_BUFFER,0);glUseProgram(0);glDepthMask(write);if(cull)glEnable(GL_CULL_FACE);gr_settransblend(fade,blend);nd_draws++;
}
static void ae_haze_flush(void);
static int nd_lamp(int room,int s,aw_mount *m,float *color){
    if(aw_mount_for(room,s,m)){memcpy(color,aw_palette[m->color],3*sizeof(float));return 1;}
    side *f=&Segments[room].sides[s];int t=f->tmap_num,top=f->tmap_num2&0x3fff;
    if(!ng_solid(room,s)||t<0||t>=NumTextures||top>=NumTextures)return 0;
    if(TmapInfo[t].lighting<F1_0/10&&(!top||TmapInfo[top].lighting<F1_0/10))return 0;
    if(TmapInfo[t].damage||TmapInfo[t].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD))return 0;
    int ids[4];get_side_verts(ids,room,s);compute_center_point_on_side(&m->p,&Segments[room],s);vm_vec_normalized_dir(&m->r,&Vertices[ids[1]],&Vertices[ids[0]]);m->n=f->normals[0];vms_vector center,d;compute_segment_center(&center,&Segments[room]);vm_vec_sub(&d,&center,&m->p);if(vm_vec_dot(&d,&m->n)<0)vm_vec_negate(&m->n);vm_vec_cross(&m->u,&m->n,&m->r);vm_vec_normalize(&m->u);m->width=1;m->color=3;
    color[0]=.85f;color[1]=.79f;color[2]=.64f;ogl_texture *tex=GameBitmaps[Textures[top?top:t].index].gltexture;if(tex)aw_lens_tint(tex,room,color);return 1;
}
static void nd_atmosphere(int room){
    extern int astra_ov_enabled(void);nd_frame_begin();if(!astra_detail_upgrade||astra_native_compare||astra_ov_enabled())return;nd_frame_begin();if(nd_shafts>=4)return;
    for(int s=0;s<6&&nd_shafts<4;s++){aw_mount m;float color[3];if(Light_subtracted[room]&(1<<s)||!nd_lamp(room,s,&m,color))continue;g3s_point p;g3_rotate_point(&p,&m.p);if(p.p3_z<F1_0||p.p3_z>i2f(55))continue;
        float length=7;vms_vector end;while(length>1){vm_vec_scale_add(&end,&m.p,&m.n,fl2f(length));if(find_point_seg(&end,room)==room)break;length-=.75f;}if(length<2)continue;
        vms_matrix b={m.r,m.u,m.n};g3_start_instance_matrix(&m.p,&b);ax_count=0;float t=ae_clock();
        /* Overlapping soft volumes produce a continuous, tapered shaft with
         * no hard transparent cone silhouette. Depth testing remains enabled. */
        for(int j=0;j<12;j++){float z=.25f+j*length/12,fade=1-z/length;ax_paint(color[0],color[1],color[2],0);af_particle(sinf(t*.22f+j)*.07f,0,z,.22f+z*.16f,.022f*fade,room+j+t*.1f);}
        for(int j=0;j<14;j++){float phase=fmodf(t*.13f+j*.073f,1),z=.4f+phase*(length-.6f),r=.12f+z*.12f;ax_paint(color[0]*.7f+.15f,color[1]*.7f+.15f,color[2]*.7f+.15f,0);af_particle(sinf(j*3.2f+t*.12f)*r,cosf(j*1.7f+t*.17f)*r,z,.013f+(j%3)*.006f,.42f*sinf(phase*3.14159f),j);}
        ae_haze_flush();g3_done_instance();nd_shafts++;
    }
}
