/**
 * A small, self-contained bloom pass.
 *
 * Deliberately hand-rolled rather than pulled from three's example modules:
 * the whole app is vendored, and this needs to be about 150 lines of
 * bright-pass plus separable blur, not a general-purpose effect composer.
 *
 * Restraint is the point. The bloom exists to let the sun glint come off the
 * water and the night road network breathe; if it is washing out the relief,
 * it is turned up too far.
 */

const QUAD_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const BRIGHT_FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform sampler2D uScene;
  uniform float uThreshold;
  uniform float uKnee;
  varying vec2 vUv;

  void main() {
    vec3 c = texture2D(uScene, vUv).rgb;
    float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
    // Soft knee so a bright hillside eases into the bloom instead of popping.
    float w = clamp((luma - uThreshold) / max(uKnee, 1e-4), 0.0, 1.0);
    gl_FragColor = vec4(c * w * w, 1.0);
  }
`;

const BLUR_FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform sampler2D uInput;
  uniform vec2 uDirection;   // texel-sized step
  varying vec2 vUv;

  void main() {
    // 9-tap gaussian folded into 5 bilinear samples.
    vec3 sum = texture2D(uInput, vUv).rgb * 0.227027;
    vec2 o1 = uDirection * 1.3846153846;
    vec2 o2 = uDirection * 3.2307692308;
    sum += texture2D(uInput, vUv + o1).rgb * 0.3162162162;
    sum += texture2D(uInput, vUv - o1).rgb * 0.3162162162;
    sum += texture2D(uInput, vUv + o2).rgb * 0.0702702703;
    sum += texture2D(uInput, vUv - o2).rgb * 0.0702702703;
    gl_FragColor = vec4(sum, 1.0);
  }
`;

const COMPOSITE_FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform sampler2D uScene;
  uniform sampler2D uBloom;
  uniform float uIntensity;
  uniform float uVignette;
  varying vec2 vUv;

  void main() {
    vec3 scene = texture2D(uScene, vUv).rgb;
    vec3 bloom = texture2D(uBloom, vUv).rgb;
    vec3 color = scene + bloom * uIntensity;

    // A whisper of vignette to settle the frame; never enough to read as one.
    vec2 d = vUv - 0.5;
    float vig = 1.0 - uVignette * dot(d, d) * 1.35;
    color *= clamp(vig, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function createPostFX(THREE, renderer) {
  const quadScene = new THREE.Scene();
  const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quadGeometry = new THREE.PlaneGeometry(2, 2);
  const quad = new THREE.Mesh(quadGeometry, null);
  quad.frustumCulled = false;
  quadScene.add(quad);

  const rtOptions = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    type: THREE.HalfFloatType,
    depthBuffer: true,
    stencilBuffer: false,
  };

  const sceneRT = new THREE.WebGLRenderTarget(1, 1, rtOptions);
  const brightRT = new THREE.WebGLRenderTarget(1, 1, { ...rtOptions, depthBuffer: false });
  const blurRT = new THREE.WebGLRenderTarget(1, 1, { ...rtOptions, depthBuffer: false });

  const brightMat = new THREE.ShaderMaterial({
    uniforms: {
      uScene: { value: sceneRT.texture },
      uThreshold: { value: 0.72 },
      uKnee: { value: 0.45 },
    },
    vertexShader: QUAD_VERTEX,
    fragmentShader: BRIGHT_FRAGMENT,
    depthTest: false,
    depthWrite: false,
  });

  const blurMat = new THREE.ShaderMaterial({
    uniforms: {
      uInput: { value: null },
      uDirection: { value: new THREE.Vector2() },
    },
    vertexShader: QUAD_VERTEX,
    fragmentShader: BLUR_FRAGMENT,
    depthTest: false,
    depthWrite: false,
  });

  const compositeMat = new THREE.ShaderMaterial({
    uniforms: {
      uScene: { value: sceneRT.texture },
      uBloom: { value: blurRT.texture },
      uIntensity: { value: 0.38 },
      uVignette: { value: 0.5 },
    },
    vertexShader: QUAD_VERTEX,
    fragmentShader: COMPOSITE_FRAGMENT,
    depthTest: false,
    depthWrite: false,
  });

  let width = 1;
  let height = 1;
  let bloomWidth = 1;
  let bloomHeight = 1;
  // Two Gaussian blurs convolve to another Gaussian whose variance is the
  // sum of theirs. The former 1.0 + 1.7 pass pairs are therefore represented
  // by one pair at sqrt(1^2 + 1.7^2), preserving the same soft radius while
  // removing two full bloom-buffer draws and their memory traffic.
  const combinedBlurScale = Math.hypot(1, 1.7);

  function draw(material, target) {
    quad.material = material;
    renderer.setRenderTarget(target || null);
    renderer.render(quadScene, quadCamera);
  }

  return {
    get renderTarget() {
      return sceneRT;
    },

    setSize(w, h, pixelRatio) {
      width = Math.max(1, Math.floor(w * pixelRatio));
      height = Math.max(1, Math.floor(h * pixelRatio));
      // Bloom at quarter resolution: cheap, and a wide soft glow is exactly
      // what a low-resolution blur produces anyway.
      bloomWidth = Math.max(1, Math.floor(width / 4));
      bloomHeight = Math.max(1, Math.floor(height / 4));
      sceneRT.setSize(width, height);
      brightRT.setSize(bloomWidth, bloomHeight);
      blurRT.setSize(bloomWidth, bloomHeight);
    },

    setIntensity(value) {
      compositeMat.uniforms.uIntensity.value = value;
    },

    setVignette(value) {
      compositeMat.uniforms.uVignette.value = value;
    },

    setThreshold(value) {
      brightMat.uniforms.uThreshold.value = value;
    },

    /** Run bright-pass + blur + composite over an already-rendered sceneRT. */
    composite() {
      draw(brightMat, brightRT);

      blurMat.uniforms.uInput.value = brightRT.texture;
      blurMat.uniforms.uDirection.value.set(combinedBlurScale / bloomWidth, 0);
      draw(blurMat, blurRT);

      blurMat.uniforms.uInput.value = blurRT.texture;
      blurMat.uniforms.uDirection.value.set(0, combinedBlurScale / bloomHeight);
      draw(blurMat, brightRT);

      compositeMat.uniforms.uBloom.value = brightRT.texture;
      draw(compositeMat, null);
    },

    dispose() {
      sceneRT.dispose();
      brightRT.dispose();
      blurRT.dispose();
      quadGeometry.dispose();
      brightMat.dispose();
      blurMat.dispose();
      compositeMat.dispose();
    },
  };
}
