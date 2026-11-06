/* Bounded room-surface probes. Render the six existing wall maps into one tiny
 * cached atlas; reflection rays intersect the real planes, not a canned image.
 * No scene re-render, downloads, depth extension or floating-point target. */
typedef struct {GLuint texture;int room,level,signature;unsigned used;double updated;float valid[6];} ar_probe;
static ar_probe ar_probes[12];static GLuint ar_fbo,ar_program;static int ar_failed,ar_frame=-1,ar_budget,ar_refreshes;
static unsigned ar_tick;
static GLint ar_uv0,ar_duv,ar_rect,ar_tint,ar_glow,ar_lines,ar_line_colors;
static int ar_signature(int room){unsigned hash=2166136261u;for(int s=0;s<6;s++){side *f=&Segments[room].sides[s];hash=(hash^(unsigned)(f->tmap_num+f->tmap_num2*997+WALL_IS_DOORWAY(&Segments[room],s)*193))*16777619u;}return (int)(hash^Light_subtracted[room]);}
static ar_probe *ar_find(int room){for(int i=0;i<12;i++)if(ar_probes[i].texture&&ar_probes[i].room==room&&ar_probes[i].level==Current_level_num)return &ar_probes[i];return NULL;}
void astra_room_materials(int room){
    static int enabled=-1;if(enabled<0)enabled=EM_ASM_INT(return !!Module.astra);if(!enabled)return;
    extern int astra_ov_enabled(void);if(!astra_detail_upgrade||astra_native_compare||ar_failed||astra_ov_enabled()||room<0||room>Highest_segment_index)return;
    vms_vector center;compute_segment_center(&center,&Segments[room]);if(vm_vec_dist_quick(&center,&View_position)>i2f(85))return;
    if(ar_frame!=framecount){ar_frame=framecount;ar_budget=0;}
    ar_probe *probe=ar_find(room);int signature=ar_signature(room);
    if(probe){probe->used=++ar_tick;if(probe->signature==signature)return;}
    if(ar_budget)return;ar_budget++;
    if(!probe){probe=&ar_probes[0];for(int i=1;i<12;i++)if(!ar_probes[i].texture||ar_probes[i].used<probe->used)probe=&ar_probes[i];}
    if(!ar_program){
        const char *vs="varying highp vec2 uv;void main(){uv=gl_Vertex.xy*.5+.5;gl_Position=vec4(gl_Vertex.xy,0.,1.);}";
        const char *fs="precision highp float;varying highp vec2 uv;uniform sampler2D image;uniform vec4 uv0,duv,rect,tint;uniform float glow;uniform vec4 lines[2];uniform vec3 lineColors[2];void main(){vec2 q=uv0.xy+uv.x*uv0.zw+uv.y*duv.xy;if(rect.z>0.)q=(fract(q)-rect.xy)/rect.zw;vec4 a=texture2D(image,q);vec3 c=a.rgb*tint.rgb;float hot=smoothstep(.65,.9,max(a.r,max(a.g,a.b)));c+=a.rgb*hot*glow;for(int i=0;i<2;i++){vec2 d=lines[i].zw-lines[i].xy;float t=clamp(dot(uv-lines[i].xy,d)/max(.00001,dot(d,d)),0.,1.);float r=length(uv-lines[i].xy-d*t);c+=lineColors[i]*(1.-smoothstep(.006,.025,r));}gl_FragColor=vec4(c,a.a);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){ar_failed=1;return;}
        ar_program=glCreateProgram();glAttachShader(ar_program,v);glAttachShader(ar_program,f);glLinkProgram(ar_program);glDeleteShader(v);glDeleteShader(f);GLint ok;glGetProgramiv(ar_program,GL_LINK_STATUS,&ok);if(!ok){ar_failed=1;return;}
        ar_uv0=glGetUniformLocation(ar_program,"uv0");ar_duv=glGetUniformLocation(ar_program,"duv");ar_rect=glGetUniformLocation(ar_program,"rect");ar_tint=glGetUniformLocation(ar_program,"tint");ar_glow=glGetUniformLocation(ar_program,"glow");ar_lines=glGetUniformLocation(ar_program,"lines[0]");ar_line_colors=glGetUniformLocation(ar_program,"lineColors[0]");glGenFramebuffers(1,&ar_fbo);
    }
    al_reflection_room(room);
    GLint framebuffer,viewport[4];glGetIntegerv(GL_FRAMEBUFFER_BINDING,&framebuffer);glGetIntegerv(GL_VIEWPORT,viewport);
    GLboolean depth=glIsEnabled(GL_DEPTH_TEST),blend=glIsEnabled(GL_BLEND),cull=glIsEnabled(GL_CULL_FACE),scissor=glIsEnabled(GL_SCISSOR_TEST),write=astra_depth_write;
    glActiveTexture(GL_TEXTURE7);if(!probe->texture){glGenTextures(1,&probe->texture);glBindTexture(GL_TEXTURE_2D,probe->texture);glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,256,128,0,GL_RGBA,GL_UNSIGNED_BYTE,NULL);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE);}
    glBindFramebuffer(GL_FRAMEBUFFER,ar_fbo);glFramebufferTexture2D(GL_FRAMEBUFFER,GL_COLOR_ATTACHMENT0,GL_TEXTURE_2D,probe->texture,0);
    if(glCheckFramebufferStatus(GL_FRAMEBUFFER)!=GL_FRAMEBUFFER_COMPLETE){ar_failed=1;glBindFramebuffer(GL_FRAMEBUFFER,framebuffer);glActiveTexture(GL_TEXTURE0);return;}
    glDisable(GL_DEPTH_TEST);glDisable(GL_BLEND);glDisable(GL_CULL_FACE);glDisable(GL_SCISSOR_TEST);glDepthMask(GL_FALSE);glUseProgram(ar_program);glActiveTexture(GL_TEXTURE0);
    glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_NORMAL_ARRAY);glDisableClientState(GL_TEXTURE_COORD_ARRAY);
    glUniform1i(glGetUniformLocation(ar_program,"image"),0);float quad[]={-1,-1,1,-1,1,1,-1,1};glEnableClientState(GL_VERTEX_ARRAY);glVertexPointer(2,GL_FLOAT,0,quad);
    for(int s=0;s<6;s++){
        glViewport((s%4)*64,(s/4)*64,64,64);probe->valid[s]=al_probe.origins[s][3];
        glBindTexture(GL_TEXTURE_2D,al_probe.textures[s]?al_probe.textures[s]:ag_colors[7]);
        glUniform4fv(ar_uv0,1,al_probe.uv[s]);glUniform4fv(ar_duv,1,al_probe.duv[s]);glUniform4fv(ar_rect,1,al_probe.rect[s]);
        float tint[4]={.04f,.05f,.06f,1};for(int k=0;k<3;k++)if(probe->valid[s])tint[k]=al_probe.tint[s][k]*al_probe.u[s][3];glUniform4fv(ar_tint,1,tint);
        side *face=&Segments[room].sides[s];glUniform1f(ar_glow,Light_subtracted[room]&(1<<s)?0:(face->tmap_num>=0&&face->tmap_num<NumTextures?fminf(.7f,f2fl(TmapInfo[face->tmap_num].lighting)):0));
        float lines[2][4]={{0}},colors[2][3]={{0}};
        for(int j=0;j<2;j++){aw_mount mount;if(Light_subtracted[room]&(1<<s)||!aw_mount_at(room,s,j,&mount))continue;
            for(int end=0;end<2;end++){vms_vector point=mount.p;vm_vec_scale_add2(&point,&mount.r,fl2f(mount.width*(end?1:-1)));float delta[3]={f2fl(point.x)-al_probe.origins[s][0],f2fl(point.y)-al_probe.origins[s][1],f2fl(point.z)-al_probe.origins[s][2]};lines[j][end*2]=al_dot(delta,al_probe.u[s]);lines[j][end*2+1]=al_dot(delta,al_probe.v[s]);}
            memcpy(colors[j],aw_palette[mount.color],sizeof colors[j]);
        }
        glUniform4fv(ar_lines,2,&lines[0][0]);glUniform3fv(ar_line_colors,2,&colors[0][0]);glDrawArrays(GL_TRIANGLE_FAN,0,4);
    }
    glDisableClientState(GL_VERTEX_ARRAY);glUseProgram(0);glBindFramebuffer(GL_FRAMEBUFFER,framebuffer);glViewport(viewport[0],viewport[1],viewport[2],viewport[3]);glDepthMask(write);if(depth)glEnable(GL_DEPTH_TEST);if(blend)glEnable(GL_BLEND);if(cull)glEnable(GL_CULL_FACE);if(scissor)glEnable(GL_SCISSOR_TEST);glActiveTexture(GL_TEXTURE0);
    probe->room=room;probe->level=Current_level_num;probe->signature=signature;probe->used=++ar_tick;ar_refreshes++;
    EM_ASM(Module.roomReflections=({version:50,updates:$0,capacity:12,atlasWidth:256,atlasHeight:128});,ar_refreshes);
}
static void ar_bind_to(GLuint program,int room){
    typedef struct{GLuint program;GLint on,planes,origins,du,dv,texture;int room,frame;} bindings;
    static bindings programs[3];bindings *b=NULL;for(int i=0;i<3;i++)if(programs[i].program==program){b=&programs[i];break;}
    if(!b)for(int i=0;i<3;i++)if(!programs[i].program){b=&programs[i];b->program=program;b->on=-2;b->frame=-1;break;}if(!b)return;
    GLint on=b->on,planes=b->planes,origins=b->origins,du=b->du,dv=b->dv,texture=b->texture;
    if(on==-2){on=glGetUniformLocation(program,"roomReflection");planes=glGetUniformLocation(program,"reflectPlanes[0]");origins=glGetUniformLocation(program,"reflectOrigins[0]");du=glGetUniformLocation(program,"reflectU[0]");dv=glGetUniformLocation(program,"reflectV[0]");texture=glGetUniformLocation(program,"roomAtlas");}
    b->on=on;b->planes=planes;b->origins=origins;b->du=du;b->dv=dv;b->texture=texture;
    ar_probe *probe=ar_find(room);glUniform1f(on,astra_detail_upgrade&&astra_drawing_mine&&probe&&!ar_failed?1:0);if(!astra_detail_upgrade||!astra_drawing_mine||!probe||ar_failed)return;
    if(b->room==room&&b->frame==framecount){glActiveTexture(GL_TEXTURE7);glBindTexture(GL_TEXTURE_2D,probe->texture);glActiveTexture(GL_TEXTURE0);return;}b->room=room;b->frame=framecount;
    float plane[6][4]={{0}},origin[6][4]={{0}},u[6][4]={{0}},v[6][4]={{0}};
    for(int s=0;s<6;s++)if(probe->valid[s]){
        int ids[4];get_side_verts(ids,room,s);float xyz[3][3];for(int i=0;i<3;i++){g3s_point p;g3_rotate_point(&p,&Vertices[ids[i==2?3:i]]);xyz[i][0]=f2fl(p.p3_x);xyz[i][1]=f2fl(p.p3_y);xyz[i][2]=-f2fl(p.p3_z);}
        float e[3],f[3];for(int k=0;k<3;k++){origin[s][k]=xyz[0][k];e[k]=xyz[1][k]-xyz[0][k];f[k]=xyz[2][k]-xyz[0][k];}
        float ee=al_dot(e,e),ff=al_dot(f,f),ef=al_dot(e,f),det=ee*ff-ef*ef;if(fabsf(det)<.001f)continue;
        for(int k=0;k<3;k++){u[s][k]=(ff*e[k]-ef*f[k])/det;v[s][k]=(ee*f[k]-ef*e[k])/det;}
        al_cross(plane[s],e,f);astra_unit(plane[s]);plane[s][3]=-al_dot(plane[s],origin[s]);origin[s][3]=1;
    }
    glUniform4fv(planes,6,&plane[0][0]);glUniform4fv(origins,6,&origin[0][0]);glUniform4fv(du,6,&u[0][0]);glUniform4fv(dv,6,&v[0][0]);glUniform1i(texture,7);glActiveTexture(GL_TEXTURE7);glBindTexture(GL_TEXTURE_2D,probe->texture);glActiveTexture(GL_TEXTURE0);
}

static void ar_bind(int room){ar_bind_to(astra_program,room);}
