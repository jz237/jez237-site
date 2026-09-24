// Published FOX 29 / WMVision image widgets, checked 2026-09-20.
// Coordinates identify the published host or viewed area, not a surveyed mount.
const fox = (id, name, lon, lat, uid, location, area = false) => ({
  id, name, lon, lat, location, area, provider: 'FOX 29 · WMVision',
  url: `https://www.fox29.com/${id}`,
  preview: `https://api.wetmet.net/widgets/image/frame.php?uid=${uid}`,
});
export const WEBCAMS = [
  fox('philadelphia-webcam', 'Benjamin Franklin Parkway', -75.168, 39.956,
    '263dd5cc083ccb2008eeb1ae16b1269f', '1709 Benjamin Franklin Parkway'),
  fox('camden-webcam', 'Camden waterfront', -75.130258, 39.943377,
    '6b8d95fb42d2f3be038f140e39251c9b', 'Adventure Aquarium · Riverside Drive'),
  fox('doylestown-webcam', 'Doylestown · Main Street', -75.130433, 40.311198,
    'f3b535ee369a95f6c6ab40cf9147a33d', 'Former Bucks County Courthouse'),
  fox('independence-mall-webcam', 'Independence Mall', -75.1491, 39.9508,
    'e3fd58dc6f8d6955e5c7e4af8ade46bb', 'Independence Mall · viewed area', true),
  fox('independence-mall-panoramic-webcam', 'Independence Mall · panorama', -75.1491, 39.9508,
    '82bc4f98ec470741682e769f715ada76', 'Independence Mall · viewed area', true),
  fox('king-of-prussia-webcam', 'King of Prussia', -75.367791, 40.09308,
    '706bf01f988fbdfde46969b9bd403829', 'The Alloy · 301 W Dekalb Pike'),
  fox('media-webcam', 'Media · State Street', -75.3893, 39.9175,
    '4b91cc441c4f08cfc20947a94ae2387d', 'State Street · viewed area', true),
  fox('philadelphia-international-airport-camera', 'Philadelphia airport', -75.22678, 39.87327,
    '6890b158439935a968125f5ab471076c', 'Philadelphia International Airport · viewed area', true),
  fox('philadelphia-stadium-complex-webcam', 'Philadelphia stadiums', -75.170979, 39.896532,
    '8c88166ce2d13d1d859ecfcc15791300', 'Courtyard Philadelphia South at the Navy Yard'),
  fox('philadelphia-stadium-complex-panoramic-webcam', 'Philadelphia stadiums · panorama',
    -75.170979, 39.896532,
    '2fceeb92ea042526f15456ae4a763007', 'Courtyard Philadelphia South at the Navy Yard'),
  fox('west-chester-webcam', 'West Chester · Courthouse', -75.605331, 39.960502,
    '79af68966dff773157d467165b5b2a6b', 'Across from the Historic Chester County Courthouse'),
  fox('wilmington-webcam', 'Wilmington riverfront', -75.563759, 39.731335,
    '9aade9d4f3ae2424a99c099d5c7a2720', 'Westin Wilmington · 818 Shipyard Drive'),
];

export function trafficCameras(doc) {
  const seen = new Set();
  return (doc?.cameras || []).filter(p => {
    if (!p || typeof p.id !== 'string' || !/^\d+$/.test(p.id) || seen.has(p.id)) return false;
    if (typeof p.name !== 'string' || !p.name.trim()) return false;
    if (!Number.isFinite(p.lon) || !Number.isFinite(p.lat)) return false;
    if (p.lon < -75.8 || p.lon > -74.7 || p.lat < 39.7 || p.lat > 40.55) return false;
    seen.add(p.id); return true;
  }).map(p => ({ ...p, provider: 'PennDOT · 511PA',
    location: 'Published 511PA location · availability varies',
    url: `https://511pa.com/map#camera-${p.id}`, traffic: true }));
}

export const hasCameraPreview = p => !!(p.preview || p.snapshot || p.stream);
export const cameraMatchesFilter = (p, filter) => filter === 'discovered' ? !!p.discovered
  : filter === 'preview' ? hasCameraPreview(p) : true;

// Owner-published public cameras only. Derive media URLs from provider identifiers;
// the lazy catalog cannot introduce arbitrary players or stream credentials.
export function discoveredCameras(doc) {
  const seen = new Set();
  return (Array.isArray(doc?.cameras) ? doc.cameras : []).flatMap(p => {
    if (!p || !/^found-[a-z0-9-]+$/.test(p.id) || seen.has(p.id)
      || typeof p.name !== 'string' || !p.name.trim()) return [];
    if (!Number.isFinite(p.lon) || !Number.isFinite(p.lat)
      || p.lon < -75.8 || p.lon > -74.7 || p.lat < 39.7 || p.lat > 40.55) return [];
    let media;
    if (p.source === 'earthcam' && /^[a-f0-9]{32}$/.test(p.thumbnail)
      && ['https://www.earthcam.com/cams/pennsylvania/philadelphia/',
        'https://www.earthcam.com/usa/pennsylvania/philadelphia/independencehall/'].includes(p.url)) {
      media = { provider: 'EarthCam', url: p.url, previewKind: 'thumbnail',
        snapshot: `https://static.earthcam.com/camshots/512x288/${p.thumbnail}.jpg`,
        previewNote: 'Provider thumbnail · not a live frame. Open the camera page for live video.' };
      const video = { 'found-franklin-institute': '9mMnqO1UuIU',
        'found-liberty-bell': 'F1EQEDL4ddU' }[p.id];
      if (video && p.video === video) {
        media.player = `https://www.youtube-nocookie.com/embed/${video}`
          + '?autoplay=1&mute=1&playsinline=1&rel=0';
      }
    } else if (p.source === 'phila-oem' && Number.isInteger(p.camera)
      && p.camera >= 1 && p.camera <= 11 && p.id === `found-oem-${p.camera}`) {
      media = { provider: 'Philadelphia OEM · Flood Watch',
        url: `https://oemstream.online/view.html?cam=cam${p.camera}`,
        publisherUrl: 'https://flood-monitoring.phila.gov/',
        previewNote: 'City thumbnail · capture time not supplied. '
          + 'Live video requires the provider’s security check.',
        notice: 'Open this camera’s page and complete the city’s security check to start live video. '
          + 'Availability varies.' };
      // Only these thumbnails are published by the current official city catalog.
      if ([1, 2, 3, 5, 6, 10, 11].includes(p.camera)) {
        media.snapshot = `https://oemstream.online/thumbs/c${String(p.camera).padStart(2, '0')}.jpg`;
        media.previewKind = 'thumbnail';
      }
    } else if (p.source === 'usgs' && ['NJ_Delaware_River_at_Lambertville_NJ',
      'NJ_Delaware_River_at_Trenton', 'NJ_Assunpink_Creek_at_Trenton',
      'PA_Neshaminy_Creek_near_Langhorne', 'PA_Vivotek_Schuylkill_River_at_Philadelphia',
      'PA_East_Branch_Brandywine_Creek_below_Downingtown',
      'PA_Brandywine_Creek_at_Chadds_Ford'].includes(p.station)) {
      const folder = p.station === 'NJ_Assunpink_Creek_at_Trenton' ? '720' : 'overlay';
      media = { provider: 'USGS river camera',
        url: `https://apps.usgs.gov/hivis/camera/${p.station}`,
        snapshot: `https://usgs-nims-images.s3.amazonaws.com/${folder}/${p.station}/${p.station}_newest.jpg`,
        previewNote: 'Periodic river snapshot · see image timestamp when available; not continuous video.' };
    } else if (p.source === 'ptztv' && p.id === 'found-port-philly') {
      media = { provider: 'PTZtv · Port Philly', url: 'https://www.ptztv.live/port-philly-webcam/',
        snapshot: 'https://www.ptztv.live/port-philly-webcam/images/ppw_preview.jpg',
        previewNote: 'Provider preview · capture time not verified. '
          + 'Open the full camera page for video.' };
    } else if ((p.source === 'dosbirds' && ['2oqJJvDzdFY', '1qhsPj4jDT4', 'I1cueV9veYw'].includes(p.video))
      || (p.source === 'ironrail' && p.video === 'F1lNwIEAXJU')
      || (p.source === 'willowgrove' && p.video === 'vIdA-SCcM68')
      || (p.source === 'perkasie-borough' && p.id === 'found-perkasie-covered-bridge'
        && p.video === 'xWUiE7m2PLQ')
      || (p.source === 'rescue-rescue' && {
        'found-kensington-cam2': 'hlGz7Jq_BT0',
        'found-kensington-cam3': 'aphvln5Zwv0',
        'found-kensington-cam6': '6LtXdZJb-Kk',
      }[p.id] === p.video && typeof p.video === 'string')) {
      const provider = p.source === 'ironrail' ? 'Iron Rail Cams'
        : p.source === 'willowgrove' ? 'Willow Grove Weather Center'
          : p.source === 'perkasie-borough' ? 'Perkasie Borough'
            : p.source === 'rescue-rescue' ? 'Rescue Rescue' : 'Delaware Ornithological Society';
      media = { provider, previewKind: 'thumbnail',
        url: `https://www.youtube.com/watch?v=${p.video}`,
        snapshot: `https://i.ytimg.com/vi/${p.video}/hqdefault.jpg`,
        player: `https://www.youtube-nocookie.com/embed/${p.video}?autoplay=1&mute=1&playsinline=1&rel=0`,
        previewNote: 'Video thumbnail · not a live frame. '
          + 'Play the provider video or open its camera page.' };
      if (p.source === 'rescue-rescue') {
        media.publisherUrl = 'https://www.youtube.com/channel/UCQ-V0JYSv1Ulme_daroQk7Q/streams';
      }
      if (p.source === 'perkasie-borough') {
        media.publisherUrl = 'https://www.youtube.com/@perkasieborough5325/streams';
        media.notice = 'Borough construction camera · activity depends on the work schedule. '
          + 'Pin marks the bridge worksite, not a surveyed camera mount.';
      }
    }
    if (!media) return [];
    seen.add(p.id);
    return [{ id: p.id, name: p.name, lon: p.lon, lat: p.lat,
      location: typeof p.location === 'string' ? p.location : '', area: !!p.area,
      discovered: true, ...media }];
  });
}

// Only published camera media on known provider hosts may reach the player.
export function regionalCameras(doc) {
  const seen = new Set();
  return (doc?.cameras || []).flatMap(p => {
    if (!p || typeof p.id !== 'string' || seen.has(p.id) || typeof p.name !== 'string') return [];
    if (!Number.isFinite(p.lon) || !Number.isFinite(p.lat)) return [];
    if (p.lon < -75.8 || p.lon > -74.7 || p.lat < 39.7 || p.lat > 40.55) return [];
    const point = { id: p.id, name: p.name, lon: p.lon, lat: p.lat };
    if (p.source === 'deldot' && /^deldot-NCAM\d+$/.test(p.id)) {
      const id = p.id.slice(7);
      const stream = `https://video.deldot.gov:443/live/${id}.stream/playlist.m3u8`;
      if (p.stream !== stream) return [];
      seen.add(p.id);
      return [{ ...point, provider: 'DelDOT', traffic: true,
        location: 'Published DelDOT location · availability varies',
        stream: p.enabled ? stream : undefined,
        url: `camera.html?id=${encodeURIComponent(p.id)}`,
        providerUrl: 'https://deldot.gov/map/?region=Wilmington' }];
    }
    if (p.source === 'attheshore' && /^ats-[a-z0-9-]+$/.test(p.id)) {
      const id = p.id.slice(4);
      if (!/^https:\/\/(?:www\.)?attheshore\.com\/camera\/[a-z0-9-]+$/.test(p.url)) return [];
      const imagePath = `https://api.igotview.com/images/cams/${id}/`;
      if (typeof p.snapshot !== 'string' || !p.snapshot.startsWith(imagePath)
        || !/^(?:[0-9]|1[0-9]|2[0-3])\.jpg$/.test(p.snapshot.slice(imagePath.length))) return [];
      const players = [`https://attheshore.com/combined-player?id=${id}`,
        `https://www.attheshore.com/combined-player?id=${id}`];
      const video = { 'ats-rittenhouse554': '1vGH-8jvKcg', 'ats-rittenhouse555': 'MHK6eExbhsc',
        'ats-igloo557': 'jAZjvlaBW3Y', 'ats-igloo558': '-J49AAW3Wik' }[p.id];
      const broadcast = video && p.video === video ? {
        url: `https://www.youtube.com/watch?v=${video}`,
        snapshot: `https://i.ytimg.com/vi/${video}/hqdefault.jpg`, previewKind: 'thumbnail',
        previewNote: 'Video thumbnail · not a live frame. Play the provider video or open its camera page.',
        player: `https://www.youtube-nocookie.com/embed/${video}?autoplay=1&mute=1&playsinline=1&rel=0`,
        publisherUrl: `https://www.youtube.com/channel/${id.startsWith('igloo')
          ? 'UC-caLIi1HspXkq2Dwh-kC9A' : 'UC1ia-zIvH6uuHAEfdNUEVqA'}/streams`,
      } : {};
      seen.add(p.id);
      return [{ ...point, url: p.url, snapshot: p.snapshot,
        player: players.includes(p.player) ? p.player : undefined,
        provider: 'AtTheShore · iGotView', location: p.location, area: true, ...broadcast }];
    }
    return [];
  });
}

// Screen-space groups keep every camera represented without hundreds of overlapping targets.
// Preview cameras stay separate from traffic-only groups so their images are easy to discover.
export function groupCameras(points, size = 48) {
  const groups = [];
  for (const p of points) {
    const group = groups.find(g => g.traffic === !!p.item.traffic
      && g.discovered === !!p.item.discovered
      && Math.hypot(g.x - p.x, g.y - p.y) < size);
    if (group) {
      group.items.push(p.item);
      group.x += (p.x - group.x) / group.items.length;
      group.y += (p.y - group.y) / group.items.length;
    } else groups.push({ x: p.x, y: p.y, traffic: !!p.item.traffic,
      discovered: !!p.item.discovered, items: [p.item] });
  }
  return groups;
}

export function popupPosition(x, y, width, height, cardWidth, cardHeight) {
  const left = Math.max(8, Math.min(width - cardWidth - 8, x - cardWidth / 2));
  const above = y - cardHeight - 26;
  return { left, top: Math.max(8, Math.min(height - cardHeight - 8, above >= 90 ? above : y + 26)) };
}
