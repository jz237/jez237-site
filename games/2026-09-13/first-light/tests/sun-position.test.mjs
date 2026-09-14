import test from 'node:test';import assert from 'node:assert/strict';
import {sunPosition,sunEvents,sunDirection,NOCKAMIXON} from '../sun-position.js';
const {lat,lon}=NOCKAMIXON;
test('solar noon elevation matches the latitude on equinox and solstices',()=>{
 const noonUTC=(y,m,d)=>sunEvents(Date.UTC(y,m-1,d,16),lat,lon).noon;
 assert.ok(Math.abs(sunPosition(noonUTC(2026,3,20),lat,lon).trueElevation-(90-lat))<.6);
 assert.ok(Math.abs(sunPosition(noonUTC(2026,6,21),lat,lon).trueElevation-(90-lat+23.44))<.4);
 assert.ok(Math.abs(sunPosition(noonUTC(2026,12,21),lat,lon).trueElevation-(90-lat-23.44))<.4);
});
test('day length is twelve hours at the equinox and the sun rises in the east',()=>{
 const e=sunEvents(Date.UTC(2026,2,20,16),lat,lon);const hours=(e.sunset-e.sunrise)/3600000;
 assert.ok(Math.abs(hours-12.15)<.2,'equinox day length '+hours);
 const az=sunPosition(e.sunrise,lat,lon).azimuth;assert.ok(Math.abs(az-90)<3,'sunrise azimuth '+az);
});
test('June solstice sunrise at Nockamixon is about 05:31 EDT',()=>{
 const e=sunEvents(Date.UTC(2026,5,21,16),lat,lon);
 const local=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hourCycle:'h23',hour:'numeric',minute:'numeric'}).formatToParts(new Date(e.sunrise));
 const h=Number(local.find(p=>p.type==='hour').value),m=Number(local.find(p=>p.type==='minute').value);
 assert.ok(Math.abs(h*60+m-(5*60+31))<=5,'sunrise '+h+':'+m);
});
test('sun direction is a unit vector pointing up by day and down at night',()=>{
 const day=sunDirection(Date.UTC(2026,8,13,17),lat,lon),night=sunDirection(Date.UTC(2026,8,13,6),lat,lon);
 for(const d of [day,night])assert.ok(Math.abs(Math.hypot(d.x,d.y,d.z)-1)<1e-6);
 assert.ok(day.y>.5&&night.y<0);
 assert.ok(day.z>0,'a September noon sun stands to the south (+z)');
});
