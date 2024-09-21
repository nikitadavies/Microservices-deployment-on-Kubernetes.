# Dockerfile for Container 2

FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Mount the host machine directory '.' to a docker volume
VOLUME /app/data

EXPOSE 6001

CMD ["node", "app.js"]
