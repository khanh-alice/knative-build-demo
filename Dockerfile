# build
FROM node:alpine AS build

WORKDIR /app

COPY package.json .
RUN yarn install

COPY . .
RUN yarn build

# web server
FROM httpd:alpine

COPY --from=build /app/build /usr/local/apache2/htdocs
