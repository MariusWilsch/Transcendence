FROM node:21-alpine

RUN mkdir -p /usr/transcendence

WORKDIR /usr/transcendence

# ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod 777 docker.sh

EXPOSE 3001
EXPOSE 3002

CMD ["./docker.sh"]