import { Component, input, signal, ElementRef, ViewChild, EventEmitter, Output, effect } from '@angular/core';

@Component({
  selector: 'app-hero-view',
  imports: [],
  templateUrl: './hero-view.component.html',
  styleUrl: './hero-view.component.scss'
})
export class HeroViewComponent {
  imageUrl = input<string | null>(null);
  videoUrl = input<string | null>(null);
  title = input<string>('');

  @Output() play = new EventEmitter<void>();
  @Output() ended = new EventEmitter<void>();
  @Output() canPlayReady = new EventEmitter<void>();

  @ViewChild('teaser') teaser!: ElementRef<HTMLVideoElement>;

  showImage = signal(true);
  fading = signal(false);

  constructor() {
    effect(() => {

      const url = this.videoUrl();
      if (!url || !this.teaser) return;
      queueMicrotask(() => {
        const teaser = this.teaser?.nativeElement;
        if (!teaser) return;
        teaser.muted = true;


        (teaser as any).playsInline = true;
        teaser.autoplay = true;
        this.showImage.set(true);
        teaser.src = url;
        teaser.load();
        teaser.play().catch(() => { });
      });
    });
  }

  onCanPlay() {
    this.showImage.set(false);
    this.canPlayReady.emit();
  }
}


