#!/bin/bash

tsc &&
cp -r src/database/queries dist/database &&
cp -r src/ollama/prompts dist/ollama &&
cp -r scripts dist
