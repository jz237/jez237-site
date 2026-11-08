/* Shallow structural skins on ordinary solid faces. Cached in world space;
 * no portal, animated door, secret panel, sign or liquid is covered. */
typedef struct {GLuint buffer;unsigned stamp,used;int room,side,count,frame,material,pattern;vms_matrix view;float tangent[3],size[2];vms_vector eye;float n[3];} ai_skin;
static ai_skin ai_skins[128];static unsigned ai_tick,ai_uploads,ai_draws;
static GLuint ai_program;static int ai_failed;
static forge_vertex ai_vertices[5400];
typedef struct {forge_vertex v;float normal[3];} ai_vertex;static ai_vertex ai_gpu[5400];
static float ai_diagonal(const forge_vertex *v,int type){return type==SIDE_IS_TRI_13?v->face[0]+v->face[1]-1:v->face[0]-v->face[1];}
static forge_vertex ai_map(forge_vertex v,int type){
    float u=v.face[0],w=v.face[1],a=(1-u)*(1-w),b=u*(1-w),c=u*w,d=(1-u)*w;
    if(type==SIDE_IS_TRI_02){if(u>=w){a=1-u;b=u-w;c=w;d=0;}else{a=1-w;b=0;c=u;d=w-u;}}
    if(type==SIDE_IS_TRI_13){if(u+w<=1){a=1-u-w;b=u;c=0;d=w;}else{a=0;b=1-w;c=u+w-1;d=1-u;}}
    for(int k=0;k<3;k++)v.p[k]=a*corners3[0][k]+b*corners3[1][k]+c*corners3[2][k]+d*corners3[3][k]+faceNrm[k]*v.face[2];return v;
}
static int ai_split(int type){
    int count=0;
    for(int i=0;i+2<gantryN;i+=3)for(int half=0;half<(type==SIDE_IS_QUAD?1:2);half++){
        forge_vertex polygon[5];int n=0;
        for(int j=0;j<3;j++){
            forge_vertex a=gantryVerts[i+j],b=gantryVerts[i+(j+1)%3];float da=ai_diagonal(&a,type)*(half?1:-1),db=ai_diagonal(&b,type)*(half?1:-1);
            if(type==SIDE_IS_QUAD||da>=0)polygon[n++]=a;
            if(type!=SIDE_IS_QUAD&&((da<0&&db>0)||(da>0&&db<0))){float t=da/(da-db);forge_vertex v;for(int k=0;k<12;k++)((float*)&v)[k]=((float*)&a)[k]+(((float*)&b)[k]-((float*)&a)[k])*t;polygon[n++]=v;}
        }
        for(int j=1;j+1<n&&count+3<=5400;j++){ai_vertices[count++]=ai_map(polygon[0],type);ai_vertices[count++]=ai_map(polygon[j],type);ai_vertices[count++]=ai_map(polygon[j+1],type);}
    }
    return count;
}
static int ai_surface_kind(int room,int s){
    int texture=Segments[room].sides[s].tmap_num;
    if(texture>=0&&texture<NumTextures){ogl_texture *tex=GameBitmaps[Textures[texture].index].gltexture;if(tex&&(tex->faithful==21||tex->faithful==26||tex->faithful==27))return 0;}
    int kind=astra_detail_surface_kind(room,s);if(kind)return kind;
    side *face=&Segments[room].sides[s];int id=face->wall_num,t=face->tmap_num;
    if(id<0||t<0||t>=NumTextures||face->tmap_num2||TmapInfo[t].lighting||TmapInfo[t].damage||TmapInfo[t].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD))return 0;
    wall *w=&Walls[id];if(w->type!=WALL_DOOR||w->state!=WALL_DOOR_CLOSED||w->clip_num<0||!(WallAnims[w->clip_num].flags&WCF_HIDDEN))return 0;
    /* Closed secret surfaces receive the same treatment as ordinary walls:
     * absence of decoration must not advertise the hidden passage. */
    ogl_texture *tex=GameBitmaps[Textures[t].index].gltexture;return tex&&tex->faithful==23?2:1;
}
static void ai_wall(int room,int side,const g3s_lrgb *light){
    if(ai_failed||!astra_detail_upgrade||astra_native_compare||ss_capture)return;
    extern int astra_ov_enabled(void);if(astra_ov_enabled())return;
    int kind=ai_surface_kind(room,side),district=astra_district(room);if(!kind||aw_vent(room,side))return;
    if(district>=0&&district<4)return;
    if(kind==2&&district!=4&&(room*13+side*7)%5!=0)return;
    vms_vector center;compute_center_point_on_side(&center,&Segments[room],side);
    float distance=f2fl(vm_vec_dist(&View_position,&center)),opacity=1-nd_smooth((distance-76)/34);if(opacity<=0)return;
    ai_skin *m=NULL;unsigned stamp=nd_stamp(room,side);
    for(int i=0;i<128;i++)if(ai_skins[i].buffer&&ai_skins[i].room==room&&ai_skins[i].side==side&&ai_skins[i].stamp==stamp){m=&ai_skins[i];break;}
    if(!m){
        m=&ai_skins[0];for(int i=1;i<128;i++)if(!ai_skins[i].buffer||ai_skins[i].used<m->used)m=&ai_skins[i];
        int ids[4];get_side_verts(ids,room,side);float A[3],B[3];
        for(int i=0;i<4;i++){corners3[i][0]=f2fl(Vertices[ids[i]].x);corners3[i][1]=f2fl(Vertices[ids[i]].y);corners3[i][2]=f2fl(Vertices[ids[i]].z);}
        for(int k=0;k<3;k++){A[k]=corners3[1][k]-corners3[0][k];B[k]=corners3[3][k]-corners3[0][k];}al_cross(faceNrm,A,B);astra_unit(faceNrm);
        vms_vector inside;compute_segment_center(&inside,&Segments[room]);float facing=(f2fl(inside.x-center.x)*faceNrm[0]+f2fl(inside.y-center.y)*faceNrm[1]+f2fl(inside.z-center.z)*faceNrm[2]);if(facing<0)for(int k=0;k<3;k++)faceNrm[k]*=-1;
        float width=sqrtf(al_dot(A,A)),height=sqrtf(al_dot(B,B));if(width<8||height<8||width>100||height>100)return;
        m->size[0]=width;m->size[1]=height;m->material=((room/5+side)%3==0)?8:0;m->pattern=(room*13+side*7)%4;if(m->pattern>=2)m->material=0;if(district>=5)m->material=district==5?8:district==6?12:9;memcpy(m->tangent,A,sizeof A);astra_unit(m->tangent);
        gantryN=0;forgeLight=1;float u=fminf(.07f,.75f/width),v=fminf(.07f,.75f/height);int pattern=(room*13+side*7)%4,lens=(room/7)%3==0?2:1;
        /* Steel ribs and joints frame exposed geology instead of repainting it. */
        forge_strip(.008,.01,u,.99,.31,1,0,1);forge_strip(1-u,.01,.992,.99,.31,1,0,1);
        forge_strip(u,.01,1-u,v,.28,1,0,0);forge_strip(u,1-v,1-u,.99,.28,1,0,0);
        if(district==4){ /* Incomplete lining and exposed ribs across the wall. */
            forge_strip(u+.012,.035,1-u-.012,.43,.27,2,0,0);
            for(int j=1;j<4;j++){float x=j*.25f;forge_strip(x-.25f/width,.45,x+.25f/width,.97,.25,1,0,1);}
        }else if(kind==2){ /* Sparse perimeter supports leave natural geology exposed. */
        }else if(pattern==0){
            forge_strip(.12,.12,.47,.88,.24,2,0,0);forge_strip(.53,.12,.88,.88,.24,2,0,0);
            forge_strip(.5f-.28f/width,.18,.5f+.28f/width,.82,.29,0,4,1);
        }else if(pattern==1){
            forge_strip(.12,.12,.88,.46,.22,2,0,0);forge_strip(.12,.54,.88,.88,.22,2,0,0);
            for(int j=0;j<3;j++){float y=.5f+(j-1)*.30f/height;forge_strip(.15,y,.85,y+.13f/height,.28,1,0,0);}
        }else if(pattern==2){
            forge_strip(.12,.15,.54,.85,.22,2,0,0);forge_strip(.61,.20,.87,.80,.15,0,4,1);
            for(int j=0;j<8;j++){float y=.24+j*.073;forge_strip(.615,y,.865,y+.24f/height,.29,1,0,0);}
        }else{
            forge_strip(.13,.12,.87,.30,.24,2,0,0);forge_strip(.13,.70,.87,.88,.24,2,0,0);
            forge_strip(.16,.39,.39,.61,.22,0,4,0);forge_strip(.61,.39,.84,.61,.22,0,4,0);
            for(int j=0;j<4;j++){float x=.5f+(j-1.5f)*.48f/width;forge_strip(x,.37,x+.18f/width,.63,.30,1,0,1);}
        }
        /* Discrete lens segments and protective metal shoulders. */
        for(int j=0;j<3;j++){float y=.26+j*.19;
            forge_strip(u+.20f/width,y,u+.65f/width,y+fminf(.12f,2.4f/height),.32,1,lens,1);
            forge_strip(1-u-.65f/width,y,1-u-.20f/width,y+fminf(.12f,2.4f/height),.32,1,lens,1);
        }
        if(!m->buffer)glGenBuffers(1,&m->buffer);glBindBuffer(GL_ARRAY_BUFFER,m->buffer);int count=ai_split(Segments[room].sides[side].type);for(int i=0;i<count;i+=3){float a[3],b[3],n[3];for(int k=0;k<3;k++){a[k]=ai_vertices[i+1].p[k]-ai_vertices[i].p[k];b[k]=ai_vertices[i+2].p[k]-ai_vertices[i].p[k];}al_cross(n,a,b);astra_unit(n);if(al_dot(n,faceNrm)<0)for(int k=0;k<3;k++)n[k]=-n[k];for(int j=0;j<3;j++){ai_gpu[i+j].v=ai_vertices[i+j];if(ai_gpu[i+j].v.c[3]<.5f){float contact=.70f+.30f*nd_smooth((ai_gpu[i+j].v.face[2]-.04f)/.22f);for(int k=0;k<3;k++)ai_gpu[i+j].v.c[k]*=contact;}memcpy(ai_gpu[i+j].normal,n,sizeof n);}}glBufferData(GL_ARRAY_BUFFER,count*sizeof(ai_vertex),ai_gpu,GL_STATIC_DRAW);glBindBuffer(GL_ARRAY_BUFFER,0);
        m->room=room;m->side=side;m->stamp=stamp;m->count=count;m->frame=-1;memcpy(m->n,faceNrm,sizeof m->n);ai_uploads++;
    }
    if(m->frame==framecount&&!memcmp(&m->eye,&View_position,sizeof View_position)&&!memcmp(&m->view,&Unscaled_matrix,sizeof Unscaled_matrix))return;m->frame=framecount;m->eye=View_position;m->view=Unscaled_matrix;
    m->used=++ai_tick;
    if(!gantryTexture&&!refit_png("forge.png",&gantryTexture,GL_REPEAT))return;ag_load(m->material);
    if(!ai_program){
        const char *vs="uniform mat3 axis;uniform vec3 origin;varying highp vec3 world,p;varying mediump vec3 geometryNormal;varying mediump vec2 uv;varying mediump vec4 paint;void main(){world=gl_Vertex.xyz;p=axis*world+origin;geometryNormal=normalize(axis*gl_Normal);uv=gl_MultiTexCoord0.xy;paint=gl_Color;gl_Position=gl_ProjectionMatrix*vec4(p,1.);}";
        const char *fs="precision highp float;uniform sampler2D atlas,metalMap,metalNormal;uniform vec3 normal,tangent,shade;uniform float pattern;uniform mat3 axis;uniform float opacity;uniform vec4 lamps[3],colors[3],axes[3],blasts[3],blastColors[3];varying highp vec3 world,p;varying mediump vec3 geometryNormal;varying mediump vec2 uv;varying mediump vec4 paint;"
        "void main(){float panel=step(.5,uv.y)*step(uv.y,.75);vec2 tile=vec2(uv.x,fract(uv.y*4.));vec2 address=pattern>2.5||abs(pattern-1.)<.1?vec2(tile.x,.018+tile.y*.25):tile;if(uv.y<.25)address=vec2(.018+tile.x*.44,.31+tile.y*.38);vec3 raw=texture2D(metalMap,address).rgb;vec3 trim=texture2D(metalMap,vec2(tile.x,.04+tile.y*.2)).rgb;vec3 art=mix(mix(trim,raw,1.-step(.25,uv.y)),raw,panel);vec3 base=pow(art,vec3(.82))*mix(vec3(.86,.91,.94),paint.rgb,.28)*1.1;vec3 finish=texture2D(metalNormal,vec2(dot(world,vec3(.065,0.,.03)),dot(world,vec3(0.,.065,.045)))).rgb;vec2 xy=(finish.xy*2.-1.)*.50;vec3 N=normalize(geometryNormal),T=normalize(tangent);T=normalize(T-N*dot(T,N)+vec3(.00001));N=normalize(N+T*xy.x+cross(N,T)*xy.y);vec3 V=normalize(-p);float bevel=.66+.34*max(0.,dot(normalize(normal),N));vec3 c=base*(shade*.82+vec3(.07,.085,.10))*bevel;float rough=clamp(finish.b*.64+.2+panel*.13,.26,.92);float exponent=mix(66.,17.,rough);for(int i=0;i<3;i++){vec3 D=lamps[i].xyz-p;D+=axes[i].xyz*clamp(dot(-D,axes[i].xyz),-axes[i].w,axes[i].w);float d=length(D);D/=max(.01,d);float f=pow(max(0.,1.-d/max(.01,lamps[i].w)),2.);c+=colors[i].rgb*f*(base*(.12+.8*max(0.,dot(N,D)))+.22*pow(max(0.,dot(N,normalize(V+D))),exponent));vec3 B=axis*(blasts[i].xyz-world);float bd=length(B);B/=max(.01,bd);float bf=pow(max(0.,1.-distance(world,blasts[i].xyz)/max(.01,blasts[i].w)),2.);c+=blastColors[i].rgb*bf*(base*(.12+.65*max(0.,dot(N,B)))+.42*pow(max(0.,dot(N,normalize(V+B))),exponent));}float rim=pow(1.-max(0.,dot(N,V)),3.);c+=vec3(.04,.07,.09)*rim;float lens=.8+.2*sin(tile.x*110.)*sin(tile.y*80.);float core=pow(max(0.,1.-abs(tile.x-.5)*2.),3.);vec3 emissive=(paint.rgb*(1.15+core*.65)+vec3(.17)*core)*lens;c=mix(c,emissive,paint.a);gl_FragColor=vec4(c/(1.+c*.17),opacity);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){ai_failed=1;return;}ai_program=glCreateProgram();glAttachShader(ai_program,v);glAttachShader(ai_program,f);glLinkProgram(ai_program);glDeleteShader(v);glDeleteShader(f);GLint linked;glGetProgramiv(ai_program,GL_LINK_STATUS,&linked);if(!linked){ai_failed=1;return;}
    }
    float axis[9],normal[3],tangent[3];for(int k=0;k<3;k++){vms_vector a={0},r;if(k==0)a.x=F1_0;else if(k==1)a.y=F1_0;else a.z=F1_0;g3_rotate_delta_vec(&r,&a);axis[k*3]=f2fl(r.x);axis[k*3+1]=f2fl(r.y);axis[k*3+2]=-f2fl(r.z);}for(int k=0;k<3;k++){normal[k]=axis[k]*m->n[0]+axis[3+k]*m->n[1]+axis[6+k]*m->n[2];tangent[k]=axis[k]*m->tangent[0]+axis[3+k]*m->tangent[1]+axis[6+k]*m->tangent[2];}
    vms_vector zero={0};g3s_point origin;g3_rotate_point(&origin,&zero);
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;GLboolean cull=glIsEnabled(GL_CULL_FACE),write=astra_depth_write;gr_settransblend(GR_FADE_OFF,GR_BLEND_NORMAL);glDisable(GL_CULL_FACE);glDepthMask(opacity>.995?GL_TRUE:GL_FALSE);glUseProgram(ai_program);
    glUniformMatrix3fv(AS_UNIFORM(ai_program,"axis"),1,GL_FALSE,axis);glUniform3f(AS_UNIFORM(ai_program,"origin"),f2fl(origin.p3_x),f2fl(origin.p3_y),-f2fl(origin.p3_z));glUniform3fv(AS_UNIFORM(ai_program,"normal"),1,normal);
    glUniform3fv(AS_UNIFORM(ai_program,"tangent"),1,tangent);glUniform1f(AS_UNIFORM(ai_program,"pattern"),m->pattern);
    glUniform1f(AS_UNIFORM(ai_program,"opacity"),opacity);glUniform3f(AS_UNIFORM(ai_program,"shade"),f2fl(light[0].r),f2fl(light[0].g),f2fl(light[0].b));
    glUniform4fv(AS_UNIFORM(ai_program,"lamps[0]"),3,&afx_lamps[0][0]);glUniform4fv(AS_UNIFORM(ai_program,"colors[0]"),3,&afx_colors[0][0]);glUniform4fv(AS_UNIFORM(ai_program,"axes[0]"),3,&afx_axes[0][0]);glUniform4fv(AS_UNIFORM(ai_program,"blasts[0]"),3,&astra_blast_positions[0][0]);glUniform4fv(AS_UNIFORM(ai_program,"blastColors[0]"),3,&astra_blast_colors[0][0]);
    glActiveTexture(GL_TEXTURE2);glBindTexture(GL_TEXTURE_2D,ag_details[m->material]);glUniform1i(AS_UNIFORM(ai_program,"metalNormal"),2);
    glActiveTexture(GL_TEXTURE1);glBindTexture(GL_TEXTURE_2D,ag_colors[m->material]);glUniform1i(AS_UNIFORM(ai_program,"metalMap"),1);glActiveTexture(GL_TEXTURE0);glBindTexture(GL_TEXTURE_2D,gantryTexture);glUniform1i(AS_UNIFORM(ai_program,"atlas"),0);
    glBindBuffer(GL_ARRAY_BUFFER,m->buffer);glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glEnableClientState(GL_NORMAL_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);glVertexPointer(3,GL_FLOAT,sizeof(ai_vertex),(void*)0);glColorPointer(4,GL_FLOAT,sizeof(ai_vertex),(void*)(3*sizeof(float)));glTexCoordPointer(2,GL_FLOAT,sizeof(ai_vertex),(void*)(7*sizeof(float)));glNormalPointer(GL_FLOAT,sizeof(ai_vertex),(void*)(12*sizeof(float)));glDrawArrays(GL_TRIANGLES,0,m->count);glDisableClientState(GL_NORMAL_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_TEXTURE_COORD_ARRAY);glBindBuffer(GL_ARRAY_BUFFER,0);glUseProgram(0);glDepthMask(write);if(cull)glEnable(GL_CULL_FACE);gr_settransblend(fade,blend);
    ai_draws++;
}
