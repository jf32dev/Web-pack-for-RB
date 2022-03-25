#!/bin/bash

yarn install

node scripts/gc.js --expose-gc

npm run test --loglevel verbose 