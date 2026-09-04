/**
 * Simulated sun and weather — the pure half.
 *
 * `sunPosition` is the standard low-precision solar position (declination
 * and equation of time from the day of the year, hour angle from clock
 * time), good to about half a degree, which is far finer than a light slider.
 * `effectiveLight` turns a state into the numbers the renderer uses: when the
 * time mode is "clock", the sun follows the date and clock; a weather preset
 * scales key light, fill, haze, glow and water. Everything here is a
 * simulation for a map; it is not a forecast and not an ephemeris.
 */

const DEG = Math.PI / 180;

/** Philadelphia City Hall, and the Eastern time zone. */
export const PHILADELPHIA = Object.freeze({ lat: 39.9526, lon: -75.1635 });

export const WEATHERS = ['clear', 'haze', 'overcast', 'rain', 'fog'];

/**
 * Multipliers per weather preset. `haze` scales the fog-density slider (the
 * atmosphere's optical depth), `key` the sun, `fill` the ambient, `glow` the
 * bloom, `water` the water intensity; `sky` dims the sky's sun disc.
 */
export const WEATHER_PRESETS = Object.freeze({
  clear: { haze: 1, key: 1, fill: 1, glow: 1, water: 1, sky: 1, label: 'Clear' },
  haze: { haze: 1.9, key: 0.85, fill: 1.1, glow: 1.1, water: 0.9, sky: 0.8, label: 'Haze' },
  overcast: { haze: 1.5, key: 0.4, fill: 1.5, glow: 0.5, water: 0.7, sky: 0.35, label: 'Overcast' },
  rain: { haze: 2.2, key: 0.3, fill: 1.3, glow: 0.4, water: 1.25, sky: 0.25, label: 'Rain' },
  fog: { haze: 3.2, key: 0.55, fill: 1.25, glow: 0.7, water: 0.6, sky: 0.5, label: 'Fog' },
});

/** US daylight saving time by day of year, close enough for a light slider. */
export function isDaylightSaving(dayOfYear) {
  // Second Sunday of March is day 67..73; first Sunday of November 305..311.
  return dayOfYear >= 70 && dayOfYear < 308;
}

/**
 * Sun azimuth (degrees clockwise from north) and altitude (degrees above the
 * horizon) for a day of the year (1..365) and a local clock hour (0..24) at a
 * latitude/longitude, with the clock in the given UTC offset. Defaults to
 * Philadelphia on Eastern time with DST applied by the calendar.
 */
export function sunPosition(dayOfYear, clockHour, place = PHILADELPHIA, utcOffsetHours = null) {
  const offset = utcOffsetHours ?? (isDaylightSaving(dayOfYear) ? -4 : -5);
  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1 + (clockHour - 12) / 24);
  // NOAA's low-precision series (radians / minutes).
  const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
    - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
    - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
  const timeOffset = eqTime + 4 * place.lon - 60 * offset;          // minutes
  const trueSolarMinutes = clockHour * 60 + timeOffset;
  const hourAngle = (trueSolarMinutes / 4 - 180) * DEG;
  const lat = place.lat * DEG;
  const cosZenith = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(hourAngle);
  const zenith = Math.acos(Math.min(1, Math.max(-1, cosZenith)));
  const altitude = 90 - zenith / DEG;
  let azimuth;
  const denom = Math.cos(lat) * Math.sin(zenith);
  if (Math.abs(denom) < 1e-9) {
    azimuth = 180;
  } else {
    const cosAz = (Math.sin(lat) * Math.cos(zenith) - Math.sin(decl)) / denom;
    const az = Math.acos(Math.min(1, Math.max(-1, cosAz))) / DEG;   // from south? no: NOAA form
    // NOAA: azimuth measured from north; the hour angle's sign picks the side.
    azimuth = hourAngle > 0 ? (az + 180) % 360 : (540 - az) % 360;
  }
  return { azimuth, altitude };
}

/** Hour of the day's solar noon (local clock), by bisection on the azimuth. */
export function solarNoon(dayOfYear, place = PHILADELPHIA) {
  let lo = 10;
  let hi = 15;
  for (let i = 0; i < 40; i += 1) {
    const mid = (lo + hi) / 2;
    if (sunPosition(dayOfYear, mid, place).azimuth < 180) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** A short date label for a day of the year (non-leap calendar). */
export function dayLabel(dayOfYear) {
  const months = [['Jan', 31], ['Feb', 28], ['Mar', 31], ['Apr', 30], ['May', 31], ['Jun', 30],
    ['Jul', 31], ['Aug', 31], ['Sep', 30], ['Oct', 31], ['Nov', 30], ['Dec', 31]];
  let d = Math.max(1, Math.min(365, Math.round(dayOfYear)));
  for (const [name, days] of months) {
    if (d <= days) return `${d} ${name}`;
    d -= days;
  }
  return '31 Dec';
}

/** "17:30" for 17.5. */
export function clockLabel(hour) {
  const h = Math.floor(((hour % 24) + 24) % 24);
  const m = Math.round((hour - Math.floor(hour)) * 60) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * The light the renderer should use for a state. `bounds` gives the sun
 * altitude slider's range so a clock-driven sun never leaves what the shaders
 * were built for: below the horizon the key light fades to nothing over
 * civil twilight and the fill dims to a night level, while the altitude
 * itself is held at the slider's floor.
 */
export function effectiveLight(state, bounds = { altMin: 2, altMax: 90 }) {
  const weather = WEATHER_PRESETS[state.weather] || WEATHER_PRESETS.clear;
  const clock = state.timeMode === 'clock';
  let azimuth = state.sunAzimuth;
  let altitude = state.sunAltitude;
  let twilight = 1;
  let sun = null;
  if (clock) {
    sun = sunPosition(Number(state.dayOfYear) || 172, Number(state.clockHour) || 0);
    azimuth = ((sun.azimuth % 360) + 360) % 360;
    // Civil twilight: full light above +6°, dark below -6°.
    twilight = smoothstep(-6, 6, sun.altitude);
    altitude = Math.min(bounds.altMax, Math.max(bounds.altMin, sun.altitude));
  }
  const night = clock && sun.altitude < -6;
  return {
    sunAzimuth: azimuth,
    sunAltitude: altitude,
    trueAltitude: sun ? sun.altitude : altitude,
    keyLight: state.keyLight * weather.key * twilight,
    ambient: state.ambient * weather.fill * (0.35 + 0.65 * twilight),
    fogDensity: Math.min(1, state.fogDensity * weather.haze),
    glow: state.glow * weather.glow,
    waterIntensity: Math.min(1, state.waterIntensity * weather.water),
    skySun: weather.sky * twilight,
    twilight,
    night,
    weather: state.weather in WEATHER_PRESETS ? state.weather : 'clear',
    clock,
  };
}

function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
