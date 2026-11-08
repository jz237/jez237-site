/* Event-driven playback of the original unsigned 8-bit Descent samples.
 * Native code retains channel selection, priority, looping and spatial volume.
 * Web Audio plays cached PCM independently of rendering or shader compilation. */
static int astra_web_audio,astra_defer_audio_start;
EM_JS(int, astra_sfx_init, (), {
    try {
        const context=SDL.audioContext;
        if(!context || !context.createGain || !context.createChannelMerger)return 0;
        const master=context.createGain();master.connect(context.destination);
        const bank={context,master,voices:Array(32).fill(null),cache:new Map(),bytes:0,starts:0,conversions:0};
        bank.stop=channel=>{
            const v=bank.voices[channel];if(!v)return;
            bank.voices[channel]=null;v.ended=true;
            try{v.source.stop();}catch{}
            v.source.disconnect();v.left.disconnect();v.right.disconnect();v.merge.disconnect();
        };
        bank.level=(v,volume,pan)=>{
            const p=Math.max(0,Math.min(1,pan/65536)),gain=Math.max(0,volume/65536);
            v.left.gain.setValueAtTime(gain*(p>.5?2-p*2:1),context.currentTime);
            v.right.gain.setValueAtTime(gain*(p>.5?1:p*2),context.currentTime);
        };
        Module.astraSfx=bank;
        return 1;
    }catch(error){console.warn('Astra direct sound unavailable; using SDL audio.',error);return 0;}
});
EM_JS(void, astra_sfx_stop, (int channel), {Module.astraSfx?.stop(channel);});
EM_JS(int, astra_sfx_playing, (int channel), {
    const b=Module.astraSfx,v=b?.voices[channel];
    if(!v||v.ended)return 0;
    if(!v.source.loop&&b.context.currentTime>=v.end){b.stop(channel);return 0;}
    return 1;
});
EM_JS(int, astra_sfx_play, (int channel,const unsigned char *pcm,unsigned length,int rate,int volume,int pan,int loop), {
    const b=Module.astraSfx;if(!b||!pcm||!length||rate<=0)return 0;
    b.stop(channel);
    /* Suspended means muted or waiting for a browser gesture. Do not queue old
     * one-shots or override an explicit suspend; linked loops may wait. */
    if(b.context.state!=='running'&&!loop)return 0;
    try{
        const key=pcm+':'+length+':'+rate;
        let buffer=b.cache.get(key);
        if(!buffer){
            buffer=b.context.createBuffer(1,length,rate);
            const dst=buffer.getChannelData(0);
            for(let i=0;i<length;i++)dst[i]=(HEAPU8[pcm+i]-128)/128;
            const bytes=length*4;
            while(b.bytes+bytes>12*1024*1024&&b.cache.size){
                const first=b.cache.keys().next().value,old=b.cache.get(first);
                b.bytes-=old.length*4;b.cache.delete(first);
            }
            if(bytes<=12*1024*1024){b.cache.set(key,buffer);b.bytes+=bytes;}
            b.conversions++;
        }else{b.cache.delete(key);b.cache.set(key,buffer);}
        const source=b.context.createBufferSource(),left=b.context.createGain(),right=b.context.createGain(),merge=b.context.createChannelMerger(2);
        source.buffer=buffer;source.loop=!!loop;
        source.connect(left);source.connect(right);left.connect(merge,0,0);right.connect(merge,0,1);merge.connect(b.master);
        const now=b.context.currentTime,v={source,left,right,merge,ended:false,end:now+buffer.duration};
        b.voices[channel]=v;b.level(v,volume,pan);
        source.onended=()=>{if(b.voices[channel]===v)b.stop(channel);};
        source.start(now);b.starts++;
        return 1;
    }catch(error){b.stop(channel);console.warn('Astra sound playback failed.',error);return 0;}
});
EM_JS(void, astra_sfx_level, (int channel,int volume,int pan), {
    const b=Module.astraSfx,v=b?.voices[channel];if(v)b.level(v,volume,pan);
});
EM_JS(void, astra_sfx_master, (int volume), {
    const b=Module.astraSfx;if(b)b.master.gain.setValueAtTime(Math.max(0,volume/65536),b.context.currentTime);
});
EM_JS(void, astra_sfx_clear, (int closing), {
    const b=Module.astraSfx;if(!b)return;
    b.cache.clear();b.bytes=0;
    if(closing){for(let i=0;i<32;i++)b.stop(i);b.master.disconnect();delete Module.astraSfx;}
});
static void astra_sfx_play_slot(int channel){
    struct sound_slot *s=&SoundSlots[channel];
    if(astra_web_audio&&!astra_sfx_play(channel,s->samples,s->length,GameArg.SndDigiSampleRate,s->nominal_volume,s->pan,s->looped))s->playing=0;
}
