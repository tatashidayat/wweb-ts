import {Message} from 'whatsapp-web.js';

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
