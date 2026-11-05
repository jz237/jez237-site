/* Finish an Overload material with the active D2 planet palette, moving doors,
   cut-outs, robot livery, and the light fixtures' on/off pixel pattern. */
static int astra_surfaces, astra_blasts;
static float sat_byte(float v) { return v<0 ? 0 : v>255 ? 255 : v; }
static int astra_prefix(const char *s,const char *p) { return strncmp(s,p,strlen(p))==0; }
static void astra_finish(grs_bitmap *bm,const char *name,png_data *img)
{
    if(astra_faithful(bm,name,img)){++astra_surfaces;return;}
    if (astra_prefix(name,"exp")) { ++astra_blasts; return; }
    if (!bm->bm_data || img->channels!=3 || !bm->bm_w || !bm->bm_h) return;
    const int w=bm->bm_w, h=bm->bm_h, W=img->width, H=img->height;
    if (w>256 || h>256) return;
    ++astra_surfaces;
    unsigned char *index=malloc(w*h);
    if (bm->bm_flags & BM_FLAG_RLE) {
        int wide=(bm->bm_flags & BM_FLAG_RLE_BIG)!=0;
        unsigned char *sizes=bm->bm_data+4, *row=sizes+h*(1+wide);
        for(int y=0;y<h;y++) {
            gr_rle_decode(row,index+y*w);
            row+=wide ? (sizes[y*2]|sizes[y*2+1]<<8) : sizes[y];
        }
    } else for(int y=0;y<h;y++) memcpy(index+y*w,bm->bm_data+y*bm->bm_rowsize,w);
    int masked=bm->bm_flags&(BM_FLAG_TRANSPARENT|BM_FLAG_SUPER_TRANSPARENT);
    int ch=masked?4:3;
    unsigned char *result=malloc(W*H*ch);
    float avg[3]={0}, lum, weight;
    int samples=0;
    for(int i=0;i<w*h;i++) {
        int t=index[i];
        if(masked && t>=254) continue;
        for(int c=0;c<3;c++) avg[c]+=ogl_pal[t*3+c]*4.f;
        samples++;
    }
    for(int c=0;c<3;c++) avg[c]/=samples?samples:1;
    lum=0.25f*avg[0]+0.55f*avg[1]+0.20f*avg[2];
    int geology=astra_prefix(name,"rock"), door=astra_prefix(name,"door")||astra_prefix(name,"wall");
    int fixture=astra_prefix(name,"misc")||astra_prefix(name,"blown")||astra_prefix(name,"ctrl");
    int hull=astra_prefix(name,"rbot")||astra_prefix(name,"ship");
    /* Native color identity survives; its coarse artwork no longer obscures the modern material. */
    weight=fixture?.10f:door?.075f:hull?.40f:.025f;
    float tint[3];
    for(int c=0;c<3;c++) tint[c]=.60f+.40f*(avg[c]+17)/(lum+17);
    const char *animation=strchr(name,'#');
    int frame=animation ? atoi(animation+1) : 0;
    float travel=door ? frame*.055f : 0;
    /* Decorative lamp silhouettes are not holes through the mine. Replace
     * their pixel stairs with crisp recessed strips; native super-transparent
     * grates and apertures keep their original masks below. */
    int modern_light=masked&&!(bm->bm_flags&BM_FLAG_SUPER_TRANSPARENT)&&
        (astra_prefix(name,"ceil")||astra_prefix(name,"misc")||astra_prefix(name,"blown"));
    float lampx=.5f,lampy=.5f,lampw=.31f,lamph=.065f;int lamp_vertical=0;
    if(modern_light){
        int xmin=w,ymin=h,xmax=-1,ymax=-1;
        for(int y=0;y<h;y++)for(int x=0;x<w;x++)if(index[y*w+x]<254){if(x<xmin)xmin=x;if(x>xmax)xmax=x;if(y<ymin)ymin=y;if(y>ymax)ymax=y;}
        if(xmax<0)modern_light=0;
        else {
            lampx=(xmin+xmax+1.f)/(2*w);lampy=(ymin+ymax+1.f)/(2*h);float width=(xmax-xmin+1.f)/w,height=(ymax-ymin+1.f)/h;
            lamp_vertical=height>width*1.3f;
            lampw=fminf(.36f,(lamp_vertical?height:width)*.43f);lamph=fminf(.075f,(lamp_vertical?width:height)*.20f);
        }
    }
    for(int y=0;y<H;y++){
        float fy=((y+.5f)*h/H)-.5f; int yo=(int)floorf(fy); fy-=yo;
        int y0=(yo+h)%h, y1=(y0+1)%h;
        for(int x=0;x<W;x++){
            float fx=((x+.5f)*w/W)-.5f; int xo=(int)floorf(fx); fx-=xo;
            int x0=(xo+w)%w, x1=(x0+1)%w;
            int ix[4]={index[y0*w+x0],index[y0*w+x1],index[y1*w+x0],index[y1*w+x1]};
            int ax=(x+W+(int)(travel*W*(x<W/2?1:-1)))%W;
            int ay=astra_prefix(name,"lava") ? (y+frame*H/16)%H : y;
            unsigned char *mat=img->data+3*(ay*W+ax);
            unsigned char *dst=result+ch*(y*W+x);
            for(int c=0;c<3;c++) {
                float a=ogl_pal[ix[0]*3+c],b=ogl_pal[ix[1]*3+c],d=ogl_pal[ix[2]*3+c],e=ogl_pal[ix[3]*3+c];
                float src=4*((a+(b-a)*fx)*(1-fy)+(d+(e-d)*fx)*fy);
                float grain=mat[c]*tint[c]*(geology?1.14f:1.03f);
                float color=(1-weight)*grain+weight*src;
                if(fixture || hull) color+=fmaxf(0,src-avg[c]-42)*(hull?.57f:.14f);
                dst[c]=(unsigned char)sat_byte(color);
            }
            if(masked) {
                int t=index[(y*h/H)*w+x*w/W];
                dst[3]=(t==254&&(bm->bm_flags&BM_FLAG_SUPER_TRANSPARENT))?0:(t==255&&(bm->bm_flags&BM_FLAG_TRANSPARENT))?1:255;
            }
            if(modern_light){
                float X=(x+.5f)/W-lampx,Y=(y+.5f)/H-lampy;if(lamp_vertical){float z=X;X=Y;Y=z;}
                float r=fminf(.012f,lamph*.25f),qx=fabsf(X)-(lampw-r),qy=fabsf(Y)-(lamph-r);
                float distance=sqrtf(fmaxf(qx,0)*fmaxf(qx,0)+fmaxf(qy,0)*fmaxf(qy,0))+fminf(fmaxf(qx,qy),0)-r;
                float alpha=fminf(1,fmaxf(0,.5f-distance*fminf(W,H)));dst[3]=(unsigned char)(alpha*255);
                float edge=fminf(lampw-fabsf(X),lamph-fabsf(Y));
                float diffuser=edge>.012f?1:0;
                float seams=fmodf((X+lampw)*24,1);if(seams<.10f)diffuser*=.16f;
                float lit=astra_prefix(name,"blown")?.07f:fminf(1,.36f+lum/255*.60f);
                float bevel=edge>.004f&&edge<.010f?1:0;
                for(int c=0;c<3;c++)dst[c]=(unsigned char)sat_byte((22+c*4+bevel*29)*(1-diffuser)+(118+c*20)*lit*tint[c]*diffuser);
            }
        }
    }
    free(index);free(img->data);img->data=result;img->channels=ch;img->alpha=masked!=0;
}

