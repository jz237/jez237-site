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
    int gas_count, line_count, plate_count, palette;
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

/* Ten additional compositions. Bounded geometry uses the same detailed gas
 * material, depth testing and close-impact attenuation as existing effects. */
static void burst_needles(burst_frame *f)
{
    float t=f->t,fade=1-pyro_ramp(.32f,1,t);
    for(int i=0;i<42;i++){
        float a=br(f,i,2)*6.283f,r=(.5f+br(f,i,3)*1.8f)*sqrtf(t);
        burst_point p=bp(cosf(a)*r,sinf(a)*r*.65f,(br(f,i,5)-.5f)*r);
        burst_trail(f,bp(p.x*.70f,p.y*.70f,p.z*.70f),p,.024f+.025f*br(f,i,8),fade,bp(1,.65f,.18f));
        if(i<9)burst_shard(f,p,.035f+br(f,i,10)*.06f,t*(7+i),expf(-8*t));
    }
    burst_cloud(f,bp(0,0,0),.12f+.32f*t,.95f*expf(-6*t),fade*.72f);
}
static void burst_crackle(burst_frame *f)
{
    for(int i=0;i<9;i++){
        float age=(f->t-br(f,i,1)*.62f)/.33f;if(age<0||age>=1)continue;
        float d[3];pyro_dir(f->seed,i,d);burst_point p=bp(d[0]*.8f,d[1]*.8f,d[2]*.8f);
        float fade=burst_fade(age);
        burst_cloud(f,p,.12f+.24f*age,.95f*(1-age),fade);
        for(int j=0;j<5;j++){
            float a=j*1.2566f+br(f,i,7),r=.16f+.65f*age;
            burst_point q=bp(p.x+cosf(a)*r,p.y+sinf(a)*r,p.z+(br(f,i*5+j,4)-.5f)*r);
            burst_point bend=bp((p.x+q.x)*.5f+.14f,(p.y+q.y)*.5f-.13f,(p.z+q.z)*.5f);
            burst_trail(f,p,bend,.035f,fade,bp(.65f,.27f,1));burst_trail(f,bend,q,.022f,fade,bp(.35f,.68f,1));
        }
    }
}
static void burst_petals(burst_frame *f)
{
    float t=f->t,grow=1-expf(-6*t),fade=burst_fade(t);
    for(int i=0;i<6;i++)for(int j=0;j<6;j++){
        float a=i*1.0472f+br(f,i,8)*.24f,u=j/5.f,r=grow*(.25f+1.55f*u);
        burst_point p=bp(cosf(a)*r,sinf(a)*r,(u-.45f)*sinf(t*4)*.75f);
        burst_cloud(f,p,(.15f+.22f*sinf(u*3.14f))*(.3f+grow),(.95f-.30f*u)*(1-pyro_ramp(.1f,.78f,t)),.85f*fade);
    }
    burst_cloud(f,bp(0,0,0),.20f+.35f*grow,.95f*(1-t),fade);
}
static void burst_twinjet(burst_frame *f)
{
    float t=f->t,fade=burst_fade(t),grow=1-expf(-4*t);
    for(int sign=-1;sign<=1;sign+=2)for(int j=0;j<18;j++){
        float u=j/17.f,spread=.10f+.34f*u;
        burst_point p=bp(sign*grow*(.12f+u*2.25f),(br(f,j,3)-.5f)*spread,(br(f,j,4)-.5f)*spread*2);
        burst_cloud(f,p,(.12f+.24f*u)*(.35f+grow),(.98f-.30f*u)*(1-pyro_ramp(.18f,.9f,t)),fade*(.95f-.25f*u));
        if(j%3==0)burst_trail(f,bp(p.x*.7f,p.y,p.z),p,.04f,fade,bp(1,.37f,.08f));
    }
    for(int j=0;j<8;j++){float d[3];pyro_dir(f->seed,j,d);burst_shard(f,bp(d[0]*grow,d[1]*grow,d[2]*grow),.12f,t*6+j,.3f*(1-t));}
}
static void burst_shell(burst_frame *f)
{
    float t=f->t,r=.12f+1.7f*(1-expf(-4*t)),fade=burst_fade(t);
    for(int i=0;i<38;i++){
        float d[3];pyro_dir(f->seed,i,d);
        burst_point p=bp(d[0]*r,d[1]*r,d[2]*r);
        burst_cloud(f,p,.16f+.22f*t,.83f*(1-pyro_ramp(.1f,.72f,t)),.8f*fade);
        if(i<14)burst_shard(f,bp(p.x*1.1f,p.y*1.1f,p.z*1.1f),.10f+.09f*br(f,i,5),i+t*4,.7f*expf(-4*t));
    }
}
static void burst_cryo(burst_frame *f)
{
    float t=f->t,r=1-expf(-7*t),fade=burst_fade(t);
    for(int i=0;i<20;i++){
        float d[3];pyro_dir(f->seed,i,d);float speed=.8f+br(f,i,3);
        burst_point p=bp(d[0]*r*speed,d[1]*r*speed-.3f*t*t,d[2]*r*speed);
        burst_shard(f,p,.08f+.12f*br(f,i,4),i+t*5,.10f);
        burst_trail(f,bp(p.x*.6f,p.y*.6f,p.z*.6f),p,.05f,fade*.70f,bp(.18f,.87f,1));
        burst_cloud(f,bp(p.x*.6f,p.y*.6f,p.z*.6f),.12f+.35f*t,.20f*expf(-7*t),.65f*fade);
    }
    burst_cloud(f,bp(0,0,0),.12f+.58f*r,.7f*expf(-9*t),fade);
}
static void burst_cross(burst_frame *f)
{
    float t=f->t,r=1-expf(-5*t),fade=burst_fade(t);
    for(int arm=0;arm<4;arm++)for(int j=0;j<9;j++){
        float a=arm*1.5708f+.3f,u=j/8.f,reach=r*u*2.2f;
        burst_point p=bp(cosf(a)*reach,sinf(a)*reach,(br(f,arm*9+j,5)-.5f)*.50f*r);
        burst_cloud(f,p,(.30f-.18f*u)*(.25f+r),(.95f-.2f*u)*(1-pyro_ramp(.12f,.82f,t)),fade);
        if(j==8)burst_trail(f,bp(p.x*.75f,p.y*.75f,p.z),p,.12f,fade,bp(1,.18f,.035f));
    }
}
static void burst_aftershock(burst_frame *f)
{
    for(int wave=0;wave<3;wave++){
        float age=(f->t-wave*.22f)/.56f;if(age<0||age>=1)continue;
        float r=(.13f+2.1f*(1-expf(-4*age)))*(1-.17f*wave),fade=burst_fade(age);
        for(int i=0;i<30;i++){
            float a=i*6.283185f/30,b=(i+1)*6.283185f/30;
            burst_point p=ring_point(a,r,0),q=ring_point(b,r,0);
            burst_trail(f,p,q,.065f+.08f*(1-age),fade*.8f,bp(1,.52f-.12f*wave,.12f));
            if(i%3==0)burst_cloud(f,p,.13f+.22f*age,.8f*(1-age),fade*.85f);
        }
        burst_cloud(f,bp(0,0,0),.16f+.42f*age,.95f*(1-age),fade);
    }
}
static void burst_splinters(burst_frame *f)
{
    float t=f->t,fade=burst_fade(t);
    for(int i=0;i<20;i++){
        float d[3];pyro_dir(f->seed,i,d);float r=(1-expf(-3*t))*(1.1f+br(f,i,2)*1.3f);
        burst_point p=bp(d[0]*r,d[1]*r-.45f*t*t,d[2]*r);
        burst_shard(f,p,.13f+.15f*br(f,i,3),br(f,i,5)*6+t*(4+i%5),.8f*expf(-5*t));
        for(int j=1;j<=2;j++)burst_cloud(f,bp(p.x*(1-j*.14f),p.y*(1-j*.14f),p.z*(1-j*.14f)),.09f+.09f*j+.10f*t,(.83f-j*.2f)*expf(-3*t),fade*.75f);
        burst_trail(f,bp(p.x*.8f,p.y*.8f,p.z*.8f),p,.036f,fade,bp(1,.42f,.06f));
    }
}
static void burst_thunderhead(burst_frame *f)
{
    float t=f->t;
    for(int lobe=0;lobe<3;lobe++){
        float age=(t-lobe*.095f)/(.98f-lobe*.095f);if(age<0||age>=1)continue;
        float grow=1-expf(-6*age),rise=(.6f+br(f,lobe,2))*age,fade=burst_fade(age);
        burst_point c=bp((lobe-1)*.78f*grow,rise-.20f,(br(f,lobe,3)-.5f)*grow);
        for(int j=0;j<16;j++){
            float d[3];pyro_dir(f->seed,lobe*16+j,d);float r=(.35f+.55f*br(f,j,4))*grow;
            burst_cloud(f,bp(c.x+d[0]*r,c.y+d[1]*r,c.z+d[2]*r),(.28f+.28f*br(f,j,8))*(.35f+grow),(.9f-.16f*lobe)*(1-pyro_ramp(.18f,.83f,age)),fade*.90f);
        }
        for(int j=0;j<5;j++){float a=br(f,j+lobe*5,5)*6.283f,r=age*2.1f;burst_point p=bp(cosf(a)*r,r*.7f-1.2f*age*age,sinf(a)*r);burst_trail(f,bp(p.x*.85f,p.y*.85f,p.z*.85f),p,.043f,fade,bp(1,.40f,.07f));}
    }
}

#include "astra_chain_explosions.inc"

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
                                             burst_implosion,burst_chain,burst_bloom,burst_needles,burst_crackle,burst_petals,burst_twinjet,burst_shell,burst_cryo,burst_cross,burst_aftershock,burst_splinters,burst_thunderhead,burst_fuse_run,burst_split_relay,NULL,burst_tank_cascade,burst_armor_cookoff,burst_pod_runaway,burst_shrapnel_relay,NULL,burst_reactor_domino,burst_last_light};
    if(profile<=AB_LEGACY || profile>=AB_COUNT || !astra_pattern_enabled(profile) || t<0 || t>=1 || !astra_pyro_ready())return;
    g3s_point view;g3_rotate_point(&view,where);
    float scale=f2fl(radius);
    float origin[]={f2fl(view.p3_x)/f2fl(Matrix_scale.x),f2fl(view.p3_y)/f2fl(Matrix_scale.y),f2fl(view.p3_z)/f2fl(Matrix_scale.z)};
    if(origin[2]<-3.6f*scale || origin[2]>450 || scale/fmaxf(1,origin[2])<.002f)return;
    extern int Player_is_dead,astra_preview_active;
    float distance=sqrtf(origin[0]*origin[0]+origin[1]*origin[1]+origin[2]*origin[2]);
    float visibility=(Player_is_dead||astra_preview_active)?1:.018f+.982f*pyro_ramp(scale*1.5f+3,scale*5+12,distance);
    burst_frame f;f.seed=seed;f.t=t;f.palette=astra_detonations[profile].palette;f.gas_count=f.plate_count=f.line_count=0;
    compose[profile](&f);
    vms_angvec angles={fl2f((br(&f,0,86)-.5f)*.085f),fl2f((br(&f,1,86)-.5f)*.12f),fl2f((br(&f,2,86)-.5f)*.22f)};
    vms_matrix frame;vm_angles_2_matrix(&frame,&angles);
    if(f.plate_count){g3_start_instance_matrix(where,&frame);draw_burst_plates(&f,scale,visibility);g3_done_instance();}
    ap_begin(where,seed);
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
