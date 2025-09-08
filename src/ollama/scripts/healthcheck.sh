#!/bin/sh

RESPONSE=$(curl -s -X POST http://localhost:11434/api/generate \
  -H 'Content-Type: application/json' \
  -d "{\"model\": \"$DETECTION_MODEL\", \"prompt\": \"Only reply with exactly: OK\", \"stream\": false}")

MESSAGE=$(echo $RESPONSE | grep '"response":' | sed -E 's/.*"response":"([^"]*).*/\1/' | tr -d '\r\n ')

[ "$MESSAGE" = "OK" ] && exit 0 || exit 1
