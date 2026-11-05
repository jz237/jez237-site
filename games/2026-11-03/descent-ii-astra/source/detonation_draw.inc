/* Coordinates are in blast radii. Each profile has its own time evolution.
 * Collect geometry first so solid fragments, sorted gas and emissive trails
 * can share the mine depth buffer without writing into the simulation. */
#include "astra_detonations.h"
typedef struct { float x, y, z; } burst_point;
typedef struct { burst_point point; float size, heat, opacity, spin; } burst_gas;
typedef struct { burst_point a, b, color; float width, alpha; } burst_line;
typedef struct { burst_point point; float size, angle, heat; } burst_plate;
typedef struct {
    unsigned seed;
    float t;
    int gas_count, line_count, plate_count;
    burst_gas gas[PLUME_PARTS];
    burst_line lines[144];
    burst_plate plates[20];
} burst_frame;

static burst_point bp(float x,float y,float z) { return (burst_point){x,y,z}; }
static float br(const burst_frame *f,int index,int channel) { return pyro_random(f->seed,index,channel); }
static float burst_fade(float t) { return 1.f-pyro_ramp(.58f,1.f,t); }
static void burst_cloud(burst_frame *f,burst_point p,float size,float heat,float opacity)
{
    int i=f->gas_count;
    if(i>=PLUME_PARTS || size<.012f || opacity<.01f)return;
    f->gas[i]=(burst_gas){p,size,heat,opacity,br(f,i,54)};
    f->gas_count++;
}
static void burst_trail(burst_frame *f,burst_point a,burst_point b,float width,float alpha,burst_point color)
{
    if(f->line_count>=144 || alpha<.008f)return;
    f->lines[f->line_count++]=(burst_line){a,b,color,width,alpha};
}
static void burst_shard(burst_frame *f,burst_point p,float radius,float angle,float heat)
{
    if(f->plate_count<20)f->plates[f->plate_count++]=(burst_plate){p,radius,angle,heat};
}

/* Branches grow outward from one contact, fork, then drain back to black. */
static void burst_arc(burst_frame *f)
{
    float t=f->t, span=.14f+1.68f*pyro_ramp(0,.31f,t), fade=burst_fade(t);
    for(int ray=0;ray<7;ray++){
        float a=ray*.8976f+br(f,ray,2)*.46f;
        burst_point last={0};
        for(int step=1;step<=5;step++){
            float u=step/5.f,bend=(br(f,ray*7+step,8)-.5f)*.47f;
            burst_point next=bp(span*(cosf(a)*u-sinf(a)*bend),span*(sinf(a)*u+cosf(a)*bend),span*u*(br(f,ray,9)-.5f));
            burst_trail(f,last,next,.18f,.18f*fade,bp(.16f,.36f,1));
            burst_trail(f,last,next,.085f*(1.3f-.5f*u),fade*(1.f-.34f*u),bp(.20f,.77f,1));
            if(step==3){
                burst_point tip=bp(next.x+cosf(a+1)*.43f,next.y+sinf(a+1)*.43f,next.z+.17f);
                burst_trail(f,next,tip,.048f,.68f*fade,bp(.56f,.45f,1));
            }
            last=next;
        }
    }
    burst_cloud(f,bp(0,0,0),.26f+.18f*t,.85f*(1-t),fade);
}
/* Ejected ceramic plates form a broad fan, with powder lingering at its heel. */
static void burst_spall(burst_frame *f)
{
    float t=f->t, travel=1-expf(-3.3f*t);
    burst_cloud(f,bp(0,0,0),.18f+.20f*travel,.96f*(1-t),1-pyro_ramp(.07f,.30f,t));
    for(int i=0;i<15;i++){
        float a=-1.26f+2.52f*br(f,i,4), speed=.65f+1.65f*br(f,i,5);
        burst_point p=bp(sinf(a)*travel*speed,cosf(a)*travel*speed-.89f*t*t,(br(f,i,6)-.5f)*travel*1.8f);
        burst_shard(f,p,.085f+.17f*br(f,i,7),br(f,i,8)*6.28f+t*(3+i%7),.35f*expf(-5*t));
    }
    for(int j=0;j<8;j++)burst_cloud(f,bp((br(f,j,12)-.5f)*t,.36f*t,(br(f,j,13)-.5f)*t),
        .09f+(.22f+.24f*br(f,j,14))*travel,.03f+.36f*expf(-10*t),.75f*burst_fade(t));
}
static burst_point cinder_flight(float age,float a,float speed,float lift)
{
    return bp(cosf(a)*speed*age,lift*age-3.45f*age*age,sinf(a)*speed*age);
}
static void burst_cinders(burst_frame *f)
{
    for(int i=0;i<33;i++){
        float delay=br(f,i,1)*.19f,t=f->t-delay;
        if(t<0)continue;
        float a=br(f,i,2)*6.283f,speed=.38f+br(f,i,3)*1.65f,lift=2.9f+2.4f*br(f,i,4);
        burst_point head=cinder_flight(t,a,speed,lift);
        burst_point tail=cinder_flight(fmaxf(0,t-.12f),a,speed,lift);
        burst_trail(f,tail,head,.04f+.034f*br(f,i,9),burst_fade(f->t),bp(1,.46f,.065f));
        if(i%6==0)burst_cloud(f,tail,.095f+.13f*t,.46f*(1-t),.75f*burst_fade(f->t));
    }
    burst_cloud(f,bp(0,.07f,0),.32f,.92f*(1-f->t),1-pyro_ramp(.1f,.58f,f->t));
}
/* A fast leading wave and a slower broken band of rolling gas leave an open center. */
static burst_point ring_point(float a,float r,float lift)
{
    return bp(cosf(a)*r,sinf(a)*r*.43f+lift,sinf(a)*r*.90f);
}
static void burst_ring(burst_frame *f)
{
    float t=f->t, radius=.06f+2.52f*(1-expf(-3.3f*t)), fade=burst_fade(t);
    for(int i=0;i<52;i++){
        float a=i*6.2831853f/52,b=(i+1)*6.2831853f/52;
        burst_trail(f,ring_point(a,radius,0),ring_point(b,radius,0),.26f,.18f*fade,bp(.08f,.54f,.88f));
        burst_trail(f,ring_point(a,radius,0),ring_point(b,radius,0),.11f*(1-.58f*t),.88f*fade,bp(.13f,.89f,.93f));
    }
    for(int i=0;i<24;i++){
        float a=i*6.2831853f/24;
        burst_cloud(f,ring_point(a,radius*(.82f+.05f*br(f,i,2)),.05f*sinf(a*3)),.23f+.24f*t,.23f+.23f*(1-t),.76f*fade);
    }
}
/* Infall tracks converge on a quiet center, followed by a single delayed recoil. */
static void burst_implosion(burst_frame *f)
{
    float t=f->t,collapse=pyro_ramp(0,.65f,t),r=1.94f*(1-collapse);
    float after=pyro_ramp(.62f,.92f,t),fade=burst_fade(t);
    for(int i=0;i<12;i++){
        float dir[3];pyro_dir(f->seed,i+23,dir);
        float a=r+.45f*(1-collapse),b=r*.80f;
        burst_point outer=bp(dir[0]*a,dir[1]*a,dir[2]*a),inner=bp(dir[0]*b,dir[1]*b,dir[2]*b);
        burst_trail(f,outer,inner,.10f,(1-collapse)*.90f,bp(.63f,.28f,1));
        burst_cloud(f,inner,.105f+.15f*(1-collapse),.42f+.28f*collapse,.8f*(1-collapse));
    }
    burst_cloud(f,bp(0,0,0),.12f+.67f*collapse+.21f*after,.22f+.88f*expf(-fabsf(t-.64f)*12.f),fade);
    if(t>.62f)for(int j=0;j<28;j++){
        float a=j*6.2831853f/28,b=(j+1)*6.2831853f/28;
        burst_trail(f,ring_point(a,after*1.3f,0),ring_point(b,after*1.3f,0),.064f,fade,bp(.87f,.54f,1));
    }
}
/* Separate housings burst in sequence along a broken fuel line. */
static void burst_chain(burst_frame *f)
{
    for(int i=0;i<5;i++){
        float age=(f->t-i*.153f)/.39f;
        if(age<0 || age>=1)continue;
        burst_point center=bp((i-2)*.79f,(i%2?.32f:-.24f)+(br(f,i,4)-.5f)*.3f,(br(f,i,5)-.5f)*1.25f);
        float r=.08f+.69f*(1-expf(-8*age)),heat=1-pyro_ramp(.12f,.82f,age);
        burst_cloud(f,center,r,heat,burst_fade(age));
        for(int j=0;j<6;j++){
            float d[3];pyro_dir(f->seed,i*8+j,d);
            burst_point p=bp(center.x+d[0]*r,center.y+d[1]*r,center.z+d[2]*r);
            burst_cloud(f,p,r*.51f,.78f*heat,.85f*burst_fade(age));
            burst_trail(f,p,bp(p.x+d[0]*age*.8f,p.y+d[1]*age*.8f,p.z+d[2]*age*.8f),.039f,heat,bp(1,.31f,.045f));
        }
    }
}
/* A rising column feeds a broad, overturning cap with a low base of dust. */
static void burst_bloom(burst_frame *f)
{
    float t=f->t,grow=1-expf(-5*t),rise=2.14f*grow+.5f*t,fade=burst_fade(t);
    for(int j=0;j<10;j++){
        float u=j/9.f;
        burst_cloud(f,bp(.16f*sinf(u*5+t*2)*grow,rise*u-.36f,0),(.32f+.16f*sinf(u*3.14f))*(.28f+.72f*grow),.78f-.67f*t,.83f*fade);
    }
    for(int j=0;j<20;j++){
        float a=j*6.2831853f/20,roll=t*3.5f+br(f,j,4)*.4f;
        float ring=grow*(1.15f+.22f*sinf(roll));
        burst_cloud(f,bp(cosf(a)*ring,rise-.36f+.19f*cosf(roll),sinf(a)*ring),
                    (.47f+.10f*br(f,j,5))*(.29f+grow),.86f-.82f*t,.93f*fade);
    }
    burst_cloud(f,bp(0,rise-.13f,0),.84f*grow+.05f,.82f-.75f*t,fade);
    for(int j=0;j<10;j++){
        float a=j*.62832f;
        burst_cloud(f,bp(cosf(a)*grow*1.55f,-.45f,sinf(a)*grow*1.55f),.20f+.19f*t,.13f*(1-t),.58f*fade);
    }
}

static void draw_burst_plates(const burst_frame *f,float scale,float visibility)
{
    static const int faces[][3]={{0,2,1},{0,1,3},{0,3,2},{1,2,3}};
    ax_count=0;ax_energy=0;
    for(int i=0;i<f->plate_count;i++){
        const burst_plate *s=&f->plates[i];
        const burst_point corner[]={{-1,-.40f,.12f},{.84f,-.32f,-.05f},{.14f,.81f,-.17f},{-.12f,.02f,.38f}};
        float turn=cosf(s->angle),tilt=sinf(s->angle);
        for(int face=0;face<4;face++){
            float vertices[3][3];
            for(int j=0;j<3;j++){
                burst_point q=corner[faces[face][j]];
                vertices[j][0]=s->point.x+s->size*(q.x*turn-q.z*tilt);
                vertices[j][1]=s->point.y+s->size*(q.y*turn-q.x*tilt*.48f);
                vertices[j][2]=s->point.z+s->size*(q.x*tilt+q.z*turn);
            }
            float light=.53f+.12f*face;
            ax_paint(light,light*.92f,light*.72f,s->heat+.10f);
            ag_triangle(vertices[0],vertices[1],vertices[2]);
        }
    }
    ax_flush(scale,visibility*burst_fade(f->t));
}

void astra_pattern_blast(vms_vector *where,fix radius,float t,unsigned seed,int profile,int tier)
{
    typedef void (*composer)(burst_frame *);
    static const composer compose[AB_COUNT]={NULL,burst_arc,burst_spall,burst_cinders,burst_ring,
                                             burst_implosion,burst_chain,burst_bloom};
    if(profile<=AB_LEGACY || profile>=AB_COUNT || t<0 || t>=1 || !astra_pyro_ready())return;
    g3s_point view;g3_rotate_point(&view,where);
    float scale=f2fl(radius);
    float origin[]={f2fl(view.p3_x)/f2fl(Matrix_scale.x),f2fl(view.p3_y)/f2fl(Matrix_scale.y),f2fl(view.p3_z)/f2fl(Matrix_scale.z)};
    if(origin[2]<-3.6f*scale || origin[2]>450 || scale/fmaxf(1,origin[2])<.002f)return;
    extern int Player_is_dead,astra_preview_active;
    float distance=sqrtf(origin[0]*origin[0]+origin[1]*origin[1]+origin[2]*origin[2]);
    float visibility=(Player_is_dead||astra_preview_active)?1:.018f+.982f*pyro_ramp(scale*1.5f+3,scale*5+12,distance);
    burst_frame f;f.seed=seed;f.t=t;f.gas_count=f.plate_count=f.line_count=0;
    compose[profile](&f);
    vms_angvec angles={fl2f((br(&f,0,86)-.5f)*.085f),fl2f((br(&f,1,86)-.5f)*.12f),fl2f((br(&f,2,86)-.5f)*.22f)};
    vms_matrix frame;vm_angles_2_matrix(&frame,&angles);
    if(f.plate_count){g3_start_instance_matrix(where,&frame);draw_burst_plates(&f,scale,visibility);g3_done_instance();}
    pyro_part gas[PLUME_PARTS];
    for(int i=0;i<f.gas_count;i++){
        burst_gas *g=&f.gas[i];
        float offset[3]={scale*(f2fl(frame.rvec.x)*g->point.x+f2fl(frame.uvec.x)*g->point.y+f2fl(frame.fvec.x)*g->point.z),
                         scale*(f2fl(frame.rvec.y)*g->point.x+f2fl(frame.uvec.y)*g->point.y+f2fl(frame.fvec.y)*g->point.z),
                         scale*(f2fl(frame.rvec.z)*g->point.x+f2fl(frame.uvec.z)*g->point.y+f2fl(frame.fvec.z)*g->point.z)};
        pyro_add(&gas[i],origin,offset,g->size*scale,g->heat,g->spin,g->opacity*visibility);
    }
    if(f.gas_count)pyro_draw_parts(gas,f.gas_count,t,astra_detonations[profile].palette,0);
    if(f.line_count){
        g3_start_instance_matrix(where,&frame);ax_count=0;
        for(int i=0;i<f.line_count;i++){
            const burst_line *l=&f.lines[i];ax_paint(l->color.x,l->color.y,l->color.z,1);
            af_beam(l->a.x*scale,l->a.y*scale,l->a.z*scale,l->b.x*scale,l->b.y*scale,l->b.z*scale,
                    l->width*scale,l->alpha*visibility,br(&f,i,37));
        }
        af_flush_tinted(t,1,1);g3_done_instance();
    }
    EM_ASM({if(Module.traceAstraPattern)Module.traceAstraPattern($0,$1,$2,$3,$4,$5);},profile,t,scale,tier,visibility,seed);
}
