# 外部イメージをbaseステージとして扱う
FROM node:20-alpine AS base

# 必要なパッケージを先に追加、pyも？
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app

# package.jsonをコピーして、ロックファイル毎にインストール
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# # baseステージをもとにbuilderステージを開始
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build
# RUN npm run build

# # baseステージをもとにrunnerステージを開始
# FROM base as production
FROM base AS runner
WORKDIR /app

# テレメトリーを無効にする
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
# ユーザーを追加
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# public と .next/static は nextjs の standalone を使う場合に含まれないため、コピーする必要がある
# https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files
# builderから必要なファイルだけコピーする
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# ポートを指定
EXPOSE 3000
ENV PORT 3000
# `next start` の代わりに `node server.js` を使用
CMD ["node", "server.js"]

# FROM base as dev
# ENV NODE_ENV=development
# RUN npm install
# COPY . .
# CMD npm run dev
