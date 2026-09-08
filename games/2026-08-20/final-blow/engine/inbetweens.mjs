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


// The extra drawings occupy preparation/retraction, never the contact window.
// Canonical poses remain available to combat observers and replay checks.
export function createApproachSelector() {
  const availability = new WeakMap();
  return (fighter, pose, ready) => {
    const a = fighter.attacking;
    if (!INBETWEEN_FIGHTERS.includes(fighter.def?.id) || !a) return pose;
    if (!availability.has(a)) availability.set(a, {
      ready,
      airborne: !fighter.grounded || a.cancelProfileId?.startsWith('air'),
      crouch: fighter.crouch || a.cancelProfileId?.startsWith('crouch'),
    });
    const origin = availability.get(a);
    if (!origin.ready || !ready || !['light','heavy'].includes(a.kind)
      || a.animation || a.superMove || fighter.hitstunFrames > 0 || fighter.grabbed
      || fighter.blockstunFrames > 0 || fighter.wakeupFrames > 0 || fighter.down
      || fighter.grabbing || fighter.dizzyFrames > 0 || fighter.cinematicFrame != null
      || (origin.airborne && fighter.grounded)) return pose;
    const f = fighter.attackFrame, start = a.activeStartFrame, end = a.activeEndFrame;
    const total = a.totalFrames || Math.round(a.duration * 60);
    if (![f,start,end,total].every(Number.isFinite)) return pose;
    const preparation = f >= Math.max(1, Math.floor(start * .35)) && f < Math.floor(start * .75);
    const settling = origin.airborne || origin.crouch;
    const recoveryEnd = settling ? total - 1 : end + Math.floor((total-end)*.55);
    const recovery = f >= end + Math.max(1, Math.floor((total-end)*(settling ? .2 : .25))) && f < recoveryEnd;
    if (!preparation && !recovery) return pose;
    const kick = a.limb === 'kick';
    const crouch = origin.crouch;
    // Retraction must not play the extending fist/sweep a second time. These
    // authored bookends also keep their own air/crouch registration metadata.
    const settle = origin.airborne ? 8 : crouch ? 12 : null;
    const artFrame = recovery && settle !== null ? settle
      : origin.airborne ? (kick ? 7 : 6) : crouch ? (kick ? 5 : 4)
      : a.kind === 'heavy' ? (kick ? 14 : 13) : (kick ? 1 : 0);
    return {...pose, artBank:'inbetween-approach', artFrame};
  };
}

export function presentationPose(pose) {
  return pose.artBank === 'inbetween-approach' && Number.isInteger(pose.artFrame)
    ? {...pose, bank:'unified-ext3', frame:pose.artFrame} : pose;
}
