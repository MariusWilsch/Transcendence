#!/bin/sh

npm install
npx prisma migrate dev --name init
npm run build
npm run start:prod