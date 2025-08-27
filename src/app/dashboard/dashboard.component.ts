import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { RouterModule, RouterOutlet } from "@angular/router";
import { animate, group, query, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-dashboard',
  imports: [HeaderMenuComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('routeTransition', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({ position: 'absolute', inset: 0, width: '100%' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('300ms ease', style({ opacity: 0 }))
          ], { optional: true }),

          query(':enter', [
            style({ opacity: 0 }),
            animate('300ms ease', style({ opacity: 1 }))
          ], { optional: true }),
        ]),
      ]),
    ]),
  ],
})

export class DashboardComponent {

  getState(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'] ?? 'start';
  }
}
