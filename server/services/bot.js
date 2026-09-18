import { addBotRun, updateBotRun, addMarketSnapshot, getAccount } from '../store.js';
import { getTop20, marketApi } from './marketApi.js';
import { calculateIndicators } from './indicators.js';
import { aiExplain, ruleSignal } from './aiEngine.js';
import { paperOrder } from './paperBroker.js';
import { config } from '../config.js';

let running = false;

async function oneCoin(coin) {
  const chart = await marketApi.marketChart(coin.id, 7);
  const prices = (chart?.prices || []).map((x) => Number(x[1]));
  const volumes = (chart?.total_volumes || []).map((x) => Number(x[1]));
  const indicators = calculateIndicators(prices, volumes);

  addMarketSnapshot({
    coinId: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    rank: coin.market_cap_rank,
    price: coin.current_price,
    marketCap: coin.market_cap,
    volume24h: coin.total_volume,
    change24h: coin.price_change_percentage_24h,
    change7d: coin.price_change_percentage_7d_in_currency,
    raw: coin
  });

  const base = ruleSignal({ coin, indicators });
  const signal = await aiExplain(base, { coin, indicators });

  const account = await getAccount();
  const currentPosition = account.positions.find((p) => p.coinId === coin.id);
  const maxNotional = Math.max(25, account.equityUsd * config.maxPositionPct);

  if (signal.action === 'BUY' && !currentPosition?.quantity) {
    await paperOrder({
      coin, side: 'BUY',
      usdNotional: Math.min(account.cashUsd * config.riskPerTrade, maxNotional),
      reason: signal.reason,
      confidence: signal.confidence
    });
  }

  if (signal.action === 'SELL' && currentPosition?.quantity > 0) {
    await paperOrder({
      coin, side: 'SELL',
      usdNotional: Math.min(currentPosition.quantity * coin.current_price, maxNotional),
      reason: signal.reason,
      confidence: signal.confidence
    });
  }

  return { coin, indicators, signal };
}

export async function runBot() {
  if (running) return { skipped: true };
  running = true;
  const startedAt = new Date();
  const run = addBotRun({ mode: config.dryRun ? 'PAPER' : 'BLOCKED', startedAt: startedAt.toISOString(), decisions: [] });

  try {
    const coins = await getTop20();
    const decisions = [];
    for (const coin of coins) {
      try {
        decisions.push(await oneCoin(coin));
      } catch (error) {
        decisions.push({ coin: { id: coin.id, symbol: coin.symbol }, error: error.message });
      }
    }
    const summary = decisions.map((d) => ({
      coin: d.coin?.symbol,
      action: d.signal?.action,
      confidence: d.signal?.confidence,
      reason: d.signal?.reason
    }));
    updateBotRun(run.id, { decisions: summary, finishedAt: new Date().toISOString() });
    return { runId: run.id, decisions: summary };
  } catch (error) {
    updateBotRun(run.id, { error: error.message, finishedAt: new Date().toISOString() });
    throw error;
  } finally {
    running = false;
  }
}
