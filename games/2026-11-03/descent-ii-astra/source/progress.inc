/* Full native snapshots, at frame boundaries; two rotating slots per campaign.
 * Browser persistence is acknowledged only after the IDBFS transaction completes. */
extern int Endlevel_sequence;
static double ap_check_at,ap_entered,ap_saved_at;
static int ap_level=999,ap_keys=-1;
static int ap_campaign(void){return !strcmp(Current_mission_filename,"kegparty")?5:!strcmp(Current_mission_filename,"minerva")?3:!strcmp(Current_mission_filename,"elegies")?4:!strcmp(Current_mission_filename,"overload")?2:!strcmp(Current_mission_filename,"d2x")?1:0;}
static int ap_excluded(void){return EM_ASM_INT(return !!(Module.netSession||Module.autopilot||Module.demo||Module.encounter||Module.mineInspect>=0||Module.weaponInspect>=0||Module.pickupInspect>=0||Module.blastInspect>0||window.astraPreview?.active);)||Newdemo_state==ND_STATE_PLAYBACK;}
int astra_checkpoint_available(void){if(Game_mode&GM_MULTI)return 0;return EM_ASM_INT(return window.astraProgress?.available($0)?1:0;,ap_campaign());}
int astra_progress_command(void){
    if(EM_ASM_INT({const c=Module.saveReturnCommand||0;Module.saveReturnCommand=0;return c;})){
        if(ap_excluded()||Player_is_dead||Endlevel_sequence||Current_level_num<=0){
            EM_ASM(window.astraResume.failed('Save & return is available during a living campaign flight, outside secret mines and exit sequences.'));return 0;
        }
        int slot=EM_ASM_INT(return window.astraResume.nextSlot());
        char name[64],desc[DESC_LENGTH]={0};snprintf(name,sizeof name,"last-flight-%d.sav",slot);snprintf(desc,sizeof desc,"Astra last flight");
        EM_ASM(Module.checkpointBusy=true);stop_time();
        if(state_save_all_sub(name,desc))EM_ASM(window.astraResume.saved($0,$1,$2,UTF8ToString($3));,slot,ap_campaign(),Current_level_num,Current_level_name);
        else EM_ASM(Module.checkpointBusy=false;window.astraResume.failed('The flight could not be saved. Keep playing or use the manual Save game option.'));
        return 1;
    }
    if(EM_ASM_INT(return !!Module.resumeFlight)){
        int slot=EM_ASM_INT(Module.resumeFlight=false;return window.astraResume.restoreSlot());
        if(slot>=0){char name[64];snprintf(name,sizeof name,"last-flight-%d.sav",slot);int ok=state_restore_all_sub(name,0);EM_ASM(window.astraResume.restored(!!$0);,ok);return ok;}
    }
    if(ap_excluded())return 0;
    int command=EM_ASM_INT(if(Module.resumeCheckpoint||Module.checkpointCommand){Module.resumeCheckpoint=false;Module.checkpointCommand=0;return 1;}return 0;);
    if(!command)return 0;
    int campaign=ap_campaign(),slot=EM_ASM_INT(return window.astraProgress?.restoreSlot($0)??-1;,campaign);
    if(slot<0||slot>1)return 0;
    char file[64];snprintf(file,sizeof file,"checkpoint-%d-%d.sav",campaign,slot);
    if(Player_is_dead)dead_player_end();
    int ok=state_restore_all_sub(file,0);ap_level=999;ap_saved_at=emscripten_get_now();
    EM_ASM(window.astraProgress?.restored(!!$0);,ok);
    return ok;
}
void astra_progress_tick(void){
    double now=emscripten_get_now();if(now<ap_check_at)return;ap_check_at=now+250;
    if(!Current_mission||!Game_wind||ap_excluded())return;
    int campaign=ap_campaign(),keys=Players[Player_num].flags&14;
    EM_ASM(window.astraProgress?.update({campaign:$0,level:$1,name:UTF8ToString($2),keys:$3,reactor:!!$4,countdown:$5,dead:!!$6});,campaign,Current_level_num,Current_level_name,keys,Control_center_destroyed,Countdown_seconds_left,Player_is_dead);
    if(ap_level!=Current_level_num){ap_level=Current_level_num;ap_entered=now;ap_keys=-1;}
    if(Player_is_dead||Control_center_destroyed||Current_level_num<=0||Players[Player_num].shields<i2f(30)||now-ap_entered<3000||now-ap_saved_at<10000)return;
    int milestone=keys|(campaign==2?EM_ASM_INT(return (window.astraOverload?.controller?.clearance||0)<<8;):0);
    if(ap_keys==milestone&&now-ap_saved_at<90000)return;
    if(EM_ASM_INT(return !Module.checkpoints||!Module.saveReady||Module.checkpointBusy||typeof saving!=='undefined'&&saving||Module.overload&&!window.astraOverload?.controller;))return;
    /* Never checkpoint under fire or with an active nearby opponent. */
    for(int i=1;i<=Highest_object_index;i++){
        object *o=&Objects[i];if(o->flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING))continue;
        if(o->type==OBJ_WEAPON&&o->ctype.laser_info.parent_type==OBJ_ROBOT&&vm_vec_dist_quick(&o->pos,&ConsoleObject->pos)<i2f(130))return;
        if(o->type==OBJ_ROBOT&&o->shields>0&&vm_vec_dist_quick(&o->pos,&ConsoleObject->pos)<i2f(100)&&object_to_object_visibility(o,ConsoleObject,0))return;
    }
    int slot=EM_ASM_INT(return window.astraProgress?.nextSlot($0)??0;,campaign);
    char file[64],desc[DESC_LENGTH]={0};snprintf(file,sizeof file,"checkpoint-%d-%d.sav",campaign,slot);snprintf(desc,sizeof desc,"Astra checkpoint");
    EM_ASM(Module.checkpointBusy=true);
    stop_time();int ok=state_save_all_sub(file,desc);
    if(ok){ap_saved_at=now;ap_keys=milestone;EM_ASM(window.astraProgress.saved($0,$1,$2,UTF8ToString($3));,campaign,slot,Current_level_num,Current_level_name);}
    else EM_ASM(Module.checkpointBusy=false;window.astraProgress?.message('Checkpoint could not be saved'););
}
