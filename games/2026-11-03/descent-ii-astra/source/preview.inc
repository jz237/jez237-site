/* A presentation-only inspection view. No objects, damage, RNG, or pilot state
 * are changed. The mission clock and controls remain paused until it closes. */
int astra_preview_active;
static unsigned preview_seed,preview_number;
static double preview_started;
float astra_preview_clock;
int astra_preview_silent;
static float preview_length;
static int preview_sound,preview_profile;
static void preview_snapshot(int entering)
{
    if(!ConsoleObject)return;
    player *p=&Players[Player_num];
    EM_ASM({if(Module.traceAstraPause)Module.traceAstraPause($0,[$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11]);},
        entering,(double)GameTime64,ConsoleObject->pos.x,ConsoleObject->pos.y,ConsoleObject->pos.z,
        ConsoleObject->mtype.phys_info.velocity.x,ConsoleObject->mtype.phys_info.velocity.y,ConsoleObject->mtype.phys_info.velocity.z,
        p->shields,p->energy,p->lives,p->secondary_ammo[p->secondary_weapon]);
}
static void astra_preview_new(void)
{
    unsigned random=(unsigned)EM_ASM_INT({var a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]|0;});
    unsigned next=death_hash(random^(++preview_number*2654435761u));
    preview_seed=next==preview_seed?next^0x9e3779b9u:next;
    int requested=EM_ASM_INT(return Module.blastInspect|0;);
    preview_profile=requested>0 && requested<AB_COUNT?requested:AB_LEGACY;
    preview_length=preview_profile?astra_pattern_length(preview_profile,preview_seed):
                                   5.9f+1.1f*(preview_seed&255)/255.f;
    preview_started=emscripten_get_now();astra_preview_clock=0;preview_sound=-1;
    EM_ASM(window.astraPlayback?.reset());
    digi_stop_digi_sounds();
}
int astra_preview_frame(void)
{
    int command=EM_ASM_INT({var c=Module.pyroPreviewCommand||0;Module.pyroPreviewCommand=0;return c;});
    if(command>0 && EM_ASM_INT(return !!Module.astra) && !(Game_mode&GM_MULTI)){
        if(!astra_preview_active){
            preview_snapshot(1);
            astra_preview_active=1;stop_time();game_flush_inputs();
            EM_ASM(window.astraPreview?.show(true));
        }
        if(command==2 && astra_preview_active){
            astra_preview_clock=0;preview_started=emscripten_get_now();preview_sound=-1;
            digi_stop_digi_sounds();EM_ASM(window.astraPlayback?.reset());
        }else astra_preview_new();
        if(EM_ASM_INT(return Module.mineInspect>=0))am_level=-999;
    }
    if(command<0 && astra_preview_active){
        preview_snapshot(0);
        astra_preview_active=0;digi_stop_digi_sounds();game_flush_inputs();
        start_time();reset_cockpit();
        {extern int PaletteRedAdd,PaletteGreenAdd,PaletteBlueAdd;gr_palette_step_up(PaletteRedAdd,PaletteGreenAdd,PaletteBlueAdd);}
        EM_ASM(window.astraPreview?.show(false));
        return 1;
    }
    if(!astra_preview_active)return 0;
    /* A hit tint may be active when the pilot opens the showroom. Keep the
     * paused gameplay palette intact, but inspect materials in neutral light. */
    gr_palette_step_up(0,0,0);
    double now=emscripten_get_now();
    float dt=fminf(.10f,fmaxf(0,(now-preview_started)*.001f));preview_started=now;
    int weapon=EM_ASM_INT(return Number.isInteger(Module.weaponInspect)?Module.weaponInspect:-1);
    int combat=EM_ASM_INT(return Number.isInteger(Module.combatInspect)?Module.combatInspect:-1);
    int timed=weapon>=0||combat>=0;
    float duration=timed?10:preview_length+(preview_profile?.20f:.85f);
    int restart=EM_ASM_INT({var r=!!Module.previewRestart;delete Module.previewRestart;return r;});
    if(restart){preview_sound=-1;astra_preview_clock=0;digi_stop_digi_sounds();EM_ASM(Module.previewPaused=false;window.astraPlayback?.sync());}
    float seek=EM_ASM_DOUBLE({var s=Module.previewSeek;delete Module.previewSeek;return Number.isFinite(s)?s:-1;});
    int paused=EM_ASM_INT(return !!Module.previewPaused;);
    float speed=EM_ASM_DOUBLE(return Module.previewSpeed||1;);
    {static int was_silent;
        int silent=paused||seek>=0||speed!=1;
        if(silent&&!was_silent&&astra_preview_clock<duration-.02f)digi_stop_digi_sounds();
        astra_preview_silent=silent;was_silent=silent;
    }
    if(seek>=0){preview_sound=0;astra_preview_clock=fminf(duration,fmaxf(0,seek));digi_stop_digi_sounds();
        EM_ASM(Module.previewPaused=true;window.astraPlayback?.sync());}
    else if(!paused)astra_preview_clock=fminf(duration+.95f,astra_preview_clock+dt*fminf(2,fmaxf(.1f,speed)));
    float age=astra_preview_clock,seconds=age-(preview_profile?.20f:.85f);
    EM_ASM(window.astraPlayback?.update($0,$1,$2,$3);,age,duration,preview_seed,timed);
    gr_set_current_canvas(NULL);gr_clear_canvas(BM_XRGB(1,2,3));
    int mine=EM_ASM_INT(return Number.isInteger(Module.mineInspect)?Module.mineInspect:-1);
    if(mine>=0){
        double clock=EM_ASM_DOUBLE(return window.astraMinePreview?.tick()||0);
        double zoom=EM_ASM_DOUBLE(return Module.mineInspectZoom||1);
        astra_mine_preview(mine,(float)clock,(float)zoom);return 1;
    }
    g3_start_frame();
    vms_vector eye={0,0,0},center={0,0,i2f(72)};
    g3_set_view_matrix(&eye,&vmd_identity_matrix,F1_0);
    if(combat>=0){
        extern void astra_combat_showcase(int,float);astra_combat_showcase(combat,age);
        g3_end_frame();EM_ASM(window.astraCombat?.update($0,$1);,combat,age);return 1;
    }
    if(weapon>=0&&weapon<20){
        extern fix Render_zoom;g3_set_view_matrix(&eye,&vmd_identity_matrix,Render_zoom);
        extern void astra_weapon_showcase(int,float);astra_weapon_showcase(weapon,age);
        g3_end_frame();EM_ASM(window.astraWeaponDemo?.update($0);,weapon);return 1;
    }
    int inspect=EM_ASM_INT(return Number.isInteger(Module.pickupInspect)?Module.pickupInspect:-1);
    if(inspect>=0 && inspect<51){
        object item;memset(&item,0,sizeof item);item.id=inspect;item.segnum=-1;
        item.pos.z=i2f(6);item.size=fl2f(2.3f);
        extern int astra_draw_pickup(object*);astra_draw_pickup(&item);
        g3_end_frame();EM_ASM(window.astraCollectibleStatus?.($0);,inspect);return 1;
    }
    if(!preview_profile && seconds<.05f){
        vms_angvec angles={-5200,2400,19500+(int)(age*1200)};
        g3s_lrgb light={F1_0,F1_0,F1_0};
        extern int astra_draw_pyro(g3s_lrgb);
        g3_start_instance_angles(&center,&angles);astra_draw_pyro(light);g3_done_instance();
    }
    if(preview_profile && seconds>=0 && seconds<preview_length){
        float base=preview_profile<=AB_CINDERS?10.6f:preview_profile<=AB_IMPLOSION?8.5f:10.5f;
        center.z=i2f(60);
        if(preview_profile==AB_BLOOM)center.y=-i2f(7);
        if(preview_profile==AB_CINDERS||preview_profile==AB_SPALL)center.y=-i2f(3);
        astra_pattern_blast(&center,fl2f(base*astra_detonations[preview_profile].scale),
                            seconds/preview_length,preview_seed,preview_profile,preview_profile>AB_CINDERS);
        if(preview_sound<0 && !astra_preview_silent){
            static const int sound[AB_COUNT]={0,SOUND_FORCEFIELD_BOUNCE_WEAPON,SOUND_LASER_HIT_CLUTTER,
                SOUND_WEAPON_HIT_BLASTABLE,SOUND_ROBOT_HIT,SOUND_MINE_BLEW_UP,
                SOUND_MINE_BLEW_UP,SOUND_BADASS_EXPLOSION,
                SOUND_LASER_HIT_CLUTTER,SOUND_FORCEFIELD_BOUNCE_WEAPON,SOUND_ROBOT_DESTROYED,
                SOUND_MINE_BLEW_UP,SOUND_WEAPON_HIT_BLASTABLE,SOUND_FORCEFIELD_BOUNCE_WEAPON,
                SOUND_ROBOT_HIT,SOUND_BADASS_EXPLOSION,SOUND_WEAPON_HIT_BLASTABLE,SOUND_BADASS_EXPLOSION};
            digi_play_sample(sound[preview_profile],F1_0/2);
            preview_sound=0;
        }
    }else if(!preview_profile && seconds>=0 && seconds<preview_length){
        float t=seconds/preview_length;
        astra_blast(&center,i2f(13),t,preview_seed,preview_seed%8,2);
        if(preview_sound<0)preview_sound=0;
        astra_death_chain(preview_seed,t,&preview_sound,astra_preview_silent,-1,NULL);
    }
    g3_end_frame();
    extern void astra_lens(int,int,int,int);astra_lens(0,0,SWIDTH,SHEIGHT);
    EM_ASM({window.astraPreview?.update($0,$1>>>0,$2,$3,$4);
        if(Module.traceAstraPreview)Module.traceAstraPreview($0,$1>>>0,$2,$3);
    },preview_number,preview_seed,seconds,preview_length,preview_profile);
    return 1;
}
