# Dockerfile for React client

# Build react client
FROM node:16-alpine

# Working directory be app
WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV REACT_APP_API_ENDPOINT=http://localhost:3001/api/

CMD [ "npm","start"]