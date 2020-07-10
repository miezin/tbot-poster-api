FROM node:12-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY ./ /app

RUN yarn build

EXPOSE 8080
CMD [ "node", "dist/bot.js" ]
