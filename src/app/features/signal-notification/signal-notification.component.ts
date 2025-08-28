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

/**
 * This component shows global notifications with fade animations
 * and automatically hides them after a short time.
 */
export class SignalNotificationComponent {
  globalNotification = this.notificationService.globalNotification;

  /**
   * Sets up an effect to automatically clear the notification after 4 seconds.
   */
  constructor(private notificationService: NotificationSignalsService) {
    effect(() => {
      if (this.globalNotification()) {
        setTimeout(() => this.notificationService.clear(), 4000)
      }
    })
  }
}
