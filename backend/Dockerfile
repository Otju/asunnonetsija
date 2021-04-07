FROM node:14

WORKDIR /usr/src/app

COPY package* ./
RUN npm install
COPY src ./src

CMD npm start