import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingOverlayService {
  private count = signal(0);
  public isLoading = computed(() => this.count() > 0);

  show() {
    this.count.update(c => c + 1);
  }

  hide() {
    this.count.update(c => Math.max(0, c - 1));
  }
}
