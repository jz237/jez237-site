const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const context={window:{}};
vm.runInNewContext(readFileSync(require('node:path').join(__dirname,'../weather/weather-details.js'),'utf8'),context);
const d=context.window.WeatherDetails;

test('NWS card uses the matching daytime and overnight periods, including local UTC offsets',()=>{
 const daily={time:['2026-09-23'],temperature_2m_max:[90],temperature_2m_min:[80],precipitation_probability_max:[99],rain_sum:[.15],showers_sum:[.05]};
 const periods=[
  {startTime:'2026-09-22T18:00:00-07:00',isDaytime:false,temperature:50},
  {startTime:'2026-09-23T06:00:00-07:00',isDaytime:true,temperature:72,temperatureUnit:'F',shortForecast:'Partly Sunny',probabilityOfPrecipitation:{value:0}},
  {startTime:'2026-09-23T18:00:00-07:00',isDaytime:false,temperature:58,temperatureUnit:'F'}];
 const day=d.forecastDay('2026-09-23',daily,periods);
 assert.equal(day.high,72);assert.equal(day.low,58);assert.equal(day.chance,0);assert.equal(day.source,'NWS');assert.equal(day.rain,.2);
});
test('Missing NWS nighttime or probability stays unknown instead of borrowing Open-Meteo data',()=>{
 const day=d.forecastDay('2026-09-23',{time:['2026-09-23'],temperature_2m_min:[80]},[{startTime:'2026-09-23T06:00:00-04:00',isDaytime:true,temperature:20,temperatureUnit:'C'}]);
 assert.equal(day.high,68);assert.equal(day.low,null);assert.equal(day.chance,null);assert.equal(day.rain,null);
});
test('An early-morning overnight period is not paired with the next daytime high',()=>{
 const day=d.forecastDay('2026-09-23',{},[
  {startTime:'2026-09-23T01:00:00-04:00',isDaytime:false,temperature:50},
  {startTime:'2026-09-23T06:00:00-04:00',isDaytime:true,temperature:70},
  {startTime:'2026-09-23T18:00:00-04:00',isDaytime:false,temperature:58}]);
 assert.equal(day.low,58);
});
test('Open-Meteo fallback, dry weather and unavailable rainfall remain distinct',()=>{
 const day=d.forecastDay('2026-09-23',{time:['2026-09-23'],temperature_2m_max:[65],temperature_2m_min:[50],precipitation_probability_max:[0],rain_sum:[0],showers_sum:[0]},[]);
 assert.equal(day.source,'Open-Meteo');assert.equal(day.high,65);assert.equal(day.rain,0);
 assert.equal(d.inches(day.rain),'0.00 in');assert.equal(d.rainTotal(null,0),null);assert.equal(d.inches(null),'Unavailable');assert.equal(d.percent(null),'—');
});
test('Chart leaves gaps for missing data and exposes dates, units and hourly amounts',()=>{
 const chart=d.chart([{time:'11 PM',fullTime:'Tue 11 PM',temp:60,rain:0,amount:0},{time:'12 AM',fullTime:'Wed 12 AM',temp:null,rain:null,amount:null},{time:'1 AM',temp:58,rain:70,amount:.12}]);
 assert(!chart.includes('NaN'));assert(!chart.includes('Infinity'));
 assert(chart.includes('Wed 12 AM: —'));assert(chart.includes('0.12 in'));assert(chart.includes('type="range"'));assert(chart.includes('Rainfall Unavailable'));
});
test('Freshness ages actual successful retrieval timestamps, including cached and unknown data',()=>{
 const now=Date.parse('2026-09-22T14:00:00Z');
 assert.equal(d.age('2026-09-22T13:52:00Z',now),'8 minutes ago');
 assert.equal(d.age('2026-09-21T14:00:00Z',now),'1 day ago');assert.equal(d.age(undefined,now),'time unavailable');
});
