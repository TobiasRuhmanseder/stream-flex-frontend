import { Component, computed, effect, inject, } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-signal-notification',
  imports: [CommonModule],
  templateUrl: './signal-notification.component.html',
  styleUrl: './signal-notification.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(-50%, 20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translate(-50%, 0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translate(-50%, 20px)' })),
      ]),
    ]),
  ],
})
export class SignalNotificationComponent {

  notificationService = inject(NotificationSignalsService);
  globalNotification = this.notificationService.globalNotification;

  constructor() {
    effect(() => {
      if (this.globalNotification()) {
        setTimeout(() => this.notificationService.clear(), 4000)
      }
    })
  }
}
