import numpy as np, librosa, json, scipy.signal as sg, scipy.ndimage as ndi
FPS=60
y,sr=librosa.load('audio/mono22.wav',sr=None)
dur=len(y)/sr; N=int(np.ceil(dur*FPS))
hop=184  # ~120 Hz analysis rate
n_fft=2048
S=np.abs(librosa.stft(y,n_fft=n_fft,hop_length=hop))
f=librosa.fft_frequencies(sr=sr,n_fft=n_fft)
ta=np.arange(S.shape[1])*hop/sr
tf=np.arange(N)/FPS
def band(lo,hi): return S[(f>=lo)&(f<hi)]
def flux(B):
    L=np.log1p(20*B); d=np.diff(L,axis=1,prepend=L[:,:1]); return np.maximum(d,0).mean(0)
def env(x,att=0.01,rel=0.25):
    o=np.zeros_like(x); a=np.exp(-1/(att*sr/hop)); r=np.exp(-1/(rel*sr/hop)); v=0
    for i,s in enumerate(x):
        c=a if s>v else r; v=c*v+(1-c)*s; o[i]=v
    return o
def norm(x,p=99.5): return np.clip(x/np.percentile(x,p),0,1.5)
def toF(x): return np.interp(tf,ta,x)
def peaks(fl,thr,mind):
    fl=fl/np.percentile(fl,99.5)
    base=ndi.median_filter(fl,size=int(0.4*sr/hop))
    pk,_=sg.find_peaks(fl-base,height=thr,distance=int(mind*sr/hop))
    return ta[pk],(fl-base)[pk]
feat={}
for k,(lo,hi) in dict(sub=(30,90),bass=(90,250),mid=(250,2000),hi=(2000,6000),air=(6000,11000)).items():
    feat[k]=toF(norm(env(band(lo,hi).mean(0),0.01,0.18)))
rms=np.sqrt((S**2).mean(0)); feat['rms']=toF(norm(env(rms,0.02,0.3)))
feat['slow']=toF(norm(ndi.gaussian_filter1d(rms,2.0*sr/hop)))
kt,ks=peaks(flux(band(35,110)),0.25,0.14)
st,ss=peaks(flux(band(160,260))*0.5/np.percentile(flux(band(160,260)),99.5)+flux(band(2500,9000))/np.percentile(flux(band(2500,9000)),99.5),0.30,0.14)
ht,hs=peaks(flux(band(7000,11000)),0.2,0.07)
print('kicks',len(kt),'snares',len(st),'hats',len(ht))
def pulses(times,strg,decay):
    o=np.zeros(N)
    for t0,s in zip(times,strg):
        m=(tf>=t0)&(tf<t0+decay*8); o[m]=np.maximum(o[m],min(s,1.5)*np.exp(-(tf[m]-t0)/decay))
    return o
feat['kick']=pulses(kt,ks/np.percentile(ks,90),0.13)
feat['snare']=pulses(st,ss/np.percentile(ss,90),0.16)
feat['hat']=pulses(ht,hs/np.percentile(hs,90),0.06)
# beats
oenv=librosa.onset.onset_strength(y=y,sr=sr,hop_length=hop)
tempo,beats=librosa.beat.beat_track(onset_envelope=oenv,sr=sr,hop_length=hop,start_bpm=148,tightness=60)
bt=beats*hop/sr
print('tempo',tempo,len(bt),'first',bt[:6])
bi=np.searchsorted(bt,tf,side='right')-1
ph=np.zeros(N); 
for i in range(N):
    b=bi[i]
    if b<0 or b>=len(bt)-1: ph[i]=0
    else: ph[i]=(tf[i]-bt[b])/(bt[b+1]-bt[b])
feat['beatphase']=ph; feat['beatidx']=np.maximum(bi,0).astype(float)
# centroid & chroma hue
cen=(S*f[:,None]).sum(0)/(S.sum(0)+1e-9); feat['centroid']=toF(np.clip(ndi.gaussian_filter1d(cen,6)/4000,0,1))
ch=librosa.feature.chroma_stft(S=S**2,sr=sr,n_fft=n_fft,hop_length=hop)
ch=ndi.gaussian_filter1d(ch,10,axis=1); ang=np.arctan2((ch*np.sin(np.arange(12)[:,None]*np.pi/6)).sum(0),(ch*np.cos(np.arange(12)[:,None]*np.pi/6)).sum(0))
feat['hue_s']=toF(np.sin(ang)); feat['hue_c']=toF(np.cos(ang))
# cumulative drivers
for k in ['rms','bass','hi','kick']:
    feat['cum_'+k]=np.cumsum(feat[k])/FPS
# mel spectrogram texture 96 bands
M=librosa.feature.melspectrogram(S=S**2,sr=sr,n_mels=96,fmin=30,fmax=11000)
M=librosa.power_to_db(M,ref=np.max); M=np.clip((M+70)/70,0,1)
M=sg.lfilter([0.5],[1,-0.5],M,axis=1)
spec=np.stack([np.interp(tf,ta,M[i]) for i in range(96)],0).astype('f4')  # (96,N)
# stereo width / guitar-ish band 700-3500 pitch salience for solo
gb=band(700,3500); gi=np.argmax(ndi.gaussian_filter(gb,(2,3)),0); gp=f[(f>=700)&(f<3500)][gi]
feat['lead']=toF(ndi.gaussian_filter1d((np.log2(gp/700)/np.log2(5)),3))
# segmentation
mf=librosa.feature.mfcc(S=librosa.power_to_db(librosa.feature.melspectrogram(S=S**2,sr=sr,n_mels=40)),n_mfcc=13)
X=np.vstack([librosa.util.normalize(mf,axis=1),ch*3])
Xs=librosa.util.sync(X,beats,aggregate=np.median)
bnd=librosa.segment.agglomerative(Xs,16)
bb=np.concatenate([[0],bt])
print('segments',[round(float(bb[min(b,len(bb)-1)]),2) for b in bnd])
# kick strength per 4s
for a in range(0,316,6):
    print(a,'k',int(((kt>=a)&(kt<a+6)).sum()),'s',int(((st>=a)&(st<a+6)).sum()),'h',int(((ht>=a)&(ht<a+6)).sum()),end=' | ')
names=sorted(feat); A=np.stack([feat[k] for k in names],0).astype('f4')
np.savez('film/features.npz',A=A,names=np.array(names),spec=spec,kicks=kt,snares=st,beats=bt,kstr=ks,sstr=ss)
print('\nsaved',A.shape,spec.shape,names)
