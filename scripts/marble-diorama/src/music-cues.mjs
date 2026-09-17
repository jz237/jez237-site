// Original module identity is verified against the documented archive hashes.
// The emulator runs their own sequencers and repeats; no edited PCM loop is used.
export const musicCues = Object.fromEntries(
  [
    ["practice", "Practice", 1],
    ["beginner", "Beginner", 1],
    ["intermediate", "Intermedia", 1],
    ["aerial", "Aerial", 2],
    ["silly", "Silly", 1],
    ["ultimate", "Ultimate", 1],
    ["ending", "Ultimate", 2],
  ].map(([id, module, subsong]) => [
    id,
    { verified: true, module, subsong, stream: true, gain: 3 },
  ]),
);
