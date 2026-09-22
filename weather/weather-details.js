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
  return { normalize, chart, almanac };
})();
