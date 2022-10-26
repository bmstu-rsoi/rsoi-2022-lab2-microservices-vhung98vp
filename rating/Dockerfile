FROM node:14

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .

EXPOSE 8050

CMD npm start
RUN npm run data