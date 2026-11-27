// PriceProof wiring: reads the shareable state from the URL, renders the
// best-deals strip and the grid, and keeps the controls, the count line
// and the URL in sync. A deal's detail opens in a dialog; #deal-<id>
// deep-links straight to it, so any deal can be shared.

import { DEALS, CATEGORIES, STORES, CHECKED_DAY, VERDICTS } from "./deals.js";
import {
  applyFilters,
  sortDeals,
  bestDeals,
  totalSavings,
  stateFromUrl,
  stateToQuery,
} from "./filters.js";
import { renderGrid, renderBest, renderDialog, dealById, money } from "./render.js";

const grid = document.querySelector("#deals");
const strip = document.querySelector("#best-strip");
const countLine = document.querySelector("#count-line");
const searchInput = document.querySelector("#search");
const categoryChips = document.querySelector("#category-chips");
const storeChips = document.querySelector("#store-chips");
const discountChips = document.querySelector("#discount-chips");
const verdictSelect = document.querySelector("#verdict");
const sortSelect = document.querySelector("#sort");
const dialog = document.querySelector("#deal-dialog");
const clearButton = document.querySelector("#clear-filters");

const state = stateFromUrl(window.location.search);

function chipGroup(container, options, current, onPick) {
  container.innerHTML = options
    .map(
      (option) =>
        `<button type="button" class="chip${option === current ? " active" : ""}" data-value="${option}">${option}</button>`,
    )
    .join("");
  container.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => onPick(button.dataset.value));
  });
}

function render() {
  const filtered = applyFilters(DEALS, state);
  const sorted = sortDeals(filtered, state.sort);
  renderGrid(sorted, grid);
  countLine.textContent =
    `${sorted.length} of ${DEALS.length} deals · ${money(totalSavings(sorted))} total savings in view · prices checked ${CHECKED_DAY}`;
  const next = stateToQuery(state);
  const hash = window.location.hash;
  window.history.replaceState(null, "", next + hash);
}

function openDeal(id) {
  const deal = dealById(id);
  if (!deal) return;
  renderDialog(deal, dialog);
  dialog.showModal();
  window.history.replaceState(null, "", `${stateToQuery(state)}#deal-${id}`);
}

function closeDeal() {
  if (dialog.open) dialog.close();
  const query = stateToQuery(state);
  window.history.replaceState(null, "", query);
}

searchInput.value = state.q;
verdictSelect.value = state.verdict;
sortSelect.value = state.sort;

chipGroup(categoryChips, ["All", ...CATEGORIES], state.category, (value) => {
  state.category = value;
  syncChips();
  render();
});
chipGroup(storeChips, ["All", ...STORES], state.store, (value) => {
  state.store = value;
  syncChips();
  render();
});
chipGroup(
  discountChips,
  ["0", "20", "30", "40", "50"],
  String(state.minDiscount),
  (value) => {
    state.minDiscount = Number(value);
    syncChips();
    render();
  },
);

function syncChips() {
  const mark = (container, current) => {
    container.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("active", button.dataset.value === current);
    });
  };
  mark(categoryChips, state.category);
  mark(storeChips, state.store);
  mark(discountChips, String(state.minDiscount));
}

searchInput.addEventListener("input", () => {
  state.q = searchInput.value;
  render();
});
verdictSelect.addEventListener("change", () => {
  state.verdict = verdictSelect.value;
  render();
});
sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  render();
});
clearButton.addEventListener("click", () => {
  state.q = "";
  state.category = "All";
  state.store = "All";
  state.verdict = "All";
  state.minDiscount = 0;
  state.sort = "discount";
  searchInput.value = "";
  verdictSelect.value = "All";
  sortSelect.value = "discount";
  syncChips();
  render();
});

document.addEventListener("click", (event) => {
  const details = event.target.closest("[data-details]");
  if (details) {
    openDeal(details.dataset.details);
    return;
  }
  if (event.target.closest("[data-close]")) closeDeal();
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDeal();
});
dialog.addEventListener("close", () => {
  const query = stateToQuery(state);
  if (window.location.hash.startsWith("#deal-")) {
    window.history.replaceState(null, "", query);
  }
});

renderBest(bestDeals(DEALS, 6), strip);
render();

// The grid is rendered by script, so the browser's own jump to a #anchor
// can land before the content exists and end up in the wrong place. After
// the first render, jump again to the anchor if one names an element.
const anchor = window.location.hash.slice(1);
if (anchor && !anchor.startsWith("deal-")) {
  const target = document.getElementById(anchor);
  if (target) target.scrollIntoView();
}

const hashMatch = window.location.hash.match(/^#deal-([a-z0-9-]+)$/);
if (hashMatch) openDeal(hashMatch[1]);
