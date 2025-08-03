#!/bin/bash

if [ $NODE_ENV = production ]; then
    ENV_FILE=.env;
elif [ $NODE_ENV = local ]; then
    ENV_FILE=.env.local;
else
    ENV_FILE=.env.dev;
fi && node --env-file $ENV_FILE ./dist/index.js
