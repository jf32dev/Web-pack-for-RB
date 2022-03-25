#!/usr/bin/env sh

set -xe

envsubst < /scripts/default.conf.tmpl > /etc/nginx/conf.d/default.conf
envsubst < /scripts/config.js.tmpl > /var/www/config.js

nginx -g 'daemon off;'
