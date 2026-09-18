import { EMA, RSI, SMA, MACD, ATR } from 'technicalindicators';

export function calculateIndicators(prices, volumes = []) {
  const clean = prices.filter(Number.isFinite);
  if (clean.length < 30) {
    return { rsi: null, emaFast: null, emaSlow: null, sma: null, macd: null, atr: null };
  }

  const highs = clean.map((p) => p * 1.002);
  const lows = clean.map((p) => p * 0.998);
  const closes = clean;

  const rsi = RSI.calculate({ values: closes, period: 14 }).at(-1);
  const emaFast = EMA.calculate({ values: closes, period: 12 }).at(-1);
  const emaSlow = EMA.calculate({ values: closes, period: 26 }).at(-1);
  const sma = SMA.calculate({ values: closes, period: 20 }).at(-1);
  const macd = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  }).at(-1);
  const atr = ATR.calculate({ high: highs, low: lows, close: closes, period: 14 }).at(-1);

  const recent = clean.slice(-20);
  const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
  const variance = recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length;
  const volatility = Math.sqrt(variance) / mean;

  return { rsi, emaFast, emaSlow, sma, macd, atr, volatility, volume: volumes.at(-1) ?? null };
}
