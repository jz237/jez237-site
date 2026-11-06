/* A longer hull-failure sequence, keyed to the visual burst seed. No timers,
 * simulation RNG calls or independent audio contexts. Late frames skip old hits. */
enum { ASTRA_DEATH_BEATS=12 };
extern int astra_death_audio(int,int,fix,int);
static float astra_death_beat(unsigned seed,int beat)
{
    if(beat==0)return 0;
    if(beat==1)return .055f;
    if(beat<6)return astra_death_burst_time(seed,beat-2);
    static const float late[]={.58f,.65f,.72f,.79f,.855f,.92f};
    return late[beat-6]+(death_hash(seed+beat*311u)&255)*(.014f/255.f);
}
static void astra_death_chain(unsigned seed,float t,int *next,int silent,int room,const vms_vector *pos)
{
    static const int sounds[]={SOUND_BADASS_EXPLOSION,SOUND_MINE_BLEW_UP,SOUND_ROBOT_DESTROYED,SOUND_LASER_HIT_CLUTTER};
    int last=-1;while(*next<ASTRA_DEATH_BEATS&&t>=astra_death_beat(seed,*next))last=(*next)++;
    if(silent||last<0||t-astra_death_beat(seed,last)>.055f)return;
    unsigned h=death_hash(seed+last*197u);
    int sound=last==0?0:last==1?1:last<6?(last+(seed&1))%3:last==11?3:(h>>8)%4;
    int variant=last==0?0:last==1?1:last<6?(h>>16)%2:last==11?2:(h>>16)%3;
    fix volume=fl2f(last==0?.68f:last<6?.43f:last<10?.28f:.18f);int pan=F1_0/2;
    if(pos&&Viewer){
        extern void digi_get_sound_loc(vms_matrix*,vms_vector*,int,vms_vector*,int,fix,int*,int*,fix);
        digi_get_sound_loc(&Viewer->orient,&Viewer->pos,Viewer->segnum,(vms_vector*)pos,room,volume,&volume,&pan,i2f(165));
    }
    if(volume>0)astra_death_audio(sounds[sound],variant,volume,pan);
    EM_ASM({if(Module.traceDeathBeat)Module.traceDeathBeat($0,$1,$2,$3,$4);},last,t,astra_death_beat(seed,last),volume,seed);
}
