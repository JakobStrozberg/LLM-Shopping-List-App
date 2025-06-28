#!/bin/bash

echo "Cleaning up existing processes..."
pkill -f "node.*react" || true
pkill -f "expo" || true
pkill -f "Metro" || true

cleanup() {
    echo "Stopping all processes..."
    kill 0
}
trap cleanup EXIT

echo "Starting React web app..."
cd /Users/jakobstrozberg/Desktop/nonamehackathon/noname-shopping-list
npm start &
WEB_PID=$!

echo "Waiting for web app to start..."
while ! curl -s http://localhost:3000 > /dev/null; do
    sleep 1
done
echo "Web app is ready!"

echo "Starting React Native iOS app..."
cd /Users/jakobstrozberg/Desktop/nonamehackathon/NoNameiOS
npx expo start --ios

wait 