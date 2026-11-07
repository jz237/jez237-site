/* Browser rooms carry the original D2 multiplayer packets. The relay assigns
 * four virtual addresses; no native socket, tracker or LAN discovery is used.
 * Included at the end of net_udp.c so native synchronization remains intact. */
int astra_net_active=0,astra_net_humans=0,astra_net_count=0,astra_net_owner=0;
int astra_net_bot_skill[4]={-1,-1,-1,-1};
static int an_self,an_seed;
static void an_address(struct _sockaddr *a,int slot){
    memset(a,0,sizeof(*a));a->sin_family=AF_INET;a->sin_port=htons(UDP_PORT_DEFAULT);
    a->sin_addr.s_addr=htonl(0x0a330001u+slot);
}
int astra_net_send(const void *data,int length,const struct sockaddr *to){
    if(length<1||length>1500)return -1;
    int dest=(ntohl(((const struct sockaddr_in*)to)->sin_addr.s_addr)&255)-1;
    if(dest<0||dest>=astra_net_humans||dest==an_self)return length;
    EM_ASM({window.astraNet?.send($0,HEAPU8.subarray($1,$1+$2));},dest,data,length);
    return length;
}
int astra_net_receive(void *data,int length,struct _sockaddr *from){
    int sender=EM_ASM_INT({const p=window.astraNet?.peek();return p?p.source:-1;});
    if(sender<0||sender>=astra_net_humans)return 0;
    int size=EM_ASM_INT({const p=window.astraNet.take();if(p.bytes.length>$1)return 0;HEAPU8.set(p.bytes,$0);return p.bytes.length;},data,length);
    an_address(from,sender);return size;
}
static int an_sync(void){
    memset(&UDP_MData,0,sizeof UDP_MData);net_udp_noloss_init_mdata_queue();
    EM_ASM(window.astraNet.ready($0,$1),Current_level_num,my_segments_checksum);
    fix64 deadline=timer_query()+i2f(120);
    while(!EM_ASM_INT(return window.astraNet.synchronized($0),Current_level_num)){
        if(EM_ASM_INT(return !!window.astraNet.failed)||timer_query()>deadline){Network_status=NETSTAT_MENU;return -1;}
        emscripten_sleep(25);
    }
    Netgame.numplayers=N_players=astra_net_count;Netgame.segments_checksum=my_segments_checksum;Netgame.levelnum=Current_level_num;
    Netgame.game_status=NETSTAT_PLAYING;Network_rejoined=0;
    int departed=EM_ASM_INT(return window.astraNet.departed||0);
    for(int i=0;i<MAX_PLAYERS;i++){
        Netgame.players[i].protocol.udp.isyou=i==an_self;
        Netgame.players[i].connected=i<N_players&&!(departed&(1<<i))?CONNECT_PLAYING:CONNECT_DISCONNECTED;
        Netgame.player_kills[i]=Players[i].net_kills_total;Netgame.killed[i]=Players[i].net_killed_total;Netgame.player_score[i]=Players[i].score;
        for(int j=0;j<MAX_PLAYERS;j++)Netgame.kills[i][j]=kill_matrix[i][j];
        Netgame.locations[i]=i%(NumNetPlayerPositions?NumNetPlayerPositions:1);
        Netgame.players[i].LastPacketTime=timer_query();
    }
    net_udp_read_sync_packet(NULL,0,Netgame.players[0].protocol.udp.addr);
    multi_powcap_count_powerups_in_mine();
    EM_ASM(window.astraNet.playing($0,$1),Player_num,Current_level_num);
    return Network_status==NETSTAT_PLAYING?0:-1;
}
int astra_net_start(int level){
    astra_net_active=EM_ASM_INT(return !!Module.netSession);if(!astra_net_active)return 0;
    astra_net_owner=an_self=EM_ASM_INT(return Module.netSession.self|0);
    astra_net_humans=EM_ASM_INT(return Module.netSession.humans|0);
    astra_net_count=EM_ASM_INT(return Module.netSession.roster.length|0);
    an_seed=EM_ASM_INT(return Module.netSession.seed|0);
    if(an_self<0||an_self>=astra_net_humans||astra_net_humans<1||astra_net_count>4||astra_net_count<astra_net_humans){astra_net_active=0;return 0;}
    multi_protocol=MULTI_PROTO_UDP;net_udp_init();net_udp_reset_connection_statuses();netgame_set_defaults();
    netgame_token=my_player_token=an_seed;
    change_playernum_to(an_self);
    Netgame.gamemode=EM_ASM_INT(return Module.netSession.mode==='coop')?NETGAME_COOPERATIVE:NETGAME_ANARCHY;
    Netgame.max_numplayers=astra_net_count;Netgame.numplayers=astra_net_count;
    Netgame.max_numobservers=0;Netgame.Tracker=0;Netgame.RefusePlayers=1;
    Netgame.PacketLossPrevention=0;/* WSS is ordered and reliable. */
    Netgame.RetroProtocol=0;Netgame.ShortPackets=0;Netgame.PacketsPerSec=20;
    Netgame.NoFriendlyFire=Netgame.gamemode==NETGAME_COOPERATIVE;
    Netgame.AllowColoredLighting=1;Netgame.AllowCustomModelsTextures=1;Netgame.BlackAndWhitePyros=0;
    Netgame.ShowEnemyNames=1;Netgame.difficulty=2;Netgame.levelnum=level;
    strcpy(Netgame.mission_name,Current_mission_filename);strcpy(Netgame.mission_title,Current_mission_longname);
    strcpy(Netgame.game_name,"Astra Squadron");
    for(int i=0;i<MAX_PLAYERS;i++){
        Players[i].connected=Netgame.players[i].connected=i<astra_net_count?CONNECT_PLAYING:CONNECT_DISCONNECTED;
        if(i>=astra_net_count)continue;
        EM_ASM({const s=Module.netSession.roster[$0].name;for(let n=0;n<9;n++)HEAPU8[$1+n]=n<Math.min(8,s.length)?s.charCodeAt(n):0;},i,Players[i].callsign);
        memcpy(Netgame.players[i].callsign,Players[i].callsign,CALLSIGN_LEN+1);
        Netgame.players[i].protocol.udp.isyou=i==an_self;an_address(&Netgame.players[i].protocol.udp.addr,i<astra_net_humans?i:0);
        Netgame.players[i].color=i;player_tokens[i]=an_seed;
        if(i<4)astra_net_bot_skill[i]=EM_ASM_INT(return Module.netSession.roster[$0].skill??-1,i);
    }
    N_players=astra_net_count;Netgame.game_status=Network_status=NETSTAT_STARTING;
    udp_open_socket(0,UDP_PORT_DEFAULT);net_udp_set_game_mode(Netgame.gamemode,0);
    Endlevel_sequence=Control_center_destroyed=0;StartNewLevel(level);return 1;
}
void astra_net_bot_positions(void){
    if(!astra_net_active||an_self||Network_status!=NETSTAT_PLAYING)return;
    int save=Player_num;
    for(int i=astra_net_humans;i<astra_net_count;i++){
        Player_num=i;
        /* The host transmits the bots through its own reliable broadcast path. */
        net_udp_send_pdata();
    }
    Player_num=save;
}
void astra_net_tick(void){
    if(!astra_net_active)return;
    int left=EM_ASM_INT({const n=Module.netLeft||0;Module.netLeft=0;return n;});
    for(int i=1;i<astra_net_humans;i++)if(left&(1<<i))multi_disconnect_player(i);
    static fix64 next;
    if(GameTime64<next&&next-GameTime64<i2f(2))return;next=GameTime64+F1_0/4;
    EM_ASM(Module.netPilots=[];Module.netState=({player:$0,status:$1,level:$2,mode:$3}),Player_num,Network_status,Current_level_num,Game_mode);
    for(int i=0;i<N_players;i++){
        object *o=&Objects[Players[i].objnum];
        EM_ASM(Module.netPilots.push({id:$0,object:$1,connected:$2,shields:$3,x:$4,y:$5,z:$6,room:$7,kills:$8,deaths:$9,type:$10}),i,Players[i].objnum,Players[i].connected,f2fl(Players[i].shields),f2fl(o->pos.x),f2fl(o->pos.y),f2fl(o->pos.z),o->segnum,Players[i].net_kills_total,Players[i].net_killed_total,o->type);
    }
}
