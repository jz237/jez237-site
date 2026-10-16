// Master cue sheet for the Port Richmond Halloween intro, v2 "HIDE" (seconds from film start).
//
// Single source of truth for timing. The shots (src/film/shots.js), choreography, props/world animation and the sound
// design (src/audio) must all read times from here, never hard-code them, so re-timing a beat moves picture and
// sound together. The film structure is described in docs/DESIGN-v2.md.
//
// Geography uses the Three.js frame from src/world/frame.js (-Z = NE toward the terminal wall,
// +X = SE odd side with the stoops and Bauder Graphics, -X = NW even side with the parked cars).

export const FILM = {
  duration: 88.0, // film end; the title state then holds/loops until the viewer acts
  fadeInEnd: 1.4,
};

// "never": a time no film frame reaches (disables v1-only beats that older modules still reference)
export const NEVER = 1.0e4;

export const SECTIONS = [
  { id: 'display', start: 0.0, end: 17.5, title: 'The Display' },
  { id: 'car', start: 17.5, end: 33.6, title: 'The Car' },
  { id: 'under', start: 33.6, end: 52.5, title: 'Under' },
  { id: 'wakes', start: 52.5, end: 64.0, title: 'The Street Wakes' },
  { id: 'refuge', start: 64.0, end: 78.1, title: 'False Safety' },
  { id: 'handoff', start: 78.1, end: 88.0, title: 'Port Richmond' },
];

export const CUES = {
  // ---------------------------------------------------------------- PROLOGUE: THE DISPLAY
  pumpkinGutter: 2.3, // the hero jack-o'-lantern's candle gutters (P1)
  rackFocus: 3.0, // P1 focus pull from the pumpkin to the street (3.0 -> 3.9)
  shotP2: 4.6, // wide of the display
  windGust1: 5.4, // leaves scrape across the wet street
  railTapStart: 4.8, // the plastic bat taps the 3605 railing in the wind
  railTapEnd: 9.6,
  shotP3: 9.8, // medium on the skeleton animatronic
  animatronicTrigger: 10.55, // relay click, LED eyes come on
  animatronicLaugh: 10.85, // tinny speaker: "Happy Halloween! Ha ha ha ha!" (~2.6 s)
  scarecrowHeadLift: 12.1, // background, out of focus: the sack-masked one lifts its head (12.1 -> 13.6)
  shotP4: 14.0, // high wide from a NW second-floor window
  figuresTurn: 14.3, // shapes step out from between cars / doorways and turn toward the noise (14.3 -> 16.8)
  animatronicLaugh2: 15.3, // the laugh again, further off (re-triggered)

  // ---------------------------------------------------------------- ACT 1: THE CAR
  shotC1: 17.5, // POV, car A back seat
  flicker1: 19.6, // the failing streetlight blacks out (19.6 -> 20.35); the scarecrow is closer when it returns
  flicker1End: 20.35,
  shotC2: 23.0, // objective over the scarecrow's shoulder toward car A
  shotC3: 25.2, // POV again
  flicker2: 26.6, // second blackout (26.6 -> 27.3); the street is empty when it returns
  flicker2End: 27.3,
  leanLook: 27.7, // we lean forward between the seats and look left (27.7 -> 29.1)
  windowSmash: 29.4, // SCARE ONE: the curb-side rear window beside us explodes inward
  smashFace: 29.55, // the WreckVictim's face pushes in through the broken glass
  smashGrab: 29.78, // both hands reach in, one closes on the seat back beside us
  smashHoldEnd: 30.9,
  carDoorOpen: 31.25, // we shove the street-side rear door open
  fallAsphalt: 32.2, // we fall onto the wet street and look back

  // ---------------------------------------------------------------- ACT 2: UNDER
  shotU1: 33.6, // POV sliding under car B from the street side
  underSettle: 35.6,
  feet1: 36.8, // a walker's feet pass along the street (36.8 -> 39.6)
  feetStop: 39.2, // the face-paint infected's legs stop beside the car
  kneel: 41.0, // knees hit the asphalt
  handsDown: 41.6, // hands spread flat on the wet asphalt / in the puddle
  faceDown: 42.4, // its head lowers sideways into view (42.4 -> 43.4)
  inspectStart: 43.4, // inspectable close-up: breath ripples, jaw, eyes drifting
  dripOnFace: 44.3, // a drip from the underbody lands on its cheek; it does not blink
  phoneBuzz2: 45.35, // our phone wakes in our hand (a text): two muffled buzzes; its cold screen light finally shows the face
  gazeLock2: 46.35, // its eyes lock onto us
  lunge2: 47.6, // SCARE TWO: it lunges under the car
  contact2: 47.85, // head clangs on the underbody, hand grabs at us, the car rocks
  grabYank: 48.0, // we are yanked toward it
  kickFree: 48.55, // we kick free and scramble back
  rollOut: 49.6, // roll out the sidewalk side
  standUp: 51.0,

  // ---------------------------------------------------------------- ACT 3: THE STREET WAKES
  shotS1: 52.5, // POV in the open: the street is alive
  screamerShriek: 53.2, // the screamer on the 3605 stoop shrieks (summons)
  bruteBlocks: 54.1, // a brute shoulders out between cars toward E Venango
  shotS2: 55.0, // objective high wide: they converge; 3609's open door is the only warm light
  shotS3: 57.4, // POV run across the street
  nearMiss: 58.6, // the face-paint infected, out from under car B, swipes at our legs
  screamerDescends: 59.4, // the screamer comes down its stoop
  reachStoop: 62.8, // up 3609's stoop

  // ---------------------------------------------------------------- ACT 4: FALSE SAFETY
  doorEnter: 63.6, // through 3609's doorway
  doorSlam: 64.6, // we slam the door
  deadbolt: 65.05, // deadbolt turned
  doorSlap: 65.7, // one hand slaps the door glass outside, then nothing
  silenceStart: 66.2,
  checkKitchen: 67.0, // we check the dark kitchen doorway
  checkStairs: 68.8, // the stairs
  relief: 70.4, // exhale
  slideDown: 71.0, // we slide down the door to sit on the floor (71.0 -> 72.6)
  lookPhoto: 72.9, // we look up at the framed family photo
  sofaSlip: 74.7, // at the frame's edge, low: something slips around the end of the sofa
  creak3: 76.0, // a floorboard creaks beside us
  reveal3: 76.4, // we turn: she is right there on all fours at our level (held: she does not move yet)
  attack3: 76.9, // SCARE THREE: she rises into us
  contact3: 77.3, // both hands on us, face fills the frame
  cutToBlack: 78.1, // hard cut after the payoff

  // ---------------------------------------------------------------- HANDOFF
  tailEnd: 79.6, // sound tail over black
  titleFadeIn: 79.6, // the new static high wide of Witte St fades up
  titleDraw: 80.6, // PORT RICHMOND title animates in
  menuIn: 82.6, // menu rows (New Game highlighted)
};

// v1 cue names that older modules still read. v1-only beats are disabled with NEVER; shared beats point at their v2
// equivalents. Remove an entry once no module reads it.
Object.assign(CUES, {
  lampFlicker1: CUES.flicker1, // flicker.js main episode (v2 schedule lives in src/world/flicker.js)
  candyBucket: 1.5, // the 3609 door's warm gap spill is on from the start (story lights: candyBucket - 1.5)
  doorAjarKeys: 0.0,
  phoneBuzz: NEVER,
  tvFlickerStart: 0.0, // the 3607 TV flickers behind its window through the prologue
  easStart: 0.4,
  easBreak: 12.6, // the emergency card breaks into static during P3
  porchFiguresInView: NEVER,
  watcherMoved: NEVER,
  scare1: NEVER, scare1Face: NEVER, scare1Knock2: NEVER, scare1RetreatEnd: NEVER, // v1 3607-window scare
  carPass: NEVER, reflectionReveal: NEVER, reflectionEnd: NEVER, turnStart: NEVER, turnEnd: NEVER, // v1 car beat
  closeupHoldEnd: NEVER, gazeLock: NEVER, scare2: NEVER, scare2Contact: NEVER, scare2Escape: NEVER,
  binKnock: NEVER, curtainMove: NEVER, crawlerOut: NEVER, watcherWalks: NEVER, watcherCloser: NEVER,
  pursuerReturns: NEVER,
  runForDoor: CUES.shotS3,
  checkRoom: CUES.checkKitchen,
  turnToDoor: NEVER,
  scare3: NEVER, scare3Contact: NEVER, // v1 homeowner-behind-the-door scare
  dogFar: 7.2,
});

// Named world locations (Three.js frame). src/world and src/props expose refined anchors; these are the lead's
// staging targets for v2.
export const PLACES = {
  carA: { x: -1.92, z: 10.5, yaw: Math.PI }, // hide car, nose toward NE (-Z); curb-side rear window = scare one
  carB: { x: -1.95, z: 17.2, yaw: Math.PI }, // under car, between car A and the E Venango corner
  failingLight: { x: -1.196, y: 8.663, z: -20.396 }, // streetlight_5
  scarecrowMark1: { x: 0.2, z: -19.2 }, // under the failing light (C1)
  scarecrowMark2: { x: 0.1, z: -9.0 }, // after flicker 1
  scarecrowMark3: { x: -0.1, z: -1.5 }, // C3, at the edge of the light
  displayStoop: '3607', // skeleton animatronic + both scarecrows
  screamerStoop: '3605',
  refugeDoor: { x: 5.531, y: 1.432, z: 3.629 }, // 3609 front door (normal -X)
  refugeRoom: { x: 7.5, y: 0.382, z: 2.2 },
};
