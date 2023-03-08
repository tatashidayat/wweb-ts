import {Message} from 'whatsapp-web.js';
import {MessageHandler, RegisteredKeyword} from './messageHandler';
import {KeywordDetails} from './../types/MessageKeyword';

export class UserMessageHandler implements MessageHandler {
  private static _keywords: KeywordDetails[] = [
    {key: '1', description: 'Start Apps', arguments: []},
    {key: '2', description: 'Stop Apps', arguments: []},
    {key: '3', description: 'Status Apps', arguments: []},
    {key: '4', description: 'Check Total User Login Kopastra', arguments: []},
    {key: '5', description: 'Check PO Create Today', arguments: []},
    {key: '6', description: 'Check SO Create Today', arguments: []},
    {key: '7', description: 'Check Inventory Create Today', arguments: []},
    {key: '8', description: 'Check AP Create Today', arguments: []},
    {key: '9', description: 'Check AR Create Today', arguments: []},
    {key: '10', description: 'Check No PO', arguments: ['PO NUMBER']},
    {key: '11', description: 'Check No SO', arguments: ['SO NUMBER']},
    {key: '12', description: 'Check No AP', arguments: ['AP NUMBER']},
    {key: '13', description: 'Check No AR', arguments: ['AR NUMBER']},
    {
      key: '14',
      description: 'Check No Inventory',
      arguments: ['Inventory NUMBER'],
    },
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
    if (parsedKeyword.key === '1') {
      message.reply('Start App Success');
    } else if (parsedKeyword.key === '2') {
      message.reply('Stop App Success');
    } else if (parsedKeyword.key === '3') {
      message.reply('Status Apps');
    } else if (parsedKeyword.key === '4') {
      message.reply('Total User Login');
    } else if (parsedKeyword.key === '5') {
      message.reply('PO VDM-DPA');
    } else if (parsedKeyword.key === '6') {
      message.reply('SO VDM-DPA');
    } else if (parsedKeyword.key === '7') {
      message.reply('Inventory VDM-DPA');
    } else if (parsedKeyword.key === '8') {
      message.reply('AP VDM-DPA');
    } else if (parsedKeyword.key === '9') {
      message.reply('AR VDM-DPA');
    } else if (parsedKeyword.key === '10') {
      message.reply('PO No');
    } else if (parsedKeyword.key === '11') {
      message.reply('SO No');
    } else if (parsedKeyword.key === '12') {
      message.reply('AR No');
    } else if (parsedKeyword.key === '13') {
      message.reply('AP No');
    } else if (parsedKeyword.key === '14') {
      message.reply('Inventory No');
    }
  }
}
