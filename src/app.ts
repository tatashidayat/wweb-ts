import * as express from 'express';
import * as qrcodeTerminal from 'qrcode-terminal';
import {Client, LocalAuth, Message, WAState} from 'whatsapp-web.js';
import {
  WhatsAppService,
  WhatsAppServiceState,
} from './whatsapp/whatsApp.service';

import socketIO = require('socket.io');
import qrcode = require('qrcode');
import http = require('http');

const start = async (): Promise<void> => {
  const client = new Client({
    restartOnAuthFail: true,
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // <- this one doesn't works in Windows
        '--disable-gpu',
      ],
    },
    authStrategy: new LocalAuth(),
  });

  const waService = new WhatsAppService(client);

  waService.on(WhatsAppServiceState.UNINITIALIZED, () => {
    console.log('WA Uninitialized');
  });
  waService.on(WhatsAppServiceState.INITIALIZING, () => {
    console.log('WA Initialiazing');
  });
  waService.on(WhatsAppServiceState.INITIALIZED, () => {
    console.log('WA Initialized');
  });
  waService.on(WhatsAppServiceState.QR, (qr: string) => {
    console.log('QR Ready, Please scan!');
    qrcodeTerminal.generate(qr, {small: true});
  });
  waService.on(WhatsAppServiceState.AUTHENTICATED, () => {
    console.log('WA Authenticated, Please wait till Ready!');
  });
  waService.on(WhatsAppServiceState.READY, () => {
    console.log('WA Ready!');
  });
  waService.on(WhatsAppServiceState.AUTH_FAILED, reason => {
    console.log('WA Authentication Failed', reason);
  });
  waService.on(WhatsAppServiceState.DISCONNECTED, reason => {
    console.log('WA Disconnected', reason);
  });

  waService.on(WhatsAppServiceState.MESSAGE, async (message: Message) => {
    console.log(`Recieve Message from:${message.from} message:${message.body}`);
    // getId by phoneNumber
    // check command + userRole
    // #1 => USER,ADMIN
    // #2 => ADMIN
    await message.reply('Oke di proses dulu');
    // action
    await message.reply('Hasil ini: blabla');
  });

  startServer(waService);
  await waService.init();
};

const startServer = (waService: WhatsAppService) => {
  const port = process.env.PORT || 8000;

  const app = express();
  const server = http.createServer(app);
  const io = new socketIO.Server(server);

  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  io.on('connection', socket => {
    socket.emit('message', 'Connecting...');

    const onQR = (qr: string) => {
      qrcode.toDataURL(qr, (err, url) => {
        socket.emit('qr', url);
        socket.emit('message', 'QR Code received, scan please!');
      });
    };

    const onReady = () => {
      socket.emit('ready', 'Whatsapp is ready!');
      socket.emit('message', 'Whatsapp is ready!');
    };

    const onAuthenticated = () => {
      socket.emit('authenticated', 'Whatsapp is authenticated!');
      socket.emit('message', 'Whatsapp is authenticated!');
      console.log('AUTHENTICATED');
    };

    const onAuthFailed = (reason: string) => {
      socket.emit('message', `Auth failure due to ${reason}, restarting...`);
    };

    const onDisconnected = (reason: WAState | 'NAVIGATION') => {
      socket.emit(`message', 'Whatsapp is disconnected!, reason ${reason}`);
    };

    waService.on(WhatsAppServiceState.QR, onQR);
    waService.on(WhatsAppServiceState.READY, onReady);
    waService.on(WhatsAppServiceState.AUTHENTICATED, onAuthenticated);
    waService.on(WhatsAppServiceState.AUTH_FAILED, onAuthFailed);
    waService.on(WhatsAppServiceState.DISCONNECTED, onDisconnected);

    const firstState = waService.state;

    if (firstState === WhatsAppServiceState.UNINITIALIZED) {
      waService.init();
      return;
    }

    if (waService.qr) {
      onQR(waService.qr);
    }

    switch (firstState) {
      case WhatsAppServiceState.READY:
      case WhatsAppServiceState.MESSAGE:
        onReady();
        break;
      default:
        break;
    }
  });

  app.get('/', (req, res) => {
    res.sendFile('index.html', {
      root: __dirname,
    });
  });

  server.listen(port, () => {
    console.log('Server is started on port:', port);
  });
};

const initDb = async (): Promise<void> => {};

start();
