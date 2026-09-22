/* Small, dependency-free views shared by the weather console. */
window.WeatherDetails = (() => {
  const finite = value => value != null && Number.isFinite(Number(value));
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
  function chart(hours) {
    if (!hours.length) return '<p>Hourly chart unavailable.</p>';
    const temps = hours.map(h => h.temp).filter(finite).map(Number);
    if (!temps.length) return '<p>Hourly chart unavailable.</p>';
    const low = Math.floor(Math.min(...temps) / 5) * 5 - 5;
    const high = Math.ceil(Math.max(...temps) / 5) * 5 + 5;
    const x = i => 64 + i * (752 / Math.max(1, hours.length - 1));
    const y = t => 190 - (t - low) / (high - low) * 144;
    const points = hours.map((h, i) => `${x(i)},${y(h.temp)}`).join(' ');
    return `<figure class="weather-chart"><figcaption><span class="chart-temp-key">Temperature °F</span><span class="chart-rain-key">Hourly rain chance %</span></figcaption>
      <div class="weather-chart-scroll" tabindex="0" role="region" aria-label="Scrollable hourly temperature and rain chart">
      <svg viewBox="0 0 880 250" role="img" aria-labelledby="hourly-chart-title hourly-chart-desc">
      <title id="hourly-chart-title">Next 12 hours: temperature and rain chance</title>
      <desc id="hourly-chart-desc">${escape(hours.map(h => `${h.time}: ${h.temp} degrees Fahrenheit, ${h.rain}% rain chance`).join('; '))}</desc>
      ${[0, 0.5, 1].map(f => `<line x1="44" x2="836" y1="${190 - f * 144}" y2="${190 - f * 144}" class="chart-grid"/><text x="36" y="${195 - f * 144}" text-anchor="end">${Math.round(low + f * (high - low))}°</text><text x="842" y="${195 - f * 144}">${f * 100}%</text>`).join('')}
      ${hours.map((h, i) => `<rect x="${x(i) - 16}" y="${190 - h.rain * 1.44}" width="32" height="${h.rain * 1.44}" rx="4" class="chart-rain"><title>${escape(h.time)}: ${h.rain}% rain chance</title></rect>`).join('')}
      <polyline points="${points}" class="chart-temp"/>
      ${hours.map((h, i) => `<circle cx="${x(i)}" cy="${y(h.temp)}" r="4" class="chart-dot"><title>${escape(h.time)}: ${h.temp}°F</title></circle><text x="${x(i)}" y="${y(h.temp) - 12}" text-anchor="middle">${h.temp}°</text><text x="${x(i)}" y="220" text-anchor="middle">${escape(h.time)}</text>`).join('')}
      </svg></div></figure>`;
  }
  function garden(data, tz = 'America/New_York', now = new Date()) {
    if (!data?.daily?.time || !data?.hourly?.time) return '<section id="weather-garden" class="weather-garden"><h3>Garden outlook</h3><p>Rainfall totals and overnight temperatures are temporarily unavailable.</p></section>';
    const today = now.toLocaleDateString('en-CA', {timeZone: tz});
    const hourNow = Number(now.toLocaleTimeString('en-US', {timeZone: tz, hour: 'numeric', hour12: false}));
    const dateOf = t => new Date(t).toLocaleDateString('en-CA', {timeZone: tz});
    const hourOf = t => Number(new Date(t).toLocaleTimeString('en-US', {timeZone: tz, hour: 'numeric', hour12: false}));
    const daily = data.daily, hourly = data.hourly;
    const past = daily.time.map((t, i) => t < today ? daily.rain_sum?.[i] : null).filter(finite).map(Number).slice(-7);
    const upcoming = hourly.time.map((t, i) => ({time: new Date(t).getTime(), stamp:t, rain:hourly.rain?.[i], temp:hourly.temperature_2m?.[i]})).filter(h => h.time >= now.getTime() && h.time < now.getTime() + 24 * 3600000);
    const rain = upcoming.map(h => h.rain).filter(finite).map(Number);
    // Before dawn show the remainder of this night; otherwise show tonight through 6 am.
    const overnight = upcoming.filter(h => hourNow < 6 ? dateOf(h.stamp) === today && hourOf(h.stamp) < 6 : (dateOf(h.stamp) === today && hourOf(h.stamp) >= 18) || (dateOf(h.stamp) !== today && hourOf(h.stamp) < 6)).map(h => h.temp).filter(finite).map(Number);
    const low = overnight.length ? Math.min(...overnight) : null;
    const risk = low == null ? 'Unavailable' : low <= 32 ? 'Freeze risk' : low <= 36 ? 'Frost possible' : 'Low frost risk';
    const sum = values => values.reduce((a, b) => a + b, 0).toFixed(2);
    return `<section id="weather-garden" class="weather-garden"><h3>Garden outlook</h3><div class="weather-garden-grid">
      <div><span>Previous 7 full days</span><strong>${past.length === 7 ? sum(past) + ' in' : 'Unavailable'}</strong><small>Estimated rainfall</small></div>
      <div><span>Next 24 hours</span><strong>${rain.length === 24 ? sum(rain) + ' in' : 'Unavailable'}</strong><small>Forecast rainfall</small></div>
      <div><span>${hourNow < 6 ? 'Rest of tonight' : 'Tonight'} · 6 pm–6 am</span><strong>${low == null ? '—' : Math.round(low) + '°F'}</strong><small>${risk}</small></div>
      </div><p class="weather-detail-note">Open-Meteo estimates, not a rain gauge in your yard. Frost can form above 32°F near the ground; check sheltered and exposed plants separately.</p></section>`;
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
  return { normalize, chart, garden, almanac };
})();
