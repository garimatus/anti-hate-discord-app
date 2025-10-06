#!/bin/bash
set -e

echo "🚀 Starting Ollama server in background..."
ollama serve &
OLLAMA_PID=$!

# Wait for the server to become available
until curl -sf http://localhost:11434/ > /dev/null; do
  echo "⏳ Waiting for Ollama server to be ready..."
  sleep 1
done

echo "📥 Pulling model: $ANALYSIS_MODEL..."
if ! ollama pull $ANALYSIS_MODEL; then
  echo "❌ Failed to pull model: $ANALYSIS_MODEL" >&2
  kill $OLLAMA_PID
  exit 1
fi

echo "✅ Model pulled successfully. Ollama is ready."

# Keep container alive by waiting on the Ollama server process
wait $OLLAMA_PID
