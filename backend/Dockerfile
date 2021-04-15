FROM node:14-alpine as build-stage
WORKDIR /usr/src/app
COPY package* ./
COPY tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build
RUN npm prune --production

FROM alpine
WORKDIR /usr/src/app
RUN apk add --update nodejs
COPY --from=build-stage /usr/src/app/dist/ /usr/src/app/dist/
COPY --from=build-stage /usr/src/app/node_modules/ /usr/src/app/node_modules/
CMD ["node", "./dist/index.js"]
