# Discovered public cameras

Checked 2026-09-21. Nine additional views, published by their owners. No discovered/private IP cameras, credentials, signed stream URLs, or paid APIs. Only metadata is stored here. Runtime images remain on provider hosts.

- EarthCam: the Franklin Institute and Liberty Bell camera pages in the catalog publish these thumbnails. Both players advertise live feeds, but their thumbnails can be old; the UI explicitly labels them as thumbnails, never live frames. The player opens on the specific provider page.
- USGS: three official webcam pages in the catalog link their HIVIS viewers and public newest-image objects. Coordinates are the published station positions from https://waterservices.usgs.gov/nwis/site/?format=rdb&sites=01462000,01463500,01464000 . All three images returned HTTP 200 with current 2026-09-21 timestamps. These are periodic snapshots, not continuous video.
- PTZtv: https://www.ptztv.com/ links Port Philly. The Port Philly page publishes the preview image and viewed-area coordinates used here. Its full page refuses framing; we respect that and open it in a new tab. Preview capture time is not asserted.
- Delaware Ornithological Society: https://www.dosbirds.org/citizen-science/falcon-watch/ publishes all three selected YouTube camera links. Each reported playable live content when checked. The north-roof stream XwxS5HriQBE was ended/unplayable and is excluded. The Brandywine Building address and approximate map location are published at https://www.casarino.com/contact/ . Three feeds share one location, represented by a purple numbered group. Still thumbnails are labeled; the privacy-enhanced YouTube player loads only after Play.

All locations denote approximate hosts/viewed areas, not surveyed camera mounts. Availability can change. Images load only in an open hover card after a short delay; thumbnails do not poll; snapshot previews refresh no faster than once per minute. Embedded playback is explicit, limited to one minute, and removed on close, map movement, disabling the layer, or hiding the tab. Single purple pins link directly to the specific provider camera; grouped pins offer individual choices. Purple groups never merge into green/gold groups.


## Second search, 2026-09-21

Six more public cameras bring the discovery catalog to 15. Existing entries are retained.

- Four additional USGS snapshots: Neshaminy Creek near Langhorne (01465500), Schuylkill River at Philadelphia (01474500; the newer Vivotek camera), East Branch Brandywine below Downingtown (01480870), and Brandywine at Chadds Ford (01481000). Each official monitoring-location page in the catalog publishes its image and HIVIS viewer links. All returned HTTP 200 and Last-Modified dates of 2026-09-21 at 23:00 or 23:30 UTC when checked. Coordinates come from the official NWIS station metadata endpoint: https://waterservices.usgs.gov/nwis/site/?format=rdb&sites=01465500,01474500,01480870,01481000 .
- Phoenixville: Iron Rail Cams' owner-published stream https://www.youtube.com/watch?v=F1lNwIEAXJU reports live playback and permits embedding. The description identifies the Norfolk Southern Harrisburg Line and nearby Abrams Yard. Approximate viewed-area placement near Pawlings Road is corroborated by https://www.spotatrain.com/live-cams/us-phoenixville-pa/ ; it is not a precise private camera mount. Do not move this pin to a residence. Thumbnail remains explicitly labeled as a thumbnail.
- Willow Grove Weather Center: https://www.youtube.com/watch?v=vIdA-SCcM68 is linked on the owner's streams page https://www.youtube.com/@willowgroveweathercenter/streams . Verified live and embeddable. The owner links its public station dashboard at https://www.wunderground.com/weather/us/pa/willow-grove/KPAWILLO7 ; use that published coarse location (40.14, -75.11), not an inferred residential address. The two sky cameras currently have ended broadcasts and are excluded.

Rejected or deferred: Lake Solebury's owner-linked channel currently contains ended broadcasts, not a current live stream; Graterford's USGS snapshot is stale (2026-06-02); Rancocas at Pemberton is outside the diorama bounds; 2400 Chestnut's current owner page no longer publishes its former falcon feed; Saint Joseph's construction feeds could not be verified; existing AtTheShore views are duplicates. No archived footage is presented as live. New sources reuse the existing exact image/frame hosts and one-minute playback lifecycle, so there is no additional CSP exception or background polling.


## Philadelphia coverage audit, 2026-09-24

Three Kensington feeds bring the discovery catalog to 18 (746 mapped views across all catalogs; these are views, not 746 independently verified live video streams). The user's two links identified the current publisher, Rescue Rescue. Its public streams page lists a third Philadelphia feed:

- Cam 2: https://www.youtube.com/watch?v=hlGz7Jq_BT0
- Cam 3: https://www.youtube.com/watch?v=aphvln5Zwv0
- Cam 6: https://www.youtube.com/watch?v=6LtXdZJb-Kk
- Current publisher listings: https://www.youtube.com/channel/UCQ-V0JYSv1Ulme_daroQk7Q/streams

All three watch pages reported OK, playableInEmbed=true, and isLiveNow=true. All began September 20. Pins share the approximate Kensington/Allegheny elevated station viewed area (39.9965, -75.1135); these are not inferred camera mounts. The group chooser preserves each camera's direct link. A publisher link provides a route to current broadcasts if video IDs change again.

The older Spotlight Rescue Cam 3 (cWd_niy8Rz8), Cam 5 (7YnjXr9uWjg), and Cam 6 (wWOWXHj9lWc) ended September 17 and are unplayable. Directory pages still advertised these as live. Other Kensington listings linked removed videos, broadcasts ended in 2024, or unrelated Rittenhouse footage. Search the current owner listings and YouTube's live results, not just cached search snippets. Do not conclude that Kensington has no live cameras from the old channel's status.

EarthCam's owner broadcasts 9mMnqO1UuIU (Franklin Institute) and F1EQEDL4ddU (Liberty Bell) are live and embeddable. These upgrade the two existing pins with optional video playback; they are not counted as new locations. All five previously cataloged YouTube bird/rail/weather broadcasts were rechecked and remain live.

Additional search covered public YouTube live results for Philadelphia street, skyline, rail and wildlife views; FOX29; AtTheShore/iGotView; EarthCam; 6abc Sky6; NBC10 regional cameras; and multiple camera directories. Rittenhouse fountain/south panorama and Triangle Square west/south broadcasts duplicate existing AtTheShore views. Chester railcam listings refer to Massachusetts, outside this map. The current 6abc page offers a combined radar/Sky6 program, and NBC10 offers scheduled rotating regional views; neither verifies a direct selectable feed for each location. Old Dilworth and Italian Market directory embeds are recordings, not live cameras. These were not added as new live pins. This audit does not establish complete coverage of every public camera.

Run `python tools/audit-camera-streams.py --discover` from this demo to recheck all cataloged YouTube feeds and find current candidates. It runs only when invoked by a maintainer, downloads public metadata only, and adds no page-load requests, timers, paid APIs, or background video. Newly found candidates still need source and location checks before publication.
