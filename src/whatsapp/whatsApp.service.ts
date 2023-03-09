import {EventEmitter} from 'events';
import {Client, ClientSession, Message, WAState} from 'whatsapp-web.js';
import {MessageHandler, RegisteredKeyword} from './messageHandler';
import {ParsedKeyword} from './../types/MessageKeyword';

export enum WhatsAppServiceState {
  UNINITIALIZED = 'UNINITIALIZED',
  INITIALIZING = 'INITIALIZING',
  INITIALIZED = 'INITIALIZED',
  QR = 'QR',
  AUTHENTICATED = 'AUTHENTICATED',
  AUTH_FAILED = 'AUTH_FAILED',
  READY = 'READY',
  MESSAGE = 'MESSAGE',
  DISCONNECTED = 'DISCONNECTED',
}

export class WhatsAppService extends EventEmitter {
  private _client: Client;
  private _state: WhatsAppServiceState;
  private _lastQR?: string;

  constructor(client: Client) {
    super();
    this._client = client;
    this._state = WhatsAppServiceState.UNINITIALIZED;

    this._client.on('qr', (qr: string) => {
      this._state = WhatsAppServiceState.QR;
      this.emit(this._state, qr);
      this._lastQR = qr;
    });

    this._client.on('ready', () => {
      this._state = WhatsAppServiceState.READY;
      this.emit(this._state);
      this._lastQR = undefined;
    });

    this._client.on('authenticated', (session?: ClientSession) => {
      this._state = WhatsAppServiceState.AUTHENTICATED;
      this.emit(this._state, session);
      this._lastQR = undefined;
    });

    this._client.on('auth_failure', (reason: string) => {
      this._state = WhatsAppServiceState.AUTH_FAILED;
      this.emit(this._state, reason);
      this._lastQR = undefined;
    });

    this._client.on('disconnected', (reason: WAState | 'NAVIGATION') => {
      this._state = WhatsAppServiceState.DISCONNECTED;
      this.emit(this._state, reason);
      this._client.destroy();
      this._client.initialize();
    });

    this._client.on('message', (message: Message) => {
      this.emit(WhatsAppServiceState.MESSAGE, message);
    });
  }

  get state(): WhatsAppServiceState {
    return this._state;
  }

  get qr(): string | undefined {
    return this._lastQR;
  }

  set messageHandler(handler: MessageHandler) {
    this._client.on('message', (message: Message) => {
      const k = this.getKeywordFromMessage(message, handler);
      handler.onMessage(message, k);
    });
  }

  init = async (): Promise<void> => {
    if (this._state === WhatsAppServiceState.READY) {
      return;
    }
    this._state = WhatsAppServiceState.INITIALIZING;
    await this._client.initialize();
    this._state = WhatsAppServiceState.INITIALIZED;
  };

  getKeywordFromMessage(
    message: Message,
    handler: MessageHandler
  ): RegisteredKeyword | undefined {
    const messageTexts = message.body.split('#');
    const parsedKeyword: ParsedKeyword = {
      key: messageTexts.at(0)!,
      arguments: (messageTexts.length > 1 && messageTexts.slice(1)) || [],
    };
    const handlerKeyword = handler.keywords.find(
      k => k.key === parsedKeyword.key
    );

    if (handlerKeyword) {
      return {
        key: parsedKeyword.key,
        details: handlerKeyword,
        parsed: parsedKeyword,
      };
    }
    return undefined;
  }
}
