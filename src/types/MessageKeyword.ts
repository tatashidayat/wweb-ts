export interface Keyword {
  key: string;
}

export interface KeywordDetails extends Keyword {
  description: string;
  arguments: string[];
}

export interface ParsedKeyword {
  key: string;
  arguments: string[];
}
