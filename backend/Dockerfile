FROM node:22-slim
# Instalar herramientas para módulos nativos de node
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
# Forzar la recompilación de better-sqlite3 para linux/amd64
RUN npm install --legacy-peer-deps && npm rebuild better-sqlite3

COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
