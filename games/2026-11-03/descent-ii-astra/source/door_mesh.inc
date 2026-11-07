/* Beveled panel thickness follows the interpolated native cutout contour.
 * Aperture, timing, visibility and collision still belong to the original door. */
static unsigned afx_door_edges_drawn,afx_door_mechanisms;
static float afx_door_field(const ad_atlas *a,int frame,int x,int y){
    x=x<0?0:x>63?63:x;y=y<0?0:y>63?63:y;
    return a->pixels[((frame/8)*AD_TILE+y+2)*a->w+(frame%8)*AD_TILE+x+2]-128.f;
}
static void afx_door_segment(const afx_plane *m,const float *a,const float *b){
    if(!afx_inside(m,a[0],a[1])||!afx_inside(m,b[0],b[1]))return;
    float p[4][3];afx_world(m,a[0],a[1],.015f,p[0]);afx_world(m,b[0],b[1],.015f,p[1]);
    afx_world(m,b[0],b[1],.38f,p[2]);afx_world(m,a[0],a[1],.38f,p[3]);
    ax_paint(.19f,.205f,.22f,0);ag_triangle(p[0],p[1],p[2]);ag_triangle(p[0],p[2],p[3]);
    /* A thin polished leading edge gives the moving slab a readable highlight. */
    ax_paint(.41f,.42f,.43f,0);ax_tube(p[2][0],p[2][1],p[2][2],p[3][0],p[3][1],p[3][2],.022f,.022f,4);
}
static void afx_door_edges(int room,int s){
    if(astra_native_compare||!astra_refinement||ss_capture)return;astra_door_face(room,s);
    if(ad_clip<0||WallAnims[ad_clip].flags&WCF_HIDDEN||ad_phase<.02f||!ad_build(ad_clip))return;
    ad_atlas *a=&ad_atlases[ad_clip];if(!a->pixels)return;
    int turn=ad_base?0:(Segments[room].sides[s].tmap_num2>>14)&3;afx_plane m;if(!afx_plane_for(room,s,turn,&m))return;
    int f=(int)floorf(ad_phase),g=f+1<a->frames?f+1:f;float mix=ad_phase-f;
    float minU=m.uv[0],maxU=minU,minV=m.uv[1],maxV=minV;
    for(int i=1;i<4;i++){minU=fminf(minU,m.uv[i*2]);maxU=fmaxf(maxU,m.uv[i*2]);minV=fminf(minV,m.uv[i*2+1]);maxV=fmaxf(maxV,m.uv[i*2+1]);}
    if(maxU-minU>2.1f||maxV-minV>2.1f)return;
    ax_count=0;ax_energy=0;
    for(int ty=(int)floorf(minV);ty<(int)ceilf(maxV);ty++)for(int tx=(int)floorf(minU);tx<(int)ceilf(maxU);tx++)
    for(int y=0;y<62;y+=2)for(int x=0;x<62;x+=2){
        float q[4][3];const int dx[4]={0,2,2,0},dy[4]={0,0,2,2};
        for(int i=0;i<4;i++){float va=afx_door_field(a,f,x+dx[i],y+dy[i]),vb=afx_door_field(a,g,x+dx[i],y+dy[i]);q[i][0]=tx+(x+dx[i]+.5f)/64.f;q[i][1]=ty+(y+dy[i]+.5f)/64.f;q[i][2]=va+(vb-va)*mix;}
        const int tri[6]={0,1,2,0,2,3};for(int t=0;t<2;t++){float hits[2][2];int count=0;
            for(int e=0;e<3;e++){float *p=q[tri[t*3+e]],*r=q[tri[t*3+(e+1)%3]];
                if((p[2]>=0)==(r[2]>=0))continue;float w=p[2]/(p[2]-r[2]);if(count<2)for(int k=0;k<2;k++)hits[count][k]=p[k]+(r[k]-p[k])*w;count++;}
            if(count==2)afx_door_segment(&m,hits[0],hits[1]);
        }
    }
    if(ax_count){ax_flush(1,1);afx_door_edges_drawn++;}
}
