FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy và cài dependencies trước (để cache)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --prefer-offline

COPY .next ./.next
COPY public ./public

EXPOSE 3000
CMD ["pnpm", "start"]
