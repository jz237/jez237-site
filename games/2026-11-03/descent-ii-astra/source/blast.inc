/* The cloud consists of a hot central mass, asymmetric venting branches, a
 * colder swept-up mantle and small incandescent fragments. All offsets are in
 * mine space. Each camera independently depth-sorts the optical slabs. */
extern const float *astra_effect_color(int);
enum { PLUME_PARTS=52, PLUME_SLICES=8 };
typedef struct {float x,y,z,r,heat,spin,opacity,lamp[3];} pyro_part;
typedef struct {int part; float z,local,step;} pyro_slice;
typedef struct {float p[3],uvw[4],color[4],n[3];} pyro_vertex;
static float pyro_dot(const float *p,const vms_vector *axis)
{return p[0]*f2fl(axis->x)+p[1]*f2fl(axis->y)+p[2]*f2fl(axis->z);}
static void pyro_dir(unsigned seed,int i,float *dir)
{
    float h=2*pyro_random(seed,i,19)-1,a=6.2831853f*pyro_random(seed,i,21);
    float w=sqrtf(fmaxf(0,1-h*h));dir[0]=cosf(a)*w;dir[1]=h;dir[2]=sinf(a)*w;
}
static void pyro_add(pyro_part *p,const float *origin,const float *offset,float radius,float heat,float spin,float opacity)
{
    const vms_matrix *m=&Unscaled_matrix;
    float dx=pyro_dot(offset,&m->rvec),dy=pyro_dot(offset,&m->uvec),dz=pyro_dot(offset,&m->fvec);
    p->x=origin[0]+dx;p->y=origin[1]+dy;p->z=origin[2]+dz;p->r=radius;p->heat=heat;p->spin=spin;p->opacity=opacity;
    /* Lighting points back into the incandescent core. A small key-light
     * offset gives even the central billow a readable illuminated side. */
    p->lamp[0]=-dx/radius-.38f;p->lamp[1]=-dy/radius+.56f;p->lamp[2]=-dz/radius-.28f;
}
static int pyro_slice_order(const void *a,const void *b)
{
    float d=((const pyro_slice*)b)->z-((const pyro_slice*)a)->z;return (d>0)-(d<0);
}
static void pyro_draw_parts(pyro_part *part,int count,float age,int kind,int heavy)
{
    static pyro_vertex vertices[PLUME_PARTS*PLUME_SLICES*6];
    pyro_slice slices[PLUME_PARTS*PLUME_SLICES];int n=0,total=0;
    const float scale[3]={f2fl(Matrix_scale.x),f2fl(Matrix_scale.y),f2fl(Matrix_scale.z)};
    for(int i=0;i<count;i++){
        pyro_part *p=part+i;if(p->opacity<.008f || p->r<.035f || p->z+p->r<.15f)continue;
        float screen=p->r/fmaxf(.2f,p->z);
        if(screen<.0015f || fabsf(p->x)*scale[0]>p->z*scale[2]+p->r*2 || fabsf(p->y)*scale[1]>p->z*scale[2]+p->r*2)continue;
        int planes=screen>.055f?(FrameTime>F1_0/19?5:8):screen>.012f?5:3;float step=2.f/planes;
        for(int j=0;j<planes;j++){float q=-1+(j+.5f)*step,z=p->z+q*p->r;
            if(z*scale[2]>.11f)slices[n++]=(pyro_slice){i,z,q,step};}
    }
    if(!n)return;
    qsort(slices,n,sizeof(*slices),pyro_slice_order);
    static const int corners[][2]={{-1,-1},{1,-1},{1,1},{-1,-1},{1,1},{-1,1}};
    for(int j=0;j<n;j++){
        pyro_slice *s=slices+j;pyro_part *p=part+s->part;
        /* Bound each slab to the cross section of the puff, including the
         * whole integration interval, so small wisps cost very little. */
        float near=fmaxf(0,fabsf(s->local)-.5f*s->step);
        float edge=sqrtf(fmaxf(.005f,1-near*near));
        for(int k=0;k<6;k++){
            pyro_vertex *v=&vertices[total++];float u=corners[k][0]*edge,t=corners[k][1]*edge;
            v->p[0]=(p->x+u*p->r)*scale[0];v->p[1]=(p->y+t*p->r)*scale[1];v->p[2]=-s->z*scale[2];
            v->uvw[0]=u;v->uvw[1]=t;v->uvw[2]=s->local;v->uvw[3]=s->step;
            v->color[0]=p->heat;v->color[1]=p->spin;v->color[2]=heavy?.045f:((kind==1 || kind==4 || kind==7)?.53f:.08f);v->color[3]=p->opacity;
            memcpy(v->n,p->lamp,sizeof(v->n));
        }
    }
    const vms_matrix *m=&Unscaled_matrix;
    float basis[]={f2fl(m->rvec.x),f2fl(m->rvec.y),f2fl(m->rvec.z),f2fl(m->uvec.x),f2fl(m->uvec.y),f2fl(m->uvec.z),f2fl(m->fvec.x),f2fl(m->fvec.y),f2fl(m->fvec.z)};
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;
    GLboolean cull=glIsEnabled(GL_CULL_FACE);glDisable(GL_CULL_FACE);glDepthMask(GL_FALSE);
    gr_settransblend(GR_FADE_OFF,GR_BLEND_NORMAL);OGL_ENABLE(TEXTURE_2D);
    glBindTexture(GL_TEXTURE_2D,ashTexture);glUseProgram(ashProgram);glUniformMatrix3fv(ashBasis,1,GL_FALSE,basis);
    glUniform3fv(ashScale,1,scale);glUniform1f(ashTime,age);glUniform3fv(ashTint,1,astra_effect_color(kind));
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_TEXTURE_COORD_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glEnableClientState(GL_NORMAL_ARRAY);
    glVertexPointer(3,GL_FLOAT,sizeof(pyro_vertex),vertices[0].p);glTexCoordPointer(4,GL_FLOAT,sizeof(pyro_vertex),vertices[0].uvw);
    glColorPointer(4,GL_FLOAT,sizeof(pyro_vertex),vertices[0].color);glNormalPointer(GL_FLOAT,sizeof(pyro_vertex),vertices[0].n);
    glDrawArrays(GL_TRIANGLES,0,total);
    glDisableClientState(GL_NORMAL_ARRAY);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_TEXTURE_COORD_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);
    glUseProgram(0);glDepthMask(GL_TRUE);if(cull)glEnable(GL_CULL_FACE);gr_settransblend(fade,blend);
}
static void pyro_fragments(const float *origin,float size,float t,unsigned seed,int heavy,float visibility)
{
    float p[18*9*3],c[18*9*4];int n=0,number=heavy?12+(seed%7):5+(seed%6);
    const vms_matrix *m=&Unscaled_matrix;
    float sx=f2fl(Matrix_scale.x),sy=f2fl(Matrix_scale.y),sz=f2fl(Matrix_scale.z);
    int idx[]={0,1,2,0,2,3,3,2,4};
    for(int i=0;i<number;i++){
        float delay=.025f+.12f*pyro_random(seed,i,23),age=(t-delay)/(1.04f-delay);
        if(age<=0 || age>=1)continue;
        float d[3];pyro_dir(seed,i+53,d);
        float dx=pyro_dot(d,&m->rvec),dy=pyro_dot(d,&m->uvec),dz=pyro_dot(d,&m->fvec);
        float speed=1.6f+2.2f*pyro_random(seed,i,24),travel=size*speed*(1-expf(-2.6f*age));
        float len=size*(.035f+.27f*(1-age))*(.4f+pyro_random(seed,i,27));
        float w=size*(.012f+.023f*pyro_random(seed,i,28))*(1-.7f*age),norm=fmaxf(.08f,sqrtf(dx*dx+dy*dy));
        float alpha=(1-pyro_ramp(.45f,.98f,age))*(.67f+.33f*cosf(i+14*age));
        const float steps[]={-1,-.20f,-.11f,0,.16f},widths[]={0,1,-1,.40f,0};
        for(int j=0;j<9;j++){
            int k=idx[j];float dist=travel+steps[k]*len,side=widths[k]*w/norm;
            p[n*3]=(origin[0]+dx*dist-dy*side)*sx;p[n*3+1]=(origin[1]+dy*dist+dx*side)*sy;
            p[n*3+2]=-(origin[2]+dz*dist)*sz;
            c[n*4]=1;c[n*4+1]=k==4?.97f:k==3?.83f:.27f;c[n*4+2]=k==4?.66f:k==3?.16f:.025f;
            c[n*4+3]=k==0?0:alpha*visibility;n++;
        }
    }
    if(!n)return;
    int fade=grd_curcanv->cv_fade_level,blend=grd_curcanv->cv_blend_func;GLboolean cull=glIsEnabled(GL_CULL_FACE);
    glDisable(GL_CULL_FACE);gr_settransblend(GR_FADE_OFF,GR_BLEND_ADDITIVE_A);OGL_DISABLE(TEXTURE_2D);glDepthMask(GL_FALSE);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glVertexPointer(3,GL_FLOAT,0,p);glColorPointer(4,GL_FLOAT,0,c);
    glDrawArrays(GL_TRIANGLES,0,n);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);glDepthMask(GL_TRUE);
    if(cull)glEnable(GL_CULL_FACE);gr_settransblend(fade,blend);
}
/* Brief lens response to the ignition kernel. The burning gas itself stays in 3D. */
static void pyro_ignition(const float *origin,float size,float t,float visibility)
{
    if(t<0 || t>=.14f || origin[2]<=.15f)return;
    float power=(1-t/.14f)*(1-t/.14f),r=size*(.22f+.19f*t/.14f);
    float p[36*3],c[36*4];int n=0;
    for(int i=0;i<12;i++){
        for(int j=0;j<3;j++){
            int edge=(i+j-1+12)%12;float a=edge*(6.2831853f/12);
            float extent=j?r*(edge%3==0?1.65f:.50f):0;
            p[3*n]=(origin[0]+cosf(a)*extent)*f2fl(Matrix_scale.x);
            p[3*n+1]=(origin[1]+sinf(a)*extent)*f2fl(Matrix_scale.y);
            p[3*n+2]=-origin[2]*f2fl(Matrix_scale.z);
            c[4*n]=1;c[4*n+1]=j?.32f:.95f;c[4*n+2]=j?.024f:.62f;c[4*n+3]=j?0:power*visibility;n++;
        }
    }
    int f=grd_curcanv->cv_fade_level,b=grd_curcanv->cv_blend_func;
    GLboolean cull=glIsEnabled(GL_CULL_FACE);glDisable(GL_CULL_FACE);
    gr_settransblend(GR_FADE_OFF,GR_BLEND_ADDITIVE_A);OGL_DISABLE(TEXTURE_2D);glDepthMask(GL_FALSE);
    glEnableClientState(GL_VERTEX_ARRAY);glEnableClientState(GL_COLOR_ARRAY);glVertexPointer(3,GL_FLOAT,0,p);glColorPointer(4,GL_FLOAT,0,c);
    glDrawArrays(GL_TRIANGLES,0,n);glDisableClientState(GL_COLOR_ARRAY);glDisableClientState(GL_VERTEX_ARRAY);
    if(cull)glEnable(GL_CULL_FACE);glDepthMask(GL_TRUE);gr_settransblend(f,b);
}
void astra_blast(vms_vector *where,fix radius,float t,unsigned seed,int kind,int heavy)
{
    g3s_point center;g3_rotate_point(&center,where);
    float r=f2fl(radius);float origin[]={f2fl(center.p3_x)/f2fl(Matrix_scale.x),f2fl(center.p3_y)/f2fl(Matrix_scale.y),f2fl(center.p3_z)/f2fl(Matrix_scale.z)};
    if(t<0 || t>=1 || origin[2]<-4*r || origin[2]>450 || r/fmaxf(1,origin[2])<.002f || !astra_pyro_ready())return;
    /* A living pilot can look through effects that engulf the camera.
     * Keep the full cloud when viewed from a distance or in the death camera. */
    extern int Player_is_dead,astra_preview_active;
    float visibility=1;
    if(heavy<2 && !Player_is_dead && !astra_preview_active){
        float distance=sqrtf(origin[0]*origin[0]+origin[1]*origin[1]+origin[2]*origin[2]);
        visibility=.018f+.982f*pyro_ramp(r*1.5f+3,r*5+12,distance);
    }
    int shape=(seed>>8)%5,compact=heavy==1&&shape>=3;
    float rise=.035f+.965f*(1-expf(-5.5f*t));
    float size=r*(heavy?1.23f:.91f);
    float peak=1-pyro_ramp(compact?.22f:.38f,compact?.66f:.90f,t),fade=1-pyro_ramp(.66f,1,t);
    float vent=1-expf(-3.5f*t);
    pyro_part parts[PLUME_PARTS];int count=0;
    float offset[]={0,0,0};
    /* Dense white ignition and a persistent fuel-rich nucleus. */
    pyro_add(parts+count++,origin,offset,size*rise*((compact&&shape==4?.48f:.81f)+.20f*t),.065f+peak*1.025f+.19f*expf(-15*t),pyro_random(seed,0,4),fade);
    int branches=compact?2:heavy?4+(seed%3):3+(seed%2);
    for(int i=0;i<branches;i++){
        float dir[3];pyro_dir(seed,compact&&shape==4?5:i+5,dir);if(compact&&shape==4&&i)for(int k=0;k<3;k++)dir[k]=-dir[k];
        float strength=i==0?1.52f:.55f+.69f*pyro_random(seed,i,31);
        float drift=pyro_random(seed,i,29)-.5f;
        int knots=compact?(shape==3?1:2):heavy?3:2;
        for(int j=0;j<knots;j++){
            float u=(j+1.f)/knots;
            float lag=.07f*u;float grow=pyro_ramp(lag,.24f+lag,t);
            if(grow<.013f)continue;
            float dist=size*strength*vent*(.13f+1.16f*u);
            for(int k=0;k<3;k++)offset[k]=dir[k]*dist;
            offset[1]+=size*(.29f*t*t+drift*u*t*.26f);
            offset[0]+=size*drift*sin(t*4+u*2)*u*.14f;
            float rad=size*(.84f-.45f*u)*(.18f+.82f*grow)*(1+.33f*t);
            float hot=peak*(1.065f-.24f*u+.18f*pyro_random(seed,i*4+j,32))-.05f;
            pyro_add(parts+count++,origin,offset,rad,fmaxf(0,hot),pyro_random(seed,i*4+j,33),fade*(.78f+.2f*grow));
        }
    }
    /* Separate carbon-rich mantle. A few pockets flash through the soot;
     * their positions and lifetimes differ from the main flame. */
    int mantle=compact?(shape==3?3:5):heavy?9:4;
    for(int i=0;i<mantle;i++){
        float u=pyro_ramp(.035f+.045f*pyro_random(seed,i,37),.32f,t);if(u<.01f)continue;
        float dir[3];pyro_dir(seed,50+i,dir);
        float dist=size*u*(.66f+.55f*pyro_random(seed,i,38))*(.82f+.42f*t);
        for(int k=0;k<3;k++)offset[k]=dir[k]*dist;
        offset[1]+=size*.40f*t*t;
        float hot=peak*(.27f+.39f*pyro_random(seed,i,39));
        pyro_add(parts+count++,origin,offset,size*(.37f+.39f*pyro_random(seed,i,40))*(.18f+.82f*u)*(1+.43f*t),hot,pyro_random(seed,i,41),fade*(.33f+.58f*pyro_ramp(.38f,.72f,t)));
    }
    float secondary[4][4];int bursts=0;
    if(heavy==2){
        /* A ship vents along different hull seams each time. Detached burning
         * sections ignite in sequence inside the old cloud, illuminating its
         * already cooled mantle for a second time. */
        for(int i=0;i<4;i++){
            unsigned h=cloud_hash(seed,311+i,509);
            extern float astra_death_burst_time(unsigned,int);
            float onset=astra_death_burst_time(seed,i);
            float u=(t-onset)/(.30f+.08f*pyro_random(seed,i,62));
            if(u<=0 || u>=1)continue;
            float d[3];pyro_dir(seed,i+73,d);
            float dist=size*(.37f+i*.22f+pyro_random(seed,i,68)*.74f)*(1+.28f*u);
            for(int k=0;k<3;k++)offset[k]=d[k]*dist;
            float q=(.68f+.26f*pyro_random(seed,i,66))*(.04f+.96f*(1-expf(-u*7)));
            float flame=1.13f*(1-pyro_ramp(.21f,.83f,u)),opacity=1-pyro_ramp(.56f,1,u);
            pyro_add(parts+count++,origin,offset,size*q,flame,pyro_random(h,i,71),opacity);
            float *b=secondary[bursts++];const vms_matrix *m=&Unscaled_matrix;
            b[0]=origin[0]+pyro_dot(offset,&m->rvec);b[1]=origin[1]+pyro_dot(offset,&m->uvec);
            b[2]=origin[2]+pyro_dot(offset,&m->fvec);b[3]=u;
            for(int k=0;k<3;k++)offset[k]+=d[k]*size*.52f*q;
            pyro_add(parts+count++,origin,offset,size*q*.73f,flame*.84f,pyro_random(h,i,72),opacity*.83f);
        }
        for(int i=0;i<4;i++){
            float d[3];pyro_dir(seed,i+53,d);
            for(int j=1;j<=3;j++){
                float u=j/3.f,travel=size*(1.65f+pyro_random(seed,i,24))*(1-expf(-2.7f*t))*u;
                for(int k=0;k<3;k++)offset[k]=travel*d[k];
                float width=size*(.13f+.12f*(1-u)+.16f*t);
                pyro_add(parts+count++,origin,offset,width,.12f+peak*(.28f+.47f*u),pyro_random(seed,i*3+j,79),fade*pyro_ramp(.01f,.15f,t));
            }
        }
    }
    for(int i=0;i<count;i++){
        parts[i].opacity*=visibility;
        parts[i].heat*=.80f+.20f*visibility;
    }
    EM_ASM(Module.impactVisibility=$0;Module.blastVariationMask=(Module.blastVariationMask||0)|(1<<$1);,visibility,compact?shape:0);
    pyro_draw_parts(parts,count,t,kind,heavy);
    if(!compact)pyro_fragments(origin,size,t,seed,heavy,visibility);pyro_ignition(origin,size,t,visibility);
    for(int i=0;i<bursts;i++)pyro_fragments(secondary[i],size*.46f,secondary[i][3],seed+i+97,0,visibility);
    EM_ASM(Module.volumeBlasts=(Module.volumeBlasts||0)+1;Module.blastStyleMask=(Module.blastStyleMask||0)|(1<<$0);,kind);
}
