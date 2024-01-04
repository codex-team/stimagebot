FROM node:15

WORKDIR /app

COPY . .

RUN yarn

ENTRYPOINT ["node", "index.js"]