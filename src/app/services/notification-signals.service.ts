import { Injectable, signal } from '@angular/core';
import { GlobalNotification } from '../models/global-notification.interface';
import { MsgKey } from '../i18n/message-keys';
import { LocaleService } from '../i18n/locale.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationSignalsService {
  globalNotification = signal<GlobalNotification | null>(null);

  constructor(private localeService: LocaleService) { }


  show(globalNotification: GlobalNotification) {
    this.globalNotification.set(globalNotification);
  }

  clear() {
    this.globalNotification.set(null);
  }

  showKey(key: MsgKey, type: GlobalNotification['type'] = 'error', params?: Record<string, string | number>) {
    const message = this.localeService.translate(key, params);
    this.show({ message, type });
  }

}
