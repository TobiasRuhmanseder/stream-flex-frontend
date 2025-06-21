import { Component, computed, effect, inject, } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationSignalsService } from '../services/notification-signals.service';

@Component({
  selector: 'app-signal-notification',
  imports: [],
  templateUrl: './signal-notification.component.html',
  styleUrl: './signal-notification.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [                
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [                  
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' })),
      ]),
    ]),
  ],
})
export class SignalNotificationComponent {

  notificationService = inject(NotificationSignalsService);
  message = this.notificationService.message;
  isError = this.notificationService.isError;

  show = computed(() => !!this.message())

  constructor() {
    effect(() => {
      if (this.show()) {
        setTimeout(() => this.notificationService.clear(), 2000)
      }
    })
  }

}
