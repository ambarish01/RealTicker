#!/bin/bash

echo "Starting RealTicker Application..."
echo ""

# Start backend in background
echo "Starting backend on port 8000..."
cd backend
source venv/bin/activate 2>/dev/null || python3 -m venv venv && source venv/bin/activate
pip install -q -r requirements.txt
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 3

# Start frontend
echo "Starting frontend on port 3000..."
cd frontend
npm install --silent 2>/dev/null
BROWSER=none npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "=========================================="
echo "  RealTicker is running!"
echo "=========================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
