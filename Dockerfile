FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && rm -rf node_modules && npm install

COPY . .

EXPOSE 3000

RUN npm run build

CMD [ "npm", "start" ]


