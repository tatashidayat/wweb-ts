FROM node:18.14.2

RUN apt update \
    && apt install -y jq

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
RUN cp -R /tmp/app/build . \
    && rm -rf /tmp

ENTRYPOINT [ "node", "/app/app.js" ]