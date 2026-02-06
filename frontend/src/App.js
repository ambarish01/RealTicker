import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import StockTable from './components/StockTable';
import StockDetail from './components/StockDetail';
import LoadingSpinner from './components/LoadingSpinner';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchTopStocks();
  }, []);

  const fetchTopStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/stocks/top10`);
      setStocks(response.data);
    } catch (err) {
      setError('Failed to fetch stock data. Please ensure the backend is running on port 8000.');
      console.error('Error fetching stocks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStock = async (ticker) => {
    try {
      setDetailLoading(true);
      setSelectedStock(null);
      
      // Fetch history and analysis in parallel
      const [historyResponse, analysisResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/stocks/${ticker}/history`),
        axios.post(`${API_BASE_URL}/api/stocks/${ticker}/analyze`)
      ]);

      setSelectedStock({
        ...historyResponse.data,
        analysis: analysisResponse.data
      });
    } catch (err) {
      setError(`Failed to fetch details for ${ticker}`);
      console.error('Error fetching stock details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedStock(null);
  };

  return (
    <div className="App">
      <div className="cyber-grid"></div>
      
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo">
            <span className="logo-icon">⚡</span>
            RealTicker
          </h1>
          <p className="tagline">AI-Powered Stock Intelligence</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">Live Data</span>
            <span className="stat-value pulse">●</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Stocks</span>
            <span className="stat-value">{stocks.length}</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠</span>
            {error}
            <button onClick={fetchTopStocks} className="retry-btn">Retry</button>
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Fetching market data..." />
        ) : selectedStock ? (
          <StockDetail 
            stock={selectedStock} 
            onBack={handleBackToList}
            loading={detailLoading}
          />
        ) : (
          <div className="dashboard-container">
            <div className="section-header">
              <h2>Top 10 Stocks by Volume</h2>
              <button onClick={fetchTopStocks} className="refresh-btn">
                ↻ Refresh
              </button>
            </div>
            <StockTable stocks={stocks} onSelectStock={handleSelectStock} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 RealTicker | Powered by HuggingFace AI</p>
        <p className="disclaimer">Market data is simulated for demonstration purposes</p>
      </footer>
    </div>
  );
}

export default App;
