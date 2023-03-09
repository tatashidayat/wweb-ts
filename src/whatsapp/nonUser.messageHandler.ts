import {Message} from 'whatsapp-web.js';
import {UserRole, UserStatus} from '../common/constant/role';
import {KeywordDetails} from '../types/MessageKeyword';
import {User} from '../user/user.model';
import {UserRepository} from '../user/user.repository';
import {BaseMessageHandler, RegisteredKeyword} from './messageHandler';

enum NonUserKeyword {
  REGISTER = 'register',
  HELP = 'help',
}

export class NonUserMessageHandler extends BaseMessageHandler {
  private _userRepo: UserRepository;

  constructor() {
    super();
    this._userRepo = new UserRepository();
  }
  private static _keywords: KeywordDetails[] = [
    {
      key: NonUserKeyword.REGISTER,
      description: 'Register curent phone number',
      arguments: ['name'],
    },

    {
      key: NonUserKeyword.HELP,
      description: 'Show commands',
      arguments: [],
    },
  ];

  get keywords(): KeywordDetails[] {
    return NonUserMessageHandler._keywords;
  }

  async onMessage(
    message: Message,
    parsedKeyword: RegisteredKeyword | undefined
  ): Promise<void> {
    if (!parsedKeyword) {
      return;
    }

    switch (parsedKeyword.key) {
      case NonUserKeyword.REGISTER:
        await this.onUsers(parsedKeyword, message);
        break;

      case NonUserKeyword.HELP:
      default:
        await message.reply(this.helpText);
        break;
    }
  }

  private async onUsers(parsedKeyword: RegisteredKeyword, message: Message) {
    const name: string = parsedKeyword.parsed.arguments.at(0)!;
    const phoneNumber: string = message.from.split('@').at(0)!;

    const existingUser = await this._userRepo.getById(phoneNumber);

    if (existingUser) {
      await message.reply(
        "You've registered, please contact your administrator to activate"
      );
      return;
    }

    const newUser = new User();
    newUser.id = phoneNumber;
    newUser.name = name;
    newUser.status = UserStatus.REGISTERED;
    newUser.role = UserRole.USER;
    await this._userRepo.create(newUser);

    await message.reply(
      "Congrats, you've registered!, now contact your administrator to activate"
    );
  }
}
