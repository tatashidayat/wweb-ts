FROM node:18.14.2

WORKDIR /tmp/app
COPY . .
RUN npm ci --omit=dev

WORKDIR /app
RUN cp -R /tmp/app/build . \
    && rm -rf /tmp

ENTRYPOINT [ "node", "/app/app.js" ]