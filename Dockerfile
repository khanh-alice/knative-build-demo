# build
FROM node:alpine AS build

WORKDIR /app

COPY package.json .
RUN yarn install

COPY . .
RUN yarn build

# web server
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# work around for knative/serving#3890
CMD ["mkdir", "-p", "/var/log/nginx", "&&", "nginx", "-g", "daemon off;"]