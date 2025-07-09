import { computed, Injectable, signal } from '@angular/core';
import { GlobalNotification } from '../models/global-notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationSignalsService {
  globalNotification = signal<GlobalNotification | null>(null);

  show(globalNotification: GlobalNotification) {
    this.globalNotification.set(globalNotification);
  }

  clear() {
    this.globalNotification.set(null);
  }
}
