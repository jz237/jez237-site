/* One bounded beat cursor per existing presentation event. Reuse D2 sounds,
 * positional falloff and the existing mixer; no gameplay explosions spawn. */
static void astra_pattern_audio(int profile,unsigned seed,float t,int *next,int silent,int room,const vms_vector *pos){
    if(!astra_is_chain(profile)||t<0||t>=1)return;
    int last=-1;while(*next<astra_chain_beats(profile)&&t>=astra_chain_onset(profile,*next))last=(*next)++;
    if(silent||last<0||t-astra_chain_onset(profile,last)>.065f)return;
    static const int sounds[]={SOUND_ROBOT_DESTROYED,SOUND_WEAPON_HIT_BLASTABLE,SOUND_MINE_BLEW_UP,SOUND_LASER_HIT_CLUTTER};
    int sound=sounds[(last+profile)%4],pan=F1_0/2;fix volume=fl2f(last==0?.32f:.18f);
    if(pos&&Viewer){
        extern void digi_get_sound_loc(vms_matrix*,vms_vector*,int,vms_vector*,int,fix,int*,int*,fix);
        digi_get_sound_loc(&Viewer->orient,&Viewer->pos,Viewer->segnum,(vms_vector*)pos,room,volume,&volume,&pan,i2f(110));
    }
    if(volume>0)astra_death_audio(sound,(seed+last)%3,volume,pan);
    EM_ASM({if(Module.traceChainBeat)Module.traceChainBeat($0,$1,$2,$3);},profile,last,t,seed);
}
