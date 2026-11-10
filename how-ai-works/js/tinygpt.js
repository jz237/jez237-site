/* TinyGPT — a complete decoder-only transformer in plain JavaScript: token and
   position embeddings, pre-norm blocks of causal multi-head self-attention and
   a GELU MLP, a final layer norm, and an output layer tied to the embedding
   table. Forward pass, hand-written backpropagation, and Adam. No dependencies.
   The same file trains the shipped weights in Node and retrains in the page. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TinyGPT = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const GC = Math.sqrt(2 / Math.PI), EPS = 1e-5;

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // y[n x dout] = x[n x din] . W[din x dout]
  function mm(x, n, din, w, wo, dout, y) {
    for (let i = 0; i < n; i++) {
      const xi = i * din, yi = i * dout;
      for (let j = 0; j < dout; j++) y[yi + j] = 0;
      for (let k = 0; k < din; k++) {
        const xv = x[xi + k], wk = wo + k * dout;
        if (xv !== 0) for (let j = 0; j < dout; j++) y[yi + j] += xv * w[wk + j];
      }
    }
  }
  // gW += x^T . dy ;  dx (+)= dy . W^T
  function mmB(x, dy, n, din, dout, w, g, wo, dx, acc) {
    for (let i = 0; i < n; i++) {
      const xi = i * din, yi = i * dout;
      for (let k = 0; k < din; k++) {
        const xv = x[xi + k], wk = wo + k * dout;
        let s = 0;
        for (let j = 0; j < dout; j++) { const d = dy[yi + j]; g[wk + j] += xv * d; s += d * w[wk + j]; }
        if (dx) dx[xi + k] = acc ? dx[xi + k] + s : s;
      }
    }
  }
  function lnF(x, n, d, w, go, bo, xh, rs, y) {
    for (let i = 0; i < n; i++) {
      const o = i * d;
      let mu = 0, va = 0;
      for (let j = 0; j < d; j++) mu += x[o + j];
      mu /= d;
      for (let j = 0; j < d; j++) { const t = x[o + j] - mu; va += t * t; }
      const r = 1 / Math.sqrt(va / d + EPS);
      rs[i] = r;
      for (let j = 0; j < d; j++) { const h = (x[o + j] - mu) * r; xh[o + j] = h; y[o + j] = w[go + j] * h + w[bo + j]; }
    }
  }
  function lnB(dy, n, d, w, g, go, bo, xh, rs, dx) {
    for (let i = 0; i < n; i++) {
      const o = i * d;
      let m1 = 0, m2 = 0;
      for (let j = 0; j < d; j++) {
        const dv = dy[o + j], h = xh[o + j];
        g[go + j] += dv * h; g[bo + j] += dv;
        const dh = dv * w[go + j];
        m1 += dh; m2 += dh * h;
      }
      m1 /= d; m2 /= d;
      for (let j = 0; j < d; j++) dx[o + j] = rs[i] * (dy[o + j] * w[go + j] - m1 - xh[o + j] * m2);
    }
  }

  function TinyGPT(cfg, seed) {
    const A = this.A = cfg.f64 ? Float64Array : Float32Array;
    const V = cfg.V, T = cfg.T, d = cfg.d, L = cfg.L, F = cfg.F;
    this.cfg = { V, T, d, H: cfg.H, L, F };
    // one flat parameter vector; `lay` maps names to offsets
    const lay = this.lay = {}, order = this.order = [];
    let off = 0;
    const add = (name, n) => { lay[name] = off; order.push([name, off, n]); off += n; };
    add('E', V * d); add('P', T * d);
    for (let l = 0; l < L; l++) {
      add('g1' + l, d); add('b1' + l, d);
      add('Wq' + l, d * d); add('Wk' + l, d * d); add('Wv' + l, d * d); add('Wo' + l, d * d);
      add('g2' + l, d); add('b2' + l, d);
      add('W1' + l, d * F); add('c1' + l, F); add('W2' + l, F * d); add('c2' + l, d);
    }
    add('gf', d); add('bf', d);
    this.size = off;
    this.w = new A(off); this.g = new A(off); this.m = new A(off); this.v = new A(off);
    this.steps = 0;
    this.c = [];
    for (let l = 0; l < L; l++) this.c.push({
      xin: new A(T * d), a: new A(T * d), xh1: new A(T * d), rs1: new A(T),
      q: new A(T * d), k: new A(T * d), v: new A(T * d), att: new A(cfg.H * T * T), o: new A(T * d),
      xmid: new A(T * d), mm: new A(T * d), xh2: new A(T * d), rs2: new A(T), hp: new A(T * F), ha: new A(T * F)
    });
    this.xout = new A(T * d); this.xf = new A(T * d); this.xhf = new A(T * d); this.rsf = new A(T);
    this.logits = new A(T * V); this.p = new A(T * V);
    const s = this.s = {};
    ['dx', 'dxm', 'dt', 'dmm', 'do', 'dq', 'dk', 'dv', 'da', 'dxf', 'tmp'].forEach(k => { s[k] = new A(T * d); });
    s.dh = new A(T * F); s.dlog = new A(T * V); s.datt = new A(T);
    this.init(seed == null ? 1 : seed);
  }

  TinyGPT.prototype.init = function (seed) {
    const r = rng(seed), w = this.w, d = this.cfg.d;
    const gauss = () => { const u = Math.max(1e-7, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283185307 * v); };
    this.order.forEach(e => {
      const name = e[0], o = e[1], n = e[2], k = name.slice(0, 2);
      let sd = 0.08;
      if (k === 'Wo' || k === 'W2') sd = 0.04;      // residual writers start small
      if (name === 'E' || name === 'P') sd = 0.1;
      for (let i = 0; i < n; i++) w[o + i] = (k === 'g1' || k === 'g2' || name === 'gf') ? 1 : (k === 'b1' || k === 'b2' || k === 'c1' || k === 'c2' || name === 'bf') ? 0 : gauss() * sd;
    });
    void d;
    this.m.fill(0); this.v.fill(0); this.g.fill(0); this.steps = 0;
    return this;
  };

  // Runs the network on `tok` (array of ids). Leaves every intermediate in this.c for
  // backward() and for the page's visualisations. Returns the number of positions.
  TinyGPT.prototype.forward = function (tok) {
    const cfg = this.cfg, V = cfg.V, d = cfg.d, H = cfg.H, L = cfg.L, F = cfg.F, T = cfg.T, w = this.w, lay = this.lay;
    const n = Math.min(tok.length, T), dh = d / H, isq = 1 / Math.sqrt(dh), tmp = this.s.tmp;
    let x = this.c[0].xin;
    for (let i = 0; i < n; i++) {
      const eo = lay.E + tok[i] * d, po = lay.P + i * d;
      for (let j = 0; j < d; j++) x[i * d + j] = w[eo + j] + w[po + j];
    }
    for (let l = 0; l < L; l++) {
      const c = this.c[l], out = l + 1 < L ? this.c[l + 1].xin : this.xout;
      lnF(c.xin, n, d, w, lay['g1' + l], lay['b1' + l], c.xh1, c.rs1, c.a);
      mm(c.a, n, d, w, lay['Wq' + l], d, c.q);
      mm(c.a, n, d, w, lay['Wk' + l], d, c.k);
      mm(c.a, n, d, w, lay['Wv' + l], d, c.v);
      for (let h = 0; h < H; h++) {
        const ho = h * dh;
        for (let i = 0; i < n; i++) {
          const ao = (h * T + i) * T;
          let mx = -Infinity;
          for (let j = 0; j <= i; j++) {
            let sc = 0;
            for (let e = 0; e < dh; e++) sc += c.q[i * d + ho + e] * c.k[j * d + ho + e];
            sc *= isq; c.att[ao + j] = sc; if (sc > mx) mx = sc;
          }
          let sum = 0;
          for (let j = 0; j <= i; j++) { const ex = Math.exp(c.att[ao + j] - mx); c.att[ao + j] = ex; sum += ex; }
          for (let e = 0; e < dh; e++) c.o[i * d + ho + e] = 0;
          for (let j = 0; j <= i; j++) {
            const a = c.att[ao + j] / sum; c.att[ao + j] = a;
            for (let e = 0; e < dh; e++) c.o[i * d + ho + e] += a * c.v[j * d + ho + e];
          }
          for (let j = i + 1; j < T; j++) c.att[ao + j] = 0;
        }
      }
      mm(c.o, n, d, w, lay['Wo' + l], d, tmp);
      for (let i = 0; i < n * d; i++) c.xmid[i] = c.xin[i] + tmp[i];
      lnF(c.xmid, n, d, w, lay['g2' + l], lay['b2' + l], c.xh2, c.rs2, c.mm);
      mm(c.mm, n, d, w, lay['W1' + l], F, c.hp);
      const c1 = lay['c1' + l];
      for (let i = 0; i < n; i++) for (let j = 0; j < F; j++) {
        const z = c.hp[i * F + j] + w[c1 + j];
        c.hp[i * F + j] = z;
        c.ha[i * F + j] = 0.5 * z * (1 + Math.tanh(GC * (z + 0.044715 * z * z * z)));
      }
      mm(c.ha, n, F, w, lay['W2' + l], d, tmp);
      const c2 = lay['c2' + l];
      for (let i = 0; i < n; i++) for (let j = 0; j < d; j++) out[i * d + j] = c.xmid[i * d + j] + tmp[i * d + j] + w[c2 + j];
    }
    lnF(this.xout, n, d, w, lay.gf, lay.bf, this.xhf, this.rsf, this.xf);
    this.unembed(this.xf, n, this.logits);
    this.n = n; this.tok = tok;
    return n;
  };
  // logits[n x V] = x[n x d] . E^T   (the output layer shares the embedding table)
  TinyGPT.prototype.unembed = function (x, n, out) {
    const V = this.cfg.V, d = this.cfg.d, w = this.w, E = this.lay.E;
    for (let i = 0; i < n; i++) for (let v = 0; v < V; v++) {
      let s = 0;
      for (let j = 0; j < d; j++) s += x[i * d + j] * w[E + v * d + j];
      out[i * V + v] = s;
    }
  };
  function softmaxRow(src, so, V, dst, dof) {
    let mx = -Infinity, sum = 0;
    for (let v = 0; v < V; v++) if (src[so + v] > mx) mx = src[so + v];
    for (let v = 0; v < V; v++) { const e = Math.exp(src[so + v] - mx); dst[dof + v] = e; sum += e; }
    for (let v = 0; v < V; v++) dst[dof + v] /= sum;
  }

  // Cross-entropy of predicting target[i] after position i; adds scale * gradient into this.g.
  TinyGPT.prototype.lossGrad = function (tok, target, scale) {
    const cfg = this.cfg, V = cfg.V, d = cfg.d, H = cfg.H, L = cfg.L, F = cfg.F, T = cfg.T, w = this.w, g = this.g, lay = this.lay, s = this.s;
    const n = this.forward(tok), dh = d / H, isq = 1 / Math.sqrt(dh), k0 = (scale == null ? 1 : scale) / n;
    let loss = 0;
    for (let i = 0; i < n; i++) {
      softmaxRow(this.logits, i * V, V, this.p, i * V);
      loss -= Math.log(Math.max(1e-12, this.p[i * V + target[i]]));
      for (let v = 0; v < V; v++) s.dlog[i * V + v] = this.p[i * V + v] * k0;
      s.dlog[i * V + target[i]] -= k0;
    }
    // output layer (tied): dxf = dlog . E ; gE += dlog^T . xf
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < d; j++) s.dxf[i * d + j] = 0;
      for (let v = 0; v < V; v++) {
        const dl = s.dlog[i * V + v], eo = lay.E + v * d;
        if (dl === 0) continue;
        for (let j = 0; j < d; j++) { s.dxf[i * d + j] += dl * w[eo + j]; g[eo + j] += dl * this.xf[i * d + j]; }
      }
    }
    lnB(s.dxf, n, d, w, g, lay.gf, lay.bf, this.xhf, this.rsf, s.dx);
    for (let l = L - 1; l >= 0; l--) {
      const c = this.c[l], c2 = lay['c2' + l], c1 = lay['c1' + l];
      // MLP:  out = xmid + gelu(ln2(xmid).W1 + c1).W2 + c2
      for (let i = 0; i < n; i++) for (let j = 0; j < d; j++) g[c2 + j] += s.dx[i * d + j];
      mmB(c.ha, s.dx, n, F, d, w, g, lay['W2' + l], s.dh, false);
      for (let i = 0; i < n; i++) for (let j = 0; j < F; j++) {
        const z = c.hp[i * F + j], th = Math.tanh(GC * (z + 0.044715 * z * z * z));
        const dz = s.dh[i * F + j] * (0.5 * (1 + th) + 0.5 * z * (1 - th * th) * GC * (1 + 0.134145 * z * z));
        s.dh[i * F + j] = dz; g[c1 + j] += dz;
      }
      mmB(c.mm, s.dh, n, d, F, w, g, lay['W1' + l], s.dmm, false);
      lnB(s.dmm, n, d, w, g, lay['g2' + l], lay['b2' + l], c.xh2, c.rs2, s.dt);
      for (let i = 0; i < n * d; i++) s.dxm[i] = s.dx[i] + s.dt[i];
      // attention:  xmid = xin + concat_h(att_h . v_h).Wo
      mmB(c.o, s.dxm, n, d, d, w, g, lay['Wo' + l], s.do, false);
      for (let i = 0; i < n * d; i++) { s.dq[i] = 0; s.dk[i] = 0; s.dv[i] = 0; }
      for (let h = 0; h < H; h++) {
        const ho = h * dh;
        for (let i = 0; i < n; i++) {
          const ao = (h * T + i) * T;
          let dot = 0;
          for (let j = 0; j <= i; j++) {
            let da = 0;
            for (let e = 0; e < dh; e++) da += s.do[i * d + ho + e] * c.v[j * d + ho + e];
            s.datt[j] = da; dot += c.att[ao + j] * da;
          }
          for (let j = 0; j <= i; j++) {
            const a = c.att[ao + j], ds = a * (s.datt[j] - dot) * isq;
            for (let e = 0; e < dh; e++) {
              s.dq[i * d + ho + e] += ds * c.k[j * d + ho + e];
              s.dk[j * d + ho + e] += ds * c.q[i * d + ho + e];
              s.dv[j * d + ho + e] += a * s.do[i * d + ho + e];
            }
          }
        }
      }
      mmB(c.a, s.dq, n, d, d, w, g, lay['Wq' + l], s.da, false);
      mmB(c.a, s.dk, n, d, d, w, g, lay['Wk' + l], s.da, true);
      mmB(c.a, s.dv, n, d, d, w, g, lay['Wv' + l], s.da, true);
      lnB(s.da, n, d, w, g, lay['g1' + l], lay['b1' + l], c.xh1, c.rs1, s.dt);
      for (let i = 0; i < n * d; i++) s.dx[i] = s.dxm[i] + s.dt[i];
    }
    for (let i = 0; i < n; i++) {
      const eo = lay.E + tok[i] * d, po = lay.P + i * d;
      for (let j = 0; j < d; j++) { g[eo + j] += s.dx[i * d + j]; g[po + j] += s.dx[i * d + j]; }
    }
    return loss / n;
  };

  // One Adam update from whatever is in this.g, then clears it.
  TinyGPT.prototype.adam = function (lr) {
    const w = this.w, g = this.g, m = this.m, v = this.v, b1 = 0.9, b2 = 0.99;
    const t = ++this.steps, k1 = 1 - Math.pow(b1, t), k2 = 1 - Math.pow(b2, t);
    for (let i = 0; i < w.length; i++) {
      const gi = g[i];
      m[i] = b1 * m[i] + (1 - b1) * gi;
      v[i] = b2 * v[i] + (1 - b2) * gi * gi;
      w[i] -= lr * (m[i] / k1) / (Math.sqrt(v[i] / k2) + 1e-8);
      g[i] = 0;
    }
  };
  // seqs: arrays of ids starting with the start token. Returns the mean loss.
  // `noise(id)` may swap an input id (never a target) to make the model robust to unknowns.
  TinyGPT.prototype.trainBatch = function (seqs, lr, noise) {
    let loss = 0;
    for (const sq of seqs) {
      const inp = sq.slice(0, -1), tgt = sq.slice(1);
      if (noise) for (let i = 1; i < inp.length; i++) inp[i] = noise(inp[i]);
      loss += this.lossGrad(inp, tgt, 1 / seqs.length);
    }
    this.adam(lr);
    return loss / seqs.length;
  };
  TinyGPT.prototype.evalLoss = function (seqs) {
    let loss = 0;
    const V = this.cfg.V;
    for (const sq of seqs) {
      const n = this.forward(sq.slice(0, -1));
      let l = 0;
      for (let i = 0; i < n; i++) { softmaxRow(this.logits, i * V, V, this.p, i * V); l -= Math.log(Math.max(1e-12, this.p[i * V + sq[i + 1]])); }
      loss += l / n;
    }
    return loss / seqs.length;
  };

  // Next-token probabilities after `tok`, as a fresh array of length V.
  TinyGPT.prototype.next = function (tok) {
    const V = this.cfg.V, n = this.forward(tok), out = new Float64Array(V);
    softmaxRow(this.logits, (n - 1) * V, V, out, 0);
    return out;
  };
  // Everything the page draws for one prompt, copied out of the caches.
  //   att[layer][head] : n x n weights (row = the token asking, column = the token read)
  //   lens[depth]      : next-token probabilities if the stack were cut off after `depth` layers
  //   probs            : the real next-token probabilities;  rows[i] : per-position probabilities
  TinyGPT.prototype.trace = function (tok) {
    const cfg = this.cfg, V = cfg.V, d = cfg.d, T = cfg.T, n = this.forward(tok), A = this.A;
    const att = this.c.map(c => {
      const heads = [];
      for (let h = 0; h < cfg.H; h++) {
        const m = new Float64Array(n * n);
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) m[i * n + j] = c.att[(h * T + i) * T + j];
        heads.push(m);
      }
      return heads;
    });
    const rows = [];
    for (let i = 0; i < n; i++) { const r = new Float64Array(V); softmaxRow(this.logits, i * V, V, r, 0); rows.push(r); }
    const lens = [], x1 = new A(d), xh = new A(d), rs = new A(1), y = new A(d), lg = new A(V);
    for (let k = 0; k <= cfg.L; k++) {
      const src = k < cfg.L ? this.c[k].xin : this.xout;
      for (let j = 0; j < d; j++) x1[j] = src[(n - 1) * d + j];
      lnF(x1, 1, d, this.w, this.lay.gf, this.lay.bf, xh, rs, y);
      this.unembed(y, 1, lg);
      const pr = new Float64Array(V); softmaxRow(lg, 0, V, pr, 0); lens.push(pr);
    }
    return { n, att, lens, rows, probs: rows[n - 1] };
  };
  TinyGPT.prototype.row = function (name, i, len) { const o = this.lay[name] + i * len; return Array.from(this.w.subarray(o, o + len)); };

  /* ---------- weights in and out: 16-bit, one scale per tensor, base64 ---------- */
  TinyGPT.prototype.pack = function () {
    const q = new Int16Array(this.size), scales = [];
    this.order.forEach(e => {
      let mx = 1e-9;
      for (let i = 0; i < e[2]; i++) mx = Math.max(mx, Math.abs(this.w[e[1] + i]));
      scales.push(+mx.toPrecision(7));
      for (let i = 0; i < e[2]; i++) q[e[1] + i] = Math.round(this.w[e[1] + i] / mx * 32767);
    });
    const b = new Uint8Array(q.buffer);
    let s = '';
    for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return { cfg: this.cfg, scales, data: btoa(s) };
  };
  TinyGPT.unpack = function (pk) {
    const m = new TinyGPT(pk.cfg, 1), bin = atob(pk.data), b = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
    const q = new Int16Array(b.buffer);
    m.order.forEach((e, k) => { for (let i = 0; i < e[2]; i++) m.w[e[1] + i] = q[e[1] + i] / 32767 * pk.scales[k]; });
    return m;
  };
  TinyGPT.rng = rng;
  return TinyGPT;
});
