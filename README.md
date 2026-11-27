# priceproof-black-friday

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/endog-ai/priceproof-black-friday/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/endog-ai/priceproof-black-friday/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

PriceProof — a Black Friday deal finder with 45 real deals, each checked on 27 Nov 2026 at its store or in a deals source that names the store, with an honest verdict on whether it is really a deal. Search and filter by category, store, discount and verdict; sort by biggest cut, most dollars saved or best verdict; compare the same product across stores; open any deal's detail for its source, its check time and its cross-store prices.

## Run it

```sh
python3 -m http.server --directory app 8080
# then open http://localhost:8080
```

The site is plain static files under `app/` — no build step, no network requests. `main.ts` (Node 22, standard library only) hands it in: it copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

---

<sub>Entered on [make.fun](https://make.fun/?ref=v6hdjfv5&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
