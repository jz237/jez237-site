// Ambient occlusion for the Detailed graphics setting (Lab, Nov 11 2026): soft
// darkening where parts sit close together (media in a basket, a pump on a base).
// The main render is untouched. After it, opaque geometry is drawn once more, depth
// only, and one full-screen pass multiplies the picture by the
// occlusion found in that depth. An approximation from depth alone, not ray tracing.
// Any failure switches it off for the rest of the visit.
export function createAmbientOcclusion(Three, renderer) {
  const size = new Three.Vector2();
  const target = new Three.WebGLRenderTarget(1, 1, {minFilter: Three.NearestFilter, magFilter: Three.NearestFilter});
  target.depthTexture = new Three.DepthTexture(1, 1, Three.UnsignedIntType);
  const depthOnly = new Three.MeshBasicMaterial({colorWrite: false});
  const uniforms = {tDepth: {value: target.depthTexture}, projInv: {value: new Three.Matrix4()}, proj: {value: new Three.Vector2(1, 1)}, texel: {value: new Three.Vector2(1, 1)}, radius: {value: .34}, strength: {value: 1}};
  const quadScene = new Three.Scene(), quadCamera = new Three.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const material = new Three.ShaderMaterial({
    uniforms, depthTest: false, depthWrite: false, transparent: true, toneMapped: false,
    blending: Three.CustomBlending, blendEquation: Three.AddEquation, blendSrc: Three.DstColorFactor, blendDst: Three.ZeroFactor,
    blendSrcAlpha: Three.ZeroFactor, blendDstAlpha: Three.OneFactor,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader: `uniform sampler2D tDepth;uniform mat4 projInv;uniform vec2 proj,texel;uniform float radius,strength;varying vec2 vUv;
      vec3 viewPoint(vec2 uv){float d=texture2D(tDepth,uv).r;vec4 c=projInv*vec4(uv*2.-1.,d*2.-1.,1.);return c.xyz/c.w;}
      void main(){
        float d=texture2D(tDepth,vUv).r;if(d>=.99999){gl_FragColor=vec4(1.);return;}
        vec3 p=viewPoint(vUv);
        // Surface direction from neighbouring depth texels, taking the nearer neighbour on each axis so edges stay clean.
        vec3 px=viewPoint(vUv+vec2(texel.x,0.))-p,nx=p-viewPoint(vUv-vec2(texel.x,0.)),py=viewPoint(vUv+vec2(0.,texel.y))-p,ny=p-viewPoint(vUv-vec2(0.,texel.y));
        vec3 n=normalize(cross(abs(px.z)<abs(nx.z)?px:nx,abs(py.z)<abs(ny.z)?py:ny));if(n.z<0.)n=-n;
        float turn=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))))*6.2831853;
        vec2 reach=radius*proj*.5/max(-p.z,.05);float occlusion=0.;
        for(int i=0;i<12;i++){
          float fi=float(i),r=sqrt((fi+.5)/12.),a=fi*2.3999632+turn;
          vec3 v=viewPoint(vUv+vec2(cos(a),sin(a))*r*reach)-p;float dist=length(v);
          // Only neighbours that rise clearly above the surface count, so flat and gently curved faces stay clean.
          occlusion+=max(0.,dot(n,v)/max(dist,1e-4)-.22)*(1.-smoothstep(radius*.4,radius*1.5,dist));
        }
        float shade=1.-clamp(occlusion/12.*1.5*strength,0.,.5);
        gl_FragColor=vec4(vec3(shade),1.);
      }`,
  });
  const quad = new Three.Mesh(new Three.PlaneGeometry(2, 2), material); quad.frustumCulled = false; quadScene.add(quad);
  let hidden = [], age = 0;
  // Only solid, depth-writing meshes shape the occlusion: water, glass, shadow catchers, points and lines are left out.
  const solid = m => m && m.visible !== false && !m.transparent && m.depthWrite !== false && !(m.transmission > 0) && !m.isShadowMaterial;
  function survey(scene) {
    hidden = [];
    scene.traverse(o => {
      if (o.isPoints || o.isLine || o.isSprite) hidden.push(o);
      else if (o.isMesh) { const m = o.material; if (!(Array.isArray(m) ? m.every(solid) : solid(m))) hidden.push(o); }
    });
  }
  return {
    render(scene, camera) {
      renderer.getDrawingBufferSize(size);
      // Depth at the screen's own size: a smaller copy made a visible dot pattern on flat faces.
      const w = Math.max(1, Math.round(size.x)), h = Math.max(1, Math.round(size.y));
      if (target.width !== w || target.height !== h) target.setSize(w, h);
      uniforms.texel.value.set(1 / w, 1 / h);
      if (age++ % 30 === 0) survey(scene);
      const shown = hidden.map(o => o.visible), previous = renderer.getRenderTarget(), override = scene.overrideMaterial, background = scene.background,
        shadows = renderer.shadowMap.autoUpdate, autoClear = renderer.autoClear, xr = renderer.xr.enabled;
      try {
        hidden.forEach(o => { o.visible = false; });
        scene.overrideMaterial = depthOnly; scene.background = null; renderer.shadowMap.autoUpdate = false; renderer.xr.enabled = false;
        renderer.setRenderTarget(target); renderer.clear(); renderer.render(scene, camera);
      } finally {
        hidden.forEach((o, i) => { o.visible = shown[i]; });
        scene.overrideMaterial = override; scene.background = background; renderer.shadowMap.autoUpdate = shadows; renderer.xr.enabled = xr;
        renderer.setRenderTarget(previous);
      }
      uniforms.projInv.value.copy(camera.projectionMatrixInverse);
      uniforms.proj.value.set(camera.projectionMatrix.elements[0], camera.projectionMatrix.elements[5]);
      try { renderer.autoClear = false; renderer.render(quadScene, quadCamera); } finally { renderer.autoClear = autoClear; }
    },
    dispose() { target.dispose(); material.dispose(); depthOnly.dispose(); quad.geometry.dispose(); },
  };
}
