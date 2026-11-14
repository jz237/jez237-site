/* Apply the optical response only to the mine camera, before cockpit and HUD.
   The high pass and separable blur run at one-quarter resolution. */
/* Cinematic lighting (pyre106) adds a wide second glow level from the narrow one, and a film finish:
   contrast, saturation, a stronger vignette and slight colour fringing toward the edges. At strength 0
   the picture is the earlier one. */
static GLuint lensScene,lensSmall[3],lensFbo[3],lensPrograms[3];static int lensW,lensH,lensFailed,lensOn=-1;
static GLint lensStep[2],lensGlow,lensHeat,lensClock,lensLift,lensWide,lensCinema,lensCut,lensTune;
static int lensCopyChecked,lensCopyX,lensCopyY,lensCopyFb;
static GLuint lens_program(const char *frag){
    const char *vert="varying mediump vec2 uv;void main(){gl_Position=vec4(gl_Vertex.xy,0.,1.);uv=gl_Vertex.xy*.5+.5;}";
    GLuint v=astra_compile(GL_VERTEX_SHADER,vert),f=astra_compile(GL_FRAGMENT_SHADER,frag);
    if(!v||!f)return 0;
    GLuint pg=glCreateProgram();glAttachShader(pg,v);glAttachShader(pg,f);glLinkProgram(pg);glDeleteShader(v);glDeleteShader(f);
    GLint ok=0;glGetProgramiv(pg,GL_LINK_STATUS,&ok);return ok?pg:0;
}
static void lens_texture(GLuint *tex,int w,int h){
    if(!*tex)glGenTextures(1,tex);glBindTexture(GL_TEXTURE_2D,*tex);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE);
    GLenum format=tex==&lensScene?GL_RGB:GL_RGBA;glTexImage2D(GL_TEXTURE_2D,0,format,w,h,0,format,GL_UNSIGNED_BYTE,NULL);
}
static int warm_astra_lens(void){
    if(lensFailed)return 0;if(lensFbo[0])return 1;

        lensPrograms[0]=lens_program("precision mediump float;varying mediump vec2 uv;uniform sampler2D src;uniform vec2 stepUV;"
            "uniform float cut;vec3 high(vec2 p){vec3 a=texture2D(src,p).rgb;float lum=max(a.r,max(a.g,a.b));return a*smoothstep(cut,.96,lum)*(.27+.73*lum);}"
            "void main(){vec2 d=stepUV*1.35;gl_FragColor=vec4(.25*(high(uv+d)+high(uv-d)+high(uv+vec2(d.x,-d.y))+high(uv+vec2(-d.x,d.y))),1.);}");
        lensPrograms[1]=lens_program("precision mediump float;varying mediump vec2 uv;uniform sampler2D src;uniform vec2 stepUV;"
            "void main(){vec3 c=texture2D(src,uv).rgb*.227; c+=(texture2D(src,uv+stepUV*1.385).rgb+texture2D(src,uv-stepUV*1.385).rgb)*.316;"
            "c+=(texture2D(src,uv+stepUV*3.231).rgb+texture2D(src,uv-stepUV*3.231).rgb)*.0705;gl_FragColor=vec4(c,1.);}");
        lensPrograms[2]=lens_program("precision mediump float;varying mediump vec2 uv;uniform sampler2D src,glow,wide;uniform vec4 heat[4],tune[3];uniform float clock,lift,cinema;"
            "void main(){float warp=0.;for(int i=0;i<4;i++){vec2 q=(uv-heat[i].xy)/max(vec2(.0001),heat[i].zw);warp+=max(0.,1.-dot(q,q))*step(.001,heat[i].z);}vec2 shift=vec2(sin(uv.y*180.-clock*3.2),cos(uv.x*140.+clock*2.7))*.00065*min(1.,warp);"
            /* Slight colour fringing toward the edges, as through a real lens. */
            "vec2 fringe=(uv-.5)*.0028*cinema;vec3 a=texture2D(src,uv+shift).rgb;a.r=texture2D(src,uv+shift+fringe).r;a.b=texture2D(src,uv+shift-fringe).b;"
            /* The wide level gives lamps and blasts a soft halo; the narrow one keeps their core. */
            "vec3 b=texture2D(glow,uv).rgb+texture2D(wide,uv).rgb*(tune[0].z*cinema);"
            /* A lamp close to the camera could add so much glow that a seventh of the picture clipped to white. */
            "vec3 c=a*(.89+.12*a)+b*((.57+tune[2].x*cinema)/(1.+.9*max(b.r,max(b.g,b.b))));"
            "c=mix(c,vec3(.014,.030,.040),.09*(1.-max(a.r,max(a.g,a.b))));"
            /* Mine brightness: raise dark tones and leave bright ones, so a dim room can be read without washing out its lights. The cinematic finish keeps more of the dark. */
            "float top=max(c.r,max(c.g,c.b)),L=lift*(1.-tune[0].w*cinema);c*=(1.+L)/(1.+L*top);"
            /* Film finish: richer colour, and tones below a middle level deepened toward black while lit surfaces keep their level. */
            "if(cinema>0.){float y=dot(c,vec3(.2126,.7152,.0722));c=max(mix(vec3(y),c,1.+tune[0].y*cinema),0.);vec3 deep=tune[1].z*pow(max(c,vec3(.0001))/tune[1].z,vec3(1.+tune[0].x*cinema));c=mix(deep,c,step(vec3(tune[1].z),c));}"
            "c=c/(1.+.18*max(c-.70,vec3(0.))); vec2 e=uv*2.-1.;float r2=dot(e,e);c*=1.-.052*r2-tune[1].x*cinema*smoothstep(.30,2.,r2);gl_FragColor=vec4(c,1.);}");
        if(!lensPrograms[0]||!lensPrograms[1]||!lensPrograms[2]){lensFailed=1;return 0;}
        for(int i=0;i<2;i++)lensStep[i]=glGetUniformLocation(lensPrograms[i],"stepUV");
        lensWide=glGetUniformLocation(lensPrograms[2],"wide");lensCinema=glGetUniformLocation(lensPrograms[2],"cinema");lensCut=glGetUniformLocation(lensPrograms[0],"cut");lensTune=glGetUniformLocation(lensPrograms[2],"tune[0]");
        lensGlow=glGetUniformLocation(lensPrograms[2],"glow");lensHeat=glGetUniformLocation(lensPrograms[2],"heat[0]");lensClock=glGetUniformLocation(lensPrograms[2],"clock");lensLift=glGetUniformLocation(lensPrograms[2],"lift");
        glGenFramebuffers(3,lensFbo);

    return 1;
}
void astra_lens(int x,int y,int w,int h){
    if(lensOn<0)lensOn=EM_ASM_INT(return !!Module.astra);
    if(!lensOn||lensFailed||w<240||h<160)return;
    int sw=(w+3)/4,sh=(h+3)/4;
    if(!lensFbo[0]&&!warm_astra_lens()){return;}
    GLint vp[4],fb;glGetIntegerv(GL_VIEWPORT,vp);glGetIntegerv(GL_FRAMEBUFFER_BINDING,&fb);
    GLboolean blend=glIsEnabled(GL_BLEND),depth=glIsEnabled(GL_DEPTH_TEST),cull=glIsEnabled(GL_CULL_FACE),sc=glIsEnabled(GL_SCISSOR_TEST);
    glDisable(GL_SCISSOR_TEST);glDisable(GL_BLEND);glDisable(GL_DEPTH_TEST);glDisable(GL_CULL_FACE);glDepthMask(GL_FALSE);
    glActiveTexture(GL_TEXTURE0);
    if(lensW!=w||lensH!=h){
        lensCopyChecked=0;
        lens_texture(&lensScene,w,h);lens_texture(lensSmall,sw,sh);lens_texture(lensSmall+1,sw,sh);lens_texture(lensSmall+2,sw,sh);lensW=w;lensH=h;
        for(int i=0;i<3;i++){
            glBindFramebuffer(GL_FRAMEBUFFER,lensFbo[i]);glFramebufferTexture2D(GL_FRAMEBUFFER,GL_COLOR_ATTACHMENT0,GL_TEXTURE_2D,lensSmall[i],0);
            if(glCheckFramebufferStatus(GL_FRAMEBUFFER)!=GL_FRAMEBUFFER_COMPLETE){lensFailed=1;goto restore_lens;}
        }
        glBindFramebuffer(GL_FRAMEBUFFER,fb);
    }
    /* Validate a new copy configuration once. Repeating synchronous error
     * queries after every identical copy stalls the CPU behind the GPU. */
    int checkCopy=!lensCopyChecked||lensCopyX!=x||lensCopyY!=y||lensCopyFb!=fb;
    if(checkCopy)for(int i=0;i<4 && glGetError()!=GL_NO_ERROR;i++){}
    glBindTexture(GL_TEXTURE_2D,lensScene);glCopyTexSubImage2D(GL_TEXTURE_2D,0,0,0,x,y,w,h);
    if(checkCopy){if(glGetError()!=GL_NO_ERROR){lensFailed=1;goto restore_lens;}lensCopyChecked=1;lensCopyX=x;lensCopyY=y;lensCopyFb=fb;}
    glBindFramebuffer(GL_FRAMEBUFFER,lensFbo[0]);glViewport(0,0,sw,sh);
    static const float quad[]={-1,-1,1,-1,-1,1,1,1};
    glEnableClientState(GL_VERTEX_ARRAY);glVertexPointer(2,GL_FLOAT,0,quad);
    float cinema=astra_cinema();
    /* Bright pass, narrow blur (horizontal, vertical), then the wide level blurred again from the narrow one. */
    static const int from[5]={-1,0,1,0,1},into[5]={0,1,0,1,2};
    for(int pass=0;pass<(cinema>0?5:3);pass++){
        glBindFramebuffer(GL_FRAMEBUFFER,lensFbo[into[pass]]);
        GLuint pg=lensPrograms[pass?1:0];glUseProgram(pg);
        glBindTexture(GL_TEXTURE_2D,pass?lensSmall[from[pass]]:lensScene);
        float spread=pass<3?1.72f:3.4f;
        if(!pass)glUniform1f(lensCut,.54f-ac_tune[9]*cinema);
        glUniform2f(lensStep[pass?1:0],pass==0?1.f/w:(pass&1?spread/sw:0.f),pass==0?1.f/h:(pass&1?0.f:spread/sh));
        glDrawArrays(GL_TRIANGLE_STRIP,0,4);
    }
    glBindFramebuffer(GL_FRAMEBUFFER,fb);glViewport(x,y,w,h);glUseProgram(lensPrograms[2]);glBindTexture(GL_TEXTURE_2D,lensScene);
    glActiveTexture(GL_TEXTURE1);glBindTexture(GL_TEXTURE_2D,lensSmall[0]);glUniform1i(lensGlow,1);
    GLint unit2=0;glActiveTexture(GL_TEXTURE2);glGetIntegerv(GL_TEXTURE_BINDING_2D,&unit2);glBindTexture(GL_TEXTURE_2D,lensSmall[2]);glUniform1i(lensWide,2);glUniform1f(lensCinema,cinema);
    {float tune[12]={ac_tune[4],ac_tune[5],ac_tune[6],ac_tune[7],ac_tune[8],ac_tune[9],ac_tune[10],0,ac_tune[11],0,0,0};glUniform4fv(lensTune,3,tune);}
    glActiveTexture(GL_TEXTURE0);float heat[4][4]={{0}};if(ah_frame==framecount&&astra_detail_upgrade&&!astra_native_compare)memcpy(heat,ah_regions,ah_count*sizeof heat[0]);glUniform4fv(lensHeat,4,&heat[0][0]);glUniform1f(lensClock,al_clock());
    {static float lift=-1;static int asked;if(lift<0||framecount-asked>20||framecount<asked){asked=framecount;lift=2*EM_ASM_DOUBLE(return Math.max(0,Math.min(1,Module.comfort?.brightness??.4)));}glUniform1f(lensLift,lift);}
    glDrawArrays(GL_TRIANGLE_STRIP,0,4);
    glActiveTexture(GL_TEXTURE2);glBindTexture(GL_TEXTURE_2D,unit2);glActiveTexture(GL_TEXTURE0);
    restore_lens:
    glBindFramebuffer(GL_FRAMEBUFFER,fb);glDisableClientState(GL_VERTEX_ARRAY);glUseProgram(0);glViewport(vp[0],vp[1],vp[2],vp[3]);glDepthMask(GL_TRUE);
    if(blend)glEnable(GL_BLEND);if(depth)glEnable(GL_DEPTH_TEST);if(cull)glEnable(GL_CULL_FACE);if(sc)glEnable(GL_SCISSOR_TEST);
}


