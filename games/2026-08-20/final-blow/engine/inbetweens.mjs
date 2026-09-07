// Presentation-only drawings. Canonical bank/frame stay intact for gameplay,
// facing, floor registration and cinematic anatomy.
export const INBETWEEN_BANKS = ['unified','unified-ext2','unified-ext3','unified-ext4','unified-ext5','specials'];
export const REPAIRED_CELLS = {
  jez: {'unified-ext3':[3,9,14], 'unified-ext5':[9,11,12], specials:[1,2,9,10,14,15]},
  benny: {'unified-ext2':[12,13,14,15], 'unified-ext3':[3,9,13,14], 'unified-ext5':[11,12], specials:[9,10,15]},
};
export function repairedCell(id, bank, frame) { return REPAIRED_CELLS[id]?.[bank]?.includes(frame) || false; }
export function companionBank(bank) { return `inbetween-${bank}`; }
export function createInbetweenSelector() {
  const entries = new WeakMap();
  return (owner, pose, tick, ready, advance = true) => {
    if (!owner || !['jez','benny'].includes(owner.def?.id)) return pose;
    if (!INBETWEEN_BANKS.includes(pose.bank)) { if (advance) entries.delete(owner); return pose; }
    const key = `${pose.bank}:${pose.frame}`;
    let entry = entries.get(owner);
    if (advance && (!entry || entry.key !== key || tick < entry.tick)) {
      entry = {key, tick, ready};
      entries.set(owner, entry);
    }
    // Repairs never alternate with a cropped original. Loading a transition
    // late cannot insert it in the middle of a held pose.
    const repair = repairedCell(owner.def.id, pose.bank, pose.frame);
    const transition = entry?.key === key && entry.ready && tick - entry.tick < 2;
    return ready && (repair || transition) ? {...pose, artBank:companionBank(pose.bank)} : pose;
  };
}
