import { Component, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationSignalsService } from 'src/app/services/notification-signals.service';
import { LanguageDropdownComponent } from 'src/app/features/language-dropdown/language-dropdown.component';


@Component({
  selector: 'app-header-menu',
  imports: [CommonModule, RouterModule, FormsModule, LanguageDropdownComponent, LanguageDropdownComponent],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.scss'
})
export class HeaderMenuComponent {
  searchOpen = signal<boolean>(false);
  search = signal<string>('');
  menuOpen = signal<boolean>(false);


  toggleSearch() {
    this.searchOpen.update(v => !v);
    if (this.searchOpen()) {
      queueMicrotask(() => document.getElementById('header-search')?.focus());
    }
  }

  onSearchIconClick(_: MouseEvent) {
    if (!this.searchOpen()) {
      this.toggleSearch();
      return;
    }
    const q = this.search().trim();
    if (!q) {
      this.searchOpen.set(false);
    } else {
      this.submitSearch();
    }
  }

  submitSearch() {
  }

  onSearchBlur(): void {
    if (!this.search().trim()) {
      this.searchOpen.set(false);
    }
  }

  clearSearch(input: HTMLInputElement): void {
    this.search.set('');
    input.focus();
  }

  closeMenus(){

  }

  signOut(){

  }
}

