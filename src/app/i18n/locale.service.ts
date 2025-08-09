import { Injectable, signal } from '@angular/core';
import { MESSAGES_EN } from './messages.en';
import { MESSAGES_DE } from './messages.de';
import { MsgKey } from './message-keys';

type Lang = 'en' | 'de';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private _lang = signal<Lang>('en');           // runtime switch möglich
  readonly lang = this._lang.asReadonly();

  // hier später: MESSAGES_DE hinzufügen
  private dicts: Record<Lang, Record<MsgKey, string>> = {
    en: MESSAGES_EN,
    de: MESSAGES_DE,
  };

  setLang(l: Lang) { this._lang.set(l); }

  t(key: MsgKey, params?: Record<string, string | number>): string {
    const raw = this.dicts[this._lang()][key] ?? key;
    if (!params) return raw;
    return Object.keys(params).reduce(
      (s, p) => s.replace(new RegExp(`{${p}}`, 'g'), String(params[p])),
      raw
    );
  }
}