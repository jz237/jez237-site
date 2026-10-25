// Particle shifting: keeps the particles evenly spread (after Lind et al. 2012).
//
// FLIP particles only follow the grid's flow, and the grid (2x2x2 particles per cell) cannot
// see how they are arranged inside a cell: once a splash has scrambled them they stay
// scrambled, and the smoothed density they make, which is the water surface, keeps their
// irregularity. The water then never settles mirror-flat. Here each particle moves a little
// down the gradient of the smoothed density, from crowded to sparse. Near the free surface
// only the part along the surface is kept, so the water neither spreads into the air nor
// swells; there it moves water from bumps into dips, as surface tension does on scales the
// grid cannot resolve.
// Close to the glass and the sand, motion towards or away from them is removed too: the
// mirrored particles that fill the density in at the walls are not exact there (a mirrored
// shell on a curved wall is a touch sparser), and shifting along that bias would slowly pack
// particles against the walls.
// The water's mean position (where a fish in trouble heads for) is gathered as they are shifted,
// from where they go: a workgroup reduction of their positions, then one fixed-point atomic add
// per workgroup. (On the frames between, without the shift: centroid.)

// (Three floats a particle: FluidSim's PARTICLE_FLOATS.)
@group(0) @binding(1) var<storage, read_write> pos: array<f32>;
@group(0) @binding(2) var<storage, read_write> centroidAcc: array<atomic<i32>>;
@group(0) @binding(3) var densTex: texture_3d<f32>;
@group(0) @binding(4) var densSamp: sampler;
@group(0) @binding(5) var sandTex: texture_2d<f32>;
@group(0) @binding(6) var sandSamp: sampler;

// (Low enough that the sums of a fine grid's millions of particles stay within an i32.)
const CENTROID_FP: f32 = 256.0;
var<workgroup> partial: array<vec4f, 256>;

// The smoothed density, hardware-filtered (half precision is ample: the dead band below is
// coarser than its rounding).
fn sampleField(x: vec3f) -> f32 {
  let uvw = (x - P.origin) / (P.renderVoxel * f32(P.renderN));
  return textureSampleLevel(densTex, densSamp, uvw, 0.0).r;
}

fn fieldGrad(x: vec3f, e: f32) -> vec3f {
  return vec3f(
    sampleField(x + vec3f(e, 0.0, 0.0)) - sampleField(x - vec3f(e, 0.0, 0.0)),
    sampleField(x + vec3f(0.0, e, 0.0)) - sampleField(x - vec3f(0.0, e, 0.0)),
    sampleField(x + vec3f(0.0, 0.0, e)) - sampleField(x - vec3f(0.0, 0.0, e))) / (2.0 * e);
}

@compute @workgroup_size(256)
fn shift(@builtin(global_invocation_id) gid: vec3u, @builtin(num_workgroups) nwg: vec3u,
         @builtin(local_invocation_index) li: u32) {
  let i = particleId(gid, nwg);
  var v = vec4f(0.0);
  if (i < P.particleCount) {
    let s = shifted(vec3f(pos[3u * i], pos[3u * i + 1u], pos[3u * i + 2u]));
    if (s.w > 0.0) {
      pos[3u * i] = s.x;
      pos[3u * i + 1u] = s.y;
      pos[3u * i + 2u] = s.z;
    }
    v = vec4f(s.xyz, 1.0);
  }
  addToCentroid(v, li);
}

// The water's mean position alone.
@compute @workgroup_size(256)
fn centroid(@builtin(global_invocation_id) gid: vec3u, @builtin(num_workgroups) nwg: vec3u,
            @builtin(local_invocation_index) li: u32) {
  let i = particleId(gid, nwg);
  var v = vec4f(0.0);
  if (i < P.particleCount) { v = vec4f(pos[3u * i], pos[3u * i + 1u], pos[3u * i + 2u], 1.0); }
  addToCentroid(v, li);
}

fn addToCentroid(v: vec4f, li: u32) {
  partial[li] = v;
  workgroupBarrier();
  for (var s = 128u; s > 0u; s = s >> 1u) {
    if (li < s) { partial[li] += partial[li + s]; }
    workgroupBarrier();
  }
  if (li == 0u) {
    let t = partial[0];
    atomicAdd(&centroidAcc[0], i32(round(t.x * CENTROID_FP)));
    atomicAdd(&centroidAcc[1], i32(round(t.y * CENTROID_FP)));
    atomicAdd(&centroidAcc[2], i32(round(t.z * CENTROID_FP)));
    atomicAdd(&centroidAcc[3], i32(t.w));
  }
}

// Where the particle at x goes (w: 1 if it moves at all).
fn shifted(x: vec3f) -> vec4f {
  let rho = sampleField(x);
  if (rho < P.iso) { return vec4f(x, 0.0); } // spray and thin sheets: leave them be
  var dx = -P.shiftK * fieldGrad(x, P.renderVoxel);
  // Near the free surface, only along it. "Near" is wherever the surface's own fall-off still
  // shows in the density (a few voxels deep): a particle pushed up into the surface layer from
  // there could not move back down, and the water would slowly swell. The wider stencil sees
  // that fall-off but not the voxel-scale crowding being evened out.
  let gs = fieldGrad(x, 3.0 * P.renderVoxel);
  let gl = length(gs);
  let surf = smoothstep(0.003, 0.008, gl * P.renderVoxel);
  if (surf > 0.0) {
    let n = gs / gl;
    dx -= surf * dot(dx, n) * n;
  }
  let band = 4.0 * P.renderVoxel;
  let r = length(x);
  if (P.radius - P.particleRadius - r < band && r > 1e-4) {
    let nw = x / r;
    dx -= dot(dx, nw) * nw;
  }
  if (x.y - sandTop(x) - P.particleRadius < band) {
    let ns = sandNormal(x);
    dx -= dot(dx, ns) * ns;
  }
  // A dead band: gradients this small are already invisible in the surface, and leaving them
  // be keeps an evenly spread body of water perfectly still.
  let l = length(dx);
  let dead = P.shiftK * 0.0005 / P.renderVoxel;
  if (l <= dead) { return vec4f(x, 0.0); }
  dx *= (l - dead) / l;
  let maxStep = 0.05 * P.renderVoxel;
  if (l - dead > maxStep) { dx *= maxStep / (l - dead); }
  return vec4f(x + dx, 1.0);
}
