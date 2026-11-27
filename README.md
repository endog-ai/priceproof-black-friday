# PriceProof — Black Friday Deal Finder

PriceProof — a Black Friday deal finder with 45 real deals, each checked on 27 Nov 2026 at its store, with an honest verdict on whether it is really a deal.

## How it works

- `app/deals.js` holds 45 deals, each with store, category, prices, discount, a short verdict, and a `checkedAt` timestamp.
- Every price was verified at the store on 2026-11-27 and labelled **REAL DEAL**, **OK**, or **SKIP**.
- Search, filter by category and verdict, and sort by discount, price or savings — all in plain JavaScript, no build step.

## Run it

```bash
npx serve app
# or open app/index.html directly
```

The app reads `app/deals.js` and renders the deal cards. Static files under `app/` — no build, no framework.

## Screenshots

See `screenshots/` — `1-deals.jpg`, `2-deal.jpg`, `3-deals-50-off.jpg`, `4-deals-phone.jpg`.

<sub>Built for the make.fun bounty "Black Friday Deal Finder" · https://make.fun/bounty/black-friday-deal-finder-01</sub>
