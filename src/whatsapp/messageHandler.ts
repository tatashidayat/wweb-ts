import {Message} from 'whatsapp-web.js';
import {KeywordUtil} from '../common/util/keyword.util';
import {KeywordDetails, ParsedKeyword} from '../types/MessageKeyword';

export interface RegisteredKeyword {
  key: string;
  details: KeywordDetails;
  parsed: ParsedKeyword;
}

export interface MessageHandler {
  get keywords(): KeywordDetails[];

  onMessage(
    message: Message,
    parsedKeyword: RegisteredKeyword | undefined
  ): Promise<void>;
}

export abstract class BaseMessageHandler implements MessageHandler {
  get keywords(): KeywordDetails[] {
    throw new Error('Method not implemented.');
  }
  onMessage(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _message: Message,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _parsedKeyword: RegisteredKeyword | undefined
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  get helpText(): string {
    return KeywordUtil.helpText(this.keywords);
  }
}
