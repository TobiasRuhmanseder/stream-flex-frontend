import { Pipe, PipeTransform } from '@angular/core';
import { LocaleService } from './locale.service';
import { MsgKey } from './message-keys';
import { LITERALS_DE } from './literals.de';

//minimizes problems with double spaces and line breaks...
function normalize(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  constructor(private localeService: LocaleService) { }
  transform(literalEn: string): string {
    // Signal lesen -> macht die Pipe reaktiv bei Sprachwechsel
    const lang = this.localeService.lang();

    if (lang === 'de') {
      const key = normalize(literalEn);
      const match = LITERALS_DE[literalEn] ?? LITERALS_DE[key];
      if (match) return match;
    }

    // Fallback: originaler EN-Text
    return literalEn;
  }
}

