/* Render-only excavation shell. Shared existing rock textures, bounded relief,
 * deterministic detail and no new mission objects or texture downloads. */
static int gm_draws,gm_supports,gm_machines,gm_dust;
static GLuint gm_program,gm_textures[3],gm_details[3];static int gm_failed;
static const int gm_materials[3]={21,23,38};
static void gm_corner(int room,int face,float corners[4][3],vms_vector *center,vms_matrix *basis,float *w,float *h){
    int ids[4];get_side_verts(ids,room,face);ae_basis(room,face,center,basis,w,h);
    for(int i=0;i<4;i++){vms_vector d;vm_vec_sub(&d,&Vertices[ids[i]],center);corners[i][0]=f2fl(vm_vec_dot(&d,&basis->rvec));corners[i][1]=f2fl(vm_vec_dot(&d,&basis->uvec));corners[i][2]=f2fl(vm_vec_dot(&d,&basis->fvec));}
}
static void gm_at(float c[4][3],float u,float v,float z,float *p){
    for(int k=0;k<3;k++)p[k]=c[0][k]*(1-u)*(1-v)+c[1][k]*u*(1-v)+c[2][k]*u*v+c[3][k]*(1-u)*v;
    p[2]+=z;
}
static void gm_beam(float c[4][3],float u,float v,float U,float V,float z,float radius){
    float p[3],q[3];gm_at(c,u,v,z,p);gm_at(c,U,V,z,q);ax_tube(p[0],p[1],p[2],q[0],q[1],q[2],radius,radius,6);
}
static void gm_rock_shader(int room,int face,const vms_vector *center,const vms_matrix *basis,float w,float h){
    if(gm_failed){ax_count=0;return;}int variant=gm_variant[room];
    if(!gm_textures[variant]){char name[24];snprintf(name,sizeof name,"m%03d.png",gm_materials[variant]-1);if(!refit_png(name,&gm_textures[variant],GL_REPEAT)){ax_count=0;return;}snprintf(name,sizeof name,"n%03d.png",gm_materials[variant]-1);refit_png(name,&gm_details[variant],GL_REPEAT);}
    if(!gm_program){
        const char *vs="varying highp vec3 q,n,p,world;uniform mat3 axis,worldAxis;uniform vec3 origin,worldOrigin;void main(){q=gl_Vertex.xyz;p=axis*q+origin;world=worldAxis*q+worldOrigin;n=normalize(axis*gl_Normal);gl_Position=gl_ProjectionMatrix*vec4(p,1.);}";
        const char *fs="precision highp float;varying highp vec3 q,n,p,world;uniform sampler2D rock,detail;uniform vec4 bulbs[3],colors[3],shot,lamp,marks[6];uniform vec3 roomLight;uniform vec4 geology;uniform mat3 axis;"
          "float hash(vec2 a){return fract(sin(dot(a,vec2(127.1,311.7)))*43758.5453);}"
          "float noise(vec2 a){vec2 i=floor(a),f=fract(a);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}"
          "float strata(vec2 a){float large=noise(a*.31),fine=noise(a*3.4);return noise(a*1.2+large)*.65+fine*.20+sin(a.y*3.7+large*4.+a.x*.20)*.15;}"
          "void main(){vec2 a=q.xy;float close=1.-smoothstep(30.,100.,-p.z);float s=strata(a);float e=.035;vec2 slope=vec2(strata(a+vec2(e,0.))-strata(a-vec2(e,0.)),strata(a+vec2(0.,e))-strata(a-vec2(0.,e)))/(2.*e);"
          "vec2 rockN=(texture2D(detail,a*.105+geology.x*.17).xy*2.-1.)*1.25;vec3 N=normalize(n+normalize(axis[0])*(slope.x*.55*close+rockN.x)+normalize(axis[1])*(slope.y*.55*close+rockN.y));vec3 V=normalize(-p);if(dot(N,V)<0.)N=-N;"
          "vec3 art=texture2D(rock,a*.105+geology.x*.17).rgb;vec3 other=texture2D(rock,a*.247+vec2(.37,.71)).rgb;vec3 c=mix(art,other,.24);"
          "vec3 tint=mix(vec3(.57,.63,.67),vec3(.69,.54,.38),step(.5,geology.x));tint=mix(tint,vec3(.48,.61,.58),step(1.5,geology.x));c=mix(c,tint*.55,.30);"
          "float layers=.65+.35*smoothstep(-.7,.7,sin(a.y*2.8+noise(a*.32)*4.+a.x*.19));c*=.64+layers*.44+s*.20;"
          "float vein=1.-smoothstep(.005,.022,abs(noise(a*.65+noise(a*.17)*2.)-.52));float hair=1.-smoothstep(.006,.027,abs(noise(a*2.1)-.48));"
          "c=mix(c,tint*.9,vein*.20);c*=1.-hair*.24*close;float wet=smoothstep(.63,.86,noise(a*.23+vec2(0.,a.y*.5)));c*=1.-wet*.16;"
          "float grit=noise(a*41.);c*=1.+(grit-.5)*.15*close;float tool=pow(max(0.,sin(a.x*6.2+a.y*.35)),20.)*smoothstep(.42,.64,noise(a*.19));c*=1.-tool*.12*close;"
          "vec3 L=normalize(vec3(-.45,.7,.8));float ndl=max(0.,dot(N,L));vec3 col=c*(roomLight*(.43+.75*ndl));"
          "vec3 dl=lamp.xyz-p;float ld=length(dl);col+=c*vec3(.8,.68,.49)*max(0.,dot(N,dl/max(.01,ld)))*lamp.w/(1.+ld*ld*.0018);"
          "vec2 lampPoint=vec2(0.,geology.w*.31);float work=exp(-length((a-lampPoint)/vec2(4.,5.))*.65)*geology.z;col+=c*vec3(.92,.61,.26)*work*.75;"
          "col+=vec3(.45,.55,.57)*pow(max(0.,dot(N,normalize(V+L))),mix(18.,70.,wet))*(.025+.08*wet);"
          "for(int i=0;i<3;i++){float t=clamp(1.-distance(world,bulbs[i].xyz)/max(.001,bulbs[i].w),0.,1.)*step(.001,bulbs[i].w);col+=c*colors[i].rgb*t*t*(.58+.42*t);}"
          "vec3 D=shot.xyz-p;float sd=length(D);col+=vec3(1.,.29,.085)*shot.w/(1.+sd*sd*.009)*c*.64*max(0.,dot(N,D/max(.01,sd)));"
          "float scar=0.;for(int i=0;i<6;i++){float r=length(q.xy-marks[i].xy)/max(.001,marks[i].w);scar=max(scar,(1.-smoothstep(.18,.95+sin(a.x*13.+a.y*17.)*.07,r))*step(.01,marks[i].w));}col*=1.-scar*.67;"
          "float edge=min(geology.y*.5-abs(a.x),geology.w*.5-abs(a.y));col*=.75+.25*smoothstep(0.,.65,edge);gl_FragColor=vec4(col,1.);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){gm_failed=1;ax_count=0;return;}
        gm_program=glCreateProgram();glAttachShader(gm_program,v);glAttachShader(gm_program,f);glLinkProgram(gm_program);glDeleteShader(v);glDeleteShader(f);GLint ok;glGetProgramiv(gm_program,GL_LINK_STATUS,&ok);if(!ok){gm_failed=1;ax_count=0;fprintf(stderr,"Astra geology shader link failed\n");return;}
    }
    float axis[9];for(int k=0;k<3;k++){vms_vector a={0,0,0},r;if(k==0)a.x=F1_0;else if(k==1)a.y=F1_0;else a.z=F1_0;g3_rotate_delta_vec(&r,&a);axis[k*3]=f2fl(r.x);axis[k*3+1]=f2fl(r.y);axis[k*3+2]=-f2fl(r.z);}
    vms_vector zero={0};g3s_point p;g3_rotate_point(&p,&zero);GLboolean cull=glIsEnabled(GL_CULL_FACE);glDisable(GL_CULL_FACE);glUseProgram(gm_program);
    glActiveTexture(GL_TEXTURE1);glBindTexture(GL_TEXTURE_2D,gm_details[variant]);glUniform1i(glGetUniformLocation(gm_program,"detail"),1);
    glActiveTexture(GL_TEXTURE0);glBindTexture(GL_TEXTURE_2D,gm_textures[variant]);glUniform1i(glGetUniformLocation(gm_program,"rock"),0);glUniformMatrix3fv(glGetUniformLocation(gm_program,"axis"),1,GL_FALSE,axis);
    glUniform3f(glGetUniformLocation(gm_program,"origin"),f2fl(p.p3_x),f2fl(p.p3_y),-f2fl(p.p3_z));
    const float world[9]={f2fl(basis->rvec.x),f2fl(basis->rvec.y),f2fl(basis->rvec.z),f2fl(basis->uvec.x),f2fl(basis->uvec.y),f2fl(basis->uvec.z),f2fl(basis->fvec.x),f2fl(basis->fvec.y),f2fl(basis->fvec.z)};
    glUniformMatrix3fv(glGetUniformLocation(gm_program,"worldAxis"),1,GL_FALSE,world);glUniform3f(glGetUniformLocation(gm_program,"worldOrigin"),f2fl(center->x),f2fl(center->y),f2fl(center->z));
    const float dark[12]={0};glUniform4fv(glGetUniformLocation(gm_program,"bulbs[0]"),3,astra_room_blast_count?&astra_blast_positions[0][0]:dark);glUniform4fv(glGetUniformLocation(gm_program,"colors[0]"),3,astra_room_blast_count?&astra_blast_colors[0][0]:dark);
    glUniform4fv(glGetUniformLocation(gm_program,"shot"),1,astra_flash);glUniform4fv(glGetUniformLocation(gm_program,"lamp"),1,astra_lamp);
    float light=0;for(int i=0;i<4;i++)light+=f2fl(Segments[room].sides[face].uvls[i].l)*.25f;light=fminf(1.2f,fmaxf(.38f,light));
    glUniform3f(glGetUniformLocation(gm_program,"roomLight"),light*.94f,light,light*1.03f);glUniform4f(glGetUniformLocation(gm_program,"geology"),variant,w,!(Light_subtracted[room]&(1<<face)),h);
    float marks[24]={0};int count=0;
    for(int i=AE_MARKS-1;i>=0&&count<6;i--){ae_mark *m=&ae_marks[i];float age=(double)(GameTime64-m->born)/F1_0;if(!m->born||m->room!=room||m->side!=face||age<0||age>180)continue;
        vms_vector d;vm_vec_sub(&d,&m->p,center);marks[count*4]=f2fl(vm_vec_dot(&d,&basis->rvec));marks[count*4+1]=f2fl(vm_vec_dot(&d,&basis->uvec));marks[count*4+3]=m->size*(1-fmaxf(0,age-150)/30);count++;
    }glUniform4fv(glGetUniformLocation(gm_program,"marks[0]"),6,marks);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_NORMAL_ARRAY);glVertexPointer(3,GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].p);glNormalPointer(GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].n);glDrawArrays(GL_TRIANGLES,0,ax_count);
    glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_NORMAL_ARRAY);glUseProgram(0);if(cull)glEnable(GL_CULL_FACE);ax_count=0;
}
static void gm_rock(int room,int face,float w,float h){
    float c[4][3];vms_vector center;vms_matrix b;gm_corner(room,face,c,&center,&b,&w,&h);
    g3s_point view;vms_vector zero={0};g3_rotate_point(&view,&zero);float distance=f2fl(view.p3_z);
    int steps=distance<45?12:distance<85?8:4;float grid[13][13][3];ax_count=ax_energy=0;
    unsigned seed=gm_hash(room*173u+face*31u+Current_level_num*13u);
    for(int y=0;y<=steps;y++)for(int x=0;x<=steps;x++){
        float u=x/(float)steps,v=y/(float)steps;
        float edge=fminf(fminf(u,1-u),fminf(v,1-v));float fade=fminf(1,edge*12);fade=fade*fade*(3-2*fade);
        float ridge=.5f+.5f*sinf(u*15+v*4+(seed%211));float noise=ag_noise((seed%1000)+u*71+v*39);
        /* Max .39 units: below existing .40-unit surface trim, tapering to zero
         * at shared boundaries. Original collision and flight clearance stay. */
        float z=.008f+fade*(.07f+.16f*ridge+.15f*noise);
        gm_at(c,u,v,z,grid[y][x]);
    }
    for(int y=0;y<steps;y++)for(int x=0;x<steps;x++){ag_triangle(grid[y][x],grid[y][x+1],grid[y+1][x+1]);ag_triangle(grid[y][x],grid[y+1][x+1],grid[y+1][x]);}
    gm_rock_shader(room,face,&center,&b,w,h);gm_draws++;
}
static void gm_structure(int room,int face,float w,float h){
    float c[4][3];vms_vector center;vms_matrix b;gm_corner(room,face,c,&center,&b,&w,&h);ax_count=ax_energy=0;
    float inset=fminf(.065f,.9f/fminf(w,h));
    /* Bolted retaining ribs follow the actual corners, including skewed walls. */
    for(int edge=0;edge<2;edge++){
        float u=edge?1-inset:inset;ax_paint(.16f,.19f,.19f,0);gm_beam(c,u,.018f,u,.982f,.22f,.16f);
        ax_paint(.36f,.36f,.31f,0);gm_beam(c,u-.008f,.02f,u-.008f,.98f,.37f,.055f);gm_beam(c,u+.008f,.02f,u+.008f,.98f,.37f,.055f);
        for(int j=0;j<5;j++){float v=.10f+j*.20f,p[3];gm_at(c,u,v,.24f,p);
            ax_paint(.28f,.25f,.19f,0);ag_box(p[0],p[1],p[2],.30f,.23f,.045f);
            ax_paint(.57f,.56f,.46f,0);ax_tube(p[0],p[1],p[2]+.04f,p[0],p[1],p[2]+.13f,.085f,.085f,6);
        }
    }
    ax_paint(.20f,.23f,.22f,0);gm_beam(c,inset,.045f,1-inset,.045f,.25f,.13f);gm_beam(c,inset,.955f,1-inset,.955f,.25f,.13f);
    /* Steel transition strips and close-spaced anchors frame the exposed stone. */
    if(gm_faces[room][face]==2){ax_paint(.26f,.29f,.29f,0);for(int s=0;s<2;s++)gm_beam(c,.10f,s?.88f:.12f,.90f,s?.88f:.12f,.27f,.11f);}
    /* A restrained retention mesh sits near one damaged edge of selected faces. */
    if((room+face)%3==0){ax_paint(.23f,.25f,.23f,0);for(int i=0;i<8;i++){float v=.12f+i*.035f;gm_beam(c,.10f,v,.31f,v+.18f,.39f,.014f);gm_beam(c,.10f,v+.18f,.31f,v,.39f,.014f);}}
    /* Paired service conduits, retaining clips and a caged work light. */
    for(int i=0;i<2;i++){
        ax_paint(i?.25f:.13f,i?.26f:.17f,i?.21f:.19f,0);gm_beam(c,.14f,.82f+i*.025f,.86f,.82f+i*.025f,.31f,.065f);
        for(int j=0;j<4;j++){float p[3];gm_at(c,.18f+j*.20f,.833f,.35f,p);ax_paint(.46f,.42f,.31f,0);ag_box(p[0],p[1],p[2],.055f,h*.025f,.025f);}
    }
    float p[3];gm_at(c,.5f,.81f,.24f,p);ax_paint(.08f,.10f,.10f,0);ag_box(p[0],p[1],p[2],1.05f,.26f,.12f);
    ax_paint(.94f,.65f,.25f,(Light_subtracted[room]&(1<<face))?0:.62f);ag_box(p[0],p[1],p[2]+.13f,.89f,.12f,.025f);
    ax_paint(.29f,.30f,.27f,0);for(int i=-3;i<=3;i++)ax_tube(p[0]+i*.27f,p[1]-.20f,p[2]+.17f,p[0]+i*.27f,p[1]+.20f,p[2]+.17f,.026f,.026f,5);
    /* Small mineral chips at the perimeter, clear of doors and passageways. */
    for(int i=0;i<7;i++){float U=.13f+i*.11f,V=.065f+.016f*ag_noise(room+i*9);gm_at(c,U,V,.08f,p);
        ax_paint(.24f+i*.008f,.25f+i*.006f,.22f+i*.005f,0);ax_tube(p[0],p[1],p[2],p[0]+.09f,p[1]+.13f,p[2]+.16f,.12f+.08f*ag_noise(i+room),.045f,5);
    }
    ax_flush(1,1);gm_supports++;
}
static void gm_equipment(int room,int face,float w,float h){
    if(astra_excavation_bay(room)!=face)return;
    ax_count=ax_energy=0;float t=ae_clock(),y=-h*.14f;int kind=room%3;
    /* Thin wall-mounted extraction installations fit within old equipment depth. */
    ax_paint(.095f,.12f,.12f,0);ag_box(0,y,.22f,4.1f,2.55f,.20f);
    ax_paint(.34f,.30f,.21f,0);for(int s=-1;s<=1;s+=2){ag_box(s*3.95f,y,.46f,.13f,2.45f,.08f);ag_box(0,y+s*2.40f,.46f,4,.11f,.08f);}
    if(kind==0){ /* Ore conveyor: moving cleats and individually tumbling fragments. */
        ax_paint(.045f,.057f,.052f,0);ag_box(0,y,.46f,3.65f,1.38f,.03f);
        for(int j=0;j<14;j++){float x=-3.5f+fmodf(j*.52f+t*.55f,7.f);ax_paint(.25f,.29f,.26f,0);ag_box(x,y,.52f,.036f,1.28f,.026f);}
        for(int i=0;i<12;i++){float x=-3.2f+fmodf(i*.57f+t*.55f,6.4f),Y=y+(ag_noise(room+i)-.5f)*1.8f;
            ax_paint(.36f,.29f+.07f*ag_noise(i),.19f,0);ax_tube(x,Y,.55f,x+.14f,Y+.08f,.79f,.22f,.11f,5);}
        for(int s=-1;s<=1;s+=2){ax_paint(.43f,.40f,.26f,0);ax_tube(-3.7f,y+s*1.5f,.67f,3.7f,y+s*1.5f,.67f,.07f,.07f,7);}
        ax_paint(.21f,.26f,.25f,0);ax_tube(-3.6f,y-1.34f,.63f,-3.6f,y+1.34f,.63f,.16f,.16f,10);
    }else if(kind==1){ /* Extraction manifold with pressure gauges and flexible lines. */
        for(int i=-1;i<=1;i++){
            float x=i*2.25f;ax_paint(.26f,.29f,.28f,0);ax_tube(x,y-1.6f,.50f,x,y+1.45f,.50f,.25f,.25f,10);
            for(int j=-2;j<=2;j++){ax_paint(.43f,.40f,.30f,0);ax_tube(x,y+j*.6f-.07f,.50f,x,y+j*.6f+.07f,.50f,.34f,.34f,10);}
            ax_paint(.065f,.09f,.09f,0);ax_tube(x,y+.65f,.78f,x,y+.65f,.88f,.30f,.30f,16);
            ax_paint(.72f,.69f,.49f,.12f);ax_ring(x,y+.65f,.90f,.30f,.025f,0,6.2832f,0);
            float angle=1.2f+sinf(t*.35f+i)*.3f;ax_tube(x,y+.65f,.92f,x+cosf(angle)*.23f,y+.65f+sinf(angle)*.23f,.92f,.017f,.017f,5);
        }
        ax_paint(.29f,.33f,.31f,0);ax_tube(-3.55f,y-1.85f,.46f,3.55f,y-1.85f,.46f,.17f,.17f,10);
    }else{ /* Twin ventilation rotors behind a fixed guard. */
        for(int side=-1;side<=1;side+=2){float x=side*1.9f;
            ax_paint(.20f,.24f,.23f,0);ax_ring(x,y,.51f,1.43f,.10f,0,6.2832f,0);
            for(int i=0;i<6;i++){float a=t*.85f*side+i*1.0472f;float p[3]={x+cosf(a)*.25f,y+sinf(a)*.25f,.55f},q[3]={x+cosf(a+.35f)*1.28f,y+sinf(a+.35f)*1.28f,.55f},r[3]={x+cosf(a+.60f)*1.20f,y+sinf(a+.60f)*1.20f,.59f};ax_paint(.38f,.40f,.34f,0);ag_triangle(p,q,r);}
            ax_paint(.52f,.44f,.25f,0);ax_tube(x,y,.48f,x,y,.69f,.21f,.16f,10);
            ax_paint(.18f,.20f,.19f,0);for(int i=-3;i<=3;i++){float d=i*.34f,len=sqrtf(1.36f*1.36f-d*d);ax_tube(x-len,y+d,.76f,x+len,y+d,.76f,.023f,.023f,5);}
        }
    }
    for(int i=-3;i<=3;i++){ax_paint(i%2?.12f:.68f,i%2?.13f:.47f,i%2?.11f:.15f,0);ag_box(i*.72f,y-2.12f,.52f,.30f,.09f,.025f);}
    ax_paint(.25f,.64f,.39f,.32f);ag_box(3.55f,y+2.05f,.55f,.08f,.08f,.025f);ax_flush(1,1);gm_machines++;
}
static void gm_atmosphere(int room,int face,float w,float h){
    if(gm_dust>=4)return;float t=ae_clock();ax_count=0;
    extern fix Seismic_tremor_magnitude;float tremor=fminf(1,fabsf(f2fl(Seismic_tremor_magnitude))*5);
    if(astra_gallery_scene==18)tremor=fmaxf(0,1-fabsf(fmodf(t,9)-3)/1.25f)*.65f;
    for(int i=0;i<18;i++){float seed=room*19+i*17,phase=fmodf(t*(.035f+tremor*.12f)+ag_noise(seed),1.f);
        float x=(ag_noise(seed+1)-.5f)*w*.65f,y=h*.35f-phase*(3+tremor*3),z=.50f+ag_noise(seed+2)*1.2f;
        ax_paint(.68f,.53f,.31f,0);af_particle(x,y,z,.013f+.018f*ag_noise(seed+3),(.15f+.12f*tremor)*sinf(phase*3.14159f),seed);
    }
    if(room%3==1&&astra_excavation_bay(room)==face)for(int i=0;i<5;i++){float phase=fmodf(t*.20f+i*.16f,1.f);ax_paint(.38f,.46f,.44f,0);af_particle(3.45f+phase*.18f,-h*.14f-1.8f+phase*.8f,.6f+phase*.7f,.10f+phase*.24f,.027f*sinf(phase*3.14159f),i+room);}
    ae_haze_flush();gm_dust++;
}
