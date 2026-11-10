/* Camera-only spectator selection. Simulation ownership never changes.
 * Player/console substitution is confined to synchronous HUD drawing. */
static int av_selected=-1;
static object *av_saved_view;
int astra_arena_remote_view(void){return av_selected>0;}
object *astra_arena_listener(void){
    if(av_selected>0&&av_selected<N_players){
        int n=Players[av_selected].objnum;
        if(n>=0&&n<=Highest_object_index&&(Objects[n].type==OBJ_PLAYER||Objects[n].type==OBJ_GHOST))return &Objects[n];
    }
    return Viewer;
}
static void av_begin(void){
    av_saved_view=Viewer;
    if(!EM_ASM_INT(return !!Module.arenaDemo)){av_selected=-1;return;}
    int id=EM_ASM_INT(return Module.arenaView|0);
    if(id<0||id>=N_players||id>=4)id=0;
    int n=Players[id].objnum;
    if(n<0||n>Highest_object_index||Players[id].connected!=CONNECT_PLAYING)id=0;
    if(id!=av_selected)HUD_clear_messages();
    av_selected=id;
    select_cockpit(id==Player_num&&Player_is_dead?CM_LETTERBOX:PlayerCfg.PreferredCockpitMode);
    if(id!=Player_num)Viewer=&Objects[Players[id].objnum];
    int alive=id==Player_num?!Player_is_dead:Viewer->type==OBJ_PLAYER&&Players[id].shields>0;
    extern int astra_squad_respawn_left(int);
    int respawn=id?astra_squad_respawn_left(id):0;
    EM_ASM({Module.arenaCamera=({pilot:$0,object:$1,simulationPlayer:$2,alive:!!$3,position:[$4,$5,$6],forward:[$7,$8,$9],shields:$10,primary:$11,secondary:$12});
        window.astraArenaView?.update($0,!!$3,$10,$13,$14,$15);},
        id,Viewer-Objects,Player_num,alive,f2fl(Viewer->pos.x),f2fl(Viewer->pos.y),f2fl(Viewer->pos.z),
        f2fl(Viewer->orient.fvec.x),f2fl(Viewer->orient.fvec.y),f2fl(Viewer->orient.fvec.z),
        f2fl(Players[id].shields),Players[id].primary_weapon,Players[id].secondary_weapon,
        Players[id].net_kills_total,Players[id].net_killed_total,f2fl(respawn));
    /* Palette flashes from Astra must not wash out another pilot's view. */
    gr_palette_step_up(id?0:PaletteRedAdd,id?0:PaletteGreenAdd,id?0:PaletteBlueAdd);
}
static void av_hud(int ordinary){
    int saved=Player_num,dead=Player_is_dead,rear=Rear_view;
    object *console=ConsoleObject;
    if(av_selected>0){
        Player_num=av_selected;ConsoleObject=&Objects[Players[av_selected].objnum];
        Player_is_dead=ConsoleObject->type!=OBJ_PLAYER||Players[av_selected].shields<=0;Rear_view=0;
    }
    extern void astra_deck_update(int);astra_deck_update(ordinary);
    if(ordinary)game_draw_hud_stuff();
    Player_num=saved;ConsoleObject=console;Player_is_dead=dead;Rear_view=rear;
}
static void av_extra(void){
    extern void show_extra_views(void);
    int saved=Player_num,dead=Player_is_dead,rear=Rear_view;object *console=ConsoleObject;
    if(av_selected>0){Player_num=av_selected;ConsoleObject=&Objects[Players[av_selected].objnum];Player_is_dead=ConsoleObject->type!=OBJ_PLAYER||Players[av_selected].shields<=0;Rear_view=0;}
    EM_ASM(Module.rearCamera=null;);
    show_extra_views();
    Player_num=saved;ConsoleObject=console;Player_is_dead=dead;Rear_view=rear;
}
static void av_end(void){Viewer=av_saved_view;}
