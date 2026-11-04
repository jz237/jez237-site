/* Present native menu data in accessible HTML controls. Native callbacks still
 * own every option, save/load operation, validation and transition. */
static int am_enabled(void){return EM_ASM_INT(return !!window.astraMenus);}
static void am_hide(unsigned token){EM_ASM(window.astraMenus?.hide($0);,token);}
static int am_command(unsigned token){return EM_ASM_INT(return window.astraMenus?.poll($0)||0;,token);}
static int am_index(void){return EM_ASM_INT(return window.astraMenus.current.index);}
static int am_value(void){return EM_ASM_INT(return window.astraMenus.current.value);}
static int astra_menu_frame(newmenu *menu)
{
    int op=am_command(menu->astra_token),index=op?am_index():-1;
    if(index>=0&&index<menu->nitems&&menu->items[index].type!=NM_TYPE_TEXT)menu->citem=index;
    newmenu_item *item=menu->citem>=0&&menu->citem<menu->nitems?&menu->items[menu->citem]:NULL;
    if(op==5){
        struct {event_type type;int keycode;} key={EVENT_KEY_COMMAND,KEY_ESC};
        if(menu->subfunction&&menu->subfunction(menu,(d_event*)&key,menu->userdata))return 1;
        window_close(menu->wind);return 1;
    }
    if(op==2&&item){
        if(item->type==NM_TYPE_TEXT)return 1;
        if(item->type==NM_TYPE_INPUT_MENU)item->group=0;
        d_event event={EVENT_NEWMENU_SELECTED};
        if(menu->subfunction&&menu->subfunction(menu,&event,menu->userdata))return 1;
        if(menu->rval)*menu->rval=menu->citem;
        window_close(menu->wind);return 1;
    }
    int changed=0;
    if(op==3&&item){
        int value=am_value();
        if(item->type==NM_TYPE_CHECK){item->value=!!value;changed=1;}
        if(item->type==NM_TYPE_RADIO){
            for(int i=0;i<menu->nitems;i++)if(menu->items[i].type==NM_TYPE_RADIO&&menu->items[i].group==item->group)menu->items[i].value=i==menu->citem;
            changed=1;
        }
        if(item->type==NM_TYPE_SLIDER||item->type==NM_TYPE_NUMBER){item->value=max(item->min_value,min(item->max_value,value));changed=1;}
    }
    if(op==4&&item&&(item->type==NM_TYPE_INPUT||item->type==NM_TYPE_INPUT_MENU)){
        char text[NM_MAX_TEXT_LEN+1];
        EM_ASM(stringToUTF8(window.astraMenus.current.text,$0,$1);,text,sizeof text);
        int at=0;
        for(int i=0;text[i]&&at<min(item->text_len,NM_MAX_TEXT_LEN);i++){
            unsigned char c=text[i];if(!char_allowed(c)&&c==' '&&char_allowed('_'))c='_';
            if(char_allowed(c))item->text[at++]=c;
        }
        item->text[at]=0;item->value=at;if(item->type==NM_TYPE_INPUT_MENU)item->group=1;
        changed=1;
    }
    if(op==6&&item&&menu->reorderitems){
        int next=menu->citem+(am_value()<0?-1:1);
        if(next>=0&&next<menu->nitems){
            char *text=item->text;int value=item->value;
            item->text=menu->items[next].text;item->value=menu->items[next].value;
            menu->items[next].text=text;menu->items[next].value=value;menu->citem=next;changed=1;
        }
    }
    if(changed&&menu->subfunction){
        window *wind=menu->wind;d_event event={EVENT_NEWMENU_CHANGED};menu->subfunction(menu,&event,menu->userdata);
        if(!window_exists(wind)||window_get_front()!=wind)return 1;
    }
    EM_ASM(window.astraMenus.begin($0,UTF8ToString($1),UTF8ToString($2),$3,0,$4,$5);,
      menu->astra_token,menu->title?menu->title:"",menu->subtitle?menu->subtitle:"",menu->citem,
      !(menu->filename&&(!menu->title||!menu->title[0])),menu->reorderitems);
    for(int i=0;i<menu->nitems;i++){
        newmenu_item *m=&menu->items[i];
        int numeric=m->type==NM_TYPE_NUMBER||m->type==NM_TYPE_SLIDER;
        int input=m->type==NM_TYPE_INPUT||m->type==NM_TYPE_INPUT_MENU;
        EM_ASM(window.astraMenus.item($0,$1,UTF8ToString($2),$3,$4,$5,$6,$7);,
          i,m->type,m->text?m->text:"",(numeric||input||m->type==NM_TYPE_CHECK||m->type==NM_TYPE_RADIO)?m->value:0,numeric?m->min_value:0,numeric?m->max_value:0,m->type==NM_TYPE_RADIO?m->group:0,input?m->text_len:0);
    }
    EM_ASM(window.astraMenus.commit());return 1;
}
