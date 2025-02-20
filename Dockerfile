FROM node:23-alpine

RUN mkdir -p /app

WORKDIR /app




COPY . /app/
RUN npm install
RUN npm run build


EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000


CMD ["node", ".output/server/index.mjs"]