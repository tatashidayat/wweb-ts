import {Message} from 'whatsapp-web.js';
import {MessageHandler} from './MessageHandler';

class RegularUserMessageHandler implements MessageHandler {
  onMessage(_message: Message): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
