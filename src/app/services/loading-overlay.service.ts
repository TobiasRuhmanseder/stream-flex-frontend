import { Injectable, signal, computed } from '@angular/core';

/**
 * Service to show and hide a loading overlay.
 * This helps to display a loading indicator when something is loading in the app.
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingOverlayService {
  private count = signal(0);
  public isLoading = computed(() => this.count() > 0);

  /**
   * Show the loading overlay.
   * Increases the count, so the overlay stays visible if called multiple times.
   */
  show() {
    this.count.update(c => c + 1);
  }

  /**
   * Hide the loading overlay.
   * Decreases the count, and hides the overlay if the count reaches zero.
   */
  hide() {
    this.count.update(c => Math.max(0, c - 1));
  }
}
