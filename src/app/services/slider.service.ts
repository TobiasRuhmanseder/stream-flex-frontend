import { computed, Injectable, OnDestroy, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SliderService implements OnDestroy {
  private width = signal<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  readonly itemsPerScreen = computed(() => {
    const w = this.width();
    console.log('test log');
    
    if (w <= 500) return 2;
    if (w <= 800) return 3;
    if (w <= 1100) return 4;
    if (w <= 1400) return 5;
    return 6;
  });

  private onResize = () => this.schedule();
  private raf = 0;

  constructor() {
    if (typeof window === 'undefined') return;
    window.addEventListener('resize', this.onResize, { passive: true });
    this.width.set(window.innerWidth);
  }

  private schedule() {
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => this.width.set(window.innerWidth));
  }

  ngOnDestroy() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('resize', this.onResize);
    cancelAnimationFrame(this.raf);
  }
}
