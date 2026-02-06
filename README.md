# RealTicker - AI-Powered Stock Insights Platform

![RealTicker Banner](https://img.shields.io/badge/RealTicker-AI%20Stock%20Insights-00ff88?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square)

A full-stack web application that provides AI-powered stock market insights using real-time data and HuggingFace LLMs.

## 🌟 Features

- **Top 10 Stocks Dashboard** - View top-performing stocks by trading volume
- **6-Month Historical Data** - Comprehensive price history visualization
- **AI-Powered Analysis** - Investment insights using HuggingFace LLMs
- **Interactive Charts** - Beautiful data visualization with Recharts
- **Real-time Updates** - Fetch latest stock data on demand
- **Modern UI/UX** - Cyber-futuristic design with smooth animations
- **Risk Assessment** - Low/Medium/High risk level classification
- **Investment Suggestions** - AI-generated recommendations for investors

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Dashboard  │  │  Stock Table │  │  Stock Detail   │   │
│  │             │  │              │  │  + AI Analysis  │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                     Axios HTTP Requests
                            │
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                         │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│  │ REST API     │  │ Data        │  │ HuggingFace      │  │
│  │ Endpoints    │  │ Generator   │  │ LLM Integration  │  │
│  └──────────────┘  └─────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
Frontend/
├── App.js (Main Container)
├── StockTable (Top 10 Display)
├── StockDetail (Analysis View)
└── LoadingSpinner (Loading States)

Backend/
├── FastAPI Server
├── Stock Data Generator
├── Price History Generator
├── Trend Analysis Engine
└── HuggingFace API Integration
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** - Backend runtime
- **Node.js 14+** - Frontend runtime
- **npm or yarn** - Package manager
- **HuggingFace API Token** (Optional) - For AI analysis

### Installation

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd realticker
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Set HuggingFace API Token
export HUGGINGFACE_TOKEN="your_token_here"

# Start the FastAPI server
python main.py
```

The backend will start on `http://localhost:8000`

**Note:** If you don't have a HuggingFace token, the app will use rule-based analysis as a fallback.

#### 3. Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on `http://localhost:3000`

## 📡 API Endpoints

### GET /api/stocks/top10
Fetches the top 10 stocks sorted by trading volume.

**Response:**
```json
[
  {
    "ticker": "AAPL",
    "company": "Apple Inc",
    "price": 185.40,
    "change": 1.2,
    "volume": 78000000,
    "sector": "Technology"
  }
]
```

### GET /api/stocks/{ticker}/history
Retrieves 6 months of historical price data for a specific stock.

**Response:**
```json
{
  "ticker": "AAPL",
  "company": "Apple Inc",
  "history": [
    {
      "date": "2025-08-06",
      "price": 175.32
    }
  ]
}
```

### POST /api/stocks/{ticker}/analyze
Analyzes stock data using AI and provides investment insights.

**Response:**
```json
{
  "ticker": "AAPL",
  "trend": "Upward",
  "risk_level": "Low",
  "suggested_action": "Long-term investment - Strong fundamentals",
  "analysis": "Based on 6 months of historical data, AAPL shows...",
  "disclaimer": "This is AI-generated analysis..."
}
```

## 🤖 LLM Integration

The application uses **HuggingFace's google/flan-t5-large** model for stock analysis.

### How It Works:

1. Fetches 6 months of historical price data
2. Calculates trend (Upward/Downward/Sideways)
3. Computes volatility and risk level
4. Sends data to HuggingFace API with prompt
5. Generates human-readable investment insights

### Setting Up HuggingFace:

1. Create account at https://huggingface.co
2. Generate API token in Settings → Access Tokens
3. Set environment variable:
```bash
export HUGGINGFACE_TOKEN="hf_xxxxxxxxxxxxx"
```

### Fallback Mechanism:

If HuggingFace API is unavailable, the system uses intelligent rule-based analysis:
- Trend analysis based on 6-month price change
- Volatility calculation from price variance
- Risk assessment (Low/Medium/High)
- Context-aware investment suggestions

## 🎨 UI/UX Design

### Design Philosophy
- **Cyber-Futuristic Aesthetic** - Inspired by financial terminals and cyberpunk themes
- **High Contrast Colors** - Neon green (#00ff88) and electric blue (#0099ff) on dark backgrounds
- **Typography** - Orbitron for headings, JetBrains Mono for data
- **Animations** - Smooth transitions and micro-interactions
- **Responsive** - Works on desktop, tablet, and mobile

### Key Design Features
- Animated grid background
- Glowing effects on interactive elements
- Real-time pulse indicators
- Gradient text and borders
- Dark theme optimized for extended viewing

## 📊 Technology Stack

### Frontend
- **React 18.2** - UI framework
- **Recharts 2.10** - Data visualization
- **Axios** - HTTP client
- **CSS3** - Styling with animations

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
- **Requests** - HTTP library for HuggingFace API

### AI/ML
- **HuggingFace API** - google/flan-t5-large model
- **Custom Analysis Engine** - Trend and volatility calculation

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Manual API Testing
```bash
# Health check
curl http://localhost:8000/api/health

# Get top stocks
curl http://localhost:8000/api/stocks/top10

# Get stock history
curl http://localhost:8000/api/stocks/AAPL/history

# Analyze stock
curl -X POST http://localhost:8000/api/stocks/AAPL/analyze
```

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

Creates optimized production build in `frontend/build/`

### Backend Deployment
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🔧 Configuration

### Environment Variables

**Backend:**
- `HUGGINGFACE_TOKEN` - HuggingFace API token (optional)

**Frontend:**
- Update `API_BASE_URL` in `App.js` for production deployment

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed
- Check all dependencies: `pip install -r requirements.txt`
- Verify port 8000 is available

### Frontend won't start
- Ensure Node.js 14+ is installed
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### CORS errors
- Ensure backend is running on port 8000
- Check CORS middleware configuration in `main.py`

### No AI analysis
- Verify HuggingFace token is set correctly
- Check internet connection
- Fallback to rule-based analysis should work automatically

## 🎯 Future Enhancements

- [ ] Real stock data integration (Alpha Vantage, Yahoo Finance)
- [ ] User authentication and portfolios
- [ ] Multiple LLM model support
- [ ] Real-time WebSocket updates
- [ ] Advanced technical indicators
- [ ] News sentiment analysis
- [ ] Stock comparison feature
- [ ] Mobile app (React Native)
- [ ] Export reports to PDF

## 📝 License

This project is created for educational and demonstration purposes.

## 👥 Contributors

Built as part of the Sorim.AI Hackathon Technical Assessment.

## 🙏 Acknowledgments

- HuggingFace for AI models
- Recharts for visualization library
- FastAPI for the excellent framework
- React team for the UI library

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check backend logs in terminal
4. Verify all dependencies are installed

---

**Built with ❤️ using React + FastAPI + HuggingFace AI**

⚡ RealTicker - Making Stock Analysis Accessible to Everyone
