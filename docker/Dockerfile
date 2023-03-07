FROM node:18.14.2

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt update \
    && apt install -y jq gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

WORKDIR /tmp/app
COPY . .
RUN  GTS_MODULE_PATH="./node_modules/gts" \
    && GTS_ROOT_PATH="$(npm root -g)/gts" \
    && TS_VERSION=$(jq -r '.packages."node_modules/typescript".version' package-lock.json) \
    && GTS_VERSION=$(jq -r '.packages."node_modules/gts".version' package-lock.json) \
    && npm install -g typescript@${VERSION} gts@${GTS_VERSION} \
    && sed -i 's#'${GTS_MODULE_PATH}'#'${GTS_ROOT_PATH}'#' .eslintrc.json \
    && sed -i 's#'${GTS_MODULE_PATH}'#'${GTS_ROOT_PATH}'#' tsconfig.json \
    && npm ci --omit=dev

WORKDIR /app
RUN mv /tmp/app/node_modules . \
    && mv /tmp/app/build/ app/ \
    && rm -rf /tmp/*

ENTRYPOINT [ "node", "/app/app/app.js" ]