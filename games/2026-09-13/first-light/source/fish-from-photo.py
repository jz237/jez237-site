"""Derive a species' body profile and textures from reference photos (First Light, tick 2.4).

Inputs: a background-removed lateral photo (head left, fins spread) and a background-removed
top-down photo (head left). Outputs into assets/fish/<id>/:
  profile.json  - 64 stations along the body (s=0 tail tip, s=1 nose): body top/bottom (fractions of
                  length, + up), half width (fraction of length), and the flank-texture rows that map
                  onto the body's dorsal and ventral edges at that station.
  flank.webp    - the lateral cutout cropped to its bounding box (the body samples it by station/height)
  fins.webp     - the same crop with the body region cleared: dorsal, anal, pelvic and caudal fins as a
                  sagittal card
  top.webp      - the dorsal photo cropped to its bounding box (the back of the loft blends it in by ring
                  angle); the stations carry the centreline row and the body half extent per station,
                  and profile.json carries a linear colour tint that matches its ridge to the flank's back
                  (--no-top when the dorsal generation came back as a side view; --top-flip if head-right)
  diag.png      - the detected body edges drawn over the photo, for the eye (diag-top.png for the top view)
Fins are separated from the body by colour and shape: the back is found by scanning down each column
to the first run of dark pixels (fin membranes are pale, their rays too thin to form a run); the
belly line is the morphological opening of the lower silhouette, which drops the narrow fin bumps.
"""
import sys, json, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import minimum_filter1d, maximum_filter1d, uniform_filter1d

def load(path):
    im=Image.open(path).convert('RGBA');a=np.array(im).astype(np.float32);return im,a

def bbox(alpha,thr=100):
    ys,xs=np.where(alpha>thr);return xs.min(),ys.min(),xs.max()+1,ys.max()+1

def opening1d(v,window):
    return maximum_filter1d(minimum_filter1d(v,window,mode='nearest'),window,mode='nearest')

def analyse(lateral,top,out_dir,species='largemouth',stations=64,dark_thr=.47,belly_window=.16,width_ratio=None,peduncle=(.70,.90),fin_alpha=1.0,no_top=False,top_flip=False):
    os.makedirs(out_dir,exist_ok=True)
    im,a=load(lateral);alpha=a[:,:,3];x0,y0,x1,y1=bbox(alpha)
    crop=im.crop((x0,y0,x1,y1));ca=np.array(crop).astype(np.float32);H,W=ca.shape[:2]
    mask=ca[:,:,3]>100
    rgb=ca[:,:,:3]/255.0;lum=rgb@np.array([.299,.587,.114]);sat=(rgb.max(2)-rgb.min(2))/np.maximum(rgb.max(2),1e-3)
    dark=(lum<dark_thr)&mask                 # olive back and lateral blotches, not fin membranes
    body_top=np.full(W,np.nan);body_bot=np.full(W,np.nan);sil_top=np.full(W,np.nan);sil_bot=np.full(W,np.nan)
    for x in range(W):
        col=np.where(mask[:,x])[0]
        if len(col)==0: continue
        sil_top[x]=col.min();sil_bot[x]=col.max()
        d=dark[:,x];run=0;found=None
        for y in range(int(col.min()),int(col.max())):
            run=run+1 if d[y] else 0
            if run>=8: found=y-7;break
        body_top[x]=found if found is not None else np.nan
    # belly: opening of the lower silhouette removes the pelvic and anal fin bumps
    valid=~np.isnan(sil_bot);bot=np.where(valid,sil_bot,np.nanmean(sil_bot))
    win=max(5,int(W*belly_window)|1)
    body_bot=minimum_filter1d(maximum_filter1d(-bot,win,mode='nearest'),win,mode='nearest')*-1  # opening on depth
    body_bot=uniform_filter1d(body_bot,max(3,int(W*.03)|1),mode='nearest')
    # back: fill gaps (the tail region has no dark run) and smooth; the body ends where the dark run vanishes
    bt=body_top.copy();has=~np.isnan(bt)
    xs_all=np.arange(W)
    # the caudal fin: from the last column with body to the tail tip, no body
    body_cols=np.where(has)[0];body_end=body_cols.max() if len(body_cols) else W-1
    bt_filled=np.interp(xs_all,xs_all[has],bt[has]) if has.sum()>2 else sil_top.copy()
    bt_open=maximum_filter1d(minimum_filter1d(bt_filled,max(5,int(W*.08)|1),mode='nearest'),max(5,int(W*.08)|1),mode='nearest')
    bt_s=uniform_filter1d(np.maximum(bt_open,np.nan_to_num(sil_top,nan=0)),max(3,int(W*.03)|1),mode='nearest')
    # the peduncle: the narrowest column in the last third is where the body ends and the caudal fin
    # begins; beyond it the loft closes over a short taper and the fin card carries the tail
    h=body_bot-bt_s;lo=int(W*peduncle[0]);hi=int(W*peduncle[1]);x_ped=lo+int(np.argmin(h[lo:hi]))
    body_end=min(W-1,x_ped+int(W*.03))
    for x in range(x_ped,W):
        f=(x-x_ped)/max(1,int(W*.06));mid=(bt_s[x]+body_bot[x])/2;hh=h[x_ped]*max(0.,1-f)
        bt_s[x]=mid-hh/2;body_bot[x]=mid+hh/2
    # top view: width per station, opening removes the pectoral fins; the crop is also the dorsal
    # texture, with the body centreline per column taken as the centroid of its dark pixels (fins
    # are pale) and the half extent clamped inside the silhouette
    tim,ta=load(top);talpha=ta[:,:,3];tx0,ty0,tx1,ty1=bbox(talpha);tcrop=tim.crop((tx0,ty0,tx1,ty1))
    if top_flip: tcrop=tcrop.transpose(Image.FLIP_LEFT_RIGHT)
    tca=np.array(tcrop).astype(np.float32);tm=tca[:,:,3]>100;TH,TW=tm.shape;trgb=tca[:,:,:3]/255.0;tlum=trgb@np.array([.299,.587,.114])
    t_top=np.array([np.where(tm[:,x])[0].min() if tm[:,x].any() else np.nan for x in range(TW)],dtype=np.float32)
    t_bot=np.array([np.where(tm[:,x])[0].max() if tm[:,x].any() else np.nan for x in range(TW)],dtype=np.float32)
    ext=np.nan_to_num(t_bot-t_top)
    ext=opening1d(ext,max(5,int(TW*.12)|1));ext=uniform_filter1d(ext,max(3,int(TW*.03)|1),mode='nearest')
    tdark=(tlum<dark_thr)&tm;rows=np.arange(TH,dtype=np.float32)[:,None]
    t_mid=np.where(np.isnan(t_top),TH/2,(np.nan_to_num(t_top,nan=0)+np.nan_to_num(t_bot,nan=TH))/2)
    dcount=tdark.sum(0);dcent=(tdark*rows).sum(0)/np.maximum(dcount,1);t_mid=np.where(dcount>=8,dcent,t_mid)
    t_mid=uniform_filter1d(t_mid,max(5,int(TW*.08)|1),mode='nearest')
    t_half=np.minimum(ext/2,np.minimum(t_mid-np.nan_to_num(t_top,nan=0),np.nan_to_num(t_bot,nan=TH)-t_mid));t_half=np.maximum(t_half,0)
    L=float(W);mid_row=float(np.nanmean((bt_s+body_bot)/2))
    prof=[]
    for i in range(stations):
        s=i/(stations-1);x=int(round((1-s)*(W-1)));xt=int(round((1-s)*(TW-1)))
        topf=(mid_row-bt_s[x])/L;botf=(mid_row-body_bot[x])/L
        hw=(float(ext[xt]/2/TW) if width_ratio is None else float((topf-botf)*width_ratio/2))
        prof.append({'s':round(s,4),'top':round(float(topf),4),'bottom':round(float(botf),4),'halfWidth':round(hw,4),
                     'texTop':round(float(bt_s[x]/H),4),'texBottom':round(float(body_bot[x]/H),4),
                     'topMid':round(float(t_mid[xt]/TH),4) if not no_top else .5,'topHalf':round(float(t_half[xt]/TH),4) if not no_top else 0.})
    # colour match at the seam: the two photos were lit separately, so the tint makes the top view's
    # outer flank (45-85 % of the half extent, where the blend runs) agree with the lateral photo's
    # upper flank (10-35 % of the body height below the back line), both in linear light
    lin=lambda c: np.power(np.clip(c,0,1),2.2)
    def band(img,msk,x,r0,r1):
        r0,r1=int(min(r0,r1)),int(max(r0,r1));seg=img[r0:r1,x];return seg[msk[r0:r1,x]]
    back=[band(rgb,mask,x,bt_s[x]+.10*(body_bot[x]-bt_s[x]),bt_s[x]+.35*(body_bot[x]-bt_s[x])) for x in range(int(W*.3),int(W*.8))]
    back=np.concatenate([b for b in back if len(b)]);flank_seam=lin(back.mean(0))
    ridge=[band(trgb,tm,x,t_mid[x]+sg*.45*t_half[x],t_mid[x]+sg*.85*t_half[x]) for x in range(int(TW*.3),int(TW*.8)) for sg in (-1,1)]
    ridge=np.concatenate([r for r in ridge if len(r)]);top_seam=lin(ridge.mean(0))
    tint=np.clip(flank_seam/np.maximum(top_seam,1e-3),.35,3.0) if not no_top else np.ones(3)
    meta={'species':species,'lengthPx':W,'heightPx':H,'midRow':round(mid_row/H,4),'bodyEndS':round(1-body_end/(W-1),4),'texAspect':round(H/W,4),
          'hasTop':not no_top,'topAspect':round(TH/TW,4),'topTint':[round(float(v),3) for v in tint],'stations':prof}
    json.dump(meta,open(os.path.join(out_dir,'profile.json'),'w'))
    crop.save(os.path.join(out_dir,'flank.webp'),quality=92,method=6)
    top_path=os.path.join(out_dir,'top.webp')
    if no_top:
        if os.path.exists(top_path): os.remove(top_path)
    else:
        tcrop.save(top_path,quality=90,method=6)
        td=tcrop.copy();tdr=ImageDraw.Draw(td)
        for x in range(0,TW,2):
            tdr.point((x,t_mid[x]),fill=(255,0,255,255));tdr.point((x,t_mid[x]-t_half[x]),fill=(255,0,0,255));tdr.point((x,t_mid[x]+t_half[x]),fill=(0,120,255,255))
        td.save(os.path.join(out_dir,'diag-top.png'))
    # fin card: clear the body, keep everything outside it (fins), feather the edge slightly
    fin=np.array(crop).copy()
    if fin_alpha!=1.0: fin[:,:,3]=np.clip(fin[:,:,3].astype(np.float32)*fin_alpha,0,255).astype(np.uint8)  # pale membranes cut translucent
    for x in range(W):
        t=int(max(0,bt_s[x]+2));b=int(min(H,body_bot[x]-2))
        if b>t: fin[t:b,x,3]=0
    Image.fromarray(fin).save(os.path.join(out_dir,'fins.webp'),quality=92,method=6)
    d=crop.copy();dr=ImageDraw.Draw(d)
    for x in range(0,W,2):
        dr.point((x,bt_s[x]),fill=(255,0,0,255));dr.point((x,body_bot[x]),fill=(0,120,255,255))
    dr.line([(body_end,0),(body_end,H)],fill=(255,0,255,255));d.save(os.path.join(out_dir,'diag.png'))
    print('profile: length',W,'px height',H,'px, body ends at s=',meta['bodyEndS'],'max depth',round(max(p['top']-p['bottom'] for p in prof),3),'L max halfwidth',round(max(p['halfWidth'] for p in prof),3),'L','| top:','none' if no_top else f'{TW}x{TH} tint {meta["topTint"]}')
    return meta

if __name__=='__main__':
    a=sys.argv;kw={}
    for i,v in enumerate(a):
        if v=='--dark': kw['dark_thr']=float(a[i+1])
        if v=='--belly-window': kw['belly_window']=float(a[i+1])
        if v=='--species': kw['species']=a[i+1]
        if v=='--width-ratio': kw['width_ratio']=float(a[i+1])
        if v=='--peduncle': kw['peduncle']=(float(a[i+1]),float(a[i+2]))
        if v=='--fin-alpha': kw['fin_alpha']=float(a[i+1])
        if v=='--no-top': kw['no_top']=True
        if v=='--top-flip': kw['top_flip']=True
    analyse(a[1],a[2],a[3],**kw)
