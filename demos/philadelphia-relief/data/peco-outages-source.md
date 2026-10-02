# PECO outage layer — October 1, 2026

Source: [PECO's official outage map](https://www.peco.com/outages/experiencing-an-outage/outage-map),
which embeds the anonymous public KUBRA Storm Center view
`789577bd-d2c6-42b8-af4b-b51ae6f52b6c`.

The `peco-outages` Pages Function resolves the current public publication from
Storm Center `39e6d9f3-fdea-4539-848f-b8631945da6f`, reads its summary and the
16 zoom-10 Locations tiles covering the diorama bounds, and returns a compact
regional snapshot. No account, key, paid plan, home relay, or customer records
are used. The public Locations configuration advertises anonymous access.

The layer is off by default. One same-origin request runs when enabled;
five-minute polling pauses in hidden tabs and is canceled when disabled.
The server caches successful snapshots for two minutes. PECO advertises
approximately ten-minute source updates; the display shows the publication
time, not the request time. Reports older than 30 minutes are labeled delayed;
expired (24 hours), paused, malformed, or partially failed publications fail
closed. A failed refresh clears markers and explains that this is not an
indication power was restored. A tile 404 means an empty tile in this public
format; other HTTP errors fail the snapshot.

Points are approximate, sometimes grouped; they are not affected-property
boundaries. PECO's masked customer counts remain masked (e.g. fewer than 5).
Unknown restoration times stay unknown. Regional marker counts are separate
from PECO-wide summary totals. Public geometry is encoded polyline lat/lon.
The provider's row IDs change between publications, so selected markers use
tile and coordinates as identity. DOM markers reuse existing screen-space
clustering and work in both relief and Cesium views; no additional render loop
or map library is introduced.

This public web feed has no guaranteed API stability. The official PECO link
remains available when it changes or becomes unavailable. `check_philly_live`
checks the new Function route on every guarded release.
