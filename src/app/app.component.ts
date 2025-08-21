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
        // beide Views übereinander legen
        query(':enter, :leave', [
          style({ position: 'absolute', inset: 0, width: '100%' })
        ], { optional: true }),

        group([
          // alte Seite leicht nach unten + ausfaden
          query(':leave', [
            animate('1000ms ease', style({ opacity: 0 }))
          ], { optional: true }),

          // neue Seite leicht von oben + einfaden (mit kurzer Verzögerung)
          query(':enter', [
            style({ opacity: 0 }),
            animate('1000ms ease', style({ opacity: 1 }))
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
