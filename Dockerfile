# build
FROM node:alpine AS build

ARG REACT_APP_DRINK
ENV REACT_APP_DRINK $REACT_APP_DRINK

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY ./public ./public
COPY ./src ./src
COPY .babelrc ./
RUN yarn build

# web server
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# work around for https://github.com/knative/serving/issues/3809
CMD ["sh", "-c", "mkdir -p /var/log/nginx \
  && ln -sf /dev/stdout /var/log/nginx/access.log \
  && ln -sf /dev/stderr /var/log/nginx/error.log \
  && nginx -g \"daemon off;\""]
