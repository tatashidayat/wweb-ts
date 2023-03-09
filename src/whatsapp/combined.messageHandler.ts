import {Message} from 'whatsapp-web.js';
import {KeywordDetails} from '../types/MessageKeyword';
import {UserRepository} from '../user/user.repository';
import {AdminMessageHandler} from './admin.messageHandler';
import {BaseMessageHandler, RegisteredKeyword} from './messageHandler';
import {UserMessageHandler} from './user.messageHandler';

export class CombinedMessageHandler extends BaseMessageHandler {
  private _userRepo: UserRepository;
  private _userHandler: UserMessageHandler;
  private _adminHandler: AdminMessageHandler;

  constructor() {
    super();
    this._userRepo = new UserRepository();
    this._userHandler = new UserMessageHandler();
    this._adminHandler = new AdminMessageHandler();
  }

  get keywords(): KeywordDetails[] {
    return [...this._userHandler.keywords, ...this._adminHandler.keywords];
  }

  async onMessage(
    message: Message,
    parsedKeyword: RegisteredKeyword | undefined
  ): Promise<void> {
    const from = message.from.split('@');
    const isPersonal = message.to.split('@').at(1) === 'c.us';
    if (!isPersonal) {
      // Not a personal message
      return;
    }

    const userKeyword = this._userHandler.keywords.find(
      k => k.key === parsedKeyword?.key
    );
    const adminKeyword = undefined;
    const phoneNumber: string = from.at(1)!;

    const user = await this._userRepo.getById(phoneNumber);

    const helpText = user?.isAdmin ? this.helpText : this._userHandler.helpText;

    const isEligible =
      (userKeyword && user?.isRegularUser) || (adminKeyword && user?.isAdmin);

    if (!isEligible) {
      if (user) {
        await message.reply('Perintah tidak dikenal\n\n' + helpText);
      }
      return;
    }

    if (!user.isActive) {
      await message.reply(
        'User anda belum aktif.\nSilahkan hubungi administrator.'
      );
      return;
    }

    const mHandler = adminKeyword ? this._adminHandler : this._userHandler;

    await mHandler?.onMessage(message, parsedKeyword);
  }
}
