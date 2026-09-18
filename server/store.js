import { config } from './config.js';

const state = {
  account: {
    cashUsd: config.paperStartUsd,
    equityUsd: config.paperStartUsd,
    positions: [],
    realizedPnlUsd: 0,
    totalFeesUsd: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  orders: [],
  botRuns: [],
  marketSnapshots: []
};

const clone = (value) => JSON.parse(JSON.stringify(value));

export function getAccount() {
  return clone(state.account);
}

export function saveAccount(account) {
  state.account = { ...account, updatedAt: new Date().toISOString() };
  return getAccount();
}

export function addOrder(order) {
  const saved = { ...order, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  state.orders.unshift(saved);
  return clone(saved);
}

export function getOrders(limit = 100) {
  return clone(state.orders.slice(0, limit));
}

export function addBotRun(run) {
  const saved = { ...run, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  state.botRuns.unshift(saved);
  return saved;
}

export function updateBotRun(id, patch) {
  const index = state.botRuns.findIndex((x) => x.id === id);
  if (index >= 0) state.botRuns[index] = { ...state.botRuns[index], ...patch };
  return clone(state.botRuns[index]);
}

export function getBotRuns(limit = 50) {
  return clone(state.botRuns.slice(0, limit));
}

export function addMarketSnapshot(snapshot) {
  state.marketSnapshots.unshift({ ...snapshot, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  if (state.marketSnapshots.length > 500) state.marketSnapshots.length = 500;
}
