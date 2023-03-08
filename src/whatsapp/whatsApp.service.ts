import {EventEmitter} from 'events';
import {Client, ClientSession, WAState} from 'whatsapp-web.js';

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
  }

  get state(): WhatsAppServiceState {
    return this._state;
  }

  get qr(): string | undefined {
    return this._lastQR;
  }

  init = async (): Promise<void> => {
    if (this._state === WhatsAppServiceState.READY) {
      return;
    }
    this._state = WhatsAppServiceState.INITIALIZING;
    await this._client.initialize();
    this._state = WhatsAppServiceState.INITIALIZED;
  };

  // on(event: string | symbol, listener: (...args: any[]) => void): this;
}
