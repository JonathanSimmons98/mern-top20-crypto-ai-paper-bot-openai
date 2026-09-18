import React from 'react';
export default function Orders({ orders }) {
  return <div className="card"><h2>Paper orders</h2>
    {orders.length === 0 ? <p>No paper fills yet.</p> :
    <div className="tableWrap"><table><thead><tr><th>Time</th><th>Side</th><th>Symbol</th><th>Notional</th><th>Price</th><th>Reason</th></tr></thead>
    <tbody>{orders.map(o => <tr key={o._id}><td>{new Date(o.createdAt).toLocaleString()}</td><td>{o.side}</td><td>{o.symbol}</td><td>${o.notional.toFixed(2)}</td><td>${o.price}</td><td>{o.reason}</td></tr>)}</tbody>
    </table></div>}
  </div>
}
