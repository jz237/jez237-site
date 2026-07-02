/*
 * Cosmic Fluid - audio-driven WebGL fluid simulation for the Cosmic Visualizer.
 * Compact port of the site's Fluid Lab demo (games/2026-06-09/fluid): Stable
 * Fluids solver in fragment shaders (advection -> vorticity confinement ->
 * Jacobi pressure solve -> gradient subtraction) with bloom.
 *
 * Instead of pointer input, invisible orbiting emitters stir the fluid with
 * force taken from the music's bass/mid/treble bands, beats fire splat bursts,
 * and the "sliders" (swirl, fades, splat radius, bloom, mirror, display field)
 * drift to random targets over time like someone playing with the Fluid Lab
 * panel.
 *
 * Classic script; exposes window.CosmicFluid.create(canvas) -> engine|null.
 * engine: { available, step(dt, audio), render(), burst(strength), resize() }
 * audio: { bass, mid, treb, energy, hue (deg), live }
 */
(function () {
  "use strict";

  var SIM_RESOLUTION = 96;
  var DYE_RESOLUTION = 512;
  var BLOOM_RESOLUTION = 256;
  var BLOOM_ITERATIONS = 8;
  var PRESSURE_ITERATIONS = 20;

  function create(canvas) {
    var glParams = { alpha: false, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
    var gl = canvas.getContext("webgl2", glParams);
    var isWebGL2 = !!gl;
    if (!gl) gl = canvas.getContext("webgl", glParams) || canvas.getContext("experimental-webgl", glParams);
    if (!gl) return null;

    var halfFloatTexType = null;
    var supportLinearFiltering = false;
    if (isWebGL2) {
      gl.getExtension("EXT_color_buffer_float");
      gl.getExtension("EXT_color_buffer_half_float");
      halfFloatTexType = gl.HALF_FLOAT;
      supportLinearFiltering = true;
    } else {
      var halfFloat = gl.getExtension("OES_texture_half_float");
      if (halfFloat) {
        halfFloatTexType = halfFloat.HALF_FLOAT_OES;
        supportLinearFiltering = !!gl.getExtension("OES_texture_half_float_linear");
      } else if (gl.getExtension("OES_texture_float")) {
        halfFloatTexType = gl.FLOAT;
        supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
      }
    }
    if (halfFloatTexType === null) return null;

    function supportRenderTextureFormat(internalFormat, format, type) {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      var fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      var ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(texture);
      return ok;
    }

    function getSupportedFormat(internalFormat, format, type) {
      if (!supportRenderTextureFormat(internalFormat, format, type)) {
        if (isWebGL2) {
          switch (internalFormat) {
            case gl.R16F: return getSupportedFormat(gl.RG16F, gl.RG, type);
            case gl.RG16F: return getSupportedFormat(gl.RGBA16F, gl.RGBA, type);
            default: return null;
          }
        }
        return null;
      }
      return { internalFormat: internalFormat, format: format };
    }

    var formatRGBA, formatRG, formatR;
    if (isWebGL2) {
      formatRGBA = getSupportedFormat(gl.RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl.RG16F, gl.RG, halfFloatTexType);
      formatR = getSupportedFormat(gl.R16F, gl.RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = formatRGBA;
      formatR = formatRGBA;
    }
    if (!formatRGBA || !formatRG || !formatR) return null;

    var contextLost = false;
    canvas.addEventListener("webglcontextlost", function (e) {
      e.preventDefault();
      contextLost = true;
    });

    /* ---------- shaders (from Fluid Lab) ---------- */

    function compileShader(type, source, keywords) {
      var src = keywords && keywords.length
        ? keywords.map(function (k) { return "#define " + k + "\n"; }).join("") + source
        : source;
      var shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error("Shader compile error: " + gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    function Program(fragmentSource, keywords) {
      var program = gl.createProgram();
      var fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource, keywords);
      gl.attachShader(program, baseVertexShader);
      gl.attachShader(program, fragmentShader);
      gl.bindAttribLocation(program, 0, "aPosition");
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error("Program link error: " + gl.getProgramInfoLog(program));
      }
      var uniforms = {};
      var count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (var i = 0; i < count; i++) {
        var name = gl.getActiveUniform(program, i).name;
        uniforms[name] = gl.getUniformLocation(program, name);
      }
      return { program: program, uniforms: uniforms, bind: function () { gl.useProgram(program); } };
    }

    var baseVertexShader = compileShader(gl.VERTEX_SHADER, [
      "precision highp float;",
      "attribute vec2 aPosition;",
      "varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;",
      "uniform vec2 texelSize;",
      "void main () {",
      "  vUv = aPosition * 0.5 + 0.5;",
      "  vL = vUv - vec2(texelSize.x, 0.0); vR = vUv + vec2(texelSize.x, 0.0);",
      "  vT = vUv + vec2(0.0, texelSize.y); vB = vUv - vec2(0.0, texelSize.y);",
      "  gl_Position = vec4(aPosition, 0.0, 1.0);",
      "}",
    ].join("\n"));

    var copyProgram = Program(
      "precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; uniform sampler2D uTexture;" +
      "void main () { gl_FragColor = texture2D(uTexture, vUv); }");

    var clearProgram = Program(
      "precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value;" +
      "void main () { gl_FragColor = value * texture2D(uTexture, vUv); }");

    var splatProgram = Program([
      "precision highp float; precision highp sampler2D;",
      "varying vec2 vUv;",
      "uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;",
      "void main () {",
      "  vec2 p = vUv - point.xy; p.x *= aspectRatio;",
      "  vec3 splat = exp(-dot(p, p) / radius) * color;",
      "  vec3 base = texture2D(uTarget, vUv).xyz;",
      "  gl_FragColor = vec4(base + splat, 1.0);",
      "}",
    ].join("\n"));

    var advectionProgram = Program([
      "precision highp float; precision highp sampler2D;",
      "varying vec2 vUv;",
      "uniform sampler2D uVelocity; uniform sampler2D uSource;",
      "uniform vec2 texelSize; uniform vec2 dyeTexelSize; uniform float dt; uniform float dissipation;",
      "vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {",
      "  vec2 st = uv / tsize - 0.5; vec2 iuv = floor(st); vec2 fuv = fract(st);",
      "  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);",
      "  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);",
      "  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);",
      "  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);",
      "  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);",
      "}",
      "void main () {",
      "#ifdef MANUAL_FILTERING",
      "  vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;",
      "  vec4 result = bilerp(uSource, coord, dyeTexelSize);",
      "#else",
      "  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;",
      "  vec4 result = texture2D(uSource, coord);",
      "#endif",
      "  float decay = 1.0 + dissipation * dt;",
      "  gl_FragColor = result / decay;",
      "}",
    ].join("\n"), supportLinearFiltering ? null : ["MANUAL_FILTERING"]);

    var divergenceProgram = Program([
      "precision mediump float; precision mediump sampler2D;",
      "varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;",
      "uniform sampler2D uVelocity;",
      "void main () {",
      "  float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x;",
      "  float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y;",
      "  vec2 C = texture2D(uVelocity, vUv).xy;",
      "  if (vL.x < 0.0) { L = -C.x; } if (vR.x > 1.0) { R = -C.x; }",
      "  if (vT.y > 1.0) { T = -C.y; } if (vB.y < 0.0) { B = -C.y; }",
      "  float div = 0.5 * (R - L + T - B);",
      "  gl_FragColor = vec4(div, 0.0, 0.0, 1.0);",
      "}",
    ].join("\n"));

    var curlProgram = Program([
      "precision mediump float; precision mediump sampler2D;",
      "varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;",
      "uniform sampler2D uVelocity;",
      "void main () {",
      "  float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y;",
      "  float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;",
      "  float vorticity = R - L - T + B;",
      "  gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);",
      "}",
    ].join("\n"));

    var vorticityProgram = Program([
      "precision highp float; precision highp sampler2D;",
      "varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;",
      "uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;",
      "void main () {",
      "  float L = texture2D(uCurl, vL).x; float R = texture2D(uCurl, vR).x;",
      "  float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x;",
      "  float C = texture2D(uCurl, vUv).x;",
      "  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(L) - abs(R));",
      "  force /= length(force) + 0.0001;",
      "  force *= curl * C;",
      "  vec2 velocity = texture2D(uVelocity, vUv).xy;",
      "  velocity += force * dt;",
      "  velocity = min(max(velocity, -1000.0), 1000.0);",
      "  gl_FragColor = vec4(velocity, 0.0, 1.0);",
      "}",
    ].join("\n"));

    var pressureProgram = Program([
      "precision mediump float; precision mediump sampler2D;",
      "varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;",
      "uniform sampler2D uPressure; uniform sampler2D uDivergence;",
      "void main () {",
      "  float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;",
      "  float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;",
      "  float divergence = texture2D(uDivergence, vUv).x;",
      "  float pressure = (L + R + B + T - divergence) * 0.25;",
      "  gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);",
      "}",
    ].join("\n"));

    var gradientSubtractProgram = Program([
      "precision mediump float; precision mediump sampler2D;",
      "varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;",
      "uniform sampler2D uPressure; uniform sampler2D uVelocity;",
      "void main () {",
      "  float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;",
      "  float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;",
      "  vec2 velocity = texture2D(uVelocity, vUv).xy;",
      "  velocity.xy -= vec2(R - L, T - B);",
      "  gl_FragColor = vec4(velocity, 0.0, 1.0);",
      "}",
    ].join("\n"));

    var bloomPrefilterProgram = Program([
      "precision mediump float; precision mediump sampler2D;",
      "varying highp vec2 vUv; uniform sampler2D uTexture; uniform vec3 curve; uniform float threshold;",
      "void main () {",
      "  vec3 c = texture2D(uTexture, vUv).rgb;",
      "  float br = max(c.r, max(c.g, c.b));",
      "  float rq = clamp(br - curve.x, 0.0, curve.y);",
      "  rq = curve.z * rq * rq;",
      "  c *= max(rq, br - threshold) / max(br, 0.0001);",
      "  gl_FragColor = vec4(c, 0.0);",
      "}",
    ].join("\n"));

    var bloomBlurProgram = Program([
      "precision mediump float; precision mediump sampler2D;",
      "varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;",
      "uniform sampler2D uTexture;",
      "void main () {",
      "  vec4 sum = texture2D(uTexture, vL) + texture2D(uTexture, vR) + texture2D(uTexture, vT) + texture2D(uTexture, vB);",
      "  gl_FragColor = sum * 0.25;",
      "}",
    ].join("\n"));

    var bloomFinalProgram = Program([
      "precision mediump float; precision mediump sampler2D;",
      "varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;",
      "uniform sampler2D uTexture; uniform float intensity;",
      "void main () {",
      "  vec4 sum = texture2D(uTexture, vL) + texture2D(uTexture, vR) + texture2D(uTexture, vT) + texture2D(uTexture, vB);",
      "  gl_FragColor = sum * 0.25 * intensity;",
      "}",
    ].join("\n"));

    var displayProgram = Program([
      "precision highp float; precision highp sampler2D;",
      "varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;",
      "uniform sampler2D uTexture; uniform sampler2D uBloom; uniform sampler2D uVelocity; uniform sampler2D uCurl;",
      "uniform vec2 texelSize; uniform int uMode; uniform bool uShading; uniform bool uBloomEnabled;",
      "vec3 linearToGamma (vec3 color) {",
      "  color = max(color, vec3(0.0));",
      "  return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0.0));",
      "}",
      "vec3 hsv2rgb (vec3 c) {",
      "  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
      "  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
      "  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
      "}",
      "float dither () {",
      "  return (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;",
      "}",
      "void main () {",
      "  if (uMode == 1) {",
      "    vec2 v = texture2D(uVelocity, vUv).xy;",
      "    float mag = clamp(length(v) * 0.005, 0.0, 1.0);",
      "    float hue = atan(v.y, v.x) / 6.28318530718 + 0.5;",
      "    gl_FragColor = vec4(hsv2rgb(vec3(hue, 0.85, mag)) + dither(), 1.0);",
      "    return;",
      "  }",
      "  if (uMode == 3) {",
      "    float w = texture2D(uCurl, vUv).x * 0.03;",
      "    vec3 cc = w > 0.0",
      "      ? mix(vec3(0.02), vec3(0.3, 1.0, 0.4), clamp(w, 0.0, 1.0))",
      "      : mix(vec3(0.02), vec3(0.8, 0.3, 1.0), clamp(-w, 0.0, 1.0));",
      "    gl_FragColor = vec4(cc + dither(), 1.0);",
      "    return;",
      "  }",
      "  vec3 c = texture2D(uTexture, vUv).rgb;",
      "  if (uShading) {",
      "    vec3 lc = texture2D(uTexture, vL).rgb; vec3 rc = texture2D(uTexture, vR).rgb;",
      "    vec3 tc = texture2D(uTexture, vT).rgb; vec3 bc = texture2D(uTexture, vB).rgb;",
      "    float dx = length(rc) - length(lc);",
      "    float dy = length(tc) - length(bc);",
      "    vec3 n = normalize(vec3(dx, dy, length(texelSize)));",
      "    float diffuse = clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);",
      "    c *= diffuse;",
      "  }",
      "  if (uBloomEnabled) {",
      "    vec3 bloomc = texture2D(uBloom, vUv).rgb;",
      "    c += linearToGamma(bloomc);",
      "  }",
      "  c += dither();",
      "  gl_FragColor = vec4(c, 1.0);",
      "}",
    ].join("\n"));

    /* ---------- fullscreen quad ---------- */

    (function initQuad() {
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
      var elemBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
    })();

    function blit(target) {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    /* ---------- framebuffers ---------- */

    function createFBO(w, h, internalFormat, format, type, filter) {
      var texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      var fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        texture: texture, fbo: fbo, width: w, height: h,
        texelSizeX: 1.0 / w, texelSizeY: 1.0 / h,
        attach: function (id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
        dispose: function () {
          gl.deleteTexture(texture);
          gl.deleteFramebuffer(fbo);
        },
      };
    }

    function createDoubleFBO(w, h, internalFormat, format, type, filter) {
      var fbo1 = createFBO(w, h, internalFormat, format, type, filter);
      var fbo2 = createFBO(w, h, internalFormat, format, type, filter);
      return {
        width: w, height: h,
        texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY,
        get read() { return fbo1; },
        set read(v) { fbo1 = v; },
        get write() { return fbo2; },
        set write(v) { fbo2 = v; },
        swap: function () { var t = fbo1; fbo1 = fbo2; fbo2 = t; },
        dispose: function () { fbo1.dispose(); fbo2.dispose(); },
      };
    }

    function resizeFBO(target, w, h, internalFormat, format, type, filter) {
      var newFBO = createFBO(w, h, internalFormat, format, type, filter);
      copyProgram.bind();
      gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO);
      target.dispose();
      return newFBO;
    }

    function resizeDoubleFBO(target, w, h, internalFormat, format, type, filter) {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, filter);
      target.write.dispose();
      target.write = createFBO(w, h, internalFormat, format, type, filter);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1.0 / w;
      target.texelSizeY = 1.0 / h;
      return target;
    }

    var maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

    function getResolution(resolution) {
      var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
      var min = Math.round(resolution);
      var max = Math.round(resolution * aspectRatio);
      if (max > maxTextureSize) {
        min = Math.max(2, Math.floor(min * maxTextureSize / max));
        max = maxTextureSize;
      }
      if (gl.drawingBufferWidth > gl.drawingBufferHeight) return { width: max, height: min };
      return { width: min, height: max };
    }

    var dye = null, velocity = null, divergence = null, curl = null, pressure = null;
    var bloom = null, bloomFramebuffers = [];

    function initFramebuffers() {
      var simRes = getResolution(SIM_RESOLUTION);
      var dyeRes = getResolution(DYE_RESOLUTION);
      var texType = halfFloatTexType;
      var filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      gl.disable(gl.BLEND);
      dye = dye == null
        ? createDoubleFBO(dyeRes.width, dyeRes.height, formatRGBA.internalFormat, formatRGBA.format, texType, filtering)
        : resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, formatRGBA.internalFormat, formatRGBA.format, texType, filtering);
      velocity = velocity == null
        ? createDoubleFBO(simRes.width, simRes.height, formatRG.internalFormat, formatRG.format, texType, filtering)
        : resizeDoubleFBO(velocity, simRes.width, simRes.height, formatRG.internalFormat, formatRG.format, texType, filtering);
      var simResChanged = !divergence || divergence.width !== simRes.width || divergence.height !== simRes.height;
      if (simResChanged) {
        if (divergence) divergence.dispose();
        if (curl) curl.dispose();
        if (pressure) pressure.dispose();
        divergence = createFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, texType, gl.NEAREST);
        curl = createFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, texType, gl.NEAREST);
        pressure = createDoubleFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, texType, gl.NEAREST);
      }
      var bloomRes = getResolution(BLOOM_RESOLUTION);
      if (!bloom || bloom.width !== bloomRes.width || bloom.height !== bloomRes.height) {
        if (bloom) bloom.dispose();
        bloom = createFBO(bloomRes.width, bloomRes.height, formatRGBA.internalFormat, formatRGBA.format, texType, filtering);
        bloomFramebuffers.forEach(function (f) { f.dispose(); });
        bloomFramebuffers.length = 0;
        for (var i = 0; i < BLOOM_ITERATIONS; i++) {
          var bw = bloomRes.width >> (i + 1);
          var bh = bloomRes.height >> (i + 1);
          if (bw < 2 || bh < 2) break;
          bloomFramebuffers.push(createFBO(bw, bh, formatRGBA.internalFormat, formatRGBA.format, texType, filtering));
        }
      }
    }

    /* ---------- the randomly-drifting "sliders" ---------- */

    var config = {
      CURL: 30,
      DENSITY_DISSIPATION: 0.9,
      VELOCITY_DISSIPATION: 0.2,
      PRESSURE: 0.8,
      SPLAT_RADIUS: 0.25,
      SPLAT_FORCE: 6000,
      COLOR_SPEED: 14,
      BLOOM_INTENSITY: 0.9,
      BLOOM_THRESHOLD: 0.5,
      MIRROR: "off",       // off | 2-way | 4-way
      DISPLAY_MODE: 0,     // 0 dye | 1 velocity | 3 curl
      SHADING: true,
    };

    var DIAL_RANGES = {
      CURL: [4, 50],
      DENSITY_DISSIPATION: [0.2, 2.2],
      VELOCITY_DISSIPATION: [0.05, 1.2],
      SPLAT_RADIUS: [0.12, 0.55],
      SPLAT_FORCE: [3500, 9000],
      COLOR_SPEED: [5, 45],
      BLOOM_INTENSITY: [0.45, 1.4],
    };
    var dialKeys = Object.keys(DIAL_RANGES);
    var glides = {};          // key -> { target, rate }
    var driftTimer = 3;       // first drift kicks in quickly
    var flipTimer = 16;

    function driftDials(dt, energy) {
      driftTimer -= dt * (1 + energy * 1.5);
      if (driftTimer <= 0) {
        driftTimer = 6 + Math.random() * 8;
        var count = 1 + Math.floor(Math.random() * 2);
        for (var i = 0; i < count; i++) {
          var key = dialKeys[Math.floor(Math.random() * dialKeys.length)];
          var range = DIAL_RANGES[key];
          glides[key] = {
            target: range[0] + Math.random() * (range[1] - range[0]),
            rate: 1 / (2 + Math.random() * 3),
          };
        }
      }
      for (var k in glides) {
        var g = glides[k];
        config[k] += (g.target - config[k]) * Math.min(1, g.rate * dt * 3);
        if (Math.abs(g.target - config[k]) < (DIAL_RANGES[k][1] - DIAL_RANGES[k][0]) * 0.01) delete glides[k];
      }
      flipTimer -= dt;
      if (flipTimer <= 0) {
        flipTimer = 14 + Math.random() * 16;
        var roll = Math.random();
        if (roll < 0.45) {
          var mirrors = ["off", "off", "2-way", "4-way"];
          config.MIRROR = mirrors[Math.floor(Math.random() * mirrors.length)];
        } else if (roll < 0.7) {
          // brief trips into the velocity/vorticity field views, mostly dye
          var modes = [0, 0, 0, 0, 1, 3];
          config.DISPLAY_MODE = modes[Math.floor(Math.random() * modes.length)];
        } else {
          config.SHADING = Math.random() < 0.75;
        }
      }
    }

    /* ---------- splats ---------- */

    function correctRadius(radius) {
      var aspectRatio = canvas.width / Math.max(1, canvas.height);
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }

    function splat(x, y, dx, dy, color) {
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / Math.max(1, canvas.height));
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
      blit(velocity.write);
      velocity.swap();
      gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    function splatWithMirror(x, y, dx, dy, color) {
      gl.disable(gl.BLEND);
      splat(x, y, dx, dy, color);
      if (config.MIRROR === "2-way" || config.MIRROR === "4-way") {
        splat(1.0 - x, y, -dx, dy, color);
      }
      if (config.MIRROR === "4-way") {
        splat(x, 1.0 - y, dx, -dy, color);
        splat(1.0 - x, 1.0 - y, -dx, -dy, color);
      }
    }

    function hsvColor(h, scale) {
      h = ((h % 1) + 1) % 1;
      var i = Math.floor(h * 6);
      var f = h * 6 - i;
      var q = 1 - f;
      var r, g, b;
      switch (i % 6) {
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        default: r = 1; g = 0; b = q; break;
      }
      return { r: r * scale, g: g * scale, b: b * scale };
    }

    /* ---------- audio-driven emitters ---------- */

    var emitters = [
      { ang: Math.random() * 6.28, dir: 1, band: "bass", orbit: 0.26, wobble: Math.random() * 6.28, hueOff: 0 },
      { ang: Math.random() * 6.28, dir: -1, band: "mid", orbit: 0.34, wobble: Math.random() * 6.28, hueOff: 0.33 },
      { ang: Math.random() * 6.28, dir: 1, band: "treb", orbit: 0.4, wobble: Math.random() * 6.28, hueOff: 0.62 },
    ];
    var time = 0;
    var idleSplatTimer = 1.5;
    var hueDrift = Math.random();

    function driveEmitters(dt, audio) {
      hueDrift = (hueDrift + dt * config.COLOR_SPEED * 0.01) % 1;
      var baseHue = (audio.hue || 0) / 360 + hueDrift;
      for (var i = 0; i < emitters.length; i++) {
        var e = emitters[i];
        var level = audio[e.band] || 0;
        e.wobble += dt * (0.3 + i * 0.17);
        e.ang += dt * e.dir * (0.35 + level * 3.2 + (audio.energy || 0) * 1.2);
        var r = e.orbit + Math.sin(e.wobble) * 0.11;
        var x = 0.5 + Math.cos(e.ang) * r;
        var y = 0.5 + Math.sin(e.ang) * r * 0.82;
        if (level < 0.05) continue;
        // push tangentially, like a finger circling through the dye
        var speed = config.SPLAT_FORCE * level * 0.16;
        var dx = -Math.sin(e.ang) * e.dir * speed;
        var dy = Math.cos(e.ang) * e.dir * speed * 0.82;
        var color = hsvColor(baseHue + e.hueOff, 0.11 + level * 0.28);
        splatWithMirror(x, y, dx, dy, color);
      }
      if (!audio.live) {
        // ambient puffs so the idle screen keeps swirling gently
        idleSplatTimer -= dt;
        if (idleSplatTimer <= 0) {
          idleSplatTimer = 2.5 + Math.random() * 3;
          burst(0.12);
        }
      }
    }

    function burst(strength) {
      if (!velocity) return;
      var count = 3 + Math.floor(strength * 6);
      for (var i = 0; i < count; i++) {
        var color = hsvColor(Math.random(), 1.2 + strength);
        var x = Math.random();
        var y = Math.random();
        var dx = (300 + strength * 700) * (Math.random() - 0.5) * 2;
        var dy = (300 + strength * 700) * (Math.random() - 0.5) * 2;
        splatWithMirror(x, y, dx, dy, color);
      }
    }

    /* ---------- sim step + render (from Fluid Lab) ---------- */

    function simStep(dt) {
      gl.disable(gl.BLEND);

      curlProgram.bind();
      gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vorticityProgram.bind();
      gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProgram.bind();
      gl.uniform2f(clearProgram.uniforms.texelSize, pressure.texelSizeX, pressure.texelSizeY);
      gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (var i = 0; i < PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradientSubtractProgram.bind();
      gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!supportLinearFiltering) {
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!supportLinearFiltering) {
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      }
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function applyBloom(source, destination) {
      if (bloomFramebuffers.length < 2) return;
      gl.disable(gl.BLEND);
      var knee = config.BLOOM_THRESHOLD * 0.7 + 0.0001;
      bloomPrefilterProgram.bind();
      gl.uniform3f(bloomPrefilterProgram.uniforms.curve, config.BLOOM_THRESHOLD - knee, knee * 2, 0.25 / knee);
      gl.uniform1f(bloomPrefilterProgram.uniforms.threshold, config.BLOOM_THRESHOLD);
      gl.uniform1i(bloomPrefilterProgram.uniforms.uTexture, source.attach(0));
      var last = destination;
      blit(last);

      bloomBlurProgram.bind();
      for (var i = 0; i < bloomFramebuffers.length; i++) {
        var dest = bloomFramebuffers[i];
        gl.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
        gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
        blit(dest);
        last = dest;
      }

      gl.blendFunc(gl.ONE, gl.ONE);
      gl.enable(gl.BLEND);
      for (var j = bloomFramebuffers.length - 2; j >= 0; j--) {
        var baseTex = bloomFramebuffers[j];
        gl.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
        gl.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0));
        blit(baseTex);
        last = baseTex;
      }
      gl.disable(gl.BLEND);

      bloomFinalProgram.bind();
      gl.uniform2f(bloomFinalProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
      gl.uniform1i(bloomFinalProgram.uniforms.uTexture, last.attach(0));
      gl.uniform1f(bloomFinalProgram.uniforms.intensity, config.BLOOM_INTENSITY);
      blit(destination);
    }

    function render() {
      if (contextLost || !dye) return;
      if (config.DISPLAY_MODE === 0) applyBloom(dye.read, bloom);
      gl.disable(gl.BLEND);
      displayProgram.bind();
      gl.uniform2f(displayProgram.uniforms.texelSize, dye.texelSizeX, dye.texelSizeY);
      gl.uniform1i(displayProgram.uniforms.uTexture, dye.read.attach(0));
      gl.uniform1i(displayProgram.uniforms.uBloom, bloom.attach(1));
      gl.uniform1i(displayProgram.uniforms.uVelocity, velocity.read.attach(2));
      gl.uniform1i(displayProgram.uniforms.uCurl, curl.attach(3));
      gl.uniform1i(displayProgram.uniforms.uMode, config.DISPLAY_MODE);
      gl.uniform1i(displayProgram.uniforms.uShading, config.SHADING ? 1 : 0);
      gl.uniform1i(displayProgram.uniforms.uBloomEnabled, config.DISPLAY_MODE === 0 ? 1 : 0);
      blit(null);
    }

    /* ---------- sizing ---------- */

    var resizeSettleAt = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.floor(canvas.clientWidth * dpr);
      var h = Math.floor(canvas.clientHeight * dpr);
      if (w < 4 || h < 4) return false;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        // settle before rebuilding the FBO chain (live drags resize every frame)
        resizeSettleAt = time + 0.25;
      }
      if (dye == null || (resizeSettleAt !== 0 && time >= resizeSettleAt)) {
        resizeSettleAt = 0;
        initFramebuffers();
      }
      return dye != null;
    }

    function step(dt, audio) {
      if (contextLost) return;
      dt = Math.min(Math.max(dt || 1 / 60, 0.001), 1 / 30);
      time += dt;
      if (!resize()) return;
      driftDials(dt, audio.energy || 0);
      driveEmitters(dt, audio);
      simStep(dt);
    }

    return {
      available: true,
      step: step,
      render: render,
      burst: burst,
      resize: resize,
    };
  }

  window.CosmicFluid = {
    create: function (canvas) {
      try {
        return create(canvas);
      } catch (error) {
        console.warn("CosmicFluid unavailable:", error);
        return null;
      }
    },
  };
})();
