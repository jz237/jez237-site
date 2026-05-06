(() => {
  const DEFAULT_PLACE = { name: 'Philadelphia', lat: 40.0607, lon: -75.0802, zip: '19111' };
  const TZ = 'America/New_York';
  const STORAGE_KEY = 'jez237-weather-place-v1';
  const CACHE_KEY_PREFIX = 'jez237-weather-cache-v1:';
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
    if (/sunny|clear/.test(value)) return 0;
    if (/partly|mostly sunny/.test(value)) return 2;
    if (/cloud|overcast/.test(value)) return 3;
    return 3;
  }

  function parseWindSpeed(value) {
    const nums = String(value || '').match(/\d+/g)?.map(Number) || [];
    return nums.length ? Math.max(...nums) : 0;
  }

  function fmtDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
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
    let best = 0;
    let bestDiff = Infinity;
    times.forEach((ts, i) => {
      const diff = Math.abs(new Date(ts).getTime() - now);
      if (diff < bestDiff) { best = i; bestDiff = diff; }
    });
    return best;
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
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`${res.status} from ${url}`);
    return res.json();
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

  async function loadNwsWeatherBackup(points) {
    if (!points?.properties?.forecastHourly || !points?.properties?.forecast) {
      throw new Error('NWS backup forecast unavailable.');
    }
    const [hourlyForecast, dailyForecast] = await Promise.all([
      fetchJson(points.properties.forecastHourly),
      fetchJson(points.properties.forecast)
    ]);
    const hourlyPeriods = hourlyForecast?.properties?.periods || [];
    const dailyPeriods = dailyForecast?.properties?.periods || [];
    if (!hourlyPeriods.length) throw new Error('NWS backup hourly forecast unavailable.');
    const currentPeriod = hourlyPeriods[0];
    const dayPeriods = dailyPeriods.filter(p => p?.isDaytime !== false).slice(0, 6);
    const nightPeriods = dailyPeriods.filter(p => p?.isDaytime === false).slice(0, 6);
    return {
      source: 'NWS backup',
      current: {
        time: currentPeriod.startTime,
        temperature_2m: currentPeriod.temperature,
        apparent_temperature: currentPeriod.temperature,
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
        temperature_2m: hourlyPeriods.map(p => p.temperature),
        apparent_temperature: hourlyPeriods.map(p => p.temperature),
        precipitation_probability: hourlyPeriods.map(p => p.probabilityOfPrecipitation?.value ?? 0),
        weather_code: hourlyPeriods.map(p => codeFromForecast(p.shortForecast)),
        cloud_cover: hourlyPeriods.map(p => /cloud|overcast/i.test(p.shortForecast || '') ? 80 : 35),
        pressure_msl: hourlyPeriods.map(() => null),
        wind_speed_10m: hourlyPeriods.map(p => parseWindSpeed(p.windSpeed)),
        wind_direction_10m: hourlyPeriods.map(p => p.windDirection),
        wind_gusts_10m: hourlyPeriods.map(p => parseWindSpeed(p.windSpeed))
      },
      daily: {
        time: dayPeriods.map(p => (p.startTime || '').slice(0, 10)),
        weather_code: dayPeriods.map(p => codeFromForecast(p.shortForecast)),
        temperature_2m_max: dayPeriods.map(p => p.temperature),
        temperature_2m_min: dayPeriods.map((p, i) => nightPeriods[i]?.temperature ?? p.temperature),
        precipitation_probability_max: dayPeriods.map((p, i) => Math.max(p.probabilityOfPrecipitation?.value ?? 0, nightPeriods[i]?.probabilityOfPrecipitation?.value ?? 0)),
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
      `&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=${TZ}&forecast_days=6`;
    const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=us_aqi,pm2_5,ozone&timezone=${TZ}&forecast_days=2`;
    const nwsUrl = `https://api.weather.gov/points/${lat},${lon}`;
    const alertsUrl = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;

    const pointsPromise = fetchJson(nwsUrl).catch(() => null);
    const alertsPromise = fetchJson(alertsUrl).catch(() => null);
    const weatherPromise = fetchJson(weatherUrl)
      .then(weather => ({ ...weather, source: 'Open-Meteo' }))
      .catch(async () => loadNwsWeatherBackup(await pointsPromise));
    const aqPromise = fetchJson(aqUrl).catch(() => ({ hourly: {}, unavailable: true }));
    const [weather, aq, points, alerts] = await Promise.all([
      weatherPromise,
      aqPromise,
      pointsPromise,
      alertsPromise
    ]);
    let todayPeriod = null;
    let tonightPeriod = null;
    if (points?.properties?.forecast) {
      try {
        const forecast = await fetchJson(points.properties.forecast);
        const periods = forecast?.properties?.periods || [];
        const todayKey = localDateKey(new Date(), TZ);
        todayPeriod = periods.find(p => p?.isDaytime === true && localDateKey(p.startTime, TZ) === todayKey) || null;
        tonightPeriod = periods.find(p => p?.isDaytime === false) || periods[1] || periods[0] || null;
      } catch (_) {}
    }
    const bundle = { weather, aq, todayPeriod, tonightPeriod, alerts, place, source: weather.source || 'Open-Meteo', stale: false };
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

  function renderAlerts(alerts) {
    const features = (alerts?.features || []).slice(0, 3);
    if (!features.length) return '';
    return `<div class="weather-alerts" aria-label="Active weather alerts">
      ${features.map(alert => {
        const props = alert.properties || {};
        const tone = alertTone(alert);
        const expires = props.expires ? new Date(props.expires).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
        return `<article class="weather-alert ${tone}">
          <span>⚠️ ${escapeHtml(props.event || 'Weather alert')}</span>
          <strong>${escapeHtml(props.headline || props.description || 'Active weather alert for Philadelphia.')}</strong>
          ${expires ? `<em>Until ${expires}</em>` : ''}
        </article>`;
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
    return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
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

  function summarizeToday(weather) {
    const current = weather.current || {};
    const hourly = weather.hourly || {};
    const daily = weather.daily || {};
    const today = localDateKey(current.time || Date.now(), TZ);
    const indexes = (hourly.time || []).map((ts, i) => localDateKey(ts, TZ) === today && localHour(ts, TZ) >= 6 && localHour(ts, TZ) <= 18 ? i : -1).filter(i => i >= 0);
    const codes = indexes.map(i => hourly.weather_code?.[i]).filter(v => v != null);
    const clouds = indexes.map(i => Number(hourly.cloud_cover?.[i])).filter(Number.isFinite);
    const rainChances = indexes.map(i => Number(hourly.precipitation_probability?.[i])).filter(Number.isFinite);
    const winds = indexes.map(i => Number(hourly.wind_speed_10m?.[i])).filter(Number.isFinite);
    const code = daily.weather_code?.[0] ?? current.weather_code ?? codes[Math.floor(codes.length / 2)];
    const [, label] = weatherLabel(code);
    const hi = daily.temperature_2m_max?.[0] == null ? null : Math.round(daily.temperature_2m_max[0]);
    const lo = daily.temperature_2m_min?.[0] == null ? null : Math.round(daily.temperature_2m_min[0]);
    const rain = daily.precipitation_probability_max?.[0] == null ? (rainChances.length ? Math.round(Math.max(...rainChances)) : null) : Math.round(daily.precipitation_probability_max[0]);
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

  function radarUrl(place) {
    const lat = Number(place?.lat ?? DEFAULT_PLACE.lat).toFixed(4);
    const lon = Number(place?.lon ?? DEFAULT_PLACE.lon).toFixed(4);
    return `https://www.windy.com/?radar,${lat},${lon},9`;
  }

  function uvPct(value) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, (value / 11) * 100));
  }

  function nearSunWindow(ts, sunrise, sunset) {
    const t = new Date(ts).getTime();
    return [sunrise, sunset].some(s => s && Math.abs(t - new Date(s).getTime()) <= 90 * 60 * 1000);
  }

  async function updatePlace(placeOrZip) {
    const status = root.querySelector('#weather-status');
    let nextPlace;
    try {
      if (status) status.textContent = 'Looking up location…';
      nextPlace = typeof placeOrZip === 'string' ? await lookupZip(placeOrZip) : placeOrZip;
    } catch (err) {
      if (status) status.textContent = err?.message || 'Could not find that ZIP.';
      return;
    }
    savePlace(nextPlace);
    try {
      root.innerHTML = `<div class="weather-dashboard-card weather-loading">Loading ${escapeHtml(nextPlace.name || 'weather')}…</div>`;
      render(await loadWeather(nextPlace));
    } catch (err) {
      const cached = loadWeatherCache(nextPlace);
      if (cached) {
        render({ ...cached, error: err?.message || 'Live refresh failed.' });
        return;
      }
      root.innerHTML = `<div class="weather-dashboard-card weather-loading">${escapeHtml(err?.message || 'Could not load that ZIP right now.')}</div>`;
    }
  }

  function render({ weather, aq, todayPeriod, tonightPeriod, alerts, place, source, stale, cachedAt, error }) {
    const current = weather.current || {};
    const hourly = weather.hourly || {};
    const daily = weather.daily || {};
    const [icon, label] = weatherLabel(current.weather_code ?? daily.weather_code?.[0]);
    const hi = Math.round(daily.temperature_2m_max?.[0] ?? current.temperature_2m ?? 0);
    const lo = Math.round(daily.temperature_2m_min?.[0] ?? current.temperature_2m ?? 0);
    const temp = Math.round(current.temperature_2m ?? hi);
    const feels = Math.round(current.apparent_temperature ?? temp);
    const rain = Math.round(daily.precipitation_probability_max?.[0] ?? 0);
    const wind = Math.round(current.wind_speed_10m ?? 0);
    const gust = Math.round(current.wind_gusts_10m ?? wind);
    const dir = windDir(current.wind_direction_10m);
    const humidity = current.relative_humidity_2m == null ? null : Math.round(current.relative_humidity_2m);
    const dewPoint = current.dew_point_2m == null ? null : Math.round(current.dew_point_2m);
    const currentPressure = current.pressure_msl == null ? null : Math.round(current.pressure_msl);
    const uvMax = daily.uv_index_max?.[0] == null ? null : Math.round(Number(daily.uv_index_max[0]) * 10) / 10;
    const placeTitle = place?.name || 'Philadelphia, PA';
    const radarHref = radarUrl(place);
    const hourlyIndex = nearestHourlyIndex(hourly.time || []);
    const currentTrend = pressureTrend(hourly.pressure_msl, hourlyIndex);
    const sunrise = daily.sunrise?.[0];
    const sunset = daily.sunset?.[0];
    const condition = conditionClass(current.weather_code ?? daily.weather_code?.[0], rain, Math.max(wind, gust));
    const aqiVals = (aq.hourly?.us_aqi || []).filter(v => v != null).slice(0, 24);
    const aqiMax = aqiVals.length ? Math.max(...aqiVals.map(Number)) : null;
    const aqi = aqiInfo(aqiMax);
    const pm25Vals = (aq.hourly?.pm2_5 || []).filter(v => v != null).slice(0, 24).map(Number);
    const ozoneVals = (aq.hourly?.ozone || []).filter(v => v != null).slice(0, 24).map(Number);
    const pm25 = pm25Vals.length ? Math.max(...pm25Vals) : null;
    const ozone = ozoneVals.length ? Math.max(...ozoneVals) : null;
    const dominantPollutant = pm25 == null && ozone == null ? 'No pollutant detail available' : (Number(pm25 || 0) >= Number(ozone || 0) / 8 ? 'PM2.5 is the main watch item' : 'Ozone is the main watch item');
    const todaySummary = todayPeriod?.detailedForecast || summarizeToday(weather);
    const cachedTime = cachedAt ? new Date(cachedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
    const nextHours = (hourly.time || []).slice(hourlyIndex, hourlyIndex + 12).map((ts, offset) => {
      const i = hourlyIndex + offset;
      const [hIcon, hLabel] = weatherLabel(hourly.weather_code?.[i]);
      const h = {
        time: new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric' }),
        icon: hIcon,
        label: hLabel,
        temp: Math.round(hourly.temperature_2m?.[i] ?? temp),
        feels: Math.round(hourly.apparent_temperature?.[i] ?? hourly.temperature_2m?.[i] ?? temp),
        rain: Math.round(hourly.precipitation_probability?.[i] ?? 0),
        wind: Math.round(hourly.wind_speed_10m?.[i] ?? wind),
        gust: Math.round(hourly.wind_gusts_10m?.[i] ?? gust),
        dir: windDir(hourly.wind_direction_10m?.[i]),
        cloud: Math.round(hourly.cloud_cover?.[i] ?? current.cloud_cover ?? 0),
        pressureTrend: pressureTrend(hourly.pressure_msl, i),
        isGolden: nearSunWindow(ts, sunrise, sunset)
      };
      h.note = fishingNote(h);
      h.score = fishingScore(h);
      return h;
    });

    root.innerHTML = `
      <div class="weather-dashboard-card weather-condition-${condition}">
        <div class="weather-dashboard-top">
          <div>
            <h2>${icon} ${label}</h2>
            <p>${escapeHtml(placeTitle)}${place?.zip ? ` · ${escapeHtml(place.zip)}` : ''} · ${fmtDate(current.time || Date.now())}</p>
            ${todaySummary ? `<p class="weather-day-summary"><strong>Today:</strong> ${escapeHtml(todaySummary)}</p>` : ''}
            <form class="weather-location-form" id="weather-location-form">
              <label for="weather-zip-input">ZIP forecast</label>
              <input id="weather-zip-input" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" placeholder="19111" value="${escapeHtml(place?.zip || '')}">
              <button type="submit" id="weather-update-location">Update</button>
              <button type="button" id="weather-reset-location" data-weather-reset="true">Philly</button>
            </form>
          </div>
          <div class="weather-now-badge">
            <strong>${temp}°</strong>
            <span>feels ${feels}°</span>
          </div>
        </div>

        <div class="weather-dashboard-grid">
          <div class="weather-metric primary">
            <span>Today</span>
            <strong>${lo}–${hi}°F</strong>
            <div class="weather-temp-track"><i style="left:${Math.max(4, Math.min(88, ((temp - 20) / 90) * 100))}%"></i></div>
          </div>
          <div class="weather-metric">
            <span>Rain</span>
            <strong>${rain}%</strong>
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
            <span>UV Index</span>
            <strong>${uvMax == null ? '—' : uvMax}</strong>
            <em>${uvAdvice(uvMax)}</em>
            <div class="weather-uv-scale"><i style="left:${uvPct(uvMax)}%"></i></div>
          </div>
          <div class="weather-metric aqi ${aqi.cls}">
            <span>Air</span>
            <strong>${aqi.text}</strong>
            <em>${aqi.advice}</em>
            <div class="weather-aqi-scale"><i style="left:${aqi.pct}%"></i></div>
          </div>
        </div>

        <p class="weather-radar-link"><a href="${escapeHtml(radarHref)}" target="_blank" rel="noopener noreferrer">Live Weather Radar on Windy</a></p>

        ${stale ? `<div class="weather-stale-banner"><strong>Showing cached weather${cachedTime ? ` from ${cachedTime}` : ''}.</strong><span>${escapeHtml(error || 'Live weather APIs are temporarily unavailable.')}</span></div>` : ''}

        ${renderAlerts(alerts)}

        ${tonightPeriod?.detailedForecast ? `<p class="weather-nws-summary"><strong>Tonight:</strong> ${escapeHtml(tonightPeriod.detailedForecast)}</p>` : ''}

        <div class="weather-air-detail">
          <span>Air detail</span>
          <strong>${aqi.advice}</strong>
          <em>PM2.5 ${pm25 == null ? '—' : `${pm25.toFixed(1)} µg/m³`} · Ozone ${ozone == null ? '—' : `${Math.round(ozone)} µg/m³`} · ${dominantPollutant}</em>
        </div>

        <div class="weather-timeline-head">
          <div>
            <span class="module-kicker">Fishing Conditions Timeline</span>
            <h3>Next 12 hours</h3>
          </div>
          <p>Rain, wind, and pressure trend hour by hour.</p>
        </div>
        <div class="weather-hourly-strip fishing-timeline" aria-label="Hourly fishing weather">
          ${nextHours.map(h => `<div class="${h.rain >= 55 ? 'rainy' : h.wind >= 15 ? 'windy' : h.cloud >= 70 ? 'cloudy' : ''}">
            <span>${h.time}</span>
            <strong>${h.icon} ${h.temp}°</strong>
            <em>${h.label}</em>
            <small>${h.rain}% rain · ${h.wind} mph ${h.dir}${h.gust > h.wind ? ` · gust ${h.gust}` : ''}</small>
            <small>pressure ${h.pressureTrend}</small>
            <small class="weather-fishing-score">Fishing ${h.score}/10</small>
          </div>`).join('')}
        </div>

        <div class="weather-five-day-head">
          <h3>5-day Extended Outlook</h3>
        </div>
        <div class="weather-five-day" aria-label="Five day forecast">
          ${(daily.time || []).slice(1, 6).map((ts, i) => {
            const idx = i + 1;
            const [dIcon, dLabel] = weatherLabel(daily.weather_code?.[idx]);
            const dHi = Math.round(daily.temperature_2m_max?.[idx] ?? 0);
            const dLo = Math.round(daily.temperature_2m_min?.[idx] ?? 0);
            const dRain = Math.round(daily.precipitation_probability_max?.[idx] ?? 0);
            return `<div class="weather-day"><span>${dayName(ts)}</span><strong>${dIcon}</strong><em>${dLo}–${dHi}°</em><small>${dRain}% · ${dLabel}</small></div>`;
          }).join('')}
        </div>

        <p class="weather-updated" id="weather-status">${stale ? 'Cached fallback' : 'Updated'} from ${escapeHtml(source || 'live public weather APIs')} at ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.</p>
      </div>`;

  }

  root.addEventListener('submit', event => {
    if (event.target?.id !== 'weather-location-form') return;
    event.preventDefault();
    const input = root.querySelector('#weather-zip-input');
    updatePlace(input?.value);
  });

  root.addEventListener('click', event => {
    if (!event.target?.closest?.('[data-weather-reset="true"]')) return;
    event.preventDefault();
    updatePlace(DEFAULT_PLACE);
  });

  root.innerHTML = '<div class="weather-dashboard-card weather-loading">Loading weather…</div>';
  loadWeather().then(render).catch(err => {
    console.error(err);
    const cached = loadWeatherCache(loadSavedPlace());
    if (cached) render({ ...cached, error: err?.message || 'Live weather APIs are temporarily unavailable.' });
    else root.innerHTML = '<div class="weather-dashboard-card weather-loading">Weather panel could not load right now.</div>';
  });
})();
