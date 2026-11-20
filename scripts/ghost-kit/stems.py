"""Separate the recording into stems with Demucs (GPU). Writes audio/stems/<name>.wav (44.1k stereo float)."""
import os, sys, numpy as np, soundfile as sf, torch
from demucs.pretrained import get_model
from demucs.apply import apply_model
src = 'audio/dew.flac'; out = 'audio/stems'; os.makedirs(out, exist_ok=True)
x, sr = sf.read(src, dtype='float32', always_2d=True)
assert sr == 44100, sr
wav = torch.from_numpy(x.T.copy())
ref = wav.mean(0); mean, std = ref.mean(), ref.std()
inp = ((wav - mean) / std)[None].cuda()
for name, shifts in [('htdemucs_ft', 2), ('htdemucs_6s', 2)]:
    m = get_model(name); m.cuda().eval()
    with torch.no_grad():
        est = apply_model(m, inp, shifts=shifts, split=True, overlap=0.25, progress=False)[0]
    est = (est * std + mean).cpu().numpy()
    for i, s in enumerate(m.sources):
        tag = s if name == 'htdemucs_ft' else '6s_' + s
        if name == 'htdemucs_6s' and s not in ('guitar', 'piano', 'other'): continue
        sf.write(os.path.join(out, tag + '.wav'), est[i].T, sr, subtype='FLOAT')
        print(tag, float(np.sqrt((est[i] ** 2).mean())), flush=True)
    del m; torch.cuda.empty_cache()
print('done')
