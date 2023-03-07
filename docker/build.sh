#! /bin/bash
set -e

SCRIPT_PATH="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

IMAGE_NAME=${IMAGE_NAME:-wwebts}
IMAGE_VERSION=${IMAGE_VERSION:-0.0.1}

FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_VERSION}"

COMMAND=$(echo 'docker build -t "'${FULL_IMAGE_NAME}'" -f "'${SCRIPT_PATH}'/Dockerfile" "'${SCRIPT_PATH}'/.."')
echo "Building docker image ${FULL_IMAGE_NAME} on ${SCRIPT_PATH}"
echo "Command: ${COMMAND}"
echo "Executing..."
eval ${COMMAND}
