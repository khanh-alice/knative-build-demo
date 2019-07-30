# build
FROM node:alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY ./public ./public
COPY ./src ./src
COPY .babelrc ./
RUN yarn build

# web server
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8080
