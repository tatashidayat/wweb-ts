interface MessageKeyword {
  key: string;
}

interface MessageKeywordWithArguments extends MessageKeyword {
  arguments: Array<string>;
}
