FROM node:20

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ARG ADMIN_ID

ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_MAPBOX_TOKEN=${NEXT_PUBLIC_MAPBOX_TOKEN}
ENV ADMIN_ID=${ADMIN_ID}

WORKDIR /app

RUN useradd --create-home nextjs && chown -R nextjs:nextjs .
USER nextjs

COPY --chown=nextjs:nextjs package.json package-lock.json ./
RUN npm install

COPY --chown=nextjs:nextjs . .
RUN npm run build

EXPOSE 8080
ENV PORT 8080

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN echo "$(git rev-parse HEAD) $(date -Iseconds)" >public/version.txt

CMD ["npm", "run", "start"]
