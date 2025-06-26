#!/bin/bash

# Kill any existing processes
echo "Cleaning up existing processes..."
pkill -f "node.*react" || true
pkill -f "expo" || true
pkill -f "Metro" || true

# Function to cleanup on exit
cleanup() {
    echo "Stopping all processes..."
    kill 0
}
trap cleanup EXIT

# Start the React web app in the background
echo "Starting React web app..."
cd /Users/jakobstrozberg/Desktop/nonamehackathon/noname-shopping-list
npm start &
WEB_PID=$!

# Wait for the web app to be ready
echo "Waiting for web app to start..."
while ! curl -s http://localhost:3000 > /dev/null; do
    sleep 1
done
echo "Web app is ready!"

# Start the React Native iOS app
echo "Starting React Native iOS app..."
cd /Users/jakobstrozberg/Desktop/nonamehackathon/NoNameiOS
npx expo start --ios

# Wait for all background processes
wait 