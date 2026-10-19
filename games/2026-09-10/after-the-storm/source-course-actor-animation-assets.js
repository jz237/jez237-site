// Numeric course animation blocks only: transform rows, signed frame keys,
// descriptors, pointer tables and their original alignment padding. Geometry,
// textures, display lists and executable instructions are excluded. Pointers
// retain their original segment8 operands for the recovered loader.
const layouts={
  "0": {
    "dataOffset": 17632,
    "byteLength": 32060,
    "tableOffset": 49660,
    "animationCount": 8,
    "trackCount": 5,
    "asset": "assets/actor-animations/bank-0.bin",
    "sha256": "5a0db4e502b0de47ece4e90880b6941d81fa95c29f84e3b1ac1ce2715701e7e5"
  },
  "1": {
    "dataOffset": 6140,
    "byteLength": 6396,
    "tableOffset": 12524,
    "animationCount": 3,
    "trackCount": 5,
    "asset": "assets/actor-animations/bank-1.bin",
    "sha256": "3b297ee8eac57150d247a86ca15d4270b00dbd83d169bea974faffe4c53cdb57"
  },
  "2": {
    "dataOffset": 11968,
    "byteLength": 1728,
    "tableOffset": 13688,
    "animationCount": 2,
    "trackCount": 3,
    "asset": "assets/actor-animations/bank-2.bin",
    "sha256": "db9a867c203d0f08c758eb7a063024e79c8da0be0a1913285c0fd9c2b887c09c"
  },
  "3": {
    "dataOffset": 7456,
    "byteLength": 4748,
    "tableOffset": 12200,
    "animationCount": 1,
    "trackCount": 7,
    "asset": "assets/actor-animations/bank-3.bin",
    "sha256": "56b13c6ab2551062004863488ae885ea602c569276fbe52fe1eed7057d31e858"
  },
  "4": {
    "dataOffset": 2624,
    "byteLength": 864,
    "tableOffset": 3484,
    "animationCount": 1,
    "trackCount": 3,
    "asset": "assets/actor-animations/bank-4.bin",
    "sha256": "4bbb2a9f6b797a7d694a9b6096d3e55e460dc2da39a9a5170772cfb3bbe0be57"
  },
  "6": {
    "dataOffset": 10296,
    "byteLength": 972,
    "tableOffset": 11264,
    "animationCount": 1,
    "trackCount": 7,
    "asset": "assets/actor-animations/bank-6.bin",
    "sha256": "a423c3f05a4963737dccd76efe20721f3d6b4557d0b95b0e0d67fd34361c1e97"
  },
  "8": {
    "dataOffset": 5008,
    "byteLength": 2256,
    "tableOffset": 7256,
    "animationCount": 2,
    "trackCount": 6,
    "asset": "assets/actor-animations/bank-8.bin",
    "sha256": "4ba44fbb7c3913dee1ff223e41376937508f232a0ab8a53ceda2a14fd0f72c43"
  }
};
export const NATIVE_COURSE_ANIMATION_ASSETS=Object.freeze(Object.fromEntries(Object.entries(layouts).map(([key,value])=>[key,Object.freeze(value)])));
