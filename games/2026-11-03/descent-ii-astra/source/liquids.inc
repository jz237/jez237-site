extern int framecount;
static int ah_frame=-1,ah_count;static float ah_regions[4][4];
static void ah_lava(int count,const g3s_point **view){
    if(ah_frame!=framecount){ah_frame=framecount;ah_count=0;}if(!astra_detail_upgrade||ah_count>=4)return;
    float low[2]={1,1},high[2]={0,0};for(int i=0;i<count;i++){g3s_point p=*view[i];if(p.p3_z<i2f(2)||p.p3_z>i2f(80))return;g3_project_point(&p);float x=f2fl(p.p3_sx)/grd_curcanv->cv_bitmap.bm_w,y=1-f2fl(p.p3_sy)/grd_curcanv->cv_bitmap.bm_h;low[0]=fminf(low[0],x);low[1]=fminf(low[1],y);high[0]=fmaxf(high[0],x);high[1]=fmaxf(high[1],y);}
    float *r=ah_regions[ah_count++];r[0]=(low[0]+high[0])*.5f;r[1]=(low[1]+high[1])*.5f;r[2]=fminf(.2f,(high[0]-low[0])*.18f);r[3]=fminf(.16f,(high[1]-low[1])*.18f);
}
static const char *astra_liquid_fragment=
"precision highp float;\n"
"varying highp vec3 world,pos;\n"
"varying highp vec2 uv;\n"
"varying mediump vec4 light;\n"
"uniform sampler2D baseMap,overlayMap,env0,env1,env2,env3,env4,env5;\n"
"uniform float clock,kind,overlay,turn,cascade;uniform vec2 downhill;\n"
"uniform vec3 eye,normal,tangent,bitangent;\n"
"uniform vec4 shore[4],planes[6],origins[6],pu[6],pv[6],texuv[6],texduv[6],rect[6],tints[6];\n"
"uniform vec4 lamps[3],lampColors[3];\n"
"float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\n"
"vec2 hash2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}\n"
"float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}\n"
"float fbm(vec2 p){return noise(p)*.57+noise(p*2.03+7.1)*.28+noise(p*4.11-3.7)*.15;}\n"
"vec4 envSample(int i,vec2 q){\n"
" if(i==0)return texture2D(env0,q);if(i==1)return texture2D(env1,q);if(i==2)return texture2D(env2,q);\n"
" if(i==3)return texture2D(env3,q);if(i==4)return texture2D(env4,q);return texture2D(env5,q);\n"
"}\n"
"vec3 reflectedRoom(vec3 ray){\n"
" float best=1000.;vec2 coord=vec2(0.);int hit=-1;\n"
" for(int i=0;i<6;i++){\n"
"  if(origins[i].w<.5)continue;\n"
"  float denominator=dot(planes[i].xyz,ray);\n"
"  if(abs(denominator)<.0001)continue;\n"
"  float distance=-(dot(planes[i].xyz,world)+planes[i].w)/denominator;\n"
"  if(distance<.06||distance>=best)continue;\n"
"  vec3 delta=world+ray*distance-origins[i].xyz;\n"
"  vec2 p=vec2(dot(delta,pu[i].xyz),dot(delta,pv[i].xyz));\n"
"  if(min(p.x,p.y)<-.005||max(p.x,p.y)>1.005)continue;\n"
"  coord=texuv[i].xy+p.x*texuv[i].zw+p.y*texduv[i].xy;hit=i;best=distance;\n"
" }\n"
" vec3 col=vec3(.022,.042,.047);\n"
" // Constant sampler indexing is supported by WebGL 1 / older GPUs.\n"
" for(int i=0;i<6;i++)if(i==hit){\n"
"  vec2 q=coord;if(rect[i].z>0.)q=(fract(q)-rect[i].xy)/rect[i].zw;\n"
"  vec4 c=envSample(i,q);col=mix(col,c.rgb*tints[i].rgb*pu[i].w,smoothstep(.005,.08,c.a));\n"
" }\n"
" return col;\n"
"}\n"
"vec3 wave(vec2 q,float time){\n"
" // Analytic derivatives keep the normals stable without extra textures.\n"
" vec2 d0=normalize(vec2(1.,.37)),d1=normalize(vec2(-.42,1.)),d2=normalize(vec2(.73,.81));\n"
" float a=dot(q,d0)*2.6-time*.85,b=dot(q,d1)*5.8+time*1.13,c=dot(q,d2)*12.2-time*1.55;\n"
" float h=sin(a)*.32+sin(b)*.12+sin(c)*.034;\n"
" vec2 slope=cos(a)*d0*.16+cos(b)*d1*.105+cos(c)*d2*.055;\n"
" float fine=dot(q,vec2(23.,-17.))+sin(a)*.5+time*1.8;\n"
" slope+=cos(fine)*vec2(.026,-.02);\n"
" return vec3(slope,h);\n"
"}\n"
"// Two nearest moving cells make deep fissures between broad solid plates.\n"
"vec3 crust(vec2 q){\n"
" vec2 cell=floor(q),f=fract(q);float first=9.,second=9.,tag=0.;\n"
" for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){\n"
"  vec2 id=cell+vec2(float(x),float(y));vec2 rnd=hash2(id);\n"
"  vec2 point=vec2(float(x),float(y))+.5+.31*sin(rnd*6.283+clock*.11)-f;\n"
"  float d=dot(point,point);\n"
"  if(d<first){second=first;first=d;tag=hash(id+29.);}else second=min(second,d);\n"
" }\n"
" return vec3(sqrt(second)-sqrt(first),first,tag);\n"
"}\n"
"void main(){\n"
" vec4 native=texture2D(baseMap,uv);if(native.a<.035)discard;\n"
" vec3 V=normalize(eye-world),N=normal*sign(dot(normal,V));\n"
" vec2 q=vec2(dot(world,tangent),dot(world,bitangent));\n"
" float edge=10000.;for(int i=0;i<4;i++)edge=min(edge,dot(shore[i].xyz,world)+shore[i].w);\n"
" edge=max(0.,edge-(noise(q*.85)-.5)*.55);float room=clamp(dot(light.rgb,vec3(.21,.72,.07)),.12,1.1);\n"
" vec3 col;float exponent=74.,specular=.65;\n"
" if(kind<1.5){\n"
"  vec2 flow=q*.36+mix(vec2(clock*.034,-clock*.021),-downhill*clock*.72,cascade);\n"
"  vec3 swell=wave(q*.075,clock*.48),ripple=wave(flow+swell.xy*.8,clock);\n"
"  vec3 w=vec3(swell.xy*.70+ripple.xy*.62,swell.z*.60+ripple.z*.40);\n"
"  N=normalize(N-tangent*w.x-bitangent*w.y);\n"
"  float fresnel=.035+.80*pow(1.-max(0.,dot(N,V)),4.5);\n"
"  vec3 reflected=reflectedRoom(reflect(-V,N));\n"
"  // Turbidity and layered refracted mineral detail read as water depth.\n"
"  vec2 refracted=flow+w.xy*.37;float bottom=fbm(refracted*2.5);\n"
"  float shallow=max(exp(-max(0.,edge)*.32),.22+.25*fbm(flow*.38));\n"
"  vec3 deep=vec3(.024,.125,.15),near=vec3(.12,.27,.23);\n"
"  col=mix(deep,near,shallow*.75)*(room*.48+.57);\n"
"  col+=vec3(.045,.085,.069)*(bottom-.30)*shallow;\n"
"  float caustic=pow(1.-abs(sin(refracted.x*6.1+sin(refracted.y*4.7))*.55+sin(refracted.y*6.6-clock*.25)*.45),12.);\n"
"  col+=vec3(.11,.22,.18)*caustic*shallow*.20;\n"
"  col=mix(col,reflected,fresnel);\n"
"  // Broad, dim cabin fill makes individual wave slopes readable in rooms\n"
"  // whose walls are themselves mostly water, without painting on a sky.\n"
"  vec3 fill=normalize(normal*sign(dot(normal,V))+tangent*.35+bitangent*.65);\n"
"  float sheen=pow(max(0.,dot(N,normalize(V+fill))),42.);\n"
"  col+=vec3(.22,.33,.35)*sheen*(.32+.28*room);\n"
"  float crest=smoothstep(.34,.47,w.z)*smoothstep(.62,.85,fbm(flow*5.));\n"
"  float wash=(.5+.5*sin(edge*5.-clock*1.5+fbm(flow*3.)*5.));\n"
"  float foam=exp(-max(0.,edge)*1.55)*smoothstep(.35,.75,noise(flow*18.+w.xy))*wash;\n"
"  col=mix(col,vec3(.50,.66,.64)*(room*.45+.55),min(.78,foam*.83+crest*.10+cascade*.24*smoothstep(.56,.82,noise(vec2(dot(q,vec2(-downhill.y,downhill.x))*2.5,dot(q,downhill)*.28-clock*1.6)))));\n"
" }else{\n"
"  vec2 flow=q*.39+vec2(clock*.022,-clock*.037);\n"
"  vec2 warp=vec2(fbm(flow*.85+clock*.013),fbm(flow*.92+19.-clock*.01))-.5;\n"
"  vec3 plate=crust(flow+warp*1.05);\n"
"  float grain=fbm(flow*9.+warp*2.);\n"
"  float fine=noise(flow*65.);\n"
"  float fracture=plate.x+(grain-.5)*.16+(fine-.5)*.025;\n"
"  float crack=1.-smoothstep(.008,.092,fracture);\n"
"  float heart=(1.-smoothstep(-.025,.018,fracture))*smoothstep(.30,.72,grain);\n"
"  float cooling=smoothstep(.07,.25,plate.x);\n"
"  // View-dependent relief puts the hot channels beneath raised cooling crust.\n"
"  vec2 eyeSlope=vec2(dot(V,tangent),dot(V,bitangent))/max(.32,dot(V,N));\n"
"  vec2 inset=flow-eyeSlope*(.025+.095*cooling+.025*grain);\n"
"  vec3 relief=crust(inset+warp*1.05);\n"
"  float fissure=relief.x+(fbm(inset*9.+warp*2.)-.5)*.16+(noise(inset*65.)-.5)*.025;\n"
"  crack=1.-smoothstep(.008,.092,fissure);\n"
"  heart=(1.-smoothstep(-.025,.018,fissure))*smoothstep(.30,.72,grain);\n"
"  float pulse=.86+.14*sin(clock*.72+flow.x*.9+flow.y*.5);\n"
"  vec3 basalt=mix(vec3(.018,.017,.019),vec3(.24,.17,.13),smoothstep(.25,.76,grain));\n"
"  basalt*=(.45+plate.z*.75)*(.72+.50*fine);\n"
"  vec3 hot=mix(vec3(.95,.16,.006),vec3(1.35,.74,.10),heart)*pulse*(.55+.55*grain);\n"
"  col=basalt*(room*.50+.60)+hot*crack;\n"
"  col+=vec3(.22,.025,.003)*(1.-cooling)*(.25+.75*grain);\n"
"  // Fine cooling fractures branch through the broad plates at different\n"
"  // depths instead of repeating a perfectly outlined polygon lattice.\n"
"  float micro=1.-smoothstep(.007,.025,abs(fbm(flow*5.5+warp)-.52));\n"
"  col+=vec3(.23,.035,.004)*micro*cooling*smoothstep(.45,.76,grain);\n"
"  float pressure=sin(clock*.65+plate.z*25.);\n"
"  float blister=(1.-smoothstep(.025,.15,plate.y))*smoothstep(.92,1.,pressure);\n"
"  col+=vec3(.88,.19,.013)*blister*.75;\n"
"  vec2 rockSlope=vec2(noise(flow*22.+.08)-noise(flow*22.-.08),noise(flow.yx*27.+.08)-noise(flow.yx*27.-.08));\n"
"  N=normalize(N+tangent*rockSlope.x*.65+bitangent*rockSlope.y*.65);\n"
"  vec3 key=normalize(normal*sign(dot(normal,V))*.7+tangent*.6+bitangent*.4);\n"
"  col*=mix(.55+.65*max(0.,dot(N,key)),1.,crack);\n"
"  exponent=22.;specular=.10;\n"
" }\n"
" for(int i=0;i<3;i++){\n"
"  vec3 L=lamps[i].xyz-world;float d=length(L);L/=max(.01,d);\n"
"  float fall=pow(max(0.,1.-d/max(.01,lamps[i].w)),2.);\n"
"  float spec=pow(max(0.,dot(N,normalize(L+V))),exponent);\n"
"  col+=lampColors[i].rgb*fall*(spec*specular+max(0.,dot(N,L))*col*.18);\n"
" }\n"
" if(overlay>.5){\n"
"  vec2 t=uv;if(turn>.5&&turn<1.5)t=vec2(1.-uv.y,uv.x);else if(turn>1.5&&turn<2.5)t=1.-uv;else if(turn>2.5)t=vec2(uv.y,1.-uv.x);\n"
"  vec4 cover=texture2D(overlayMap,t);if(overlay>1.5&&cover.a<.001)discard;\n"
"  col=mix(col,cover.rgb*light.rgb,smoothstep(.004,.08,cover.a));\n"
" }\n"
" col=mix(col,vec3(.055,.082,.09),min(.10,1.-exp(-max(0.,-pos.z-25.)*.001)));\n"
" gl_FragColor=vec4(col,native.a*light.a);\n"
"}\n"
;
/* Render-only water/lava. World-space fields continue over shared edges.
 * Reflections intersect the real room's six planes and sample its wall art.
 * No simulation, collision, hazard damage, portal or AI state is modified. */
extern float astra_mine_clock;
extern int framecount;
int astra_liquid_kind(int texture){
    if(texture<0||texture>=NumTextures)return 0;
    int flags=TmapInfo[texture].flags;
    if(flags&TMI_FORCE_FIELD)return 0;
    if(flags&TMI_WATER)return 1;
    if(flags&TMI_VOLATILE)return 2;
    const char *name=piggy_game_bitmap_name(&GameBitmaps[Textures[texture].index]);
    if(name&&!strncmp(name,"water",5))return 1;
    if(name&&!strncmp(name,"lava",4))return 2;
    return 0;
}
static float al_clock(void){return astra_mine_clock>=0?astra_mine_clock:(double)(GameTime64%(F1_0*1800))/F1_0;}
typedef struct{int room,side,kind,ids[4];unsigned shore;} al_face;
static al_face al_faces[MAX_SEGMENTS*6];static int al_count,al_level=-999,al_rooms=-1;
static short al_index[MAX_SEGMENTS][6];
static void al_catalog(void){
    if(al_level==Current_level_num&&al_rooms==Highest_segment_index)return;
    al_level=Current_level_num;al_rooms=Highest_segment_index;al_count=0;memset(al_index,255,sizeof al_index);
    int counts[2]={0};
    for(int r=0;r<=Highest_segment_index;r++)for(int s=0;s<6;s++){
        int kind=astra_liquid_kind(Segments[r].sides[s].tmap_num);if(!kind)continue;
        if(Segments[r].children[s]>=0&&Segments[r].sides[s].wall_num<0)continue;
        al_face *f=&al_faces[al_count];*f=(al_face){r,s,kind,{0},15};get_side_verts(f->ids,r,s);al_index[r][s]=al_count++;counts[kind-1]++;
    }
    for(int i=0;i<al_count;i++)for(int j=i+1;j<al_count;j++){
        al_face *a=&al_faces[i],*b=&al_faces[j];if(a->kind!=b->kind)continue;
        if(vm_vec_dot(&Segments[a->room].sides[a->side].normals[0],&Segments[b->room].sides[b->side].normals[0])<fl2f(.98f))continue;
        for(int e=0;e<4;e++)for(int f=0;f<4;f++){
            int a0=a->ids[e],a1=a->ids[(e+1)%4],b0=b->ids[f],b1=b->ids[(f+1)%4];
            if((a0==b0&&a1==b1)||(a0==b1&&a1==b0)){a->shore&=~(1<<e);b->shore&=~(1<<f);}
        }
    }
    EM_ASM(Module.liquidCatalog=({version:42,level:$0,water:$1,lava:$2});,Current_level_num,counts[0],counts[1]);
}
static void al_vec(float *out,const vms_vector *v){out[0]=f2fl(v->x);out[1]=f2fl(v->y);out[2]=f2fl(v->z);}
static float al_dot(float *a,float *b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
static void al_cross(float *out,float *a,float *b){for(int i=0;i<3;i++)out[i]=a[(i+1)%3]*b[(i+2)%3]-a[(i+2)%3]*b[(i+1)%3];}
static struct{float planes[6][4],origins[6][4],u[6][4],v[6][4],uv[6][4],duv[6][4],rect[6][4],tint[6][4];GLuint textures[6];int room,level,frame;} al_probe={.room=-1,.level=-999,.frame=-1};
static void al_reflection_room(int room){
    if(al_probe.room==room&&al_probe.level==Current_level_num&&al_probe.frame==framecount)return;
    al_probe.room=room;al_probe.level=Current_level_num;al_probe.frame=framecount;
    for(int s=0;s<6;s++){
        side *face=&Segments[room].sides[s];int t=face->tmap_num;
        al_probe.origins[s][3]=0;al_probe.textures[s]=0;
        if(t<0||t>=NumTextures||astra_liquid_kind(t)||(WALL_IS_DOORWAY(&Segments[room],s)&WID_RENDPAST_FLAG))continue;
        int ids[4];get_side_verts(ids,room,s);float a[3],b[3],e[3],f[3];al_vec(a,&Vertices[ids[0]]);al_vec(b,&Vertices[ids[1]]);for(int k=0;k<3;k++)e[k]=b[k]-a[k];al_vec(b,&Vertices[ids[3]]);for(int k=0;k<3;k++)f[k]=b[k]-a[k];
        float ee=al_dot(e,e),ff=al_dot(f,f),ef=al_dot(e,f),det=ee*ff-ef*ef;if(fabsf(det)<.001f)continue;
        for(int k=0;k<3;k++){al_probe.u[s][k]=(ff*e[k]-ef*f[k])/det;al_probe.v[s][k]=(ee*f[k]-ef*e[k])/det;al_probe.origins[s][k]=a[k];}
        al_cross(al_probe.planes[s],e,f);astra_unit(al_probe.planes[s]);al_probe.planes[s][3]=-al_dot(al_probe.planes[s],a);
        al_probe.uv[s][0]=f2fl(face->uvls[0].u);al_probe.uv[s][1]=f2fl(face->uvls[0].v);
        al_probe.uv[s][2]=f2fl(face->uvls[1].u-face->uvls[0].u);al_probe.uv[s][3]=f2fl(face->uvls[1].v-face->uvls[0].v);
        al_probe.duv[s][0]=f2fl(face->uvls[3].u-face->uvls[0].u);al_probe.duv[s][1]=f2fl(face->uvls[3].v-face->uvls[0].v);
        float power=0;for(int k=0;k<4;k++)power+=f2fl(face->uvls[k].l)*.25f;al_probe.u[s][3]=fminf(1.15f,fmaxf(.18f,power));
        PIGGY_PAGE_IN(Textures[t]);grs_bitmap *bm=&GameBitmaps[Textures[t].index];ogl_bindbmtex(bm);ogl_texture *tex=bm->gltexture;if(!tex||!tex->handle)continue;
        if(tex->faithful>=20)ag_load(tex->faithful-20);
        al_probe.textures[s]=ag_color(tex);if(!al_probe.textures[s])al_probe.textures[s]=tex->handle;
        al_probe.origins[s][3]=1;memset(al_probe.rect[s],0,4*sizeof(float));
        for(int k=0;k<3;k++)al_probe.tint[s][k]=tex->faithful>=20?tex->generated_tint[k]:1;
        if(tex->faithful==26)memcpy(al_probe.rect[s],tex->generated_rect,4*sizeof(float));
    }
}
int astra_liquid_face(int count,const g3s_point **view,const int *ids,const g3s_uvl *uv,g3s_lrgb *light,int room,int sidenum){
    static GLuint program;static int failed,draws[2];
    if(astra_native_compare||failed||count<3||count>8)return 0;
    side *face=&Segments[room].sides[sidenum];int kind=astra_liquid_kind(face->tmap_num);if(!kind)return 0;if(kind==2)ah_lava(count,view);
    if(face->wall_num>=0&&Walls[face->wall_num].type==WALL_DOOR)return 0;
    if(!program){
        const char *vs="varying highp vec3 world,pos;varying highp vec2 uv;varying mediump vec4 light;void main(){gl_Position=ftransform();pos=gl_Vertex.xyz;world=gl_MultiTexCoord0.xyz;uv=gl_Normal.xy;light=gl_Color;}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,astra_liquid_fragment);if(!v||!f){failed=1;return 0;}
        program=glCreateProgram();glAttachShader(program,v);glAttachShader(program,f);glLinkProgram(program);glDeleteShader(v);glDeleteShader(f);
        GLint ok;glGetProgramiv(program,GL_LINK_STATUS,&ok);if(!ok){char log[1024];glGetProgramInfoLog(program,sizeof log,NULL,log);fprintf(stderr,"Astra liquid link: %s\n",log);failed=1;return 0;}
    }
    al_catalog();al_reflection_room(room);
    PIGGY_PAGE_IN(Textures[face->tmap_num]);grs_bitmap *base=&GameBitmaps[Textures[face->tmap_num].index];ogl_bindbmtex(base);ogl_texture *tex=base->gltexture;
    GLuint native=tex->native_color?tex->native_color:tex->handle,toptex=native;int top=face->tmap_num2&0x3fff,mode=0;
    if(top>0&&top<NumTextures){PIGGY_PAGE_IN(Textures[top]);grs_bitmap *bm=&GameBitmaps[Textures[top].index];ogl_bindbmtex(bm);toptex=bm->gltexture->handle;mode=(bm->bm_flags&BM_FLAG_SUPER_TRANSPARENT)?2:1;}
    glUseProgram(program);glUniform1i(AS_UNIFORM(program,"baseMap"),0);glUniform1i(AS_UNIFORM(program,"overlayMap"),1);
    static GLint environmentUnits[6];static int unitsReady;if(!unitsReady){for(int i=0;i<6;i++){char name[12];snprintf(name,sizeof name,"env%d",i);environmentUnits[i]=glGetUniformLocation(program,name);}unitsReady=1;}for(int i=0;i<6;i++){glUniform1i(environmentUnits[i],2+i);glActiveTexture(GL_TEXTURE2+i);glBindTexture(GL_TEXTURE_2D,al_probe.textures[i]?al_probe.textures[i]:native);}
    glActiveTexture(GL_TEXTURE1);glBindTexture(GL_TEXTURE_2D,toptex);glActiveTexture(GL_TEXTURE0);glBindTexture(GL_TEXTURE_2D,native);
    glUniform4fv(AS_UNIFORM(program,"planes[0]"),6,&al_probe.planes[0][0]);glUniform4fv(AS_UNIFORM(program,"origins[0]"),6,&al_probe.origins[0][0]);
    glUniform4fv(AS_UNIFORM(program,"pu[0]"),6,&al_probe.u[0][0]);glUniform4fv(AS_UNIFORM(program,"pv[0]"),6,&al_probe.v[0][0]);
    glUniform4fv(AS_UNIFORM(program,"texuv[0]"),6,&al_probe.uv[0][0]);glUniform4fv(AS_UNIFORM(program,"texduv[0]"),6,&al_probe.duv[0][0]);
    glUniform4fv(AS_UNIFORM(program,"rect[0]"),6,&al_probe.rect[0][0]);glUniform4fv(AS_UNIFORM(program,"tints[0]"),6,&al_probe.tint[0][0]);
    glUniform4fv(AS_UNIFORM(program,"lamps[0]"),3,&afx_light_world[0][0]);glUniform4fv(AS_UNIFORM(program,"lampColors[0]"),3,&afx_colors[0][0]);
    float n[3],t[3]={0},b[3]={0},eye[3];al_vec(n,&face->normals[0]);astra_unit(n);al_vec(eye,&View_position);
    int major=fabsf(n[0])>fabsf(n[1])?(fabsf(n[0])>fabsf(n[2])?0:2):(fabsf(n[1])>fabsf(n[2])?1:2);t[(major+1)%3]=1;b[(major+2)%3]=1;
    vms_matrix orient;extract_orient_from_segment(&orient,&Segments[room]);float up[3];al_vec(up,&orient.uvec);float cascade=kind==1?(1-fminf(1,fabsf(al_dot(n,up)))):0;cascade=cascade*cascade;glUniform1f(AS_UNIFORM(program,"cascade"),cascade);float dx=-al_dot(up,t),dy=-al_dot(up,b),length=sqrtf(dx*dx+dy*dy);glUniform2f(AS_UNIFORM(program,"downhill"),length>.01f?dx/length:0,length>.01f?dy/length:1);
    glUniform3fv(AS_UNIFORM(program,"normal"),1,n);glUniform3fv(AS_UNIFORM(program,"tangent"),1,t);glUniform3fv(AS_UNIFORM(program,"bitangent"),1,b);glUniform3fv(AS_UNIFORM(program,"eye"),1,eye);
    glUniform1f(AS_UNIFORM(program,"kind"),kind);glUniform1f(AS_UNIFORM(program,"clock"),al_clock());glUniform1f(AS_UNIFORM(program,"overlay"),mode);glUniform1f(AS_UNIFORM(program,"turn"),(face->tmap_num2>>14)&3);
    float edges[4][4];int corners[4];get_side_verts(corners,room,sidenum);vms_vector center;compute_center_point_on_side(&center,&Segments[room],sidenum);float ctr[3];al_vec(ctr,&center);
    int catalog=al_index[room][sidenum];unsigned shore=catalog>=0?al_faces[catalog].shore:15;
    for(int i=0;i<4;i++){
        float a[3],d[3],e[3];al_vec(a,&Vertices[corners[i]]);al_vec(d,&Vertices[corners[(i+1)%4]]);for(int k=0;k<3;k++)e[k]=d[k]-a[k];al_cross(edges[i],n,e);astra_unit(edges[i]);
        edges[i][3]=-al_dot(edges[i],a);if(al_dot(edges[i],ctr)+edges[i][3]<0)for(int k=0;k<4;k++)edges[i][k]=-edges[i][k];
        if(!(shore&(1<<i))){memset(edges[i],0,sizeof edges[i]);edges[i][3]=10000;}
    }
    glUniform4fv(AS_UNIFORM(program,"shore[0]"),4,&edges[0][0]);
    float vertices[24],world[24],texcoord[24],colors[32];
    for(int i=0;i<count;i++){
        vertices[i*3]=f2fl(view[i]->p3_x);vertices[i*3+1]=f2fl(view[i]->p3_y);vertices[i*3+2]=-f2fl(view[i]->p3_z);al_vec(world+i*3,&Vertices[ids[i]]);
        texcoord[i*3]=f2fl(uv[i].u);texcoord[i*3+1]=f2fl(uv[i].v);texcoord[i*3+2]=0;
        colors[i*4]=f2fl(light[i].r);colors[i*4+1]=f2fl(light[i].g);colors[i*4+2]=f2fl(light[i].b);colors[i*4+3]=1;
    }
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);glEnableClientState(GL_NORMAL_ARRAY);glEnableClientState(GL_COLOR_ARRAY);
    glVertexPointer(3,GL_FLOAT,0,vertices);glTexCoordPointer(3,GL_FLOAT,0,world);glNormalPointer(GL_FLOAT,0,texcoord);glColorPointer(4,GL_FLOAT,0,colors);glDrawArrays(GL_TRIANGLE_FAN,0,count);
    glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_TEXTURE_COORD_ARRAY);glDisableClientState(GL_NORMAL_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glUseProgram(0);
    glActiveTexture(GL_TEXTURE0);glBindTexture(GL_TEXTURE_2D,tex->handle);
    draws[kind-1]++;EM_ASM(Module.liquidSurface=({version:42,waterDraws:$0,lavaDraws:$1,room:$2,kind:$3,time:$4});,draws[0],draws[1],room,kind,al_clock());return 1;
}
