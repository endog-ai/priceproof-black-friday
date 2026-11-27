// Filtering, searching and sorting for the deal list. Every function here
// is pure: it takes deals and a state object and returns a new array, so
// the grid, the counts and the shareable URL all read the same result.

export function discountOf(deal) {
  if (!deal.was || deal.was <= 0) return 0;
  return (deal.was - deal.sale) / deal.was;
}

export function savedOf(deal) {
  return Math.max(0, deal.was - deal.sale);
}

const VERDICT_RANK = { "new-low": 0, strong: 1, solid: 2, routine: 3 };

export function verdictRank(deal) {
  return VERDICT_RANK[deal.verdict] ?? 3;
}

export function applyFilters(deals, state) {
  const query = (state.q || "").trim().toLowerCase();
  return deals.filter((deal) => {
    if (state.category !== "All" && deal.category !== state.category) return false;
    if (state.store !== "All" && deal.store !== state.store) return false;
    if (state.verdict !== "All" && deal.verdict !== state.verdict) return false;
    if (discountOf(deal) * 100 < state.minDiscount) return false;
    if (query) {
      const haystack = `${deal.name} ${deal.store} ${deal.category}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function sortDeals(deals, sortKey) {
  const list = [...deals];
  switch (sortKey) {
    case "saved":
      return list.sort((a, b) => savedOf(b) - savedOf(a));
    case "price-asc":
      return list.sort((a, b) => a.sale - b.sale);
    case "price-desc":
      return list.sort((a, b) => b.sale - a.sale);
    case "verdict":
      return list.sort(
        (a, b) => verdictRank(a) - verdictRank(b) || discountOf(b) - discountOf(a),
      );
    case "discount":
    default:
      return list.sort((a, b) => discountOf(b) - discountOf(a));
  }
}

export function bestDeals(deals, count) {
  return sortDeals(deals, "verdict").slice(0, count);
}

export function totalSavings(deals) {
  return deals.reduce((sum, deal) => sum + savedOf(deal), 0);
}

export function stateFromUrl(search) {
  const params = new URLSearchParams(search);
  const min = Number(params.get("min") || 0);
  return {
    q: params.get("q") || "",
    category: params.get("cat") || "All",
    store: params.get("store") || "All",
    verdict: params.get("verdict") || "All",
    minDiscount: Number.isFinite(min) && min >= 0 && min <= 90 ? min : 0,
    sort: params.get("sort") || "discount",
  };
}

export function stateToQuery(state) {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.category !== "All") params.set("cat", state.category);
  if (state.store !== "All") params.set("store", state.store);
  if (state.verdict !== "All") params.set("verdict", state.verdict);
  if (state.minDiscount > 0) params.set("min", String(state.minDiscount));
  if (state.sort !== "discount") params.set("sort", state.sort);
  const text = params.toString();
  return text ? `?${text}` : "";
}
