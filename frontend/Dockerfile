FROM node:21-alpine


RUN mkdir -p /usr/transcendence

WORKDIR /usr/transcendence

COPY package*.json ./


RUN chmod 777 docker.sh

EXPOSE 3000

CMD ["./docker.sh"]