import { Injectable, signal } from '@angular/core';
import { GlobalNotification } from '../models/global-notification.interface';
import { MsgKey } from '../i18n/message-keys';
import { LocaleService } from '../i18n/locale.service';

@Injectable({
  providedIn: 'root'
})


/**
 * A service to manage global notifications using signals.
 * You can show, clear, or show a notification by message key.
 */
export class NotificationSignalsService {
  globalNotification = signal<GlobalNotification | null>(null);

  constructor(private localeService: LocaleService) { }


  /**
   * Show a global notification with the given details.
   * @param globalNotification The notification to display.
   */
  show(globalNotification: GlobalNotification) {
    this.globalNotification.set(globalNotification);
  }

  /**
   * Clear any currently shown global notification.
   */
  clear() {
    this.globalNotification.set(null);
  }

  /**
   * Show a notification using a message key, type, and optional parameters.
   * This will translate the key to a message and display it.
   * @param key The message key to translate.
   * @param type The type of notification (default is 'error').
   * @param params Optional parameters for translation.
   */
  showKey(key: MsgKey, type: GlobalNotification['type'] = 'error', params?: Record<string, string | number>) {
    const message = this.localeService.translate(key, params);
    this.show({ message, type });
  }

}
