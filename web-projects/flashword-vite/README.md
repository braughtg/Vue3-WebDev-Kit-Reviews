# FlashWord

## From Susan Buck's Vue3.js Course

## Leaderboard API

When a player completes the game, FlashWord requests `GET /api/times` and
displays up to five fastest completion times. The endpoint should return an
array of entries with a non-empty `name` and a non-negative `time` in seconds;
an optional `id` is used to identify entries.

To submit a result, FlashWord sends `POST /api/times` with a JSON body containing
`name` and `time` (in seconds). After a successful submission, it fetches the
leaderboard again to show the updated results.
