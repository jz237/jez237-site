import {restoreWetLookBytes} from './wet-look-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRainWeatherPrevious,restoreRainWeatherBytes,verifyRainWeatherRevision} from './rain-weather-invariants';
const source=(file:string)=>restoreWetLookBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RainWeather preserves every prior fixture, vehicle asset, venue art and history input',verifyRainWeatherRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rain-weather/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRainWeatherBytes(file,bytes),readRainWeatherPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRainWeatherBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRainWeatherBytes('src/unknown.ts',unknown),unknown);
});
