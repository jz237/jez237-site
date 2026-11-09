"""SKYHOLD 2026 music layers: lock each generated drum layer to its music track and build each lead pulse.

For every stage track and the boss track (music/<t>.mp3, already a seamless beat-aligned loop):
  drums_<t>: the ElevenLabs drum take (<SK_RAW>/layers/drums_<t>.mp3, from gen_layers.py) is analysed for its beat grid,
             resampled to the track's exact beat length if needed, and cut so its beats land on the track's beats. Of the
             possible cuts, the one whose kick pattern best matches the track's own low end wins (so the bars line up too).
             The cut is exactly the track's length, with a 0.25 s crossfade seam, so it loops in step with the track.
  lead_<t>:  a pulse of plucked detuned saws in sixteenths on the track's root, fifth and octave (safe over the track's
             chord changes), placed on the track's beat grid, with a ping-pong delay and a little sidechain-style pump.
Both are written next to the track as music/drums_<t>.mp3 and music/lead_<t>.mp3, stereo 128 kbps, at -18 and -19 LUFS
(the tracks are -16). The game starts them together with the track and fades them in with the fight (js/audio.js).

Usage: python process_layers.py [--only s1,boss]
"""
import os, sys
import numpy as np
import process_audio as PA

SR = PA.SR
GAME = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'games', '2026-11-09', 'skyhold', 'music')
RAW = os.environ.get('SK_RAW', 'D:/Projects/.tmp/skyhold-work/audio-raw')
# nominal tempo and root (Hz, one octave picked to sit above the bass) of every track
TRACKS = {'s1': (112, 220.0), 's2': (118, 261.63), 's3': (124, 220.0), 's4': (130, 174.61), 's5': (136, 146.83), 'boss': (142, 146.83)}
ASR, HOP, NFFT = 22050, 128, 1024
X = int(0.25 * SR)


# ------------------------------------------------------------------------------------------------- beat grid
def onset_env(x, lo=0, hi=6000):
    """Spectral flux of mono x (ASR), optionally over a band; one value per HOP."""
    n = 1 + (len(x) - NFFT) // HOP
    idx = np.arange(NFFT)[None, :] + HOP * np.arange(n)[:, None]
    S = np.abs(np.fft.rfft(x[idx] * np.hanning(NFFT)[None, :], axis=1))
    f = np.fft.rfftfreq(NFFT, 1 / ASR)
    L = np.log1p(100 * S[:, (f >= lo) & (f <= hi)])
    d = np.concatenate([[0], np.maximum(0, np.diff(L, axis=0)).sum(axis=1)])
    return np.maximum(d - np.convolve(d, np.ones(16) / 16, mode='same'), 0)


def grid(env, bpm0, span=0.03):
    """(beat seconds, first-beat phase seconds, median beat jitter ms) for a steady track near bpm0."""
    fps = ASR / HOP
    best = None
    for bpm in np.arange(bpm0 * (1 - span), bpm0 * (1 + span), 0.002):
        P = 60 / bpm * fps
        h, _ = np.histogram((np.arange(len(env)) % P) / P, bins=48, weights=env)
        sc = h.max() / (h.mean() + 1e-9)
        if best is None or sc > best[0]:
            best = (sc, bpm, (np.argmax(h) + 0.5) / 48 * P)
    _, bpm, ph0 = best
    P = 60 / bpm * fps
    w, got = int(0.045 * fps), []
    for i in range(int((len(env) - ph0) / P)):
        p = ph0 + i * P
        a, b = int(p) - w, int(p) + w + 1
        if a < 0 or b > len(env) or env[a:b].max() <= 0: continue
        got.append((i, a + np.argmax(env[a:b])))
    g = np.array(got, dtype=float)
    A = np.vstack([g[:, 0], np.ones(len(g))]).T
    (sl, ic), *_ = np.linalg.lstsq(A, g[:, 1], rcond=None)
    res = g[:, 1] - (sl * g[:, 0] + ic)
    keep = np.abs(res) <= np.percentile(np.abs(res), 80)
    (sl, ic), *_ = np.linalg.lstsq(A[keep], g[keep, 1], rcond=None)
    res = g[:, 1] - (sl * g[:, 0] + ic)
    return sl / fps, (ic / fps) % (sl / fps), float(np.median(np.abs(res)) / fps * 1000)


def mono_a(x):
    """Stereo SR -> mono ASR for analysis."""
    m = x.mean(axis=1)
    return np.interp(np.arange(0, len(m), SR / ASR), np.arange(len(m)), m)


# ------------------------------------------------------------------------------------------------- drums
def lock_drums(t, base, B, pb):
    raw = PA.decode(os.path.join(RAW, 'layers', f'drums_{t}.mp3'), 2)
    bl, pl, jit = grid(onset_env(mono_a(raw)), TRACKS[t][0])
    ratio = bl / B
    if abs(ratio - 1) > 1e-5:   # stretch the take so its beat is exactly the track's beat
        n = int(len(raw) / ratio)
        tt = np.arange(n) * ratio
        raw = np.stack([np.interp(tt, np.arange(len(raw)), raw[:, c]) for c in range(2)], axis=1)
        pl /= ratio
    D = len(base)
    eb = onset_env(mono_a(base), 0, 160)
    el = onset_env(mono_a(raw), 0, 160)
    fps = ASR / HOP
    best = None
    m0 = int(np.ceil((2.0 + pb - pl) / B))   # skip the first 2 s of the take
    for m in range(m0, m0 + 16):
        s = pl + m * B - pb
        if s < 0 or int(s * SR) + D + X > len(raw): break
        a = int(s * fps)
        seg = el[a:a + len(eb)]
        if len(seg) < len(eb): break
        c = float(np.corrcoef(eb, seg)[0, 1])
        if best is None or c > best[0]: best = (c, s)
    c, s = best
    S = int(round(s * SR))
    y, r = PA.crossfade_loop(raw[S:S + D + X], 0, D, X)
    y = PA.gain_to(y, -18.0 - PA.lufs_integrated(y), max_limit_db=6, circular=True)
    return y, {'take_bpm': round(60 / bl, 4), 'take_jitter_ms': round(jit, 2), 'stretch': round(ratio, 6), 'start_s': round(s, 3), 'kick_match': round(c, 3), 'seam_r': round(r, 2)}


# ------------------------------------------------------------------------------------------------- lead pulse
def pluck(f, dur=0.34, bright=1.0):
    """One plucked note: three detuned saws through a 2-pole low-pass whose cutoff falls fast, short decay."""
    n = int(dur * SR)
    tt = np.arange(n) / SR
    x = np.zeros(n)
    for cents, g in ((-9, 0.33), (0, 0.4), (9, 0.33)):
        ph = (f * 2 ** (cents / 1200) * tt + np.random.rand()) % 1
        x += g * (2 * ph - 1)
    cut = 600 + 5200 * bright * np.exp(-tt / 0.07)
    out = np.zeros(n); lp1 = lp2 = 0.0
    a = 1 - np.exp(-2 * np.pi * cut / SR)
    for i in range(n):
        lp1 += a[i] * (x[i] - lp1); lp2 += a[i] * (lp1 - lp2); out[i] = lp2
    env = np.minimum(1, tt / 0.003) * np.exp(-tt / 0.11)
    return out * env


def lead(t, D, B, pb):
    np.random.seed(7)
    R = TRACKS[t][1]
    notes = {'R': R, 'O': 2 * R, 'F': 1.5 * R, 'T': 3 * R}
    tpl = {k: pluck(v, bright=0.85 if k == 'R' else 1) for k, v in notes.items()}
    # two-bar phrase of sixteenths
    bar_a = 'ROFO' * 4
    bar_b = 'ROFO' + 'ROFO' + 'ROTO' + 'TOFO'
    phrase = bar_a + bar_b
    pad = int(1.0 * SR)
    y = np.zeros((D + pad, 2))
    k0 = -int(np.ceil(pb / B)) - 1
    step = B / 4
    for k in range(k0 * 4, int((D / SR - pb) / step) + 4):
        tsec = pb + k * step
        i0 = int(round(tsec * SR))
        if i0 >= D: break
        note = phrase[k % len(phrase)]
        acc = 1.0 if k % 4 == 0 else 0.62 if k % 2 == 0 else 0.5
        w = tpl[note] * acc
        a, b = max(0, i0), min(D + pad, i0 + len(w))
        if b <= a: continue
        seg = w[a - i0:b - i0]
        pan = 0.18 if k % 2 else -0.18
        y[a:b, 0] += seg * (1 - pan); y[a:b, 1] += seg * (1 + pan)
    # wrap the tail past the loop end onto the start so the layer loops by itself
    y[:pad] += y[D:D + pad]
    y = y[:D]
    # dotted-eighth ping-pong delay (circular, so the seam stays continuous)
    d = int(round(0.75 * B * SR))
    wet = np.zeros_like(y)
    for rep in range(1, 6):
        g = 0.32 * 0.42 ** (rep - 1)
        src = np.roll(y, d * rep, axis=0)
        if rep % 2: wet[:, 0] += src[:, 1] * g; wet[:, 1] += src[:, 0] * g
        else: wet += src * g
    y = y + wet
    # pump: duck a little after every beat, like a sidechain to the kick
    tt = (np.arange(D) / SR - pb) % B
    y *= (1 - 0.32 * np.exp(-tt / 0.11))[:, None]
    y = PA.gain_to(y, -19.0 - PA.lufs_integrated(y), max_limit_db=6, circular=True)
    return y


def main():
    only = None
    if '--only' in sys.argv:
        only = set(sys.argv[sys.argv.index('--only') + 1].split(','))
    for t in TRACKS:
        if only and t not in only: continue
        base = PA.decode(os.path.join(GAME, f'{t}.mp3'), 2)
        B, pb, jit = grid(onset_env(mono_a(base)), TRACKS[t][0])
        info = {'track_bpm': round(60 / B, 4), 'track_phase_s': round(pb, 4), 'track_jitter_ms': round(jit, 2), 'len_s': round(len(base) / SR, 3)}
        if os.path.exists(os.path.join(RAW, 'layers', f'drums_{t}.mp3')):
            y, di = lock_drums(t, base, B, pb)
            dst = os.path.join(GAME, f'drums_{t}.mp3'); PA.encode(y, dst, 128)
            # check: the written layer's beat must sit on the track's beat
            chk = PA.decode(dst, 2)
            B2, p2, _ = grid(onset_env(mono_a(chk)), TRACKS[t][0])
            off = ((p2 - pb + B / 2) % B) - B / 2
            di.update({'written_len_s': round(len(chk) / SR, 3), 'beat_offset_ms': round(off * 1000, 1)})
            info['drums'] = di
        y = lead(t, len(base), B, pb)
        PA.encode(y, os.path.join(GAME, f'lead_{t}.mp3'), 128)
        print(t, info, flush=True)


if __name__ == '__main__':
    main()
