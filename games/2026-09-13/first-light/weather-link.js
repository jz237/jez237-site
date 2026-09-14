// Live weather for the lake from Open-Meteo (already allowed by the site's connect-src). Used only
// when the clock runs in real time and the player has left "Live weather" on. The fetch is the one
// impure line; the mapping into the game's weather target is pure and tested.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const LAKE={lat:40.46,lon:-75.23,name:'Lake Nockamixon'};
export function openMeteoUrl({lat,lon}=LAKE){return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,cloud_cover,precipitation,surface_pressure&hourly=surface_pressure&past_hours=6&forecast_hours=1&wind_speed_unit=ms&timezone=America%2FNew_York`;}
const num=v=>Number.isFinite(Number(v))?Number(v):0;
// current conditions plus the pressure trend over the last three hours (hPa)
export function mapOpenMeteo(json){
 const c=(json&&json.current)||{};const hp=(json&&json.hourly&&json.hourly.surface_pressure)||[];
 let trend=0;const i=hp.length-1;if(i>=3&&Number.isFinite(hp[i])&&Number.isFinite(hp[i-3]))trend=hp[i]-hp[i-3];
 return {windMs:num(c.wind_speed_10m),windFromDeg:num(c.wind_direction_10m),cloud:clamp(num(c.cloud_cover)/100,0,1),rainMmH:num(c.precipitation),pressureHpa:num(c.surface_pressure),pressureTrend:+trend.toFixed(2),airTempC:num(c.temperature_2m),at:c.time||null};
}
export function describeLive(l){
 const w=l.windMs<.8?'Calm':l.windMs<3.5?'Light breeze':l.windMs<7?'Breezy':'Windy';
 const sky=l.rainMmH>.2?'rain':l.cloud>.8?'overcast':l.cloud>.4?'partly cloudy':'clear';
 const p=l.pressureTrend<=-1.5?'pressure falling fast':l.pressureTrend<=-.5?'pressure falling':l.pressureTrend>=.8?'pressure rising':'pressure steady';
 return `${w}, ${sky} · ${p} · live`;
}
// the game's weather target: wind 0..1 (8 m/s = 1), from in degrees, cloud 0..1, rain 0..1
export function toWeatherTarget(l){return {wind:clamp(l.windMs/8,0,1),from:l.windFromDeg,cloud:l.cloud,rain:clamp(l.rainMmH/4,0,1),pressureTrend:l.pressureTrend,label:describeLive(l)};}
export async function fetchLive(fetchFn=globalThis.fetch){const r=await fetchFn(openMeteoUrl());if(!r.ok)throw new Error('weather '+r.status);return mapOpenMeteo(await r.json());}
