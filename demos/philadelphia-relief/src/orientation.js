import { groundPoint } from './imagery-tiles.js?v=philly-2026090903';

export function overviewPoint(lon, lat, bounds, width = 220, height = 150) {
  return [12 + (lon - bounds.west) / (bounds.east - bounds.west) * (width - 24),
    8 + (bounds.north - lat) / (bounds.north - bounds.south) * (height - 16)];
}

export function createOrientation({ host, projection, water, onVisit }) {
  if (!host) return { update() {}, dispose() {} };
  const canvas = host.querySelector('canvas'), ctx = canvas.getContext('2d');
  const details = host.querySelector('details'), note = host.querySelector('.orientation-position');
  details.open = !window.matchMedia('(max-width: 820px)').matches;
  const width = 220, height = 150, bounds = projection.bounds;
  const point = (lon, lat) => overviewPoint(lon, lat, bounds, width, height);
  const background = document.createElement('canvas');
  background.width = width * 2; background.height = height * 2;
  const base = background.getContext('2d'); base.scale(2, 2);
  base.fillStyle = '#d6dac6'; base.fillRect(0, 0, width, height);
  base.strokeStyle = '#87987e'; base.lineWidth = .5;
  base.strokeRect(12, 8, width - 24, height - 16);
  for (const feature of water?.features || []) {
    const g = feature.geometry;
    if (g.type.includes('Line') && feature.properties?.rank > 1) continue;
    if (g.type.includes('Polygon') && (feature.properties?.area || 0) < 200000) continue;
    const rings = g.type === 'Polygon' ? g.coordinates : g.type === 'MultiPolygon'
      ? g.coordinates.flat() : g.type === 'LineString' ? [g.coordinates]
        : g.type === 'MultiLineString' ? g.coordinates : [];
    for (const ring of rings) {
      if (ring.length < 2) continue;
      base.beginPath();
      const stride = Math.max(1, Math.floor(ring.length / 350));
      ring.filter((_, i) => i % stride === 0 || i === ring.length - 1).forEach(([lon,lat], i) => {
        const [x,y] = point(lon,lat); if (!i) base.moveTo(x,y); else base.lineTo(x,y);
      });
      base.strokeStyle = '#41717a'; base.lineWidth = .8;
      if (g.type.includes('Polygon')) { base.fillStyle = '#5d8281'; base.fill('evenodd'); }
      else base.stroke();
    }
  }
  base.font = '9px system-ui'; base.fillStyle = '#253e41';
  for (const [name,lon,lat] of [['Philadelphia',-75.1635,39.9526],['Trenton',-74.7429,40.2171],
      ['Wilmington',-75.5466,39.7447]]) {
    const [x,y] = point(lon,lat);
    base.beginPath(); base.arc(x,y,1.6,0,Math.PI*2); base.fill();
    base.fillText(name, Math.min(width - name.length * 4.8 - 4, x+4), y-4);
  }
  base.font = 'bold 10px system-ui'; base.fillText('N ↑', 15, 22);
  canvas.width = width * 2; canvas.height = height * 2;
  const click = event => {
    const button = event.target.closest('button[data-destination]');
    if (button) onVisit(button.dataset.destination);
  };
  host.addEventListener('click', click);
  let clock = 0;
  return {
    update(pose, aspect, dt) {
      clock += dt;
      if (clock < .12) return;
      clock = 0; host.hidden = pose.dist > 28000;
      if (host.hidden || !ctx) return;
      note.textContent = `${pose.lat.toFixed(3)}° N · ${Math.abs(pose.lon).toFixed(3)}° W`;
      if (!details.open) return;
      ctx.setTransform(2,0,0,2,0,0); ctx.drawImage(background,0,0,width,height);
      const corners = [[-1,-1],[1,-1],[1,1],[-1,1]]
        .map(([x,y]) => groundPoint(pose,projection,aspect,x,y,true)).filter(Boolean);
      if (corners.length >= 3) {
        ctx.beginPath(); corners.forEach((p,i) => {
          const [x,y] = point(p.lon,p.lat); if (i) ctx.lineTo(x,y); else ctx.moveTo(x,y);
        });
        ctx.closePath(); ctx.fillStyle = '#f0b66344'; ctx.fill();
        ctx.strokeStyle = '#a45b23'; ctx.lineWidth = 1.2; ctx.stroke();
      }
      const [x,y] = point(pose.lon,pose.lat);
      ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2);
      ctx.fillStyle = '#edb466'; ctx.fill(); ctx.strokeStyle = '#203c43'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.save(); ctx.translate(x,y); ctx.rotate(pose.bearing*Math.PI/180);
      ctx.beginPath(); ctx.moveTo(-3,-7); ctx.lineTo(0,-11); ctx.lineTo(3,-7);
      ctx.stroke(); ctx.restore();
    },
    dispose() { host.removeEventListener('click',click); },
  };
}
