#!/bin/bash

if [ $NODE_ENV = production ]; then
    ENV_FILE=.env;
elif [ $NODE_ENV = development ]; then
    ENV_FILE=.env.dev;
else
    ENV_FILE=.env.local;
fi && node --env-file $ENV_FILE ./dist/index.js
