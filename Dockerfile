FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# CMD ["npm", "start"]
CMD ["sh", "-c", "sleep 2 && npm start"]

