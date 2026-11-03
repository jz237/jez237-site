"""High-resolution panel sets for the start zones, assembled from Overload's
industrial trim, vent and paint maps. Normal and roughness stay independent."""
import numpy as np
from PIL import Image,ImageDraw,ImageFilter
def make_bulkhead(tex,kind):
    size=1024
    def grab(name):return tex[name].read().image.convert("RGB")
    grime=np.asarray(grab("ind_metal_trim_01a_basecolor").crop((24,205,990,870)).resize((size,size),Image.Resampling.LANCZOS)).mean(2)/255
    rough=np.asarray(grab("rockwall_01c_basecolor").resize((size,size))).mean(2)/255
    yy,xx=np.mgrid[:size,:size];u=xx/size;v=yy/size
    if kind==0:palette=np.array([69.,82.,85.])
    elif kind==1:palette=np.array([72.,65.,55.])
    else:palette=np.array([56.,75.,82.])
    rgb=(.55+grime*.95+(rough-rough.mean())*.25)[:,:,None]*palette
    height=np.zeros((size,size),np.float32)
    def mask(points):
        im=Image.new("L",(size,size));ImageDraw.Draw(im).polygon([(int(x*size),int(y*size)) for x,y in points],fill=255)
        return np.asarray(im)>0
    def shape(points,depth,color,mix=1):
        take=mask(points);rgb[take]=rgb[take]*(1-mix)+np.asarray(color)*(.79+grime[take,None]*.70)*mix
        height[take]=depth
    def rect(x,y,w,h,depth,color):shape([(x,y),(x+w,y),(x+w,y+h),(x,y+h)],depth,color)
    def plate(x,y,w,h,cut,depth,color):
        shape([(x+cut,y),(x+w-cut*.63,y),(x+w,y+cut*.65),(x+w,y+h-cut),(x+w-cut,y+h),(x+cut*.55,y+h),(x,y+h-cut*.65),(x,y+cut)],depth,color)
    # Deep channels expose the original Overload trim sheet underneath.
    strip=grab("om_decals_01a_basecolor");vent=strip.crop((22,409,1008,574))
    trim=grab("tn_decals_01a_basecolor");warning=trim.crop((int(trim.width*.52),int(trim.height*.53),int(trim.width*.66),int(trim.height*.636)))
    def inset(im,x,y,w,h):
        X,Y,W,H=(int(q*size) for q in (x,y,w,h));rgb[Y:Y+H,X:X+W]=np.asarray(im.resize((W,H),Image.Resampling.LANCZOS))*.78
        height[Y:Y+H,X:X+W]=-1.4
    # A structural shield and two asymmetric access covers.
    rect(.00,.00,1,1,-1.4,[27,32,32])
    plate(.035,.042,.69,.534,.095,3.4,palette*1.19)
    plate(.047,.603,.654,.334,.053,2.4,palette*.94)
    plate(.744,.054,.212,.57,.041,2.7,palette*.91)
    plate(.728,.67,.235,.255,.036,1.6,palette*.82)
    inset(vent,.10,.66,.535,.12)
    inset(vent,.783,.32,.13,.217)
    inset(warning,.782,.74,.135,.083)
    # A recessed lip and a thin maintenance stripe on the upper plate.
    shape([(.11,.39),(.51,.39),(.56,.34),(.67,.34),(.67,.369),(.572,.369),(.52,.42),(.11,.42)],2.1,palette*.46)
    rect(.122,.22,.018,.105,3.55,[161,104,49])
    rect(.149,.22,.009,.105,3.55,[155,104,51])
    # Screw heads, washer rings and slots have separate physical relief.
    for x,y in ((.109,.131),(.64,.124),(.127,.512),(.647,.509),(.10,.85),(.64,.85),(.801,.149),(.90,.592),(.787,.864),(.919,.861)):
        dx=u-x;dy=v-y;rr=np.sqrt(dx*dx+dy*dy)
        take=rr<.009;rgb[take]=[23,28,29];height[take]=-1.0
        take=rr<.0065;rgb[take]=[92,100,99];height[take]=4.0
        take=(rr<.0045)&(np.abs(dx+dy)<.0015);rgb[take]=[30,35,36];height[take]=1.2
    if kind==1:rgb=rgb[:,::-1].copy();height=height[:,::-1].copy()
    if kind==2:rgb=np.rot90(rgb).copy();height=np.rot90(height).copy()
    # Rounded shoulders and a little dirt in the cavities. Avoid noisy chrome.
    h=np.asarray(Image.fromarray(np.uint8(np.clip((height+2)*28,0,255))).filter(ImageFilter.GaussianBlur(1.3))).astype(float)/28-2
    nx=np.clip((np.roll(h,2,1)-np.roll(h,-2,1))*.35,-.80,.80);ny=np.clip((np.roll(h,2,0)-np.roll(h,-2,0))*.35,-.80,.80)
    rgb*=np.clip(1+(nx+ny)*.16,.79,1.21)[:,:,None]
    surface=np.dstack((nx*.5+.5,ny*.5+.5,.62+.1*rough))
    return Image.fromarray(np.uint8(np.clip(rgb,0,255))),Image.fromarray(np.uint8(np.clip(surface,0,1)*255))


