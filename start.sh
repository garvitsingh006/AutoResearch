#!/bin/bash

# Start backend in background
cd backend && uvicorn app:app --host localhost --port 8000 &
BACKEND_PID=$!

# Give backend a moment to start
sleep 2

# Start frontend
cd /home/runner/workspace/frontend && npm run dev
