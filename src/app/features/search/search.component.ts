import { Component, signal } from '@angular/core';
import { Route, Router } from '@angular/router';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  imports: [TranslatePipe],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
/**
 * This component handles the search functionality in the app.
 * It manages opening and closing the search input, updating the search query,
 * and navigation related to search.
 */
export class SearchComponent {
  searchOpen = signal<boolean>(false);
  cleanIcon = signal<boolean>(false);

  constructor(private router: Router, readonly searchService: SearchService) { }

  /**
   * Toggles the search input visibility.
   * If search is opened, it focuses the input field.
   * If search is closed, it clears the clean icon and navigates to the start dashboard.
   */
  toggleSearch() {
    this.searchOpen.update(v => !v);
    if (this.searchOpen()) {
      queueMicrotask(() => document.getElementById('header-search')?.focus());
    } else {
      this.cleanIcon.set(false);
      this.router.navigate(['dashboard/start']);
    }
  }

  /**
   * Handles the click event on the search icon.
   * Opens the search input if it is not already open.
   */
  onSearchIconClick() {
    if (!this.searchOpen()) {
      this.toggleSearch();
    }
  }

  /**
   * Handles input events on the search field.
   * Updates the URL with the current query and sets the query in the search service.
   * Also shows the clear icon.
   * 
   * @param event The input event from the search field.
   */
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.router.navigate(['dashboard/search-view'], { queryParams: { q: value } });
    this.cleanIcon.set(true);
    if ((value ?? '').trim()) {
      this.searchService.setQuery(value);
    }
  }

  /**
   * Clears the search input and resets the search query.
   * Then closes the search input.
   * 
   * @param inputEl The HTML input element to clear.
   */
  onClear(inputEl: HTMLInputElement) {
    this.searchService.setQuery('');
    if (inputEl) inputEl.value = '';
    this.toggleSearch();
  }
}
