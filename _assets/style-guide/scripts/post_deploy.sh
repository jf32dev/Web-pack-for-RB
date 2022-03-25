#!/bin/bash

export PATH="/usr/local/bin/:${PATH}"

docker-compose -f docker-compose-build.yaml down -v --rmi local || true

${WORKSPACE}/scripts/notify.py ${1} jenkins
