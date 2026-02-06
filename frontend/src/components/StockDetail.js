import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './StockDetail.css';

const StockDetail = ({ stock, onBack, loading }) => {
  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-spinner"></div>
        <p>Analyzing stock data with AI...</p>
      </div>
    );
  }

  if (!stock || !stock.analysis) {
    return null;
  }

  const { ticker, company, history, analysis } = stock;

  // Prepare chart data
  const chartData = history.slice(-90).map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: item.price
  }));

  const currentPrice = history[history.length - 1]?.price || 0;
  const startPrice = history[0]?.price || 0;
  const priceChange = ((currentPrice - startPrice) / startPrice * 100).toFixed(2);

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low': return '#00ff88';
      case 'medium': return '#ffaa00';
      case 'high': return '#ff4466';
      default: return '#8892b0';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend.toLowerCase()) {
      case 'upward': return '📈';
      case 'downward': return '📉';
      case 'sideways': return '↔️';
      default: return '📊';
    }
  };

  return (
    <div className="stock-detail">
      <button className="back-btn" onClick={onBack}>
        ← Back to Dashboard
      </button>

      <div className="detail-header">
        <div className="detail-title">
          <h1>{ticker}</h1>
          <p className="detail-company">{company}</p>
        </div>
        <div className="detail-stats">
          <div className="stat-card">
            <span className="stat-label">Current Price</span>
            <span className="stat-number">${currentPrice.toFixed(2)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">6M Change</span>
            <span className={`stat-number ${parseFloat(priceChange) >= 0 ? 'positive' : 'negative'}`}>
              {parseFloat(priceChange) >= 0 ? '+' : ''}{priceChange}%
            </span>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="chart-section">
          <h3 className="section-title">6-Month Price History</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2035" />
                <XAxis 
                  dataKey="date" 
                  stroke="#8892b0"
                  tick={{ fontSize: 12 }}
                  interval={Math.floor(chartData.length / 6)}
                />
                <YAxis 
                  stroke="#8892b0"
                  tick={{ fontSize: 12 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#131829', 
                    border: '1px solid #00ff88',
                    borderRadius: '8px',
                    color: '#e0e6ff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#00ff88" 
                  strokeWidth={2}
                  fill="url(#priceGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ai-analysis-section">
          <h3 className="section-title">
            <span className="ai-badge">🤖 AI Analysis</span>
          </h3>
          
          <div className="analysis-metrics">
            <div className="metric-card">
              <span className="metric-icon">{getTrendIcon(analysis.trend)}</span>
              <div className="metric-content">
                <span className="metric-label">Trend</span>
                <span className="metric-value">{analysis.trend}</span>
              </div>
            </div>
            
            <div className="metric-card">
              <span className="metric-icon">⚠️</span>
              <div className="metric-content">
                <span className="metric-label">Risk Level</span>
                <span 
                  className="metric-value"
                  style={{ color: getRiskColor(analysis.risk_level) }}
                >
                  {analysis.risk_level}
                </span>
              </div>
            </div>
          </div>

          <div className="analysis-text">
            <h4>Analysis</h4>
            <p>{analysis.analysis}</p>
          </div>

          <div className="suggestion-box">
            <h4>💡 Investment Suggestion</h4>
            <p className="suggestion-text">{analysis.suggested_action}</p>
          </div>

          <div className="disclaimer-box">
            <span className="disclaimer-icon">⚠️</span>
            <p>{analysis.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
