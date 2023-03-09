import {KeywordDetails} from '../../types/MessageKeyword';

export abstract class KeywordUtil {
  static helpText(keywords: KeywordDetails[]): string {
    const sb: string[] = [];
    const separator = '===================================\n';
    sb.push('Command List\n');
    sb.push(separator);
    const mostLengthKey = keywords.reduce((p, c) => {
      if (p && p.key.length < c.key.length) {
        return c;
      }
      return p;
    }).key.length;
    keywords.forEach(cmd => {
      sb.push(`${cmd.key.padStart(mostLengthKey, ' ')}: ${cmd.description}.\n`);
      let usageText = `${''.padStart(mostLengthKey, ' ')}Usage: ${cmd.key}`;
      if (cmd.arguments.length > 0) {
        usageText += '#';
        usageText += cmd.arguments.join('#');
      }
      sb.push(`${usageText}\n`);
    });
    return sb.join('');
  }
}
