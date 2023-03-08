interface Keyword {
  key: string;
}

interface KeywordDetails extends Keyword {
  description: string;
  arguments: string[];
}

interface ParsedKeyword {
  key: string;
  arguments: string[];
}
