import { config } from '../config.js';
import { addOrder, getAccount, saveAccount } from '../store.js';

function upsertPosition(account, coinId, symbol) {
  let p = account.positions.find((x) => x.coinId === coinId);
  if (!p) {
    p = { coinId, symbol, quantity: 0, avgPrice: 0, lastPrice: 0 };
    account.positions.push(p);
  }
  return p;
}

function markEquity(account) {
  account.equityUsd = account.cashUsd + account.positions.reduce(
    (sum, p) => sum + (p.quantity * (p.lastPrice || p.avgPrice)), 0
  );
}

export async function paperOrder({ coin, side, usdNotional, reason, confidence, strategy = 'AI-RULES' }) {
  const account = getAccount();
  const price = Number(coin.current_price);
  if (!price || usdNotional <= 0) throw new Error('Invalid paper order');

  const position = upsertPosition(account, coin.id, coin.symbol.toUpperCase());
  position.lastPrice = price;

  if (side === 'BUY') {
    const spend = Math.min(usdNotional, account.cashUsd);
    if (spend <= 0) return null;
    const qty = spend / price;
    const newQty = position.quantity + qty;
    position.avgPrice = ((position.quantity * position.avgPrice) + spend) / newQty;
    position.quantity = newQty;
    account.cashUsd -= spend;

    addOrder({ coinId: coin.id, symbol: coin.symbol.toUpperCase(), side, quantity: qty, price,
      notional: spend, reason, confidence, strategy, status: 'FILLED' });
  } else {
    const qty = Math.min(usdNotional / price, position.quantity);
    if (qty <= 0) return null;
    const proceeds = qty * price;
    account.cashUsd += proceeds;
    account.realizedPnlUsd += qty * (price - position.avgPrice);
    position.quantity -= qty;
    if (position.quantity === 0) position.avgPrice = 0;

    addOrder({ coinId: coin.id, symbol: coin.symbol.toUpperCase(), side, quantity: qty, price,
      notional: proceeds, reason, confidence, strategy, status: 'FILLED' });
  }

  markEquity(account);
  saveAccount(account);
  return getAccount();
}
