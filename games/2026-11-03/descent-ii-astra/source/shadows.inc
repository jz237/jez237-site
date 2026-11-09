/* Receiver-plane silhouette maps. Render the actual ship/machinery triangles
 * from a visible room fixture, then soften the union once on the receiving wall.
 * RGBA8 only: no depth-texture extension or driver-dependent float targets. */
static int ss_capture,ss_failed,ss_size,ss_passes,ss_draws,ss_quality;
static GLuint ss_program,ss_texture,ss_fbo;
static float ss_center[3],ss_right[3],ss_up[3],ss_normal[3],ss_light[3],ss_width,ss_height;
static GLint ss_old_vp[4],ss_old_fb,ss_old_texture;
static GLboolean ss_old_blend,ss_old_depth,ss_old_cull,ss_old_scissor,ss_old_write;
static GLfloat ss_old_clear[4];
int astra_shadowing(void){return ss_capture;}
int astra_shadow_face(int count,const g3s_point **points){
    if(!ss_capture)return 0;if(count<3||count>100)return 1;
    float data[300],identity[9]={1,0,0,0,1,0,0,0,1};
    for(int i=0;i<count;i++){data[i*3]=f2fl(points[i]->p3_x)/f2fl(Matrix_scale.x);data[i*3+1]=f2fl(points[i]->p3_y)/f2fl(Matrix_scale.y);data[i*3+2]=-f2fl(points[i]->p3_z)/f2fl(Matrix_scale.z);}
    glUseProgram(ss_program);glUniformMatrix3fv(glGetUniformLocation(ss_program,"axis"),1,GL_FALSE,identity);glUniform3f(glGetUniformLocation(ss_program,"origin"),0,0,0);
    glEnableClientState(GL_VERTEX_ARRAY);glVertexPointer(3,GL_FLOAT,0,data);glDrawArrays(GL_TRIANGLE_FAN,0,count);glDisableClientState(GL_VERTEX_ARRAY);ss_draws++;return 1;
}
static void ss_vec(float *out,const vms_vector *in,int point){
    vms_vector v;if(point){g3s_point p;g3_rotate_point(&p,in);v=p.p3_vec;}else g3_rotate_delta_vec(&v,in);
    out[0]=f2fl(v.x)/f2fl(Matrix_scale.x);out[1]=f2fl(v.y)/f2fl(Matrix_scale.y);out[2]=-f2fl(v.z)/f2fl(Matrix_scale.z);
}
static void ss_draw(const float *vertices,int stride,int count,const vms_vector *scale,const vms_vector *offset){
    if(!ss_capture||!count)return;
    float axis[9],origin[3];for(int k=0;k<3;k++){
        vms_vector v={0};if(k==0)v.x=scale->x;else if(k==1)v.y=scale->y;else v.z=scale->z;ss_vec(axis+k*3,&v,0);
    }ss_vec(origin,offset,1);
    glUseProgram(ss_program);glUniformMatrix3fv(glGetUniformLocation(ss_program,"axis"),1,GL_FALSE,axis);
    glUniform3fv(glGetUniformLocation(ss_program,"origin"),1,origin);
    glEnableClientState(GL_VERTEX_ARRAY);glVertexPointer(3,GL_FLOAT,stride,vertices);glDrawArrays(GL_TRIANGLES,0,count);glDisableClientState(GL_VERTEX_ARRAY);
    ss_draws++;
}
static int warm_ss_start(void){
    if(ss_failed)return 0;if(ss_program)return 1;

        const char *vs="uniform mat3 axis;uniform vec3 origin,center,right,up,normal,lamp;uniform vec2 size;varying highp float height;"
          "void main(){vec3 P=axis*gl_Vertex.xyz+origin,D=P-lamp;float denom=dot(D,normal);"
          "float factor=dot(center-lamp,normal)/min(-.0001,denom);vec3 H=lamp+D*factor-center;"
          "gl_Position=vec4(2.*vec2(dot(H,right),dot(H,up))/size,0.,1.);height=dot(P-center,normal);}";
        const char *fs="precision highp float;varying highp float height;uniform float lampHeight;void main(){if(height<.018||height>lampHeight-.03)discard;gl_FragColor=vec4(1.);}";
        GLuint v=astra_compile(GL_VERTEX_SHADER,vs),f=astra_compile(GL_FRAGMENT_SHADER,fs);if(!v||!f){ss_failed=1;return 0;}
        ss_program=glCreateProgram();glAttachShader(ss_program,v);glAttachShader(ss_program,f);glLinkProgram(ss_program);glDeleteShader(v);glDeleteShader(f);
        GLint ok;glGetProgramiv(ss_program,GL_LINK_STATUS,&ok);if(!ok){ss_failed=1;return 0;}
        glGenFramebuffers(1,&ss_fbo);glGenTextures(1,&ss_texture);

    return 1;
}
static int ss_start(const vms_vector *center,const vms_matrix *basis,float width,float height,const vms_vector *lamp){
    if(ss_failed)return 0;
    if(!ss_program&&!warm_ss_start()){return 0;}
    glGetIntegerv(GL_VIEWPORT,ss_old_vp);glGetIntegerv(GL_FRAMEBUFFER_BINDING,&ss_old_fb);
    glActiveTexture(GL_TEXTURE0);glGetIntegerv(GL_TEXTURE_BINDING_2D,&ss_old_texture);
    ss_old_blend=glIsEnabled(GL_BLEND);ss_old_depth=glIsEnabled(GL_DEPTH_TEST);ss_old_cull=glIsEnabled(GL_CULL_FACE);ss_old_scissor=glIsEnabled(GL_SCISSOR_TEST);
    ss_old_write=astra_depth_write;memcpy(ss_old_clear,astra_clear_value,sizeof ss_old_clear);
    glDisable(GL_BLEND);glDisable(GL_DEPTH_TEST);glDisable(GL_CULL_FACE);glDisable(GL_SCISSOR_TEST);glDepthMask(GL_FALSE);
    glBindTexture(GL_TEXTURE_2D,ss_texture);int size=ss_quality==2?1024:512,resized=ss_size!=size;
    if(ss_size!=size){
        ss_size=size;glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,size,size,0,GL_RGBA,GL_UNSIGNED_BYTE,NULL);
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE);
    }
    glBindFramebuffer(GL_FRAMEBUFFER,ss_fbo);if(resized)glFramebufferTexture2D(GL_FRAMEBUFFER,GL_COLOR_ATTACHMENT0,GL_TEXTURE_2D,ss_texture,0);
    ss_capture=1;
    if(resized&&glCheckFramebufferStatus(GL_FRAMEBUFFER)!=GL_FRAMEBUFFER_COMPLETE){ss_failed=1;return 0;}
    glViewport(0,0,size,size);glClearColor(0,0,0,0);glClear(GL_COLOR_BUFFER_BIT);
    ss_vec(ss_center,center,1);ss_vec(ss_light,lamp,1);ss_vec(ss_right,&basis->rvec,0);ss_vec(ss_up,&basis->uvec,0);ss_vec(ss_normal,&basis->fvec,0);
    ss_width=width;ss_height=height;
    glUseProgram(ss_program);
    glUniform3fv(glGetUniformLocation(ss_program,"center"),1,ss_center);glUniform3fv(glGetUniformLocation(ss_program,"right"),1,ss_right);
    glUniform3fv(glGetUniformLocation(ss_program,"up"),1,ss_up);glUniform3fv(glGetUniformLocation(ss_program,"normal"),1,ss_normal);glUniform3fv(glGetUniformLocation(ss_program,"lamp"),1,ss_light);
    glUniform2f(glGetUniformLocation(ss_program,"size"),width,height);
    vms_vector delta;vm_vec_sub(&delta,lamp,center);glUniform1f(glGetUniformLocation(ss_program,"lampHeight"),f2fl(vm_vec_dot(&delta,&basis->fvec)));
    return 1;
}
static void ss_end(void){
    if(!ss_capture)return;ss_capture=0;glUseProgram(0);
    glBindFramebuffer(GL_FRAMEBUFFER,ss_old_fb);glViewport(ss_old_vp[0],ss_old_vp[1],ss_old_vp[2],ss_old_vp[3]);
    glBindTexture(GL_TEXTURE_2D,ss_old_texture);glClearColor(ss_old_clear[0],ss_old_clear[1],ss_old_clear[2],ss_old_clear[3]);glDepthMask(ss_old_write);
    if(ss_old_blend)glEnable(GL_BLEND);if(ss_old_depth)glEnable(GL_DEPTH_TEST);if(ss_old_cull)glEnable(GL_CULL_FACE);if(ss_old_scissor)glEnable(GL_SCISSOR_TEST);
}
