/**
 * Simulated sun: the solar position matches published Philadelphia values
 * within a degree or two, clock mode drives the light, night dims it, and
 * weather presets scale the atmosphere without leaving the shader ranges.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  sunPosition, solarNoon, effectiveLight, dayLabel, clockLabel, isDaylightSaving,
  WEATHER_PRESETS, WEATHERS,
} from '../src/solar.js';

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);

test('solar position', async (t) => {
  await t.test('summer solstice noon in Philadelphia is high and due south', () => {
    // 21 June: solar noon about 13:01 EDT, altitude 90 - 39.95 + 23.44 = 73.5°.
    const noon = solarNoon(172);
    near(noon, 13.02, 0.1, 'solar noon (EDT)');
    const sun = sunPosition(172, noon);
    near(sun.altitude, 73.5, 1, 'solstice altitude');
    near(sun.azimuth, 180, 1.5, 'noon azimuth');
  });

  await t.test('winter solstice noon is low; morning sun is in the south-east', () => {
    const noon = solarNoon(355);
    near(noon, 12.0, 0.15, 'solar noon (EST)');
    near(sunPosition(355, noon).altitude, 26.6, 1, 'winter altitude');
    const morning = sunPosition(355, 8.5);
    assert.ok(morning.azimuth > 115 && morning.azimuth < 140, `morning azimuth ${morning.azimuth}`);
    assert.ok(morning.altitude > 3 && morning.altitude < 14, `morning altitude ${morning.altitude}`);
  });

  await t.test('sunrise and sunset bracket the day; midnight is below the horizon', () => {
    // 21 June: sunrise ~05:32 EDT, sunset ~20:33 EDT.
    assert.ok(sunPosition(172, 5.3).altitude < 0 && sunPosition(172, 5.8).altitude > 0, 'sunrise');
    assert.ok(sunPosition(172, 20.3).altitude > 0 && sunPosition(172, 20.9).altitude < 0, 'sunset');
    assert.ok(sunPosition(172, 0).altitude < -20);
    assert.ok(sunPosition(172, 19).azimuth > 270 && sunPosition(172, 19).azimuth < 305, 'evening sun in the WNW');
    assert.ok(isDaylightSaving(172) && !isDaylightSaving(355));
  });

  await t.test('labels', () => {
    assert.equal(dayLabel(1), '1 Jan');
    assert.equal(dayLabel(172), '21 Jun');
    assert.equal(dayLabel(355), '21 Dec');
    assert.equal(dayLabel(365), '31 Dec');
    assert.equal(clockLabel(17.5), '17:30');
    assert.equal(clockLabel(0), '00:00');
    assert.equal(clockLabel(24), '00:00');
  });
});

test('effective light', async (t) => {
  const base = {
    timeMode: 'manual', weather: 'clear', sunAzimuth: 300, sunAltitude: 24,
    keyLight: 1, ambient: 0.5, fogDensity: 0.3, glow: 0.4, waterIntensity: 0.75,
    dayOfYear: 172, clockHour: 12,
  };

  await t.test('manual mode and clear weather pass the sliders through', () => {
    const l = effectiveLight(base);
    assert.equal(l.sunAzimuth, 300);
    assert.equal(l.sunAltitude, 24);
    assert.equal(l.keyLight, 1);
    assert.equal(l.fogDensity, 0.3);
    assert.equal(l.night, false);
    assert.equal(l.clock, false);
  });

  await t.test('clock mode follows the sun and stays inside the slider range', () => {
    const noon = effectiveLight({ ...base, timeMode: 'clock', dayOfYear: 172, clockHour: 13 },
      { altMin: 2, altMax: 80 });
    near(noon.sunAltitude, 73.5, 1.5, 'noon altitude');
    near(noon.sunAzimuth, 180, 3, 'noon azimuth');
    assert.equal(noon.keyLight, 1);
    const night = effectiveLight({ ...base, timeMode: 'clock', dayOfYear: 172, clockHour: 1 },
      { altMin: 2, altMax: 80 });
    assert.equal(night.sunAltitude, 2, 'held at the floor');
    assert.equal(night.keyLight, 0, 'no sun at night');
    assert.ok(night.ambient < base.ambient * 0.4 && night.ambient > 0, 'dim fill, not black');
    assert.equal(night.night, true);
    assert.ok(night.trueAltitude < -20);
    const dusk = effectiveLight({ ...base, timeMode: 'clock', dayOfYear: 172, clockHour: 20.4 });
    assert.ok(dusk.keyLight > 0 && dusk.keyLight < 1, `twilight key ${dusk.keyLight}`);
  });

  await t.test('weather scales the atmosphere and clamps to the shader ranges', () => {
    for (const w of WEATHERS) assert.ok(WEATHER_PRESETS[w], `${w} defined`);
    const fog = effectiveLight({ ...base, weather: 'fog' });
    assert.ok(fog.fogDensity > base.fogDensity * 2.5 && fog.fogDensity <= 1);
    assert.ok(fog.keyLight < 1);
    const rain = effectiveLight({ ...base, weather: 'rain', waterIntensity: 0.95 });
    assert.equal(rain.waterIntensity, 1, 'clamped');
    assert.ok(rain.keyLight < 0.5 && rain.skySun < 0.5);
    const junk = effectiveLight({ ...base, weather: 'sleet' });
    assert.equal(junk.weather, 'clear');
    assert.equal(junk.keyLight, 1);
  });
});
