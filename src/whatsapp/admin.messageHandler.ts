import {Message} from 'whatsapp-web.js';
import {UserRole} from '../common/constant/role';
import {KeywordDetails} from '../types/MessageKeyword';
import {UserRepository} from '../user/user.repository';
import {BaseMessageHandler, RegisteredKeyword} from './messageHandler';

enum AdminKeyword {
  USERS = 'users',
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate',
  CHANGE_ROLE = 'change_role',
  HELP = 'help',
}

export class AdminMessageHandler extends BaseMessageHandler {
  private _userRepo: UserRepository;

  constructor() {
    super();
    this._userRepo = new UserRepository();
  }
  private static _keywords: KeywordDetails[] = [
    {key: AdminKeyword.USERS, description: 'Show all users', arguments: []},
    {
      key: AdminKeyword.ACTIVATE,
      description: 'Activate a user',
      arguments: ['phoneNumber'],
    },
    {
      key: AdminKeyword.DEACTIVATE,
      description: 'Deactivate a user',
      arguments: ['phoneNumber'],
    },
    {
      key: AdminKeyword.CHANGE_ROLE,
      description: 'Change the user role',
      arguments: ['phoneNumber', `role(${Object.keys(UserRole).join(',')})`],
    },
    {
      key: AdminKeyword.HELP,
      description: 'Show commands',
      arguments: [],
    },
  ];

  get keywords(): KeywordDetails[] {
    return AdminMessageHandler._keywords;
  }

  async onMessage(
    message: Message,
    parsedKeyword: RegisteredKeyword | undefined
  ): Promise<void> {
    if (!parsedKeyword) {
      return;
    }

    switch (parsedKeyword.key) {
      case AdminKeyword.USERS:
        await this.onUsers(parsedKeyword, message);
        break;
      case AdminKeyword.ACTIVATE:
        await this.onActivate(parsedKeyword, message);
        break;
      case AdminKeyword.DEACTIVATE:
        await this.onDeactivate(parsedKeyword, message);
        break;
      case AdminKeyword.CHANGE_ROLE:
        await this.onChangeRole(parsedKeyword, message);
        break;
      case AdminKeyword.HELP:
      default:
        await message.reply(this.helpText);
        break;
    }
  }

  private async onUsers(parsedKeyword: RegisteredKeyword, message: Message) {
    const users = await this._userRepo.getAll();
    const sb: string[] = [];
    const separator = '================================\n';

    sb.push(separator);
    sb.push('Users\n');
    sb.push(separator);
    sb.push('|id|name|role|status|');
    for (const user of users) {
      sb.push('|');
      sb.push(`${user.id}|`);
      sb.push(`${user.name}|`);
      sb.push(`${user.role}|`);
      sb.push(`${user.status}|`);
      sb.push('\n');
    }
    sb.push(separator);
    sb.push(`Total: ${users.length}`);
    sb.push(separator);

    await message.reply(sb.join(''));
  }

  private async onActivate(parsedKeyword: RegisteredKeyword, message: Message) {
    const id: string = parsedKeyword.parsed.arguments.at(0)!;
    const result = await this._userRepo.activate(id);
    if (result) {
      await message.reply(`User ${id} has been activated`);
      return;
    }
    await message.reply(`User ${id} not found`);
  }

  private async onDeactivate(
    parsedKeyword: RegisteredKeyword,
    message: Message
  ) {
    const id: string = parsedKeyword.parsed.arguments.at(0)!;
    const result = await this._userRepo.deactivate(id);
    if (result) {
      await message.reply(`User ${id} has been deactivated`);
      return;
    }
    await message.reply(`User ${id} not found`);
  }

  private async onChangeRole(
    parsedKeyword: RegisteredKeyword,
    message: Message
  ) {
    const id: string = parsedKeyword.parsed.arguments.at(0)!;
    const role: string = parsedKeyword.parsed.arguments.at(1)!;
    const result = await this._userRepo.changeRole(id, role as UserRole);
    if (result) {
      await message.reply(`User ${id} has been deactivated`);
      return;
    }
    await message.reply(`User ${id} not found`);
  }
}
