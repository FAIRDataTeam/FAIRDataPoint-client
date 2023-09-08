#!/bin/sh

# create config
config=/usr/share/nginx/html/config.js

echo -n "window.config={publicPath:'"$PUBLIC_PATH"'};" > ${config}

# set correct FDP Host for proxy pass
sed -i "s#\$FDP_HOST#"$FDP_HOST"#g" /etc/nginx/conf.d/default.conf

# set correct Public Path
sed -i "s#/app/#"$PUBLIC_PATH"/#g" /usr/share/nginx/html/js/*.js
sed -i "s#/app/#"$PUBLIC_PATH"/#g" /usr/share/nginx/html/index.html

# update default logo URL with the Public Path
sed -i "s#/assets/fair-logo.png#"$PUBLIC_PATH"/assets/fair-logo.png#" /src/scss/_variables.scss

# regenerate styles if there are any customizations or Public Path is set
if [[ ! -z "$PUBLIC_PATH" || $(find /src/scss/custom -name "*.scss" | xargs cat | wc -c) -gt 0 ]]; then
  find /usr/share/nginx/html/css -name "*.css" -exec sassc -I /src -t compressed /src/scss/main.scss {} \;
fi

nginx -g 'daemon off;'
