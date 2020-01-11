FROM node:10.15-alpine
RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
CMD ["npm", "run", "test"]