/* Native automap bridge. Only export discovered geometry (or the player's
 * legitimate full-map upgrade). Never advance simulation or reveal robots. */
static int ax_open;
static fix64 ax_next;
static int ax_known(int s){return s>=0&&s<=Highest_segment_index&&(Automap_visited[s]||s==ConsoleObject->segnum||cheats.fullautomap||(Players[Player_num].flags&PLAYER_FLAGS_MAP_ALL));}
static int ax_side(int s,int side,int *pass){
    segment *seg=&Segments[s];int child=seg->children[side],wi=seg->sides[side].wall_num;*pass=0;
    if(child<0)return 0;
    int fly=WALL_IS_DOORWAY(seg,side)&WID_FLY_FLAG;
    if(wi<0){*pass=1;return ax_known(child)?1:9;}
    wall *w=&Walls[wi];
    if(w->type==WALL_DOOR){
        if(w->clip_num>=0&&(WallAnims[w->clip_num].flags&WCF_HIDDEN)&&!fly)return 0;
        int key=w->keys,owned=key==KEY_NONE||(key==KEY_BLUE&&(Players[Player_num].flags&PLAYER_FLAGS_BLUE_KEY))||(key==KEY_RED&&(Players[Player_num].flags&PLAYER_FLAGS_RED_KEY))||(key==KEY_GOLD&&(Players[Player_num].flags&PLAYER_FLAGS_GOLD_KEY));
        *pass=fly||(!(w->flags&WALL_DOOR_LOCKED)&&owned);
        return key==KEY_BLUE?3:key==KEY_RED?4:key==KEY_GOLD?5:(w->flags&WALL_DOOR_LOCKED)&&!fly?6:2;
    }
    *pass=!!fly||w->type==WALL_BLASTABLE;
    return w->type==WALL_BLASTABLE&&!fly?7:fly?(ax_known(child)?1:9):6;
}
static void ax_marker(int id,int room,const char *kind,const char *name,vms_vector *p){
    EM_ASM(window.astraMap.marker($0,$1,UTF8ToString($2),UTF8ToString($3),[$4,$5,$6]);,id,room,kind,name,f2fl(p->x),f2fl(p->y),f2fl(p->z));
}
static int astra_atlas_draw(automap *am){
    if(!EM_ASM_INT(return !!window.astraMap))return 0;
    int fresh=!ax_open;ax_open=1;
    if(fresh||timer_query()>=ax_next){
        ax_next=timer_query()+F1_0/2;
        EM_ASM(window.astraMap.begin($0,$1,UTF8ToString($2),!!$3,!!$4);,fresh,Current_level_num,Current_level_name,Game_mode&GM_MULTI,Control_center_destroyed);
        for(int s=0;s<=Highest_segment_index;s++)if(ax_known(s)){
            float data[66];segment *seg=&Segments[s];int v[4];
            for(int j=0;j<8;j++){vms_vector *p=&Vertices[seg->verts[j]];data[j*3]=f2fl(p->x);data[j*3+1]=f2fl(p->y);data[j*3+2]=f2fl(p->z);}
            for(int side=0;side<6;side++){
                int pass,kind=ax_side(s,side,&pass);get_side_verts(v,s,side);
                int offset=24+side*7;data[offset]=kind?seg->children[side]:-1;data[offset+1]=kind;data[offset+2]=pass;
                for(int j=0;j<4;j++){int local=0;while(local<8&&seg->verts[local]!=v[j])local++;data[offset+3+j]=local<8?local:0;}
                int wi=seg->sides[side].wall_num;
                if(wi>=0&&kind){int tr=Walls[wi].trigger;
                    if(tr>=0&&tr<Num_triggers&&(Triggers[tr].type==TT_EXIT||Triggers[tr].type==TT_SECRET_EXIT)){
                        vms_vector p;compute_center_point_on_side(&p,seg,side);ax_marker(-100-s*6-side,s,Triggers[tr].type==TT_EXIT?"exit":"secret",Triggers[tr].type==TT_EXIT?"Exit":"Secret exit",&p);
                    }
                }
            }
            EM_ASM(window.astraMap.room($0,!!$1,$2,HEAPF32.slice($3>>2,($3>>2)+66));,s,Automap_visited[s]||s==ConsoleObject->segnum,Segment2s[s].special,data);
            if(Segment2s[s].special==SEGMENT_IS_FUELCEN){vms_vector p;compute_segment_center(&p,seg);ax_marker(-20000-s,s,"energy","Energy center",&p);}
        }
        for(int i=0;i<=Highest_object_index;i++){
            object *o=&Objects[i];if(!ax_known(o->segnum)||(o->flags&(OF_SHOULD_BE_DEAD|OF_EXPLODING)))continue;
            if(o->type==OBJ_CNTRLCEN&&!Control_center_destroyed)ax_marker(i,o->segnum,"reactor","Reactor",&o->pos);
            if(o->type==OBJ_HOSTAGE)ax_marker(i,o->segnum,"hostage","Hostages",&o->pos);
            if(o->type==OBJ_POWERUP){const char *kind=o->id==POW_KEY_BLUE?"blue":o->id==POW_KEY_RED?"red":o->id==POW_KEY_GOLD?"gold":NULL;
                if(kind)ax_marker(i,o->segnum,kind,o->id==POW_KEY_BLUE?"Blue key":o->id==POW_KEY_RED?"Red key":"Gold key",&o->pos);
            }
        }
        for(int i=0;i<NUM_MARKERS;i++)if(MarkerObject[i]>=0&&MarkerObject[i]<=Highest_object_index){object *o=&Objects[MarkerObject[i]];if(o->type==OBJ_MARKER&&ax_known(o->segnum))ax_marker(30000+i,o->segnum,"beacon",MarkerMessage[i],&o->pos);}
        EM_ASM(window.astraMap.commit(););
    }
    float pose[12];object *ship=ConsoleObject;
    vms_vector vectors[]={ship->pos,ship->orient.rvec,ship->orient.uvec,ship->orient.fvec};
    for(int i=0;i<4;i++){pose[i*3]=f2fl(vectors[i].x);pose[i*3+1]=f2fl(vectors[i].y);pose[i*3+2]=f2fl(vectors[i].z);}
    EM_ASM(window.astraMap.player($0,HEAPF32.slice($1>>2,($1>>2)+12));,ship->segnum,pose);
    EM_ASM(window.astraMap.pilots=[];);
    if(Game_mode&GM_MULTI_COOP)for(int i=0;i<N_players;i++)if(i!=Player_num&&Players[i].connected==CONNECT_PLAYING){
        object *o=&Objects[Players[i].objnum];EM_ASM(window.astraMap.pilots.push({id:$0,name:UTF8ToString($1),room:$2,position:[$3,$4,$5]});,i,Players[i].callsign,o->segnum,f2fl(o->pos.x),f2fl(o->pos.y),f2fl(o->pos.z));
    }
    am->t2=timer_query();if(am->pause_game){FrameTime=am->t2-am->t1;calc_d_tick();}am->t1=am->t2;
    return 1;
}
