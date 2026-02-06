# RealTicker - System Architecture

## Overview

RealTicker is a full-stack application built with a modern microservices-inspired architecture, separating the presentation layer (React frontend) from the business logic and data layer (FastAPI backend).

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React SPA)                          │
│                      Port: 3000                                  │
├─────────────────────────────────────────────────────────────────┤
│  Components:                                                     │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────────┐    │
│  │ App.js       │  │ StockTable  │  │ StockDetail        │    │
│  │ (Container)  │─>│ (List View) │  │ (Analysis View)    │    │
│  └──────────────┘  └─────────────┘  └────────────────────┘    │
│         │                                                        │
│         │ State Management (React Hooks)                        │
│         │ - stocks (array)                                      │
│         │ - selectedStock (object)                              │
│         │ - loading/error states                                │
│         ↓                                                        │
│  ┌─────────────────────────────────────────────┐               │
│  │ Axios HTTP Client                            │               │
│  │ - GET /api/stocks/top10                     │               │
│  │ - GET /api/stocks/{ticker}/history          │               │
│  │ - POST /api/stocks/{ticker}/analyze         │               │
│  └─────────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (JSON)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI)                            │
│                       Port: 8000                                 │
├─────────────────────────────────────────────────────────────────┤
│  API Layer:                                                      │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ FastAPI Application (main.py)                         │      │
│  │ - CORS Middleware                                     │      │
│  │ - Route Handlers                                      │      │
│  │ - Request/Response Models (Pydantic)                  │      │
│  └──────────────────────────────────────────────────────┘      │
│         │                                                        │
│         ↓                                                        │
│  Business Logic Layer:                                          │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ Data Generation Module                                │      │
│  │ - generate_current_stocks()                           │      │
│  │ - generate_price_data()                               │      │
│  └──────────────────────────────────────────────────────┘      │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ Analysis Engine                                       │      │
│  │ - analyze_price_trend()                               │      │
│  │ - Calculate volatility                                │      │
│  │ - Risk assessment                                     │      │
│  └──────────────────────────────────────────────────────┘      │
│         │                                                        │
│         ↓                                                        │
│  External Services Layer:                                       │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ HuggingFace API Integration                           │      │
│  │ - Model: google/flan-t5-large                         │      │
│  │ - Inference API endpoint                              │      │
│  │ - Fallback: Rule-based analysis                       │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   HuggingFace API                                │
│              api-inference.huggingface.co                        │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Architecture

#### Component Hierarchy
```
App (Root Component)
├── Header
│   ├── Logo
│   ├── Tagline
│   └── Stats Display
├── Main Content
│   ├── Error Banner (conditional)
│   ├── Loading Spinner (conditional)
│   ├── Dashboard Container
│   │   ├── Section Header
│   │   └── StockTable
│   │       └── Stock Rows (map)
│   └── StockDetail (conditional)
│       ├── Back Button
│       ├── Detail Header
│       ├── Price Chart (Recharts)
│       └── AI Analysis Section
│           ├── Trend Metrics
│           ├── Risk Assessment
│           ├── Analysis Text
│           └── Investment Suggestion
└── Footer
```

#### State Management
- **Local State** (useState):
  - `stocks`: Array of top 10 stocks
  - `selectedStock`: Currently selected stock for analysis
  - `loading`: Global loading state
  - `error`: Error messages
  - `detailLoading`: Loading state for detail view

#### Data Flow
1. User opens app → `useEffect` triggers `fetchTopStocks()`
2. Backend API called → Data stored in `stocks` state
3. User clicks "Analyze" → `handleSelectStock()` called
4. Parallel API calls for history + analysis
5. Data combined and stored in `selectedStock` state
6. StockDetail component renders with data
7. Charts and AI analysis displayed

### Backend Architecture

#### API Endpoints

**1. GET /api/stocks/top10**
- **Purpose**: Fetch top 10 stocks by volume
- **Process**:
  1. Generate current stock data with random realistic prices
  2. Sort by trading volume
  3. Return top 10
- **Response**: Array of Stock objects

**2. GET /api/stocks/{ticker}/history**
- **Purpose**: Get 6 months of historical data
- **Process**:
  1. Validate ticker exists
  2. Get current price for stock
  3. Generate 180 days of historical data
  4. Apply realistic price movement simulation
- **Response**: Object with ticker, company, history array

**3. POST /api/stocks/{ticker}/analyze**
- **Purpose**: AI-powered stock analysis
- **Process**:
  1. Fetch historical data (reuses history endpoint logic)
  2. Calculate trend (Upward/Downward/Sideways)
  3. Calculate volatility and risk level
  4. Call HuggingFace API (or fallback)
  5. Generate investment suggestion
  6. Return comprehensive analysis
- **Response**: AnalysisResponse object

#### Data Models (Pydantic)

```python
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
    trend: str  # Upward/Downward/Sideways
    risk_level: str  # Low/Medium/High
    suggested_action: str
    analysis: str
    disclaimer: str
```

#### Analysis Algorithm

```
1. Data Collection:
   - Retrieve 180 days of price data
   - Extract first and last prices

2. Trend Calculation:
   price_change = ((last_price - first_price) / first_price) * 100
   
   if price_change > 10%: Trend = "Upward"
   elif price_change < -10%: Trend = "Downward"
   else: Trend = "Sideways"

3. Volatility Calculation:
   - Calculate average price
   - Compute variance: Σ(price - avg)² / n
   - Standard deviation: √variance
   - Volatility % = (std_dev / avg_price) * 100

4. Risk Assessment:
   if volatility > 5%: Risk = "High"
   elif volatility > 2.5%: Risk = "Medium"
   else: Risk = "Low"

5. AI Analysis:
   - Send data to HuggingFace API
   - Prompt: Analyze trend, volatility, provide guidance
   - Fallback: Rule-based recommendations

6. Investment Suggestion:
   Based on (Trend, Risk) combination:
   - (Upward, Low) → Long-term investment
   - (Upward, High) → Short-term watch
   - (Downward, High) → Avoid
   - (Sideways, Low) → Conservative hold
   etc.
```

## Technology Stack Details

### Frontend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2 | UI framework, component architecture |
| Axios | 1.6 | HTTP client for API requests |
| Recharts | 2.10 | Data visualization library |
| CSS3 | - | Styling, animations, responsive design |

**Key Frontend Features:**
- Single Page Application (SPA)
- Component-based architecture
- Responsive design (mobile-first)
- CSS animations and transitions
- Error boundary handling
- Loading states
- Custom fonts (Orbitron, JetBrains Mono)

### Backend Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| FastAPI | 0.104 | Web framework |
| Uvicorn | 0.24 | ASGI server |
| Pydantic | 2.5 | Data validation |
| Requests | 2.31 | HTTP library for HuggingFace |
| Python | 3.8+ | Programming language |

**Key Backend Features:**
- RESTful API design
- CORS enabled for cross-origin requests
- Automatic OpenAPI documentation
- Type safety with Pydantic
- Async/await support
- Error handling and validation

### AI/ML Integration

**HuggingFace Model:**
- **Model**: google/flan-t5-large
- **Type**: Text-to-Text Generation
- **Parameters**: 780M
- **Use Case**: Stock analysis and investment guidance

**Integration Pattern:**
```python
1. Prepare prompt with stock data
2. POST to HuggingFace Inference API
3. Parse generated text response
4. Combine with quantitative analysis
5. Return structured insights
```

**Fallback Strategy:**
If HuggingFace unavailable:
- Use rule-based analysis engine
- Provide similar quality insights
- Maintain user experience
- No API dependency

## Data Flow Diagram

```
User Action
    │
    ↓
[Click "Analyze" on AAPL]
    │
    ↓
Frontend: handleSelectStock('AAPL')
    │
    ├─────────────────────┬─────────────────────┐
    ↓                     ↓                      ↓
GET /history        POST /analyze         Set Loading State
    │                     │                      │
    ↓                     ↓                      ↓
Backend:              Backend:              Frontend:
generate_price_data   analyze_price_trend   Show Spinner
    │                     │                      │
    ↓                     ↓                      ↓
Return 180 days       Calculate trend       Wait for APIs
    │                     │                      │
    │                     ↓                      │
    │               Call HuggingFace             │
    │                     │                      │
    │                     ↓                      │
    │               Generate insights            │
    │                     │                      │
    └─────────────────────┴──────────────────────┘
                          │
                          ↓
                 Combine Responses
                          │
                          ↓
                 Update selectedStock State
                          │
                          ↓
                 Render StockDetail Component
                          │
                          ↓
                 Display Charts + AI Analysis
```

## Security Considerations

1. **CORS Configuration**: 
   - Currently allows all origins (`allow_origins=["*"]`)
   - Production should restrict to specific domains

2. **API Token Security**:
   - HuggingFace token stored as environment variable
   - Never committed to version control
   - Server-side only, not exposed to frontend

3. **Input Validation**:
   - Pydantic models validate all API inputs
   - Ticker symbol validation
   - Type checking on all endpoints

4. **Error Handling**:
   - Graceful degradation (fallback analysis)
   - User-friendly error messages
   - No sensitive info in error responses

## Performance Optimizations

1. **Frontend**:
   - React.memo for component optimization
   - Lazy loading for charts
   - CSS animations (GPU-accelerated)
   - Minimal re-renders

2. **Backend**:
   - Async/await for non-blocking I/O
   - Efficient data generation algorithms
   - Caching potential for stock data
   - Fast JSON serialization

3. **Network**:
   - Parallel API requests (Promise.all)
   - Minimal payload size
   - Compression ready

## Scalability Considerations

### Current Architecture:
- Suitable for demo/prototype
- Handles moderate traffic
- In-memory data generation

### Production Scaling Path:

1. **Database Layer**:
   - PostgreSQL for stock data
   - Redis for caching
   - Time-series DB for historical data

2. **Backend Scaling**:
   - Load balancer (Nginx)
   - Multiple Uvicorn workers
   - Container orchestration (Kubernetes)

3. **Frontend Optimization**:
   - CDN for static assets
   - Server-side rendering (Next.js)
   - Progressive Web App (PWA)

4. **Caching Strategy**:
   - API response caching
   - Browser caching
   - CDN edge caching

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│              Cloud Provider                  │
│         (AWS/GCP/Azure/Vercel)              │
├─────────────────────────────────────────────┤
│                                              │
│  ┌────────────────┐    ┌──────────────┐   │
│  │   Frontend     │    │   Backend    │   │
│  │   (React)      │    │   (FastAPI)  │   │
│  │   Port 3000    │    │   Port 8000  │   │
│  └────────────────┘    └──────────────┘   │
│         │                      │            │
│         │                      │            │
│  ┌──────┴──────────────────────┴──────┐   │
│  │      Load Balancer / Nginx          │   │
│  └────────────────┬────────────────────┘   │
│                   │                         │
└───────────────────┼─────────────────────────┘
                    │
                    ↓
              Public Internet
                    │
                    ↓
              End Users
```

## Development Workflow

```
1. Local Development:
   - Frontend: npm start (port 3000)
   - Backend: python main.py (port 8000)
   - Hot reload enabled

2. Testing:
   - Frontend: npm test
   - Backend: pytest
   - Integration: Manual testing

3. Build:
   - Frontend: npm run build
   - Backend: Docker image

4. Deployment:
   - Frontend: Static hosting (Vercel/Netlify)
   - Backend: Container deployment
   - Environment variables configured
```

## Monitoring & Logging

### Suggested Implementation:

1. **Frontend**:
   - Google Analytics
   - Error tracking (Sentry)
   - Performance monitoring

2. **Backend**:
   - Application logs (Python logging)
   - API metrics (Prometheus)
   - Health check endpoint
   - Request/response logging

3. **Infrastructure**:
   - Server metrics (CPU, memory)
   - Network monitoring
   - Uptime monitoring

## Conclusion

RealTicker demonstrates a modern, scalable architecture suitable for financial applications. The separation of concerns, use of industry-standard technologies, and thoughtful design patterns make it maintainable and extensible for future enhancements.
