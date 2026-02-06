# RealTicker - Quick Start Guide ⚡

## 30-Second Setup

```bash
cd realticker
./setup.sh
./start.sh
```

Open browser: **http://localhost:3000**

Done! 🎉

---

## What You Get

✅ Full-stack stock insights application  
✅ AI-powered analysis with HuggingFace  
✅ Beautiful cyber-themed UI  
✅ Interactive charts and visualizations  
✅ Top 10 stocks by volume  
✅ 6-month historical data  
✅ Investment recommendations  

---

## Manual Setup (if scripts don't work)

### Backend (Terminal 1)
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```

---

## Key URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/api/health |

---

## Test It Works

1. Open http://localhost:3000
2. See 10 stocks in table
3. Click "Analyze →" on any stock
4. View AI analysis and chart

---

## Optional: HuggingFace AI

For real AI analysis (optional):

```bash
export HUGGINGFACE_TOKEN="hf_xxxxxxxxxxxx"
```

Get token: https://huggingface.co/settings/tokens

Without token: Uses intelligent fallback (works great!)

---

## Features to Try

**Dashboard:**
- View top 10 stocks
- Sort by volume
- See real-time changes
- Click refresh button

**Stock Analysis:**
- Click "Analyze" button
- View 6-month price chart
- Read AI trend analysis
- See risk assessment
- Get investment suggestions

**UI/UX:**
- Smooth animations
- Cyber-futuristic design
- Responsive (works on mobile)
- Loading states
- Error handling

---

## Troubleshooting

**Backend won't start?**
```bash
pip install --upgrade pip
pip install -r backend/requirements.txt --force-reinstall
```

**Frontend won't start?**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Port already in use?**
```bash
# Kill process on port 8000
lsof -i :8000
kill -9 <PID>
```

---

## Project Structure

```
realticker/
├── backend/         # FastAPI server
│   ├── main.py
│   └── requirements.txt
├── frontend/        # React app
│   ├── src/
│   ├── public/
│   └── package.json
├── README.md        # Full documentation
├── setup.sh         # Setup script
└── start.sh         # Start script
```

---

## API Quick Reference

```bash
# Get top 10 stocks
curl http://localhost:8000/api/stocks/top10

# Get stock history
curl http://localhost:8000/api/stocks/AAPL/history

# Analyze stock
curl -X POST http://localhost:8000/api/stocks/AAPL/analyze

# Health check
curl http://localhost:8000/api/health
```

---

## Tech Stack

**Frontend:** React 18 + Recharts + Axios  
**Backend:** FastAPI + Uvicorn + Pydantic  
**AI:** HuggingFace (google/flan-t5-large)  
**Design:** Custom CSS3 with animations  

---

## Next Steps

1. ✅ Run the app (done!)
2. 📖 Read **README.md** for detailed docs
3. 🏗️ Check **ARCHITECTURE.md** for design
4. 🧪 Follow **DEMO_GUIDE.md** for testing
5. 📊 Review **PROJECT_SUMMARY.md** for overview

---

## Need Help?

1. Check console for errors (F12 in browser)
2. View terminal logs (backend + frontend)
3. Read troubleshooting in README.md
4. Verify all dependencies installed

---

## One-Line Deploy (Future)

```bash
# Coming soon: Docker deployment
docker-compose up
```

---

**That's it! You're ready to analyze stocks with AI! 🚀**

---

## Screenshots to Expect

**Dashboard:**
- Dark theme with neon accents
- Table with 10 stocks
- Animated grid background
- Modern cyber aesthetic

**Analysis View:**
- Large price chart
- AI-generated insights
- Risk level indicators
- Investment suggestions
- Professional layout

---

## Performance Targets

✅ Page load: < 2 seconds  
✅ Table render: < 1 second  
✅ Analysis load: < 2 seconds  
✅ 60fps animations  
✅ Zero errors  

---

Built with ❤️ for Sorim.AI Hackathon

**RealTicker - AI-Powered Stock Insights** ⚡
