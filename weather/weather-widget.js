(() => {
  const DEFAULT_PLACE = { name: 'Philadelphia', lat: 40.0607, lon: -75.0802, zip: '19111' };
  let TZ = 'America/New_York';
  const STORAGE_KEY = 'jez237-weather-place-v1';
  const CACHE_KEY_PREFIX = 'jez237-weather-cache-v2:';
  const details = window.WeatherDetails;
  details.almanac();
  let mapLayer = 'radar';
  const REFRESH_INTERVAL = 10 * 60 * 1000;
  let displayedBundle = null;
  let requestVersion = 0;
  let loading = false;
  let lastAttempt = 0;
  const root = document.getElementById('philly-weather-widget');
  if (!root) return;

  const codeMap = {
    0: ['☀️', 'Sunny'],
    1: ['🌤️', 'Mostly sun'],
    2: ['⛅', 'Partly cloudy'],
    3: ['☁️', 'Cloudy'],
    45: ['🌫️', 'Fog'],
    48: ['🌫️', 'Fog'],
    51: ['🌦️', 'Light drizzle'],
    53: ['🌦️', 'Drizzle'],
    55: ['🌧️', 'Heavy drizzle'],
    61: ['🌧️', 'Light rain'],
    63: ['🌧️', 'Rain'],
    65: ['🌧️', 'Heavy rain'],
    71: ['🌨️', 'Light snow'],
    73: ['🌨️', 'Snow'],
    75: ['❄️', 'Heavy snow'],
    80: ['🌦️', 'Showers'],
    81: ['🌧️', 'Showers'],
    82: ['⛈️', 'Heavy showers'],
    95: ['⛈️', 'Storms'],
    96: ['⛈️', 'Storms'],
    99: ['⛈️', 'Severe storms']
  };

  function weatherLabel(code) {
    return codeMap[Number(code)] || ['🌡️', 'Forecast'];
  }

  function conditionClass(code, rain = 0, wind = 0) {
    const n = Number(code);
    if ([95, 96, 99].includes(n) || wind >= 22) return 'stormy';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(n) || rain >= 55) return 'rainy';
    if ([71, 73, 75].includes(n)) return 'snowy';
    if ([45, 48].includes(n)) return 'foggy';
    if ([2, 3].includes(n)) return 'cloudy';
    if ([0, 1].includes(n)) return 'sunny';
    return 'neutral';
  }

  function aqiInfo(aqi) {
    if (aqi == null || Number.isNaN(Number(aqi))) return { text: 'Unknown', cls: 'unknown', pct: 0, advice: 'Air quality data unavailable.' };
    const n = Math.round(Number(aqi));
    if (n <= 50) return { text: `${n} Good`, cls: 'good', pct: Math.min(100, n / 3), advice: 'Fine for most people.' };
    if (n <= 100) return { text: `${n} Moderate`, cls: 'moderate', pct: 35 + (n - 51) * 0.65, advice: 'Okay for most; sensitive people may notice it.' };
    if (n <= 150) return { text: `${n} Sensitive`, cls: 'sensitive', pct: 68 + (n - 101) * 0.5, advice: 'Sensitive groups should take it easier.' };
    return { text: `${n} Unhealthy`, cls: 'unhealthy', pct: 96, advice: 'Limit long outdoor exertion.' };
  }

  function pollutantLabel(kind, value) {
    if (!Number.isFinite(value)) return 'n/a';
    if (kind === 'pm2_5') {
      const label = value <= 9 ? 'low/good' : value <= 35.4 ? 'moderate' : value <= 55.4 ? 'high for sensitive people' : 'high';
      return `${value.toFixed(1)} µg/m³ (${label})`;
    }
    if (kind === 'ozone') {
      const label = value <= 100 ? 'low/good' : value <= 160 ? 'moderate' : value <= 200 ? 'high for sensitive people' : 'high';
      return `${Math.round(value)} µg/m³ (${label})`;
    }
    return String(value);
  }

  function windDir(degrees) {
    if (degrees == null) return '';
    if (typeof degrees === 'string') return degrees;
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.floor(((Number(degrees) % 360) + 11.25) / 22.5) % 16];
  }

  function codeFromForecast(text) {
    const value = String(text || '').toLowerCase();
    if (/thunder|storm/.test(value)) return 95;
    if (/snow|sleet|ice/.test(value)) return 73;
    if (/rain|shower/.test(value)) return 63;
    if (/drizzle/.test(value)) return 53;
    if (/fog|mist/.test(value)) return 45;
    if (/partly|mostly sunny/.test(value)) return 2;
    if (/sunny|clear/.test(value)) return 0;
    if (/cloud|overcast/.test(value)) return 3;
    return 3;
  }

  function parseWindSpeed(value) {
    const nums = String(value || '').match(/\d+/g)?.map(Number) || [];
    return nums.length ? Math.max(...nums) : 0;
  }

  function fmtDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: TZ });
  }

  function loadSavedPlace() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved?.lat && saved?.lon) return saved;
    } catch (_) {}
    return DEFAULT_PLACE;
  }

  function savePlace(place) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(place)); } catch (_) {}
  }

  function cacheKey(place) {
    return `${CACHE_KEY_PREFIX}${place?.zip || `${Number(place?.lat).toFixed(3)},${Number(place?.lon).toFixed(3)}`}`;
  }

  function saveWeatherCache(bundle) {
    try {
      localStorage.setItem(cacheKey(bundle.place), JSON.stringify({ ...bundle, cachedAt: new Date().toISOString() }));
    } catch (_) {}
  }

  function loadWeatherCache(place) {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey(place)) || 'null');
      if (cached?.weather?.current) return { ...cached, stale: true };
    } catch (_) {}
    return null;
  }

  function dayName(ts) {
    return new Date(`${ts}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' });
  }

  function nearestHourlyIndex(times) {
    const now = Date.now();
    const index = times.findIndex(ts => new Date(ts).getTime() + 3600000 > now);
    return index < 0 ? times.length : index;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[ch]));
  }

  async function fetchJson(url) {
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`${res.status} from ${url}`);
    return details.normalize(await res.json());
  }

  async function lookupZip(zip) {
    const clean = String(zip || '').trim().match(/^\d{5}$/)?.[0];
    if (!clean) throw new Error('Enter a 5-digit ZIP code.');
    const data = await fetchJson(`https://api.zippopotam.us/us/${clean}`);
    const place = data?.places?.[0];
    if (!place) throw new Error(`No location found for ${clean}.`);
    return {
      name: `${place['place name']}, ${place['state abbreviation']}`,
      lat: Number(place.latitude),
      lon: Number(place.longitude),
      zip: clean
    };
  }

  async function loadNwsWeatherBackup(points, dailyForecast) {
    if (!points?.properties?.forecastHourly || !points?.properties?.forecast) {
      throw new Error('NWS backup forecast unavailable.');
    }
    const hourlyForecast = await fetchJson(points.properties.forecastHourly);
    const hourlyPeriods = hourlyForecast?.properties?.periods || [];
    const dailyPeriods = dailyForecast?.properties?.periods || [];
    if (!hourlyPeriods.length) throw new Error('NWS backup hourly forecast unavailable.');
    const currentPeriod = hourlyPeriods[0];
    const dates = [...new Set(dailyPeriods.map(p => p.startTime.slice(0, 10)))].slice(0, 6);
    const days = dates.map(date => details.forecastDay(date, {}, dailyPeriods));
    return {
      source: 'NWS backup',
      current: {
        time: currentPeriod.startTime,
        temperature_2m: details.temperature(currentPeriod),
        apparent_temperature: null,
        weather_code: codeFromForecast(currentPeriod.shortForecast),
        cloud_cover: /cloud|overcast/i.test(currentPeriod.shortForecast || '') ? 80 : 35,
        pressure_msl: null,
        relative_humidity_2m: null,
        dew_point_2m: null,
        wind_speed_10m: parseWindSpeed(currentPeriod.windSpeed),
        wind_direction_10m: currentPeriod.windDirection,
        wind_gusts_10m: parseWindSpeed(currentPeriod.windSpeed)
      },
      hourly: {
        time: hourlyPeriods.map(p => p.startTime),
        temperature_2m: hourlyPeriods.map(details.temperature),
        apparent_temperature: hourlyPeriods.map(() => null),
        precipitation_probability: hourlyPeriods.map(p => p.probabilityOfPrecipitation?.value ?? null),
        weather_code: hourlyPeriods.map(p => codeFromForecast(p.shortForecast)),
        cloud_cover: hourlyPeriods.map(p => /cloud|overcast/i.test(p.shortForecast || '') ? 80 : 35),
        pressure_msl: hourlyPeriods.map(() => null),
        wind_speed_10m: hourlyPeriods.map(p => parseWindSpeed(p.windSpeed)),
        wind_direction_10m: hourlyPeriods.map(p => p.windDirection),
        wind_gusts_10m: hourlyPeriods.map(p => parseWindSpeed(p.windSpeed))
      },
      daily: {
        time: dates,
        weather_code: days.map(day => codeFromForecast(day.summary)),
        temperature_2m_max: days.map(day => day.high),
        temperature_2m_min: days.map(day => day.low),
        precipitation_probability_max: days.map(day => day.chance),
        sunrise: [],
        sunset: [],
        uv_index_max: []
      }
    };
  }

  async function loadWeather(place = loadSavedPlace()) {
    const lat = Number(place.lat);
    const lon = Number(place.lon);
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,dew_point_2m,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
      `&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,rain,showers` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max,rain_sum,showers_sum` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=6`;
    const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=us_aqi,pm2_5,ozone&timezone=auto&forecast_days=2`;
    const nwsUrl = `https://api.weather.gov/points/${lat},${lon}`;
    const alertsUrl = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;

    const pointsPromise = fetchJson(nwsUrl).catch(() => null);
    const forecastPromise = pointsPromise.then(points => points?.properties?.forecast ? fetchJson(points.properties.forecast) : null).catch(() => null);
    const alertsPromise = fetchJson(alertsUrl).catch(() => null);
    const weatherPromise = fetchJson(weatherUrl)
      .then(weather => ({ ...weather, source: 'Open-Meteo' }))
      .catch(async () => loadNwsWeatherBackup(await pointsPromise, await forecastPromise));
    const aqPromise = fetchJson(aqUrl).catch(() => ({ hourly: {}, unavailable: true }));
    const [weather, aq, points, alerts, forecast] = await Promise.all([
      weatherPromise,
      aqPromise,
      pointsPromise,
      alertsPromise,
      forecastPromise
    ]);
    const timezone = points?.properties?.timeZone || weather.timezone || 'America/New_York';
    const forecastPeriods = forecast?.properties?.periods || [];
    const todayKey = localDateKey(new Date(), timezone);
    const todayPeriod = forecastPeriods.find(p => p.isDaytime && p.startTime.slice(0, 10) === todayKey) || null;
    const tonightPeriod = forecastPeriods.find(p => p.isDaytime === false) || null;
    const bundle = { weather, aq, timezone, fetchedAt: new Date().toISOString(), forecastIssuedAt: forecast?.properties?.updateTime || null, todayPeriod, tonightPeriod, forecastPeriods, alerts, place, source: weather.source || 'Open-Meteo', stale: false };
    saveWeatherCache(bundle);
    return bundle;
  }

  function alertTone(alert) {
    const severity = String(alert?.properties?.severity || '').toLowerCase();
    const event = String(alert?.properties?.event || '').toLowerCase();
    if (severity === 'extreme' || severity === 'severe' || /warning|tornado|flood|severe thunderstorm/.test(event)) return 'danger';
    if (severity === 'moderate' || /watch|advisory|statement/.test(event)) return 'watch';
    return 'info';
  }

  function alertParagraphs(text) {
    return String(text || '')
      .split(/\n{2,}/)
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => `<p>${escapeHtml(part.replace(/\n/g, ' '))}</p>`)
      .join('');
  }

  function renderAlerts(alerts, place) {
    const features = (alerts?.features || []).slice(0, 3);
    if (!features.length) return '';
    const lat = Number(place?.lat ?? DEFAULT_PLACE.lat).toFixed(4);
    const lon = Number(place?.lon ?? DEFAULT_PLACE.lon).toFixed(4);
    const nwsHref = `https://forecast.weather.gov/MapClick.php?lat=${lat}&lon=${lon}`;
    return `<div class="weather-alerts" aria-label="Active weather alerts">
      ${features.map(alert => {
        const props = alert.properties || {};
        const tone = alertTone(alert);
        const until = props.ends || props.expires;
        const untilText = until ? new Date(until).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ }) : '';
        const head = `<span>⚠️ ${escapeHtml(props.event || 'Weather alert')}</span>
          <strong>${escapeHtml(props.headline || props.description || 'Active weather alert.')}</strong>
          ${untilText ? `<em>Until ${untilText}</em>` : ''}`;
        const body = alertParagraphs([props.description, props.instruction].filter(Boolean).join('\n\n'));
        if (!body) return `<article class="weather-alert ${tone}">${head}</article>`;
        return `<details class="weather-alert ${tone}">
          <summary>${head}</summary>
          <div class="weather-alert-body">
            ${props.areaDesc ? `<p class="weather-alert-area">Areas: ${escapeHtml(props.areaDesc)}</p>` : ''}
            ${body}
            <p><a href="${escapeHtml(nwsHref)}" target="_blank" rel="noopener noreferrer">Full alert &amp; updates on weather.gov ↗</a></p>
          </div>
        </details>`;
      }).join('')}
    </div>`;
  }

  function fishingNote(hour) {
    const notes = [];
    if (hour.rain >= 55) notes.push('rain window');
    if (hour.wind >= 15 || hour.gust >= 22) notes.push('windy');
    if (hour.cloud >= 70) notes.push('low light');
    if (hour.rain < 25 && hour.wind < 12) notes.push('fishable');
    return notes.slice(0, 2).join(' · ') || 'steady';
  }

  function fishingScore(hour) {
    let score = 5;
    if (hour.cloud >= 60) score += 1;
    if (hour.rain > 0 && hour.rain <= 45) score += 1;
    if (hour.rain >= 70) score -= 2;
    if (hour.wind >= 8 && hour.wind <= 14) score += 1;
    if (hour.wind >= 18 || hour.gust >= 25) score -= 2;
    if (hour.pressureTrend === 'falling') score += 1;
    if (hour.pressureTrend === 'rising') score -= 1;
    if (hour.isGolden) score += 2;
    return Math.max(1, Math.min(10, score));
  }

  function pressureTrend(values, index) {
    if (values?.[index] == null || values?.[Math.max(0, index - 3)] == null) return 'unknown';
    const now = Number(values?.[index]);
    const earlier = Number(values?.[Math.max(0, index - 3)]);
    if (!Number.isFinite(now) || !Number.isFinite(earlier)) return 'unknown';
    const delta = now - earlier;
    if (delta <= -0.8) return 'falling';
    if (delta >= 0.8) return 'rising';
    return 'steady';
  }

  function fmtClock(ts) {
    if (!ts) return '—';
    return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ });
  }

  function localDateKey(ts, tz = TZ) {
    return new Date(ts).toLocaleDateString('en-CA', { timeZone: tz });
  }

  function localHour(ts, tz = TZ) {
    return Number(new Date(ts).toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', hour12: false }));
  }

  function average(nums) {
    const vals = nums.filter(v => Number.isFinite(v));
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  }

  function summarizeAqWindow(aq, key, targetDate, night = false) {
    const times = aq.hourly?.time || [];
    const vals = aq.hourly?.[key] || [];
    const selected = [];
    times.forEach((ts, i) => {
      const val = Number(vals[i]);
      if (!Number.isFinite(val)) return;
      const dateKey = localDateKey(ts, TZ);
      const hour = localHour(ts, TZ);
      const tomorrow = new Date(`${targetDate}T12:00:00`);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowKey = localDateKey(tomorrow, TZ);
      const include = night
        ? ((dateKey === targetDate && hour >= 18) || (dateKey === tomorrowKey && hour <= 6))
        : (dateKey === targetDate && hour >= 6 && hour <= 17);
      if (include) selected.push(val);
    });
    if (!selected.length) return { max: null, avg: null, min: null };
    return {
      max: Math.max(...selected),
      avg: selected.reduce((a, b) => a + b, 0) / selected.length,
      min: Math.min(...selected)
    };
  }

  function summarizeToday(weather) {
    const current = weather.current || {};
    const hourly = weather.hourly || {};
    const daily = weather.daily || {};
    const today = localDateKey(current.time || Date.now(), TZ);
    const nowHour = localHour(current.time || Date.now(), TZ);
    const daytimeIndexes = (hourly.time || []).map((ts, i) => localDateKey(ts, TZ) === today && localHour(ts, TZ) >= 6 && localHour(ts, TZ) <= 18 ? i : -1).filter(i => i >= 0);
    const remainingIndexes = daytimeIndexes.filter(i => localHour(hourly.time?.[i], TZ) >= Math.min(18, nowHour));
    const indexes = remainingIndexes.length ? remainingIndexes : daytimeIndexes;
    const codes = indexes.map(i => hourly.weather_code?.[i]).filter(v => v != null);
    const clouds = indexes.map(i => Number(hourly.cloud_cover?.[i])).filter(Number.isFinite);
    const rainChances = indexes.map(i => Number(hourly.precipitation_probability?.[i])).filter(Number.isFinite);
    const winds = indexes.map(i => Number(hourly.wind_speed_10m?.[i])).filter(Number.isFinite);
    const code = codes.length ? codes[Math.floor(codes.length / 2)] : (current.weather_code ?? daily.weather_code?.[0]);
    const [, label] = weatherLabel(code);
    const hi = daily.temperature_2m_max?.[0] == null ? null : Math.round(daily.temperature_2m_max[0]);
    const lo = daily.temperature_2m_min?.[0] == null ? null : Math.round(daily.temperature_2m_min[0]);
    const rain = rainChances.length ? Math.round(Math.max(...rainChances)) : (daily.precipitation_probability_max?.[0] == null ? null : Math.round(daily.precipitation_probability_max[0]));
    const cloudAvg = average(clouds);
    const windMax = winds.length ? Math.round(Math.max(...winds)) : null;
    const sky = cloudAvg == null ? '' : cloudAvg >= 75 ? ' Skies have been mostly cloudy.' : cloudAvg >= 40 ? ' Skies have been partly cloudy.' : ' Skies have been mostly clear.';
    const tempText = hi == null || lo == null ? '' : ` Temperatures run about ${lo}–${hi}°.`;
    const rainText = rain == null ? '' : ` Peak rain chance is ${rain}%.`;
    const windText = windMax == null ? '' : ` Winds up to ${windMax} mph.`;
    return `${label} today.${sky}${tempText}${rainText}${windText}`.trim();
  }

  function uvAdvice(value) {
    if (!Number.isFinite(value)) return 'unavailable';
    if (value >= 8) return 'very high';
    if (value >= 6) return 'high';
    if (value >= 3) return 'moderate';
    return 'low';
  }

  function radarUrl(place, layer = mapLayer) {
    const lat = Number(place?.lat ?? DEFAULT_PLACE.lat).toFixed(4);
    const lon = Number(place?.lon ?? DEFAULT_PLACE.lon).toFixed(4);
    return `https://www.windy.com/?${layer},${lat},${lon},9`;
  }

  function radarEmbedUrl(place, layer = mapLayer) {
    const lat = Number(place?.lat ?? DEFAULT_PLACE.lat).toFixed(4);
    const lon = Number(place?.lon ?? DEFAULT_PLACE.lon).toFixed(4);
    const params = new URLSearchParams({
      lat,
      lon,
      detailLat: lat,
      detailLon: lon,
      zoom: '8',
      level: 'surface',
      overlay: layer,
      product: layer === 'radar' ? 'radar' : 'ecmwf',
      menu: '',
      message: '',
      marker: 'true',
      calendar: 'now',
      type: 'map',
      location: 'coordinates',
      metricWind: 'mph',
      metricTemp: '°F'
    });
    return `https://embed.windy.com/embed2.html?${params.toString()}`;
  }

  function uvPct(value) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, (value / 11) * 100));
  }

  function peakRainFromIndex(hourly, startIndex, count = 12) {
    const vals = [];
    for (let i = Math.max(0, startIndex); i < Math.min((hourly.time || []).length, startIndex + count); i += 1) {
      const val = details.number(hourly.precipitation_probability?.[i]);
      if (val != null) vals.push(val);
    }
    return vals.length ? Math.round(Math.max(...vals)) : null;
  }

  function daytimeOutlookForDate(hourly, daily, idx) {
    const date = daily.time?.[idx];
    const indexes = (hourly.time || []).map((ts, i) => localDateKey(ts, TZ) === date && localHour(ts, TZ) >= 6 && localHour(ts, TZ) <= 18 ? i : -1).filter(i => i >= 0);
    const rainVals = indexes.map(i => Number(hourly.precipitation_probability?.[i])).filter(Number.isFinite);
    const rain = rainVals.length ? Math.round(Math.max(...rainVals)) : Math.round(daily.precipitation_probability_max?.[idx] ?? 0);
    const wetIndexes = indexes.filter(i => Number(hourly.precipitation_probability?.[i] || 0) >= 30 && [51,53,55,61,63,65,80,81,82,95,96,99].includes(Number(hourly.weather_code?.[i])));
    const codeSource = wetIndexes.length ? wetIndexes : indexes.filter(i => localHour(hourly.time?.[i], TZ) >= 10 && localHour(hourly.time?.[i], TZ) <= 16);
    const codes = (codeSource.length ? codeSource : indexes).map(i => Number(hourly.weather_code?.[i])).filter(Number.isFinite);
    const code = codes.length ? codes[Math.floor(codes.length / 2)] : daily.weather_code?.[idx];
    return { code, rain };
  }

  function nearSunWindow(ts, sunrise, sunset) {
    const t = new Date(ts).getTime();
    return [sunrise, sunset].some(s => s && Math.abs(t - new Date(s).getTime()) <= 90 * 60 * 1000);
  }

  async function updatePlace(placeOrZip, { background = false } = {}) {
    if (background && loading) return;
    const version = ++requestVersion;
    loading = true;
    lastAttempt = Date.now();
    closeForecast();
    const status = root.querySelector('#weather-status');
    const refresh = root.querySelector('[data-weather-refresh]');
    if (refresh) { refresh.disabled = true; refresh.textContent = 'Refreshing…'; }
    let nextPlace;
    try {
      if (status) status.textContent = typeof placeOrZip === 'string' ? 'Looking up location…' : 'Refreshing weather…';
      nextPlace = typeof placeOrZip === 'string' ? await lookupZip(placeOrZip) : placeOrZip;
      if (version !== requestVersion) return;
      // Keep the current forecast visible while the replacement is fetched.
      const bundle = await loadWeather(nextPlace);
      if (version !== requestVersion) return;
      savePlace(nextPlace);
      render(bundle);
    } catch (err) {
      if (version !== requestVersion) return;
      const samePlace = nextPlace && displayedBundle && cacheKey(nextPlace) === cacheKey(displayedBundle.place);
      const cached = samePlace ? displayedBundle : nextPlace && loadWeatherCache(nextPlace);
      if (cached) render({ ...cached, stale: true, error: 'Refresh failed. Showing the last available forecast.' });
      else if (displayedBundle) {
        root.querySelector('#weather-status').textContent = `Could not update location. Still showing ${displayedBundle.place.name}. ${err?.message || ''}`;
      } else {
        root.innerHTML = '<div class="weather-dashboard-card weather-loading">Weather is temporarily unavailable. <button type="button" data-weather-refresh>Try again</button></div>';
      }
    } finally {
      if (version === requestVersion) {
        loading = false;
        const button = root.querySelector('[data-weather-refresh]');
        if (button) { button.disabled = false; button.textContent = 'Refresh'; }
      }
    }
  }

  function updateFreshness() {
    if (!displayedBundle) return;
    const label = root.querySelector('#weather-freshness');
    if (label) label.textContent = `${displayedBundle.stale ? 'Cached · last updated' : 'Updated'} ${details.age(displayedBundle.fetchedAt || displayedBundle.cachedAt)}`;
  }

  function maybeRefresh() {
    updateFreshness();
    if (document.hidden || loading || Date.now() - lastAttempt < REFRESH_INTERVAL) return;
    // Wait while someone is typing, exploring the graph, or reading a popup.
    if (document.activeElement?.matches('#weather-zip-input, #weather-chart-hour') || !forecastPopup.hidden) return;
    updatePlace(displayedBundle?.place || loadSavedPlace(), { background: true });
  }

  // Mount outside the scrolling forecast strip so the description is never clipped.
  const forecastPopup = document.createElement('div');
  forecastPopup.id = 'weather-forecast-popup';
  forecastPopup.className = 'weather-forecast-popup';
  forecastPopup.setAttribute('role', 'tooltip');
  forecastPopup.hidden = true;
  document.body.appendChild(forecastPopup);
  let forecastTrigger = null;
  let forecastPinned = false;
  let forecastCloseTimer;

  function closeForecast() {
    clearTimeout(forecastCloseTimer);
    if (forecastTrigger) {
      forecastTrigger.setAttribute('aria-expanded', 'false');
      forecastTrigger.removeAttribute('aria-describedby');
    }
    forecastPopup.hidden = true;
    forecastTrigger = null;
    forecastPinned = false;
  }

  function positionForecast() {
    if (!forecastTrigger) return;
    const rect = forecastTrigger.getBoundingClientRect();
    const gap = 8;
    const width = forecastPopup.offsetWidth;
    const height = forecastPopup.offsetHeight;
    const left = Math.max(gap, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - gap));
    const below = rect.bottom + gap;
    const top = below + height <= window.innerHeight - gap ? below : Math.max(gap, rect.top - height - gap);
    forecastPopup.style.left = `${left}px`;
    forecastPopup.style.top = `${top}px`;
  }

  function openForecast(trigger) {
    clearTimeout(forecastCloseTimer);
    if (forecastTrigger !== trigger) {
      closeForecast();
      forecastTrigger = trigger;
      forecastPopup.innerHTML = trigger.nextElementSibling.innerHTML;
    }
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-describedby', forecastPopup.id);
    forecastPopup.hidden = false;
    positionForecast();
  }

  function scheduleForecastClose() {
    clearTimeout(forecastCloseTimer);
    forecastCloseTimer = setTimeout(() => {
      if (!forecastPinned && !forecastPopup.matches(':hover') && !forecastTrigger?.matches(':hover, :focus-visible')) closeForecast();
    }, 180);
  }

  root.addEventListener('pointerover', event => {
    const trigger = event.target.closest?.('[data-forecast-day]');
    if (trigger && event.pointerType !== 'touch') openForecast(trigger);
  });
  root.addEventListener('pointerout', event => {
    if (event.target.closest?.('[data-forecast-day]')) scheduleForecastClose();
  });
  root.addEventListener('focusin', event => {
    if (event.target.matches('[data-forecast-day]:focus-visible')) openForecast(event.target);
  });
  root.addEventListener('focusout', event => {
    if (event.target.matches('[data-forecast-day]')) closeForecast();
  });
  root.addEventListener('click', event => {
    const trigger = event.target.closest?.('[data-forecast-day]');
    if (!trigger) return;
    if (forecastTrigger === trigger && forecastPinned) closeForecast();
    else { openForecast(trigger); forecastPinned = true; }
  });
  forecastPopup.addEventListener('pointerenter', () => clearTimeout(forecastCloseTimer));
  forecastPopup.addEventListener('pointerleave', scheduleForecastClose);
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest?.('[data-forecast-day], #weather-forecast-popup')) closeForecast();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeForecast();
  });
  window.addEventListener('resize', closeForecast);
  document.addEventListener('scroll', event => {
    if (!forecastPopup.contains(event.target)) closeForecast();
  }, true);

  function render(bundle) {
    const { weather, aq, fetchedAt, todayPeriod, tonightPeriod, forecastPeriods = [], alerts, place, source, stale, cachedAt, error } = bundle;
    const samePlace = displayedBundle && cacheKey(displayedBundle.place) === cacheKey(place);
    const existingMap = samePlace && root.querySelector('.weather-radar-embed iframe');
    const focusedId = samePlace && document.activeElement?.id;
    const scrollPositions = samePlace ? [...root.querySelectorAll('.weather-chart-scroll, .weather-five-day, .weather-hourly-strip')].map(el => el.scrollLeft) : [];
    displayedBundle = bundle;
    TZ = bundle.timezone || weather.timezone || 'America/New_York';
    const zoneLabel = new Intl.DateTimeFormat('en-US', {timeZone: TZ, timeZoneName: 'short'}).formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value || TZ;
    closeForecast();
    const current = weather.current || {};
    const hourly = weather.hourly || {};
    const daily = weather.daily || {};
    const [icon, label] = weatherLabel(current.weather_code ?? daily.weather_code?.[0]);
    const today = details.forecastDay(localDateKey(Date.now(), TZ), daily, forecastPeriods);
    const hi = today.high;
    const lo = today.low;
    const temp = Math.round(current.temperature_2m ?? hi);
    const feels = details.number(current.apparent_temperature);
    const hourlyIndex = nearestHourlyIndex(hourly.time || []);
    const rain = peakRainFromIndex(hourly, hourlyIndex, 12);
    const wind = Math.round(current.wind_speed_10m ?? 0);
    const gust = Math.round(current.wind_gusts_10m ?? wind);
    const dir = windDir(current.wind_direction_10m);
    const humidity = current.relative_humidity_2m == null ? null : Math.round(current.relative_humidity_2m);
    const dewPoint = current.dew_point_2m == null ? null : Math.round(current.dew_point_2m);
    const currentPressure = current.pressure_msl == null ? null : Math.round(current.pressure_msl);
    const uvMax = daily.uv_index_max?.[0] == null ? null : Math.round(Number(daily.uv_index_max[0]) * 10) / 10;
    const placeTitle = place?.name || 'Philadelphia, PA';
    const radarHref = radarUrl(place);
    const currentTrend = pressureTrend(hourly.pressure_msl, hourlyIndex);
    const sunrise = daily.sunrise?.[0];
    const sunset = daily.sunset?.[0];
    const condition = conditionClass(current.weather_code ?? daily.weather_code?.[0], rain, Math.max(wind, gust));
    const todayKey = localDateKey(current.time || Date.now(), TZ);
    const dayAqi = summarizeAqWindow(aq, 'us_aqi', todayKey, false);
    const nightAqi = summarizeAqWindow(aq, 'us_aqi', todayKey, true);
    const dayPm25 = summarizeAqWindow(aq, 'pm2_5', todayKey, false);
    const nightPm25 = summarizeAqWindow(aq, 'pm2_5', todayKey, true);
    const dayOzone = summarizeAqWindow(aq, 'ozone', todayKey, false);
    const nightOzone = summarizeAqWindow(aq, 'ozone', todayKey, true);
    const aqiMax = dayAqi.max ?? nightAqi.max;
    const aqi = aqiInfo(aqiMax);
    const pm25 = Math.max(...[dayPm25.max, nightPm25.max].filter(Number.isFinite));
    const ozone = Math.max(...[dayOzone.max, nightOzone.max].filter(Number.isFinite));
    const dominantPollutant = !Number.isFinite(pm25) && !Number.isFinite(ozone) ? 'No pollutant detail available' : (Number(pm25 || 0) >= Number(ozone || 0) / 8 ? 'PM2.5 is the main watch item' : 'Ozone is the main watch item');
    const todaySummary = todayPeriod?.detailedForecast || summarizeToday(weather);
    const cachedTime = cachedAt ? new Date(cachedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ }) : '';
    const nextHours = (hourly.time || []).slice(hourlyIndex, hourlyIndex + 24).map((ts, offset) => {
      const i = hourlyIndex + offset;
      const [hIcon, hLabel] = weatherLabel(hourly.weather_code?.[i]);
      const h = {
        time: new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', timeZone: TZ }),
        fullTime: new Date(ts).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', timeZone: TZ }),
        icon: hIcon,
        label: hLabel,
        temp: details.number(hourly.temperature_2m?.[i]),
        feels: Math.round(hourly.apparent_temperature?.[i] ?? hourly.temperature_2m?.[i] ?? temp),
        rain: details.number(hourly.precipitation_probability?.[i]),
        // Open-Meteo rain at t is the preceding hour; display the interval starting at t.
        amount: details.rainTotal(hourly.rain?.[i + 1], hourly.showers?.[i + 1]),
        wind: Math.round(hourly.wind_speed_10m?.[i] ?? wind),
        gust: Math.round(hourly.wind_gusts_10m?.[i] ?? gust),
        dir: windDir(hourly.wind_direction_10m?.[i]),
        cloud: Math.round(hourly.cloud_cover?.[i] ?? current.cloud_cover ?? 0),
        pressureTrend: pressureTrend(hourly.pressure_msl, i),
        isGolden: nearSunWindow(ts, daily.sunrise?.[daily.time?.indexOf(localDateKey(ts, TZ))], daily.sunset?.[daily.time?.indexOf(localDateKey(ts, TZ))])
      };
      h.note = fishingNote(h);
      h.score = fishingScore(h);
      return h;
    });
    const rainfall24 = nextHours.length === 24 && nextHours.every(h => h.amount != null) ? nextHours.reduce((sum, h) => sum + h.amount, 0) : null;

    root.innerHTML = `
      <div class="weather-dashboard-card weather-condition-${condition}">
        <div class="weather-dashboard-top" id="weather-now">
          <div class="weather-now-main">
            <div class="weather-title-row">
              <h2>${icon} ${label}</h2>
              <div class="weather-title-tools">
                <form class="weather-location-form" id="weather-location-form">
                  <label for="weather-zip-input">ZIP forecast</label>
                  <input id="weather-zip-input" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" placeholder="19111" value="${escapeHtml(place?.zip || '')}">
                  <button type="submit" id="weather-update-location">Update</button>
                  <button type="button" id="weather-reset-location" data-weather-reset="true">Philly</button>
                </form>
                <div class="weather-refresh-row"><span id="weather-freshness"></span><button id="weather-refresh" type="button" data-weather-refresh>Refresh</button></div>
              </div>
            </div>
            <p>${escapeHtml(placeTitle)}${place?.zip ? ` · ${escapeHtml(place.zip)}` : ''} · ${fmtDate(current.time || Date.now())}</p>
            ${todaySummary ? `<p class="weather-day-summary weather-period-summary"><strong>Today (${todayPeriod ? 'NWS' : 'Open-Meteo'}):</strong> ${escapeHtml(todaySummary)}</p>` : ''}
            ${tonightPeriod?.detailedForecast ? `<p class="weather-night-summary weather-period-summary"><strong>Tonight (National Weather Service):</strong> ${escapeHtml(tonightPeriod.detailedForecast)}</p>` : ''}
            <p class="weather-detail-note">Refreshes every 10 minutes while this page is visible. Conditions valid ${fmtClock(current.time)} ${escapeHtml(zoneLabel)} · ${escapeHtml(source || 'Open-Meteo')}${bundle.forecastIssuedAt ? `<br>NWS forecast issued ${escapeHtml(new Date(bundle.forecastIssuedAt).toLocaleString('en-US', {month:'short', day:'numeric', hour:'numeric', minute:'2-digit', timeZone:TZ}))} ${escapeHtml(zoneLabel)}.` : ''}</p>
          </div>
          <div class="weather-now-badge">
            <strong>${temp}°</strong>
            <span>feels ${details.degrees(feels)}</span>
          </div>
        </div>


        ${stale ? `<div class="weather-stale-banner"><strong>Showing cached weather${cachedTime ? ` from ${cachedTime}` : ''}.</strong><span>${escapeHtml(error || 'Live weather APIs are temporarily unavailable.')}</span></div>` : ''}

        ${renderAlerts(alerts, place)}

        <div class="weather-dashboard-grid">
          <div class="weather-metric primary">
            <span>Today</span>
            <strong>High ${details.degrees(hi)}</strong>
            <em>Low ${details.degrees(lo)} · ${today.source}</em>
            <div class="weather-temp-track"><i style="left:${Math.max(4, Math.min(88, ((temp - 20) / 90) * 100))}%"></i></div>
          </div>
          <div class="weather-metric">
            <span>Peak precipitation · next 12h</span>
            <strong>${details.percent(rain)}</strong>
            <div class="weather-bar"><i style="width:${Math.max(2, Math.min(100, rain))}%"></i></div>
          </div>
          <div class="weather-metric">
            <span>Wind</span>
            <strong>${wind} mph ${dir}</strong>
            <em>gust ${gust} mph</em>
          </div>
          <div class="weather-metric pressure">
            <span>Pressure</span>
            <strong>${currentPressure == null ? '—' : `${currentPressure} mb`}</strong>
            <em>${currentTrend === 'unknown' ? 'trend unavailable' : currentTrend}</em>
          </div>
          <div class="weather-metric astro">
            <span>Sun</span>
            <strong>${fmtClock(sunrise)}</strong>
            <em>sunset ${fmtClock(sunset)}</em>
          </div>
          <div class="weather-metric comfort">
            <span>Comfort</span>
            <strong>${humidity == null ? '—' : `${humidity}% RH`}</strong>
            <em>dew point ${dewPoint == null ? '—' : `${dewPoint}°`}</em>
          </div>
          <div class="weather-metric uv">
            <span>Today’s peak UV</span>
            <strong>${uvMax == null ? '—' : uvMax}</strong>
            <em>${uvAdvice(uvMax)}</em>
            <div class="weather-uv-scale"><i style="left:${uvPct(uvMax)}%"></i></div>
          </div>
          <div class="weather-metric aqi ${aqi.cls}">
            <span>Daytime peak AQI</span>
            <strong>${aqi.text}</strong>
            <em>${aqi.advice}</em>
            <div class="weather-aqi-scale"><i style="left:${aqi.pct}%"></i></div>
          </div>
        </div>

        <section id="weather-hourly" class="weather-hourly-overview" aria-labelledby="weather-chart-heading">
          <div class="weather-timeline-head"><div><span class="module-kicker">Plan the day ahead</span><h3 id="weather-chart-heading">Next 24 hours</h3></div><div class="weather-rain-total"><span>Expected rainfall</span><strong>${details.inches(rainfall24)}</strong><small>Open-Meteo · next 24 hourly intervals</small></div></div>
          ${details.chart(nextHours, source)}
        </section>

        <section id="weather-map" class="weather-radar-embed" aria-labelledby="weather-map-title">
          <h3 id="weather-map-title">Weather map</h3>
          <div class="weather-map-controls" role="group" aria-label="Weather map layer">${[['radar','Radar'],['wind','Wind'],['temp','Temperature']].map(([value, text]) => `<button type="button" data-map-layer="${value}" aria-pressed="${mapLayer === value}">${text}</button>`).join('')}</div>
          <p class="weather-detail-note" id="weather-map-note">Requested layer: ${mapLayer === 'temp' ? 'Temperature' : mapLayer === 'wind' ? 'Wind' : 'Radar'}. Windy may show a fallback layer if radar is unavailable; check the label inside the map.</p>
          <iframe src="${escapeHtml(radarEmbedUrl(place))}" title="Weather map near ${escapeHtml(placeTitle)}" loading="lazy" allowfullscreen></iframe>
          <p class="weather-radar-link"><a href="${escapeHtml(radarHref)}" target="_blank" rel="noopener noreferrer">Open ${mapLayer === 'temp' ? 'temperature' : mapLayer} on Windy ↗</a></p>
        </section>

        <div class="weather-air-detail">
          <span>Air quality outlook</span>
          <strong>${aqi.advice}</strong>
          <div class="weather-air-grid">
            <div><b>Daytime AQI</b><em>${dayAqi.max == null ? 'n/a' : `${aqiInfo(dayAqi.max).text}${dayAqi.avg == null ? '' : ` · avg ${Math.round(dayAqi.avg)}`}`}</em></div>
            <div><b>Tonight AQI</b><em>${nightAqi.max == null ? 'n/a' : `${aqiInfo(nightAqi.max).text}${nightAqi.avg == null ? '' : ` · avg ${Math.round(nightAqi.avg)}`}`}</em></div>
            <div><b>PM2.5 max</b><em>Day: ${pollutantLabel('pm2_5', dayPm25.max)}<br>Tonight: ${pollutantLabel('pm2_5', nightPm25.max)}</em></div>
            <div><b>Ozone max</b><em>Day: ${pollutantLabel('ozone', dayOzone.max)}<br>Tonight: ${pollutantLabel('ozone', nightOzone.max)}</em></div>
          </div>
          <em>${dominantPollutant}</em>
        </div>

        <div class="weather-timeline-head">
          <div>
            <span class="module-kicker">Fishing Conditions Timeline</span>
            <h3>Next 12 hours</h3>
          </div>
          <p>Rain, wind, and pressure trend hour by hour.</p>
        </div>
        <details class="weather-score-explanation"><summary>How the estimated fishing score works</summary><p>A weather-based estimate, not a catch prediction or a safety rating. Starts at 5/10: cloud cover ≥60% +1; rain chance 1–45% +1 or ≥70% −2; wind 8–14 mph +1; wind ≥18 mph or gusts ≥25 mph −2; falling pressure +1 or rising pressure −1; within 90 minutes of sunrise or sunset +2. Limited to 1–10. It does not account for species, water temperature, tides, or local water conditions.</p></details>
        <div class="weather-hourly-strip fishing-timeline" aria-label="Hourly fishing weather">
          ${nextHours.slice(0, 12).map(h => `<div class="${h.rain >= 55 ? 'rainy' : h.wind >= 15 ? 'windy' : h.cloud >= 70 ? 'cloudy' : ''}">
            <span>${h.time}</span>
            <strong>${h.icon} ${details.degrees(h.temp)}</strong>
            <em>${h.label}</em>
            <small>${details.percent(h.rain)} precip · ${h.wind} mph ${h.dir}${h.gust > h.wind ? ` · gust ${h.gust}` : ''}</small>
            <small>pressure ${h.pressureTrend}</small>
            <small class="weather-fishing-score">Fishing estimate ${h.score}/10</small>
          </div>`).join('')}
        </div>

        <div class="weather-five-day-head" id="weather-five-day">
          <h3>5-day Extended Outlook</h3>
          <p>Hover or tap a day for the full forecast.</p>
        </div>
        <div class="weather-five-day" aria-label="Five day forecast">
          ${(daily.time || []).filter(ts => ts > localDateKey(Date.now(), TZ)).slice(0, 5).map(ts => {
            const day = details.forecastDay(ts, daily, forecastPeriods);
            const [dIcon, fallbackLabel] = weatherLabel(day.source === 'NWS' ? codeFromForecast(day.summary) : day.code);
            const dLabel = day.summary || fallbackLabel;
            const periods = day.periods;
            const fullDay = new Date(`${ts}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            const popup = `${stale ? '<p class="weather-forecast-source">Cached forecast</p>' : ''}` + (periods.length
              ? `${periods.map(p => `<section><h4>${escapeHtml(p.name)}</h4><p>${escapeHtml(p.detailedForecast || p.shortForecast || 'Description unavailable.')}</p></section>`).join('')}<p class="weather-forecast-source">National Weather Service</p>`
              : `<section><h4>${escapeHtml(fullDay)}</h4><p>${escapeHtml(dLabel)}. High ${details.degrees(day.high)}, low ${details.degrees(day.low)}. Daily peak precipitation chance: ${details.percent(day.chance)}.</p><p>NWS descriptions are currently unavailable. Showing the Open-Meteo forecast.</p></section>`) + `<p class="weather-forecast-source">Expected rainfall: ${details.inches(day.rain)} · Open-Meteo daily estimate.</p>`;
            return `<div class="weather-day"><button type="button" class="weather-day-trigger" data-forecast-day="${escapeHtml(ts)}" aria-expanded="false" aria-controls="weather-forecast-popup" aria-label="Full forecast for ${escapeHtml(fullDay)}"><span>${dayName(ts)}</span><strong>${dIcon}</strong><em>High ${details.degrees(day.high)}<br>Low ${details.degrees(day.low)}</em><small>${escapeHtml(dLabel)}</small><small>${day.chanceLabel} precip ${details.percent(day.chance)} · ${day.source}</small><small class="weather-day-rain">Rain ${details.inches(day.rain)}<br><span class="weather-rain-source">Open-Meteo estimate</span></small></button><template>${popup}</template></div>`;
          }).join('')}
        </div>

        <p class="weather-detail-note">Daily temperatures, precipitation chances and descriptions: National Weather Service; Open-Meteo is used when NWS is unavailable. Hourly conditions: ${escapeHtml(source || 'Open-Meteo')}. Rainfall totals: Open-Meteo model estimates. Percentages are precipitation chances, not amounts. Times shown in ${escapeHtml(TZ)} (${escapeHtml(zoneLabel)}).</p>
        <p class="weather-updated" id="weather-status" role="status">${stale ? 'Cached fallback. Refresh failed; showing the last available forecast.' : `Weather checked at ${fmtClock(fetchedAt || cachedAt)} ${escapeHtml(zoneLabel)}.`}</p>
      </div>`;

    if (existingMap) root.querySelector('.weather-radar-embed iframe').replaceWith(existingMap);
    root.querySelectorAll('.weather-chart-scroll, .weather-five-day, .weather-hourly-strip').forEach((el, index) => { el.scrollLeft = scrollPositions[index] || 0; });
    details.bindChart(root, nextHours);
    updateFreshness();
    if (focusedId) document.getElementById(focusedId)?.focus({ preventScroll: true });
    root.querySelectorAll('[data-map-layer]').forEach(button => button.addEventListener('click', () => {
      mapLayer = button.dataset.mapLayer;
      root.querySelectorAll('[data-map-layer]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      const name = mapLayer === 'temp' ? 'temperature' : mapLayer;
      const frame = root.querySelector('.weather-radar-embed iframe');
      frame.src = radarEmbedUrl(place);
      frame.title = `${name} map near ${placeTitle}`;
      const link = root.querySelector('.weather-radar-link a');
      link.href = radarUrl(place);
      link.textContent = `Open ${name} on Windy ↗`;
      root.querySelector('#weather-map-note').textContent = `Requested layer: ${name}. Windy may show a fallback layer; check the label inside the map.`;
    }));
  }

  root.addEventListener('submit', event => {
    if (event.target?.id !== 'weather-location-form') return;
    event.preventDefault();
    const input = root.querySelector('#weather-zip-input');
    updatePlace(input?.value);
  });

  root.addEventListener('click', event => {
    if (event.target?.closest?.('[data-weather-refresh]')) {
      updatePlace(displayedBundle?.place || loadSavedPlace());
      return;
    }
    if (!event.target?.closest?.('[data-weather-reset="true"]')) return;
    event.preventDefault();
    updatePlace(DEFAULT_PLACE);
  });

  root.innerHTML = '<div class="weather-dashboard-card weather-loading">Loading weather…</div>';
  updatePlace(loadSavedPlace());
  setInterval(maybeRefresh, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) maybeRefresh(); });
})();
