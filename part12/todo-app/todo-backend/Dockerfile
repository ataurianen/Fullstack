FROM node:20

WORKDIR /usr/src/app

COPY --chown=user:node . .

RUN npm ci --omit=dev

ENV PORT=3000

CMD ["npm", "start"]