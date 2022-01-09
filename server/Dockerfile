FROM node:latest

WORKDIR /app
COPY . .
ENV PORT=$PORT
RUN npm install

CMD gunicorn --bind 0.0.0.0:$PORT wsgi
CMD ["npm", "start"]