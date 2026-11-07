/* Ten staged compositions; positions, silhouettes and timing differ, rather
 * than recoloring one fireball. All use the existing bounded gas/line buffers. */
static float bc_age(const burst_frame *f,int profile,int beat,float life){
    return (f->t-astra_chain_onset(profile,beat))/life;
}
static void bc_pop(burst_frame *f,burst_point c,float age,float size,int index){
    if(age<0||age>=1)return;
    float grow=1-expf(-age*8),fade=burst_fade(age),heat=1-pyro_ramp(.08f,.76f,age);
    burst_cloud(f,c,size*(.18f+.55f*grow),heat,fade);
    for(int j=0;j<5;j++){
        float d[3];pyro_dir(f->seed,index*17+j+221,d);
        burst_point p=bp(c.x+d[0]*size*grow*.65f,c.y+d[1]*size*grow*.65f,c.z+d[2]*size*grow*.65f);
        burst_cloud(f,p,size*(.13f+.33f*grow),heat*(.74f+.04f*j),fade*.85f);
        if(j<3)burst_trail(f,p,bp(p.x+d[0]*size*age,p.y+d[1]*size*age,p.z+d[2]*size*age),.025f*size,heat,bp(1,.48f,.09f));
    }
}
/* 1: a quick zigzag of tiny ignition beads, with a glowing fuse joining them. */
static void burst_fuse_run(burst_frame *f){
    for(int i=0;i<7;i++){
        burst_point c=bp((i-3)*.43f,(i%2?1:-1)*.18f,sinf(i*1.6f)*.23f);
        float age=bc_age(f,AB_FUSE_RUN,i,.24f);bc_pop(f,c,age,.35f,i);
        if(i<6&&age>=0&&age<.8f){burst_point b=bp((i-2)*.43f,(i%2?-1:1)*.18f,sinf((i+1)*1.6f)*.23f);burst_trail(f,c,b,.025f,(1-age)*.8f,bp(1,.18f,.03f));}
    }
}
/* 2: the core divides; left and right pressure lobes relay alternating bursts. */
static void burst_split_relay(burst_frame *f){
    bc_pop(f,bp(0,0,0),f->t/.25f,.72f,99);
    for(int i=0;i<6;i++){
        float r=.55f+(i/2)*.50f,sign=i%2?1:-1;
        burst_point c=bp(sign*r,sinf(i*1.7f)*.3f,(i/2-1)*.28f);
        bc_pop(f,c,bc_age(f,AB_SPLIT_RELAY,i,.30f),.55f+.09f*(i/2),i);
    }
}
/* 3: blue charged housings discharge upward through a branching ladder. */
static void burst_capacitor_ladder(burst_frame *f){
    for(int i=0;i<8;i++){
        float age=bc_age(f,AB_CAPACITOR_LADDER,i,.25f);if(age<0||age>=1)continue;
        burst_point c=bp((i%2?1:-1)*.43f,(i/2-1.5f)*.62f,(br(f,i,1)-.5f)*.4f);
        bc_pop(f,c,age,.36f,i);
        for(int j=0;j<4;j++){
            float d[3];pyro_dir(f->seed,i*9+j,d);
            burst_point a=bp(c.x+d[0]*.35f,c.y+d[1]*.35f,c.z+d[2]*.35f),b=bp(c.x+d[0]*(.6f+age),c.y+d[1]*(.6f+age),c.z+d[2]*(.6f+age));
            burst_trail(f,c,a,.052f,burst_fade(age),bp(.10f,.65f,1));burst_trail(f,a,b,.024f,burst_fade(age),bp(.65f,.35f,1));
        }
    }
}
/* 4: a curved row of tanks ruptures with increasingly heavy boiling lobes. */
static void burst_tank_cascade(burst_frame *f){
    for(int i=0;i<5;i++){
        float a=-1.2f+i*.6f;burst_point c=bp(sinf(a)*1.35f,cosf(a)*.70f-.35f,(i%2-.5f)*.65f);
        bc_pop(f,c,bc_age(f,AB_TANK_CASCADE,i,.36f),.42f+i*.15f,i);
    }
}
/* 5: charges cook off around a plate rack, alternating top and bottom. */
static void burst_armor_cookoff(burst_frame *f){
    for(int i=0;i<8;i++){
        float age=bc_age(f,AB_ARMOR_COOKOFF,i,.27f),a=(i%4)*1.5708f+.3f,r=.38f+.62f*(i/4);
        burst_point c=bp(cosf(a)*r,sinf(a)*r,(i%2-.5f)*.5f);bc_pop(f,c,age,.50f,i);
        if(age>=0&&age<1){burst_point p=bp(c.x*(1+age),c.y*(1+age),c.z+age*.8f);burst_shard(f,p,.17f,i+age*5,expf(-5*age));}
    }
}
/* 6: successive nozzle failures drive two opposed, staggered exhaust jets. */
static void burst_pod_runaway(burst_frame *f){
    for(int i=0;i<6;i++){
        float age=bc_age(f,AB_POD_RUNAWAY,i,.32f);if(age<0||age>=1)continue;
        int side=i%2?1:-1;burst_point c=bp(side*.65f,(i/2-1)*.28f,0);bc_pop(f,c,age,.58f,i);
        for(int j=0;j<5;j++){float u=j/4.f;burst_point p=bp(c.x+side*u*age*2.5f,c.y+(br(f,i*5+j,5)-.5f)*u*.35f,c.z+u*.5f);burst_cloud(f,p,.10f+.16f*u,(1-age)*(.9f-.2f*u),burst_fade(age)*.8f);}
    }
}
/* 7: a forward fan of fragments relays small fires out from a restrained core. */
static void burst_shrapnel_relay(burst_frame *f){
    for(int i=0;i<9;i++){
        float age=bc_age(f,AB_SHRAPNEL_RELAY,i,.24f),a=(i-4)*.31f;
        burst_point c=bp(sinf(a)*(1+i*.05f),cosf(a)*.8f-.2f,(i%3-1)*.55f);
        bc_pop(f,c,age,.32f+(i%3)*.08f,i);
        if(age>=0&&age<1)burst_shard(f,bp(c.x*(1+age),c.y+age*.7f,c.z*(1+age)),.12f,i+age*7,expf(-6*age));
    }
}
/* 8: eight outer nodes fire clockwise, then converge in a delayed center pop. */
static void burst_halo_collapse(burst_frame *f){
    for(int i=0;i<8;i++){
        float age=bc_age(f,AB_HALO_COLLAPSE,i,.28f),a=i*.7854f,r=1.25f*(1-.7f*pyro_ramp(.4f,.85f,f->t));
        burst_point c=bp(cosf(a)*r,sinf(a)*r*.75f,sinf(a)*r*.5f);bc_pop(f,c,age,.39f,i);
        if(age>=0&&age<1)burst_trail(f,c,bp(c.x*.55f,c.y*.55f,c.z*.55f),.06f,burst_fade(age),bp(.15f,.85f,1));
    }
    bc_pop(f,bp(0,0,0),(f->t-.68f)/.32f,.85f,99);
}
/* 9: a low rumbling triad feeds three later, higher mushroom caps. */
static void burst_reactor_domino(burst_frame *f){
    for(int i=0;i<6;i++){
        float age=bc_age(f,AB_REACTOR_DOMINO,i,.34f),x=(i%3-1)*.9f;
        burst_point c=bp(x,i<3?-.45f:.55f,(i%2-.5f)*.35f);
        bc_pop(f,c,age,i<3?.60f:.85f,i);
        if(i>=3&&age>=0&&age<1)for(int j=0;j<4;j++){float a=j*1.5708f;burst_cloud(f,bp(x+cosf(a)*age*.8f,.55f+age*.8f,sinf(a)*age*.8f),.20f+.26f*age,.65f*(1-age),burst_fade(age)*.75f);}
    }
}
/* 10: a staggered three-dimensional shell, a quiet gap, then the final core. */
static void burst_last_light(burst_frame *f){
    for(int i=0;i<8;i++){
        float d[3];pyro_dir(f->seed,i+97,d);float r=i==7?0:1.1f;
        burst_point c=bp(d[0]*r,d[1]*r,d[2]*r);
        bc_pop(f,c,bc_age(f,AB_LAST_LIGHT,i,i==7?.28f:.25f),i==7?1.05f:.48f,i);
    }
}
