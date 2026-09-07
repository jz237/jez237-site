// Source-art audit: contiguous opaque runs along a cell's top or side edge.
// Rejected at the existing drawable gate so the authored fallback remains available.
export const CLIPPED_CELLS = {
  "cyraxx": {
    "unified": [
      8
    ],
    "motion": [
      7
    ],
    "motion3": [
      2
    ]
  },
  "devil": {
    "unified": [
      15
    ],
    "motion": [
      2
    ],
    "motion2": [
      4,
      12
    ]
  },
  "alan": {
    "motion": [
      0,
      2,
      7
    ],
    "motion2": [
      12
    ],
    "motion3": [
      1,
      2,
      6
    ]
  },
  "ali": {
    "motion": [
      7,
      15
    ],
    "motion3": [
      2,
      5
    ]
  },
  "benny": {
    "motion": [
      7
    ],
    "motion2": [
      12
    ]
  },
  "commissioner": {
    "motion": [
      7
    ],
    "motion2": [
      13
    ]
  },
  "jez": {
    "motion": [
      7,
      15
    ]
  },
  "post": {
    "motion": [
      2,
      7,
      8
    ],
    "motion3": [
      6
    ]
  },
  "donald": {
    "motion2": [
      11,
      13
    ],
    "motion3": [
      2
    ]
  }
};
// These authored cells were cropped before packing (the blank atlas margin
// cannot reveal the missing raised hand / head). Visually inspected ext3 sheets.
for (const id of ["jez", "benny"]) CLIPPED_CELLS[id]["unified-ext3"] = [3, 9, 14];
export function clippedCell(id, bank, frame) { return CLIPPED_CELLS[id]?.[bank]?.includes(frame) || false; }
