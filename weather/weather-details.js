/* Small, dependency-free views shared by the weather console. */
window.WeatherDetails = (() => {
  const finite = value => value != null && Number.isFinite(Number(value));
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number = value => finite(value) ? Number(value) : null;
  const degrees = value => finite(value) ? `${Math.round(value)}°F` : '—';
  const percent = value => finite(value) ? `${Math.round(value)}%` : '—';
  const inches = value => finite(value) ? (Number(value) > 0 && Number(value) < .005 ? '<0.01 in' : `${Number(value).toFixed(2)} in`) : 'Unavailable';
  const rainTotal = (rain, showers) => finite(rain) && finite(showers) ? Number(rain) + Number(showers) : null;
  const temperature = period => !finite(period?.temperature) ? null : period.temperatureUnit === 'C' ? Number(period.temperature) * 9 / 5 + 32 : Number(period.temperature);

  function forecastDay(date, daily, periods = []) {
    const index = (daily.time || []).indexOf(date);
    const matching = periods.filter(p => p?.startTime?.slice(0, 10) === date);
    const day = matching.find(p => p.isDaytime === true);
    const night = matching.findLast(p => p.isDaytime === false);
    // Never fill half of an NWS day with another provider's numbers.
    const nws = matching.length > 0;
    return {
      date, periods: matching, source: nws ? 'NWS' : 'Open-Meteo',
      high: nws ? temperature(day) : number(daily.temperature_2m_max?.[index]),
      low: nws ? temperature(night) : number(daily.temperature_2m_min?.[index]),
      chance: nws ? number((day || night)?.probabilityOfPrecipitation?.value) : number(daily.precipitation_probability_max?.[index]),
      chanceLabel: nws ? (day ? 'Day' : 'Night') : 'Daily peak',
      summary: (day || night)?.shortForecast || '',
      rain: rainTotal(daily.rain_sum?.[index], daily.showers_sum?.[index]),
      code: daily.weather_code?.[index]
    };
  }

  function age(timestamp, now = Date.now()) {
    const elapsed = now - Date.parse(timestamp);
    if (!Number.isFinite(elapsed)) return 'time unavailable';
    const minutes = Math.max(0, Math.floor(elapsed / 60000));
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    return hours < 24 ? `${hours} hour${hours === 1 ? '' : 's'} ago` : `${Math.floor(hours / 24)} day${hours < 48 ? '' : 's'} ago`;
  }
  function normalize(data) {
    // API wall-clock timestamps need their offset when visitors are in another zone.
    if (!data || !Number.isFinite(data.utc_offset_seconds)) return data;
    const mins = Math.abs(data.utc_offset_seconds / 60);
    const offset = `${data.utc_offset_seconds < 0 ? '-' : '+'}${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
    const stamp = t => typeof t === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(t) ? t + offset : t;
    if (data.current?.time) data.current.time = stamp(data.current.time);
    if (data.hourly?.time) data.hourly.time = data.hourly.time.map(stamp);
    for (const key of ['sunrise', 'sunset']) if (data.daily?.[key]) data.daily[key] = data.daily[key].map(stamp);
    return data;
  }
  function hourDescription(h) {
    return `${h.fullTime || h.time}: ${degrees(h.temp)} · Precipitation ${percent(h.rain)} · Rainfall ${inches(h.amount)}`;
  }
  // Monotone cubic curve (Fritsch–Carlson): smooth, but never overshoots the real hourly values.
  function smoothPath(points) {
    const n = points.length;
    if (!n) return '';
    const r = v => Math.round(v * 10) / 10;
    if (n === 1) return `M${r(points[0][0])},${r(points[0][1])}`;
    const dx = [], slope = [], tangent = [];
    for (let i = 0; i < n - 1; i++) { dx[i] = points[i + 1][0] - points[i][0]; slope[i] = (points[i + 1][1] - points[i][1]) / dx[i]; }
    tangent[0] = slope[0]; tangent[n - 1] = slope[n - 2];
    for (let i = 1; i < n - 1; i++) tangent[i] = slope[i - 1] * slope[i] <= 0 ? 0 : 3 * (dx[i - 1] + dx[i]) / ((2 * dx[i] + dx[i - 1]) / slope[i - 1] + (dx[i] + 2 * dx[i - 1]) / slope[i]);
    let d = `M${r(points[0][0])},${r(points[0][1])}`;
    for (let i = 0; i < n - 1; i++) {
      const [x0, y0] = points[i], [x1, y1] = points[i + 1], h = dx[i] / 3;
      d += ` C${r(x0 + h)},${r(y0 + tangent[i] * h)} ${r(x1 - h)},${r(y1 - tangent[i + 1] * h)} ${r(x1)},${r(y1)}`;
    }
    return d;
  }
  // Runs of consecutive hours with a value, so gaps stay gaps instead of being bridged.
  function runs(hours, key, x, scale) {
    const out = [];
    let run = [];
    hours.forEach((h, i) => {
      if (finite(h[key])) run.push([x(i), scale(Number(h[key]))]);
      else if (run.length) { out.push(run); run = []; }
    });
    if (run.length) out.push(run);
    return out;
  }
  function chart(hours, source = 'Open-Meteo') {
    if (!hours.length) return '<p>Hourly chart unavailable.</p>';
    const temps = hours.map(h => h.temp).filter(finite).map(Number);
    if (!temps.length) return '<p>Hourly chart unavailable.</p>';
    const low = Math.floor(Math.min(...temps) / 5) * 5 - 5;
    const high = Math.ceil(Math.max(...temps) / 5) * 5 + 5;
    const x = i => 64 + i * (752 / Math.max(1, hours.length - 1));
    const y = t => 190 - (t - low) / (high - low) * 144;
    const chanceY = value => 190 - Math.max(0, Math.min(100, value)) * 1.44;
    const tempRuns = runs(hours, 'temp', x, y);
    const chanceRuns = runs(hours, 'rain', x, chanceY);
    const area = (run, base) => `${smoothPath(run)} L${run[run.length - 1][0]},${base} L${run[0][0]},${base} Z`;
    const maxAmount = Math.max(.05, ...hours.map(h => number(h.amount) || 0));
    const rainY = value => 290 - value / maxAmount * 60;
    const barWidth = Math.min(22, 752 / Math.max(1, hours.length - 1) * .62);
    const hiIndex = hours.findIndex(h => finite(h.temp) && Number(h.temp) === Math.max(...temps));
    const loIndex = hours.findIndex(h => finite(h.temp) && Number(h.temp) === Math.min(...temps));
    const extreme = (i, above) => i < 0 ? '' : `<circle cx="${x(i)}" cy="${y(hours[i].temp)}" r="4.5" class="chart-dot"/><text x="${x(i)}" y="${y(hours[i].temp) + (above ? -12 : 22)}" text-anchor="middle" class="chart-extreme">${Math.round(hours[i].temp)}°</text>`;
    return `<figure class="weather-chart"><figcaption><span class="chart-temp-key">Temperature °F</span><span class="chart-chance-key">Precipitation chance %</span><span class="chart-rain-key">Rainfall in</span></figcaption>
      <div class="weather-chart-scroll" tabindex="0" role="region" aria-label="Scrollable hourly temperature and rain chart">
      <svg viewBox="0 0 880 338" role="img" aria-labelledby="hourly-chart-title hourly-chart-desc">
      <title id="hourly-chart-title">Next 24 hours: temperature, precipitation chance and rainfall</title>
      <desc id="hourly-chart-desc">${escape(hours.map(hourDescription).join('; '))}</desc>
      <defs>
        <linearGradient id="chart-temp-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="chart-temp-stop" stop-opacity=".38"/><stop offset="1" class="chart-temp-stop" stop-opacity="0"/></linearGradient>
        <linearGradient id="chart-chance-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="chart-chance-stop" stop-opacity=".16"/><stop offset="1" class="chart-chance-stop" stop-opacity="0"/></linearGradient>
        <linearGradient id="chart-rain-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="chart-rain-stop" stop-opacity=".95"/><stop offset="1" class="chart-rain-stop" stop-opacity=".25"/></linearGradient>
      </defs>
      ${[0, 0.5, 1].map(f => `<line x1="44" x2="836" y1="${190 - f * 144}" y2="${190 - f * 144}" class="chart-grid"/><text x="36" y="${195 - f * 144}" text-anchor="end" class="chart-axis">${Math.round(low + f * (high - low))}°</text><text x="842" y="${195 - f * 144}" class="chart-axis">${f * 100}%</text>`).join('')}
      ${chanceRuns.map(run => `<path d="${area(run, 190)}" class="chart-chance-area"/>`).join('')}
      ${tempRuns.map(run => `<path d="${area(run, 190)}" class="chart-temp-area"/>`).join('')}
      ${chanceRuns.map(run => `<path d="${smoothPath(run)}" class="chart-chance"/>`).join('')}
      ${tempRuns.map(run => `<path d="${smoothPath(run)}" class="chart-temp"/>`).join('')}
      ${extreme(hiIndex, true)}${loIndex !== hiIndex ? extreme(loIndex, false) : ''}
      <text x="44" y="218" class="chart-axis">Rainfall per hour (in)</text><text x="836" y="218" text-anchor="end" class="chart-axis">${hours.some(h => finite(h.amount)) ? `Scale: 0–${maxAmount.toFixed(2)} in` : 'Rainfall unavailable'}</text>
      <line x1="44" x2="836" y1="290" y2="290" class="chart-grid chart-baseline"/>
      ${hours.map((h, i) => `${finite(h.amount) ? (Number(h.amount) > 0 ? `<rect x="${x(i) - barWidth / 2}" y="${rainY(h.amount)}" width="${barWidth}" height="${290 - rainY(h.amount)}" rx="${Math.min(5, barWidth / 3)}" class="chart-rain"/>` : '') : `<text x="${x(i)}" y="280" text-anchor="middle" class="chart-axis">—</text>`}${i % 3 === 0 || i === hours.length - 1 ? `<text x="${x(i)}" y="318" text-anchor="middle" class="chart-axis">${escape(h.time)}</text>` : ''}`).join('')}
      <g class="chart-cursor" aria-hidden="true"><line x1="0" x2="0" y1="40" y2="292"/><circle cx="0" cy="0" r="6"/></g>
      ${hours.map((h, i) => `<rect data-chart-hour="${i}" data-x="${x(i)}" data-y="${finite(h.temp) ? y(h.temp) : ''}" x="${x(i) - 752 / Math.max(1, hours.length - 1) / 2}" y="32" width="${752 / Math.max(1, hours.length - 1)}" height="265" class="chart-hit"><title>${escape(hourDescription(h))}</title></rect>`).join('')}
      </svg></div>
      <div class="weather-chart-inspector"><label for="weather-chart-hour">Explore an hour</label><input id="weather-chart-hour" type="range" min="0" max="${hours.length - 1}" value="0" aria-valuetext="${escape(hourDescription(hours[0]))}" aria-controls="weather-chart-readout"><output id="weather-chart-readout" for="weather-chart-hour" aria-live="polite">${escape(hourDescription(hours[0]))}</output></div>
      <p class="weather-detail-note">Temperature and precipitation: ${escape(source)}. Rainfall: Open-Meteo, for the hour beginning at each time. Hover, tap, or use the hour slider.</p></figure>`;
  }
  function bindChart(root, hours) {
    const slider = root.querySelector('#weather-chart-hour');
    if (!slider) return;
    const select = index => {
      if (!hours[index]) return;
      slider.value = index;
      const text = hourDescription(hours[index]);
      slider.setAttribute('aria-valuetext', text);
      root.querySelector('#weather-chart-readout').textContent = text;
      root.querySelectorAll('[data-chart-hour]').forEach(el => el.classList.toggle('is-selected', Number(el.dataset.chartHour) === Number(index)));
      const hit = root.querySelector(`[data-chart-hour="${index}"]`);
      const cursor = root.querySelector('.chart-cursor');
      if (hit && cursor) {
        cursor.setAttribute('transform', `translate(${hit.dataset.x},0)`);
        const dot = cursor.querySelector('circle');
        dot.setAttribute('cy', hit.dataset.y || 0);
        dot.style.display = hit.dataset.y ? '' : 'none';
      }
    };
    slider.addEventListener('input', () => select(Number(slider.value)));
    root.querySelectorAll('[data-chart-hour]').forEach(el => {
      el.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') select(Number(el.dataset.chartHour)); });
      el.addEventListener('click', () => select(Number(el.dataset.chartHour)));
    });
    select(0);
  }
  async function almanac() {
    const caption = document.getElementById('almanac-edition');
    if (!caption) return;
    try {
      const response = await fetch('almanac/manifest.json', {cache:'no-cache'});
      if (!response.ok) throw new Error('Unavailable');
      const meta = await response.json();
      caption.textContent = `${meta.date || 'Undated'} edition · ${meta.location || 'Philly 19111'}. Illustrated forecast snapshot; its printed numbers do not update with the live forecast above.`;
      if (meta.generatedAt && Number.isFinite(Date.parse(meta.generatedAt))) caption.textContent += ` Created ${new Date(meta.generatedAt).toLocaleString('en-US', {timeZone:'America/New_York'})} Eastern.`;
    } catch (_) { caption.textContent = 'Illustrated Philly 19111 forecast snapshot. Edition details are unavailable; use the live forecast above for updated conditions.'; }
  }
  return { normalize, chart, bindChart, almanac, forecastDay, age, degrees, percent, inches, rainTotal, temperature, number };
})();
