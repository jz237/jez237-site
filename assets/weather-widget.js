(() => {
  const DEFAULT_PLACE = { name: 'Philadelphia', lat: 39.9526, lon: -75.1652, zip: '19107' };
  const TZ = 'America/New_York';
  const STORAGE_KEY = 'jez237-weather-place-v1';
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
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.floor(((Number(degrees) % 360) + 11.25) / 22.5) % 16];
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

  async function loadWeather(place = loadSavedPlace()) {
    const lat = Number(place.lat);
    const lon = Number(place.lon);
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
      `&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=${TZ}&forecast_days=6`;
    const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=us_aqi,pm2_5,ozone&timezone=${TZ}&forecast_days=2`;
    const nwsUrl = `https://api.weather.gov/points/${lat},${lon}`;
    const alertsUrl = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;

    const [weather, aq, points, alerts] = await Promise.all([
      fetchJson(weatherUrl),
      fetchJson(aqUrl),
      fetchJson(nwsUrl).catch(() => null),
      fetchJson(alertsUrl).catch(() => null)
    ]);
    let tonightPeriod = null;
    if (points?.properties?.forecast) {
      try {
        const forecast = await fetchJson(points.properties.forecast);
        const periods = forecast?.properties?.periods || [];
        tonightPeriod = periods.find(p => p?.isDaytime === false) || periods[1] || periods[0] || null;
      } catch (_) {}
    }
    return { weather, aq, tonightPeriod, alerts, place };
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

  async function updatePlace(placeOrZip) {
    const status = root.querySelector('#weather-status');
    try {
      if (status) status.textContent = 'Loading forecast…';
      const nextPlace = typeof placeOrZip === 'string' ? await lookupZip(placeOrZip) : placeOrZip;
      savePlace(nextPlace);
      root.innerHTML = `<div class="weather-dashboard-card weather-loading">Loading ${escapeHtml(nextPlace.name || 'weather')}…</div>`;
      render(await loadWeather(nextPlace));
    } catch (err) {
      const nextStatus = root.querySelector('#weather-status');
      if (nextStatus) nextStatus.textContent = err?.message || 'Could not load that ZIP right now.';
      else root.innerHTML = `<div class="weather-dashboard-card weather-loading">${escapeHtml(err?.message || 'Could not load that ZIP right now.')}</div>`;
    }
  }

  function render({ weather, aq, tonightPeriod, alerts, place }) {
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
    const aqiVals = (aq.hourly?.us_aqi || []).filter(v => v != null).slice(0, 24);
    const aqiMax = aqiVals.length ? Math.max(...aqiVals.map(Number)) : null;
    const aqi = aqiInfo(aqiMax);
    const pm25Vals = (aq.hourly?.pm2_5 || []).filter(v => v != null).slice(0, 24).map(Number);
    const ozoneVals = (aq.hourly?.ozone || []).filter(v => v != null).slice(0, 24).map(Number);
    const pm25 = pm25Vals.length ? Math.max(...pm25Vals) : null;
    const ozone = ozoneVals.length ? Math.max(...ozoneVals) : null;
    const hourlyIndex = nearestHourlyIndex(hourly.time || []);
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
        cloud: Math.round(hourly.cloud_cover?.[i] ?? current.cloud_cover ?? 0)
      };
      h.note = fishingNote(h);
      return h;
    });

    root.innerHTML = `
      <div class="weather-dashboard-card">
        <div class="weather-dashboard-top">
          <div>
            <span class="module-kicker">Weather Console</span>
            <h2>${icon} ${label}</h2>
            <p>${escapeHtml(place?.name || 'Philadelphia')} · ${fmtDate(current.time || Date.now())} · Same source family as the local Discord weather post.</p>
            <form class="weather-location-form" id="weather-location-form">
              <label for="weather-zip-input">ZIP forecast</label>
              <input id="weather-zip-input" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" placeholder="19107" value="${escapeHtml(place?.zip || '')}">
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
          <div class="weather-metric aqi ${aqi.cls}">
            <span>Air</span>
            <strong>${aqi.text}</strong>
            <em>${aqi.advice}</em>
            <div class="weather-aqi-scale"><i style="left:${aqi.pct}%"></i></div>
          </div>
        </div>

        ${renderAlerts(alerts)}

        ${tonightPeriod?.detailedForecast ? `<p class="weather-nws-summary"><strong>Tonight:</strong> ${escapeHtml(tonightPeriod.detailedForecast)}</p>` : ''}

        <div class="weather-timeline-head">
          <div>
            <span class="module-kicker">Fishing Conditions Timeline</span>
            <h3>Next 12 hours</h3>
          </div>
          <p>Rain, wind, cloud cover, and low-light windows hour by hour.</p>
        </div>
        <div class="weather-hourly-strip fishing-timeline" aria-label="Hourly fishing weather">
          ${nextHours.map(h => `<div class="${h.rain >= 55 ? 'rainy' : h.wind >= 15 ? 'windy' : h.cloud >= 70 ? 'cloudy' : ''}">
            <span>${h.time}</span>
            <strong>${h.icon} ${h.temp}°</strong>
            <em>feels ${h.feels}° · ${h.label}</em>
            <b style="--rain:${Math.max(2, Math.min(100, h.rain))}%">${h.rain}% rain</b>
            <small>${h.wind} mph ${h.dir}${h.gust > h.wind ? ` · gust ${h.gust}` : ''}</small>
            <small>${h.cloud}% cloud · ${h.note}</small>
          </div>`).join('')}
        </div>

        <div class="weather-air-detail">
          <span>Air detail</span>
          <strong>PM2.5 ${pm25 == null ? '—' : `${pm25.toFixed(1)} µg/m³`} · Ozone ${ozone == null ? '—' : `${Math.round(ozone)} µg/m³`}</strong>
          <em>${aqi.advice}</em>
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

        <p class="weather-updated" id="weather-status">Updated from live public weather APIs at ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.</p>
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
    root.innerHTML = '<div class="weather-dashboard-card weather-loading">Weather panel could not load right now.</div>';
  });
})();
