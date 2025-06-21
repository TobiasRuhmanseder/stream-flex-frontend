import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalNotificationComponent } from './signal-notification/signal-notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignalNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'stream-flex-frontend';
}
