###### BUILD STAGE ######
# https://v2.vuejs.org/v2/cookbook/dockerize-vuejs-app.html

FROM node:16-alpine AS build-stage
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

###### RUN STAGE ######

FROM nginx:alpine

# sass (used in start.sh)
RUN apk add --no-cache libsass sassc && rm -f /tmp/* /etc/apk/cache/*
COPY src/scss src/scss

# nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/start.sh /start.sh

# app files (static)
COPY --from=build-stage /app/dist /usr/share/nginx/html

ARG fdp_app
ENV APP=$fdp_app

CMD ["/start.sh"]
