import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const read = (p:string) => readFileSync(new URL('../'+p,import.meta.url));
const hash = (b:Uint8Array) => createHash('sha256').update(b).digest('hex');
const revision = JSON.parse(read('source/coupe-realism-revision.json').toString());
/** Old milestone tests keep their immutable fixtures. Verify the current exact
 * authorized revision, then undo only its recorded rendering hooks/model swap.
 * coupe-realism.test.ts independently tests the actual new asset and damage. */
export function restoreCoupeBytes(file:string, bytes:Buffer) {
  const entry=revision.files[file];
  if(!entry || hash(bytes)===entry.before) return bytes;
  assert.equal(hash(bytes),entry.after,file+': current visual revision has unreviewed edits');
  if(entry.snapshot) bytes=gunzipSync(read(entry.snapshot));
  else {
    let text=bytes.toString();
    for(const edit of [...entry.edits].reverse()) {
      assert.equal(text.split(edit.after).length,2,file+': unique appearance integration');
      text=text.replace(edit.after,edit.before);
    }
    bytes=Buffer.from(text);
  }
  assert.equal(hash(bytes),entry.before,file+': all earlier source/model bytes recovered exactly');
  return bytes;
}
