"""69 NORTH renderer: moderngl offscreen -> HDR accumulate (motion blur + AA) -> bloom -> grade -> ffmpeg."""
import sys, os, argparse, subprocess, time, numpy as np, moderngl
from scipy.ndimage import gaussian_filter1d
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument('--res', default='960x540'); ap.add_argument('--ss', type=int, default=1)
ap.add_argument('--stills', default=''); ap.add_argument('--range', default='')
ap.add_argument('--fps', type=int, default=60); ap.add_argument('--out', default='out')
ap.add_argument('--audio', default=''); ap.add_argument('--cq', type=int, default=20)
ap.add_argument('--codec', default='hevc_nvenc'); ap.add_argument('--sheet', default='')
ap.add_argument('--name', default=''); ap.add_argument('--shots', action='store_true'); ap.add_argument('--kitdbg', action='store_true')
a = ap.parse_args()
W, Hh = map(int, a.res.split('x')); FPS = a.fps
d = np.load(os.path.join(HERE, 'features.npz'))
A = d['A'].copy(); names = [str(n) for n in d['names']]; spec = d['spec']; NF, N = A.shape; DUR = 315.5333
ix = {n: i for i, n in enumerate(names)}
tf = np.arange(N) / 60.
T1, TOUT = 24.96, 301.75
gate = ((tf >= T1 - 0.05) & (tf <= TOUT)).astype('f4')
for k in ['kick', 'snare', 'hat', 'tom']: A[ix[k]] *= gate
kt = d['kicks']; ks = d['kstr']; m = (kt >= T1 - 0.08) & (kt <= TOUT); kt = kt[m]; ks = ks[m]; m = ks > np.percentile(ks, 25); kt = kt[m]; ks = np.clip(ks[m] / np.percentile(ks[m], 90), 0.3, 1.4)
st = d['snares']; ss = d['sstr']; m = (st >= T1 - 0.08) & (st <= TOUT) & (ss > np.percentile(ss, 35)); st = st[m]
bt = d['beats']; b0 = np.argmin(np.abs(bt - T1))
bpos = gaussian_filter1d(np.interp(tf, bt, np.arange(len(bt)) - b0), 5)

# ---- fast-cut passages: (start, end, [(beats, camera angle, extra snowcat speed), ...]); cuts land on beats of the corrected grid
SECT = [
    (97.53, 123.51, [(8, 0, 0), (8, 3, 6), (8, 5, 0), (8, 1, 6), (4, 6, 0), (4, 12, 0), (8, 4, 6), (8, 9, 0), (4, 2, 6), (4, 11, 0)]),
    (172.98, 199.31, [(8, 0, 0), (8, 2, 5), (8, 13, 0), (4, 5, 0), (4, 7, 0), (8, 1, 6), (8, 8, 0), (4, 6, 0), (4, 12, 0), (8, 3, 6)]),
    (199.31, 213.955, [(8, 0, 0), (8, 10, 0), (8, 4, 6), (99, 8, 0)]),
    (238.75, 254.56, [(12, 0, 0), (8, 3, 6), (8, 10, 0), (99, 0, 0)]),
    (254.56, 278.22, [(8, 0, 0), (8, 3, 3), (8, 6, 0), (8, 8, 0), (8, 1, 3), (8, 5, 0), (99, 0, 0)]),
    (278.22, 301.575, [(16, 15, 0), (16, 16, 0), (99, 0, 0)]),
]
SHOTS = []
for t0, t1, lst in SECT:
    bi_ = int(np.argmin(np.abs(bt - t0))); cum = 0
    for j_, (nb, sid, v) in enumerate(lst):
        ts = t0 if cum == 0 else float(bt[bi_ + cum]); cum += nb
        te = t1 if (j_ == len(lst) - 1 or nb >= 99 or bi_ + cum >= len(bt) or bt[bi_ + cum] > t1 - .4) else float(bt[bi_ + cum])
        SHOTS.append((ts, te, sid, len(SHOTS), v))
        if te >= t1: break
shot_t0 = np.array([x[0] for x in SHOTS])
def shot_at(t):
    j = int(np.searchsorted(shot_t0, t, side='right')) - 1
    if j >= 0 and t < SHOTS[j][1]: return SHOTS[j]
    return (t, t, 0, 0, 0)

# ---- the ghost kit: per-piece hits, and what each stick is coming from and going to
dh = np.load(os.path.join(HERE, 'drumhits.npz')); kev = dh['ev']; khits = dh['hits']; khand = dh['hand']
NP = 14
ptime = [kev[kev[:, 1] == p_, 0] for p_ in range(NP)]; pvel = [kev[kev[:, 1] == p_, 2] for p_ in range(NP)]
hnd = [khits[khand == h_] for h_ in (0, 1)]; hat_t = dh['hat_t']; hat_o = dh['hat_open'].astype('f4')
def kit_state(t):
    HT = np.full(NP, -100., 'f4'); HV = np.zeros(NP, 'f4')
    for p_ in range(NP):
        j = int(np.searchsorted(ptime[p_], t, side='right')) - 1
        if j >= 0: HT[p_] = ptime[p_][j]; HV[p_] = pvel[p_][j]
    ST = []; SV = []
    for h_ in (0, 1):
        a_ = hnd[h_]; j = int(np.searchsorted(a_[:, 0], t, side='right')) - 1; home = 2 if h_ == 0 else 1
        pv = (a_[j, 0], a_[j, 1], a_[j, 2]) if j >= 0 else (-100., home, 0.)
        nx = (a_[j + 1, 0], a_[j + 1, 1], a_[j + 1, 2]) if j + 1 < len(a_) else (1e5, pv[1], 0.)
        ST.append((pv[0], pv[1], nx[0], nx[1])); SV.append((pv[2], nx[2], 0., 0.))
    FT = []
    for f_, p_ in ((0, 0), (1, 13)):                      # right foot on the right bass drum, left foot on the left
        j = int(np.searchsorted(ptime[p_], t, side='right')) - 1
        pv = (ptime[p_][j], pvel[p_][j]) if j >= 0 else (-100., 0.)
        nx = (ptime[p_][j + 1], pvel[p_][j + 1]) if j + 1 < len(ptime[p_]) else (1e5, 0.)
        FT.append((pv[0], nx[0], pv[1], nx[1]))
    j = int(np.searchsorted(hat_t, t, side='right')) - 1; ho = 0.
    if j >= 0:
        ho = float(hat_o[j]); pr = float(hat_o[j - 1]) if j > 0 else 0.; w = min(max((t - hat_t[j]) / .03, 0.), 1.); ho = pr + (ho - pr) * w
    return HT, HV, np.array(ST, 'f4'), np.array(SV, 'f4'), np.array(FT, 'f4'), ho

def feats(t):
    x = np.clip(t * 60., 0, N - 1.001); i = int(x); f = x - i
    return (A[:, i] * (1 - f) + A[:, i + 1] * f).astype('f4'), float(bpos[i] * (1 - f) + bpos[i + 1] * f)

def lastn(arr, t, n):
    j = np.searchsorted(arr, t, side='right'); return list(range(max(0, j - n), j))

ctx = moderngl.create_standalone_context(require=330)
VS = '#version 330\nin vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }'
common = open(os.path.join(HERE, 'common.glsl')).read()
defs = '#version 330\n#define NF %d\n' % NF + ''.join('#define F_%s %d\n' % (n.upper(), i) for i, n in enumerate(names))
def prog(fs): return ctx.program(vertex_shader=VS, fragment_shader=fs)
quad = ctx.buffer(np.array([-1, -1, 1, -1, -1, 1, 1, 1], 'f4').tobytes())
def vao(p): return ctx.vertex_array(p, [(quad, '2f', 'p')])
def setu(p, k, v):
    if k in p: p[k].value = v
def lin(t):
    t.filter = (moderngl.LINEAR, moderngl.LINEAR); t.repeat_x = t.repeat_y = False; return t

# ---- bake heightfield
HS = 4096
hp = prog('#version 330\n' + common + open(os.path.join(HERE, 'height.glsl')).read())
htex = ctx.texture((HS, HS), 1, dtype='f4'); hf = ctx.framebuffer([htex]); hf.use(); ctx.viewport = (0, 0, HS, HS)
hp['uSize'].value = float(HS); vao(hp).render(moderngl.TRIANGLE_STRIP)
htex.build_mipmaps(); htex.filter = (moderngl.LINEAR_MIPMAP_LINEAR, moderngl.LINEAR); htex.repeat_x = htex.repeat_y = False
# ---- audio data textures
ftex = lin(ctx.texture((N, NF), 1, data=np.ascontiguousarray(A).tobytes(), dtype='f4'))
stex = lin(ctx.texture((N, spec.shape[0]), 2, data=np.ascontiguousarray(spec).tobytes(), dtype='f4'))
sp = prog(defs + common + open(os.path.join(HERE, 'scene.glsl')).read().replace('//#KIT', open(os.path.join(HERE, 'kit.glsl')).read())); svao = vao(sp)
# ---- render targets
hdr = lin(ctx.texture((W, Hh), 4, dtype='f2')); kitt = lin(ctx.texture((W, Hh), 4, dtype='f2')); hfbo = ctx.framebuffer([hdr, kitt])
hdr2 = lin(ctx.texture((W, Hh), 4, dtype='f2')); h2fbo = ctx.framebuffer([hdr2])
LV = 7; mips = []
for i in range(1, LV + 1):
    t = lin(ctx.texture((max(W >> i, 2), max(Hh >> i, 2)), 4, dtype='f2')); mips.append((t, ctx.framebuffer([t])))
down = prog('''#version 330
uniform sampler2D s; uniform float first; uniform vec2 res; out vec4 o;
void main(){ vec2 uv=gl_FragCoord.xy/res; vec2 t=1./vec2(textureSize(s,0));
 vec3 a=texture(s,uv+t*vec2(-1,-1)).rgb,b=texture(s,uv+t*vec2(1,-1)).rgb,c=texture(s,uv+t*vec2(-1,1)).rgb,d=texture(s,uv+t*vec2(1,1)).rgb,e=texture(s,uv).rgb;
 if(first>.5){ vec3 m=vec3(first); a=min(a,m);b=min(b,m);c=min(c,m);d=min(d,m);e=min(e,m); }
 o=vec4((a+b+c+d)*.125+e*.5,1.); }''')
upp = prog('''#version 330
uniform sampler2D s; uniform vec2 res; out vec4 o;
void main(){ vec2 uv=gl_FragCoord.xy/res; vec2 t=1./vec2(textureSize(s,0));
 vec3 c=texture(s,uv).rgb*4.; c+=(texture(s,uv+t*vec2(1,0)).rgb+texture(s,uv-t*vec2(1,0)).rgb+texture(s,uv+t*vec2(0,1)).rgb+texture(s,uv-t*vec2(0,1)).rgb)*2.;
 c+=texture(s,uv+t).rgb+texture(s,uv-t).rgb+texture(s,uv+t*vec2(1,-1)).rgb+texture(s,uv+t*vec2(-1,1)).rgb; o=vec4(c/16.,1.); }''')
dof = prog('''#version 330
uniform sampler2D s,k; uniform vec2 res; uniform float invS,pxs,seed; out vec4 o;
float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
void main(){ vec2 uv=gl_FragCoord.xy/res; vec4 c0=texture(s,uv); float c=c0.a*invS*pxs, ac=abs(c), R=ac;
 for(int k=0;k<8;k++){ float a=float(k)*.7854; float cn=texture(s,uv+vec2(cos(a),sin(a))*9.*pxs/res).a*invS*pxs; if(cn<0.) R=max(R,min(-cn,16.*pxs)); }
 vec4 K=texture(k,uv);                                   // the kit goes on top of the blurred scene, sharp
 if(R<.6){ o=vec4(c0.rgb*(1.-K.a*invS)+K.rgb,c0.a); return; }
 vec3 acc=c0.rgb; float w=1.; float r0=h21(gl_FragCoord.xy+seed)*6.2832;
 for(int i=1;i<64;i++){ float fi=float(i); float r=sqrt(fi/64.)*R; float th=fi*2.39996+r0;
   vec4 cs=texture(s,uv+vec2(cos(th),sin(th))*r/res); float cc=cs.a*invS*pxs;
   float sw=cc>c?clamp(ac-r+1.,0.,1.):clamp(abs(cc)-r+1.,0.,1.);
   acc+=cs.rgb*sw; w+=sw; }
 o=vec4(acc/w*(1.-K.a*invS)+K.rgb,c0.a); }''')
post = prog('''#version 330
uniform sampler2D hdr,bloom,title; uniform vec2 res; uniform float seed,bloomK,titleA,kick,expo; out vec4 o;
float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }
void main(){ vec2 uv=gl_FragCoord.xy/res; vec2 c=uv-.5; float r2=dot(c,c);
 vec2 ca=c*r2*(.010+.012*kick);
 vec2 kq=(vec2((uv.x-.5)*res.x/res.y*2.,(uv.y-.5)*2.)-vec2(res.x/res.y-.72,-.337))/.62;   // keep colour fringing off the drum kit
 ca*=1.-.9*smoothstep(1.35,1.05,abs(kq.x))*smoothstep(1.25,1.0,abs(kq.y));
 vec3 col=vec3(texture(hdr,uv+ca).r,texture(hdr,uv).g,texture(hdr,uv-ca).b);
 vec3 bl=vec3(texture(bloom,uv+ca).r,texture(bloom,uv).g,texture(bloom,uv-ca).b);
 col=col+bl*bloomK;
 col*=expo*(1.-.42*smoothstep(.12,.75,r2*1.25));
 col=aces(col*1.15); col=pow(col,vec3(1./2.2));
 col=mix(col,smoothstep(0.,1.,col),.25);
 vec4 tt=texture(title,vec2(uv.x,1.-uv.y)); col=mix(col,tt.rgb,tt.a*titleA);
 float g=h21(gl_FragCoord.xy+seed*61.7)+h21(gl_FragCoord.xy*1.7+seed*17.3)-1.; col+=g*.018*(1.2-dot(col,vec3(.33)));
 o=vec4(col,1.); }''')
ldr = ctx.texture((W, Hh), 3); lfbo = ctx.framebuffer([ldr])

def font(sz, bold=False):
    try:
        ft = ImageFont.truetype('C:/Windows/Fonts/bahnschrift.ttf', sz)
        try: ft.set_variation_by_name('SemiBold SemiCondensed' if bold else 'SemiLight SemiCondensed')
        except Exception: pass
        return ft
    except Exception:
        return ImageFont.load_default()
def spaced(dr, xy, text, ft, sp_, fill):
    ws = [dr.textlength(ch, font=ft) for ch in text]; tot = sum(ws) + sp_ * (len(text) - 1); x = xy[0] - tot / 2
    for ch, w in zip(text, ws): dr.text((x, xy[1]), ch, font=ft, fill=fill); x += w + sp_
def title_img(kind):
    im = Image.new('RGBA', (W, Hh), (0, 0, 0, 0)); dr = ImageDraw.Draw(im); u = Hh / 1080.
    if kind == 0:
        spaced(dr, (W / 2, Hh * .40), 'DISTANT EARLY WARNING', font(int(64 * u), True), int(26 * u), (236, 244, 246, 255))
        dr.line([(W / 2 - 210 * u, Hh * .40 + 96 * u), (W / 2 + 210 * u, Hh * .40 + 96 * u)], fill=(120, 255, 190, 200), width=max(1, int(2 * u)))
        spaced(dr, (W / 2, Hh * .40 + 118 * u), 'RUSH  \u00b7  A SHOW OF HANDS', font(int(26 * u)), int(12 * u), (190, 205, 210, 235))
        spaced(dr, (W / 2, Hh * .40 + 176 * u), '69\u00b0 NORTH', font(int(22 * u)), int(16 * u), (120, 255, 190, 235))
    else:
        spaced(dr, (W / 2, Hh * .44), '69\u00b0 NORTH', font(int(54 * u), True), int(30 * u), (240, 244, 246, 255))
        spaced(dr, (W / 2, Hh * .44 + 92 * u), 'DISTANT EARLY WARNING  \u00b7  RUSH  \u00b7  A SHOW OF HANDS', font(int(22 * u)), int(10 * u), (185, 198, 204, 235))
        spaced(dr, (W / 2, Hh * .44 + 140 * u), 'EVERY FRAME COMPUTED FROM THE RECORDING  \u00b7  CLAUDE FABLE 5.2', font(int(17 * u)), int(8 * u), (120, 150, 150, 220))
    return im
ttex = [lin(ctx.texture((W, Hh), 4, data=title_img(k).tobytes())) for k in (0, 1)]

def sm(a_, b_, x):
    v = float(np.clip((x - a_) / (b_ - a_), 0, 1)); return v * v * (3 - 2 * v)
def halton(i, b):
    f = 1.; r = 0.
    while i > 0: f /= b; r += f * (i % b); i //= b
    return r

def render(frame):
    S = a.ss; hfbo.use(); ctx.viewport = (0, 0, W, Hh); hfbo.clear(0, 0, 0, 0)
    ctx.enable(moderngl.BLEND); ctx.blend_func = (moderngl.ONE, moderngl.ONE)
    htex.use(0); stex.use(1); ftex.use(2); setu(sp, 'uHeight', 0); setu(sp, 'uSpec', 1); setu(sp, 'uFeat', 2)
    setu(sp, 'uRes', (float(W), float(Hh))); setu(sp, 'uDur', DUR)
    for j in range(S):
        t = (frame + (j + .5) / S * .5) / FPS if S > 1 else frame / FPS
        t = min(max(t, 0.), DUR - .02)
        fv, bp = feats(t)
        if 'uA' in sp: sp['uA'].write(fv.tobytes())
        sel = lastn(kt, t, 8); KT = np.full(8, -100., 'f4'); KS = np.zeros(8, 'f4'); KT[:len(sel)] = kt[sel]; KS[:len(sel)] = ks[sel]
        if 'uKT' in sp: sp['uKT'].write(KT.tobytes())
        if 'uKS' in sp: sp['uKS'].write(KS.tobytes())
        sel = lastn(st, t, 4); ST = np.full(4, -100., 'f4'); ST[:len(sel)] = st[sel]
        if 'uST' in sp: sp['uST'].write(ST.tobytes())
        sh_ = shot_at(t); setu(sp, 'uShotT0', float(sh_[0])); setu(sp, 'uShotId', int(sh_[2])); setu(sp, 'uShotK', float(sh_[3])); setu(sp, 'uShotV', float(sh_[4]))
        HT_, HV_, ST_, SV_, FT_, ho_ = kit_state(t)
        if 'uHitT' in sp: sp['uHitT'].write(HT_.tobytes())
        if 'uHitV' in sp: sp['uHitV'].write(HV_.tobytes())
        if 'uStk' in sp: sp['uStk'].write(ST_.tobytes())
        if 'uStkV' in sp: sp['uStkV'].write(SV_.tobytes())
        if 'uFoot' in sp: sp['uFoot'].write(FT_.tobytes())
        setu(sp, 'uHatOpen', float(ho_)); setu(sp, 'uKitDbg', 1. if a.kitdbg else 0.)
        setu(sp, 'uTime', t); setu(sp, 'uBeat', bp); setu(sp, 'uSeed', float((frame * 7 + j * 3) % 977))
        setu(sp, 'uJit', (halton(j + 1, 2) - .5, halton(j + 1, 3) - .5) if S > 1 else (0., 0.))
        svao.render(moderngl.TRIANGLE_STRIP)
    ctx.disable(moderngl.BLEND)

dv = vao(down); uv_ = vao(upp); pv = vao(post); dfv = vao(dof)
def finish(t, frame):
    S = a.ss
    h2fbo.use(); ctx.viewport = (0, 0, W, Hh); hdr.use(0); kitt.use(1); dof['s'].value = 0; dof['k'].value = 1; dof['res'].value = (float(W), float(Hh))
    setu(dof, 'invS', 1. / S); setu(dof, 'pxs', Hh / 2160.); setu(dof, 'seed', float(frame % 911)); dfv.render(moderngl.TRIANGLE_STRIP)
    src = hdr2
    for i, (tx, fb) in enumerate(mips):
        fb.use(); ctx.viewport = (0, 0, tx.width, tx.height); src.use(0); down['s'].value = 0
        down['res'].value = (float(tx.width), float(tx.height)); setu(down, 'first', 20. * S if i == 0 else 0.)
        dv.render(moderngl.TRIANGLE_STRIP); src = tx
    ctx.enable(moderngl.BLEND); ctx.blend_func = (moderngl.ONE, moderngl.ONE)
    for i in range(LV - 1, 0, -1):
        tx, fb = mips[i - 1]; fb.use(); ctx.viewport = (0, 0, tx.width, tx.height); mips[i][0].use(0)
        upp['s'].value = 0; upp['res'].value = (float(tx.width), float(tx.height)); uv_.render(moderngl.TRIANGLE_STRIP)
    ctx.disable(moderngl.BLEND)
    lfbo.use(); ctx.viewport = (0, 0, W, Hh); hdr2.use(0); mips[0][0].use(1)
    ta = sm(5.5, 8., t) * (1 - sm(15.5, 18.5, t)); tb = sm(307.6, 309.6, t) * (1 - sm(314.0, 315.3, t))
    (ttex[1] if t > 100 else ttex[0]).use(2)
    fv, _ = feats(t)
    post['hdr'].value = 0; post['bloom'].value = 1; post['title'].value = 2; post['res'].value = (float(W), float(Hh))
    setu(post, 'seed', float(frame % 1013)); setu(post, 'bloomK', .028); setu(post, 'titleA', max(ta, tb) * .96)
    setu(post, 'kick', float(fv[ix['kick']])); setu(post, 'expo', 1. / S)
    pv.render(moderngl.TRIANGLE_STRIP)
    return lfbo.read(components=3, alignment=1)

os.makedirs(a.out, exist_ok=True)
if a.shots:
    for x in SHOTS: print('%7.2f - %7.2f  angle %2d  k %2d  v %d' % x)
    sys.exit()
if a.stills:
    ts = [float(x) for x in a.stills.split(',')]; ims = []
    for t in ts:
        t0 = time.time(); fr = int(round(t * FPS)); render(fr); buf = finish(fr / FPS, fr); ctx.finish()
        im = Image.frombytes('RGB', (W, Hh), buf).transpose(Image.FLIP_TOP_BOTTOM); ims.append((t, im))
        if not a.sheet: im.save(os.path.join(a.out, 'still_%07.2f.png' % t))
        print('t=%.2f %.2fs' % (t, time.time() - t0), flush=True)
    if a.sheet:
        parts = a.sheet.split(':'); cols = int(parts[1]) if len(parts) > 1 else 3; tw = int(parts[2]) if len(parts) > 2 else 640; th = tw * Hh // W
        rows = (len(ims) + cols - 1) // cols; sh = Image.new('RGB', (cols * tw, rows * th)); dr = ImageDraw.Draw(sh)
        for i, (t, im) in enumerate(ims):
            x, y = (i % cols) * tw, (i // cols) * th; sh.paste(im.resize((tw, th), Image.LANCZOS), (x, y)); dr.text((x + 6, y + 4), '%.1f' % t, fill=(255, 255, 0))
        sh.save(os.path.join(a.out, parts[0]), quality=90)
else:
    f0, f1 = (0, int(DUR * FPS)) if not a.range else [int(float(x) * FPS) for x in a.range.split(',')]
    name = os.path.join(a.out, a.name or 'video_%dx%d_%d-%d.mp4' % (W, Hh, f0, f1))
    cmd = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, Hh), '-r', str(FPS), '-i', '-']
    if a.audio: cmd += ['-ss', '%.5f' % (f0 / FPS), '-t', '%.5f' % ((f1 - f0) / FPS), '-i', a.audio]
    cmd += ['-vf', 'vflip', '-c:v', a.codec]
    if 'nvenc' in a.codec:
        cmd += ['-preset', 'p7', '-tune', 'hq', '-rc', 'vbr', '-cq', str(a.cq), '-b:v', '0', '-maxrate', '120M', '-bufsize', '240M',
                '-pix_fmt', 'p010le' if 'hevc' in a.codec else 'yuv420p', '-g', str(FPS * 2)]
    else:
        cmd += ['-preset', 'slow', '-crf', str(a.cq), '-pix_fmt', 'yuv420p']
    if 'hevc' in a.codec: cmd += ['-tag:v', 'hvc1']
    cmd += ['-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709']
    if a.audio: cmd += ['-c:a', 'aac', '-b:a', '320k', '-shortest']
    cmd += ['-movflags', '+faststart', name]
    pr = subprocess.Popen(cmd, stdin=subprocess.PIPE); t0 = time.time()
    for fr in range(f0, f1):
        render(fr); pr.stdin.write(finish(fr / FPS, fr))
        if (fr - f0) % 300 == 0:
            el = time.time() - t0; rate = (fr - f0 + 1) / max(el, 1e-6)
            print('frame %d/%d  %.1f fps  eta %.0f min' % (fr - f0, f1 - f0, rate, (f1 - fr) / rate / 60), flush=True)
    pr.stdin.close(); pr.wait(); print('done', name, '%.1f min' % ((time.time() - t0) / 60))
