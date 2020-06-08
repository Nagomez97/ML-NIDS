FROM node:latest

WORKDIR /usr/src

ADD ./frontend/ /usr/src

COPY ./frontend/package.json ./

# If you are building your code for production
RUN npm install