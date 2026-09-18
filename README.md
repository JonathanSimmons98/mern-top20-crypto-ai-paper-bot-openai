# MERN Top-20 Crypto AI Paper Trading Bot (No Database)

Educational MERN full-stack project for **paper trading only**. This version has **no MongoDB, no Mongoose, and no database connection at all**. Runtime state is kept in process memory. Restarting Node.js resets paper account, orders, snapshots, and bot-run history.

## What it does

- Dynamically loads the current top-20 cryptocurrencies by market capitalization from CoinGecko.
- Keeps paper account, positions, orders, market snapshots, and bot runs in an in-memory store.
- Provides a React/Vite dashboard.
- Runs a rule-based AI-style signal engine using RSI, EMA, momentum, volatility and volume.
- Optional OpenAI-compatible analysis hook is included, but disabled by default.
- Contains 20 separate market-data API methods so you can study API/module boundaries.
- **No real-money order execution is implemented.** The order service only simulates fills.

## Install

1. Install Node.js 20+. **MongoDB is not required.**
2. Copy `.env.example` to `.env` (optional; defaults are included).
3. Run:

```bash
npm install
npm run dev
```

Open http://localhost:5173.

For a production-style local run:

```bash
npm run build
npm start
```

## Persistence

There is deliberately **zero database persistence**. `server/store.js` is the single in-memory state layer. This keeps the MERN-style Express/React/Node architecture while removing MongoDB completely.

## Important

This is a learning/paper-trading project, not financial advice. Keep `DRY_RUN=true`. Do not add exchange private keys until authentication, signing, replay protection, rate limits, withdrawal controls, audit logging, and risk management have been independently reviewed.


## Fix
The API route reads the in-memory account from `server/store.js`; `paperBroker.js` is reserved for order execution.

### OpenAI API key pool

The AI layer supports up to 10 server-side OpenAI API keys using `OPENAI_API_KEY_1` through `OPENAI_API_KEY_10`. When `AI_MODE=openai`, the bot selects configured keys in round-robin order; if none of the numbered keys are configured, it falls back to `OPENAI_API_KEY`. This is intended for keys you are authorized to use and should not be used to evade provider rate limits or account restrictions.

Keep all OpenAI keys in the server `.env` only; never expose them in React/client code or commit them to Git.


### 10 separate OpenAI caller files

`server/openai/openai1.js` through `server/openai/openai10.js` each use a different environment variable (`OPENAI_API_KEY_1` through `OPENAI_API_KEY_10`). The AI engine rotates across the configured caller files. Never commit real API keys.
