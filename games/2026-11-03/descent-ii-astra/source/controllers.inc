#include "newdemo.h"
/* Poll browser hardware at the native input boundary, before D2 clamps control
 * times. Bit 7 is reserved for this bridge; keyboard and mouse bits survive. */
static void astra_controller_controls(int automap){
    float v[24]={0};
    EM_ASM({const s=window.astraControllers?.sample();if(s)HEAPF32.set(s,$0>>2);},v);
    if(automap||Player_is_dead||Endlevel_sequence||Newdemo_state==ND_STATE_PLAYBACK)memset(v,0,sizeof v);
    Controls.pitch_time-=fixmul(fl2f(v[0]),FrameTime/2);
    Controls.heading_time+=fixmul(fl2f(v[1]),FrameTime);
    Controls.bank_time-=fixmul(fl2f(v[2]),FrameTime);
    Controls.sideways_thrust_time+=fixmul(fl2f(v[3]),FrameTime);
    Controls.vertical_thrust_time+=fixmul(fl2f(v[4]),FrameTime);
    Controls.forward_thrust_time+=fixmul(fl2f(v[5]),FrameTime);
    ubyte *held[5]={&Controls.fire_primary_state,&Controls.fire_secondary_state,&Controls.afterburner_state,&Controls.rear_view_state,&Controls.energy_to_shield_state};
    for(int i=0;i<5;i++){
        int old=!!(*held[i]&128);*held[i]=(*held[i]&127)|(v[6+i]>.5f?128:0);
        if(!old&&v[6+i]>.5f){if(i==0)Controls.fire_primary_count++;if(i==1)Controls.fire_secondary_count++;if(i==3)Controls.rear_view_count++;}
    }
    if(v[11]>.5f)Controls.fire_flare_count++;if(v[12]>.5f)Controls.drop_bomb_count++;
    if(v[13]>.5f)Controls.cycle_primary_count++;if(v[14]>.5f)Controls.cycle_secondary_count++;
    if(v[15]>.5f)Controls.headlight_count++;if(v[16]>.5f)Controls.automap_count++;if(v[17]>.5f)Controls.toggle_bomb_count++;
}
