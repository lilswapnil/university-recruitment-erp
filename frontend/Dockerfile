FROM node:18-alpine

WORKDIR /app

# Copy package.json
COPY package.json ./

# *** FIX: Removed 'COPY package-lock.json ./' ***

RUN npm install

# Copy the rest of the app's source code
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
