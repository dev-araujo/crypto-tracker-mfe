FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 4200 4201 4202 4203

CMD ["npm", "run", "start:docker"]
