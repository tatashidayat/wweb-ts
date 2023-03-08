import {Message} from 'whatsapp-web.js';

export interface MessageHandler {
  onMessage(message: Message): Promise<void>;
}
