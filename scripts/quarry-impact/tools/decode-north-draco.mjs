/** Decode shipped Draco bytes with the same locally bundled official decoder.
 * CPU audit helper only; the game uses Three's DRACOLoader worker path.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let modulePromise;
async function decoderModule() {
    if (!modulePromise) modulePromise = (async () => {
        const filename = resolve(root, 'public/models/draco/draco_decoder.js');
        const module = { exports: {} };
        const context = { module, exports: module.exports, require: createRequire(import.meta.url),
            __filename: filename, __dirname: dirname(filename), console, process,
            setTimeout, clearTimeout, TextDecoder, TextEncoder, performance, Buffer };
        vm.runInNewContext(await readFile(filename, 'utf8'), context, { filename });
        return await module.exports({});
    })();
    return modulePromise;
}

export async function decodeDracoGLB(bytes) {
    const input = Buffer.from(bytes.buffer ?? bytes, bytes.byteOffset ?? 0, bytes.byteLength ?? bytes.length);
    const jsonLength = input.readUInt32LE(12);
    const document = JSON.parse(input.subarray(20, 20 + jsonLength).toString('utf8'));
    if (!document.extensionsUsed?.includes('KHR_draco_mesh_compression')) return new Uint8Array(input);
    const bin = input.subarray(28 + jsonLength);
    const chunks = [bin]; let length = bin.length;
    const append = (array, target) => {
        const padding = (4 - length % 4) % 4;
        if (padding) { chunks.push(Buffer.alloc(padding)); length += padding; }
        const data = Buffer.from(array.buffer, array.byteOffset, array.byteLength);
        const index = document.bufferViews.length;
        document.bufferViews.push({ buffer: 0, byteOffset: length, byteLength: data.length, target });
        chunks.push(data); length += data.length;
        return index;
    };
    const draco = await decoderModule();
    for (const mesh of document.meshes) for (const primitive of mesh.primitives) {
        const extension = primitive.extensions?.KHR_draco_mesh_compression;
        if (!extension) continue;
        const view = document.bufferViews[extension.bufferView];
        const data = bin.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength);
        const decoder = new draco.Decoder(), buffer = new draco.DecoderBuffer(), geometry = new draco.Mesh();
        buffer.Init(new Int8Array(data.buffer, data.byteOffset, data.byteLength), data.byteLength);
        const status = decoder.DecodeBufferToMesh(buffer, geometry);
        if (!status.ok()) throw new Error('Draco decode failed: ' + status.error_msg());
        for (const [semantic, uniqueID] of Object.entries(extension.attributes)) {
            const attribute = decoder.GetAttributeByUniqueId(geometry, uniqueID);
            const values = new draco.DracoFloat32Array();
            decoder.GetAttributeFloatForAllPoints(geometry, attribute, values);
            const array = new Float32Array(values.size());
            for (let i = 0; i < array.length; i++) array[i] = values.GetValue(i);
            const accessor = document.accessors[primitive.attributes[semantic]];
            accessor.bufferView = append(array, 34962); accessor.byteOffset = 0;
            accessor.componentType = 5126; accessor.count = geometry.num_points(); delete accessor.normalized;
            if (semantic === 'POSITION') {
                accessor.min = [Infinity, Infinity, Infinity]; accessor.max = [-Infinity, -Infinity, -Infinity];
                for (let i = 0; i < array.length; i++) {
                    const axis = i % 3; accessor.min[axis] = Math.min(accessor.min[axis], array[i]);
                    accessor.max[axis] = Math.max(accessor.max[axis], array[i]);
                }
            }
            draco.destroy(values);
        }
        const faces = new Uint32Array(geometry.num_faces() * 3), face = new draco.DracoInt32Array();
        for (let i = 0; i < geometry.num_faces(); i++) {
            decoder.GetFaceFromMesh(geometry, i, face);
            for (let j = 0; j < 3; j++) faces[i * 3 + j] = face.GetValue(j);
        }
        const accessor = document.accessors[primitive.indices];
        accessor.bufferView = append(faces, 34963); accessor.byteOffset = 0;
        accessor.componentType = 5125; accessor.count = faces.length;
        accessor.min = [0]; accessor.max = [geometry.num_points() - 1];
        delete primitive.extensions.KHR_draco_mesh_compression;
        if (!Object.keys(primitive.extensions).length) delete primitive.extensions;
        for (const object of [face, status, geometry, buffer, decoder]) draco.destroy(object);
    }
    document.extensionsUsed = document.extensionsUsed.filter(value => value !== 'KHR_draco_mesh_compression');
    document.extensionsRequired = document.extensionsRequired?.filter(value => value !== 'KHR_draco_mesh_compression');
    const padding = (4 - length % 4) % 4;
    if (padding) { chunks.push(Buffer.alloc(padding)); length += padding; }
    document.buffers = [{ byteLength: length }];
    const json = Buffer.from(JSON.stringify(document)), padded = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 32)]);
    const header = Buffer.alloc(20); header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4);
    header.writeUInt32LE(28 + padded.length + length, 8); header.writeUInt32LE(padded.length, 12); header.writeUInt32LE(0x4e4f534a, 16);
    const binHeader = Buffer.alloc(8); binHeader.writeUInt32LE(length, 0); binHeader.writeUInt32LE(0x004e4942, 4);
    return new Uint8Array(Buffer.concat([header, padded, binHeader, ...chunks]));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const directory = resolve(root, 'outputs/forest-edge/authoring/decoded'); await mkdir(directory, { recursive: true });
    for (let variant = 0; variant < 3; variant++) {
        const name = `quarry-north-fir-${variant}.glb`;
        const decoded = await decodeDracoGLB(await readFile(resolve(root, 'public/models', name)));
        await writeFile(resolve(directory, name), decoded);
        console.log(name, decoded.length, 'decoded bytes');
    }
}
