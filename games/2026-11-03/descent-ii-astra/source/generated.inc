/* R36: generated high-resolution artwork, shared by material family.
 * Native bitmap data is retained only for comparison, masks and palette cues.
 * It never supplies low-resolution color detail to these replacement surfaces. */
static float ag_tint[3],ag_rect[4];
static float ag_shape;
static int ag_count;
static int ag_hidden(int door){
    int hidden[]={10,18,19,20,21,22,25,26,29,30,31,37,38,39,40,41,42,43,44,45,48,49,50,51,52,54,57};
    for(int i=0;i<sizeof hidden/sizeof *hidden;i++)if(door==hidden[i])return 1;return 0;
}
static int astra_generated(grs_bitmap *bm,const char *name,png_data *img){
    af_detail=af_original=0;af_kind=0;ag_shape=0;
    for(int c=0;c<3;c++)ag_tint[c]=1;ag_rect[0]=ag_rect[1]=0;ag_rect[2]=ag_rect[3]=1;
    if(!af_surface(name)||!bm->bm_data||bm->bm_w<1||bm->bm_h<1||bm->bm_w>256||bm->bm_h>256)return 0;
    int w=bm->bm_w,h=bm->bm_h,door=!strncmp(name,"door",4),di=door?atoi(name+4):0;
    int metl=!strncmp(name,"metl",4),ceil=!strncmp(name,"ceil",4),misc=!strncmp(name,"misc",4),ctrl=!strncmp(name,"ctrl",4);
    int n=atoi(name+4),rock=!strncmp(name,"rock",4)||ag_hidden(di),masked=bm->bm_flags&(BM_FLAG_TRANSPARENT|BM_FLAG_SUPER_TRANSPARENT);
    /* Keep legible native-derived safety signs, arrows, animated fan blades,
     * water, forcefields and emissive lava. These have functional semantics. */
    if(!(metl||ceil||misc||ctrl||door||rock||!strcmp(name,"exit02")||!strncmp(name,"wall",4)||!strcmp(name,"rbot090")))return 0;
    if(misc&&(n==19||n==29||n==30||n==32||n==33||n==34||n==35||n==36||n==39||n==40||n==41||n==46||n==48||n==50||n==55||n==58||n==59||n==63||n==104))return 0;
    if(metl&&(n==23||n==24))return 0;
    if(ceil&&n==6)return 0;
    if(strchr(name,'#')&&!door)return 0;
    unsigned char *idx=malloc(w*h),*rgba=malloc(w*h*4);
    if(!idx||!rgba){free(idx);free(rgba);return 0;}
    if(bm->bm_flags&BM_FLAG_RLE){int wide=(bm->bm_flags&BM_FLAG_RLE_BIG)!=0;unsigned char *sizes=bm->bm_data+4,*row=sizes+h*(1+wide);
        for(int y=0;y<h;y++){gr_rle_decode(row,idx+y*w);row+=wide?(sizes[y*2]|sizes[y*2+1]<<8):sizes[y];}
    }else for(int y=0;y<h;y++)memcpy(idx+y*w,bm->bm_data+y*bm->bm_rowsize,w);
    float avg[3]={0},bright[3]={0},count=0,lights=0,yellow=0;int xmin=w,ymin=h,xmax=-1,ymax=-1;
    for(int y=0;y<h;y++)for(int x=0;x<w;x++){
        int i=y*w+x,t=idx[i],alpha=t==254&&(bm->bm_flags&BM_FLAG_SUPER_TRANSPARENT)?0:t==255&&(bm->bm_flags&BM_FLAG_TRANSPARENT)?1:255;
        for(int c=0;c<3;c++)rgba[i*4+c]=ogl_pal[t*3+c]*4;rgba[i*4+3]=alpha;
        if(alpha!=255)continue;
        if(x<xmin)xmin=x;if(x>xmax)xmax=x;if(y<ymin)ymin=y;if(y>ymax)ymax=y;
        float r=rgba[i*4]/255.f,g=rgba[i*4+1]/255.f,b=rgba[i*4+2]/255.f;
        avg[0]+=r;avg[1]+=g;avg[2]+=b;count++;
        if(r>.34f&&g>.22f&&r>g*.95f&&r<g*2.4f&&g>b*1.75f)yellow++;
        if(fmaxf(r,fmaxf(g,b))>.62f){bright[0]+=r;bright[1]+=g;bright[2]+=b;lights++;}
    }
    free(idx);int family=rock?3:door?4:ctrl?5:0;
    if(!rock&&!door&&yellow>count*.08f)family=1;
    if(!rock&&!door&&masked)family=7;
    // Known native grilles and service conduits use corresponding new artwork.
    if(!masked&&ceil&&(n==15||n==16||n==17||n==19))family=2;
    if(metl&&(n==65||n==68||n==70||n==96))family=5;
    int lens=(ceil&&(n==2||n==3||n==8||n==24||n==25||n==27||n==28||n==29||n==30||n==35||n==36)&&!strchr(name,'b'))||(misc&&(n==85||n==86));
    if(lens&&masked&&lights>0&&xmax>=xmin){
        ag_shape=ceil&&(n==3||n==25)?2:1;
        family=6;ag_rect[0]=xmin/(float)w;ag_rect[1]=ymin/(float)h;
        ag_rect[2]=(xmax-xmin+1.f)/w;ag_rect[3]=(ymax-ymin+1.f)/h;
        float hi=fmaxf(bright[0],fmaxf(bright[1],bright[2]));
        for(int c=0;c<3;c++)ag_tint[c]=.04f+.96f*bright[c]/fmaxf(.001f,hi);
    }else if(family!=1&&family!=4){
        float mean=(avg[0]+avg[1]+avg[2])/3;
        for(int c=0;c<3;c++)ag_tint[c]=fminf(1.55f,fmaxf(.48f,.48f+.52f*avg[c]/fmaxf(.001f,mean)));
    }
    // Hidden panels keep the same category and palette, never door hardware.
    if(door&&ag_hidden(di)){family=di==10?0:3;}
    af_original=af_upload(rgba,w,h,4);af_kind=20+family;
    free(img->data);if(img->palette)free(img->palette);memset(img,0,sizeof *img);
    img->width=w;img->height=h;img->channels=4;img->depth=8;img->color=img->alpha=1;img->data=rgba;
    EM_ASM({Module.generatedSurfaceCount=$0;},++ag_count);
    return 1;
}
