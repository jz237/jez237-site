/* Listbox companion to the native menu bridge (missions, pilots and files). */
static int astra_list_frame(listbox *lb)
{
    int op=am_command(lb->astra_token),index=op?am_index():-1;
    if(index>=0&&index<lb->nitems)lb->citem=index;
    if(op==5&&lb->allow_abort_flag){lb->citem=-1;window_close(lb->wind);return 1;}
    if(op==2&&lb->citem>=0&&lb->citem<lb->nitems){
        d_event event={EVENT_NEWMENU_SELECTED};
        if(lb->listbox_callback&&lb->listbox_callback(lb,&event,lb->userdata))return 1;
        window_close(lb->wind);return 1;
    }
    update_scroll_position(lb);
    EM_ASM(window.astraMenus.begin($0,UTF8ToString($1),"",$2,1,$3,0);,
      lb->astra_token,lb->title?lb->title:"Flight archive",lb->citem,lb->allow_abort_flag);
    for(int i=0;i<lb->nitems;i++)EM_ASM(window.astraMenus.item($0,0,UTF8ToString($1),0,0,0,0,0);,i,lb->item[i]);
    EM_ASM(window.astraMenus.commit());return 1;
}
