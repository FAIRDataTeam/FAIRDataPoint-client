#!/bin/sh

# create config
config=/usr/share/nginx/html/config.js
echo -n "window.config={apiUrl:'"$API_URL"'};" > ${config}

# set correct FDP Host for proxy pass
sed -i "s/FDP_HOST/"$FDP_HOST"/g" /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;'
