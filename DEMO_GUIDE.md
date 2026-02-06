# RealTicker - Demo & Testing Guide

This guide will walk you through testing all features of the RealTicker application.

## Quick Start Demo

### 1. Start the Application

**Option A: Automatic Start (Recommended)**
```bash
cd realticker
./start.sh
```

**Option B: Manual Start**

Terminal 1 (Backend):
```bash
cd realticker/backend
pip install -r requirements.txt
python main.py
```

Terminal 2 (Frontend):
```bash
cd realticker/frontend
npm install
npm start
```

### 2. Access the Application

Open your browser to: **http://localhost:3000**

## Feature Testing Checklist

### ✅ Phase 1: Dashboard View

**Test: Initial Load**
- [ ] Application loads without errors
- [ ] Animated grid background is visible
- [ ] Header displays "RealTicker" logo
- [ ] "Live Data" indicator is pulsing
- [ ] "Top 10 Stocks by Volume" section is visible

**Test: Stock Table Display**
- [ ] Table shows exactly 10 stocks
- [ ] Each row displays: Rank, Ticker, Company, Price, Change %, Volume, Sector
- [ ] Rows fade in with animation (staggered effect)
- [ ] Hover effects work on table rows
- [ ] Positive changes are green, negative are red
- [ ] Volume is formatted (e.g., "78.0M")
- [ ] Sector badges are displayed with proper styling

**Expected Output:**
```
#  Ticker  Company              Price    Change %  Volume   Sector
1  NVDA    NVIDIA Corporation   $342.15  +2.3%     145.2M   Technology
2  TSLA    Tesla Inc            $189.76  -1.5%     132.8M   Automotive
...
```

### ✅ Phase 2: Stock Analysis

**Test: Select a Stock**
1. Click the "Analyze →" button on any stock (e.g., AAPL)
2. Verify loading spinner appears
3. Wait 2-3 seconds for AI analysis

**Expected Behavior:**
- [ ] Loading message: "Analyzing stock data with AI..."
- [ ] Spinner animation is smooth
- [ ] Detail view loads without errors

**Test: Detail View Components**
- [ ] "Back to Dashboard" button is visible and clickable
- [ ] Stock ticker (e.g., "AAPL") is large and prominent
- [ ] Company name is displayed below ticker
- [ ] Current Price card shows accurate value
- [ ] 6M Change card shows percentage with correct color
- [ ] Price history chart is rendered
- [ ] Chart has 90 days of data points
- [ ] Chart tooltip works on hover

**Test: AI Analysis Section**
- [ ] "🤖 AI Analysis" badge is visible
- [ ] Trend metric displays (Upward/Downward/Sideways) with emoji
- [ ] Risk Level displays (Low/Medium/High) with appropriate color
- [ ] Analysis text is readable and contextual
- [ ] Investment suggestion box has recommendation
- [ ] Disclaimer is displayed at bottom

**Expected AI Analysis Format:**
```
Trend: 📈 Upward
Risk Level: Low (green color)

Analysis:
"Based on 6 months of historical data, AAPL shows an upward 
trend with low volatility. The stock has gained 12.3% with 
stable growth, indicating strong fundamentals."

💡 Investment Suggestion:
"Long-term investment - Consider adding to portfolio for steady growth"

⚠️ Disclaimer:
"This is AI-generated analysis and not financial advice..."
```

### ✅ Phase 3: Navigation & Interactions

**Test: Return to Dashboard**
1. From detail view, click "← Back to Dashboard"
2. Verify table reappears with same data
3. Check that previous state is preserved

**Test: Multiple Stock Analysis**
1. Analyze stock #1 (e.g., AAPL)
2. Return to dashboard
3. Analyze stock #2 (e.g., MSFT)
4. Compare analysis differences

**Expected Behavior:**
- [ ] Each stock has unique analysis
- [ ] Chart data is different for each stock
- [ ] Recommendations vary based on stock performance
- [ ] No caching issues (data updates correctly)

### ✅ Phase 4: Refresh & Error Handling

**Test: Refresh Data**
1. Click the "↻ Refresh" button on dashboard
2. Observe new data loading
3. Check that prices/volumes have changed (they're randomly generated)

**Test: Simulate Backend Error**
1. Stop the backend server (Ctrl+C in backend terminal)
2. Click "Analyze" on any stock
3. Verify error message displays
4. Check that "Retry" button appears
5. Restart backend
6. Click "Retry" button
7. Verify data loads successfully

**Expected Error Message:**
```
⚠ Failed to fetch stock data. Please ensure the backend 
is running on port 8000.
[Retry]
```

### ✅ Phase 5: Responsive Design

**Test: Desktop View (1920x1080)**
- [ ] Layout uses full width (max 1400px container)
- [ ] All elements properly spaced
- [ ] Chart is large and readable
- [ ] No horizontal scrolling

**Test: Tablet View (768x1024)**
- [ ] Table remains functional
- [ ] Cards stack vertically if needed
- [ ] Touch targets are adequate
- [ ] No content overflow

**Test: Mobile View (375x667)**
1. Open browser dev tools (F12)
2. Switch to mobile view
3. Test all interactions

Expected Behavior:
- [ ] Header stacks vertically
- [ ] Table scrolls horizontally
- [ ] Detail view adapts to narrow width
- [ ] Buttons remain accessible
- [ ] Text remains readable

### ✅ Phase 6: API Endpoint Testing

**Test: Backend API Directly**

Using `curl` or browser:

1. **Health Check**
```bash
curl http://localhost:8000/api/health
```
Expected: `{"status":"healthy","timestamp":"..."}`

2. **Top 10 Stocks**
```bash
curl http://localhost:8000/api/stocks/top10
```
Expected: JSON array with 10 stock objects

3. **Stock History**
```bash
curl http://localhost:8000/api/stocks/AAPL/history
```
Expected: JSON with ticker, company, and 180-day history array

4. **Stock Analysis**
```bash
curl -X POST http://localhost:8000/api/stocks/AAPL/analyze
```
Expected: JSON with trend, risk_level, analysis, etc.

5. **API Documentation**
Open: http://localhost:8000/docs
- [ ] Swagger UI loads
- [ ] All endpoints listed
- [ ] Can test endpoints interactively

### ✅ Phase 7: Performance Testing

**Test: Load Time**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Reload application
3. Measure time to first render

Expected:
- [ ] Initial load < 3 seconds
- [ ] Stock table renders < 1 second
- [ ] Detail view loads < 2 seconds

**Test: Animation Smoothness**
1. Observe table row fade-in animations
2. Hover over table rows (should slide right)
3. Check loading spinner rotation
4. Test chart tooltip responsiveness

Expected:
- [ ] All animations at 60fps
- [ ] No janky movements
- [ ] Smooth transitions

### ✅ Phase 8: AI Analysis Quality

**Test Different Stock Scenarios**

Test with multiple stocks and observe different analysis outputs:

1. **High Growth Stock** (e.g., NVDA)
   - Expected: "Upward" trend, recommendations for growth investors

2. **Stable Stock** (e.g., JNJ)
   - Expected: "Sideways" trend, recommendations for conservative investors

3. **Volatile Stock** (simulated high volatility)
   - Expected: "High" risk level, caution in recommendations

**Test: Analysis Consistency**
1. Analyze same stock twice
2. Verify analysis is consistent (same trend, risk)
3. Check that random price generation doesn't break logic

### ✅ Phase 9: HuggingFace Integration (Optional)

**If you have HuggingFace API token:**

1. Set environment variable:
```bash
export HUGGINGFACE_TOKEN="hf_xxxxxxxxxxxx"
```

2. Restart backend
3. Analyze a stock
4. Compare AI-generated text vs. rule-based fallback

**Expected Differences:**
- HuggingFace: More natural language, varied phrasing
- Fallback: Structured, template-based responses
- Both: Accurate trend/risk assessment

### ✅ Phase 10: Edge Cases

**Test: Invalid Stock Ticker**
```bash
curl http://localhost:8000/api/stocks/INVALID/history
```
Expected: 404 error with message "Stock not found"

**Test: Network Failures**
1. Disable internet (while keeping localhost running)
2. Try to fetch stock data
3. Verify appropriate error handling

**Test: Concurrent Requests**
1. Quickly click "Analyze" on multiple stocks
2. Verify all requests complete successfully
3. Check that no race conditions occur

## Common Issues & Solutions

### Issue: Port Already in Use
**Error:** `Address already in use: 8000`
**Solution:**
```bash
# Find process using port 8000
lsof -i :8000
# Kill the process
kill -9 <PID>
# Or use different port
uvicorn main:app --port 8001
```

### Issue: npm Install Fails
**Error:** `npm ERR! code ERESOLVE`
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Issue: CORS Error
**Error:** `Access-Control-Allow-Origin`
**Solution:** Ensure backend is running and CORS middleware is configured correctly

### Issue: Chart Not Displaying
**Error:** Blank chart area
**Solution:** 
- Check console for errors
- Verify Recharts installed: `npm list recharts`
- Restart development server

## Success Criteria

Your demo is successful if:

- ✅ All 10 phases complete without errors
- ✅ UI is responsive and visually appealing
- ✅ AI analysis provides meaningful insights
- ✅ No console errors or warnings
- ✅ Application recovers gracefully from errors
- ✅ Performance is smooth (60fps animations)
- ✅ API endpoints return correct data
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari)

## Demo Presentation Tips

When presenting RealTicker:

1. **Start with Overview**
   - Show the dashboard with all 10 stocks
   - Highlight the modern, cyber-themed design
   - Point out real-time data indicator

2. **Demonstrate Core Features**
   - Click "Analyze" on a stock
   - Explain the 6-month chart
   - Walk through AI analysis components

3. **Highlight Technical Stack**
   - React + FastAPI architecture
   - HuggingFace AI integration
   - Responsive design principles

4. **Show Error Handling**
   - Demonstrate the refresh feature
   - Show how errors are displayed gracefully

5. **Discuss Scalability**
   - Mention production deployment options
   - Explain how to integrate real stock APIs
   - Future enhancement possibilities

## Video Demo Script (Optional)

**0:00-0:15** - Introduction
- "Welcome to RealTicker, an AI-powered stock insights platform"
- Show landing page with animated background

**0:15-0:30** - Dashboard Overview
- "The dashboard displays the top 10 stocks by trading volume"
- Scroll through the table, highlight key metrics

**0:30-1:00** - Stock Analysis
- "Let's analyze Apple stock"
- Click Analyze button
- Show loading state
- Explain 6-month price chart

**1:00-1:30** - AI Insights
- "The AI analyzes trend, volatility, and provides recommendations"
- Read through the analysis
- Highlight trend/risk metrics
- Show investment suggestion

**1:30-2:00** - Technical Overview
- "Built with React and FastAPI"
- "Uses HuggingFace's AI models"
- "Fully responsive design"
- Show API documentation

**2:00-2:15** - Conclusion
- "Thank you for watching"
- "Check out the code on GitHub"

## Automated Testing (Future Enhancement)

Consider adding:

```javascript
// Frontend tests
describe('StockTable', () => {
  test('renders 10 stocks', () => {
    // Test implementation
  });
});

// Backend tests
def test_get_top_stocks():
    response = client.get("/api/stocks/top10")
    assert response.status_code == 200
    assert len(response.json()) == 10
```

---

**Happy Testing! 🚀**

For questions or issues, refer to the main README.md or check the console logs.
