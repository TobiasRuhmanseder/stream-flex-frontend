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

/**
 * Root component of the application providing global services and handling route transition animations.
 */
export class AppComponent {
  title = 'stream-flex-frontend';
  public loadingOverlayService = inject(LoadingOverlayService);

  /**
   * Retrieves the current route's animation state to be used for route transition animations.
   * @param outlet The router outlet containing the activated route.
   * @returns The animation state string of the current route or 'default' if none is set.
   */
  getState(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] ?? 'default';
  }
}
