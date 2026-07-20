/*
 * HD graphics mod for the Stunt Car Racer WASM engine — no engine changes.
 * Works by wrapping the WebGL context before source.js creates it:
 *   - forces MSAA on;
 *   - rewrites the engine's two 3D shaders at compile time (world-space varyings,
 *     value-noise terrain/asphalt texturing, derivative-based sun lighting, depth fog);
 *   - intercepts the engine's two scissored clear fills (sky / far ground) and
 *     draws a photo-sky quad and a ray-cast textured ground plane instead,
 *     using view/projection matrices captured from the engine's uniform uploads.
 * ?classic=1 disables everything.
 */
(function () {
  'use strict';
  if (/[?&]classic=1/.test(location.search)) return;

  // engine fill colors (from glClearColor), 0-255
  var SKY_KEY = '85,153,255';
  var GROUND_KEY = '119,119,85';

  // ── tiny 4x4 helpers (row-vector convention like the engine: pos * M) ──
  function mat4Mul(a, b) { // returns a*b for row-vector use: pos*(a*b) == (pos*a)*b
    var o = new Float32Array(16);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
      var s = 0;
      for (var k = 0; k < 4; k++) s += a[r * 4 + k] * b[k * 4 + c];
      o[r * 4 + c] = s;
    }
    return o;
  }
  function mat4Inv(m) {
    var inv = new Float32Array(16), i;
    inv[0] = m[5]*m[10]*m[15]-m[5]*m[11]*m[14]-m[9]*m[6]*m[15]+m[9]*m[7]*m[14]+m[13]*m[6]*m[11]-m[13]*m[7]*m[10];
    inv[4] = -m[4]*m[10]*m[15]+m[4]*m[11]*m[14]+m[8]*m[6]*m[15]-m[8]*m[7]*m[14]-m[12]*m[6]*m[11]+m[12]*m[7]*m[10];
    inv[8] = m[4]*m[9]*m[15]-m[4]*m[11]*m[13]-m[8]*m[5]*m[15]+m[8]*m[7]*m[13]+m[12]*m[5]*m[11]-m[12]*m[7]*m[9];
    inv[12] = -m[4]*m[9]*m[14]+m[4]*m[10]*m[13]+m[8]*m[5]*m[14]-m[8]*m[6]*m[13]-m[12]*m[5]*m[10]+m[12]*m[6]*m[9];
    inv[1] = -m[1]*m[10]*m[15]+m[1]*m[11]*m[14]+m[9]*m[2]*m[15]-m[9]*m[3]*m[14]-m[13]*m[2]*m[11]+m[13]*m[3]*m[10];
    inv[5] = m[0]*m[10]*m[15]-m[0]*m[11]*m[14]-m[8]*m[2]*m[15]+m[8]*m[3]*m[14]+m[12]*m[2]*m[11]-m[12]*m[3]*m[10];
    inv[9] = -m[0]*m[9]*m[15]+m[0]*m[11]*m[13]+m[8]*m[1]*m[15]-m[8]*m[3]*m[13]-m[12]*m[1]*m[11]+m[12]*m[3]*m[9];
    inv[13] = m[0]*m[9]*m[14]-m[0]*m[10]*m[13]-m[8]*m[1]*m[14]+m[8]*m[2]*m[13]+m[12]*m[1]*m[10]-m[12]*m[2]*m[9];
    inv[2] = m[1]*m[6]*m[15]-m[1]*m[7]*m[14]-m[5]*m[2]*m[15]+m[5]*m[3]*m[14]+m[13]*m[2]*m[7]-m[13]*m[3]*m[6];
    inv[6] = -m[0]*m[6]*m[15]+m[0]*m[7]*m[14]+m[4]*m[2]*m[15]-m[4]*m[3]*m[14]-m[12]*m[2]*m[7]+m[12]*m[3]*m[6];
    inv[10] = m[0]*m[5]*m[15]-m[0]*m[7]*m[13]-m[4]*m[1]*m[15]+m[4]*m[3]*m[13]+m[12]*m[1]*m[7]-m[12]*m[3]*m[5];
    inv[14] = -m[0]*m[5]*m[14]+m[0]*m[6]*m[13]+m[4]*m[1]*m[14]-m[4]*m[2]*m[13]-m[12]*m[1]*m[6]+m[12]*m[2]*m[5];
    inv[3] = -m[1]*m[6]*m[11]+m[1]*m[7]*m[10]+m[5]*m[2]*m[11]-m[5]*m[3]*m[10]-m[9]*m[2]*m[7]+m[9]*m[3]*m[6];
    inv[7] = m[0]*m[6]*m[11]-m[0]*m[7]*m[10]-m[4]*m[2]*m[11]+m[4]*m[3]*m[10]+m[8]*m[2]*m[7]-m[8]*m[3]*m[6];
    inv[11] = -m[0]*m[5]*m[11]+m[0]*m[7]*m[9]+m[4]*m[1]*m[11]-m[4]*m[3]*m[9]-m[8]*m[1]*m[7]+m[8]*m[3]*m[5];
    inv[15] = m[0]*m[5]*m[10]-m[0]*m[6]*m[9]-m[4]*m[1]*m[10]+m[4]*m[2]*m[9]+m[8]*m[1]*m[6]-m[8]*m[2]*m[5];
    var det = m[0]*inv[0]+m[1]*inv[4]+m[2]*inv[8]+m[3]*inv[12];
    if (!det) return null;
    det = 1.0/det;
    for (i = 0; i < 16; i++) inv[i] *= det;
    return inv;
  }

  // ── shared GLSL: value noise + fbm ──
  var NOISE_GLSL = [
    'float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }',
    'float vnoise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); vec2 u = f*f*(3.0-2.0*f);',
    '  return mix(mix(hash12(i), hash12(i+vec2(1.0,0.0)), u.x), mix(hash12(i+vec2(0.0,1.0)), hash12(i+vec2(1.0,1.0)), u.x), u.y); }',
    'float fbm(vec2 p){ float v = 0.0; float a = 0.5; for(int k=0;k<4;k++){ v += a*vnoise(p); p = p*2.03 + 17.7; a *= 0.5; } return v; }',
  ].join('\n');

  // terrain color recipe shared by the ground-fill quad and geometry shader.
  // takes world xz + base tone, returns scrubland color (dry grass, dirt patches, bushes).
  var TERRAIN_GLSL = [
    'vec3 scrubColor(vec2 xz){',
    '  float macro = fbm(xz * 0.011);',                       // large dune-scale patches
    '  float mid   = fbm(xz * 0.055 + 31.0);',                // grass clumps
    '  float fine  = fbm(xz * 0.55 + 7.0);',                  // gravel grain
    '  vec3 dirt   = vec3(0.585, 0.5, 0.385);',
    '  vec3 dry    = vec3(0.615, 0.58, 0.41);',
    '  vec3 green  = vec3(0.42, 0.5, 0.3);',
    '  vec3 c = mix(dirt, dry, smoothstep(0.25, 0.75, macro));',
    '  c = mix(c, green, smoothstep(0.5, 0.82, mid) * 0.65);',
    '  c *= 0.86 + 0.28 * fine;',
    '  float bush = smoothstep(0.78, 0.92, vnoise(xz * 0.42 + 91.0)) * smoothstep(0.35, 0.6, macro);',
    '  c = mix(c, vec3(0.23, 0.28, 0.16), bush * 0.85);',     // dark scrub bushes
    '  return c;',
    '}',
  ].join('\n');

  // ── engine shader rewrites ──
  function rewriteVertex3D(src) {
    if (src.indexOf('projectionMatrix') < 0) return src;
    return src
      .replace('varying lowp vec4 outputColor;',
        'varying lowp vec4 outputColor;\nvarying vec3 vWorld;\nvarying float vDepth;')
      .replace('   outputColor = vColor;',
        '   vec4 wpos = homogenousPosition * worldMatrix;\n   vWorld = wpos.xyz;\n   vDepth = abs(transformedPosition.w);\n   outputColor = vColor;');
  }
  function rewriteFragment3D(src) {
    if (src.indexOf('textureWeight') < 0) return src;
    return [
      '#extension GL_OES_standard_derivatives : enable',
      '#ifdef GL_FRAGMENT_PRECISION_HIGH',
      'precision highp float;',
      '#else',
      'precision mediump float;',
      '#endif',
      'uniform float textureWeight;',
      'uniform sampler2D uSampler;',
      'uniform vec3 uHdCam;',
      'uniform float uHdFog;',
      'uniform float uHdLight;',
      'varying lowp vec4 outputColor;',
      'varying lowp vec2 vTextureCoord;',
      'varying vec3 vWorld;',
      'varying float vDepth;',
      NOISE_GLSL,
      TERRAIN_GLSL,
      'void main() {',
      '  vec4 base = (1.0 - textureWeight) * outputColor + textureWeight * texture2D(uSampler, vTextureCoord);',
      '  vec3 c = base.rgb;',
      '  float r = base.r, g = base.g, b = base.b;',
      '  float mono = max(max(r,g),b) - min(min(r,g),b);',
      '  bool isGround = (abs(r-g) < 0.06) && (b < g - 0.08) && g > 0.3 && g < 0.62;', // olive family
      '  bool isTrack  = (mono < 0.09) && r > 0.32 && r < 0.75;',                      // grey family
      '  bool isEdge   = (r > 0.55 && g < 0.35 && b < 0.3) || (r > 0.85 && g > 0.8 && b > 0.8);', // red/white curbs+snow
      '  float lowland = 1.0 - smoothstep(60.0, 170.0, vWorld.y);',                    // keep scrub off elevated deck
      '  if (isGround && lowland > 0.01) {',
      '    vec3 scrub = scrubColor(vWorld.xz) * (0.82 + 0.35 * (g - 0.3));',
      '    c = mix(c * (0.92 + 0.12 * fbm(vWorld.xz * 0.9)), scrub, lowland);',
      '  } else if (isTrack) {',
      '    float grain = fbm(vWorld.xz * 1.7);',
      '    float wear  = fbm(vWorld.xz * 0.13 + 5.0);',
      '    float lum = dot(c, vec3(0.299, 0.587, 0.114));',
      '    float gAmp = mix(1.0, 0.4, smoothstep(0.6, 0.78, lum));',                   // keep white walls clean
      '    c = c * mix(1.0, 0.86 + 0.16 * grain, gAmp);',
      '    c = mix(c, c * 0.78, smoothstep(0.55, 0.8, wear) * 0.5 * gAmp);',           // darker worn patches
      '  } else if (!isEdge && mono > 0.12 && g > r && g > 0.3) {',
      '    float rock = fbm(vWorld.xz * 0.35 + 3.0);',                                 // green mountains -> vegetated rock
      '    c = c * (0.8 + 0.3 * rock);',
      '  }',
      '  vec3 fdx = dFdx(vWorld), fdy = dFdy(vWorld);',
      '  vec3 N = cross(fdx, fdy);',
      '  float nl = length(N);',
      '  if (nl > 0.0001) {',
      '    N /= nl; if (N.y < 0.0) N = -N;',
      '    float sun = clamp(dot(N, normalize(vec3(0.35, 0.8, 0.45))), 0.0, 1.0);',
      '    c *= mix(1.0, 0.78 + 0.3 * sun, uHdLight);',
      '  }',
      '  vec3 fogC = vec3(0.72, 0.78, 0.88);',
      '  float fdist = distance(vWorld, uHdCam);',                                      // world-space: mode-independent
      '  float fog = smoothstep(45000.0, 95000.0, fdist) * 0.55 * uHdFog;',
      '  if (isEdge || isTrack) fog *= 0.45;',                                          // keep racing cues punchy
      '  c = mix(c, fogC, fog);',
      '  gl_FragColor = vec4(c, base.a);',
      '}',
    ].join('\n');
  }

  // ── my own programs: sky quad + ray-cast ground quad ──
  var QUAD_VS = [
    'attribute vec2 aPos;',
    'varying vec2 vUv;',
    'void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.9999, 1.0); }',
  ].join('\n');
  var SKY_FS = [
    'precision mediump float;',
    'varying vec2 vUv;',
    'uniform sampler2D uSky;',
    'void main(){ gl_FragColor = vec4(texture2D(uSky, vec2(vUv.x, 1.0 - vUv.y)).rgb, 1.0); }',
  ].join('\n');
  var GROUND_FS = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'varying vec2 vUv;',
    'uniform mat4 uInvVP;',      // inverse of (view*projection), row-vector convention
    'uniform float uGroundY;',
    'uniform vec3 uCamPos;',
    NOISE_GLSL,
    TERRAIN_GLSL,
    'vec3 unproject(vec3 ndc){',
    '  vec4 t = vec4(ndc.x, -ndc.y, ndc.z, 1.0);',           // engine flips y; t = pos*(V*P)
    '  vec4 p = t * uInvVP;',
    '  return p.xyz / p.w;',
    '}',
    'void main(){',
    '  vec2 ndc = vUv * 2.0 - 1.0;',
    '  vec3 pNear = unproject(vec3(ndc, 0.2));',
    '  vec3 pFar  = unproject(vec3(ndc, 0.8));',
    '  vec3 dir = pFar - pNear;',
    '  float t = (uGroundY - pNear.y) / (abs(dir.y) < 1e-5 ? 1e-5 : dir.y);',
    '  vec3 fogC = vec3(0.72, 0.78, 0.88);',
    '  if (t < 0.0) { gl_FragColor = vec4(fogC, 1.0); return; }',
    '  vec3 hit = pNear + dir * t;',
    '  vec3 c = scrubColor(hit.xz);',
    '  float d = distance(hit.xz, uCamPos.xz);',
    '  c = mix(c, fogC, smoothstep(14000.0, 48000.0, d) * 0.85);',
    '  gl_FragColor = vec4(c, 1.0);',
    '}',
  ].join('\n');

  function compile(gl, vsSrc, fsSrc) {
    function sh(type, src) {
      var s = gl.__origCreateShader.call(gl, type);
      gl.__origShaderSource.call(gl, s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('[hd-graphics] shader compile failed:', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }
    var v = sh(gl.VERTEX_SHADER, vsSrc), f = sh(gl.FRAGMENT_SHADER, fsSrc);
    if (!v || !f) return null;
    var p = gl.createProgram();
    gl.attachShader(p, v); gl.attachShader(p, f);
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error('[hd-graphics] link failed:', gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }

  // default sky: generated gradient + soft clouds (replaced by images/sky.jpg when it loads)
  function makeProceduralSky() {
    var cv = document.createElement('canvas');
    cv.width = 1024; cv.height = 512;
    var g = cv.getContext('2d');
    var gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, '#2f6fd0');
    gr.addColorStop(0.55, '#7cabe8');
    gr.addColorStop(0.85, '#c9d9ee');
    gr.addColorStop(1, '#e8eef5');
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    for (var i = 0; i < 90; i++) {
      var y = 90 + Math.pow(Math.random(), 1.6) * 360;
      var x = Math.random() * 1024;
      var rw = 40 + Math.random() * 130, rh = rw * (0.18 + Math.random() * 0.14);
      var a = 0.05 + Math.random() * 0.1;
      var rg = g.createRadialGradient(x, y, 0, x, y, rw);
      rg.addColorStop(0, 'rgba(255,255,255,' + a.toFixed(3) + ')');
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = rg;
      g.save(); g.translate(x, y); g.scale(1, rh / rw); g.beginPath();
      g.arc(0, 0, rw, 0, Math.PI * 2); g.fill(); g.restore();
    }
    return cv;
  }

  function setupOverlays(gl) {
    var st = gl.__hd = {
      quad: gl.createBuffer(),
      skyProg: compile(gl, QUAD_VS, SKY_FS),
      groundProg: compile(gl, QUAD_VS, GROUND_FS),
      skyTex: gl.createTexture(),
      view: null, proj: null,
      groundY: 0,
      enabled: true,
    };
    if (!st.skyProg || !st.groundProg) { st.enabled = false; return; }
    gl.bindBuffer(gl.ARRAY_BUFFER, st.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    st.skyU = gl.getUniformLocation(st.skyProg, 'uSky');
    st.gInvVP = gl.getUniformLocation(st.groundProg, 'uInvVP');
    st.gY = gl.getUniformLocation(st.groundProg, 'uGroundY');
    st.gCam = gl.getUniformLocation(st.groundProg, 'uCamPos');
    // sky texture: procedural now, photo when available
    function upload(srcCanvasOrImg) {
      gl.bindTexture(gl.TEXTURE_2D, st.skyTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, srcCanvasOrImg);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
    upload(makeProceduralSky());
    var img = new Image();
    img.onload = function () { upload(img); };
    img.src = 'images/sky.jpg?v=hd1';
  }

  function drawQuad(gl, prog, bindUniforms) {
    var st = gl.__hd;
    // save state we touch
    var prevProg = gl.getParameter(gl.CURRENT_PROGRAM);
    var prevBuf = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    var prevDepthTest = gl.isEnabled(gl.DEPTH_TEST);
    var prevDepthMask = gl.getParameter(gl.DEPTH_WRITEMASK);
    var prevBlend = gl.isEnabled(gl.BLEND);
    var prevCull = gl.isEnabled(gl.CULL_FACE);
    var prevTex = gl.getParameter(gl.TEXTURE_BINDING_2D);
    var prevActive = gl.getParameter(gl.ACTIVE_TEXTURE);
    var attr0 = gl.getVertexAttrib(0, gl.VERTEX_ATTRIB_ARRAY_ENABLED);
    var attr0Buf = gl.getVertexAttrib(0, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
    var attr0Size = gl.getVertexAttrib(0, gl.VERTEX_ATTRIB_ARRAY_SIZE);
    var attr0Type = gl.getVertexAttrib(0, gl.VERTEX_ATTRIB_ARRAY_TYPE);
    var attr0Norm = gl.getVertexAttrib(0, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
    var attr0Stride = gl.getVertexAttrib(0, gl.VERTEX_ATTRIB_ARRAY_STRIDE);
    var attr0Off = gl.getVertexAttribOffset(0, gl.VERTEX_ATTRIB_ARRAY_POINTER);

    gl.useProgram(prog);
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.disable(gl.BLEND);
    gl.disable(gl.CULL_FACE);
    gl.bindBuffer(gl.ARRAY_BUFFER, st.quad);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    bindUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // restore
    gl.useProgram(prevProg);
    gl.bindBuffer(gl.ARRAY_BUFFER, attr0Buf);
    if (attr0Buf) gl.vertexAttribPointer(0, attr0Size, attr0Type, attr0Norm, attr0Stride, attr0Off);
    gl.bindBuffer(gl.ARRAY_BUFFER, prevBuf);
    if (!attr0) gl.disableVertexAttribArray(0);
    if (prevDepthTest) gl.enable(gl.DEPTH_TEST);
    gl.depthMask(prevDepthMask);
    if (prevBlend) gl.enable(gl.BLEND);
    if (prevCull) gl.enable(gl.CULL_FACE);
    gl.activeTexture(prevActive);
    gl.bindTexture(gl.TEXTURE_2D, prevTex);
  }

  function drawSky(gl) {
    var st = gl.__hd;
    drawQuad(gl, st.skyProg, function () {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, st.skyTex);
      gl.uniform1i(st.skyU, 0);
    });
  }
  function drawGround(gl) {
    var st = gl.__hd;
    if (!st.view || !st.proj) return false;
    var vp = mat4Mul(st.view, st.proj);
    var inv = mat4Inv(vp);
    if (!inv) return false;
    var invView = mat4Inv(st.view);
    var cam = invView ? [invView[12], invView[13], invView[14]] : [0, 0, 0];
    drawQuad(gl, st.groundProg, function () {
      gl.uniformMatrix4fv(st.gInvVP, false, inv);
      gl.uniform1f(st.gY, st.groundY);
      gl.uniform3f(st.gCam, cam[0], cam[1], cam[2]);
    });
    return true;
  }

  // ── context wrapping ──
  function wrap(gl) {
    gl.__origCreateShader = gl.createShader;
    gl.__origShaderSource = gl.shaderSource;
    var origShaderSource = gl.shaderSource.bind(gl);
    gl.shaderSource = function (sh, src) {
      try {
        if (src.indexOf('projectionMatrix') >= 0) src = rewriteVertex3D(src);
        else if (src.indexOf('textureWeight') >= 0) src = rewriteFragment3D(src);
      } catch (e) { console.error('[hd-graphics] rewrite failed', e); }
      return origShaderSource(sh, src);
    };

    // capture engine matrix uploads by uniform name
    var locNames = (typeof WeakMap !== 'undefined') ? new WeakMap() : null;
    var origGetLoc = gl.getUniformLocation.bind(gl);
    gl.getUniformLocation = function (p, name) {
      var loc = origGetLoc(p, name);
      if (loc && locNames) locNames.set(loc, name);
      return loc;
    };
    var currentProgram = null;
    var camLocs = (typeof WeakMap !== 'undefined') ? new WeakMap() : null;
    var origUseProgram = gl.useProgram.bind(gl);
    gl.useProgram = function (p) { currentProgram = p; return origUseProgram(p); };
    var origUM4 = gl.uniformMatrix4fv.bind(gl);
    gl.uniformMatrix4fv = function (loc, transpose, value) {
      var r = origUM4(loc, transpose, value);
      if (loc && locNames && gl.__hd) {
        var n = locNames.get(loc);
        if (n === 'viewMatrix') {
          gl.__hd.view = Array.from(value);
          // feed the camera position to our injected fog uniform on the engine's program
          if (currentProgram && camLocs) {
            var cl = camLocs.get(currentProgram);
            if (cl === undefined) {
              cl = {
                cam: origGetLoc(currentProgram, 'uHdCam'),
                fog: origGetLoc(currentProgram, 'uHdFog'),
                light: origGetLoc(currentProgram, 'uHdLight'),
              };
              camLocs.set(currentProgram, cl);
            }
            if (cl.cam) {
              var iv = mat4Inv(gl.__hd.view);
              if (iv) gl.uniform3f(cl.cam, iv[12], iv[13], iv[14]);
            }
            if (cl.fog) gl.uniform1f(cl.fog, gl.__hd.fogMul != null ? gl.__hd.fogMul : 1.0);
            if (cl.light) gl.uniform1f(cl.light, gl.__hd.lightMul != null ? gl.__hd.lightMul : 1.0);
          }
        } else if (n === 'projectionMatrix') gl.__hd.proj = Array.from(value);
      }
      return r;
    };

    var pendingFill = null; // 'sky' | 'ground' | null
    var origClearColor = gl.clearColor.bind(gl);
    gl.clearColor = function (r, g, b, a) {
      var key = Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255);
      pendingFill = (key === SKY_KEY) ? 'sky' : (key === GROUND_KEY) ? 'ground' : null;
      return origClearColor(r, g, b, a);
    };
    var origClear = gl.clear.bind(gl);
    gl.clear = function (mask) {
      var st = gl.__hd;
      if (!st || !st.enabled || !pendingFill || !(mask & gl.COLOR_BUFFER_BIT)) return origClear(mask);
      var fill = pendingFill;
      var rest = mask & ~gl.COLOR_BUFFER_BIT;
      if (fill === 'sky') {
        if (rest) origClear(rest);
        drawSky(gl);
        return;
      }
      // ground
      if (rest) origClear(rest);
      var drew = false;
      try { drew = drawGround(gl); } catch (e) { drew = false; }
      if (!drew) return origClear(gl.COLOR_BUFFER_BIT); // fall back to the engine fill
    };

    setupOverlays(gl);
    window.__hdGraphics = { gl: gl, state: gl.__hd };
  }

  var origGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    if (/^webgl$|^webgl2$|^experimental-webgl$/.test(type) && this.id === 'canvas') {
      if (attrs) attrs.antialias = true; else attrs = { antialias: true };
      var gl = origGetContext.call(this, type, attrs);
      if (gl && !gl.__hdWrapped) { gl.__hdWrapped = true; try { wrap(gl); } catch (e) { console.error('[hd-graphics] wrap failed', e); } }
      return gl;
    }
    return origGetContext.call(this, type, attrs);
  };
})();
