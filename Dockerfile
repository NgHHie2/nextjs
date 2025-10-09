FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy những phần cần thiết để chạy
COPY .next ./.next
COPY public ./public
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000
CMD ["pnpm", "start"]
