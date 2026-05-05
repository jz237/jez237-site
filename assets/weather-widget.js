(() => {
  const LAT = 39.9526;
  const LON = -75.1652;
  const TZ = 'America/New_York';
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
    if (aqi == null || Number.isNaN(Number(aqi))) return { text: 'Unknown', cls: 'unknown', pct: 0 };
    const n = Math.round(Number(aqi));
    if (n <= 50) return { text: `${n} Good`, cls: 'good', pct: Math.min(100, n / 3) };
    if (n <= 100) return { text: `${n} Moderate`, cls: 'moderate', pct: 35 + (n - 51) * 0.65 };
    if (n <= 150) return { text: `${n} Sensitive`, cls: 'sensitive', pct: 68 + (n - 101) * 0.5 };
    return { text: `${n} Unhealthy`, cls: 'unhealthy', pct: 96 };
  }

  function windDir(degrees) {
    if (degrees == null) return '';
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.floor(((Number(degrees) % 360) + 11.25) / 22.5) % 16];
  }

  function fmtDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
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

  async function fetchJson(url) {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`${res.status} from ${url}`);
    return res.json();
  }

  async function loadWeather() {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
      `&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=${TZ}&forecast_days=6`;
    const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LON}&hourly=us_aqi,pm2_5,ozone&timezone=${TZ}&forecast_days=2`;
    const nwsUrl = `https://api.weather.gov/points/${LAT},${LON}`;

    const [weather, aq, points] = await Promise.all([
      fetchJson(weatherUrl),
      fetchJson(aqUrl),
      fetchJson(nwsUrl).catch(() => null)
    ]);
    let nwsPeriod = null;
    if (points?.properties?.forecast) {
      try {
        const forecast = await fetchJson(points.properties.forecast);
        nwsPeriod = forecast?.properties?.periods?.[0] || null;
      } catch (_) {}
    }
    return { weather, aq, nwsPeriod };
  }

  function render({ weather, aq, nwsPeriod }) {
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
    const hourlyIndex = nearestHourlyIndex(hourly.time || []);
    const nextHours = (hourly.time || []).slice(hourlyIndex, hourlyIndex + 8).map((ts, offset) => {
      const i = hourlyIndex + offset;
      const [hIcon] = weatherLabel(hourly.weather_code?.[i]);
      return {
        time: new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric' }),
        icon: hIcon,
        temp: Math.round(hourly.temperature_2m?.[i] ?? temp),
        rain: Math.round(hourly.precipitation_probability?.[i] ?? 0)
      };
    });

    root.innerHTML = `
      <div class="weather-dashboard-card">
        <div class="weather-dashboard-top">
          <div>
            <span class="module-kicker">Philly Weather Console</span>
            <h2>${icon} ${label}</h2>
            <p>${fmtDate(current.time || Date.now())} · Same source family as the local Discord weather post.</p>
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
            <div class="weather-aqi-scale"><i style="left:${aqi.pct}%"></i></div>
          </div>
        </div>

        ${nwsPeriod?.detailedForecast ? `<p class="weather-nws-summary">${nwsPeriod.detailedForecast}</p>` : ''}

        <div class="weather-hourly-strip" aria-label="Hourly weather">
          ${nextHours.map(h => `<div><span>${h.time}</span><strong>${h.icon} ${h.temp}°</strong><em>${h.rain}% rain</em></div>`).join('')}
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

        <p class="weather-updated">Updated from live public weather APIs at ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.</p>
      </div>`;
  }

  root.innerHTML = '<div class="weather-dashboard-card weather-loading">Loading Philly weather…</div>';
  loadWeather().then(render).catch(err => {
    console.error(err);
    root.innerHTML = '<div class="weather-dashboard-card weather-loading">Weather panel could not load right now.</div>';
  });
})();
