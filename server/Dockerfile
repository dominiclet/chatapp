FROM node:latest

WORKDIR /app
COPY . .
RUN npm install

CMD ["PORT=$PORT", "npm", "start"]