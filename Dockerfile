FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV DISABLE_ESLINT_PLUGIN=true
RUN npm run build

FROM node:20 AS runner

WORKDIR /app

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./


EXPOSE 3000

CMD ["npm", "start"]