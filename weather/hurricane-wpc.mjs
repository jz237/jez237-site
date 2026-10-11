// Inland cyclone advisories continue at WPC after the NHC handoff. The NWS
// product API supplies the official text with browser CORS support.
import { MAX_AGE, advisoryRank, buildStorms, forecastTime, validateForecastCollection } from './hurricane-data.mjs?v=20261010-10';

export const WPC_INDEX = 'https://api.weather.gov/products/types/TCM';
const UUID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const WMO = /^WT(?:NT|PZ|PA)2[1-5]$/;
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const TYPES = { 'POST-TROPICAL CYCLONE':'PTC', 'REMNANT LOW':'LO', 'TROPICAL DEPRESSION':'TD', 'TROPICAL STORM':'TS', HURRICANE:'HU' };
const empty = () => ({type:'FeatureCollection',features:[]});
const failure = () => new Error('WPC returned an incomplete or unrecognized cyclone advisory.');

function coordinates(text) {
  const match = text.match(/(?:^|\s)(\d{1,2}(?:\.\d+)?)([NS])\s+(\d{1,3}(?:\.\d+)?)([EW])(?:\s|$|\.)/);
  if (!match || +match[1] > 90 || +match[3] > 180) throw failure();
  return [+match[3] * (match[4] === 'W' ? -1 : 1), +match[1] * (match[2] === 'S' ? -1 : 1)];
}

function issueTime(text) {
  const match = text.match(/^(\d{2})(\d{2}) UTC \w{3} ([A-Z]{3}) (\d{1,2}) (\d{4})\s*$/m);
  if (!match || +match[1] > 23 || +match[2] > 59 || +match[4] < 1 || +match[4] > 31) throw failure();
  const month = MONTHS.indexOf(match[3]);
  const time = Date.UTC(+match[5], month, +match[4], +match[1], +match[2]);
  if (month < 0 || new Date(time).getUTCMonth() !== month) throw failure();
  return time;
}

function advisoryLabel(time) {
  const date = new Date(time), hour = date.getUTCHours();
  return `${hour % 12 || 12}${String(date.getUTCMinutes()).padStart(2,'0')} ${hour < 12 ? 'AM' : 'PM'} UTC ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getUTCDay()]} ${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()} ${date.getUTCFullYear()}`;
}

export function parseWpcForecast(product, now = Date.now()) {
  if (product?.issuingOffice !== 'KWNH' || product.productCode !== 'TCM' || !WMO.test(product.wmoCollectiveId) ||
      !UUID.test(product.id) || typeof product.productText !== 'string' || product.productText.length > 50000) throw failure();
  const text = product.productText.replace(/\r/g,'').toUpperCase();
  const title = text.match(/^(POST-TROPICAL CYCLONE|REMNANT LOW|TROPICAL DEPRESSION|TROPICAL STORM|HURRICANE) ([A-Z0-9][A-Z0-9 -]{0,60}) FORECAST\/ADVISORY NUMBER\s+(\d+[A-Z]?)\s*$/m);
  const id = text.match(/^NWS WEATHER PREDICTION CENTER[^\n]*\b((?:AL|EP|CP)\d{6})\s*$/m)?.[1]?.toLowerCase();
  if (!title || !id || advisoryRank(title[3]) < 0) throw failure();
  if (({WTNT:'al',WTPZ:'ep',WTPA:'cp'})[product.wmoCollectiveId.slice(0,4)] !== id.slice(0,2)) throw failure();
  const issuedAt = issueTime(text), publishedAt = Date.parse(product.issuanceTime);
  if (!Number.isFinite(publishedAt) || Math.abs(publishedAt-issuedAt) > 3*3600000 || issuedAt > now+3600000) throw failure();
  if (now-issuedAt > MAX_AGE) return empty();
  const initial = text.match(/^(?:(?:POST-TROPICAL|TROPICAL|SUBTROPICAL) CYCLONE )?CENTER LOCATED NEAR ([^\n]+?) AT (\d{1,2}\/\d{4})Z\s*$/m);
  if (!initial || forecastTime({validtime:initial[2],tau:0},issuedAt) !== issuedAt) throw failure();
  const initialCoordinates = coordinates(initial[1]);
  const header = text.split(/\n(?:FORECAST|OUTLOOK) VALID /)[0];
  const wind = header.match(/MAX SUSTAINED WINDS\s+(\d+) KT(?: WITH GUSTS TO\s+(\d+) KT)?/);
  const movement = header.match(/PRESENT MOVEMENT[^\n]*?OR\s+(\d{1,3}) DEGREES AT\s+(\d+) KT/);
  const pressure = header.match(/ESTIMATED MINIMUM CENTRAL PRESSURE\s+(\d+) MB/);
  const basin = id.slice(0,2), suffix = product.wmoCollectiveId.at(-1);
  const common = {
    idp_subset:id, stormname:title[2].trim().toLowerCase().replace(/\b[a-z]/g,c=>c.toUpperCase()), basin, advisnum:title[3], stormtype:TYPES[title[1]],
    advdate:advisoryLabel(issuedAt), idp_filedate:publishedAt, binnumber:`${basin === 'al' ? 'AT' : basin.toUpperCase()}${suffix}`,
    mslp:pressure ? +pressure[1] : null, tcdir:movement ? +movement[1] : null,
    tcspd:movement ? +movement[2] : /PRESENT MOVEMENT[^\n]*STATIONARY/.test(header) ? 0 : null,
    source_agency:'WPC', product_id:product.id
  };
  const feature = (point,tau,validtime,maxwind,gust,description='') => ({type:'Feature',geometry:{type:'Point',coordinates:point},properties:{...common,tau,validtime,maxwind,gust,tcdvlp:description,stormtype:/POST-TROP/.test(description) ? 'PTC' : /REMNANT/.test(description) ? 'LO' : common.stormtype}});
  const features = [feature(initialCoordinates,0,initial[2],wind ? +wind[1] : null,wind?.[2] ? +wind[2] : null)];
  let lastTime = issuedAt, ended = false;
  const blocks = [...text.matchAll(/^(?:FORECAST|OUTLOOK) VALID (\d{1,2}\/\d{4})Z([^\n]*)(?:\n(MAX WIND[^\n]*))?/gm)];
  if (blocks.length !== (text.match(/^(?:FORECAST|OUTLOOK) VALID\b/gm) || []).length) throw failure();
  for (const block of blocks) {
    const time = forecastTime({validtime:block[1],tau:24},issuedAt);
    if (!Number.isFinite(time) || time <= lastTime || time-issuedAt > 7*86400000 || ended) throw failure();
    lastTime = time;
    if (/\.\.\.DISSIPATED\s*$/.test(block[2])) { ended=true; features[0].properties.dissipated_at=time; continue; }
    const point = coordinates(block[2]);
    const forecastWind = (block[3] || '').match(/MAX WIND\s+(\d+) KT(?:\.\.\.GUSTS\s+(\d+) KT)?/);
    features.push(feature(point,(time-issuedAt)/3600000,block[1],forecastWind ? +forecastWind[1] : null,forecastWind?.[2] ? +forecastWind[2] : null,block[2].split('...')[1] || ''));
  }
  return validateWpcCollection({type:'FeatureCollection',features});
}

export function validateWpcCollection(data) {
  validateForecastCollection(data);
  for (const feature of data.features) {
    const p = feature.properties;
    if (p.source_agency !== 'WPC' || !UUID.test(p.product_id) || !Object.values(TYPES).includes(p.stormtype) ||
        (p.dissipated_at !== undefined && (!Number.isFinite(p.dissipated_at) || p.dissipated_at < 0))) throw failure();
  }
  return data;
}

export async function fetchWpcForecasts(fetcher = fetch, now = Date.now()) {
  const signal = AbortSignal.timeout(16000);
  const get = async url => {
    const response = await fetcher(url,{signal,cache:'no-cache',credentials:'omit'});
    if (!response.ok) throw new Error(`WPC advisory feed: HTTP ${response.status}`);
    return response.json();
  };
  const index = await get(WPC_INDEX);
  if (!Array.isArray(index?.['@graph'])) throw failure();
  const latest = new Map();
  for (const item of index['@graph']) {
    if (!WMO.test(item?.wmoCollectiveId) || item.productCode !== 'TCM') continue;
    const time = Date.parse(item.issuanceTime);
    if (!Number.isFinite(time) || time > now+3600000) throw failure();
    if (now-time > MAX_AGE+3600000) continue;
    const previous = latest.get(item.wmoCollectiveId);
    if (!previous || time > Date.parse(previous.issuanceTime)) latest.set(item.wmoCollectiveId,item);
  }
  const products = [...latest.values()].filter(item => item.issuingOffice === 'KWNH');
  const collections = await Promise.all(products.map(async item => {
    if (!UUID.test(item.id)) throw failure();
    // Construct the URL from a validated ID; never follow an arbitrary feed URL.
    const product = await get(`https://api.weather.gov/products/${item.id}`);
    if (product?.id !== item.id || product?.wmoCollectiveId !== item.wmoCollectiveId) throw failure();
    return parseWpcForecast(product,now);
  }));
  return validateWpcCollection({type:'FeatureCollection',features:collections.flatMap(data=>data.features)});
}

export function combinedStorms(nhc, wpc, now = Date.now()) {
  const storms = new Map(buildStorms(nhc,now).map(storm=>[storm.id,storm]));
  for (const storm of buildStorms(wpc,now)) {
    const previous = storms.get(storm.id);
    if (!previous || storm.issuedAt > previous.issuedAt ||
        (storm.issuedAt === previous.issuedAt && advisoryRank(storm.advisory) > advisoryRank(previous.advisory))) storms.set(storm.id,storm);
  }
  return [...storms.values()].sort((a,b)=>(b.current.wind??-1)-(a.current.wind??-1)||a.name.localeCompare(b.name));
}
