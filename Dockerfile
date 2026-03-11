###### BUILD STAGE ######
# https://v2.vuejs.org/v2/cookbook/dockerize-vuejs-app.html

FROM node:20-alpine AS build-stage
WORKDIR /app

# install-layer
COPY package*.json ./
RUN npm install

# build-layer
COPY . .
RUN npm run build

# update version info
RUN apk add git
RUN scripts/build_info.sh

###### DISTRIBUTION STAGE ######

FROM nginx:alpine AS dist-stage

# sass (used in start.sh)
RUN apk add --no-cache libsass sassc && rm -f /tmp/* /etc/apk/cache/*
COPY --from=build-stage /app/src/scss src/scss
COPY --from=build-stage /app/src/components src/components
COPY --from=build-stage /app/src/views src/views
COPY --from=build-stage /app/node_modules/bootstrap/scss src/~bootstrap/scss
COPY --from=build-stage /app/node_modules/bootstrap-vue-next/src src/~bootstrap-vue-next/src
COPY --from=build-stage /app/node_modules/prismjs/themes src/~prismjs/themes

# nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/start.sh /start.sh

# app files (static)
COPY --from=build-stage /app/dist /usr/share/nginx/html

CMD ["/start.sh"]
