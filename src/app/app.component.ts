import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalNotificationComponent } from './features/signal-notification/signal-notification.component';
import { LoadingOverlayComponent } from './features/loading-overlay/loading-overlay.component';
import { LoadingOverlayService } from './services/loading-overlay.service';
import { trigger, transition, style, animate, group, query } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignalNotificationComponent, LoadingOverlayComponent, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('routeTransition', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({ position: 'absolute', inset: 0, width: '100%' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('2000ms ease', style({ opacity: 0 }))
          ], { optional: true }),
          query(':enter', [
            style({ opacity: 0 }),
            animate('2000ms ease', style({ opacity: 1 }))
          ], { optional: true }),
        ]),
      ]),
    ]),
  ],
})

export class AppComponent {
  title = 'stream-flex-frontend';
  public loadingOverlayService = inject(LoadingOverlayService);

  getState(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] ?? 'default';
  }
}
