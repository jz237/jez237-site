/* R35: reconstruct materials from the current campaign bitmap. The native
 * drawing supplies every panel, stripe, aperture, color and animation frame.
 * The replacement image contributes only fine, high-pass surface grain. */
static GLuint af_detail,af_original;
static int af_kind,af_count;
static png_data af_stone_color,af_stone_normal,af_metal_color;
static int af_grain_ready;
static float af_sat(float x){return fminf(1,fmaxf(0,x));}
static float af_mix(float a,float b,float t){return a+(b-a)*t;}
static float af_smooth(float a,float b,float x){x=af_sat((x-a)/(b-a));return x*x*(3-2*x);}
static unsigned af_hash(unsigned x){x^=x>>16;x*=0x7feb352d;x^=x>>15;x*=0x846ca68b;return x^(x>>16);}
static float af_random(int x,int y){return (af_hash((unsigned)x*73856093u^(unsigned)y*19349663u)&65535)/65535.f;}
static float af_noise(float x,float y){int X=floorf(x),Y=floorf(y);float u=x-X,v=y-Y;u=u*u*(3-2*u);v=v*v*(3-2*v);return af_mix(af_mix(af_random(X,Y),af_random(X+1,Y),u),af_mix(af_random(X,Y+1),af_random(X+1,Y+1),u),v);}
static GLuint af_upload(const unsigned char *pixels,int w,int h,int channels){
    GLuint t;glGenTextures(1,&t);glBindTexture(GL_TEXTURE_2D,t);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR_MIPMAP_LINEAR);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_REPEAT);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_REPEAT);
    glPixelStorei(GL_UNPACK_ALIGNMENT,1);
    glTexImage2D(GL_TEXTURE_2D,0,channels==4?GL_RGBA:GL_RGB,w,h,0,channels==4?GL_RGBA:GL_RGB,GL_UNSIGNED_BYTE,pixels);
    glGenerateMipmap(GL_TEXTURE_2D);
    if(ogl_maxanisotropy>1)glTexParameterf(GL_TEXTURE_2D,GL_TEXTURE_MAX_ANISOTROPY_EXT,fminf(16,ogl_maxanisotropy));
    return t;
}
static float af_sample(const float *a,int w,int h,float x,float y,int c,int channels){
    int X=floorf(x),Y=floorf(y);float u=x-X,v=y-Y;
    int x0=(X%w+w)%w,x1=(x0+1)%w,y0=(Y%h+h)%h,y1=(y0+1)%h;
    return af_mix(af_mix(a[(y0*w+x0)*channels+c],a[(y0*w+x1)*channels+c],u),af_mix(a[(y1*w+x0)*channels+c],a[(y1*w+x1)*channels+c],u),v);
}
static int af_surface(const char *name){
    if(!strcmp(name,"rbot090"))return 1; /* Also used as a native mine panel. */
    const char *prefix[]={"rock","metl","ceil","misc","ctrl","door","wall","secretdr","lava","water","blown","fram","rmap","exit","arw","fan","box","force","bluegoal","redgoal"};
    for(int i=0;i<sizeof prefix/sizeof *prefix;i++)if(!strncmp(name,prefix[i],strlen(prefix[i])))return 1;return 0;
}
static int astra_faithful(grs_bitmap *bm,const char *name,png_data *img){
    af_detail=af_original=0;af_kind=0;
    if(!af_surface(name)||!bm->bm_data||img->channels!=3||bm->bm_w<1||bm->bm_h<1||bm->bm_w>256||bm->bm_h>256)return 0;
    int w=bm->bm_w,h=bm->bm_h,W=img->width,H=img->height;
    int door=!strncmp(name,"door",4),doorid=door?atoi(name+4):0;
    /* Rock-faced native secret doors receive exactly the rock treatment; no
     * new screws, badges or metallic highlights can give their position away. */
    int rock=!strncmp(name,"rock",4)||(door&&(doorid==18||doorid==19||doorid==20||doorid==21||doorid==22||doorid==25||doorid==26||(doorid>=29&&doorid<=31)||(doorid>=37&&doorid<=45)||(doorid>=48&&doorid<=52)||doorid==54||doorid==57));
    int liquid=!strncmp(name,"lava",4)||!strncmp(name,"water",5)||!strncmp(name,"force",5);
    if(!af_grain_ready){read_png("m020.png",&af_stone_color);read_png("n020.png",&af_stone_normal);read_png("m006.png",&af_metal_color);af_grain_ready=1;}
    int lamp=!strncmp(name,"ceil",4)||!strncmp(name,"misc",4)||!strncmp(name,"ctrl",4)||!strncmp(name,"blown",5);
    int mask=bm->bm_flags&(BM_FLAG_TRANSPARENT|BM_FLAG_SUPER_TRANSPARENT),ch=mask?4:3;
    unsigned char *index=malloc(w*h),*old=malloc(w*h*4),*out=malloc(W*H*ch),*detail=malloc(W*H*4);
    float *native=malloc(w*h*4*sizeof(float)),*layout=malloc(w*h*4*sizeof(float)),*height=malloc(W*H*sizeof(float));
    if(!index||!old||!out||!detail||!native||!layout||!height){free(index);free(old);free(out);free(detail);free(native);free(layout);free(height);return 0;}
    if(bm->bm_flags&BM_FLAG_RLE){int wide=(bm->bm_flags&BM_FLAG_RLE_BIG)!=0;unsigned char *sizes=bm->bm_data+4,*row=sizes+h*(1+wide);
        for(int y=0;y<h;y++){gr_rle_decode(row,index+y*w);row+=wide?(sizes[y*2]|sizes[y*2+1]<<8):sizes[y];}
    }else for(int y=0;y<h;y++)memcpy(index+y*w,bm->bm_data+y*bm->bm_rowsize,w);
    for(int i=0;i<w*h;i++){
        int t=index[i];int alpha=t==254&&(bm->bm_flags&BM_FLAG_SUPER_TRANSPARENT)?0:t==255&&(bm->bm_flags&BM_FLAG_TRANSPARENT)?1:255;
        for(int c=0;c<3;c++)native[i*4+c]=(old[i*4+c]=ogl_pal[t*3+c]*4)/255.f;
        old[i*4+3]=alpha;native[i*4+3]=alpha==255?1:0;
    }
    /* Remove palette dither within a material, never across an aperture or a
     * large change of pigment. This retains the original silhouettes. */
    for(int y=0;y<h;y++)for(int x=0;x<w;x++){
        float *p=native+(y*w+x)*4,*d=layout+(y*w+x)*4,total=0;d[0]=d[1]=d[2]=0;d[3]=p[3];
        for(int yy=-1;yy<=1;yy++)for(int xx=-1;xx<=1;xx++){
            float *q=native+(((y+yy+h)%h)*w+(x+xx+w)%w)*4;
            if(q[3]!=p[3])continue;
            float diff=fabsf(p[0]-q[0])+fabsf(p[1]-q[1])+fabsf(p[2]-q[2]);
            float weight=(xx==0&&yy==0?4.f:1.f)/(1+diff*diff*(rock?4:35));
            for(int c=0;c<3;c++)d[c]+=q[c]*weight;total+=weight;
        }
        for(int c=0;c<3;c++)d[c]/=total;
    }
    /* Analytic lenses keep the native count, position, size and silhouette.
     * Their machined rims no longer inherit 64-pixel stair steps. */
    int lens=0,number=atoi(name+4),xmin=w,ymin=h,xmax=-1,ymax=-1;float lensColor[3]={0},lensCount=0;
    if(!strncmp(name,"ceil",4)&&!strchr(name,'b')){
        if(number==2||number==24)lens=1;
        if(number==3||number==25)lens=2;
        if(number==8||number==27||number==28||number==29||number==30||number==35||number==36)lens=3;
    }
    if(!strncmp(name,"misc",4)&&(number==85||number==86))lens=3;
    if(!mask)lens=0;
    if(lens)for(int y=0;y<h;y++)for(int x=0;x<w;x++){
        int i=y*w+x;if(old[i*4+3]!=255)continue;
        if(x<xmin)xmin=x;if(x>xmax)xmax=x;if(y<ymin)ymin=y;if(y>ymax)ymax=y;
        if(native[i*4]>.65f&&native[i*4+1]>.65f&&native[i*4+2]>.65f){for(int c=0;c<3;c++)lensColor[c]+=native[i*4+c];lensCount++;}
    }
    if(xmax<0||lensCount<1)lens=0;
    for(int c=0;c<3;c++)lensColor[c]/=fmaxf(1,lensCount);
    float cx=(xmin+xmax+1.f)/(2*w),cy=(ymin+ymax+1.f)/(2*h),bx=(xmax-xmin+1.f)/(2*w),by=(ymax-ymin+1.f)/(2*h);
    for(int y=0;y<H;y++)for(int x=0;x<W;x++){
        int i=y*W+x;float u=(x+.5f)/W,v=(y+.5f)/H,sx=u*w-.5f,sy=v*h-.5f;
        float src[3];for(int c=0;c<3;c++){
            src[c]=af_sample(layout,w,h,sx,sy,c,4);
            if(rock){float sum=src[c]*2;for(int j=0;j<4;j++)sum+=af_sample(layout,w,h,sx+(j%2?1:-1)*1.25f,sy+(j/2?1:-1)*1.25f,c,4);src[c]=sum/6;}
        }
        float lum=.25f*src[0]+.55f*src[1]+.20f*src[2];
        float hi=fmaxf(src[0],fmaxf(src[1],src[2])),lo=fminf(src[0],fminf(src[1],src[2]));
        float pigment=af_smooth(.12f,.42f,hi-lo);
        /* High frequency metal/stone grain, without importing another game's
         * panel layout. Procedural microdetails stay fixed across door frames. */
        unsigned char *grain=img->data+3*i,*around=img->data+3*(((y+5)%H)*W+(x+5)%W);
        float fine=(grain[0]+grain[1]+grain[2]-around[0]-around[1]-around[2])/765.f;
        float n=af_noise(u*147,v*147)-.5f,brush=af_noise(u*420,v*18)-.5f;
        float pores=af_noise(u*260,v*260),vein=af_noise(u*24,v*24);
        float metal=.74f+.18f*lum;
        float stone=.5f,steel=.5f;
        if(af_stone_color.data){int px=(int)(u*af_stone_color.width)%af_stone_color.width,py=(int)(v*af_stone_color.height)%af_stone_color.height;unsigned char *s=af_stone_color.data+(py*af_stone_color.width+px)*af_stone_color.channels;stone=(s[0]+s[1]+s[2])/765.f;}
        if(af_metal_color.data){int px=(int)((.08f+u*.84f)*af_metal_color.width),py=(int)((.08f+v*.60f)*af_metal_color.height);unsigned char *s=af_metal_color.data+(py*af_metal_color.width+px)*af_metal_color.channels;steel=(s[0]+s[1]+s[2])/765.f;}
        float micro=rock?((stone-.33f)*.62f+n*.025f):((steel-.60f)*.12f+brush*.018f+n*.015f);
        float cellx=u*28,celly=v*28,dx=cellx-floorf(cellx),dy=celly-floorf(celly);
        float scratch=af_random((int)cellx,(int)celly)>.93f?(1-af_smooth(.018f,.035f,fabsf(dx-.5f)))*af_smooth(.1f,.2f,dy)*(1-af_smooth(.65f,.8f,dy)):0;
        if(!rock)micro+=scratch*.10f;
        float glow=lamp?af_smooth(.65f,.94f,hi)*(1-af_smooth(.10f,.31f,hi-lo))*.7f:0;
        if(!strncmp(name,"ctrl",4))glow=fmaxf(glow,pigment*af_smooth(.35f,.8f,hi)*.7f);
        float diffuser=(af_smooth(.32f,.40f,fabsf(sinf(u*W*.53f)*sinf(v*H*.53f)))*.09f-.035f)*glow;
        float hx=af_sample(layout,w,h,sx+.65f,sy,0,4)+af_sample(layout,w,h,sx+.65f,sy,1,4);
        float hy=af_sample(layout,w,h,sx,sy+.65f,0,4)+af_sample(layout,w,h,sx,sy+.65f,1,4);
        float edge=af_sat((fabsf(hx-src[0]-src[1])+fabsf(hy-src[0]-src[1]))*2.1f);
        float polish=edge*(1-pigment)*.07f;
        for(int c=0;c<3;c++){
            float color=src[c]*(rock?1.02f:af_mix(metal,1.f,pigment*.7f))+micro*(.25f+.75f*src[c])+polish+diffuser;
            color=af_mix(color,src[c]*(.94f+diffuser),glow);
            out[i*ch+c]=(unsigned char)(af_sat(color)*255);
        }
        if(mask){int t=index[(y*h/H)*w+x*w/W];out[i*ch+3]=t==254&&(bm->bm_flags&BM_FLAG_SUPER_TRANSPARENT)?0:t==255&&(bm->bm_flags&BM_FLAG_TRANSPARENT)?1:255;}
        float recess=af_smooth(.07f,.40f,lum),plate=af_smooth(.40f,.75f,lum);
        height[i]=rock?(lum*.10f+stone*.27f):(.25f+recess*.15f+plate*.10f+(steel-.60f)*.025f+brush*.002f);
        if(mask&&out[i*ch+3]<2)height[i]=0;
        if(!rock&&!mask&&!liquid&&!door){
            float X=fminf(u,1-u)-.030f,Y=fminf(v,1-v)-.030f,r=sqrtf(X*X+Y*Y),bolt=1-af_smooth(.010f,.012f,r);
            if(bolt>0){float rim=af_smooth(.006f,.010f,r),slot=1-af_smooth(.0008f,.0019f,fabsf(Y+X*.4f));
                float metal=.25f+rim*.22f-slot*.20f;for(int c=0;c<3;c++)out[i*ch+c]=(unsigned char)af_mix(out[i*ch+c],(metal+c*.016f)*255,bolt);height[i]+=.035f*bolt;}
        }
        if(!strcmp(name,"misc059")||!strcmp(name,"misc019")){
            float X=fabsf(u*4-floorf(u*4)-.5f),Y=fabsf(v*4-floorf(v*4)-.5f),d=fmaxf(X,Y);
            float glass=1-af_smooth(.33f,.35f,d),rim=af_smooth(.36f,.39f,d)*(1-af_smooth(.40f,.43f,d));
            float grid=af_smooth(.15f,.3f,fabsf(sinf(u*W*.5f)*sinf(v*H*.5f)))*.10f;
            for(int c=0;c<3;c++){
                float center=af_sample(layout,w,h,(floorf(u*4)+.5f)*w/4-.5f,(floorf(v*4)+.5f)*h/4-.5f,c,4);
                float metal=.085f+rim*.15f+c*.006f;
                out[i*ch+c]=(unsigned char)(255*af_sat(af_mix(metal,center*(.71f+grid),glass)));
            }
            height[i]=.26f+rim*.075f+glass*.045f;
        }
        if(lens){
            float X=fabsf(u-cx),Y=fabsf(v-cy),small=fminf(bx,by),d;
            if(lens==2)d=sqrtf((u-cx)*(u-cx)+(v-cy)*(v-cy))-small;
            else if(lens==1)d=fmaxf(fmaxf(X-bx,Y-by),(X+Y-bx-by+small*.34f)*.7071068f);
            else {float r=small*.34f,qx=X-bx+r,qy=Y-by+r;d=sqrtf(fmaxf(qx,0)*fmaxf(qx,0)+fmaxf(qy,0)*fmaxf(qy,0))+fminf(fmaxf(qx,qy),0)-r;}
            float border=fminf(.017f,small*.16f),glass=1-af_smooth(-border*1.25f,-border*.90f,d);
            float bevel=af_smooth(-border*.60f,-border*.35f,d)*(1-af_smooth(-border*.20f,0,d));
            float grid=(1-af_smooth(.16f,.24f,fabsf(sinf(u*W*.40f)*sinf(v*H*.40f))))*.09f;
            float louvre=af_smooth(.83f,.96f,fabsf(sinf((bx>by?u:v)*126.f)))*.07f;
            for(int c=0;c<3;c++){float metal=.13f+c*.018f+bevel*.25f,light=lensColor[c]*(.75f-grid-louvre);out[i*ch+c]=(unsigned char)(af_mix(metal,light,glass)*255);}
            out[i*ch+3]=d>0?1:255;height[i]=d>0?0:.27f+bevel*.035f+glass*.07f;
        }
        detail[4*i+2]=(unsigned char)(255*af_sat(rock?.83f:glow>.4f?.40f:.36f+pigment*.27f+(pores-.5f)*.07f));
        detail[4*i+3]=(unsigned char)(af_sat(height[i])*255);
    }
    for(int y=0;y<H;y++)for(int x=0;x<W;x++){
        int i=y*W+x;float dx=(height[y*W+(x+W-1)%W]-height[y*W+(x+1)%W])*W*.075f;
        float dy=(height[((y+H-1)%H)*W+x]-height[((y+1)%H)*W+x])*H*.075f;
        float len=sqrtf(dx*dx+dy*dy+1);detail[i*4]=(unsigned char)((dx/len*.5f+.5f)*255);detail[i*4+1]=(unsigned char)((dy/len*.5f+.5f)*255);
        if(rock&&af_stone_normal.data){int px=x*af_stone_normal.width/W,py=y*af_stone_normal.height/H;unsigned char *s=af_stone_normal.data+(py*af_stone_normal.width+px)*af_stone_normal.channels;detail[i*4]=(unsigned char)(detail[i*4]*.25f+s[0]*.75f);detail[i*4+1]=(unsigned char)(detail[i*4+1]*.25f+s[1]*.75f);}
    }
    /* Re-typeset known native safety labels inside their original text bounds.
     * The surrounding panel, colors and transparency still come from Descent. */
    if(!strncmp(name,"misc",4)||!strncmp(name,"exit",4))EM_ASM({(function(){
        var name=UTF8ToString($0),labels={misc032:['MECHS ONLY','BEYOND','THIS POINT'],misc033:['SUBLEVEL','B1-3'],misc034:['DANGER','RADIATION'],misc036:['DROPSHIP','LOADING'],misc039:['SPECIMEN','CONTAINMENT'],misc040:['HUMANS ONLY','BEYOND','THIS POINT'],misc041:['WARNING','LOW GRAVITY'],misc046:['WEAPONS','TESTING','AREA'],misc048:['REACTOR','OPERATIONS']};
        var lines=labels[name];if(!lines)return;
        var w=$4,h=$5,W=$6,H=$7,source=$1,out=$2,normal=$3,ch=$8,x0=w,y0=h,x1=0,y1=0,color=[0,0,0],count=0;
        for(var y=0;y<h;y++)for(var x=0;x<w;x++){
            var i=source+4*(y*w+x),r=HEAPU8[i],g=HEAPU8[i+1],b=HEAPU8[i+2],hi=Math.max(r,g,b),lo=Math.min(r,g,b);
            if(HEAPU8[i+3]===255&&hi>140&&hi-lo>85){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);color[0]+=r;color[1]+=g;color[2]+=b;count++;}
        }
        if(count<6)return;
        x0=Math.floor(x0*W/w);y0=Math.floor(y0*H/h);x1=Math.ceil((x1+1)*W/w);y1=Math.ceil((y1+1)*H/h);
        var canvas=typeof OffscreenCanvas==='function'?new OffscreenCanvas(W,H):Object.assign(document.createElement('canvas'),{width:W,height:H}),ctx=canvas.getContext('2d');
        ctx.fillStyle='#171b1c';ctx.fillRect(x0-2,y0-2,x1-x0+4,y1-y0+4);
        var line=(y1-y0)/lines.length,size=line*.83;ctx.font='600 '+size+'px Bahnschrift, Arial, sans-serif';
        var width=Math.max(...lines.map(t=>ctx.measureText(t).width));if(width>x1-x0){size*=(x1-x0)/width;ctx.font='600 '+size+'px Bahnschrift, Arial, sans-serif';}
        ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='rgb('+color.map(c=>Math.round(c/count)).join(',')+')';
        lines.forEach((text,i)=>ctx.fillText(text,(x0+x1)/2,y0+(i+.5)*line));var pixels=ctx.getImageData(0,0,W,H).data;
        for(var y=Math.max(0,y0-2);y<Math.min(H,y1+2);y++)for(var x=Math.max(0,x0-2);x<Math.min(W,x1+2);x++){
            var i=y*W+x,d=out+i*ch;if(ch===4&&HEAPU8[d+3]<2)continue;
            for(var c=0;c<3;c++)HEAPU8[d+c]=pixels[4*i+c];HEAPU8[normal+i*4]=HEAPU8[normal+i*4+1]=128;HEAPU8[normal+i*4+2]=175;
        }
    })();},name,old,out,detail,w,h,W,H,ch);
    glActiveTexture(GL_TEXTURE0);af_detail=af_upload(detail,W,H,4);af_original=af_upload(old,w,h,4);
    af_kind=liquid?5:rock?1:lamp?3:2;
    free(index);free(old);free(detail);free(native);free(layout);free(height);free(img->data);
    img->data=out;img->channels=ch;img->alpha=mask!=0;++af_count;
    EM_ASM(Module.faithfulMaterials=({version:35,count:$0,source:'native campaign surfaces',resolution:$1});,af_count,W);
    return 1;
}
