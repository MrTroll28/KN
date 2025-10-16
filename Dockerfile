FROM node:20-bullseye
WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y openssl netcat-traditional
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
EXPOSE 4000
CMD ["node","src/index.js"]
