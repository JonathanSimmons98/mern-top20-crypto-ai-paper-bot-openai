import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  coinGeckoBase: process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3',
  coinGeckoKey: process.env.COINGECKO_API_KEY || '',
  paperStartUsd: Number(process.env.PAPER_START_USD || 10000),
  botIntervalMs: Number(process.env.BOT_INTERVAL_MS || 60000),
  aiMode: process.env.AI_MODE || 'rules',
  openAiKeys: Array.from({ length: 10 }, (_, i) => process.env[`OPENAI_API_KEY_${i + 1}`] || '').filter(Boolean),
  openAiKey: process.env.OPENAI_API_KEY || '',
  openAiBase: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  openAiModel: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
  riskPerTrade: Number(process.env.TRADE_RISK_PER_TRADE || 0.01),
  maxPositionPct: Number(process.env.MAX_POSITION_PCT || 0.20),
  dryRun: String(process.env.DRY_RUN ?? 'true').toLowerCase() !== 'false'
};
