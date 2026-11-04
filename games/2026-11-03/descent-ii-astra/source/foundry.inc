/* R22 render-only mine detailing. No objects, walls, portals or RNG are changed. */
extern int astra_gallery_scene,astra_gallery_room,astra_gallery_side;
int astra_refinement=1;
static int ag_faces,ag_rocks,ag_props,ag_shadows,ag_air;
static void ae_haze_flush(void);
static void ag_begin(void){ag_faces=ag_rocks=ag_props=ag_shadows=ag_air=0;}
static float ag_noise(float x){float v=sinf(x*127.17f+3.13f)*43758.5453f;return v-floorf(v);}
/* One equipment bay per room, always on an ordinary solid wall. */
int astra_environment_bay(int room){
    float best=0;int selected=-1;
    for(int s=0;s<6;s++){
        side *face=&Segments[room].sides[s];int t=face->tmap_num;
        if(Segments[room].children[s]>=0||face->wall_num>=0||face->type!=SIDE_IS_QUAD||t<0||t>=NumTextures||astra_environment_rock(t)||TmapInfo[t].damage||TmapInfo[t].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD))continue;
        vms_vector c;vms_matrix b;float w,h;if(!ae_basis(room,s,&c,&b,&w,&h)||w<16||h<16||w>80||h>80)continue;
        float score=w*h;if(score>best){best=score;selected=s;}
    }return selected;
}
static int ag_exhibit(object *ship){
    if(astra_gallery_scene!=8||astra_gallery_room<0)return 0;
    vms_vector c;vms_matrix b;float w,h;
    if(!ae_basis(astra_gallery_room,astra_gallery_side,&c,&b,&w,&h))return 0;
    int id=-1;for(int i=0;i<N_robot_types;i++)if(!Robot_info[i].boss_flag&&!Robot_info[i].companion&&Polygon_models[Robot_info[i].model_num].rad<i2f(4)){id=i;break;}
    if(id<0)return 0;
    memset(ship,0,sizeof *ship);ship->type=OBJ_ROBOT;ship->id=id;ship->segnum=astra_gallery_room;ship->rtype.pobj_info.model_num=Robot_info[id].model_num;
    ship->size=Polygon_models[Robot_info[id].model_num].rad;ship->pos=c;
    float t=ae_clock(),r=f2fl(ship->size);
    vm_vec_scale_add2(&ship->pos,&b.rvec,fl2f(sinf(t*.48f)*fminf(w*.15f,3)));
    vm_vec_scale_add2(&ship->pos,&b.uvec,fl2f(cosf(t*.35f)*.65f));
    vm_vec_scale_add2(&ship->pos,&b.fvec,fl2f(r+1.2f+.4f*sinf(t*.7f)));
    vms_angvec a={fl2f(sinf(t*.25f)*.03f),fl2f(sinf(t*.4f)*.04f),fl2f(.5f+sinf(t*.2f)*.08f)};vms_matrix rot;
    vm_angles_2_matrix(&rot,&a);vm_matrix_x_matrix(&ship->orient,&b,&rot);return 1;
}
/* Soft hull/wing silhouettes projected toward the wall from the local key light.
 * Native orientation and wall clearance drive their motion and penumbra. */
static int ag_shadow_data(int room,int face,float *pos,float *axis,float *up){
    if(!astra_refinement)return 0;vms_vector center;vms_matrix b;float w,h;
    if(!ae_basis(room,face,&center,&b,&w,&h))return 0;
    object exhibit;int has_exhibit=ag_exhibit(&exhibit),count=0;
    int next=Segments[room].objects;
    for(int visited=0;visited<MAX_OBJECTS+1&&count<3;visited++){
        object *o;
        if(visited==0&&has_exhibit)o=&exhibit;
        else {if(astra_gallery_scene>=0||next<0||next>Highest_object_index)break;o=&Objects[next];next=o->next;}
        if(o->segnum!=room||(o->type!=OBJ_PLAYER&&o->type!=OBJ_ROBOT)||o->flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING)||
          (o->type==OBJ_ROBOT&&o->ctype.ai_info.CLOAKED)||o->render_type==RT_NONE&&o!=&exhibit)continue;
        vms_vector d;vm_vec_sub(&d,&o->pos,&center);float height=f2fl(vm_vec_dot(&d,&b.fvec)),r=f2fl(o->size);
        if(height<.1f||height>r*3.5f+3)continue;
        vms_vector projected=o->pos;vm_vec_scale_add2(&projected,&b.fvec,fl2f(-height));
        vm_vec_scale_add2(&projected,&b.rvec,fl2f(-height*.65f));vm_vec_scale_add2(&projected,&b.uvec,fl2f(-height*.80f));
        vms_vector right=o->orient.rvec;fix dot=vm_vec_dot(&right,&b.fvec);vm_vec_scale_add2(&right,&b.fvec,-dot);
        if(vm_vec_normalize(&right)<F1_0/10)right=b.rvec;
        vms_vector vertical;vm_vec_crossprod(&vertical,&b.fvec,&right);g3s_point p;g3_rotate_point(&p,&projected);
        int n=count*4;pos[n]=f2fl(p.p3_x);pos[n+1]=f2fl(p.p3_y);pos[n+2]=-f2fl(p.p3_z);pos[n+3]=r*(1+height*.045f);
        vms_vector rr,uu;g3_rotate_delta_vec(&rr,&right);g3_rotate_delta_vec(&uu,&vertical);
        axis[n]=f2fl(rr.x)/f2fl(Matrix_scale.x);axis[n+1]=f2fl(rr.y)/f2fl(Matrix_scale.y);axis[n+2]=-f2fl(rr.z)/f2fl(Matrix_scale.z);
        up[n]=f2fl(uu.x)/f2fl(Matrix_scale.x);up[n+1]=f2fl(uu.y)/f2fl(Matrix_scale.y);up[n+2]=-f2fl(uu.z)/f2fl(Matrix_scale.z);
        axis[n+3]=.12f+height*.055f;up[n+3]=.38f/(1+height*.085f);count++;
    }ag_shadows+=count;return count;
}
static void ag_triangle(const float *a,const float *b,const float *c){
    float u[3],v[3],n[3];for(int k=0;k<3;k++){u[k]=b[k]-a[k];v[k]=c[k]-a[k];}
    for(int k=0;k<3;k++)n[k]=u[(k+1)%3]*v[(k+2)%3]-u[(k+2)%3]*v[(k+1)%3];astra_unit(n);
    ax_vertex_add(a[0],a[1],a[2],n[0],n[1],n[2]);ax_vertex_add(b[0],b[1],b[2],n[0],n[1],n[2]);ax_vertex_add(c[0],c[1],c[2],n[0],n[1],n[2]);
}
static void ag_box(float x,float y,float z,float w,float h,float d){
    float p[8][3];for(int i=0;i<8;i++){p[i][0]=x+((i&1)?w:-w);p[i][1]=y+((i&2)?h:-h);p[i][2]=z+((i&4)?d:-d);}
    const int q[36]={0,2,3,0,3,1,4,5,7,4,7,6,0,4,6,0,6,2,1,3,7,1,7,5,0,1,5,0,5,4,2,6,7,2,7,3};
    for(int i=0;i<36;i+=3)ag_triangle(p[q[i]],p[q[i+1]],p[q[i+2]]);
}
static void ag_rock_flush(int material,const vms_vector *center,const vms_matrix *basis){
    static GLuint program,maps[256];static int failed;if(failed||material<=0||material>=256){ax_count=0;return;}
    if(!maps[material]){char name[24];snprintf(name,sizeof name,"m%03d.png",material-1);if(!refit_png(name,&maps[material],GL_REPEAT)){ax_count=0;return;}}
    if(!program){
        const char *vs="varying highp vec3 q,n,p,world;uniform mat3 axis,worldAxis;uniform vec3 origin,worldOrigin;void main(){q=gl_Vertex.xyz;p=axis*q+origin;world=worldAxis*q+worldOrigin;n=normalize(axis*gl_Normal);gl_Position=gl_ProjectionMatrix*vec4(p,1.);}";
        const char *fs="precision highp float;varying highp vec3 q,n,p,world;uniform sampler2D rock;uniform vec4 bulbs[3],colors[3],shot;void main(){vec3 N=normalize(n);vec3 c=texture2D(rock,q.xy*.13).rgb;"
          "float grit=sin(q.x*33.+sin(q.y*41.))*sin(q.y*27.);float close=1.-smoothstep(10.,45.,-p.z);c*=1.+grit*.045*close;"
          "float vein=1.-smoothstep(.012,.035,abs(sin(q.x*.8+sin(q.y*.6)*.6+sin(q.y*1.7)*.08)));c=mix(c,vec3(.32,.37,.35),vein*.42);"
          "float diffuse=max(0.,dot(N,normalize(vec3(-.5,.8,.7))));c*=.36+diffuse*.83;vec3 bounce=vec3(0.);"
          "for(int i=0;i<3;i++){float t=clamp(1.-distance(world,bulbs[i].xyz)/max(.001,bulbs[i].w),0.,1.)*step(.001,bulbs[i].w);bounce+=colors[i].rgb*t*t*(.58+.42*t);}"
          "vec3 D=shot.xyz-p;float sd=length(D);c+=c*bounce;c+=vec3(1.,.29,.085)*shot.w/(1.+sd*sd*.009)*c*.64*max(0.,dot(N,D/max(.01,sd)));gl_FragColor=vec4(c,1.);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){failed=1;ax_count=0;return;}
        program=glCreateProgram();glAttachShader(program,v);glAttachShader(program,f);glLinkProgram(program);glDeleteShader(v);glDeleteShader(f);
        GLint ok;glGetProgramiv(program,GL_LINK_STATUS,&ok);if(!ok){failed=1;ax_count=0;return;}
    }
    float axis[9];for(int k=0;k<3;k++){vms_vector a={0,0,0},r;if(k==0)a.x=F1_0;else if(k==1)a.y=F1_0;else a.z=F1_0;g3_rotate_delta_vec(&r,&a);axis[k*3]=f2fl(r.x);axis[k*3+1]=f2fl(r.y);axis[k*3+2]=-f2fl(r.z);}
    vms_vector zero={0};g3s_point p;g3_rotate_point(&p,&zero);GLboolean cull=glIsEnabled(GL_CULL_FACE);glDisable(GL_CULL_FACE);
    glUseProgram(program);glBindTexture(GL_TEXTURE_2D,maps[material]);glUniform1i(glGetUniformLocation(program,"rock"),0);glUniformMatrix3fv(glGetUniformLocation(program,"axis"),1,GL_FALSE,axis);
    glUniform3f(glGetUniformLocation(program,"origin"),f2fl(p.p3_x),f2fl(p.p3_y),-f2fl(p.p3_z));
    const float world[9]={f2fl(basis->rvec.x),f2fl(basis->rvec.y),f2fl(basis->rvec.z),f2fl(basis->uvec.x),f2fl(basis->uvec.y),f2fl(basis->uvec.z),f2fl(basis->fvec.x),f2fl(basis->fvec.y),f2fl(basis->fvec.z)};
    glUniformMatrix3fv(glGetUniformLocation(program,"worldAxis"),1,GL_FALSE,world);glUniform3f(glGetUniformLocation(program,"worldOrigin"),f2fl(center->x),f2fl(center->y),f2fl(center->z));
    const float dark[12]={0};
    glUniform4fv(glGetUniformLocation(program,"bulbs[0]"),3,astra_room_blast_count?&astra_blast_positions[0][0]:dark);glUniform4fv(glGetUniformLocation(program,"colors[0]"),3,astra_room_blast_count?&astra_blast_colors[0][0]:dark);
    glUniform4fv(glGetUniformLocation(program,"shot"),1,astra_flash);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_NORMAL_ARRAY);glVertexPointer(3,GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].p);glNormalPointer(GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].n);
    glDrawArrays(GL_TRIANGLES,0,ax_count);glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_NORMAL_ARRAY);glUseProgram(0);if(cull)glEnable(GL_CULL_FACE);ax_count=0;
}
static void ag_rock(int room,int face,float w,float h){
    ax_count=0;ax_energy=0;float seed=room*31+face*173;
    /* Continuous irregular plates follow the actual quadrilateral, including
     * skewed mine walls. Shared vertices avoid cracks; relief stays under .44. */
    int ids[4];get_side_verts(ids,room,face);vms_vector c;vms_matrix b;float ignored_w,ignored_h;
    ae_basis(room,face,&c,&b,&ignored_w,&ignored_h);float corners[4][2],grid[9][9][3];
    for(int i=0;i<4;i++){vms_vector delta;vm_vec_sub(&delta,&Vertices[ids[i]],&c);corners[i][0]=f2fl(vm_vec_dot(&delta,&b.rvec));corners[i][1]=f2fl(vm_vec_dot(&delta,&b.uvec));}
    for(int y=0;y<=8;y++)for(int x=0;x<=8;x++){
        float u=x/8.f,v=y/8.f;
        if(x&&x<8)u+=(ag_noise(seed+x+y*19)-.5f)*.065f;if(y&&y<8)v+=(ag_noise(seed+x*29+y)-.5f)*.065f;
        u=.012f+u*.976f;v=.012f+v*.976f;
        for(int k=0;k<2;k++)grid[y][x][k]=corners[0][k]*(1-u)*(1-v)+corners[1][k]*u*(1-v)+corners[2][k]*u*v+corners[3][k]*(1-u)*v;
        float edge=fminf(fminf(u,1-u),fminf(v,1-v)),weight=fminf(1,fmaxf(0,(edge-.16f)/.10f));weight=weight*weight*(3-2*weight);
        grid[y][x][2]=.018f+weight*(.10f+.31f*ag_noise(seed+x*3+y*37));
    }
    for(int y=0;y<8;y++)for(int x=0;x<8;x++){
        ag_triangle(grid[y][x],grid[y][x+1],grid[y+1][x+1]);ag_triangle(grid[y][x],grid[y+1][x+1],grid[y+1][x]);
    }
    const char *name=piggy_game_bitmap_name(&GameBitmaps[Textures[Segments[room].sides[face].tmap_num].index]);
    ag_rock_flush(name?astra_material_id(name):0,&c,&b);ag_rocks++;
}
static void ag_equipment(int room,int theme,float w,float h){
    float t=ae_clock(),x=0,y=-h*.13f;ax_count=0;ax_energy=0;
    if(theme==5){ /* Recessed cargo rack, individual strapped storage cassettes. */
        for(int s=-1;s<=1;s+=2){ax_paint(.11f,.15f,.18f,0);ag_box(x+s*3.4f,y,.22f,.10f,2.45f,.20f);}
        for(int row=0;row<2;row++)for(int col=0;col<3;col++){
            float X=x+(col-1)*2.15f,Y=y+(row-.5f)*2.2f;
            ax_paint(.17f+col*.025f,.21f+col*.015f,.22f,0);ag_box(X,Y,.40f,.94f,.86f,.36f);
            ax_paint(.055f,.075f,.085f,0);ag_box(X,Y,.79f,.78f,.68f,.04f);
            for(int s=-1;s<=1;s+=2){ax_paint(.38f,.31f,.16f,0);ag_box(X+s*.58f,Y,.86f,.05f,.78f,.035f);}
            ax_paint(.48f,.53f,.50f,0);ag_box(X,Y+.42f,.85f,.22f,.10f,.02f);
            ax_paint(.85f,.45f,.08f,.22f);ag_box(X+.65f,Y-.48f,.86f,.06f,.06f,.02f);
            ax_paint(.29f,.36f,.38f,0);
            ax_tube(X-.81f,Y-.70f,.83f,X-.81f,Y+.70f,.83f,.055f,.055f,5);ax_tube(X+.81f,Y-.70f,.83f,X+.81f,Y+.70f,.83f,.055f,.055f,5);
            ax_tube(X-.81f,Y+.70f,.83f,X+.81f,Y+.70f,.83f,.055f,.055f,5);ax_tube(X-.81f,Y-.70f,.83f,X+.81f,Y-.70f,.83f,.055f,.055f,5);
            for(int k=-1;k<=1;k++){ax_paint(.09f,.12f,.14f,0);ag_box(X,Y+k*.16f-.08f,.85f,.35f,.035f,.02f);}
            ax_paint(.46f,.50f,.50f,0);ax_tube(X-.17f,Y-.48f,.89f,X+.17f,Y-.48f,.89f,.035f,.035f,7);
            for(int sx=-1;sx<=1;sx+=2)for(int sy=-1;sy<=1;sy+=2){ax_paint(.45f,.48f,.46f,0);ax_tube(X+sx*.78f,Y+sy*.65f,.86f,X+sx*.78f,Y+sy*.65f,.89f,.045f,.045f,6);}
        }
    }else if(theme==2){ /* Coolant manifold with ceramic reservoirs and gauges. */
        for(int i=-1;i<=1;i++){
            float X=x+i*2.f;ax_paint(.21f,.30f,.34f,0);ax_tube(X,y-1.7f,.48f,X,y+1.6f,.48f,.50f,.50f,14);
            ax_paint(.42f,.50f,.52f,0);for(int k=-1;k<=1;k++)ax_tube(X,y+k*1.4f-.08f,.48f,X,y+k*1.4f+.08f,.48f,.57f,.57f,14);
            ax_paint(.025f,.13f,.18f,0);ag_box(X,y,.99f,.16f,1.15f,.035f);
            for(int k=0;k<9;k++){float fill=.35f+.20f*sinf(t*.8f+i);ax_paint(.06f,.48f,.62f,k/9.f<fill?.65f:.06f);ag_box(X,y-1.f+k*.24f,1.04f,.11f,.065f,.02f);}
        }
        ax_paint(.30f,.39f,.42f,0);ax_tube(x-3,y-2.12f,.38f,x+3,y-2.12f,.38f,.17f,.17f,10);
        for(int i=-1;i<=1;i++){
            float X=x+i*2.f;ax_paint(.30f,.39f,.42f,0);ax_tube(X,y-2.12f,.38f,X,y-1.7f,.48f,.13f,.13f,9);
            ax_paint(.40f,.48f,.50f,0);ax_ring(X,y+2.f,.40f,.24f,.035f,0,6.2832f,0);
            ax_paint(.035f,.08f,.10f,0);ax_tube(X,y+2.f,.36f,X,y+2.f,.40f,.21f,.21f,16);
            float angle=t*.6f+i;ax_paint(.30f,.83f,.88f,.35f);ax_tube(X,y+2.f,.445f,X+cosf(angle)*.16f,y+2.f+sinf(angle)*.16f,.445f,.012f,.012f,5);
        }
        ax_paint(.10f,.55f,.68f,.35f);ax_tube(x-2.6f,y+2,.22f,x+2.6f,y+2,.22f,.035f,.035f,6);
    }else if(theme==3){ /* Reactor service bus: copper coils and warning strips. */
        for(int i=-2;i<=2;i++){
            float X=x+i*1.2f;ax_paint(.075f,.11f,.14f,0);ag_box(X,y,.30f,.43f,1.7f,.28f);
            for(int k=0;k<8;k++){ax_paint(.45f,.25f,.10f,0);ax_tube(X-.36f,y-1.4f+k*.39f,.65f,X+.36f,y-1.4f+k*.39f,.65f,.07f,.07f,7);}
            ax_paint(.85f,.28f,.045f,.30f+.13f*sinf(t*1.7f+i));ag_box(X,y+1.9f,.20f,.24f,.06f,.05f);
        }
    }else { /* Maintenance cabinets retain the corridor's clear travel area. */
        for(int i=-1;i<=1;i++){
            float X=x+i*1.7f;ax_paint(.12f,.18f,.21f,0);ag_box(X,y,.25f,.73f,1.6f,.21f);
            ax_paint(.28f,.35f,.37f,0);ag_box(X,y,.48f,.64f,1.45f,.035f);
            ax_paint(.045f,.065f,.08f,0);for(int k=0;k<7;k++)ag_box(X,y+.48f+k*.11f,.525f,.44f,.023f,.018f);
            ax_paint(.40f,.48f,.50f,0);ax_tube(X+.40f,y-.65f,.57f,X+.40f,y-.10f,.57f,.04f,.04f,7);
        }
    }
    ax_flush(1,1);ag_props++;
}
static void ag_face(int room,int face,int theme,float w,float h){
    if(!astra_refinement||ag_faces>=22)return;ag_faces++;
    if(astra_environment_rock(Segments[room].sides[face].tmap_num)){ag_rock(room,face,w,h);return;}
    if(astra_environment_bay(room)==face)ag_equipment(room,theme,w,h);
}
static void ag_atmosphere(int room,int face,int theme,float w,float h){
    if(!astra_refinement||ag_air>=4||astra_environment_bay(room)!=face)return;
    float t=ae_clock();ax_count=0;
    /* Narrow backlit dust column, with a sparse population instead of fog. */
    for(int j=0;j<24;j++){
        float seed=room*19+j*11,phase=fmodf(t*.045f+ag_noise(seed),1.f);
        float x=(ag_noise(seed+1)-.5f)*3.f,y=h*.30f-phase*5,z=.5f+ag_noise(seed+2)*2;
        ax_paint(.46f,.66f,.72f,0);af_particle(x,y,z,.012f+.017f*ag_noise(seed+4),.13f*sinf(phase*3.14159f),seed);
    }
    if(theme==2||theme==3){
        float cycle=fmodf(t*.18f+room*.31f,1.f);
        for(int j=0;j<9;j++){
            float p=fmodf(cycle+j*.071f,1.f),fade=sinf(p*3.14159f);
            ax_paint(.38f,.57f,.62f,0);af_particle(2.7f+sinf(p*7+room)*.12f,-h*.13f-2.1f+p*1.8f,.5f+p*2.2f,.13f+p*.45f,.045f*fade,room+j+p);
        }
    }
    for(int j=0;j<8;j++){ax_paint(.18f,.39f,.46f,0);af_particle(0,h*.30f-j*.28f,.4f+j*.20f,.28f+j*.07f,.012f,room+j);}
    ae_haze_flush();ag_air++;
}
static void ag_render_exhibit(void){
    object o;if(!ag_exhibit(&o))return;
    g3_start_instance_matrix(&o.pos,&o.orient);int saved=astra_robot_id;astra_robot_id=o.id;
    g3s_lrgb light={F1_0,F1_0,F1_0};astra_draw_robot(o.rtype.pobj_info.model_num,&Polygon_models[o.rtype.pobj_info.model_num],NULL,light);
    astra_robot_id=saved;g3_done_instance();
}
