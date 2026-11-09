/* Spatial edge filtering before the HUD. No temporal history or camera changes.
 * Clamp-to-edge NPOT storage follows the current 3D viewport on every resize. */
static GLuint warm_astra_smooth_edges_program,warm_astra_smooth_edges_texture;static int warm_astra_smooth_edges_width,warm_astra_smooth_edges_height,warm_astra_smooth_edges_failed;
static int warm_astra_smooth_edges(void){
    if(warm_astra_smooth_edges_failed)return 0;if(warm_astra_smooth_edges_program)return 1;

        const char *vs="varying highp vec2 uv;void main(){gl_Position=vec4(gl_Vertex.xy,0.,1.);uv=gl_Vertex.xy*.5+.5;}";
        const char *fs="precision highp float;varying highp vec2 uv;uniform sampler2D scene;uniform vec2 pixel;"
          "vec3 tap(vec2 q){return texture2D(scene,clamp(q,pixel*.5,1.-pixel*.5)).rgb;}float luma(vec3 c){return dot(c,vec3(.299,.587,.114));}"
          "void main(){vec3 c=tap(uv);float m=luma(c),a=luma(tap(uv+pixel*vec2(-1.,1.))),b=luma(tap(uv+pixel)),d=luma(tap(uv-pixel)),e=luma(tap(uv+pixel*vec2(1.,-1.)));"
          "float lo=min(m,min(min(a,b),min(d,e))),hi=max(m,max(max(a,b),max(d,e)));if(hi-lo<max(.045,hi*.14)){gl_FragColor=vec4(c,1.);return;}"
          "vec2 dir=vec2(-((a+b)-(d+e)),(a+d)-(b+e));float reduce=max((a+b+d+e)*.03125,.0078125);"
          "dir=clamp(dir/(min(abs(dir.x),abs(dir.y))+reduce),vec2(-6.),vec2(6.))*pixel;"
          "vec3 narrow=(tap(uv-dir/6.)+tap(uv+dir/6.))*.5;vec3 wide=narrow*.5+(tap(uv-dir*.5)+tap(uv+dir*.5))*.25;float l=luma(wide);"
          "vec3 result=l<lo||l>hi?narrow:wide;gl_FragColor=vec4(mix(c,result,.82),1.);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){warm_astra_smooth_edges_failed=1;return 0;}
        warm_astra_smooth_edges_program=glCreateProgram();glAttachShader(warm_astra_smooth_edges_program,v);glAttachShader(warm_astra_smooth_edges_program,f);glLinkProgram(warm_astra_smooth_edges_program);glDeleteShader(v);glDeleteShader(f);
        GLint ok;glGetProgramiv(warm_astra_smooth_edges_program,GL_LINK_STATUS,&ok);if(!ok){warm_astra_smooth_edges_failed=1;return 0;}

    return 1;
}
static void astra_smooth_edges(void){

    if(!ax_on()||!astra_refinement||warm_astra_smooth_edges_failed)return;
    if(!warm_astra_smooth_edges_program&&!warm_astra_smooth_edges()){return;}
    GLint viewport[4],active,bound,previous;GLboolean mask;
    glGetIntegerv(GL_VIEWPORT,viewport);int w=viewport[2],h=viewport[3];if(w<2||h<2)return;
    glGetIntegerv(GL_ACTIVE_TEXTURE,&active);glActiveTexture(GL_TEXTURE0);glGetIntegerv(GL_TEXTURE_BINDING_2D,&bound);glGetIntegerv(GL_CURRENT_PROGRAM,&previous);mask=astra_depth_write;
    if(!warm_astra_smooth_edges_texture)glGenTextures(1,&warm_astra_smooth_edges_texture);glBindTexture(GL_TEXTURE_2D,warm_astra_smooth_edges_texture);
    if(w!=warm_astra_smooth_edges_width||h!=warm_astra_smooth_edges_height){
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE);
        glCopyTexImage2D(GL_TEXTURE_2D,0,GL_RGB,viewport[0],viewport[1],w,h,0);warm_astra_smooth_edges_width=w;warm_astra_smooth_edges_height=h;
    }else glCopyTexSubImage2D(GL_TEXTURE_2D,0,0,0,viewport[0],viewport[1],w,h);
    GLboolean blend=glIsEnabled(GL_BLEND),depth=glIsEnabled(GL_DEPTH_TEST),cull=glIsEnabled(GL_CULL_FACE),alpha=glIsEnabled(GL_ALPHA_TEST);
    glDisable(GL_BLEND);glDisable(GL_DEPTH_TEST);glDisable(GL_CULL_FACE);glDisable(GL_ALPHA_TEST);glDepthMask(GL_FALSE);
    glUseProgram(warm_astra_smooth_edges_program);glUniform1i(glGetUniformLocation(warm_astra_smooth_edges_program,"scene"),0);glUniform2f(glGetUniformLocation(warm_astra_smooth_edges_program,"pixel"),1.f/w,1.f/h);
    const float p[]={-1,-1,3,-1,-1,3};glEnableClientState(GL_VERTEX_ARRAY);glVertexPointer(2,GL_FLOAT,0,p);glDrawArrays(GL_TRIANGLES,0,3);glDisableClientState(GL_VERTEX_ARRAY);
    glUseProgram(previous);glBindTexture(GL_TEXTURE_2D,bound);glActiveTexture(active);glDepthMask(mask);
    if(blend)glEnable(GL_BLEND);if(depth)glEnable(GL_DEPTH_TEST);if(cull)glEnable(GL_CULL_FACE);if(alpha)glEnable(GL_ALPHA_TEST);
    EM_ASM(Module.edgeSmoothing=22;Module.edgeViewport=([$0,$1]);,w,h);
}
