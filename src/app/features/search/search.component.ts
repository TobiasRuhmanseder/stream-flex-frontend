import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
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

  signOut() {

  }
}
