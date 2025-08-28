import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService } from './locale.service';
import { MsgKey } from './message-keys';
import { LITERALS_DE } from './literals.de';

//minimizes problems with double spaces and line breaks...
function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

@Pipe({
  name: 'translate',
  pure: false
})
/**
 * A pipe that translates English literals to the current locale's language.
 */
export class TranslatePipe implements PipeTransform {


  constructor(private localeService: LocaleService) { }
  
  /**
   * Transforms an English literal to the corresponding translation based on the current language.
   * @param literalEn The English literal string to translate.
   * @returns The translated string if available; otherwise, the original English literal.
   */
  transform(literalEn: string): string {

    const lang = this.localeService.lang();

    if (lang === 'de') {
      const key = normalize(literalEn);
      const match = LITERALS_DE[literalEn] ?? LITERALS_DE[key];
      if (match) return match;
    }
    return literalEn;
  }
}
