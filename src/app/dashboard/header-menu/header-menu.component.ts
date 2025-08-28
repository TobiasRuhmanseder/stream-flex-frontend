import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageDropdownComponent } from 'src/app/features/language-dropdown/language-dropdown.component';
import { UserMenuDropdownComponent } from "src/app/features/user-menu-dropdown/user-menu-dropdown.component";
import { SearchComponent } from "src/app/features/search/search.component";
import { TranslatePipe } from 'src/app/i18n/translate.pipe';


@Component({
  selector: 'app-header-menu',
  imports: [RouterModule, CommonModule, LanguageDropdownComponent, UserMenuDropdownComponent, SearchComponent, TranslatePipe],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss'
})
/**
 * HeaderMenuComponent controls the header menu of the application.
 * It provides features like language switch, user menu, and search.
 * The component also handles scroll behavior to update the header's styling
 * when the user scrolls the page.
 */
export class HeaderMenuComponent {
  headerSolid = signal(false);

  /**
   * Listens to window scroll events.
   * If the scroll position is more than 12px, headerSolid is set to true.
   */
  @HostListener('window:scroll', [])
  onScroll(): void {
    const y = window.scrollY || document.documentElement.scrollTop;
    this.headerSolid.set(y > 12);
  }
}

