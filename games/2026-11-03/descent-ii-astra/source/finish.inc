/* Finish an Overload material with the active D2 planet palette, moving doors,
   cut-outs, robot livery, and the light fixtures' on/off pixel pattern. */
static int astra_surfaces, astra_blasts;
static float sat_byte(float v) { return v<0 ? 0 : v>255 ? 255 : v; }
static int astra_prefix(const char *s,const char *p) { return strncmp(s,p,strlen(p))==0; }
static void astra_finish(grs_bitmap *bm,const char *name,png_data *img)
{
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
    weight=fixture?.60f:door?.43f:hull?.40f:.14f;
    float tint[3];
    for(int c=0;c<3;c++) tint[c]=.60f+.40f*(avg[c]+17)/(lum+17);
    const char *animation=strchr(name,'#');
    int frame=animation ? atoi(animation+1) : 0;
    float travel=door ? frame*.055f : 0;
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
                if(fixture || hull) color+=fmaxf(0,src-avg[c]-42)*.57f;
                dst[c]=(unsigned char)sat_byte(color);
            }
            if(masked) {
                int t=index[(y*h/H)*w+x*w/W];
                dst[3]=((t==255&&(bm->bm_flags&BM_FLAG_TRANSPARENT))||(t==254&&(bm->bm_flags&BM_FLAG_SUPER_TRANSPARENT)))?0:255;
            }
        }
    }
    free(index);free(img->data);img->data=result;img->channels=ch;img->alpha=masked!=0;
}

