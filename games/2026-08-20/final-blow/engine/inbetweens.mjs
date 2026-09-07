// Presentation-only drawings. Canonical bank/frame stay intact for gameplay,
// facing, floor registration and cinematic anatomy.
export const INBETWEEN_FIGHTERS = ["jez", "benny", "alan", "ali", "commissioner", "cyraxx", "deathblow", "devil", "donald", "post"];
export const INBETWEEN_BANKS = ['unified','unified-ext2','unified-ext3','unified-ext4','unified-ext5','specials'];
export const REPAIRED_CELLS = {"jez": {"unified-ext2": [7], "unified-ext3": [1, 3, 5, 7, 9, 11, 14, 15], "unified-ext4": [3, 12, 15], "unified-ext5": [1, 9, 11, 12], "specials": [1, 2, 5, 9, 10, 14, 15]}, "benny": {"unified": [15], "unified-ext2": [12, 13, 14, 15], "unified-ext3": [0, 3, 5, 8, 9, 13, 14, 15], "unified-ext4": [1, 3, 12, 15], "unified-ext5": [0, 8, 9, 11, 12, 15], "specials": [9, 10, 12, 15]}, "alan": {"unified-ext2": [12, 15], "unified-ext3": [0, 1, 3, 5, 9, 13, 15], "unified-ext4": [3], "unified-ext5": [11, 12], "specials": [2, 3, 10, 13, 15]}, "ali": {"unified-ext2": [12, 15], "unified-ext3": [3, 9, 13, 14, 15], "unified-ext4": [3, 14, 15], "unified-ext5": [2, 5, 8, 9, 11, 12], "specials": [14]}, "commissioner": {"unified": [11], "unified-ext2": [12, 13, 14, 15], "unified-ext3": [3, 5, 6, 9, 13, 14, 15], "unified-ext4": [3], "unified-ext5": [1, 8, 9, 10, 11, 12, 15]}, "cyraxx": {"unified": [8], "unified-ext2": [12, 14, 15], "unified-ext3": [3, 9, 13, 14], "unified-ext4": [14, 15], "unified-ext5": [8, 9, 11, 12, 14], "specials": [4, 5, 13, 14, 15]}, "deathblow": {"unified": [15], "unified-ext2": [12, 15], "unified-ext3": [3, 5, 9, 11, 13, 14, 15], "unified-ext4": [3, 11], "unified-ext5": [8, 9, 11, 12, 14, 15], "specials": [6, 9, 10, 12, 13, 15]}, "devil": {"unified": [10, 11, 15], "unified-ext2": [12, 15], "unified-ext3": [3, 9, 13, 14, 15], "unified-ext4": [3], "unified-ext5": [11, 12], "specials": [0, 8, 9, 10, 13, 15]}, "donald": {"unified": [15], "unified-ext2": [12], "unified-ext5": [11], "specials": [1, 2, 3, 5, 6, 7, 11, 12, 13, 14, 15], "unified-ext4": [3, 7], "unified-ext3": [3, 9, 10, 11, 13, 14]}, "post": {"unified-ext2": [12, 15], "unified-ext5": [0, 1, 8, 9, 10, 11, 12, 14], "specials": [2, 3, 5, 9, 10, 12, 13, 15], "unified-ext4": [14, 15], "unified": [15], "unified-ext3": [0, 1, 3, 9, 11, 13, 14]}};

export function repairedCell(id, bank, frame) { return REPAIRED_CELLS[id]?.[bank]?.includes(frame) || false; }
export function companionBank(bank) { return `inbetween-${bank}`; }
export function createInbetweenSelector() {
  const entries = new WeakMap();
  return (owner, pose, tick, ready, advance = true) => {
    if (!owner || !INBETWEEN_FIGHTERS.includes(owner.def?.id)) return pose;
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
