/* Mouse-accessible flight actions, using the existing save/load and options. */
#include "state.h"
#include "menu.h"
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
    if(choice==7&&nm_messagebox("End flight?",2,"End flight","Keep flying","Return to the campaign menu?\nUnsaved flight progress will be lost.")==0){
        window_close(wind);if(Game_wind)window_close(Game_wind);return 1;
    }
    return 1;
}
static void astra_pause_open(void)
{
    if(EM_ASM_INT(return !!Module.netSession)){game_flush_inputs();EM_ASM(window.astraNet.menu());return;}
    static newmenu_item items[8];
    static char *labels[]={"Resume flight","Save game...","Load game...","Options...","Weapon auto-select...","Restore checkpoint...","Joysticks & controllers...","End flight..."};
    memset(items,0,sizeof items);for(int i=0;i<8;i++){items[i].type=NM_TYPE_MENU;items[i].text=labels[i];}
    game_flush_inputs();
    newmenu_do3("Flight paused","Your ship is standing by.",8,items,astra_pause_handler,NULL,0,NULL);
}
