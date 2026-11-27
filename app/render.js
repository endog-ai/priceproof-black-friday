// Rendering: turns deals into DOM. One card per deal, one strip for the
// best deals of the day, and one dialog for a deal's full detail. Prices
// are formatted once, here, so every place that shows a price agrees.

import { DEALS, VERDICTS, CHECKED_DAY } from "./deals.js";
import { discountOf, savedOf } from "./filters.js";

export function money(amount) {
  return `$${amount.toFixed(2).replace(/\.00$/, "")}`;
}

export function percentOff(deal) {
  return `${Math.round(discountOf(deal) * 100)}% off`;
}

function verdictChip(deal) {
  const info = VERDICTS[deal.verdict];
  return `<span class="verdict verdict-${deal.verdict}" title="${info.reason}">${info.label}</span>`;
}

function alsoAtLine(deal) {
  if (!deal.alsoAt || deal.alsoAt.length === 0) return "";
  const parts = deal.alsoAt
    .map((other) => `${other.store} ${money(other.price)}`)
    .join(" · ");
  return `<p class="also">Also at: ${parts}</p>`;
}

export function dealCard(deal) {
  return `
  <article class="card" data-deal="${deal.id}">
    <p class="eyebrow">${deal.category} · ${deal.store}</p>
    <h3>${deal.name}</h3>
    <p class="prices"><span class="sale">${money(deal.sale)}</span>
      <s class="was">${money(deal.was)}</s>
      <span class="pct">${percentOff(deal)}</span></p>
    <p class="saved">You save ${money(savedOf(deal))}</p>
    <p class="verdict-row">${verdictChip(deal)}</p>
    <p class="note">${deal.note}</p>
    ${alsoAtLine(deal)}
    <p class="source">Seen in ${deal.source} · checked ${CHECKED_DAY}</p>
    <p class="actions">
      <a class="deal-link" href="${deal.url}" target="_blank" rel="noopener">View deal at ${deal.store} ↗</a>
      <button class="details-btn" type="button" data-details="${deal.id}">Details</button>
    </p>
  </article>`;
}

export function renderGrid(list, grid) {
  if (list.length === 0) {
    grid.innerHTML = `<p class="empty">No deals match those filters. Loosen the discount or clear the search — every deal on this page is a real one, so there is nothing to pad the list with.</p>`;
    return;
  }
  grid.innerHTML = list.map(dealCard).join("");
}

export function renderBest(list, strip) {
  strip.innerHTML = list
    .map(
      (deal) => `
    <button class="best-card" type="button" data-details="${deal.id}">
      <span class="best-verdict">${VERDICTS[deal.verdict].label}</span>
      <span class="best-name">${deal.name}</span>
      <span class="best-price">${money(deal.sale)} <s>${money(deal.was)}</s> · ${percentOff(deal)}</span>
      <span class="best-store">${deal.store}</span>
    </button>`,
    )
    .join("");
}

export function dealById(id) {
  return DEALS.find((deal) => deal.id === id);
}

export function renderDialog(deal, dialog) {
  const info = VERDICTS[deal.verdict];
  const rows = (deal.alsoAt || [])
    .map(
      (other) =>
        `<tr><td>${other.store}</td><td>${money(other.price)}</td><td>${other.price <= deal.sale ? "Same or cheaper" : `${money(other.price - deal.sale)} more`}</td></tr>`,
    )
    .join("");
  dialog.innerHTML = `
    <div class="dialog-body">
      <p class="eyebrow">${deal.category} · ${deal.store}</p>
      <h2>${deal.name}</h2>
      <p class="prices big"><span class="sale">${money(deal.sale)}</span>
        <s class="was">${money(deal.was)}</s>
        <span class="pct">${percentOff(deal)}</span></p>
      <p class="saved">You save ${money(savedOf(deal))} off the usual price.</p>
      <p><span class="verdict verdict-${deal.verdict}">${info.label}</span></p>
      <p class="note">${deal.note}</p>
      <p class="verdict-why"><strong>Why this verdict?</strong> ${info.reason}</p>
      ${
        rows
          ? `<h3>Same product at other stores</h3>
      <table class="compare"><thead><tr><th>Store</th><th>Price</th><th>vs this deal</th></tr></thead><tbody>${rows}</tbody></table>`
          : ""
      }
      <p class="source">Price read at ${deal.store} in ${deal.source} (${deal.sourceDate}) and checked again on ${CHECKED_DAY}. Prices move on Black Friday — check the price at checkout before you buy.</p>
      <p class="actions">
        <a class="deal-link" href="${deal.url}" target="_blank" rel="noopener">View deal at ${deal.store} ↗</a>
        <button class="close-btn" type="button" data-close>Close</button>
      </p>
    </div>`;
}
