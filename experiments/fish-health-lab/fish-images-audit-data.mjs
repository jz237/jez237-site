// Picture audit (Jez, Nov 6 2026 20:12 "do one and two"): freshwater scrape pictures (new ids) and
// redraws of result pictures a visual review flagged (garbled gills/mouths, not tilted, spiky
// scales). A redraw replaces the published crop with the same id. Uploaded to R2 and byte-verified;
// provenance in scripts/fish-health-lab/audit-images-20261106.json.
export const IMAGE_SOURCE = 'media';
export const CROPS = {
  "betta-scrape": {
    "key": "experiments/fish-health-lab/audit/fish-betta-scrape-191ff635696e.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Pale betta with a small fresh scrape on its side where a few scales are rubbed off.",
    "set": "fish"
  },
  "goldfish-scrape": {
    "key": "experiments/fish-health-lab/audit/fish-goldfish-scrape-c7f57245d873.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Comet goldfish with a small fresh scrape on its side where a few scales are rubbed off.",
    "set": "fish"
  },
  "guppy-scrape": {
    "key": "experiments/fish-health-lab/audit/fish-guppy-scrape-24543e1ac06f.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Female guppy with a small fresh scrape on its side where a few scales are rubbed off.",
    "set": "fish"
  },
  "molly-scrape": {
    "key": "experiments/fish-health-lab/audit/fish-molly-scrape-77adb749afc5.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Orange platy with a small fresh scrape on its side where a few scales are rubbed off.",
    "set": "fish"
  },
  "community-scrape": {
    "key": "experiments/fish-health-lab/audit/fish-community-scrape-bb9db6ca0b8e.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Cardinal tetra with a small fresh scrape on its side where a few scales are rubbed off.",
    "set": "fish"
  },
  "barb-scrape": {
    "key": "experiments/fish-health-lab/audit/fish-barb-scrape-7e7a8d6a20d0.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Gold barb with a small fresh scrape on its side where a few scales are rubbed off.",
    "set": "fish"
  },
  "gourami-scrape": {
    "key": "experiments/fish-health-lab/audit/fish-gourami-scrape-a0b2d3660b27.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Dwarf gourami with a small fresh scrape on its side where a few scales are rubbed off.",
    "set": "fish"
  },
  "angelfish-scrape": {
    "key": "experiments/fish-health-lab/audit/fish-angelfish-scrape-c7386a45562e.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Discus with a small fresh scrape on its side where a few scales are rubbed off.",
    "set": "fish"
  },
  "african-scrape": {
    "key": "experiments/fish-health-lab/audit/fish-african-scrape-f7d6d625858c.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Oscar with a small fresh scrape on its side where a few scales are rubbed off.",
    "set": "fish"
  },
  "cory-scrape": {
    "key": "experiments/fish-health-lab/audit/fish-cory-scrape-741309f20841.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Bronze cory with a small fresh scrape along its side plates.",
    "set": "fish"
  },
  "pleco-scrape": {
    "key": "experiments/fish-health-lab/audit/fish-pleco-scrape-7dc2a6777f62.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Bristlenose pleco with a small fresh scrape on its side.",
    "set": "fish"
  },
  "barb-breathing": {
    "key": "experiments/fish-health-lab/audit/fish-barb-breathing-13614c3cce23.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Tiger barb gasping at the water surface.",
    "set": "fish"
  },
  "cichlid-breathing": {
    "key": "experiments/fish-health-lab/audit/fish-cichlid-breathing-8d7b45e38829.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Blue discus gasping at the water surface.",
    "set": "fish"
  },
  "african-breathing": {
    "key": "experiments/fish-health-lab/audit/fish-african-breathing-9a33dc7779fb.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Tiger oscar gasping at the water surface.",
    "set": "fish"
  },
  "african-red-gills": {
    "key": "experiments/fish-health-lab/audit/fish-african-red-gills-49970f8c3b7e.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Close view of an oscar with its gill cover lifted, showing bright red gills.",
    "set": "fish"
  },
  "catfish-red-gills": {
    "key": "experiments/fish-health-lab/audit/fish-catfish-red-gills-508bf06e9041.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Close view of a cory catfish with its gill cover lifted, showing bright red gills.",
    "set": "fish"
  },
  "pleco-red-gills": {
    "key": "experiments/fish-health-lab/audit/fish-pleco-red-gills-bf90f74da752.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Close view of a pleco with its gill cover lifted, showing bright red gills.",
    "set": "fish"
  },
  "clownfish-breathing": {
    "key": "experiments/fish-health-lab/audit/fish-clownfish-breathing-9b44316c29e4.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Ocellaris clownfish breathing hard near the surface, gills flared.",
    "set": "fish"
  },
  "tang-breathing": {
    "key": "experiments/fish-health-lab/audit/fish-tang-breathing-cf717c178a21.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Powder blue tang breathing hard near the surface, gills flared.",
    "set": "fish"
  },
  "angel-breathing": {
    "key": "experiments/fish-health-lab/audit/fish-angel-breathing-504ff6f2f2db.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Flame angel breathing hard near the surface, gills flared.",
    "set": "fish"
  },
  "wrasse-breathing": {
    "key": "experiments/fish-health-lab/audit/fish-wrasse-breathing-6ca88a7a96af.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Cleaner wrasse breathing hard near the surface, gills flared.",
    "set": "fish"
  },
  "dottyback-breathing": {
    "key": "experiments/fish-health-lab/audit/fish-dottyback-breathing-9ee44f36df52.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Royal gramma breathing hard near the surface, gills flared.",
    "set": "fish"
  },
  "clownfish-velvet": {
    "key": "experiments/fish-health-lab/audit/fish-clownfish-velvet-b75dd00aaefe.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Close view of a black ocellaris clownfish with a fine gold dust over its body and fins.",
    "set": "fish"
  },
  "angel-velvet": {
    "key": "experiments/fish-health-lab/audit/fish-angel-velvet-4e271de59d1b.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Close view of a coral beauty angelfish with a fine gold dust over its body and fins.",
    "set": "fish"
  },
  "wrasse-velvet": {
    "key": "experiments/fish-health-lab/audit/fish-wrasse-velvet-f3cdc01d82a6.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Close view of a six-line wrasse with a fine gold dust over its body and fins.",
    "set": "fish"
  },
  "goby-velvet": {
    "key": "experiments/fish-health-lab/audit/fish-goby-velvet-78a022cfe021.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Close view of a lawnmower blenny with a fine gold dust over its body and fins.",
    "set": "fish"
  },
  "damsel-velvet": {
    "key": "experiments/fish-health-lab/audit/fish-damsel-velvet-2cbface0608e.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Close view of a yellowtail damsel with a fine gold dust over its body and fins.",
    "set": "fish"
  },
  "dottyback-velvet": {
    "key": "experiments/fish-health-lab/audit/fish-dottyback-velvet-099c4b0130b9.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Close view of an orchid dottyback with a fine gold dust over its body and fins.",
    "set": "fish"
  },
  "pleco-swollen": {
    "key": "experiments/fish-health-lab/audit/fish-pleco-swollen-26c03eca202e.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Bristlenose pleco on the glass with a round swollen belly.",
    "set": "fish"
  },
  "betta-balance": {
    "key": "experiments/fish-health-lab/audit/fish-betta-balance-1b57a61e27ca.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Orange betta floating tilted on its side near the surface.",
    "set": "fish"
  },
  "molly-balance": {
    "key": "experiments/fish-health-lab/audit/fish-molly-balance-b86fbb0552c8.jpg",
    "width": 543,
    "height": 724,
    "alt": "AI illustration: Black molly floating upside down near the surface, unable to right itself.",
    "set": "fish"
  },
  "livebearer-dropsy": {
    "key": "experiments/fish-health-lab/audit/fish-livebearer-dropsy-5da1276b4395.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Swollen orange platy with scales sticking out like a pinecone.",
    "set": "fish"
  },
  "catfish-flukes": {
    "key": "experiments/fish-health-lab/audit/fish-catfish-flukes-206599a27439.jpg",
    "width": 362,
    "height": 362,
    "alt": "AI illustration: Bronze cory catfish rubbing its side against a rock.",
    "set": "fish"
  },
  "clownfish-scrape": {
    "key": "experiments/fish-health-lab/audit/fish-clownfish-scrape-7b76774b4812.jpg",
    "width": 444,
    "height": 444,
    "alt": "AI illustration: Ocellaris clownfish with a small fresh scrape on its side where a few scales are rubbed off.",
    "set": "fish"
  },
  "damsel-scrape": {
    "key": "experiments/fish-health-lab/audit/fish-damsel-scrape-e1a145f78672.jpg",
    "width": 443,
    "height": 444,
    "alt": "AI illustration: Yellowtail damsel with a small fresh scrape on its side where a few scales are rubbed off.",
    "set": "fish"
  },
  "guppy-cloudy-eye": {
    "key": "experiments/fish-health-lab/audit/fish-guppy-cloudy-eye-527b2df590c3.jpg",
    "width": 443,
    "height": 444,
    "alt": "AI illustration: Female guppy whose eye is covered by a flat milky film.",
    "set": "fish"
  },
  "goldfish-cloudy-eye": {
    "key": "experiments/fish-health-lab/audit/fish-goldfish-cloudy-eye-16e4d7106fb2.jpg",
    "width": 444,
    "height": 444,
    "alt": "AI illustration: Oranda goldfish with a milky film over one eye.",
    "set": "fish"
  },
  "community-cloudy-eye": {
    "key": "experiments/fish-health-lab/audit/fish-community-cloudy-eye-350af4a61869.jpg",
    "width": 444,
    "height": 443,
    "alt": "AI illustration: Cardinal tetra with a milky film over one eye.",
    "set": "fish"
  },
  "sign-lps-closed": {
    "key": "experiments/fish-health-lab/audit/coral-sign-lps-closed-68e47285ca18.jpg",
    "width": 444,
    "height": 443,
    "alt": "AI illustration: A hammer coral pulled in tight, its flesh still covering the skeleton, no tentacles out.",
    "set": "coral",
    "caption": "Pulled in tight; the flesh still covers the skeleton."
  }
};
