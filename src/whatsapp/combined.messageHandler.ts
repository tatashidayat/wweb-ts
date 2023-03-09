import {Message} from 'whatsapp-web.js';
import {KeywordDetails} from '../types/MessageKeyword';
import {UserRepository} from '../user/user.repository';
import {AdminMessageHandler} from './admin.messageHandler';
import {
  BaseMessageHandler,
  MessageHandler,
  RegisteredKeyword,
} from './messageHandler';
import {NonUserMessageHandler} from './nonUser.messageHandler';
import {UserMessageHandler} from './user.messageHandler';

export class CombinedMessageHandler extends BaseMessageHandler {
  private _userRepo: UserRepository;
  private _userHandler: UserMessageHandler;
  private _adminHandler: AdminMessageHandler;
  private _nonUserHandler: NonUserMessageHandler;

  constructor() {
    super();
    this._userRepo = new UserRepository();
    this._userHandler = new UserMessageHandler();
    this._adminHandler = new AdminMessageHandler();
    this._nonUserHandler = new NonUserMessageHandler();
  }

  get keywords(): KeywordDetails[] {
    return [
      ...this._userHandler.keywords,
      ...this._adminHandler.keywords,
      ...this._nonUserHandler.keywords,
    ];
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
    const adminKeyword = this._adminHandler.keywords.find(
      k => k.key === parsedKeyword?.key
    );
    const nonUserKeyword = this._nonUserHandler.keywords.find(
      k => k.key === parsedKeyword?.key
    );
    const phoneNumber: string = from.at(0)!;

    const user = await this._userRepo.getById(phoneNumber);

    let helpText: string = this._nonUserHandler.helpText;

    if (user?.isAdmin) {
      helpText = this.helpText;
    } else if (user) {
      helpText = this._userHandler.helpText;
    }

    const isEligible =
      (userKeyword && user?.isRegularUser) ||
      (adminKeyword && user?.isAdmin) ||
      (!user && nonUserKeyword);

    if (!isEligible) {
      if (user) {
        await message.reply('Perintah tidak dikenal\n\n' + helpText);
      }
      return;
    }

    if (user && !user.isActive) {
      await message.reply(
        'User anda belum aktif.\nSilahkan hubungi administrator.'
      );
      return;
    }

    if (
      parsedKeyword &&
      parsedKeyword.details.arguments.length !==
        parsedKeyword.parsed.arguments.length
    ) {
      await message.reply(
        `Perintah ${parsedKeyword.key} kurang lengkap.\n\n` + helpText
      );
      return;
    }
    let mHandler: MessageHandler | undefined;

    if (nonUserKeyword) {
      mHandler = this._nonUserHandler;
    } else if (userKeyword) {
      mHandler = this._userHandler;
    } else if (adminKeyword) {
      mHandler = this._adminHandler;
    }

    await mHandler?.onMessage(message, parsedKeyword);
  }
}
