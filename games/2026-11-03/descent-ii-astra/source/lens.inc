/* Apply the optical response only to the mine camera, before cockpit and HUD.
   The high pass and separable blur run at one-quarter resolution. */
static GLuint lensScene,lensSmall[2],lensFbo[2],lensPrograms[3];static int lensW,lensH,lensFailed,lensOn=-1;
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
void astra_lens(int x,int y,int w,int h){
    if(lensOn<0)lensOn=EM_ASM_INT(return !!Module.astra);
    if(!lensOn||lensFailed||w<240||h<160)return;
    int sw=(w+3)/4,sh=(h+3)/4;
    if(!lensFbo[0]){
        lensPrograms[0]=lens_program("precision mediump float;varying mediump vec2 uv;uniform sampler2D src;uniform vec2 stepUV;"
            "vec3 high(vec2 p){vec3 a=texture2D(src,p).rgb;float lum=max(a.r,max(a.g,a.b));return a*smoothstep(.54,.96,lum)*(.27+.73*lum);}"
            "void main(){vec2 d=stepUV*1.35;gl_FragColor=vec4(.25*(high(uv+d)+high(uv-d)+high(uv+vec2(d.x,-d.y))+high(uv+vec2(-d.x,d.y))),1.);}");
        lensPrograms[1]=lens_program("precision mediump float;varying mediump vec2 uv;uniform sampler2D src;uniform vec2 stepUV;"
            "void main(){vec3 c=texture2D(src,uv).rgb*.227; c+=(texture2D(src,uv+stepUV*1.385).rgb+texture2D(src,uv-stepUV*1.385).rgb)*.316;"
            "c+=(texture2D(src,uv+stepUV*3.231).rgb+texture2D(src,uv-stepUV*3.231).rgb)*.0705;gl_FragColor=vec4(c,1.);}");
        lensPrograms[2]=lens_program("precision mediump float;varying mediump vec2 uv;uniform sampler2D src,glow;"
            "void main(){vec3 a=texture2D(src,uv).rgb,b=texture2D(glow,uv).rgb;vec3 c=a*(.89+.12*a)+b*.57;"
            "c=mix(c,vec3(.014,.030,.040),.09*(1.-max(a.r,max(a.g,a.b))));"
            "c=c/(1.+.18*max(c-.70,vec3(0.))); vec2 e=uv*2.-1.;c*=1.-.052*dot(e,e);gl_FragColor=vec4(c,1.);}");
        if(!lensPrograms[0]||!lensPrograms[1]||!lensPrograms[2]){lensFailed=1;return;}
        glGenFramebuffers(2,lensFbo);
    }
    GLint vp[4],fb;glGetIntegerv(GL_VIEWPORT,vp);glGetIntegerv(GL_FRAMEBUFFER_BINDING,&fb);
    GLboolean blend=glIsEnabled(GL_BLEND),depth=glIsEnabled(GL_DEPTH_TEST),cull=glIsEnabled(GL_CULL_FACE),sc=glIsEnabled(GL_SCISSOR_TEST);
    glDisable(GL_SCISSOR_TEST);glDisable(GL_BLEND);glDisable(GL_DEPTH_TEST);glDisable(GL_CULL_FACE);glDepthMask(GL_FALSE);
    glActiveTexture(GL_TEXTURE0);
    if(lensW!=w||lensH!=h){
        lens_texture(&lensScene,w,h);lens_texture(lensSmall,sw,sh);lens_texture(lensSmall+1,sw,sh);lensW=w;lensH=h;
        for(int i=0;i<2;i++){
            glBindFramebuffer(GL_FRAMEBUFFER,lensFbo[i]);glFramebufferTexture2D(GL_FRAMEBUFFER,GL_COLOR_ATTACHMENT0,GL_TEXTURE_2D,lensSmall[i],0);
            if(glCheckFramebufferStatus(GL_FRAMEBUFFER)!=GL_FRAMEBUFFER_COMPLETE){lensFailed=1;goto restore_lens;}
        }
        glBindFramebuffer(GL_FRAMEBUFFER,fb);
    }
    for(int i=0;i<4 && glGetError()!=GL_NO_ERROR;i++){}
    glBindTexture(GL_TEXTURE_2D,lensScene);glCopyTexSubImage2D(GL_TEXTURE_2D,0,0,0,x,y,w,h);
    if(glGetError()!=GL_NO_ERROR){lensFailed=1;goto restore_lens;}
    glBindFramebuffer(GL_FRAMEBUFFER,lensFbo[0]);glViewport(0,0,sw,sh);
    static const float quad[]={-1,-1,1,-1,-1,1,1,1};
    glEnableClientState(GL_VERTEX_ARRAY);glVertexPointer(2,GL_FLOAT,0,quad);
    for(int pass=0;pass<3;pass++){
        glBindFramebuffer(GL_FRAMEBUFFER,lensFbo[pass&1]);
        GLuint pg=lensPrograms[pass?1:0];glUseProgram(pg);
        glBindTexture(GL_TEXTURE_2D,pass?lensSmall[(pass+1)&1]:lensScene);
        glUniform2f(glGetUniformLocation(pg,"stepUV"),pass==0?1.f/w:(pass==1?1.72f/sw:0.f),pass==0?1.f/h:(pass==2?1.72f/sh:0.f));
        glDrawArrays(GL_TRIANGLE_STRIP,0,4);
    }
    glBindFramebuffer(GL_FRAMEBUFFER,fb);glViewport(x,y,w,h);glUseProgram(lensPrograms[2]);glBindTexture(GL_TEXTURE_2D,lensScene);
    glActiveTexture(GL_TEXTURE1);glBindTexture(GL_TEXTURE_2D,lensSmall[0]);glUniform1i(glGetUniformLocation(lensPrograms[2],"glow"),1);
    glActiveTexture(GL_TEXTURE0);glDrawArrays(GL_TRIANGLE_STRIP,0,4);
    restore_lens:
    glBindFramebuffer(GL_FRAMEBUFFER,fb);glDisableClientState(GL_VERTEX_ARRAY);glUseProgram(0);glViewport(vp[0],vp[1],vp[2],vp[3]);glDepthMask(GL_TRUE);
    if(blend)glEnable(GL_BLEND);if(depth)glEnable(GL_DEPTH_TEST);if(cull)glEnable(GL_CULL_FACE);if(sc)glEnable(GL_SCISSOR_TEST);
}


