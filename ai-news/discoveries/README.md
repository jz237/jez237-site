# AI Discoveries, Explained

Source-linked everyday explanations of reports shared by AI Discovery Watch.
This is a static, progressively enhanced companion to AI News. It keeps the
existing space-console theme and does not change the news-feed ingestion.

- `stories.json`: reviewed prose, dates, evidence labels, source-reported model details and primary references.
- `build.py`: offline renderer; `python3 ai-news/discoveries/build.py` regenerates HTML.
- `discoveries.js`: search, topic/evidence filters, incremental display and deep links.
- `make_illustrations.py`: original code-authored SVG concept diagrams (not data).

Diagram names: research-loop, allergy-latch, molecular-grip, cell-switch, symmetry,
waves, branching. Only reuse a diagram when its concept fits the actual report.

Dates are channel coverage dates, not necessarily first-publication dates.
Follow-ups and corrections remain visible. Lab results are not treatments,
simulation demonstrations are not automatically discoveries, and proof claims
are not automatically independently checked. The source-channel account retains
who did what and the limits.

The owner-authorized publisher watches the private confirmed-delivery ledger.
No credentials or private receipts belong in this repository. A model writes only
when new confirmed news exists; the script handles dedupe, safe Git publication
and exact live-file verification. Quiet days do not create filler stories.
Git pushes use the existing Cloudflare build; never upload a sparse editor as
a full-site deployment. Failed publications stay pending until verified live.

Each story requires `modelNote`: name the models and versions only as identified
by the sources, with their specific roles where useful. Distinguish research
models from agent systems, coding tools, proof checkers, comparison baselines and
models used only for editing. An unnamed model/version stays explicitly unnamed;
never infer it from the provider, product name or date. This field is visible
beside the explanation and included in search.
