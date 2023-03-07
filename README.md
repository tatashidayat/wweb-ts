# WWEB-TS

A WhatsApp client uses whatsapp-web.js and TypeScript

### Features

| Name                    |       Status       |
| :---------------------- | :----------------: |
| Single Session          | :heavy_check_mark: |
| Container Ready         | :heavy_check_mark: |
| Message Command Handler |         -          |
| Access Control          |         -          |

### How to run

1. Make sure you're using node 18.14.2
2. Run `npm ci`
3. Set typescript version (if you're using vscode) on `.vscode/settings.json`

```json
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

4. Set launch.json (if you're using vscode) on `.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "command": "npm run start:dev",
      "name": "Start",
      "request": "launch",
      "type": "node-terminal"
    }
  ]
}
```

5. Run from vscode, or execute this command on terminal `npm run start:dev`

### How to Build the Image

1. Run `IMAGE_NAME="wwebts" IMAGE_VERSION="0.0.1" docker/build.sh`

### How to Run the image

1. Build the image first
2. Run `docker run --rm --name wwebts -p 8000:8000 wwebts:0.0.1`
3. If you want to keep the session, you can create volume first `docker volume create wweb_auth` and Run `docker run --rm --name wwebts -p 8000:8000 -v wwebts:/app/.wwebjs_auth wwebts:0.0.1`
