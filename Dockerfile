FROM nginx:alpine

RUN apk add --no-cache libsass sassc && rm -f /tmp/* /etc/apk/cache/*

COPY node_modules/bootstrap src/~bootstrap
COPY node_modules/bootstrap-vue src/~bootstrap-vue
COPY node_modules/vue-select src/~vue-select

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/start.sh /start.sh

COPY src src
COPY dist /usr/share/nginx/html

CMD ["/start.sh"]
