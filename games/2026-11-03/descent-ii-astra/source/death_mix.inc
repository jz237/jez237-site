/* Derived only from the loaded Descent samples. The ordinary SDL mixer owns
 * these voices, so pause/stop, the SFX slider and demo mute remain authoritative. */
typedef struct {const unsigned char *source; unsigned source_len,length; int sound,variant,rate; unsigned char *pcm;} ad_audio_cache;
static ad_audio_cache ad_audio[12];
static void astra_death_audio_clear(void)
{
    for(int i=0;i<12;i++){free(ad_audio[i].pcm);memset(&ad_audio[i],0,sizeof ad_audio[i]);}
}
int astra_death_audio(int logical,int variant,fix volume,int pan)
{
    int sound=digi_xlat_sound(logical);variant=variant<0?0:variant%3;
    if(!digi_initialised||sound<0||!GameSounds[sound].data||GameSounds[sound].data==(void*)-1)return -1;
    const unsigned char *source=GameSounds[sound].data;unsigned source_len=GameSounds[sound].length;
    const int rate=GameArg.SndDigiSampleRate;ad_audio_cache *entry=NULL;
    for(int i=0;i<12;i++)if(ad_audio[i].pcm&&ad_audio[i].source==source&&ad_audio[i].source_len==source_len&&ad_audio[i].sound==sound&&ad_audio[i].variant==variant&&ad_audio[i].rate==rate){entry=&ad_audio[i];break;}
    if(!entry){
        for(int i=0;i<12;i++)if(!ad_audio[i].pcm){entry=&ad_audio[i];break;}
        if(entry&&source_len&&rate>0){
            const float speeds[]={.68f,.84f,1.03f};float speed=speeds[variant];
            unsigned dry=(unsigned)fminf(source_len/speed,rate*2.8f),length=dry+(unsigned)(rate*.82f);
            /* Keep malformed data from allocating an unbounded audio buffer. */
            if(length>(unsigned)rate*10)entry=NULL;
            else {
                float *mix=calloc(length,sizeof(float));unsigned char *pcm=malloc(length);
                if(!mix||!pcm){free(mix);free(pcm);entry=NULL;}
                else {
                    float low=0,dc=0;const float delays[]={.083f,.177f,.307f,.491f,.733f},gains[]={.21f,.17f,.12f,.085f,.045f};
                    for(unsigned i=0;i<dry;i++){
                        float at=i*speed;unsigned k=(unsigned)at;float f=at-k;
                        float a=source[k<source_len?k:source_len-1]-128.f,b=source[k+1<source_len?k+1:source_len-1]-128.f;
                        float value=a+(b-a)*f;dc+=.0015f*(value-dc);value-=dc;
                        low+=.075f*(value-low);float edge=fminf(1.f,fminf(i/(rate*.003f),(dry-i)/(rate*.015f)));
                        value=(value*.78f+low*.48f)*edge;mix[i]+=value;
                        for(int j=0;j<5;j++){unsigned dst=i+(unsigned)(delays[j]*rate);if(dst<length)mix[dst]+=(value*.28f+low*.72f)*gains[j];}
                    }
                    float peak=1;for(unsigned i=0;i<length;i++)peak=fmaxf(peak,fabsf(mix[i]));
                    float gain=fminf(1.12f,111.f/peak);
                    for(unsigned i=0;i<length;i++){float tail=fminf(1.f,(length-i)/(rate*.025f));pcm[i]=(unsigned char)(128.f+mix[i]*gain*tail);}
                    free(mix);*entry=(ad_audio_cache){source,source_len,length,sound,variant,rate,pcm};
                }
            }
        }
    }
    int channel=digi_audio_start_sound(sound,volume,pan,0,-1,-1,-1);
    if(channel>=0&&entry){
        SDL_LockAudio();SoundSlots[channel].samples=entry->pcm;SoundSlots[channel].length=entry->length;SDL_UnlockAudio();
        EM_ASM({Module.deathAudio=({version:43,voices:(Module.deathAudio?.voices||0)+1,seconds:$0,preset:$1});if(Module.traceDeathPcm)Module.traceDeathPcm($2,$3,$4,$5,$1);},entry->length/(double)rate,variant,entry->pcm,entry->length,rate,logical);
    }
    return channel;
}
