import { cliffGeometry } from './quarry-layout';
import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { pbr, texture } from './assets';
import { terrainHeight, trackPoint } from './rules';
// Original scenery shaders. Photographic maps remain the locally bundled CC0 scans.
const noise = `
float quarryHash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
float quarryNoise(vec2 p) {
 vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
 return mix(mix(quarryHash(i),quarryHash(i+vec2(1,0)),f.x),mix(quarryHash(i+vec2(0,1)),quarryHash(i+vec2(1,1)),f.x),f.y);
}
`;
function surfaceShader(material: T.MeshStandardMaterial, fragment: string, name: string) {
    material.onBeforeCompile = (shader) => {
        shader.vertexShader = 'varying vec3 vQuarryPosition;\n' + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvQuarryPosition=(modelMatrix*vec4(transformed,1.0)).xyz;');
        shader.fragmentShader = 'varying vec3 vQuarryPosition;\n' + noise + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\n' + fragment);
    };
    material.customProgramCacheKey = () => name;
    return material;
}
export function quarryGround() {
    const mat = pbr('mud', 1, { color: 0xb2ae9d, normalScale: new T.Vector2(0.9, 0.9) });
    const forest = texture('forrest_ground_01_diff', 1, true);
    const gravel = texture('gravel_diff', 1, true);
    const rock = texture('rock_diff', 1, true);
    surfaceShader(mat, `
    vec2 q=vQuarryPosition.xz;
    float macro=quarryNoise(q*.024)*.6+quarryNoise(q*.087)*.4;
    float forestWeight=smoothstep(111.0,152.0,length(q*vec2(.925,1.0))+macro*20.0);
    vec3 litter=texture2D(quarryForest,q/5.5).rgb;
    vec3 grit=texture2D(quarryGravel,q/2.0).rgb;
    diffuseColor.rgb=mix(diffuseColor.rgb,grit*.77,smoothstep(.29,.73,macro)*.67);
    diffuseColor.rgb=mix(diffuseColor.rgb,litter*.69,forestWeight);
    diffuseColor.rgb*=mix(.76,1.04,macro);
    vec3 slope=abs(normalize(cross(dFdx(vQuarryPosition),dFdy(vQuarryPosition))));
    vec3 blend=pow(slope,vec3(4.0));blend/=dot(blend,vec3(1.0));
    vec3 bedrock=texture2D(quarryRock,vQuarryPosition.zy/4.0).rgb*blend.x+texture2D(quarryRock,vQuarryPosition.xz/4.0).rgb*blend.y+texture2D(quarryRock,vQuarryPosition.xy/4.0).rgb*blend.z;
    float exposed=(1.0-smoothstep(.58,.92,slope.y))*smoothstep(121.0,147.0,length(q*vec2(.925,1.0)));
    diffuseColor.rgb=mix(diffuseColor.rgb,bedrock*.57*mix(.74,1.0,macro),exposed);

  `, 'quarry-ground-v3');
    const base = mat.onBeforeCompile;
    mat.onBeforeCompile = (shader, renderer) => {
        base(shader, renderer);
        shader.uniforms.quarryForest = { value: forest };
        shader.uniforms.quarryGravel = { value: gravel };
        shader.uniforms.quarryRock = { value: rock };
        shader.fragmentShader = 'uniform sampler2D quarryForest;\nuniform sampler2D quarryGravel;\nuniform sampler2D quarryRock;\n' + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor=max(.89,roughnessFactor);');
    };
    return mat;
}
export function quarryAggregate() {
    const material = surfaceShader(pbr('gravel', 1, { color: 0xbbb8b0, normalScale: new T.Vector2(.55, .55) }), `
    vec2 p=vQuarryPosition.xz;
    float wear=quarryNoise(p*.051)*.7+quarryNoise(p*.17)*.3;
    float mono=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
    diffuseColor.rgb=mix(diffuseColor.rgb,vec3(mono),.36)*mix(.68,1.02,wear);
  `, 'quarry-aggregate-v1');
    const dirt = texture('mud_diff', 1, true);
    const base = material.onBeforeCompile;
    material.onBeforeCompile = (shader, renderer) => {
        base(shader, renderer);
        shader.uniforms.quarryDirt = { value: dirt };
        shader.fragmentShader = 'uniform sampler2D quarryDirt;\n' + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace('diffuseColor.rgb=mix(diffuseColor.rgb,vec3(mono),.36)*mix(.68,1.02,wear);', `
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(mono),.36)*mix(.66,1.05,wear);
      float soil=smoothstep(.45,.69,quarryNoise(p*.062+vec2(12.7,4.3))+quarryNoise(p*.21)*.11);
      vec3 dirt=texture2D(quarryDirt,p/4.7).rgb;
      float earth=dot(dirt,vec3(.2126,.7152,.0722));
      diffuseColor.rgb=mix(diffuseColor.rgb,mix(dirt,vec3(earth*.92,earth*.85,earth*.7),.7)*.58,soil*.8);
    `);
        shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor=max(.86,roughnessFactor);');
    };
    return material;
}
export function quarryRock() {
    return surfaceShader(pbr('rock', 1, { color: 0xb5b1a2, normalScale: new T.Vector2(1.25, 1.25), vertexColors: true }), `
    vec3 q=vQuarryPosition;
    float streak=quarryNoise(q.xz*.28+vec2(q.y*.019));
    float bedding=sin(q.y*2.3+quarryNoise(q.xz*.075)*3.0)*.5+.5;
    float runoff=smoothstep(.48,.77,streak)*(1.0-smoothstep(3.0,30.0,q.y));
    diffuseColor.rgb*=mix(.79,1.06,bedding)*mix(1.0,.65,runoff);
  `, 'quarry-rock-v3');
}
export function weatheredMetal(color: number) {
    return surfaceShader(new T.MeshStandardMaterial({ color, metalness: .57, roughness: .74 }), `
    vec3 p=vQuarryPosition;
    float grain=quarryNoise(p.xz*4.0+p.y*.06);
    float patches=quarryNoise(p.xz*.7+vec2(p.y*.027));
    float rust=smoothstep(.55,.79,patches+grain*.15);
    diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.19,.074,.025),rust*.68);
    diffuseColor.rgb*=mix(.84,1.05,grain);
  `, 'quarry-weathered-metal-v1');
}
export { landscapeHeight } from './quarry-layout';
export function quarryCliffs() {
    const data=cliffGeometry();
    const geometry=new T.BufferGeometry();
    geometry.setAttribute('position',new T.BufferAttribute(data.positions,3));
    geometry.setAttribute('uv',new T.BufferAttribute(data.uv,2));
    geometry.setAttribute('color',new T.BufferAttribute(data.colors,3));
    geometry.setIndex(new T.BufferAttribute(data.indices,1));
    geometry.computeVertexNormals();
    return geometry;
}
function ribbon(offset0: number, offset1: number, segments: number, irregular = false) {
    const positions: number[] = [], uv: number[] = [], indices: number[] = [];
    for (let i = 0; i <= segments; i++) {
        const p = trackPoint(i / segments), q = trackPoint((i + .1) / segments);
        const d = new T.Vector2(q.x - p.x, q.z - p.z).normalize();
        for (let edge = 0; edge < 2; edge++) {
            const offset = (edge === 0 ? offset0 : offset1) + (irregular ? Math.sin(i * .31) * .45 + Math.sin(i * .83) * .17 : 0);
            const x = p.x + d.y * offset, z = p.z - d.x * offset;
            positions.push(x, terrainHeight(x, z) + .067, z);
            uv.push(edge, i / 6);
        }
    }
    for (let i = 0; i < segments; i++) {
        const b = i * 2;
        indices.push(b, b + 2, b + 1, b + 1, b + 2, b + 3);
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
}
export function roadsideDetails(parent: T.Group) {
    const shoulders = quarryAggregate();
    for (const side of [-1, 1]) {
        const g = ribbon(side * 5.78, side * 8.6, 360, true);
        const p = g.attributes.position, u = g.attributes.uv;
        for (let i = 0; i < p.count; i++)
            u.setXY(i, p.getX(i) / 2, p.getZ(i) / 2);
        const m = new T.Mesh(g, shoulders);
        m.receiveShadow = true;
        parent.add(m);
    }
    // Frayed asphalt margins and dark compressed wheel channels break the perfect
    // ribbon silhouette without creating hundreds of transparent decal draws.
    const marks = new T.MeshStandardMaterial({ color: 0x272b27, transparent: true, opacity: .22, depthWrite: false, roughness: .96, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 });
    for (const offset of [-3.6, -2.6, 2.6, 3.6]) {
        const m = new T.Mesh(ribbon(offset - .16, offset + .16, 360, true), marks);
        m.receiveShadow = true;
        parent.add(m);
    }
    // Interlocking, asymmetric wear arcs in the derby gravel.
    const p: number[] = [], u: number[] = [], ind: number[] = [];
    for (let arc = 0; arc < 12; arc++) {
        const cx = Math.sin(arc * 3.97) * 16, cz = Math.cos(arc * 2.46) * 14;
        const radius = 5 + arc * 1.65, start = arc * 2.1, length = 1.4 + (arc % 3) * .7;
        for (let tire = 0; tire < 2; tire++) {
            const at = p.length / 3;
            for (let i = 0; i <= 42; i++)
                for (let edge = 0; edge < 2; edge++) {
                    const a = start + i / 42 * length, r = radius + tire * 1.55 + edge * .23;
                    p.push(cx + Math.sin(a) * r, .039 + arc * .0001, cz + Math.cos(a) * r);
                    u.push(edge, i / 42);
                }
            for (let i = 0; i < 42; i++) {
                const b = at + i * 2;
                ind.push(b, b + 2, b + 1, b + 1, b + 2, b + 3);
            }
        }
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
    g.setAttribute('uv', new T.Float32BufferAttribute(u, 2));
    g.setIndex(ind);
    g.computeVertexNormals();
    const wear = new T.Mesh(g, marks);
    wear.receiveShadow = true;
    parent.add(wear);
}
// Batch static construction by exact material and shadow behavior. Dynamic loose
// props and sign groups are excluded by caller; collision bodies are unaffected.
export function batchScenery(group: T.Group, exclude: Set<T.Object3D>) {
    group.updateMatrixWorld(true);
    const inv = group.matrixWorld.clone().invert();
    const batches = new Map<T.Material, {
        geometries: T.BufferGeometry[];
        meshes: T.Mesh[];
        shadow: boolean;
    }>();
    group.traverse(o => {
        if (!(o instanceof T.Mesh) || o instanceof T.InstancedMesh || exclude.has(o) || Array.isArray(o.material))
            return;
        if (o.material.transparent)
            return;
        const geo = o.geometry.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(inv, o.matrixWorld));
        geo.deleteAttribute('tangent');
        geo.deleteAttribute('uv1');
        if (!geo.index)
            geo.setIndex(Array.from({ length: geo.attributes.position.count }, (_, i) => i));
        if (!geo.attributes.uv)
            geo.setAttribute('uv', new T.Float32BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
        if (!batches.has(o.material))
            batches.set(o.material, { geometries: [], meshes: [], shadow: false });
        const b = batches.get(o.material)!;
        b.geometries.push(geo);
        b.meshes.push(o);
        b.shadow ||= o.castShadow;
    });
    for (const [mat, b] of batches) {
        if (b.geometries.length < 2) {
            b.geometries.forEach(g => g.dispose());
            continue;
        }
        const geo = mergeGeometries(b.geometries);
        if (geo) {
            const mesh = new T.Mesh(geo, mat);
            mesh.castShadow = b.shadow;
            mesh.receiveShadow = true;
            mesh.name = 'batched-static-scenery';
            group.add(mesh);
            b.meshes.forEach(o => o.removeFromParent());
        }
        b.geometries.forEach(g => g.dispose());
    }
}
