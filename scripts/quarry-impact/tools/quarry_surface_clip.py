"""Conform an additive authored surface to the underlying terrain triangles.

Independent of Blender. New ground triangles are split at every intersecting
base-grid edge/diagonal, so interpolation cannot cut through a coarse ridge.
The original authored deposit thickness and masks interpolate on their own mesh.
"""
import math


def conform_ground(positions, masks, uv, indices, sections, terrain, minimum_lift=.012):
    base = terrain['positions']
    columns = terrain['columns']
    rows = terrain['rows']
    step = terrain['step']

    def point(index):
        return tuple(base[index * 3:index * 3 + 3])

    def barycentric(x, z, a, b, c):
        det = (b[2] - c[2]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[2] - c[2])
        u = ((b[2] - c[2]) * (x - c[0]) + (c[0] - b[0]) * (z - c[2])) / det
        v = ((c[2] - a[2]) * (x - c[0]) + (a[0] - c[0]) * (z - c[2])) / det
        return u, v, 1 - u - v

    def base_triangles(ix, iz):
        a = iz * columns + ix
        b = a + columns
        return ((point(a), point(b), point(a + 1)),
                (point(a + 1), point(b), point(b + 1)))

    def base_height(x, z):
        ix = max(0, min(columns - 2, int(math.floor((x - terrain['minX']) / step))))
        iz = max(0, min(rows - 2, int(math.floor((z - terrain['minZ']) / step))))
        candidates = base_triangles(ix, iz)
        for triangle in candidates:
            weights = barycentric(x, z, *triangle)
            if min(weights) >= -1e-5:
                return sum(w * p[1] for w, p in zip(weights, triangle))
        raise ValueError(f'No terrain triangle at {x}, {z}')

    deposits = []
    seated_positions = []
    for x, y, z in positions:
        floor = base_height(x, z)
        # Some old cliff-toe points are already hidden below the coarse terrain.
        # At those points the visible join is the terrain, not the buried wall.
        # Preserve their XZ footprint and seat the deposit above that actual base.
        depth = max(minimum_lift, y - floor)
        deposits.append(depth)
        seated_positions.append((x, floor + depth, z))

    def cross(a, b, p):
        return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])

    def clip(polygon, triangle):
        boundary = [(p[0], p[2]) for p in triangle]
        orientation = 1 if cross(boundary[0], boundary[1], boundary[2]) > 0 else -1
        for a, b in zip(boundary, boundary[1:] + boundary[:1]):
            output = []
            if not polygon:
                return []
            previous = polygon[-1]
            dp = orientation * cross(a, b, previous)
            for current in polygon:
                dc = orientation * cross(a, b, current)
                if (dc >= -1e-9) != (dp >= -1e-9):
                    t = dp / (dp - dc)
                    output.append((previous[0] + (current[0] - previous[0]) * t,
                                   previous[1] + (current[1] - previous[1]) * t))
                if dc >= -1e-9:
                    output.append(current)
                previous, dp = current, dc
            polygon = output
        return polygon

    out_positions = seated_positions
    out_masks = list(masks)
    out_uv = list(uv)
    out_indices = []
    out_sections = []
    keys = {(round(p[0], 7), round(p[2], 7)): i for i, p in enumerate(positions)}
    for section in sections:
        first = len(out_indices) // 3
        begin = section['firstTriangle'] * 3
        end = begin + section['triangleCount'] * 3
        for at in range(begin, end, 3):
            ids = indices[at:at + 3]
            authored = [positions[i] for i in ids]
            min_x = max(0, int(math.floor((min(p[0] for p in authored) - terrain['minX']) / step)))
            max_x = min(columns - 2, int(math.floor((max(p[0] for p in authored) - terrain['minX']) / step)))
            min_z = max(0, int(math.floor((min(p[2] for p in authored) - terrain['minZ']) / step)))
            max_z = min(rows - 2, int(math.floor((max(p[2] for p in authored) - terrain['minZ']) / step)))
            for iz in range(min_z, max_z + 1):
                for ix in range(min_x, max_x + 1):
                    for base_triangle in base_triangles(ix, iz):
                        polygon = clip([(p[0], p[2]) for p in authored], base_triangle)
                        if len(polygon) < 3:
                            continue
                        polygon_ids = []
                        for x, z in polygon:
                            key = (round(x, 7), round(z, 7))
                            if key not in keys:
                                weights = barycentric(x, z, *authored)
                                ground_weights = barycentric(x, z, *base_triangle)
                                y = sum(w * p[1] for w, p in zip(ground_weights, base_triangle))
                                y += sum(w * deposits[i] for w, i in zip(weights, ids))
                                keys[key] = len(out_positions)
                                out_positions.append((x, y, z))
                                out_masks.append(tuple(sum(w * masks[i][k] for w, i in zip(weights, ids)) for k in range(len(masks[0]))))
                                out_uv.append(tuple(sum(w * uv[i][k] for w, i in zip(weights, ids)) for k in range(2)))
                            vertex = keys[key]
                            if not polygon_ids or polygon_ids[-1] != vertex:
                                polygon_ids.append(vertex)
                        if len(polygon_ids) > 1 and polygon_ids[-1] == polygon_ids[0]:
                            polygon_ids.pop()
                        for i in range(1, len(polygon_ids) - 1):
                            tri = [polygon_ids[0], polygon_ids[i], polygon_ids[i + 1]]
                            a, b, c = [out_positions[j] for j in tri]
                            upward = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2])
                            if abs(upward) < 1e-8:
                                continue
                            if upward < 0:
                                tri[1], tri[2] = tri[2], tri[1]
                            out_indices.extend(tri)
        out_sections.append({**section, 'firstTriangle': first, 'triangleCount': len(out_indices) // 3 - first})
    return out_positions, out_masks, out_uv, out_indices, out_sections
