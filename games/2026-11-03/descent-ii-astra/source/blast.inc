/* Draw sparks and the initial pressure flash without creating any game objects. */
int astra_blast(vms_vector *where,fix radius,float age,unsigned signature)
{
    static int enabled=-1;
    if(enabled<0)enabled=EM_ASM_INT(return !!Module.astra);
    if(!enabled || age<0 || age>=1 || radius<F1_0/3)return 0;
    g3s_point center;g3_rotate_point(&center,where);
    float z=f2fl(center.p3_z),r=f2fl(radius);
    if(z<r*.2f || z>260 || r/z<.003f)return 0;
    const float x=f2fl(center.p3_x),y=f2fl(center.p3_y),sx=f2fl(Matrix_scale.x),sy=f2fl(Matrix_scale.y);
    float vertices[420*3],colors[420*4];int count=0;
    astra_fire_layers(where,radius,age,signature);
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;
    gr_settransblend(GR_FADE_OFF,GR_BLEND_ADDITIVE_A);
    OGL_DISABLE(TEXTURE_2D);glDepthMask(GL_FALSE);
    #define SPARK_VERTEX(X,Y,Z,R,G,B,A) do {float *vp=vertices+3*count,*cp=colors+4*count;vp[0]=x+(X)*sx;vp[1]=y+(Y)*sy;vp[2]=-z+(Z);cp[0]=(R);cp[1]=(G);cp[2]=(B);cp[3]=(A);count++;} while(0)
    float tail=1-age;
    if(age<.56f){
        float inner=(.18f+1.65f*age)*r,outer=inner+r*.065f*tail;
        float alpha=.37f*(1-age/.56f);
        for(int i=0;i<32;i++){
            float a=i*.19634954f,b=(i+1)*.19634954f,u=cosf(a),v=sinf(a),s=cosf(b),t=sinf(b);
            SPARK_VERTEX(u*inner,v*inner,0,1,.65,.28,alpha);
            SPARK_VERTEX(u*outer,v*outer,0,1,.39,.14,0);
            SPARK_VERTEX(s*outer,t*outer,0,1,.39,.14,0);
            SPARK_VERTEX(u*inner,v*inner,0,1,.65,.28,alpha);
            SPARK_VERTEX(s*outer,t*outer,0,1,.39,.14,0);
            SPARK_VERTEX(s*inner,t*inner,0,1,.65,.28,alpha);
        }
    }
    unsigned state=signature*2654435761u+7163;
    for(int i=0;i<22;i++){
        state=1664525u*state+1013904223u;
        float angle=(state>>8)*(6.2831853f/16777216.f);
        state=1664525u*state+1013904223u;
        float depth=(state>>8)*(2.f/16777216.f)-1;
        float span=sqrtf(fmaxf(.001f,1-depth*depth)),dx=cosf(angle)*span,dy=sinf(angle)*span;
        float scale=r*(.25f+(1-tail*tail)*(1.25f+(state&63)/64.f));
        float len=r*(.12f+.14f*tail),width=r*.018f*tail;
        SPARK_VERTEX(dx*(scale-len),dy*(scale-len),depth*scale,1,.24,.035,0);
        SPARK_VERTEX(dx*scale-dy*width,dy*scale+dx*width,depth*scale,1,.88,.45,tail*.9f);
        SPARK_VERTEX(dx*scale+dy*width,dy*scale-dx*width,depth*scale,1,.70,.22,tail*.9f);
    }
    #undef SPARK_VERTEX
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_COLOR_ARRAY);
    glVertexPointer(3,GL_FLOAT,0,vertices);glColorPointer(4,GL_FLOAT,0,colors);
    glDrawArrays(GL_TRIANGLES,0,count);
    glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);
    glDepthMask(GL_TRUE);gr_settransblend(fade,blend);
    return 1;
}

