#!/bin/sh

npm install
npm run build
npx prisma migrate dev --name init
npm run start