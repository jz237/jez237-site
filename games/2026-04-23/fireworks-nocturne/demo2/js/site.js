// Layout of the harbour, in metres. y is up, the near bank runs along z = -10
// and the show is fired from barges about 700 m out.
export const SITE = {
  terrace: { y: 18, wallZ: -10, railZ: -9.7, x0: -80, x1: 80 },
  barges: [
    { x: -300, z: -705 }, { x: -170, z: -693 }, { x: -45, z: -700 }, { x: 80, z: -691 }, { x: 205, z: -704 },
  ],
  center: [-45, 160, -700],
  bridge: { a: [640, 60], b: [330, -1700], deckY: 48, towerH: 155, towers: [0.3, 0.7], width: 30, fall: [0.315, 0.685] },
  farShoreZ: -1500,
  wheel: { x: -880, z: -1585, r: 62, hub: 72 },
};

export const CAMERAS = [
  { id: 'terrace', name: 'Terrace', pos: [0, 19.75, -6.4], look: [-30, 132, -700], fov: 46, sway: 'hand' },
  { id: 'boat', name: 'On the water', pos: [-170, 2.6, -330], look: [-50, 200, -700], fov: 62, sway: 'boat' },
  { id: 'drone', name: 'Drone', pos: [0, 0, 0], look: [-45, 150, -700], fov: 58, sway: 'orbit' },
  { id: 'postcard', name: 'Long lens', pos: [760, 128, 240], look: [100, 110, -760], fov: 27, sway: 'tripod' },
  { id: 'bridge', name: 'By the bridge', pos: [330, 26, 30], look: [180, 105, -820], fov: 48, sway: 'hand' },
];
