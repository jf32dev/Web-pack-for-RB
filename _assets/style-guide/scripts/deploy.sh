#!/bin/bash

export PATH="/usr/local/bin/:${PATH}"

export userid=${UID} && export groupid=${GID} && docker-compose -f docker-compose-build.yaml pull && docker-compose -f docker-compose-build.yaml up --force-recreate --abort-on-container-exit

cd ${WORKSPACE}/build
aws --profile syd-dev s3 sync --acl public-read --delete . s3://styleguide.bigtincan.org/