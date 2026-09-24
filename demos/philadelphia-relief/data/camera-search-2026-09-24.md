# Philadelphia public-camera search — September 24, 2026

This is a broad, owner-by-owner search, not a claim that every public camera has
been found or that every mapped view is online. Existing regional bounds remain
39.7–40.55° N, 75.8–74.7° W. Camera mounts are approximate; private residential
locations are not inferred. No subscriptions, paid APIs, credentials, private
camera discovery, or continuous background searches are used.

## Added and corrected

- **11 Philadelphia OEM Flood Watch views**. The official City announcement
  <https://www.phila.gov/2026-05-09-oem-flood-monitoring-technology-brings-real-time-data-accessible-to-the-public/>
  links <https://flood-monitoring.phila.gov/>. That application's public
  `getOemLocations` catalog currently lists seven cameras and publishes their
  coordinates and `oemstream.online` thumbnails/video links. Its video host's
  public index, <https://oemstream.online/index.html>, lists 11 distinct camera
  viewer links. Added all 11, preserving each `view.html?cam=camN` destination.
  The provider requires a Turnstile security check before streaming. **These are
  verified public listings, not 11 independently verified playing streams.**
  Direct HLS attempts did not play; the integration opens the provider's viewer
  and does not bypass its checks or claim the thumbnails are live frames.
- Seven OEM thumbnails rendered on the official city map: 78th/Buist,
  Cobbs Creek/Springfield, 77th/Elmwood, Baynton/Church, Godfrey/Beechwood,
  Kelly/Midvale, 80th/Caesar. Only these published thumbnail paths are used.
- Four additional owner-listed intersections were geocoded using Philadelphia's
  public AIS search: Belfield/Musgrave, Ridge/Midvale, Main/Shurs, and
  N Christopher Columbus/Summer. These pins offer the specific provider viewer
  without inventing a preview URL. They are included in the camera chooser.
- **Four live-video upgrades, no duplicate pins**: the owner's Rittenhouse
  fountain (`MHK6eExbhsc`) and south panorama (`1vGH-8jvKcg`), and Triangle
  Square west (`-J49AAW3Wik`) and south (`jAZjvlaBW3Y`). Each watch page reported
  `OK`, `isLiveNow=true`, and `playableInEmbed=true`. The current owner channels
  are <https://www.youtube.com/channel/UC1ia-zIvH6uuHAEfdNUEVqA/streams> and
  <https://www.youtube.com/channel/UC-caLIi1HspXkq2Dwh-kC9A/streams>.
  Existing provider IDs retain their identity; four gain YouTube playback and
  a stable publisher link. Thumbnails are labeled, playback remains explicit.
- **Five Igloo camera positions corrected**. The provider catalog's longitude
  `-75.2495422` contradicted its own address, 2223 Grays Ferry Avenue. Philadelphia
  AIS returns `-75.1794810, 39.9451370` for that address, consistent with the
  broadcasts' stated 23rd/South location. All five views now use this location.

Result: **757 mapped views**, 184 with preview support, including 29 purple
discoveries. These counts include traffic locations, alternative angles, and
snapshots; they are not counts of independently verified live video streams.

## Sources searched and disposition

| Source | Result |
| --- | --- |
| FOX29 / WMVision official live-camera directory | All 12 in-region published widgets already mapped; other widgets are outside the valley bounds. |
| AtTheShore / iGotView full catalog (242 listings) and Philadelphia city catalog | All 54 in-region views already represented. Four current owner YouTube broadcasts integrated above. |
| Rescue Rescue current channel and YouTube live results | All three current Kensington views already mapped: Cam 2, 3 and 6. Older Spotlight Rescue broadcasts ended September 17. |
| EarthCam and Franklin Institute | Both verified live owner broadcasts already mapped (Franklin Institute and Liberty Bell). I-95 reconstruction listing did not yield a verified current feed. |
| SkylineWebcams Philadelphia listings | Skyline page explicitly shows OFFLINE. Franklin Institute, Rittenhouse and Triangle views duplicate existing camera locations; old Ninth Street listing did not establish a current stream. |
| PennDOT / 511PA | 569 regional locations already mapped. Published location links do not imply embeddable live video. |
| DelDOT | 93 regional entries already mapped, using the public provider stream paths. |
| NJ511 / NJ Turnpike camera directories | Public catalogs found, but access checks prevented reliable camera-level verification in this run. No guessed stream URLs or locations added. |
| Philadelphia OEM | 11 owner-listed public street viewers added, with provider-security-check notices as described above. |
| USGS HIVIS / station pages | Seven existing river snapshots retained; snapshots are distinguished from continuous video. |
| PTZtv Port Philly | Existing dedicated port view retained; provider page opens externally. |
| 6abc Sky6 and NBC10 regional views | Combined/rotating programs, without verified individual selectable camera feeds. Not duplicated into multiple pins. |
| CBS3 / local news streams | News programs are not continuously available fixed-location cameras. |
| Speedify skyline | Former owner camera page now displays Page not found; current live search did not establish a replacement. |
| Wanamaker rooftop beehives | Directory listings remain, but owner domain failed DNS resolution. No verified current feed. |
| Philadelphia Zoo penguin/bear cameras | Former penguin URL redirects to the general animals page; older animal broadcasts do not establish current live feeds. |
| Fairmount Water Works fishway | Historical documentation describes a camera, but no current public playing feed was located. |
| Willow Grove Weather Center, Iron Rail Cams, DOS falcons | Existing owner-linked weather, Phoenixville rail and three Wilmington falcon feeds retained and included in the live audit. |
| Camp Bow Wow Philadelphia Northeast | Owner publishes a public Camper Cams viewer; linked camera image checks timed out. No unverified dog-camera feeds added. |
| Wag Watch / Doggie VIP | Customer login or paid camera access; excluded. Morgan's Paws public dog cameras are in York, outside the map. |
| WeatherBug regional weather stations | Listings did not establish current playable Philadelphia feeds in this run. |
| Cherry Hill Esterbrook pickleball listing | Current linked owner site did not expose a verified public court stream. |
| Ben.land BeeCam | Follow-up browser verification confirmed both owner-published HLS views play. Added to Cameras & local views; the owner gives only Philadelphia suburbs, so no map pin is assigned. |
| Legacy I Love Sea Isle / Liberty One / Dockside / Penn's Landing camera directories | Old camera endpoints returned errors or referenced retired footage; not added as live. |
| Worldcam, Spotcameras, Camscape, CamStreamer, Teleported and other directories | Used for discovery leads only; duplicates and stale listings traced back to owners before inclusion. |

YouTube searches covered Philadelphia, Center City, Kensington, Manayunk,
Fishtown, Penn's Landing, skyline, street, airport, rail, wildlife and construction
views, including live-only results and current owner channel listings. Streams
from similarly named places outside Pennsylvania were excluded. Search indexing
and provider availability remain incomplete, so future additions are possible.

## Runtime and maintenance

Only metadata ships with the site. No new requests occur before enabling cameras.
Thumbnails load after hovering/selecting a camera; video starts on explicit Play
and stops after one minute or when the card closes, map moves, layer disables,
or tab hides. OEM video stays on its provider's page. Only its exact image host
was added to the route's CSP; no script/frame or video-host exemption was added.

`python tools/audit-camera-streams.py` now checks both catalogs' YouTube broadcasts.
`--discover` also searches the three current street-camera owner channels and
Philadelphia live results. This is a maintainer command, not a visitor-side job.

## Backyard / personal weather-camera follow-up

- [Ben.land BeeCam](https://ben.land/beecam/): both Hive One and Hive Two reached
  readyState 4 and advanced during explicit playback in Chrome. The owner describes
  the site as Philadelphia suburbs, without a published camera town. Added one
  owner-viewer card for its two feeds, without guessing residential coordinates.
- [Willow Grove Weather Center](https://www.youtube.com/@willowgroveweathercenter/streams):
  the channel currently lists only `vIdA-SCcM68` as live. This is already mapped;
  added a convenient owner-channel card rather than duplicating its pin.
- [Northeastern Weather Network](https://northeasternweather.net/), Mid-Atlantic
  Weather Network, Windy/Meteoblue, Windfinder, WebcamGalore, CamStreamer and
  YouTube weather/wildlife results were checked for regional leads. The old
  HeightsWeather Newtown webcam listing could not be reached to verify its owner.
  Doylestown IQnection and Cherry Hill Brookfield legacy listings point to the
  retired Weather Underground camera service, not verified current video.
- [Ambient Weather's public map](https://ambientweather.net/) was checked, including
  its public regional station listings. Weather-station data alone did not establish
  additional working camera feeds. No station was converted into a camera pin.
- A directory labeled a backyard bird feeder as New Hope, Pennsylvania, but the
  linked YouTube broadcast `bZish-38Bbs` explicitly states South Bend, Indiana.
  Excluded. Linden, Murrysville and Reading camera leads are outside this map.
- [Ambient Weather support](https://ambientweather.com/faqs/question/view/id/1829/)
  records Weather Underground's camera-service closure on October 21, 2021.
  This may explain remembered backyard cameras missing from today's directories.

This follow-up adds two verified viewing angles through one external viewer, not
two geolocated pins. The mapped total remains 757. No camera player, thumbnail,
external request, new dependency or CSP exception is added to initial page load.

## All-category follow-up

Search scope includes owner-published street, business, rail, animal, construction,
waterfront and personal streams; weather cameras are only one category.

- Added **Perkasie Borough's South Perkasie Covered Bridge restoration** camera,
  `xWUiE7m2PLQ`. The [borough project page](https://www.perkasieborough.org/information/projects/south-perkasie-covered-bridge-rehabilitation/)
  links its official `@perkasieborough5325` channel. The channel lists this feed
  as live; its watch page reports OK, isLiveNow and playableInEmbed. Chrome
  playback advanced from 46803 to 46812 seconds at readyState 4. Broadcast began
  September 21, 2026. Worksite pin uses 40.3675, -75.295 from the
  [National Society for the Preservation of Covered Bridges' corrected guide](https://www.coveredbridgesociety.org/downloads/wg-update_2009.pdf).
  It identifies the Lenape Park bridge, not the precise camera mount.
- [DelVal / Whysper Wynd foal cameras](https://pennhorseracing.com/foalcams/)
  now redirect to an offseason notice promising the next season in 2027.
- The owner-published Birdies Out Back Delaware broadcast `wRGtrWoNtlo` ended
  August 22, 2024; its current channel yielded no active stream. Street Souls'
  Kensington `kLyKzCWOGag` was removed by its uploader.
- Camp Bow Wow Philadelphia Northeast and Cherry Hill publish camera pages,
  but current playback was not verified. Northeast's browser page was blocked
  by the provider. No access checks were bypassed. Camguide's "Pet Shelter"
  listing points to Camp Bow Wow, rather than a newly found animal shelter.
- [Penn's Landing Park's project page](https://www.parkatpennslanding.com/) directs
  camera viewers to the already mapped PennDOT network. Broad searches for local
  railways, marinas, businesses, animal shelters and construction cameras mostly
  returned existing views, historical streams or places outside the region.

Current total: **758 mapped views, 185 with preview support, 30 purple discoveries**.
This is one new independently verified live feed in this pass, not a claim of
complete public-camera coverage. Its thumbnail loads on selection/hover; video
starts only after Play. No new media host or background polling was introduced.
