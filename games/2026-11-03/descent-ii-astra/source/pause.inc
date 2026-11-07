/* Mouse-accessible flight actions, using the existing save/load and options. */
#include "state.h"
#include "menu.h"
#include "config.h"
#include "playsave.h"
EMSCRIPTEN_KEEPALIVE void astra_store_preferences(void){WriteConfigFile();write_player_file();}
EMSCRIPTEN_KEEPALIVE void astra_silence_flight(void){digi_stop_digi_sounds();songs_stop_all();}
static int astra_pause_handler(newmenu *menu,d_event *event,void *data)
{
    if(event->type!=EVENT_NEWMENU_SELECTED)return 0;
    int choice=newmenu_get_citem(menu);window *wind=newmenu_get_window(menu);
    if(choice==0){window_close(wind);return 1;}
    if(choice==1){if(!Player_is_dead)state_save_all(0,NULL,0);else nm_messagebox("Ship lost",1,"Back","Saving is available after respawning.");return 1;}
    if(choice==2){if(state_restore_all(1,0,NULL)&&window_exists(wind))window_close(wind);return 1;}
    if(choice==3){do_options_menu();return 1;}
    if(choice==4){do_weapon_priority_menu();return 1;}
    if(choice==5){extern int astra_checkpoint_available(void);if(astra_checkpoint_available()){if(nm_messagebox("Restore checkpoint?",2,"Restore","Keep flying","Replace this flight with the last checkpoint?")==0){EM_ASM(Module.checkpointCommand=1);window_close(wind);}}else nm_messagebox("Checkpoint",1,"Back","No checkpoint is available for this campaign.");return 1;}
    if(choice==6){EM_ASM(window.astraControllers?.open());return 1;}
    if(choice==7){EM_ASM(window.astraNavigation.home());return 1;}
    return 1;
}
static int astra_online_pause_handler(newmenu *menu,d_event *event,void *data)
{
    if(event->type!=EVENT_NEWMENU_SELECTED)return 0;
    switch(newmenu_get_citem(menu)){
        case 0: window_close(newmenu_get_window(menu));break;
        case 1: do_options_menu();break;
        case 2: do_weapon_priority_menu();break;
        case 3: EM_ASM(window.astraControllers?.open());break;
        case 4: EM_ASM(window.astraNet.menu());break;
        case 5: EM_ASM(window.astraNavigation.home());break;
    }
    return 1;
}
static void astra_pause_open(void)
{
    if(EM_ASM_INT(return !!Module.netSession)){
        static newmenu_item online[6];
        static char *labels[]={"Resume match","Options...","Weapon auto-select...","Joysticks & controllers...","Players & room...","Main menu..."};
        memset(online,0,sizeof online);for(int i=0;i<6;i++){online[i].type=NM_TYPE_MENU;online[i].text=labels[i];}
        game_flush_inputs();
        newmenu_do3("Flight menu","The match continues while you change options.",6,online,astra_online_pause_handler,NULL,0,NULL);
        return;
    }
    static newmenu_item items[8];
    static char *labels[]={"Resume flight","Save game...","Load game...","Options...","Weapon auto-select...","Restore checkpoint...","Joysticks & controllers...","Main menu..."};
    memset(items,0,sizeof items);for(int i=0;i<8;i++){items[i].type=NM_TYPE_MENU;items[i].text=labels[i];}
    game_flush_inputs();
    newmenu_do3("Flight paused","Your ship is standing by.",8,items,astra_pause_handler,NULL,0,NULL);
}
