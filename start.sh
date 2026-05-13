#!/bin/bash
cd /opt/propaily
set -a
source .env
set +a
export PORT=3001
export HOSTNAME=0.0.0.0
exec node .next/standalone/server.js
