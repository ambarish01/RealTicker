from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import random
from datetime import datetime, timedelta
import requests
import os

app = FastAPI(title="RealTicker API")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock stock data (can be replaced with real API)
STOCK_DATA = {
    "AAPL": {"name": "Apple Inc", "sector": "Technology"},
    "MSFT": {"name": "Microsoft Corporation", "sector": "Technology"},
    "GOOGL": {"name": "Alphabet Inc", "sector": "Technology"},
    "AMZN": {"name": "Amazon.com Inc", "sector": "Consumer Cyclical"},
    "TSLA": {"name": "Tesla Inc", "sector": "Automotive"},
    "META": {"name": "Meta Platforms Inc", "sector": "Technology"},
    "NVDA": {"name": "NVIDIA Corporation", "sector": "Technology"},
    "JPM": {"name": "JPMorgan Chase & Co", "sector": "Financial"},
    "V": {"name": "Visa Inc", "sector": "Financial"},
    "WMT": {"name": "Walmart Inc", "sector": "Retail"},
    "JNJ": {"name": "Johnson & Johnson", "sector": "Healthcare"},
    "PG": {"name": "Procter & Gamble", "sector": "Consumer Goods"},
    "MA": {"name": "Mastercard Inc", "sector": "Financial"},
    "HD": {"name": "Home Depot Inc", "sector": "Retail"},
    "DIS": {"name": "Walt Disney Co", "sector": "Entertainment"}
}

class Stock(BaseModel):
    ticker: str
    company: str
    price: float
    change: float
    volume: int
    sector: str

class HistoricalData(BaseModel):
    date: str
    price: float

class AnalysisResponse(BaseModel):
    ticker: str
    trend: str
    risk_level: str
    suggested_action: str
    analysis: str
    disclaimer: str

def generate_price_data(base_price: float, days: int = 180) -> List[Dict]:
    """Generate realistic-looking historical price data"""
    prices = []
    current_price = base_price
    end_date = datetime.now()
    
    for i in range(days):
        date = end_date - timedelta(days=days - i)
        # Simulate price movement with trend and volatility
        change = random.uniform(-0.03, 0.04)  # -3% to +4% daily change
        current_price *= (1 + change)
        
        prices.append({
            "date": date.strftime("%Y-%m-%d"),
            "price": round(current_price, 2)
        })
    
    return prices

def generate_current_stocks() -> List[Stock]:
    """Generate current stock data with realistic prices"""
    stocks = []
    
    for ticker, info in STOCK_DATA.items():
        base_price = random.uniform(50, 500)
        daily_change = random.uniform(-5, 5)
        volume = random.randint(10_000_000, 150_000_000)
        
        stocks.append(Stock(
            ticker=ticker,
            company=info["name"],
            price=round(base_price, 2),
            change=round(daily_change, 2),
            volume=volume,
            sector=info["sector"]
        ))
    
    return stocks

def analyze_price_trend(prices: List[Dict]) -> tuple:
    """Analyze price trend from historical data"""
    if len(prices) < 2:
        return "Sideways", "Medium"
    
    first_price = prices[0]["price"]
    last_price = prices[-1]["price"]
    price_change = ((last_price - first_price) / first_price) * 100
    
    # Calculate volatility
    price_values = [p["price"] for p in prices]
    avg_price = sum(price_values) / len(price_values)
    variance = sum((p - avg_price) ** 2 for p in price_values) / len(price_values)
    volatility = (variance ** 0.5) / avg_price * 100
    
    # Determine trend
    if price_change > 10:
        trend = "Upward"
    elif price_change < -10:
        trend = "Downward"
    else:
        trend = "Sideways"
    
    # Determine risk level
    if volatility > 5:
        risk = "High"
    elif volatility > 2.5:
        risk = "Medium"
    else:
        risk = "Low"
    
    return trend, risk, price_change, volatility

def get_huggingface_analysis(ticker: str, prices: List[Dict], trend: str, risk: str, price_change: float) -> str:
    """Get AI analysis from HuggingFace (with fallback to rule-based)"""
    
    # Prepare price summary
    price_summary = f"6-month data: Start ${prices[0]['price']:.2f}, End ${prices[-1]['price']:.2f}, Change {price_change:.1f}%"
    
    # Try HuggingFace API (optional - requires API key)
    hf_token = os.getenv("HUGGINGFACE_TOKEN")
    
    if hf_token:
        try:
            API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large"
            headers = {"Authorization": f"Bearer {hf_token}"}
            
            prompt = f"""Analyze this stock data for {ticker}:
{price_summary}
Trend: {trend}
Risk Level: {risk}

Provide brief investment guidance for a beginner investor. Focus on the trend and risk."""
            
            response = requests.post(
                API_URL,
                headers=headers,
                json={"inputs": prompt, "parameters": {"max_length": 200}}
            )
            
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    return result[0].get("generated_text", "")
        except Exception as e:
            print(f"HuggingFace API error: {e}")
    
    # Fallback to rule-based analysis
    analysis_parts = [
        f"Based on 6 months of historical data, {ticker} shows a {trend.lower()} trend with {risk.lower()} volatility.",
    ]
    
    if trend == "Upward" and risk == "Low":
        analysis_parts.append(f"The stock has gained {abs(price_change):.1f}% with stable growth, indicating strong fundamentals.")
        suggestion = "Long-term investment - Consider adding to portfolio for steady growth"
    elif trend == "Upward" and risk in ["Medium", "High"]:
        analysis_parts.append(f"While showing {abs(price_change):.1f}% gains, the high volatility suggests caution.")
        suggestion = "Short-term watch - Monitor closely, suitable for risk-tolerant investors"
    elif trend == "Downward" and risk == "High":
        analysis_parts.append(f"The stock has declined {abs(price_change):.1f}% with significant volatility, indicating market uncertainty.")
        suggestion = "Avoid - Wait for market stabilization before considering entry"
    elif trend == "Downward":
        analysis_parts.append(f"A decline of {abs(price_change):.1f}% may present a buying opportunity if fundamentals are strong.")
        suggestion = "Short-term watch - Research company fundamentals before investing"
    else:  # Sideways
        analysis_parts.append(f"The stock has been relatively stable with {risk.lower()} fluctuations.")
        suggestion = "Long-term investment - Suitable for conservative portfolios seeking stability"
    
    return " ".join(analysis_parts), suggestion

@app.get("/")
def read_root():
    return {"message": "RealTicker API - Stock Insights Platform"}

@app.get("/api/stocks/top10", response_model=List[Stock])
def get_top_stocks():
    """Get top 10 stocks by volume"""
    stocks = generate_current_stocks()
    # Sort by volume and return top 10
    top_10 = sorted(stocks, key=lambda x: x.volume, reverse=True)[:10]
    return top_10

@app.get("/api/stocks/{ticker}/history")
def get_stock_history(ticker: str):
    """Get 6 months of historical data for a stock"""
    if ticker not in STOCK_DATA:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    # Generate historical data based on current price
    stocks = generate_current_stocks()
    current_stock = next((s for s in stocks if s.ticker == ticker), None)
    
    if not current_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    historical_data = generate_price_data(current_stock.price, 180)
    
    return {
        "ticker": ticker,
        "company": STOCK_DATA[ticker]["name"],
        "history": historical_data
    }

@app.post("/api/stocks/{ticker}/analyze", response_model=AnalysisResponse)
def analyze_stock(ticker: str):
    """Analyze stock using AI and provide investment insights"""
    if ticker not in STOCK_DATA:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    # Get historical data
    history_data = get_stock_history(ticker)
    prices = history_data["history"]
    
    # Analyze trend
    trend, risk, price_change, volatility = analyze_price_trend(prices)
    
    # Get AI analysis
    analysis_result = get_huggingface_analysis(ticker, prices, trend, risk, price_change)
    
    if isinstance(analysis_result, tuple):
        analysis, suggestion = analysis_result
    else:
        analysis = analysis_result
        # Derive suggestion from trend and risk
        if trend == "Upward" and risk == "Low":
            suggestion = "Long-term investment - Strong fundamentals with stable growth"
        elif trend == "Upward":
            suggestion = "Short-term watch - Growth with volatility, monitor closely"
        elif trend == "Downward" and risk == "High":
            suggestion = "Avoid - High risk and declining trend"
        else:
            suggestion = "Short-term watch - Evaluate based on individual risk tolerance"
    
    return AnalysisResponse(
        ticker=ticker,
        trend=trend,
        risk_level=risk,
        suggested_action=suggestion,
        analysis=analysis,
        disclaimer="This is AI-generated analysis and not financial advice. Always conduct your own research and consult with financial advisors before making investment decisions."
    )

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
