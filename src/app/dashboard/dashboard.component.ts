import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HeaderMenuComponent } from './header-menu/header-menu.component';


@Component({
  selector: 'app-dashboard',
  imports: [HeaderMenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(private authService: AuthService) { }

  logout() {
    this.authService.signOut();

  }
}
