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
FROM httpd:alpine

COPY --from=build /app/build /usr/local/apache2/htdocs
