FROM nginx:alpine
COPY build /usr/share/nginx/html
COPY public_assets  /usr/share/nginx/html/static
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]