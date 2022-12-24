FROM node:alpine3.16
RUN apk update && apk upgrade
RUN apk add sqlite
WORKDIR /app
COPY . .
RUN npm install
CMD npm run start:dev