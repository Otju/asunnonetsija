FROM node:14

WORKDIR /usr/src/app

COPY package* ./
COPY tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build
CMD ["node", "./dist/index.js"]