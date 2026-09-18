import { cgGet } from './http.js';

/*
 * Twenty deliberately separate API methods.
 * They are not all needed on every bot cycle; the router exposes them so the
 * project is useful for learning API boundaries and service composition.
 */
export const marketApi = {
  // 01
  markets: (params = {}) => cgGet('/coins/markets', {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 20,
    page: 1,
    sparkline: true,
    price_change_percentage: '1h,24h,7d',
    ...params
  }),

  // 02
  global: () => cgGet('/global'),

  // 03
  search: (query) => cgGet('/search', { query }),

  // 04
  coin: (id) => cgGet(`/coins/${encodeURIComponent(id)}`, {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: true,
    developer_data: true
  }),

  // 05
  marketChart: (id, days = 7) => cgGet(`/coins/${encodeURIComponent(id)}/market_chart`, {
    vs_currency: 'usd',
    days
  }),

  // 06
  ohlc: (id, days = 7) => cgGet(`/coins/${encodeURIComponent(id)}/ohlc`, {
    vs_currency: 'usd',
    days
  }),

  // 07
  tickers: (id) => cgGet(`/coins/${encodeURIComponent(id)}/tickers`, {
    include_exchange_logo: false,
    depth: true,
    order: 'volume_desc'
  }),

  // 08
  history: (id, date) => cgGet(`/coins/${encodeURIComponent(id)}/history`, {
    date,
    localization: false
  }),

  // 09
  rangeChart: (id, from, to) => cgGet(`/coins/${encodeURIComponent(id)}/market_chart/range`, {
    vs_currency: 'usd',
    from,
    to
  }),

  // 10
  contract: (platform, address) => cgGet(`/coins/${encodeURIComponent(platform)}/contract/${encodeURIComponent(address)}`),

  // 11
  communityData: (id) => cgGet(`/coins/${encodeURIComponent(id)}/community_data`),

  // 12
  developerData: (id) => cgGet(`/coins/${encodeURIComponent(id)}/developer_data`),

  // 13
  statusUpdates: (id) => cgGet(`/coins/${encodeURIComponent(id)}/status_updates`, { per_page: 10 }),

  // 14
  localization: (id) => cgGet(`/coins/${encodeURIComponent(id)}/localization`),

  // 15
  coinList: () => cgGet('/coins/list', { include_platform: false }),

  // 16
  exchanges: () => cgGet('/exchanges', { per_page: 100, page: 1 }),

  // 17
  exchange: (id) => cgGet(`/exchanges/${encodeURIComponent(id)}`),

  // 18
  exchangeTickers: (id) => cgGet(`/exchanges/${encodeURIComponent(id)}/tickers`, {
    coin_ids: 'bitcoin,ethereum',
    depth: true,
    page: 1
  }),

  // 19
  categories: () => cgGet('/coins/categories', { order: 'market_cap_desc' }),

  // 20
  derivatives: () => cgGet('/derivatives')
};

export async function getTop20() {
  const data = await marketApi.markets({ per_page: 20, page: 1 });
  return data.sort((a, b) => (a.market_cap_rank ?? 99999) - (b.market_cap_rank ?? 99999)).slice(0, 20);
}
