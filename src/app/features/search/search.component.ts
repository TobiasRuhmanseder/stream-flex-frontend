import { Component, signal } from '@angular/core';
import { Route, Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  searchOpen = signal<boolean>(false);
  cleanIcon = signal<boolean>(false);

  constructor(private router: Router, readonly searchService: SearchService) { }

  toggleSearch() {
    this.searchOpen.update(v => !v);
    if (this.searchOpen()) {
      queueMicrotask(() => document.getElementById('header-search')?.focus());
    } else {
      this.cleanIcon.set(false);
      this.router.navigate(['dashboard/start']);
    }
  }

  onSearchIconClick() {
    if (!this.searchOpen()) {
      this.toggleSearch();
    }
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.router.navigate(['dashboard/search-view'], { queryParams: { q: value } });
    this.cleanIcon.set(true);
    if ((value ?? '').trim()) {
      this.searchService.setQuery(value);
    }
  }

  onClear(inputEl: HTMLInputElement) {
    this.searchService.setQuery('');
    if (inputEl) inputEl.value = '';
    this.toggleSearch();
  }
}
