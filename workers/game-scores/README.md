# game-scores

Shared leaderboard API for the games on jez237.com, served at
`https://game-scores.jez237.workers.dev`. Boards live in the `SCORES` KV
namespace under `lb:<gameId>`; each keeps the best 50 entries.

- `GET /scores/:gameId` returns the board as a JSON array, best first.
- `POST /scores/:gameId` takes `{ initials, score }` plus optional `wave`,
  `level`, `wallsCleared`, `phase`. Initials are stored as 1–4 letters or
  digits and every other field as a whole number, so a board never holds
  markup.
- `GET /games` lists the ids of boards that have a score.

Any game may use any id (letters, digits, `-`, `_`, up to 64 characters);
there is no list to register a new game in. Daily and per-table boards rely
on that.

## Limits

The API is public, so abuse is bounded per visitor address:

| Limit | Value | Why |
| --- | --- | --- |
| Posts, all boards | 8 per minute | Changing the board id used to dodge the cooldown. |
| New boards | 3 per minute | Stops one address filling storage with junk ids. |
| Reads | 240 per minute | A hub page loads many boards at once; a scraper does not need more. |
| Posts to one board | 1 per minute | Original cooldown, unchanged. |

A request over a limit gets `429` with `{"error":"too fast, wait a moment"}`,
the same answer the games already handle. The first three use Workers Rate
Limiting bindings, which count per Cloudflare location and cost no storage
writes. A score that cannot enter a full board is acknowledged without a write.

## Deploy

    node --test workers/game-scores/
    cd workers/game-scores && npx wrangler deploy

Roll back with `npx wrangler rollback` from the same directory.
