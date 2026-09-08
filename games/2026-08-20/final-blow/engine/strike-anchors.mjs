// Measured visible fist / boot tips in the shipped 320px contact cells.
export const STRIKE_ANCHORS = {
  "jez": {
    "painted-flow:4": [
      307,
      101
    ],
    "painted-flow:12": [
      267,
      105
    ],
    "unified-ext3:13": [
      288,
      160
    ],
    "inbetween-unified-ext3:13": [
      284,
      149
    ]
  },
  "benny": {
    "painted-flow:4": [
      307,
      84
    ],
    "painted-flow:12": [
      278,
      105
    ],
    "unified-ext3:13": [
      310,
      135
    ],
    "inbetween-unified-ext3:13": [
      310,
      135
    ]
  },
  "alan": {
    "painted-flow:4": [
      283,
      128
    ],
    "painted-flow:12": [
      224,
      147
    ],
    "unified-ext3:13": [
      311,
      151
    ],
    "inbetween-unified-ext3:13": [
      311,
      151
    ]
  },
  "ali": {
    "painted-flow:4": [
      307,
      100
    ],
    "painted-flow:12": [
      258,
      116
    ],
    "unified-ext3:13": [
      307,
      155
    ],
    "inbetween-unified-ext3:13": [
      307,
      155
    ]
  },
  "commissioner": {
    "painted-flow:4": [
      300,
      89
    ],
    "painted-flow:12": [
      289,
      94
    ],
    "unified-ext3:13": [
      299,
      120
    ],
    "inbetween-unified-ext3:13": [
      299,
      120
    ]
  },
  "cyraxx": {
    "painted-flow:4": [
      301,
      83
    ],
    "painted-flow:12": [
      252,
      114
    ],
    "unified-ext3:13": [
      307,
      163
    ],
    "inbetween-unified-ext3:13": [
      307,
      163
    ]
  },
  "deathblow": {
    "painted-flow:4": [
      305,
      128
    ],
    "painted-flow:12": [
      252,
      152
    ],
    "unified-ext3:13": [
      307,
      166
    ],
    "inbetween-unified-ext3:13": [
      307,
      166
    ]
  },
  "devil": {
    "painted-flow:4": [
      279,
      162
    ],
    "painted-flow:12": [
      238,
      162
    ],
    "unified-ext3:13": [
      308,
      187
    ],
    "inbetween-unified-ext3:13": [
      308,
      187
    ]
  },
  "donald": {
    "painted-flow:4": [
      300,
      120
    ],
    "painted-flow:12": [
      209,
      151
    ],
    "unified-ext3:13": [
      307,
      142
    ],
    "inbetween-unified-ext3:13": [
      307,
      142
    ]
  },
  "post": {
    "painted-flow:4": [
      292,
      88
    ],
    "painted-flow:12": [
      262,
      108
    ],
    "unified-ext3:13": [
      307,
      159
    ],
    "inbetween-unified-ext3:13": [
      307,
      159
    ]
  }
};
// Project the calibrated pixel tip through the same feet-based transforms as
// the painted fighter. This is presentation data only; hit tests never read it.
export function projectStrikeTip(tip,{x,y,size,mirror=1,floor=0,motion={}}){
 const px=((tip[0]/320-.5)*size*(motion.scaleX??1))*mirror+(motion.offsetX||0);
 const py=(tip[1]/320-1)*size*(motion.scaleY??1)+floor+(motion.offsetY||0);
 const angle=motion.rotation||0,c=Math.cos(angle),s=Math.sin(angle);
 return {x:x+px*c-py*s,y:y+px*s+py*c};
}
