// The Hidden Reef — shared catalog helpers

(function() {
  'use strict';

  const knownBrands = [
    'Aqua One',
    'Aqua Ultraviolet',
    'Aquael',
    'Aquaillumination',
    'Aquascape',
    'Aquatop',
    'Aqueon',
    'API',
    'Advatec Int.',
    'Anjon Manufacturing',
    'Aquatic Life',
    'Blue Ribbon',
    'Carib Sea',
    'Cepex',
    'Co2 Art',
    'Coralife',
    'Danner',
    'Dennerle',
    'Dymax',
    'EcoTech Marine',
    'Eheim',
    'Eshopps',
    'Evolution Aqua',
    'Exo Terra',
    'Flipper',
    'Fluker Farm',
    'Fluval',
    'Fritz Aquatics',
    'GloFish',
    'Hanna Instruments',
    'Hikari',
    'Hygger',
    'IceCap',
    'Innovative Marine',
    'Instant Ocean',
    'Ista',
    'JBJ',
    'Komodo',
    'Kordon',
    "Lee's",
    'Level One Pets',
    'LifegardAquatics',
    'Loc-Line',
    'Laguna',
    'Marina',
    'Marineland',
    'Maxspect',
    'Microbe-Lift',
    'Neptune System',
    'New Life Spectrum',
    'Northfin',
    'Nyos',
    'Oase',
    'Ocean Nutrition',
    'Omega One',
    'Oatey',
    'Penn Plax',
    'PolypLab',
    'PondMaster',
    'Pro Clear',
    'Python',
    'Rep-Cal',
    'Red Sea',
    'Reef Factory',
    'Reef Octopus',
    'Ruby Reef',
    'Salifert',
    'San Francisco',
    'San Francisco Bay',
    'Seachem',
    'Sera',
    'Sicce',
    'Summit',
    'Tetra Pond',
    'Tetra',
    'Tideline',
    'Tunze',
    'Two Little Fishies',
    'Ultralife',
    'Ultum Nature System',
    'Underwater Treasures',
    'Vetericyn',
    'Xtreme Aquatics',
    'Zilla',
    'Zoo Med'
  ].sort((a, b) => b.length - a.length);

  const aliases = new Map([
    ['advatec int', 'Advatec Int.'],
    ['ai', 'Aquaillumination'],
    ['aqua one', 'Aqua One'],
    ['carib', 'Carib Sea'],
    ['co2art', 'Co2 Art'],
    ['ecotech', 'EcoTech Marine'],
    ['fritz', 'Fritz Aquatics'],
    ['hanna', 'Hanna Instruments'],
    ['neptune', 'Neptune System'],
    ['omega', 'Omega One'],
    ['penn', 'Penn Plax'],
    ['reef', 'Reef Factory'],
    ['san', 'San Francisco'],
    ['underwater', 'Underwater Treasures'],
    ['xtreme', 'Xtreme Aquatics']
  ]);

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/&amp;/g, '&')
      .replace(/[^a-z0-9&]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
  }

  function startsWithBrand(productName, brand) {
    const normalizedName = normalize(productName);
    const normalizedBrand = normalize(brand);
    return normalizedName === normalizedBrand || normalizedName.startsWith(normalizedBrand + ' ');
  }

  function extractBrand(name) {
    if (!name) return '';
    const normalized = normalize(name);
    const firstWord = normalized.split(' ')[0] || '';
    const alias = aliases.get(firstWord);
    if (alias && startsWithBrand(name, alias)) return alias;
    return knownBrands.find(brand => startsWithBrand(name, brand)) || '';
  }

  const THR = window.THR || {};
  THR.catalogBrands = knownBrands.slice().sort((a, b) => a.localeCompare(b));
  THR.extractBrand = extractBrand;
  window.THR = THR;
})();
