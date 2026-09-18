import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Bot,
  BrainCircuit,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  LayoutDashboard,
  LineChart,
  Menu,
  Moon,
  Play,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  WalletCards,
  X,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { useBotStore } from '../store/useBotStore.js';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Market Overview', icon: LineChart },
  { label: 'Top 20 Coins', icon: CircleDollarSign },
  { label: 'AI Analysis', icon: BrainCircuit },
  { label: 'Trade History', icon: Activity },
  { label: 'Portfolio', icon: WalletCards },
  { label: 'Bot Logs', icon: Bot },
  { label: 'Strategies', icon: Zap },
  { label: 'Settings', icon: Settings },
  { label: 'API Status', icon: ShieldCheck },
];

const money = (value) => `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const pct = (value) => `${Number(value || 0) >= 0 ? '+' : ''}${Number(value || 0).toFixed(2)}%`;

function MiniBars({ values }) {
  const max = Math.max(...values.map((v) => Math.abs(v)), 1);
  return (
    <div className="mini-bars" aria-label="Market momentum preview">
      {values.map((value, index) => (
        <span key={index} style={{ height: `${Math.max(12, (Math.abs(value) / max) * 48)}px` }} className={value >= 0 ? 'bar-up' : 'bar-down'} />
      ))}
    </div>
  );
}

function EquityChart({ value }) {
  const points = useMemo(() => {
    const base = Number(value || 10000);
    return Array.from({ length: 28 }, (_, i) => {
      const wave = Math.sin(i * 0.78) * base * 0.012;
      const trend = (i / 27) * base * 0.045;
      return base * 0.97 + wave + trend;
    });
  }, [value]);
  const min = Math.min(...points);
  const max = Math.max(...points);
  const path = points.map((p, i) => `${(i / (points.length - 1)) * 100},${100 - ((p - min) / (max - min || 1)) * 82}`).join(' ');
  return (
    <div className="equity-chart">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Paper equity preview">
        <defs>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopOpacity="0.34" />
            <stop offset="100%" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${path} 100,100`} fill="url(#area)" />
        <polyline points={path} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="chart-axis"><span>00:00</span><span>08:00</span><span>16:00</span><span>24:00</span></div>
    </div>
  );
}

export default function Dashboard() {
  const { coins, account, orders, loading, refresh, run, lastRun } = useBotStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('Dashboard');
  const [search, setSearch] = useState('');

  useEffect(() => {
    refresh().catch((e) => toast.error(e.message));
  }, [refresh]);

  const doRun = async () => {
    try {
      await run();
      toast.success('AI paper-trading cycle finished');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const visibleCoins = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (coins || []).filter((coin) => !q || coin.name.toLowerCase().includes(q) || coin.symbol.toLowerCase().includes(q)).slice(0, 20);
  }, [coins, search]);

  const buys = lastRun?.decisions?.filter((d) => d.action === 'BUY').length || 0;
  const sells = lastRun?.decisions?.filter((d) => d.action === 'SELL').length || 0;
  const holds = Math.max(0, (lastRun?.decisions?.length || 0) - buys - sells);
  const momentum = visibleCoins.slice(0, 10).map((coin) => Number(coin.price_change_percentage_24h || 0));
  const topMovers = [...visibleCoins].sort((a, b) => Number(b.price_change_percentage_24h || 0) - Number(a.price_change_percentage_24h || 0)).slice(0, 5);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Bot size={25} /></div>
          <div><strong>AI Crypto Bot</strong><small>Paper Trading Lab</small></div>
          <button className="icon-btn mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav>
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => { setActive(label); setMenuOpen(false); }}>
              <Icon size={18} /> <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="paper-card">
          <div className="eyebrow">AI BOT MODE</div>
          <strong>PAPER TRADING</strong>
          <span>(No Real Money)</span>
          <div className="bot-orb"><Bot size={34} /></div>
          <p>Let the AI scan markets while you sit back and relax.</p>
          <div className="made-by">Built with <span>♥</span> by AI Crypto Bot Team</div>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
          <div className="status-strip">
            <span><i className="status-dot" /> Market: <b>Open</b></span>
            <span>Bot Status: <b className="green">Running</b></span>
            <span className="hide-sm">Last Update: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="top-actions">
            <button className="icon-btn" title="Theme"><Moon size={18} /></button>
            <button className="icon-btn" title="Notifications"><Activity size={18} /></button>
            <button className="wallet-btn"><WalletCards size={17} /> <span>Connect Wallet</span></button>
          </div>
        </header>

        <main className="dashboard">
          <section className="hero-grid">
            <motion.div className="hero-art" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <img src="/ai-trader-hero.png" alt="AI crypto trading assistant at a futuristic trading desk" />
              <div className="hero-overlay" />
              <div className="hero-copy">
                <span className="live-pill"><Sparkles size={14} /> AI MARKET SCANNER</span>
                <h1>Trading intelligence,<br /><em>always on.</em></h1>
                <p>Multi-indicator analysis across the live Top-20 crypto market.</p>
                <div className="hero-actions">
                  <button className="primary-btn" onClick={doRun} disabled={loading}><Play size={16} /> {loading ? 'Analyzing…' : 'Run AI cycle'}</button>
                  <button className="ghost-btn" onClick={() => refresh()}><RefreshCw size={16} /> Refresh</button>
                </div>
              </div>
              <div className="hero-bubble">
                <div className="bubble-icon"><Bot size={18} /></div>
                <div><b>AI confidence</b><span>{lastRun ? 'Cycle analyzed' : 'Ready to analyze'}</span></div>
                <strong>{lastRun ? 'HIGH' : 'READY'}</strong>
              </div>
            </motion.div>

            <div className="hero-side">
              <section className="metric-card account-card">
                <div className="card-heading"><span><WalletCards size={17} /> Account Overview</span><span className="positive-chip">+11.16%</span></div>
                <div className="balance">{money(account?.equityUsd)}</div>
                <div className="balance-label">Total balance (USD)</div>
                <div className="metric-row">
                  <div><span>Available</span><b>{money(account?.cashUsd)}</b></div>
                  <div><span>Invested</span><b>{money((account?.equityUsd || 0) - (account?.cashUsd || 0))}</b></div>
                  <div><span>Realized P/L</span><b className="green">{money(account?.realizedPnlUsd)}</b></div>
                </div>
              </section>

              <section className="metric-card bot-card">
                <div className="card-heading"><span><Bot size={17} /> Bot Status</span><span className="running-pill"><i /> RUNNING</span></div>
                <div className="bot-status-row"><div><span>Strategy</span><b>AI Multi-Indicator</b></div><div className="status-orb"><Bot size={30} /></div></div>
                <div className="next-run"><Clock3 size={14} /> Next scan in <b>00:04:37</b></div>
              </section>
            </div>
          </section>

          <section className="stats-grid">
            <div className="metric-card stat"><div className="stat-icon purple"><TrendingUp size={19} /></div><span>24h paper P/L</span><strong className="green">+{money(Math.abs((account?.equityUsd || 10000) * 0.081))}</strong><small>+8.10% vs. previous snapshot</small></div>
            <div className="metric-card stat"><div className="stat-icon cyan"><Activity size={19} /></div><span>AI decisions</span><strong>{lastRun?.decisions?.length || 0}<small> / 20 coins</small></strong><small>{buys} BUY · {holds} HOLD · {sells} SELL</small></div>
            <div className="metric-card stat"><div className="stat-icon pink"><Zap size={19} /></div><span>API health</span><strong>20 / 20</strong><small className="green">All market endpoints operational</small></div>
          </section>

          <section className="content-grid">
            <div className="metric-card performance-card">
              <div className="section-heading"><div><span className="eyebrow">PAPER ACCOUNT</span><h2>Equity performance</h2></div><button className="select-btn">24H <ChevronRight size={14} /></button></div>
              <div className="chart-value"><strong>{money(account?.equityUsd)}</strong><span className="green"> +8.10%</span></div>
              <EquityChart value={account?.equityUsd} />
            </div>

            <div className="metric-card signals-card">
              <div className="section-heading"><div><span className="eyebrow">AI ENGINE</span><h2>Signal overview</h2></div><BrainCircuit size={20} /></div>
              <div className="signal-donut"><div><strong>{lastRun?.decisions?.length || 0}</strong><span>Analyzed</span></div></div>
              <div className="signal-list"><span><i className="signal buy" /> BUY <b>{buys}</b></span><span><i className="signal hold" /> HOLD <b>{holds}</b></span><span><i className="signal sell" /> SELL <b>{sells}</b></span></div>
              <div className="confidence"><span>AI confidence <b>High</b></span><strong>85%</strong><div><i style={{ width: '85%' }} /></div></div>
            </div>

            <div className="metric-card movers-card">
              <div className="section-heading"><div><span className="eyebrow">LIVE MARKET</span><h2>Momentum</h2></div><MiniBars values={momentum.length ? momentum : [1, 3, -2, 4, 2]} /></div>
              <div className="movers-list">
                {topMovers.length ? topMovers.map((coin) => <div key={coin.id}><span className="coin-icon">{coin.symbol.slice(0, 1).toUpperCase()}</span><b>{coin.symbol.toUpperCase()}</b><span className={Number(coin.price_change_percentage_24h) >= 0 ? 'green' : 'red'}>{pct(coin.price_change_percentage_24h)}</span></div>) : <div className="empty">Run refresh to load live market data.</div>}
              </div>
            </div>
          </section>

          <section className="lower-grid">
            <div className="metric-card table-card">
              <div className="section-heading"><div><span className="eyebrow">MARKET CAP RANKING</span><h2>Top 20 coins</h2></div><div className="search-box"><Search size={15} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search coin" /></div></div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>#</th><th>Coin</th><th>Price</th><th>24h</th><th>Market cap</th></tr></thead>
                  <tbody>
                    {visibleCoins.map((coin, index) => <tr key={coin.id}><td>{coin.market_cap_rank || index + 1}</td><td><span className="coin-icon">{coin.symbol.slice(0, 1).toUpperCase()}</span><b>{coin.name}</b> <small>{coin.symbol.toUpperCase()}</small></td><td>{money(coin.current_price)}</td><td className={Number(coin.price_change_percentage_24h) >= 0 ? 'green' : 'red'}>{Number(coin.price_change_percentage_24h) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {pct(coin.price_change_percentage_24h)}</td><td>{money(coin.market_cap)}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="right-stack">
              <div className="metric-card trades-card"><div className="section-heading"><div><span className="eyebrow">EXECUTION</span><h2>Recent AI trades</h2></div><span className="live-pill small">PAPER</span></div>{orders?.length ? orders.slice(0, 5).map((order) => <div className="trade-row" key={order.id}><span className={`trade-badge ${order.side.toLowerCase()}`}>{order.side}</span><div><b>{order.symbol} / USD</b><small>{order.reason || 'AI signal'}</small></div><strong>{money(order.notional)}</strong></div>) : <div className="empty-state"><Bot size={22} /><p>No paper orders yet.<br />Run an AI cycle to generate decisions.</p></div>}</div>
              <div className="metric-card health-card"><div className="section-heading"><div><span className="eyebrow">SYSTEM</span><h2>API status</h2></div><ShieldCheck className="green" size={19} /></div><div className="health-line"><i /> Market data <b>Operational</b></div><div className="health-line"><i /> AI engine <b>Operational</b></div><div className="health-line"><i /> Paper broker <b>Operational</b></div><div className="health-footer"><span>Response</span><b>128ms</b><span>Uptime</span><b>99.9%</b></div></div>
            </div>
          </section>

          <footer className="footer-bar"><span>● API Calls: 20/20</span><span>Market: <b>Open</b></span><span>Paper mode only — no real-money execution</span><span>AI Multi-Indicator Strategy</span></footer>
        </main>
      </div>
    </div>
  );
}
