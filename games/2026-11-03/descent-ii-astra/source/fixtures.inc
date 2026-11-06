/* R38: shallow physical fittings on ordinary solid faces. Native texture UVs
 * place each fitting on its artwork, including rotated/stretched surfaces.
 * No portals, secrets, damage volumes or collision geometry are altered. */
static unsigned afx_draws,afx_grilles,afx_pipes,afx_lights,afx_panels;
static float afx_uv[36000];
static void afx_finish(int family,float fade){
    static GLuint program;static int failed;if(!ax_count||failed)return;
    if(!program){
        const char *vs="varying highp vec3 p,n;varying highp vec2 uv;varying mediump vec4 tint;uniform mat3 axis;uniform vec3 origin;void main(){p=axis*gl_Vertex.xyz+origin;n=normalize(axis*gl_Normal);uv=gl_MultiTexCoord0.xy;tint=gl_Color;gl_Position=gl_ProjectionMatrix*vec4(p,1.);}";
        const char *fs="precision highp float;varying highp vec3 p,n;varying highp vec2 uv;varying mediump vec4 tint;uniform sampler2D paint,metal,lens;uniform float opacity,kind;uniform vec4 lamps[3],colors[3],lightAxes[3];"
          "void main(){vec3 N=normalize(n),V=normalize(-p),L=normalize(vec3(-.45,.7,.6));vec2 q=kind<1.5?vec2(.24,.23)+uv*vec2(.52,.53):uv;vec3 art=texture2D(paint,q).rgb;vec3 grain=texture2D(metal,uv*2.).rgb;"
          "float emit=step(2.5,tint.a),bed=step(1.5,tint.a)*(1.-emit);vec3 c=mix(tint.rgb*(.60+grain*1.4),art*.66,bed);float diffuse=max(0.,dot(N,L)),spec=pow(max(0.,dot(N,normalize(V+L))),28.);"
          "c=c*(.40+.84*diffuse)+vec3(.35,.32,.27)*spec*.30*(1.-bed*.8);for(int i=0;i<3;i++){vec3 D=lamps[i].xyz-p;D+=lightAxes[i].xyz*clamp(dot(-D,lightAxes[i].xyz),-lightAxes[i].w,lightAxes[i].w);float len=length(D);D/=max(.01,len);float reach=pow(max(0.,1.-len/max(.01,lamps[i].w)),2.);float gloss=pow(max(0.,dot(N,normalize(V+D))),42.);c+=colors[i].rgb*reach*(tint.rgb*(.14+.46*max(0.,dot(N,D)))+gloss*.36)*(1.-emit);}"
          "float core=1.-smoothstep(.025,.085,abs(uv.y-.5));float diffuser=texture2D(lens,vec2(fract(uv.x*8.)*.60+.20,clamp((uv.y-.4)*5.,0.,1.)*.60+.20)).r;vec3 emission=tint.rgb*(.80+.8*core)*(.65+.50*diffuser)+vec3(.16)*core;"
          "if(tint.a>3.5){vec2 q=uv-.5;float radius=length(q),angle=atan(q.y,q.x);float annulus=exp(-pow((radius-.25)*12.,2.));float cells=pow(max(0.,cos(angle*10.)),4.);float heat=annulus*(.15+.85*cells);float detail=texture2D(lens,uv*3.).r;emission=vec3(.045,.021,.012)+tint.rgb*(.10+heat*1.35)*(.65+.55*detail)+vec3(.42,.24,.035)*heat*heat;}"
          "c=mix(c,emission,emit);gl_FragColor=vec4(c,opacity);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){failed=1;return;}program=glCreateProgram();glAttachShader(program,v);glAttachShader(program,f);glLinkProgram(program);glDeleteShader(v);glDeleteShader(f);
        GLint ok;glGetProgramiv(program,GL_LINK_STATUS,&ok);if(!ok){failed=1;return;}
    }
    ag_load(family);ag_load(7);ag_load(6);float axis[9];for(int k=0;k<3;k++){vms_vector a={0},r;if(k==0)a.x=F1_0;else if(k==1)a.y=F1_0;else a.z=F1_0;g3_rotate_delta_vec(&r,&a);axis[3*k]=f2fl(r.x);axis[3*k+1]=f2fl(r.y);axis[3*k+2]=-f2fl(r.z);}
    vms_vector zero={0};g3s_point origin;g3_rotate_point(&origin,&zero);int oldfade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;GLboolean cull=glIsEnabled(GL_CULL_FACE);glDisable(GL_CULL_FACE);gr_settransblend(GR_FADE_OFF,GR_BLEND_NORMAL);glDepthMask(fade>.99f?GL_TRUE:GL_FALSE);
    glUseProgram(program);glUniformMatrix3fv(glGetUniformLocation(program,"axis"),1,GL_FALSE,axis);glUniform3f(glGetUniformLocation(program,"origin"),f2fl(origin.p3_x),f2fl(origin.p3_y),-f2fl(origin.p3_z));
    glUniform1f(glGetUniformLocation(program,"opacity"),fade);glUniform1f(glGetUniformLocation(program,"kind"),family==11?1:2);glUniform1i(glGetUniformLocation(program,"paint"),0);glUniform1i(glGetUniformLocation(program,"metal"),1);glUniform1i(glGetUniformLocation(program,"lens"),2);
    glUniform4fv(glGetUniformLocation(program,"lamps[0]"),3,&afx_lamps[0][0]);glUniform4fv(glGetUniformLocation(program,"colors[0]"),3,&afx_colors[0][0]);glUniform4fv(glGetUniformLocation(program,"lightAxes[0]"),3,&afx_axes[0][0]);
    glActiveTexture(GL_TEXTURE2);glBindTexture(GL_TEXTURE_2D,ag_colors[6]);
    glActiveTexture(GL_TEXTURE1);glBindTexture(GL_TEXTURE_2D,ag_colors[7]);glActiveTexture(GL_TEXTURE0);glBindTexture(GL_TEXTURE_2D,ag_colors[family]);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_NORMAL_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    glVertexPointer(3,GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].p);glNormalPointer(GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].n);glColorPointer(4,GL_FLOAT,sizeof(ax_vertex),ax_vertices[0].color);glTexCoordPointer(2,GL_FLOAT,0,afx_uv);glDrawArrays(GL_TRIANGLES,0,ax_count);
    glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_NORMAL_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_TEXTURE_COORD_ARRAY);glUseProgram(0);glDepthMask(GL_TRUE);if(cull)glEnable(GL_CULL_FACE);gr_settransblend(oldfade,blend);ax_count=0;
}
extern int framecount;
static int afx_frame=-1,afx_budget;
int astra_fixture_kind(int room,int s){
    side *face=&Segments[room].sides[s];int t=face->tmap_num,top=face->tmap_num2&0x3fff;
    if(Segments[room].children[s]>=0||face->wall_num>=0||face->type!=SIDE_IS_QUAD||t<0||t>=NumTextures||top>=NumTextures)return 0;
    if(TmapInfo[t].damage||TmapInfo[t].flags&(TMI_WATER|TMI_VOLATILE|TMI_FORCE_FIELD))return 0;
    grs_bitmap *bm=&GameBitmaps[Textures[t].index];const char *name=piggy_game_bitmap_name(bm);if(!name)return 0;
    if(top){ogl_texture *tx=GameBitmaps[Textures[top].index].gltexture;if(tx&&tx->faithful==26)return 3;
        const char *nm=piggy_game_bitmap_name(&GameBitmaps[Textures[top].index]);int n=nm?atoi(nm+4):0;
        if(nm&&((!strncmp(nm,"ceil",4)&&(n==2||n==3||n==8||n==24||n==25||n==27||n==28||n==29||n==30||n==35||n==36))||(!strncmp(nm,"misc",4)&&(n==85||n==86)))&&!strchr(nm,'b'))return 3;
        return 0; /* Leave signs, transparent overlays and special art clear. */
    }
    if(bm->bm_flags&(BM_FLAG_TRANSPARENT|BM_FLAG_SUPER_TRANSPARENT))return 0;
    int n=atoi(name+4);if(!strncmp(name,"ceil",4)&&(n==15||n==16||n==17||n==19))return 1;
    if(!strncmp(name,"metl",4)&&(n==65||n==68||n==70||n==96))return 2;
    if(!strncmp(name,"ctrl",4)&&!strchr(name,'#'))return 2;
    if(!strncmp(name,"metl",4)&&n%4==1&&n!=23&&n!=24)return 4;
    return 0;
}
/* Affine map from a texture's oriented UV coordinates to the original quad. */
typedef struct {float origin[3],u[3],v[3],n[3],uv[8],w,h,cx,cy;} afx_plane;
static int afx_plane_for(int room,int s,int turn,afx_plane *m){
    side *face=&Segments[room].sides[s];int ids[4];get_side_verts(ids,room,s);
    for(int i=0;i<4;i++){float u=f2fl(face->uvls[i].u),v=f2fl(face->uvls[i].v),x=u,y=v;
        if(turn==1){x=1-v;y=u;}else if(turn==2){x=1-u;y=1-v;}else if(turn==3){x=v;y=1-u;}m->uv[i*2]=x;m->uv[i*2+1]=y;}
    float a=m->uv[2]-m->uv[0],b=m->uv[3]-m->uv[1],c=m->uv[4]-m->uv[0],d=m->uv[5]-m->uv[1],det=a*d-b*c;
    if(fabsf(det)<.0001f)return 0;
    float p[3][3];for(int i=0;i<3;i++){p[i][0]=f2fl(Vertices[ids[i]].x);p[i][1]=f2fl(Vertices[ids[i]].y);p[i][2]=f2fl(Vertices[ids[i]].z);}
    for(int k=0;k<3;k++){m->u[k]=((p[1][k]-p[0][k])*d-(p[2][k]-p[0][k])*b)/det;m->v[k]=((p[2][k]-p[0][k])*a-(p[1][k]-p[0][k])*c)/det;m->origin[k]=p[0][k]-m->u[k]*m->uv[0]-m->v[k]*m->uv[1];}
    vms_vector center,ctr,dir,n=face->normals[0];compute_center_point_on_side(&center,&Segments[room],s);compute_segment_center(&ctr,&Segments[room]);vm_vec_sub(&dir,&ctr,&center);if(vm_vec_dot(&n,&dir)<0)vm_vec_negate(&n);
    m->n[0]=f2fl(n.x);m->n[1]=f2fl(n.y);m->n[2]=f2fl(n.z);m->w=m->h=0;
    for(int k=0;k<3;k++){m->w+=m->u[k]*m->u[k];m->h+=m->v[k]*m->v[k];}m->w=sqrtf(m->w);m->h=sqrtf(m->h);
    m->cx=m->cy=0;for(int i=0;i<4;i++){m->cx+=m->uv[i*2]*.25f;m->cy+=m->uv[i*2+1]*.25f;}
    m->cx=floorf(m->cx)+.5f;m->cy=floorf(m->cy)+.5f;return m->w>5&&m->h>5&&m->w<100&&m->h<100;
}
static int afx_inside(const afx_plane *m,float u,float v){
    float sign=0;for(int i=0;i<4;i++){int j=(i+1)%4;float cross=(m->uv[j*2]-m->uv[i*2])*(v-m->uv[i*2+1])-(m->uv[j*2+1]-m->uv[i*2+1])*(u-m->uv[i*2]);
        if(fabsf(cross)<.0001f)continue;if(sign&&sign*cross<0)return 0;sign=cross;}return 1;
}
static void afx_world(const afx_plane *m,float u,float v,float z,float *p){for(int k=0;k<3;k++)p[k]=m->origin[k]+m->u[k]*u+m->v[k]*v+m->n[k]*z;}
static void afx_transform(const afx_plane *m){
    for(int i=0;i<ax_count;i++){ax_vertex *a=&ax_vertices[i];float u=m->cx+a->p[0]/m->w,v=m->cy-a->p[1]/m->h,z=a->p[2],n[3];
        if(!afx_inside(m,u,v)){ax_count=0;return;}
        afx_world(m,u,v,z,a->p);for(int k=0;k<3;k++)n[k]=m->u[k]/m->w*a->n[0]-m->v[k]/m->h*a->n[1]+m->n[k]*a->n[2];astra_unit(n);memcpy(a->n,n,sizeof n);}
}
static void afx_frame_box(float x,float y,float w,float h,float depth){
    /* Dark recessed bed, raised metal shoulders, narrow contact shadow rim. */
    ax_paint(.025f,.029f,.032f,2);ag_box(x,y,.015f,w+.075f,h+.075f,.012f);
    ax_paint(.20f,.215f,.23f,0);ag_box(x-w,y,depth*.5f,.085f,h,depth*.5f);ag_box(x+w,y,depth*.5f,.085f,h,depth*.5f);
    ag_box(x,y-h,depth*.5f,w,.085f,depth*.5f);ag_box(x,y+h,depth*.5f,w,.085f,depth*.5f);
    for(int a=-1;a<=1;a+=2)for(int b=-1;b<=1;b+=2){ax_paint(.38f,.39f,.40f,0);ax_tube(x+a*w,y+b*h,depth,x+a*w,y+b*h,depth+.025f,.052f,.052f,8);}
}
/* Physical diffuser, guarding ribs and a small non-directional service ID.
 * One bounded draw replaces the ordinary fitting on this eligible face. */
static void aw_lamp(const aw_mount *m,int room,int s,float fade){
    float W=m->width;ax_count=0;ax_energy=0;
    afx_frame_box(0,0,W,.30f,.16f);
    ax_paint(.035f,.04f,.045f,0);ag_box(0,0,.10f,W-.06f,.25f,.025f);
    int lit=!(Light_subtracted[room]&(1<<s));const float *color=aw_palette[m->color];
    int cells=(int)fminf(12,fmaxf(4,W*1.6f));float pitch=(W*2-.20f)/cells;
    for(int i=0;i<cells;i++){float x=-W+.10f+(i+.5f)*pitch;
        ax_paint(.14f,.16f,.18f,0);ag_box(x,0,.14f,pitch*.48f,.225f,.035f);
        ax_paint(color[0]*(lit?1:.06f),color[1]*(lit?1:.06f),color[2]*(lit?1:.06f),lit?3:0);ag_box(x,0,.18f,pitch*.43f,.18f,.012f);
    }
    ax_paint(.39f,.42f,.44f,0);for(int sign=-1;sign<=1;sign+=2)ag_box(0,sign*.29f,.19f,W,.018f,.025f);
    ax_paint(.055f,.065f,.075f,0);ag_box(0,-.51f,.07f,.84f,.15f,.035f);
    /* Seven-segment stamped bay number, independent of objectives/key colors. */
    static const unsigned char digits[10]={63,6,91,79,102,109,125,7,127,111};
    int number=(room*6+s)%1000;ax_paint(.64f,.68f,.67f,0);
    for(int d=0;d<3;d++){unsigned bits=digits[d==0?number/100:d==1?number/10%10:number%10];float x=(d-1)*.25f,y=-.51f;
        if(bits&1)ag_box(x,y+.095f,.11f,.061f,.012f,.003f);if(bits&8)ag_box(x,y-.095f,.11f,.061f,.012f,.003f);if(bits&64)ag_box(x,y,.11f,.061f,.012f,.003f);
        if(bits&2)ag_box(x+.064f,y+.049f,.11f,.012f,.036f,.003f);if(bits&4)ag_box(x+.064f,y-.049f,.11f,.012f,.036f,.003f);
        if(bits&16)ag_box(x-.064f,y-.049f,.11f,.012f,.036f,.003f);if(bits&32)ag_box(x-.064f,y+.049f,.11f,.012f,.036f,.003f);
    }
    for(int i=0;i<ax_count;i++){
        ax_vertex *a=&ax_vertices[i];float x=a->p[0],y=a->p[1],z=a->p[2],nx=a->n[0],ny=a->n[1],nz=a->n[2];
        afx_uv[2*i]=x/(2*W)+.5f;afx_uv[2*i+1]=y*.5f+.5f;
        a->p[0]=f2fl(m->p.x)+f2fl(m->r.x)*x+f2fl(m->u.x)*y+f2fl(m->n.x)*z;
        a->p[1]=f2fl(m->p.y)+f2fl(m->r.y)*x+f2fl(m->u.y)*y+f2fl(m->n.y)*z;
        a->p[2]=f2fl(m->p.z)+f2fl(m->r.z)*x+f2fl(m->u.z)*y+f2fl(m->n.z)*z;
        a->n[0]=f2fl(m->r.x)*nx+f2fl(m->u.x)*ny+f2fl(m->n.x)*nz;
        a->n[1]=f2fl(m->r.y)*nx+f2fl(m->u.y)*ny+f2fl(m->n.y)*nz;
        a->n[2]=f2fl(m->r.z)*nx+f2fl(m->u.z)*ny+f2fl(m->n.z)*nz;
    }
    afx_finish(7,fade);afx_budget++;afx_draws++;afx_lights++;
}
static void afx_fixture(int room,int s){
    if(!astra_refinement||astra_native_compare||ss_capture)return;
    if(afx_frame!=framecount){afx_frame=framecount;afx_budget=0;}if(afx_budget>=22)return;
    int kind=astra_fixture_kind(room,s);
    if(room==astra_gallery_room&&s==astra_gallery_side){if(astra_gallery_scene==15||astra_gallery_scene==25)kind=1;else if(astra_gallery_scene==17)kind=2;}
    aw_mount mount;int accent=aw_mount_for(room,s,&mount);
    if(!kind&&!accent)return;
    vms_vector center;compute_center_point_on_side(&center,&Segments[room],s);g3s_point p;g3_rotate_point(&p,&center);float distance=f2fl(p.p3_z);
    if(distance<.6f||distance>82)return;float fade=fminf(1,(82-distance)/12.f);
    if(accent&&astra_gallery_scene!=15&&astra_gallery_scene!=17&&astra_gallery_scene!=25){
        aw_lamp(&mount,room,s,fade);if(afx_budget<22&&aw_mount_at(room,s,1,&mount))aw_lamp(&mount,room,s,fade);return;
    }
    side *face=&Segments[room].sides[s];int turn=kind==3?(face->tmap_num2>>14)&3:0;afx_plane m;if(!afx_plane_for(room,s,turn,&m))return;
    if(room==astra_gallery_room&&s==astra_gallery_side&&(astra_gallery_scene==15||astra_gallery_scene==17||astra_gallery_scene==25)){
        m.cx=m.cy=0;for(int j=0;j<4;j++){m.cx+=m.uv[j*2]*.25f;m.cy+=m.uv[j*2+1]*.25f;}
    }
    float w=m.w,h=m.h;ax_count=0;ax_energy=0;
    if(kind==1){
        float W=fminf(w*.255f,5.8f),H=fminf(h*.255f,5.8f);afx_frame_box(0,0,W,H,.33f);
        if(aw_vent(room,s)){
            float rad=fminf(W,H)*.78f,time=ae_clock(),warm=aw_warmth(room,s,time);int lit=!(Light_subtracted[room]&(1<<s));
            ax_paint(warm*(lit?1:.04f),warm*(lit?.25f:.02f),.025f,lit?4:0);
            for(int j=0;j<24;j++){float a=j*6.2831853f/24,b=(j+1)*6.2831853f/24;
                ax_vertex_add(0,0,.08f,0,0,1);ax_vertex_add(cosf(a)*rad,sinf(a)*rad,.08f,0,0,1);ax_vertex_add(cosf(b)*rad,sinf(b)*rad,.08f,0,0,1);}
            ax_paint(.075f,.065f,.055f,0);for(int j=0;j<7;j++){
                float a=time*.48f+j*6.2831853f/7;float v[4][3]={{cosf(a)*rad*.18f,sinf(a)*rad*.18f,.15f},{cosf(a+.18f)*rad*.88f,sinf(a+.18f)*rad*.88f,.15f},{cosf(a+.58f)*rad*.85f,sinf(a+.58f)*rad*.85f,.15f},{cosf(a+.38f)*rad*.22f,sinf(a+.38f)*rad*.22f,.15f}};
                ag_triangle(v[0],v[1],v[2]);ag_triangle(v[0],v[2],v[3]);
                ax_paint(.27f,.23f,.18f,0);ax_tube(v[1][0],v[1][1],.15f,v[2][0],v[2][1],.15f,.018f,.018f,4);ax_paint(.075f,.065f,.055f,0);}
            ax_paint(.29f,.23f,.18f,0);ax_tube(0,0,.15f,0,0,.23f,rad*.17f,rad*.15f,12);
        }
        for(int k=-2;k<=2;k++){float x=k*W*.32f;ax_paint(.22f,.23f,.24f,0);ax_tube(x,-H,.16f,x,H,.16f,.13f,.13f,8);for(int j=-1;j<=1;j+=2)ax_tube(x,j*H*.66f-.09f,.16f,x,j*H*.66f+.09f,.16f,.20f,.20f,8);}
        int bars=9;for(int k=0;k<bars;k++){float y=-H+(k+1)*2*H/(bars+1);ax_paint(.35f,.34f,.32f,0);ag_box(0,y,.32f,W,.065f,.10f);ax_paint(.43f,.42f,.40f,0);ag_box(0,y+.055f,.40f,W,.014f,.018f);}
    }else if(kind==2){
        float H=fminf(h*.32f,6),W=fminf(w*.13f,2.3f);afx_frame_box(0,0,W+.38f,H+.18f,.13f);
        for(int k=-1;k<=1;k++){float x=k*W*.72f;ax_paint(.39f,.38f,.36f,0);ax_tube(x,-H,.29f,x,H,.29f,.22f,.22f,12);
            for(int j=-1;j<=1;j++){float y=j*H*.75f;ax_paint(.23f,.22f,.21f,0);ax_tube(x,y-.15f,.29f,x,y+.15f,.29f,.32f,.32f,12);ax_paint(.50f,.49f,.46f,0);ag_box(x,y,.59f,.18f,.09f,.045f);
                for(int a=-1;a<=1;a+=2){ax_paint(.42f,.41f,.38f,0);ax_tube(x+a*.13f,y,.62f,x+a*.13f,y,.67f,.04f,.04f,6);}}}
    }else if(kind==3){
        ogl_texture *tex=GameBitmaps[Textures[face->tmap_num2&0x3fff].index].gltexture;if(!tex||tex->faithful!=26)return;
        float x=(tex->generated_rect[0]+tex->generated_rect[2]*.5f-.5f)*w,y=(.5f-tex->generated_rect[1]-tex->generated_rect[3]*.5f)*h;
        float W=tex->generated_rect[2]*w*.5f,H=tex->generated_rect[3]*h*.5f;if(W>.46f*w||H>.46f*h)return;
        /* Open housing leaves the detailed diffuser and its native light intact. */
        ax_paint(.06f,.065f,.07f,0);
        for(int a=-1;a<=1;a+=2){ag_box(x+a*(W+.08f),y,.035f,.10f,H+.10f,.025f);ag_box(x,y+a*(H+.08f),.035f,W+.10f,.10f,.025f);}
        ax_paint(.32f,.34f,.36f,0);for(int a=-1;a<=1;a+=2){ag_box(x+a*(W+.02f),y,.13f,.045f,H+.06f,.10f);ag_box(x,y+a*(H+.02f),.13f,W+.06f,.045f,.10f);}
        ax_paint(.15f,.16f,.17f,0);int guards=H>W?3:1;for(int j=0;j<guards;j++){float y0=y+(j-(guards-1)*.5f)*H*.48f;ax_tube(x-W,y0,.25f,x+W,y0,.25f,.025f,.025f,6);}
    }else{
        float W=w*.31f,H=h*.27f;ax_paint(.07f,.075f,.08f,0);
        for(int a=-1;a<=1;a+=2){ag_box(a*W,0,.025f,.10f,H,.025f);ax_paint(.27f,.285f,.30f,0);ag_box(a*W,0,.11f,.055f,H,.075f);
            for(int j=-1;j<=1;j+=2){ax_paint(.40f,.41f,.42f,0);ax_tube(a*W,j*H*.88f,.16f,a*W,j*H*.88f,.20f,.055f,.055f,8);}}
    }
    /* Fade only the last 12 units, retaining solid depth for close-up geometry. */
    /* A skewed quad may contain only part of a texture tile. Fit a compact
     * service fitting inside it; never leave hardware hanging across a portal. */
    if(kind!=3){float fit=1;int valid=0;
        for(int pass=0;pass<4&&!valid;pass++){valid=1;for(int i=0;i<ax_count;i++)if(!afx_inside(&m,m.cx+ax_vertices[i].p[0]*fit/m.w,m.cy-ax_vertices[i].p[1]*fit/m.h)){valid=0;break;}
            if(!valid){m.cx=m.cy=0;for(int j=0;j<4;j++){m.cx+=m.uv[j*2]*.25f;m.cy+=m.uv[j*2+1]*.25f;}fit*=.65f;}}
        if(!valid){ax_count=0;return;}for(int i=0;i<ax_count;i++){ax_vertices[i].p[0]*=fit;ax_vertices[i].p[1]*=fit;}}
    float low[2]={1e6f,1e6f},high[2]={-1e6f,-1e6f};for(int i=0;i<ax_count;i++)for(int k=0;k<2;k++){low[k]=fminf(low[k],ax_vertices[i].p[k]);high[k]=fmaxf(high[k],ax_vertices[i].p[k]);}
    for(int i=0;i<ax_count;i++){afx_uv[i*2]=(ax_vertices[i].p[0]-low[0])/fmaxf(.01f,high[0]-low[0]);afx_uv[i*2+1]=1-(ax_vertices[i].p[1]-low[1])/fmaxf(.01f,high[1]-low[1]);}
    afx_transform(&m);if(ax_count){afx_finish(kind==1?11:kind==2?10:7,fade);afx_draws++;afx_budget++;if(kind==1)afx_grilles++;else if(kind==2)afx_pipes++;else if(kind==3)afx_lights++;else afx_panels++;}
}
