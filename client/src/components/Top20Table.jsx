import React from 'react';

export default function Top20Table({ coins }) {
  return <div className="card">
    <h2>Current top 20 by market cap</h2>
    <div className="tableWrap"><table><thead><tr>
      <th>Rank</th><th>Coin</th><th>Price</th><th>24h</th><th>Market Cap</th><th>24h Vol</th>
    </tr></thead><tbody>
      {coins.map(c => <tr key={c.id}>
        <td>{c.market_cap_rank}</td><td><b>{c.symbol?.toUpperCase()}</b> {c.name}</td>
        <td>${Number(c.current_price).toLocaleString()}</td>
        <td className={c.price_change_percentage_24h >= 0 ? 'up' : 'down'}>
          {Number(c.price_change_percentage_24h ?? 0).toFixed(2)}%
        </td>
        <td>${Number(c.market_cap).toLocaleString()}</td>
        <td>${Number(c.total_volume).toLocaleString()}</td>
      </tr>)}
    </tbody></table></div>
  </div>
}
