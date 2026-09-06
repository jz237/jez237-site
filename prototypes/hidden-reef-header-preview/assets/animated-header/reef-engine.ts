/* Refracted reef artwork, layered marine life, and optical particles. */
import { underwaterLight, sampleUnderwaterLight } from './underwater-light';
const vertex = `attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision highp float;
varying vec2 uv; uniform sampler2D reef; uniform float time; uniform float aspect; uniform float imageAspect; uniform vec2 pointer;
${underwaterLight}
void main(){
 vec2 p=vec2(uv.x,1.-uv.y);vec2 st=p;
 if(aspect>imageAspect) st.y=(st.y-.5)*imageAspect/aspect+.5;else st.x=(st.x-.5)*aspect/imageAspect+.5;
 float edge=pow(abs(p.x-.5)*2.,2.);
 float ripple=sin(p.y*29.+time*.65)*sin(p.x*21.-time*.31);
 st+=vec2(sin(p.y*37.+time*.6),cos(p.x*31.+time*.45))*(.0009+.0015*edge);
 st+=(pointer*vec2(.004,.003))*(.25+edge);st=(st-.5)*.978+.5;
 // Gentle current bends colorful coral tips; smooth local masks leave rock still.
 vec3 material=texture2D(reef,st).rgb;
 float coralColor=smoothstep(.08,.35,material.r-material.g*.55);
 float anemone=exp(-dot((st-vec2(.095,.57))/vec2(.13,.22),(st-vec2(.095,.57))/vec2(.13,.22))*2.);
 float leftBranch=exp(-dot((st-vec2(.035,.14))/vec2(.08,.19),(st-vec2(.035,.14))/vec2(.08,.19))*2.);
 float rightBranch=exp(-dot((st-vec2(.965,.45))/vec2(.09,.25),(st-vec2(.965,.45))/vec2(.09,.25))*2.);
 float coral=coralColor*max(anemone,max(leftBranch,rightBranch));
 float current=sin(time*.65+st.y*12.)+.25*sin(time*.91+st.y*19.);
 st.x+=coral*current*.0028;
 st.y+=coral*cos(time*.65+st.x*14.)*.0007;
 // Tiny soft-coral clusters slowly extend and retract around their centers.
 vec2 polypGrid=vec2(110.,42.);
 vec2 polypCell=floor(st*polypGrid);
 vec2 polypLocal=fract(st*polypGrid)-.5;
 float polypPhase=dot(polypCell,vec2(1.73,2.91));
 float feeding=sin(time*.46+polypPhase)*.045;
 float polypMask=coral*pow(max(0.,1.-length(polypLocal)*2.),2.);
 st+=polypLocal/polypGrid*feeding*polypMask;
 vec3 color=texture2D(reef,st).rgb;
 float shafts=lightShafts(p,time);
 float caustic=waterCaustics(p,time)*.12*(.25+edge)*exp(-p.y*3.);
 color*=.84+.045*sin(time*.5+p.x*9.)*pow(1.-p.y,2.);
 color+=vec3(.17,.66,.8)*shafts*.46+vec3(.18,.63,.7)*caustic; color+=vec3(.0,.02,.032)*ripple;
 gl_FragColor=vec4(color,1.);}`;
type Fish = {
  cell: number;
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
};
export class ReefEngine {
  paused = false;
  private frame = 0;
  private clock = 0;
  private last = 0;
  private width = 1;
  private height = 1;
  private dirty = true;
  private pointer = { x: 0, y: 0 };
  private target = { x: 0, y: 0 };
  private gl: WebGLRenderingContext | null;
  private ctx: CanvasRenderingContext2D | null;
  private program: WebGLProgram | null = null;
  private texture: WebGLTexture | null = null;
  private buffer: WebGLBuffer | null = null;
  private backdrop = new Image();
  private sprites = new Image();
  private finFrames: HTMLCanvasElement[] = [];
  private fishLight: HTMLCanvasElement | null = null;
  private lastFinFrame = -1;
  private loaded = false;
  private disposed = false;
  private reactions = new WeakMap<Fish, number>();
  private bubbleHold: { id: number; x: number; y: number; next: number } | null = null;
  private clickBubbles: Array<{ x: number; y: number; r: number; speed: number; phase: number; depth: number; born: number }> = [];
  private resize: ResizeObserver;
  private fish: Fish[] = [
    { cell: 0, x: 0.128, y: 0.21, size: 0.145, phase: 0, speed: 0.43 },
    { cell: 1, x: 0.885, y: 0.2, size: 0.133, phase: 2, speed: 0.35 },
    { cell: 2, x: 0.12, y: 0.59, size: 0.155, phase: 3, speed: 0.53 },
    { cell: 3, x: 0.88, y: 0.6, size: 0.143, phase: 1, speed: 0.38 },
  ];
  private particles = Array.from({ length: 135 }, (_, i) => ({
    x: ((i * 73.37) % 100) / 100,
    y: ((i * 37.71) % 100) / 100,
    r: 0.5 + (i % 5) * 0.36,
    speed: 0.009 + (i % 7) * 0.003,
    phase: i * 1.77,
  }));
  private bubbles = Array.from({ length: 78 }, (_, i) => ({
    depth: i % 13 === 0 ? 1 : 0.2 + (i % 4) * 0.15,
    x: [0.055, 0.19, 0.26, 0.71, 0.81, 0.95][i % 6] + Math.sin(i * 13) * 0.018,
    y: (i * 0.137) % 1,
    r: 0.0018 + (i % 5) * 0.00115,
    speed: 0.028 + (i % 7) * 0.007,
    phase: i * 1.2,
  }));
  constructor(
    private water: HTMLCanvasElement,
    private life: HTMLCanvasElement,
    private root: HTMLElement,
    onReady: () => void,
  ) {
    this.gl = water.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });
    this.ctx = life.getContext('2d');
    if (this.gl) this.setupGL();
    this.backdrop.onload = () => {
      if (this.disposed) return;
      this.loaded = true;
      if (this.gl && this.program) {
        const gl = this.gl;
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          this.backdrop,
        );
      } else water.style.background = 'url(./reef.png) center / cover';
      onReady();
    };
    this.backdrop.addEventListener('load', () => {
      this.dirty = true;
    });
    this.sprites.onload = () => {
      this.fishLight = document.createElement('canvas');
      this.fishLight.width = this.sprites.width / 2;
      this.fishLight.height = this.sprites.height / 2;
      this.finFrames = Array.from({ length: 4 }, () => {
        const frame = document.createElement('canvas');
        frame.width = this.sprites.width / 2;
        frame.height = this.sprites.height / 2;
        return frame;
      });
      this.dirty = true;
    };
    this.backdrop.src = './reef.png';
    this.sprites.src = './fish.png';
    this.resize = new ResizeObserver(() => this.measure());
    this.resize.observe(water);
    root.addEventListener('pointermove', this.move);
    root.addEventListener('pointerleave', this.leave);
    root.addEventListener('click', this.clickFish);
    root.addEventListener('pointerdown', this.startBubbles);
    window.addEventListener('pointerup', this.endBubbles);
    window.addEventListener('pointercancel', this.endBubbles);
    window.addEventListener('blur', this.stopBubbles);
    this.measure();
    this.frame = requestAnimationFrame(this.animate);
  }
  private setupGL() {
    const gl = this.gl!;
    const compile = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, vertex),
      fs = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return;
    const p = gl.createProgram()!;
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      gl.deleteProgram(p);
      return;
    }
    this.program = p;
    gl.useProgram(p);
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const a = gl.getAttribLocation(p, 'position');
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  }
  private measure() {
    const r = this.water.getBoundingClientRect();
    this.width = r.width;
    this.height = r.height;
    const crop = this.root.querySelector<HTMLElement>('.reef-crop');
    if (crop) crop.style.height = `${r.height * 0.72}px`;
    const d = Math.min(window.devicePixelRatio || 1, 1.75);
    for (const c of [this.water, this.life]) {
      c.width = Math.round(r.width * d);
      c.height = Math.round(r.height * d);
    }
    this.ctx?.setTransform(d, 0, 0, d, 0, 0);
    this.gl?.viewport(0, 0, this.water.width, this.water.height);
    this.dirty = true;
  }
  private move = (e: PointerEvent) => {
    const r = this.water.getBoundingClientRect();
    this.target = {
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    };
    if (this.bubbleHold?.id === e.pointerId) {
      if (!(e.buttons & 1)) this.stopBubbles();
      else {
        this.bubbleHold.x = this.target.x + 0.5;
        this.bubbleHold.y = this.target.y + 0.5;
      }
    }
  };
  private leave = () => {
    this.target = { x: 0, y: 0 };
    this.stopBubbles();
  };
  private stopBubbles = () => { this.bubbleHold = null; };
  private endBubbles = (event: PointerEvent) => {
    if (this.bubbleHold?.id === event.pointerId) this.stopBubbles();
  };
  private startBubbles = (event: PointerEvent) => {
    if (!event.isPrimary || event.button !== 0) return;
    if ((event.target as Element).closest('button, a, input')) return;
    const bounds = this.water.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    if (x < 0 || x > 1 || y < 0.01 || y > 0.73) return;
    this.bubbleHold = { id: event.pointerId, x, y, next: this.clock + 0.14 };
    this.releaseBubble(x, y);
  };
  private releaseBubble(x: number, y: number) {
    if (x < 0 || x > 1 || y < 0.01 || y > 0.73) return;
    const size = 0.35 + Math.pow(Math.random(), 1.4) * 1.65;
    this.clickBubbles.push({
      x, y,
      r: Math.max(5, Math.min(11, this.width * 0.0045)) * size / this.width,
      speed: 0.055 + size * 0.025 + Math.random() * 0.012, phase: Math.random() * Math.PI * 2, depth: 0.9, born: this.clock,
    });
    if (this.clickBubbles.length > 100) this.clickBubbles.shift();
    this.dirty = true;
  }
  private clickFish = (event: MouseEvent) => {
    if ((event.target as Element).closest('button, a, input')) return;
    const bounds = this.water.getBoundingClientRect();
    const px = event.clientX - bounds.left;
    const py = event.clientY - bounds.top;
    if (px < 0 || px > this.width || py < this.height * 0.01 || py > this.height * 0.73) return;
    if (this.paused || !this.finFrames.length) return;
    // Test the visible sprite, in reverse paint order, rather than its empty square.
    for (const fish of [...this.fish].reverse()) {
      const pose = this.fishPose(fish, this.clock);
      const angle = Math.sin(pose.swimTime * fish.speed * 0.6 + fish.phase) * 0.04;
      const scale = pose.scale;
      const dx = px - pose.x, dy = py - pose.y;
      const width = fish.size * this.width * (this.width / this.height < 1.8 ? 1.35 : 1);
      const u = (dx * Math.cos(angle) + dy * Math.sin(angle)) / scale / width + 0.5;
      const v = (-dx * Math.sin(angle) + dy * Math.cos(angle)) / width + 0.5;
      if (u < 0 || u >= 1 || v < 0 || v >= 1) continue;
      const sprite = this.finFrames[fish.cell];
      const alpha = sprite.getContext('2d')!.getImageData(
        Math.floor(u * sprite.width), Math.floor(v * sprite.height), 1, 1,
      ).data[3];
      if (alpha < 40) continue;
      // Let a response finish before accepting another tap; no stacked jumps.
      const previous = this.reactions.get(fish);
      if (previous === undefined || this.clock - previous > 2.4)
        this.reactions.set(fish, this.clock);
      break;
    }
  };
  private reaction(fish: Fish, time: number) {
    const start = this.reactions.get(fish);
    const age = start === undefined ? 10 : Math.max(0, time - start);
    const strength = age < 3 ? 8 * age * Math.exp(-3 * age) * (1 - age / 3) ** 2 : 0;
    return { strength, flutter: Math.sin(age * 22) * strength };
  }
  private animate = (now: number) => {
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    if (!this.paused && !document.hidden) {
      this.clock += dt;
      if (this.bubbleHold && this.clock >= this.bubbleHold.next) {
        this.releaseBubble(this.bubbleHold.x, this.bubbleHold.y);
        this.bubbleHold.next = this.clock + 0.14;
      }
      this.pointer.x += (this.target.x - this.pointer.x) * 0.025;
      this.pointer.y += (this.target.y - this.pointer.y) * 0.025;
    }
    if (!document.hidden && (!this.paused || this.dirty)) {
      this.drawWater();
      this.drawLife();
      this.dirty = false;
    }
    this.frame = requestAnimationFrame(this.animate);
  };
  private drawWater() {
    const gl = this.gl,
      p = this.program;
    if (!gl || !p || !this.loaded) return;
    gl.useProgram(p);
    gl.uniform1f(gl.getUniformLocation(p, 'time'), this.clock);
    gl.uniform1f(gl.getUniformLocation(p, 'aspect'), this.width / this.height);
    gl.uniform1f(
      gl.getUniformLocation(p, 'imageAspect'),
      this.backdrop.width / this.backdrop.height,
    );
    gl.uniform2f(
      gl.getUniformLocation(p, 'pointer'),
      this.pointer.x,
      this.pointer.y,
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  private drawLife() {
    const c = this.ctx;
    if (!c) return;
    const w = this.width,
      h = this.height,
      t = this.clock;
    c.clearRect(0, 0, w, h);
    if (this.finFrames.length && Math.floor(t * 30) !== this.lastFinFrame) {
      this.updateSideFins(t);
      this.lastFinFrame = Math.floor(t * 30);
    }
    if (this.sprites.complete && this.sprites.naturalWidth) {
      c.save();
      const passage = (t + 5) % 38;
      const progress = Math.min(passage / 18, 1);
      c.globalAlpha = passage < 18 ? Math.sin(progress * Math.PI) ** 2 * 0.25 : 0;
      c.filter = 'brightness(.22) sepia(1) saturate(3) hue-rotate(145deg)';
      for (let i = 0; i < 12; i++)
        this.drawFish(
          {
            cell: 0,
            x: 0.28 + progress * 0.39 + (i % 4) * 0.016,
            y: 0.695 + Math.floor(i / 4) * 0.009,
            size: 0.009 + (i % 3) * 0.002,
            phase: i,
            speed: 0.9,
          },
          t,
        );
      c.restore();
    }
    for (const p of this.particles) {
      const y = ((((p.y - t * p.speed) % 1) + 1) % 1) * h;
      const current = Math.sin(t * 0.65 + y / h * 12) + 0.25 * Math.sin(t * 0.91 + y / h * 19);
      const x = (p.x + Math.sin(t * 0.13 + p.phase) * 0.012 + current * 0.006) * w;
      c.beginPath();
      c.fillStyle = `rgba(152,237,255,${0.13 + Math.sin(t * 0.7 + p.phase) * 0.09})`;
      c.arc(x, y, p.r, 0, Math.PI * 2);
      c.fill();
    }
    for (const b of this.bubbles) {
      const x =
          (b.x + Math.sin(t * 0.7 + b.phase) * 0.009) * w -
          this.pointer.x * (2 + b.depth * 10),
        y = ((((b.y - t * b.speed * (0.45 + b.depth * 0.65)) % 1) + 1) % 1) * h,
        r = b.r * w * (0.4 + b.depth * 0.75);
      this.drawBubble(x, y, r, b.depth, b.phase, t);
    }
    if (this.sprites.complete && this.sprites.naturalWidth)
      for (const f of this.fish) this.drawFish(f, t);
    this.clickBubbles = this.clickBubbles.filter((b) => b.y - (t - b.born) * b.speed > -0.03);
    for (const b of this.clickBubbles) {
      const age = t - b.born;
      const x = (b.x + (Math.sin(age * 1.5 + b.phase) - Math.sin(b.phase)) * 0.006) * w;
      const y = (b.y - age * b.speed) * h;
      this.drawBubble(x, y, b.r * w * (1 + Math.min(age, 3) * 0.04), b.depth, b.phase, t);
    }
  }
  private drawBubble(x: number, y: number, r: number, depth: number, phase: number, t: number) {
      const c = this.ctx!;
      c.save();
      c.globalAlpha = 0.25 + depth * 0.65;
      c.translate(x, y);
      c.scale(1, 1.08);
      const g = c.createRadialGradient(-r * 0.3, -r * 0.35, 0, 0, 0, r);
      g.addColorStop(0, 'rgba(173,242,255,0)');
      g.addColorStop(0.72, 'rgba(81,202,255,.015)');
      g.addColorStop(0.91, 'rgba(111,221,255,.16)');
      g.addColorStop(1, 'rgba(211,253,255,.6)');
      c.fillStyle = g;
      c.beginPath();
      c.arc(0, 0, r, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = 'rgba(205,251,255,.75)';
      c.lineWidth = Math.max(0.6, r * 0.08);
      c.beginPath();
      c.arc(0, 0, r * 0.83, 3.65, 4.85);
      c.stroke();
      // Reflections use the same moving shafts that illuminate the lettering.
      const light = Math.min(1, sampleUnderwaterLight(x / this.width, y / this.height, t) * 2.5);
      if (light > 0.015) {
        c.globalAlpha = light * (0.3 + depth * 0.5);
        c.strokeStyle = '#d8faff';
        c.lineWidth = Math.max(0.65, r * 0.13);
        c.beginPath();
        const angle = -2.2 + Math.sin(t * 0.38 + phase) * 0.25;
        c.arc(0, 0, r * 0.85, angle, angle + 0.65);
        c.stroke();
      }
      c.restore();
  }
  private drawFish(f: Fish, t: number) {
    const c = this.ctx!,
      w = this.width,
      h = this.height;
    const sw = this.sprites.width / 2,
      sh = this.sprites.height / 2,
      sx = (f.cell % 2) * sw,
      sy = Math.floor(f.cell / 2) * sh;
    const mobile = w / h < 1.8;
    const animatedSprite = f.size > 0.05 ? this.finFrames[f.cell] : undefined;
    const fw = f.size * w * (mobile ? 1.35 : 1),
      fh = (fw * sh) / sw;
    const { x, y, swimTime, scale } = this.fishPose(f, t);
    const effort = this.reaction(f, t).strength;
    c.save();
    c.translate(x, y);
    c.rotate(Math.sin(swimTime * f.speed * 0.6 + f.phase) * 0.04);
    c.scale(scale, 1);
    const slices = 52;
    // A traveling bend is strongest at the tail and fades toward the head.
    // Keep the fish's center on its ordinary path instead of shaking the sprite.
    const flexX = (u: number) => {
      const tail = f.cell === 1 || f.cell === 3 ? u : 1 - u;
      return -fw / 2 + fw * u + fw * 0.085 * effort * tail ** 2 *
        Math.sin(t * 4.2 + u * 5 + f.phase);
    };
    for (let i = 0; i < slices; i++) {
      const u = i / slices;
      const tail = f.cell === 1 || f.cell === 3 ? u : 1 - u;
      const wave =
        Math.sin(
          t * 4.2 + 0.8 * Math.sin(t * 0.65 + f.phase) + u * 5 + f.phase,
        ) *
        Math.pow(tail, 2) *
        fh *
        0.028 *
        (0.78 + 0.22 * Math.sin(t * 0.75 + f.phase));
      const rows = animatedSprite ? 8 : 1;
      const dorsalY = (v: number) => -fh / 2 + fh * v + wave +
        (animatedSprite ? Math.exp(-((v - 0.25) ** 2) / 0.018) * Math.sin(Math.PI * u) ** 2 *
          Math.sin(t * (2.7 + f.cell * 0.17) + u * 10 + f.phase) * fh * 0.012 : 0);
      for (let row = 0; row < rows; row++) {
      const v = row / rows;
      c.drawImage(
        animatedSprite ?? this.sprites,
        (animatedSprite ? 0 : sx) + sw * u,
        (animatedSprite ? 0 : sy) + sh * v,
        sw / slices,
        sh / rows,
        flexX(u),
        dorsalY(v),
        flexX(u + 1 / slices) - flexX(u) + 0.45,
        dorsalY(v + 1 / rows) - dorsalY(v) + (rows > 1 ? 0.35 : 0),
      );
      }
    }
    c.restore();
  }
  private fishPose(f: Fish, t: number) {
    const swimTime = t + 0.65 * Math.sin(t * 0.45 + f.phase);
    const turnTime = (t + f.phase * 6.3) % (25 + f.cell * 2);
    const turn = f.size > 0.05 && turnTime < 6 ? Math.sin(turnTime / 6 * Math.PI) ** 2 : 0;
    const yellow = f.cell === 0 && f.size > 0.05;
    let x = (f.x + Math.sin(swimTime * f.speed * 0.25 + f.phase) * (yellow ? 0.01 : 0.024)) * this.width - this.pointer.x * 12;
    // Reserve space before the H for the entire yellow sprite, including its
    // small rotation and click flex. On narrow layouts it swims above the title.
    if (yellow && this.width / this.height >= 1.8)
      x = Math.min(x, (0.205 - f.size * 0.54) * this.width);
    return {
      swimTime,
      scale: 0.98 + 0.02 * Math.cos(swimTime * 0.45 + f.phase) - turn * 0.12,
      x,
      y:
        (f.y + Math.sin(swimTime * f.speed * 0.56 + f.phase) * 0.016) *
          this.height -
        this.pointer.y * 7,
    };
  }
  private updateSideFins(t: number) {
    // Localized mesh patches bend the pectoral fin while keeping the surrounding
    // body fixed. Each species has its own fin position and flutter phase.
    const fins = [
      { x: 0.6, y: 0.57, rx: 0.115, ry: 0.13, direction: -1 },
      { x: 0.43, y: 0.62, rx: 0.145, ry: 0.14, direction: 1 },
      { x: 0.61, y: 0.5, rx: 0.125, ry: 0.135, direction: -1 },
      { x: 0.42, y: 0.5, rx: 0.12, ry: 0.15, direction: 1 },
    ];
    for (let cell = 0; cell < this.finFrames.length; cell++) {
      const frame = this.finFrames[cell],
        ctx = frame.getContext('2d')!;
      const size = frame.width,
        sx = (cell % 2) * size,
        sy = Math.floor(cell / 2) * size;
      const fin = fins[cell];
      const fish = this.fish.find((f) => f.cell === cell);
      const finEffort = 1 + (fish ? this.reaction(fish, t).strength : 0) * 1.1;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(this.sprites, sx, sy, size, size, 0, 0, size, size);
      const phase =
        t * (5.5 + cell * 0.37) + cell * 1.9 + Math.sin(t * 0.6 + cell) * 1.1;
      const breath = Math.sin(t * (2.1 + cell * 0.13) + cell * 1.8);
      const point = (u: number, v: number) => {
        const px = (fin.x + (u * 2 - 1) * fin.rx) * size;
        const py = (fin.y + (v * 2 - 1) * fin.ry) * size;
        const weight = Math.pow(
          Math.sin(u * Math.PI) * Math.sin(v * Math.PI),
          2,
        );
        // Small operculum expansion beside the pectoral fin, with a separate
        // breathing rhythm per fish. The patch edges stay fixed.
        const gillU = cell === 1 || cell === 3 ? 0.25 : 0.75;
        const gill = Math.exp(-((u - gillU) ** 2 / 0.025 + (v - 0.38) ** 2 / 0.14)) * weight;
        return {
          sx: px,
          sy: py,
          x: px + Math.sin(phase) * size * 0.024 * weight * fin.direction * finEffort + breath * size * 0.009 * gill,
          y: py + Math.cos(phase + v * 0.8) * size * 0.015 * weight * finEffort,
        };
      };
      type Vertex = ReturnType<typeof point>;
      const triangle = (a: Vertex, b: Vertex, d: Vertex) => {
        const bx = b.sx - a.sx,
          by = b.sy - a.sy,
          dx = d.sx - a.sx,
          dy = d.sy - a.sy;
        const det = bx * dy - dx * by;
        const m0 = ((b.x - a.x) * dy - (d.x - a.x) * by) / det;
        const m1 = ((b.y - a.y) * dy - (d.y - a.y) * by) / det;
        const m2 = ((d.x - a.x) * bx - (b.x - a.x) * dx) / det;
        const m3 = ((d.y - a.y) * bx - (b.y - a.y) * dx) / det;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(d.x, d.y);
        ctx.closePath();
        ctx.clip();
        ctx.transform(
          m0,
          m1,
          m2,
          m3,
          a.x - m0 * a.sx - m2 * a.sy,
          a.y - m1 * a.sx - m3 * a.sy,
        );
        ctx.drawImage(this.sprites, sx, sy, size, size, 0, 0, size, size);
        ctx.restore();
      };
      const columns = 10,
        rows = 10;
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < columns; x++) {
          const a = point(x / columns, y / rows),
            b = point((x + 1) / columns, y / rows);
          const d = point(x / columns, (y + 1) / rows),
            e = point((x + 1) / columns, (y + 1) / rows);
          triangle(a, b, d);
          triangle(b, e, d);
        }
      // Light is clipped to the finished fish alpha, including its moving fins.
      const f = this.fish.find((fish) => fish.cell === cell);
      if (f && this.fishLight) {
        const lightCtx = this.fishLight.getContext('2d')!;
        const pose = this.fishPose(f, t);
        const fw =
          f.size * this.width * (this.width / this.height < 1.8 ? 1.35 : 1);
        lightCtx.clearRect(0, 0, size, size);
        const rays = lightCtx.createLinearGradient(0, 0, size, 0);
        for (let i = 0; i <= 24; i++) {
          const u = i / 24;
          const intensity = sampleUnderwaterLight(
            (pose.x + (u - 0.5) * fw) / this.width,
            Math.max(0, (pose.y - fw * 0.18) / this.height),
            t,
          );
          rays.addColorStop(
            u,
            `rgba(180,240,255,${Math.min(0.27, intensity * 0.22)})`,
          );
        }
        lightCtx.fillStyle = rays;
        lightCtx.fillRect(0, 0, size, size);
        const falloff = lightCtx.createLinearGradient(0, 0, 0, size);
        falloff.addColorStop(0, 'white');
        falloff.addColorStop(0.3, 'white');
        falloff.addColorStop(0.6, 'rgba(255,255,255,.4)');
        falloff.addColorStop(0.87, 'transparent');
        lightCtx.globalCompositeOperation = 'destination-in';
        lightCtx.fillStyle = falloff;
        lightCtx.fillRect(0, 0, size, size);
        lightCtx.globalCompositeOperation = 'source-over';
        ctx.save();
        ctx.globalCompositeOperation = 'source-atop';
        ctx.drawImage(this.fishLight, 0, 0);
        ctx.restore();
      }
    }
  }
  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.resize.disconnect();
    this.root.removeEventListener('pointermove', this.move);
    this.root.removeEventListener('pointerleave', this.leave);
    this.root.removeEventListener('click', this.clickFish);
    this.root.removeEventListener('pointerdown', this.startBubbles);
    window.removeEventListener('pointerup', this.endBubbles);
    window.removeEventListener('pointercancel', this.endBubbles);
    window.removeEventListener('blur', this.stopBubbles);
    this.stopBubbles();
    if (this.gl) {
      this.gl.deleteTexture(this.texture);
      this.gl.deleteBuffer(this.buffer);
      this.gl.deleteProgram(this.program);
    }
  }
}
