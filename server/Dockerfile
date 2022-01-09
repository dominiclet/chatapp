FROM node:latest

WORKDIR /app
COPY . .
RUN npm install

CMD gunicorn --bind :$PORT wsgi
CMD ["npm", "start"]