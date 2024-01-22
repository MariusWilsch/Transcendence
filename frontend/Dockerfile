FROM node:20-alpine


RUN mkdir -p /usr/transcendence

WORKDIR /usr/transcendence

# ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY *.json ./

RUN npm install

COPY . .

RUN chmod 777 docker.sh

EXPOSE 3000

CMD ["./docker.sh"]