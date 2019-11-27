#!/bin/sh

# create config
config=/usr/share/nginx/html/config.js
echo -n "window.config={publicPath:'"$PUBLIC_PATH"'};" > ${config}

# set correct FDP Host for proxy pass
sed -i "s#\$FDP_HOST#"$FDP_HOST"#g" /etc/nginx/conf.d/default.conf
sed -i "s#\$PUBLIC_PATH#"$PUBLIC_PATH"#g" /etc/nginx/conf.d/default.conf

# set correct Public URL
sed -i "s#/app/#"$PUBLIC_PATH"/#g" /usr/share/nginx/html/js/*.js
sed -i "s#/app/#"$PUBLIC_PATH"/#g" /usr/share/nginx/html/index.html

# regenerate styles if there are any customizations
if [[ $(find /src/scss/custom -name "*.scss" | xargs cat | wc -c) -gt 0 ]]; then
  find /usr/share/nginx/html/css -name "*.css" -exec sassc -I /src -t compressed /src/scss/main.scss {} \;
fi

nginx -g 'daemon off;'
