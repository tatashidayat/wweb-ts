import * as express from 'express';
import * as qrcodeTerminal from 'qrcode-terminal';
import 'reflect-metadata';
import {Client, LocalAuth, Message, WAState} from 'whatsapp-web.js';
import {
  WhatsAppService,
  WhatsAppServiceState,
} from './whatsapp/whatsApp.service';

import socketIO = require('socket.io');
import qrcode = require('qrcode');
import http = require('http');

import {AppDataSource} from './common/db/db';
import {UserMessageHandler} from './whatsapp/user.messageHandler';
import {CombinedMessageHandler} from './whatsapp/combined.messageHandler';

const start = async (): Promise<void> => {
  const dbInit = initDb();

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
  const messageHandler = new CombinedMessageHandler();
  waService.messageHandler = messageHandler;

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

  waService.on(WhatsAppServiceState.MESSAGE, (message: Message) => {
    console.log(`Recieve Message from:${message.from} message:${message.body}`);
  });

  startServer(waService);
  await Promise.all([dbInit, waService.init()]);
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

    socket.on('disconnect', (reason: socketIO.DisconnectReason) => {
      console.log(`socket: ${socket.id} is disconnect due to`, reason);
      waService.removeListener(WhatsAppServiceState.QR, onQR);
      waService.removeListener(WhatsAppServiceState.READY, onReady);
      waService.removeListener(
        WhatsAppServiceState.AUTHENTICATED,
        onAuthenticated
      );
      waService.removeListener(WhatsAppServiceState.AUTH_FAILED, onAuthFailed);
      waService.removeListener(
        WhatsAppServiceState.DISCONNECTED,
        onDisconnected
      );
    });

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

const initDb = async (): Promise<void> => {
  await AppDataSource.initialize();
  console.log('DB has been initiliazed');
};

start();
