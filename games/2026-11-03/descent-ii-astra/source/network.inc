/* Browser rooms carry the original D2 multiplayer packets. The relay assigns
 * four virtual addresses; no native socket, tracker or LAN discovery is used.
 * Included at the end of net_udp.c so native synchronization remains intact. */
int astra_net_active=0,astra_net_humans=0,astra_net_count=0,astra_net_owner=0,astra_net_host=0;
int astra_net_bot_skill[4]={-1,-1,-1,-1};
static int an_self,an_seed,an_retarget;
int astra_net_human(int id){return id>=0&&id<astra_net_count&&astra_net_bot_skill[id]==-1;}
static void an_address(struct _sockaddr *a,int slot){
    memset(a,0,sizeof(*a));a->sin_family=AF_INET;a->sin_port=htons(UDP_PORT_DEFAULT);
    a->sin_addr.s_addr=htonl(0x0a330001u+slot);
}
static void an_roster(int live){
    int changed=EM_ASM_INT({const n=Module.netRosterDirty||0;if($0)Module.netRosterDirty=0;return n;},live);
    if(live&&!changed)return;
    astra_net_count=EM_ASM_INT(return Module.netSession.roster.length|0);astra_net_humans=0;
    for(int i=0;i<astra_net_count&&i<4;i++){
        astra_net_bot_skill[i]=EM_ASM_INT(return Module.netSession.roster[$0].skill??-1,i);
        if(astra_net_human(i))astra_net_humans++;
        EM_ASM({const s=Module.netSession.roster[$0].name;for(let n=0;n<9;n++)HEAPU8[$1+n]=n<Math.min(8,s.length)?s.charCodeAt(n):0;},i,Players[i].callsign);
        memcpy(Netgame.players[i].callsign,Players[i].callsign,CALLSIGN_LEN+1);
        an_address(&Netgame.players[i].protocol.udp.addr,astra_net_human(i)?i:astra_net_host);
        if(live&&(changed&(1<<i))&&i!=an_self){
            multi_disconnect_player(i);Players[i].connected=Netgame.players[i].connected=CONNECT_DISCONNECTED;
            Netgame.players[i].LastPacketTime=timer_query();
        }
    }
}
int astra_net_send(const void *data,int length,const struct sockaddr *to){
    if(length<1||length>1500)return -1;
    int dest=(ntohl(((const struct sockaddr_in*)to)->sin_addr.s_addr)&255)-1;
    if(!astra_net_human(dest)||dest==an_self)return length;
    EM_ASM({window.astraNet?.send($0,HEAPU8.subarray($1,$1+$2));},dest,data,length);
    return length;
}
int astra_net_receive(void *data,int length,struct _sockaddr *from){
    int sender=EM_ASM_INT({const p=window.astraNet?.peek();return p?p.source:-1;});
    if(sender<0)return 0;
    int size=EM_ASM_INT({const p=window.astraNet.take();if(p.bytes.length>$1)return 0;HEAPU8.set(p.bytes,$0);return p.bytes.length;},data,length);
    if(!astra_net_human(sender))return 0;an_address(from,sender);return size;
}
static int an_sync(void){
    astra_net_host=EM_ASM_INT(return Module.netSession.host||0);
    memset(&UDP_MData,0,sizeof UDP_MData);net_udp_noloss_init_mdata_queue();
    an_roster(0);
    EM_ASM(window.astraNet.ready($0,$1),Current_level_num,my_segments_checksum);
    fix64 deadline=timer_query()+i2f(120);
    if(EM_ASM_INT(return !!Module.netSession.late)){
        Network_status=NETSTAT_WAITING;Network_rejoined=0;fix64 request_at=0;
        while(Network_status==NETSTAT_WAITING){
            astra_net_host=EM_ASM_INT(return Module.netSession.host||0);
            int target=EM_ASM_INT(return window.astraNet.targetLevel||0);
            if(target&&target!=Current_level_num){an_retarget=target;return -1;}
            if(EM_ASM_INT(return !!window.astraNet.failed)||timer_query()>deadline){EM_ASM(window.astraNet.abort('Could not synchronize with the host. Please return to the title and try Online again.'));Network_status=NETSTAT_MENU;return -1;}
            an_roster(0);
            if(!EM_ASM_INT(return !!Module.netSession.late))return an_sync();
            if(timer_query()>=request_at){
                UDP_sequence_packet request;memset(&request,0,sizeof request);request.type=UPID_REQUEST;request.token=an_seed;
                memcpy(request.player.callsign,Players[an_self].callsign,CALLSIGN_LEN+1);request.player.connected=Current_level_num;request.player.color=an_self;
                net_udp_send_sequence_packet(request,Netgame.players[astra_net_host].protocol.udp.addr);request_at=timer_query()+F1_0;
            }
            net_udp_listen();emscripten_sleep(25);
        }
        if(Network_status!=NETSTAT_PLAYING)return -1;
        EM_ASM(Module.netRosterDirty=0;window.astraNet.playing($0,$1),Player_num,Current_level_num);return 0;
    }
    while(!EM_ASM_INT(return window.astraNet.synchronized($0),Current_level_num)){
        if(EM_ASM_INT(return !!window.astraNet.failed)||timer_query()>deadline){Network_status=NETSTAT_MENU;return -1;}
        emscripten_sleep(25);
    }
    astra_net_host=EM_ASM_INT(return Module.netSession.host||0);
    an_roster(0);EM_ASM(Module.netRosterDirty=0);
    Netgame.numplayers=N_players=astra_net_count;Netgame.segments_checksum=my_segments_checksum;Netgame.levelnum=Current_level_num;
    Netgame.game_status=NETSTAT_PLAYING;Network_rejoined=0;
    int departed=EM_ASM_INT(return window.astraNet.departed||0);
    int joining=EM_ASM_INT(return window.astraNet.pendingSlots||0);
    for(int i=0;i<MAX_PLAYERS;i++){
        Netgame.players[i].protocol.udp.isyou=i==an_self;
        Netgame.players[i].connected=i<N_players&&astra_net_bot_skill[i]!=-2&&!(departed&(1<<i))&&(i==an_self||!(joining&(1<<i)))?CONNECT_PLAYING:CONNECT_DISCONNECTED;
        Netgame.player_kills[i]=Players[i].net_kills_total;Netgame.killed[i]=Players[i].net_killed_total;Netgame.player_score[i]=Players[i].score;
        for(int j=0;j<MAX_PLAYERS;j++)Netgame.kills[i][j]=kill_matrix[i][j];
        Netgame.locations[i]=i%(NumNetPlayerPositions?NumNetPlayerPositions:1);
        Netgame.players[i].LastPacketTime=timer_query();
    }
    net_udp_read_sync_packet(NULL,0,Netgame.players[astra_net_host].protocol.udp.addr);
    multi_powcap_count_powerups_in_mine();
    EM_ASM(window.astraNet.playing($0,$1),Player_num,Current_level_num);
    return Network_status==NETSTAT_PLAYING?0:-1;
}
int astra_net_start(int level){
    astra_net_active=EM_ASM_INT(return !!Module.netSession);if(!astra_net_active)return 0;
    level=EM_ASM_INT(return Module.netSession.level||1);
    astra_net_owner=an_self=EM_ASM_INT(return Module.netSession.self|0);
    astra_net_host=EM_ASM_INT(return Module.netSession.host||0);
    astra_net_humans=EM_ASM_INT(return Module.netSession.humans|0);
    astra_net_count=EM_ASM_INT(return Module.netSession.roster.length|0);
    an_seed=EM_ASM_INT(return Module.netSession.seed|0);
    if(an_self<0||an_self>=astra_net_count||astra_net_humans<1||astra_net_count>4||astra_net_count<astra_net_humans){astra_net_active=0;return 0;}
    multi_protocol=MULTI_PROTO_UDP;net_udp_init();net_udp_reset_connection_statuses();netgame_set_defaults();
    netgame_token=my_player_token=an_seed;
    change_playernum_to(an_self);
    an_roster(0);
    Netgame.gamemode=EM_ASM_INT(return Module.netSession.mode==='coop')?NETGAME_COOPERATIVE:NETGAME_ANARCHY;
    Netgame.max_numplayers=astra_net_count;Netgame.numplayers=astra_net_count;
    Netgame.max_numobservers=0;Netgame.Tracker=0;Netgame.RefusePlayers=EM_ASM_INT(return (Module.netSession.public||Module.netSession.continuity)?0:1);
    Netgame.PacketLossPrevention=0;/* WSS is ordered and reliable. */
    Netgame.RetroProtocol=0;Netgame.ShortPackets=0;Netgame.PacketsPerSec=20;
    Netgame.NoFriendlyFire=Netgame.gamemode==NETGAME_COOPERATIVE;
    Netgame.AllowColoredLighting=1;Netgame.AllowCustomModelsTextures=1;Netgame.BlackAndWhitePyros=0;
    Netgame.ShowEnemyNames=1;Netgame.difficulty=2;Netgame.levelnum=level;
    strcpy(Netgame.mission_name,Current_mission_filename);strcpy(Netgame.mission_title,Current_mission_longname);
    strcpy(Netgame.game_name,"Astra Squadron");
    for(int i=0;i<MAX_PLAYERS;i++){
        Players[i].connected=Netgame.players[i].connected=i<astra_net_count&&astra_net_bot_skill[i]!=-2?CONNECT_PLAYING:CONNECT_DISCONNECTED;
        if(i>=astra_net_count)continue;
        EM_ASM({const s=Module.netSession.roster[$0].name;for(let n=0;n<9;n++)HEAPU8[$1+n]=n<Math.min(8,s.length)?s.charCodeAt(n):0;},i,Players[i].callsign);
        memcpy(Netgame.players[i].callsign,Players[i].callsign,CALLSIGN_LEN+1);
        Netgame.players[i].protocol.udp.isyou=i==an_self;an_address(&Netgame.players[i].protocol.udp.addr,astra_net_human(i)?i:astra_net_host);
        Netgame.players[i].color=i;player_tokens[i]=an_seed;
        if(i<4)astra_net_bot_skill[i]=EM_ASM_INT(return Module.netSession.roster[$0].skill??-1,i);
    }
    N_players=astra_net_count;Netgame.game_status=Network_status=NETSTAT_STARTING;
    udp_open_socket(0,UDP_PORT_DEFAULT);net_udp_set_game_mode(Netgame.gamemode,0);
    Endlevel_sequence=Control_center_destroyed=0;do{an_retarget=0;StartNewLevel(level);level=an_retarget;}while(level);return 1;
}
void astra_net_bot_positions(void){
    if(!astra_net_active||an_self!=astra_net_host||Network_status!=NETSTAT_PLAYING)return;
    int save=Player_num;
    for(int i=1;i<astra_net_count;i++){
        if(astra_net_bot_skill[i]<0)continue;
        Player_num=i;
        /* The host transmits the bots through its own reliable broadcast path. */
        net_udp_send_pdata();
    }
    Player_num=save;
}
void astra_net_tick(void){
    if(!astra_net_active)return;
    int host=EM_ASM_INT(return Module.netSession.host||0);
    if(host>=0&&host<astra_net_count&&host!=astra_net_host){
        astra_net_host=host;
        for(int i=0;i<astra_net_count;i++)an_address(&Netgame.players[i].protocol.udp.addr,astra_net_human(i)?i:host);
        memset(&UDP_MData,0,sizeof UDP_MData);net_udp_noloss_init_mdata_queue();
        extern void astra_squad_takeover(void);if(an_self==host)astra_squad_takeover();
    }
    an_roster(1);
    int left=EM_ASM_INT({const n=Module.netLeft||0;Module.netLeft=0;return n;});
    for(int i=0;i<astra_net_count;i++)if(i!=an_self&&(left&(1<<i)))multi_disconnect_player(i);
    static fix64 next;
    if(GameTime64<next&&next-GameTime64<i2f(2))return;next=GameTime64+F1_0/4;
    EM_ASM(window.astraNet.hostState($0,$1,$2),Current_level_num,my_segments_checksum,Network_status==NETSTAT_PLAYING&&!Control_center_destroyed&&!Endlevel_sequence);
    EM_ASM(Module.netPilots=[];Module.netState=({player:$0,status:$1,level:$2,mode:$3}),Player_num,Network_status,Current_level_num,Game_mode);
    if(an_self==astra_net_host)EM_ASM(Module.netBotExport=([null,null,null,null]));
    EM_ASM(Module.netView=([$0/65536,$1/65536,$2/65536]),ConsoleObject->orient.fvec.x,ConsoleObject->orient.fvec.y,ConsoleObject->orient.fvec.z);
    for(int i=0;i<N_players;i++){
        object *o=&Objects[Players[i].objnum];
        if(astra_net_bot_skill[i]>=0&&an_self==astra_net_host){player *p=&Players[i];
            EM_ASM(Module.netBotExport[$0]=({shields:$1,energy:$2,flags:$3,laser:$4,primary:$5,secondary:$6,pa:Array.from(HEAPU16.subarray($7>>1,($7>>1)+10)),sa:Array.from(HEAPU16.subarray($8>>1,($8>>1)+10))}),i,p->shields,p->energy,p->flags,p->laser_level,p->primary_weapon_flags,p->secondary_weapon_flags,p->primary_ammo,p->secondary_ammo);
            extern int astra_squad_respawn_left(int);
            EM_ASM(Object.assign(Module.netBotExport[$0],({weapon:$1,missile:$2,inv:$3,cloak:$4,respawn:$5}));,i,p->primary_weapon,p->secondary_weapon,(int)max(0,min(INVULNERABLE_TIME_MAX,INVULNERABLE_TIME_MAX-(GameTime64-p->invulnerable_time))),(int)max(0,min(CLOAK_TIME_MAX,CLOAK_TIME_MAX-(GameTime64-p->cloak_time))),astra_squad_respawn_left(i));
        }
        EM_ASM(Module.netPilots.push({id:$0,object:$1,connected:$2,shields:$3,x:$4,y:$5,z:$6,room:$7,kills:$8,deaths:$9,type:$10}),i,Players[i].objnum,Players[i].connected,f2fl(Players[i].shields),f2fl(o->pos.x),f2fl(o->pos.y),f2fl(o->pos.z),o->segnum,Players[i].net_kills_total,Players[i].net_killed_total,o->type);
        int visible=i!=an_self&&!Player_is_dead&&o->type==OBJ_PLAYER&&object_to_object_visibility(ConsoleObject,o,0);
        g3s_point point={0};if(visible){g3_rotate_point(&point,&o->pos);if(!(point.p3_codes&CC_BEHIND))g3_project_point(&point);}
        EM_ASM({const p=Module.netPilots.at(-1);p.distance=$0;p.visible=!!$1;p.screen=([$2,$3]);},f2fl(vm_vec_dist_quick(&ConsoleObject->pos,&o->pos)),visible&&(point.p3_flags&PF_PROJECTED),f2fl(point.p3_sx),f2fl(point.p3_sy));
    }
}

int astra_net_reconnect(void){
    if(!astra_net_active||!EM_ASM_INT({const n=Module.netRejoinCommand||0;Module.netRejoinCommand=0;return n;}))return 0;
    player kept=Players[an_self];object pose=*ConsoleObject;int level=Current_level_num,alive=!Player_is_dead;
    astra_net_host=EM_ASM_INT(return Module.netSession.host||0);
    if(EM_ASM_INT(return window.astraNet.targetLevel||0)!=level){
        StartNewLevel(EM_ASM_INT(return window.astraNet.targetLevel||1));
        if(Network_status==NETSTAT_PLAYING)EM_ASM(Module.netReconnecting=false;Module.netDisconnected=false;window.astraNet.rejoined());
        return 1;
    }
    int result=an_sync();
    if(result==0&&alive){
        int obj=Players[an_self].objnum;Players[an_self]=kept;Players[an_self].objnum=obj;Players[an_self].connected=CONNECT_PLAYING;
        ConsoleObject=&Objects[obj];Viewer=ConsoleObject;ConsoleObject->type=OBJ_PLAYER;ConsoleObject->id=an_self;
        ConsoleObject->pos=pose.pos;ConsoleObject->orient=pose.orient;ConsoleObject->shields=kept.shields;
        ConsoleObject->mtype.phys_info=pose.mtype.phys_info;obj_relink(obj,pose.segnum);
        EM_ASM(Module.netReconnecting=false;Module.netDisconnected=false;window.astraNet.rejoined());
    }else if(result==0)EM_ASM(Module.netReconnecting=false;Module.netDisconnected=false;window.astraNet.rejoined());
    else EM_ASM(window.astraNet.abort('Could not restore this ship. Return to the title to join again.'));
    return 1;
}
