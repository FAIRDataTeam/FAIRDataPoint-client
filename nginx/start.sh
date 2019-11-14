#!/bin/sh

# create config
config=/usr/share/nginx/html/config.js
echo -n "window.config={apiUrl:'"$API_URL"'};" > ${config}

# set correct FDP Host for proxy pass
sed -i "s/FDP_HOST/"$FDP_HOST"/g" /etc/nginx/conf.d/default.conf


# regenerate styles if there are any customizations
if [[ $(find /src/scss/custom -name "*.scss" | xargs cat | wc -l) -gt 0 ]]; then
  echo "Generating new styles"
  find /usr/share/nginx/html/css -name "*.css" -exec sassc -I /src -t compressed /src/scss/main.scss {} \;
else
  echo "No need to generate styles"
fi

nginx -g 'daemon off;'
