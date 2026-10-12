"""Evaluate a species' signed-distance sculpture on a dense grid (system Python, all cores).

    python3 grid.py trex [--voxel 0.016] [--out ~/.cache/jurassic-terrarium/work/trex]

Writes grid.npy (float16 distances, metres), grid.json (origin, voxel, shape) and skeleton.json.
"""
import sys, os, json, time, importlib, argparse
from concurrent.futures import ProcessPoolExecutor
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [HERE, os.path.join(HERE, 'species')]
import sdf  # noqa: E402

_body = None


def _init(name):
    global _body
    _body = importlib.import_module(name).build()


def _slab(args):
    lo, voxel, shape, z0, z1, band = args
    return z0, sdf.eval_slab(_body.field, np.array(lo), voxel, shape, z0, z1, band)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('species')
    ap.add_argument('--voxel', type=float, default=None)
    ap.add_argument('--out', default=None)
    ap.add_argument('--jobs', type=int, default=min(28, os.cpu_count() or 4))
    a = ap.parse_args()
    out = a.out or os.path.expanduser(f'~/.cache/jurassic-terrarium/work/{a.species}')
    os.makedirs(out, exist_ok=True)
    body = importlib.import_module(a.species).build()
    voxel = a.voxel or body.meta.get('voxel', 0.02)
    lo, hi = body.field.bounds(pad=4 * voxel + 0.05)
    shape = sdf.grid_axes(lo, hi, voxel)
    band = 4 * voxel
    print(f'{a.species}: grid {shape} = {np.prod(shape) / 1e6:.1f} M voxels at {voxel * 1000:.0f} mm', flush=True)
    t0 = time.time()
    nz = shape[2]
    step = max(1, nz // (a.jobs * 3))
    tasks = [(lo.tolist(), voxel, shape, z, min(nz, z + step), band) for z in range(0, nz, step)]
    grid = np.empty(shape, dtype=np.float16)
    with ProcessPoolExecutor(a.jobs, initializer=_init, initargs=(a.species,)) as ex:
        for z0, d in ex.map(_slab, tasks):
            grid[:, :, z0:z0 + d.shape[2]] = np.clip(d, -60000, 60000).astype(np.float16)
    print(f'  evaluated in {time.time() - t0:.1f} s; inside voxels {(grid < 0).sum() / 1e6:.2f} M', flush=True)
    np.save(os.path.join(out, 'grid.npy'), grid)
    json.dump(dict(origin=lo.tolist(), voxel=voxel, shape=list(shape)), open(os.path.join(out, 'grid.json'), 'w'))
    json.dump(dict(bones=body.skel.to_json(), meta=body.meta, attachments=body.attachments),
              open(os.path.join(out, 'body.json'), 'w'), indent=1, default=float)


if __name__ == '__main__':
    main()
