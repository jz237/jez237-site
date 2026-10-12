// Guard the water's shaders against invalid pixels.
//
// On some GPUs and drivers an edge case in a shader (a zero-length vector normalised, a half-float
// overflow, an undefined pow) yields NaN or Infinity where another GPU returns a harmless number. One such
// pixel in the HDR image is then spread by the bloom pass over the whole screen: a full-screen flash.
// The flicker was traced (by the viewer, with ?debug) to Weatherglass's water, which does not reproduce
// it on every machine. So every water material's main() is wrapped: its colour is checked and an
// invalid pixel becomes transparent black, and extreme values are capped well above any real highlight.
// Valid pixels are untouched.
const wrap = (neutral) => `
void main() {
  wgSafeMain();
  vec4 c = gl_FragColor;
  bool bad = any(isnan(c)) || any(isinf(c));
  gl_FragColor = bad ? ${neutral} : clamp(c, vec4(0.0), vec4(64.0, 64.0, 64.0, 1.0));
}
`;

export function guardMaterial(m) {
  if (!m || m.userData.wgSafe) return false;
  // multiplicative passes (the water's absorption) must fall back to "no change", others to nothing
  const WRAP = wrap(m.defines?.W_MUL ? 'vec4(1.0)' : 'vec4(0.0)');
  if (m.isShaderMaterial && typeof m.fragmentShader === 'string' && /void\s+main\s*\(\s*\)/.test(m.fragmentShader)) {
    m.fragmentShader = m.fragmentShader.replace(/void\s+main\s*\(\s*\)/, 'void wgSafeMain()') + WRAP;
  } else {
    // built-in materials: wrap the generated shader just before compile
    const prev = m.onBeforeCompile;
    m.onBeforeCompile = (sh, r) => {
      prev?.call(m, sh, r);
      sh.fragmentShader = sh.fragmentShader.replace(/void\s+main\s*\(\s*\)/, 'void wgSafeMain()') + WRAP;
    };
    const key = m.customProgramCacheKey?.bind(m);
    m.customProgramCacheKey = () => (key ? key() : '') + '-wgsafe';
  }
  m.userData.wgSafe = true;
  m.needsUpdate = true;
  return true;
}

// every material under Weatherglass's water group, plus anything reusing its shaders
export function guardWater(scene, extra = []) {
  let n = 0;
  const seen = new Set();
  const visit = (o) => {
    for (const m of [].concat(o.material || [])) {
      if (seen.has(m)) continue;
      seen.add(m);
      if (guardMaterial(m)) n++;
    }
  };
  scene.getObjectByName('water')?.traverse(visit);
  for (const o of extra) o && visit(o);
  return n;
}
