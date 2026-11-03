/* Hot fragments follow reproducible directions in mine coordinates. */
int astra_blast(vms_vector *where,fix radius,float age,unsigned signature,int kind)
{
    static int enabled=-1;
    if(enabled<0)enabled=EM_ASM_INT(return !!Module.astra);
    if(!enabled || age<0 || age>=1 || radius<F1_0/3)return 0;
    g3s_point center;g3_rotate_point(&center,where);
    float z=f2fl(center.p3_z),r=f2fl(radius);
    if(z < -1.8f*r || z>300 || r/fmaxf(1,z)<.003f)return 0;
    if(!astra_fire_volume(&center,r,age,signature,kind))return 0;
    const int counts[]={21,12,32,15,36,28,40,16};
    const float *tint=astra_effect_color(kind);
    float verts[40*9],colors[40*12];int count=0;
    const vms_matrix *m=&Unscaled_matrix;
    float sx=f2fl(Matrix_scale.x),sy=f2fl(Matrix_scale.y),sz=f2fl(Matrix_scale.z);
    float burst=age*(2-age),tail=1-age;
    for(int i=0;i<counts[kind];i++){
        unsigned h=cloud_hash(signature,i,97);
        float az=(h&65535)*(6.2831853f/65536.f),v=(h>>16)*(2.f/65536.f)-1;
        float radial=sqrtf(fmaxf(0,1-v*v)),a=radial*cosf(az),b=radial*sinf(az);
        float dx=a*f2fl(m->rvec.x)+v*f2fl(m->rvec.y)+b*f2fl(m->rvec.z);
        float dy=a*f2fl(m->uvec.x)+v*f2fl(m->uvec.y)+b*f2fl(m->uvec.z);
        float dz=a*f2fl(m->fvec.x)+v*f2fl(m->fvec.y)+b*f2fl(m->fvec.z);
        float speed=1.2f+(h%317)*.0045f,head=r*(.18f+speed*burst);
        float length=r*(.055f+.24f*tail)*(kind==1||kind==4?2.35f:1.f),halfWidth=r*(.009f+.013f*tail);
        float norm=1.f/fmaxf(.08f,sqrtf(dx*dx+dy*dy));
        for(int j=0;j<3;j++){
            float travel=j?head:head-length,side=(j==1?1:j==2?-1:0)*halfWidth*norm;
            verts[count*3]=f2fl(center.p3_x)+sx*(dx*travel-dy*side);
            verts[count*3+1]=f2fl(center.p3_y)+sy*(dy*travel+dx*side);
            verts[count*3+2]=-z-sz*dz*travel;
            for(int c=0;c<3;c++)colors[count*4+c]=j?.45f+.55f*tint[c]:.50f*tint[c];
            colors[count*4+3]=j?tail*.90f:0;count++;
        }
    }
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;
    GLboolean cull=glIsEnabled(GL_CULL_FACE);glDisable(GL_CULL_FACE);
    gr_settransblend(GR_FADE_OFF,GR_BLEND_ADDITIVE_A);OGL_DISABLE(TEXTURE_2D);glDepthMask(GL_FALSE);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_COLOR_ARRAY);
    glVertexPointer(3,GL_FLOAT,0,verts);glColorPointer(4,GL_FLOAT,0,colors);glDrawArrays(GL_TRIANGLES,0,count);
    glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);
    if(cull)glEnable(GL_CULL_FACE);glDepthMask(GL_TRUE);gr_settransblend(fade,blend);
    return 1;
}
