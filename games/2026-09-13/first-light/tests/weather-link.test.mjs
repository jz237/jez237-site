import test from 'node:test';import assert from 'node:assert/strict';
import {openMeteoUrl,mapOpenMeteo,toWeatherTarget,describeLive,LAKE} from '../weather-link.js';
const fixture={current:{time:'2026-09-14T06:00',temperature_2m:14.2,wind_speed_10m:3.1,wind_direction_10m:230,cloud_cover:62,precipitation:0,surface_pressure:1009.4},
 hourly:{time:['2026-09-14T00:00','01:00','02:00','03:00','04:00','05:00','06:00'],surface_pressure:[1012.1,1011.8,1011.5,1011.0,1010.6,1010.0,1009.4]}};
test('the request goes to Open-Meteo for the lake and the answer maps into the game',()=>{
 const u=openMeteoUrl();assert.ok(u.startsWith('https://api.open-meteo.com/v1/forecast?latitude='+LAKE.lat));assert.ok(/surface_pressure/.test(u)&&/wind_speed_unit=ms/.test(u)&&/past_hours=6/.test(u));
 const l=mapOpenMeteo(fixture);assert.equal(l.windMs,3.1);assert.equal(l.windFromDeg,230);assert.equal(l.cloud,.62);assert.equal(l.rainMmH,0);assert.equal(l.pressureTrend,-1.6,'1009.4 minus 1011.0 three hours earlier');assert.equal(l.airTempC,14.2);
 const t=toWeatherTarget(l);assert.ok(t.wind>.38&&t.wind<.39);assert.equal(t.from,230);assert.equal(t.rain,0);assert.equal(t.pressureTrend,-1.6);assert.equal(t.label,'Light breeze, partly cloudy · pressure falling fast · live');
 assert.equal(describeLive({windMs:0,cloud:0,rainMmH:0,pressureTrend:0}),'Calm, clear · pressure steady · live');assert.equal(describeLive({windMs:9,cloud:.9,rainMmH:1.2,pressureTrend:1}),'Windy, rain · pressure rising · live');
});
test('a thin or broken answer still maps to something sane',()=>{
 const l=mapOpenMeteo({});assert.equal(l.windMs,0);assert.equal(l.pressureTrend,0);assert.equal(l.at,null);
 const t=toWeatherTarget(mapOpenMeteo({current:{wind_speed_10m:40,precipitation:20,cloud_cover:250}}));assert.equal(t.wind,1);assert.equal(t.rain,1);assert.equal(t.cloud,1);
});
