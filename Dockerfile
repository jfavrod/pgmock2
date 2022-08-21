FROM node:12-alpine
RUN mkdir -p /app/src /app/test
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY tsconfig.json /app/tsconfig.json
RUN npm install
CMD [ "npm", "run", "test" ]
