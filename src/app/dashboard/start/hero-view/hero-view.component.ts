import { Component, input, signal, ElementRef, ViewChild, EventEmitter, Output, effect, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hero-view',
  imports: [],
  templateUrl: './hero-view.component.html',
  styleUrl: './hero-view.component.scss'
})
export class HeroViewComponent implements AfterViewInit, OnDestroy {
  imageUrl = input<string | null>(null);
  videoUrl = input<string | null>(null);
  logoUrl = input<string | null>(null);
  title = input<string>('');
  showImage = signal(false);

  private gestureBound = false;
  private visHandler = () => this.tryPlay();

  @Output() play = new EventEmitter<void>();
  @Output() ended = new EventEmitter<void>();
  @Output() canPlayReady = new EventEmitter<void>();
  @ViewChild('teaser') teaser?: ElementRef<HTMLVideoElement>;


  constructor() {
    effect(() => this.applySourceIfReady());
  }

  ngAfterViewInit(): void {
    this.applySourceIfReady();
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.visHandler);
  }

  private applySourceIfReady() {
    const url = this.videoUrl();
    const teaser = this.teaser?.nativeElement;
    if (!url || !teaser) return;
    document.addEventListener('visibilitychange', this.visHandler, { once: true });
    this.userGesture();
  }

  private tryPlay() {
    const teaser = this.teaser?.nativeElement;
    if (!teaser) return;
    teaser.muted = true;
    teaser.autoplay = true;
    teaser.play().catch(() => { /* still ignore */ });
  }

  onCanPlay() {
    this.canPlayReady.emit();
    this.tryPlay();
  }

  userGesture() {
    if (!this.gestureBound) {
      this.gestureBound = true;
      const kick = () => {
        this.tryPlay();
        window.removeEventListener('pointerdown', kick, true);
      };
      window.addEventListener('pointerdown', kick, true);
    }
  }

  onVideoError(ev: Event) {
    this.handleVideoError(ev);
  }

  private handleVideoError(ev: Event) {
    const teaser = this.teaser?.nativeElement;
    this.showImage.set(true);
    if (teaser) {
      teaser.removeAttribute('src');
      teaser.load();
    }
  }
}
