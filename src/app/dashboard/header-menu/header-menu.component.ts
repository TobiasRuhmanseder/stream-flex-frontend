import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageDropdownComponent } from 'src/app/features/language-dropdown/language-dropdown.component';
import { UserMenuDropdownComponent } from "src/app/features/user-menu-dropdown/user-menu-dropdown.component";
import { SearchComponent } from "src/app/features/search/search.component";


@Component({
  selector: 'app-header-menu',
  imports: [RouterModule, CommonModule, LanguageDropdownComponent, UserMenuDropdownComponent, SearchComponent],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss'
})
export class HeaderMenuComponent {
  headerSolid = signal(false);


  @HostListener('window:scroll', [])
  onScroll(): void {
    const y = window.scrollY || document.documentElement.scrollTop;
    this.headerSolid.set(y > 12);
  }




}

