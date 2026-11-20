"""Drum transcription for the ghost kit, v2 (double bass). Per-drum onsets from the six DrumSep stems, cleaned with
musical rules, tom pitch -> which tom, feet for the two kick drums, hands for the two sticks. Writes film/drumhits.npz.
Pieces: 0 kick R  1 snare  2 hi-hat  3-6 rack toms  7,8 floor toms  9 ride  10 crash L  11 crash R  12 china  13 kick L"""
import numpy as np, soundfile as sf, librosa, scipy.ndimage as ndi, scipy.signal as sg, sys
D = 'audio/drumsep/drums_(%s)_MDX23C-DrumSep-aufr33-jarredou.wav'
SR = 44100; HOP = 128; NFFT = 1024
def load(k):
    x, sr = sf.read(D % k, dtype='float32', always_2d=True); assert sr == SR; return x.mean(1)
st = {k: load(k) for k in ['kick', 'snare', 'toms', 'hh', 'ride', 'crash']}
def envelope(x, ms=1.5):
    return ndi.maximum_filter1d(np.abs(x), max(1, int(SR * ms / 1000)))
ENV = {k: envelope(v) for k, v in st.items()}
def detect(k, lo, hi, thr, mind):
    x = st[k]; S = np.abs(librosa.stft(x, n_fft=NFFT, hop_length=HOP)); f = librosa.fft_frequencies(sr=SR, n_fft=NFFT)
    B = S[(f >= lo) & (f < hi)]; L = np.log1p(30 * B); fl = np.maximum(np.diff(L, axis=1, prepend=L[:, :1]), 0).mean(0)
    fl = fl / np.percentile(fl, 99.7); base = ndi.median_filter(fl, size=int(0.25 * SR / HOP))
    pk, _ = sg.find_peaks(fl - base, height=thr, distance=max(1, int(mind * SR / HOP)))
    a = ENV[k]; out = []
    for p in pk:
        c = p * HOP; i0 = max(c - int(.030 * SR), 0); i1 = min(c + int(.040 * SR), len(a) - 1)
        if i1 <= i0: continue
        m = i0 + int(np.argmax(a[i0:i1])); M = a[m]; j = m
        while j > i0 and a[j] > 0.18 * M: j -= 1                 # walk back to the foot of the attack
        ring = a[min(m + int(.25 * SR), len(a) - 1)] / (M + 1e-9)  # how much is left a quarter second later
        out.append((j / SR, M, ring))
    return np.array(out).reshape(-1, 3)
cfg = dict(kick=(30, 6000, .10, .07), snare=(120, 9000, .10, .05), toms=(50, 3000, .12, .06), hh=(3000, 16000, .08, .05), ride=(2000, 16000, .10, .06), crash=(1500, 16000, .14, .12))
rel = dict(kick=.10, snare=.08, toms=.22, hh=.08, ride=.14, crash=.22)
H = {}
for k, (lo, hi, thr, mind) in cfg.items():
    h = detect(k, lo, hi, thr, mind); p90 = np.percentile(h[:, 1], 90)
    keep = (h[:, 1] > rel[k] * p90) & (h[:, 0] > 24.5) & (h[:, 0] < 302.6)
    H[k] = h[keep]; H[k + '_p90'] = p90
    print('%-6s raw %4d kept %4d  p90 amp %.3f' % (k, len(h), keep.sum(), p90))
def amp_at(k, t, w=.02):
    i = int(t * SR); return float(ENV[k][max(i - int(w * SR), 0):i + int(w * SR)].max())
# a faint hit that coincides with a far louder one in another stem is leakage (absolute levels, not per-stem ones)
def drop_bleed(k, others, ratio):
    h = H[k]; keep = np.ones(len(h), bool)
    for i in range(len(h)):
        if any(h[i, 1] < ratio * amp_at(o, h[i, 0]) for o in others): keep[i] = False
    print('  leakage removed from %-5s: %d' % (k, (~keep).sum())); H[k] = h[keep]
drop_bleed('toms', ['snare', 'kick'], 0.50)
drop_bleed('ride', ['crash', 'hh', 'snare'], 0.30)
drop_bleed('hh', ['crash', 'snare', 'ride'], 0.25)
drop_bleed('crash', ['snare'], 0.12)
# a real crash rings on; a blip in the crash stem that dies at once is hi-hat or ride wash
c = H['crash']; ringing = c[:, 2] > 0.20; print('  crash blips that do not ring, dropped:', int((~ringing).sum())); H['crash'] = c[ringing]
# ---- toms: fundamental of each hit -> a drum, small to large
tt = H['toms'][:, 0]; tm = H['toms'][:, 1]; x = st['toms']; f0 = []
for t0 in tt:
    i = int((t0 + .012) * SR); w = x[i:i + int(.14 * SR)]
    sp = np.abs(np.fft.rfft(w * np.hanning(len(w)), 16384)); fr = np.fft.rfftfreq(16384, 1 / SR); mk = (fr >= 55) & (fr <= 330)
    f0.append(float(fr[mk][np.argmax(sp[mk])]))
f0 = np.array(f0); lg = np.log2(np.maximum(f0, 1))
def kmeans(v, k):
    c = np.quantile(v, (np.arange(k) + .5) / k)
    for _ in range(60):
        a = np.argmin(np.abs(v[:, None] - c[None]), 1); c = np.array([v[a == i].mean() if (a == i).any() else c[i] for i in range(k)])
    return np.sort(c)
best = None
for k in range(2, 7):
    c = kmeans(lg, k)
    if np.min(np.diff(c)) > 0.13 and (best is None or k > best[0]): best = (k, c)
k, c = best if best else (1, np.array([lg.mean()]))
a = np.argmin(np.abs(lg[:, None] - c[None]), 1)
print('tom clusters (Hz):', np.round(2 ** c).astype(int).tolist(), 'counts', [int((a == i).sum()) for i in range(k)])
tomslots = {1: [5], 2: [4, 7], 3: [4, 6, 7], 4: [4, 5, 7, 8], 5: [3, 4, 5, 7, 8], 6: [3, 4, 5, 6, 7, 8]}[k]
tompiece = np.array([tomslots[k - 1 - i] for i in a]) if len(a) else np.array([], int)
ev = []   # time, piece, velocity (relative to that drum's strong hits), absolute amplitude
for t, m, _ in H['kick']: ev.append((t, 0, m / H['kick_p90'], m))
for t, m, _ in H['snare']: ev.append((t, 1, m / H['snare_p90'], m))
hx = envelope(st['hh'], 4); hat_t = []; hat_o = []
for t, m, _ in H['hh']:
    i = int(t * SR); hat_t.append(t); hat_o.append(hx[min(i + int(.16 * SR), len(hx) - 1)] / (m + 1e-9) > 0.22); ev.append((t, 2, m / H['hh_p90'], m))
for t, m, p in zip(tt, tm, tompiece): ev.append((t, int(p), m / H['toms_p90'], m))
for t, m, _ in H['ride']: ev.append((t, 9, m / H['ride_p90'], m))
cx = st['crash']; cen = []
for t in H['crash'][:, 0]:
    i = int(t * SR); w = cx[i:i + 8192]; sp = np.abs(np.fft.rfft(w * np.hanning(len(w)))); fr = np.fft.rfftfreq(len(w), 1 / SR); cen.append(float((sp * fr).sum() / (sp.sum() + 1e-9)))
cen = np.array(cen)
if len(cen):
    q1, q2 = np.quantile(cen, [.45, .90])
    for (t, m, _), cc in zip(H['crash'], cen): ev.append((t, 11 if cc < q1 else (10 if cc < q2 else 12), m / H['crash_p90'], m))
ev.sort(); ev = np.array(ev)
# one cymbal stroke often shows up in two cymbal stems a few ms apart: keep the one that is actually louder
CYM = [2, 9, 10, 11, 12]; keep = np.ones(len(ev), bool); ci = np.where(np.isin(ev[:, 1], CYM))[0]
for a_, b_ in zip(ci[:-1], ci[1:]):
    if keep[a_] and ev[b_, 0] - ev[a_, 0] < 0.04 and ev[a_, 1] != ev[b_, 1]:
        crash_a, crash_b = ev[a_, 1] >= 10, ev[b_, 1] >= 10
        if crash_a != crash_b: keep[b_ if crash_a else a_] = False              # an accent on a crash wins over the time-keeper
        else: keep[b_ if ev[a_, 3] >= ev[b_, 3] else a_] = False
print('merged duplicate cymbal strokes:', int((~keep).sum())); ev = ev[keep]
# the time-keeping hand stays on one cymbal: a lone ride stroke inside a hi-hat pattern (or the reverse) is a misread
tk = np.where(np.isin(ev[:, 1], [2, 9]))[0]; flips = 0; newp = ev[:, 1].copy()
for q in tk:
    near = tk[(np.abs(ev[tk, 0] - ev[q, 0]) < 1.3) & (tk != q)]
    if len(near) >= 4:
        same = (ev[near, 1] == ev[q, 1]).mean()
        if same < 0.25: newp[q] = 9 if ev[q, 1] == 2 else 2; flips += 1
ev[:, 1] = newp; print('time-keeping strokes moved to the cymbal being played around them:', flips)
hat_t = np.array(hat_t); hat_o = np.array(hat_o)
# ---- feet: the right foot leads; quick doubles alternate between the two bass drums
kk = np.where(ev[:, 1] == 0)[0]; foot = 0; lastk = -9.
for q in kk:
    foot = (1 - foot) if ev[q, 0] - lastk < 0.19 else 0
    if foot == 1: ev[q, 1] = 13
    lastk = ev[q, 0]
ev[:, 2] = np.clip(ev[:, 2], .15, 1.4)
names = ['kickR', 'snare', 'hat', 'tom1', 'tom2', 'tom3', 'tom4', 'floor1', 'floor2', 'ride', 'crashL', 'crashR', 'china', 'kickL']
print('events', len(ev), {names[i]: int((ev[:, 1] == i).sum()) for i in range(14)}, 'open hats', int(hat_o.sum()))
# ---- hands
PX = np.array([.34, 0., -.66, -.52, -.22, .10, .46, .78, .80, .92, -.80, .34, 1.18, -.34])
PZ = np.array([.30, -.34, -.30, .12, .22, .24, .14, -.22, -.66, .20, .30, .56, -.20, .30])
pref = {1: 1, 2: 0, 9: 0, 10: 1, 11: 0, 12: 0}            # 0 = right hand, 1 = left hand
hits = ev[(ev[:, 1] > 0) & (ev[:, 1] < 13)]; hand = np.zeros(len(hits), int); last = [(-9., 1), (-9., 1)]; i = 0; alt = 0
def cost(h, t, p):
    lt, lp = last[h]; dt = max(t - lt, 1e-3); dist = np.hypot(PX[p] - PX[lp], PZ[p] - PZ[lp])
    c = 0. if pref.get(p, h) == h else .35
    if 3 <= p <= 8: c += .12 * (1 if (h == 0) == (PX[p] < -.1) else 0)
    need = .085 + dist * .16
    if dt < need: c += 3. * (need - dt) / need + .6
    elif dt < need * 2: c += .25 * (2 - dt / need)
    return c
while i < len(hits):
    j = i + 1
    while j < len(hits) and hits[j, 0] - hits[i, 0] < 0.028: j += 1
    grp = list(range(i, j))
    if len(grp) > 2: grp = sorted(sorted(grp, key=lambda q: -hits[q, 2])[:2])
    if len(grp) == 2:
        p0, p1 = int(hits[grp[0], 1]), int(hits[grp[1], 1]); t = hits[grp[0], 0]
        c_a = cost(0, t, p0) + cost(1, t, p1); c_b = cost(1, t, p0) + cost(0, t, p1)
        if PX[p0] > PX[p1]: c_b += .2
        else: c_a += .2
        for q, h in zip(grp, (0, 1) if c_a <= c_b else (1, 0)): hand[q] = h; last[h] = (hits[q, 0], int(hits[q, 1]))
    else:
        q = grp[0]; p = int(hits[q, 1]); t = hits[q, 0]; c0, c1 = cost(0, t, p), cost(1, t, p)
        h = 0 if c0 < c1 else (1 if c1 < c0 else alt); alt = 1 - h; hand[q] = h; last[h] = (t, p)
    for q in range(i, j):
        if q not in grp: hand[q] = -1
    i = j
for h in (0, 1):                                  # a stick cannot land twice within 75 ms: the weaker stroke goes (its drum still reacts)
    idx = np.where(hand == h)[0]; prev = None
    for q in idx:
        if prev is not None and hits[q, 0] - hits[prev, 0] < 0.075:
            if hits[q, 2] > hits[prev, 2]: hand[prev] = -1; prev = q
            else: hand[q] = -1
        else: prev = q
ok = hand >= 0
print('sticks: right', int((hand == 0).sum()), 'left', int((hand == 1).sum()), 'strokes no stick could take', int((~ok).sum()))
np.savez('film/drumhits.npz', ev=ev[:, :3], hits=hits[ok][:, :3], hand=hand[ok], hat_t=hat_t, hat_o=hat_o, hat_open=hat_o)
# ---- tablature of a few passages, 16th-note grid, to read the result as music
b = np.load('film/features.npz')['beats']
def tab(t0, nb=16):
    i0 = int(np.argmin(np.abs(b - t0))); grid = np.concatenate([np.linspace(b[i], b[i + 1], 4, endpoint=False) for i in range(i0, i0 + nb)])
    rows = [('CR', [10, 11, 12]), ('RD', [9]), ('HH', [2]), ('TM', [3, 4, 5, 6, 7, 8]), ('SN', [1]), ('KR', [0]), ('KL', [13])]
    print('  from %.1f s' % b[i0])
    for nm, ps in rows:
        line = ['-'] * len(grid)
        for t, p, v in ev[np.isin(ev[:, 1], ps), :3]:
            if grid[0] - .05 <= t < grid[-1] + .1: line[int(np.argmin(np.abs(grid - t)))] = 'x' if nm != 'TM' else str(int(p) - 2)
        print('  ' + nm + ' |' + '|'.join(''.join(line[q:q + 16]) for q in range(0, len(line), 16)) + '|')
for t0 in (31.4, 62.9, 101.1, 165.3, 187.4, 210.3, 257.9): tab(t0)
