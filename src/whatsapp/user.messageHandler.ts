import {Message} from 'whatsapp-web.js';
import {KeywordDetails} from './../types/MessageKeyword';
import {BaseMessageHandler, RegisteredKeyword} from './messageHandler';

export class UserMessageHandler extends BaseMessageHandler {
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
    {
      key: 'help',
      description: 'Show commands',
      arguments: [],
    },
  ];

  get keywords(): KeywordDetails[] {
    return UserMessageHandler._keywords;
  }

  async onMessage(
    message: Message,
    parsedKeyword: RegisteredKeyword | undefined
  ): Promise<void> {
    if (!parsedKeyword) {
      return;
    }

    switch (parsedKeyword.key) {
      case '1':
        await message.reply('Start App Success');
        break;
      case '2':
        await message.reply('Stop App Success');
        break;
      case '3':
        await message.reply('Status Apps');
        break;
      case '4':
        await message.reply('Total User Login');
        break;
      case '5':
        await message.reply('PO VDM-DPA');
        break;
      case '6':
        await message.reply('SO VDM-DPA');
        break;
      case '7':
        await message.reply('Inventory VDM-DPA');
        break;
      case '8':
        await message.reply('AP VDM-DPA');
        break;
      case '9':
        await message.reply('AR VDM-DPA');
        break;
      case '10':
        await message.reply('PO No');
        break;
      case '11':
        await message.reply('SO No');
        break;
      case '12':
        await message.reply('AR No');
        break;
      case '13':
        await message.reply('AP No');
        break;
      case '14':
        await message.reply('Inventory No');
        break;
      case 'help':
      default:
        await message.reply(this.helpText);
        break;
    }
  }
}
