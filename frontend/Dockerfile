FROM node:18-slim


RUN mkdir -p /usr/transcendence

WORKDIR /usr/transcendence

# ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod 777 docker.sh

EXPOSE 3000

CMD ["./docker.sh"]

# docker build -t front .
# docker run -it -p 3000:3000 front /bin/sh