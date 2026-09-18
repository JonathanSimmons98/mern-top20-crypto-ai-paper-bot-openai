import { config } from '../config.js';
import { callOpenAI1 } from '../openai/openai1.js';
import { callOpenAI2 } from '../openai/openai2.js';
import { callOpenAI3 } from '../openai/openai3.js';
import { callOpenAI4 } from '../openai/openai4.js';
import { callOpenAI5 } from '../openai/openai5.js';
import { callOpenAI6 } from '../openai/openai6.js';
import { callOpenAI7 } from '../openai/openai7.js';
import { callOpenAI8 } from '../openai/openai8.js';
import { callOpenAI9 } from '../openai/openai9.js';
import { callOpenAI10 } from '../openai/openai10.js';

const stableLike = new Set(['usdt', 'usdc', 'usds', 'dai', 'usd1', 'usde', 'usd0']);

export function ruleSignal({ coin, indicators }) {
  const symbol = String(coin.symbol || '').toLowerCase();
  if (stableLike.has(symbol)) {
    return { action: 'HOLD', confidence: 0.99, reason: 'Stablecoin excluded from directional paper strategy.' };
  }

  const rsi = indicators.rsi ?? 50;
  const fast = indicators.emaFast ?? coin.current_price;
  const slow = indicators.emaSlow ?? coin.current_price;
  const momentum = Number(coin.price_change_percentage_24h ?? 0);
  const volatility = indicators.volatility ?? 0;

  let score = 0;
  const reasons = [];

  if (fast > slow) { score += 1; reasons.push('EMA12 > EMA26'); }
  else { score -= 1; reasons.push('EMA12 < EMA26'); }

  if (rsi < 35) { score += 1; reasons.push('RSI oversold'); }
  if (rsi > 70) { score -= 1; reasons.push('RSI overbought'); }

  if (momentum > 2) { score += 1; reasons.push('positive 24h momentum'); }
  if (momentum < -2) { score -= 1; reasons.push('negative 24h momentum'); }

  if (volatility > 0.08) { score -= 1; reasons.push('high volatility penalty'); }

  const action = score >= 2 ? 'BUY' : score <= -2 ? 'SELL' : 'HOLD';
  const confidence = Math.min(0.95, 0.50 + Math.abs(score) * 0.12);

  return { action, confidence, reason: reasons.join(', '), score };
}

const openAiClients = [
  callOpenAI1,
  callOpenAI2,
  callOpenAI3,
  callOpenAI4,
  callOpenAI5,
  callOpenAI6,
  callOpenAI7,
  callOpenAI8,
  callOpenAI9,
  callOpenAI10
];

let openAiFileIndex = 0;

function nextConfiguredClient() {
  for (let attempt = 0; attempt < openAiClients.length; attempt += 1) {
    const index = (openAiFileIndex + attempt) % openAiClients.length;
    if (process.env[`OPENAI_API_KEY_${index + 1}`]) {
      openAiFileIndex = (index + 1) % openAiClients.length;
      return openAiClients[index];
    }
  }
  return null;
}

export async function aiExplain(signal, context) {
  if (config.aiMode !== 'openai') return signal;

  const prompt = [
    'You are a crypto paper-trading research assistant.',
    'Return only JSON with action (BUY/SELL/HOLD), confidence (0..1), reason.',
    'Do not promise profit. Do not recommend leverage.',
    JSON.stringify({ signal, context })
  ].join('\n');

  const client = nextConfiguredClient();
  if (!client) return signal;

  try {
    const data = await client(prompt);
    const text = data?.choices?.[0]?.message?.content || '';
    const parsed = JSON.parse(text.replace(/^```json\s*|\s*```$/g, ''));
    return { ...signal, ...parsed, aiEnhanced: true };
  } catch {
    return { ...signal, aiEnhanced: false };
  }
}
