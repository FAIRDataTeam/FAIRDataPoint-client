#!/bin/sh

# normalize public path
PUBLIC_PATH="${PUBLIC_PATH%/}"
if [ -z "$PUBLIC_PATH" ]; then
  PUBLIC_PATH="/"
fi
REWRITE_PATH="$PUBLIC_PATH"
if [ "$REWRITE_PATH" = "/" ]; then
  REWRITE_PATH=""
fi

# create config
config=/usr/share/nginx/html/config.js

CONFIG_JS="window.config={publicPath:'$PUBLIC_PATH'"

if [ -n "$API_URL" ]; then
  CONFIG_JS="$CONFIG_JS,apiURL:'$API_URL'"
else
  # Default browser requests to same-origin; nginx will proxy to FDP_HOST.
  CONFIG_JS="$CONFIG_JS,apiURL:'$PUBLIC_PATH'"
fi

CONFIG_JS="$CONFIG_JS};"
echo -n "$CONFIG_JS" > ${config}

# normalize FDP_HOST for nginx proxy_pass (expects host[:port], no scheme/path)
if [ -z "$FDP_HOST" ]; then
  echo "FDP_HOST is required and must be set as host:port (for example: fdp:8080)." >&2
  exit 1
fi
FDP_HOST="$(printf '%s' "$FDP_HOST" | sed 's#^http://##; s#^https://##; s#/.*$##')"

# set correct FDP Host for proxy pass
sed -i "s#\$FDP_HOST#"$FDP_HOST"#g" /etc/nginx/conf.d/default.conf

# set correct Public Path
if [ -d /usr/share/nginx/html/assets ]; then
  find /usr/share/nginx/html/assets -name "*.js" -exec sed -i "s#/app/#${REWRITE_PATH}/#g" {} \;
  find /usr/share/nginx/html/assets -name "*.css" -exec sed -i "s#/app/#${REWRITE_PATH}/#g" {} \;
fi
sed -i "s#/app/#${REWRITE_PATH}/#g" /usr/share/nginx/html/index.html

# update default logo URL with the Public Path
sed -i "s#/assets/fair-logo.png#"$PUBLIC_PATH"/assets/fair-logo.png#" /src/scss/_variables.scss

# regenerate app styles only when custom overrides have content or explicitly requested
if [ -n "$REBUILD_STYLES" ] || [ -n "$(find /src/scss/custom -type f -name '*.scss' -size +0c -print -quit)" ]; then
  if [ -d /usr/share/nginx/html/assets ]; then
    find /usr/share/nginx/html/assets \( -name "index-*.css" -o -name "style-*.css" \) \
      -exec sassc -I /src -t compressed /src/scss/main.scss {} \;
  fi
fi

nginx -g 'daemon off;'
