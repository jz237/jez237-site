"""SKYHOLD 2026: trim, loudness-normalise, loop and re-encode the raw ElevenLabs clips into the game folder.

Usage: python process_audio.py <game folder> [name1,name2]     (plain python, not -I: it needs numpy + scipy)
       e.g. python scripts/skyhold/process_audio.py games/2026-11-09/skyhold
       names may be plain (beam, s1) or kind-qualified (voice/v_boss, music/boss) to avoid clashes.
       python process_audio.py stats <dir|file.mp3> [...]   spectral screen: duration, centroid, 85 % roll-off,
                                                            energy share above 4 kHz, strongest narrow tonal peak
Raw clips come from gen_audio.py (<work>/audio-raw or SK_RAW). Output: audio/<name>.mp3 (SFX + loops, mono 112 kbps),
voice/v_<name>.mp3 (mono 96 kbps), music/<name>.mp3 (stereo 128 kbps). Writes <raw>/manifest.json (duration, loudness,
peak and loop points of every file).

Same pipeline as Sini 2026 (scripts/sini-2026/process_audio.py):
- One-shots: leading/trailing silence trimmed (short pre-roll + click-free fades); frequent sounds are high-passed (so
  phones play their body) and low-passed (no bright "chirps") (SOFT) and capped in length (CUT); every one-shot is
  normalised to the same loudest-100 ms loudness (-12 LUFS, K-weighted) with a -1 dBTP ceiling: at most 6 dB of fast
  look-ahead peak limiting, beyond that the gain is lowered instead. The most frequent sounds sit lower (QUIET), so
  the beam fired many times a second and the tally ticked 30 times in a row stay soft under everything else.
- Loops (engines, tractor hum, ambient beds): the best-matching loop seam is searched near the clip's own wrap point
  (they are generated with the seamless-loop option), then cut there with a crossfade, so the decoded PCM loops
  sample-seamlessly; engine loops -18 LUFS integrated, the quiet ambient beds -22 LUFS.
- Voice: trimmed, 70 Hz high-pass, -16 LUFS integrated, -1 dBTP.
- Music: stage/title/boss tracks are cut to a seamless loop (generated intro/outro trimmed; loop points chosen so the
  8 s after the seam sounds like the 8 s after the loop start and the onset rhythm around the seam is on the same beat
  phase; minimum length per track in LMIN; correlation-aware 2.5 s crossfade); stings are trimmed with a short fade.
  Everything at -16 LUFS integrated, -1 dBTP (circular limiter on loops so the seam stays continuous).
Play loops with Web Audio (AudioBufferSourceNode.loop), not <audio loop>, so the seam stays gapless.
"""
import json, os, subprocess, sys
import numpy as np
from scipy.signal import lfilter, resample_poly, correlate
from scipy.ndimage import gaussian_filter1d, minimum_filter1d, uniform_filter1d

RAW = os.environ.get('SK_RAW', 'D:/Projects/.tmp/skyhold-work/audio-raw')
SR = 44100

ENGINE_LOOPS = {'thrust', 'liftloop', 'bossloop'}
AMB_LOOPS = {'amb_verdant', 'amb_dune', 'amb_frost', 'amb_cinder', 'amb_umbra'}
SFX_LOOPS = ENGINE_LOOPS | AMB_LOOPS
MUSIC_STINGS = {'clear', 'over'}
STING_MAX = {'clear': 10.5, 'over': 8.2}  # stings longer than this get cut with a 1.5 s fade
# minimum loop length (s) per music track (title ~90 s, stages ~120 s, boss ~100 s)
LMIN = {'title': 86.0, 'boss': 96.0, 's1': 112.0, 's2': 112.0, 's3': 112.0, 's4': 112.0, 's5': 112.0}
# frequent one-shots: cut the sub-bass phones cannot play and keep the top dark (no whistle / chirp)
SOFT = {'beam': 'highpass=f=110,lowpass=f=5500,lowpass=f=5500', 'beamhit': 'highpass=f=120,lowpass=f=6000,lowpass=f=6000',
        'pop': 'highpass=f=90,lowpass=f=6500', 'tally': 'highpass=f=200,lowpass=f=4000,lowpass=f=4000',
        'uimove': 'highpass=f=150,lowpass=f=4500,lowpass=f=4500', 'minebeep': 'highpass=f=200,lowpass=f=4000,lowpass=f=4000',
        'uiok': 'highpass=f=100,lowpass=f=7000', 'uiback': 'highpass=f=120,lowpass=f=6000',
        'bolt': 'highpass=f=70,lowpass=f=7500', 'bosshit': 'highpass=f=70,lowpass=f=8000',
        'distress': 'highpass=f=150,lowpass=f=6000', 'catch': 'highpass=f=90,lowpass=f=8000',
        'swarm': 'highpass=f=100,lowpass=f=8000', 'tell': 'highpass=f=80,lowpass=f=7000',
        'grab': 'highpass=f=70', 'mine': 'highpass=f=80,lowpass=f=7000', 'fall': 'highpass=f=80',
        'shieldhit': 'highpass=f=100'}
# loops: extra filter before looping (the turbine loop plays all the time: keep its hiss from getting tiring)
LOOPAF = {'thrust': 'lowpass=f=6500'}
# frequent one-shots get a hard maximum length (seconds) with a fade over the last part
CUT = {'beam': 0.28, 'beamhit': 0.30, 'pop': 0.60, 'tally': 0.08, 'uimove': 0.16, 'minebeep': 0.14, 'uiback': 0.35,
       'uiok': 0.5, 'bolt': 0.55, 'bosshit': 0.55, 'distress': 0.9, 'tell': 0.8, 'catch': 0.8, 'blink': 0.6,
       'blinkin': 0.6}
# loudest-100 ms target (LUFS) for the most frequent sounds (everything else: T_SFX_S)
QUIET = {'beam': -15.0, 'beamhit': -15.0, 'pop': -13.5, 'tally': -18.0, 'uimove': -15.0, 'minebeep': -17.0}

T_SFX_S, T_LOOP_I, T_AMB_I, T_VOICE_I, T_MUSIC_I, TP_CEIL = -12.0, -18.0, -22.0, -16.0, -16.0, -1.0


# ------------------------------------------------------------------------------------------------- io
def decode(src, ch, af=None):
    args = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', src]
    if af:
        args += ['-af', af]
    args += ['-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-']
    buf = subprocess.run(args, capture_output=True).stdout
    return np.frombuffer(buf, dtype=np.float32).astype(np.float64).reshape(-1, ch)


def encode(x, dst, kbps):
    ch = x.shape[1]
    data = np.clip(x, -1, 1).astype(np.float32).tobytes()
    r = subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', str(ch),
                        '-i', '-', '-c:a', 'libmp3lame', '-b:a', f'{kbps}k', dst], input=data, capture_output=True)
    if r.returncode:
        raise RuntimeError(r.stderr.decode('utf-8', 'replace'))


def dur(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
                       capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


# ------------------------------------------------------------------------------------------------- loudness (BS.1770)
def _kweight(x):
    fs = SR
    G, Q, fc = 3.999843853973347, 0.7071752369554196, 1681.974450955533  # high shelf
    A, w0 = 10 ** (G / 40), 2 * np.pi * fc / fs
    al, c = np.sin(w0) / (2 * Q), np.cos(w0)
    b = [A * ((A + 1) + (A - 1) * c + 2 * np.sqrt(A) * al), -2 * A * ((A - 1) + (A + 1) * c),
         A * ((A + 1) + (A - 1) * c - 2 * np.sqrt(A) * al)]
    a = [(A + 1) - (A - 1) * c + 2 * np.sqrt(A) * al, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - 2 * np.sqrt(A) * al]
    y = lfilter(b, a, x, axis=0)
    Q, fc = 0.5003270373238773, 38.13547087602444  # high pass
    w0 = 2 * np.pi * fc / fs
    al, c = np.sin(w0) / (2 * Q), np.cos(w0)
    return lfilter([(1 + c) / 2, -(1 + c), (1 + c) / 2], [1 + al, -2 * c, 1 - al], y, axis=0)


def _blocks(x, step, block=0.4):
    y = _kweight(x) ** 2
    n = int(block * SR)
    if len(y) < n:
        y = np.concatenate([y, np.zeros((n - len(y), y.shape[1]))])
    cs = np.concatenate([np.zeros((1, y.shape[1])), np.cumsum(y, axis=0)])
    st = np.arange(0, len(y) - n + 1, step)
    return ((cs[st + n] - cs[st]) / n).sum(axis=1)  # channel-summed mean square per block (L/R weight 1)


def lufs_integrated(x):
    z = _blocks(x, int(0.1 * SR))
    lk = -0.691 + 10 * np.log10(z + 1e-20)
    z = z[lk > -70]
    if not len(z):
        return -70.0
    rel = -0.691 + 10 * np.log10(z.mean()) - 10
    z = z[-0.691 + 10 * np.log10(z) > rel]
    return float(-0.691 + 10 * np.log10(z.mean()))


def lufs_momentary_max(x):
    return float((-0.691 + 10 * np.log10(_blocks(x, int(0.01 * SR)) + 1e-20)).max())


def lufs_short_max(x, block=0.1):
    """Loudest 100 ms (K-weighted): a fairer level for very short one-shots than the 400 ms momentary window."""
    return float((-0.691 + 10 * np.log10(_blocks(x, int(0.005 * SR), block) + 1e-20)).max())


def true_peak_db(x):
    return float(20 * np.log10(np.abs(resample_poly(x, 4, 1, axis=0)).max() + 1e-12))


def limit(x, ceil_db, circular=False, win=0.041):
    """Look-ahead peak limiter (gain held around each peak, smoothed); circular keeps a loop seam continuous."""
    mode = 'wrap' if circular else 'nearest'
    w = int(win * SR) | 1
    for _ in range(3):
        tp = true_peak_db(x)
        if tp <= ceil_db + 0.05:
            break
        ceil = 10 ** ((ceil_db - 0.3) / 20)
        pk = np.abs(resample_poly(x, 4, 1, axis=0)).max(axis=1).reshape(-1, 4).max(axis=1)[:len(x)]
        pk = np.concatenate([pk, np.full(len(x) - len(pk), pk[-1] if len(pk) else 0)])
        g = np.minimum(1.0, ceil / np.maximum(pk, 1e-9))
        g = uniform_filter1d(minimum_filter1d(g, w, mode=mode), w, mode=mode)
        x = x * g[:, None]
    return x


def gain_to(x, gain_db, max_limit_db=None, circular=False, win=0.041):
    """Apply gain; if that pushes the true peak over the ceiling, limit at most max_limit_db and lower the rest."""
    tp = true_peak_db(x) + gain_db
    over = tp - TP_CEIL
    if over > 0 and max_limit_db is not None and over > max_limit_db:
        gain_db -= over - max_limit_db
    x = x * 10 ** (gain_db / 20)
    return limit(x, TP_CEIL, circular, win)


# ------------------------------------------------------------------------------------------------- trimming
def trim(x, start_db=-42, end_db=-56, pre=0.004, post=0.02, fade_in=0.003, fade_out=0.025):
    env = np.abs(x).max(axis=1)
    pk = env.max()
    if pk <= 0:
        return x
    i0 = int(np.argmax(env > pk * 10 ** (start_db / 20)))
    i1 = len(env) - 1 - int(np.argmax(env[::-1] > pk * 10 ** (end_db / 20)))
    a, b = max(0, i0 - int(pre * SR)), min(len(x), i1 + int(post * SR))
    y = x[a:b].copy()
    fi, fo = min(int(fade_in * SR), len(y) // 4), min(int(fade_out * SR), len(y) // 3)
    if fi > 1:
        y[:fi] *= np.sin(np.linspace(0, np.pi / 2, fi))[:, None] ** 2
    if fo > 1:
        y[-fo:] *= np.cos(np.linspace(0, np.pi / 2, fo))[:, None] ** 2
    return y


def cap(x, sec):
    n = int(sec * SR)
    if len(x) <= n:
        return x
    y = x[:n].copy()
    fo = int(n * 0.4)
    y[-fo:] *= np.cos(np.linspace(0, np.pi / 2, fo))[:, None] ** 2
    return y


def fade_tail(x, sec):
    y = x.copy()
    fo = min(int(sec * SR), len(y) // 2)
    y[-fo:] *= np.cos(np.linspace(0, np.pi / 2, fo))[:, None] ** 2
    return y


# ------------------------------------------------------------------------------------------------- seamless loops
def features(m, down):
    """Log band energies (24 bands, 40 Hz - 10 kHz) + onset strength, z-scored, ~11.6 ms hop."""
    if down > 1:
        m = resample_poly(m, 1, down)
    fs, nfft = SR / down, 2048 // down
    hop = nfft // 4
    nfr = max(1, (len(m) - nfft) // hop)
    idx = np.arange(nfr)[:, None] * hop + np.arange(nfft)[None, :]
    spec = np.abs(np.fft.rfft(m[idx] * np.hanning(nfft), axis=1)) ** 2
    freqs = np.fft.rfftfreq(nfft, 1 / fs)
    edges = np.geomspace(40, min(10000, fs / 2 - 1), 25)
    bands = np.stack([spec[:, (freqs >= edges[i]) & (freqs < edges[i + 1])].sum(axis=1) for i in range(24)], axis=1)
    le = np.log10(bands + 1e-10)
    on = np.concatenate([[0], np.maximum(0, np.diff(le, axis=0)).sum(axis=1)])
    z = lambda v: (v - v.mean(axis=0)) / (v.std(axis=0) + 1e-9)
    return np.concatenate([z(le), 3 * z(on)[:, None]], axis=1), hop * down


def find_loop(x, s_rng, e_rng, win, s_step):
    """Best (S, E) in samples so that the audio after E matches the audio after S (window `win` seconds)."""
    m = x.mean(axis=1)
    down = 2 if len(m) > 20 * SR else 1
    F, hop = features(m, down)
    W = max(4, int(win * SR / hop))
    s0, s1 = int(s_rng[0] * SR / hop), int(s_rng[1] * SR / hop)
    e0, e1 = int(e_rng[0] * SR / hop), min(int(e_rng[1] * SR / hop), len(F) - W)
    rown = (F ** 2).sum(axis=1)
    cs = np.concatenate([[0], np.cumsum(rown)])
    best = (np.inf, 0, 0)
    for s in range(s0, max(s0, s1) + 1, max(1, int(s_step * SR / hop))):
        if s + W > len(F) or e1 <= e0:
            break
        A = F[s:s + W]
        seg = F[e0:e1 + W]
        cross = sum(correlate(seg[:, j], A[:, j], mode='valid', method='fft') for j in range(F.shape[1]))
        es = np.arange(e0, e0 + len(cross))
        d = (rown[s:s + W].sum() + (cs[es + W] - cs[es]) - 2 * cross) / W
        k = int(np.argmin(d))
        if d[k] < best[0]:
            best = (float(d[k]), s, int(es[k]))
    score, s, e = best
    S, E = s * hop, e * hop
    # sample-level refinement of E around the frame match
    N, h = int(0.25 * SR), hop
    ref = m[S:S + N]
    lo = max(0, E - h)
    seg = m[lo:E + h + N]
    if len(seg) >= N + 1 and len(ref) == N:
        c = correlate(seg, ref, mode='valid', method='fft')
        E = lo + int(np.argmax(c))
    return S, E, score


def find_music_loop(x, lead, oend, lmin, smax=40.0, win=8.0, s_step=0.25, w_beat=3.0, on_sigma=3.0, bpre=1.5, bpost=3.0,
                    len_bonus=0.004):
    """Musical loop points: the 8 s after E must sound like the 8 s after S (1 s-smoothed band energies) AND the rhythm
    around the seam (bpre s before to bpost s after) must be on the same beat phase (normalised correlation of the
    onset envelope at that exact offset); loop length >= lmin seconds, longer loops win small ties (len_bonus per s)."""
    m = resample_poly(x.mean(axis=1), 1, 2)
    fs, nfft, hop = SR / 2, 1024, 256
    nfr = (len(m) - nfft) // hop
    idx = np.arange(nfr)[:, None] * hop + np.arange(nfft)[None, :]
    spec = np.abs(np.fft.rfft(m[idx] * np.hanning(nfft), axis=1)) ** 2
    freqs = np.fft.rfftfreq(nfft, 1 / fs)
    edges = np.geomspace(40, 10000, 25)
    le = np.log10(np.stack([spec[:, (freqs >= edges[i]) & (freqs < edges[i + 1])].sum(axis=1) for i in range(24)], 1) + 1e-10)
    fr = fs / hop
    on = np.concatenate([[0], np.maximum(0, np.diff(le, axis=0)).sum(axis=1)])
    on = gaussian_filter1d(on - uniform_filter1d(on, int(0.5 * fr)), on_sigma)  # ~35 ms: tolerant to tiny tempo drift
    Ft = uniform_filter1d(le, int(1.0 * fr), axis=0)
    Ft = (Ft - Ft.mean(axis=0)) / (Ft.std(axis=0) + 1e-9)
    W = int(win * fr)
    rn = (Ft ** 2).sum(axis=1)
    csF = np.concatenate([[0], np.cumsum(rn)])
    csO = np.concatenate([[0], np.cumsum(on ** 2)])
    e_max = min(int((oend - win) * fr), nfr - W - 1)
    B0, B = int(bpre * fr), int((bpre + bpost) * fr)
    best = (np.inf, 0, 0, 0, 0)
    s = max(int(lead * fr), B0)
    while s <= int((lead + smax) * fr):
        e0 = s + int(lmin * fr)
        if e0 >= e_max:
            break
        A, Ao = Ft[s:s + W], on[s - B0:s - B0 + B]
        seg, sego = Ft[e0:e_max + W], on[e0 - B0:e_max - B0 + B]
        cross = sum(correlate(seg[:, j], A[:, j], mode='valid', method='fft') for j in range(24))
        es = np.arange(e0, e0 + len(cross))
        dt = (rn[s:s + W].sum() + (csF[es + W] - csF[es]) - 2 * cross) / W / 24
        co = correlate(sego, Ao, mode='valid', method='fft')[:len(es)]
        ncc = co / (np.sqrt((csO[es - B0 + B] - csO[es - B0]) * (Ao ** 2).sum()) + 1e-12)
        sc = dt + w_beat * (1 - ncc) - len_bonus * (es - s) / fr
        k = int(np.argmin(sc))
        if sc[k] < best[0]:
            best = (float(sc[k]), s, int(es[k]), float(dt[k]), float(ncc[k]))
        s += max(1, int(s_step * fr))
    score, s, e, dt, ncc = best
    S, E = s * hop * 2, e * hop * 2
    mm = x.mean(axis=1)  # sample-level refinement of E (+- one feature hop)
    N, h = int(0.25 * SR), hop * 2
    ref, lo = mm[S:S + N], max(0, E - h)
    c = correlate(mm[lo:E + h + N], ref, mode='valid', method='fft')
    if len(c):
        E = lo + int(np.argmax(c))
    return S, E, score, dt, ncc


def crossfade_loop(x, S, E, X):
    """Loop body x[S:E] whose start is a crossfade of x[E:E+X] (fading out) into x[S:S+X] (fading in)."""
    a, b = x[E:E + X], x[S:S + X]
    ma, mb = a.mean(axis=1), b.mean(axis=1)
    r = float(np.clip(np.corrcoef(ma, mb)[0, 1] if ma.std() > 0 and mb.std() > 0 else 0, 0, 1))
    t = np.linspace(0, 1, X)
    den = np.sqrt(t ** 2 + (1 - t) ** 2 + 2 * r * t * (1 - t))
    mixed = a * ((1 - t) / den)[:, None] + b * (t / den)[:, None]
    return np.concatenate([mixed, x[S + X:E]]), r


def body_bounds(x, rel_db=-7):
    """(lead, outro_end) in seconds: first audible sample, end of the full-level body (before a fade/outro)."""
    m = np.abs(x).max(axis=1)
    pk = m.max()
    lead = int(np.argmax(m > pk * 10 ** (-50 / 20))) / SR
    fr = int(0.5 * SR)
    n = len(x) // fr
    rms = np.sqrt((x[:n * fr].mean(axis=1).reshape(n, fr) ** 2).mean(axis=1))
    body = np.median(rms[int(n * 0.2):int(n * 0.8)])
    ok = np.where(rms >= body * 10 ** (rel_db / 20))[0]
    return lead, (ok[-1] + 1) * 0.5 if len(ok) else len(x) / SR


def seam_jump(y):
    """Diagnostic: the loop-wrap step (last -> first sample) over the 99th percentile of nearby sample steps (<= 1 is clean)."""
    n = int(0.25 * SR)
    near = np.abs(np.diff(np.concatenate([y[-n:], y[:n]]), axis=0))
    return float(np.abs(y[0] - y[-1]).max() / (np.percentile(near, 99) + 1e-12))


# ------------------------------------------------------------------------------------------------- main
def main(OUT, ONLY):
    manifest = {}
    mpath = os.path.join(RAW, 'manifest.json')
    if os.path.exists(mpath):
        with open(mpath) as fh:
            manifest = json.load(fh)
    for sub in ('audio', 'voice', 'music'):
        os.makedirs(os.path.join(OUT, sub), exist_ok=True)

    for kind in ('sfx', 'voice', 'music'):
        d = os.path.join(RAW, kind)
        if not os.path.isdir(d):
            continue
        for f in sorted(os.listdir(d)):
            if not f.endswith('.mp3'):
                continue
            name = f[:-4]
            if ONLY and name not in ONLY and f'{kind}/{name}' not in ONLY:
                continue
            src = os.path.join(d, f)
            info = {}
            if kind == 'music':
                dst = os.path.join(OUT, 'music', name + '.mp3')
                x = decode(src, 2)
                if name in MUSIC_STINGS:
                    y = trim(x, start_db=-45, end_db=-52, pre=0.01, post=0.15, fade_in=0.005, fade_out=0.3)
                    tail = np.sqrt((y[-int(0.5 * SR):] ** 2).mean())
                    if len(y) > STING_MAX.get(name, 99) * SR:  # too long: cut with a 1.5 s fade
                        y = fade_tail(y[:int(STING_MAX[name] * SR)], 1.5)
                    elif 20 * np.log10(tail / (np.abs(y).max() + 1e-9) + 1e-12) > -30:  # still ringing at the end: fade it out
                        y = fade_tail(y, 1.2)
                    y = gain_to(y, T_MUSIC_I - lufs_integrated(y), max_limit_db=6)
                    kbps = 128
                else:
                    lead, oend = body_bounds(x)
                    X = int(2.5 * SR)
                    lmin = min(LMIN.get(name, 85.0), 0.85 * (oend - 8.0 - lead))
                    S, E, score, dt, ncc = find_music_loop(x, lead, oend, lmin)
                    y, r = crossfade_loop(x, S, E, X)
                    y = gain_to(y, T_MUSIC_I - lufs_integrated(y), max_limit_db=6, circular=True)
                    info.update(loop_start_raw=round(S / SR, 3), loop_end_raw=round(E / SR, 3), match=round(score, 3),
                                timbre_dist=round(dt, 3), beat_ncc=round(ncc, 3), xfade_corr=round(r, 2), raw_len=round(len(x) / SR, 2),
                                outro_at=oend, seam=round(seam_jump(y), 2))
                    kbps = 128
                info['lufs_i'] = round(lufs_integrated(y), 2)
            else:
                sub = 'audio' if kind == 'sfx' else 'voice'
                dst = os.path.join(OUT, sub, name + '.mp3')
                if kind == 'voice':
                    x = decode(src, 1, 'highpass=f=70')
                    y = trim(x, start_db=-40, end_db=-48, pre=0.04, post=0.08, fade_in=0.01, fade_out=0.05)
                    y = gain_to(y, T_VOICE_I - lufs_integrated(y), max_limit_db=6, win=0.011)
                    info['lufs_i'] = round(lufs_integrated(y), 2)
                    kbps = 96
                elif name in SFX_LOOPS:
                    x = decode(src, 1, 'highpass=f=30' + (',' + LOOPAF[name] if name in LOOPAF else ''))
                    L = len(x) / SR
                    amb = name in AMB_LOOPS
                    xf = 1.5 if amb else 0.5  # the ambient beds are long and textured: a longer, softer seam
                    X = int(xf * SR)
                    # generated with the seamless-loop option: the seam is searched near the clip's own wrap point
                    S, E, score = find_loop(x, (0, 0.25), (L - xf - (0.8 if amb else 0.45), L - xf),
                                            win=1.0 if amb else 0.5, s_step=0.01)
                    y, r = crossfade_loop(x, S, E, X)
                    y = gain_to(y, (T_AMB_I if amb else T_LOOP_I) - lufs_integrated(y), max_limit_db=3, circular=True)
                    info.update(loop_start_raw=round(S / SR, 3), loop_end_raw=round(E / SR, 3), match=round(score, 2),
                                xfade_corr=round(r, 2), seam=round(seam_jump(y), 2), lufs_i=round(lufs_integrated(y), 2))
                    kbps = 112
                else:
                    af = 'highpass=f=30' + (',' + SOFT[name] if name in SOFT else '')
                    x = decode(src, 1, af)
                    y = trim(x)
                    if name in CUT:
                        y = cap(y, CUT[name])
                    y = gain_to(y, QUIET.get(name, T_SFX_S) - lufs_short_max(y), max_limit_db=6, win=0.006)
                    info['lufs_s100'] = round(lufs_short_max(y), 2)
                    info['lufs_m'] = round(lufs_momentary_max(y), 2)
                    kbps = 112
            encode(y, dst, kbps)
            info['tp'] = round(true_peak_db(y), 2)
            info['dur'] = round(dur(dst), 3)
            info['pcm_len'] = round(len(y) / SR, 3)
            key = f'{kind}/{name}'
            manifest[key] = info
            print(key, json.dumps(info), flush=True)

    with open(mpath, 'w') as fh:
        json.dump(manifest, fh, indent=1)


# ------------------------------------------------------------------------------------------------- spectral screen
def stats(path):
    """Numbers used to screen takes, since nobody listens here: duration, spectral centroid and 85 % roll-off (Hz),
    energy share above 4 kHz and below 150 Hz, `phone` = how much of the loudest-100 ms loudness survives a 200 Hz
    high-pass (dB; near 0 = a phone speaker plays its body, below about -8 = mostly sub-bass), and the strongest narrow
    tonal peak (Welch spectrum, dB above the 1/3-octave median: above ~15 dB is a whistle / pure tone)."""
    from scipy.signal import welch
    x = decode(path, 1, 'highpass=f=30,highpass=f=30')  # as processing does: infrasound / DC out first
    if not len(x) or np.abs(x).max() <= 0:
        return dict(dur=round(len(x) / SR, 3), silent=True)
    m = x[:, 0]
    f, P = welch(m, SR, nperseg=min(4096, len(m)), noverlap=None)
    tot = P.sum() + 1e-30
    cen = float((f * P).sum() / tot)
    roll = float(f[min(len(f) - 1, np.searchsorted(np.cumsum(P), 0.85 * tot))])
    hi, sub = float(P[f > 4000].sum() / tot), float(P[f < 150].sum() / tot)
    db = 10 * np.log10(P + 1e-30)
    prom = np.full(len(f), -99.0)
    for i in np.where((f > 300) & (f < 15000) & (db > db.max() - 40))[0]:  # only bins that carry real energy
        w = (f > f[i] / 2 ** (1 / 6)) & (f < f[i] * 2 ** (1 / 6))
        prom[i] = db[i] - np.median(db[w])
    k = int(np.argmax(prom))
    full = lufs_short_max(x)
    hp = decode(path, 1, 'highpass=f=30,highpass=f=30,highpass=f=200,highpass=f=200')
    return dict(dur=round(len(m) / SR, 3), centroid=int(cen), rolloff85=int(roll), above4k=round(hi, 3),
                sub150=round(sub, 3), phone=round(lufs_short_max(hp) - full, 1), peak_hz=int(f[k]),
                peak_prom_db=round(float(prom[k]), 1))


if __name__ == '__main__':
    if sys.argv[1] == 'stats':
        for p in sys.argv[2:]:
            files = [os.path.join(p, f) for f in sorted(os.listdir(p)) if f.endswith('.mp3')] if os.path.isdir(p) else [p]
            for fp in files:
                print(os.path.basename(fp)[:-4].ljust(14), json.dumps(stats(fp)), flush=True)
    else:
        main(sys.argv[1], set(sys.argv[2].split(',')) if len(sys.argv) > 2 else None)
