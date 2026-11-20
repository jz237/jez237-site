"""Audio analysis v2: features come from separated stems (drums / bass / vocals / guitar / keys) plus the full mix."""
import numpy as np, librosa, scipy.signal as sg, scipy.ndimage as ndi, sys
FPS = 60; SR = 22050; hop = 184; n_fft = 2048
def load(p):
    y, _ = librosa.load(p, sr=SR, mono=True); return y
y = load('audio/dew.flac')
st = {k: load('audio/stems/%s.wav' % k) for k in ['drums', 'bass', 'vocals', 'other', '6s_guitar', '6s_piano', '6s_other']}
L = min([len(y)] + [len(v) for v in st.values()]); y = y[:L]; st = {k: v[:L] for k, v in st.items()}
keys = st['6s_other'] + st['6s_piano']; gtr = st['6s_guitar']; nodrum = y - st['drums']
dur = len(y) / SR; N = int(np.ceil(dur * FPS)); tf = np.arange(N) / FPS
def stft(x): return np.abs(librosa.stft(x, n_fft=n_fft, hop_length=hop))
S = stft(y); D = stft(st['drums']); f = librosa.fft_frequencies(sr=SR, n_fft=n_fft); ta = np.arange(S.shape[1]) * hop / SR
fr = SR / hop
def band(M, lo, hi): return M[(f >= lo) & (f < hi)]
def flux(B):
    Lg = np.log1p(20 * B); d = np.diff(Lg, axis=1, prepend=Lg[:, :1]); return np.maximum(d, 0).mean(0)
def env(x, att=0.01, rel=0.25):
    o = np.zeros_like(x); a = np.exp(-1 / (att * fr)); r = np.exp(-1 / (rel * fr)); v = 0
    for i, s in enumerate(x):
        c = a if s > v else r; v = c * v + (1 - c) * s; o[i] = v
    return o
def norm(x, p=99.5): return np.clip(x / (np.percentile(x, p) + 1e-9), 0, 1.5)
def toF(x): return np.interp(tf, ta, x)
def rmsenv(x, att, rel):
    r = librosa.feature.rms(y=x, frame_length=n_fft, hop_length=hop)[0]; return toF(norm(env(r, att, rel), 99.))
def peaks(fl, thr, mind):
    fl = fl / np.percentile(fl, 99.5); base = ndi.median_filter(fl, size=int(0.4 * fr))
    pk, _ = sg.find_peaks(fl - base, height=thr, distance=int(mind * fr)); return ta[pk], (fl - base)[pk]
feat = {}
for k, (lo, hi) in dict(sub=(30, 90), bass=(90, 250), mid=(250, 2000), hi=(2000, 6000), air=(6000, 11000)).items():
    feat[k] = toF(norm(env(band(S, lo, hi).mean(0), 0.01, 0.18)))
rms = np.sqrt((S ** 2).mean(0)); feat['rms'] = toF(norm(env(rms, 0.02, 0.3)))
feat['slow'] = toF(norm(ndi.gaussian_filter1d(rms, 2.0 * fr)))
# ---- drums, from the drum stem
flo = flux(band(D, 35, 110)); fmd = flux(band(D, 150, 300)); fhi = flux(band(D, 2500, 9000)); ftm = flux(band(D, 80, 400)); fht = flux(band(D, 7000, 11000))
n_ = lambda v: v / np.percentile(v, 99.5)
kt, ks = peaks(flo, 0.22, 0.12)
st_, ss = peaks(np.sqrt(n_(fmd) * n_(fhi)), 0.22, 0.12)
ht, hs = peaks(fht, 0.2, 0.07)
tt, ts = peaks(ftm, 0.25, 0.09)
near = lambda a, b, tol: np.array([np.min(np.abs(b - x)) < tol if len(b) else False for x in a])
m = ~near(tt, kt, 0.045) & ~near(tt, st_, 0.045); tt, ts = tt[m], ts[m]
print('kicks', len(kt), 'snares', len(st_), 'hats', len(ht), 'toms', len(tt))
def pulses(times, strg, decay):
    o = np.zeros(N)
    for t0, s in zip(times, strg):
        mm = (tf >= t0) & (tf < t0 + decay * 8); o[mm] = np.maximum(o[mm], min(s, 1.5) * np.exp(-(tf[mm] - t0) / decay))
    return o
feat['kick'] = pulses(kt, ks / np.percentile(ks, 90), 0.13)
feat['snare'] = pulses(st_, ss / np.percentile(ss, 90), 0.16)
feat['hat'] = pulses(ht, hs / np.percentile(hs, 90), 0.06)
feat['tom'] = pulses(tt, ts / np.percentile(ts, 90), 0.14)
allo = np.sort(np.concatenate([kt, st_, tt]))
dens = np.array([((allo > t - 0.5) & (allo <= t + 0.1)).sum() for t in tf]) / 0.6
feat['fill'] = np.clip(ndi.gaussian_filter1d(dens, 6) / 9.0, 0, 1.5)
# ---- beats: the mix-tracked grid ran ~0.16 beat late against the drum stem; shift it and snap each beat to a real hit
ob = np.load('film/features_v1.npz')['beats']; per = np.gradient(ob); bt = ob - 0.16 * per
ev = np.sort(np.concatenate([kt[ks > np.percentile(ks, 30)], st_[ss > np.percentile(ss, 30)]]))
for i, b in enumerate(bt.copy()):
    j = np.argmin(np.abs(ev - b))
    if abs(ev[j] - b) < 0.07 and 25 < b < 302: bt[i] = ev[j]
bt = bt - 0.008          # flux peaks trail the true onset by about a frame
bi = np.searchsorted(bt, tf, side='right') - 1; ph = np.zeros(N)
for i in range(N):
    b = bi[i]
    ph[i] = 0 if (b < 0 or b >= len(bt) - 1) else (tf[i] - bt[b]) / (bt[b + 1] - bt[b])
feat['beatphase'] = ph; feat['beatidx'] = np.maximum(bi, 0).astype(float)
# ---- tonal
cen = (S * f[:, None]).sum(0) / (S.sum(0) + 1e-9); feat['centroid'] = toF(np.clip(ndi.gaussian_filter1d(cen, 6) / 4000, 0, 1))
Sn = stft(nodrum)
ch = librosa.feature.chroma_stft(S=Sn ** 2, sr=SR, n_fft=n_fft, hop_length=hop)
ch = ndi.gaussian_filter1d(ch, 10, axis=1); k12 = np.arange(12)[:, None] * np.pi / 6
ang = np.arctan2((ch * np.sin(k12)).sum(0), (ch * np.cos(k12)).sum(0))
feat['hue_s'] = toF(np.sin(ang)); feat['hue_c'] = toF(np.cos(ang))
# ---- stems as envelopes
feat['vox'] = rmsenv(st['vocals'], 0.03, 0.30)
feat['gtr'] = rmsenv(gtr, 0.02, 0.22)
feat['keys'] = rmsenv(keys, 0.03, 0.30)
feat['bassn'] = rmsenv(st['bass'], 0.015, 0.20)
# ---- lead line: pitch contour of the guitar stem (constant-Q salience with a harmonic sum, tracked for continuity)
C = np.abs(librosa.cqt(gtr, sr=SR, hop_length=256, fmin=110, n_bins=48 * 4, bins_per_octave=48))
C = ndi.gaussian_filter(C, (1.5, 2)); sal = C[:144] + 0.6 * C[48:]            # fundamental + octave, 110..880 Hz
strength = sal.max(0); sal = sal / (sal.max(0, keepdims=True) + 1e-9)
nb, nt = sal.shape; cost = np.zeros((nb, nt)); back = np.zeros((nb, nt), int); idx = np.arange(nb)
pen = 0.012 * np.abs(idx[:, None] - idx[None, :])
cost[:, 0] = sal[:, 0]
for t_ in range(1, nt):
    m_ = cost[None, :, t_ - 1] - pen; back[:, t_] = m_.argmax(1); cost[:, t_] = sal[:, t_] + m_.max(1)
path = np.zeros(nt, int); path[-1] = cost[:, -1].argmax()
for t_ in range(nt - 1, 0, -1): path[t_ - 1] = back[path[t_], t_]
tp = np.arange(nt) * 256 / SR
voiced = (strength > 0.18 * np.percentile(strength, 90)) & (path > 6)       # rests and string noise: hold the last note instead of diving
pv = np.interp(tp, tp[voiced], (path / 143.0)[voiced])
feat['lead'] = np.clip(np.interp(tf, tp, ndi.gaussian_filter1d(pv, 1.5)), 0, 1)
print('lead by section', ' '.join('%.2f/%.2f' % (feat['lead'][int(a_ * 60):int(b_ * 60)].mean(), feat['lead'][int(a_ * 60):int(b_ * 60)].std()) for a_, b_ in [(199, 213), (213, 224), (224, 238)]))
# ---- the crowd: noise-like upper-mid energy outside the drums
Mo = stft(st['other'] + st['vocals']); B = band(Mo, 1500, 7000) + 1e-9
flat = np.exp(np.log(B).mean(0)) / B.mean(0)
cr = env(B.mean(0) * np.clip((flat - .25) / .35, 0, 1), 0.08, 0.5)
dr = env(np.sqrt((D ** 2).mean(0)), 0.02, 1.2); dr = dr / np.percentile(dr, 95)
cr = cr * np.clip(1 - dr * 2.5, 0, 1)
feat['crowd'] = toF(norm(ndi.gaussian_filter1d(cr, 0.25 * fr), 99.))
# ---- cumulative drivers
for k in ['rms', 'bass', 'hi', 'kick']: feat['cum_' + k] = np.cumsum(feat[k]) / FPS
# ---- mel spectrogram textures: full mix, and mix without drums
def mel(M):
    Q = librosa.feature.melspectrogram(S=M ** 2, sr=SR, n_mels=96, fmin=30, fmax=11000)
    return Q
Mf = mel(S); Mh = mel(Sn); ref = Mf.max()
def tex(Q):
    Q = np.clip((librosa.power_to_db(Q, ref=ref) + 70) / 70, 0, 1); Q = sg.lfilter([0.5], [1, -0.5], Q, axis=1)
    return np.stack([np.interp(tf, ta, Q[i]) for i in range(96)], 0).astype('f4')
spec = np.stack([tex(Mf), tex(Mh)], -1)   # (96, N, 2)
names = sorted(feat); A = np.stack([feat[k] for k in names], 0).astype('f4')
np.savez('film/features.npz', A=A, names=np.array(names), spec=spec, kicks=kt, snares=st_, toms=tt, beats=bt, kstr=ks, sstr=ss, tstr=ts)
print('saved', A.shape, spec.shape, names)
# ---- structure table: one row per 8 beats from the band entry
b0 = np.argmin(np.abs(bt - 25.03)); fi = lambda k, t0, t1: float(feat[k][int(t0 * 60):max(int(t1 * 60), int(t0 * 60) + 1)].mean())
print('  t     vox  gtr keys bass rms  k  s  t  crowd')
for i in range(b0 - 16 * (b0 // 16) if False else b0 % 8, len(bt) - 8, 8):
    t0, t1 = bt[i], bt[i + 8]
    print('%6.2f %4.2f %4.2f %4.2f %4.2f %4.2f %2d %2d %2d  %4.2f' % (t0, fi('vox', t0, t1), fi('gtr', t0, t1), fi('keys', t0, t1), fi('bassn', t0, t1), fi('rms', t0, t1),
          ((kt >= t0) & (kt < t1)).sum(), ((st_ >= t0) & (st_ < t1)).sum(), ((tt >= t0) & (tt < t1)).sum(), fi('crowd', t0, t1)))
for a in [0, 5, 10, 15, 20, 300, 303, 306, 309, 312]:
    print('crowd@%d %.2f' % (a, fi('crowd', a, a + 3)), end=' | ')
