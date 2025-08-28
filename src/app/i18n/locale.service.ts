import { Injectable, signal } from '@angular/core';
import { MESSAGES_EN } from './messages.en';
import { MESSAGES_DE } from './messages.de';
import { MsgKey } from './message-keys';

type Lang = 'en' | 'de';

/**
 * Service that manages the application's language (locale), provides translations for message keys,
 * and saves the user's language preference to localStorage.
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private _lang = signal<Lang>(localStorage.getItem('lang') as Lang || 'en');
  readonly lang = this._lang.asReadonly();

  private dicts: Record<Lang, Record<MsgKey, string>> = {
    en: MESSAGES_EN,
    de: MESSAGES_DE,
  };

  /**
   * Changes the current language and saves the preference to localStorage.
   */
  setLang(l: Lang) {
    this._lang.set(l);
    localStorage.setItem('lang', l);
  }

  /**
   * Looks up a translation by key and optionally replaces parameters inside the string.
   */
  translate(key: MsgKey, params?: Record<string, string | number>): string {
    const raw = this.dicts[this._lang()][key] ?? key;
    if (!params) return raw;
    return Object.keys(params).reduce(
      (s, p) => s.replace(new RegExp(`{${p}}`, 'g'), String(params[p])),
      raw
    );
  }
}