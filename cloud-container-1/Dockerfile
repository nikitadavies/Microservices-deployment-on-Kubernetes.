# Dockerfile for Container 1

FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6000

CMD ["node", "app.js"]