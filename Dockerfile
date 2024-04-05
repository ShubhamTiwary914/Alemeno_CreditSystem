FROM node:18

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]