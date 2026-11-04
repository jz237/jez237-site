/* A presentation-only inspection view. No objects, damage, RNG, or pilot state
 * are changed. The mission clock and controls remain paused until it closes. */
int astra_preview_active;
static unsigned preview_seed,preview_number;
static double preview_started;
static float preview_length;
static int preview_sound;
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
    preview_length=5.9f+1.1f*(preview_seed&255)/255.f;
    preview_started=emscripten_get_now();preview_sound=-1;
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
        astra_preview_new();
    }
    if(command<0 && astra_preview_active){
        preview_snapshot(0);
        astra_preview_active=0;digi_stop_digi_sounds();game_flush_inputs();
        start_time();reset_cockpit();
        EM_ASM(window.astraPreview?.show(false));
        return 1;
    }
    if(!astra_preview_active)return 0;
    float age=(emscripten_get_now()-preview_started)*.001f,seconds=age-.85f;
    gr_set_current_canvas(NULL);gr_clear_canvas(BM_XRGB(1,2,3));
    g3_start_frame();
    vms_vector eye={0,0,0},center={0,0,i2f(72)};
    g3_set_view_matrix(&eye,&vmd_identity_matrix,F1_0);
    int weapon=EM_ASM_INT(return Number.isInteger(Module.weaponInspect)?Module.weaponInspect:-1);
    if(weapon>=0&&weapon<19){
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
    if(seconds<.05f){
        vms_angvec angles={-5200,2400,19500+(int)(age*1200)};
        g3s_lrgb light={F1_0,F1_0,F1_0};
        extern int astra_draw_pyro(g3s_lrgb);
        g3_start_instance_angles(&center,&angles);astra_draw_pyro(light);g3_done_instance();
    }
    if(seconds>=0 && seconds<preview_length){
        float t=seconds/preview_length;
        astra_blast(&center,i2f(13),t,preview_seed,preview_seed%8,2);
        static const int sounds[]={SOUND_ROBOT_DESTROYED,SOUND_BADASS_EXPLOSION,SOUND_LASER_HIT_CLUTTER,SOUND_MINE_BLEW_UP};
        if(preview_sound<0){digi_play_sample(SOUND_BADASS_EXPLOSION,F1_0*3/4);preview_sound=0;}
        int last=-1;
        while(preview_sound<4 && t>=astra_death_burst_time(preview_seed,preview_sound))last=preview_sound++;
        if(last>=0 && t-astra_death_burst_time(preview_seed,last)<.11f)
            digi_play_sample(sounds[(last+(preview_seed&3))%4],F1_0/2);
    }
    g3_end_frame();
    extern void astra_lens(int,int,int,int);astra_lens(0,0,SWIDTH,SHEIGHT);
    EM_ASM({window.astraPreview?.update($0,$1>>>0,$2,$3);
        if(Module.traceAstraPreview)Module.traceAstraPreview($0,$1>>>0,$2,$3);
    },preview_number,preview_seed,seconds,preview_length);
    return 1;
}
