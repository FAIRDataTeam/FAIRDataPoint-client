FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/start.sh /start.sh

COPY dist /usr/share/nginx/html

CMD ["/start.sh"]
