FROM node:latest

WORKDIR /app
COPY . .
ENV PORT=$PORT
RUN npm install

CMD ["npm", "start"]