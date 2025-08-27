import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LanguageDropdownComponent } from '../features/language-dropdown/language-dropdown.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LanguageDropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private router: Router) { }

  isHiddenRoute(): boolean {
    const hiddenRoutes = ['/home/sign-in', '/impressum', '/privacy'];
    return hiddenRoutes.some(path => this.router.url.startsWith(path));
  }
}
