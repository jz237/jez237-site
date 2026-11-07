/* An animated, transparent charging lattice on the original fuel-center face.
 * Original portals, recharge amounts and collision geometry are unchanged. */
int astra_recharge_face(int count,const g3s_point **view,const g3s_uvl *uv,int room,int side){
    static GLuint program;static int failed;
    if(!ax_on()||failed||count<3||count>8)return 0;
    if(!program){
        const char *vs="varying highp vec2 uv;void main(){uv=gl_MultiTexCoord0.xy;gl_Position=ftransform();}";
        const char *fs=
          "precision highp float;varying highp vec2 uv;uniform float clock,seed,charging;"
          "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}"
          "float line(float x,float width){return 1.-smoothstep(width,width*2.,abs(x));}"
          "void main(){vec2 p=uv*8.;vec2 cellSize=vec2(1.,1.73205);"
          "vec2 a=mod(p,cellSize)-cellSize*.5,b=mod(p-cellSize*.5,cellSize)-cellSize*.5;"
          "vec2 f=dot(a,a)<dot(b,b)?a:b;vec2 id=p-f;"
          "float phase=clock*.8+seed;float energy=.55+.45*sin(phase*1.7);"
          "float hex=max(abs(f.x),dot(abs(f),vec2(.5,.866025)));float grid=line(hex-.5,.010);"
          "float pulse=pow(.5+.5*sin(p.y*1.3-clock*3.+sin(p.x*.8+phase)),12.);"
          "float flow=pow(.5+.5*sin(p.x*2.-p.y*.55+clock*2.2),18.);"
          "float mote=exp(-dot(f-vec2(.12*sin(phase+id.y),.23*cos(phase*1.4+id.x)),f-vec2(.12*sin(phase+id.y),.23*cos(phase*1.4+id.x)))*420.);"
          "float charge=pow(.5+.5*sin(clock*2.+hash(id)*6.28),24.);"
          "float lane=floor(p.x*.5);float jitter=.055*sin(p.y*15.+floor(clock*18.)*2.+lane*7.)+.028*sin(p.y*39.+clock*21.);"
          "float arc=line(fract(p.x*.5)-.5-jitter,.006)*pow(.5+.5*sin(clock*2.+lane*2.3+seed),16.);"
          "float curtain=(.5+.5*sin(p.y*2.+sin(p.x*1.7+phase)*1.2-clock*2.))*pulse;"
          "vec3 teal=vec3(.04,.62,.76),amber=vec3(1.,.38,.035);"
          "vec3 color=teal*(grid*(.30+.55*pulse)+mote*charge*.7)+amber*(flow*grid*.65+curtain*.18);"
          "color+=vec3(.32,.88,1.)*arc*(.55+.25*charging);"
          "float alpha=clamp(grid*(.20+.27*pulse)+mote*charge*.45+arc*.7+curtain*.08,0.,.72);"
          "color*=.8+.20*energy+.30*charging;if(alpha<.006)discard;gl_FragColor=vec4(color,alpha);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);
        if(!v||!f){failed=1;return 0;}
        program=glCreateProgram();glAttachShader(program,v);glAttachShader(program,f);glLinkProgram(program);glDeleteShader(v);glDeleteShader(f);
        GLint linked;glGetProgramiv(program,GL_LINK_STATUS,&linked);if(!linked){failed=1;return 0;}
    }
    float p[24],tex[16];
    for(int i=0;i<count;i++){
        p[i*3]=f2fl(view[i]->p3_x);p[i*3+1]=f2fl(view[i]->p3_y);p[i*3+2]=-f2fl(view[i]->p3_z);
        tex[i*2]=f2fl(uv[i].u);tex[i*2+1]=f2fl(uv[i].v);
    }
    float charging=ConsoleObject&&Segment2s[ConsoleObject->segnum].special==SEGMENT_IS_FUELCEN&&Players[Player_num].energy<i2f(100)?1:0;
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;
    GLboolean cull=glIsEnabled(GL_CULL_FACE);glDisable(GL_CULL_FACE);glDepthMask(GL_FALSE);
    gr_settransblend(GR_FADE_OFF,GR_BLEND_ADDITIVE_A);glUseProgram(program);
    extern float astra_mine_clock;
    glUniform1f(glGetUniformLocation(program,"clock"),astra_mine_clock>=0?astra_mine_clock:(double)(GameTime64%(F1_0*2000))/F1_0);
    glUniform1f(glGetUniformLocation(program,"seed"),room*.13f+side*.71f);
    glUniform1f(glGetUniformLocation(program,"charging"),charging);
    /* This shader has no vertex-color input. A prior legacy draw can leave its
     * client array enabled; preserve it without binding attribute location -1. */
    GLboolean color_array;glGetBooleanv(GL_COLOR_ARRAY,&color_array);glDisableClientState(GL_COLOR_ARRAY);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);
    glVertexPointer(3,GL_FLOAT,0,p);glTexCoordPointer(2,GL_FLOAT,0,tex);glDrawArrays(GL_TRIANGLE_FAN,0,count);
    glDisableClientState(GL_VERTEX_ARRAY);glDisableClientState(GL_TEXTURE_COORD_ARRAY);glUseProgram(0);
    if(color_array)glEnableClientState(GL_COLOR_ARRAY);
    glDepthMask(GL_TRUE);if(cull)glEnable(GL_CULL_FACE);gr_settransblend(fade,blend);
    EM_ASM(Module.rechargeVisualVersion=17;Module.rechargeFaces=(Module.rechargeFaces||0)+1;Module.rechargeActive=!!$0;,charging);
    return 1;
}
