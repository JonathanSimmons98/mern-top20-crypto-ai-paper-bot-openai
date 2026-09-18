import React from 'react';
export default function AccountCard({ account }) {
  if (!account) return <div className="card">Loading account…</div>;
  return <div className="grid3">
    <div className="metric"><span>Cash</span><b>${account.cashUsd.toFixed(2)}</b></div>
    <div className="metric"><span>Equity</span><b>${account.equityUsd.toFixed(2)}</b></div>
    <div className="metric"><span>Realized P/L</span><b>${account.realizedPnlUsd.toFixed(2)}</b></div>
  </div>
}
