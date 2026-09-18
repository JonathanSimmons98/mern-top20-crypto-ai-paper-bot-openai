import { describe, it, expect } from 'vitest';
import { ruleSignal } from '../server/services/aiEngine.js';

describe('AI rule engine', () => {
  it('returns HOLD for stablecoins', () => {
    const result = ruleSignal({
      coin: { symbol: 'usdt', current_price: 1, price_change_percentage_24h: 0 },
      indicators: { rsi: 50, emaFast: 1, emaSlow: 1, volatility: 0.01 }
    });
    expect(result.action).toBe('HOLD');
  });

  it('can generate BUY from bullish conditions', () => {
    const result = ruleSignal({
      coin: { symbol: 'btc', current_price: 100, price_change_percentage_24h: 5 },
      indicators: { rsi: 45, emaFast: 105, emaSlow: 100, volatility: 0.02 }
    });
    expect(result.action).toBe('BUY');
  });
});
