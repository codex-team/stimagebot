FROM node:15

RUN apt-get update && apt-get install -y libglu1
WORKDIR /app
COPY . .
RUN yarn
ENTRYPOINT ["node", "index.js"]