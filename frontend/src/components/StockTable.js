import React from 'react';
import './StockTable.css';

const StockTable = ({ stocks, onSelectStock }) => {
  return (
    <div className="stock-table-container">
      <table className="stock-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Ticker</th>
            <th>Company</th>
            <th>Price</th>
            <th>Change %</th>
            <th>Volume</th>
            <th>Sector</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr 
              key={stock.ticker} 
              className="stock-row"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <td className="rank">{index + 1}</td>
              <td className="ticker">{stock.ticker}</td>
              <td className="company">{stock.company}</td>
              <td className="price">${stock.price.toFixed(2)}</td>
              <td className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
              </td>
              <td className="volume">{formatVolume(stock.volume)}</td>
              <td className="sector">
                <span className="sector-badge">{stock.sector}</span>
              </td>
              <td>
                <button 
                  className="analyze-btn"
                  onClick={() => onSelectStock(stock.ticker)}
                >
                  Analyze →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const formatVolume = (volume) => {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toString();
};

export default StockTable;
