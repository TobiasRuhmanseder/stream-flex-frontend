import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LanguageDropdownComponent } from '../features/language-dropdown/language-dropdown.component';
import { TranslatePipe } from '../i18n/translate.pipe';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LanguageDropdownComponent, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
/**
 * HeaderComponent represents the app header with conditional visibility.
 * It determines whether the header should be hidden based on the current route.
 */
export class HeaderComponent {

  constructor(private router: Router) { }

  /**
   * Checks if the current route is one of the hidden routes where the "LanguageDropdownComp" should not be displayed.
   * @returns {boolean} True if the current route starts with any of the hidden paths, false otherwise.
   */
  isHiddenRoute(): boolean {
    const hiddenRoutes = ['/home/sign-in', '/impressum', '/privacy'];
    return hiddenRoutes.some(path => this.router.url.startsWith(path));
  }
}
