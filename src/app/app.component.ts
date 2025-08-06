import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalNotificationComponent } from './features/signal-notification/signal-notification.component';
import { LoadingOverlayComponent } from './features/loading-overlay/loading-overlay.component';
import { LoadingOverlayService } from './services/loading-overlay.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignalNotificationComponent, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'stream-flex-frontend';

  public loadingOverlayService = inject(LoadingOverlayService);
}
