import {Message} from 'whatsapp-web.js';
import {MessageHandler, RegisteredKeyword} from './messageHandler';

export class UserMessageHandler implements MessageHandler {
  private static _keywords: KeywordDetails[] = [
    {key: '1', description: 'Check something', arguments: []},
  ];

  get keywords(): KeywordDetails[] {
    return UserMessageHandler._keywords;
  }

  async onMessage(
    message: Message,
    parsedKeyword: RegisteredKeyword | undefined
  ): Promise<void> {
    const messageText = message.body;
    if (!parsedKeyword) {
      await message.reply('Perintah tidak dikenal');
      return;
    }
    await message.reply(`Perintah: ${messageText} di proses`);
    await message.reply(`Perintah: ${messageText} selesai`);
  }
}
